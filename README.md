# Game Tracker — Frontend

> Interface web da aplicação Game Tracker — rastreamento de progresso em jogos.

SPA construída com React 19, Vite, TypeScript e Tailwind CSS v3.

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | UI |
| Vite | 8 | Build tool |
| TypeScript | 5.9 | Tipagem |
| Tailwind CSS | 3.4 | Estilização |
| shadcn/ui | — | Componentes (Button, Card, Dialog, Input, Toast) |
| @base-ui/react | 1.4 | Primitivos acessíveis |
| lucide-react | 1.8 | Ícones |
| RAWG API | — | Autocomplete de jogos (opcional) |

## Páginas

| Página | Rota (tab) | Descrição |
|---|---|---|
| Login | — | Autenticação com JWT |
| Dashboard | `dashboard` | Visão geral: stats, melhores avaliados, jogando agora |
| Jogos | `games` | CRUD completo com filtro, busca e ordenação |
| Assistente | `assistant` | Dicas e sugestões de jogos |
| Configurações | `settings` | Troca de senha e dados da conta |

## Estrutura do projeto

```
game-tracker-frontend-react/
├── src/
│   ├── App.tsx                   # Root: auth gate → Login | tabs
│   ├── pages/
│   │   ├── Login.tsx             # Formulário de login
│   │   ├── Dashboard.tsx         # Estatísticas da biblioteca
│   │   ├── Assistant.tsx         # Assistente de jogos
│   │   ├── Settings.tsx          # Configurações do usuário
│   │   └── games/
│   │       ├── Games.tsx         # Listagem + CRUD
│   │       ├── GameCard.tsx      # Card de jogo
│   │       ├── GameForm.tsx      # Formulário add/edit + RAWG search
│   │       ├── GameSearch.tsx    # Autocomplete via RAWG
│   │       ├── PlatformBadge.tsx # Badge de plataforma
│   │       ├── PlatformSelector.tsx
│   │       ├── StatusSelector.tsx
│   │       ├── StatCard.tsx
│   │       ├── platforms.ts      # Lista de plataformas disponíveis
│   │       └── types.ts          # GameStatus, FilterStatus, SortKey, GameBody
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppShell.tsx      # Nav lateral/mobile, header
│   │   └── ui/                   # shadcn: button, card, dialog, input, toaster
│   ├── services/
│   │   ├── api.ts                # HTTP client com JWT automático
│   │   └── rawg.ts               # Integração RAWG (busca de jogos)
│   ├── types/
│   │   └── Game.ts               # Tipo Game
│   └── lib/
│       └── utils.ts              # cn() e helpers
├── vercel.json                   # Rewrite SPA
└── tailwind.config.js
```

## Rodando localmente

### Pré-requisitos

- Node.js 20+
- Backend rodando em `http://localhost:8080`

### Setup

```bash
# Clone o repositório
git clone https://github.com/rafaelcorrea26/game-tracker-frontend-react.git
cd game-tracker-frontend-react

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env

# Rode
npm run dev
```

Acesse: `http://localhost:5173`

## Variáveis de ambiente

```env
VITE_API_URL=http://localhost:8080
VITE_RAWG_API_KEY=sua_chave_aqui   # opcional — habilita autocomplete de jogos
```

`VITE_RAWG_API_KEY` é opcional. Sem ela, a busca de jogos via RAWG fica desabilitada; o formulário ainda funciona com preenchimento manual.

Obtenha uma chave gratuita em [rawg.io/apidocs](https://rawg.io/apidocs).

## RAWG API

A integração com a [RAWG](https://rawg.io) permite autocompletar nome e plataforma ao adicionar um jogo:

- Busca os 8 resultados mais relevantes
- Mapeia slugs de plataforma (ex: `playstation5` → `PS5`) automaticamente
- Funciona apenas quando `VITE_RAWG_API_KEY` está definida

## Deploy

Deploy com Vercel (recomendado):

1. Importe o repositório em [vercel.com](https://vercel.com)
2. Configure as variáveis de ambiente no painel
3. O `vercel.json` já inclui o rewrite SPA necessário

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

**CORS em produção**: configure `FRONTEND_URL` no backend com a URL do deploy Vercel.
