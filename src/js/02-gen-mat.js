  // ================== MATEMÁTICA: tópicos do programa ==================
  topic('frac', 'mat', 'Frações e decimais', [
    L => { // soma de frações com resultado decimal exato
      const ds = [[2, 4, 5, 10], [2, 4, 5, 8, 10, 20], [4, 8, 20, 25, 40]][L];
      const d1 = pick(ds), d2 = pick(ds), n1 = ri(1, d1 - 1), n2 = ri(1, d2 - 1), r = rd(n1 / d1 + n2 / d2);
      return { ctx: 'Dê o resultado em decimal.', q: `${n1}/${d1} + ${n2}/${d2}`, a: r, h: `${f(rd(n1 / d1))} + ${f(rd(n2 / d2))} = ${f(r)}` };
    },
    L => { const d = pick([[2, 3, 4, 5], [3, 4, 5, 6, 8], [6, 7, 8, 9, 12]][L]), n = ri(1, d - 1), k = ri(2, [10, 20, 40][L]), N = d * k;
      return { q: `${n}/${d} de ${f(N)}`, a: n * k, h: `${f(N)} ÷ ${d} = ${k}, × ${n} = ${f(n * k)}` }; },
    L => { const a = ri(1, 9), b = ri(1, 9), ea = L ? ri(1, 2) : 1, eb = L === 2 ? ri(1, 2) : 1, x = a / 10 ** ea, y = L ? b / 10 ** eb : ri(2, 20);
      return { q: `${f(x)}${X}${f(y)}`, a: rd(x * y), h: `faça ${a}${X}${L ? b : y} = ${a * (L ? b : y)} e conte as casas decimais: ${f(rd(x * y))}` }; },
    L => { const d = pick([0.2, 0.3, 0.4, 0.5, 0.25, 0.6, 0.8]), q = ri(2, [9, 15, 30][L]), n = rd(d * q);
      return { q: `${f(n)} ÷ ${f(d)}`, a: q, h: `multiplique os dois por ${d === 0.25 ? 100 : 10} para tirar a vírgula: ${f(rd(n * (d === 0.25 ? 100 : 10)))} ÷ ${f(rd(d * (d === 0.25 ? 100 : 10)))} = ${q}` }; },
    L => { const [n, d] = pick([[[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [1, 10]], [[1, 8], [3, 8], [3, 5], [7, 10], [3, 20], [9, 25]], [[5, 8], [7, 8], [1, 16], [7, 40], [11, 20], [1, 3]]][L]);
      if (d === 3) return { ctx: 'Em porcentagem, com duas casas decimais.', q: '1/3', a: 33.33, h: '1/3 = 0,3333… ≈ 33,33%' };
      return { ctx: 'Escreva em porcentagem.', q: `${n}/${d}`, a: rd(100 * n / d), h: `${n} ÷ ${d} = ${f(rd(n / d))} = ${f(rd(100 * n / d))}%` }; },
    L => { if (!L) return null; const a = ri(1, 5), b = pick([2, 3, 4, 5, 6, 8]), c = ri(1, 3), dd = pick([2, 4, 8, 16, 3, 6, 9, 12]);
      const v = rd((a / b) / (c / dd)); if (!Number.isInteger(v) || v < 1) return null;
      return { q: `${a}/${b} ÷ ${c}/${dd}`, a: v, h: `inverta a segunda e multiplique: ${a}/${b}${X}${dd}/${c} = ${a * dd}/${b * c} = ${v}` }; },
    L => { if (L < 2) return null; const pairs = [[3, 7, 4, 9], [5, 8, 3, 5], [2, 3, 5, 7], [4, 7, 5, 9], [7, 12, 3, 5], [5, 6, 7, 9]], [a, b, c, d] = pick(pairs);
      const big = a * d > c * b ? `${a}/${b}` : `${c}/${d}`, small = big === `${a}/${b}` ? `${c}/${d}` : `${a}/${b}`;
      return mc({ ctx: 'Qual é a maior?', ok: big, no: [small], h: `multiplique cruzado: ${a}${X}${d} = ${a * d} e ${c}${X}${b} = ${c * b}` }); },
    L => { if (L < 2) return null; const [dz, fr] = pick([['0,333…', '1/3'], ['0,666…', '2/3'], ['0,1666…', '1/6'], ['0,0909…', '1/11'], ['0,121212…', '4/33'], ['0,8333…', '5/6']]);
      return mc({ ctx: 'Que fração gera esta dízima?', q: dz, ok: fr, no: shuffle(['1/3', '2/3', '1/6', '1/11', '4/33', '5/6', '1/9', '3/11'].filter(x => x !== fr)).slice(0, 3), h: `confira dividindo: ${fr} = ${dz}` }); },
  ]);

  topic('seq', 'mat', 'Progressões (PA e PG)', [
    L => { const a1 = ri(-5, 12), r = ri(2, [5, 9, 15][L]), n = ri(5, [10, 30, 60][L]), an = a1 + (n - 1) * r;
      return { ctx: `PA com a₁ = ${a1} e razão ${r}.`, q: `a<sub>${n}</sub>`, a: an, h: `a₁ + (n − 1)·r = ${a1} + ${n - 1}${X}${r} = ${an}` }; },
    L => { const a1 = ri(1, 10), r = ri(1, [4, 6, 10][L]), n = [4, 10, 20][L] + 2 * ri(0, [3, 5, 10][L]), an = a1 + (n - 1) * r, s = (a1 + an) * n / 2;
      return { ctx: `Soma dos ${n} primeiros termos da PA`, q: `${a1}, ${a1 + r}, ${a1 + 2 * r}, …`, a: s, h: `a${n} = ${an}; S = (a₁ + aₙ)·n ÷ 2 = (${a1} + ${an})${X}${n} ÷ 2 = ${f(s)}` }; },
    L => { const r = ri(2, 9), a1 = ri(-10, 20), i = ri(1, 4), j = i + ri(2, 6);
      return { ctx: `Numa PA, a<sub>${i}</sub> = ${a1 + (i - 1) * r} e a<sub>${j}</sub> = ${a1 + (j - 1) * r}. Qual a razão?`, q: '', a: r, h: `(${a1 + (j - 1) * r} − ${a1 + (i - 1) * r}) ÷ (${j} − ${i}) = ${r}` }; },
    L => { const a1 = ri(1, 5), q = pick([[2, 3], [2, 3, 5], [2, 3, 4, 5]][L]), n = ri(3, [5, 6, 7][L]), an = a1 * q ** (n - 1); if (an > 20000) return null;
      return { ctx: `PG com a₁ = ${a1} e razão ${q}.`, q: `a<sub>${n}</sub>`, a: an, h: `a₁·q<sup>n−1</sup> = ${a1}${X}${sup(q, n - 1)} = ${f(an)}` }; },
    L => { if (!L) return null; const q = pick([2, 3]), n = ri(4, L === 1 ? 6 : 9), a1 = ri(1, 3), s = a1 * (q ** n - 1) / (q - 1);
      return { ctx: `Soma dos ${n} primeiros termos da PG`, q: `${a1}, ${a1 * q}, ${a1 * q * q}, …`, a: s, h: `a₁(qⁿ − 1)/(q − 1) = ${a1}(${sup(q, n)} − 1)/${q - 1} = ${f(s)}` }; },
    L => { if (!L) return null; const [a1, qn, qd] = pick([[8, 1, 2], [12, 1, 2], [9, 1, 3], [27, 1, 3], [12, 1, 4], [10, 1, 5], [18, 1, 3], [9, 2, 3], [5, 1, 2]]);
      const s = rd(a1 / (1 - qn / qd));
      return { ctx: 'Soma infinita da PG', q: `${a1} + ${f(rd(a1 * qn / qd))} + ${f(rd(a1 * qn * qn / qd / qd))} + …`, a: s, h: `razão ${qn}/${qd}; S = a₁ ÷ (1 − q) = ${a1} ÷ ${qd - qn}/${qd} = ${a1}${X}${qd}/${qd - qn} = ${f(s)}` }; },
    L => { const r = ri(2, 12), x = ri(1, 30), g = L === 2 && Math.random() < .5;
      if (g) { const m = pick([2, 3, 4, 5, 6]), k = pick([2, 3]); return { ctx: `${m}, x, ${m * k * k} formam uma PG de termos positivos.`, q: 'x', a: m * k, h: `termo do meio = média geométrica: √(${m}${X}${m * k * k}) = ${m * k}` }; }
      return { ctx: `x, ${x + r}, ${x + 2 * r} formam uma PA.`, q: 'x', a: x, h: `razão ${x + 2 * r} − ${x + r} = ${r}; x = ${x + r} − ${r} = ${x}` }; },
    L => { if (L < 2) return null; const k = ri(3, 13), lo = ri(10, 150), hi = lo + ri(80, 300); const first = Math.ceil(lo / k) * k, last = Math.floor(hi / k) * k, n = (last - first) / k + 1;
      return { ctx: `Quantos múltiplos de ${k} existem entre ${lo} e ${hi}?`, q: '', a: n, h: `PA de ${first} até ${last}, razão ${k}: (${last} − ${first}) ÷ ${k} + 1 = ${n}` }; },
  ]);

  topic('juros', 'mat', 'Juros e porcentagem', [
    L => { const C = pick([500, 1000, 2000, 1500, 4000, 800]), i = pick([1, 2, 3, 5, 10]), t = ri(2, [5, 12, 24][L]), J = C * i * t / 100;
      return { ctx: `Juros simples: R$ ${f(C)} a ${i}% ao mês, por ${t} meses. Quantos reais de juros?`, q: '', a: J, h: `J = C·i·t = ${f(C)}${X}${f(i / 100)}${X}${t} = ${f(J)}` }; },
    L => { const C = pick([1000, 2000, 5000, 10000, 100]), [i, t] = pick([[[10, 2]], [[10, 2], [10, 3], [20, 2], [50, 2]], [[5, 2], [10, 3], [20, 3], [30, 2], [100, 3]]][L]), M = rd(C * (1 + i / 100) ** t);
      return { ctx: `Juros compostos: R$ ${f(C)} a ${i}% ao mês, por ${t} meses. Montante em reais?`, q: '', a: M, h: `M = C·(1 + i)<sup>t</sup> = ${f(C)}${X}${sup(f(1 + i / 100), t)} = ${f(C)}${X}${f(rd((1 + i / 100) ** t))} = ${f(M)}` }; },
    L => { const p = pick([5, 10, 15, 20, 25, 30, 40, 12, 8]), up = Math.random() < .5;
      return { ctx: `${up ? 'Aumentar' : 'Dar desconto de'} ${p}% é multiplicar por quanto?`, q: '', a: rd(1 + (up ? p : -p) / 100), h: `1 ${up ? '+' : '−'} ${f(p / 100)} = ${f(rd(1 + (up ? p : -p) / 100))}` }; },
    L => { if (!L) return null; const [a, b] = pick(L === 1 ? [[20, 20], [10, 10], [10, -10], [50, -50], [20, -20]] : [[30, -30], [25, -20], [50, -20], [10, 20], [-20, -25], [40, -50]]), v = rd(((1 + a / 100) * (1 + b / 100) - 1) * 100);
      const w = x => x > 0 ? `aumento de ${x}%` : `queda de ${-x}%`;
      return { ctx: `Um preço sofre ${w(a)} e depois ${w(b)}. Variação total, em % (negativa se caiu)?`, q: '', a: v, h: `${f(rd(1 + a / 100))}${X}${f(rd(1 + b / 100))} = ${f(rd(1 + v / 100))} → ${v > 0 ? '+' : ''}${f(v)}%` }; },
    L => { if (L < 2) return null; const [d, u] = pick([[20, 25], [50, 100], [60, 150], [75, 300], [80, 400], [25, 33.33], [10, 11.11]]);
      return { ctx: `Uma ação caiu ${d}%. Quanto precisa subir, em %, para voltar ao valor inicial?${u % 1 ? ' (duas casas)' : ''}`, q: '', a: u, h: `sobrou ${100 - d}%; 100 ÷ ${100 - d} ${u % 1 ? '≈' : '='} ${f(Math.round(1e4 * 100 / (100 - d)) / 1e4)} → subir ${f(u)}%` }; },
    L => { const comp = Math.random() < .5;
      return mc({ ctx: `Os montantes mês a mês, a juros ${comp ? 'compostos' : 'simples'}, formam uma:`, ok: comp ? 'PG de razão (1 + i)' : 'PA de razão C·i', no: comp ? ['PA de razão C·i', 'PA de razão i', 'PG de razão i'] : ['PG de razão (1 + i)', 'PG de razão i', 'PA de razão i'], h: comp ? 'cada mês multiplica pelo mesmo fator (1 + i)' : 'cada mês soma os mesmos juros C·i' }); },
    L => { const T = pick([2, 3, 4]), n = ri(2, [4, 5, 6][L]);
      return { ctx: `Uma dívida dobra a cada ${T} meses (juros compostos). Em ${T * n} meses, fica multiplicada por quanto?`, q: '', a: 2 ** n, h: `${n} dobras: ${sup(2, n)} = ${2 ** n}` }; },
  ]);

  topic('func', 'mat', 'Funções', [
    L => { const a = ri(-5, 9) || 2, b = ri(-10, 10), x = ri(-5, 8);
      return { ctx: `f(x) = ${poly([a, b])}`, q: `f(${x})`, a: a * x + b, h: `${a}${X}(${x}) ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${a * x + b}` }; },
    L => { const a = pick([2, 3, 4, 5, -2, -3]), r = ri(-6, 8), b = -a * r;
      return { ctx: `Raiz de f(x) = ${poly([a, b])}`, q: 'x', a: r, h: `${poly([a, b])} = 0 → x = ${-b}/${a} = ${r}` }; },
    L => { const x1 = ri(-4, 4), x2 = x1 + ri(1, 4), m = ri(-4, 5), y1 = ri(-5, 5), y2 = y1 + m * (x2 - x1);
      return { ctx: `Coeficiente angular da reta por (${x1}, ${y1}) e (${x2}, ${y2})`, q: 'm', a: m, h: `Δy/Δx = (${y2} − ${y1}) ÷ (${x2} − ${x1}) = ${m}` }; },
    L => { const r1 = ri(-6, 9), r2 = ri(-6, 9), S = r1 + r2, P = r1 * r2, big = Math.random() < .5;
      return { ctx: `${big ? 'Maior' : 'Menor'} raiz de`, q: `${poly([1, -S, P])} = 0`, a: big ? Math.max(r1, r2) : Math.min(r1, r2), h: `soma ${S} e produto ${P} → raízes ${Math.min(r1, r2)} e ${Math.max(r1, r2)}` }; },
    L => { const a = pick([1, -1, 2, -2]), xv = ri(-4, 5), yv = ri(-9, 9), b = -2 * a * xv, c = a * xv * xv + yv, askY = L > 0 && Math.random() < .6;
      return { ctx: `Vértice de y = ${poly([a, b, c])}`, q: askY ? 'y<sub>v</sub>' : 'x<sub>v</sub>', a: askY ? yv : xv, h: `x<sub>v</sub> = −b/2a = ${-b}/${2 * a} = ${xv}${askY ? `; y<sub>v</sub> = f(${xv}) = ${yv}` : ''}` }; },
    L => { const a = ri(1, 3), b = ri(-8, 8), c = ri(-6, 6), D = b * b - 4 * a * c;
      return { q: `Δ de ${poly([a, b, c])}`, a: D, h: `b² − 4ac = ${b * b} − 4·${a}·(${c}) = ${D}` }; },
    L => { if (!L) return null; const a = ri(2, 4), b = ri(-3, 5), x = ri(-3, 4), g = x * x, r = a * g + b;
      return { ctx: `f(x) = ${poly([a, b])} e g(x) = x²`, q: 'f(g(' + x + '))', a: r, h: `g(${x}) = ${g}; f(${g}) = ${r}` }; },
    L => { if (!L) return null; const a = pick([2, 3, 4, 5]), b = ri(-9, 9), y = a * ri(-3, 6) + b;
      return { ctx: `f(x) = ${poly([a, b])}`, q: `f<sup>−1</sup>(${y})`, a: (y - b) / a, h: `resolva ${poly([a, b])} = ${y}: x = (${y} ${b < 0 ? '+' : '−'} ${Math.abs(b)}) ÷ ${a} = ${(y - b) / a}` }; },
    L => { if (!L) return null; const a = ri(1, 2), b = ri(-6, 6), c = ri(-4, 6), D = b * b - 4 * a * c;
      return mc({ ctx: `Quantas raízes reais tem ${poly([a, b, c])} = 0?`, ok: D > 0 ? 'duas distintas' : D === 0 ? 'uma (dupla)' : 'nenhuma', no: ['duas distintas', 'uma (dupla)', 'nenhuma'], h: `Δ = ${D} ${D > 0 ? '> 0' : D === 0 ? '= 0' : '< 0'}` }); },
    L => { if (L < 2) return null; const c = ri(-5, 8), r = ri(2, 9);
      return { ctx: `Soma das soluções de |x ${c < 0 ? '+' : '−'} ${Math.abs(c)}| = ${r}`, q: '', a: 2 * c, h: `x = ${c} + ${r} = ${c + r} ou x = ${c} − ${r} = ${c - r}; soma ${2 * c}` }; },
    L => { if (L < 2) return null; const k = ri(1, 5), dir = pick(['x − ' + k, 'x + ' + k]);
      return mc({ ctx: `O gráfico de y = f(${dir}) é o de y = f(x) deslocado:`, ok: dir.includes('−') ? `${k} para a direita` : `${k} para a esquerda`, no: [`${k} para a direita`, `${k} para a esquerda`, `${k} para cima`, `${k} para baixo`], h: 'somar dentro do argumento desloca na horizontal, no sentido contrário ao sinal' }); },
    L => { if (L < 2) return null; const [fx, dom, no] = pick([['√(x − 3)', 'x ≥ 3', ['x > 3', 'x ≤ 3', 'x ≠ 3']], ['1/(x − 2)', 'x ≠ 2', ['x > 2', 'x ≥ 2', 'todo x real']], ['∛(x − 1)', 'todo x real', ['x ≥ 1', 'x > 1', 'x ≠ 1']], ['√(4 − x)', 'x ≤ 4', ['x ≥ 4', 'x < 4', 'x ≠ 4']], ['log(x + 1)', 'x > −1', ['x ≥ −1', 'x > 0', 'x ≠ −1']]]);
      return mc({ ctx: `Domínio real de f(x) = ${fx}`, ok: dom, no, h: fx.startsWith('√') ? 'raiz quadrada pede radicando ≥ 0' : fx.startsWith('∛') ? 'raiz cúbica existe para todo real' : fx.startsWith('1/') ? 'denominador não pode ser 0' : 'logaritmando > 0' }); },
  ]);

  topic('poli', 'mat', 'Polinômios', [
    L => { const cs = [1, ri(-4, 4), ri(-5, 5), ri(-6, 6)].slice(0, L ? 4 : 3), a = ri(-2, 3), v = cs.reduce((s, c) => s * a + c, 0);
      return { ctx: `Resto de P(x) = ${poly(cs)} dividido por (x ${a < 0 ? '+' : '−'} ${Math.abs(a)})`, q: '', a: v, h: `teorema do resto: P(${a}) = ${v}` }; },
    L => { const rs = [ri(-4, 5), ri(-4, 5), ri(1, 5)], [r1, r2, r3] = rs;
      if (L === 0) { const S = r1 + r2, P = r1 * r2, sum = Math.random() < .5;
        return { ctx: `${sum ? 'Soma' : 'Produto'} das raízes de`, q: poly([1, -S, P]), a: sum ? S : P, h: sum ? `−b/a = ${S}` : `c/a = ${P}` }; }
      const s1 = r1 + r2 + r3, s2 = r1 * r2 + r1 * r3 + r2 * r3, s3 = r1 * r2 * r3, k = pick(['s', 'p', 'pp']);
      return { ctx: `${k === 's' ? 'Soma' : k === 'p' ? 'Produto' : 'Soma dos produtos 2 a 2'} das raízes de`, q: poly([1, -s1, s2, -s3]), a: k === 's' ? s1 : k === 'p' ? s3 : s2,
        h: `Girard: soma = −b/a = ${s1}; 2 a 2 = c/a = ${s2}; produto = −d/a = ${s3}` }; },
    L => { const m = ri(2, 5), n = ri(1, 4);
      return Math.random() < .5 ? { ctx: `P tem grau ${m} e Q tem grau ${n}. Grau de P·Q?`, q: '', a: m + n, h: 'na multiplicação os graus se somam' }
        : { ctx: `P tem grau ${m + n} e Q tem grau ${n}. Grau do quociente P ÷ Q?`, q: '', a: m, h: 'na divisão os graus se subtraem' }; },
    L => { if (!L) return null; const a = ri(1, 3), b = ri(2, 4), r1 = ri(-3, 3), r2 = r1 + ri(1, 3), tot = Math.random() < .5;
      return { ctx: `P(x) = (x ${r1 < 0 ? '+' : '−'} ${Math.abs(r1)})${a > 1 ? sup('', a) : ''}·(x ${r2 < 0 ? '+' : '−'} ${Math.abs(r2)})${sup('', b)}. ${tot ? 'Quantas raízes contando multiplicidade?' : `Multiplicidade da raiz ${r2}?`}`, q: '', a: tot ? a + b : b, h: tot ? `grau = ${a} + ${b} = ${a + b}` : `o expoente do fator (x − ${r2}) é ${b}` }; },
    L => { if (!L) return null; const cs = [ri(1, 3), ri(-5, 5), ri(-5, 5), ri(-5, 5)];
      return { ctx: `Soma dos coeficientes de P(x) = ${poly(cs)}`, q: '', a: cs.reduce((s, c) => s + c, 0), h: 'soma dos coeficientes = P(1)' }; },
    L => { if (L < 2) return null; const r = ri(-3, 4), b = ri(-5, 5), k = -(r * r + b * r);
      return { ctx: `x² ${b < 0 ? '−' : '+'} ${Math.abs(b)}x + k é divisível por (x ${r < 0 ? '+' : '−'} ${Math.abs(r)}). Quanto vale k?`, q: '', a: k, h: `P(${r}) = 0: ${r * r} ${b * r < 0 ? '−' : '+'} ${Math.abs(b * r)} + k = 0 → k = ${k}` }; },
    L => { if (L < 2) return null; const n = pick([3, 4, 5, 6]), cx = ri(1, Math.floor(n / 2));
      return { ctx: `Um polinômio de grau ${n}, com coeficientes reais, tem ${cx === 1 ? 'a raiz' : 'as raízes'} ${['2 + i', '3i', '1 − 2i'].slice(0, cx).join(', ')}. No máximo quantas raízes reais?`, q: '', a: n - 2 * cx, h: `as conjugadas também são raízes: ${2 * cx} não reais; sobram ${n} − ${2 * cx} = ${n - 2 * cx}` }; },
  ]);

  topic('prob', 'mat', 'Probabilidade', [
    L => { const s = ri(2, 12), w = 6 - Math.abs(s - 7);
      return L === 0 ? { ctx: `Dois dados: de quantas formas a soma dá ${s}?`, q: '', a: w, h: `pares (dado 1, dado 2) que somam ${s}: ${w} de 36` }
        : mc({ ctx: `Dois dados: probabilidade de a soma ser ${s}?`, ok: sf(w, 36), no: [sf(w + 1, 36), sf(Math.max(1, w - 1), 36), sf(1, 6), sf(1, 12), sf(w, 12)], h: `${w} casos em 36 = ${sf(w, 36)}` }); },
    L => { const n = [3, 4, 5][L], k = ri(0, n), p = rd(100 * Cb(n, k) / 2 ** n);
      return { ctx: `${n} lançamentos de moeda. Probabilidade, em %, de exatamente ${k} cara${k === 1 ? '' : 's'}?`, q: '', a: p, h: `C(${n},${k}) / ${sup(2, n)} = ${Cb(n, k)}/${2 ** n} = ${f(p)}%` }; },
    L => { const tot = pick([4, 5, 10, 20, 25, 40, 50]), b = ri(1, tot - 1);
      return { ctx: `Urna com ${b} bolas brancas e ${tot - b} pretas. Probabilidade, em %, de tirar branca?`, q: '', a: rd(100 * b / tot), h: `${b}/${tot} = ${f(rd(100 * b / tot))}%` }; },
    L => { if (!L) return null; const n = ri(2, 4), p = rd(100 * (1 - 1 / 2 ** n));
      return { ctx: `${n} lançamentos de moeda. Probabilidade, em %, de sair pelo menos uma cara?`, q: '', a: p, h: `complementar: 1 − (1/2)<sup>${n}</sup> = 1 − ${f(1 / 2 ** n)} = ${f(p)}%` }; },
    L => { if (L < 2) return null; const b = ri(2, 5), p = ri(1, 4), n = b + p, num = b * (b - 1), den = n * (n - 1);
      return mc({ ctx: `Urna com ${b} brancas e ${p} pretas. Tirando 2 sem reposição, probabilidade de ambas brancas?`, ok: sf(num, den), no: [sf(b * b, n * n), sf(b, n), sf(b - 1, n - 1), sf(num, n * n)], h: `${b}/${n}${X}${b - 1}/${n - 1} = ${sf(num, den)}` }); },
    L => { if (!L) return null; const T = pick([40, 50, 80, 100, 200]), M = Math.round(T * pick([.4, .5, .6])), o = Math.round(M * pick([.2, .25, .4, .5])); if (!Number.isInteger(rd(1000 * o / M))) return null;
      return { ctx: `Numa turma de ${T}, ${M} são mulheres e ${o} delas usam óculos. Sorteada uma mulher, probabilidade, em %, de usar óculos?`, q: '', a: rd(100 * o / M), h: `condicional: o espaço vira só as ${M} mulheres: ${o}/${M} = ${f(rd(100 * o / M))}%` }; },
    L => { if (L < 2) return null; const [given, ev, fav, tot] = pick([['saiu par', 'ser maior que 3', 2, 3], ['saiu ímpar', 'ser primo', 2, 3], ['saiu maior que 2', 'ser par', 2, 4], ['saiu primo', 'ser par', 1, 3]]);
      return mc({ ctx: `Um dado: sabendo que ${given}, probabilidade de ${ev}?`, ok: sf(fav, tot), no: [sf(fav, 6), sf(1, 2), sf(1, 3), sf(2, 3), sf(3, 4)].filter(x => x !== sf(fav, tot)), h: `só os casos de "${given}" contam: ${fav} de ${tot}` }); },
    L => { const a = pick([10, 20, 30, 40, 50, 60]), b = pick([10, 20, 25, 50]);
      return L === 0 ? { ctx: `Eventos independentes: P(A) = ${a}% e P(B) = ${b}%. P(A e B), em %?`, q: '', a: rd(a * b / 100), h: `P(A)·P(B) = ${f(a / 100)}${X}${f(b / 100)} = ${f(rd(a * b / 10000))}` }
        : { ctx: `P(A) = ${a}%, P(B) = ${b}% e P(A ∩ B) = ${Math.min(a, b) / 2}%. P(A ∪ B), em %?`, q: '', a: a + b - Math.min(a, b) / 2, h: `${a} + ${b} − ${Math.min(a, b) / 2} = ${a + b - Math.min(a, b) / 2}` }; },
  ]);

  topic('binom', 'mat', 'Binômio de Newton', [
    L => { const n = ri(3, 12); return { ctx: `Quantos termos tem o desenvolvimento de (x + y)<sup>${n}</sup>?`, q: '', a: n + 1, h: 'são n + 1 termos' }; },
    L => { const n = ri(2, [5, 8, 10][L]), [e, base, txt] = pick(L ? [[1, 2, '(x + 1)'], [1, 3, '(x + 2)'], [1, 1, '(2x − 1)'], [1, 1, '(x + y − 1)'], [1, 3, '(2x + 1)']] : [[1, 2, '(x + 1)']]);
      return { ctx: `Soma dos coeficientes de ${txt}<sup>${n}</sup>`, q: '', a: base ** n, h: `troque as variáveis por 1: ${base}<sup>${n}</sup> = ${f(base ** n)}` }; },
    L => { if (!L) return null; const n = ri(4, L === 1 ? 7 : 10), k = ri(1, n - 1);
      return { ctx: `Coeficiente de x<sup>${k}</sup> em (x + 1)<sup>${n}</sup>`, q: '', a: Cb(n, k), h: `C(${n},${k}) = ${Cb(n, k)}` }; },
    L => { if (L < 2) return null; const n = ri(3, 5), k = ri(1, n - 1), v = Cb(n, k) * 2 ** (n - k);
      return { ctx: `Coeficiente de x<sup>${k}</sup> em (x + 2)<sup>${n}</sup>`, q: '', a: v, h: `C(${n},${k})·${sup(2, n - k)} = ${Cb(n, k)}${X}${2 ** (n - k)} = ${v}` }; },
    L => { if (L < 2) return null; const n = pick([2, 4, 6, 8]);
      return { ctx: `Termo independente de x em (x + 1/x)<sup>${n}</sup>`, q: '', a: Cb(n, n / 2), h: `precisa de x<sup>k</sup>·x<sup>−(n−k)</sup> = x⁰ → k = ${n / 2}: C(${n},${n / 2}) = ${Cb(n, n / 2)}` }; },
    L => { const n = ri(2, [4, 5, 6][L]), k = ri(0, n);
      return { ctx: `Linha ${n} do triângulo de Pascal (começando na linha 0): elemento de posição ${k} (começando em 0)`, q: '', a: Cb(n, k), h: `C(${n},${k}) = ${Cb(n, k)}` }; },
  ]);

  topic('matr', 'mat', 'Matrizes e sistemas', [
    L => { const [a, b, c, d] = [ri(-3, 6), ri(-4, 5), ri(-4, 5), ri(-3, 6)];
      return { q: `det ${mx([a, b, c, d], 2)}`, a: a * d - b * c, h: `ad − bc = ${a * d} − (${b * c}) = ${a * d - b * c}` }; },
    L => { if (!L) return null; const d = [ri(1, 4), ri(-3, 3) || 2, ri(1, 5)], o = [ri(-5, 5), ri(-5, 5), ri(-5, 5)];
      return { q: `det ${mx([d[0], o[0], o[1], 0, d[1], o[2], 0, 0, d[2]], 3)}`, a: d[0] * d[1] * d[2], h: `triangular: produto da diagonal = ${d[0]}${X}${d[1]}${X}${d[2]} = ${d[0] * d[1] * d[2]}` }; },
    L => { if (!L) return null; const n = pick([2, 3]), k = pick([2, 3, -1, -2]), D = ri(1, 5);
      return { ctx: `A é ${n}×${n} com det A = ${D}.`, q: `det(${k}A)`, a: k ** n * D, h: `det(kA) = kⁿ·det A = (${k})<sup>${n}</sup>${X}${D} = ${k ** n * D}` }; },
    L => { if (L < 2) return null; const a = ri(2, 5), b = pick([2, 4, 5, -2]), k = pick(['AB', 'inv', 'T']);
      if (k === 'AB') return { ctx: `det A = ${a} e det B = ${b}.`, q: 'det(AB)', a: a * b, h: 'det(AB) = det A · det B' };
      if (k === 'T') return { ctx: `det A = ${a}.`, q: 'det(A<sup>T</sup>)', a, h: 'transpor não muda o determinante' };
      return { ctx: `det A = ${b}.`, q: 'det(A<sup>−1</sup>)', a: rd(1 / b), h: `1 ÷ ${b} = ${f(rd(1 / b))}` }; },
    L => { const m = ri(1, 5), n = ri(1, 5), p = ri(1, 5);
      return { ctx: `A é ${m}×${n} e B é ${n}×${p}. Quantos elementos tem AB?`, q: '', a: m * p, h: `AB é ${m}×${p}` }; },
    L => { const x = ri(-5, 9), y = ri(-5, 9);
      if (L === 0) return { ctx: `x + y = ${x + y} e x − y = ${x - y}`, q: 'x', a: x, h: `somando: 2x = ${2 * x} → x = ${x}` };
      const a = ri(1, 3), b = ri(1, 3), c = ri(1, 3), d = ri(-3, 3) || 1; if (a * d - b * c === 0) return null;
      const askX = Math.random() < .5;
      return { ctx: `${a}x + ${b}y = ${a * x + b * y} e ${c}x ${d < 0 ? '−' : '+'} ${Math.abs(d)}y = ${c * x + d * y}`, q: askX ? 'x' : 'y', a: askX ? x : y, h: `elimine uma variável: x = ${x}, y = ${y}` }; },
    L => { if (L < 2) return null; const a = ri(1, 4), b = ri(1, 4), c = ri(1, 4), k = a * c / b; if (!Number.isInteger(k)) return null;
      return { ctx: `kx + ${a}y = 1 e ${b}x + ${c}y = 5. Para que valor de k o sistema não tem solução única?`, q: 'k', a: k, h: `det = ${c}k − ${a * b} = 0 → k = ${k}` }; },
    L => { if (!L) return null; const A = [ri(0, 3), ri(-2, 3), ri(-2, 3), ri(0, 3)], B = [ri(-2, 3), ri(0, 3), ri(0, 3), ri(-2, 3)], i = ri(0, 1), j = ri(0, 1), v = A[2 * i] * B[j] + A[2 * i + 1] * B[2 + j];
      return { ctx: `A = ${mx(A, 2)}, B = ${mx(B, 2)}. Elemento c<sub>${i + 1}${j + 1}</sub> de AB?`, q: '', a: v, h: `linha ${i + 1} de A · coluna ${j + 1} de B = ${A[2 * i]}·${B[j]} + ${A[2 * i + 1]}·${B[2 + j]} = ${v}` }; },
  ]);

  topic('gplan', 'mat', 'Geometria plana', [
    L => { const n = ri(3, 14); return { ctx: `Soma dos ângulos internos de um polígono de ${n} lados (graus)`, q: '', a: (n - 2) * 180, h: `(n − 2)·180 = ${n - 2}${X}180 = ${f((n - 2) * 180)}` }; },
    L => { if (!L) return null; const n = pick([3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20]), ext = 360 / n;
      return Math.random() < .5 ? { ctx: `Ângulo interno de um polígono regular de ${n} lados (graus)`, q: '', a: 180 - ext, h: `externo 360 ÷ ${n} = ${ext}; interno 180 − ${ext} = ${180 - ext}` }
        : { ctx: `Um polígono regular tem ângulo externo de ${ext}°. Quantos lados?`, q: '', a: n, h: `360 ÷ ${ext} = ${n}` }; },
    L => { const k = pick(['tri', 'trap', 'los', 'ret']), a = ri(2, 12), b = ri(2, 12), h = 2 * ri(1, 6);
      if (k === 'tri') return { ctx: `Área do triângulo de base ${a} e altura ${h}`, q: '', a: a * h / 2, h: `b·h ÷ 2 = ${a * h / 2}` };
      if (k === 'trap') return { ctx: `Área do trapézio de bases ${a} e ${b} e altura ${h}`, q: '', a: (a + b) * h / 2, h: `(B + b)·h ÷ 2 = ${a + b}${X}${h} ÷ 2 = ${(a + b) * h / 2}` };
      if (k === 'los') return { ctx: `Área do losango de diagonais ${2 * a} e ${b}`, q: '', a: a * b, h: `D·d ÷ 2 = ${a * b}` };
      return { ctx: `Retângulo de área ${a * b} e um lado ${a}. Perímetro?`, q: '', a: 2 * (a + b), h: `outro lado ${b}; 2(${a} + ${b}) = ${2 * (a + b)}` }; },
    L => { const r = ri(2, 12), area = Math.random() < .5;
      return { ctx: `Círculo de raio ${r}: ${area ? 'área' : 'comprimento'} = kπ. Quanto vale k?`, q: '', a: area ? r * r : 2 * r, h: area ? `πr² = ${r * r}π` : `2πr = ${2 * r}π` }; },
    L => { if (L < 2) return null; const [th, r] = pick([[90, 4], [60, 6], [120, 3], [45, 4], [30, 6], [72, 5], [180, 2]]);
      return { ctx: `Setor circular de ${th}° e raio ${r}: área = kπ. k?`, q: '', a: rd(th / 360 * r * r), h: `${th}/360 = ${sf(th, 360)} de πr² → ${sf(th, 360)}${X}${r * r}π = ${f(rd(th / 360 * r * r))}π` }; },
    L => { const [p, q, s] = pick(TRIPLES.slice(0, L + 2)), k = ri(1, 3), cat = Math.random() < .5;
      return cat ? { ctx: `Triângulo retângulo de hipotenusa ${s * k} e um cateto ${p * k}. Outro cateto?`, q: '', a: q * k, h: `terno ${p}-${q}-${s}${k > 1 ? ` × ${k}` : ''}` }
        : { ctx: `Triângulo retângulo de catetos ${p * k} e ${q * k}. Hipotenusa?`, q: '', a: s * k, h: `terno ${p}-${q}-${s}${k > 1 ? ` × ${k}` : ''}` }; },
    L => { if (!L) return null; const k = ri(2, 4), A = ri(2, 9);
      return { ctx: `Dois triângulos semelhantes têm razão de semelhança ${k}. O menor tem área ${A}. Área do maior?`, q: '', a: A * k * k, h: `áreas na razão k² = ${k * k}: ${A}${X}${k * k} = ${A * k * k}` }; },
    L => { if (!L) return null; const a = ri(2, 6), b = ri(2, 6), k = ri(2, 4);
      return { ctx: `Retas paralelas cortam duas transversais. Na primeira, segmentos ${a} e ${b}; na segunda, o correspondente a ${a} mede ${a * k}. E o de ${b}?`, q: '', a: b * k, h: `Tales: ${a}/${b} = ${a * k}/x → x = ${b * k}` }; },
    L => { if (L < 2) return null; const k = pick(['alt', 'area', 'hex']), l = 2 * ri(1, 5);
      if (k === 'alt') return { ctx: `Triângulo equilátero de lado ${l}: altura = k√3. k?`, q: '', a: l / 2, h: `h = ℓ√3/2 = ${l / 2}√3` };
      if (k === 'area') return { ctx: `Triângulo equilátero de lado ${l}: área = k√3. k?`, q: '', a: l * l / 4, h: `ℓ²√3/4 = ${l * l}√3/4 = ${l * l / 4}√3` };
      return { ctx: `Hexágono regular de lado ${l}: área = k√3. k?`, q: '', a: 3 * l * l / 2, h: `6 triângulos equiláteros: 6·ℓ²√3/4 = ${3 * l * l / 2}√3` }; },
    L => { if (L < 2) return null; const [p, q, s] = pick(TRIPLES.slice(0, 3)), k = ri(1, 2);
      return { ctx: `Triângulo retângulo de catetos ${p * k} e ${q * k}, inscrito num círculo. Raio do círculo?`, q: '', a: rd(s * k / 2), h: `a hipotenusa (${s * k}) é diâmetro: r = ${f(rd(s * k / 2))}` }; },
    L => { if (L < 2) return null; const [m, n] = pick([[4, 9], [1, 4], [2, 8], [9, 16], [3, 12], [1, 9], [4, 16], [8, 18]]);
      return { ctx: `Num triângulo retângulo, a altura divide a hipotenusa em ${m} e ${n}. Altura?`, q: '', a: Math.sqrt(m * n), h: `h² = m·n = ${m * n} → h = ${Math.sqrt(m * n)}` }; },
  ]);

  topic('gesp', 'mat', 'Geometria espacial', [
    L => { const a = ri(2, [6, 10, 12][L]), k = pick(['v', 'a', 'd']);
      if (k === 'v') return { ctx: `Volume do cubo de aresta ${a}`, q: '', a: a ** 3, h: `${a}³ = ${f(a ** 3)}` };
      if (k === 'a') return { ctx: `Área total do cubo de aresta ${a}`, q: '', a: 6 * a * a, h: `6a² = 6${X}${a * a} = ${6 * a * a}` };
      return { ctx: `Diagonal do cubo de aresta ${a} = k√3. k?`, q: '', a, h: 'diagonal do cubo = a√3' }; },
    L => { if (!L) return null; const [a, b, c, d] = pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [6, 6, 7, 11], [3, 4, 12, 13], [2, 10, 11, 15]]), vol = Math.random() < .4;
      return vol ? { ctx: `Volume do paralelepípedo ${a} × ${b} × ${c}`, q: '', a: a * b * c, h: `${a}${X}${b}${X}${c} = ${a * b * c}` }
        : { ctx: `Diagonal do paralelepípedo ${a} × ${b} × ${c}`, q: '', a: d, h: `√(${a * a} + ${b * b} + ${c * c}) = √${d * d} = ${d}` }; },
    L => { if (!L) return null; const r = ri(1, 6), h = 3 * ri(1, 4), k = pick(['cil', 'cone']);
      return k === 'cil' ? { ctx: `Cilindro de raio ${r} e altura ${h}: volume = kπ. k?`, q: '', a: r * r * h, h: `πr²h = ${r * r}${X}${h}π = ${r * r * h}π` }
        : { ctx: `Cone de raio ${r} e altura ${h}: volume = kπ. k?`, q: '', a: r * r * h / 3, h: `πr²h/3 = ${r * r}${X}${h}π ÷ 3 = ${r * r * h / 3}π` }; },
    L => { if (L < 2) return null; const r = pick([3, 6, 9, 3]), vol = Math.random() < .5;
      return vol ? { ctx: `Esfera de raio ${r}: volume = kπ. k?`, q: '', a: 4 * r ** 3 / 3, h: `4πr³/3 = 4${X}${r ** 3}π ÷ 3 = ${4 * r ** 3 / 3}π` }
        : { ctx: `Esfera de raio ${r}: área = kπ. k?`, q: '', a: 4 * r * r, h: `4πr² = ${4 * r * r}π` }; },
    L => { const n = ri(3, 8), pri = Math.random() < .5, V = pri ? 2 * n : n + 1, A = pri ? 3 * n : 2 * n, F = pri ? n + 2 : n + 1, k = pick(['V', 'A', 'F']);
      if (L === 0) return { ctx: `Poliedro convexo com ${k === 'V' ? `${A} arestas e ${F} faces` : k === 'A' ? `${V} vértices e ${F} faces` : `${V} vértices e ${A} arestas`}. Quantos ${k === 'V' ? 'vértices' : k === 'A' ? 'arestas' : 'faces'}?`, q: '', a: k === 'V' ? V : k === 'A' ? A : F, h: 'Euler: V − A + F = 2' };
      return { ctx: `${pri ? 'Prisma' : 'Pirâmide'} de base com ${n} lados: ${k === 'V' ? 'quantos vértices' : k === 'A' ? 'quantas arestas' : 'quantas faces'}?`, q: '', a: k === 'V' ? V : k === 'A' ? A : F, h: pri ? `prisma: V = 2n, A = 3n, F = n + 2` : `pirâmide: V = n + 1, A = 2n, F = n + 1` }; },
    L => { const k = ri(2, 4), what = pick(['vol', 'area']);
      return { ctx: `Multiplicando todas as medidas de um sólido por ${k}, ${what === 'vol' ? 'o volume' : 'a área'} fica multiplicad${what === 'vol' ? 'o' : 'a'} por:`, q: '', a: what === 'vol' ? k ** 3 : k * k, h: what === 'vol' ? `volume: k³ = ${k ** 3}` : `área: k² = ${k * k}` }; },
    L => { const a = pick([10, 20, 30, 50, 100]); return { ctx: `Uma caixa cúbica de aresta ${a} cm comporta quantos litros?`, q: '', a: a ** 3 / 1000, h: `${f(a ** 3)} cm³ = ${f(a ** 3 / 1000)} L (1 L = 1.000 cm³)` }; },
    L => { if (!L) return null; const b = ri(2, 6), h = 3 * ri(1, 4);
      return { ctx: `Pirâmide de base quadrada de lado ${b} e altura ${h}. Volume?`, q: '', a: b * b * h / 3, h: `A<sub>b</sub>·h ÷ 3 = ${b * b}${X}${h} ÷ 3 = ${b * b * h / 3}` }; },
  ]);

  topic('trig', 'mat', 'Trigonometria', [
    L => { const [fn, ang, val] = pick([['sen', 30, '1/2'], ['sen', 45, '√2/2'], ['sen', 60, '√3/2'], ['cos', 30, '√3/2'], ['cos', 45, '√2/2'], ['cos', 60, '1/2'], ['tg', 30, '√3/3'], ['tg', 45, '1'], ['tg', 60, '√3'], ['sen', 90, '1'], ['cos', 90, '0'], ['cos', 0, '1']]);
      return mc({ q: `${fn} ${ang}°`, ok: val, no: shuffle(['1/2', '√2/2', '√3/2', '√3/3', '√3', '1', '0'].filter(x => x !== val)).slice(0, 3), h: 'tabela: sen 30, 45, 60 = 1/2, √2/2, √3/2; cos na ordem inversa; tg = sen/cos' }); },
    L => { const [n, d] = pick([[1, 6], [1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [5, 6], [1, 1], [3, 2], [5, 4], [7, 6], [2, 1], [5, 3], [7, 4], [11, 6]]);
      return { ctx: 'Converta para graus.', q: `${n === 1 ? '' : n}π${d === 1 ? '' : '/' + d} rad`, a: 180 * n / d, h: `π rad = 180°: ${180 * n / d}°` }; },
    L => { if (!L) return null; const [fn, ang, val] = pick([['sen', 150, '1/2'], ['cos', 120, '−1/2'], ['sen', 210, '−1/2'], ['cos', 300, '1/2'], ['tg', 135, '−1'], ['sen', 240, '−√3/2'], ['cos', 135, '−√2/2'], ['sen', 330, '−1/2'], ['cos', 150, '−√3/2'], ['sen', 120, '√3/2'], ['cos', 180, '−1'], ['sen', 270, '−1']]);
      return mc({ q: `${fn} ${ang}°`, ok: val, no: shuffle(['1/2', '−1/2', '√3/2', '−√3/2', '√2/2', '−√2/2', '1', '−1'].filter(x => x !== val)).slice(0, 3), h: `reduza ao 1º quadrante e ajuste o sinal pelo quadrante de ${ang}°` }); },
    L => { if (!L) return null; const [s, c] = pick([[0.6, 0.8], [0.8, 0.6], [0.28, 0.96], [0.96, 0.28]]), k = pick(['cos', 'tg', 'sen2']);
      if (k === 'cos') return { ctx: `x é agudo e sen x = ${f(s)}.`, q: 'cos x', a: c, h: `cos x = √(1 − ${f(rd(s * s))}) = ${f(c)}` };
      if (k === 'tg') { const T = { 0.6: '3/4', 0.8: '4/3', 0.28: '7/24', 0.96: '24/7' }; return mc({ ctx: `x é agudo, sen x = ${f(s)} e cos x = ${f(c)}.`, q: 'tg x', ok: T[s], no: Object.values(T), h: `tg = sen/cos = ${f(s)}/${f(c)} = ${T[s]}` }); }
      return L < 2 ? null : { ctx: `sen x = ${f(s)} e cos x = ${f(c)}.`, q: 'sen 2x', a: rd(2 * s * c), h: `2·sen x·cos x = ${f(rd(2 * s * c))}` }; },
    L => { if (L < 2) return null; const [b, c, a, ang] = pick([[3, 8, 7, 60], [5, 8, 7, 60], [7, 15, 13, 60], [8, 15, 13, 60], [5, 21, 19, 60], [3, 5, 7, 120], [7, 8, 13, 120], [5, 16, 19, 120]]);
      return { ctx: `Triângulo com lados ${b} e ${c} formando ${ang}°. Terceiro lado?`, q: '', a, h: `lei dos cossenos: ${b * b} + ${c * c} ${ang === 60 ? '−' : '+'} ${b * c} = ${a * a} → ${a}` }; },
    L => { if (L < 2) return null; const [ang, s] = pick([[30, .5], [90, 1], [150, .5]]), a = ri(2, 10);
      return { ctx: `Num triângulo, o lado oposto ao ângulo de ${ang}° mede ${a}. Raio da circunferência circunscrita?`, q: '', a: rd(a / s / 2), h: `lei dos senos: a/sen A = 2R → 2R = ${f(rd(a / s))}` }; },
    L => { if (!L) return null; const a = ri(-3, 4), b = ri(1, 5), mx_ = Math.random() < .5;
      return { ctx: `f(x) = ${a} + ${b}·sen x`, q: mx_ ? 'valor máximo' : 'valor mínimo', a: mx_ ? a + b : a - b, h: `sen x vai de −1 a 1: ${a} ${mx_ ? '+' : '−'} ${b}` }; },
    L => { if (!L) return null; const k = pick([2, 3, 4, 6, 0.5]), T = k === 0.5 ? '4π' : k === 2 ? 'π' : `2π/${k}`;
      return mc({ ctx: `Período de f(x) = sen(${f(k)}x)`, ok: T, no: shuffle(['π', '2π', '4π', 'π/2', '2π/3', 'π/3', '2π/6'].filter(x => x !== T)).slice(0, 3), h: `período = 2π ÷ ${f(k)}` }); },
  ]);

  topic('ganal', 'mat', 'Geometria analítica', [
    L => { const [p, q, s] = pick(TRIPLES.slice(0, L + 2)), k = ri(1, L ? 2 : 1), x1 = ri(-4, 4), y1 = ri(-4, 4), sx = pick([1, -1]), sy = pick([1, -1]);
      return { ctx: `Distância entre (${x1}, ${y1}) e (${x1 + sx * p * k}, ${y1 + sy * q * k})`, q: '', a: s * k, h: `Δx = ${p * k}, Δy = ${q * k} → ${s * k}` }; },
    L => { const x1 = ri(-6, 6), x2 = x1 + 2 * ri(-4, 4), y1 = ri(-6, 6), y2 = y1 + 2 * ri(-4, 4), askX = Math.random() < .5;
      return { ctx: `Ponto médio de (${x1}, ${y1}) e (${x2}, ${y2})`, q: askX ? 'x' : 'y', a: askX ? (x1 + x2) / 2 : (y1 + y2) / 2, h: `média das coordenadas: (${(x1 + x2) / 2}, ${(y1 + y2) / 2})` }; },
    L => { if (!L) return null; const m = ri(-3, 4), x0 = ri(-3, 3), y0 = ri(-5, 5), b = y0 - m * x0;
      return { ctx: `Reta de coeficiente angular ${m} passando por (${x0}, ${y0}): y = ${m}x + b. b?`, q: '', a: b, h: `${y0} = ${m}·${x0} + b → b = ${b}` }; },
    L => { if (!L) return null; const m = pick([2, -2, 5, 4, 0.5, -0.5, -4, -5, 0.25]);
      return { ctx: `Coeficiente angular de uma reta perpendicular a y = ${f(m)}x + 1`, q: '', a: rd(-1 / m), h: `m₁·m₂ = −1 → m₂ = −1/${f(m)} = ${f(rd(-1 / m))}` }; },
    L => { if (L < 2) return null; const a = ri(-4, 4), b = ri(-4, 4), r = ri(1, 6), c = a * a + b * b - r * r;
      return { ctx: `Raio da circunferência x² + y² ${-2 * a < 0 ? '−' : '+'} ${Math.abs(2 * a)}x ${-2 * b < 0 ? '−' : '+'} ${Math.abs(2 * b)}y ${c < 0 ? '−' : '+'} ${Math.abs(c)} = 0`, q: '', a: r, h: `centro (${a}, ${b}); r² = ${a * a} + ${b * b} − (${c}) = ${r * r}` }; },
    L => { if (L < 2) return null; const [A, B] = pick([[3, 4], [4, 3], [6, 8], [5, 12], [0, 1], [1, 0]]), x0 = ri(-3, 3), y0 = ri(-3, 3), d = ri(1, 5), n = Math.hypot(A, B), C = d * n - A * x0 - B * y0;
      return { ctx: `Distância do ponto (${x0}, ${y0}) à reta ${A}x + ${B}y ${C < 0 ? '−' : '+'} ${Math.abs(C)} = 0`, q: '', a: d, h: `|${A}·${x0} + ${B}·${y0} + ${C}| ÷ √(${A * A} + ${B * B}) = ${d * n} ÷ ${n} = ${d}` }; },
    L => { if (L < 2) return null; const x1 = ri(0, 2), y1 = ri(0, 2), dx = ri(1, 3), dy = ri(1, 4), k = ri(2, 4);
      return { ctx: `(${x1}, ${y1}), (${x1 + dx}, ${y1 + dy}) e (x, ${y1 + k * dy}) estão alinhados. x?`, q: '', a: x1 + k * dx, h: `mesma inclinação ${dy}/${dx}: x = ${x1} + ${k}·${dx} = ${x1 + k * dx}` }; },
    L => { if (!L) return null; const x = ri(-4, 5), m1 = ri(1, 3), m2 = -ri(1, 3), b1 = ri(-5, 5), b2 = b1 + (m1 - m2) * x;
      return { ctx: `Interseção de y = ${poly([m1, b1])} e y = ${poly([m2, b2])}`, q: 'x', a: x, h: `${m1}x + ${b1} = ${m2}x + ${b2} → ${m1 - m2}x = ${b2 - b1} → x = ${x}` }; },
  ]);

  topic('logexp', 'mat', 'Logaritmos e exponenciais', [
    L => { const [b, e] = pick([[2, ri(1, 10)], [3, ri(1, 5)], [10, ri(-4, 6)], [5, ri(1, 4)], [2, -ri(1, 5)], [4, ri(1, 4)]]);
      const v = e < 0 ? `1/${b ** -e}` : f(b ** e); return { q: `log<sub>${b === 10 ? '' : b}</sub> ${b === 10 && e < 0 ? f(10 ** e) : v}`, a: e, h: `${b}<sup>${e}</sup> = ${b === 10 && e < 0 ? f(10 ** e) : v}` }; },
    L => { const k = pick(['2', '3', 'mix']), x = ri(-3, 6);
      if (k === '2') return { q: `${sup(2, 'x')} = ${x < 0 ? '1/' + 2 ** -x : 2 ** x}`, a: x, h: `${2 ** Math.abs(x)} = ${sup(2, Math.abs(x))}` };
      if (k === '3' || L === 0) { const y = ri(0, 4); return { q: `${sup(3, 'x + 1')} = ${3 ** (y + 1)}`, a: y, h: `${3 ** (y + 1)} = ${sup(3, y + 1)} → x + 1 = ${y + 1}` }; }
      const [b, v, ans, base, eb, ev] = pick([[4, 8, 1.5, 2, 2, 3], [9, 27, 1.5, 3, 2, 3], [4, 32, 2.5, 2, 2, 5], [16, 8, 0.75, 2, 4, 3], [25, 125, 1.5, 5, 2, 3], [8, 16, 4 / 3 > 2 ? 0 : 0, 2, 3, 4]].slice(0, 5));
      return { q: `${sup(b, 'x')} = ${v}`, a: ans, h: `base ${base}: ${sup(base, eb + 'x')} = ${sup(base, ev)} → x = ${ev}/${eb} = ${f(ans)}` }; },
    L => { if (!L) return null; const [expr, v, h] = pick([['log 2 + log 5', 1, 'log(2·5) = log 10'], ['log<sub>2</sub> 12 − log<sub>2</sub> 3', 2, 'log₂(12/3) = log₂ 4'], ['3·log<sub>2</sub> 4', 6, 'log₂ 4 = 2'], ['log<sub>4</sub> 8', 1.5, '= log₂ 8 / log₂ 4 = 3/2'], ['log<sub>9</sub> 27', 1.5, '= 3/2 (base 3)'], ['log 4 + log 25', 2, 'log 100'], ['log<sub>3</sub> 54 − log<sub>3</sub> 2', 3, 'log₃ 27'], [`${sup(2, 'log<sub>2</sub> 7')}`, 7, 'a<sup>log_a b</sup> = b'], ['log<sub>2</sub> √8', 1.5, '√8 = 2<sup>3/2</sup>'], ['log 0,1 + log 1000', 2, '−1 + 3']]);
      return { q: expr, a: v, h }; },
    L => { if (L < 2) return null; const [x, v, h] = pick([['log 8', 0.9, '3·log 2'], ['log 6', 0.78, 'log 2 + log 3'], ['log 5', 0.7, 'log 10 − log 2'], ['log 12', 1.08, '2·log 2 + log 3'], ['log 20', 1.3, 'log 2 + 1'], ['log 0,2', -0.7, 'log 2 − 1'], ['log 9', 0.96, '2·log 3'], ['log 1,5', 0.18, 'log 3 − log 2'], ['log 18', 1.26, 'log 2 + 2·log 3'], ['log 400', 2.6, '2·log 2 + 2']]);
      return { ctx: 'Use log 2 = 0,3 e log 3 = 0,48.', q: x, a: v, h: `${x} = ${h}` }; },
    L => { if (L < 2) return null; const [n, d] = pick([[10, 4], [20, 7], [30, 10], [50, 16], [100, 31], [60, 19]]);
      return { ctx: `Com log 2 ≈ 0,301, quantos algarismos tem ${sup(2, n)}?`, q: '', a: d, h: `${n}${X}0,301 = ${f(rd(n * 0.30103))} → parte inteira + 1 = ${d}` }; },
    L => { if (!L) return null; const T = pick([2, 3, 4, 5]), n = ri(3, [0, 6, 10][L]);
      return { ctx: `Uma população dobra a cada ${T} horas. Em ${T * n} horas, multiplica-se por:`, q: '', a: 2 ** n, h: `${n} duplicações: ${sup(2, n)} = ${f(2 ** n)}` }; },
    L => { if (!L) return null; const [fx, dom, no] = pick([['log(x − 3)', 'x > 3', ['x ≥ 3', 'x < 3', 'x ≠ 3']], ['log<sub>x</sub> 5', 'x > 0 e x ≠ 1', ['x > 0', 'x ≥ 1', 'x ≠ 0']], ['log(5 − x)', 'x < 5', ['x > 5', 'x ≤ 5', 'x ≠ 5']]]);
      return mc({ ctx: `Condição de existência de ${fx}`, ok: dom, no, h: 'logaritmando > 0; base > 0 e diferente de 1' }); },
  ]);

  // casa dos pombos entra em Contagem
  EXTRA_ADD.cont = [
    L => { const [n, what] = pick([[12, 'mês de aniversário'], [7, 'dia da semana de nascimento'], [26, 'letra inicial do nome (A–Z)'], [4, 'naipe de uma carta']]);
      return { ctx: `Quantas pessoas, no mínimo, garantem que duas tenham o mesmo ${what}?`, q: '', a: n + 1, h: `casa dos pombos: ${n} casas, então ${n} + 1 = ${n + 1}` }; },
    L => { const c = ri(2, 5), k = L ? ri(2, 3) : 2;
      return { ctx: `Uma gaveta tem meias de ${c} cores misturadas. No escuro, quantas tirar para garantir ${k === 2 ? 'um par' : `${k} da mesma cor`}?`, q: '', a: c * (k - 1) + 1, h: `pior caso: ${k - 1} de cada cor = ${c * (k - 1)}; mais uma garante: ${c * (k - 1) + 1}` }; },
  ];
