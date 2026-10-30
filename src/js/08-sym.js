// ---------- o que é cada termo das fórmulas (legenda embaixo da questão) ----------
// SYM: significado padrão de cada símbolo no tópico; SYMF: quando uma fórmula usa o símbolo de outro jeito
// x_{v} quer dizer x com índice v
const SYM = {
  F_alg: { x: 'variável (na equação, a incógnita)', y: 'valor da função', a: 'coeficiente de x²', b: 'coeficiente de x', c: 'termo independente',
    'Δ': 'discriminante, b² − 4ac', 'x₁': 'uma raiz', 'x₂': 'a outra raiz', 'x_{v}': 'x do vértice', 'y_{v}': 'y do vértice (valor máximo ou mínimo)' },
  F_seq: { 'a_{n}': 'termo da posição n', 'a₁': 'primeiro termo', n: 'número de termos (ou posição do termo)', r: 'razão da PA', q: 'razão da PG',
    'S_{n}': 'soma dos n primeiros termos', S: 'soma de todos os termos', J: 'juros', C: 'capital (valor inicial)', i: 'taxa por período, em decimal',
    t: 'número de períodos', M: 'montante (capital + juros)', a: 'primeiro dos três termos', b: 'termo do meio', c: 'terceiro termo' },
  F_comb: { 'A_{n,p}': 'arranjos de n elementos, p a p', 'C_{n,p}': 'combinações de n elementos, p a p', 'P_{n}': 'permutações de n elementos',
    'PC_{n}': 'permutações circulares de n elementos', n: 'total de elementos', p: 'quantos são escolhidos', P: 'probabilidade', A: 'evento A', B: 'evento B',
    'Ā': 'A não acontece (complementar)', '∪': 'união: A ou B', '∩': 'interseção: A e B', 'T_{p+1}': 'termo da posição p + 1' },
  F_geo: { A: 'área', b: 'base', h: 'altura', B: 'base maior', r: 'raio', C: 'comprimento da circunferência', 'ℓ': 'lado', d: 'diagonal',
    'S_{i}': 'soma dos ângulos internos', n: 'número de lados', a: 'hipotenusa', c: 'cateto', 'θ': 'ângulo', p: 'semiperímetro', k: 'razão entre os lados' },
  F_esp: { V: 'volume', 'A_{b}': 'área da base', h: 'altura', r: 'raio', A: 'área da superfície', 'A_{ℓ}': 'área lateral', D: 'diagonal',
    a: 'aresta', b: 'segunda dimensão', c: 'terceira dimensão' },
  F_trig: { x: 'ângulo (arco)', a: 'lado oposto ao ângulo A', b: 'lado oposto ao ângulo B', c: 'terceiro lado', A: 'ângulo oposto ao lado a',
    B: 'ângulo oposto ao lado b', R: 'raio da circunferência circunscrita', T: 'período', k: 'número que multiplica x', rad: 'medida em radianos', graus: 'medida em graus' },
  F_anal: { d: 'distância', 'x₁': 'x do 1º ponto', 'y₁': 'y do 1º ponto', 'x₂': 'x do 2º ponto', 'y₂': 'y do 2º ponto', M: 'ponto médio',
    m: 'coeficiente angular (inclinação)', 'x₀': 'x do ponto dado', 'y₀': 'y do ponto dado', x: 'x de um ponto qualquer', y: 'y de um ponto qualquer',
    'm₁': 'coeficiente angular da 1ª reta', 'm₂': 'coeficiente angular da 2ª reta', a: 'x do centro', b: 'y do centro', r: 'raio', c: 'termo independente da reta',
    A: 'área', D: 'determinante com as coordenadas dos vértices', 'α': 'ângulo de inclinação da reta' },
  F_log: { a: 'logaritmando (o número)', b: 'base do logaritmo', n: 'expoente', m: 'expoente', x: 'o logaritmo (um expoente)',
    N: 'quantidade depois do tempo t', 'N₀': 'quantidade inicial', t: 'número de vezes que dobrou' },
  F_cin: { s: 'posição no instante t', 's₀': 'posição inicial', v: 'velocidade', 'v₀': 'velocidade inicial', t: 'tempo', a: 'aceleração',
    'Δs': 'deslocamento', 'v_{m}': 'velocidade média', 'Δt': 'intervalo de tempo', 'a_{m}': 'aceleração média', 'Δv': 'variação da velocidade',
    h: 'altura', g: 'aceleração da gravidade', 'h_{máx}': 'altura máxima', 'a_{c}': 'aceleração centrípeta', R: 'raio da curva',
    'ω': 'velocidade angular', T: 'período (tempo de uma volta)', f: 'frequência (voltas por segundo)' },
  F_din: { 'F_{R}': 'força resultante', m: 'massa', a: 'aceleração', P: 'peso', g: 'aceleração da gravidade', 'f_{at}': 'força de atrito',
    'μ': 'coeficiente de atrito', N: 'força normal', F: 'força', k: 'constante elástica da mola', x: 'deformação da mola', 'F_{c}': 'força centrípeta',
    v: 'velocidade', R: 'raio da curva', 'P_{x}': 'parte do peso ao longo do plano', 'θ': 'inclinação do plano', M: 'momento (torque)',
    d: 'distância da força ao ponto de apoio', p: 'pressão', A: 'área', 'p₀': 'pressão na superfície (atmosférica)', 'ρ': 'densidade do líquido',
    h: 'profundidade', E: 'empuxo', 'ρ_{líq}': 'densidade do líquido', 'V_{sub}': 'volume submerso', 'ρ_{corpo}': 'densidade do corpo', V: 'volume',
    'F₁': 'força no pistão 1', 'A₁': 'área do pistão 1', 'F₂': 'força no pistão 2', 'A₂': 'área do pistão 2' },
  F_en: { 'E_{c}': 'energia cinética', m: 'massa', v: 'velocidade', 'E_{p}': 'energia potencial gravitacional', g: 'aceleração da gravidade', h: 'altura',
    'E_{el}': 'energia potencial elástica', k: 'constante elástica da mola', x: 'deformação da mola', 'τ': 'trabalho', F: 'força', d: 'deslocamento',
    'θ': 'ângulo entre a força e o deslocamento', P: 'potência', 'Δt': 'intervalo de tempo', 'η': 'rendimento', 'P_{útil}': 'potência útil',
    'P_{total}': 'potência total recebida', Q: 'quantidade de movimento', I: 'impulso', a: 'aceleração', 'Δs': 'deslocamento',
    G: 'constante da gravitação universal', M: 'massa do planeta (ou do corpo central)', R: 'raio do planeta (ou da órbita)', T: 'período da órbita',
    'τ_{total}': 'trabalho da força resultante', 'm₁': 'massa do corpo 1', 'v₁': 'velocidade do corpo 1', 'm₂': 'massa do corpo 2', 'v₂': 'velocidade do corpo 2' },
  F_term: { Q: 'calor', m: 'massa', c: 'calor específico', 'ΔT': 'variação de temperatura', L: 'calor latente', C: 'capacidade térmica',
    'T_{K}': 'temperatura em kelvin', 'T_{C}': 'temperatura em Celsius', 'ΔL': 'variação do comprimento', 'L₀': 'comprimento inicial',
    'α': 'coeficiente de dilatação linear', 'γ': 'coeficiente de dilatação volumétrica', p: 'pressão', V: 'volume', n: 'número de mols',
    R: 'constante dos gases', T: 'temperatura em kelvin', 'p₁': 'pressão inicial', 'V₁': 'volume inicial', 'T₁': 'temperatura inicial (K)',
    'p₂': 'pressão final', 'V₂': 'volume final', 'T₂': 'temperatura final (K)', 'ΔU': 'variação da energia interna', 'τ': 'trabalho feito pelo gás',
    'ΔV': 'variação do volume', 'η': 'rendimento', 'T_{F}': 'temperatura da fonte fria (K)', 'T_{Q}': 'temperatura da fonte quente (K)',
    'Q_{quente}': 'calor recebido da fonte quente', 'Q_{fria}': 'calor cedido à fonte fria', 'φ': 'fluxo de calor', k: 'condutividade térmica',
    A: 'área da parede', F: 'temperatura em Fahrenheit' },
  F_ond: { v: 'velocidade da onda', 'λ': 'comprimento de onda', f: 'frequência', n: 'índice de refração', c: 'velocidade da luz no vácuo',
    'n₁': 'índice de refração do meio 1', 'θ₁': 'ângulo com a normal no meio 1', 'n₂': 'índice de refração do meio 2', 'θ₂': 'ângulo com a normal no meio 2',
    p: 'distância do objeto', 'p′': 'distância da imagem', A: 'aumento linear', V: 'vergência (em dioptrias)', R: 'raio de curvatura',
    'f_{n}': 'frequência do harmônico n', L: 'comprimento', T: 'período', 'μ': 'densidade linear da corda (massa/comprimento)', g: 'aceleração da gravidade',
    m: 'massa', k: 'constante elástica da mola', 'β': 'nível sonoro (dB)', I: 'intensidade do som', 'I₀': 'menor intensidade audível',
    N: 'número de imagens', 'α': 'ângulo entre os espelhos', 'n_{menor}': 'índice do meio menos refringente', 'n_{maior}': 'índice do meio mais refringente' },
  F_ele: { F: 'força elétrica', k: 'constante eletrostática', Q: 'carga', q: 'carga de prova', d: 'distância', E: 'campo elétrico', V: 'potencial elétrico',
    'τ': 'trabalho da força elétrica', U: 'tensão (diferença de potencial)', C: 'capacitância', n: 'número de elétrons a mais ou a menos',
    e: 'carga elementar (1,6 × 10⁻¹⁹ C)', i: 'corrente elétrica', 'Δt': 'intervalo de tempo', R: 'resistência', 'ρ': 'resistividade do material',
    L: 'comprimento do fio', A: 'área da seção do fio', P: 'potência', 'R_{eq}': 'resistência equivalente', 'R₁': 'resistência 1', 'R₂': 'resistência 2',
    'ε': 'força eletromotriz do gerador', r: 'resistência interna do gerador', 'C₁': 'capacitância 1', 'C₂': 'capacitância 2' },
  F_mag: { F: 'força magnética', q: 'carga', v: 'velocidade', B: 'campo magnético', 'θ': 'ângulo', i: 'corrente elétrica', L: 'comprimento',
    R: 'raio', m: 'massa da partícula', 'μ₀': 'permeabilidade magnética do vácuo', d: 'distância até o fio', N: 'número de espiras',
    'Φ': 'fluxo magnético', A: 'área da espira', 'ε': 'força eletromotriz induzida', 'ΔΦ': 'variação do fluxo', 'Δt': 'intervalo de tempo',
    'U₁': 'tensão no primário', 'U₂': 'tensão no secundário', 'N₁': 'espiras do primário', 'N₂': 'espiras do secundário' },
  F_qmol: { n: 'número de mols', m: 'massa', M: 'massa molar', V: 'volume', N: 'número de partículas', 'N_{A}': 'constante de Avogadro', p: 'pressão',
    R: 'constante dos gases', T: 'temperatura em kelvin', d: 'densidade do gás', C: 'concentração comum (g/L)', 'm_{soluto}': 'massa do soluto',
    'V_{solução}': 'volume da solução', 'V_{solvente}': 'volume do solvente', '𝔐': 'concentração em mol/L', 'n_{soluto}': 'mols de soluto',
    'τ': 'título (fração da massa que é soluto)', 'm_{solução}': 'massa da solução', 'm_{solvente}': 'massa do solvente', 'x_{A}': 'fração molar de A',
    'n_{A}': 'mols de A', 'n_{B}': 'mols de B', 'n_{total}': 'mols no total', 'p_{A}': 'pressão parcial de A', 'p_{total}': 'pressão total',
    'C₁': 'concentração antes', 'V₁': 'volume antes', 'C₂': 'concentração depois', 'V₂': 'volume depois', 'C_{f}': 'concentração final',
    'p₁': 'pressão inicial', 'T₁': 'temperatura inicial (K)', 'p₂': 'pressão final', 'T₂': 'temperatura final (K)' },
  F_qfis: { 'K_{c}': 'constante de equilíbrio', '[': 'concentração em mol/L', A: 'reagente A', B: 'reagente B', C: 'produto C', D: 'produto D',
    a: 'coeficiente de A', b: 'coeficiente de B', c: 'coeficiente de C', d: 'coeficiente de D', 'H⁺': 'íon hidrogênio', 'OH⁻': 'íon hidróxido',
    pH: '−log da concentração de H⁺', pOH: '−log da concentração de OH⁻', 'K_{w}': 'produto iônico da água (10⁻¹⁴ a 25 °C)',
    'K_{a}': 'constante de ionização do ácido', '𝔐': 'concentração em mol/L', 'α': 'grau de ionização', v: 'velocidade da reação',
    k: 'constante de velocidade', m: 'massa restante', 'm₀': 'massa inicial', n: 'número de meias-vidas', 'ΔH': 'variação de entalpia',
    'H_{produtos}': 'entalpia dos produtos', 'H_{reagentes}': 'entalpia dos reagentes', 'Σ': 'soma das energias das ligações',
    'ΔG': 'variação de energia livre', T: 'temperatura em kelvin', 'ΔS': 'variação de entropia', 'ΔE°': 'ddp da pilha', 'ΔE': 'ddp da pilha',
    'E°_{red, maior}': 'maior potencial de redução', 'E°_{red, menor}': 'menor potencial de redução', Q: 'carga elétrica', i: 'corrente elétrica',
    t: 'tempo', 'n_{e⁻}': 'mols de elétrons', F: 'constante de Faraday (96 500 C/mol)', R: 'reagente', 'Δt': 'intervalo de tempo' },
};
const SYMF = {
  'Quadrado da soma': { a: 'um número qualquer', b: 'outro número qualquer' }, 'Quadrado da diferença': { a: 'um número qualquer', b: 'outro número qualquer' },
  'Diferença de quadrados': { a: 'um número qualquer', b: 'outro número qualquer' }, 'Soma de cubos': { a: 'um número qualquer', b: 'outro número qualquer' },
  'Isole x em y = ax + b': { a: 'coeficiente angular (inclinação da reta)', b: 'coeficiente linear (onde a reta corta o eixo y)' },
  'Forma fatorada de ax² + bx + c, com raízes x₁ e x₂': { x: 'variável' },
  'Permutação com repetição (a e b repetidos)': { P: 'número de permutações', n: 'total de elementos', a: 'repetições do 1º elemento', b: 'repetições do 2º elemento' },
  'Termo geral do binômio (a + b)<sup>n</sup>': { a: '1º termo do binômio', b: '2º termo do binômio', n: 'expoente do binômio', p: 'posição do termo menos 1' },
  'União de dois conjuntos': { n: 'número de elementos', A: 'conjunto A', B: 'conjunto B' },
  'Número de subconjuntos de um conjunto com n elementos': { n: 'número de elementos do conjunto' },
  'Número de apertos de mão entre n pessoas': { n: 'número de pessoas' },
  'Área do trapézio': { B: 'base maior', b: 'base menor' }, 'Área do losango': { D: 'diagonal maior', d: 'diagonal menor' },
  'Número de diagonais de um polígono': { d: 'número de diagonais', n: 'número de lados' },
  'Área do triângulo por dois lados e o ângulo entre eles': { a: 'um lado', b: 'outro lado', 'θ': 'ângulo entre esses dois lados' },
  'Teorema de Pitágoras': { a: 'hipotenusa', b: 'um cateto', c: 'o outro cateto' },
  'Área do setor circular de ângulo θ': { 'θ': 'ângulo central, em graus' },
  'Raio do círculo inscrito no triângulo (área A, semiperímetro p)': { r: 'raio do círculo inscrito', A: 'área do triângulo' },
  'Altura relativa à hipotenusa (catetos b, c, hipotenusa a)': { h: 'altura relativa à hipotenusa', a: 'hipotenusa', b: 'um cateto', c: 'o outro cateto' },
  'Relação de Euler (poliedros convexos)': { V: 'número de vértices', A: 'número de arestas', F: 'número de faces' },
  'Diagonal do cubo': { a: 'aresta do cubo' }, 'Diagonal do paralelepípedo': { a: 'comprimento', b: 'largura', c: 'altura' },
  'Seno da soma': { a: 'um ângulo', b: 'outro ângulo' }, 'Cosseno da soma': { a: 'um ângulo', b: 'outro ângulo' },
  'Imagem de f(x) = a + b·sen x (b > 0)': { a: 'quanto o gráfico sobe ou desce', b: 'amplitude', x: 'ângulo' },
  'Distância do ponto (x₀, y₀) à reta ax + by + c = 0': { a: 'coeficiente de x na reta', b: 'coeficiente de y na reta', c: 'termo independente da reta' },
  'Isole o raio na equação x² + y² = r²': { x: 'x de um ponto da circunferência', y: 'y de um ponto da circunferência' },
  'Logaritmo do produto': { a: 'um número positivo', b: 'outro número positivo' }, 'Logaritmo do quociente': { a: 'um número positivo', b: 'outro número positivo' },
  'Logaritmo da potência': { a: 'número positivo' }, 'Mudança de base': { a: 'logaritmando', b: 'base original' },
  'Produto de potências de mesma base': { a: 'base da potência' }, 'Potência de potência': { a: 'base da potência' },
  'Expoente negativo': { a: 'base da potência' }, 'Expoente fracionário': { a: 'base da potência' },
  'Quociente de potências de mesma base': { a: 'base da potência' },
  'Velocidade no MUV': { v: 'velocidade no instante t' },
  'Densidade': { d: 'densidade', m: 'massa' }, 'Momento de uma força (perpendicular)': { d: 'distância da força ao ponto de apoio (braço)', F: 'força' },
  'Pressão': { F: 'força perpendicular à superfície' },
  'Equilíbrio de uma alavanca': { 'F₁': 'força de um lado', 'F₂': 'força do outro lado', 'd₁': 'distância de F₁ ao apoio', 'd₂': 'distância de F₂ ao apoio' },
  'Lei da gravitação universal': { M: 'massa de um corpo', m: 'massa do outro corpo', d: 'distância entre os centros', F: 'força de atração' },
  'Gravidade na superfície de um planeta': { g: 'aceleração da gravidade na superfície' },
  '3ª lei de Kepler': { T: 'período da órbita', R: 'raio médio da órbita' },
  'Velocidade de satélite em órbita circular': { R: 'raio da órbita' },
  'Fluxo de calor por condução': { L: 'espessura da parede', 'ΔT': 'diferença de temperatura entre os lados' },
  'Conversão Celsius–Fahrenheit': { C: 'temperatura em Celsius', F: 'temperatura em Fahrenheit' },
  'Temperatura de equilíbrio de duas porções de água': { 'm₁': 'massa da 1ª porção', 'T₁': 'temperatura da 1ª porção', 'm₂': 'massa da 2ª porção', 'T₂': 'temperatura da 2ª porção' },
  'Rendimento de uma máquina térmica': { 'τ': 'trabalho realizado pela máquina' },
  'Equação de Gauss (lentes e espelhos)': { f: 'distância focal' }, 'Vergência de uma lente (f em metros)': { f: 'distância focal, em metros' },
  'Foco de espelho esférico': { f: 'distância focal', R: 'raio de curvatura do espelho' }, 'Isole p′ na equação de Gauss': { f: 'distância focal' },
  'Harmônicos de uma corda fixa': { n: 'número do harmônico (1, 2, 3…)', L: 'comprimento da corda', v: 'velocidade da onda na corda' },
  'Velocidade de onda numa corda': { T: 'tração (força que estica a corda)', v: 'velocidade da onda na corda' },
  'Período do pêndulo simples': { L: 'comprimento do fio' }, 'Ângulo limite': { L: 'ângulo limite' },
  'Tubo fechado numa ponta: frequências possíveis': { n: 'número do harmônico (só ímpares)', L: 'comprimento do tubo', v: 'velocidade do som' },
  'Lei de Coulomb': { Q: 'uma carga', q: 'a outra carga', d: 'distância entre as cargas' }, 'Isole d na lei de Coulomb': { Q: 'uma carga', q: 'a outra carga', d: 'distância entre as cargas' },
  'Campo de uma carga pontual': { Q: 'carga que cria o campo', d: 'distância até a carga' }, 'Potencial de uma carga pontual': { Q: 'carga que cria o potencial', d: 'distância até a carga' },
  'Campo uniforme e diferença de potencial': { d: 'distância ao longo do campo' },
  'Carga de um capacitor': { Q: 'carga armazenada' }, 'Energia de um capacitor': { E: 'energia armazenada' },
  'Corrente elétrica': { Q: 'carga que atravessa o fio' }, 'Energia elétrica consumida': { E: 'energia consumida' },
  'Carga quantizada': { Q: 'carga total do corpo' },
  'Força magnética sobre carga': { 'θ': 'ângulo entre a velocidade e o campo' }, 'Força magnética sobre fio': { 'θ': 'ângulo entre o fio e o campo', L: 'comprimento do fio dentro do campo' },
  'Raio da trajetória de carga em campo uniforme': { R: 'raio da trajetória' }, 'Isole B em R = m·v/(q·B)': { R: 'raio da trajetória' },
  'Campo no centro de uma espira': { R: 'raio da espira' }, 'Campo no interior de um solenoide': { L: 'comprimento do solenoide' },
  'Fluxo magnético': { 'θ': 'ângulo entre o campo e a reta perpendicular à espira' }, 'Fem numa barra que se move': { L: 'comprimento da barra', v: 'velocidade da barra' },
  'Concentração em mol/L a partir da massa': { m: 'massa do soluto', M: 'massa molar do soluto', V: 'volume da solução (L)' },
  'Mistura de duas soluções do mesmo soluto': { 'C₁': 'concentração da solução 1', 'V₁': 'volume da solução 1', 'C₂': 'concentração da solução 2', 'V₂': 'volume da solução 2' },
  'Relação entre concentração comum e mol/L': { M: 'massa molar do soluto' },
  'Velocidade média de consumo de um reagente': { R: 'o reagente' },
  'Lei de velocidade (reação elementar aA + bB)': { A: 'reagente A', B: 'reagente B' },
};

// separa os símbolos de um texto de fórmula; palavras do português ficam de fora
const SYM_FUN = new Set(['sen', 'cos', 'tg', 'log', 'ln', 'sec', 'com', 'par', 'do', 'da', 'de', 'ao', 'em', 'um', 'ou', 'íon', 'à', 'o', 'é']);
const SYM_RE = /[∪∩[]|(?:[A-Za-zÀ-ÖØ-öø-ÿĀα-ωΑ-Ωµℓ]|𝔐)+[°′']?(?:[₀-₉ₐₑₒₓₕₖₗₘₙₚₛₜ]+|_\{[^}]*\})?[⁺⁻]?/gu;
function symToks(s, has) {
  s = String(s || '').replace(/<sub>(.*?)<\/sub>/g, '_{$1}').replace(/<sup>(.*?)<\/sup>/g, ' $1 ').replace(/<[^>]+>/g, ' ');
  const out = [];
  for (const [t] of s.matchAll(SYM_RE)) {
    if (has(t)) { out.push(t); continue; }
    const m = t.match(/^((?:[^°′'₀-₉ₐₑₒₓₕₖₗₘₙₚₛₜ_⁺⁻])+)(.*)$/u); if (!m) continue;
    const [, word, tail] = m, units = [...word];
    if (SYM_FUN.has(word) || (units.length >= 4 && /^[A-Za-zÀ-ÿ]+$/.test(word))) continue;   // palavra, não símbolo
    // produto sem sinal (ab, πr²h, aΔs): um símbolo por letra; o Δ fica com a letra seguinte
    const us = word.match(/Δ?./gu);
    us.forEach((u, i) => out.push(i === us.length - 1 ? u + tail : u));
  }
  return out;
}
// parts: [[texto, nome da fórmula], ...] → legenda em HTML, na ordem em que os símbolos aparecem.
// A primeira parte é a pergunta e manda no significado; se as alternativas usam o mesmo símbolo
// de jeitos diferentes, vale o significado geral do tópico, para a legenda não apontar a certa
function legend(key, parts) {
  const base = SYM[key]; if (!base) return '';
  const seen = new Map();
  parts.forEach(([txt, nm], i) => {
    const over = SYMF[nm] || {};
    const mean = t => over[t] ?? base[t] ?? (t[0] === 'Δ' && (over[t.slice(1)] ?? base[t.slice(1)]) ? 'variação de ' + (over[t.slice(1)] ?? base[t.slice(1)]) : null);
    for (const t of symToks(txt, t => mean(t) != null)) {
      const d = mean(t); if (d == null) continue;
      const o = seen.get(t);
      if (!o) seen.set(t, { d, q: i === 0 });
      else if (!o.q && o.d !== d) o.d = base[t] ?? o.d;
    }
  });
  return [...seen].map(([t, { d }]) => `<b>${t === '[' ? '[X]' : t.replace(/_\{(.*?)\}/g, '<sub>$1</sub>')}</b> ${t === '[' ? 'concentração de X em mol/L' : d}`).join(' · ');
}
