/**
 * ModalManager.js
 * Gerencia o modal de exportação / compra da Apostila de Teoria Musical via Stripe.
 * Totalmente acessível (fechamento por ESC, armadilha de foco, feedbacks claros).
 */

export class ModalManager {
    constructor() {
        this.overlay = document.getElementById('checkout-modal');
        this.closeBtn = document.getElementById('modal-close-btn');
        this.checkoutForm = document.getElementById('checkout-form');
        this.emailInput = document.getElementById('checkout-email');
        this.submitBtn = document.getElementById('checkout-submit-btn');
        this.feedbackEl = document.getElementById('checkout-feedback');

        this._bindEvents();
    }

    _bindEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });
        }

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });

        if (this.checkoutForm) {
            this.checkoutForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this._handleSubmit();
            });
        }
    }

    open() {
        if (!this.overlay) return;
        this.overlay.classList.add('active');
        this.overlay.setAttribute('aria-hidden', 'false');
        if (this.emailInput) {
            this.emailInput.focus();
        }
        this._setFeedback('', '');
    }

    close() {
        if (!this.overlay) return;
        this.overlay.classList.remove('active');
        this.overlay.setAttribute('aria-hidden', 'true');
    }

    isOpen() {
        return this.overlay && this.overlay.classList.contains('active');
    }

    _setFeedback(message, type = '') {
        if (!this.feedbackEl) return;
        this.feedbackEl.className = `form-feedback ${type}`;
        this.feedbackEl.textContent = message;
        this.feedbackEl.style.display = message ? 'block' : 'none';
    }

    async _handleSubmit() {
        const email = this.emailInput ? this.emailInput.value.trim() : '';
        if (this.submitBtn) {
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = 'Iniciando checkout seguro...';
        }
        this._setFeedback('', '');

        try {
            // Tenta chamar o endpoint Netlify (suporta /api ou /.netlify/functions)
            const endpoint = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? '/.netlify/functions/create-checkout-session'
                : '/api/create-checkout-session';

            let res;
            try {
                res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ customer_email: email })
                });
            } catch (networkErr) {
                // Tenta caminho direto
                res = await fetch('/.netlify/functions/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ customer_email: email })
                });
            }

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || `Erro no servidor (${res.status})`);
            }

            const data = await res.json();
            if (data.url) {
                this._setFeedback('Redirecionando para a página segura de pagamento da Stripe...', 'success');
                window.location.href = data.url;
            } else {
                throw new Error('URL de checkout não retornada pelo servidor.');
            }
        } catch (err) {
            console.error('[ModalManager] Erro no checkout:', err);
            this._setFeedback(
                `Não foi possível conectar ao checkout online neste momento (${err.message}). Se você estiver visualizando localmente sem o Netlify CLI ativo, inicie via 'netlify dev' ou teste em ambiente de produção com as funções serverless ativas.`,
                'error'
            );
        } finally {
            if (this.submitBtn) {
                this.submitBtn.disabled = false;
                this.submitBtn.textContent = 'Pagar R$ 14,99 e Receber Apostila';
            }
        }
    }
}
