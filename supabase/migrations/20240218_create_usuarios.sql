-- Create usuarios table as requested
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  padrinho_id UUID REFERENCES public.usuarios(id),
  avo_id UUID REFERENCES public.usuarios(id),
  saldo DECIMAL(12, 2) DEFAULT 0.00,
  plano_ativo TEXT DEFAULT 'nenhum', -- 'standard' or 'premium'
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only read and update their own records
CREATE POLICY "Users can view own record" ON public.usuarios
  FOR SELECT USING (auth.uid() = id);

-- Trigger to automatically create a user record on Auth signup with referral logic
CREATE OR REPLACE FUNCTION public.handle_new_usuario()
RETURNS TRIGGER AS $$
DECLARE
  v_padrinho_id UUID;
  v_avo_id UUID;
BEGIN
  -- Get padrinho_id from metadata (passed during signup)
  v_padrinho_id := (NEW.raw_user_meta_data ->> 'referral_code')::UUID;
  
  -- If padrinho exists, find their padrinho to set as avo (Level 2)
  IF v_padrinho_id IS NOT NULL THEN
    SELECT padrinho_id INTO v_avo_id FROM public.usuarios WHERE id = v_padrinho_id;
  END IF;

  INSERT INTO public.usuarios (id, email, padrinho_id, avo_id)
  VALUES (NEW.id, NEW.email, v_padrinho_id, v_avo_id);
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Fallback if UUID conversion fails or other issues
  INSERT INTO public.usuarios (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger (ensure it's clean)
DROP TRIGGER IF EXISTS on_auth_user_created_usuarios ON auth.users;
CREATE TRIGGER on_auth_user_created_usuarios
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_usuario();

-- Helper function to increment balance atomically
CREATE OR REPLACE FUNCTION public.increment_balance(user_id UUID, amount_to_add DECIMAL)
RETURNS void AS $$
BEGIN
  UPDATE public.usuarios
  SET saldo = saldo + amount_to_add
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
