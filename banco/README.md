# Banco de questões do Faro

O treino do Faro mistura dois tipos de questão, na mesma escala de rating:

- **geradas na hora** (`src/js`): cada tipo é um molde com números sorteados, então nunca acabam;
- **da Unicamp** (esta pasta): questões de exatas dos vestibulares, adaptadas ao jeito do Faro.

Não há banco de dados para as questões: são arquivos de texto versionados com o código. Só as contas
(rating de cada pessoa, marcadas, estatísticas) ficam no Supabase.

## Pastas

- `unicamp/ANO.json` as questões da Unicamp, um arquivo por vestibular (`1988b.json` é o segundo de 1988).
  É a fonte: para corrigir uma questão, edite aqui.
- `montar.py` junta os anos em `public/unicamp.json`, o arquivo que o treino baixa (o `build.sh` já chama).
- `estatisticas-comvest.json` o índice de acerto de cada questão, tirado dos relatórios da Comvest.
- `geradas/estimativas.txt` o acerto esperado de cada tipo de questão gerada; `geradas/tabela.js`
  transforma isso na tabela de rating de `src/js/10-qrating.js`.

## Uma questão da Unicamp

```js
{
  "id": "2014-1-12",           // ano-fase-número (e item: 2014-2-fis-03b)
  "ano": 2014, "fase": 1, "s": "fis", "t": "f_cin",   // matéria e tópico do Faro
  "src": "Unicamp 2014, 1ª fase, questão 12",
  "r": 1380, "tm": 90,         // rating e tempo esperado, em segundos
  "ctx": "enunciado (HTML leve: <sup>, <sub>, <b>, <br>)",
  "fig": "<svg …>",            // opcional, traço em currentColor
  "a": 20, "u": "m/s", "tol": 0.02,                 // resposta digitada (unidade e tolerância opcionais)
  "opts": ["certa", "errada", "errada", "errada"], "a": 0,  // ou alternativas: a certa vem primeiro
  "d": [["título", "fórmula ou ideia geral", "exemplo"]],   // dicas: bastam para resolver, sem montar a conta
  "h": ["degrau 1", "degrau 2", "degrau 3"]                 // resolução em degraus, ao errar ou pular
}
```

O texto é uma adaptação para o treino rápido (enunciado enxuto, resposta digitada quando dá), não a prova
como ela foi. O site de questões idênticas às provas, planejado para depois, vai precisar de uma
transcrição fiel feita direto dos PDFs da Comvest, com as imagens originais; este banco não serve para isso.

### O que `montar.py` muda para o Faro

- alternativas que são só número, com a mesma unidade, viram resposta digitada (as da 1ª fase de 2011 em
  diante ganham 80 pontos de rating, porque digitar não tem chute);
- resposta aproximada com 4 ou mais algarismos é arredondada a 3, com 2% de tolerância (√2 ≈ 1,41 de cabeça);
- resposta muito grande ou muito pequena vira mantissa digitada, com a potência de 10 na unidade (3 × 10²⁰).

No treino, as alternativas são embaralhadas.

## Rating

Vai de 0 a 2500, como o Elo do Faro: quem tem o mesmo rating da questão acerta metade das vezes.
A régua é o público da Unicamp: uma questão de 1300 é acertada por metade dos candidatos da 1ª fase.

    r = R + 400 · log10((1 − p) / p)      R = 1300 na 1ª fase, 1600 na 2ª (só classificados)

- **Com estatística da Comvest** (2ª fase de 2008 a 2016, 1ª fase de 2011 a 2016), `p` é o índice de acerto
  oficial de cada questão (ou do item, quando o relatório separa).
- **Sem estatística**, `p` é estimado lendo a questão. Comparando as estimativas com os anos que têm dados,
  elas saíam extremas demais, e a correção medida, `340 + 0,85 · r`, é aplicada a todos os anos sem dados.
- **Geradas na hora**: o mesmo cálculo, com `p` estimado para cada tipo e nível (`geradas/estimativas.txt`).
  Ficam entre 660 (45 − 40) e 1570; as da Unicamp vão até 2500.

Fácil é até 1100, médio de 1100 a 1400 e difícil acima de 1400.
Quem já treinava antes dessa escala tem o rating convertido tópico a tópico ao abrir o Faro (`RMAP` em `src/js/30-ui.js`).

## O que falta

- **2017 a 2026**: ainda não entraram no banco.
- **1996**: a prova não está no site da Comvest.
- **Estatísticas**: a Comvest não publica índice de acerto antes de 2008, nem da 1ª fase de 2008 a 2010;
  nesses anos o rating é estimado. O relatório de 2018 existe, mas ainda não foi lido (o ano também falta).

## Para mexer

```sh
python3 banco/montar.py                     # depois de editar banco/unicamp
node banco/geradas/tabela.js --amostra      # exemplos de cada tipo de questão gerada
node banco/geradas/tabela.js                # depois de editar geradas/estimativas.txt ou criar um tipo novo
```

Um tipo novo de questão gerada precisa de uma linha em `geradas/estimativas.txt`; sem ela, `tabela.js` avisa e para.
