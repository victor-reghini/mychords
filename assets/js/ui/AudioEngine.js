/**
 * AudioEngine.js
 * Sintetizador polifônico via Web Audio API pura.
 * Responsável por produzir som claro, orgânico e sem latência
 * para notas soltas, arpejos e acordes completos.
 */

import { TheoryEngine } from '../theory/TheoryEngine.js';

export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.isEnabled = true;
    }

    _initContext() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    /**
     * Converte nota e oitava em frequência (Hz) baseada em A4 = 440Hz
     */
    noteToFrequency(noteName, octave = 4) {
        const noteIndex = TheoryEngine.getNoteIndex(noteName);
        if (noteIndex === -1) return 440;
        // Distância em semitons a partir de A4 (índice 9, oitava 4)
        // A4 = 440 Hz
        const semitonesFromA4 = (noteIndex - 9) + (octave - 4) * 12;
        return 440 * Math.pow(2, semitonesFromA4 / 12);
    }

    /**
     * Toca uma nota única com envelope suave acústico
     */
    playNote(noteName, octave = 4, duration = 1.2, startTimeOffset = 0) {
        if (!this.isEnabled) return;
        this._initContext();
        if (!this.ctx) return;

        const freq = this.noteToFrequency(noteName, octave);
        const now = this.ctx.currentTime + startTimeOffset;

        // Oscilador fundamental (onda senoidal suave)
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);

        // Oscilador harmônico (triângulo suave para dar timbre de corda/piano acústico)
        const osc2 = this.ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, now); // 2º harmônico

        // Ganho com envelope ADSR
        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.0001, now);
        // Ataque rápido
        gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
        // Decaimento natural
        gainNode.gain.exponentialRampToValueAtTime(0.08, now + 0.35);
        // Fade out
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        // Filtro passa-baixa para calor analógico
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 4, now);
        filter.Q.setValueAtTime(1, now);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration + 0.05);
        osc2.stop(now + duration + 0.05);
    }

    /**
     * Toca um conjunto de notas em arpejo suave
     */
    playChord(notes = [], baseOctave = 4, isArpeggiated = true) {
        if (!notes || notes.length === 0) return;
        this._initContext();

        notes.forEach((note, index) => {
            // Ajusta oitava progressiva para notas mais agudas
            const noteIdx = TheoryEngine.getNoteIndex(note);
            const firstNoteIdx = TheoryEngine.getNoteIndex(notes[0]);
            let oct = baseOctave;
            if (noteIdx < firstNoteIdx && index > 0) {
                oct = baseOctave + 1;
            }

            const offset = isArpeggiated ? index * 0.08 : 0;
            this.playNote(note, oct, 1.8, offset);
        });
    }
}

export const audioEngine = new AudioEngine();
