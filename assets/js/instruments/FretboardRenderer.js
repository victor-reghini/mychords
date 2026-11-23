/**
 * FretboardRenderer.js
 * Renderizador de braço (fretboard) para instrumentos de cordas com trastes ou posições.
 * Suporta orientação horizontal e vertical (mobile-friendly).
 * Segue Liskov Substitution Principle (LSP) e Single Responsibility (SRP).
 */

import { TheoryEngine } from '../theory/TheoryEngine.js';

export class FretboardRenderer {
    constructor(options = {}) {
        this.displayMode = options.displayMode || 'notes'; // 'notes' ou 'intervals'
        this.orientation = options.orientation || 'horizontal'; // 'horizontal' ou 'vertical'
        this.onNoteClick = options.onNoteClick || null;
    }

    /**
     * Renderiza o braço no elemento container
     * @param {HTMLElement} container 
     * @param {Object} instrumentConfig Configuração do instrumento de InstrumentRegistry
     * @param {string} tuningKey Chave da afinação selecionada
     * @param {Array} activeNotes Array de strings das notas selecionadas (ex: ['C', 'E', 'G'])
     * @param {string} rootNote Nota fundamental/tônica
     */
    render(container, instrumentConfig, tuningKey, activeNotes = [], rootNote = null) {
        if (!container || !instrumentConfig) return;
        container.innerHTML = '';

        const tuning = instrumentConfig.tunings[tuningKey] || instrumentConfig.tunings[instrumentConfig.defaultTuning];
        const strings = tuning.strings;
        const frets = instrumentConfig.frets || 12;
        const isFretless = !!instrumentConfig.isFretless;

        const wrapper = document.createElement('div');
        wrapper.className = `fretboard-container ${this.orientation}-orientation ${isFretless ? 'is-fretless' : ''}`;
        wrapper.setAttribute('role', 'region');
        wrapper.setAttribute('aria-label', `Braço interativo de ${instrumentConfig.name}`);

        if (this.orientation === 'horizontal') {
            this._renderHorizontal(wrapper, strings, frets, activeNotes, rootNote, isFretless);
        } else {
            this._renderVertical(wrapper, strings, frets, activeNotes, rootNote, isFretless);
        }

        container.appendChild(wrapper);
    }

    _renderHorizontal(wrapper, strings, frets, activeNotes, rootNote, isFretless) {
        const table = document.createElement('table');
        table.className = 'fretboard-table';

        // Cabeçalho dos trastes (0 a frets)
        const headerRow = document.createElement('tr');
        headerRow.className = 'fretboard-header-row';

        const cordaTh = document.createElement('th');
        cordaTh.className = 'th-corda';
        cordaTh.textContent = 'Corda';
        headerRow.appendChild(cordaTh);

        for (let f = 0; f <= frets; f++) {
            const th = document.createElement('th');
            th.className = `fret-header-cell ${f === 0 ? 'nut-header' : ''}`;
            
            if (f === 0) {
                th.innerHTML = '<span class="fret-num">0</span><span class="fret-label">Solta</span>';
            } else {
                let markerHtml = '';
                if (f === 12) {
                    markerHtml = '<span class="fret-inlay double">● ●</span>';
                } else if ([3, 5, 7, 9, 15, 17, 19].includes(f)) {
                    markerHtml = '<span class="fret-inlay">●</span>';
                }
                th.innerHTML = `<span class="fret-num">${f}</span>${markerHtml}`;
            }
            headerRow.appendChild(th);
        }
        table.appendChild(headerRow);

        // Linhas de cordas (da mais aguda 1ª para a mais grave)
        strings.forEach((strObj, strIndex) => {
            const row = document.createElement('tr');
            row.className = 'string-row';

            const nameTd = document.createElement('td');
            nameTd.className = 'string-info-cell';
            nameTd.innerHTML = `<strong>${strObj.name}</strong>`;
            row.appendChild(nameTd);

            for (let f = 0; f <= frets; f++) {
                const note = TheoryEngine.transposeNote(strObj.openNote, f);
                const isNut = f === 0;
                const td = document.createElement('td');
                td.className = `fret-cell ${isNut ? 'nut-cell' : ''}`;
                td.dataset.string = strIndex;
                td.dataset.fret = f;
                td.dataset.note = note;

                const noteEl = this._createNoteElement(note, strObj, f, activeNotes, rootNote);
                td.appendChild(noteEl);
                row.appendChild(td);
            }

            table.appendChild(row);
        });

        wrapper.appendChild(table);
    }

    _renderVertical(wrapper, strings, frets, activeNotes, rootNote, isFretless) {
        const vGrid = document.createElement('div');
        vGrid.className = 'vertical-fretboard-grid';

        // Linha com nomes das cordas
        const cordasRow = document.createElement('div');
        cordasRow.className = 'v-row v-header-row';

        const cornerCell = document.createElement('div');
        cornerCell.className = 'v-cell v-corner-cell';
        cornerCell.textContent = 'Casa';
        cordasRow.appendChild(cornerCell);

        strings.forEach(strObj => {
            const strCell = document.createElement('div');
            strCell.className = 'v-cell v-string-header';
            strCell.innerHTML = `<span>${strObj.name}</span>`;
            cordasRow.appendChild(strCell);
        });
        vGrid.appendChild(cordasRow);

        // Linhas para cada traste (0 = solta até frets)
        for (let f = 0; f <= frets; f++) {
            const row = document.createElement('div');
            row.className = `v-row ${f === 0 ? 'v-nut-row' : ''}`;

            const fretNumberCell = document.createElement('div');
            fretNumberCell.className = 'v-cell v-fret-number-cell';
            let dot = '';
            if (f === 12) dot = ' ●●';
            else if ([3, 5, 7, 9, 15].includes(f)) dot = ' ●';
            fretNumberCell.innerHTML = `<strong>${f}</strong><small>${dot}</small>`;
            row.appendChild(fretNumberCell);

            strings.forEach((strObj, strIndex) => {
                const note = TheoryEngine.transposeNote(strObj.openNote, f);
                const cell = document.createElement('div');
                cell.className = `v-cell v-fret-cell ${f === 0 ? 'v-nut-cell' : ''}`;
                cell.dataset.string = strIndex;
                cell.dataset.fret = f;
                cell.dataset.note = note;

                const noteEl = this._createNoteElement(note, strObj, f, activeNotes, rootNote);
                cell.appendChild(noteEl);
                row.appendChild(cell);
            });

            vGrid.appendChild(row);
        }

        wrapper.appendChild(vGrid);
    }

    _createNoteElement(note, strObj, fret, activeNotes, rootNote) {
        const noteBtn = document.createElement('button');
        noteBtn.type = 'button';
        noteBtn.className = 'fret-note-badge';
        noteBtn.setAttribute('aria-label', `Nota ${note}, corda ${strObj.name}, casa ${fret}`);

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
            noteBtn.classList.add('is-active', roleClass);
        } else {
            noteBtn.classList.add('is-muted');
        }

        noteBtn.textContent = displayText;

        noteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onNoteClick) {
                // Calcula oitava aproximada da nota para áudio
                const baseOctave = strObj.octave || 3;
                const semitonesFromOpen = fret;
                const noteIndex = TheoryEngine.getNoteIndex(strObj.openNote);
                const finalOctave = baseOctave + Math.floor((noteIndex + semitonesFromOpen) / 12);
                this.onNoteClick({ note, octave: finalOctave, string: strObj, fret });
            }
        });

        return noteBtn;
    }
}
