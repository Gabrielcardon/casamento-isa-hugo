# Lista de presentes de casamento

Site em **React + Vite + Tailwind + Firebase**, pronto para hospedar na **Vercel**.

Sem Firebase configurado, o site roda em **modo demo** (dados no navegador) — assim você já pode visualizar e testar o visual.

## Começar agora

```bash
npm install
npm run dev
```

Abra http://localhost:5173

- **Site:** `/`
- **Admin:** `/admin` — no modo demo: qualquer e-mail + senha `admin`

## Personalizar o casal

Edite `src/config/wedding.ts` (nomes, data, cidade, mensagem, Pix).

## Configuração completa (Firebase + Vercel)

Siga o guia detalhado: **[CONFIGURACAO.md](./CONFIGURACAO.md)**

## Scripts

| Comando        | Descrição              |
|----------------|------------------------|
| `npm run dev`  | Desenvolvimento local  |
| `npm run build`| Build de produção      |
| `npm run preview` | Preview do build    |

## Estrutura

```
src/
  components/   # Hero, lista, modal, etc.
  config/       # Dados do casamento
  data/         # Presentes demo
  hooks/        # useGifts, useAuth
  lib/          # Firebase
  pages/        # Home e Admin
  services/     # CRUD + reserva
  types/
```
