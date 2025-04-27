
document.addEventListener('DOMContentLoaded', function() {
    // Configuração do braço do violão
    const strings = [
        { name: '1ª', openNote: 'E' },
        { name: '2ª', openNote: 'B' },
        { name: '3ª', openNote: 'G' },
        { name: '4ª', openNote: 'D' },
        { name: '5ª', openNote: 'A' },
        { name: '6ª', openNote: 'E' }
    ];
    
    const frets = 12;
    const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    
    // Elementos do DOM
    const guitarNeck = document.getElementById('guitar-neck');
    const verticalGuitarNeck = document.getElementById('vertical-guitar-neck');
    const toggleLayoutBtn = document.getElementById('toggle-layout');
    const mainContainer = document.getElementById('main-container');
    
    // Estado do layout
    let isVerticalLayout = false;
    let currentChord = null;

    function fetchChords() {
        return fetch('./chords.json')
        .then(response => response.json())
        .catch(err => console.error('Request Failed', err));
    }

    async function createAccordsSelect() {
        const chords_json = await fetchChords();

        chords_json.forEach(chord => {
            const option = document.createElement('option');
            option.value = chord.note;
            option.textContent = chord.name + " (" + chord.note + ")";
            document.getElementById('chord-select').appendChild(option);
        });
    }
    
    // Cria o braço do violão horizontal
    function createHorizontalNeck() {
        guitarNeck.innerHTML = '';
        
        // Cria o cabeçalho com os números das casas
        const headerRow = document.createElement('tr');
        const emptyHeader = document.createElement('th');
        emptyHeader.textContent = '';
        headerRow.appendChild(emptyHeader);
        
        for (let i = 0; i <= frets; i++) {
            const th = document.createElement('th');
            if (i === 0) {
                th.textContent = '';
                th.classList.add('nut');
            } else {
                th.textContent = '';
                // Marcadores de casa (pontos de referência)
                if (i === 12) {
                    th.innerHTML += '<br><span class="fret-number">● ●</span>';
                } else if ([3, 5, 7, 9].includes(i)) {
                    th.innerHTML += '<br><span class="fret-number">●</span>';
                } else {
                    th.classList.add('fret-marker');
                }
            }
            headerRow.appendChild(th);
        }
        
        guitarNeck.appendChild(headerRow);
        
        // Cria as linhas para cada corda
        strings.forEach((string, stringIndex) => {
            const row = document.createElement('tr');
            row.classList.add('string');
            
            const stringName = document.createElement('td');
            stringName.textContent = string.name;
            row.appendChild(stringName);
            
            // Encontra o índice da nota aberta (solta) no array de notas
            let currentNoteIndex = notes.indexOf(string.openNote);
            
            for (let i = 0; i <= frets; i++) {
                const td = document.createElement('td');
                if (i === 0) {
                    td.classList.add('nut', 'open-string');
                    td.textContent = string.openNote;
                    td.dataset.note = string.openNote;
                    td.dataset.string = stringIndex;
                    td.dataset.fret = 0;
                } else {
                    // Avança para a próxima nota
                    currentNoteIndex = (currentNoteIndex + 1) % notes.length;
                    const note = notes[currentNoteIndex];
                    const noteSpan = document.createElement('span');
                    noteSpan.textContent = note;
                    noteSpan.classList.add('note');
                    noteSpan.dataset.note = note;
                    noteSpan.dataset.string = stringIndex;
                    noteSpan.dataset.fret = i;
                    td.appendChild(noteSpan);
                }
                row.appendChild(td);
            }
            
            guitarNeck.appendChild(row);
        });
    }
    
    // Cria o braço do violão vertical
    function createVerticalNeck() {
        verticalGuitarNeck.innerHTML = '';
        
        // Cria a linha do cabeçalho com os números das casas
        const headerRow = document.createElement('div');
        headerRow.classList.add('vertical-row');
        
        const emptyHeader = document.createElement('div');
        emptyHeader.classList.add('vertical-cell', 'vertical-string-name');
        emptyHeader.textContent = 'Casa';
        headerRow.appendChild(emptyHeader);
        
        for (let i = 0; i <= frets; i++) {
            const cell = document.createElement('div');
            cell.classList.add('vertical-cell');
            if (i === 0) {
                cell.textContent = '0';
                cell.classList.add('vertical-nut');
            } else {
                cell.textContent = i.toString();
                // Marcadores de casa (pontos de referência)
                if (i === 3 || i === 5 || i === 7 || i === 9 || i === 12) {
                    cell.style.backgroundColor = 'var(--fret-marker-color)';
                }
            }
            headerRow.appendChild(cell);
        }
        
        verticalGuitarNeck.appendChild(headerRow);
        
        // Cria as linhas para cada corda
        strings.forEach((string, stringIndex) => {
            const row = document.createElement('div');
            row.classList.add('vertical-row');
            
            const stringName = document.createElement('div');
            stringName.classList.add('vertical-cell', 'vertical-string-name');
            stringName.textContent = string.name;
            row.appendChild(stringName);
            
            // Encontra o índice da nota aberta (solta) no array de notas
            let currentNoteIndex = notes.indexOf(string.openNote);
            
            for (let i = 0; i <= frets; i++) {
                const cell = document.createElement('div');
                cell.classList.add('vertical-cell');
                if (i === 0) {
                    cell.classList.add('vertical-nut', 'vertical-open-string');
                    cell.textContent = string.openNote;
                    cell.dataset.note = string.openNote;
                    cell.dataset.string = stringIndex;
                    cell.dataset.fret = 0;
                } else {
                    // Avança para a próxima nota
                    currentNoteIndex = (currentNoteIndex + 1) % notes.length;
                    const note = notes[currentNoteIndex];
                    const noteSpan = document.createElement('span');
                    noteSpan.textContent = note;
                    noteSpan.classList.add('note');
                    noteSpan.dataset.note = note;
                    noteSpan.dataset.string = stringIndex;
                    noteSpan.dataset.fret = i;
                    cell.appendChild(noteSpan);
                }
                row.appendChild(cell);
            }
            
            verticalGuitarNeck.appendChild(row);
        });
    }
    
    // Destacar as notas do acorde
    function highlightChordNotes(chord) {
        // Remove todas as classes de destaque anteriores
        document.querySelectorAll('.note, .nut').forEach(element => {
            element.classList.remove('root', 'second', 'third', 'fourth', 'fifth', 'sixth', 'other');
        });
        
        // Destaca as notas do acorde
        const rootNote = chord.notes[0];
        const secondNote = chord.notes[1];
        const thirdNote = chord.notes[2];
        const fourthNote = chord.notes[3];
        const fifthNote = chord.notes[4];
        const sixthNote = chord.notes[5];
        
        document.querySelectorAll('.note, [data-note]').forEach(element => {
            const noteName = element.dataset.note;
            
            if (noteName === rootNote) {
                element.classList.add('root');
            } else if (noteName === secondNote) {
                element.classList.add('second');
            } else if (noteName === thirdNote) {
                element.classList.add('third');
            } else if (noteName === fourthNote) {
                element.classList.add('fourth');
            } else if (noteName === fifthNote) {
                element.classList.add('fifth');
            } else if (noteName === sixthNote) {
                element.classList.add('sixth');
            } else if (chord.notes.includes(noteName)) {
                element.classList.add('other');
            }
        });
    }
    
    // Alternar entre layouts
    toggleLayoutBtn.addEventListener('click', function() {
        isVerticalLayout = !isVerticalLayout;
        
        if (isVerticalLayout) {
            mainContainer.classList.remove('horizontal-layout');
            mainContainer.classList.add('vertical-layout');
            guitarNeck.style.display = 'none';
            verticalGuitarNeck.style.display = 'block';
            toggleLayoutBtn.textContent = 'Alternar para Layout Horizontal';
        } else {
            mainContainer.classList.remove('vertical-layout');
            mainContainer.classList.add('horizontal-layout');
            guitarNeck.style.display = 'table';
            verticalGuitarNeck.style.display = 'none';
            toggleLayoutBtn.textContent = 'Alternar para Layout Vertical';
        }
        
        // Reaplica o destaque se houver um acorde selecionado
        if (currentChord) {
            highlightChordNotes(currentChord);
        }
    });
    
    // Evento para mostrar o acorde selecionado
    document.getElementById('show-chord').addEventListener('click', async function() {
        const chords_json = await fetchChords();
        const chordSelect = document.getElementById('chord-select');
        const chordKey = chordSelect.value;
        
        if (!chordKey) return;
        
        const chordIndex = chords_json.findIndex(({note}) => note === chordKey);
        currentChord = chords_json[chordIndex];
        const chordNotes = currentChord.notes.join(" - ");
        const harmonicField = currentChord.campo_harmonico.join(" - ");
        document.getElementById('current-chord').textContent = currentChord.name + " (" + chordNotes + ")" + "\n Campo Harmônico: (" + harmonicField + ")";
        
        highlightChordNotes(currentChord);
    });
    
    // Evento para limpar o braço
    document.getElementById('reset').addEventListener('click', function() {
        document.querySelectorAll('.note, .nut').forEach(element => {
            element.classList.remove('root', 'third', 'fifth', 'other');
        });
        document.getElementById('chord-select').value = '';
        document.getElementById('current-chord').textContent = '';
        currentChord = null;
    });
    
    // Inicializa os braços
    createHorizontalNeck();
    createVerticalNeck();
    createAccordsSelect();
});