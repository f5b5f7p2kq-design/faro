  const $ = id => document.getElementById(id);

  // ---------- utilidades ----------
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const fact = n => n <= 1 ? 1 : n * fact(n - 1);
  const Ar = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r *= n - i; return r; };
  const Cb = (n, k) => Ar(n, k) / fact(k);
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const lcm = (a, b) => a / gcd(a, b) * b;
  const f = n => n.toLocaleString('pt-BR', { maximumFractionDigits: 6 });
  const X = ' × ', M = ' − ';
  const chain = (n, k) => Array.from({ length: k }, (_, i) => n - i).join(X);
  const sup = (b, e) => `${b}<sup>${e}</sup>`;
  const factor = n => {
    const out = []; let d = 2;
    while (n > 1) { let e = 0; while (n % d === 0) { n /= d; e++; } if (e) out.push(e > 1 ? sup(d, e) : d); d++; }
    return out.join('·') || '1';
  };
  const bolas = (n, cor) => n === 1 ? `1 bola ${cor}` : `${n} bolas ${cor === 'cinza' ? 'cinzas' : cor + 's'}`;
  const letters = w => { const m = {}; for (const c of w) m[c] = (m[c] || 0) + 1; return m; };
  const distinct = w => new Set(w).size === w.length;

  // a × b decompondo o maior fator em dezenas + unidades
  const distHint = (a, b) => {
    const big = Math.max(a, b), small = Math.min(a, b);
    const T = big - big % 10, U = big % 10;
    if (!U || !T) return `${a}${X}${b} = ${f(a * b)}`;
    return `${small}${X}${big} = ${small}${X}${T} + ${small}${X}${U} = ${f(small * T)} + ${f(small * U)} = ${f(a * b)}`;
  };

  const DISTINCT_WORDS = ['SOL', 'MAR', 'LUA', 'GATO', 'AMOR', 'PATO', 'BOLA', 'LIVRO', 'PRATO', 'NUVEM', 'CINEMA', 'BRASIL', 'ESCOLA', 'FUTEBOL', 'MOCHILA', 'CAMINHO'];
  const REP_WORDS = ['OVO', 'ASA', 'OSSO', 'PAPA', 'BOBO', 'COCO', 'BOLO', 'CASA', 'TATU', 'ARARA', 'PAPAI', 'BANANA', 'ARROZ', 'CARRO', 'BATATA', 'CABANA', 'CANECA', 'BARBARA', 'PIPOCA', 'PANELA', 'ABACAXI', 'CAJADO'];
  const repCount = w => { const m = letters(w); return Object.values(m).reduce((r, c) => r / fact(c), fact(w.length)); };

  // ---------- geradores: cada um devolve { ctx, q, a, h } ----------
  const GEN = {
    soma: { name: 'Soma', g(L) {
      if (L === 2 && Math.random() < .5) {
        const xs = [ri(101, 999), ri(101, 999), ri(101, 999)], s1 = xs[0] + xs[1];
        return { q: xs.join(' + '), a: s1 + xs[2], h: `${xs[0]} + ${xs[1]} = ${f(s1)} → ${f(s1)} + ${xs[2]} = ${f(s1 + xs[2])}` };
      }
      const [a, b] = L === 0 ? [ri(12, 89), ri(12, 89)] : L === 1 ? [ri(120, 899), ri(25, 899)] : [ri(1200, 8999), ri(120, 999)];
      const r = Math.ceil(b / 10) * 10, d = r - b;
      return { q: `${a} + ${b}`, a: a + b, h: d ? `${a} + ${b} = ${a} + ${r}${M}${d} = ${f(a + b)}` : `${a} + ${b} = ${f(a + b)}` };
    } },
    sub: { name: 'Subtração', g(L) {
      const a = L === 0 ? ri(31, 99) : L === 1 ? ri(201, 999) : ri(1001, 9999);
      const b = L === 0 ? ri(12, a - 5) : L === 1 ? ri(45, a - 20) : ri(150, a - 100);
      const r = Math.ceil(b / 10) * 10, d = r - b;
      return { q: `${a}${M}${b}`, a: a - b, h: d ? `${a}${M}${b} = ${a}${M}${r} + ${d} = ${f(a - b)}` : `${a}${M}${b} = ${f(a - b)}` };
    } },
    mult: { name: 'Multiplicação', g(L) {
      if (L === 1) {
        const k = pick(['11', '25', '5', 'g', 'g']);
        if (k === '11') { const n = ri(12, 98); return { q: `${n}${X}11`, a: n * 11, h: `${n}${X}11 = ${n}${X}10 + ${n} = ${n * 10} + ${n} = ${f(n * 11)}` }; }
        if (k === '25') { const n = 4 * ri(3, 39); return { q: `${n}${X}25`, a: n * 25, h: `×25 é ×100 ÷ 4: ${f(n * 100)} ÷ 4 = ${f(n * 25)}` }; }
        if (k === '5') { const n = ri(23, 399); return { q: `${n}${X}5`, a: n * 5, h: `×5 é ×10 ÷ 2: ${f(n * 10)} ÷ 2 = ${f(n * 5)}` }; }
        const a = ri(12, 29), b = ri(12, 39);
        return { q: `${a}${X}${b}`, a: a * b, h: distHint(a, b) };
      }
      if (L === 2) {
        const k = pick(['g', 'g', '3', 'perto']);
        if (k === '3') { const a = ri(101, 999), b = ri(3, 9); return { q: `${a}${X}${b}`, a: a * b, h: distHint(a, b) }; }
        if (k === 'perto') {
          const a = ri(91, 99), b = ri(91, 99), x = 100 - a, y = 100 - b;
          return { q: `${a}${X}${b}`, a: a * b, h: `perto de 100: ${a}${M}${y} = ${a - y}, e ${x}${X}${y} = ${x * y} → ${f(a * b)}` };
        }
        const a = ri(13, 99), b = ri(13, 99);
        return { q: `${a}${X}${b}`, a: a * b, h: distHint(a, b) };
      }
      const a = ri(2, 9), b = ri(12, 99);
      return { q: `${a}${X}${b}`, a: a * b, h: distHint(a, b) };
    } },
    div: { name: 'Divisão', g(L) {
      const d = L === 0 ? ri(2, 9) : L === 1 ? ri(3, 12) : ri(12, 25);
      const q = L === 0 ? ri(3, 30) : ri(12, 99), n = d * q;
      const T = q - q % 10, U = q % 10;
      const h = T && U ? `${f(n)} = ${f(d * T)} + ${d * U} → ${T} + ${U} = ${q}` : `${d}${X}${q} = ${f(n)}`;
      return { q: `${f(n)} ÷ ${d}`, a: q, h };
    } },
    pot: { name: 'Potência', g(L) {
      const sq = n => {
        if (n % 10 === 5) { const k = (n - 5) / 10; return { q: sup(n, 2), a: n * n, h: `termina em 5: ${k}${X}${k + 1} = ${k * (k + 1)}, acrescente 25 → ${f(n * n)}` }; }
        const T = n - n % 10, U = n % 10;
        return { q: sup(n, 2), a: n * n, h: U ? `(${T} + ${U})² = ${T * T} + 2·${T}·${U} + ${U * U} = ${f(n * n)}` : `${n}² = ${f(n * n)}` };
      };
      const pw = (b, e) => {
        const steps = []; let v = 1; for (let i = 0; i < e; i++) { v *= b; steps.push(f(v)); }
        return { q: sup(b, e), a: v, h: steps.join(' → ') };
      };
      if (L === 0) return Math.random() < .6 ? sq(ri(11, 20)) : pw(2, ri(5, 10));
      if (L === 1) { const k = ri(0, 3); return k === 0 ? sq(ri(21, 60)) : k === 1 ? sq(10 * ri(1, 9) + 5) : k === 2 ? pw(ri(4, 9), 3) : pw(2, ri(8, 12)); }
      const k = ri(0, 3); return k <= 1 ? sq(ri(41, 99)) : k === 2 ? pw(ri(10, 15), 3) : pw(3, ri(5, 7));
    } },
    raiz: { name: 'Raiz', g(L) {
      if (L === 2 && Math.random() < .4) { const n = ri(4, 12); return { q: `∛${f(n ** 3)}`, a: n, h: `${n}${X}${n}${X}${n} = ${f(n ** 3)}` }; }
      const n = L === 0 ? ri(4, 15) : L === 1 ? ri(16, 40) : ri(41, 99);
      const T = n - n % 10;
      return { q: `√${f(n * n)}`, a: n, h: n < 10 ? `${n}${X}${n} = ${n * n}` : `${T}² = ${f(T * T)} e ${T + 10}² = ${f((T + 10) ** 2)}; termina em ${(n * n) % 10} → ${n}² = ${f(n * n)}` };
    } },
    porc: { name: 'Porcentagem', g(L) {
      const p = pick([[10, 50, 25, 20], [5, 15, 30, 40, 60, 75], [12, 35, 45, 65, 85, 120, 150]][L]);
      const base = 100 / gcd(p, 100), max = [200, 800, 2000][L];
      const N = base * ri(Math.max(1, Math.ceil(20 / base)), Math.floor(max / base)), a = N * p / 100;
      const tips = { 10: `÷ 10`, 50: `metade`, 25: `÷ 4`, 20: `÷ 5`, 5: `metade de 10%`, 15: `10% + 5% = ${f(N / 10)} + ${f(N / 20)}`, 75: `3 × 25% = 3 × ${f(N / 4)}`, 30: `3 × 10% = 3 × ${f(N / 10)}`, 40: `4 × 10% = 4 × ${f(N / 10)}`, 60: `6 × 10% = 6 × ${f(N / 10)}` };
      const h = tips[p] ? `${p}% de ${f(N)}: ${tips[p]} = ${f(a)}` : `${f(N)}${X}${p} ÷ 100 = ${f(N * p)} ÷ 100 = ${f(a)}`;
      return { q: `${p}% de ${f(N)}`, a, h };
    } },
    fat: { name: 'Fatorial', g(L) {
      if (L === 0) { const n = ri(3, 6); return { q: `${n}!`, a: fact(n), h: `${chain(n, n)} = ${f(fact(n))}` }; }
      if (L === 1) {
        if (Math.random() < .25) return { q: '7!', a: 5040, h: `7! = 7 × 6! = 7 × 720 = 5.040` };
        const n = ri(7, 12), k = ri(2, 3);
        return { q: `${n}! / ${n - k}!`, a: Ar(n, k), h: `corta ${n - k}!: ${chain(n, k)} = ${f(Ar(n, k))}` };
      }
      const k = pick(['div', 'comb', '8']);
      if (k === '8') return { q: '8!', a: 40320, h: `8! = 8 × 7! = 8 × 5.040 = 40.320` };
      if (k === 'comb') { const n = ri(7, 12), m = ri(2, 3); return { q: `${n}! / (${m}!·${n - m}!)`, a: Cb(n, m), h: `${chain(n, m)} ÷ ${m}! = ${f(Ar(n, m))} ÷ ${fact(m)} = ${f(Cb(n, m))}` }; }
      const n = ri(9, 15); return { q: `${n}! / ${n - 3}!`, a: Ar(n, 3), h: `${chain(n, 3)} = ${f(Ar(n, 3))}` };
    } },
    perm: { name: 'Permutação', g(L) {
      const [lo, hi] = [[3, 5], [5, 6], [6, 7]][L];
      const words = DISTINCT_WORDS.filter(w => distinct(w) && w.length >= lo && w.length <= hi);
      const kinds = L === 2 ? ['palavra', 'mesa', 'comeca', 'fila'] : ['palavra', 'fila', 'nota'];
      const k = pick(kinds);
      if (k === 'palavra' || k === 'comeca') {
        const w = pick(words), n = w.length;
        if (k === 'comeca') return { ctx: `Quantos anagramas da palavra abaixo começam com <b>${w[0]}</b>?`, q: w, a: fact(n - 1), h: `fixa o ${w[0]}, permuta as outras ${n - 1}: ${n - 1}! = ${f(fact(n - 1))}` };
        return { ctx: 'Quantos anagramas tem a palavra', q: w, a: fact(n), h: `${n} letras distintas: ${n}! = ${chain(n, n)} = ${f(fact(n))}` };
      }
      const n = ri(lo, hi);
      if (k === 'mesa') return { ctx: `De quantas formas ${n} pessoas podem sentar ao redor de uma mesa redonda?`, q: '', a: fact(n - 1), h: `girar a mesa não muda nada, então fixe uma pessoa: (${n}−1)! = ${f(fact(n - 1))}` };
      if (k === 'fila') return { ctx: `De quantas formas ${n} pessoas podem formar uma fila?`, q: '', a: fact(n), h: `${n}! = ${chain(n, n)} = ${f(fact(n))}` };
      return { ctx: 'permutação simples', q: `P(${n})`, a: fact(n), h: `${n}! = ${chain(n, n)} = ${f(fact(n))}` };
    } },
    prep: { name: 'Perm. c/ repetição', g(L) {
      const k = pick(L === 0 ? ['palavra', 'palavra', 'bolas'] : ['palavra', 'palavra', 'bolas', 'grade']);
      if (k === 'palavra') {
        const [lo, hi] = [[2, 12], [13, 200], [201, 1000]][L];
        const w = pick(REP_WORDS.filter(w => !distinct(w) && repCount(w) >= lo && repCount(w) <= hi));
        const reps = Object.entries(letters(w)).filter(([, c]) => c > 1);
        const den = reps.map(([, c]) => `${c}!`).join('·');
        return { ctx: 'Quantos anagramas tem a palavra', q: w, a: repCount(w),
          h: `${w.length}! / (${den}) · repetidas: ${reps.map(([l, c]) => `${l}×${c}`).join(', ')} → ${f(fact(w.length))} / ${reps.reduce((r, [, c]) => r * fact(c), 1)} = ${f(repCount(w))}` };
      }
      if (k === 'grade') {
        const a = L === 1 ? ri(2, 4) : ri(3, 5), b = L === 1 ? ri(2, 3) : ri(3, 4);
        return { ctx: `Andando só para a direita ou para cima, quantos caminhos levam de (0,0) até (${a},${b}) numa grade?`, q: '', a: Cb(a + b, a),
          h: `é arrumar ${a} D e ${b} C em fila: ${a + b}! / (${a}!·${b}!) = ${f(Cb(a + b, a))}` };
      }
      if (L === 2) {
        let a, b, c; do { a = ri(1, 3); b = ri(1, 3); c = ri(1, 3); } while (a + b + c < 6);
        const n = a + b + c, ans = fact(n) / (fact(a) * fact(b) * fact(c));
        return { ctx: `De quantas formas dá para enfileirar ${bolas(a, 'preta')}, ${bolas(b, 'branca')} e ${bolas(c, 'cinza')}?`, q: '', a: ans, h: `${n}! / (${a}!·${b}!·${c}!) = ${f(fact(n))} / ${fact(a) * fact(b) * fact(c)} = ${f(ans)}` };
      }
      let a, b; do { a = ri(1, L ? 5 : 3); b = ri(1, L ? 4 : 3); } while (L ? a + b < 6 : a + b < 3);
      const n = a + b;
      return { ctx: `De quantas formas dá para enfileirar ${bolas(a, 'preta')} e ${bolas(b, 'branca')}?`, q: '', a: Cb(n, a), h: `${n}! / (${a}!·${b}!) = ${f(fact(n))} / ${fact(a) * fact(b)} = ${f(Cb(n, a))}` };
    } },
    arr: { name: 'Arranjo', g(L) {
      let n, k;
      if (L === 0) { k = 2; n = ri(4, 9); }
      else if (L === 1) { if (Math.random() < .5) { k = 3; n = ri(4, 8); } else { k = 2; n = ri(10, 15); } }
      else { if (Math.random() < .5) { k = 3; n = ri(9, 12); } else { k = 4; n = ri(5, 8); } }
      const h = `${k} posições, a ordem importa: ${chain(n, k)} = ${f(Ar(n, k))}`;
      const opts = [{ ctx: 'arranjo simples', q: `A(${n},${k})` }];
      if (k === 3) opts.push({ ctx: `Uma corrida tem ${n} atletas. Quantos pódios diferentes (1º, 2º e 3º) são possíveis?`, q: '' });
      if (k === 2) opts.push({ ctx: `Entre ${n} candidatos, de quantas formas escolher um presidente e um vice?`, q: '' });
      if (n <= 9) opts.push({ ctx: `Quantos números de ${k} algarismos distintos dá para formar só com os dígitos de 1 a ${n}?`, q: '' });
      return { ...pick(opts), a: Ar(n, k), h };
    } },
    comb: { name: 'Combinação', g(L) {
      let n, k;
      if (L === 0) { k = 2; n = ri(4, 10); }
      else if (L === 1) { if (Math.random() < .5) { k = 2; n = ri(11, 20); } else { k = 3; n = ri(5, 9); } }
      else { const r = ri(0, 2); if (r === 0) { k = 3; n = ri(10, 14); } else if (r === 1) { k = 4; n = ri(7, 10); } else { n = ri(9, 14); k = n - ri(2, 3); } }
      const kk = Math.min(k, n - k);
      const h = (kk !== k ? `C(${n},${k}) = C(${n},${kk}): ` : '') + `${chain(n, kk)} ÷ ${kk}! = ${f(Ar(n, kk))} ÷ ${fact(kk)} = ${f(Cb(n, kk))}`;
      const opts = [{ ctx: 'combinação simples', q: `C(${n},${k})` }, { ctx: `Quantas comissões de ${k} pessoas dá para formar com ${n} pessoas?`, q: '' }];
      if (k === 2) opts.push({ ctx: `Numa festa com ${n} pessoas, todas se cumprimentam uma vez. Quantos apertos de mão?`, q: '' });
      if (k <= 4 && n <= 12) opts.push({ ctx: `Uma sorveteria tem ${n} sabores. Quantas taças com ${k} sabores diferentes dá para montar?`, q: '' });
      return { ...pick(opts), a: Cb(n, k), h };
    } },
    conj: { name: 'Conjuntos', g(L) {
      const k = pick([['uniao', 'uniao', 'sub'], ['inter', 'nenhum', 'sub', 'naovazio'], ['tres', 'nenhum', 'inter', 'naovazio']][L]);
      if (k === 'sub' || k === 'naovazio') {
        const n = L === 0 ? ri(2, 5) : ri(5, 10);
        if (k === 'sub') return { ctx: `Quantos subconjuntos tem um conjunto com ${n} elementos?`, q: 'n(𝒫(A))', a: 2 ** n, h: `cada elemento entra ou não: ${sup(2, n)} = ${f(2 ** n)}` };
        return { ctx: `Quantos subconjuntos <b>não vazios</b> tem um conjunto com ${n} elementos?`, q: '', a: 2 ** n - 1, h: `${sup(2, n)}${M}1 = ${f(2 ** n - 1)}` };
      }
      if (k === 'tres') {
        const r = Array.from({ length: 7 }, () => ri(1, 9)); // regiões do diagrama de Venn
        const [a, b, c, ab, ac, bc, abc] = r;
        const A = a + ab + ac + abc, B = b + ab + bc + abc, Cc = c + ac + bc + abc;
        const AB = ab + abc, AC = ac + abc, BC = bc + abc, U = r.reduce((s, x) => s + x, 0);
        return { ctx: `n(A) = ${A}, n(B) = ${B}, n(C) = ${Cc}, n(A∩B) = ${AB}, n(A∩C) = ${AC}, n(B∩C) = ${BC}, n(A∩B∩C) = ${abc}`, q: 'n(A ∪ B ∪ C)', a: U,
          h: `${A} + ${B} + ${Cc}${M}${AB}${M}${AC}${M}${BC} + ${abc} = ${U}` };
      }
      const hi = [20, 40, 60][L];
      const a = ri(8, hi), b = ri(8, hi), i = ri(2, Math.min(a, b) - 2), u = a + b - i;
      if (k === 'uniao') return { ctx: `Numa turma, ${a} alunos gostam de café, ${b} de chá e ${i} dos dois. Quantos gostam de pelo menos um?`, q: '', a: u, h: `n(A∪B) = ${a} + ${b}${M}${i} = ${u}` };
      if (k === 'inter') return { ctx: `Dos ${u} alunos que gostam de café ou de chá, ${a} gostam de café e ${b} de chá. Quantos gostam dos dois?`, q: '', a: i, h: `n(A∩B) = ${a} + ${b}${M}${u} = ${i}` };
      const T = u + ri(3, 15);
      return { ctx: `Numa turma de ${T} alunos, ${a} gostam de café, ${b} de chá e ${i} dos dois. Quantos não gostam de nenhum?`, q: '', a: T - u, h: `pelo menos um: ${a} + ${b}${M}${i} = ${u} → ${T}${M}${u} = ${T - u}` };
    } },
    mdc: { name: 'MDC · MMC', g(L) {
      if (L === 2 && Math.random() < .5) {
        let xs, m; do { xs = [ri(4, 20), ri(4, 20), ri(4, 20)]; m = lcm(lcm(xs[0], xs[1]), xs[2]); } while (m > 400 || m === Math.max(...xs));
        return { q: `mmc(${xs.join(', ')})`, a: m, h: `${xs.map(x => `${x} = ${factor(x)}`).join('; ')} → maiores expoentes = ${factor(m)} = ${m}` };
      }
      const [s, t] = [[2, 6], [3, 12], [4, 15]][L];
      if (Math.random() < .5) {
        let x, y; do { x = ri(2, 7); y = ri(2, 7); } while (gcd(x, y) !== 1 || x === y);
        const d = ri(s, t), a = d * x, b = d * y;
        return { q: `mdc(${a}, ${b})`, a: d, h: `${a} = ${factor(a)}; ${b} = ${factor(b)} → comuns com menor expoente = ${d}` };
      }
      let a, b; do { a = ri(s, t * 2); b = ri(s, t * 2); } while (a === b || lcm(a, b) === Math.max(a, b) || lcm(a, b) > [40, 200, 400][L]);
      const m = lcm(a, b);
      return { q: `mmc(${a}, ${b})`, a: m, h: `${a} = ${factor(a)}; ${b} = ${factor(b)} → todos com maior expoente = ${factor(m)} = ${m}` };
    } },
  };
  // ---------- variações extras: cada função recebe o nível e devolve uma questão, ou null se não vale nesse nível ----------
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
  const EXTRA = {
    soma: [
      L => { const n = [ri(10, 20), ri(20, 100), ri(50, 200)][L]; const s = n * (n + 1) / 2;
        return { ctx: 'soma de Gauss', q: `1 + 2 + 3 + … + ${n}`, a: s, h: `pares que somam ${n + 1}: ${n}${X}${n + 1} ÷ 2 = ${f(s)}` }; },
      L => { if (!L) return null; const t = L === 1 ? 100 : 1000, a = ri(t / 10, t * .9), b = ri(t / 10, t * .9), xs = [a, t - a, b, t - b].sort(() => Math.random() - .5);
        return { q: xs.join(' + '), a: 2 * t, h: `junte os pares que fecham ${t}: ${a} + ${t - a} e ${b} + ${t - b} → ${f(2 * t)}` }; },
      L => { if (L < 2) return null; const n = ri(8, 30);
        return { ctx: 'soma dos primeiros ímpares', q: `1 + 3 + 5 + … + ${2 * n - 1}`, a: n * n, h: `são ${n} ímpares, e a soma dos n primeiros ímpares é n²: ${n}² = ${f(n * n)}` }; },
      L => { const k = [9, 99, 999][L], a = ri(23, [99, 999, 9999][L]);
        return { q: `${f(a)} + ${k}`, a: a + k, h: `+${k} é +${k + 1} − 1: ${f(a + k + 1)}${M}1 = ${f(a + k)}` }; },
    ],
    sub: [
      L => { const t = [100, 1000, 10000][L], x = ri(t / 10 + 1, t - 1);
        return { q: `${f(t)}${M}${f(x)}`, a: t - x, h: `complemento: cada algarismo até 9, o último até 10 → ${f(t - x)}` }; },
      L => { if (L < 1) return null; const a = ri(300, L === 1 ? 999 : 4999), b = ri(20, a / 3 | 0), c = ri(20, a / 3 | 0);
        return { q: `${f(a)}${M}${b}${M}${c}`, a: a - b - c, h: `tire tudo de uma vez: ${b} + ${c} = ${b + c} → ${f(a)}${M}${b + c} = ${f(a - b - c)}` }; },
      L => { const k = [9, 99, 999][L], a = ri(k + 50, [99, 999, 9999][L] + k);
        return { q: `${f(a)}${M}${k}`, a: a - k, h: `−${k} é −${k + 1} + 1: ${f(a - k - 1)} + 1 = ${f(a - k)}` }; },
    ],
    mult: [
      L => { const n = ri(12, [99, 199, 999][L]);
        return { q: `${n}${X}9`, a: n * 9, h: `×9 é ×10 − 1 vez: ${f(n * 10)}${M}${n} = ${f(n * 9)}` }; },
      L => { if (!L) return null; const m = 10 * ri(2, 9), d = ri(1, 5);
        return { q: `${m - d}${X}${m + d}`, a: m * m - d * d, h: `(${m} − ${d})(${m} + ${d}) = ${m}² − ${d}² = ${f(m * m)}${M}${d * d} = ${f(m * m - d * d)}` }; },
      L => { if (L < 2) return null; const n = ri(12, 99);
        return { q: `${n}${X}99`, a: n * 99, h: `×99 é ×100 − 1 vez: ${f(n * 100)}${M}${n} = ${f(n * 99)}` }; },
      L => { const n = 2 * ri(6, [25, 60, 250][L]);
        return { q: `${n}${X}15`, a: n * 15, h: `×15 é ×10 + metade disso: ${f(n * 10)} + ${f(n * 5)} = ${f(n * 15)}` }; },
      L => { const a = 2 * ri(6, 49), k = pick([4, 8, 16].slice(0, L + 1));
        return { q: `${a}${X}${k}`, a: a * k, h: `vá dobrando: ${f(a)} → ${Array.from({ length: Math.log2(k) }, (_, i) => f(a * 2 ** (i + 1))).join(' → ')}` }; },
    ],
    div: [
      L => { const n = 5 * ri(5, [40, 200, 2000][L]);
        return { q: `${f(n)} ÷ 5`, a: n / 5, h: `÷5 é ×2 ÷ 10: ${f(n * 2)} ÷ 10 = ${f(n / 5)}` }; },
      L => { if (!L) return null; const n = 25 * ri(4, L === 1 ? 40 : 400);
        return { q: `${f(n)} ÷ 25`, a: n / 25, h: `÷25 é ×4 ÷ 100: ${f(n * 4)} ÷ 100 = ${f(n / 25)}` }; },
      L => { const n = ri(6, [40, 300, 2000][L]);
        return { q: `${f(n)} ÷ 0,5`, a: n * 2, h: `dividir por meio é dobrar: ${f(n * 2)}` }; },
      L => { const d = pick([2, 4, 8].slice(0, L + 1)), q = ri(12, [60, 250, 999][L]);
        return { q: `${f(q * d)} ÷ ${d}`, a: q, h: `vá dividindo por 2: ${f(q * d)} → ${Array.from({ length: Math.log2(d) }, (_, i) => f(q * d / 2 ** (i + 1))).join(' → ')}` }; },
    ],
    pot: [
      L => { const e = [2, 3, 4][L]; return { q: sup(5, e), a: 5 ** e, h: `5ⁿ = 10ⁿ ÷ 2ⁿ: ${f(10 ** e)} ÷ ${2 ** e} = ${f(5 ** e)}` }; },
      L => { if (!L) return null; const n = pick(L === 1 ? [101, 102, 103, 104, 105, 99, 98, 97] : [106, 107, 108, 109, 111, 112, 95, 94, 93]), d = n - 100;
        return { q: sup(n, 2), a: n * n, h: `(100 ${d < 0 ? '−' : '+'} ${Math.abs(d)})² = ${f(10000)} ${d < 0 ? '−' : '+'} ${f(Math.abs(200 * d))} + ${d * d} = ${f(n * n)}` }; },
      L => { if (L < 2) return null; const b = ri(20, 60), a = b + ri(2, 12);
        return { q: `${sup(a, 2)}${M}${sup(b, 2)}`, a: a * a - b * b, h: `(a − b)(a + b) = ${a - b}${X}${a + b} = ${f(a * a - b * b)}` }; },
      L => { const a = ri(2, 5), b = ri(2, [4, 7, 9][L]);
        return { q: `${sup(2, a)}${X}${sup(2, b)}`, a: 2 ** (a + b), h: `some os expoentes: ${sup(2, a + b)} = ${f(2 ** (a + b))}` }; },
      L => { if (!L) return null; const n = pick([11, 111]), e = 2;
        return { q: sup(n, e), a: n * n, h: `${n}² = ${f(n * n)} (o padrão 1-2-1 / 1-2-3-2-1)` }; },
      L => { const b = pick([2, 3, 4, 5, 6, 10]), e = ri(2, 4);
        return L === 0 || b ** (2 * e) > 70000 ? null : { q: `(${sup(b, e)})<sup>2</sup>`, a: b ** (2 * e), h: `multiplique os expoentes: ${sup(b, 2 * e)} = ${f(b ** (2 * e))}` }; },
    ],
    raiz: [
      L => { const n = ri(...[[2, 5], [3, 9], [6, 15]][L]);
        return { q: `∛${f(n ** 3)}`, a: n, h: `${n}${X}${n}${X}${n} = ${f(n ** 3)}` }; },
      L => { const sq = [[2, 5], [2, 10], [3, 15]][L], a = ri(...sq), b = ri(...sq);
        return { q: `√(${a * a}${X}${b * b})`, a: a * b, h: `√${a * a}${X}√${b * b} = ${a}${X}${b} = ${a * b}` }; },
      L => { if (!L) return null; const s = pick([2, 3, 5, 6, 7]); let m, n; do { m = ri(1, 4); n = ri(1, L === 1 ? 3 : 5); } while (m === n);
        const x = s * m * m, y = s * n * n;
        return { q: `√${x}${X}√${y}`, a: s * m * n, h: `junte numa raiz só: √${x * y} = ${s * m * n}` }; },
      L => { const [p, q, r] = pick(L === 0 ? [TRIPLES[0]] : L === 1 ? TRIPLES.slice(0, 3) : TRIPLES), k = ri(1, L === 0 ? 3 : 2);
        const a = p * k, b = q * k, c = r * k;
        if (L === 2 && Math.random() < .5) return { ctx: 'cateto de um triângulo retângulo', q: `√(${c}² − ${a}²)`, a: b, h: `${f(c * c)}${M}${f(a * a)} = ${f(b * b)} → ${b} (terno ${p}-${q}-${r}${k > 1 ? ` × ${k}` : ''})` };
        return { ctx: 'hipotenusa de um triângulo retângulo', q: `√(${a}² + ${b}²)`, a: c, h: `${f(a * a)} + ${f(b * b)} = ${f(c * c)} → ${c} (terno ${p}-${q}-${r}${k > 1 ? ` × ${k}` : ''})` }; },
      L => { const n = ri(...[[2, 9], [11, 19], [21, 40]][L]);
        return { q: `√${f(n * n * 100)}`, a: n * 10, h: `√${f(n * n)}${X}√100 = ${n}${X}10 = ${n * 10}` }; },
      L => { if (!L) return null; const n = ri(2, L === 1 ? 4 : 6);
        return { q: `⁴√${f(n ** 4)}`, a: n, h: `raiz quarta é raiz da raiz: √${f(n ** 4)} = ${n * n}, √${n * n} = ${n}` }; },
      L => { const e = 2 * ri(...[[1, 4], [3, 7], [5, 10]][L]);
        return { q: `√${sup(2, e)}`, a: 2 ** (e / 2), h: `metade do expoente: ${sup(2, e / 2)} = ${f(2 ** (e / 2))}` }; },
      L => { const n = ri(...[[3, 12], [11, 30], [25, 60]][L]);
        return { ctx: `Um quadrado tem área de ${f(n * n)} m². Quanto mede o lado, em metros?`, q: '', a: n, h: `lado = √${f(n * n)} = ${n}` }; },
      L => { const a = ri(2, 12), b = ri(2, 12);
        return L === 2 ? null : { q: `√${a * a} + √${b * b}`, a: a + b, h: `${a} + ${b} = ${a + b}` }; },
    ],
    porc: [
      L => { if (!L) return null; const p = pick(L === 1 ? [10, 20, 25, 50, 75] : [5, 15, 30, 40, 60, 12, 35]), base = 100 / gcd(p, 100), N = base * ri(Math.ceil(20 / base), Math.floor(800 / base));
        return { ctx: `${f(N * p / 100)} é quantos por cento de ${f(N)}?`, q: '', a: p, h: `${f(N * p / 100)} ÷ ${f(N)} = ${f(p / 100)} → ${p}%` }; },
      L => { const p = pick([[10, 20, 50], [10, 15, 20, 25, 30], [12, 15, 35, 40, 45]][L]), base = 100 / gcd(p, 100), N = base * ri(Math.ceil(20 / base), Math.floor([200, 600, 1500][L] / base)), d = N * p / 100;
        return Math.random() < .5
          ? { ctx: `Um produto de R$ ${f(N)} está com ${p}% de desconto. Quanto custa agora, em reais?`, q: '', a: N - d, h: `${p}% de ${f(N)} = ${f(d)} → ${f(N)}${M}${f(d)} = ${f(N - d)}` }
          : { ctx: `Um salário de R$ ${f(N)} teve aumento de ${p}%. Qual o novo valor, em reais?`, q: '', a: N + d, h: `${p}% de ${f(N)} = ${f(d)} → ${f(N)} + ${f(d)} = ${f(N + d)}` }; },
      L => { if (L < 2) return null; const p = pick([10, 20, 50]), q = pick([10, 20, 25, 50]), N = 100 * ri(2, 40) * (100 / gcd(p * q, 10000) > 100 ? 2 : 1);
        const a = N * p * q / 10000; if (!Number.isInteger(a)) return null;
        return { q: `${p}% de ${q}% de ${f(N)}`, a, h: `${q}% de ${f(N)} = ${f(N * q / 100)}, e ${p}% disso = ${f(a)}` }; },
      L => { const p = pick([[50, 25, 10], [5, 15, 20, 40], [2, 4, 8, 16, 32]][L]), base = 100 / gcd(p, 100), N = base * ri(Math.ceil(10 / base), Math.floor([200, 800, 3000][L] / base));
        return { q: `${f(N)}% de ${p}`, a: N * p / 100, h: `x% de y = y% de x: ${p}% de ${f(N)} = ${f(N * p / 100)}` }; },
    ],
    fat: [
      L => { const a = ri(0, [4, 5, 6][L]), b = ri(0, [4, 5, 6][L]);
        return { q: `${a}! + ${b}!`, a: fact(a) + fact(b), h: `${fact(a)} + ${fact(b)} = ${fact(a) + fact(b)}${a === 0 || b === 0 ? ' (lembre: 0! = 1)' : ''}` }; },
      L => { const n = ri(...[[10, 99], [100, 999], [1000, 2025]][L]);
        return { q: `${f(n + 1)}! / ${f(n)}!`, a: n + 1, h: `${f(n + 1)}! = ${f(n + 1)}${X}${f(n)}!, então sobra ${f(n + 1)}` }; },
      L => { const n = ri(...[[3, 5], [5, 7], [6, 9]][L]);
        return { ctx: 'Qual é o n?', q: `n! = ${f(fact(n))}`, a: n, h: `vá multiplicando: ${Array.from({ length: n }, (_, i) => f(fact(i + 1))).join(' → ')} → n = ${n}` }; },
      L => { if (!L) return null; const n = L === 1 ? ri(10, 30) : ri(25, 130);
        let z = 0, terms = []; for (let p = 5; p <= n; p *= 5) { z += Math.floor(n / p); terms.push(`${n} ÷ ${p} → ${Math.floor(n / p)}`); }
        return { ctx: `Quantos zeros tem no final de ${n}!?`, q: '', a: z, h: `cada zero vem de um par 2×5; conte os fatores 5: ${terms.join('; ')}${terms.length > 1 ? ` → total ${z}` : ''}` }; },
      L => { if (!L) return null; const n = ri(4, L === 1 ? 6 : 8);
        return { q: `${n}!${M}${n - 1}!`, a: fact(n) - fact(n - 1), h: `põe ${n - 1}! em evidência: ${n - 1}!${X}(${n} − 1) = ${f(fact(n - 1))}${X}${n - 1} = ${f(fact(n) - fact(n - 1))}` }; },
      L => { const n = ri(...[[3, 5], [5, 7], [7, 8]][L]);
        return { q: `${n}${X}${n - 1}!`, a: fact(n), h: `isso é ${n}! = ${n}${X}${f(fact(n - 1))} = ${f(fact(n))}` }; },
      L => { const n = ri(...[[4, 6], [6, 8], [8, 10]][L]);
        return { q: `${n}! / (${n - 1}! + ${n - 2}!)`, a: fact(n) / (fact(n - 1) + fact(n - 2)), h: `divida tudo por ${n - 2}!: ${n}·${n - 1} / (${n - 1} + 1) = ${n * (n - 1)} / ${n} = ${n - 1}` }; },
      L => { if (!L) return null; const n = ri(5, L === 1 ? 7 : 10);
        return { q: `${n}! / ${n - 2}!`, a: n * (n - 1), h: `${n}${X}${n - 1} = ${n * (n - 1)}` }; },
    ],
    perm: [
      L => { if (!L) return null; const n = ri(4, L === 1 ? 5 : 7);
        return { ctx: `Uma família de ${n} pessoas vai tirar foto em fila, e o casal quer ficar lado a lado. Quantas fotos diferentes?`, q: '', a: 2 * fact(n - 1), h: `cole o casal num bloco: ${n - 1}! posições × 2 ordens do casal = ${2 * fact(n - 1)}` }; },
      L => { if (L < 2) return null; const a = ri(2, 3), b = ri(2, 3);
        return { ctx: `Numa prateleira vão ${a} livros de matemática e ${b} de física, com os do mesmo assunto juntos. De quantas formas?`, q: '', a: 2 * fact(a) * fact(b), h: `2! ordens dos blocos × ${a}! × ${b}! = 2 × ${fact(a)} × ${fact(b)} = ${2 * fact(a) * fact(b)}` }; },
      L => { const w = pick(DISTINCT_WORDS.filter(w => w.length >= [3, 4, 5][L] && w.length <= [4, 5, 6][L])), n = w.length, v = [...w].filter(c => 'AEIOU'.includes(c)).length;
        return L === 0 ? null : { ctx: 'Quantos anagramas da palavra abaixo começam com vogal?', q: w, a: v * fact(n - 1), h: `${v} vogais para a 1ª posição × ${n - 1}! para o resto = ${v}${X}${fact(n - 1)} = ${f(v * fact(n - 1))}` }; },
      L => { const n = ri(...[[3, 4], [4, 6], [6, 7]][L]);
        return { ctx: `De quantas formas ${n} carros podem ocupar ${n} vagas numeradas?`, q: '', a: fact(n), h: `${n}! = ${f(fact(n))}` }; },
    ],
    prep: [
      L => { if (!L) return null; const n = L === 1 ? ri(4, 6) : ri(6, 8), k = ri(2, n - 2);
        return { ctx: `Uma moeda é lançada ${n} vezes. Quantas sequências têm exatamente ${k} caras?`, q: '', a: Cb(n, k), h: `arrumar ${k} K e ${n - k} C: ${n}! / (${k}!·${n - k}!) = ${Cb(n, k)}` }; },
      L => { const sets = [['1123', '1122'], ['11223', '11122', '112233'], ['1112233', '1122334', '11112222']][L], s = pick(sets), r = repCount(s);
        return { ctx: `Quantos números diferentes dá para formar usando todos estes algarismos?`, q: s.split('').join(' '), a: r, h: `${s.length}! dividido pelos fatoriais das repetições = ${f(r)}` }; },
    ],
    arr: [
      L => { const n = ri(...[[4, 6], [5, 8], [7, 10]][L]);
        return { ctx: `Uma bandeira tem 3 listras, cada uma de uma cor diferente, escolhidas entre ${n} cores. Quantas bandeiras?`, q: '', a: Ar(n, 3), h: `${chain(n, 3)} = ${Ar(n, 3)}` }; },
      L => { if (L < 2) return null; return Math.random() < .5
        ? { ctx: 'Quantas senhas de 4 dígitos (0 a 9) têm todos os dígitos diferentes?', q: '', a: 5040, h: `10 × 9 × 8 × 7 = 5.040` }
        : { ctx: 'Quantos números de 3 algarismos distintos existem (sem começar com 0)?', q: '', a: 648, h: `9 opções para o 1º (sem o 0) × 9 × 8 = 648` }; },
      L => { const n = ri(...[[3, 6], [6, 10], [10, 20]][L]);
        return { ctx: `Num campeonato com ${n} times, cada time joga com cada outro em casa e fora. Quantos jogos?`, q: '', a: n * (n - 1), h: `ordem importa (mandante, visitante): ${n}${X}${n - 1} = ${n * (n - 1)}` }; },
    ],
    comb: [
      L => { const n = ri(...[[4, 7], [6, 12], [10, 20]][L]);
        return { ctx: `Quantas diagonais tem um polígono convexo de ${n} lados?`, q: '', a: n * (n - 3) / 2, h: `cada vértice liga a ${n - 3} outros, e cada diagonal conta 2 vezes: ${n}${X}${n - 3} ÷ 2 = ${n * (n - 3) / 2}` }; },
      L => { const n = ri(...[[4, 6], [5, 8], [7, 11]][L]);
        return { ctx: `Há ${n} pontos num círculo. Quantos triângulos dá para formar com vértices nesses pontos?`, q: '', a: Cb(n, 3), h: `C(${n},3) = ${chain(n, 3)} ÷ 6 = ${Cb(n, 3)}` }; },
      L => { if (!L) return null; const n = ri(7, L === 1 ? 9 : 12), k = ri(3, 4);
        return { ctx: `De ${n} pessoas, uma comissão de ${k}, e a Ana precisa estar nela. Quantas comissões?`, q: '', a: Cb(n - 1, k - 1), h: `a Ana já está; escolha ${k - 1} entre os outros ${n - 1}: C(${n - 1},${k - 1}) = ${Cb(n - 1, k - 1)}` }; },
      L => { const n = ri(...[[3, 5], [5, 8], [8, 12]][L]);
        return { ctx: `Num torneio com ${n} times, cada um joga uma vez contra cada outro. Quantos jogos?`, q: '', a: Cb(n, 2), h: `C(${n},2) = ${n}${X}${n - 1} ÷ 2 = ${Cb(n, 2)}` }; },
      L => { if (L < 2) return null; const n = ri(5, 8), a = ri(2, 3), b = ri(2, 3);
        return { ctx: `Um grupo tem ${n} homens e ${n - 1} mulheres. Quantas comissões com ${a} homens e ${b} mulheres?`, q: '', a: Cb(n, a) * Cb(n - 1, b), h: `C(${n},${a})${X}C(${n - 1},${b}) = ${Cb(n, a)}${X}${Cb(n - 1, b)} = ${f(Cb(n, a) * Cb(n - 1, b))}` }; },
    ],
    conj: [
      L => { const A = ri(8, [20, 50, 90][L]), I = ri(1, A - 2);
        return { ctx: `n(A) = ${A} e n(A ∩ B) = ${I}`, q: 'n(A − B)', a: A - I, h: `só A, sem B: ${A}${M}${I} = ${A - I}` }; },
      L => { const U = ri(20, [50, 100, 300][L]), A = ri(5, U - 3);
        return { ctx: `O universo tem ${U} elementos e n(A) = ${A}`, q: 'n(Aᶜ)', a: U - A, h: `complementar: ${U}${M}${A} = ${U - A}` }; },
      L => { if (!L) return null; const n = ri(5, L === 1 ? 7 : 10), k = ri(2, 3);
        return { ctx: `Quantos subconjuntos com exatamente ${k} elementos tem um conjunto de ${n} elementos?`, q: '', a: Cb(n, k), h: `C(${n},${k}) = ${Cb(n, k)}` }; },
      L => { if (L < 2) return null; const n = ri(5, 10);
        return { ctx: `Quantos subconjuntos de {1, 2, …, ${n}} contêm o número 1?`, q: '', a: 2 ** (n - 1), h: `o 1 está fixo; os outros ${n - 1} entram ou não: ${sup(2, n - 1)} = ${2 ** (n - 1)}` }; },
      L => { const N = [30, 100, 200][L], a = pick([2, 3, 4]), b = pick([5, 7]), m = lcm(a, b);
        const na = Math.floor(N / a), nb = Math.floor(N / b), nab = Math.floor(N / m);
        return L === 0
          ? { ctx: `Quantos números de 1 a ${N} são múltiplos de ${a}?`, q: '', a: na, h: `${N} ÷ ${a} = ${na} (parte inteira)` }
          : { ctx: `Quantos números de 1 a ${N} são múltiplos de ${a} ou de ${b}?`, q: '', a: na + nb - nab, h: `${na} + ${nb}${M}${nab} (múltiplos de ${m}) = ${na + nb - nab}` }; },
    ],
    mdc: [
      L => { const pairs = [[[2, 3], [3, 4], [4, 6], [5, 10], [6, 8]], [[6, 8], [8, 12], [10, 15], [12, 18], [9, 12]], [[12, 18], [15, 20], [18, 24], [20, 30], [14, 21], [16, 24]]][L], [a, b] = pick(pairs), m = lcm(a, b);
        return { ctx: `Um ônibus passa a cada ${a} min e outro a cada ${b} min. Passaram juntos agora. Daqui a quantos minutos passam juntos de novo?`, q: '', a: m, h: `mmc(${a}, ${b}) = ${m}` }; },
      L => { let x, y; do { x = ri(2, 6); y = ri(2, 6); } while (gcd(x, y) !== 1 || x === y); const d = ri(...[[2, 6], [4, 12], [8, 20]][L]), a = d * x, b = d * y;
        return { ctx: `Duas fitas de ${a} cm e ${b} cm vão ser cortadas em pedaços iguais, do maior tamanho possível, sem sobra. Quanto mede cada pedaço, em cm?`, q: '', a: d, h: `mdc(${a}, ${b}) = ${d}` }; },
      L => { if (L < 2) return null; let a, b; do { a = ri(6, 30); b = ri(6, 30); } while (a === b);
        return { q: `mdc(${a}, ${b})${X}mmc(${a}, ${b})`, a: a * b, h: `mdc × mmc = produto dos dois: ${a}${X}${b} = ${a * b}` }; },
    ],
  };

  GEN.cont = { name: 'Contagem', g(L) {
    const k = pick([['roupa', 'mult', 'estrada', 'card'], ['roupa', 'div', 'card', 'estrada', 'digitos'], ['div', 'volta', 'placa', 'digitos', 'impar']][L]);
    if (k === 'roupa') { const a = ri(2, [4, 6, 8][L]), b = ri(2, [4, 5, 7][L]), c = L ? ri(2, 4) : 1;
      return { ctx: `Você tem ${a} camisas, ${b} calças${c > 1 ? ` e ${c} pares de tênis` : ''}. Quantos looks diferentes?`, q: '', a: a * b * c, h: `princípio multiplicativo: ${[a, b, c].filter(x => x > 1).join(X)} = ${a * b * c}` }; }
    if (k === 'card') { const a = ri(2, 5), b = ri(3, 6), c = ri(2, 4);
      return { ctx: `Um restaurante tem ${a} entradas, ${b} pratos e ${c} sobremesas. Quantas refeições completas dá para montar?`, q: '', a: a * b * c, h: `${a}${X}${b}${X}${c} = ${a * b * c}` }; }
    if (k === 'mult') { const N = 10 * ri(3, 10), d = ri(2, 9);
      return { ctx: `Quantos números de 1 a ${N} são múltiplos de ${d}?`, q: '', a: Math.floor(N / d), h: `${N} ÷ ${d} = ${Math.floor(N / d)} (parte inteira)` }; }
    if (k === 'estrada') { const a = ri(2, 5), b = ri(2, 5);
      return { ctx: `De A a B há ${a} estradas e de B a C há ${b}. De quantas formas dá para ir de A a C passando por B?`, q: '', a: a * b, h: `${a}${X}${b} = ${a * b}` }; }
    if (k === 'volta') { const a = ri(3, 5), b = ri(3, 5);
      return { ctx: `De A a B há ${a} estradas e de B a C há ${b}. Ir de A a C e voltar, sem repetir estrada nenhuma: quantas formas?`, q: '', a: a * b * (b - 1) * (a - 1), h: `ida ${a}${X}${b}, volta ${b - 1}${X}${a - 1} → ${a * b}${X}${(a - 1) * (b - 1)} = ${a * b * (a - 1) * (b - 1)}` }; }
    if (k === 'div') { let e, N; do { e = [ri(0, 4), ri(0, 3), ri(0, L === 2 ? 2 : 1)]; N = 2 ** e[0] * 3 ** e[1] * 5 ** e[2]; } while (N < 12 || N > [0, 200, 2000][L]);
      const d = (e[0] + 1) * (e[1] + 1) * (e[2] + 1);
      return { ctx: `Quantos divisores positivos tem ${f(N)}?`, q: '', a: d, h: `${f(N)} = ${factor(N)} → some 1 a cada expoente e multiplique: ${e.filter(x => x).map(x => x + 1).join(X)} = ${d}` }; }
    if (k === 'digitos') return L === 1
      ? { ctx: 'Quantos números de 3 algarismos existem?', q: '', a: 900, h: '9 × 10 × 10 = 900 (o primeiro não pode ser 0)' }
      : { ctx: 'Quantos números de 3 algarismos têm todos os algarismos ímpares?', q: '', a: 125, h: '5 × 5 × 5 = 125' };
    if (k === 'impar') { const n = ri(3, 4);
      return { ctx: `Quantos números ímpares de ${n} algarismos distintos dá para formar com os dígitos 1 a 6?`, q: '', a: 3 * Ar(5, n - 1), h: `último: 3 ímpares; os outros ${n - 1}: ${chain(5, n - 1)} → 3${X}${Ar(5, n - 1)} = ${3 * Ar(5, n - 1)}` }; }
    return { ctx: 'Em uma placa com 2 letras (A–Z) e 1 dígito, quantas placas existem?', q: '', a: 6760, h: '26 × 26 × 10 = 6.760' };
  } };
  const OLDK = Object.keys(GEN);
