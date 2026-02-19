import { useState, useEffect } from "react";
import { Copy, Check, ArrowDownToLine, Users, Network, Wallet, TrendingUp, ChevronRight, Sparkles, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import CheckoutModal from "@/components/CheckoutModal";

const Dashboard = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ level1: 0, level2: 0 });
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: number } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch Profile
      const { data: profileData } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) setProfile(profileData);

      // Fetch Counts
      const { count: count1 } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('padrinho_id', user.id);

      const { count: count2 } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('avo_id', user.id);

      setCounts({ level1: count1 || 0, level2: count2 || 0 });
      setLoading(false);
    };

    fetchData();

    // Subscribe to changes
    const channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'usuarios', filter: `id=eq.${user.id}` },
        (payload) => setProfile(payload.new)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const affiliateLink = `pixautomatico.com/?ref=${user?.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    toast({ title: "Link copiado!", description: "Seu link de afiliado foi copiado." });
    setTimeout(() => setCopied(false), 2000);
  };

  const openCheckout = (id: string, name: string, price: number) => {
    setSelectedPlan({ id, name, price });
    setCheckoutOpen(true);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  // If user is not active, show the "Buy Plan" screen
  if (profile && !profile.is_active) {
    return (
      <div className="min-h-screen bg-background p-5 pt-10 pb-28">
        <header className="text-center mb-10">
          <h1 className="text-2xl font-display font-bold text-foreground">Escolha seu plano</h1>
          <p className="text-muted-foreground mt-2">Ative sua conta para começar a lucrar</p>
        </header>

        <div className="max-w-md mx-auto space-y-6">
          {/* Standard */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-elevated p-6 border-2 border-transparent">
            <h3 className="text-xl font-bold mb-2">Standard</h3>
            <p className="text-muted-foreground text-sm mb-4">E-book Básico para iniciantes.</p>
            <div className="text-3xl font-display font-bold mb-6">R$ 19,90</div>
            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> E-book Pix Automático</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Comissões Nível 1 (R$ 6,00)</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Comissões Nível 2 (R$ 3,00)</li>
            </ul>
            <Button onClick={() => openCheckout('standard', 'Standard', 19.90)} className="w-full bg-primary/10 text-primary hover:bg-primary/20 border-0 h-12 rounded-xl font-bold">Adquirir Standard</Button>
          </motion.div>

          {/* Premium */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-elevated p-6 border-2 border-primary/30 relative">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-widest uppercase">Elite</div>
            <h3 className="text-xl font-bold mb-2">Premium</h3>
            <p className="text-muted-foreground text-sm mb-4">E-book + Masterclass de Vendas.</p>
            <div className="text-3xl font-display font-bold mb-6">R$ 29,90</div>
            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Tudo do Standard</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Masterclass em Vídeo</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Comissões Nível 1 (R$ 10,00)</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Comissões Nível 2 (R$ 4,00)</li>
            </ul>
            <Button onClick={() => openCheckout('premium', 'Premium', 29.90)} className="w-full bg-primary text-primary-foreground shadow-glow h-12 rounded-xl font-bold">Adquirir Premium</Button>
          </motion.div>
        </div>

        <CheckoutModal
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          planId={selectedPlan?.id}
          planName={selectedPlan?.name}
          planPrice={selectedPlan?.price}
        />
        <BottomNav />
      </div>
    );
  }

  // Active Dashboard
  return (
    <div className="min-h-screen bg-background pb-28">
      {/* ... keeping the existing rest of the Active Dashboard UI ... */}
      <div className="h-2" />
      <header className="flex items-center justify-between px-5 pt-4 pb-5">
        <div>
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Bem-vindo de volta 👋</p>
          <h1 className="text-xl font-display font-bold text-foreground mt-0.5">Pix Automático <span className="text-[10px] opacity-30">V2.0</span></h1>
        </div>
        <div className="h-11 w-11 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-glow uppercase">
          {user?.email?.[0]}
        </div>
      </header>

      <div className="px-5 space-y-4">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden bg-gradient-primary rounded-3xl p-6 shadow-glow">
          <div className="relative z-10 text-primary-foreground">
            <span className="text-xs font-bold opacity-70 uppercase tracking-widest">Saldo Disponível</span>
            <h2 className="text-[2.5rem] font-display font-bold leading-none mt-2">
              R$ {(profile?.saldo || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
            <Button onClick={() => navigate("/saque")} size="sm" className="mt-6 bg-white/20 hover:bg-white/30 border-0 rounded-xl h-10 px-5">Sacar Agora</Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <div className="card-elevated p-4">
            <Users className="h-4 text-primary mb-2" />
            <p className="text-2xl font-bold">{counts.level1}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Indicações Diretas</p>
            <p className="text-muted-foreground/60 text-[9px] uppercase">Nível 1</p>
          </div>
          <div className="card-elevated p-4">
            <TrendingUp className="h-4 text-primary mb-2" />
            <p className="text-2xl font-bold">{counts.level2}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Indicações da Rede</p>
            <p className="text-muted-foreground/60 text-[9px] uppercase">Nível 2</p>
          </div>
        </div>

        <div className="card-elevated p-5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Seu Link de Afiliado</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-muted rounded-xl px-3 py-2.5 text-xs font-mono truncate border border-border">
              {affiliateLink}
            </div>
            <Button onClick={handleCopy} className="h-auto px-4 rounded-xl bg-primary text-primary-foreground">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
