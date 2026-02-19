
# Login & Cadastro — Estilo App Mobile

## Visão Geral

Vou criar duas páginas completas de autenticação integradas ao Supabase, com visual de app mobile nativo (dark mode, gradientes verdes, animações suaves), seguindo o mesmo design system já existente no projeto.

---

## O que será criado

### 1. Contexto de Autenticação (`src/hooks/useAuth.tsx`)
Hook global que gerencia o estado de sessão do usuário usando `supabase.auth.onAuthStateChange`. Qualquer página consegue saber se o usuário está logado ou não.

### 2. Página de Login (`src/pages/Login.tsx`)
- Layout fullscreen mobile-first
- Logo/ícone do app no topo com gradiente verde
- Formulário com campos: **E-mail** e **Senha**
- Botão "Entrar" com gradiente verde + shadow glow
- Link "Esqueci minha senha"
- Link para página de Cadastro
- Animações de entrada com `framer-motion`
- Integração real com `supabase.auth.signInWithPassword`
- Redireciona para `/dashboard` após login

### 3. Página de Cadastro (`src/pages/Register.tsx`)
- Mesmo estilo visual do Login
- Campos: **Nome completo**, **E-mail**, **Senha** e **Confirmar senha**
- Campo de **Código de convite** (referral code) — opcional, para o sistema de afiliados
- Validação de senha (mínimo 6 caracteres, senhas iguais)
- Integração com `supabase.auth.signUp`
- Mostra tela de confirmação de e-mail após cadastro
- Link para voltar ao Login

### 4. Proteção de Rotas
- Rota `/dashboard` e `/saque` só acessíveis com login
- Se não logado, redireciona para `/login`
- Se logado, rota `/login` e `/cadastro` redirecionam para `/dashboard`

### 5. Atualização do `App.tsx`
- Adicionar rotas `/login` e `/cadastro`
- Envolver app no provider de autenticação

---

## Fluxo de Navegação

```text
/ (Landing)
  └─► [Botão Adquirir] → CheckoutModal (Pix)

/login
  └─► [Entrar] → /dashboard
  └─► [Cadastrar] → /cadastro
  └─► [Esqueci senha] → e-mail de recuperação via Supabase

/cadastro
  └─► [Criar conta] → tela de confirmação de e-mail
  └─► [Já tenho conta] → /login

/dashboard (protegida)
/saque (protegida)
```

---

## Design Visual

Seguindo o padrão existente do app:
- Fundo escuro (`bg-background` — `hsl(228 28% 4%)`)
- Gradiente verde nos botões e ícones (`bg-gradient-primary`)
- Cards com `card-elevated` e `shadow-card`
- Fontes: Inter (corpo) + Space Grotesk (títulos)
- Animações com `framer-motion` (fade + slide up)
- Inputs com bordas sutis e foco em verde
- Espaçamentos otimizados para mobile (padding lateral `px-5`)

---

## Detalhes Técnicos

- **Autenticação**: Supabase Auth (e-mail/senha)
- **Estado de sessão**: `onAuthStateChange` listener
- **Rotas protegidas**: Componente `ProtectedRoute` com `Navigate`
- **Formulários**: React state simples (sem react-hook-form para manter leveza)
- **Feedback visual**: Toast de erro/sucesso com `useToast`
- **Sem tabela extra**: Login usa apenas `auth.users` do Supabase (não precisa de tabela `profiles` por enquanto)

