/**
 * PianoRenderer.js
 * Renderizador de teclado e teclas de piano realista e responsivo.
 * Suporta destaque de notas por intervalo (Tônica, Terça, Quinta, Sétima, etc.),
 * exibição alternável de notas ou graus e reprodução por clique.
 */

import { TheoryEngine } from '../theory/TheoryEngine.js';

export class PianoRenderer {
    constructor(options = {}) {
        this.displayMode = options.displayMode || 'notes'; // 'notes' ou 'intervals'
        this.onKeyClick = options.onKeyClick || null;
    }

    /**
     * Renderiza o teclado de piano no container
     * @param {HTMLElement} container 
     * @param {Object} instrumentConfig 
     * @param {Array} activeNotes Notas ativas a destacar
     * @param {string} rootNote Tônica
     */
    render(container, instrumentConfig, activeNotes = [], rootNote = null) {
        if (!container) return;
        container.innerHTML = '';

        const startOctave = 3;
        const totalOctaves = instrumentConfig.octaves || 3; // 3 oitavas = C3 a B5 (36 teclas)

        const pianoWrapper = document.createElement('div');
        pianoWrapper.className = 'piano-keyboard-wrapper';
        pianoWrapper.setAttribute('role', 'region');
        pianoWrapper.setAttribute('aria-label', 'Teclado de Piano Interativo');

        const keyboardEl = document.createElement('div');
        keyboardEl.className = 'piano-keyboard';

        // Loop por oitavas
        for (let oct = startOctave; oct < startOctave + totalOctaves; oct++) {
            const octaveContainer = document.createElement('div');
            octaveContainer.className = 'piano-octave';
            octaveContainer.dataset.octave = oct;

            // Notas brancas da oitava: C, D, E, F, G, A, B
            const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
            // Notas pretas associadas às brancas anteriores: C#, D#, (sem E#), F#, G#, A#
            const blackNotesMap = {
                'C': 'C#',
                'D': 'D#',
                'F': 'F#',
                'G': 'G#',
                'A': 'A#'
            };

            whiteNotes.forEach(wNote => {
                const whiteKey = this._createKey(wNote, oct, false, activeNotes, rootNote);
                octaveContainer.appendChild(whiteKey);

                if (blackNotesMap[wNote]) {
                    const bNote = blackNotesMap[wNote];
                    const blackKey = this._createKey(bNote, oct, true, activeNotes, rootNote);
                    octaveContainer.appendChild(blackKey);
                }
            });

            keyboardEl.appendChild(octaveContainer);
        }

        pianoWrapper.appendChild(keyboardEl);
        container.appendChild(pianoWrapper);
    }

    _createKey(note, octave, isBlack, activeNotes, rootNote) {
        const keyBtn = document.createElement('button');
        keyBtn.type = 'button';
        keyBtn.className = `piano-key ${isBlack ? 'black-key' : 'white-key'}`;
        keyBtn.dataset.note = note;
        keyBtn.dataset.octave = octave;
        keyBtn.setAttribute('aria-label', `Tecla ${note}${octave}`);

        const isActive = activeNotes.includes(note);
        let roleClass = 'inactive';
        let displayText = note;

        if (isActive) {
            if (rootNote && note === rootNote) {
                roleClass = 'role-root';
            } else if (rootNote) {
                const interval = TheoryEngine.getInterval(rootNote, note);
                if (interval === 3 || interval === 4) {
                    roleClass = 'role-third';
                } else if (interval === 7 || interval === 6 || interval === 8) {
                    roleClass = 'role-fifth';
                } else if (interval === 10 || interval === 11) {
                    roleClass = 'role-seventh';
                } else {
                    roleClass = 'role-other';
                }

                if (this.displayMode === 'intervals') {
                    const info = TheoryEngine.INTERVAL_NAMES[interval];
                    displayText = info ? info.short : note;
                }
            } else {
                roleClass = 'role-other';
            }
            keyBtn.classList.add('is-active', roleClass);
        }

        const labelSpan = document.createElement('span');
        labelSpan.className = 'key-label';
        labelSpan.innerHTML = `<strong>${displayText}</strong><small class="octave-num">${octave}</small>`;
        keyBtn.appendChild(labelSpan);

        keyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onKeyClick) {
                this.onKeyClick({ note, octave, isBlack });
            }
        });

        return keyBtn;
    }
}
