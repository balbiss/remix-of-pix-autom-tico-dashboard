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
    const userId = external_id

    if (status !== 'PAID') {
      return new Response(JSON.stringify({ message: 'Ignore non-paid status' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const payAmount = Number(amount)

    // 1. Logic based on payment amount as defined by Architect
    let plano = 'nenhum'
    let comissaoPadrinho = 0
    let comissaoAvo = 0

    if (payAmount === 19.90) {
      plano = 'standard'
      comissaoPadrinho = 6.00
      comissaoAvo = 3.00
    } else if (payAmount === 29.90) {
      plano = 'premium'
      comissaoPadrinho = 10.00
      comissaoAvo = 4.00
    }

    if (plano === 'nenhum') {
      return new Response(JSON.stringify({ error: 'Valor não corresponde a nenhum plano.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 2. Update User Plan and Status
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .update({ plano_ativo: plano, is_active: true })
      .eq('id', userId)
      .select('padrinho_id, avo_id')
      .single()

    if (userError || !usuario) {
      console.error('Erro ao atualizar usuário:', userError)
      return new Response(JSON.stringify({ error: 'Usuário não encontrado.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    // 3. Distribute Commissions (Level 1 and Level 2)
    if (usuario.padrinho_id) {
      await supabase.rpc('increment_balance', {
        user_id: usuario.padrinho_id,
        amount_to_add: comissaoPadrinho
      })
    }

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
