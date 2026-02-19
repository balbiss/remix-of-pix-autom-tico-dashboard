import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.json()
    console.log('Webhook payload received:', payload)

    // SyncPay payload structure check (Adjust based on actual SyncPay webhook)
    // Common fields: status, amount, external_id (or correlation_id)
    const { status, amount, external_id } = payload

    if (status !== 'PAID') {
      return new Response(JSON.stringify({ message: 'Ignore non-paid status' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Identify user
    const userId = external_id

    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('id, padrinho_id, avo_id')
      .eq('id', userId)
      .single()

    if (userError || !usuario) {
      console.error('User not found:', userError)
      return new Response(JSON.stringify({ error: 'User not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    let plano = 'nenhum'
    let comissaoPadrinho = 0
    let comissaoAvo = 0

    // Logic based on payment amount
    if (amount === 19.90) {
      plano = 'standard'
      comissaoPadrinho = 6.00
      comissaoAvo = 3.00
    } else if (amount === 29.90) {
      plano = 'premium'
      comissaoPadrinho = 10.00
      comissaoAvo = 4.00
    }

    // 1. Update User Plan
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({
        plano_ativo: plano,
        is_active: true
      })
      .eq('id', userId)

    if (updateError) throw updateError

    // 2. Add Balance to Parent (Level 1)
    if (usuario.padrinho_id) {
       await supabase.rpc('increment_balance', { 
         user_id: usuario.padrinho_id, 
         amount_to_add: comissaoPadrinho 
       })
    }

    // 3. Add Balance to Grandparent (Level 2)
    if (usuario.avo_id) {
       await supabase.rpc('increment_balance', { 
         user_id: usuario.avo_id, 
         amount_to_add: comissaoAvo 
       })
    }

    return new Response(JSON.stringify({ message: 'Payment processed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error processing webhook:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
