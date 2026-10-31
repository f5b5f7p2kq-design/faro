  // ================== ESTIMATIVAS E ORDEM DE GRANDEZA ==================
  // tol: a resposta vale se ficar a até tol (fração) do valor exato. As questões só saem quando a
  // estimativa que aparece na resolução cabe com folga na margem, para o arredondamento óbvio sempre valer.
  const sig = (x, n = 4) => +(+x).toPrecision(n);
  const e10 = x => Math.floor(Math.log10(Math.abs(x)) + 1e-12);
  const mant = x => Math.abs(x) / 10 ** e10(x);
  const og = x => e10(x) + (mant(x) >= Math.sqrt(10) ? 1 : 0);
  const sci = (m, e) => `${f(m)} × ${p10(e)}`;
  const near = (est, x, tol) => Math.abs(est - x) <= tol * .75 * Math.abs(x);
  const ugly = (x, pc) => sig(x * (1 + ri(-pc, pc) / 100), 3);
  // alternativas de potência de 10: a certa, as duas vizinhas e mais uma
  const ogMC = (ctx, n, h, tk) => ({ ...mc({ ctx, ok: p10(n), no: [p10(n - 1), p10(n + 1), pick([p10(n + 2), p10(n - 2)])], h }), tk });
  const ogWhy = (m, e) => `${f(m)} × ${p10(e)}: ${m >= Math.sqrt(10) ? `${f(m)} ≥ 3,16, então sobe para ${p10(e + 1)}` : `${f(m)} < 3,16, então fica ${p10(e)}`}`;

  topic('estm', 'mat', 'Estimar contas', [
    // produto (e divisão) de números "feios": arredondar um para cima e outro para baixo
    L => { for (let i = 0; i < 80; i++) {
        const A = pick([2, 3, 4, 5, 6, 7, 8, 9]) * 10 ** ri(1, 2), B = pick([2, 3, 4, 5, 6, 7, 8, 9]) * 10 ** ri(1, L ? 3 : 2);
        const a = ugly(A, 4), b = ugly(B, 4); if (a === A || b === B) continue;
        if (L < 2) { const x = a * b, est = A * B; if (!near(est, x, .1)) continue;
          return { ctx: 'Estime (vale ±10%):', q: `${f(a)} × ${f(b)}`, a: sig(x), tol: .1, h: `≈ ${f(A)} × ${f(B)} = ${f(est)} (exato: ${f(sig(x))})`, tk: 'Arredonde e compense' }; }
        const C = pick([2, 4, 5, 8]) * 10 ** ri(0, 1), c = ugly(C, 3), x = a * b / c, est = A * B / C;
        if (!near(est, x, .1) || !Number.isInteger(est)) continue;
        return { ctx: 'Estime (vale ±10%):', q: `${f(a)} × ${f(b)} ÷ ${f(c)}`, a: sig(x), tol: .1, h: `≈ ${f(A)} × ${f(B)} ÷ ${f(C)} = ${f(est)} (exato: ${f(sig(x))})`, tk: 'Arredonde e compense' }; }
      return null; },
    // porcentagem quebrada de valor quebrado
    L => { for (let i = 0; i < 80; i++) {
        const P = pick([[10, 50], [20, 25, 50], [15, 30, 75]][L]), V = pick([2, 3, 4, 5, 6, 8]) * 10 ** ri(2, 3 + L);
        const p = sig(P * (1 + ri(-6, 6) / 100), 3), v = ugly(V, 4); if (p === P && v === V) continue;
        const x = p * v / 100, est = P * V / 100; if (!near(est, x, .1)) continue;
        return { ctx: `Estime ${f(p)}% de ${f(v)} (vale ±10%)`, a: sig(x), tol: .1, h: `≈ ${P}% de ${f(V)} = ${f(est)} (exato: ${f(sig(x))})`, tk: 'Porcentagem aproximada' }; }
      return null; },
    // raiz quadrada (e cúbica) pelo quadrado perfeito vizinho
    L => { for (let i = 0; i < 80; i++) {
        if (L < 2) { const k = L ? ri(16, 70) : ri(5, 15), d = ri(-k + 1, k - 1), N = k * k + d; if (!d) continue;
          const x = Math.sqrt(N); if (!near(k, x, .05)) continue;
          return { ctx: 'Estime (vale ±5%):', q: `√${f(N)}`, a: sig(x, 3), tol: .05, h: `${k}² = ${f(k * k)}, bem perto de ${f(N)} → ≈ ${k} (exato: ${f(sig(x, 3))})`, tk: 'Raiz aproximada' }; }
        const k = ri(3, 12), d = ri(-k * k, k * k), N = k ** 3 + d; if (!d) continue;
        const x = Math.cbrt(N); if (!near(k, x, .05)) continue;
        return { ctx: 'Estime (vale ±5%):', q: `∛${f(N)}`, a: sig(x, 3), tol: .05, h: `${k}³ = ${f(k ** 3)}, perto de ${f(N)} → ≈ ${k} (exato: ${f(sig(x, 3))})`, tk: 'Raiz aproximada' }; }
      return null; },
    // notação científica: arredondar as mantissas e somar os expoentes
    L => { for (let i = 0; i < 120; i++) {
        const ms = Array.from({ length: L ? 3 : 2 }, () => sig(ri(11, 95) / 10, 2)), M = ms.map(Math.round);
        const es = [ri(-6, 9), ri(-6, 9)]; let x, est, q, hq;
        if (!L) { es[1] = ri(0, 3) - es[0]; x = ms[0] * ms[1] * 10 ** (es[0] + es[1]); est = M[0] * M[1] * 10 ** (es[0] + es[1]); q = `${sci(ms[0], es[0])} × ${sci(ms[1], es[1])}`; hq = `${M[0]} × ${M[1]}${es[0] + es[1] ? ` × ${p10(es[0] + es[1])}` : ''}`; }
        else { es.push(es[0] + es[1] - ri(0, 3)); x = ms[0] * ms[1] / ms[2] * 10 ** (es[0] + es[1] - es[2]); est = M[0] * M[1] / M[2] * 10 ** (es[0] + es[1] - es[2]);
          q = `${sci(ms[0], es[0])} × ${sci(ms[1], es[1])} ÷ ${sci(ms[2], es[2])}`; hq = `(${M[0]} × ${M[1]} ÷ ${M[2]})${es[0] + es[1] - es[2] ? ` × ${p10(es[0] + es[1] - es[2])}` : ''}`; }
        if (es.includes(0) || x < 1 || x > 99999 || !near(est, x, .1) || !nice(est, 2)) continue;
        return { ctx: 'Estime (vale ±10%):', q, a: sig(x), tol: .1, h: `≈ ${hq} = ${f(rd(est))} (exato: ${f(sig(x))})`, tk: 'Notação científica' }; }
      return null; },
  ]);

  // ---------- física: ordem de grandeza ----------
  const COUNT = [
    // [nível mínimo, texto, valor, conta]
    [0, 'segundos em um dia', 86400, '60 × 60 × 24 = 86.400'],
    [0, 'segundos em uma semana', 604800, '86.400 × 7 = 604.800'],
    [0, 'minutos em um ano', 525600, '60 × 24 × 365 = 525.600'],
    [0, 'gotas em 1 L de água (gota de 0,05 mL)', 20000, '1.000 ÷ 0,05 = 20.000'],
    [0, 'folhas numa pilha de papel de 1 m (folha de 0,1 mm)', 10000, '1.000 mm ÷ 0,1 mm = 10.000'],
    [1, 'batidas do coração em um dia (70 por minuto)', 100800, '70 × 60 × 24 = 100.800'],
    [1, 'respirações em um dia (15 por minuto)', 21600, '15 × 1.440 = 21.600'],
    [1, 'grãos em 5 kg de arroz (grão de 0,02 g)', 250000, '5.000 g ÷ 0,02 g = 250.000'],
    [1, 'gotas numa caixa-d’água de 1.000 L (gota de 0,05 mL)', 2e7, '10⁶ mL ÷ 0,05'],
    [1, 'piscadas em uma semana (15 por minuto, 16 h acordado por dia)', 100800, '15 × 60 × 16 × 7 = 100.800'],
    [2, 'batidas do coração em 80 anos (60 por minuto)', 60 * 60 * 24 * 365 * 80, '60 × 60 × 24 × 365 × 80'],
    [2, 'passos para dar a volta na Terra (40.000 km, passo de 0,8 m)', 5e7, '4 × 10⁷ m ÷ 0,8 m'],
    [2, 'litros de água numa piscina olímpica (50 m × 25 m × 2 m)', 2.5e6, '50 × 25 × 2 = 2.500 m³ = 2.500.000 L'],
    [2, 'respirações em 80 anos (15 por minuto)', 15 * 60 * 24 * 365 * 80, '15 × 60 × 24 × 365 × 80'],
  ];
  const TYP = [
    // [nível mínimo, o que, expoente, por quê]
    [0, 'da massa de um carro popular, em kg', 3, '≈ 1.000 kg = 10³'],
    [0, 'da população do Brasil', 8, '≈ 2,1 × 10⁸; 2,1 < 3,16 → 10⁸'],
    [0, 'da espessura de uma folha de papel, em m', -4, '≈ 0,1 mm = 10⁻⁴ m'],
    [0, 'da área de um campo de futebol, em m²', 4, '≈ 100 m × 70 m = 7 × 10³; 7 ≥ 3,16 → 10⁴'],
    [1, 'do raio da Terra, em km', 4, '≈ 6.400 km = 6,4 × 10³ → 10⁴'],
    [1, 'da distância da Terra ao Sol, em km', 8, '≈ 1,5 × 10⁸ km → 10⁸'],
    [1, 'da massa de um elefante, em kg', 4, '≈ 5.000 kg = 5 × 10³ → 10⁴'],
    [1, 'do diâmetro de um fio de cabelo, em m', -4, '≈ 0,07 mm = 7 × 10⁻⁵ m → 10⁻⁴'],
    [1, 'do volume de uma gota de água, em mL', -1, '≈ 0,05 mL = 5 × 10⁻² → 10⁻¹'],
    [1, 'da população mundial', 10, '≈ 8 × 10⁹ → 10¹⁰'],
    [2, 'da distância da Terra à Lua, em km', 6, '≈ 3,8 × 10⁵ km; 3,8 ≥ 3,16 → 10⁶'],
    [2, 'da velocidade do som no ar, em m/s', 3, '≈ 340 m/s = 3,4 × 10²; 3,4 ≥ 3,16 → 10³'],
    [2, 'do tamanho de um átomo, em m', -10, '≈ 10⁻¹⁰ m (1 ångström)'],
    [2, 'do tamanho de uma bactéria, em m', -6, '≈ 1 µm = 10⁻⁶ m'],
    [2, 'da massa da Terra, em kg', 25, '≈ 6 × 10²⁴ kg; 6 ≥ 3,16 → 10²⁵'],
    [2, 'da idade do Universo, em anos', 10, '≈ 1,4 × 10¹⁰ anos → 10¹⁰'],
  ];
  topic('f_est', 'fis', 'Ordem de grandeza e estimativas', [
    // ordem de grandeza de um número: a regra do √10
    L => { for (let i = 0; i < 60; i++) {
        const m = sig(pick([ri(11, 29), ri(41, 99)]) / 10, 2);
        if (L < 2) { let e, shown;
          if (!L) { e = ri(2, 8); shown = f(Math.round(m * 10 ** e)); }
          else if (Math.random() < .5) { e = ri(-4, -1); shown = f(sig(m * 10 ** e, 2)); }
          else { e = ri(-12, 15); shown = sci(m, e); }
          return ogMC(`Ordem de grandeza de ${shown}?`, e + (m >= Math.sqrt(10) ? 1 : 0), `${shown.includes('×') ? '' : shown + ' = '}${ogWhy(m, e)}`, 'Ordem de grandeza'); }
        const m2 = sig(ri(11, 95) / 10, 2), e1 = ri(-8, 10), e2 = ri(-8, 10), x = m * m2, ex = e10(x), mm = sig(x / 10 ** ex, 3);
        if ((mm > 2.6 && mm < 4) || !e1 || !e2) continue;
        const n = e1 + e2 + ex + (mm >= Math.sqrt(10) ? 1 : 0);
        return ogMC(`Ordem de grandeza de (${sci(m, e1)}) × (${sci(m2, e2)})?`, n,
          `${f(m)} × ${f(m2)} = ${f(sig(x, 3))}, então o produto é ${f(mm)} × ${p10(e1 + e2 + ex)}; ${mm >= Math.sqrt(10) ? `${f(mm)} ≥ 3,16 → ${p10(n)}` : `${f(mm)} < 3,16 → ${p10(n)}`}`, 'Ordem de grandeza'); }
      return null; },
    // contagens do dia a dia
    L => { const [, what, x, how] = pick(COUNT.filter(c => c[0] <= L && (L < 2 || c[0] >= 1))), mm = mant(x);
      if (mm > 2.6 && mm < 4) return null;
      return ogMC(`Ordem de grandeza do número de ${what}?`, og(x), `${how} = ${f(sig(mm, 2))} × ${p10(e10(x))} → ${p10(og(x))}`, 'Contagens do cotidiano'); },
    // valores que vale ter na cabeça
    L => { const [, what, n, why] = pick(TYP.filter(t => t[0] <= L && (L < 2 || t[0] >= 1)));
      return ogMC(`Ordem de grandeza ${what}?`, n, why, 'Valores típicos'); },
    // estimativa com dados: a conta inteira não é necessária, a margem aceita o arredondamento
    L => { for (let i = 0; i < 80; i++) {
        const k = L === 2 ? ri(3, 4) : L ? ri(1, 4) : ri(0, 2);
        if (k === 0) { const v = pick([4, 5, 6]), t = pick([20, 25, 35, 40, 50]), x = v * t / 60 * 30, est = v * Math.round(t / 10) * 10 / 60 * 30;
          if (!near(est, x, .1)) continue;
          return { ctx: `Uma pessoa caminha a ${v} km/h durante ${t} min por dia. Quantos km em 30 dias? (vale ±10%)`, a: sig(x, 3), u: 'km', tol: .1, h: `${t} min × 30 = ${f(t / 2)} h no mês; ${v} km/h × ${f(t / 2)} h = ${f(sig(x, 3))} km`, tk: 'Estimativa com dados' }; }
        if (k === 1) { const P = pick([4400, 5400, 6800, 7500]), t = pick([8, 10, 12, 15, 20]), x = P / 1000 * t / 60 * 30, est = Math.round(P / 1000) * t / 60 * 30;
          if (!near(est, x, .1)) continue;
          return { ctx: `Um chuveiro de ${f(P)} W fica ligado ${t} min por dia. Energia em 30 dias? (vale ±10%)`, a: sig(x, 3), u: 'kWh', tol: .1, h: `${t} min × 30 = ${f(t / 2)} h no mês; ≈ ${Math.round(P / 1000)} kW × ${f(t / 2)} h = ${f(rd(est))} kWh (exato: ${f(sig(x, 3))})`, tk: 'Estimativa com dados' }; }
        if (k === 2) { const p = pick([0.8, 1.2, 2.3, 3.5, 4.8]), c = pick([120, 150, 180, 210]), x = p * c, est = Math.round(p) * Math.round(c / 50) * 50;
          if (!near(est, x, .1) || !Math.round(p)) continue;
          return { ctx: `Uma cidade de ${f(p)} ${p >= 2 ? 'milhões' : 'milhão'} de habitantes gasta ${c} L de água por pessoa por dia. Milhões de litros por dia? (vale ±10%)`, a: sig(x, 3), tol: .1, h: `≈ ${Math.round(p)} × ${Math.round(c / 50) * 50} = ${f(est)} (exato: ${f(sig(x, 3))})`, tk: 'Estimativa com dados' }; }
        if (k === 3) { const d = pick([340, 470, 580, 720, 860]), km = pick([10, 12.5, 14]), pr = pick([5.79, 5.89, 6.19, 6.49]), x = d / km * pr, est = Math.round(d / km) * Math.round(pr);
          if (!near(est, x, .1)) continue;
          return { ctx: `Uma viagem de ${d} km num carro que faz ${f(km)} km/L, com gasolina a R$ ${f(pr)}. Gasto com combustível? (vale ±10%)`, a: sig(x, 3), u: 'reais', tol: .1, h: `${d} ÷ ${f(km)} ≈ ${Math.round(d / km)} L; × ${Math.round(pr)} ≈ R$ ${f(est)} (exato: ${f(sig(x, 3))})`, tk: 'Estimativa com dados' }; }
        const gs = pick([1, 2, 3]), x = 86400 / gs * 0.05 / 1000 * 30, est = 9e4 / gs * 0.05 / 1000 * 30;
        if (!near(est, x, .1)) continue;
        return { ctx: `Uma torneira pinga ${gs === 1 ? '1 gota por segundo' : `1 gota a cada ${gs} s`} (gota de 0,05 mL). Quantos litros em 30 dias? (vale ±10%)`, a: sig(x, 3), u: 'L', tol: .1, h: `1 dia ≈ 9 × 10⁴ s → ${f(9e4 / gs)} gotas × 0,05 mL ≈ ${f(rd(9e4 / gs * 0.05 / 1000))} L por dia; × 30 ≈ ${f(rd(est))} (exato: ${f(sig(x, 3))})`, tk: 'Estimativa com dados' }; }
      return null; },
  ]);
