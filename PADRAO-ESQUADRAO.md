# Padrão ESQUADRÃO (tema visual atual do GRINDER)

Substitui o visual do `PADRAO-GRINDER.md` (vidro azul + Bebrush). Estrutura de telas, navegação, regras de Voltar e os 3 idiomas continuam valendo como no padrão anterior.

## Arquivos
- `grinder-esquadrao.css` — fontes (`@font-face`), splash e tela de login (documento).
- `grinder-esquadrao-app.css` — todas as telas internas (carregado dentro do shadow root `#app2`, sempre por último).
- `core/stackup-esquadrao.js` — liga o tema, mantém a folha do app por último, desenha o perfil de herói, a missão do dia, os atributos em BATALHA e o selo de missão no resultado do spot.
- `assets/logo-esquadrao-440.png` / `assets/logo-esquadrao-200.png` — logo StackUp nas cores do tema (aro e listras em ciano, espada em metal, letras em metal, corpo em aço). Os logos originais continuam em `assets/logo-stackup-*.png` e voltam com `?theme=classic`.
- `assets/fonts/` — Bebas Neue, Barlow e Barlow Condensed (SIL Open Font License, uso comercial liberado).

Desligar o tema: abrir com `?theme=classic` (fica salvo no aparelho). Voltar: `?theme=esquadrao`.

## Fontes
- **Bebas Neue**: títulos, botões principais, números grandes, nomes de cards.
- **Barlow Condensed 600/700**: rótulos, abas, chips, textos curtos em caixa alta (espaçamento 1,5–2,5px).
- **Barlow 500/600**: textos corridos (explicações do solver, legendas).

## Cores (nenhuma outra cor de destaque)
| Token | Cor | Uso |
|---|---|---|
| `--esq-void` | `#07090F` | fundo |
| `--esq-steel-1/2` | `#1F2635` → `#141924` | placas de aço (cards, botões) |
| `--esq-text` / `--esq-muted` | `#EEF2F8` / `#8F9AB0` | texto / texto secundário |
| `--esq-cyan` | `#22C8FF` | energia: ação principal, item ativo, aba ativa |
| `--esq-red` | `#E3263B` | fúria: Raise/All-in, "iniciar missão", destaques |
| `--esq-green` / `--esq-amber` | `#3BE38A` / `#FFB020` | correta / ajustável |

## Formas
- Placa de aço: gradiente steel-1→steel-2, contorno interno 1px `rgba(138,148,168,.28)`, **cantos chanfrados** (`clip-path`, 12px nos cards, 7px em chips/botões pequenos). Nada de vidro/blur.
- Ativo/clicado: energia ciano (gradiente `#5CDBFF → #22C8FF → #0E9BD1`, texto `#04131C`) ou contorno ciano com brilho.
- Ação agressiva (Raise/All-in, Iniciar missão): gradiente vermelho `#FF4A5E → #E3263B → #A3142A`, texto branco.
- Jogadores na mesa: emblemas hexagonais; herói em vermelho; BTN em branco.
- Mesa tática: feltro azul-escuro com grade triangular ciano, aro de aço.

## Linguagem de missão (PT / EN / ES)
HOME → QG / HQ / BASE · AJUSTES → BRIEFING · ADVANCE → OPERAÇÕES / OPS / OPERACIONES · SPOTS → MISSÃO / MISSION / MISIÓN · STATS → BATALHA / BATTLE / BATALLA · Histórico → Arquivo · Relatórios → Dossiê.
Resultado do spot: Correta = MISSÃO CUMPRIDA · Ajustável = AJUSTE TÁTICO · Incorreta = MISSÃO FALHOU.

## Perfil de herói (só dados reais)
- Nível = XP/100 + 1; patente = RECRUTA (REC) / VETERANO (REG) / ELITE (PRO) de `StackUpXPPerformance`.
- Atributos = % de acerto (correta 1, ajustável 0,5, incorreta 0) nas decisões salvas em `StackUpTrainingPerformance`, mínimo de 3 spots por área:
  - **Agressão**: spots em que a ação indicada é agressiva (bet/raise/all-in).
  - **Leitura**: spots de flop, turn e river.
  - **Pressão**: spots de dificuldade PRO.
  - **Disciplina**: spots em que a ação indicada é fold/check.
- Classe = maior atributo (Agressor, Estrategista, Inabalável, Sentinela); sem dados = Em avaliação.
- Missão do dia: 20 spots respondidos no dia.

## Cobertura
Todas as telas usam o tema: login, abertura, QG, Briefing, Operações especiais, Missão (mesa, resultado, análise, salvar treino), Batalha (Resumo, Evolução, Situações, Sessões, Relatório), Personal, Performance (Eu Herói × Eu Vilão), Perfil (WhatsApp Coach, dados), Arquivo, Dossiê, API × API, Assistência IA e Loja.
Componente novo deve usar as placas (`clip-path` chanfrado), não `border-radius`. Botões dentro dos painéis já herdam o visual: `.primary`/`.on` = energia ciano, `.danger` = contorno vermelho.
