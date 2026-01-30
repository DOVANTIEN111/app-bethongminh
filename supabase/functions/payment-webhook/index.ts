// supabase/functions/payment-webhook/index.ts
// Webhook xu ly thanh toan tu Casso
// Casso se goi webhook nay khi co giao dich chuyen khoan moi

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, secure-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Casso webhook format
interface CassoWebhook {
  error: number
  data: CassoTransaction[]
}

interface CassoTransaction {
  id: number
  tid: string // Transaction ID from bank
  description: string // Noi dung chuyen khoan
  amount: number
  cusum_balance: number
  when: string
  bank_sub_acc_id: string
  subAccId: string
  bankName: string
  bankAbbreviation: string
  virtualAccount: string
  virtualAccountName: string
  corresponsiveName: string
  corresponsiveAccount: string
  corresponsiveBankId: string
  corresponsiveBankName: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify webhook secret (optional but recommended)
    const secureToken = req.headers.get('secure-token')
    const expectedToken = Deno.env.get('CASSO_WEBHOOK_SECRET')

    if (expectedToken && secureToken !== expectedToken) {
      console.error('Invalid webhook secret')
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse webhook data
    const webhookData: CassoWebhook = await req.json()
    console.log('Received webhook:', JSON.stringify(webhookData, null, 2))

    if (webhookData.error !== 0) {
      console.error('Webhook error:', webhookData.error)
      return new Response(
        JSON.stringify({ success: false, error: 'Webhook error' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const results = []

    // Process each transaction
    for (const transaction of webhookData.data) {
      // Chi xu ly giao dich co amount > 0 (tien vao)
      if (transaction.amount <= 0) {
        console.log('Skipping outgoing transaction:', transaction.tid)
        continue
      }

      // Tim ma don hang trong noi dung chuyen khoan
      // Format: SCHOOLHUB [ORDER_CODE]
      const description = transaction.description.toUpperCase()
      const match = description.match(/SCHOOLHUB\s*([A-Z0-9]+)/)

      if (!match) {
        console.log('No order code found in:', description)
        results.push({ tid: transaction.tid, status: 'no_order_code' })
        continue
      }

      const orderCode = match[1]
      console.log('Found order code:', orderCode)

      // Tim don hang trong database
      const { data: order, error: orderError } = await supabase
        .from('payment_orders')
        .select('*, plan:plan_id (*)')
        .eq('order_code', orderCode)
        .eq('status', 'pending')
        .single()

      if (orderError || !order) {
        console.log('Order not found or already processed:', orderCode)
        results.push({ tid: transaction.tid, orderCode, status: 'not_found' })
        continue
      }

      // Kiem tra so tien
      if (transaction.amount < order.amount) {
        console.log('Amount mismatch:', transaction.amount, 'vs', order.amount)
        results.push({ tid: transaction.tid, orderCode, status: 'amount_mismatch' })
        continue
      }

      // Cap nhat don hang thanh completed
      const { error: updateError } = await supabase
        .from('payment_orders')
        .update({
          status: 'completed',
          bank_transaction_id: transaction.tid,
          paid_at: new Date().toISOString(),
          metadata: {
            ...order.metadata,
            casso_transaction: {
              tid: transaction.tid,
              amount: transaction.amount,
              when: transaction.when,
              corresponsiveName: transaction.corresponsiveName,
              corresponsiveAccount: transaction.corresponsiveAccount,
              bankName: transaction.bankName
            }
          }
        })
        .eq('id', order.id)

      if (updateError) {
        console.error('Error updating order:', updateError)
        results.push({ tid: transaction.tid, orderCode, status: 'update_error', error: updateError.message })
        continue
      }

      // Tinh ngay het han (yearly = 365, monthly = 30)
      const planSlug = order.metadata?.plan_slug || ''
      const isYearly = planSlug.includes('yearly')
      const durationDays = order.plan?.duration_days || (isYearly ? 365 : 30)
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + durationDays)

      // Cap nhat profile user
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'premium',
          subscription_end_date: endDate.toISOString()
        })
        .eq('id', order.user_id)

      if (profileError) {
        console.error('Error updating profile:', profileError)
        // Khong fail ca transaction, chi log error
      }

      // Luu lich su thanh toan
      const planName = order.plan?.name || order.metadata?.plan_name || 'Premium'
      await supabase
        .from('payment_history')
        .insert({
          user_id: order.user_id,
          order_id: order.id,
          amount: transaction.amount,
          type: 'payment',
          description: `Thanh toan goi ${planName} qua chuyen khoan`
        })

      console.log('Payment processed successfully:', orderCode)
      results.push({ tid: transaction.tid, orderCode, status: 'success' })
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
