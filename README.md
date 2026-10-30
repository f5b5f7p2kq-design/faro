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

A Vercel publica a pasta `public/` a cada push na `main` (configuração em `vercel.json`, sem etapa de build).
Rode `bash build.sh` e faça commit de `public/` junto com as mudanças em `src/`.

## Supabase

Projeto `faro` (sa-east-1). A chave publicável fica em `src/web.js`; quem protege os dados são as regras do banco:
cada pessoa lê e escreve só o próprio progresso, e o ranking é visível para quem tem conta.

Em Authentication › URL Configuration, o Site URL e as Redirect URLs precisam incluir o endereço do site,
para os links de confirmação e de senha nova voltarem para ele. O envio de e-mails padrão do Supabase só entrega
para quem é da equipe do projeto: para abrir as contas a todo mundo, configure um SMTP próprio (por exemplo Resend)
em Authentication › Emails.
