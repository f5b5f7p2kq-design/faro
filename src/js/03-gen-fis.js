  // ================== FÍSICA (g = 10 m/s², som = 340 m/s, c = 3·10⁸ m/s) ==================
  topic('f_un', 'fis', 'Grandezas e unidades', [
    L => { const v = pick([5, 10, 15, 20, 25, 30, 40, 50]), toMs = Math.random() < .5;
      return toMs ? { ctx: `${f(rd(v * 3.6))} km/h em m/s`, q: '', a: v, u: 'm/s', h: `÷ 3,6: ${f(rd(v * 3.6))} ÷ 3,6 = ${v}` }
        : { ctx: `${v} m/s em km/h`, q: '', a: rd(v * 3.6), u: 'km/h', h: `× 3,6: ${v}${X}3,6 = ${f(rd(v * 3.6))}` }; },
    L => { const [txt, e] = pick([[['1 km = 10<sup>x</sup> m', 3], ['1 mm = 10<sup>x</sup> m', -3], ['1 cm = 10<sup>x</sup> m', -2], ['1 kg = 10<sup>x</sup> g', 3], ['1 L = 10<sup>x</sup> mL', 3]],
      [['1 µs = 10<sup>x</sup> s', -6], ['1 nm = 10<sup>x</sup> m', -9], ['1 MHz = 10<sup>x</sup> Hz', 6], ['1 GW = 10<sup>x</sup> W', 9], ['1 km = 10<sup>x</sup> mm', 6], ['1 L = 10<sup>x</sup> m³', -3], ['1 m³ = 10<sup>x</sup> L', 3]],
      [['1 cm² = 10<sup>x</sup> m²', -4], ['1 cm³ = 10<sup>x</sup> m³', -6], ['1 km² = 10<sup>x</sup> m²', 6], ['1 g/cm³ = 10<sup>x</sup> kg/m³', 3], ['1 mm² = 10<sup>x</sup> m²', -6], ['1 kWh = 3,6 × 10<sup>x</sup> J', 6]]][L]);
      return { ctx: 'Quanto vale x?', q: txt, a: e, h: 'k = 10³, M = 10⁶, G = 10⁹, m = 10⁻³, µ = 10⁻⁶, n = 10⁻⁹; em área e volume, eleve ao quadrado ou ao cubo' }; },
    L => { const a = pick([1, 2, 3, 4]), b = pick([1, 2]), m = ri(-8, 9), n = ri(-8, 9), div = L > 0 && Math.random() < .5;
      if (div) return { ctx: 'Quanto vale x?', q: `(${a * b} × ${p10(m)}) ÷ (${b} × ${p10(n)}) = ${a} × 10<sup>x</sup>`, a: m - n, h: `na divisão, subtraia os expoentes: ${m} − (${n}) = ${m - n}` };
      return { ctx: 'Quanto vale x?', q: `(${a} × ${p10(m)}) × (${b} × ${p10(n)}) = ${a * b} × 10<sup>x</sup>`, a: m + n, h: `no produto, some os expoentes: ${m} + (${n}) = ${m + n}` }; },
    L => { if (!L) return null; const [txt, e, h] = pick([['segundos em um dia', 5, '86.400 = 8,64 × 10⁴ → 10⁵'], ['minutos em uma semana', 4, '10.080 ≈ 1 × 10⁴'], ['horas em um ano', 4, '8.760 = 8,76 × 10³ → 10⁴'], ['batidas do coração em um dia (70 por minuto)', 5, '70 × 1.440 ≈ 1,0 × 10⁵'], ['o raio da Terra em metros', 7, '6,4 × 10⁶ m → 10⁷']]);
      return { ctx: `Ordem de grandeza (potência de 10) de ${txt}`, q: '10<sup>x</sup>', a: e, h }; },
    L => { const [p, q, s] = pick(TRIPLES.slice(0, L + 2)), k = pick(['res', 'max', 'min']);
      if (k === 'res' || L) return { ctx: `Dois vetores perpendiculares de módulos ${p} e ${q}. Módulo da resultante?`, q: '', a: s, h: `Pitágoras: √(${p * p} + ${q * q}) = ${s}` };
      return { ctx: `Vetores de módulos ${p} e ${q}: resultante ${k === 'max' ? 'máxima' : 'mínima'}?`, q: '', a: k === 'max' ? p + q : Math.abs(p - q), h: k === 'max' ? 'mesmo sentido: soma' : 'sentidos opostos: diferença' }; },
    L => { if (!L) return null; const F = 2 * ri(2, 10), vert = Math.random() < .5;
      return vert ? { ctx: `Uma força de ${F} N faz 30° com a horizontal. Componente vertical?`, q: '', a: F / 2, u: 'N', h: `F·sen 30° = ${F} × 1/2 = ${F / 2}` }
        : { ctx: `Uma força de ${F} N faz 60° com a horizontal. Componente horizontal?`, q: '', a: F / 2, u: 'N', h: `F·cos 60° = ${F} × 1/2 = ${F / 2}` }; },
    L => { const [g, ok, no] = pick([['força (N)', 'kg·m/s²', ['kg·m/s', 'kg·m²/s²', 'kg/(m·s²)']], ['energia (J)', 'kg·m²/s²', ['kg·m/s²', 'kg·m²/s³', 'kg·m/s']], ['potência (W)', 'J/s', ['J·s', 'N·s', 'N/m']], ['pressão (Pa)', 'N/m²', ['N·m', 'N/m', 'J/m']], ['quantidade de movimento', 'kg·m/s', ['kg·m/s²', 'N/s', 'J/s']], ['carga elétrica (C)', 'A·s', ['A/s', 'V·A', 'V/A']], ['resistência (Ω)', 'V/A', ['V·A', 'A/V', 'W·A']]]);
      return mc({ ctx: `Unidade equivalente de ${g}`, ok, no, h: 'F = m·a, E = F·d, P = E/t, p = F/A, Q = i·t, R = U/i' }); },
  ]);

  topic('f_cin', 'fis', 'Cinemática', [
    L => { const v = pick([2, 5, 10, 15, 20, 25, 30]), t = ri(2, 12), k = pick(['d', 'v', 't']);
      if (k === 'd') return { ctx: `A ${v} m/s constantes, distância em ${t} s?`, q: '', a: v * t, u: 'm', h: `d = v·t = ${v * t}` };
      if (k === 'v') return { ctx: `Percorre ${v * t} m em ${t} s. Velocidade média?`, q: '', a: v, u: 'm/s', h: `${v * t} ÷ ${t} = ${v}` };
      return { ctx: `Percorre ${v * t} m a ${v} m/s. Quanto tempo?`, q: '', a: t, u: 's', h: `${v * t} ÷ ${v} = ${t}` }; },
    L => { const v0 = ri(0, 10), a = pick([1, 2, 3, 4, 5]), t = ri(2, 8);
      return { ctx: `v₀ = ${v0} m/s e a = ${a} m/s². Velocidade após ${t} s?`, q: '', a: v0 + a * t, u: 'm/s', h: `v = v₀ + at = ${v0} + ${a * t} = ${v0 + a * t}` }; },
    L => { if (!L) return null; const a = pick([2, 4, 6, 8, 10]), t = ri(2, 6), v0 = L === 2 ? 2 * ri(0, 5) : 0, s = v0 * t + a * t * t / 2;
      return { ctx: `Parte com ${v0} m/s e acelera a ${a} m/s². Deslocamento em ${t} s?`, q: '', a: s, u: 'm', h: `s = v₀t + at²/2 = ${v0 * t} + ${a * t * t / 2} = ${s}` }; },
    L => { if (!L) return null; const [v, a] = pick([[10, 2], [20, 4], [20, 5], [30, 5], [30, 6], [40, 8], [10, 5], [20, 2]]), d = v * v / (2 * a);
      return { ctx: `Um carro a ${v} m/s freia com ${a} m/s². Distância até parar?`, q: '', a: d, u: 'm', h: `Torricelli: 0 = v² − 2ad → d = ${v * v} ÷ ${2 * a} = ${d}` }; },
    L => { const t = ri(1, 6), k = Math.random() < .5;
      return k ? { ctx: `Queda livre a partir do repouso. Quanto cai em ${t} s?`, q: '', a: 5 * t * t, u: 'm', h: `h = gt²/2 = 5t² = ${5 * t * t}` }
        : { ctx: `Solto de ${5 * t * t} m. Tempo de queda?`, q: '', a: t, u: 's', h: `5t² = ${5 * t * t} → t² = ${t * t}` }; },
    L => { if (!L) return null; const v0 = 10 * ri(1, 5), k = pick(['h', 'ts', 'tt']);
      if (k === 'h') return { ctx: `Lançado para cima a ${v0} m/s. Altura máxima?`, q: '', a: v0 * v0 / 20, u: 'm', h: `v₀²/2g = ${v0 * v0} ÷ 20 = ${v0 * v0 / 20}` };
      if (k === 'ts') return { ctx: `Lançado para cima a ${v0} m/s. Tempo de subida?`, q: '', a: v0 / 10, u: 's', h: `v₀/g = ${v0 / 10}` };
      return { ctx: `Lançado para cima a ${v0} m/s. Tempo até voltar à mão?`, q: '', a: v0 / 5, u: 's', h: `2v₀/g = ${v0 / 5}` }; },
    L => { if (L < 2) return null; const h = pick([5, 20, 45, 80]), t = Math.sqrt(h / 5), v = ri(2, 15);
      return { ctx: `Lançado na horizontal a ${v} m/s de ${h} m de altura. Alcance?`, q: '', a: v * t, u: 'm', h: `queda dura √(${h}/5) = ${t} s; alcance = ${v} × ${t} = ${v * t}` }; },
    L => { if (!L) return null; const k = pick(['T', 'rpm', 'v', 'ac']);
      if (k === 'T') { const fr = pick([2, 4, 5, 10, 0.5]); return { ctx: `Frequência de ${f(fr)} Hz. Período?`, q: '', a: rd(1 / fr), u: 's', h: `T = 1/f = ${f(rd(1 / fr))}` }; }
      if (k === 'rpm') { const r = pick([60, 120, 180, 300, 600, 1200]); return { ctx: `${r} rpm em hertz`, q: '', a: r / 60, u: 'Hz', h: `÷ 60: ${r / 60}` }; }
      if (k === 'v') { const w = ri(2, 10), R = pick([0.5, 1, 2, 3]); return { ctx: `ω = ${w} rad/s, raio ${f(R)} m. Velocidade linear?`, q: '', a: rd(w * R), u: 'm/s', h: `v = ωR = ${f(rd(w * R))}` }; }
      const v = pick([2, 4, 6, 10, 20]), R = pick([1, 2, 4, 5, 10]); return L < 2 ? null : { ctx: `MCU com v = ${v} m/s e raio ${R} m. Aceleração centrípeta?`, q: '', a: rd(v * v / R), u: 'm/s²', h: `v²/R = ${v * v} ÷ ${R} = ${f(rd(v * v / R))}` }; },
    L => { if (L < 2) return null; const [a, b, m] = pick([[40, 60, 48], [30, 60, 40], [20, 30, 24], [60, 90, 72], [10, 15, 12], [40, 120, 60], [60, 40, 48]]);
      return { ctx: `Metade do caminho a ${a} km/h e a outra metade a ${b} km/h. Velocidade média?`, q: '', a: m, u: 'km/h', h: `média harmônica: 2·${a}·${b} ÷ (${a} + ${b}) = ${m} (não é ${(a + b) / 2}!)` }; },
    L => { if (!L) return null; const v = 2 * ri(2, 15), t = ri(2, 10);
      return { ctx: `No gráfico v × t, a velocidade sobe linearmente de 0 a ${v} m/s em ${t} s. Deslocamento?`, q: '', a: v * t / 2, u: 'm', h: `área do triângulo: ${v} × ${t} ÷ 2 = ${v * t / 2}` }; },
    L => { if (!L) return null; const v1 = 5 * ri(2, 8), v2 = 5 * ri(1, 6), t = ri(2, 6), opp = Math.random() < .5 || v1 === v2, d = (opp ? v1 + v2 : Math.abs(v1 - v2)) * t;
      return { ctx: `Dois móveis a ${d} m um do outro, a ${v1} m/s e ${v2} m/s, ${opp ? 'indo um em direção ao outro' : 'no mesmo sentido, o mais rápido atrás'}. Tempo até o encontro?`, q: '', a: t, u: 's', h: `velocidade relativa ${opp ? `${v1} + ${v2}` : `${Math.max(v1, v2)} − ${Math.min(v1, v2)}`} = ${opp ? v1 + v2 : Math.abs(v1 - v2)}; ${d} ÷ ${opp ? v1 + v2 : Math.abs(v1 - v2)} = ${t}` }; },
  ]);

  topic('f_din', 'fis', 'Leis de Newton e atrito', [
    L => { const m = ri(1, 20), a = ri(1, 8), k = pick(['F', 'a', 'P']);
      if (k === 'F') return { ctx: `Massa ${m} kg, aceleração ${a} m/s². Força resultante?`, q: '', a: m * a, u: 'N', h: `F = ma = ${m * a}` };
      if (k === 'a') return { ctx: `Força resultante ${m * a} N num corpo de ${m} kg. Aceleração?`, q: '', a, u: 'm/s²', h: `a = F/m = ${a}` };
      return { ctx: `Peso de um corpo de ${m} kg`, q: '', a: 10 * m, u: 'N', h: `P = mg = ${10 * m}` }; },
    L => { const m = ri(2, 20), mu = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]), fat = rd(mu * m * 10);
      if (L === 0) return { ctx: `Bloco de ${m} kg no chão, μ = ${f(mu)}. Força para arrastá-lo com velocidade constante?`, q: '', a: fat, u: 'N', h: `MRU: F = atrito = μmg = ${f(mu)} × ${10 * m} = ${f(fat)}` };
      const F = fat + m * ri(1, 4); return { ctx: `Bloco de ${m} kg, μ = ${f(mu)}, puxado por ${f(F)} N na horizontal. Aceleração?`, q: '', a: rd((F - fat) / m), u: 'm/s²', h: `(F − μmg)/m = (${f(F)} − ${f(fat)}) ÷ ${m} = ${f(rd((F - fat) / m))}` }; },
    L => { if (!L) return null; const m1 = ri(1, 6), m2 = ri(1, 6), a = ri(1, 4), F = (m1 + m2) * a;
      return Math.random() < .5 ? { ctx: `Blocos de ${m1} kg e ${m2} kg encostados, empurrados por ${F} N (sem atrito). Aceleração?`, q: '', a, u: 'm/s²', h: `F/(m₁ + m₂) = ${F} ÷ ${m1 + m2} = ${a}` }
        : { ctx: `Força de ${F} N puxa o bloco A (${m1} kg), ligado por fio ao B (${m2} kg) atrás. Tração no fio?`, q: '', a: m2 * a, u: 'N', h: `a = ${F} ÷ ${m1 + m2} = ${a}; o fio acelera só o B: T = ${m2} × ${a} = ${m2 * a}` }; },
    L => { if (!L) return null; const m = ri(1, 10), sub = Math.random() < .5;
      return sub ? { ctx: `Bloco de ${m} kg desce um plano inclinado de 30° sem atrito. Aceleração?`, q: '', a: 5, u: 'm/s²', h: 'a = g·sen 30° = 10 × 0,5 = 5 (não depende da massa)' }
        : { ctx: `Bloco de ${m} kg num plano inclinado de 30°. Componente do peso ao longo do plano?`, q: '', a: 5 * m, u: 'N', h: `P·sen 30° = ${10 * m} × 0,5 = ${5 * m}` }; },
    L => { if (!L) return null; const m = 10 * ri(4, 9), a = ri(1, 3), up = Math.random() < .5;
      return { ctx: `Pessoa de ${m} kg numa balança, num elevador ${up ? 'subindo acelerado' : 'descendo acelerado'} a ${a} m/s². Leitura da balança?`, q: '', a: m * (10 + (up ? a : -a)), u: 'N', h: `N = m(g ${up ? '+' : '−'} a) = ${m} × ${10 + (up ? a : -a)} = ${m * (10 + (up ? a : -a))}` }; },
    L => { const k = pick([100, 200, 400, 500, 1000]), x = pick([1, 2, 4, 5, 10]), ask = pick(['F', 'k']);
      return ask === 'F' ? { ctx: `Mola de k = ${k} N/m distendida ${x} cm. Força?`, q: '', a: rd(k * x / 100), u: 'N', h: `F = kx = ${k} × ${f(x / 100)} = ${f(rd(k * x / 100))}` }
        : { ctx: `Uma força de ${f(rd(k * x / 100))} N distende uma mola em ${x} cm. Constante elástica?`, q: '', a: k, u: 'N/m', h: `k = F/x = ${f(rd(k * x / 100))} ÷ ${f(x / 100)} = ${k}` }; },
    L => { if (L < 2) return null; const [m1, m2] = pick([[3, 2], [4, 1], [6, 4], [7, 3], [3, 1], [9, 1], [5, 3]]);
      return { ctx: `Máquina de Atwood com massas ${m1} kg e ${m2} kg. Aceleração?`, q: '', a: rd((m1 - m2) * 10 / (m1 + m2)), u: 'm/s²', h: `(m₁ − m₂)g/(m₁ + m₂) = ${(m1 - m2) * 10} ÷ ${m1 + m2} = ${f(rd((m1 - m2) * 10 / (m1 + m2)))}` }; },
    L => { if (L < 2) return null; const m = ri(1, 5), v = pick([2, 4, 5, 10]), R = pick([1, 2, 4, 5]);
      return { ctx: `Corpo de ${m} kg em curva de raio ${R} m a ${v} m/s. Força centrípeta?`, q: '', a: rd(m * v * v / R), u: 'N', h: `mv²/R = ${m} × ${v * v} ÷ ${R} = ${f(rd(m * v * v / R))}` }; },
    L => { const [ctx, ok, no, h] = pick([
        ['Um corpo em movimento retilíneo uniforme tem força resultante:', 'nula', ['constante e não nula', 'no sentido do movimento', 'contrária ao movimento'], '1ª lei: MRU ou repouso ↔ resultante zero'],
        ['O par ação e reação da força peso de uma maçã (Terra puxa a maçã) é:', 'a maçã puxando a Terra', ['a força normal da mesa', 'a força de atrito', 'não existe par'], 'ação e reação atuam em corpos diferentes; a normal não é o par do peso'],
        ['Ao frear o ônibus, os passageiros vão para frente por causa da:', 'inércia', ['força centrípeta', 'gravidade', 'reação do banco'], '1ª lei: tendem a manter a velocidade'],
        ['Num corpo em queda livre (sem ar), a aceleração:', 'é g, igual para todas as massas', ['é maior para corpos mais pesados', 'cresce com o tempo', 'é zero no ponto mais alto'], 'g não depende da massa'],
        ['No ponto mais alto de um lançamento vertical, a aceleração é:', 'g, para baixo', ['zero', 'g, para cima', 'maior que g'], 'a velocidade é zero, mas o peso continua agindo']]);
      return mc({ ctx, ok, no, h }); },
  ]);

  topic('f_en', 'fis', 'Trabalho, energia e potência', [
    L => { const m = pick([1, 2, 4, 5, 10]), v = pick([2, 4, 6, 10, 20]);
      return { ctx: `Energia cinética de ${m} kg a ${v} m/s`, q: '', a: m * v * v / 2, u: 'J', h: `mv²/2 = ${m} × ${v * v} ÷ 2 = ${m * v * v / 2}` }; },
    L => { const m = ri(1, 10), h = ri(2, 20); return { ctx: `Energia potencial gravitacional de ${m} kg a ${h} m de altura`, q: '', a: 10 * m * h, u: 'J', h: `mgh = ${m} × 10 × ${h} = ${10 * m * h}` }; },
    L => { const [h, v] = pick([[5, 10], [20, 20], [45, 30], [80, 40], [0.8, 4], [1.8, 6], [3.2, 8], [1.25, 5]]), down = Math.random() < .5;
      return down ? { ctx: `Cai de ${f(h)} m a partir do repouso (sem atrito). Velocidade ao chegar?`, q: '', a: v, u: 'm/s', h: `mgh = mv²/2 → v = √(2gh) = √${f(20 * h)} = ${v}` }
        : { ctx: `Lançado para cima a ${v} m/s. Que altura atinge (sem ar)?`, q: '', a: h, u: 'm', h: `h = v²/2g = ${v * v} ÷ 20 = ${f(h)}` }; },
    L => { const F = ri(2, 20) * 5, d = ri(2, 10), [ang, c] = pick(L ? [[0, 1], [60, 0.5], [90, 0], [180, -1]] : [[0, 1]]);
      return { ctx: `Força de ${F} N, deslocamento de ${d} m, ângulo de ${ang}° entre eles. Trabalho?`, q: '', a: F * d * c, u: 'J', h: `W = F·d·cos θ = ${F} × ${d} × ${f(c)} = ${F * d * c}` }; },
    L => { if (!L) return null; const m = 10 * ri(2, 10), h = ri(2, 10), t = pick([2, 4, 5, 10, 20]);
      return { ctx: `Um motor ergue ${m} kg a ${h} m em ${t} s. Potência média?`, q: '', a: rd(m * 10 * h / t), u: 'W', h: `mgh/t = ${f(m * 10 * h)} ÷ ${t} = ${f(rd(m * 10 * h / t))}` }; },
    L => { if (!L) return null; const tot = pick([200, 400, 500, 800, 1000, 2000]), r = pick([20, 25, 40, 50, 60, 75, 80]);
      return { ctx: `Uma máquina recebe ${tot} W e entrega ${tot * r / 100} W úteis. Rendimento?`, q: '', a: r, u: '%', h: `${tot * r / 100} ÷ ${tot} = ${f(r / 100)}` }; },
    L => { const k = ri(2, 4); return { ctx: `Se a velocidade fica ${k} vezes maior, a energia cinética fica multiplicada por:`, q: '', a: k * k, h: `Ec ∝ v²: ${k}² = ${k * k}` }; },
    L => { if (!L) return null; const k = pick([100, 200, 400, 800]), x = pick([0.1, 0.2, 0.5]);
      return { ctx: `Mola de k = ${k} N/m comprimida ${f(x * 100)} cm. Energia elástica?`, q: '', a: rd(k * x * x / 2), u: 'J', h: `kx²/2 = ${k} × ${f(rd(x * x))} ÷ 2 = ${f(rd(k * x * x / 2))}` }; },
    L => { if (L < 2) return null; const F = pick([100, 200, 500, 1000, 2000]), v = pick([2, 5, 10, 20, 30]);
      return { ctx: `Um carro mantém ${v} m/s contra uma resistência de ${F} N. Potência do motor?`, q: '', a: F * v, u: 'W', h: `P = F·v = ${f(F * v)}` }; },
    L => { if (L < 2) return null; const m = ri(1, 4), h = pick([5, 10, 20]), v = pick([4, 6, 8, 10]); if (v * v / 2 >= 10 * h) return null;
      return { ctx: `${m} kg desliza de ${h} m de altura e chega embaixo a ${v} m/s. Energia dissipada?`, q: '', a: m * (10 * h - v * v / 2), u: 'J', h: `mgh − mv²/2 = ${10 * m * h} − ${m * v * v / 2} = ${m * (10 * h - v * v / 2)}` }; },
  ]);

  topic('f_mom', 'fis', 'Quantidade de movimento', [
    L => { const m = pick([0.2, 0.5, 1, 2, 5, 10, 1000]), v = pick([2, 4, 10, 20, 30]);
      return { ctx: `Quantidade de movimento de ${f(m)} kg a ${v} m/s`, q: '', a: rd(m * v), u: 'kg·m/s', h: `p = mv = ${f(rd(m * v))}` }; },
    L => { const F = pick([10, 20, 50, 100, 200, 500]), t = pick([0.01, 0.02, 0.05, 0.1, 0.2, 0.5]);
      return { ctx: `Força média de ${F} N durante ${f(t)} s. Impulso?`, q: '', a: rd(F * t), u: 'N·s', h: `I = F·Δt = ${f(rd(F * t))}` }; },
    L => { if (!L) return null; const m = pick([0.2, 0.4, 0.5, 1]), v = pick([10, 20, 30]), t = pick([0.01, 0.02, 0.05, 0.1]);
      return { ctx: `Bola de ${f(m)} kg a ${v} m/s é parada em ${f(t)} s. Força média?`, q: '', a: rd(m * v / t), u: 'N', h: `F = Δp/Δt = ${f(rd(m * v))} ÷ ${f(t)} = ${f(rd(m * v / t))}` }; },
    L => { if (!L) return null; const m1 = ri(1, 6), m2 = ri(1, 6), v1 = (m1 + m2) * ri(1, 4), v2 = 0, vf = (m1 * v1 + m2 * v2) / (m1 + m2);
      return { ctx: `Carrinho de ${m1} kg a ${v1} m/s bate num de ${m2} kg parado e eles grudam. Velocidade depois?`, q: '', a: vf, u: 'm/s', h: `${m1} × ${v1} = ${m1 + m2} × v → v = ${vf}` }; },
    L => { if (!L) return null; let m1, m2, v1, v2; do { m1 = ri(40, 80); m2 = pick([20, 40, 50, 60, 80]); v1 = pick([1, 2, 3, 4]); v2 = rd(m1 * v1 / m2); } while (!Number.isInteger(rd(v2 * 10)) || m1 === m2);
      return { ctx: `Dois patinadores parados se empurram. Um, de ${m1} kg, sai a ${v1} m/s. O outro tem ${m2} kg. Velocidade dele?`, q: '', a: v2, u: 'm/s', h: `p total = 0: ${m1} × ${v1} = ${m2} × v → v = ${f(v2)}` }; },
    L => { if (L < 2) return null; const m = ri(1, 4), v = 2 * ri(2, 10), ei = m * v * v / 2, ef = 2 * m * (v / 2) ** 2 / 2;
      return { ctx: `Massa ${m} kg a ${v} m/s colide e gruda numa massa igual parada. Energia cinética perdida?`, q: '', a: ei - ef, u: 'J', h: `v' = ${v / 2}; antes ${ei} J, depois ${ef} J; perde ${ei - ef} (metade)` }; },
    L => { const [ctx, ok, no, h] = pick([
        ['Colisão elástica frontal entre massas iguais, uma parada:', 'trocam de velocidade', ['ambas param', 'seguem juntas', 'a que estava parada fica parada'], 'conserva p e Ec: as velocidades se trocam'],
        ['Numa colisão perfeitamente inelástica, conserva-se:', 'a quantidade de movimento', ['a energia cinética', 'as duas', 'nenhuma das duas'], 'p sempre se conserva em sistema isolado; Ec não'],
        ['O airbag reduz a força no motorista porque:', 'aumenta o tempo de parada', ['reduz a variação de velocidade', 'reduz a massa', 'aumenta o impulso'], 'mesmo Δp com Δt maior → F menor']]);
      return mc({ ctx, ok, no, h }); },
  ]);

  topic('f_grav', 'fis', 'Gravitação e astronomia', [
    L => { const [txt, v, h] = pick([['A distância entre dois corpos dobra. A força gravitacional fica multiplicada por:', 0.25, '1/d²: 1/2² = 1/4'], ['A distância cai pela metade. A força fica multiplicada por:', 4, '1/(1/2)² = 4'], ['A distância triplica. A força fica multiplicada por (em fração decimal, 2 casas)?', 0.11, '1/9 ≈ 0,11'], ['As duas massas dobram e a distância também. A força fica multiplicada por:', 1, '2 × 2 ÷ 2² = 1'], ['Uma das massas triplica. A força fica multiplicada por:', 3, 'F ∝ m₁m₂']]);
      return { ctx: txt, q: '', a: v, h }; },
    L => { if (!L) return null; const [txt, v, h] = pick([['g na superfície = 10 m/s². A uma altura igual ao raio da Terra, g vale:', 2.5, 'distância ao centro dobra: g/4'], ['Um planeta com o dobro da massa e o dobro do raio da Terra. g lá (m/s²)?', 5, 'g ∝ M/R²: 2/4 = 1/2 de 10'], ['Planeta com a mesma massa da Terra e metade do raio. g lá (m/s²)?', 40, '1/(1/2)² = 4 → 40'], ['Uma pessoa de 60 kg vai à Lua (g ≈ 1,6 m/s²). Massa dela lá (kg)?', 60, 'massa não muda; o peso sim']]);
      return { ctx: txt, q: '', a: v, h }; },
    L => { if (!L) return null; const [a, T] = pick([[4, 8], [9, 27], [16, 64], [25, 125], [1, 1]]), askT = Math.random() < .6;
      return askT ? { ctx: `Um planeta está a ${a} UA do Sol (a Terra está a 1 UA). Período em anos?`, q: '', a: T, u: 'anos', h: `Kepler: T² ∝ a³ → T = √(${a}³) = ${T}` }
        : { ctx: `Um planeta tem período de ${T} anos. Distância ao Sol, em UA?`, q: '', a, u: 'UA', h: `a = ∛(T²) = ∛${T * T} = ${a}` }; },
    L => { if (!L) return null; const [txt, v, u, h] = pick([['A luz do Sol (1,5 × 10⁸ km) leva quantos segundos para chegar à Terra?', 500, 's', '1,5 × 10⁸ ÷ 3 × 10⁵ km/s = 500 s ≈ 8 min'], ['Um sinal de rádio vai até a Lua (3,6 × 10⁵ km) e volta. Quantos segundos?', 2.4, 's', '2 × 3,6 × 10⁵ ÷ 3 × 10⁵ = 2,4'], ['Quantos km a luz percorre em 1 minuto? (× 10⁶)', 18, '× 10⁶ km', '3 × 10⁵ × 60 = 1,8 × 10⁷ = 18 × 10⁶']]);
      return { ctx: txt, q: '', a: v, u, h }; },
    L => { const it = pick(ASTRO); return mc({ ctx: it[0], ok: it[1], no: it[2], h: it[3] }); },
    L => { const it = pick(ASTRO); return mc({ ctx: it[0], ok: it[1], no: it[2], h: it[3] }); },
  ]);

  topic('f_hid', 'fis', 'Torque e hidrostática', [
    L => { const F = ri(2, 20) * 5, d = pick([0.1, 0.2, 0.5, 1, 2]); return { ctx: `Força de ${F} N aplicada perpendicularmente a ${f(d)} m do eixo. Torque?`, q: '', a: rd(F * d), u: 'N·m', h: `M = F·d = ${f(rd(F * d))}` }; },
    L => { const m1 = 10 * ri(2, 8), d1 = ri(1, 4), m2 = 10 * ri(2, 8), d2 = rd(m1 * d1 / m2); if (d2 * 100 % 25) return null;
      return { ctx: `Gangorra: ${m1} kg a ${d1} m do apoio. A que distância deve ficar uma pessoa de ${m2} kg para equilibrar?`, q: '', a: d2, u: 'm', h: `m₁d₁ = m₂d₂ → ${m1 * d1} ÷ ${m2} = ${f(d2)}` }; },
    L => { const F = pick([100, 200, 500, 600, 1000]), A = pick([0.5, 0.2, 0.1, 2, 0.01]); return { ctx: `Força de ${F} N sobre ${f(A)} m². Pressão?`, q: '', a: rd(F / A), u: 'Pa', h: `p = F/A = ${f(rd(F / A))}` }; },
    L => { if (!L) return null; const h = 10 * ri(1, 6); return { ctx: `Pressão total a ${h} m de profundidade na água (com 1 atm na superfície)?`, q: '', a: 1 + h / 10, u: 'atm', h: `cada 10 m de água ≈ 1 atm: 1 + ${h / 10} = ${1 + h / 10}` }; },
    L => { const V = pick([1, 2, 5, 10, 0.5]); return { ctx: `Objeto de ${f(V)} L totalmente submerso em água. Empuxo?`, q: '', a: rd(V * 10), u: 'N', h: `E = ρVg = 1000 × ${f(V / 1000)} × 10 = ${f(rd(V * 10))}` }; },
    L => { if (!L) return null; const [rc, rl, nm] = pick([[0.9, 1, 'gelo em água'], [0.6, 1, 'madeira em água'], [0.6, 0.8, 'madeira em óleo (0,8 g/cm³)'], [0.92, 1.03, 'gelo (0,92) em água do mar (1,03)'], [0.5, 1, 'boia de 0,5 g/cm³ em água'], [7.8, 13.6, 'ferro (7,8) em mercúrio (13,6)']]);
      const p = rd(100 * rc / rl); if (p % 1 && L < 2) return null;
      return { ctx: `Fração submersa (em %) de ${nm}${p % 1 ? ', aprox.' : ''}`, q: '', a: p % 1 ? Math.round(p) : p, u: '%', h: `ρ<sub>corpo</sub>/ρ<sub>líquido</sub> = ${f(rc)}/${f(rl)}` }; },
    L => { if (L < 2) return null; const F1 = pick([10, 20, 50, 100]), k = pick([2, 3, 4, 5]), byR = Math.random() < .5;
      return { ctx: `Prensa hidráulica: o êmbolo maior tem ${byR ? `raio ${k} vezes` : `área ${k * k} vezes`} o do menor. Força de ${F1} N no menor gera quanto no maior?`, q: '', a: F1 * k * k, u: 'N', h: `${byR ? `área ∝ r²: ${k}² = ${k * k}; ` : ''}F₂ = ${F1} × ${k * k} = ${F1 * k * k}` }; },
    L => { const m = pick([10, 20, 50, 100, 270, 540]), V = pick([5, 10, 20, 50, 100]); const d = rd(m / V); if (d > 20) return null;
      return { ctx: `${m} g ocupando ${V} cm³. Densidade?`, q: '', a: d, u: 'g/cm³', h: `d = m/V = ${f(d)}` }; },
    L => { if (L < 2) return null; const V = pick([1, 2, 5]), d = pick([2, 3, 5, 8]);
      return { ctx: `Objeto de ${V} L e densidade ${d} g/cm³ preso a um dinamômetro, todo dentro d'água. Leitura?`, q: '', a: 10 * V * (d - 1), u: 'N', h: `P − E = ${10 * V * d} − ${10 * V} = ${10 * V * (d - 1)}` }; },
  ]);

  topic('f_term', 'fis', 'Termometria e calor', [
    L => { const C = 5 * ri(-8, 20), toF = Math.random() < .5 || L === 0;
      return toF ? { ctx: `${C} °C em °F`, q: '', a: rd(1.8 * C + 32), u: '°F', h: `C/5 = (F − 32)/9, ou F = 1,8C + 32 = ${f(rd(1.8 * C))} + 32 = ${f(rd(1.8 * C + 32))}` }
        : { ctx: `${f(rd(1.8 * C + 32))} °F em °C`, q: '', a: C, u: '°C', h: `C = (F − 32) ÷ 1,8 = ${f(rd(1.8 * C))} ÷ 1,8 = ${C}` }; },
    L => { const C = ri(-50, 400), toK = Math.random() < .5; return toK ? { ctx: `${C} °C em kelvin`, q: '', a: C + 273, u: 'K', h: `K = C + 273` } : { ctx: `${C + 273} K em °C`, q: '', a: C, u: '°C', h: 'C = K − 273' }; },
    L => { if (!L) return null; const d = 5 * ri(1, 20); return { ctx: `Uma variação de ${d} °C equivale a quantos °F de variação?`, q: '', a: rd(1.8 * d), u: '°F', h: `ΔF = 1,8 ΔC (sem o 32!) = ${f(rd(1.8 * d))}` }; },
    L => { const m = pick([100, 200, 250, 500, 1000]), dT = pick([10, 20, 30, 40, 50, 80]), [c, nm] = pick(L ? [[1, 'água'], [0.5, 'gelo'], [0.2, 'alumínio'], [0.1, 'ferro']] : [[1, 'água']]);
      return { ctx: `Calor para aquecer ${m} g de ${nm} (c = ${f(c)} cal/g·°C) em ${dT} °C`, q: '', a: rd(m * c * dT), u: 'cal', h: `Q = mcΔT = ${m} × ${f(c)} × ${dT} = ${f(rd(m * c * dT))}` }; },
    L => { if (!L) return null; const m = pick([10, 20, 50, 100, 200]), [Lh, nm] = pick([[80, 'derreter gelo a 0 °C (L = 80 cal/g)'], [540, 'vaporizar água a 100 °C (L = 540 cal/g)']]);
      return { ctx: `Calor para ${nm}: ${m} g`, q: '', a: m * Lh, u: 'cal', h: `Q = mL = ${m} × ${Lh} = ${f(m * Lh)}` }; },
    L => { if (!L) return null; let m1, m2, T1, T2, Te; do { m1 = 100 * ri(1, 4); m2 = 100 * ri(1, 4); T1 = 10 * ri(1, 4); T2 = 10 * ri(5, 9); Te = (m1 * T1 + m2 * T2) / (m1 + m2); } while (!Number.isInteger(Te));
      return { ctx: `Misturam-se ${m1} g de água a ${T1} °C com ${m2} g a ${T2} °C. Temperatura final?`, q: '', a: Te, u: '°C', h: `média ponderada pelas massas: (${m1}·${T1} + ${m2}·${T2}) ÷ ${m1 + m2} = ${Te}` }; },
    L => { if (L < 2) return null; const L0 = pick([10, 20, 50, 100]), a = pick([1, 1.2, 2, 2.5]), dT = pick([20, 40, 50, 100]); const dL = rd(L0 * a * 1e-5 * dT * 1000);
      return { ctx: `Barra de ${L0} m, α = ${f(a)} × 10⁻⁵ °C⁻¹, aquecida ${dT} °C. Dilatação em mm?`, q: '', a: dL, u: 'mm', h: `ΔL = L₀αΔT = ${L0} × ${f(a)} × 10⁻⁵ × ${dT} = ${f(dL)} mm` }; },
    L => { if (L < 2) return null; const P = pick([1000, 2000, 4200, 2100]), m = pick([1, 2]), dT = pick([20, 50, 60, 80]); const t = rd(m * 4200 * dT / P);
      return { ctx: `Aquecedor de ${f(P)} W esquenta ${m} kg de água (c = 4.200 J/kg·°C) em ${dT} °C. Tempo mínimo?`, q: '', a: t, u: 's', h: `t = mcΔT/P = ${f(m * 4200 * dT)} ÷ ${f(P)} = ${f(t)}` }; },
    L => { const [ctx, ok, no, h] = pick([
        ['No vácuo, o calor só se propaga por:', 'irradiação', ['condução', 'convecção', 'condução e convecção'], 'irradiação é onda eletromagnética, não precisa de meio'],
        ['A brisa marítima e o aquecimento de água numa panela ocorrem principalmente por:', 'convecção', ['condução', 'irradiação', 'dilatação'], 'convecção: movimento do próprio fluido'],
        ['Dois corpos em equilíbrio térmico com um terceiro estão em equilíbrio entre si. Isso é a:', 'lei zero da termodinâmica', ['primeira lei', 'segunda lei', 'lei de Fourier'], 'é a base do termômetro'],
        ['A água tem calor específico alto. Por isso:', 'demora a esquentar e a esfriar', ['ferve a 100 °C', 'é boa condutora', 'dilata muito'], 'precisa de muita energia para variar a temperatura'],
        ['Durante a fusão do gelo sob pressão constante, a temperatura:', 'fica constante', ['sobe', 'cai', 'oscila'], 'o calor latente muda o estado, não a temperatura']]);
      return mc({ ctx, ok, no, h }); },
    // escala inventada: a temperatura fica na mesma posição entre gelo e vapor em qualquer escala
    L => { if (!L) return null; const g0 = pick([-20, -10, 10, 20, 40]), span = pick(L > 1 ? [40, 60, 80, 120, 150, 250] : [50, 200]), C = 10 * ri(1, 9), X = g0 + C * span / 100;
      if (!Number.isInteger(X)) return null; const g1 = g0 + span, toX = Math.random() < .5, n = x => x < 0 ? '−' + (-x) : x, mg = g0 < 0 ? ` + ${-g0}` : ` − ${g0}`;
      return { ctx: `Uma escala X marca ${n(g0)} °X no gelo e ${g1} °X na água fervendo. ${toX ? `Quanto marca a ${C} °C?` : `${n(X)} °X equivale a quantos °C?`}`, q: '', a: toX ? X : C, u: toX ? '°X' : '°C',
        h: `(X${mg})/(${g1}${mg}) = C/100 → ${C} °C fica a ${C}% do caminho entre gelo e vapor: ${n(g0)} + ${C}% de ${span} = ${n(X)}` }; },
  ]);

  topic('f_gas', 'fis', 'Gases e termodinâmica', [
    L => { const P = pick([1, 2, 3, 4]), k = pick([2, 3, 4]), V = k * ri(1, 6);
      return Math.random() < .5 ? { ctx: `Gás a ${P} atm ocupa ${V} L. Comprimido isotermicamente até ${f(rd(V / k))} L. Nova pressão?`, q: '', a: P * k, u: 'atm', h: `PV constante: ${P} × ${V} = p × ${f(rd(V / k))} → ${P * k}` }
        : { ctx: `Gás a ${P} atm ocupa ${V} L. A pressão passa a ${P * k} atm (T constante). Novo volume?`, q: '', a: rd(V / k), u: 'L', h: `${P} × ${V} ÷ ${P * k} = ${f(rd(V / k))}` }; },
    L => { const [T1, T2, isC] = pick([[300, 600, false], [200, 400, false], [27, 327, true], [-73, 127, true], [300, 450, false], [127, 327, true]]), V = pick([2, 4, 6, 10]); const K1 = isC ? T1 + 273 : T1, K2 = isC ? T2 + 273 : T2; if (L === 0 && isC) return null;
      return { ctx: `Gás a pressão constante: ${V} L a ${T1} ${isC ? '°C' : 'K'}. Volume a ${T2} ${isC ? '°C' : 'K'}?`, q: '', a: rd(V * K2 / K1), u: 'L', h: `${isC ? `em kelvin: ${K1} K → ${K2} K; ` : ''}V/T constante: ${V} × ${K2} ÷ ${K1} = ${f(rd(V * K2 / K1))}` }; },
    L => { const Q = 10 * ri(5, 60), W = 10 * ri(1, 40), k = pick(['dU', 'Q', 'W']);
      if (k === 'dU') return { ctx: `Um gás recebe ${Q} J de calor e realiza ${W} J de trabalho. Variação da energia interna?`, q: '', a: Q - W, u: 'J', h: `ΔU = Q − W = ${Q - W}` };
      if (k === 'Q') return { ctx: `Gás realiza ${W} J de trabalho e sua energia interna aumenta ${Q} J. Calor recebido?`, q: '', a: Q + W, u: 'J', h: `Q = ΔU + W = ${Q + W}` };
      return { ctx: `Gás recebe ${Q + W} J de calor e sua energia interna aumenta ${Q} J. Trabalho realizado?`, q: '', a: W, u: 'J', h: `W = Q − ΔU = ${W}` }; },
    L => { if (!L) return null; const P = pick([1, 2, 3, 5]), dV = pick([1, 2, 3, 4, 10]);
      return { ctx: `Expansão a ${P} × 10⁵ Pa constantes, de ${dV} L. Trabalho do gás?`, q: '', a: P * dV * 100, u: 'J', h: `W = pΔV = ${P} × 10⁵ × ${dV} × 10⁻³ = ${P * dV * 100}` }; },
    L => { if (!L) return null; const [Tf, Tq, C] = pick([[300, 600, false], [300, 400, false], [200, 500, false], [27, 327, true], [27, 127, true], [250, 1000, false]]); const Kf = C ? Tf + 273 : Tf, Kq = C ? Tq + 273 : Tq; if (C && L < 2) return null;
      return { ctx: `Máquina de Carnot entre ${Tq} ${C ? '°C' : 'K'} e ${Tf} ${C ? '°C' : 'K'}. Rendimento?`, q: '', a: rd(100 * (1 - Kf / Kq)), u: '%', h: `η = 1 − T<sub>f</sub>/T<sub>q</sub>${C ? ` (em K: ${Kf}/${Kq})` : ''} = ${f(rd(100 * (1 - Kf / Kq)))}%` }; },
    L => { if (!L) return null; const Q = pick([100, 200, 400, 500, 1000]), r = pick([20, 25, 30, 40]);
      return Math.random() < .5 ? { ctx: `Motor recebe ${Q} J da fonte quente e realiza ${Q * r / 100} J de trabalho. Rendimento?`, q: '', a: r, u: '%', h: `W/Q = ${Q * r / 100}/${Q}` }
        : { ctx: `Motor recebe ${Q} J e realiza ${Q * r / 100} J. Calor rejeitado à fonte fria?`, q: '', a: Q - Q * r / 100, u: 'J', h: `Q<sub>f</sub> = Q<sub>q</sub> − W = ${Q - Q * r / 100}` }; },
    L => { const [ctx, ok, no, h] = pick([
        ['Numa transformação isotérmica de um gás ideal:', 'ΔU = 0', ['Q = 0', 'W = 0', 'p é constante'], 'U depende só de T'],
        ['Numa transformação adiabática:', 'Q = 0', ['ΔU = 0', 'W = 0', 'T é constante'], 'não troca calor; ΔU = −W'],
        ['Numa transformação isocórica (volume constante):', 'W = 0', ['Q = 0', 'ΔU = 0', 'p é constante'], 'sem variação de volume, sem trabalho'],
        ['Numa compressão adiabática, a temperatura do gás:', 'aumenta', ['diminui', 'fica constante', 'pode fazer qualquer coisa'], 'W < 0 e Q = 0 → ΔU > 0'],
        ['A energia cinética média das moléculas de um gás ideal depende só:', 'da temperatura absoluta', ['da pressão', 'do volume', 'da massa molar'], 'Ec média = (3/2)kT']]);
      return mc({ ctx, ok, no, h }); },
    L => { if (!L) return null; const [T1, T2] = pick([[300, 600], [200, 800], [27, 327], [100, 300]]), C = T1 === 27; const K1 = C ? 300 : T1, K2 = C ? 600 : T2;
      return { ctx: `Um gás vai de ${T1} ${C ? '°C' : 'K'} para ${T2} ${C ? '°C' : 'K'}. A energia cinética média das moléculas fica multiplicada por:`, q: '', a: K2 / K1, h: `Ec ∝ T em kelvin: ${K2}/${K1}` }; },
  ]);

  topic('f_ond', 'fis', 'Ondas e som', [
    L => { const lam = pick([0.5, 1, 2, 4, 5, 10]), fr = pick([2, 5, 10, 20, 50, 100]), k = pick(['v', 'l', 'f']);
      if (k === 'v') return { ctx: `Onda com λ = ${f(lam)} m e f = ${fr} Hz. Velocidade?`, q: '', a: rd(lam * fr), u: 'm/s', h: `v = λf = ${f(rd(lam * fr))}` };
      if (k === 'l') return { ctx: `Onda a ${f(rd(lam * fr))} m/s com f = ${fr} Hz. Comprimento de onda?`, q: '', a: lam, u: 'm', h: `λ = v/f = ${f(lam)}` };
      return { ctx: `Onda a ${f(rd(lam * fr))} m/s com λ = ${f(lam)} m. Frequência?`, q: '', a: fr, u: 'Hz', h: `f = v/λ = ${fr}` }; },
    L => { const fr = pick([85, 170, 340, 680, 1360]); return { ctx: `Som (340 m/s) de ${fr} Hz. Comprimento de onda?`, q: '', a: rd(340 / fr), u: 'm', h: `340 ÷ ${fr} = ${f(rd(340 / fr))}` }; },
    L => { if (!L) return null; const t = pick([0.5, 1, 2, 3, 4]); return { ctx: `O eco de um grito volta em ${f(t)} s. Distância até o paredão?`, q: '', a: rd(340 * t / 2), u: 'm', h: `o som vai e volta: 340 × ${f(t)} ÷ 2 = ${f(rd(340 * t / 2))}` }; },
    L => { if (!L) return null; const Lc = pick([0.5, 1, 2]), v = pick([100, 200, 300, 400]), n = ri(1, 4); const fn = rd(n * v / (2 * Lc));
      return { ctx: `Corda de ${f(Lc)} m, ondas a ${v} m/s. Frequência do ${n}º harmônico?`, q: '', a: fn, u: 'Hz', h: `fₙ = n·v/2L = ${n} × ${v} ÷ ${f(2 * Lc)} = ${f(fn)}` }; },
    L => { if (!L) return null; const d = pick([10, 20, 30, 40]); return { ctx: `O nível sonoro aumenta ${d} dB. A intensidade fica multiplicada por:`, q: '', a: 10 ** (d / 10), h: `cada 10 dB = × 10: ${sup(10, d / 10)}` }; },
    L => { if (!L) return null; const [fr, lam, nm] = pick([[100, 3, 'Uma rádio FM de 100 MHz'], [300, 1, 'Um sinal de 300 MHz'], [3000, 0.1, 'Uma micro-onda de 3 GHz'], [1, 300, 'Uma onda de 1 MHz (AM)']]);
      return { ctx: `${nm}: comprimento de onda?`, q: '', a: lam, u: 'm', h: `λ = c/f = 3 × 10⁸ ÷ ${fr} × 10⁶ = ${f(lam)}` }; },
    L => { if (L < 2) return null; const f1 = ri(400, 450), f2 = f1 + ri(2, 8); return { ctx: `Dois diapasões de ${f1} Hz e ${f2} Hz tocam juntos. Frequência dos batimentos?`, q: '', a: f2 - f1, u: 'Hz', h: `|f₁ − f₂| = ${f2 - f1}` }; },
    L => { if (L < 2) return null; const [T, mu, v] = pick([[100, 0.01, 100], [400, 0.01, 200], [90, 0.1, 30], [160, 0.1, 40], [250, 0.1, 50]]);
      return { ctx: `Corda com tração ${T} N e densidade linear ${f(mu)} kg/m. Velocidade da onda?`, q: '', a: v, u: 'm/s', h: `v = √(T/μ) = √${f(rd(T / mu))} = ${v}` }; },
    L => { const [ctx, ok, no, h] = pick([
        ['Qual destas ondas tem a maior frequência?', 'raios gama', ['raios X', 'ultravioleta', 'micro-ondas'], 'ordem: rádio < micro-ondas < IV < visível < UV < X < gama'],
        ['Qual destas ondas tem o maior comprimento de onda?', 'ondas de rádio', ['micro-ondas', 'infravermelho', 'luz visível'], 'maior λ ↔ menor f'],
        ['Na luz visível, a cor de maior comprimento de onda é:', 'vermelho', ['violeta', 'verde', 'azul'], 'vermelho ~700 nm, violeta ~400 nm'],
        ['O som não pode ser polarizado porque é uma onda:', 'longitudinal', ['transversal', 'eletromagnética', 'estacionária'], 'só ondas transversais polarizam'],
        ['Ao passar do ar para a água, a frequência de uma onda:', 'não muda', ['aumenta', 'diminui', 'zera'], 'f é da fonte; mudam v e λ'],
        ['Uma ambulância se aproxima. O som percebido fica:', 'mais agudo', ['mais grave', 'igual', 'mais alto apenas'], 'efeito Doppler: aproximação → f maior'],
        ['O som se propaga mais rápido no:', 'aço', ['ar', 'vácuo', 'água'], 'v cresce do gás ao sólido; no vácuo não há som'],
        ['A difração é mais perceptível quando a fenda tem tamanho:', 'próximo do comprimento de onda', ['muito maior que λ', 'muito menor que a amplitude', 'qualquer'], 'por isso ouvimos atrás de muros e não vemos'],
        ['Num tubo fechado em uma ponta, existem só os harmônicos:', 'ímpares', ['pares', 'todos', 'o fundamental'], 'f = n·v/4L com n ímpar']]);
      return mc({ ctx, ok, no, h }); },
  ]);

  topic('f_opt', 'fis', 'Óptica', [
    L => { const d = ri(1, 10), k = pick(['dist', 'mov', 'rot']);
      if (k === 'dist' || L === 0) return { ctx: `Você está a ${d} m de um espelho plano. Distância até a sua imagem?`, q: '', a: 2 * d, u: 'm', h: `imagem tão atrás quanto você está à frente: ${2 * d}` };
      if (k === 'mov') return { ctx: `Você se afasta ${d} m de um espelho plano. Quanto aumenta a distância até sua imagem?`, q: '', a: 2 * d, u: 'm', h: `você e a imagem se afastam ${d} cada: ${2 * d}` };
      return { ctx: `Um espelho plano gira ${d * 5}°. O raio refletido gira:`, q: '', a: d * 10, u: '°', h: 'gira o dobro' }; },
    L => { if (!L) return null; const a = pick([90, 60, 45, 72, 30, 40, 120]); return { ctx: `Dois espelhos planos formam ${a}°. Quantas imagens de um objeto entre eles?`, q: '', a: 360 / a - 1, h: `N = 360/α − 1 = ${360 / a - 1}` }; },
    L => { if (!L) return null; let F, p, q; do { F = pick([5, 10, 12, 15, 20, 30]); p = pick([6, 8, 15, 20, 24, 30, 36, 40, 45, 60]); q = F * p / (p - F); } while (p === F || !Number.isInteger(q) || Math.abs(q) > 200 || (L === 1 && q < 0));
      const askA = L === 2 && Math.random() < .4 && Number.isInteger(rd(10 * q / p));
      return askA ? { ctx: `Lente/espelho convergente, f = ${F} cm, objeto a ${p} cm. Aumento linear A?`, q: '', a: rd(-q / p), h: `p' = ${q} cm; A = −p'/p = ${f(rd(-q / p))}` }
        : { ctx: `Lente convergente, f = ${F} cm, objeto a ${p} cm. Posição da imagem p' (negativa se virtual)?`, q: '', a: q, u: 'cm', h: `1/f = 1/p + 1/p' → 1/p' = 1/${F} − 1/${p} → p' = ${q}` }; },
    L => { const F = pick([10, 20, 25, 50, 100, -50, -25, 200]); return { ctx: `Lente de distância focal ${F} cm. Vergência?`, q: '', a: rd(100 / F), u: 'di', h: `V = 1/f (em metros) = 1/${f(F / 100)} = ${f(rd(100 / F))}` }; },
    L => { const [v, n] = pick([[2, 1.5], [1.5, 2], [2.4, 1.25], [2.5, 1.2], [1.2, 2.5]]), askN = Math.random() < .5 || L === 0;
      return askN ? { ctx: `A luz viaja a ${f(v)} × 10⁸ m/s num meio. Índice de refração?`, q: '', a: n, h: `n = c/v = 3 ÷ ${f(v)} = ${f(n)}` }
        : { ctx: `Meio de índice de refração ${f(n)}. Velocidade da luz nele (× 10⁸ m/s)?`, q: '', a: v, u: '× 10⁸ m/s', h: `v = c/n = 3 ÷ ${f(n)} = ${f(v)}` }; },
    L => { if (L < 2) return null; const [n1, s1, n2, s2] = pick([[1, 0.5, 1.25, 0.4], [1, 0.6, 1.2, 0.5], [1, 0.8, 1.6, 0.5], [1.5, 0.4, 1.2, 0.5], [1, 0.6, 1.5, 0.4]]);
      return { ctx: `Luz passa de n = ${f(n1)} para n = ${f(n2)}, com sen θ₁ = ${f(s1)}. sen θ₂?`, q: '', a: s2, h: `Snell: ${f(n1)} × ${f(s1)} = ${f(n2)} × sen θ₂ → ${f(s2)}` }; },
    L => { if (L < 2) return null; const [n, ang] = pick([[2, '30°'], ['√2', '45°'], ['2/√3', '60°']]);
      return mc({ ctx: `Ângulo limite para a luz saindo de um meio de índice ${n} para o ar`, ok: ang, no: ['30°', '45°', '60°', '90°'].filter(x => x !== ang), h: `sen L = 1/n` }); },
    L => { const [ctx, ok, no, h] = pick([
        ['A miopia é corrigida com lente:', 'divergente', ['convergente', 'cilíndrica', 'bifocal sempre'], 'o míope foca antes da retina'],
        ['A hipermetropia é corrigida com lente:', 'convergente', ['divergente', 'cilíndrica', 'plana'], 'o hipermetrope foca depois da retina'],
        ['O astigmatismo é corrigido com lente:', 'cilíndrica', ['esférica convergente', 'esférica divergente', 'prismática'], 'a córnea tem curvaturas diferentes por eixo'],
        ['Retrovisores de moto usam espelho convexo porque a imagem é:', 'virtual, menor e com campo visual maior', ['real e maior', 'invertida', 'virtual e maior'], 'convexo sempre dá imagem virtual, direita e menor'],
        ['Uma lupa é uma lente:', 'convergente com o objeto antes do foco', ['divergente', 'convergente com o objeto além do foco', 'plana'], 'objeto entre foco e lente → imagem virtual ampliada'],
        ['Num prisma, a cor que mais desvia é o:', 'violeta', ['vermelho', 'verde', 'amarelo'], 'violeta tem o maior índice de refração'],
        ['Reflexão total só ocorre quando a luz vai:', 'do meio mais refringente para o menos refringente', ['do ar para a água', 'em qualquer sentido', 'do menos para o mais refringente'], 'e com ângulo maior que o limite (fibra óptica)'],
        ['Ao entrar na água, vinda do ar, a luz:', 'diminui a velocidade e se aproxima da normal', ['acelera e se afasta da normal', 'não muda de direção', 'muda de frequência'], 'n maior → v menor, raio aproxima da normal'],
        ['A imagem que se forma na retina é:', 'real e invertida', ['virtual e direita', 'real e direita', 'virtual e invertida'], 'o cristalino é convergente; o cérebro desinverte']]);
      return mc({ ctx, ok, no, h }); },
  ]);

  topic('f_ele', 'fis', 'Eletrostática e capacitores', [
    L => { const [txt, v, h] = pick([['Dobrando a distância entre duas cargas, a força elétrica fica multiplicada por:', 0.25, '1/d²'], ['Dobrando as duas cargas e mantendo a distância, a força fica multiplicada por:', 4, 'F ∝ q₁q₂'], ['Reduzindo a distância à metade, a força fica multiplicada por:', 4, '1/(1/2)²'], ['Triplicando uma carga e dobrando a distância, a força fica multiplicada por:', 0.75, '3/4']]);
      return { ctx: txt, q: '', a: v, h }; },
    L => { const q1 = ri(-4, 8), q2 = ri(-4, 8); if ((q1 + q2) % 2) return null; return { ctx: `Esferas idênticas com ${q1} µC e ${q2} µC se tocam e se separam. Carga final de cada uma?`, q: '', a: (q1 + q2) / 2, u: 'µC', h: `média: (${q1} + ${q2}) ÷ 2 = ${(q1 + q2) / 2}` }; },
    L => { const q = pick([1, 2, 4, 5]), E = pick([100, 200, 500, 1000, 2000]), askF = Math.random() < .5;
      return askF ? { ctx: `Carga de ${q} µC num campo de ${f(E)} N/C. Força (em mN)?`, q: '', a: rd(q * E / 1000), u: 'mN', h: `F = qE = ${q} × 10⁻⁶ × ${f(E)} = ${f(rd(q * E / 1000))} × 10⁻³ N` }
        : { ctx: `Força de ${f(rd(q * E / 1000))} mN sobre ${q} µC. Campo elétrico?`, q: '', a: E, u: 'N/C', h: `E = F/q = ${f(E)}` }; },
    L => { if (!L) return null; const E = pick([100, 200, 500, 1000]), d = pick([0.01, 0.02, 0.05, 0.1, 0.2]); return { ctx: `Campo uniforme de ${E} V/m. ddp entre pontos a ${f(d * 100)} cm na direção do campo?`, q: '', a: rd(E * d), u: 'V', h: `U = E·d = ${f(rd(E * d))}` }; },
    L => { if (!L) return null; const q = pick([2, 3, 5, 10]), U = pick([10, 20, 50, 100, 200]); return { ctx: `Trabalho da força elétrica ao levar ${q} µC por uma ddp de ${U} V (em µJ)`, q: '', a: q * U, u: 'µJ', h: `W = qU = ${q * U} µJ` }; },
    L => { const C = pick([2, 5, 10, 20, 100]), U = pick([3, 5, 10, 12, 20]), k = L ? pick(['Q', 'E']) : 'Q';
      return k === 'Q' ? { ctx: `Capacitor de ${C} µF sob ${U} V. Carga?`, q: '', a: C * U, u: 'µC', h: `Q = CU = ${C * U}` } : { ctx: `Capacitor de ${C} µF sob ${U} V. Energia armazenada (µJ)?`, q: '', a: C * U * U / 2, u: 'µJ', h: `CU²/2 = ${C} × ${U * U} ÷ 2 = ${C * U * U / 2}` }; },
    L => { if (!L) return null; const [a, b] = pick(PAIRS), ser = Math.random() < .5;
      return ser ? { ctx: `Capacitores de ${a} µF e ${b} µF em série. Capacitância equivalente?`, q: '', a: a * b / (a + b), u: 'µF', h: `série de capacitores: produto/soma = ${a * b}/${a + b} = ${a * b / (a + b)}` }
        : { ctx: `Capacitores de ${a} µF e ${b} µF em paralelo. Equivalente?`, q: '', a: a + b, u: 'µF', h: 'em paralelo, capacitâncias se somam' }; },
    L => { if (L < 2) return null; const [q1, q2, d, F] = pick([[1, 1, 0.3, 0.1], [2, 3, 0.3, 0.6], [1, 4, 0.2, 0.9], [3, 3, 0.3, 0.9], [2, 2, 0.1, 3.6], [1, 1, 0.1, 0.9]]);
      return { ctx: `Cargas de ${q1} µC e ${q2} µC a ${f(d)} m (k = 9 × 10⁹). Força?`, q: '', a: F, u: 'N', h: `kq₁q₂/d² = 9 × 10⁹ × ${q1 * q2} × 10⁻¹² ÷ ${f(rd(d * d))} = ${f(F)}` }; },
    L => { const [ctx, ok, no, h] = pick([
        ['O campo elétrico no interior de um condutor em equilíbrio eletrostático é:', 'nulo', ['máximo', 'igual ao da superfície', 'radial para fora'], 'as cargas ficam na superfície'],
        ['Ao eletrizar por atrito dois materiais diferentes, eles ficam com cargas:', 'de sinais opostos', ['de mesmo sinal', 'nulas', 'só um fica carregado'], 'um perde e o outro ganha elétrons'],
        ['Um corpo neutro é atraído por um bastão carregado por causa da:', 'indução (polarização) de cargas', ['carga líquida do corpo', 'gravidade', 'corrente elétrica'], 'cargas opostas ficam mais perto'],
        ['Linhas de campo elétrico:', 'saem das cargas positivas e chegam às negativas', ['saem das negativas', 'formam sempre círculos', 'nunca começam em cargas'], 'convenção de sentido do campo'],
        ['Carga elementar: um corpo pode ter carga de:', '3,2 × 10⁻¹⁹ C', ['2,4 × 10⁻¹⁹ C', '1,0 × 10⁻¹⁹ C', '0,8 × 10⁻¹⁹ C'], 'só múltiplos inteiros de 1,6 × 10⁻¹⁹ C']]);
      return mc({ ctx, ok, no, h }); },
  ]);

  topic('f_cir', 'fis', 'Circuitos elétricos', [
    L => { const R = pick([2, 4, 5, 10, 20, 50, 100]), i = pick([0.5, 1, 2, 3, 4, 5]), k = pick(['U', 'i', 'R']);
      if (k === 'U') return { ctx: `Resistor de ${R} Ω com corrente ${f(i)} A. Tensão?`, q: '', a: rd(R * i), u: 'V', h: `U = Ri = ${f(rd(R * i))}` };
      if (k === 'i') return { ctx: `Resistor de ${R} Ω sob ${f(rd(R * i))} V. Corrente?`, q: '', a: i, u: 'A', h: `i = U/R = ${f(i)}` };
      return { ctx: `Tensão de ${f(rd(R * i))} V gera ${f(i)} A. Resistência?`, q: '', a: R, u: 'Ω', h: `R = U/i = ${R}` }; },
    L => { const U = pick([6, 12, 110, 127, 220]), i = pick([0.5, 1, 2, 5, 10, 20]), k = L ? pick(['Ui', 'U2R', 'Ri2']) : 'Ui';
      if (k === 'Ui') return { ctx: `Aparelho em ${U} V com ${f(i)} A. Potência?`, q: '', a: rd(U * i), u: 'W', h: `P = Ui = ${f(rd(U * i))}` };
      if (k === 'U2R') { const R = pick([10, 20, 40, 50, 100]), V = pick([10, 20, 100, 200]); return { ctx: `Resistor de ${R} Ω sob ${V} V. Potência?`, q: '', a: rd(V * V / R), u: 'W', h: `P = U²/R = ${f(V * V)} ÷ ${R} = ${f(rd(V * V / R))}` }; }
      const R = pick([2, 5, 10, 20]), I = pick([2, 3, 5, 10]); return { ctx: `Resistor de ${R} Ω com ${I} A. Potência dissipada?`, q: '', a: R * I * I, u: 'W', h: `P = Ri² = ${R} × ${I * I} = ${R * I * I}` }; },
    L => { const [a, b] = pick(PAIRS), k = L === 0 ? pick(['s', 'p']) : pick(['s', 'p', 'n', 'mix']);
      if (k === 's') return { ctx: `Resistores de ${a} Ω e ${b} Ω em série. Equivalente?`, q: '', a: a + b, u: 'Ω', h: 'série: soma' };
      if (k === 'p') return { ctx: `Resistores de ${a} Ω e ${b} Ω em paralelo. Equivalente?`, q: '', a: a * b / (a + b), u: 'Ω', h: `produto/soma = ${a * b}/${a + b} = ${a * b / (a + b)}` };
      if (k === 'n') { const n = ri(2, 6), R = n * ri(1, 10); return { ctx: `${n} resistores iguais de ${R} Ω em paralelo. Equivalente?`, q: '', a: R / n, u: 'Ω', h: `R/n = ${R / n}` }; }
      const c = ri(1, 10); return { ctx: `${c} Ω em série com (${a} Ω em paralelo com ${b} Ω). Equivalente?`, q: '', a: c + a * b / (a + b), u: 'Ω', h: `${c} + ${a * b / (a + b)} = ${c + a * b / (a + b)}` }; },
    L => { if (!L) return null; const P = pick([1000, 2000, 3000, 4000, 5000, 6000]), t = pick([15, 30, 45, 60, 90, 120]), kwh = rd(P / 1000 * t / 60), price = Math.random() < .4;
      return price ? { ctx: `Chuveiro de ${f(P)} W ligado ${t} min. A R$ 0,80 o kWh, custo em reais?`, q: '', a: rd(kwh * 0.8), u: 'R$', h: `${f(P / 1000)} kW × ${f(rd(t / 60))} h = ${f(kwh)} kWh × 0,80 = ${f(rd(kwh * 0.8))}` }
        : { ctx: `Aparelho de ${f(P)} W ligado por ${t} min. Energia em kWh?`, q: '', a: kwh, u: 'kWh', h: `E = P·t = ${f(P / 1000)} kW × ${f(rd(t / 60))} h = ${f(kwh)}` }; },
    L => { if (L < 2) return null; const e = pick([6, 9, 12, 24]), r = pick([0.5, 1, 2]), R = pick([1, 2, 3, 4, 5, 10]); const i = rd(e / (R + r)); if (i * 100 % 1) return null;
      return Math.random() < .5 ? { ctx: `Gerador de ${e} V e resistência interna ${f(r)} Ω ligado a ${R} Ω. Corrente?`, q: '', a: i, u: 'A', h: `i = ε/(R + r) = ${e} ÷ ${f(R + r)} = ${f(i)}` }
        : { ctx: `Gerador de ${e} V e resistência interna ${f(r)} Ω. Corrente de curto-circuito?`, q: '', a: rd(e / r), u: 'A', h: `i<sub>cc</sub> = ε/r = ${f(rd(e / r))}` }; },
    L => { if (!L) return null; const [txt, v, h] = pick([['Um fio tem o comprimento dobrado. A resistência fica multiplicada por:', 2, 'R = ρL/A'], ['Um fio tem a área da seção dobrada. A resistência fica multiplicada por:', 0.5, 'R ∝ 1/A'], ['Um fio tem o diâmetro dobrado. A resistência fica multiplicada por:', 0.25, 'A ∝ d²: área ×4'], ['Comprimento e área dobram. A resistência fica multiplicada por:', 1, '2/2'], ['Um fio é esticado até o dobro do comprimento (mesmo volume). A resistência fica multiplicada por:', 4, 'L ×2 e A ÷2 → ×4']]);
      return { ctx: txt, q: '', a: v, h }; },
    L => { if (!L) return null; const U = pick([12, 24, 60, 120]), [a, b] = pick(PAIRS.filter(([x, y]) => U % x === 0 && U % y === 0)) || [2, 3]; if (U % a || U % b) return null;
      return { ctx: `Resistores de ${a} Ω e ${b} Ω em paralelo, ligados a ${U} V. Corrente total?`, q: '', a: U / a + U / b, u: 'A', h: `${U}/${a} + ${U}/${b} = ${U / a} + ${U / b} = ${U / a + U / b}` }; },
    L => { if (L < 2) return null; const [P, U] = pick([[60, 120], [100, 100], [40, 200], [100, 200], [60, 12], [120, 120]]);
      return Math.random() < .5 ? { ctx: `Lâmpada de ${P} W / ${U} V. Resistência?`, q: '', a: rd(U * U / P), u: 'Ω', h: `R = U²/P = ${f(U * U)} ÷ ${P} = ${f(rd(U * U / P))}` }
        : { ctx: `Lâmpada de ${P} W / ${U} V ligada corretamente. Corrente?`, q: '', a: rd(P / U), u: 'A', h: `i = P/U = ${f(rd(P / U))}` }; },
    L => { const [ctx, ok, no, h] = pick([
        ['Na posição "inverno" o chuveiro esquenta mais porque a resistência:', 'é menor', ['é maior', 'não muda', 'fica em série com outra'], 'U fixa: P = U²/R'],
        ['O amperímetro ideal é ligado em ___ e tem resistência ___:', 'série; nula', ['paralelo; nula', 'série; infinita', 'paralelo; infinita'], 'não pode alterar a corrente'],
        ['O voltímetro ideal é ligado em ___ e tem resistência ___:', 'paralelo; infinita', ['série; nula', 'paralelo; nula', 'série; infinita'], 'não pode desviar corrente'],
        ['Num nó, três correntes entram (2 A, 3 A e 1 A) e uma sai. Ela vale:', '6 A', ['2 A', '4 A', '1 A'], '1ª lei de Kirchhoff: o que entra sai'],
        ['Em casa, os aparelhos são ligados em paralelo para:', 'todos receberem a mesma tensão', ['economizar energia', 'somar as resistências', 'dividir a tensão'], 'e funcionarem independentes'],
        ['Resistores em série sempre têm em comum a mesma:', 'corrente', ['tensão', 'potência', 'resistência'], 'em paralelo, a mesma tensão']]);
      return mc({ ctx, ok, no, h }); },
  ]);

  topic('f_mag', 'fis', 'Magnetismo e indução', [
    L => { const B = pick([0.1, 0.2, 0.5, 1, 2]), i = pick([1, 2, 4, 5, 10]), Lw = pick([0.1, 0.2, 0.5, 1]);
      return { ctx: `Fio de ${f(Lw)} m com ${i} A, perpendicular a B = ${f(B)} T. Força magnética?`, q: '', a: rd(B * i * Lw), u: 'N', h: `F = BiL = ${f(rd(B * i * Lw))}` }; },
    L => { const N1 = pick([100, 200, 500, 1000, 2000]), N2 = pick([50, 100, 200, 400, 1000, 4000]), U1 = pick([110, 120, 220, 12, 240]), U2 = rd(U1 * N2 / N1); if (U2 * 10 % 1) return null;
      return { ctx: `Transformador: ${N1} espiras no primário (${U1} V) e ${N2} no secundário. Tensão no secundário?`, q: '', a: U2, u: 'V', h: `U₂/U₁ = N₂/N₁ → ${U1} × ${N2}/${N1} = ${f(U2)}` }; },
    L => { if (!L) return null; const [txt, v, h] = pick([['A velocidade de uma partícula num campo magnético dobra. O raio da trajetória fica multiplicado por:', 2, 'r = mv/qB'], ['O campo magnético dobra. O raio da trajetória fica multiplicado por:', 0.5, 'r ∝ 1/B'], ['A corrente num fio longo dobra. O campo a uma mesma distância fica multiplicado por:', 2, 'B ∝ i/d'], ['A distância a um fio longo dobra. O campo fica multiplicado por:', 0.5, 'B ∝ 1/d'], ['A carga da partícula dobra (mesma v, B). A força magnética fica multiplicada por:', 2, 'F = qvB']]);
      return { ctx: txt, q: '', a: v, h }; },
    L => { if (!L) return null; const B = pick([0.1, 0.2, 0.5, 1, 2]), A = pick([0.01, 0.02, 0.05, 0.1, 0.5]), [ang, c] = pick([[0, 1], [60, 0.5], [90, 0]]);
      return { ctx: `B = ${f(B)} T, espira de ${f(A)} m², normal a ${ang}° de B. Fluxo magnético?`, q: '', a: rd(B * A * c), u: 'Wb', h: `Φ = BA·cos θ = ${f(rd(B * A * c))}` }; },
    L => { if (!L) return null; const dPhi = pick([0.1, 0.2, 0.5, 1, 2]), dt = pick([0.1, 0.2, 0.5, 1]), N = L === 2 ? pick([10, 50, 100]) : 1;
      return { ctx: `${N > 1 ? `Bobina de ${N} espiras: ` : ''}o fluxo varia ${f(dPhi)} Wb em ${f(dt)} s. fem induzida (módulo)?`, q: '', a: rd(N * dPhi / dt), u: 'V', h: `ε = ${N > 1 ? 'N·' : ''}ΔΦ/Δt = ${f(rd(N * dPhi / dt))}` }; },
    L => { if (L < 2) return null; const B = pick([0.2, 0.5, 1, 2]), Lb = pick([0.1, 0.2, 0.5, 1]), v = pick([2, 4, 5, 10]);
      return { ctx: `Barra de ${f(Lb)} m se move a ${v} m/s perpendicular a B = ${f(B)} T. fem nas pontas?`, q: '', a: rd(B * Lb * v), u: 'V', h: `ε = BLv = ${f(rd(B * Lb * v))}` }; },
    L => { if (L < 2) return null; const [i, d, m] = pick([[10, 0.1, 2], [5, 0.1, 1], [20, 0.2, 2], [1, 0.01, 2], [50, 0.5, 2]]);
      return { ctx: `Fio longo com ${i} A. Campo a ${f(d)} m, em unidades de 10⁻⁵ T (μ₀ = 4π × 10⁻⁷)?`, q: '', a: m, u: '× 10⁻⁵ T', h: `B = μ₀i/2πd = 2 × 10⁻⁷ × ${i} ÷ ${f(d)} = ${m} × 10⁻⁵` }; },
    L => { const [ctx, ok, no, h] = pick([
        ['Uma carga em repouso num campo magnético sofre força:', 'nula', ['máxima', 'perpendicular ao campo', 'paralela ao campo'], 'F = qvB sen θ, com v = 0'],
        ['Uma carga com velocidade paralela ao campo magnético sofre força:', 'nula', ['máxima', 'centrípeta', 'no sentido de v'], 'sen 0° = 0'],
        ['A corrente induzida numa espira sempre se opõe:', 'à variação do fluxo que a produziu', ['ao campo magnético', 'à corrente da fonte', 'ao movimento da Terra'], 'lei de Lenz'],
        ['Dois fios paralelos com correntes no mesmo sentido:', 'se atraem', ['se repelem', 'não interagem', 'giram'], 'sentidos opostos se repelem'],
        ['Ao quebrar um ímã ao meio, obtém-se:', 'dois ímãs, cada um com norte e sul', ['um polo norte e um polo sul separados', 'dois pedaços sem magnetismo', 'dois polos norte'], 'não existe monopolo magnético'],
        ['Um transformador funciona com corrente:', 'alternada', ['contínua', 'qualquer', 'nula'], 'precisa de fluxo variável'],
        ['Fora do ímã, as linhas de campo magnético vão:', 'do norte para o sul', ['do sul para o norte', 'do centro para fora', 'em linha reta sempre'], 'dentro do ímã, do sul para o norte'],
        ['A força magnética sobre uma carga em movimento:', 'não realiza trabalho', ['aumenta sua energia cinética', 'é paralela à velocidade', 'freia sempre a carga'], 'é sempre perpendicular a v: só muda a direção']]);
      return mc({ ctx, ok, no, h }); },
  ]);
