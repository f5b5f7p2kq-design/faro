#!/usr/bin/env bash
# Monta o Faro a partir de src/:
#   public/index.html e public/dicas.html  o site (Vercel), com contas pelo Supabase
#   dist/claude.html e dist/dicas.html     a versão do claude.ai (Artifact), com a conta Claude
#   public/unicamp.json                    o banco de questões da Unicamp, que o treino baixa (só no site)
set -euo pipefail
cd "$(dirname "$0")"
TIPS_CLAUDE='https://claude.ai/artifact/3wHqTT2rP8Z8v8FsAXw1fG'
FARO_CLAUDE='https://claude.ai/artifact/1JehGLbvKqxCk7dqVi8EnZ'

page() { # $1 = web | claude
  cat src/head.html
  echo '<title>Faro</title>'
  cat src/fox-link.html
  cat src/base-head.html src/app.css
  echo '</style>'; echo '</head>'
  if [ "$1" = web ]; then sed -e '/<!--@WEB-BODY@-->/{r src/web-body.html' -e 'd}' src/body.html; else sed '/<!--@WEB-BODY@-->/d' src/body.html; fi
  echo
  [ "$1" = web ] && echo '<script src="vendor/supabase.js"></script>'
  echo '<script>'; echo '(() => {'
  for f in src/js/*.js; do
    if [ "$1" = web ]; then sed -e '/\/\*@WEB@\*\//{r src/web.js' -e 'd}' "$f"; else sed '/\/\*@WEB@\*\//d' "$f"; fi
    case "$f" in */0*|*/1*) echo;; esac
  done
  echo '})();'; echo '</script>'; echo '</body>'; echo '</html>'
}

mkdir -p dist public/vendor
python3 banco/montar.py   # public/unicamp.json, as questões da Unicamp (banco/unicamp)
page claude > dist/claude.html
sed "s#@FARO@#$FARO_CLAUDE\" target=\"_blank\" rel=\"noopener#" src/dicas.html > dist/dicas.html
page web | sed -e "s#$TIPS_CLAUDE#dicas.html#g" -e '/<meta name="claude:viewport-fit-sides"/d' > public/index.html
sed -e 's#@FARO@#./#' -e '/<meta name="claude:viewport-fit-sides"/d' src/dicas.html > public/dicas.html
