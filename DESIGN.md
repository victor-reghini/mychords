# DESIGN.md - Caderno de Teoria Musical & Instrumentos (Editorial Sheet-Music / Studio Handbook)

## 1. Identidade e Atmosfera
- **Conceito:** O projeto é estruturado como um caderno editorial de mestre da música e manual de estúdio ("Studio Handbook & Sheet-Music Reference"). Combina a sobriedade, calor e clareza de partituras e livros clássicos de harmonia (Kostka-Payne, Schoenberg, Almir Chediak, Ian Guest) com a precisão de um laboratório interativo para músicos contemporâneos.
- **Público:** Músicos iniciantes, intermediários e avançados, arranjadores, compositores e estudantes de cordas e teclas.
- **Dials (antislop):** ENERGY 2 / RHYTHM 2 / MOTION 1.
  - *Energy 2:* Equilibrado, tipografia imponente e acolhedora, sem ruídos desnecessários.
  - *Rhythm 2:* Seções estruturadas com variação entre laboratórios práticos (braço/teclado), diagramas circulares (círculo de quintas) e tabelas harmônicas comparativas.
  - *Motion 1:* Transições táteis e sutis nos cliques e hover, sem animações flutuantes ou distrativas.

## 2. Paleta de Cores e Sistema de Temas

### Modo Claro (Prioritário - Papel Marfim / Partitura)
- **Fundo Base:** `#FBF9F5` (Marfim suave de partitura)
- **Fundo Cartões / Superfícies:** `#FFFFFF` (Branco limpo com bordas orgânicas)
- **Bordas / Linhas:** `#E5DFD5` e `#D6CDC0` (Sépia/cinza suave)
- **Texto Primário:** `#1F2228` (Tinta nanquim escura de alta legibilidade)
- **Texto Secundário / Pautas:** `#555C68` (Grafite médio neutro)
- **Acento Primário (Âmbar Estúdio):** `#B86B00` / `#C27803`
- **Tônica / Raiz (Fundamental):** `#A82233` (Rubi partitura clássico)
- **Terça:** `#1B7368` (Esmeralda jade suave)
- **Quinta:** `#B86B00` (Âmbar quente)
- **Sétima:** `#3F51B5` (Índigo estúdio)
- **Outras notas / Extensões:** `#5A6B82` (Ardósia musical)

### Modo Escuro (Quadro-Negro de Conservatório / Estúdio Noturno)
- **Fundo Base:** `#121417` (Ardósia profunda)
- **Fundo Cartões / Superfícies:** `#1A1D22` (Carvão estruturado)
- **Bordas / Linhas:** `#2B303A` (Cinza carvão refinado)
- **Texto Primário:** `#F2EFE9` (Marfim claro de alta legibilidade)
- **Texto Secundário:** `#A1A7B2` (Prata grafite suave)
- **Acento Primário (Âmbar Estúdio):** `#E59819`
- **Tônica / Raiz (Fundamental):** `#E0485C` (Coral carmesim vibrante)
- **Terça:** `#2DB8A1` (Menta azulada límpida)
- **Quinta:** `#F5AC2B` (Ouro âmbar)
- **Sétima:** `#6C7CE8` (Lavanda azulada)
- **Outras notas / Extensões:** `#8BA2BD` (Céu acinzentado)

### Adaptação de Tema
- O app detecta `window.matchMedia('(prefers-color-scheme: dark)')` por padrão.
- Oferece seletor explícito de 3 opções: `Claro`, `Escuro`, `Sistema`. A escolha é persistida em `localStorage`.

## 3. Tipografia
- **Títulos e Tonalidades:** Fontes Serifadas clássicas e expressivas (`Playfair Display`, `Georgia`, `Baskerville`, `serif`).
- **Controles Técnicos, Notas e Rótulos:** Sans-serif moderno de traçado limpo (`system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`).
- **Hierarquia:** Contraste claro entre o nome do acorde/escala e os graus/intervalos.

## 4. Filosofia Mobile-First e Usabilidade
- Todos os botões e seletores têm altura mínima de 44px e área de toque generosa.
- O braço de cordas possui visualização horizontal com rolagem e navegação intuitiva, e um modo de braço vertical projetado para manuseio em smartphones com uma mão.
- O teclado de piano possui teclas brancas e pretas proporcionais, com rolagem horizontal e indicação de oitavas.
- O Círculo de Quintas é vetorizado em SVG, garantindo nitidez matemática em qualquer resolução.
- Áudio sintetizado via Web Audio API: ao tocar em qualquer nota no braço, tecla do piano ou acorde, o som soa imediatamente sem latência de rede.
