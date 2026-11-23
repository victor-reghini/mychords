/**
 * TheoryEngine.js
 * Motor matemático e analítico de teoria musical.
 * Responsabilidade Única (SOLID - Single Responsibility):
 * Cálculos teóricos independentes de UI, DOM e frameworks.
 */

export class TheoryEngine {
    static NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    static NOTES_FLAT  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

    static ENHARMONIC_MAP = {
        'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
        'B#': 'C',  'E#': 'F',  'Cb': 'B',  'Fb': 'E'
    };

    static NOTE_NAMES_PT = {
        'C': 'Dó', 'C#': 'Dó#', 'Db': 'Ré♭',
        'D': 'Ré', 'D#': 'Ré#', 'Eb': 'Mi♭',
        'E': 'Mi',
        'F': 'Fá', 'F#': 'Fá#', 'Gb': 'Sol♭',
        'G': 'Sol', 'G#': 'Sol#', 'Ab': 'Lá♭',
        'A': 'Lá', 'A#': 'Lá#', 'Bb': 'Si♭',
        'B': 'Si'
    };

    static INTERVAL_NAMES = {
        0: { name: 'Tônica / Fundamental', short: '1' },
        1: { name: 'Segunda menor', short: '2m' },
        2: { name: 'Segunda Maior', short: '2M' },
        3: { name: 'Terça menor', short: '3m' },
        4: { name: 'Terça Maior', short: '3M' },
        5: { name: 'Quarta Justa', short: '4J' },
        6: { name: 'Trítono / 4ª Aum / 5ª Dim', short: '4# / 5b' },
        7: { name: 'Quinta Justa', short: '5J' },
        8: { name: 'Sexta menor', short: '6m' },
        9: { name: 'Sexta Maior', short: '6M' },
        10: { name: 'Sétima menor', short: '7m' },
        11: { name: 'Sétima Maior', short: '7M' }
    };

    /**
     * Normaliza qualquer nota para o índice cromático (0 a 11, onde C = 0)
     */
    static getNoteIndex(note) {
        if (!note) return -1;
        const cleanNote = note.trim();
        const standardized = this.ENHARMONIC_MAP[cleanNote] || cleanNote;
        return this.NOTES_SHARP.indexOf(standardized);
    }

    /**
     * Retorna o nome da nota dado um índice cromático
     */
    static getNoteByIndex(index, useFlat = false) {
        const normalized = ((index % 12) + 12) % 12;
        return useFlat ? this.NOTES_FLAT[normalized] : this.NOTES_SHARP[normalized];
    }

    /**
     * Calcula a nota resultante a partir de uma tônica e um intervalo em semitons
     */
    static transposeNote(rootNote, semitones, useFlat = false) {
        const rootIdx = this.getNoteIndex(rootNote);
        if (rootIdx === -1) return rootNote;
        return this.getNoteByIndex(rootIdx + semitones, useFlat);
    }

    /**
     * Retorna o intervalo em semitons entre duas notas (0 a 11)
     */
    static getInterval(rootNote, targetNote) {
        const r = this.getNoteIndex(rootNote);
        const t = this.getNoteIndex(targetNote);
        if (r === -1 || t === -1) return 0;
        return ((t - r) % 12 + 12) % 12;
    }

    /**
     * Gera as notas de uma escala a partir da nota fundamental e fórmula de semitons
     */
    static generateScaleNotes(rootNote, intervalsFormula, preferFlat = false) {
        const rootIdx = this.getNoteIndex(rootNote);
        if (rootIdx === -1) return [];

        return intervalsFormula.map(semitones => {
            const noteIdx = (rootIdx + semitones) % 12;
            return preferFlat ? this.NOTES_FLAT[noteIdx] : this.NOTES_SHARP[noteIdx];
        });
    }

    /**
     * Calcula o campo harmônico completo (Tríades e Tétrades) de uma escala de 7 notas
     */
    static generateHarmonicField(rootNote, scaleIntervals, type = 'major') {
        const scaleNotes = this.generateScaleNotes(rootNote, scaleIntervals);
        if (scaleNotes.length < 7) return [];

        const degreeNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

        // Regras de qualidades de acordes para escala maior e menor
        const majorTriadQualities = ['', 'm', 'm', '', '', 'm', '°'];
        const majorTetradQualities = ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7(b5)'];
        const majorFunctions = [
            'Tônica (Repouso absoluto)',
            'Subdominante (Afastamento suave)',
            'Tônica secundária (Estabilidade)',
            'Subdominante (Afastamento)',
            'Dominante (Tensão e resolução no I)',
            'Tônica / Relativo menor (Repouso)',
            'Dominante (Tensão máxima / Sensível)'
        ];

        const minorTriadQualities = ['m', '°', '', 'm', 'm', '', ''];
        const minorTetradQualities = ['m7', 'm7(b5)', 'maj7', 'm7', 'm7', 'maj7', '7'];
        const minorFunctions = [
            'Tônica menor (Repouso)',
            'Subdominante (Tensão preparatória)',
            'Relativo Maior (Estabilidade)',
            'Subdominante',
            'Dominante modal (ou V7 na harmônica)',
            'Subdominante / Tônica de apoio',
            'Subtônica / Dominante modal'
        ];

        const isMinor = type.toLowerCase().includes('min');
        const triadQualities = isMinor ? minorTriadQualities : majorTriadQualities;
        const tetradQualities = isMinor ? minorTetradQualities : majorTetradQualities;
        const functions = isMinor ? minorFunctions : majorFunctions;

        return scaleNotes.slice(0, 7).map((note, i) => {
            const triadName = `${note}${triadQualities[i]}`;
            const tetradName = `${note}${tetradQualities[i]}`;
            
            // Notas da tríade: fundamental (grau 1), terça (grau 3), quinta (grau 5) da escala
            const triadNotes = [
                scaleNotes[i],
                scaleNotes[(i + 2) % 7],
                scaleNotes[(i + 4) % 7]
            ];

            // Notas da tétrade: adiciona a sétima (grau 7)
            const tetradNotes = [
                ...triadNotes,
                scaleNotes[(i + 6) % 7]
            ];

            return {
                degree: degreeNumerals[i],
                rootNote: note,
                triad: triadName,
                triadNotes,
                tetrad: tetradName,
                tetradNotes,
                harmonicFunction: functions[i]
            };
        });
    }

    /**
     * Retorna o acorde relativo (maior <-> menor)
     */
    static getRelative(note, isMajor = true) {
        const rootIdx = this.getNoteIndex(note);
        if (rootIdx === -1) return null;

        if (isMajor) {
            // Relativo menor fica 9 semitones acima ou 3 semitons abaixo (grau VI)
            const minorNote = this.getNoteByIndex(rootIdx + 9);
            return {
                original: `${note}`,
                relative: `${minorNote}m`,
                relationship: `Relativo Menor (grau VI de ${note})`
            };
        } else {
            // Relativo maior fica 3 semitons acima
            const majorNote = this.getNoteByIndex(rootIdx + 3);
            return {
                original: `${note}m`,
                relative: `${majorNote}`,
                relationship: `Relativo Maior (grau III de ${note}m)`
            };
        }
    }

    /**
     * Retorna os tons vizinhos (diretos e indiretos)
     */
    static getNeighborTones(rootNote) {
        const rIdx = this.getNoteIndex(rootNote);
        if (rIdx === -1) return null;

        const dominant = this.getNoteByIndex(rIdx + 7);
        const subdominant = this.getNoteByIndex(rIdx + 5);
        const relTonic = this.getNoteByIndex(rIdx + 9);
        const relDominant = this.getNoteByIndex(rIdx + 7 + 9);
        const relSubdominant = this.getNoteByIndex(rIdx + 5 + 9);
        const parallelMinor = `${rootNote}m`;

        return {
            tonic: rootNote,
            directNeighbors: [
                { role: 'Dominante (5ª Justa)', note: dominant },
                { role: 'Subdominante (4ª Justa)', note: subdominant },
                { role: 'Relativo Menor', note: `${relTonic}m` },
                { role: 'Relativo da Dominante', note: `${relDominant}m` },
                { role: 'Relativo da Subdominante', note: `${relSubdominant}m` }
            ],
            parallelKey: { role: 'Tom Homônimo / Paralelo', note: parallelMinor }
        };
    }

    /**
     * Dados estruturados do Círculo de Quintas
     * Ordenado no sentido horário (de C com 0 acidentes, quintas ascendentes até F com 1 bemol)
     */
    static getCircleOfFifthsData() {
        return [
            { key: 'C',  relativeMinor: 'Am',  accidentals: 0, type: 'natural', label: 'Nenhum' },
            { key: 'G',  relativeMinor: 'Em',  accidentals: 1, type: 'sharp',   label: '1 Sustenido (F#)' },
            { key: 'D',  relativeMinor: 'Bm',  accidentals: 2, type: 'sharp',   label: '2 Sustenidos (F#, C#)' },
            { key: 'A',  relativeMinor: 'F#m', accidentals: 3, type: 'sharp',   label: '3 Sustenidos (F#, C#, G#)' },
            { key: 'E',  relativeMinor: 'C#m', accidentals: 4, type: 'sharp',   label: '4 Sustenidos (F#, C#, G#, D#)' },
            { key: 'B',  relativeMinor: 'G#m', accidentals: 5, type: 'sharp',   label: '5 Sustenidos (F#, C#, G#, D#, A#)' },
            { key: 'F#', relativeMinor: 'D#m', accidentals: 6, type: 'sharp',   label: '6 Sustenidos / 6 Bemóis (Gb / Ebm)' },
            { key: 'Db', relativeMinor: 'Bbm', accidentals: 5, type: 'flat',    label: '5 Bemóis (Bb, Eb, Ab, Db, Gb)' },
            { key: 'Ab', relativeMinor: 'Fm',  accidentals: 4, type: 'flat',    label: '4 Bemóis (Bb, Eb, Ab, Db)' },
            { key: 'Eb', relativeMinor: 'Cm',  accidentals: 3, type: 'flat',    label: '3 Bemóis (Bb, Eb, Ab)' },
            { key: 'Bb', relativeMinor: 'Gm',  accidentals: 2, type: 'flat',    label: '2 Bemóis (Bb, Eb)' },
            { key: 'F',  relativeMinor: 'Dm',  accidentals: 1, type: 'flat',    label: '1 Bemol (Bb)' }
        ];
    }
}
