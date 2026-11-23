/**
 * generate-apostila.js
 * Gera a Apostila Completa de Teoria Musical em PDF de alta qualidade gráfica.
 * Utiliza PDFKit com tipografia cuidada, cabeçalhos, rodapés e tabelas harmônicas.
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.resolve(__dirname, '../assets/apostila-teoria-musical.pdf');

// Garante que o diretório assets exista
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    bufferPages: true
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Cores do tema Editorial
const COLOR_INK = '#1A1D20';
const COLOR_AMBER = '#B86B00';
const COLOR_RUBY = '#A82233';
const COLOR_MUTED = '#5A6270';
const COLOR_BORDER = '#D5CCC0';
const COLOR_BG_LIGHT = '#F6F3ED';

// ==========================================
// CAPA EDITORIAL
// ==========================================
doc.rect(40, 40, 515, 762).lineWidth(2).stroke(COLOR_AMBER);
doc.rect(46, 46, 503, 750).lineWidth(0.8).stroke(COLOR_BORDER);

doc.moveDown(4);
doc.fontSize(12).font('Helvetica-Bold').fillColor(COLOR_AMBER).text('MYCHORDS • CADERNO DE ESTUDOS', { align: 'center', characterSpacing: 2 });
doc.moveDown(1.5);
doc.fontSize(28).font('Times-Bold').fillColor(COLOR_INK).text('APOSTILA COMPLETA DE', { align: 'center' });
doc.fontSize(32).font('Times-Bold').fillColor(COLOR_AMBER).text('TEORIA & HARMONIA MUSICAL', { align: 'center' });
doc.moveDown(1);
doc.fontSize(13).font('Times-Italic').fillColor(COLOR_MUTED).text('Escalas, Campos Harmônicos, Círculo de Quintas e Guia Prático de Instrumentos', { align: 'center' });

doc.moveDown(3);
// Divisor ornamental
doc.fontSize(14).font('Helvetica').fillColor(COLOR_AMBER).text('❖   ❖   ❖', { align: 'center' });
doc.moveDown(3);

doc.fontSize(11).font('Helvetica').fillColor(COLOR_INK).text(
    'Um guia definitivo para instrumentistas de cordas e teclas:\nViolão, Guitarra, Contrabaixo, Ukulele, Viola Caipira, Violino e Piano.',
    { align: 'center', lineGap: 4 }
);

doc.moveDown(8);
doc.fontSize(10).font('Helvetica-Bold').fillColor(COLOR_MUTED).text('EDIÇÃO COMPLETA DE CONSULTA • ESTÚDIO MYCHORDS', { align: 'center' });
doc.fontSize(9).font('Helvetica').fillColor(COLOR_MUTED).text('Material de distribuição autorizada para o aluno comprador', { align: 'center' });

// ==========================================
// SUMÁRIO / ÍNDICE
// ==========================================
doc.addPage();
drawPageHeader('SUMÁRIO GERAL');

doc.fontSize(11).font('Helvetica-Bold').fillColor(COLOR_INK);
const tocItems = [
    { title: 'Módulo 1: Fundamentos da Teoria Musical e Intervalos', page: '03' },
    { title: 'Módulo 2: O Círculo de Quintas e Armaduras de Clave', page: '05' },
    { title: 'Módulo 3: Escalas Musicais e Modos Gregos', page: '07' },
    { title: 'Módulo 4: Campo Harmônico Maior e Menor (Tríades e Tétrades)', page: '09' },
    { title: 'Módulo 5: Funções Harmônicas e Cadências Clássicas', page: '11' },
    { title: 'Módulo 6: Guia Prático de Afinações e Braço dos Instrumentos', page: '13' },
    { title: 'Tabelas de Consulta Rápida de Todos os 12 Tons', page: '15' }
];

doc.moveDown(1);
tocItems.forEach(item => {
    doc.font('Helvetica-Bold').fillColor(COLOR_INK).text(item.title, 60, doc.y, { continued: true });
    doc.font('Helvetica').fillColor(COLOR_MUTED).text(` ..................................................................... ${item.page}`, { align: 'right' });
    doc.moveDown(0.8);
});

// ==========================================
// MÓDULO 1: FUNDAMENTOS E INTERVALOS
// ==========================================
doc.addPage();
drawPageHeader('MÓDULO 1: FUNDAMENTOS E INTERVALOS');

doc.fontSize(13).font('Times-Bold').fillColor(COLOR_AMBER).text('1. As 12 Notas e o Sistema Temperado');
doc.fontSize(10).font('Helvetica').fillColor(COLOR_INK).text(
    'A música ocidental é baseada na divisão da oitava em 12 semitons iguais (escala cromática temperada). As notas naturais são Dó, Ré, Mi, Fá, Sol, Lá e Si. Entre a maioria delas há uma distância de 1 tom (2 semitons), com exceção de Mi para Fá e de Si para Dó, onde a distância natural é de apenas meio tom (1 semitom).\n' +
    'As alterações cromáticas são o Sustenido (#), que eleva a nota em 1 semitom, e o Bemol (b), que abaixa a nota em 1 semitom. Notas com nomes diferentes e mesmo som são chamadas de Enarmônicas (ex: Dó# e Réb).',
    { lineGap: 3 }
);

doc.moveDown(1);
doc.fontSize(13).font('Times-Bold').fillColor(COLOR_AMBER).text('2. Tabela Fundamental de Intervalos');
doc.fontSize(10).font('Helvetica').fillColor(COLOR_INK).text('O intervalo é a distância acústica e teórica entre duas notas:', { lineGap: 2 });
doc.moveDown(0.5);

const intervalsData = [
    ['Intervalo', 'Semitons', 'Exemplo em Dó (C)', 'Classificação e Caráter'],
    ['Tônica / Fundamental', '0', 'C', 'Ponto de partida / Repouso absoluto'],
    ['Segunda menor (2m)', '1', 'Db / C#', 'Dissonância forte / Tensão'],
    ['Segunda Maior (2M)', '2', 'D', 'Passagem melódica suave'],
    ['Terça menor (3m)', '3', 'Eb / D#', 'Define a qualidade do acorde Menor'],
    ['Terça Maior (3M)', '4', 'E', 'Define a qualidade do acorde Maior'],
    ['Quarta Justa (4J)', '5', 'F', 'Consonância perfeita / Subdominante'],
    ['Trítono (4# / 5b)', '6', 'F# / Gb', 'Tensão máxima (divide a oitava ao meio)'],
    ['Quinta Justa (5J)', '7', 'G', 'Estabilidade e suporte harmônico'],
    ['Sexta menor (6m)', '8', 'Ab / G#', 'Cor melancólica / Grau VI menor'],
    ['Sexta Maior (6M)', '9', 'A', 'Brilho / Relativo menor / Grau VI maior'],
    ['Sétima menor (7m)', '10', 'Bb / A#', 'Tétrade dominante e menor'],
    ['Sétima Maior (7M)', '11', 'B', 'Sensível tonal / Acorde maior com 7ª']
];

drawTable(intervalsData, [140, 60, 110, 190]);

// ==========================================
// MÓDULO 2: CÍRCULO DE QUINTAS
// ==========================================
doc.addPage();
drawPageHeader('MÓDULO 2: O CÍRCULO DE QUINTAS');

doc.fontSize(13).font('Times-Bold').fillColor(COLOR_AMBER).text('1. Como Funciona o Círculo de Quintas');
doc.fontSize(10).font('Helvetica').fillColor(COLOR_INK).text(
    'O Círculo de Quintas é a bússola geométrica da harmonia musical. Ele organiza todas as 12 tonalidades maiores e seus respectivos relativos menores em uma roda contínua.\n' +
    '• Sentido Horário (Quintas Ascendentes - 7 semitons): A cada passo, adiciona-se 1 sustenido (#) na armadura de clave na ordem: Fá#, Dó#, Sol#, Ré#, Lá#, Mi#, Si#.\n' +
    '• Sentido Anti-Horário (Quartas Ascendentes / Quintas Descendentes - 5 semitons): A cada passo, adiciona-se 1 bemol (b) na ordem inversa: Sib, Mib, Láb, Réb, Solb, Dób, Fáb.',
    { lineGap: 3 }
);

doc.moveDown(1);
doc.fontSize(13).font('Times-Bold').fillColor(COLOR_AMBER).text('2. Tabela de Armaduras de Clave de Todos os Tons');

const circleTable = [
    ['Tom Maior', 'Relativo Menor', 'Acidentes', 'Notas Alteradas'],
    ['Dó Maior (C)', 'Lá Menor (Am)', '0', 'Nenhuma (escala natural)'],
    ['Sol Maior (G)', 'Mi Menor (Em)', '1 #', 'Fá#'],
    ['Ré Maior (D)', 'Si Menor (Bm)', '2 #', 'Fá#, Dó#'],
    ['Lá Maior (A)', 'Fá# Menor (F#m)', '3 #', 'Fá#, Dó#, Sol#'],
    ['Mi Maior (E)', 'Dó# Menor (C#m)', '4 #', 'Fá#, Dó#, Sol#, Ré#'],
    ['Si Maior (B)', 'Sol# Menor (G#m)', '5 #', 'Fá#, Dó#, Sol#, Ré#, Lá#'],
    ['Fá# Maior (F#)', 'Ré# Menor (D#m)', '6 #', 'Fá#, Dó#, Sol#, Ré#, Lá#, Mi#'],
    ['Réb Maior (Db)', 'Sib Menor (Bbm)', '5 ♭', 'Sib, Mib, Láb, Réb, Solb'],
    ['Láb Maior (Ab)', 'Fá Menor (Fm)', '4 ♭', 'Sib, Mib, Láb, Réb'],
    ['Mib Maior (Eb)', 'Dó Menor (Cm)', '3 ♭', 'Sib, Mib, Láb'],
    ['Sib Maior (Bb)', 'Sol Menor (Gm)', '2 ♭', 'Sib, Mib'],
    ['Fá Maior (F)', 'Ré Menor (Dm)', '1 ♭', 'Sib']
];

drawTable(circleTable, [110, 120, 80, 190]);

// ==========================================
// MÓDULO 3: ESCALAS E MODOS GREGOS
// ==========================================
doc.addPage();
drawPageHeader('MÓDULO 3: ESCALAS E MODOS GREGOS');

doc.fontSize(13).font('Times-Bold').fillColor(COLOR_AMBER).text('1. Os Sete Modos Gregos Diatônicos');
doc.fontSize(10).font('Helvetica').fillColor(COLOR_INK).text(
    'Os modos gregos são as sete rotações modais da escala maior. Cada modo possui uma nota característica (tônica de sabor modal) que dita seu humor musical:',
    { lineGap: 3 }
);
doc.moveDown(0.5);

const modesData = [
    ['Modo', 'Grau Base', 'Fórmula Intervalar', 'Nota Característica e Clima'],
    ['Jônio', 'I (Maior)', '1 - 2M - 3M - 4J - 5J - 6M - 7M', '4ª Justa • Claro, afirmativo'],
    ['Dórico', 'II (Menor)', '1 - 2M - 3m - 4J - 5J - 6M - 7m', '6ª Maior • Jazz, MPB, levemente melancólico'],
    ['Frígio', 'III (Menor)', '1 - 2m - 3m - 4J - 5J - 6m - 7m', '2ª menor • Flamenco, misterioso'],
    ['Lídio', 'IV (Maior)', '1 - 2M - 3M - 4# - 5J - 6M - 7M', '4ª Aumentada • Espacial, cinematográfico'],
    ['Mixolídio', 'V (Maior)', '1 - 2M - 3M - 4J - 5J - 6M - 7m', '7ª menor • Blues, baião, rock clássico'],
    ['Eólio', 'VI (Menor)', '1 - 2M - 3m - 4J - 5J - 6m - 7m', '6ª menor • Menor natural, melancólico'],
    ['Lócrio', 'VII (Dim)', '1 - 2m - 3m - 4J - 5b - 6m - 7m', '5ª Diminuta • Tensão pura, instável']
];

drawTable(modesData, [70, 75, 175, 180]);

doc.moveDown(1);
doc.fontSize(13).font('Times-Bold').fillColor(COLOR_AMBER).text('2. Escalas Pentatônicas e Blues');
doc.fontSize(10).font('Helvetica').fillColor(COLOR_INK).text(
    '• Pentatônica Maior: [1 - 2 - 3 - 5 - 6] (Elimina o trítono da escala maior, permitindo improvisação limpa e sem atritos).\n' +
    '• Pentatônica Menor: [1 - 3m - 4 - 5 - 7m] (A escala mestra dos solos de guitarra e violão no rock, pop e blues).\n' +
    '• Escala Blues: [1 - 3m - 4 - 5b - 5 - 7m] (Adiciona a quinta diminuta / quarta aumentada: a Blue Note, criando o fraseado característico de lamento e tensão do blues).',
    { lineGap: 3 }
);

// ==========================================
// MÓDULO 4: CAMPOS HARMÔNICOS
// ==========================================
doc.addPage();
drawPageHeader('MÓDULO 4: CAMPOS HARMÔNICOS (TRÍADES E TÉTRADES)');

doc.fontSize(13).font('Times-Bold').fillColor(COLOR_AMBER).text('1. Estrutura do Campo Harmônico Maior');
doc.fontSize(10).font('Helvetica').fillColor(COLOR_INK).text(
    'Ao sobrepor terças sobre cada nota da escala maior, obtemos a família de acordes que formam a harmonia tonal.',
    { lineGap: 2 }
);
doc.moveDown(0.5);

const harmonicPatternData = [
    ['Grau', 'Tríade', 'Tétrade (com 7ª)', 'Função Harmônica Tonal'],
    ['I', 'Maior (ex: C)', '7ª Maior (Cmaj7)', 'Tônica (Repouso principal)'],
    ['II', 'Menor (Dm)', 'Menor com 7ª (Dm7)', 'Subdominante (Afastamento suave)'],
    ['III', 'Menor (Em)', 'Menor com 7ª (Em7)', 'Tônica Secundária (Estabilidade)'],
    ['IV', 'Maior (F)', '7ª Maior (Fmaj7)', 'Subdominante (Afastamento forte)'],
    ['V', 'Maior (G)', '7ª Dominante (G7)', 'Dominante (Tensão com trítono para o I)'],
    ['VI', 'Menor (Am)', 'Menor com 7ª (Am7)', 'Tônica / Relativo Menor (Repouso)'],
    ['VII', 'Diminuto (B°)', 'Meio-Diminuto (Bm7b5)', 'Dominante (Tensão / Sensível)']
];

drawTable(harmonicPatternData, [50, 110, 140, 200]);

doc.moveDown(1);
doc.fontSize(13).font('Times-Bold').fillColor(COLOR_AMBER).text('2. Tabela dos 12 Campos Harmônicos Maiores (Tríades)');

const allKeysHarmonic = [
    ['Tom', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII°'],
    ['C', 'C', 'Dm', 'Em', 'F', 'G', 'Am', 'B°'],
    ['G', 'G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#°'],
    ['D', 'D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#°'],
    ['A', 'A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#°'],
    ['E', 'E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#°'],
    ['B', 'B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#°'],
    ['F', 'F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'E°'],
    ['Bb', 'Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm', 'A°'],
    ['Eb', 'Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm', 'D°'],
    ['Ab', 'Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm', 'G°'],
    ['Db', 'Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm', 'C°'],
    ['F#', 'F#', 'G#m', 'A#m', 'B', 'C#', 'D#m', 'E#°']
];

drawTable(allKeysHarmonic, [40, 65, 65, 65, 65, 65, 65, 65]);

// ==========================================
// MÓDULO 5: GUIA PRÁTICO DE INSTRUMENTOS
// ==========================================
doc.addPage();
drawPageHeader('MÓDULO 5: GUIA PRÁTICO DE INSTRUMENTOS');

doc.fontSize(13).font('Times-Bold').fillColor(COLOR_AMBER).text('Afinações e Características dos Instrumentos');
doc.moveDown(0.5);

const instrumentsGuide = [
    ['Instrumento', 'Cordas / Teclas', 'Afinação Padrão', 'Dica de Aplicação Harmônica'],
    ['Violão / Guitarra', '6 Cordas', 'E2 - A2 - D3 - G3 - B3 - E4', 'Afinação por 4ªs e uma 3ªM entre cordas 3 e 2'],
    ['Guitarra 7 Cordas', '7 Cordas', 'B1 - E2 - A2 - D3 - G3 - B3 - E4', 'Grave encorpado para linhas de baixo e jazz'],
    ['Contrabaixo', '4 Cordas', 'E1 - A1 - D2 - G2', 'Fundamento do groove, tríades e notas alvo'],
    ['Contrabaixo 5C', '5 Cordas', 'B0 - E1 - A1 - D2 - G2', 'Extensão para a tônica grave em Ré, Dó e Si'],
    ['Ukulele', '4 Cordas', 'G4 - C4 - E4 - A4 (Reentrante)', 'A 4ª corda é aguda, criando sonoridade doce'],
    ['Viola Caipira', '10 Cordas (5 pares)', 'Cebolão em Mi (B-E-G#-B-E)', 'Pares oitavados nos bordões e uníssonos agudos'],
    ['Violino', '4 Cordas', 'G3 - D4 - A4 - E5 (Quintas)', 'Sem trastes; foco no mapa mental de intervalos'],
    ['Piano / Teclado', 'Teclas brancas/pretas', 'Cromático contínuo', 'Melhor instrumento para visualização de acordes']
];

drawTable(instrumentsGuide, [95, 80, 160, 165]);

doc.moveDown(1.5);
doc.fontSize(12).font('Times-Bold').fillColor(COLOR_AMBER).text('Cadências Harmônicas Fundamentais para Treinar');
doc.fontSize(10).font('Helvetica').fillColor(COLOR_INK).text(
    '1. II - V - I (Cadência Jazz & Bossa Nova): Exemplo em Dó: Dm7 ➔ G7 ➔ Cmaj7.\n' +
    '2. I - IV - V (Cadência Pop, Rock e Blues): Exemplo em Sol: G ➔ C ➔ D7 ➔ G.\n' +
    '3. I - V - vi - IV (Progressão de 4 Acordes Mais Popular): Exemplo em Ré: D ➔ A ➔ Bm ➔ G.\n' +
    '4. I - vi - ii - V (Ciclo Anatole / Turnaround): Exemplo em Dó: Cmaj7 ➔ Am7 ➔ Dm7 ➔ G7.',
    { lineGap: 3 }
);

// Numeração de páginas profissional
const pages = doc.bufferedPageRange();
for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    if (i > 0) { // Não desenha na capa
        doc.fontSize(8).font('Helvetica').fillColor(COLOR_MUTED).text(
            `MyChords • Caderno Editorial de Teoria Musical • Página ${i + 1} de ${pages.count}`,
            50,
            790,
            { align: 'center', width: 495 }
        );
    }
}

doc.end();

function drawPageHeader(title) {
    doc.fontSize(9).font('Helvetica-Bold').fillColor(COLOR_AMBER).text('MYCHORDS • CADERNO DE TEORIA MUSICAL', 50, 45);
    doc.fontSize(15).font('Times-Bold').fillColor(COLOR_INK).text(title, 50, 60);
    doc.moveTo(50, 82).lineTo(545, 82).lineWidth(1).stroke(COLOR_BORDER);
    doc.y = 95;
}

function drawTable(data, colWidths) {
    const startX = 50;
    let currentY = doc.y;
    const rowHeight = 22;

    data.forEach((row, rowIndex) => {
        const isHeader = rowIndex === 0;
        
        // Verifica quebra de página
        if (currentY + rowHeight > 750) {
            doc.addPage();
            drawPageHeader('TABELAS DE CONSULTA RÁPIDA (CONTINUAÇÃO)');
            currentY = doc.y;
        }

        // Fundo da linha
        if (isHeader) {
            doc.rect(startX, currentY, 495, rowHeight).fill(COLOR_BG_LIGHT);
        } else if (rowIndex % 2 === 0) {
            doc.rect(startX, currentY, 495, rowHeight).fill('#FAFAFA');
        }

        doc.rect(startX, currentY, 495, rowHeight).lineWidth(0.5).stroke(COLOR_BORDER);

        let cellX = startX;
        row.forEach((cellText, colIndex) => {
            const width = colWidths[colIndex] || 60;
            doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
               .fontSize(isHeader ? 8.5 : 8)
               .fillColor(isHeader ? COLOR_INK : COLOR_INK);

            doc.text(String(cellText), cellX + 4, currentY + 6, {
                width: width - 8,
                align: 'left',
                lineBreak: false,
                ellipsis: true
            });
            cellX += width;
        });

        currentY += rowHeight;
    });

    doc.y = currentY + 10;
}

writeStream.on('finish', () => {
    console.log(`Apostila gerada com sucesso em: ${outputPath}`);
});
