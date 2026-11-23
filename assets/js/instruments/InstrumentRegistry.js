/**
 * InstrumentRegistry.js
 * Registro e configuração dos instrumentos musicais (cordas e teclas).
 * Princípio Aberto/Fechado (OCP): novos instrumentos ou afinações podem ser
 * adicionados sem modificar o restante do sistema.
 */

export const INSTRUMENTS = {
    'guitar': {
        id: 'guitar',
        name: 'Violão / Guitarra (6 cordas)',
        type: 'fretboard',
        frets: 15,
        defaultTuning: 'standard',
        tunings: {
            'standard': {
                name: 'Padrão (E A D G B E)',
                strings: [
                    { name: '1ª (E4)', openNote: 'E', octave: 4 },
                    { name: '2ª (B3)', openNote: 'B', octave: 3 },
                    { name: '3ª (G3)', openNote: 'G', octave: 3 },
                    { name: '4ª (D3)', openNote: 'D', octave: 3 },
                    { name: '5ª (A2)', openNote: 'A', octave: 2 },
                    { name: '6ª (E2)', openNote: 'E', octave: 2 }
                ]
            },
            'drop-d': {
                name: 'Drop D (D A D G B E)',
                strings: [
                    { name: '1ª (E4)', openNote: 'E', octave: 4 },
                    { name: '2ª (B3)', openNote: 'B', octave: 3 },
                    { name: '3ª (G3)', openNote: 'G', octave: 3 },
                    { name: '4ª (D3)', openNote: 'D', octave: 3 },
                    { name: '5ª (A2)', openNote: 'A', octave: 2 },
                    { name: '6ª (D2)', openNote: 'D', octave: 2 }
                ]
            },
            'dadgad': {
                name: 'DADGAD (Celta / Aberta)',
                strings: [
                    { name: '1ª (D4)', openNote: 'D', octave: 4 },
                    { name: '2ª (A3)', openNote: 'A', octave: 3 },
                    { name: '3ª (G3)', openNote: 'G', octave: 3 },
                    { name: '4ª (D3)', openNote: 'D', octave: 3 },
                    { name: '5ª (A2)', openNote: 'A', octave: 2 },
                    { name: '6ª (D2)', openNote: 'D', octave: 2 }
                ]
            }
        }
    },
    'guitar-7': {
        id: 'guitar-7',
        name: 'Guitarra (7 cordas)',
        type: 'fretboard',
        frets: 15,
        defaultTuning: 'standard',
        tunings: {
            'standard': {
                name: 'Padrão 7 Cordas (B E A D G B E)',
                strings: [
                    { name: '1ª (E4)', openNote: 'E', octave: 4 },
                    { name: '2ª (B3)', openNote: 'B', octave: 3 },
                    { name: '3ª (G3)', openNote: 'G', octave: 3 },
                    { name: '4ª (D3)', openNote: 'D', octave: 3 },
                    { name: '5ª (A2)', openNote: 'A', octave: 2 },
                    { name: '6ª (E2)', openNote: 'E', octave: 2 },
                    { name: '7ª (B1)', openNote: 'B', octave: 1 }
                ]
            }
        }
    },
    'bass-4': {
        id: 'bass-4',
        name: 'Contrabaixo (4 cordas)',
        type: 'fretboard',
        frets: 15,
        defaultTuning: 'standard',
        tunings: {
            'standard': {
                name: 'Padrão (E A D G)',
                strings: [
                    { name: '1ª (G2)', openNote: 'G', octave: 2 },
                    { name: '2ª (D2)', openNote: 'D', octave: 2 },
                    { name: '3ª (A1)', openNote: 'A', octave: 1 },
                    { name: '4ª (E1)', openNote: 'E', octave: 1 }
                ]
            },
            'drop-d': {
                name: 'Drop D (D A D G)',
                strings: [
                    { name: '1ª (G2)', openNote: 'G', octave: 2 },
                    { name: '2ª (D2)', openNote: 'D', octave: 2 },
                    { name: '3ª (A1)', openNote: 'A', octave: 1 },
                    { name: '4ª (D1)', openNote: 'D', octave: 1 }
                ]
            }
        }
    },
    'bass-5': {
        id: 'bass-5',
        name: 'Contrabaixo (5 cordas)',
        type: 'fretboard',
        frets: 15,
        defaultTuning: 'standard',
        tunings: {
            'standard': {
                name: 'Padrão com Si Grave (B E A D G)',
                strings: [
                    { name: '1ª (G2)', openNote: 'G', octave: 2 },
                    { name: '2ª (D2)', openNote: 'D', octave: 2 },
                    { name: '3ª (A1)', openNote: 'A', octave: 1 },
                    { name: '4ª (E1)', openNote: 'E', octave: 1 },
                    { name: '5ª (B0)', openNote: 'B', octave: 0 }
                ]
            }
        }
    },
    'ukulele': {
        id: 'ukulele',
        name: 'Ukulele (Soprano / Concerto)',
        type: 'fretboard',
        frets: 13,
        defaultTuning: 'standard',
        tunings: {
            'standard': {
                name: 'Padrão Reentrante (G C E A)',
                strings: [
                    { name: '1ª (A4)', openNote: 'A', octave: 4 },
                    { name: '2ª (E4)', openNote: 'E', octave: 4 },
                    { name: '3ª (C4)', openNote: 'C', octave: 4 },
                    { name: '4ª (G4)', openNote: 'G', octave: 4 }
                ]
            },
            'd-tuning': {
                name: 'Afinação em Ré (A D F# B)',
                strings: [
                    { name: '1ª (B4)', openNote: 'B', octave: 4 },
                    { name: '2ª (F#4)', openNote: 'F#', octave: 4 },
                    { name: '3ª (D4)', openNote: 'D', octave: 4 },
                    { name: '4ª (A4)', openNote: 'A', octave: 4 }
                ]
            }
        }
    },
    'viola': {
        id: 'viola',
        name: 'Viola Caipira (10 cordas / 5 pares)',
        type: 'fretboard',
        frets: 12,
        defaultTuning: 'cebolao-mi',
        tunings: {
            'cebolao-mi': {
                name: 'Cebolão em Mi (B E G# B E)',
                strings: [
                    { name: '1º Par (E4)', openNote: 'E', octave: 4, label: '1º Par (Mi)' },
                    { name: '2º Par (B3)', openNote: 'B', octave: 3, label: '2º Par (Si)' },
                    { name: '3º Par (G#3)', openNote: 'G#', octave: 3, label: '3º Par (Sol#)' },
                    { name: '4º Par (E3)', openNote: 'E', octave: 3, label: '4º Par (Mi)' },
                    { name: '5º Par (B2)', openNote: 'B', octave: 2, label: '5º Par (Si grave)' }
                ]
            },
            'cebolao-re': {
                name: 'Cebolão em Ré (A D F# A D)',
                strings: [
                    { name: '1º Par (D4)', openNote: 'D', octave: 4, label: '1º Par (Ré)' },
                    { name: '2º Par (A3)', openNote: 'A', octave: 3, label: '2º Par (Lá)' },
                    { name: '3º Par (F#3)', openNote: 'F#', octave: 3, label: '3º Par (Fá#)' },
                    { name: '4º Par (D3)', openNote: 'D', octave: 3, label: '4º Par (Ré)' },
                    { name: '5º Par (A2)', openNote: 'A', octave: 2, label: '5º Par (Lá grave)' }
                ]
            },
            'rio-abaixo': {
                name: 'Rio Abaixo em Sol (G D G B D)',
                strings: [
                    { name: '1º Par (D4)', openNote: 'D', octave: 4, label: '1º Par (Ré)' },
                    { name: '2º Par (B3)', openNote: 'B', octave: 3, label: '2º Par (Si)' },
                    { name: '3º Par (G3)', openNote: 'G', octave: 3, label: '3º Par (Sol)' },
                    { name: '4º Par (D3)', openNote: 'D', octave: 3, label: '4º Par (Ré)' },
                    { name: '5º Par (G2)', openNote: 'G', octave: 2, label: '5º Par (Sol grave)' }
                ]
            }
        }
    },
    'violin': {
        id: 'violin',
        name: 'Violino (G D A E)',
        type: 'fretboard',
        frets: 12,
        isFretless: true, // Guia pedagógico de posições
        defaultTuning: 'standard',
        tunings: {
            'standard': {
                name: 'Padrão por Quintas (G D A E)',
                strings: [
                    { name: '1ª (E5)', openNote: 'E', octave: 5 },
                    { name: '2ª (A4)', openNote: 'A', octave: 4 },
                    { name: '3ª (D4)', openNote: 'D', octave: 4 },
                    { name: '4ª (G3)', openNote: 'G', octave: 3 }
                ]
            }
        }
    },
    'piano': {
        id: 'piano',
        name: 'Piano / Teclado',
        type: 'keyboard',
        startNote: 'C3',
        octaves: 3, // C3 a B5 (36 teclas)
        tunings: {
            'standard': {
                name: 'Teclado Cromático (3 Oitavas)',
                strings: [] // Não usa cordas
            }
        }
    }
};
