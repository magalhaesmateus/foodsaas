# FoodSaaS

Sistema de gestão completo para pequenos negócios de delivery, desenvolvido com Next.js, TypeScript, Supabase e Tailwind CSS.

## Funcionalidades

- **Autenticação** — Login e cadastro de usuários
- **Cardápio** — Cadastro e gestão de produtos por categoria
- **Pedidos** — Criação e acompanhamento de pedidos em tempo real
- **Clientes** — Cadastro e histórico de clientes
- **Financeiro** — Resumo de faturamento, pedidos pendentes e cancelados
- **Responsivo** — Funciona em desktop e celular

## Tecnologias

- [Next.js 16](https://nextjs.org/) — Framework React
- [TypeScript](https://www.typescriptlang.org/) — Tipagem estática
- [Supabase](https://supabase.com/) — Backend, banco de dados e autenticação
- [Tailwind CSS](https://tailwindcss.com/) — Estilização
- [Vercel](https://vercel.com/) — Deploy

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- Conta no Supabase

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/magalhaesmateus394-gif/foodsaas.git
cd foodsaas
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_do_supabase
```

4. Rode o projeto:

```bash
npm run dev
```

5. Acesse [http://localhost:3000](http://localhost:3000)

## 🗄️ Estrutura do banco de dados

- `produtos` — Cardápio do estabelecimento
- `pedidos` — Pedidos realizados
- `itens_pedido` — Itens de cada pedido
- `clientes` — Clientes cadastrados

## Estrutura do projeto

app/
├── components/
│ └── Sidebar.tsx # Menu lateral responsivo
├── lib/
│ └── supabase.ts # Configuração do Supabase
├── cadastro/
│ └── page.tsx # Tela de cadastro
├── dashboard/
│ └── page.tsx # Dashboard principal
├── cardapio/
│ └── page.tsx # Gestão de produtos
├── pedidos/
│ └── page.tsx # Gestão de pedidos
├── clientes/
│ └── page.tsx # Gestão de clientes
├── financeiro/
│ └── page.tsx # Resumo financeiro
└── page.tsx # Tela de login

## Autor

Desenvolvido por **Mateus Magalhães**

[![GitHub](https://img.shields.io/badge/GitHub-magalhaesmateus394--gif-black?style=flat&logo=github)](https://github.com/magalhaesmateus394-gif)
