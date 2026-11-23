/**
 * CircleOfFifthsRenderer.js
 * Visualizador Interativo e Vetorial (SVG) do Círculo de Quintas.
 * Permite navegação direta por tonalidades maiores e seus relativos menores,
 * exibindo armaduras de clave, acidentes (# e b) e disparando eventos de seleção.
 */

import { TheoryEngine } from '../theory/TheoryEngine.js';

export class CircleOfFifthsRenderer {
    constructor(options = {}) {
        this.onKeySelected = options.onKeySelected || null;
        this.activeKey = 'C';
    }

    /**
     * Renderiza o Círculo de Quintas no container
     * @param {HTMLElement} container 
     * @param {string} selectedKey Tonalidade atualmente selecionada
     */
    render(container, selectedKey = 'C') {
        if (!container) return;
        this.activeKey = selectedKey;
        container.innerHTML = '';

        const data = TheoryEngine.getCircleOfFifthsData();
        const size = 380;
        const center = size / 2;
        const outerRadius = 160;
        const innerRadius = 110;
        const centerRadius = 65;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
        svg.setAttribute('class', 'circle-of-fifths-svg');
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', `Círculo de Quintas Interativo. Tonalidade ativa: ${selectedKey}`);

        // Definições de gradientes e filtros sutis
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="var(--surface-color)" stop-opacity="1" />
                <stop offset="100%" stop-color="var(--surface-hover)" stop-opacity="0.9" />
            </radialGradient>
        `;
        svg.appendChild(defs);

        // Fundo circular estético
        const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bgCircle.setAttribute('cx', center);
        bgCircle.setAttribute('cy', center);
        bgCircle.setAttribute('r', outerRadius + 8);
        bgCircle.setAttribute('class', 'circle-outer-bg');
        svg.appendChild(bgCircle);

        // Slices / Fatias de cada tonalidade (12 posições, 30 graus cada)
        const sliceAngle = 360 / 12; // 30 graus

        data.forEach((item, index) => {
            // Em círculo de quintas padrão: C fica no topo (12 horas = -90 graus)
            const angleDeg = (index * sliceAngle) - 90;
            const startAngle = angleDeg - (sliceAngle / 2);
            const endAngle = angleDeg + (sliceAngle / 2);

            const isCurrentActive = (item.key === this.activeKey || item.relativeMinor === this.activeKey);

            const wedgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            wedgeGroup.setAttribute('class', `circle-slice ${isCurrentActive ? 'is-active' : ''}`);
            wedgeGroup.setAttribute('role', 'button');
            wedgeGroup.setAttribute('tabindex', '0');
            wedgeGroup.setAttribute('aria-label', `Tom ${item.key} Maior, Relativo ${item.relativeMinor}, ${item.label}`);

            // Setor externo: Tonalidade Maior
            const outerPath = this._createDonutSegment(center, center, innerRadius, outerRadius, startAngle, endAngle);
            outerPath.setAttribute('class', `slice-path outer-slice ${isCurrentActive ? 'active-slice' : ''}`);
            wedgeGroup.appendChild(outerPath);

            // Setor interno: Tonalidade Menor Relativa
            const innerPath = this._createDonutSegment(center, center, centerRadius, innerRadius, startAngle, endAngle);
            innerPath.setAttribute('class', `slice-path inner-slice ${isCurrentActive ? 'active-slice-inner' : ''}`);
            wedgeGroup.appendChild(innerPath);

            // Posição para o texto da Tonalidade Maior
            const outerTextPos = this._polarToCartesian(center, center, (innerRadius + outerRadius) / 2, angleDeg);
            const outerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            outerText.setAttribute('x', outerTextPos.x);
            outerText.setAttribute('y', outerTextPos.y + 5);
            outerText.setAttribute('text-anchor', 'middle');
            outerText.setAttribute('class', 'slice-text major-key-text');
            outerText.textContent = item.key;
            wedgeGroup.appendChild(outerText);

            // Posição para o texto do Relativo Menor
            const innerTextPos = this._polarToCartesian(center, center, (centerRadius + innerRadius) / 2, angleDeg);
            const innerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            innerText.setAttribute('x', innerTextPos.x);
            innerText.setAttribute('y', innerTextPos.y + 4);
            innerText.setAttribute('text-anchor', 'middle');
            innerText.setAttribute('class', 'slice-text minor-key-text');
            innerText.textContent = item.relativeMinor;
            wedgeGroup.appendChild(innerText);

            // Rótulo de acidentes fora da borda
            const accPos = this._polarToCartesian(center, center, outerRadius - 12, angleDeg);
            const accText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            accText.setAttribute('x', accPos.x);
            accText.setAttribute('y', accPos.y + 3);
            accText.setAttribute('text-anchor', 'middle');
            accText.setAttribute('class', 'accidentals-badge-text');
            let accShort = '';
            if (item.accidentals > 0) {
                accShort = item.type === 'sharp' ? `${item.accidentals}#` : `${item.accidentals}♭`;
            } else {
                accShort = '0';
            }
            accText.textContent = accShort;
            wedgeGroup.appendChild(accText);

            // Eventos de clique e acessibilidade por teclado
            const selectAction = () => {
                this.activeKey = item.key;
                if (this.onKeySelected) {
                    this.onKeySelected(item);
                }
                this.render(container, item.key);
            };

            wedgeGroup.addEventListener('click', selectAction);
            wedgeGroup.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectAction();
                }
            });

            svg.appendChild(wedgeGroup);
        });

        // Centro do Círculo com informações didáticas do tom selecionado
        const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        centerCircle.setAttribute('cx', center);
        centerCircle.setAttribute('cy', center);
        centerCircle.setAttribute('r', centerRadius);
        centerCircle.setAttribute('class', 'circle-center-hub');
        svg.appendChild(centerCircle);

        const activeItem = data.find(d => d.key === this.activeKey || d.relativeMinor === this.activeKey) || data[0];

        const centerLabelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        centerLabelGroup.setAttribute('class', 'center-info-group');

        const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        titleText.setAttribute('x', center);
        titleText.setAttribute('y', center - 18);
        titleText.setAttribute('text-anchor', 'middle');
        titleText.setAttribute('class', 'hub-title');
        titleText.textContent = 'TONALIDADE';
        centerLabelGroup.appendChild(titleText);

        const keyText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        keyText.setAttribute('x', center);
        keyText.setAttribute('y', center + 7);
        keyText.setAttribute('text-anchor', 'middle');
        keyText.setAttribute('class', 'hub-key-name');
        keyText.textContent = activeItem.key;
        centerLabelGroup.appendChild(keyText);

        const relText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        relText.setAttribute('x', center);
        relText.setAttribute('y', center + 26);
        relText.setAttribute('text-anchor', 'middle');
        relText.setAttribute('class', 'hub-relative-name');
        relText.textContent = `Rel: ${activeItem.relativeMinor}`;
        centerLabelGroup.appendChild(relText);

        svg.appendChild(centerLabelGroup);

        container.appendChild(svg);
    }

    _polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    _createDonutSegment(cx, cy, rIn, rOut, startAngle, endAngle) {
        const startOuter = this._polarToCartesian(cx, cy, rOut, endAngle);
        const endOuter = this._polarToCartesian(cx, cy, rOut, startAngle);
        const startInner = this._polarToCartesian(cx, cy, rIn, endAngle);
        const endInner = this._polarToCartesian(cx, cy, rIn, startAngle);

        const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

        const d = [
            'M', startOuter.x, startOuter.y,
            'A', rOut, rOut, 0, arcSweep, 0, endOuter.x, endOuter.y,
            'L', endInner.x, endInner.y,
            'A', rIn, rIn, 0, arcSweep, 1, startInner.x, startInner.y,
            'Z'
        ].join(' ');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        return path;
    }
}
