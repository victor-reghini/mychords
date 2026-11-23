/**
 * email-service.js
 * Serviço de envio de e-mail com a Apostila PDF anexada via Gmail SMTP (SSL porta 465).
 */

import 'dotenv/config';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendApostilaEmail(recipientEmail, recipientName = 'Músico(a)') {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);

    if (!smtpUser || !smtpPass) {
        throw new Error('Credenciais SMTP (SMTP_USER ou SMTP_PASSWORD) não configuradas nas variáveis de ambiente.');
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // SSL
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });

    // Caminho da apostila
    const pdfPath = path.resolve(__dirname, '../../assets/apostila-teoria-musical.pdf');
    let pdfAttachment = null;

    if (fs.existsSync(pdfPath)) {
        pdfAttachment = {
            filename: 'Apostila-Teoria-Musical-MyChords.pdf',
            path: pdfPath,
            contentType: 'application/pdf'
        };
    }

    const mailOptions = {
        from: `"MyChords Teoria Musical" <${smtpUser}>`,
        to: recipientEmail,
        subject: 'Sua Apostila Completa de Teoria Musical & Guia Prático - MyChords',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1D20; line-height: 1.6; border: 1px solid #E5DFD5; border-radius: 8px; padding: 25px; background-color: #FBF9F5;">
                <div style="border-bottom: 2px solid #B86B00; padding-bottom: 12px; margin-bottom: 20px;">
                    <h2 style="color: #B86B00; margin: 0; font-size: 24px;">MyChords • Teoria & Harmonia</h2>
                    <p style="color: #555C68; margin: 4px 0 0 0; font-size: 14px;">Caderno Editorial de Estudos Musicais</p>
                </div>
                
                <p>Olá, <strong>${recipientName}</strong>!</p>
                
                <p>Muito obrigado pela sua compra! O seu pagamento de <strong>R$ 14,99</strong> foi confirmado com sucesso.</p>
                
                <p>Em anexo a este e-mail, você está recebendo a sua <strong>Apostila Completa de Teoria Musical em PDF</strong>, com:</p>
                
                <ul style="color: #333; padding-left: 20px;">
                    <li><strong>Fundamentos e Intervalos:</strong> Cálculo de semitons, notas e formação de acordes.</li>
                    <li><strong>Círculo de Quintas Explicado:</strong> Tabela detalhada de armaduras de clave para todos os 12 tons.</li>
                    <li><strong>Os 7 Modos Gregos Diatônicos:</strong> Notas características, fórmulas e aplicações.</li>
                    <li><strong>Todos os 12 Campos Harmônicos:</strong> Tríades e tétrades completas de Dó a Si.</li>
                    <li><strong>Funções Harmônicas e Cadências:</strong> Tônica, Subdominante, Dominante, II-V-I e muito mais.</li>
                    <li><strong>Guia Prático dos Instrumentos:</strong> Violão, Guitarra (6 e 7 cordas), Contrabaixo (4 e 5 cordas), Ukulele, Viola Caipira, Violino e Piano.</li>
                </ul>

                <div style="background-color: #F3EFEA; border-left: 4px solid #B86B00; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0; font-size: 14px; color: #424754;">
                        <em>Dica de estudo:</em> Você pode consultar este PDF no computador, tablet, celular ou imprimir para acompanhar seus estudos no instrumento!
                    </p>
                </div>

                <p style="font-size: 13px; color: #777; margin-top: 30px; border-top: 1px solid #E5DFD5; padding-top: 15px;">
                    Se precisar de qualquer suporte, basta responder diretamente a este e-mail.<br>
                    Bons estudos e muita música!<br>
                    <strong>Equipe MyChords</strong>
                </p>
            </div>
        `,
        attachments: pdfAttachment ? [pdfAttachment] : []
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] E-mail enviado com sucesso para ${recipientEmail}. MessageId: ${info.messageId}`);
    return info;
}
