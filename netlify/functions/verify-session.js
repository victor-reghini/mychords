/**
 * verify-session.js
 * Verifica o status de pagamento de uma sessão do Stripe Checkout
 * e dispara o envio do e-mail com a apostila caso ainda não tenha sido enviado.
 */

import 'dotenv/config';
import Stripe from 'stripe';
import { sendApostilaEmail } from './email-service.js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    console.warn('[VerifySession] Atenção: STRIPE_SECRET_KEY não definida nas variáveis de ambiente.');
}
const stripe = new Stripe(stripeSecretKey || 'mock_key');

// Cache em memória para evitar reenvios acidentais na mesma instância
const processedSessions = new Set();

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    const sessionId = event.queryStringParameters?.session_id;

    if (!sessionId) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Parâmetro session_id ausente.' })
        };
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const customerEmail = session.customer_details?.email || session.customer_email;
            const customerName = session.customer_details?.name || 'Músico(a)';

            let emailSent = false;
            if (customerEmail && !processedSessions.has(sessionId)) {
                try {
                    await sendApostilaEmail(customerEmail, customerName);
                    processedSessions.add(sessionId);
                    emailSent = true;
                } catch (emailErr) {
                    console.error('[VerifySession] Erro ao enviar e-mail:', emailErr);
                }
            } else if (processedSessions.has(sessionId)) {
                emailSent = true;
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    paid: true,
                    customerEmail,
                    customerName,
                    emailSent,
                    downloadUrl: '/assets/apostila-teoria-musical.pdf'
                })
            };
        } else {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    paid: false,
                    status: session.payment_status
                })
            };
        }
    } catch (error) {
        console.error('[VerifySession] Erro ao consultar sessão:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Erro ao verificar sessão do Stripe',
                message: error.message
            })
        };
    }
};
