# Instruções para agentes (Codex, Claude, etc.)

Este repositório é o app GRINDER (StackUp Hold'em).

1. Antes de qualquer mudança visual, leia e siga **PADRAO-ESQUADRAO.md** (tema atual). O **PADRAO-GRINDER.md** vale só para estrutura, navegação e idiomas; o visual dele (vidro azul, Bebrush, 12px) foi substituído.
2. Use apenas os tokens `--esq-*` de **grinder-esquadrao-app.css** / **grinder-esquadrao.css**. Nunca crie cores fora deles.
3. Regras do padrão anterior (estrutura e comportamento continuam valendo; o visual abaixo só vale com ?theme=classic):
   - todo texto em 12px (exceto o bloco da marca);
   - Bebrush em tudo, Road Rage só em "GRINDER";
   - todo botão/card em vidro, borda 1px; clicado = vidro azul #155bbd, título #6fa4ff;
   - cantos de 16px; cards de torre sempre quadrados, em grade de 3 colunas, todos do mesmo tamanho;
   - ícones: Material Symbols Outlined em tudo, mesmo ícone para o mesmo destino;
   - toda tela nova em PT, EN e ES;
   - Voltar: subtela → seção → Home → sai do app.
4. O app fica em `index.html` (HTML, CSS e JS, ~130 KB). Fontes e imagens ficam separadas em `assets/`:
   - `assets/bebrush.otf`, `assets/road-rage.woff2` (fontes)
   - `assets/logo-stackup-440.png` (logo do login), `assets/logo-stackup-200.png` (logo do cabeçalho interno)
   - `assets/cartas-relevo.png` (ases em relevo ao fundo)
   Nunca embuta arquivos em base64 no `index.html`: ele precisa ficar abaixo de 1 MB para ser lido e editado por ferramentas.
5. Publicado via GitHub Pages a partir da branch main.
