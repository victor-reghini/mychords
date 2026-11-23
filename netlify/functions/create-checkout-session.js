/**
 * create-checkout-session.js
 * Cria uma sessão do Stripe Checkout para a venda da Apostila por R$ 14,99.
 */

import 'dotenv/config';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    console.warn('[CreateCheckoutSession] Atenção: STRIPE_SECRET_KEY não definida nas variáveis de ambiente.');
}
const stripe = new Stripe(stripeSecretKey || 'mock_key');

export const handler = async (event) => {
    // Permite CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Método não permitido. Utilize POST.' })
        };
    }

    try {
        let payload = {};
        if (event.body) {
            try {
                payload = JSON.parse(event.body);
            } catch (e) {
                // Corpo não é JSON válido
            }
        }

        const customerEmail = payload.customer_email || undefined;

        // Determina o host de retorno a partir dos cabeçalhos do Netlify / browser
        const referer = event.headers.referer || event.headers.origin || 'http://localhost:8888';
        const urlObj = new URL(referer);
        const baseUrl = `${urlObj.protocol}//${urlObj.host}`;

        const session = await stripe.checkout.sessions.create({
            customer_email: customerEmail,
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: 'Apostila Completa de Teoria & Harmonia Musical (PDF)',
                            description: 'Guia completo com Escalas, Modos Gregos, Círculo de Quintas, 12 Campos Harmônicos e Dicionário de Instrumentos.',
                            images: []
                        },
                        unit_amount: 1499 // R$ 14,99 em centavos
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: `${baseUrl}/sucesso.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/cancelado.html`,
            metadata: {
                product: 'apostila_teoria_musical',
                price: '14.99'
            }
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                id: session.id,
                url: session.url
            })
        };
    } catch (error) {
        console.error('[CreateCheckoutSession] Erro:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Falha ao iniciar checkout no Stripe',
                message: error.message
            })
        };
    }
};
