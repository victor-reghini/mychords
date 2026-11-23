/**
 * ScalesData.js
 * Catálogo completo de escalas musicais, modos gregos e escalas étnicas.
 * Intervalos expressos em semitons em relação à tônica (0).
 */

export const SCALES_DATA = [
    {
        id: 'major',
        name: 'Escala Maior (Modo Jônio)',
        category: 'Diatônica',
        intervals: [0, 2, 4, 5, 7, 9, 11],
        formula: 'T - T - ST - T - T - T - ST',
        description: 'Base harmônica da música ocidental. Transmite sensação de brilho, clareza e repouso.',
        degrees: ['1', '2M', '3M', '4J', '5J', '6M', '7M']
    },
    {
        id: 'natural-minor',
        name: 'Escala Menor Natural (Modo Eólio)',
        category: 'Diatônica',
        intervals: [0, 2, 3, 5, 7, 8, 10],
        formula: 'T - ST - T - T - ST - T - T',
        description: 'Relativa da escala maior. Sonoridade melancólica, profunda e introspectiva.',
        degrees: ['1', '2M', '3m', '4J', '5J', '6m', '7m']
    },
    {
        id: 'harmonic-minor',
        name: 'Escala Menor Harmônica',
        category: 'Menores',
        intervals: [0, 2, 3, 5, 7, 8, 11],
        formula: 'T - ST - T - T - ST - 1.5T - ST',
        description: 'Apresenta a 7ª maior (sensível) criando o acorde dominante V7 na tonalidade menor.',
        degrees: ['1', '2M', '3m', '4J', '5J', '6m', '7M']
    },
    {
        id: 'melodic-minor',
        name: 'Escala Menor Melódica (Bachiana)',
        category: 'Menores',
        intervals: [0, 2, 3, 5, 7, 9, 11],
        formula: 'T - ST - T - T - T - T - ST',
        description: 'Eleva a 6ª e a 7ª notas, suavizando o salto de 2ª aumentada da harmônica.',
        degrees: ['1', '2M', '3m', '4J', '5J', '6M', '7M']
    },
    {
        id: 'dorian',
        name: 'Modo Dórico (Grau II)',
        category: 'Modos Gregos',
        intervals: [0, 2, 3, 5, 7, 9, 10],
        formula: 'T - ST - T - T - T - ST - T',
        description: 'Menor com a 6ª maior (nota característica). Típico do jazz, blues, fusion e MPB.',
        degrees: ['1', '2M', '3m', '4J', '5J', '6M', '7m']
    },
    {
        id: 'phrygian',
        name: 'Modo Frígio (Grau III)',
        category: 'Modos Gregos',
        intervals: [0, 1, 3, 5, 7, 8, 10],
        formula: 'ST - T - T - T - ST - T - T',
        description: 'Menor com 2ª menor (nota característica). Sonoridade flamenca, hispânica e misteriosa.',
        degrees: ['1', '2m', '3m', '4J', '5J', '6m', '7m']
    },
    {
        id: 'lydian',
        name: 'Modo Lídio (Grau IV)',
        category: 'Modos Gregos',
        intervals: [0, 2, 4, 6, 7, 9, 11],
        formula: 'T - T - T - ST - T - T - ST',
        description: 'Maior com 4ª aumentada (nota característica). Sonoridade etérea, cósmica e cinematográfica.',
        degrees: ['1', '2M', '3M', '4#', '5J', '6M', '7M']
    },
    {
        id: 'mixolydian',
        name: 'Modo Mixolídio (Grau V)',
        category: 'Modos Gregos',
        intervals: [0, 2, 4, 5, 7, 9, 10],
        formula: 'T - T - ST - T - T - ST - T',
        description: 'Maior com 7ª menor (nota característica). Clássico do baião, forró, rock clássico e blues.',
        degrees: ['1', '2M', '3M', '4J', '5J', '6M', '7m']
    },
    {
        id: 'locrian',
        name: 'Modo Lócrio (Grau VII)',
        category: 'Modos Gregos',
        intervals: [0, 1, 3, 5, 6, 8, 10],
        formula: 'ST - T - T - ST - T - T - T',
        description: 'Único modo diatônico com 5ª diminuta. Instabilidade máxima e tensão suspensa.',
        degrees: ['1', '2m', '3m', '4J', '5b', '6m', '7m']
    },
    {
        id: 'major-pentatonic',
        name: 'Pentatônica Maior',
        category: 'Pentatônicas',
        intervals: [0, 2, 4, 7, 9],
        formula: 'T - T - 1.5T - T - 1.5T',
        description: 'Remove os semitons (graus 4 e 7 da maior), garantindo consonância absoluta.',
        degrees: ['1', '2M', '3M', '5J', '6M']
    },
    {
        id: 'minor-pentatonic',
        name: 'Pentatônica Menor',
        category: 'Pentatônicas',
        intervals: [0, 3, 5, 7, 10],
        formula: '1.5T - T - T - 1.5T - T',
        description: 'A escala mais popular na guitarra e solos de rock, blues e pop.',
        degrees: ['1', '3m', '4J', '5J', '7m']
    },
    {
        id: 'blues',
        name: 'Escala Blues (com Blue Note)',
        category: 'Blues & Jazz',
        intervals: [0, 3, 5, 6, 7, 10],
        formula: '1.5T - T - ST - ST - 1.5T - T',
        description: 'Pentatônica menor adicionada da 4ª aumentada / 5ª diminuta (a célebre "blue note").',
        degrees: ['1', '3m', '4J', '5b (Blue)', '5J', '7m']
    },
    {
        id: 'whole-tone',
        name: 'Escala de Tons Inteiros (Hexafônica)',
        category: 'Simétricas',
        intervals: [0, 2, 4, 6, 8, 10],
        formula: 'T - T - T - T - T - T',
        description: 'Escala simétrica impressionista (Debussy). Sonoridade sonhadora sem centro tonal fixo.',
        degrees: ['1', '2M', '3M', '5b', '5#', '7m']
    },
    {
        id: 'diminished',
        name: 'Escala Diminuta (Tom-Semitom)',
        category: 'Simétricas',
        intervals: [0, 2, 3, 5, 6, 8, 9, 11],
        formula: 'T - ST - T - ST - T - ST - T - ST',
        description: 'Escala octatônica simétrica fundamental para improvisação sobre acordes diminutos.',
        degrees: ['1', '2M', '3m', '4J', '5b', '6m', '6M', '7M']
    },
    {
        id: 'hirajoshi',
        name: 'Escala Hirajoshi',
        category: 'Étnicas & Orientais',
        intervals: [0, 2, 3, 7, 8],
        formula: 'T - ST - 2T - ST - 2T',
        description: 'Escala pentatônica tradicional japonesa para koto e shamisen.',
        degrees: ['1', '2M', '3m', '5J', '6m']
    },
    {
        id: 'arabic',
        name: 'Escala Árabe / Bizantina',
        category: 'Étnicas & Orientais',
        intervals: [0, 1, 4, 5, 7, 8, 11],
        formula: 'ST - 1.5T - ST - T - ST - 1.5T - ST',
        description: 'Escala com duas segundas aumentadas, de sabor oriental e exótico.',
        degrees: ['1', '2m', '3M', '4J', '5J', '6m', '7M']
    }
];
