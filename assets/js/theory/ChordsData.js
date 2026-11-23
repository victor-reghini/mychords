/**
 * ChordsData.js
 * Dicionário estruturado de tipos e fórmulas de acordes.
 * Os intervalos definem a distância em semitons a partir da tônica.
 */

export const CHORD_TYPES = [
    // Tríades
    { id: 'maj', suffix: '', name: 'Maior', intervals: [0, 4, 7], category: 'Tríade' },
    { id: 'min', suffix: 'm', name: 'Menor', intervals: [0, 3, 7], category: 'Tríade' },
    { id: 'dim', suffix: '°', name: 'Diminuto', intervals: [0, 3, 6], category: 'Tríade' },
    { id: 'aug', suffix: 'aug', name: 'Aumentado', intervals: [0, 4, 8], category: 'Tríade' },
    { id: 'sus2', suffix: 'sus2', name: 'Suspenso 2', intervals: [0, 2, 7], category: 'Tríade Suspensa' },
    { id: 'sus4', suffix: 'sus4', name: 'Suspenso 4', intervals: [0, 5, 7], category: 'Tríade Suspensa' },

    // Tétrades
    { id: 'maj7', suffix: 'maj7', name: '7ª Maior', intervals: [0, 4, 7, 11], category: 'Tétrade' },
    { id: '7', suffix: '7', name: '7ª Dominante', intervals: [0, 4, 7, 10], category: 'Tétrade' },
    { id: 'm7', suffix: 'm7', name: 'Menor com 7ª', intervals: [0, 3, 7, 10], category: 'Tétrade' },
    { id: 'm7b5', suffix: 'm7(b5)', name: 'Meio-Diminuto (m7b5)', intervals: [0, 3, 6, 10], category: 'Tétrade' },
    { id: 'dim7', suffix: '°7', name: 'Diminuto com 7ª', intervals: [0, 3, 6, 9], category: 'Tétrade' },
    { id: 'mmaj7', suffix: 'm(maj7)', name: 'Menor com 7ª Maior', intervals: [0, 3, 7, 11], category: 'Tétrade' },
    { id: '7sus4', suffix: '7sus4', name: '7ª Suspenso 4', intervals: [0, 5, 7, 10], category: 'Tétrade Suspensa' },

    // Sextas e Extensões
    { id: '6', suffix: '6', name: 'Sexta Maior', intervals: [0, 4, 7, 9], category: 'Sextas' },
    { id: 'm6', suffix: 'm6', name: 'Menor com Sexta', intervals: [0, 3, 7, 9], category: 'Sextas' },
    { id: 'add9', suffix: 'add9', name: 'Add 9ª', intervals: [0, 4, 7, 2], category: 'Acordes Adicionados' },
    { id: '9', suffix: '9', name: 'Nona Dominante', intervals: [0, 4, 7, 10, 2], category: 'Extensões (9ª)' },
    { id: 'maj9', suffix: 'maj9', name: 'Nona Maior', intervals: [0, 4, 7, 11, 2], category: 'Extensões (9ª)' },
    { id: 'm9', suffix: 'm9', name: 'Menor com Nona', intervals: [0, 3, 7, 10, 2], category: 'Extensões (9ª)' },
    { id: '11', suffix: '11', name: 'Décima Primeira', intervals: [0, 4, 7, 10, 2, 5], category: 'Extensões (11ª)' },
    { id: '13', suffix: '13', name: 'Décima Terceira', intervals: [0, 4, 7, 10, 2, 5, 9], category: 'Extensões (13ª)' },

    // Alterados
    { id: '7b9', suffix: '7(b9)', name: '7ª com Nona menor', intervals: [0, 4, 7, 10, 1], category: 'Alterados' },
    { id: '7sharp9', suffix: '7(#9)', name: '7ª com Nona aumentada (Hendrix)', intervals: [0, 4, 7, 10, 3], category: 'Alterados' },
    { id: '7b5', suffix: '7(b5)', name: '7ª com 5ª diminuta', intervals: [0, 4, 6, 10], category: 'Alterados' },
    { id: '7sharp5', suffix: '7(#5)', name: '7ª com 5ª aumentada', intervals: [0, 4, 8, 10], category: 'Alterados' }
];
