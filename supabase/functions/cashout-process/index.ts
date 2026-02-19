import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYNC_PAY_CLIENT_ID = "8df2cd3a-b605-43ff-8a17-6ca4713f1ea4"
const SYNC_PAY_CLIENT_SECRET = "0e666810-df10-44e9-b675-e5f971eb079c"
const SYNC_PAY_BASE_URL = "https://api.syncpayments.com.br"

async function getAuthToken() {
    const resp = await fetch(`${SYNC_PAY_BASE_URL}/api/partner/v1/auth-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: SYNC_PAY_CLIENT_ID,
            client_secret: SYNC_PAY_CLIENT_SECRET,
        }),
    })
    const data = await resp.json()
    return data.access_token
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

        // User calling this must be authenticated
        const authHeader = req.headers.get('Authorization')
        const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader?.replace('Bearer ', ''))

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        const { amount, pixKey, pixKeyType } = await req.json()

        // 1. Validation
        if (amount < 50) {
            return new Response(JSON.stringify({ error: 'Mínimo de R$ 50,00 para saque.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // 2. Refresh User Balance
        const { data: usuario, error: userError } = await supabase
            .from('usuarios')
            .select('saldo')
            .eq('id', user.id)
            .single()

        if (userError || !usuario) throw new Error('Usuário não encontrado')

        const FEE = 4.90
        const totalToDeduct = amount + FEE

        if (usuario.saldo < totalToDeduct) {
            return new Response(JSON.stringify({ error: 'Saldo insuficiente (considerando taxa de R$ 4,90).' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // 3. SyncPay CashOut
        const token = await getAuthToken()

        // Adjust payload based on SyncPay documentation found
        const cashOutResp = await fetch(`${SYNC_PAY_BASE_URL}/api/partner/v1/cash-out`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount,
                key: pixKey,
                key_type: pixKeyType, // e.g., 'CPF', 'EMAIL', 'PHONE', 'RANDOM'
                description: 'Saque Pix Automático',
                external_id: `${user.id}-${Date.now()}` // Unique ID for idempotency
            }),
        })

        const cashOutResult = await cashOutResp.json()

        if (!cashOutResp.ok) {
            console.error('SyncPay Error:', cashOutResult)
            throw new Error(cashOutResult.message || 'Erro ao processar saque na SyncPay')
        }

        // 4. Deduct Balance
        const { error: deductError } = await supabase.rpc('increment_balance', {
            user_id: user.id,
            amount_to_add: -totalToDeduct
        })

        if (deductError) throw deductError

        return new Response(JSON.stringify({ message: 'Saque processado com sucesso', data: cashOutResult }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        console.error('CashOut Error:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
