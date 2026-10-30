  // ================== utilidades e dados para matemática, física e química ==================
  const rd = x => Math.round(x * 1e6) / 1e6;
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const uniq = a => [...new Set(a)];
  // múltipla escolha: a certa + até 3 erradas, embaralhadas; a = índice da certa
  const mc = o => { const opts = shuffle(uniq([o.ok, ...shuffle(o.no.filter(x => x !== o.ok))]).slice(0, 4)); return { ctx: o.ctx || '', q: o.q || '', opts, a: opts.indexOf(o.ok), h: o.h || '' }; };
  const sf = (n, d) => { const g = gcd(n, d); return d / g === 1 ? `${n / g}` : `${n / g}/${d / g}`; };
  const SUPN = { 2: '²', 3: '³', 4: '⁴' };
  const poly = cs => {
    const n = cs.length - 1, parts = [];
    cs.forEach((c, i) => { if (!c) return; const e = n - i, a = Math.abs(c); parts.push([c < 0, (a === 1 && e ? '' : a) + (e ? 'x' + (SUPN[e] || '') : '')]); });
    return parts.length ? parts.map(([neg, b], i) => (i ? (neg ? ' − ' : ' + ') : (neg ? '−' : '')) + b).join('') : '0';
  };
  const mx = (arr, n) => `<span class="mx" style="grid-template-columns:repeat(${n},auto)">${arr.map(x => `<span>${String(x).replace('-', '−')}</span>`).join('')}</span>`;
  const p10 = e => `10<sup>${e < 0 ? '−' + (-e) : e}</sup>`;
  const sgn = x => (x < 0 ? '−' : x > 0 ? '+' : '') + f(Math.abs(x));
  const ch = fm => fm.includes('<') ? fm : fm.replace(/(\d+)/g, '<sub>$1</sub>');
  const AM = { H: 1, He: 4, C: 12, N: 14, O: 16, F: 19, Na: 23, Mg: 24, Al: 27, Si: 28, P: 31, S: 32, Cl: 35.5, K: 39, Ca: 40, Fe: 56, Cu: 63.5, Zn: 65, Ag: 108 };
  const atomMap = fm => {
    const m = {}, re = /\(([^)]+)\)(\d*)|([A-Z][a-z]?)(\d*)/g; let t;
    while ((t = re.exec(fm))) {
      if (t[1]) { const k = +(t[2] || 1), sub = atomMap(t[1]); for (const e in sub) m[e] = (m[e] || 0) + sub[e] * k; }
      else m[t[3]] = (m[t[3]] || 0) + +(t[4] || 1);
    }
    return m;
  };
  const atomCount = fm => Object.values(atomMap(fm)).reduce((s, x) => s + x, 0);
  const atomsTxt = (fm, count) => {
    const e = Object.entries(atomMap(fm));
    return count ? `${e.map(([s, k]) => `${k} ${s}`).join(' + ')} = ${atomCount(fm)}` : e.map(([s, k]) => `${k > 1 ? k + '·' : ''}${f(AM[s])}`).join(' + ');
  };
  const AUFBAU = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 6], ['5s', 2], ['4d', 10], ['5p', 6]];
  const distrib = Z => { const out = []; for (const [s, c] of AUFBAU) { if (Z <= 0) break; const e = Math.min(c, Z); out.push(`${s}<sup>${e}</sup>`); Z -= e; } return out.join(' '); };
  const period = Z => Z <= 2 ? 1 : Z <= 10 ? 2 : Z <= 18 ? 3 : Z <= 36 ? 4 : Z <= 54 ? 5 : Z <= 86 ? 6 : 7;
  const topic = (key, s, name, vs) => {
    // _v guarda qual variação gerou a questão, para o rating de cada tipo de questão
    GEN[key] = { s, name, vs, g(L) {
      for (let i = 0; i < 60; i++) { const v = ri(0, vs.length - 1), q = vs[v](L); if (q) { q._v = v; return q; } }
      for (let v = 0; v < vs.length; v++) { const q = vs[v](L); if (q) { q._v = v; return q; } }
      return null;
    } };
  };
  const EXTRA_ADD = {};
  // pares de resistores/capacitores com equivalente em paralelo inteiro
  const PAIRS = [[3, 6], [4, 12], [6, 12], [10, 10], [20, 30], [2, 2], [6, 6], [10, 15], [12, 24], [5, 20], [30, 60], [4, 4], [8, 8], [15, 30], [10, 40], [6, 30]];

  const ASTRO = [
    ['As estações do ano acontecem principalmente por causa:', 'da inclinação do eixo de rotação da Terra', ['da variação da distância Terra–Sol', 'da rotação da Terra', 'das fases da Lua'], 'o eixo inclinado (~23,5°) muda o ângulo com que a luz chega ao longo do ano'],
    ['Um eclipse lunar só pode ocorrer na fase de:', 'lua cheia', ['lua nova', 'quarto crescente', 'quarto minguante'], 'a Terra fica entre o Sol e a Lua'],
    ['Um eclipse solar só pode ocorrer na fase de:', 'lua nova', ['lua cheia', 'quarto crescente', 'quarto minguante'], 'a Lua fica entre o Sol e a Terra'],
    ['Vemos sempre a mesma face da Lua porque:', 'seu período de rotação é igual ao de translação', ['ela não gira', 'a Terra só ilumina um lado', 'ela gira junto com a Terra em 24 h'], 'rotação sincronizada (~27 dias)'],
    ['A energia do Sol vem da:', 'fusão nuclear de hidrogênio em hélio', ['fissão nuclear de urânio', 'combustão de gases', 'contração gravitacional apenas'], 'no núcleo, a milhões de kelvin'],
    ['Ao fim da vida, o Sol deve se tornar:', 'gigante vermelha e depois anã branca', ['buraco negro', 'estrela de nêutrons', 'supernova'], 'não tem massa suficiente para virar supernova'],
    ['Estrelas muito mais massivas que o Sol terminam como:', 'supernova, deixando estrela de nêutrons ou buraco negro', ['anã branca', 'gigante vermelha para sempre', 'planeta gasoso'], 'quanto maior a massa, mais violento o fim'],
    ['O maior planeta do Sistema Solar é:', 'Júpiter', ['Saturno', 'Netuno', 'Urano'], ''],
    ['O planeta mais próximo do Sol é:', 'Mercúrio', ['Vênus', 'Marte', 'Terra'], 'ordem: Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano, Netuno'],
    ['Ano-luz é uma unidade de:', 'distância', ['tempo', 'velocidade', 'brilho'], 'distância que a luz percorre em 1 ano (≈ 9,5 × 10¹² km)'],
    ['A cor de uma estrela indica principalmente a:', 'temperatura da superfície', ['distância até nós', 'idade apenas', 'composição do núcleo'], 'azuis são mais quentes que vermelhas'],
    ['Planetas mais distantes do Sol têm:', 'período maior e velocidade orbital menor', ['período menor', 'velocidade orbital maior', 'o mesmo período'], 'Kepler: T² ∝ a³'],
    ['Pela 2ª lei de Kepler, um planeta é mais rápido:', 'perto do Sol (periélio)', ['longe do Sol (afélio)', 'sempre igual', 'nos solstícios'], 'varre áreas iguais em tempos iguais'],
    ['Os planetas rochosos (telúricos) são:', 'Mercúrio, Vênus, Terra e Marte', ['Júpiter, Saturno, Urano e Netuno', 'Terra, Marte, Júpiter e Saturno', 'Vênus, Terra, Urano e Netuno'], 'os quatro mais internos'],
    ['O Sistema Solar está:', 'num braço da Via Láctea, longe do centro', ['no centro da Via Láctea', 'fora de qualquer galáxia', 'no centro do Universo'], ''],
    ['Um satélite geoestacionário tem período de:', 'cerca de 24 horas', ['cerca de 90 minutos', 'cerca de 27 dias', '1 ano'], 'acompanha a rotação da Terra'],
    ['Um astronauta "flutua" na estação espacial porque:', 'está em queda livre junto com a estação', ['lá não há gravidade', 'o vácuo anula a gravidade', 'está longe demais da Terra'], 'a gravidade lá ainda é cerca de 90% da superfície'],
    ['As fases da Lua acontecem porque:', 'vemos partes diferentes da face iluminada pelo Sol', ['a sombra da Terra cobre a Lua', 'a Lua muda de forma', 'a Lua emite luz variável'], 'a sombra da Terra só aparece no eclipse'],
  ];

  const SUBS = [['H2O', 18, 'água'], ['CO2', 44, 'gás carbônico'], ['CH4', 16, 'metano'], ['NH3', 17, 'amônia'], ['O2', 32, 'oxigênio'], ['N2', 28, 'nitrogênio'], ['H2', 2, 'hidrogênio'], ['NaOH', 40, 'hidróxido de sódio'], ['HNO3', 63, 'ácido nítrico'],
    ['HCl', 36.5, 'ácido clorídrico'], ['H2SO4', 98, 'ácido sulfúrico'], ['CaCO3', 100, 'carbonato de cálcio'], ['CaO', 56, 'óxido de cálcio'], ['C6H12O6', 180, 'glicose'], ['C2H6O', 46, 'etanol'], ['SO2', 64, 'dióxido de enxofre'], ['MgO', 40, 'óxido de magnésio'], ['NaCl', 58.5, 'cloreto de sódio'], ['CO', 28, 'monóxido de carbono'], ['C3H8', 44, 'propano'],
    ['SO3', 80, 'trióxido de enxofre'], ['Fe2O3', 160, 'óxido de ferro III'], ['KOH', 56, 'hidróxido de potássio'], ['Ca(OH)2', 74, 'hidróxido de cálcio'], ['H2O2', 34, 'peróxido de hidrogênio'], ['NH4NO3', 80, 'nitrato de amônio'], ['C12H22O11', 342, 'sacarose'], ['Al2O3', 102, 'óxido de alumínio'], ['NO2', 46, 'dióxido de nitrogênio'], ['C2H4', 28, 'eteno']];
  const GASES = ['CO2', 'O2', 'H2', 'N2', 'NH3', 'CH4', 'SO2', 'CO', 'NO2', 'C3H8', 'C2H4'];
  const ELS = [['H', 1, 1, 'hidrogênio', 1], ['He', 2, 4, 'hélio', 18], ['Li', 3, 7, 'lítio', 1], ['Be', 4, 9, 'berílio', 2], ['B', 5, 11, 'boro', 13], ['C', 6, 12, 'carbono', 14], ['N', 7, 14, 'nitrogênio', 15], ['O', 8, 16, 'oxigênio', 16], ['F', 9, 19, 'flúor', 17], ['Ne', 10, 20, 'neônio', 18],
    ['Na', 11, 23, 'sódio', 1], ['Mg', 12, 24, 'magnésio', 2], ['Al', 13, 27, 'alumínio', 13], ['Si', 14, 28, 'silício', 14], ['P', 15, 31, 'fósforo', 15], ['S', 16, 32, 'enxofre', 16], ['Cl', 17, 35, 'cloro', 17], ['Ar', 18, 40, 'argônio', 18], ['K', 19, 39, 'potássio', 1], ['Ca', 20, 40, 'cálcio', 2],
    ['Fe', 26, 56, 'ferro', 8], ['Cu', 29, 64, 'cobre', 11], ['Zn', 30, 65, 'zinco', 12], ['Br', 35, 80, 'bromo', 17], ['Ag', 47, 108, 'prata', 11], ['I', 53, 127, 'iodo', 17], ['Au', 79, 197, 'ouro', 11], ['Pb', 82, 207, 'chumbo', 14], ['U', 92, 238, 'urânio', 3]];
  const IONS = [['Ca', 20, '2+'], ['Na', 11, '+'], ['Mg', 12, '2+'], ['Al', 13, '3+'], ['K', 19, '+'], ['Fe', 26, '3+'], ['Fe', 26, '2+'], ['Cl', 17, '−'], ['O', 8, '2−'], ['S', 16, '2−'], ['F', 9, '−'], ['N', 7, '3−'], ['Zn', 30, '2+'], ['Cu', 29, '2+']];
  const ION_CH = { Na: '+1', K: '+1', Ca: '+2', Mg: '+2', Al: '+3', S: '−2', O: '−2', Cl: '−1', N: '−3' };
  const PERIODIC = [
    ['Qual elemento é um metal alcalino?', 'sódio (Na)', ['cálcio (Ca)', 'cloro (Cl)', 'neônio (Ne)'], 'grupo 1, exceto o hidrogênio'],
    ['Qual elemento é um halogênio?', 'cloro (Cl)', ['oxigênio (O)', 'sódio (Na)', 'argônio (Ar)'], 'grupo 17: F, Cl, Br, I'],
    ['Qual elemento é um gás nobre?', 'argônio (Ar)', ['nitrogênio (N)', 'cloro (Cl)', 'hidrogênio (H)'], 'grupo 18'],
    ['Qual é o elemento mais eletronegativo?', 'flúor (F)', ['oxigênio (O)', 'cloro (Cl)', 'césio (Cs)'], 'cresce para cima e para a direita (sem contar gases nobres)'],
    ['Átomos com o mesmo Z e A diferente são:', 'isótopos', ['isóbaros', 'isótonos', 'alótropos'], 'mesmo elemento, número de nêutrons diferente'],
    ['Elementos do mesmo grupo têm em comum:', 'o número de elétrons de valência', ['o número de camadas', 'a massa atômica', 'o número de nêutrons'], 'no mesmo período, o número de camadas'],
    ['⁴⁰Ar (Z = 18) e ⁴⁰Ca (Z = 20) são:', 'isóbaros', ['isótopos', 'isótonos', 'isoeletrônicos'], 'mesmo número de massa'],
    ['¹⁴C (Z = 6) e ¹⁶O (Z = 8) são:', 'isótonos', ['isótopos', 'isóbaros', 'isoeletrônicos'], 'os dois têm 8 nêutrons'],
    ['Na⁺, Mg²⁺ e F⁻ são:', 'isoeletrônicos', ['isótopos', 'isóbaros', 'isótonos'], 'todos com 10 elétrons'],
    ['Qual tem o maior raio atômico?', 'potássio (K)', ['sódio (Na)', 'cloro (Cl)', 'flúor (F)'], 'o raio cresce para baixo e para a esquerda'],
    ['Qual tem a maior energia de ionização?', 'hélio (He)', ['sódio (Na)', 'potássio (K)', 'oxigênio (O)'], 'cresce para cima e para a direita'],
    ['O raio do Na⁺ comparado ao do átomo Na é:', 'menor', ['maior', 'igual', 'depende da temperatura'], 'o cátion perdeu a camada de valência'],
    ['O raio do Cl⁻ comparado ao do átomo Cl é:', 'maior', ['menor', 'igual', 'depende da temperatura'], 'mais elétrons para a mesma carga nuclear'],
  ];
  const RX = [
    { sp: ['H2', 'O2', 'H2O'], c: [2, 1, 2], M: [2, 32, 18], nR: 2 },
    { sp: ['N2', 'H2', 'NH3'], c: [1, 3, 2], M: [28, 2, 17], nR: 2 },
    { sp: ['CH4', 'O2', 'CO2', 'H2O'], c: [1, 2, 1, 2], M: [16, 32, 44, 18], nR: 2 },
    { sp: ['CaCO3', 'CaO', 'CO2'], c: [1, 1, 1], M: [100, 56, 44], nR: 1 },
    { sp: ['Mg', 'HCl', 'MgCl2', 'H2'], c: [1, 2, 1, 1], M: [24, 36.5, 95, 2], nR: 2 },
    { sp: ['Zn', 'HCl', 'ZnCl2', 'H2'], c: [1, 2, 1, 1], M: [65, 36.5, 136, 2], nR: 2 },
    { sp: ['CaO', 'H2O', 'Ca(OH)2'], c: [1, 1, 1], M: [56, 18, 74], nR: 2 },
    { sp: ['SO2', 'O2', 'SO3'], c: [2, 1, 2], M: [64, 32, 80], nR: 2 },
    { sp: ['C3H8', 'O2', 'CO2', 'H2O'], c: [1, 5, 3, 4], M: [44, 32, 44, 18], nR: 2 },
    { sp: ['C2H6O', 'O2', 'CO2', 'H2O'], c: [1, 3, 2, 3], M: [46, 32, 44, 18], nR: 2 },
    { sp: ['Fe2O3', 'CO', 'Fe', 'CO2'], c: [1, 3, 2, 3], M: [160, 28, 56, 44], nR: 2 },
    { sp: ['Al', 'O2', 'Al2O3'], c: [4, 3, 2], M: [27, 32, 102], nR: 2 },
    { sp: ['NaOH', 'H2SO4', 'Na2SO4', 'H2O'], c: [2, 1, 1, 2], M: [40, 98, 142, 18], nR: 2 },
    { sp: ['C2H4', 'O2', 'CO2', 'H2O'], c: [1, 3, 2, 2], M: [28, 32, 44, 18], nR: 2 },
    { sp: ['C6H12O6', 'O2', 'CO2', 'H2O'], c: [1, 6, 6, 6], M: [180, 32, 44, 18], nR: 2 },
    { sp: ['KClO3', 'KCl', 'O2'], c: [2, 2, 3], M: [122.5, 74.5, 32], nR: 1 },
    { sp: ['C4H10', 'O2', 'CO2', 'H2O'], c: [2, 13, 8, 10], M: [58, 32, 44, 18], nR: 2 },
    { sp: ['H2O2', 'H2O', 'O2'], c: [2, 2, 1], M: [34, 18, 32], nR: 1 },
  ];
  const eqTxt = (r, bal) => {
    const t = (i) => `${bal && r.c[i] > 1 ? r.c[i] + ' ' : ''}${ch(r.sp[i])}`;
    return `${r.sp.slice(0, r.nR).map((_, i) => t(i)).join(' + ')} → ${r.sp.slice(r.nR).map((_, i) => t(i + r.nR)).join(' + ')}`;
  };
  const NOX = [['H2O', 'O', -2], ['NaCl', 'Cl', -1], ['CO2', 'C', 4], ['H2SO4', 'S', 6], ['HNO3', 'N', 5], ['NH3', 'N', -3], ['CH4', 'C', -4], ['Fe2O3', 'Fe', 3], ['N2', 'N', 0], ['SO2', 'S', 4],
    ['KMnO4', 'Mn', 7], ['K2Cr2O7', 'Cr', 6], ['H2O2', 'O', -1], ['HClO4', 'Cl', 7], ['H3PO4', 'P', 5], ['H2S', 'S', -2], ['NaClO', 'Cl', 1], ['NO2', 'N', 4], ['MnO2', 'Mn', 4], ['CO', 'C', 2],
    ['NaH', 'H', -1], ['CaH2', 'H', -1], ['HNO2', 'N', 3], ['N2O', 'N', 1], ['Na2S2O3', 'S', 2], ['C2H6', 'C', -3], ['NH<sub>4</sub><sup>+</sup>', 'N', -3], ['SO<sub>4</sub><sup>2−</sup>', 'S', 6], ['Cr<sub>2</sub>O<sub>7</sub><sup>2−</sup>', 'Cr', 6], ['NO<sub>3</sub><sup>−</sup>', 'N', 5]];
  const POT = [['Mg²⁺/Mg', -2.37], ['Al³⁺/Al', -1.66], ['Zn²⁺/Zn', -0.76], ['Fe²⁺/Fe', -0.44], ['Ni²⁺/Ni', -0.25], ['Pb²⁺/Pb', -0.13], ['2H⁺/H₂', 0], ['Cu²⁺/Cu', 0.34], ['Ag⁺/Ag', 0.8]];
  const EQMC = [
    ['Uma solução com pH 3 é:', 'ácida', ['básica', 'neutra', 'depende do volume'], 'pH < 7 a 25 °C'],
    ['Uma solução com pH 11 é:', 'básica', ['ácida', 'neutra', 'salina'], 'pH > 7 a 25 °C'],
    ['Suco de limão e sabão são, respectivamente:', 'ácido e básico', ['básico e ácido', 'neutros', 'ácido e ácido'], ''],
    ['A 25 °C, a água pura tem pH:', '7', ['0', '14', '1'], '[H⁺] = [OH⁻] = 10⁻⁷'],
    ['Para Arrhenius, ácido é a substância que em água libera:', 'H⁺ (H₃O⁺)', ['OH⁻', 'elétrons', 'Na⁺'], 'base libera OH⁻'],
    ['N₂ + 3 H₂ ⇌ 2 NH₃ (ΔH < 0). Aumentar a pressão desloca para:', 'a formação de NH₃', ['os reagentes', 'nenhum lado', 'depende do catalisador'], 'para o lado com menos mols de gás (4 → 2)'],
    ['N₂ + 3 H₂ ⇌ 2 NH₃ (ΔH < 0). Aquecer desloca para:', 'os reagentes', ['a formação de NH₃', 'nenhum lado', 'os dois lados igualmente'], 'aquecer favorece o sentido endotérmico'],
    ['Adicionar catalisador a um sistema em equilíbrio:', 'não desloca o equilíbrio', ['desloca para os produtos', 'desloca para os reagentes', 'muda o valor de K'], 'só faz chegar ao equilíbrio mais rápido'],
    ['Retirar um produto de um equilíbrio desloca para:', 'a formação de mais produto', ['os reagentes', 'nenhum lado', 'o lado endotérmico'], 'Le Chatelier: o sistema repõe o que foi tirado'],
    ['H₂(g) + I₂(g) ⇌ 2 HI(g). Aumentar a pressão:', 'não desloca', ['desloca para o HI', 'desloca para H₂ e I₂', 'muda o K'], '2 mols de gás de cada lado'],
    ['O único fator que muda o valor da constante de equilíbrio é:', 'a temperatura', ['a pressão', 'o catalisador', 'a concentração'], ''],
    ['NH₄Cl dissolvido em água deixa a solução:', 'ácida', ['básica', 'neutra', 'sem íons'], 'NH₄⁺ vem de base fraca e hidrolisa'],
    ['Na₂CO₃ dissolvido em água deixa a solução:', 'básica', ['ácida', 'neutra', 'sem íons'], 'CO₃²⁻ vem de ácido fraco e hidrolisa'],
    ['NaCl dissolvido em água deixa a solução:', 'neutra', ['ácida', 'básica', 'oxidante'], 'ácido forte + base forte: não hidrolisa'],
    ['Acetato de sódio (CH₃COONa) em água deixa a solução:', 'básica', ['ácida', 'neutra', 'sem íons'], 'o acetato vem de ácido fraco'],
    ['A base conjugada do HCl é:', 'Cl⁻', ['H⁺', 'H₂O', 'OH⁻'], 'Brønsted: o ácido perde H⁺'],
    ['O ácido conjugado do NH₃ é:', 'NH₄⁺', ['NH₂⁻', 'H⁺', 'N₂'], 'a base ganha H⁺'],
    ['Para Lewis, ácido é a espécie que:', 'recebe um par de elétrons', ['doa um par de elétrons', 'doa H⁺', 'libera OH⁻'], 'ex.: BF₃'],
    ['Adicionar NaCl a uma solução saturada de AgCl:', 'diminui a solubilidade do AgCl', ['aumenta a solubilidade do AgCl', 'não muda nada', 'dissolve todo o AgCl'], 'efeito do íon comum (Cl⁻)'],
  ];
  const ORGF = [['CH₃–OH', 'álcool', 'OH em carbono saturado'], ['CH₃–COOH', 'ácido carboxílico', 'grupo –COOH'], ['CH₃–CHO', 'aldeído', 'C=O na ponta da cadeia (–CHO)'], ['CH₃–CO–CH₃', 'cetona', 'C=O entre dois carbonos'],
    ['CH₃–O–CH₃', 'éter', 'O entre dois carbonos'], ['CH₃–NH₂', 'amina', 'N ligado a carbono'], ['CH₄', 'hidrocarboneto', 'só C e H'], ['CH₃–CH₂–OH', 'álcool', 'OH em carbono saturado'],
    ['CH₃–CO–NH₂', 'amida', 'C=O ligado a N'], ['C₆H₅–OH', 'fenol', 'OH direto no anel aromático'], ['CH₃–Cl', 'haleto orgânico', 'halogênio ligado a carbono'],
    ['CH₃–COO–CH₃', 'éster', '–COO– entre dois carbonos'], ['C₆H₆', 'hidrocarboneto', 'benzeno: só C e H'], ['H–CHO', 'aldeído', 'metanal (formol)'], ['CH₃–CH₂–NH₂', 'amina', 'N ligado a carbono']];
  const ORGMC = [
    ['O carbono do metano (CH₄) tem hibridização:', 'sp³', ['sp²', 'sp', 'sp³d'], '4 ligações simples'],
    ['Os carbonos do eteno (C₂H₄) têm hibridização:', 'sp²', ['sp³', 'sp', 'sp³d'], 'uma ligação dupla'],
    ['Os carbonos do etino (C₂H₂) têm hibridização:', 'sp', ['sp²', 'sp³', 'sp³d'], 'uma ligação tripla'],
    ['Qual apresenta isomeria cis-trans?', 'but-2-eno', ['but-1-eno', 'propeno', 'eteno'], 'precisa de C=C com dois ligantes diferentes em cada carbono'],
    ['Qual tem carbono quiral (isomeria óptica)?', 'butan-2-ol', ['propan-2-ol', 'etanol', 'metanol'], 'carbono com 4 ligantes diferentes: H, OH, CH₃ e C₂H₅'],
    ['Etanol e metoximetano (C₂H₆O) são isômeros de:', 'função', ['cadeia', 'posição', 'tautomeria'], 'álcool × éter'],
    ['Propan-1-ol e propan-2-ol são isômeros de:', 'posição', ['função', 'cadeia', 'compensação'], 'muda só a posição do OH'],
    ['Uma cadeia com só ligações simples entre carbonos é:', 'saturada', ['insaturada', 'aromática', 'heterogênea'], ''],
    ['Uma cadeia com oxigênio entre dois carbonos é:', 'heterogênea', ['homogênea', 'aromática', 'ramificada'], 'tem heteroátomo entre carbonos'],
    ['O polietileno é obtido a partir do:', 'eteno', ['etanol', 'metano', 'benzeno'], 'polímero de adição'],
    ['O PVC é obtido a partir do:', 'cloreto de vinila', ['eteno', 'estireno', 'propeno'], 'policloreto de vinila'],
    ['Proteínas são polímeros de:', 'aminoácidos', ['glicose', 'ácidos graxos', 'nucleotídeos'], 'unidos por ligação peptídica (grupo amida)'],
    ['Amido e celulose são polímeros de:', 'glicose', ['aminoácidos', 'ácidos graxos', 'glicerol'], 'polissacarídeos'],
    ['Óleos e gorduras (triglicerídeos) são:', 'ésteres de glicerol e ácidos graxos', ['proteínas', 'polissacarídeos', 'álcoois simples'], 'a saponificação deles gera sabão'],
    ['Enzimas são, em geral:', 'proteínas que catalisam reações', ['lipídeos', 'carboidratos', 'vitaminas'], ''],
    ['A combustão completa de um hidrocarboneto produz:', 'CO₂ e H₂O', ['CO e H₂', 'C e H₂O', 'CH₄ e O₂'], 'a incompleta gera CO ou fuligem'],
  ];
  const AMB = [
    ['O principal gás responsável pelo aumento do efeito estufa é o:', 'CO₂', ['O₂', 'N₂', 'argônio'], 'metano e N₂O também contribuem'],
    ['A chuva ácida é causada principalmente por:', 'SO₂ e óxidos de nitrogênio', ['CO₂ e O₂', 'CFCs', 'metano'], 'formam H₂SO₄ e HNO₃ na atmosfera'],
    ['A camada de ozônio é destruída principalmente por:', 'CFCs', ['CO₂', 'SO₂', 'vapor d’água'], 'o cloro liberado catalisa a quebra do O₃'],
    ['A camada de ozônio protege a Terra da radiação:', 'ultravioleta', ['infravermelha', 'de rádio', 'de micro-ondas'], ''],
    ['O despejo de fosfatos e nitratos em lagos causa:', 'eutrofização', ['chuva ácida', 'efeito estufa', 'inversão térmica'], 'proliferação de algas e falta de oxigênio'],
    ['A chuva sem poluição é levemente ácida (pH ≈ 5,6) por causa do:', 'CO₂ dissolvido', ['SO₂', 'oxigênio', 'nitrogênio'], 'forma ácido carbônico'],
    ['No alto-forno, o minério de ferro é reduzido principalmente por:', 'monóxido de carbono (do carvão)', ['oxigênio', 'água', 'cloro'], 'Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂'],
    ['A maior parte da água do planeta está:', 'nos oceanos (água salgada)', ['nas geleiras', 'nos rios', 'na atmosfera'], 'cerca de 97%'],
    ['A destilação fracionada do petróleo separa os componentes pelo:', 'ponto de ebulição', ['densidade', 'cor', 'solubilidade em água'], ''],
    ['O alumínio é produzido a partir da bauxita por:', 'eletrólise', ['destilação', 'filtração', 'fusão com carvão apenas'], 'gasta muita energia; por isso reciclar compensa'],
  ];
