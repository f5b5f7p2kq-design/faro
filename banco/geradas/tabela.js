// Reescreve a tabela de rating das questões geradas (o bloco @TABELA@ de src/js/10-qrating.js)
// a partir de banco/geradas/estimativas.txt.
//   node banco/geradas/tabela.js            grava a tabela nova
//   node banco/geradas/tabela.js --amostra  só imprime exemplos de cada tipo (para estimar o acerto de um tipo novo)
// Cada tipo é amostrado com sorteio fixo, para a tabela sair igual a cada execução.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..'), JS = path.join(ROOT, 'src', 'js'), QR = path.join(JS, '10-qrating.js');

let seed = 20261031;
Math.random = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
global.document = { getElementById: () => null };
const files = fs.readdirSync(JS).filter(f => /^[01]\d-/.test(f)).sort();
const code = files.map(f => fs.readFileSync(path.join(JS, f), 'utf8').replace(/\/\*@WEB@\*\//g, '')).join('\n');
const H = new Function(code + '\nObject.assign(EXTRA, EXTRA_ADD);\nreturn { GEN, EXTRA, FORMS, LAWS, qAdj };')();

// acerto esperado → rating, como nas questões da Unicamp estimadas sem estatística oficial
const rating = p => 340 + 0.85 * (1300 + 400 * Math.log10((1 - p) / p));
const logit = p => Math.log(p / (1 - p)), unlogit = x => 1 / (1 + Math.exp(-x));

const P = {};
for (const l of fs.readFileSync(path.join(__dirname, 'estimativas.txt'), 'utf8').split('\n')) {
  const t = l.replace(/#.*/, '').trim().split(/\s+/);
  if (t[0]) P[t[0]] = t.slice(1).map(Number);
}

const strip = s => String(s || '').replace(/<sup>(.*?)<\/sup>/g, '^$1').replace(/<sub>(.*?)<\/sub>/g, '_$1').replace(/<\/(td|tr)>/g, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const sample = process.argv.includes('--amostra');
const table = {}, missing = [], out = [];
for (const k of Object.keys(H.GEN)) {
  if (H.GEN[k].form || H.GEN[k].bank) continue;
  const cells = new Map();  // 'v' → { L → [adj] }, com exemplos
  for (const v of ['b', ...(H.EXTRA[k] || []).map((_, j) => 'x' + j)]) {
    const g = v === 'b' ? H.GEN[k].g : H.EXTRA[k][+v.slice(1)];
    for (let L = 0; L < 3; L++) for (let i = 0; i < (v === 'b' ? 1500 : 150); i++) {
      let q; try { q = g(L); } catch (e) { continue; } if (!q) continue;
      const c = v === 'b' && q._v !== undefined ? String(q._v) : v;
      if (!cells.has(c)) cells.set(c, {});
      const o = cells.get(c); (o[L] = o[L] || { adj: [], ex: [] }).adj.push(H.qAdj(q));
      if (sample && o[L].ex.length < 2) o[L].ex.push(`${strip(q.ctx)} | ${strip(q.q)} → ${Array.isArray(q.opts) ? strip(q.opts[q.a]) : q.a}${q.u ? ' ' + strip(q.u) : ''}`);
    }
  }
  table[k] = {};
  for (const [c, o] of cells) {
    const Ls = Object.keys(o).map(Number).sort(), row = [];
    for (const L of Ls) {
      if (sample) out.push(`${k}.${c}.${L}`, ...o[L].ex.map(e => '    ' + e));
      const one = P[`${k}.${c}.${L}`], two = P[`${k}.${c}`];
      let p;
      if (one) p = one[0];
      else if (two) {
        const lo = Ls[0], hi = two[1] ?? two[0];
        p = L === lo ? two[0] : L === 2 ? hi : unlogit((logit(two[0]) + logit(hi)) / 2);
      } else { missing.push(`${k}.${c}.${L}`); continue; }
      const adj = o[L].adj.reduce((s, x) => s + x, 0) / o[L].adj.length;
      row[L] = Math.round((rating(p) - adj) / 10) * 10;
    }
    // nível em que o tipo não aparece: repete o vizinho mais próximo, para nunca faltar número
    for (let L = 0; L < 3; L++) if (row[L] === undefined) row[L] = row[L + 1] ?? row[L - 1] ?? row[L + 2] ?? row[L - 2];
    table[k][c] = row;
  }
}
// teoria: o rating depende do tipo de pergunta, não do nível
const fixed = (pre, n) => Object.fromEntries([...Array(n).keys()].map(t => [t, Array(3).fill(Math.round(rating(P[`*${pre}.${t}`][0]) / 10) * 10)]));
H.FORMS.forEach(([k]) => { table[k] = fixed('form', 4); });
H.LAWS.forEach(([k]) => { table[k] = fixed(k[0] === 'K' ? 'const' : 'lei', 3); });

if (sample) { console.log(out.join('\n')); process.exit(0); }
if (missing.length) { console.error('sem estimativa em estimativas.txt:\n  ' + missing.join('\n  ')); process.exit(1); }

const ks = Object.keys(table), forms = new Set([...H.FORMS, ...H.LAWS].map(x => x[0]));
const line = k => `    ${/^[a-z_]\w*$/i.test(k) ? k : `'${k}'`}: { ${Object.entries(table[k]).map(([c, r]) => `${/^\d+$/.test(c) || /^[a-z]\w*$/.test(c) ? c : `'${c}'`}: [${r.join(', ')}]`).join(', ')} },`;
const block = '  const QB = {\n' + ks.filter(k => !forms.has(k)).map(line).join('\n') + '\n    // teoria\n' + ks.filter(k => forms.has(k)).map(line).join('\n') + '\n  };\n';
const src = fs.readFileSync(QR, 'utf8'), a = src.indexOf('  // @TABELA@\n'), b = src.indexOf('  // @FIM-TABELA@');
if (a < 0 || b < 0) throw new Error('marcadores @TABELA@ não encontrados em 10-qrating.js');
fs.writeFileSync(QR, src.slice(0, a) + '  // @TABELA@\n' + block + src.slice(b));
const all = ks.flatMap(k => Object.values(table[k]).flat());
console.log(`tabela: ${ks.length} tópicos, ${all.length} números, de ${Math.min(...all)} a ${Math.max(...all)}`);
