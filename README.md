# Faro

Exatas de cabeça para o vestibular: exercícios, teoria, tempo de estudo, calendário, hábitos, metas e ranking.

O site é estático (um `index.html` grande, sem framework) e as contas ficam no Supabase.

## Pastas

- `src/` o código-fonte. `build.sh` junta tudo.
  - `head.html`, `base-head.html`, `app.css`, `body.html` o HTML e o CSS
  - `js/` o JavaScript, em ordem (geradores de questões, fórmulas, dicas, interface em `30-ui.js`)
  - `web.js` e `web-body.html` só no site: contas, sincronização e ranking pelo Supabase
  - `dicas.html` a página de dicas por tópico
- `public/` o que a Vercel publica (gerado por `build.sh`, mais `vendor/supabase.js`, supabase-js 2.117.3)
- `dist/` a versão do claude.ai (Artifact), gerada por `build.sh` e fora do git
- `supabase/schema.sql` as tabelas e regras do banco
- `tests/` testes com Playwright e um Supabase de mentira

## Montar e testar

```sh
bash build.sh
cd public && python3 -m http.server 8124 &
node tests/contas.test.js
```

## Publicar

A Vercel publica a pasta `public/` a cada push (configuração em `vercel.json`, sem etapa de build).
Rode `bash build.sh` e faça commit de `public/` junto com as mudanças em `src/`.

Há duas versões no ar:

- **estável**: ramo `main`, em https://farovest.vercel.app (o endereço antigo, faro-six-azure.vercel.app, continua funcionando), com o banco `faro`
- **teste**: ramo `teste`, em https://faro-git-teste-faroapp.vercel.app, com o banco `faro-teste`

O desenvolvimento acontece no ramo `teste`. Quando a versão de teste estiver boa, ela entra na `main`
por um pull request, e a Vercel atualiza o site estável. Se algo der errado, a Vercel volta para a
publicação anterior em Deployments › Instant Rollback.

`src/web.js` escolhe o banco pelo endereço: só `farovest.vercel.app` e `faro-six-azure.vercel.app` usam o banco de verdade.
Qualquer outro endereço (a versão de teste, o computador) usa o banco de teste e mostra a etiqueta
"versão de teste". Se o site estável ganhar um domínio próprio, ele precisa entrar nessa conta.

## Supabase

Projetos `faro` (o de verdade) e `faro-teste` (sa-east-1), com as mesmas tabelas e regras (`supabase/schema.sql`). A chave publicável fica em `src/web.js`; quem protege os dados são as regras do banco:
cada pessoa lê e escreve só o próprio progresso, e o ranking é visível para quem tem conta.

Em Authentication › URL Configuration, o Site URL e as Redirect URLs precisam incluir o endereço do site,
para os links de confirmação e de senha nova voltarem para ele (em cada banco, o endereço da sua versão).
O envio de e-mails padrão do Supabase tem um limite baixo por hora e, pela documentação, só entrega para a equipe
do projeto: para abrir as contas a todo mundo, configure um SMTP próprio (por exemplo uma conta Gmail com senha
de app) em Authentication › Emails.
