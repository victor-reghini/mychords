/**
 * app.js
 * Controlador Principal da Aplicação MyChords.
 * Segue os princípios SOLID (SRP, OCP, LSP, ISP, DIP):
 * Integra o motor teórico, catálogo de instrumentos, renderizadores de braço/piano,
 * sintetizador de áudio, círculo de quintas e sistema de temas.
 */

import { TheoryEngine } from './theory/TheoryEngine.js';
import { SCALES_DATA } from './theory/ScalesData.js';
import { CHORD_TYPES } from './theory/ChordsData.js';
import { INSTRUMENTS } from './instruments/InstrumentRegistry.js';
import { FretboardRenderer } from './instruments/FretboardRenderer.js';
import { PianoRenderer } from './instruments/PianoRenderer.js';
import { CircleOfFifthsRenderer } from './ui/CircleOfFifthsRenderer.js';
import { audioEngine } from './ui/AudioEngine.js';
import { themeManager } from './ui/ThemeManager.js';
import { ModalManager } from './ui/ModalManager.js';

class AppController {
    constructor() {
        // Estado da Aplicação
        this.state = {
            instrumentKey: 'guitar',
            tuningKey: 'standard',
            rootNote: 'C',
            modeType: 'scale', // 'scale' ou 'chord'
            selectedId: 'major', // ID da escala ou tipo de acorde
            displayMode: 'notes', // 'notes' ou 'intervals'
            orientation: 'horizontal' // 'horizontal' ou 'vertical'
        };

        // Instâncias dos Renderizadores
        this.fretboardRenderer = new FretboardRenderer({
            displayMode: this.state.displayMode,
            orientation: this.state.orientation,
            onNoteClick: (noteData) => this._handleNotePlay(noteData)
        });

        this.pianoRenderer = new PianoRenderer({
            displayMode: this.state.displayMode,
            onKeyClick: (keyData) => this._handleKeyPlay(keyData)
        });

        this.circleRenderer = new CircleOfFifthsRenderer({
            onKeySelected: (keyData) => this._handleCircleKeySelect(keyData)
        });

        this.modalManager = null;
    }

    init() {
        // Inicializa o gerenciador de tema
        themeManager.init();
        this._initThemeControls();

        // Inicializa modal de compra
        this.modalManager = new ModalManager();
        this._initApostilaTriggers();

        // Inicializa elementos do DOM e ouvintes de eventos
        this._cacheDomElements();
        this._populateSelects();
        this._bindEvents();

        // Renderiza estado inicial
        this._update();
    }

    _cacheDomElements() {
        this.dom = {
            // Selects
            instrumentSelect: document.getElementById('instrument-select'),
            tuningSelect: document.getElementById('tuning-select'),
            tuningField: document.getElementById('tuning-field'),
            rootSelect: document.getElementById('root-select'),
            modeTypeSelect: document.getElementById('mode-type-select'),
            itemSelect: document.getElementById('item-select'),
            itemLabel: document.getElementById('item-label'),

            // Botões de ação do laboratório
            btnPlayAudio: document.getElementById('btn-play-audio'),
            btnToggleDisplay: document.getElementById('btn-toggle-display'),
            btnToggleOrientation: document.getElementById('btn-toggle-orientation'),

            // Áreas de exibição
            instrumentContainer: document.getElementById('instrument-stage-container'),
            summaryTitle: document.getElementById('summary-title'),
            summaryMeta: document.getElementById('summary-meta'),
            summaryChips: document.getElementById('summary-chips'),
            circleContainer: document.getElementById('circle-svg-wrapper'),
            harmonicFieldTbody: document.getElementById('harmonic-field-tbody'),
            scalesCatalogList: document.getElementById('scales-catalog-list'),

            // Abas de navegação
            navTabBtns: document.querySelectorAll('.nav-tab-btn'),
            contentSections: document.querySelectorAll('.content-section')
        };
    }

    _initThemeControls() {
        const themeBtns = document.querySelectorAll('.theme-btn');
        const updateActiveBtn = (currentPref) => {
            themeBtns.forEach(btn => {
                const pref = btn.dataset.themePref;
                btn.classList.toggle('active', pref === currentPref);
            });
        };

        themeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const pref = btn.dataset.themePref;
                themeManager.setTheme(pref);
                updateActiveBtn(pref);
                // Re-renderiza o círculo de quintas para atualizar cores do SVG
                this.circleRenderer.render(this.dom.circleContainer, this.state.rootNote);
            });
        });

        updateActiveBtn(themeManager.getTheme());
    }

    _initApostilaTriggers() {
        const triggers = document.querySelectorAll('.trigger-apostila-modal');
        triggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.modalManager) {
                    this.modalManager.open();
                }
            });
        });
    }

    _populateSelects() {
        // Instrumentos
        if (this.dom.instrumentSelect) {
            this.dom.instrumentSelect.innerHTML = '';
            Object.values(INSTRUMENTS).forEach(inst => {
                const opt = document.createElement('option');
                opt.value = inst.id;
                opt.textContent = inst.name;
                this.dom.instrumentSelect.appendChild(opt);
            });
            this.dom.instrumentSelect.value = this.state.instrumentKey;
        }

        // Tonalidade Raiz (Cromática)
        if (this.dom.rootSelect) {
            this.dom.rootSelect.innerHTML = '';
            TheoryEngine.NOTES_SHARP.forEach(note => {
                const opt = document.createElement('option');
                opt.value = note;
                const namePt = TheoryEngine.NOTE_NAMES_PT[note] || note;
                opt.textContent = `${namePt} (${note})`;
                this.dom.rootSelect.appendChild(opt);
            });
            this.dom.rootSelect.value = this.state.rootNote;
        }

        this._updateTuningsSelect();
        this._updateItemSelect();
    }

    _updateTuningsSelect() {
        const inst = INSTRUMENTS[this.state.instrumentKey];
        if (!this.dom.tuningSelect || !this.dom.tuningField) return;

        if (inst.type === 'keyboard' || !inst.tunings || Object.keys(inst.tunings).length <= 1) {
            this.dom.tuningField.style.display = 'none';
        } else {
            this.dom.tuningField.style.display = 'flex';
            this.dom.tuningSelect.innerHTML = '';
            Object.entries(inst.tunings).forEach(([key, tuningObj]) => {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = tuningObj.name;
                this.dom.tuningSelect.appendChild(opt);
            });
            this.dom.tuningSelect.value = this.state.tuningKey;
        }
    }

    _updateItemSelect() {
        if (!this.dom.itemSelect || !this.dom.itemLabel) return;

        this.dom.itemSelect.innerHTML = '';

        if (this.state.modeType === 'scale') {
            this.dom.itemLabel.textContent = 'Selecione a Escala:';
            SCALES_DATA.forEach(scale => {
                const opt = document.createElement('option');
                opt.value = scale.id;
                opt.textContent = `${scale.name} [${scale.category}]`;
                this.dom.itemSelect.appendChild(opt);
            });
            // Restaura ou reseta
            const exists = SCALES_DATA.some(s => s.id === this.state.selectedId);
            this.state.selectedId = exists ? this.state.selectedId : 'major';
        } else {
            this.dom.itemLabel.textContent = 'Selecione o Acorde:';
            CHORD_TYPES.forEach(chord => {
                const opt = document.createElement('option');
                opt.value = chord.id;
                opt.textContent = `${chord.name} (${chord.suffix || 'Maior'}) [${chord.category}]`;
                this.dom.itemSelect.appendChild(opt);
            });
            const exists = CHORD_TYPES.some(c => c.id === this.state.selectedId);
            this.state.selectedId = exists ? this.state.selectedId : 'maj';
        }

        this.dom.itemSelect.value = this.state.selectedId;
    }

    _bindEvents() {
        // Mudança de Instrumento
        this.dom.instrumentSelect.addEventListener('change', (e) => {
            this.state.instrumentKey = e.target.value;
            const inst = INSTRUMENTS[this.state.instrumentKey];
            this.state.tuningKey = inst.defaultTuning || 'standard';
            this._updateTuningsSelect();
            this._update();
        });

        // Mudança de Afinação
        this.dom.tuningSelect.addEventListener('change', (e) => {
            this.state.tuningKey = e.target.value;
            this._update();
        });

        // Mudança de Tônica
        this.dom.rootSelect.addEventListener('change', (e) => {
            this.state.rootNote = e.target.value;
            this._update();
        });

        // Mudança do Tipo (Escala vs Acorde)
        this.dom.modeTypeSelect.addEventListener('change', (e) => {
            this.state.modeType = e.target.value;
            this._updateItemSelect();
            this._update();
        });

        // Mudança do Item (Escala específica ou Acorde específico)
        this.dom.itemSelect.addEventListener('change', (e) => {
            this.state.selectedId = e.target.value;
            this._update();
        });

        // Botão Tocar Áudio
        this.dom.btnPlayAudio.addEventListener('click', () => {
            const currentNotes = this._getActiveNotes();
            audioEngine.playChord(currentNotes, 4, true);
        });

        // Alternar Exibição (Notas vs Intervalos/Graus)
        this.dom.btnToggleDisplay.addEventListener('click', () => {
            this.state.displayMode = this.state.displayMode === 'notes' ? 'intervals' : 'notes';
            this.fretboardRenderer.displayMode = this.state.displayMode;
            this.pianoRenderer.displayMode = this.state.displayMode;
            this.dom.btnToggleDisplay.textContent = this.state.displayMode === 'notes' 
                ? 'Exibindo: Nomes das Notas' 
                : 'Exibindo: Graus / Intervalos';
            this._renderInstrument();
        });

        // Alternar Orientação (Horizontal vs Vertical)
        this.dom.btnToggleOrientation.addEventListener('click', () => {
            this.state.orientation = this.state.orientation === 'horizontal' ? 'vertical' : 'horizontal';
            this.fretboardRenderer.orientation = this.state.orientation;
            this.dom.btnToggleOrientation.textContent = this.state.orientation === 'horizontal'
                ? 'Modo Horizontal'
                : 'Modo Vertical (Mobile)';
            this._renderInstrument();
        });

        // Abas de Navegação
        this.dom.navTabBtns.forEach(tabBtn => {
            tabBtn.addEventListener('click', () => {
                const targetTab = tabBtn.dataset.tab;
                this.dom.navTabBtns.forEach(b => b.classList.toggle('active', b === tabBtn));
                this.dom.contentSections.forEach(sec => {
                    sec.classList.toggle('active', sec.id === `section-${targetTab}`);
                });
            });
        });
    }

    _handleNotePlay(noteData) {
        audioEngine.playNote(noteData.note, noteData.octave, 1.2);
    }

    _handleKeyPlay(keyData) {
        audioEngine.playNote(keyData.note, keyData.octave, 1.2);
    }

    _handleCircleKeySelect(keyData) {
        this.state.rootNote = keyData.key;
        if (this.dom.rootSelect) {
            this.dom.rootSelect.value = keyData.key;
        }
        this._update();
    }

    _getActiveNotes() {
        const root = this.state.rootNote;

        if (this.state.modeType === 'scale') {
            const scaleObj = SCALES_DATA.find(s => s.id === this.state.selectedId) || SCALES_DATA[0];
            return TheoryEngine.generateScaleNotes(root, scaleObj.intervals);
        } else {
            const chordObj = CHORD_TYPES.find(c => c.id === this.state.selectedId) || CHORD_TYPES[0];
            return chordObj.intervals.map(semitones => TheoryEngine.transposeNote(root, semitones));
        }
    }

    _update() {
        const activeNotes = this._getActiveNotes();
        const root = this.state.rootNote;

        // 1. Atualiza Banner de Resumo
        this._updateSummaryBanner(activeNotes);

        // 2. Renderiza Instrumento (Braço ou Piano)
        this._renderInstrument(activeNotes);

        // 3. Renderiza Círculo de Quintas
        this.circleRenderer.render(this.dom.circleContainer, root);

        // 4. Renderiza Campo Harmônico
        this._renderHarmonicField();

        // 5. Renderiza Catálogo de Escalas
        this._renderScalesCatalog();
    }

    _renderInstrument(activeNotes = null) {
        const notes = activeNotes || this._getActiveNotes();
        const inst = INSTRUMENTS[this.state.instrumentKey];
        const root = this.state.rootNote;

        if (!this.dom.instrumentContainer) return;

        if (inst.type === 'keyboard') {
            this.dom.btnToggleOrientation.style.display = 'none';
            this.pianoRenderer.render(this.dom.instrumentContainer, inst, notes, root);
        } else {
            this.dom.btnToggleOrientation.style.display = 'inline-flex';
            this.fretboardRenderer.render(
                this.dom.instrumentContainer,
                inst,
                this.state.tuningKey,
                notes,
                root
            );
        }
    }

    _updateSummaryBanner(activeNotes) {
        const root = this.state.rootNote;
        const rootNamePt = TheoryEngine.NOTE_NAMES_PT[root] || root;

        let titleText = '';
        let formulaText = '';
        let descText = '';

        if (this.state.modeType === 'scale') {
            const scaleObj = SCALES_DATA.find(s => s.id === this.state.selectedId) || SCALES_DATA[0];
            titleText = `${scaleObj.name} de ${rootNamePt} (${root})`;
            formulaText = `Fórmula: ${scaleObj.formula} • Categoria: ${scaleObj.category}`;
            descText = scaleObj.description;
        } else {
            const chordObj = CHORD_TYPES.find(c => c.id === this.state.selectedId) || CHORD_TYPES[0];
            titleText = `Acorde de ${rootNamePt} ${chordObj.name} (${root}${chordObj.suffix})`;
            formulaText = `Intervalos: [${chordObj.intervals.join(', ')}] semitons • Categoria: ${chordObj.category}`;
            descText = `Notas que formam o acorde: ${activeNotes.join(' - ')}`;
        }

        const relativeInfo = TheoryEngine.getRelative(root, true);
        const relText = relativeInfo ? ` | ${relativeInfo.relationship}: ${relativeInfo.relative}` : '';

        this.dom.summaryTitle.textContent = titleText;
        this.dom.summaryMeta.textContent = `${formulaText}${relText}`;

        // Chips com cores de graus
        this.dom.summaryChips.innerHTML = '';
        activeNotes.forEach(note => {
            const chip = document.createElement('span');
            chip.className = 'note-chip';

            const interval = TheoryEngine.getInterval(root, note);
            if (note === root) {
                chip.classList.add('root');
            } else if (interval === 3 || interval === 4) {
                chip.classList.add('third');
            } else if (interval === 7 || interval === 6 || interval === 8) {
                chip.classList.add('fifth');
            } else if (interval === 10 || interval === 11) {
                chip.classList.add('seventh');
            } else {
                chip.classList.add('other');
            }

            const intervalInfo = TheoryEngine.INTERVAL_NAMES[interval];
            const intervalLabel = intervalInfo ? intervalInfo.short : '';
            chip.textContent = `${note} (${intervalLabel})`;
            this.dom.summaryChips.appendChild(chip);
        });
    }

    _renderHarmonicField() {
        if (!this.dom.harmonicFieldTbody) return;

        const root = this.state.rootNote;
        const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
        const fieldData = TheoryEngine.generateHarmonicField(root, majorScaleIntervals, 'major');

        this.dom.harmonicFieldTbody.innerHTML = '';

        fieldData.forEach(item => {
            const row = document.createElement('tr');

            // Grau
            const tdDegree = document.createElement('td');
            tdDegree.innerHTML = `<span class="degree-tag">${item.degree}</span>`;
            row.appendChild(tdDegree);

            // Tríade
            const tdTriad = document.createElement('td');
            const triadBtn = document.createElement('button');
            triadBtn.type = 'button';
            triadBtn.className = 'chord-btn';
            triadBtn.innerHTML = `<span>▶</span> <strong>${item.triad}</strong>`;
            triadBtn.title = `Tocar tríade de ${item.triad}`;
            triadBtn.addEventListener('click', () => {
                audioEngine.playChord(item.triadNotes, 4, true);
            });
            tdTriad.appendChild(triadBtn);
            row.appendChild(tdTriad);

            // Notas da Tríade
            const tdTriadNotes = document.createElement('td');
            tdTriadNotes.textContent = item.triadNotes.join(' - ');
            row.appendChild(tdTriadNotes);

            // Tétrade (7ª)
            const tdTetrad = document.createElement('td');
            const tetradBtn = document.createElement('button');
            tetradBtn.type = 'button';
            tetradBtn.className = 'chord-btn';
            tetradBtn.innerHTML = `<span>▶</span> <strong>${item.tetrad}</strong>`;
            tetradBtn.title = `Tocar tétrade de ${item.tetrad}`;
            tetradBtn.addEventListener('click', () => {
                audioEngine.playChord(item.tetradNotes, 4, true);
            });
            tdTetrad.appendChild(tetradBtn);
            row.appendChild(tdTetrad);

            // Notas da Tétrade
            const tdTetradNotes = document.createElement('td');
            tdTetradNotes.textContent = item.tetradNotes.join(' - ');
            row.appendChild(tdTetradNotes);

            // Função Harmônica
            const tdFunction = document.createElement('td');
            tdFunction.textContent = item.harmonicFunction;
            row.appendChild(tdFunction);

            this.dom.harmonicFieldTbody.appendChild(row);
        });
    }

    _renderScalesCatalog() {
        if (!this.dom.scalesCatalogList) return;

        const root = this.state.rootNote;
        this.dom.scalesCatalogList.innerHTML = '';

        SCALES_DATA.forEach(scale => {
            const notes = TheoryEngine.generateScaleNotes(root, scale.intervals);

            const card = document.createElement('div');
            card.className = 'circle-card';
            card.style.marginBottom = '1rem';

            const cardTitle = document.createElement('h4');
            cardTitle.textContent = `${scale.name} em ${root}`;
            card.appendChild(cardTitle);

            const cardFormula = document.createElement('p');
            cardFormula.style.fontSize = '0.9rem';
            cardFormula.style.marginBottom = '0.4rem';
            cardFormula.innerHTML = `<strong>Fórmula:</strong> ${scale.formula} &nbsp;|&nbsp; <strong>Notas:</strong> <span style="color: var(--accent-amber); font-weight: 700;">${notes.join(' - ')}</span>`;
            card.appendChild(cardFormula);

            const cardDesc = document.createElement('p');
            cardDesc.style.fontSize = '0.85rem';
            cardDesc.style.color = 'var(--text-secondary)';
            cardDesc.textContent = scale.description;
            card.appendChild(cardDesc);

            const btnApply = document.createElement('button');
            btnApply.type = 'button';
            btnApply.className = 'btn btn-outline';
            btnApply.style.marginTop = '0.6rem';
            btnApply.style.fontSize = '0.85rem';
            btnApply.style.padding = '0.4rem 0.8rem';
            btnApply.textContent = 'Mapear esta escala no instrumento';
            btnApply.addEventListener('click', () => {
                this.state.modeType = 'scale';
                this.state.selectedId = scale.id;
                this.dom.modeTypeSelect.value = 'scale';
                this._updateItemSelect();
                this._update();
                // Alterna para a aba do laboratório
                const labTabBtn = document.querySelector('.nav-tab-btn[data-tab="lab"]');
                if (labTabBtn) labTabBtn.click();
            });
            card.appendChild(btnApply);

            this.dom.scalesCatalogList.appendChild(card);
        });
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const app = new AppController();
    app.init();
});
