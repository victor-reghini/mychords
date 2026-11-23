/**
 * stripe-webhook.js
 * Webhook assíncrono para notificações do Stripe (checkout.session.completed).
 */

import 'dotenv/config';
import Stripe from 'stripe';
import { sendApostilaEmail } from './email-service.js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    console.warn('[StripeWebhook] Atenção: STRIPE_SECRET_KEY não definida nas variáveis de ambiente.');
}
const stripe = new Stripe(stripeSecretKey || 'mock_key');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let stripeEvent;
    const sig = event.headers['stripe-signature'];

    if (webhookSecret && sig) {
        try {
            stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
        } catch (err) {
            console.error('[Webhook] Falha na verificação de assinatura:', err.message);
            return { statusCode: 400, body: `Webhook Error: ${err.message}` };
        }
    } else {
        // Fallback quando não há webhook secret configurado em ambiente de teste
        try {
            stripeEvent = JSON.parse(event.body);
        } catch (err) {
            return { statusCode: 400, body: 'Invalid JSON body' };
        }
    }

    if (stripeEvent.type === 'checkout.session.completed') {
        const session = stripeEvent.data.object;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const customerName = session.customer_details?.name || 'Músico(a)';

        if (customerEmail) {
            console.log(`[Webhook] Pagamento concluído para ${customerEmail}. Disparando e-mail...`);
            try {
                await sendApostilaEmail(customerEmail, customerName);
            } catch (err) {
                console.error('[Webhook] Erro no envio de e-mail:', err);
            }
        }
    }

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ received: true })
    };
};
