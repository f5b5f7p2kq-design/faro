  // ================== QUÍMICA ==================
  topic('q_mol', 'qui', 'Mol e massa molar', [
    L => { const s = pick(SUBS.slice(0, [9, 20, 30][L])); return { ctx: `Massa molar de ${s[2]} (${ch(s[0])})${L ? '' : ' (H = 1, C = 12, N = 14, O = 16, Na = 23)'}`, q: '', a: s[1], u: 'g/mol', h: `${atomsTxt(s[0])} = ${f(s[1])}` }; },
    L => { const s = pick(SUBS.slice(0, [9, 20, 30][L])), k = pick([[1, 2, 3, 0.5], [0.5, 2, 3, 4, 0.25, 0.1], [0.2, 0.25, 1.5, 2.5, 0.05]][L]), m = rd(s[1] * k);
      return Math.random() < .5 ? { ctx: `Quantos mols há em ${f(m)} g de ${ch(s[0])} (M = ${f(s[1])} g/mol)?`, q: '', a: k, u: 'mol', h: `n = m/M = ${f(m)} ÷ ${f(s[1])} = ${f(k)}` }
        : { ctx: `Massa de ${f(k)} mol de ${ch(s[0])} (M = ${f(s[1])} g/mol)`, q: '', a: m, u: 'g', h: `m = n·M = ${f(k)} × ${f(s[1])} = ${f(m)}` }; },
    L => { const n = pick([0.5, 1, 2, 3, 0.25, 1.5, 5]), s = pick(SUBS.slice(0, 9));
      return { ctx: `Quantas moléculas há em ${f(n)} mol de ${ch(s[0])}? Responda em unidades de 10²³ (N<sub>A</sub> = 6 × 10²³).`, q: '', a: rd(6 * n), u: '× 10²³', h: `${f(n)} × 6 × 10²³ = ${f(rd(6 * n))} × 10²³` }; },
    L => { const s = pick(SUBS.filter(x => atomCount(x[0]) > 2)), n = L === 2 ? pick([0.5, 1, 2]) : 0;
      return n ? { ctx: `Quantos mols de átomos há em ${f(n)} mol de ${ch(s[0])}?`, q: '', a: rd(n * atomCount(s[0])), u: 'mol', h: `cada fórmula tem ${atomCount(s[0])} átomos: ${f(n)} × ${atomCount(s[0])} = ${f(rd(n * atomCount(s[0])))}` }
        : { ctx: `Quantos átomos há em uma fórmula de ${ch(s[0])}?`, q: '', a: atomCount(s[0]), h: atomsTxt(s[0], true) }; },
    L => { if (L < 2) return null; const [fm, el, p, h] = pick([['CH4', 'C', 75, '12/16'], ['CaCO3', 'Ca', 40, '40/100'], ['CaCO3', 'O', 48, '48/100'], ['SO2', 'S', 50, '32/64'], ['NH4NO3', 'N', 35, '28/80'], ['Fe2O3', 'Fe', 70, '112/160'], ['NaOH', 'O', 40, '16/40'], ['C6H12O6', 'C', 40, '72/180'], ['MgO', 'Mg', 60, '24/40'], ['SO3', 'S', 40, '32/80'], ['H2O', 'H', 11.11, '2/18 (duas casas)']]);
      return { ctx: `Porcentagem em massa de ${el} em ${ch(fm)}`, q: '', a: p, u: '%', h: h };
    },
    L => mc({ ctx: pick(['1 mol de qualquer substância contém:', 'O número de Avogadro indica:']), ok: 'cerca de 6 × 10²³ entidades', no: ['22,4 g', '1 g de matéria', '12 átomos'], h: 'mol é uma contagem, como "dúzia"' }),
  ]);

  topic('q_gas', 'qui', 'Gases', [
    L => { const n = pick([0.25, 0.5, 1, 2, 3, 0.1]), back = Math.random() < .5;
      return back ? { ctx: `Nas CNTP, ${f(rd(22.4 * n))} L de gás são quantos mols? (22,4 L/mol)`, q: '', a: n, u: 'mol', h: `${f(rd(22.4 * n))} ÷ 22,4 = ${f(n)}` }
        : { ctx: `Volume de ${f(n)} mol de gás nas CNTP (22,4 L/mol)`, q: '', a: rd(22.4 * n), u: 'L', h: `${f(n)} × 22,4 = ${f(rd(22.4 * n))}` }; },
    L => { if (!L) return null; const s = pick(SUBS.filter(x => GASES.includes(x[0]))), k = pick([0.5, 1, 2]);
      return { ctx: `Volume de ${f(rd(s[1] * k))} g de ${ch(s[0])} nas CNTP (M = ${s[1]} g/mol)`, q: '', a: rd(22.4 * k), u: 'L', h: `${f(k)} mol × 22,4 = ${f(rd(22.4 * k))}` }; },
    L => { const P = pick([1, 2, 3, 4]), k = pick([2, 4]), V = k * ri(1, 5);
      return { ctx: `Gás a ${P} atm em ${V} L. Volume a ${P * k} atm, mesma temperatura?`, q: '', a: rd(V / k), u: 'L', h: `Boyle: P₁V₁ = P₂V₂ → ${P * V} ÷ ${P * k} = ${f(rd(V / k))}` }; },
    L => { if (!L) return null; const [n1, n2, P, g1, g2] = pick([[1, 3, 4, 'O₂', 'N₂'], [1, 1, 2, 'He', 'Ne'], [2, 3, 10, 'H₂', 'N₂'], [1, 4, 5, 'O₂', 'N₂'], [3, 1, 8, 'N₂', 'O₂']]);
      return { ctx: `Mistura de ${n1} mol de ${g1} e ${n2} mol de ${g2} a ${P} atm. Pressão parcial do ${g1}?`, q: '', a: rd(P * n1 / (n1 + n2)), u: 'atm', h: `fração molar ${n1}/${n1 + n2} × ${P} = ${f(rd(P * n1 / (n1 + n2)))}` }; },
    L => { if (L < 2) return null; const [a, b, r, ma, mb] = pick([['H₂', 'O₂', 4, 2, 32], ['He', 'CH₄', 2, 4, 16], ['CH₄', 'SO₂', 2, 16, 64], ['He', 'SO₂', 4, 4, 64], ['H₂', 'CH₄', 2.83, 2, 16]]); if (r % 1) return null;
      return { ctx: `Quantas vezes o ${a} se difunde mais rápido que o ${b}? (M = ${ma} e ${mb})`, q: '', a: r, h: `Graham: v₁/v₂ = √(M₂/M₁) = √${mb / ma} = ${r}` }; },
    L => { if (!L) return null; const [n, V, P] = pick([[1, 24.6, 1], [2, 12.3, 4], [1, 12.3, 2], [0.5, 24.6, 0.5], [2, 24.6, 2], [3, 24.6, 3]]);
      return { ctx: `${f(n)} mol de gás a 27 °C em ${f(V)} L (R = 0,082 atm·L/mol·K). Pressão?`, q: '', a: P, u: 'atm', h: `P = nRT/V; RT = 0,082 × 300 = 24,6 → ${f(n)} × 24,6 ÷ ${f(V)} = ${f(P)}` }; },
    L => { if (!L) return null; const [g, M] = pick([['O₂', 32], ['CO₂', 44], ['SO₂', 64], ['CH₄', 16]]), [g2, M2] = pick([['H₂', 2], ['He', 4], ['CH₄', 16]]); if (M === M2) return null;
      return { ctx: `Mesma P e T: a densidade do ${g} é quantas vezes a do ${g2}?`, q: '', a: M / M2, h: `densidade ∝ massa molar: ${M}/${M2} = ${M / M2}` }; },
    L => { const [ctx, ok, no, h] = pick([
        ['Volumes iguais de gases diferentes, à mesma P e T, têm:', 'o mesmo número de moléculas', ['a mesma massa', 'a mesma densidade', 'o mesmo número de átomos sempre'], 'princípio de Avogadro'],
        ['Duas amostras de gases diferentes à mesma temperatura têm a mesma:', 'energia cinética média por molécula', ['velocidade média', 'massa molar', 'pressão sempre'], 'Ec média depende só de T; as mais leves são mais rápidas'],
        ['Um gás real se aproxima do ideal em:', 'baixa pressão e alta temperatura', ['alta pressão e baixa temperatura', 'qualquer condição', 'baixa temperatura apenas'], 'moléculas afastadas e rápidas interagem pouco'],
        ['Liquefazer um gás é mais fácil com:', 'alta pressão e baixa temperatura', ['baixa pressão e alta temperatura', 'só alta temperatura', 'vácuo'], 'aproxima as moléculas']]);
      return mc({ ctx, ok, no, h }); },
  ]);

  topic('q_sol', 'qui', 'Soluções e concentração', [
    L => { const m = pick([5, 10, 20, 30, 40, 50]), V = pick([100, 200, 250, 500, 1000, 2000]);
      return { ctx: `${m} g de soluto em ${V} mL de solução. Concentração comum?`, q: '', a: rd(m / (V / 1000)), u: 'g/L', h: `C = m/V = ${m} ÷ ${f(V / 1000)} = ${f(rd(m / (V / 1000)))}` }; },
    L => { const s = pick(L ? SUBS.filter(x => ['NaOH', 'HCl', 'NaCl', 'C6H12O6', 'H2SO4', 'KOH', 'HNO3'].includes(x[0])) : [SUBS.find(x => x[0] === 'NaOH')]), n = pick([0.1, 0.2, 0.5, 1]), V = pick([0.1, 0.2, 0.25, 0.5, 1, 2]), M = rd(n / V); if (M * 100 % 1) return null;
      return { ctx: `${f(rd(n * s[1]))} g de ${ch(s[0])} (M = ${f(s[1])}) em ${f(V * 1000)} mL de solução. Concentração em mol/L?`, q: '', a: M, u: 'mol/L', h: `n = ${f(n)} mol; ${f(n)} ÷ ${f(V)} L = ${f(M)}` }; },
    L => { if (!L) return null; const C1 = pick([0.5, 1, 2, 4, 6]), V1 = pick([50, 100, 200, 250]), k = pick([2, 4, 5, 10]);
      return Math.random() < .5 ? { ctx: `${V1} mL de solução ${f(C1)} mol/L são diluídos até ${V1 * k} mL. Nova concentração?`, q: '', a: rd(C1 / k), u: 'mol/L', h: `C₁V₁ = C₂V₂ → ${f(C1)} × ${V1} ÷ ${V1 * k} = ${f(rd(C1 / k))}` }
        : { ctx: `Quanta água adicionar a ${V1} mL de solução ${f(C1)} mol/L para chegar a ${f(rd(C1 / k))} mol/L?`, q: '', a: V1 * (k - 1), u: 'mL', h: `volume final ${V1 * k} mL; água = ${V1 * k} − ${V1} = ${V1 * (k - 1)}` }; },
    L => { if (L < 2) return null; let C1, V1, C2, V2, C; do { C1 = pick([0.1, 0.2, 0.5, 1, 2]); C2 = pick([0.1, 0.2, 0.5, 1, 2]); V1 = 100 * ri(1, 4); V2 = 100 * ri(1, 4); C = rd((C1 * V1 + C2 * V2) / (V1 + V2)); } while (C1 === C2 || C * 1000 % 1);
      return { ctx: `Mistura de ${V1} mL a ${f(C1)} mol/L com ${V2} mL a ${f(C2)} mol/L (mesmo soluto). Concentração final?`, q: '', a: C, u: 'mol/L', h: `(${f(C1)}·${V1} + ${f(C2)}·${V2}) ÷ ${V1 + V2} = ${f(C)}` }; },
    L => { const s = pick([5, 10, 20, 25, 40]), tot = pick([100, 200, 500]); return { ctx: `${s * tot / 100} g de soluto em ${tot - s * tot / 100} g de água. Título em massa?`, q: '', a: s, u: '%', h: `${s * tot / 100} ÷ ${tot} (soluto + solvente) = ${s}%` }; },
    L => { if (L < 2) return null; const mg = pick([0.5, 1, 2, 5, 10]), kg = pick([1, 2, 5, 10]);
      return { ctx: `${f(mg)} mg de um contaminante em ${kg} L de água (≈ ${kg} kg). Concentração em ppm?`, q: '', a: rd(mg / kg), u: 'ppm', h: `1 ppm = 1 mg/kg: ${f(mg)} ÷ ${kg} = ${f(rd(mg / kg))}` }; },
    L => { if (!L) return null; const M = pick([0.1, 0.2, 0.5, 1, 2]), s = pick(SUBS.filter(x => ['NaOH', 'HCl', 'NaCl', 'C6H12O6', 'H2SO4'].includes(x[0])));
      return { ctx: `Solução ${f(M)} mol/L de ${ch(s[0])} (M = ${f(s[1])}). Concentração em g/L?`, q: '', a: rd(M * s[1]), u: 'g/L', h: `${f(M)} × ${f(s[1])} = ${f(rd(M * s[1]))}` }; },
    L => { const [fm, i] = pick([['NaCl', 2], ['CaCl2', 3], ['Al2(SO4)3', 5], ['C6H12O6', 1], ['K2SO4', 3], ['AlCl3', 4], ['MgSO4', 2], ['C12H22O11', 1], ['Na3PO4', 4]]);
      return L === 0 ? null : { ctx: `Fator de van't Hoff (i) de ${ch(fm)} totalmente dissociado`, q: '', a: i, h: i === 1 ? 'molecular: não dissocia' : `${fm} libera ${i} íons por fórmula` }; },
    L => { const [ctx, ok, no, h] = pick([
        ['Mesma concentração em mol/L: qual tem maior ponto de ebulição?', `${ch('CaCl2')}`, [ch('NaCl'), ch('C6H12O6'), ch('C12H22O11')], 'mais partículas dissolvidas → maior efeito coligativo (i = 3)'],
        ['Mesma concentração em mol/L: qual congela na temperatura mais baixa?', `${ch('Al2(SO4)3')}`, [ch('NaCl'), ch('CaCl2'), ch('C6H12O6')], 'i = 5: maior abaixamento crioscópico'],
        ['Adicionar um soluto não volátil à água:', 'aumenta o ponto de ebulição', ['diminui o ponto de ebulição', 'aumenta a pressão de vapor', 'aumenta o ponto de congelamento'], 'ebulioscopia; e a pressão de vapor cai'],
        ['Qual solução aquosa conduz corrente elétrica?', `${ch('NaCl')} dissolvido`, ['glicose dissolvida', 'sacarose dissolvida', 'água destilada'], 'precisa de íons livres'],
        ['O efeito Tyndall (feixe de luz visível) identifica:', 'um coloide', ['uma solução verdadeira', 'uma substância pura', 'um gás ideal'], 'partículas coloidais espalham a luz'],
        ['Na osmose, o solvente passa:', 'do meio menos concentrado para o mais concentrado', ['do mais concentrado para o menos', 'nos dois sentidos igualmente', 'só com pressão externa'], 'pela membrana semipermeável']]);
      return mc({ ctx, ok, no, h }); },
  ]);

  topic('q_ato', 'qui', 'Átomo e tabela periódica', [
    L => { const e = pick(ELS); return { ctx: `Quantos nêutrons tem <sup>${e[2]}</sup>${e[0]} (Z = ${e[1]})?`, q: '', a: e[2] - e[1], h: `n = A − Z = ${e[2]} − ${e[1]} = ${e[2] - e[1]}` }; },
    L => { const [s, Z, c] = pick(IONS); const q = c.includes('+') ? +c.replace('+', '') || 1 : -(+c.replace('−', '') || 1);
      return { ctx: `Quantos elétrons tem o íon ${s}<sup>${c}</sup> (Z = ${Z})?`, q: '', a: Z - q, h: `${q > 0 ? 'perde' : 'ganha'} ${Math.abs(q)}: ${Z} ${q > 0 ? '−' : '+'} ${Math.abs(q)} = ${Z - q}` }; },
    L => { if (!L) return null; const e = pick(ELS.filter(x => x[1] <= 20 && x[1] > 2)); const v = e[4] <= 2 ? e[4] : e[4] - 10;
      return Math.random() < .5 ? { ctx: `Elétrons na camada de valência do ${e[3]} (Z = ${e[1]})`, q: '', a: v, h: `${distrib(e[1])} → ${v} na última camada (grupo ${e[4]})` }
        : { ctx: `Em que período está o ${e[3]} (Z = ${e[1]})?`, q: '', a: period(e[1]), h: `${distrib(e[1])} → ${period(e[1])} camadas` }; },
    L => { if (L < 2) return null; const order = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 6]], i = ri(1, 7), e = ri(1, order[i][1]); const Z = order.slice(0, i).reduce((s, x) => s + x[1], 0) + e;
      return { ctx: `A distribuição eletrônica de um átomo neutro termina em ${order[i][0]}<sup>${e}</sup>. Número atômico?`, q: 'Z', a: Z, h: `${distrib(Z)} → soma = ${Z}` }; },
    L => { if (L < 2) return null; const [nm, Z, sub, n] = pick([['ferro', 26, '3d', 6], ['zinco', 30, '3d', 10], ['manganês', 25, '3d', 5], ['cálcio', 20, '4s', 2], ['bromo', 35, '4p', 5], ['titânio', 22, '3d', 2]]);
      return { ctx: `Quantos elétrons no subnível ${sub} do ${nm} (Z = ${Z})?`, q: '', a: n, h: distrib(Z) }; },
    L => { if (!L) return null; const [s, Z, ch_] = pick([['Mg', 12, 2], ['Al', 13, 3], ['K', 19, 1], ['S', 16, -2], ['Cl', 17, -1], ['O', 8, -2], ['N', 7, -3], ['Ca', 20, 2], ['F', 9, -1], ['Na', 11, 1]]);
      return { ctx: `Carga do íon mais estável do ${s} (Z = ${Z}), com sinal`, q: '', a: ch_, h: ch_ > 0 ? `perde ${ch_} elétron(s) e fica com o octeto do gás nobre anterior` : `ganha ${-ch_} elétron(s) para completar o octeto` }; },
    L => { const [ctx, ok, no, h] = pick(L === 0 ? PERIODIC.slice(0, 6) : PERIODIC); return mc({ ctx, ok, no, h }); },
  ]);

  topic('q_rad', 'qui', 'Radioatividade', [
    L => { const m0 = pick([16, 32, 40, 64, 80, 100, 120, 200]), n = ri(1, [3, 4, 5][L]), T = pick([2, 5, 8, 10, 20, 30]);
      return { ctx: `${m0} g de um isótopo com meia-vida de ${T} anos. Quanto resta após ${n * T} anos?`, q: '', a: rd(m0 / 2 ** n), u: 'g', h: `${n} meias-vidas: ${m0} ÷ ${sup(2, n)} = ${f(rd(m0 / 2 ** n))}` }; },
    L => { const n = ri(1, 5), T = pick([3, 5, 8, 12, 28, 5730]), r = rd(100 / 2 ** n);
      return L === 0 ? { ctx: `Depois de ${n} meia${n > 1 ? 's' : ''}-vida${n > 1 ? 's' : ''}, que porcentagem resta?`, q: '', a: r, u: '%', h: `(1/2)<sup>${n}</sup> = ${f(r)}%` }
        : { ctx: `Meia-vida de ${f(T)} anos. Em quanto tempo resta ${f(r)}% da amostra?`, q: '', a: n * T, u: 'anos', h: `${f(r)}% = (1/2)<sup>${n}</sup> → ${n} × ${f(T)} = ${f(n * T)}` }; },
    L => { const [nm, A, Z] = pick([['urânio-238', 238, 92], ['rádio-226', 226, 88], ['polônio-210', 210, 84], ['tório-232', 232, 90], ['carbono-14', 14, 6], ['césio-137', 137, 55]]), alpha = A > 20 && (L === 0 || Math.random() < .5), askA = Math.random() < .5;
      if (alpha) return { ctx: `O ${nm} (Z = ${Z}) emite uma partícula α. ${askA ? 'Número de massa' : 'Número atômico'} do produto?`, q: '', a: askA ? A - 4 : Z - 2, h: `α = ⁴₂He: A − 4 = ${A - 4}, Z − 2 = ${Z - 2}` };
      return { ctx: `O ${nm} (Z = ${Z}) emite uma partícula β⁻. ${askA ? 'Número de massa' : 'Número atômico'} do produto?`, q: '', a: askA ? A : Z + 1, h: `β⁻: um nêutron vira próton: A igual (${A}), Z + 1 = ${Z + 1}` }; },
    L => { if (L < 2) return null; const [p, A0, Z0, d, A1, Z1] = pick([['²³⁸U', 238, 92, '²⁰⁶Pb', 206, 82], ['²³²Th', 232, 90, '²⁰⁸Pb', 208, 82], ['²³⁵U', 235, 92, '²⁰⁷Pb', 207, 82], ['²²⁶Ra', 226, 88, '²⁰⁶Pb', 206, 82]]), a = (A0 - A1) / 4, b = 2 * a - (Z0 - Z1), askA = Math.random() < .5;
      return { ctx: `Na série ${p} (Z = ${Z0}) → ${d} (Z = ${Z1}), quantas partículas ${askA ? 'α' : 'β'} são emitidas?`, q: '', a: askA ? a : b, h: `α = (${A0} − ${A1})/4 = ${a}; β = 2·${a} − (${Z0} − ${Z1}) = ${b}` }; },
    L => { if (L < 2) return null; const n = ri(1, 3); return { ctx: `Um fóssil tem ${f(rd(100 / 2 ** n))}% do carbono-14 de um ser vivo (meia-vida 5.730 anos). Idade?`, q: '', a: 5730 * n, u: 'anos', h: `${n} meia(s)-vida(s): ${n} × 5.730 = ${f(5730 * n)}` }; },
    L => { const [ctx, ok, no, h] = pick([
        ['Qual radiação tem o maior poder de penetração?', 'gama (γ)', ['alfa (α)', 'beta (β)', 'todas iguais'], 'γ é onda eletromagnética; α é barrada por papel'],
        ['A partícula alfa é formada por:', '2 prótons e 2 nêutrons', ['1 elétron', '1 próton', 'um fóton'], 'é um núcleo de hélio'],
        ['A partícula beta (β⁻) é:', 'um elétron emitido pelo núcleo', ['um núcleo de hélio', 'um fóton', 'um próton'], 'nêutron → próton + elétron'],
        ['A energia das estrelas vem de:', 'fusão nuclear', ['fissão nuclear', 'decaimento alfa', 'combustão'], 'núcleos leves se unem'],
        ['Usinas nucleares atuais geram energia por:', 'fissão nuclear', ['fusão nuclear', 'decaimento beta', 'combustão do urânio'], 'núcleos pesados se partem'],
        ['A meia-vida de um isótopo, ao aquecer a amostra:', 'não muda', ['diminui', 'aumenta', 'zera'], 'decaimento nuclear não depende de T, P ou ligações químicas'],
        ['Átomos com mesmo Z e diferente A são:', 'isótopos', ['isóbaros', 'isótonos', 'isoeletrônicos'], 'mesmo elemento, nêutrons diferentes']]);
      return mc({ ctx, ok, no, h }); },
  ]);

  topic('q_lig', 'qui', 'Ligações e interações', [
    L => { const [fm, t] = pick([['NaCl', 'iônica'], ['KBr', 'iônica'], ['CaO', 'iônica'], ['MgCl2', 'iônica'], ['H2O', 'covalente'], ['CO2', 'covalente'], ['CH4', 'covalente'], ['NH3', 'covalente'], ['HCl', 'covalente'], ['Cl2', 'covalente'], ['Fe', 'metálica'], ['Cu', 'metálica'], ['Al', 'metálica']]);
      return mc({ ctx: `Ligação predominante em ${ch(fm)}`, ok: t, no: ['iônica', 'covalente', 'metálica'], h: 'metal + ametal: iônica; ametal + ametal: covalente; metal puro: metálica' }); },
    L => { if (!L) return null; const apo = Math.random() < .5, polar = ['H2O', 'NH3', 'HCl', 'CHCl3', 'HF', 'SO2', 'H2S'], apolar = ['CO2', 'CH4', 'CCl4', 'BF3', 'O2', 'N2', 'C2H6'];
      const ok = pick(apo ? apolar : polar), no = shuffle(apo ? polar : apolar).slice(0, 3).map(ch);
      return mc({ ctx: `Qual destas moléculas é ${apo ? 'apolar' : 'polar'}?`, ok: ch(ok), no, h: 'simétricas (CO₂, CH₄, CCl₄, BF₃) cancelam os dipolos; H₂O, NH₃ e HCl não' }); },
    L => { if (!L) return null; const [fm, g] = pick([['H2O', 'angular'], ['CO2', 'linear'], ['NH3', 'piramidal'], ['CH4', 'tetraédrica'], ['BF3', 'trigonal plana'], ['SO2', 'angular'], ['CCl4', 'tetraédrica'], ['HCN', 'linear']]);
      return mc({ ctx: `Geometria de ${ch(fm)}`, ok: g, no: ['angular', 'linear', 'piramidal', 'tetraédrica', 'trigonal plana'], h: 'conte pares ligantes e não ligantes no átomo central (pares livres empurram: H₂O angular, NH₃ piramidal)' }); },
    L => { if (!L) return null; const [fm, t] = pick([['H2O', 'ligação de hidrogênio'], ['NH3', 'ligação de hidrogênio'], ['HF', 'ligação de hidrogênio'], ['CH3OH', 'ligação de hidrogênio'], ['HCl', 'dipolo-dipolo'], ['H2S', 'dipolo-dipolo'], ['CH4', 'dipolo induzido (London)'], ['CO2', 'dipolo induzido (London)'], ['N2', 'dipolo induzido (London)'], ['I2', 'dipolo induzido (London)']]);
      return mc({ ctx: `Interação intermolecular predominante em ${ch(fm)}`, ok: t, no: ['ligação de hidrogênio', 'dipolo-dipolo', 'dipolo induzido (London)', 'ligação iônica'], h: 'H ligado a F, O ou N → ligação de hidrogênio; polar → dipolo-dipolo; apolar → London' }); },
    L => { if (!L) return null; const [m, a, n] = pick([['Na', 'S', 3], ['Ca', 'Cl', 3], ['Al', 'O', 5], ['Mg', 'N', 5], ['Al', 'Cl', 4], ['K', 'O', 3], ['Mg', 'O', 2], ['Ca', 'N', 5], ['Al', 'S', 5], ['Na', 'N', 4]]);
      return { ctx: `Quantos íons há na fórmula unitária do composto entre ${m} e ${a}?`, q: '', a: n, h: `cargas ${ION_CH[m]} e ${ION_CH[a]}: cruze as cargas → ${n} íons` }; },
    L => { const [fm, n] = pick([['H2', 1], ['O2', 2], ['N2', 3], ['H2O', 2], ['NH3', 3], ['CH4', 4], ['CO2', 4], ['HCN', 4], ['C2H4', 6], ['C2H2', 5], ['Cl2', 1]]);
      return { ctx: `Quantos pares de elétrons são compartilhados em ${ch(fm)}?`, q: '', a: n, h: 'simples = 1 par, dupla = 2, tripla = 3' }; },
    L => { const [ctx, ok, no, h] = pick([
        ['Por que a água (18 g/mol) ferve a 100 °C e o H₂S (34 g/mol) a −60 °C?', 'ligações de hidrogênio na água', ['a água é mais pesada', 'o H₂S é iônico', 'o H₂S é polar e a água não'], 'interações mais fortes → ponto de ebulição maior'],
        ['Óleo e água não se misturam porque:', 'o óleo é apolar e a água é polar', ['o óleo é mais denso', 'a água é apolar', 'ambos são iônicos'], 'semelhante dissolve semelhante'],
        ['Metais conduzem eletricidade porque têm:', 'elétrons livres (mar de elétrons)', ['íons livres em solução', 'ligações covalentes', 'pares de elétrons fixos'], 'ligação metálica'],
        ['Sólidos iônicos conduzem corrente:', 'fundidos ou dissolvidos', ['no estado sólido', 'nunca', 'só no vácuo'], 'íons precisam ficar livres'],
        ['Entre propano, butano e pentano, maior ponto de ebulição tem o:', 'pentano', ['propano', 'butano', 'todos iguais'], 'cadeia maior → mais interações de London']]);
      return mc({ ctx, ok, no, h }); },
  ]);

  topic('q_est', 'qui', 'Estequiometria', [
    L => { const r = pick(RX.slice(0, [8, 14, 18][L])); return { ctx: 'Soma dos menores coeficientes inteiros, após balancear', q: eqTxt(r, false), a: r.c.reduce((s, x) => s + x, 0), h: eqTxt(r, true) }; },
    L => { if (!L) return null; const r = pick(RX), i = ri(0, r.sp.length - 1); return { ctx: `Coeficiente de ${ch(r.sp[i])} na equação balanceada`, q: eqTxt(r, false), a: r.c[i], h: eqTxt(r, true) }; },
    L => { const r = pick(RX), i = ri(0, r.sp.length - 1); let j = ri(0, r.sp.length - 1); if (i === j) j = (j + 1) % r.sp.length; const k = pick([1, 2, 3, 0.5]), ni = rd(k * r.c[i]), nj = rd(k * r.c[j]);
      return { ctx: `${eqTxt(r, true)}<br>${f(ni)} mol de ${ch(r.sp[i])} correspondem a quantos mol de ${ch(r.sp[j])}?`, q: '', a: nj, u: 'mol', h: `proporção ${r.c[i]} : ${r.c[j]} → ${f(nj)}` }; },
    L => { if (!L) return null; const r = pick(RX.filter(x => x.M.every(m => Number.isInteger(m)))), i = ri(0, r.nR - 1), j = ri(r.nR, r.sp.length - 1), k = pick([0.5, 1, 2]), mi = rd(k * r.c[i] * r.M[i]), mj = rd(k * r.c[j] * r.M[j]);
      return { ctx: `${eqTxt(r, true)}<br>Massas molares: ${r.sp.map((s, x) => `${ch(s)} ${r.M[x]}`).join(', ')}.<br>${f(mi)} g de ${ch(r.sp[i])} produzem quantos gramas de ${ch(r.sp[j])}?`, q: '', a: mj, u: 'g', h: `${f(mi)} g = ${f(rd(k * r.c[i]))} mol → ${f(rd(k * r.c[j]))} mol de ${r.sp[j]} × ${r.M[j]} = ${f(mj)}` }; },
    L => { if (L < 2) return null; const r = pick(RX.filter(x => x.sp.slice(x.nR).some(s => GASES.includes(s)))), j = r.sp.findIndex((s, x) => x >= r.nR && GASES.includes(s)), k = pick([0.5, 1, 2]);
      return { ctx: `${eqTxt(r, true)}<br>Reagindo ${f(rd(k * r.c[0]))} mol de ${ch(r.sp[0])}, que volume de ${ch(r.sp[j])} se forma nas CNTP?`, q: '', a: rd(22.4 * k * r.c[j]), u: 'L', h: `${f(rd(k * r.c[j]))} mol × 22,4 = ${f(rd(22.4 * k * r.c[j]))}` }; },
    L => { const a = ri(2, 30), b = ri(2, 30), c = ri(1, a + b - 1);
      return L === 0 ? { ctx: `Em sistema fechado, ${a} g de A reagem totalmente com ${b} g de B, formando C. Massa de C?`, q: '', a: a + b, u: 'g', h: 'Lavoisier: a massa se conserva' }
        : { ctx: `${a} g de A + ${b} g de B formam ${c} g de C e mais D. Massa de D?`, q: '', a: a + b - c, u: 'g', h: `${a + b} − ${c} = ${a + b - c}` }; },
    L => { const k = ri(2, 5); return { ctx: `2 g de hidrogênio reagem com 16 g de oxigênio formando água. Com ${2 * k} g de hidrogênio, quantos gramas de oxigênio reagem?`, q: '', a: 16 * k, u: 'g', h: `Proust: proporção fixa 2 : 16 → ${2 * k} : ${16 * k}` }; },
    L => { if (L < 2) return null; const [nN, nH] = pick([[2, 3], [1, 6], [3, 3], [2, 9], [2, 1.5]]), lim = Math.min(nN, nH / 3), p = rd(2 * lim);
      return { ctx: `N₂ + 3 H₂ → 2 NH₃. Com ${nN} mol de N₂ e ${nH} mol de H₂, quantos mol de NH₃ no máximo?`, q: '', a: p, u: 'mol', h: `H₂ dá para ${f(rd(nH / 3))} mol de "reação", N₂ para ${nN}: limitante é o ${nN < nH / 3 ? 'N₂' : 'H₂'} → ${f(p)} mol` }; },
    L => { if (L < 2) return null; const m = pick([100, 200, 500]), p = pick([50, 80, 90]), r = pick([50, 80, 100]); const co2 = rd(m * p / 100 / 100 * 44 * r / 100);
      return { ctx: `CaCO₃ → CaO + CO₂ (100 e 44 g/mol). ${m} g de calcário com ${p}% de CaCO₃, rendimento de ${r}%. Massa de CO₂?`, q: '', a: co2, u: 'g', h: `${f(m * p / 100)} g puros = ${f(m * p / 10000)} mol → ${f(rd(m * p / 10000 * 44))} g × ${r}% = ${f(co2)}` }; },
  ]);

  topic('q_ter', 'qui', 'Termoquímica', [
    L => { const [ctx, ok, no, h] = pick([
        ['A fusão do gelo é um processo:', 'endotérmico', ['exotérmico', 'sem troca de calor', 'nuclear'], 'absorve calor'],
        ['A combustão do etanol é:', 'exotérmica (ΔH < 0)', ['endotérmica (ΔH > 0)', 'ΔH = 0', 'depende do recipiente'], 'libera calor'],
        ['A condensação do vapor d\'água é:', 'exotérmica', ['endotérmica', 'sem calor envolvido', 'química'], 'o inverso da vaporização'],
        ['A fotossíntese é um processo:', 'endotérmico', ['exotérmico', 'nuclear', 'sem energia'], 'absorve energia luminosa'],
        ['A entalpia de formação do O₂(g) no estado padrão vale:', 'zero', ['−286 kJ/mol', '+498 kJ/mol', '−394 kJ/mol'], 'substância simples na forma mais estável: ΔH<sub>f</sub> = 0'],
        ['Um catalisador altera:', 'a energia de ativação', ['o ΔH da reação', 'a constante de equilíbrio', 'os produtos formados'], 'muda o caminho, não o balanço de energia'],
        ['Romper ligações químicas:', 'absorve energia', ['libera energia', 'não envolve energia', 'depende da ligação'], 'formar ligações libera']]);
      return mc({ ctx, ok, no, h }); },
    L => { const x = 10 * ri(-30, 30) || 50, y = 10 * ri(-30, 30) || -40, k = pick(['sum', 'inv', 'dbl']);
      if (k === 'sum' || L === 0) return { ctx: `A → B, ΔH = ${x} kJ; B → C, ΔH = ${y} kJ. ΔH de A → C?`, q: '', a: x + y, u: 'kJ', h: `Hess: some as etapas: ${x} + (${y}) = ${x + y}` };
      if (k === 'inv') return { ctx: `A → B, ΔH = ${x} kJ; B → C, ΔH = ${y} kJ. ΔH de C → A?`, q: '', a: -(x + y), u: 'kJ', h: `inverter troca o sinal: −(${x + y}) = ${-(x + y)}` };
      return { ctx: `A → 2 B, ΔH = ${x} kJ. ΔH de 2 A → 4 B?`, q: '', a: 2 * x, u: 'kJ', h: 'multiplicar a equação multiplica o ΔH' }; },
    L => { if (!L) return null; const [txt, v, h] = pick([
        ['CH₄ + 2 O₂ → CO₂ + 2 H₂O. ΔH<sub>f</sub>: CH₄ = −75, CO₂ = −394, H₂O(l) = −286 (kJ/mol), O₂ = 0. ΔH da combustão?', -891, '(−394 + 2·(−286)) − (−75) = −966 + 75'],
        ['C + O₂ → CO₂ tem ΔH = −394 kJ; CO + ½ O₂ → CO₂ tem ΔH = −283 kJ. ΔH de C + ½ O₂ → CO?', -111, 'primeira − segunda: −394 − (−283)'],
        ['2 H₂ + O₂ → 2 H₂O(l), ΔH = −572 kJ. ΔH de formação de 1 mol de H₂O(l)?', -286, '−572 ÷ 2'],
        ['CaCO₃ → CaO + CO₂. ΔH<sub>f</sub>: CaCO₃ = −1207, CaO = −635, CO₂ = −394 (kJ/mol). ΔH?', 178, '(−635 − 394) − (−1207) = −1029 + 1207']]);
      return { ctx: txt, q: '', a: v, u: 'kJ', h: `ΔH = Σ produtos − Σ reagentes: ${h} = ${v}` }; },
    L => { if (L < 2) return null; const [txt, v, h] = pick([
        ['H₂ + Cl₂ → 2 HCl. Energias de ligação (kJ/mol): H–H 436, Cl–Cl 243, H–Cl 432. ΔH?', -185, '436 + 243 − 2·432'],
        ['N₂ + 3 H₂ → 2 NH₃. Energias (kJ/mol): N≡N 946, H–H 436, N–H 391. ΔH?', -92, '946 + 3·436 − 6·391 = 2254 − 2346'],
        ['H₂ + F₂ → 2 HF. Energias (kJ/mol): H–H 436, F–F 158, H–F 568. ΔH?', -542, '436 + 158 − 2·568'],
        ['A₂ + B₂ → 2 AB. Energias (kJ/mol): A–A 200, B–B 300, A–B 150. ΔH?', 200, '200 + 300 − 2·150']]);
      return { ctx: txt, q: '', a: v, u: 'kJ', h: `quebradas (+) − formadas: ${h} = ${v}` }; },
    L => { if (!L) return null; const [nm, M, dH] = pick([['metano', 16, 890], ['etanol', 46, 1368], ['hidrogênio', 2, 286], ['glicose', 180, 2800]]), k = pick([0.5, 2, 3, 0.25]);
      return { ctx: `A combustão do ${nm} libera ${f(dH)} kJ/mol (M = ${M} g/mol). Calor liberado por ${f(rd(M * k))} g?`, q: '', a: rd(dH * k), u: 'kJ', h: `${f(rd(M * k))} g = ${f(k)} mol × ${f(dH)} = ${f(rd(dH * k))}` }; },
  ]);

  topic('q_cin', 'qui', 'Cinética química', [
    L => { const d = pick([0.2, 0.4, 0.6, 0.8, 1.2, 2]), t = pick([2, 4, 5, 10]); return { ctx: `A concentração de um reagente cai ${f(d)} mol/L em ${t} min. Velocidade média?`, q: '', a: rd(d / t), u: 'mol/L·min', h: `${f(d)} ÷ ${t} = ${f(rd(d / t))}` }; },
    L => { if (!L) return null; const [eq, a, b, ca, cb] = pick([['N₂ + 3 H₂ → 2 NH₃', 'N₂', 'NH₃', 1, 2], ['N₂ + 3 H₂ → 2 NH₃', 'N₂', 'H₂', 1, 3], ['2 SO₂ + O₂ → 2 SO₃', 'O₂', 'SO₃', 1, 2], ['2 H₂O₂ → 2 H₂O + O₂', 'H₂O₂', 'O₂', 2, 1]]), v = pick([0.1, 0.2, 0.4, 0.6]);
      return { ctx: `${eq}. Se ${a} é consumido a ${f(v)} mol/L·s, ${b} ${cb > 0 && b !== 'H₂' ? 'é formado' : 'é consumido'} a:`, q: '', a: rd(v * cb / ca), u: 'mol/L·s', h: `proporção dos coeficientes ${ca} : ${cb}` }; },
    L => { const o = ri(1, 3), k = ri(2, 3); return { ctx: `Reação de ordem ${o} em A. Se [A] fica ${k} vezes maior, a velocidade fica multiplicada por:`, q: '', a: k ** o, h: `v ∝ [A]<sup>${o}</sup>: ${k}<sup>${o}</sup> = ${k ** o}` }; },
    L => { if (!L) return null; const a = ri(1, 2), b = ri(0, 2), ka = 2, kb = pick([2, 3]);
      return { ctx: `v = k[A]<sup>${a}</sup>[B]<sup>${b}</sup>. Dobrando [A] e multiplicando [B] por ${kb}, a velocidade fica multiplicada por:`, q: '', a: ka ** a * kb ** b, h: `${ka}<sup>${a}</sup> × ${kb}<sup>${b}</sup> = ${ka ** a * kb ** b}` }; },
    L => { if (!L) return null; const o = ri(0, 3); return { ctx: `Ao dobrar [A], a velocidade fica multiplicada por ${2 ** o}. Ordem em relação a A?`, q: '', a: o, h: `2<sup>n</sup> = ${2 ** o} → n = ${o}` }; },
    L => { if (!L) return null; const d = 10 * ri(1, 4); return { ctx: `Pela regra de Van't Hoff (dobra a cada 10 °C), aquecer ${d} °C multiplica a velocidade por:`, q: '', a: 2 ** (d / 10), h: `${d / 10} dobras: ${sup(2, d / 10)}` }; },
    L => { if (L < 2) return null; const R = 10 * ri(1, 5), C = R + 10 * ri(3, 8), P = 10 * ri(0, (C - 10) / 10), k = pick(['Ea', 'dH', 'Ear']);
      if (k === 'Ea') return { ctx: `Energias: reagentes ${R} kJ, complexo ativado ${C} kJ, produtos ${P} kJ. Energia de ativação (direta)?`, q: '', a: C - R, u: 'kJ', h: `${C} − ${R}` };
      if (k === 'dH') return { ctx: `Energias: reagentes ${R} kJ, complexo ativado ${C} kJ, produtos ${P} kJ. ΔH?`, q: '', a: P - R, u: 'kJ', h: `${P} − ${R}` };
      return { ctx: `Energias: reagentes ${R} kJ, complexo ativado ${C} kJ, produtos ${P} kJ. Energia de ativação da reação inversa?`, q: '', a: C - P, u: 'kJ', h: `${C} − ${P}` }; },
    L => { const [ctx, ok, no, h] = pick([
        ['Um comprimido efervescente reage mais rápido:', 'triturado', ['inteiro', 'na geladeira', 'em água gelada'], 'maior superfície de contato'],
        ['Aumentar a temperatura acelera a reação porque:', 'aumenta a fração de colisões com energia suficiente', ['diminui o ΔH', 'diminui a energia de ativação', 'muda o equilíbrio para os produtos'], 'mais moléculas superam Ea'],
        ['Um catalisador acelera a reação porque:', 'oferece um caminho com menor energia de ativação', ['aumenta a temperatura', 'é consumido na reação', 'aumenta o ΔH'], 'é recuperado no fim'],
        ['Para uma reação elementar 2 A + B → C, a lei de velocidade é:', 'v = k[A]²[B]', ['v = k[A][B]', 'v = k[C]', 'v = k[A]²'], 'elementar: expoentes = coeficientes'],
        ['Colisão efetiva exige:', 'energia mínima e orientação adequada', ['só alta temperatura', 'só catalisador', 'só alta pressão'], 'teoria das colisões'],
        ['Alimentos na geladeira estragam mais devagar porque:', 'a temperatura menor reduz a velocidade das reações', ['o frio é um catalisador', 'não há oxigênio', 'a pressão aumenta'], 'menos colisões efetivas']]);
      return mc({ ctx, ok, no, h }); },
  ]);

  topic('q_eq', 'qui', 'Equilíbrio e pH', [
    L => { const n = ri(1, 13), k = pick(['pH', 'pOH', 'oh']);
      if (k === 'pH' || L === 0) return { ctx: `[H⁺] = ${p10(-n)} mol/L. pH?`, q: '', a: n, h: `pH = −log[H⁺] = ${n}` };
      if (k === 'pOH') return { ctx: `pH = ${n} a 25 °C. pOH?`, q: '', a: 14 - n, h: `pH + pOH = 14` };
      return { ctx: `[OH⁻] = ${p10(-n)} mol/L a 25 °C. pH?`, q: '', a: 14 - n, h: `pOH = ${n} → pH = ${14 - n}` }; },
    L => { if (!L) return null; const [nm, c, ph, h] = pick([['HCl', '0,01', 2, '[H⁺] = 10⁻²'], ['HCl', '0,001', 3, '[H⁺] = 10⁻³'], ['NaOH', '0,01', 12, '[OH⁻] = 10⁻² → pOH 2'], ['NaOH', '0,001', 11, 'pOH 3'], ['HNO₃', '0,1', 1, '[H⁺] = 10⁻¹'], ['H₂SO₄', '0,005', 2, '2 H⁺ por fórmula: 0,01'], ['KOH', '0,1', 13, 'pOH 1']]);
      return { ctx: `pH de uma solução ${c} mol/L de ${nm} (eletrólito forte)`, q: '', a: ph, h }; },
    L => { if (!L) return null; const a = ri(1, 6), d = ri(1, 4); return Math.random() < .5 ? { ctx: `Quantas vezes a [H⁺] de uma solução de pH ${a} é maior que a de pH ${a + d}?`, q: '', a: 10 ** d, h: `cada unidade de pH = × 10: ${sup(10, d)}` }
        : { ctx: `Um ácido forte de pH ${a} é diluído ${f(10 ** d)} vezes. Novo pH?`, q: '', a: a + d, h: `[H⁺] ÷ ${sup(10, d)} → pH + ${d}` }; },
    L => { if (!L) return null; const A = pick([0.1, 0.2, 0.5, 1]), B = pick([0.1, 0.2, 0.5, 1, 2]), Cc = pick([0.2, 0.4, 1, 2]); const K = rd(Cc / (A * B)); if (K * 100 % 1) return null;
      return { ctx: `A + B ⇌ C. No equilíbrio: [A] = ${f(A)}, [B] = ${f(B)}, [C] = ${f(Cc)} mol/L. Kc?`, q: '', a: K, h: `Kc = [C]/([A][B]) = ${f(Cc)} ÷ ${f(rd(A * B))} = ${f(K)}` }; },
    L => { if (L < 2) return null; const K = pick([2, 4, 5, 10, 0.5]), k = pick(['inv', 'dbl']);
      return k === 'inv' ? { ctx: `A reação direta tem K = ${f(K)}. K da reação inversa?`, q: '', a: rd(1 / K), h: `1/K = ${f(rd(1 / K))}` } : { ctx: `aA ⇌ bB tem K = ${f(K)}. K de 2aA ⇌ 2bB?`, q: '', a: rd(K * K), h: `multiplicar a equação por 2 eleva K ao quadrado: ${f(rd(K * K))}` }; },
    L => { if (L < 2) return null; const [K, e, s] = pick([['10⁻¹⁰', 'AB', -5], ['10⁻¹²', 'AB', -6], ['10⁻⁸', 'AB', -4], ['4 × 10⁻¹²', 'AB₂', -4], ['4 × 10⁻⁹', 'AB₂', -3]]);
      return { ctx: `Sal ${e} com Kps = ${K}. Solubilidade = 10<sup>x</sup> mol/L. x?`, q: '', a: s, h: e === 'AB' ? 'Kps = s² → s = √Kps' : 'Kps = 4s³ → s = ∛(Kps/4)' }; },
    L => { if (L < 2) return null; const c = pick([0.1, 1, 0.01]), a = pick([1, 10, 0.1].filter(x => c * x / 100 >= 1e-6)); const H = c * a / 100, ph = Math.round(-Math.log10(H));
      return { ctx: `Ácido fraco ${f(c)} mol/L com grau de ionização ${f(a)}%. pH?`, q: '', a: ph, h: `[H⁺] = ${f(c)} × ${f(a / 100)} = ${f(H)} = ${p10(-ph)}` }; },
    L => { const [ctx, ok, no, h] = pick(L === 0 ? EQMC.slice(0, 5) : EQMC); return mc({ ctx, ok, no, h }); },
  ]);

  topic('q_elq', 'qui', 'Eletroquímica', [
    L => { const [fm, el, n] = pick(NOX.slice(0, [10, 20, NOX.length][L])); return { ctx: `Número de oxidação do ${el} em ${ch(fm)}`, q: '', a: n, h: 'H = +1, O = −2 (exceto peróxidos e hidretos), metais alcalinos +1, alcalino-terrosos +2; a soma dá a carga total' }; },
    L => { if (!L) return null; let a, b; do { a = pick(POT); b = pick(POT); } while (a === b); const [hi, lo] = a[1] > b[1] ? [a, b] : [b, a];
      return { ctx: `Pilha com ${hi[0]} (E° = ${sgn(hi[1])} V) e ${lo[0]} (E° = ${sgn(lo[1])} V). ddp padrão?`, q: '', a: rd(hi[1] - lo[1]), u: 'V', h: `maior − menor potencial de redução: ${sgn(hi[1])} − (${sgn(lo[1])}) = ${f(rd(hi[1] - lo[1]))}` }; },
    L => { let a, b; do { a = pick(POT); b = pick(POT); } while (a === b || a[0].includes('H')); const [hi, lo] = a[1] > b[1] ? [a, b] : [b, a]; const metal = x => x[0].split('/')[1];
      const k = pick(['an', 'cat', 'ox']);
      if (k === 'an') return mc({ ctx: `Pilha ${hi[0]} (${sgn(hi[1])} V) e ${lo[0]} (${sgn(lo[1])} V). Qual eletrodo é o ânodo (polo −)?`, ok: metal(lo), no: [metal(hi)], h: 'o menor potencial de redução oxida: ânodo' });
      if (k === 'cat') return mc({ ctx: `Pilha ${hi[0]} (${sgn(hi[1])} V) e ${lo[0]} (${sgn(lo[1])} V). Em qual eletrodo ocorre redução?`, ok: metal(hi), no: [metal(lo)], h: 'cátodo = maior potencial de redução' });
      return mc({ ctx: `Pilha ${hi[0]} (${sgn(hi[1])} V) e ${lo[0]} (${sgn(lo[1])} V). Qual eletrodo perde massa?`, ok: metal(lo), no: [metal(hi)], h: 'o ânodo oxida e se dissolve' }); },
    L => { const [eq, ox, red, e] = pick([['Zn + Cu²⁺ → Zn²⁺ + Cu', 'Cu²⁺', 'Zn', 2], ['Fe + 2 H⁺ → Fe²⁺ + H₂', 'H⁺', 'Fe', 2], ['2 Al + 3 Cu²⁺ → 2 Al³⁺ + 3 Cu', 'Cu²⁺', 'Al', 6], ['Cu + 2 Ag⁺ → Cu²⁺ + 2 Ag', 'Ag⁺', 'Cu', 2], ['Mg + 2 H⁺ → Mg²⁺ + H₂', 'H⁺', 'Mg', 2], ['2 Na + Cl₂ → 2 NaCl', 'Cl₂', 'Na', 2]]), k = pick(L ? ['ox', 'red', 'e'] : ['ox', 'red']);
      if (k === 'e') return { ctx: `${eq}. Quantos elétrons são transferidos (equação como escrita)?`, q: '', a: e, h: `${red} perde o que ${ox} ganha` };
      const all = uniq([ox, red, ...eq.split(/[→+]/).map(s => s.trim().replace(/^\d+ /, ''))]);
      return mc({ ctx: `${eq}. Agente ${k === 'ox' ? 'oxidante' : 'redutor'}?`, ok: k === 'ox' ? ox : red, no: all.filter(x => x !== (k === 'ox' ? ox : red)), h: `${red} se oxida (é o redutor); ${ox} se reduz (é o oxidante)` }); },
    L => { if (!L) return null; const [ion, n, M, nm] = pick([['Ag⁺', 1, 108, 'prata'], ['Cu²⁺', 2, 63.5, 'cobre'], ['Al³⁺', 3, 27, 'alumínio'], ['Zn²⁺', 2, 65, 'zinco'], ['Ni²⁺', 2, 59, 'níquel']]);
      if (L === 1) return { ctx: `Quantos mols de elétrons são necessários para depositar 1 mol de ${nm} a partir de ${ion}?`, q: '', a: n, h: `${ion} + ${n} e⁻ → metal` };
      const mol = pick([0.1, 0.2, 0.5, 1]), Q = rd(mol * 96500); return { ctx: `Passam ${f(Q)} C por uma solução de ${ion} (F = 96.500 C/mol). Massa de ${nm} depositada? (M = ${f(M)})`, q: '', a: rd(mol / n * M), u: 'g', h: `${f(mol)} mol de e⁻ depositam ${f(mol)} ÷ ${n} mol de metal: ${f(mol)}${X}${f(M)} ÷ ${n} = ${f(rd(mol / n * M))}` }; },
    L => { if (L < 2) return null; const i = pick([1, 2, 5, 10, 9.65]), t = pick([965, 1930, 9650, 100, 1000]); const Q = rd(i * t), mol = rd(Q / 96500); if (mol * 1000 % 1) return null;
      return { ctx: `Corrente de ${f(i)} A durante ${f(t)} s. Mols de elétrons? (F = 96.500 C/mol)`, q: '', a: mol, u: 'mol', h: `Q = it = ${f(Q)} C ÷ 96.500 = ${f(mol)}` }; },
    L => { const [ctx, ok, no, h] = pick([
        ['Na pilha, os elétrons fluem pelo fio:', 'do ânodo para o cátodo', ['do cátodo para o ânodo', 'nos dois sentidos', 'pela ponte salina'], 'do polo − para o polo +'],
        ['A ponte salina serve para:', 'manter a neutralidade elétrica das soluções', ['conduzir elétrons', 'aumentar a ddp', 'impedir a reação'], 'íons migram por ela'],
        ['Na eletrólise do NaCl fundido, forma-se no cátodo:', 'sódio metálico', ['gás cloro', 'gás hidrogênio', 'oxigênio'], 'Na⁺ + e⁻ → Na; no ânodo sai Cl₂'],
        ['Na eletrólise de NaCl em água, forma-se no cátodo:', 'gás hidrogênio', ['sódio metálico', 'gás cloro', 'oxigênio'], 'a água se reduz antes do Na⁺'],
        ['Para proteger um casco de ferro da corrosão, liga-se a ele um metal de sacrifício como:', 'magnésio ou zinco', ['cobre', 'prata', 'ouro'], 'menor potencial de redução: oxida no lugar do ferro'],
        ['A eletrólise é um processo:', 'não espontâneo, que consome energia elétrica', ['espontâneo, que gera energia', 'sem transferência de elétrons', 'nuclear'], 'o inverso da pilha'],
        ['Oxidação é:', 'perda de elétrons e aumento do Nox', ['ganho de elétrons', 'diminuição do Nox', 'ganho de prótons'], 'OIL RIG: oxida perde, reduz ganha']]);
      return mc({ ctx, ok, no, h }); },
  ]);

  topic('q_org', 'qui', 'Química orgânica', [
    L => { const [p, n] = pick([['met', 1], ['et', 2], ['prop', 3], ['but', 4], ['pent', 5], ['hex', 6], ['hept', 7], ['oct', 8], ['non', 9], ['dec', 10]]), [suf, name] = pick([['ano', 'alcano'], ['eno', 'alceno'], ['ino', 'alcino'], ['anol', 'álcool'], ['anal', 'aldeído']]); if (n < 2 && suf !== 'ano' && suf !== 'anol' && suf !== 'anal') return null;
      const nm = suf === 'eno' || suf === 'ino' ? (n > 3 ? `${p}-1-${suf}` : `${p}${suf}`) : `${p}${suf}`;
      return { ctx: `Quantos carbonos tem o ${nm}?`, q: '', a: n, h: `prefixo "${p}" = ${n} C` }; },
    L => { if (!L) return null; const [p, n] = pick([['et', 2], ['prop', 3], ['but', 4], ['pent', 5], ['hex', 6], ['hept', 7], ['oct', 8]]), [suf, H, fm] = pick([['ano', 2 * n + 2, 'CₙH₂ₙ₊₂'], ['eno', 2 * n, 'CₙH₂ₙ'], ['ino', 2 * n - 2, 'CₙH₂ₙ₋₂']]), nm = suf !== 'ano' && n > 3 ? `${p}-1-${suf}` : `${p}${suf}`;
      return L === 2 && suf === 'ano' && Math.random() < .5 ? { ctx: `Massa molar do ${nm} (C = 12, H = 1)`, q: '', a: 12 * n + H, u: 'g/mol', h: `C${n}H${H}: ${12 * n} + ${H}` }
        : { ctx: `Quantos hidrogênios tem o ${nm}?`, q: '', a: H, h: `${fm} com n = ${n}: ${H}` }; },
    L => { const pool = ORGF.slice(0, [8, 11, ORGF.length][L]), it = pick(pool), opts = shuffle(uniq(pool.map(x => x[1])).filter(x => x !== it[1])).slice(0, 3);
      return mc({ ctx: 'Função orgânica de', q: it[0], ok: it[1], no: opts, h: it[2] }); },
    L => { if (!L) return null; const [nm, fn] = pick([['propanona', 'cetona'], ['etanal', 'aldeído'], ['ácido etanoico', 'ácido carboxílico'], ['metilamina', 'amina'], ['etanol', 'álcool'], ['metoxietano', 'éter'], ['clorometano', 'haleto orgânico'], ['etanamida', 'amida'], ['fenol (hidroxibenzeno)', 'fenol'], ['etanoato de metila', 'éster']]);
      return mc({ ctx: `O nome "${nm}" indica a função:`, ok: fn, no: shuffle(['cetona', 'aldeído', 'ácido carboxílico', 'amina', 'álcool', 'éter', 'amida', 'éster'].filter(x => x !== fn)).slice(0, 3), h: 'sufixos: -ona cetona, -al aldeído, -ol álcool, -oico ácido, -amina, -amida, -oato éster' }); },
    L => { if (L < 2) return null; const [nm, s, p] = pick([['etano (C₂H₆)', 7, 0], ['eteno (C₂H₄)', 5, 1], ['etino (C₂H₂)', 3, 2], ['benzeno (C₆H₆)', 12, 3], ['CO₂', 2, 2], ['propeno (C₃H₆)', 8, 1], ['metano (CH₄)', 4, 0], ['HCN', 2, 2]]), askP = Math.random() < .5;
      return { ctx: `Quantas ligações ${askP ? 'pi (π)' : 'sigma (σ)'} tem o ${nm}?`, q: '', a: askP ? p : s, h: `toda ligação tem 1 σ; dupla soma 1 π e tripla 2 π: ${s} σ e ${p} π` }; },
    L => { if (L < 2) return null; const [fm, n, h] = pick([['C₄H₁₀', 2, 'butano e metilpropano'], ['C₅H₁₂', 3, 'pentano, metilbutano e dimetilpropano'], ['C₂H₆O', 2, 'etanol e metoximetano'], ['C₃H₈O', 3, 'propan-1-ol, propan-2-ol e metoxietano'], ['C₆H₁₄', 5, 'hexano, 2- e 3-metilpentano, 2,2- e 2,3-dimetilbutano']]);
      return { ctx: `Quantos isômeros estruturais (planos) tem ${fm}?`, q: '', a: n, h }; },
    L => { if (!L) return null; const [ctx, ok, no, h] = pick(ORGMC); return mc({ ctx, ok, no, h }); },
  ]);

  topic('q_amb', 'qui', 'Química e ambiente', [
    L => { const [ctx, ok, no, h] = pick(AMB); return mc({ ctx, ok, no, h }); },
    L => { const [g, p] = pick([['N₂', 78], ['O₂', 21]]); return { ctx: `Porcentagem aproximada de ${g} no ar seco, em volume`, q: '', a: p, u: '%', h: 'ar: ~78% N₂, ~21% O₂, ~0,9% Ar, ~0,04% CO₂' }; },
  ]);
