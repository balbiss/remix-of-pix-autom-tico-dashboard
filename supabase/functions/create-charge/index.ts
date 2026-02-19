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

        const authHeader = req.headers.get('Authorization')
        const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader?.replace('Bearer ', ''))

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        const { amount, planId } = await req.json()

        // 1. Get Auth Token
        const token = await getAuthToken()

        // 2. Generate Pix Charge (CashIn) via SyncPay
        // Path assumed based on standard partner API patterns
        const pixResp = await fetch(`${SYNC_PAY_BASE_URL}/api/partner/v1/pix/cash-in`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount,
                external_id: user.id, // This is what the webhook will receive
                description: `Pagamento ${planId.toUpperCase()} - Pix Automático`,
            }),
        })

        const pixData = await pixResp.json()

        if (!pixResp.ok) {
            console.error('SyncPay Error:', pixData)
            throw new Error(pixData.message || 'Erro ao gerar cobrança Pix')
        }

        // Return the PIX code (brcode) and any other needed info
        return new Response(JSON.stringify(pixData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        console.error('Create Charge Error:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
