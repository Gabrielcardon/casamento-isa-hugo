# Configuração completa — passo a passo

Guia do zero até o site no ar (grátis), com Firebase e Vercel.

---

## Visão geral do que você vai criar

1. Projeto no computador (já feito neste repositório)
2. Conta/projeto no **Firebase** (banco + login do admin)
3. Arquivo `.env.local` com as chaves do Firebase
4. Regras de segurança do Firestore
5. Deploy na **Vercel**
6. Variáveis de ambiente na Vercel
7. Personalização (nomes, presentes, imagens)

Tempo estimado: 30–45 minutos na primeira vez.

---

## Parte 0 — Pré-requisitos

Instale se ainda não tiver:

- [Node.js](https://nodejs.org/) LTS (versão 20 ou superior)
- Conta no [Google](https://accounts.google.com/) (para Firebase)
- Conta na [Vercel](https://vercel.com/) (pode usar login com GitHub)
- [Git](https://git-scm.com/) (opcional, mas recomendado para Vercel)

No terminal, na pasta do projeto:

```bash
cd /Users/gabrielcardon/CasamentoSite
npm install
npm run dev
```

Confira o site em **http://localhost:5173** (modo demo funciona sem Firebase).

---

## Parte 1 — Personalizar o casamento

Abra o arquivo:

`src/config/wedding.ts`

Altere:

| Campo | O que é |
|--------|---------|
| `partnerOne` / `partnerTwo` | Nomes do casal |
| `dateLabel` | Data amigável (ex.: 15 de novembro de 2026) |
| `dateISO` | Data no formato AAAA-MM-DD |
| `city` | Cidade |
| `venue` | Local da festa (opcional) |
| `message` | Texto da seção “mensagem” |
| `pixKey` / `pixName` | Chave Pix (deixe vazio para ocultar) |

Atualize também o `<title>` em `index.html` se quiser.

---

## Parte 2 — Criar o projeto Firebase

### 2.1 Criar projeto

1. Acesse [https://console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **Adicionar projeto** / **Create a project**
3. Nome sugerido: `casamento-lista` (ou o que preferir)
4. Pode desativar o Google Analytics (não é necessário)
5. Conclua a criação

### 2.2 Registrar um app Web

1. No painel do projeto, clique no ícone **Web** (`</>`)
2. Apelido do app: `casamento-site`
3. **Não** marque Firebase Hosting agora (vamos usar a Vercel)
4. Clique em **Registrar app**
5. Na tela seguinte, copie o objeto de configuração:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Deixe essa tela aberta — você vai colar esses valores no `.env.local`.

### 2.3 Ativar Authentication (login do admin)

1. No menu lateral: **Build → Authentication**
2. Clique em **Começar** / **Get started**
3. Aba **Sign-in method**
4. Ative **E-mail/senha** (Email/Password) → **Enable** → **Save**
5. Aba **Users** → **Add user**
6. Crie o usuário admin:
   - E-mail: o seu e-mail real
   - Senha: uma senha forte (guarde com segurança)

Só quem tiver esse login acessa o painel `/admin` no modo Firebase.

### 2.4 Criar o banco Firestore

1. Menu: **Build → Firestore Database**
2. **Criar banco de dados**
3. Escolha modo de produção (**production mode**)
4. Localização: prefira `southamerica-east1` (São Paulo) se disponível; senão `us-central1` serve
5. Conclua

O banco começa **vazio**. Você adiciona presentes pelo `/admin` do site.

### 2.5 Colar as regras de segurança

1. No Firestore, abra a aba **Rules**
2. Abra o arquivo do projeto: `firestore.rules`
3. Cole o conteúdo em **Rules**
4. **Importante:** troque esta linha:

```
request.auth.token.email == 'SEU_EMAIL_ADMIN@exemplo.com'
```

pelo **mesmo e-mail** que você criou no Authentication, por exemplo:

```
request.auth.token.email == 'voce@gmail.com'
```

5. Clique em **Publish**

O que essas regras fazem:

- Qualquer pessoa **lê** a lista
- Convidados só **atualizam** um presente de `available` → `reserved` (com nome)
- Só o e-mail admin **cria, edita e apaga** presentes

Sem isso, sua lista fica exposta a edição indevida.

### 2.6 Índices (se o Firebase pedir)

Na primeira vez que o site buscar a lista ordenada por `order`, o console pode mostrar um link para criar índice. Clique no link e confira → **Create index**. Espere ficar “Enabled”.

Se preferir criar manualmente: Firestore → Indexes → campo `order` Ascending na coleção `gifts`.

---

## Parte 3 — Conectar o site ao Firebase (local)

### 3.1 Arquivo de ambiente

Na raiz do projeto:

```bash
cp .env.example .env.local
```

Abra `.env.local` e preencha com os valores do Firebase (sem aspas):

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
VITE_ADMIN_EMAIL=voce@gmail.com
```

### 3.2 Reiniciar o dev server

Pare o terminal (`Ctrl+C`) e rode de novo:

```bash
npm run dev
```

Quando as variáveis estão corretas, o rodapé **deixa de** mostrar “Modo demo”.

### 3.3 Entrar no admin e cadastrar presentes

1. Abra http://localhost:5173/admin
2. Login com o e-mail/senha do Authentication
3. Adicione presentes (nome, preço, categoria, URL da imagem, link da loja)
4. Ou use **Importar presentes demo** e depois edite/remova

Campos salvos em cada documento da coleção `gifts`:

| Campo | Tipo | Exemplo |
|-------|------|---------|
| name | string | Jogo de panelas |
| description | string | … |
| price | number | 450 |
| imageUrl | string | https://… |
| category | string | Cozinha |
| link | string | URL da loja (opcional) |
| status | string | `available` ou `reserved` |
| reservedBy | string \| null | Nome do convidado |
| reservedAt | string \| null | ISO date |
| order | number | 1, 2, 3… |

Imagens: use um link público (Imgur, Cloudinary, foto no Drive com link público, site da loja, etc.).

---

## Parte 4 — GitHub (recomendado para Vercel)

1. Crie um repositório no GitHub (pode ser privado)
2. Na pasta do projeto:

```bash
git init
git add .
git commit -m "Site lista de presentes de casamento"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

**Nunca** faça commit do `.env.local` (já está no `.gitignore`).

---

## Parte 5 — Deploy na Vercel (grátis)

### 5.1 Importar o projeto

1. Acesse [https://vercel.com](https://vercel.com) e entre (GitHub é o mais fácil)
2. **Add New… → Project**
3. Importe o repositório do site
4. Framework: Vite deve ser detectado automaticamente
5. **Ainda não** publique — primeiro configure as variáveis

### 5.2 Variáveis de ambiente na Vercel

Em **Environment Variables**, adicione **as mesmas** chaves do `.env.local`:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_ADMIN_EMAIL` (opcional)

Marque Production (e Preview se quiser).

### 5.3 Deploy

Clique em **Deploy**. Ao terminar, você recebe uma URL tipo:

`https://seu-projeto.vercel.app`

Teste:

- Lista pública
- Reserva de um presente
- Login em `/admin`

### 5.4 Domínio próprio (opcional)

Na Vercel: **Settings → Domains** → adicione `listadecasamento.com` (ou similar) e siga as instruções de DNS do seu registrador.

---

## Parte 6 — Checklist final

- [ ] Nomes e data em `src/config/wedding.ts`
- [ ] Firebase Auth com usuário admin
- [ ] Firestore criado + regras publicadas com **seu** e-mail
- [ ] `.env.local` preenchido e site local sem “modo demo”
- [ ] Presentes cadastrados no `/admin`
- [ ] Vercel com as mesmas env vars
- [ ] Teste de reserva como convidado (aba anônima)
- [ ] Teste de admin (criar e liberar reserva)

---

## Problemas comuns

### “Modo demo” no rodapé mesmo depois de configurar

- Confira se o arquivo é `.env.local` (não só `.env.example`)
- Reinicie `npm run dev`
- Variáveis começam com `VITE_` (obrigatório no Vite)
- Valores sem aspas e sem espaços extras

### Login admin falha

- E-mail/senha iguais aos do Authentication
- Auth **Email/Password** está ativo

### Erro de permissão no Firestore (`permission-denied`)

- Regras publicadas?
- E-mail nas regras **igual** ao do login?
- Reserva: o convidado só pode mudar status + reservedBy + reservedAt

### Erro de índice / orderBy

- Clique no link de índice que o Firebase mostra no console do navegador (F12)

### Imagens não aparecem

- URL precisa ser `https://` e pública
- Sites que bloqueiam hotlink às vezes falham — use hosting de imagem

### Build local

```bash
npm run build
```

Se passar, a Vercel também deve passar.

---

## Custos (plano grátis)

Para lista de casamento típica (dezenas de presentes, centenas de visitas):

| Serviço | Plano |
|---------|--------|
| Firebase Spark (free) | E-mail Auth + Firestore costuma bastar |
| Vercel Hobby | Deploy grátis de site estático |

Monitore o uso no Console Firebase se o link for muito compartilhados.

---

## Segurança rápida

1. Não compartilhe a senha do `/admin`
2. Mantenha as **Rules** do Firestore restritivas
3. Chaves `VITE_*` do Firebase **podem** aparecer no frontend (é esperado); a proteção real são as Rules
4. Não coloque senhas no código

---

## Próximos passos opcionais (depois do básico)

- Foto do casal no hero (substituir o fundo artístico por imagem)
- Notificação no e-mail quando alguém reservar (Cloud Functions)
- Upload de imagem direto (Firebase Storage)
- Contagem regressiva até a data

Qualquer dúvida em um passo específico, diga em qual número parou.
