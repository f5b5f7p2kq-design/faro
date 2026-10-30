  // ================== CONTAS QUE MAIS APARECEM NAS PROVAS DA UNICAMP (2021 a 2026) ==================
  // cada variação entra no fim da lista do tópico, com [rating no nível 0, quanto sobe por nível].
  // O rating parte do índice de acerto da questão da prova que usa a mesma conta, descontado por aqui ser um passo só.
  // tk é o título da dica que explica a conta: ela aparece primeiro quando a pessoa abre as dicas.
  const addV = (key, [r, s], tk, fn) => {
    const g = L => { const q = fn(L); if (q) { q.q = q.q || ''; q.tk = tk; } return q; };
    if (EXTRA[key] && !GEN[key].vs) { EXTRA[key].push(g); const v = 'x' + (EXTRA[key].length - 1); QB[key][v] = r; QB[key]['s' + v] = s; return; }
    const vs = GEN[key].vs; vs.push(g); QB[key][vs.length - 1] = r; QB[key]['s' + (vs.length - 1)] = s;
  };
  const nm = x => x < 0 ? '−' + f(-x) : f(x);
  const nice = (x, c = 1) => Math.abs(x * 10 ** c - Math.round(x * 10 ** c)) < 1e-9;

  // ---------- física ----------
  // carga em A·h e mAh, energia em kWh (2024: corrente × tempo em horas, 43% de acerto)
  addV('f_un', [900, 200], 'Carga e energia de bateria', L => {
    if (!L) { const i = ri(1, 5), t = ri(1, 3), Q = i * t * 3600;
      return { ctx: `Uma corrente de ${i} A passa durante ${t} h. Carga que passou?`, a: Q, u: 'C', h: `Q = i·Δt com o tempo em segundos: ${i} A × ${f(t * 3600)} s = ${f(Q)} C` }; }
    if (L === 1) { const m = pick([500, 1000, 1500, 2000, 2500, 3000, 4000, 5000]);
      return { ctx: `Uma bateria de ${f(m)} mAh guarda quanta carga?`, a: m * 3.6, u: 'C', h: `${f(m)} mAh = ${f(m / 1000)} A·h = ${f(m / 1000)} A × 3.600 s = ${f(m * 3.6)} C (atalho: mAh × 3,6)` }; }
    const k = pick([0.5, 1, 2, 5, 10, 25]);
    return { ctx: `${f(k)} kWh em megajoules`, a: rd(k * 3.6), u: 'MJ', h: `1 kWh = 1.000 W × 3.600 s = 3,6 MJ → ${f(k)} × 3,6 = ${f(rd(k * 3.6))}` }; });
  // mudança de escala: área com L², peso com L³ (questões de semelhança e de seres gigantes)
  addV('f_un', [800, 250], 'Escala: L, L² e L³', L => { const k = pick([2, 3, 4, 10]);
    const c = `Um animal tem o mesmo formato de outro, mas todas as medidas ${k} vezes maiores.`;
    if (!L) return { ctx: `${c} A área da sola das patas fica multiplicada por:`, a: k * k, h: `área ∝ L² → ${k}² = ${k * k}` };
    if (L === 1) return { ctx: `${c} O peso fica multiplicado por:`, a: k ** 3, h: `peso ∝ volume ∝ L³ → ${k}³ = ${f(k ** 3)}` };
    return { ctx: `${c} A pressão nas patas (peso ÷ área de apoio) fica multiplicada por:`, a: k, h: `L³ ÷ L² = L → ${f(k ** 3)} ÷ ${k * k} = ${k}` }; });

  // velocidade relativa: avião com vento, barco com correnteza (2025, 62%)
  addV('f_cin', [700, 250], 'Vento e correnteza', L => {
    if (L < 2) { const [v, w] = pick([[600, 100], [800, 100], [500, 50], [900, 150], [700, 100], [400, 80], [750, 50]]), fav = Math.random() < .5, vs = fav ? v + w : v - w;
      const c = `Avião a ${v} km/h em relação ao ar, com vento ${fav ? 'a favor' : 'contra'} de ${w} km/h.`, op = `${v} ${fav ? '+' : '−'} ${w} = ${vs}`;
      if (!L) return { ctx: `${c} Velocidade em relação ao solo?`, a: vs, u: 'km/h', h: `mesma direção: ${op}` };
      const t = pick([2, 3, 4]);
      return { ctx: `${c} Tempo para voar ${f(vs * t)} km?`, a: t, u: 'h', h: `em relação ao solo: ${op} km/h; ${f(vs * t)} ÷ ${vs} = ${t}` }; }
    const [boat, a, b] = pick([[1, 4, 3], [1, 12, 5], [1, 8, 6], [0, 400, 300], [0, 240, 70], [0, 800, 600]]), c = Math.round(Math.sqrt(a * a + b * b));
    return { ctx: boat ? `Um barco vai a ${a} km/h em relação à água, apontado perpendicular à margem, e a correnteza tem ${b} km/h. Velocidade em relação à margem?`
      : `Um avião voa para o norte a ${a} km/h em relação ao ar, e o vento sopra para o leste a ${b} km/h. Velocidade em relação ao solo?`,
      a: c, u: 'km/h', h: `velocidades perpendiculares: √(${a}² + ${b}²) = √${f(a * a + b * b)} = ${f(c)}` }; });
  // voltas por segundo, velocidade da borda e polias (2023, pula-corda, 66%)
  addV('f_cin', [650, 250], 'Voltas e polias', L => {
    if (!L) { const fr = pick([0.5, 1, 2, 4, 5, 10]), t = pick([2, 4, 10, 20]), n = fr * t;
      return Math.random() < .5 ? { ctx: `Uma roda dá ${n} voltas em ${t} s. Frequência?`, a: fr, u: 'Hz', h: `f = voltas ÷ tempo = ${n} ÷ ${t} = ${f(fr)}` }
        : { ctx: `Uma roda dá ${n} voltas em ${t} s. Período?`, a: rd(t / n), u: 's', h: `T = tempo ÷ voltas = ${t} ÷ ${n} = ${f(rd(t / n))}` }; }
    if (L === 1) { const [who, Rs, fs] = pick([['A ponta de uma corda de pular', [0.5, 1], [1, 2]], ['Um ponto da borda de uma roda', [0.3, 0.5], [2, 3, 4, 5]], ['Uma criança num carrossel', [2, 3, 4], [0.25, 0.5]]]), R = pick(Rs), fr = pick(fs), v = rd(6 * R * fr);
      return { ctx: `${who} gira em círculo de raio ${f(R)} m, dando ${f(fr)} volta${fr > 1 ? 's' : ''} por segundo. Velocidade? (π = 3)`, a: v, u: 'm/s', h: `v = 2πR·f = 2 × 3 × ${f(R)} × ${f(fr)} = ${f(v)}` }; }
    const [r1, r2] = pick([[30, 10], [45, 15], [40, 10], [48, 16], [36, 12], [10, 20], [5, 15]]), f1 = pick([1, 2, 3]), f2 = rd(f1 * r1 / r2);
    if (!nice(f2)) return null;
    return r1 > r2 && Math.random() < .5
      ? { ctx: `Bicicleta: coroa de ${r1} dentes e catraca de ${r2} dentes. Pedalando a ${f1} volta${f1 > 1 ? 's' : ''} por segundo, quantas voltas por segundo dá a roda?`, a: f2, u: 'Hz', h: `a corrente passa o mesmo número de dentes nas duas: ${r1} × ${f1} = ${r2} × f → f = ${f(f2)}` }
      : { ctx: `Uma polia de raio ${r1} cm gira a ${f1} Hz e move, por uma correia, outra de raio ${r2} cm. Frequência da segunda?`, a: f2, u: 'Hz', h: `mesma velocidade na borda: R₁f₁ = R₂f₂ → ${r1} × ${f1} ÷ ${r2} = ${f(f2)}` }; });
  // aceleração a partir de distância e tempo (2023, balão subindo, 54%)
  addV('f_cin', [850, 200], 'Achar a aceleração', L => { if (!L) return null;
    const a = pick([1, 2, 3, 4, 5, 6, 8, 10]), t = pick([2, 3, 4, 5, 10]), s = a * t * t / 2, who = pick(a <= 2 ? ['Um balão', 'Um elevador', 'Um trem'] : ['Um carro', 'Uma moto']);
    const c = `${who} parte do repouso e percorre ${f(s)} m em ${t} s, com aceleração constante.`;
    if (L === 1 || Math.random() < .5) return { ctx: `${c} Aceleração?`, a, u: 'm/s²', h: `s = at²/2 → a = 2s/t² = ${f(2 * s)} ÷ ${t * t} = ${a}` };
    return { ctx: `${c} Velocidade ao final?`, a: a * t, u: 'm/s', h: `do repouso, v = 2s/t (o dobro da média) = ${f(2 * s)} ÷ ${t} = ${a * t}` }; });

  // velocidade terminal: resistência do ar igual ao peso (2026, Marte)
  addV('f_din', [800, 250], 'Velocidade terminal', L => { const m = pick([60, 70, 80, 90, 100]), P = 10 * m;
    if (!L) return { ctx: `Um paraquedista de ${m} kg (com o equipamento) desce com velocidade constante. Força de resistência do ar?`, a: P, u: 'N', h: `velocidade constante → resultante nula → resistência = peso = ${f(P)} N` };
    if (L === 1) { const b = pick([10, 20, 25, 40, 50, 100]); if (P % b) return null;
      return { ctx: `A resistência do ar sobre um corpo de ${m} kg vale F = ${b}·v (SI). Velocidade terminal?`, a: P / b, u: 'm/s', h: `na terminal, ${b}·v = mg = ${P} → v = ${P / b}` }; }
    const v = pick([5, 10, 20, 40, 50]), b = rd(P / (v * v)); if (!nice(b, 2)) return null;
    return { ctx: `A resistência do ar sobre um corpo de ${m} kg vale F = ${f(b)}·v² (SI). Velocidade terminal?`, a: v, u: 'm/s', h: `na terminal, ${f(b)}·v² = ${P} → v² = ${f(v * v)} → v = ${v}` }; });
  // mola com peso pendurado: kx = mg
  addV('f_din', [600, 250], 'Mola com peso pendurado', L => {
    if (!L) { const x = pick([2, 3, 4, 5]), m1 = pick([1, 2]), m2 = m1 * pick([2, 3, 4, 5]);
      return { ctx: `Uma mola estica ${x} cm com ${m1} kg pendurado${m1 > 1 ? 's' : ''}. Quanto estica com ${m2} kg?`, a: x * m2 / m1, u: 'cm', h: `kx = mg: a elongação é proporcional à massa → ${x} × ${m2 / m1} = ${x * m2 / m1}` }; }
    const k = pick([100, 200, 250, 400, 500, 1000]), m = pick([0.5, 1, 2, 3, 4, 5]), x = rd(1000 * m / k);
    if (L === 1) return { ctx: `Um corpo de ${f(m)} kg está pendurado, parado, numa mola de k = ${k} N/m. Elongação, em cm?`, a: x, u: 'cm', h: `kx = mg → x = ${f(m * 10)} ÷ ${k} = ${f(rd(m * 10 / k))} m = ${f(x)} cm` };
    return { ctx: `Uma mola de k = ${k} N/m estica ${f(x)} cm com um corpo pendurado, parado. Massa do corpo?`, a: m, u: 'kg', h: `kx = mg → m = ${k} × ${f(rd(x / 100))} ÷ 10 = ${f(m)}` }; });
  // coeficiente de atrito a partir da força
  addV('f_din', [850, 200], 'Atrito', L => { const m = pick([2, 4, 5, 10, 20, 25]), mu = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]), N = 10 * m, Fa = rd(mu * N);
    if (L < 2) { const st = Math.random() < .5;
      return { ctx: st ? `Um bloco de ${m} kg num piso horizontal só começa a deslizar quando a força horizontal passa de ${f(Fa)} N. Coeficiente de atrito estático?`
        : `Um bloco de ${m} kg é arrastado num piso horizontal, com velocidade constante, por uma força horizontal de ${f(Fa)} N. Coeficiente de atrito cinético?`,
        a: mu, h: `${st ? 'no limite' : 'velocidade constante'}: F = μN → μ = ${f(Fa)} ÷ ${N} = ${f(mu)}` }; }
    const a = pick([1, 2, 3, 4]), F = rd(Fa + m * a);
    return { ctx: `Um bloco de ${m} kg num piso horizontal é puxado por uma força horizontal de ${f(F)} N e acelera a ${a} m/s². Coeficiente de atrito cinético?`, a: mu, h: `F − μN = m·a → μ = (${f(F)} − ${m * a}) ÷ ${N} = ${f(mu)}` }; });

  // teorema da energia cinética (2024, 40%)
  addV('f_en', [750, 300], 'Teorema da energia cinética', L => {
    if (!L) { const m = pick([1, 2, 4, 5, 10]), v = pick([2, 4, 5, 6, 10]);
      return { ctx: `Um corpo de ${m} kg parte do repouso e chega a ${v} m/s. Trabalho da força resultante?`, a: m * v * v / 2, u: 'J', h: `W = ΔEc = ${m} × ${v * v} ÷ 2 = ${f(m * v * v / 2)}` }; }
    const m = pick([500, 800, 1000, 1200, 1500, 2000]);
    if (L === 1) { const [v0, v] = pick([[10, 20], [20, 30], [10, 30], [0, 20], [30, 10], [20, 10], [5, 15]]), W = rd(m * (v * v - v0 * v0) / 2000);
      return { ctx: `Um carro de ${f(m)} kg vai de ${v0} m/s a ${v} m/s. Trabalho da força resultante, em kJ (negativo se freou)?`, a: W, u: 'kJ', h: `W = m(v² − v₀²)/2 = ${f(m / 2)} × (${v * v} − ${v0 * v0}) = ${nm(W * 1000)} J` }; }
    const v = pick([10, 20, 30]), d = pick([20, 25, 40, 50, 100]), Fm = m * v * v / 2 / d;
    if (!Number.isInteger(Fm)) return null;
    return { ctx: `Um carro de ${f(m)} kg a ${v} m/s freia até parar em ${d} m. Força média de frenagem?`, a: Fm, u: 'N', h: `F·d = mv²/2 → F = ${f(m * v * v / 2)} ÷ ${d} = ${f(Fm)}` }; });
  // energia de bateria e alimento convertida em altura (mgh)
  addV('f_en', [700, 250], 'Energia em altura', L => { const m = pick([50, 60, 72, 80]);
    if (L < 2) { const h = pick([2, 5, 10, 20, 50]), E = m * 10 * h;
      return L ? { ctx: `Com ${f(E / 1000)} kJ, a que altura daria para erguer uma pessoa de ${m} kg?`, a: h, u: 'm', h: `mgh = E → h = ${f(E)} ÷ ${m * 10} = ${h}` }
        : { ctx: `Energia para erguer uma pessoa de ${m} kg a ${h} m de altura?`, a: E, u: 'J', h: `mgh = ${m} × 10 × ${h} = ${f(E)}` }; }
    const wh = pick([1, 2, 5, 10, 20]), h = rd(wh * 3600 / (m * 10));
    return { ctx: `A energia de uma bateria de ${wh} Wh ergueria uma pessoa de ${m} kg a que altura?`, a: h, u: 'm', h: `${wh} Wh = ${wh} × 3.600 J = ${f(wh * 3600)} J; h = ${f(wh * 3600)} ÷ ${m * 10} = ${f(h)}` }; });
  // potência de hidrelétrica
  addV('f_en', [900, 250], 'Usina e painel solar', L => { const Z = pick([1, 2, 5, 10, 20, 50, 100]), h = pick([10, 20, 50, 100]), P = Z * h / 100;
    if (!L) return { ctx: `Numa usina, caem ${Z} m³ de água por segundo de uma altura de ${h} m. Potência máxima, em MW? (água: 1.000 kg/m³)`, a: P, u: 'MW', h: `P = m·g·h por segundo = ${f(Z * 1000)} × 10 × ${h} = ${f(Z * h * 10000)} W = ${f(P)} MW` };
    if (L === 1) { const e = pick([80, 90]), Pe = rd(P * e / 100);
      return { ctx: `Numa usina com rendimento de ${e}%, caem ${Z} m³ de água por segundo de uma altura de ${h} m. Potência elétrica, em MW?`, a: Pe, u: 'MW', h: `${f(Z * 1000)} × 10 × ${h} = ${f(P)} MW; × ${e}% = ${f(Pe)} MW` }; }
    return { ctx: `Uma usina de ${f(P)} MW aproveita uma queda de ${h} m. Vazão mínima de água, em m³/s?`, a: Z, u: 'm³/s', h: `P = ρ·Z·g·h → Z = ${f(P * 1e6)} ÷ (1.000 × 10 × ${h}) = ${Z}` }; });
  // painel solar: irradiância × área × eficiência (2025, 60%)
  addV('f_en', [800, 200], 'Usina e painel solar', L => { const A = pick([1, 1.5, 2, 4, 5, 10]), e = pick([10, 15, 20, 25]), P = rd(10 * A * e);
    if (!L) return { ctx: `Um painel solar de ${f(A)} m² recebe 1.000 W/m² e tem eficiência de ${e}%. Potência elétrica?`, a: P, u: 'W', h: `1.000 × ${f(A)} × ${e}% = ${f(1000 * A)} × ${f(e / 100)} = ${f(P)}` };
    if (L === 1) return { ctx: `Um painel de ${f(A)} m², sob 1.000 W/m², entrega ${f(P)} W. Eficiência, em %?`, a: e, u: '%', h: `${f(P)} ÷ ${f(1000 * A)} = ${f(e / 100)} = ${e}%` };
    const Pt = pick([1000, 1500, 2000, 3000, 5000]), Ar = rd(Pt / (10 * e)); if (!nice(Ar)) return null;
    return { ctx: `Quantos m² de painéis com eficiência de ${e}%, sob 1.000 W/m², para gerar ${f(Pt)} W?`, a: Ar, u: 'm²', h: `cada m² dá 1.000 × ${e}% = ${10 * e} W → ${f(Pt)} ÷ ${10 * e} = ${f(Ar)}` }; });

  // pressão em área pequena, com conversão de cm² e mm² (2021, agulha do toca-discos, 40%)
  addV('f_hid', [900, 250], 'Pressão em área pequena', L => {
    if (!L) { const F = pick([1, 2, 5, 10, 20]), A = pick([1, 2, 5, 10]), p = F / A * 10;
      return { ctx: `Força de ${F} N sobre ${A} cm². Pressão, em kPa?`, a: p, u: 'kPa', h: `1 cm² = 10⁻⁴ m² → p = ${F} ÷ (${A} × 10⁻⁴) = ${f(p * 1000)} Pa = ${f(p)} kPa` }; }
    if (L === 1) { const m = pick([50, 60, 70, 80]), A = pick([1, 2, 4]);
      return { ctx: `Uma pessoa de ${m} kg se apoia num só salto fino, de ${A} cm². Pressão no chão, em atm? (1 atm ≈ 10⁵ Pa)`, a: m / A, u: 'atm', h: `p = ${m * 10} N ÷ (${A} × 10⁻⁴ m²) = ${f(m * 1e5 / A)} Pa = ${f(m / A)} atm` }; }
    const [F, A] = pick([[0.1, 0.01], [0.05, 0.004], [0.02, 0.001], [0.2, 0.01], [0.03, 0.002], [0.5, 0.02]]), atm = rd(10 * F / A);
    return { ctx: `A ponta de uma agulha aperta o disco com ${f(F)} N numa área de ${f(A)} mm². Pressão, em atm? (1 atm ≈ 10⁵ Pa)`, a: atm, u: 'atm', h: `1 mm² = 10⁻⁶ m² → p = ${f(F)} ÷ (${f(A)} × 10⁻⁶) = ${f(rd(F / A))} × 10⁶ Pa = ${f(atm)} atm` }; });
  // vazão: volume por tempo e área × velocidade
  addV('f_hid', [650, 300], 'Vazão', L => {
    if (!L) { const Z = pick([0.1, 0.2, 0.25, 0.5, 2]), t = pick([20, 40, 60, 100, 120]), V = rd(Z * t);
      return { ctx: `Uma torneira com vazão de ${f(Z)} L/s enche ${f(V)} L em quanto tempo?`, a: t, u: 's', h: `Δt = V ÷ Z = ${f(V)} ÷ ${f(Z)} = ${t}` }; }
    if (L === 1) { const A = pick([2, 4, 5, 10, 20, 50]), v = pick([0.5, 1, 2, 3, 4]), Z = rd(A * v / 10);
      return { ctx: `Um cano de seção ${A} cm² leva água a ${f(v)} m/s. Vazão, em L/s?`, a: Z, u: 'L/s', h: `Z = A·v = ${A} × 10⁻⁴ m² × ${f(v)} m/s = ${f(rd(A * v))} × 10⁻⁴ m³/s = ${f(Z)} L/s` }; }
    const k = pick([2, 3, 4, 10]);
    return { ctx: `Num cano que afina, o diâmetro fica ${k} vezes menor. A velocidade da água fica multiplicada por:`, a: k * k, h: `a vazão A·v não muda; a área vai com d², fica ${k * k} vezes menor → v × ${k * k}` }; });

  // calor latente + sensível (2021, calorimetria, 46%)
  addV('f_term', [950, 200], 'Gelo até água morna', L => { if (!L) return null;
    const m = pick([10, 20, 50, 100, 200]), T = pick([10, 20, 30, 50]);
    if (L === 1) return { ctx: `Calor para transformar ${m} g de gelo a 0 °C em água a ${T} °C? (L = 80 cal/g; c = 1 cal/g·°C)`, a: m * (80 + T), u: 'cal', h: `derreter + aquecer: ${m} × 80 + ${m} × ${T} = ${m} × ${80 + T} = ${f(m * (80 + T))}` };
    const Tg = pick([10, 20, 40]);
    return { ctx: `Calor para levar ${m} g de gelo a −${Tg} °C até água a ${T} °C? (c do gelo = 0,5 cal/g·°C; L = 80 cal/g; c da água = 1 cal/g·°C)`, a: m * (Tg / 2 + 80 + T), u: 'cal', h: `aquecer o gelo + derreter + aquecer a água: ${m} × (${f(Tg / 2)} + 80 + ${T}) = ${f(m * (Tg / 2 + 80 + T))}` }; });

  // luz: comprimento de onda em nm e frequência (2021, CD, DVD e Blu-ray, 23%)
  addV('f_ond', [1100, 200], 'Luz: λ e f', L => { const [lam, fr] = pick([[300, 10], [400, 7.5], [500, 6], [600, 5], [750, 4]]);
    if (!L) return { ctx: `Luz de ${lam} nm. Frequência, em unidades de 10¹⁴ Hz? (c = 3 × 10⁸ m/s)`, a: fr, h: `f = c/λ = 3 × 10⁸ ÷ (${lam} × 10⁻⁹) = ${f(fr)} × 10¹⁴ Hz` };
    if (L === 1) return { ctx: `Luz de ${f(fr)} × 10¹⁴ Hz. Comprimento de onda, em nm? (c = 3 × 10⁸ m/s)`, a: lam, u: 'nm', h: `λ = c/f = 3 × 10⁸ ÷ (${f(fr)} × 10¹⁴) = ${lam} × 10⁻⁹ m` };
    const [l1, n] = pick([[600, 1.5], [450, 1.5], [750, 1.5], [500, 1.25], [750, 1.25], [800, 2], [600, 2]]), l2 = rd(l1 / n);
    return { ctx: `Luz de ${l1} nm no ar entra num material de índice de refração ${f(n)}. Comprimento de onda lá dentro, em nm?`, a: l2, u: 'nm', h: `a frequência não muda e a velocidade cai para c/n, então λ também é dividido por n: ${l1} ÷ ${f(n)} = ${f(l2)}` }; });
  // fótons: E = hf e número de fótons (2026, efeito fotoelétrico)
  addV('f_ond', [1000, 250], 'Fótons', L => {
    if (!L) { const fr = pick([2.5, 5, 7.5, 10]);
      return { ctx: `Fóton de ${f(fr)} × 10¹⁴ Hz. Energia, em eV? (use h ≈ 4 × 10⁻¹⁵ eV·s)`, a: rd(0.4 * fr), u: 'eV', h: `E = h·f = 4 × 10⁻¹⁵ × ${f(fr)} × 10¹⁴ = ${f(rd(0.4 * fr))} eV` }; }
    if (L === 1) { const lam = pick([300, 400, 500, 600, 800]), E = rd(1200 / lam);
      return { ctx: `Luz de ${lam} nm. Energia de cada fóton, em eV? (use h ≈ 4 × 10⁻¹⁵ eV·s e c = 3 × 10⁸ m/s)`, a: E, u: 'eV', h: `E = hc/λ, com hc = 1,2 × 10⁻⁶ eV·m = 1.200 eV·nm → 1.200 ÷ ${lam} = ${f(E)}` }; }
    const [P, E] = pick([[1, 2], [2, 4], [3, 2], [4, 2], [6, 4], [8, 4], [1, 4], [5, 2]]), N = rd(P / E * 10);
    return { ctx: `Um laser de ${P} mW emite fótons de ${E} × 10⁻¹⁹ J. Quantos fótons por segundo, em unidades de 10¹⁵?`, a: N, h: `N = P ÷ E = ${P} × 10⁻³ ÷ (${E} × 10⁻¹⁹) = ${f(rd(P / E))} × 10¹⁶ = ${f(N)} × 10¹⁵` }; });
  // período e movimento uniforme juntos: marcas de gotas numa esteira
  addV('f_ond', [850, 150], 'Marcas de gotas', L => { const fr = pick([2, 4, 5, 10]), v = pick([0.2, 0.4, 0.5, 0.8, 1, 2]), d = rd(v / fr * 100);
    if (L < 2 || Math.random() < .5) return { ctx: `Uma torneira pinga ${fr} gotas por segundo sobre uma esteira que anda a ${f(v)} m/s. Distância entre as marcas, em cm?`, a: d, u: 'cm', h: `uma gota a cada 1/${fr} s; nesse tempo a esteira anda ${f(v)} ÷ ${fr} = ${f(rd(v / fr))} m` };
    return { ctx: `Gotas que pingam num ritmo constante deixam marcas a ${f(d)} cm uma da outra numa esteira a ${f(v)} m/s. Quantas gotas por segundo?`, a: fr, u: 'Hz', h: `f = v ÷ distância = ${f(v)} ÷ ${f(rd(d / 100))} = ${fr}` }; });

  // aumento de lentes e projetores (2026, 37%)
  addV('f_opt', [800, 300], 'Aumento da imagem', L => {
    if (!L) { const p = pick([5, 10, 20]), k = pick([2, 3, 4, 5]);
      return { ctx: `Objeto a ${p} cm de uma lente; a imagem real se forma a ${p * k} cm, do outro lado. Aumento (em módulo)?`, a: k, h: `|A| = p′/p = ${p * k} ÷ ${p} = ${k}` }; }
    if (L === 1) { const [o, p, P] = pick([[3, 5, 300], [2, 4, 200], [3.5, 5, 200], [2.4, 6, 300], [1, 2, 400]]), i = rd(o * P / p);
      return { ctx: `Um projetor forma, numa tela a ${f(P / 100)} m da lente, a imagem de um slide de ${f(o)} cm que está a ${p} cm da lente. Tamanho da imagem, em cm?`, a: i, u: 'cm', h: `i/o = p′/p → i = ${f(o)} × ${P} ÷ ${p} = ${f(i)}` }; }
    const [fo, p] = pick([[10, 15], [10, 20], [10, 30], [20, 30], [12, 16], [15, 20], [20, 25], [6, 8]]), pp = fo * p / (p - fo);
    return { ctx: `Lente convergente de f = ${fo} cm, objeto a ${p} cm. Aumento (em módulo)?`, a: rd(pp / p), h: `Gauss: p′ = f·p/(p − f) = ${f(pp)} cm; |A| = p′/p = ${f(rd(pp / p))}` }; });

  // ponto entre dois corpos onde as atrações se anulam (Terra e Lua, 0,9 d)
  addV('f_grav', [1100, 200], 'Onde as atrações se anulam', L => { if (!L) return null;
    if (L === 1) { const [k, d] = pick([[2, 30], [2, 6], [3, 8], [3, 40], [4, 10], [2, 12]]);
      return { ctx: `Duas estrelas estão a ${d} UA uma da outra, e uma tem ${k * k} vezes a massa da outra. A que distância da menor as atrações gravitacionais se anulam?`, a: d / (k + 1), u: 'UA', h: `M/x² = ${k * k}M/(d − x)² → (d − x)/x = √${k * k} = ${k} → x = ${d} ÷ ${k + 1} = ${f(d / (k + 1))}` }; }
    const d = pick([380, 400]);
    return Math.random() < .5
      ? { ctx: 'A massa da Terra é 81 vezes a da Lua. A que fração da distância Terra–Lua, contada a partir da Terra, as atrações se anulam?', a: 0.9, h: 'GM/x² = G(M/81)/(d − x)² → x/(d − x) = √81 = 9 → x = 9d/10 = 0,9d' }
      : { ctx: `A massa da Terra é 81 vezes a da Lua, e elas estão a ${d} mil km. A que distância da Terra, em mil km, as atrações se anulam?`, a: rd(0.9 * d), u: 'mil km', h: `as distâncias ficam na razão √81 = 9 : 1 → 9/10 de ${d} = ${f(rd(0.9 * d))}` }; });

  // corrente de aparelhos e potência com outra tensão (2023, raio, 45%)
  addV('f_cir', [650, 325], 'Corrente de um aparelho', L => {
    if (!L) { const [what, P, U] = pick([['Um chuveiro', 5500, 220], ['Um chuveiro', 4400, 220], ['Um micro-ondas', 1100, 110], ['Um secador', 1320, 220], ['Um carregador', 20, 5], ['Um patinete elétrico', 462, 42], ['Um ferro de passar', 1100, 220], ['Uma lâmpada', 60, 12]]);
      return { ctx: `${what} de ${f(P)} W ligad${what.startsWith('Uma ') ? 'a' : 'o'} em ${U} V. Corrente?`, a: P / U, u: 'A', h: `i = P/U = ${f(P)} ÷ ${U} = ${f(P / U)}` }; }
    if (L === 1) { const [P, U] = pick([[4400, 220], [1100, 110], [2200, 220], [60, 12], [100, 10], [5500, 220], [48, 12]]), R = rd(U * U / P);
      return { ctx: `Aparelho de ${f(P)} W em ${U} V. Resistência?`, a: R, u: 'Ω', h: `R = U²/P = ${f(U * U)} ÷ ${f(P)} = ${f(R)}` }; }
    const [P, U1, U2] = pick([[4400, 220, 110], [5500, 220, 110], [1000, 220, 110], [60, 12, 6], [100, 220, 110], [2000, 110, 220]]), P2 = P * (U2 / U1) ** 2;
    return { ctx: `Um aparelho de ${f(P)} W feito para ${U1} V é ligado em ${U2} V. Potência agora, com a mesma resistência?`, a: P2, u: 'W', h: `P = U²/R: a tensão ${U2 > U1 ? 'dobra' : 'cai à metade'} → potência × ${f((U2 / U1) ** 2)} = ${f(P2)}` }; });
  // gerador com resistência interna
  addV('f_cir', [1000, 200], 'Gerador real', L => { const e = pick([6, 9, 12, 24]), r = pick([0.5, 1, 2]);
    if (!L) { const i = pick([1, 2, 3, 4]), U = rd(e - r * i); if (U <= 0) return null;
      return { ctx: `Uma bateria de ε = ${e} V e resistência interna ${f(r)} Ω fornece ${i} A. Tensão nos terminais?`, a: U, u: 'V', h: `U = ε − r·i = ${e} − ${f(r)} × ${i} = ${f(U)}` }; }
    const R = pick([1, 2, 3, 4, 5, 7, 10, 11]), i = e / (R + r); if (!nice(i)) return null;
    const c = `Uma bateria de ε = ${e} V e resistência interna ${f(r)} Ω está ligada a um resistor de ${R} Ω.`;
    if (L === 1) return { ctx: `${c} Corrente?`, a: rd(i), u: 'A', h: `i = ε/(R + r) = ${e} ÷ ${f(R + r)} = ${f(rd(i))}` };
    return { ctx: `${c} Tensão no resistor?`, a: rd(R * i), u: 'V', h: `i = ${e} ÷ ${f(R + r)} = ${f(rd(i))} A; U = R·i = ${f(rd(R * i))}` }; });
  // bateria: Wh, mAh e tempo de uso
  addV('f_cir', [650, 300], 'Bateria', L => {
    if (!L) { const E = pick([10, 12, 15, 20, 24, 50]), P = pick([2, 3, 4, 5, 6, 10]), t = rd(E / P); if (!nice(t)) return null;
      return { ctx: `Uma bateria de ${E} Wh alimenta um aparelho de ${P} W. Quanto tempo dura?`, a: t, u: 'h', h: `t = E/P = ${E} ÷ ${P} = ${f(t)}` }; }
    const U = pick([3.7, 5, 12]), mah = pick([1000, 2000, 3000, 4000, 5000, 10000]), E = rd(U * mah / 1000);
    if (L === 1) return { ctx: `Bateria de ${f(U)} V e ${f(mah)} mAh. Energia armazenada, em Wh?`, a: E, u: 'Wh', h: `E = U × carga = ${f(U)} V × ${f(mah / 1000)} A·h = ${f(E)} Wh` };
    const P = pick([5, 10, 20]), t = rd(E / P); if (!nice(t, 2)) return null;
    return { ctx: `Um carregador de ${P} W carrega, do zero, uma bateria de ${f(U)} V e ${f(mah)} mAh. Tempo mínimo, em horas?`, a: t, u: 'h', h: `E = ${f(U)} × ${f(mah / 1000)} = ${f(E)} Wh; t = ${f(E)} ÷ ${P} = ${f(t)}` }; });

  // ---------- matemática ----------
  // misturas e teor (2023, álcool 70%, 70%)
  addV('porc', [700, 250], 'Misturas', L => {
    if (!L) { const V = pick([200, 250, 500, 1000]), c = pick([40, 46, 70, 92, 96]);
      return { ctx: `Quantos mL de álcool puro há em ${f(V)} mL de álcool ${c}%?`, a: V * c / 100, u: 'mL', h: `${c}% de ${f(V)} = ${f(V * c / 100)}` }; }
    for (let i = 0; i < 40; i++) {
      const A = pick([100, 200, 300, 400, 500, 600]), c = pick([70, 80, 90, 96]);
      if (L === 1) { const W = pick([100, 200, 300, 400, 500]), t = A * c / (A + W); if (!nice(t)) continue;
        return { ctx: `Misturam-se ${A} mL de álcool ${c}% com ${W} mL de água. Teor de álcool da mistura, em %?`, a: rd(t), u: '%', h: `álcool puro: ${f(A * c / 100)} mL em ${f(A + W)} mL → ${f(A * c / 100)} ÷ ${f(A + W)} = ${f(rd(t))}%` }; }
      const c1 = pick([40, 46, 50, 60, 70]), T = A * c / c1; if (c1 >= c || !Number.isInteger(T)) continue;
      return { ctx: `Quanta água acrescentar a ${A} mL de álcool ${c}% para ele ficar com ${c1}%?`, a: T - A, u: 'mL', h: `o álcool puro (${f(A * c / 100)} mL) não muda: total = ${f(A * c / 100)} ÷ ${c1}% = ${f(T)} mL → água = ${f(T)} − ${A} = ${f(T - A)}` }; }
    return null; });
  // juros simples × compostos
  addV('juros', [900, 250], 'Simples × compostos', L => { const C = pick([1000, 2000, 5000, 10000]), i = L === 2 ? 20 : 10, n = L === 2 ? pick([2, 3]) : L ? 3 : 2;
    const fc = rd((1 + i / 100) ** n), comp = rd(C * fc), simp = C * (1 + i * n / 100);
    return { ctx: `R$ ${f(C)} a ${i}% ao mês por ${n} meses. Quanto os juros compostos rendem a mais que os simples, em reais?`, a: rd(comp - simp), h: `compostos: ${f(C)} × ${f(fc)} = ${f(comp)}; simples: ${f(C)} × ${f(rd(1 + i * n / 100))} = ${f(simp)}; diferença ${f(rd(comp - simp))}` }; });
  // composição repetida e recorrência (composição de funções cai quase todo ano)
  addV('func', [800, 250], 'Iterar e recorrência', L => {
    if (L < 2) { const a = pick([2, 3, -1, 2, -2]), b = ri(-3, 3), x = ri(-2, 3), n = L ? 3 : 2; let y = x; const st = [];
      for (let k = 0; k < n; k++) { y = a * y + b; st.push(y); }
      if (Math.abs(y) > 200) return null;
      return { ctx: `f(x) = ${poly([a, b])}`, q: `${'f('.repeat(n)}${nm(x)}${')'.repeat(n)}`, a: y, h: `de dentro para fora: ${[x, ...st].map(nm).join(' → ')}` }; }
    const c = ri(2, 6), r = pick([2, 3, 4, 5, -2]), n = pick([10, 20, 50, 100]);
    return { ctx: `f(x + 1) = f(x) ${r < 0 ? '−' : '+'} ${Math.abs(r)} e f(0) = ${c}`, q: `f(${n})`, a: c + r * n, h: `cada passo soma ${nm(r)}: os valores formam uma PA → f(${n}) = ${c} + ${n} × ${r < 0 ? `(${nm(r)})` : r} = ${nm(c + r * n)}` }; });
  // máximo de parábola em problema
  addV('func', [900, 200], 'Máximo em problemas', L => {
    if (!L) { const b = 2 * ri(5, 30);
      return { ctx: `O lucro de uma loja é L(x) = −x² + ${b}x, com x peças vendidas. Lucro máximo?`, a: (b / 2) ** 2, h: `vértice em x = ${b} ÷ 2 = ${b / 2}; L(${b / 2}) = ${b / 2}² = ${f((b / 2) ** 2)}` }; }
    if (L === 1) { const a = pick([2, 3, 5]), xv = ri(2, 10), c = ri(0, 20), b = 2 * a * xv, yv = -a * xv * xv + b * xv + c;
      return { ctx: `Valor máximo de f(x) = −${a}x² + ${b}x${c ? ' + ' + c : ''}`, a: yv, h: `xᵥ = −b/2a = ${b} ÷ ${2 * a} = ${xv}; f(${xv}) = −${f(a * xv * xv)} + ${f(b * xv)}${c ? ' + ' + c : ''} = ${f(yv)}` }; }
    const P = 4 * ri(3, 25);
    return { ctx: `Um retângulo tem perímetro ${P}. Área máxima?`, a: (P / 4) ** 2, h: `área = x·(${P / 2} − x), máxima no vértice x = ${P / 4}: é o quadrado de lado ${P / 4} → ${f((P / 4) ** 2)}` }; });
  // soma de consecutivos e termo do meio (questões de PA de 2022 e 2024)
  addV('seq', [700, 250], 'Números consecutivos', L => {
    if (!L) { const m = ri(20, 99), big = Math.random() < .5;
      return { ctx: `Três números inteiros consecutivos somam ${3 * m}. O ${big ? 'maior' : 'menor'}?`, a: big ? m + 1 : m - 1, h: `o do meio é ${3 * m} ÷ 3 = ${m}` }; }
    if (L === 1) { const n = pick([4, 5]), par = Math.random() < .5, a1 = 2 * ri(5, 40) + (par ? 0 : 1), S = n * a1 + n * (n - 1), big = Math.random() < .5;
      return { ctx: `${n === 4 ? 'Quatro' : 'Cinco'} números ${par ? 'pares' : 'ímpares'} consecutivos somam ${S}. O ${big ? 'maior' : 'menor'}?`, a: big ? a1 + 2 * (n - 1) : a1, h: `a média é ${S} ÷ ${n} = ${f(S / n)}, que fica no meio; os vizinhos ficam de 2 em 2 → ${a1}…${a1 + 2 * (n - 1)}` }; }
    const n = pick([7, 9, 11, 12, 15]), mid = ri(5, 40), r = ri(2, 6), S = n % 2 ? n * mid : n * (2 * mid + r * (n - 1)) / 2;
    if (n % 2) return { ctx: `Uma PA de ${n} termos tem soma ${f(S)}. Termo do meio?`, a: mid, h: `com quantidade ímpar, o termo do meio é a média: ${f(S)} ÷ ${n} = ${mid}` };
    return { ctx: `Uma PA de ${n} termos tem soma ${f(S)}. Quanto vale a₁ + a${n}?`, a: 2 * S / n, h: `S = (a₁ + aₙ)·n/2 → a₁ + aₙ = 2 × ${f(S)} ÷ ${n} = ${f(2 * S / n)}` }; });
  // área com o quadrado do diâmetro (pizza)
  addV('gplan', [700, 275], 'Área vai com o quadrado', L => {
    if (!L) { const [d1, d2] = pick([[40, 20], [30, 10], [60, 20], [50, 25], [45, 15]]);
      return { ctx: `Quantas pizzas de ${d2} cm de diâmetro têm, juntas, a mesma área de uma de ${d1} cm?`, a: (d1 / d2) ** 2, h: `área ∝ d²: (${d1}/${d2})² = ${d1 / d2}² = ${(d1 / d2) ** 2}` }; }
    if (L === 1) { const [d1, d2, p] = pick([[30, 40, 36], [20, 30, 24], [30, 45, 40], [40, 30, 64], [20, 40, 15], [25, 35, 50]]), p2 = rd(p * (d2 / d1) ** 2);
      return { ctx: `Uma pizza de ${d1} cm custa R$ ${p}. Pelo mesmo preço por área, quanto custaria uma de ${d2} cm, em reais?`, a: p2, h: `preço ∝ d²: ${p} × (${d2}/${d1})² = ${p} × ${sf(d2 * d2, d1 * d1)} = ${f(p2)}` }; }
    const k = pick([10, 20, 30, 50]), A = rd((1 + k / 100) ** 2 * 100 - 100);
    return { ctx: `O diâmetro de uma pizza aumentou ${k}%. Quantos por cento aumentou a área?`, a: A, u: '%', h: `fator ${f(1 + k / 100)}² = ${f(rd((1 + k / 100) ** 2))} → +${f(A)}%` }; });
  // existência do triângulo
  addV('gplan', [850, 150], 'Existência do triângulo', L => { if (!L) return null; const b = ri(2, 9), c = ri(b + 1, 15);
    return { ctx: `Um triângulo tem lados ${b}, ${c} e x, com x inteiro. Quantos valores x pode ter?`, a: 2 * b - 1, h: `${c} − ${b} < x < ${c} + ${b} → de ${c - b + 1} a ${c + b - 1}: ${2 * b - 1} valores` }; });
  // diagonal do quadrado: d = ℓ√2 (a do cubo, ℓ√3, fica na geometria espacial)
  addV('gplan', [650, 300], 'Diagonal do quadrado', L => {
    if (!L) { const l = ri(2, 15);
      return { ctx: `Quadrado de lado ${l}: diagonal = k√2. k?`, a: l, h: `d = ℓ√2 = ${l}√2` }; }
    if (L === 1) { const l = ri(2, 12), k = pick(['lado', 'rac', 'dobro']);
      if (k === 'lado') return { ctx: `Quadrado de diagonal ${l}√2. Lado?`, a: l, h: `d = ℓ√2 → ℓ = ${l}√2 ÷ √2 = ${l}` };
      if (k === 'rac') return { ctx: `Quadrado de diagonal ${2 * l}: lado = k√2. k?`, a: l, h: `ℓ = d/√2 = ${2 * l}/√2 = ${2 * l}√2/2 = ${l}√2` };
      return { ctx: `Quadrado de lado ${l}√2. Diagonal?`, a: 2 * l, h: `d = ℓ√2 = ${l}√2 × √2 = ${l} × 2 = ${2 * l}` }; }
    const d = 2 * ri(2, 10);
    return Math.random() < .6 ? { ctx: `Quadrado de diagonal ${d}. Área?`, a: d * d / 2, h: `área = d²/2 = ${d * d}/2 = ${f(d * d / 2)} (o quadrado é um losango de diagonais iguais: D·d/2)` }
      : { ctx: `Quadrado de diagonal ${d}√2. Perímetro?`, a: 4 * d, h: `lado = ${d}√2 ÷ √2 = ${d}; perímetro 4 × ${d} = ${4 * d}` }; });
  // volumes com π = 3 e mL
  addV('gesp', [800, 200], 'Cilindro com π = 3', L => {
    if (!L) { const r = pick([2, 3, 4, 5]), H = pick([5, 10, 12, 15, 20]);
      return { ctx: `Lata cilíndrica de raio ${r} cm e altura ${H} cm. Volume, em mL? (π = 3)`, a: 3 * r * r * H, u: 'mL', h: `V = πr²h = 3 × ${r * r} × ${H} = ${f(3 * r * r * H)} cm³, e 1 cm³ = 1 mL` }; }
    if (L === 1) { const r = pick([3, 6, 9]);
      return { ctx: `Esfera de raio ${r}: volume = kπ. Quanto vale k?`, a: 4 * r ** 3 / 3, h: `V = 4πr³/3 = 4 × ${r ** 3} ÷ 3 = ${f(4 * r ** 3 / 3)}` }; }
    const [k, m] = pick([[2, 2], [2, 4], [3, 3], [2, 1], [3, 9], [3, 2]]);
    return { ctx: `O raio de uma lata cilíndrica fica ${k} vezes maior e a altura ${m === 1 ? 'não muda' : `fica ${m} vezes menor`}. O volume fica multiplicado por:`, a: rd(k * k / m), h: `V = πr²h → ${k}² ÷ ${m} = ${f(rd(k * k / m))}` }; });
  // período de fenômenos que se repetem (marés, temperatura)
  addV('trig', [900, 200], 'Período de fenômenos', L => { if (!L) return null;
    if (L === 1) { const k = pick([2, 3, 4, 6, 12]);
      return { ctx: `A altura da maré é h(t) = ${pick(['2', '1,5', '3'])} + ${pick(['0,5', '1', '1,2'])}·cos(πt/${k}), com t em horas. Período?`, a: 2 * k, u: 'h', h: `período de cos(at) é 2π/a = 2π ÷ (π/${k}) = ${2 * k}` }; }
    const T = pick([4, 8, 12, 24]);
    return { ctx: `A temperatura é T(t) = 20 + 5·sen(2πt/${T}), com t em horas. Quantas horas depois de t = 0 ela chega ao máximo pela primeira vez?`, a: T / 4, u: 'h', h: `seno máximo em π/2: 2πt/${T} = π/2 → t = ${T}/4 = ${T / 4}` }; });
  // escalas logarítmicas (Richter)
  addV('logexp', [900, 250], 'Escalas logarítmicas', L => {
    if (!L) { const m1 = ri(3, 6), d = ri(1, 3);
      return { ctx: `Na escala Richter, M = log(A/A₀). Um terremoto de magnitude ${m1 + d} tem amplitude quantas vezes a de um de magnitude ${m1}?`, a: 10 ** d, h: `cada ponto multiplica a amplitude por 10: 10<sup>${d}</sup> = ${f(10 ** d)}` }; }
    if (L === 1) { const m1 = ri(3, 5), d = ri(1, 3);
      return { ctx: `Na escala Richter, M = log(A/A₀). Um terremoto tem amplitude ${f(10 ** d)} vezes a de um de magnitude ${m1}. Magnitude dele?`, a: m1 + d, h: `log ${f(10 ** d)} = ${d} → ${m1} + ${d} = ${m1 + d}` }; }
    const d = pick([2, 4]);
    return { ctx: `A energia de um terremoto segue log E = 1,5M + c. Se a magnitude aumenta ${d}, a energia fica multiplicada por:`, a: 10 ** (1.5 * d), h: `log E aumenta 1,5 × ${d} = ${1.5 * d} → 10<sup>${1.5 * d}</sup> = ${f(10 ** (1.5 * d))}` }; });
  // sistemas em problemas
  addV('matr', [900, 200], 'Problemas com duas incógnitas', L => {
    if (!L) { const c = ri(3, 15), g = ri(3, 20), H = c + g, P = 4 * c + 2 * g;
      return { ctx: `Num sítio há galinhas e coelhos: ${H} cabeças e ${P} pés. Quantos coelhos?`, a: c, h: `se fossem só galinhas, seriam ${2 * H} pés; os ${P - 2 * H} a mais são 2 por coelho → ${c}` }; }
    if (L === 1) { const [n1, n2] = pick([[3, 2], [2, 1], [4, 3], [5, 2], [3, 1]]), a = ri(4, 15), b = ri(2, a - 1), S = a + b, T = n1 * a + n2 * b;
      return { ctx: `${n1} cadernos e ${n2} caneta${n2 > 1 ? 's' : ''} custam R$ ${T}; 1 caderno e 1 caneta custam R$ ${S}. Preço do caderno, em reais?`, a, h: `tire ${n2} × (caderno + caneta) = ${n2 * S}: sobram ${n1 - n2} caderno${n1 - n2 > 1 ? 's' : ''} = ${T - n2 * S} → ${a}` }; }
    const x = ri(1, 12), y = ri(1, 12), z = ri(1, 12), all = Math.random() < .5;
    return { ctx: `x + y = ${x + y}, y + z = ${y + z} e x + z = ${x + z}. ${all ? 'Quanto vale x + y + z?' : 'Quanto vale x?'}`, a: all ? x + y + z : x, h: `somando as três: 2(x + y + z) = ${2 * (x + y + z)} → x + y + z = ${x + y + z}${all ? '' : `; x = ${x + y + z} − ${y + z} = ${x}`}` }; });

  // médias: tópico novo (média, mediana e média ponderada aparecem em quase toda prova)
  topic('med', 'mat', 'Médias e estatística', [
    L => { const n = 3 + L + ri(0, 1), m = ri(5, 30 + 30 * L), d = []; let s = 0;
      for (let i = 0; i < n - 1; i++) { const x = ri(-4 - 2 * L, 4 + 2 * L); d.push(x); s += x; }
      d.push(-s); if (Math.abs(s) > 6 + 2 * L || m - Math.max(...d.map(Math.abs)) < 1) return null;
      const xs = shuffle(d.map(x => m + x));
      return { ctx: 'Média aritmética de', q: xs.join(', '), a: m, h: `soma ${f(n * m)} ÷ ${n} = ${m} (ou some só as distâncias até ${m}: dão 0)`, tk: 'Média é soma ÷ quantidade' }; },
    L => { for (let i = 0; i < 40; i++) {
        const k = L === 2 ? 3 : 2, ws = Array.from({ length: k }, () => ri(1, 4)), vs = Array.from({ length: k }, () => ri(3, 10)), W = ws.reduce((s, x) => s + x, 0), S = ws.reduce((s, w, j) => s + w * vs[j], 0);
        if (!nice(S / W) || new Set(vs).size < k) continue;
        return { ctx: `Notas ${vs.map((v, j) => `${v} (peso ${ws[j]})`).join(', ')}. Média ponderada?`, a: rd(S / W), h: `(${vs.map((v, j) => `${v}×${ws[j]}`).join(' + ')}) ÷ ${W} = ${S} ÷ ${W} = ${f(rd(S / W))}`, tk: 'Média ponderada' }; }
      return null; },
    L => { const n = ri(4, 9), a = ri(5, 20), b = a + pick([1, 2, -1, -2]), add = L < 2 || Math.random() < .5, x = add ? (n + 1) * b - n * a : n * a - (n - 1) * b;
      if (x <= 0) return null;
      return add ? { ctx: `A média de ${n} números é ${a}. Com mais um número, a média passa a ${b}. Que número entrou?`, a: x, h: `somas: ${n} × ${a} = ${n * a} e ${n + 1} × ${b} = ${(n + 1) * b} → entrou ${x}`, tk: 'Média é soma ÷ quantidade' }
        : { ctx: `A média de ${n} números é ${a}. Tirando um deles, a média dos outros passa a ${b}. Que número saiu?`, a: x, h: `somas: ${n} × ${a} = ${n * a} e ${n - 1} × ${b} = ${(n - 1) * b} → saiu ${x}`, tk: 'Média é soma ÷ quantidade' }; },
    L => { const n = [5, 6, 8][L], xs = Array.from({ length: n }, () => ri(1, 20 + 10 * L)), o = xs.slice().sort((p, q) => p - q);
      const md = n % 2 ? o[(n - 1) / 2] : (o[n / 2 - 1] + o[n / 2]) / 2;
      return { ctx: 'Mediana de', q: xs.join(', '), a: md, h: `em ordem: ${o.join(', ')} → ${n % 2 ? `o do meio, ${md}` : `média dos dois do meio, (${o[n / 2 - 1]} + ${o[n / 2]}) ÷ 2 = ${f(md)}`}`, tk: 'Mediana' }; },
    L => { const m = ri(5, 30), a = pick([2, 3, 4, 5]), b = pick([2, 3, 5, 10]);
      if (!L) return { ctx: `A média de um grupo de valores é ${m}. Somando ${b} a cada valor, a nova média é:`, a: m + b, h: `somar ${b} a todos soma ${b} à média`, tk: 'Transformar todos os valores' };
      if (L === 1) return { ctx: `A média de um grupo de valores é ${m}. Multiplicando cada valor por ${a}, a nova média é:`, a: a * m, h: `multiplicar todos por ${a} multiplica a média por ${a}`, tk: 'Transformar todos os valores' };
      return { ctx: `A média de x₁, …, xₙ é ${m}. Qual é a média de ${a}x₁ + ${b}, …, ${a}xₙ + ${b}?`, a: a * m + b, h: `${a} × ${m} + ${b} = ${a * m + b}`, tk: 'Transformar todos os valores' }; },
    L => { for (let i = 0; i < 40; i++) {
        const nA = pick([10, 20, 30, 40]), nB = pick([10, 20, 30, 40, 60]), mA = ri(4, 9), mB = ri(4, 9), m = (nA * mA + nB * mB) / (nA + nB);
        if (mA === mB || nA === nB || !nice(m)) continue;
        return { ctx: `A turma A tem ${nA} alunos com média ${mA}; a turma B, ${nB} alunos com média ${mB}. Média das duas turmas juntas?`, a: rd(m), h: `(${nA}×${mA} + ${nB}×${mB}) ÷ ${nA + nB} = ${nA * mA + nB * mB} ÷ ${nA + nB} = ${f(rd(m))} (não é a média de ${mA} e ${mB})`, tk: 'Média ponderada' }; }
      return null; },
  ]);
  QB.med = Object.assign(V(200, 400, 700, 1000, 800, 700, 1100), { s5: 100 });

  // ---------- química ----------
  // concentrações de rótulo: % (m/V), mg/L, dose e açúcar (2024, OMS e refrigerantes)
  addV('q_sol', [800, 250], 'Rótulos do dia a dia', L => {
    if (!L) { const [what, p] = pick([['Soro fisiológico', 0.9], ['Soro glicosado', 5], ['Água oxigenada', 3], ['Vinagre', 4], ['Uma solução de NaOH', 2]]);
      return { ctx: `${what} a ${f(p)}% (m/V). Concentração em g/L?`, a: rd(p * 10), u: 'g/L', h: `${f(p)}% (m/V) = ${f(p)} g em 100 mL = ${f(rd(p * 10))} g em 1 L` }; }
    if (L === 1) { const [ion, M, ms] = pick([['Ca²⁺', 40, [20, 40, 80, 120]], ['Mg²⁺', 24, [12, 24, 48]], ['Na⁺', 23, [23, 46, 115]], ['K⁺', 39, [39, 78]], ['Cl⁻', 35.5, [35.5, 71]]]), m = pick(ms);
      return { ctx: `Uma água mineral tem ${f(m)} mg/L de ${ion} (${f(M)} g/mol). Concentração em mmol/L?`, a: rd(m / M), u: 'mmol/L', h: `mg/L ÷ g/mol = mmol/L: ${f(m)} ÷ ${f(M)} = ${f(rd(m / M))}` }; }
    if (Math.random() < .5) { const d = pick([5, 10, 15, 20]), kg = pick([10, 12, 15, 20, 30]), c = pick([20, 25, 50, 100]), mL = rd(d * kg / c); if (!nice(mL)) return null;
      return { ctx: `A dose é ${d} mg por kg. A criança tem ${kg} kg e o xarope tem ${c} mg/mL. Quantos mL?`, a: mL, u: 'mL', h: `${d} × ${kg} = ${d * kg} mg; ${d * kg} ÷ ${c} = ${f(mL)} mL` }; }
    const s = pick([80, 100, 125]), lim = pick([25, 50]), v = rd(lim / s * 1000);
    return { ctx: `Um refrigerante tem ${s} g de açúcar por litro. Quantos mL dele já somam ${lim} g de açúcar?`, a: v, u: 'mL', h: `${lim} ÷ ${s} = ${f(rd(lim / s))} L = ${f(v)} mL` }; });
  // química verde: fator E e economia atômica (2021, 48%)
  addV('q_est', [800, 250], 'Economia atômica', L => {
    if (!L) { const p = pick([1, 2, 5, 10]), r = pick([1, 3, 5, 10, 25]);
      return { ctx: `Para obter ${p} kg de um produto, ${p * r > 1 ? 'geram-se' : 'gera-se'} ${p * r} kg de resíduos. Fator E (kg de resíduo por kg de produto)?`, a: r, h: `E = resíduo ÷ produto = ${p * r} ÷ ${p} = ${r}` }; }
    if (L === 1) {
      if (Math.random() < .3) { const [eq, nmP, R, P] = pick([['CaCO₃ → CaO + CO₂', 'CaO', 100, 56], ['C₂H₄ + H₂O → C₂H₅OH', 'etanol', 46, 46], ['N₂ + 3 H₂ → 2 NH₃', 'NH₃', 34, 34]]);
        return { ctx: `${eq}. Economia atômica para obter ${nmP}, em %? (reagentes: ${R} g; produto desejado: ${P} g)`, a: rd(100 * P / R), u: '%', h: `${P} ÷ ${R} = ${f(rd(100 * P / R))}%${P === R ? ': numa adição, todos os átomos vão para o produto' : ''}` }; }
      const T = pick([100, 120, 150, 200, 250]), pc = pick([40, 50, 60, 75, 80, 90]), C = T * pc / 100, A = T * pick([0.4, 0.5, 0.6]);
      if (!Number.isInteger(C) || !Number.isInteger(A)) return null;
      return { ctx: `A + B → C + D, com massas molares A = ${A}, B = ${T - A}, C = ${C} e D = ${T - C} g/mol. Economia atômica para obter C, em %?`, a: pc, u: '%', h: `massa do produto desejado ÷ massa dos reagentes = ${C} ÷ ${T} = ${pc}%` }; }
    const ea = pick([40, 50, 60, 75, 80]), y = pick([50, 60, 80, 90]);
    return { ctx: `Uma reação tem economia atômica de ${ea}% e rendimento de ${y}%. Que % da massa dos reagentes vira, de fato, produto?`, a: rd(ea * y / 100), u: '%', h: `${ea}% × ${y}% = ${f(rd(ea * y / 100))}%` }; });
  // energia dos alimentos: % em massa × % em energia (2025, barra de chocolate, IF 0,38)
  addV('q_ter', [700, 350], 'Energia dos alimentos', L => {
    if (!L) { const c = ri(5, 30), p = ri(2, 15), g = ri(1, 12), E = 4 * (c + p) + 9 * g;
      return { ctx: `Um lanche tem ${c} g de carboidratos, ${p} g de proteínas e ${g} g de gorduras. Energia, em kcal? (4, 4 e 9 kcal/g)`, a: E, u: 'kcal', h: `4 × (${c} + ${p}) + 9 × ${g} = ${4 * (c + p)} + ${9 * g} = ${E}` }; }
    for (let i = 0; i < 200; i++) {
      if (L === 1) { const g = ri(2, 20), c = ri(4, 50), E = 9 * g + 4 * c, pc = 900 * g / E; if (!Number.isInteger(pc)) continue;
        return { ctx: `Um alimento tem ${g} g de gordura e ${c} g de carboidrato (9 e 4 kcal/g). Que % da energia vem da gordura?`, a: pc, u: '%', h: `gordura: ${9 * g} kcal de ${9 * g} + ${4 * c} = ${E} → ${pc}% (em massa, a gordura é ≈ ${Math.round(100 * g / (g + c))}%)` }; }
      const G = ri(5, 40), C = ri(10, 60), P = ri(2, 20); if (G + C + P > 100) continue;
      const E = 9 * G + 4 * (C + P), pc = 900 * G / E; if (!Number.isInteger(pc)) continue;
      return { ctx: `Uma barra de 100 g tem ${G}% de gordura, ${C}% de carboidrato e ${P}% de proteína, em massa. Que % da energia vem da gordura? (9, 4 e 4 kcal/g)`, a: pc, u: '%', h: `em 100 g: gordura ${9 * G} kcal; total ${9 * G} + ${4 * (C + P)} = ${E} kcal → ${pc}%` }; }
    return null; });
  // tampão e escala de pH (equilíbrio ácido-base cai todo ano)
  addV('q_eq', [800, 275], 'Tampão', L => {
    if (!L) { const p1 = ri(2, 6), d = ri(1, 3);
      return { ctx: `Uma solução de pH ${p1} tem quantas vezes mais H⁺ que uma de pH ${p1 + d}?`, a: 10 ** d, h: `cada unidade de pH a menos é [H⁺] × 10 → 10<sup>${d}</sup> = ${f(10 ** d)}` }; }
    const [ac, pKa] = pick([['ácido acético', 4.7], ['ácido carbônico', 6.4], ['íon amônio', 9.2], ['ácido fórmico', 3.7], ['H₂PO₄⁻', 7.2]]);
    if (L === 1) return { ctx: `Tampão de ${ac} (pKa = ${f(pKa)}) com concentrações iguais do ácido e da sua base conjugada. pH?`, a: pKa, h: `pH = pKa + log([base]/[ácido]) = ${f(pKa)} + log 1 = ${f(pKa)}` };
    const [r, lg] = pick([[10, 1], [0.1, -1], [100, 2], [0.01, -2]]);
    return { ctx: `Tampão de ${ac} (pKa = ${f(pKa)}) em que [base conjugada] = ${f(r)} × [ácido]. pH?`, a: rd(pKa + lg), h: `pH = pKa + log([base]/[ácido]) = ${f(pKa)} + log ${f(r)} = ${f(pKa)} ${lg < 0 ? '−' : '+'} ${Math.abs(lg)} = ${f(rd(pKa + lg))}` }; });
  // massa de metal depositada na eletrólise
  addV('q_elq', [900, 275], 'Massa depositada', L => { const [ion, z, M, me] = pick([['Cu²⁺', 2, 63.5, 'cobre'], ['Ag⁺', 1, 108, 'prata'], ['Zn²⁺', 2, 65, 'zinco'], ['Al³⁺', 3, 27, 'alumínio'], ['Ni²⁺', 2, 59, 'níquel']]);
    if (!L) { const n = pick([0.5, 1, 2]), ne = z * n;
      return { ctx: `Quantos gramas de ${me} (${f(M)} g/mol) se depositam com ${f(ne)} mol de elétrons, a partir de ${ion}?`, a: rd(n * M), u: 'g', h: `cada ${ion} precisa de ${z} e⁻: ${f(ne)} ÷ ${z} = ${f(n)} mol × ${f(M)} = ${f(rd(n * M))} g` }; }
    if (L === 1) { const n = pick([0.5, 1, 2, 3]);
      return { ctx: `Quantos mol de elétrons são necessários para depositar ${f(rd(n * M))} g de ${me} (${f(M)} g/mol) a partir de ${ion}?`, a: rd(z * n), u: 'mol', h: `${f(rd(n * M))} ÷ ${f(M)} = ${f(n)} mol de metal × ${z} = ${f(rd(z * n))} mol de e⁻` }; }
    const [i, t] = pick(z === 3 ? [[10, 2895], [5, 5790], [3, 9650]] : [[1, 965], [2, 965], [5, 193], [10, 965], [5, 1930], [10, 193]]), ne = i * t / 96500, m = rd(ne / z * M);
    return { ctx: `Uma corrente de ${i} A passa por ${f(t)} s numa solução de ${ion}. Massa de ${me} depositada? (${f(M)} g/mol; F = 96.500 C/mol)`, a: m, u: 'g', h: `Q = ${f(i * t)} C → ${f(rd(ne))} mol de e⁻ → ÷ ${z} = ${f(rd(ne / z))} mol × ${f(M)} = ${f(m)} g` }; });
  // pV = nRT com 27 °C (2023, 45%; 2021, cilindro de oxigênio)
  addV('q_gas', [900, 200], 'Clapeyron', L => {
    if (!L) { const n = pick([0.5, 1, 2, 3, 4]);
      return { ctx: `Volume de ${f(n)} mol de gás a 1 atm e 27 °C? (R = 0,082 atm·L/mol·K)`, a: rd(24.6 * n), u: 'L', h: `V = nRT/p; a 27 °C, RT = 0,082 × 300 = 24,6 → ${f(n)} × 24,6 = ${f(rd(24.6 * n))}` }; }
    if (L === 1) { const n = pick([1, 2]), [Tc, T] = pick([[27, 300], [127, 400], [327, 600]]), p = pick([1, 2, 3]), Vv = rd(0.082 * n * T / p); if (!nice(Vv, 2)) return null;
      return { ctx: `Volume de ${n} mol de gás a ${p} atm e ${Tc} °C? (R = 0,082 atm·L/mol·K)`, a: Vv, u: 'L', h: `V = nRT/p = ${n} × 0,082 × ${T} ÷ ${p} = ${f(Vv)}` }; }
    const [Vv, p] = pick([[2.46, 100], [12.3, 2], [24.6, 50], [49.2, 10], [12.3, 20], [24.6, 200]]), n = rd(p * Vv / 24.6);
    return { ctx: `Um cilindro de ${f(Vv)} L tem oxigênio a ${p} atm e 27 °C. Quantos mol de O₂? (R = 0,082 atm·L/mol·K)`, a: n, u: 'mol', h: `n = pV/RT = ${p} × ${f(Vv)} ÷ 24,6 = ${f(n)}` }; });
