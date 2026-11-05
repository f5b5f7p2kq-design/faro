
  // tópicos que só existem no banco da Unicamp (não têm gerador); ficam escondidos até o banco carregar
  for (const [k, name, s] of [['arit', 'Razões e problemas', 'mat'], ['cplx', 'Números complexos', 'mat'], ['f_mod', 'Física moderna', 'fis'], ['q_inorg', 'Química inorgânica', 'qui']])
    if (!GEN[k]) GEN[k] = { name, s, g: () => null, bank: true };
  for (const k in GEN) GEN[k].s = GEN[k].s || 'mat';
  const KEYS = Object.keys(GEN);
  const SUBJ = { mat: 'Matemática', fis: 'Física', qui: 'Química' };
  const SK = Object.keys(SUBJ);
  const LEVELS = ['questões até 1100', 'questões de 1100 a 1400', 'questões acima de 1400'];
  const LNAME = ['FÁCIL', 'MÉDIO', 'DIFÍCIL'];
  const BAND = [[0, 1100], [1100, 1400], [1400, 2501]];
  const TIPS_URL = 'https://claude.ai/artifact/3wHqTT2rP8Z8v8FsAXw1fG';
  const tipKey = k => k;
  const TIPMAP = {};
  [...TIPS, ...TIPS_MAT2, ...TIPS_FIS, ...TIPS_QUI].forEach(([id, , ts]) => { TIPMAP[id] = ts; });
  LAWS.forEach(([id, , , items]) => { TIPMAP[id] = items.map(([n, t]) => [n, t, '']); });
  FORMS.forEach(([id, , , , items]) => { TIPMAP[id] = items.map(([n, l, r]) => [n, fx(l, r), '']); });

  // ---------- estado (preferências guardadas só neste navegador) ----------
  const load = (k, d) => { try { const v = localStorage.getItem('cm.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  const SYNCED = ['ratings', 'marked', 'off', 'best', 'prefs', 'days', 'tmDays', 'tmMan', 'metas', 'tmLog', 'tmTl', 'cal', 'habs', 'livros'];
  let cloud = null, pushT;
  const save = (k, v) => {
    try { localStorage.setItem('cm.' + k, JSON.stringify(v)); } catch (e) {}
    if (cloud && SYNCED.includes(k)) { clearTimeout(pushT); pushT = setTimeout(push, 1200); }
  };
  // guarda os tópicos desligados, para que tópicos novos já venham ligados
  const legacy = load('topics', null);
  let off = new Set(load('off', Array.isArray(legacy) ? OLDK.filter(k => !legacy.includes(k)) : []).filter(k => GEN[k]));
  let subj = load('subj', 'all'); if (subj !== 'all' && !SUBJ[subj]) subj = 'all';
  let mode = load('mode', 'exercicios'); if (mode !== 'teoria') mode = 'exercicios';
  let view = 'treino';
  // a marcação é reconhecida pela pergunta e pela resposta certa, não pela ordem das alternativas
  const qid = q => q.uid ? 'u|' + q.uid : `${q.key}|${q.ctx || ''}|${q.q || ''}|${Array.isArray(q.opts) ? q.opts[q.a] : ''}`;
  const fixMarked = a => { const seen = new Set(); return (Array.isArray(a) ? a : []).filter(m => m && m.key).map(m => ({ ...m, id: qid(m) })).filter(m => !seen.has(m.id) && seen.add(m.id)); };
  let marked = fixMarked(load('marked', []));
  let level = load('level', -1); if (![-1, 0, 1, 2].includes(level)) level = -1;
  // rating de 0 a 2500 por tópico, estilo Elo. Até a v2 as questões geradas tinham uma escala própria; na v3 elas
  // passaram para a escala das questões da Unicamp. O rating de quem já treinava é convertido tópico a tópico:
  // [média antiga, média nova, inclinação], da comparação entre a tabela antiga e a nova de cada tipo de questão
  const RV = 3;
  const RMAP = { soma: [738, 1117, 0.79], sub: [645, 988, 0.61], mult: [886, 1108, 0.51], div: [767, 1058, 0.41], pot: [1062, 1184, 0.39], raiz: [882, 1128, 0.43], porc: [920, 1206, 0.34], fat: [1194, 1222, 0.26], perm: [1321, 1265, 0.33], prep: [1444, 1393, 0.20], arr: [1097, 1263, 0.26], comb: [1318, 1347, 0.27], conj: [1008, 1240, 0.43], mdc: [1104, 1217, 0.29], cont: [1252, 1279, 0.25], frac: [1071, 1220, 0.20], seq: [1224, 1283, 0.29], juros: [1220, 1285, 0.30], func: [1175, 1230, 0.25], poli: [1348, 1294, 0.25], prob: [1413, 1298, 0.23], binom: [1280, 1367, 0.20], matr: [1330, 1302, 0.23], gplan: [1126, 1275, 0.22], gesp: [1199, 1283, 0.20], trig: [1349, 1293, 0.31], ganal: [1318, 1258, 0.26], logexp: [1302, 1274, 0.26], f_un: [1092, 1280, 0.33], f_cin: [1154, 1224, 0.39], f_din: [1179, 1256, 0.33], f_en: [1123, 1249, 0.28], f_mom: [1283, 1197, 0.33], f_grav: [1356, 1348, 0.20], f_hid: [1168, 1219, 0.31], f_term: [1236, 1275, 0.30], f_gas: [1376, 1276, 0.25], f_ond: [1278, 1299, 0.27], f_opt: [1276, 1299, 0.22], f_ele: [1273, 1285, 0.26], f_cir: [1144, 1260, 0.34], f_mag: [1442, 1325, 0.23], q_mol: [941, 1152, 0.25], q_gas: [1274, 1277, 0.26], q_sol: [1245, 1287, 0.20], q_ato: [1099, 1210, 0.30], q_rad: [1262, 1224, 0.22], q_lig: [1300, 1302, 0.26], q_est: [1298, 1218, 0.27], q_ter: [1236, 1288, 0.23], q_cin: [1272, 1271, 0.20], q_eq: [1307, 1282, 0.23], q_elq: [1366, 1334, 0.20], q_org: [1286, 1293, 0.25], q_amb: [750, 1172, 0.20], med: [991, 1201, 0.38], estm: [975, 1276, 0.36], f_est: [925, 1369, 0.20], '*form': [1150, 1315, 0.20], '*lei': [1183, 1341, 0.20], '*const': [1100, 1357, 0.20] };
  FORMS.forEach(([k]) => { RMAP[k] = RMAP['*form']; });
  LAWS.forEach(([k]) => { RMAP[k] = RMAP[k[0] === 'K' ? '*const' : '*lei']; });
  const rConv = (k, r) => { const [a, b, m] = RMAP[k] || [1181, 1254, .28]; return Math.max(0, Math.min(2500, Math.round(b + m * (r - a)))); };
  const mig = (rs, v) => {
    if (v === RV) return { ...(rs || {}) };
    const o = {};
    for (const k in rs) if (rs[k] && Number.isFinite(rs[k].r)) o[k] = { r: rConv(k, rs[k].r), n: Math.min(rs[k].n || 0, 5) };
    return o;
  };
  // o histórico de cada dia guarda o rating dos tópicos: vai para a escala nova junto
  const migDays = (d, v) => v === RV ? d : Object.fromEntries(Object.entries(d).map(([t, x]) => [t, { ...x, r: Object.fromEntries(Object.entries(x.r).map(([k, r]) => [k, Number.isFinite(r) ? rConv(k, r) : r])) }]));
  const rv0 = load('rv', 1);
  let ratings = mig(load('ratings', {}), rv0);
  try { localStorage.setItem('cm.ratings', JSON.stringify(ratings)); localStorage.setItem('cm.rv', RV); } catch (e) {}
  const R = k => ratings[k] || { r: 1000, n: 0 };
  // tm: tempo esperado da questão, em segundos (as da Unicamp têm o seu); acima dele o acerto vale um pouco menos
  function rate(key, rq, correct, dt, helped, tm) {
    const o = R(key), e = 1 / (1 + 10 ** ((rq - o.r) / 400)), t1 = (tm || 15) * 1000;
    const s = !correct ? 0 : helped ? .5 : dt <= t1 ? 1 : dt <= 2 * t1 ? .85 : .7;
    const k = o.n < 10 ? 60 : o.n < 30 ? 36 : 24;
    const r = Math.max(0, Math.min(2500, o.r + Math.round(k * (s - e))));
    ratings[key] = { r, n: o.n + 1 }; save('ratings', ratings);
    return r - o.r;
  }
  let best = load('best', 0);
  // preferências: aparência, avanço automático, meta do dia, nome e foto (vão para a conta junto com o rating)
  const PREF0 = { theme: 'claro', estilo: '8bit', calAuto: -1, lmeta: 0, fs: 1, auto: -1, autoBad: false, goal: 20, tgoal: 0, tnote: 'end', check: 'auto', name: '', photo: '' };
  const fixPrefs = p => { const o = { ...PREF0, ...(p && typeof p === 'object' ? p : {}) };
    if (!['claro', 'escuro', 'sistema'].includes(o.theme)) o.theme = 'claro';
    if (!['8bit', 'min'].includes(o.estilo)) o.estilo = '8bit';  // 8bit: o visual de sempre; min: minimalista, letra comum
    o.lmeta = Math.max(0, Math.min(200, Math.round(+o.lmeta) || 0));  // meta de livros lidos no ano
    o.calAuto = Math.round(+o.calAuto); if (!Number.isFinite(o.calAuto) || o.calAuto < -1) o.calAuto = -1;  // blocos que passaram contam sozinhos desde esta hora (0 = só confirmando)
    if (![0.9, 1, 1.15, 1.3].includes(+o.fs)) o.fs = 1;
    if (![-1, 0, 1000, 2000, 3000, 5000].includes(+o.auto)) o.auto = -1;
    if (![0, 10, 20, 30, 50].includes(+o.goal)) o.goal = 20;
    if (o.check !== 'ok') o.check = 'auto';
    if (!['start', 'end', 'off'].includes(o.tnote)) o.tnote = 'end';  // quando perguntar o que a pessoa fez em cada sessão de tempo
    o.tgoal = Math.max(0, Math.min(960, Math.round(+o.tgoal) || 0));  // meta de tempo de estudo, em minutos por dia
    o.fs = +o.fs; o.auto = +o.auto; o.goal = +o.goal; o.autoBad = !!o.autoBad;
    o.name = String(o.name || '').slice(0, 40); o.photo = /^data:image\/(jpeg|png|webp);base64,/.test(o.photo) ? o.photo : '';
    return o; };
  let prefs = fixPrefs(load('prefs', {}));
  // metas da pessoa (a página Metas); blocos do calendário e sessões dos relógios podem apontar para uma delas
  // md: a página da meta, em markdown. As metas antigas tinham o porquê (y) e os passos (s): viram a primeira página
  const gMig = g => [String(g.y || '').trim() ? String(g.y).trim().split('\n').map(l => '> ' + l).join('\n') : '',
    (Array.isArray(g.s) ? g.s : []).filter(x => x && String(x.x || '').trim()).map(x => `- [${x.ok ? 'x' : ' '}] ${String(x.x).trim()}`).join('\n')].filter(Boolean).join('\n\n');
  const fixMetas = a => (Array.isArray(a) ? a : []).filter(g => g && typeof g.id === 'string' && (String(g.t || '').trim() || String(g.md || '').trim())).slice(0, 80).map(g => ({
    id: g.id.slice(0, 24), t: String(g.t || '').slice(0, 80), md: typeof g.md === 'string' ? g.md.slice(0, 20000) : gMig(g), k: String(g.k || '').slice(0, 30), y: String(g.y || '').slice(0, 600),
    d: /^\d{4}-\d\d-\d\d$/.test(g.d) ? g.d : '', st: ['on', 'pausa', 'feita'].includes(g.st) ? g.st : 'on', at: +g.at || 0, c: +g.c || 0, u: +g.u || 0,
    s: (Array.isArray(g.s) ? g.s : []).filter(x => x && typeof x.id === 'string' && String(x.x || '').trim()).slice(0, 40).map(x => ({ id: x.id.slice(0, 24), x: String(x.x).slice(0, 120), ok: !!x.ok })) }));
  let metas = fixMetas(load('metas', []));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const metaT = id => { const g = id && metas.find(x => x.id === id); return g ? g.t.trim() || 'Sem título' : ''; };
  // botões para escolher a meta: as em andamento, mais a já escolhida se ela foi pausada ou conquistada
  const goalKs = sel => metas.filter(g => g.st === 'on' || g.id === sel).map(g => `<button type="button" data-g="${g.id}" aria-pressed="${g.id === sel}" title="${esc(metaT(g.id))}">${esc(metaT(g.id).length > 32 ? metaT(g.id).slice(0, 31) + '…' : metaT(g.id))}</button>`).join('');
  // um registro por dia: questões respondidas, acertos e o rating de cada tópico mexido no fim do dia
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const fixDays = d => (d && typeof d === 'object' && !Array.isArray(d) ? Object.fromEntries(Object.entries(d).filter(([k, v]) => /^\d{4}-\d\d-\d\d$/.test(k) && v && typeof v === 'object').map(([k, v]) => [k, { n: +v.n || 0, ok: +v.ok || 0, r: v.r && typeof v.r === 'object' ? v.r : {} }])) : {});
  let days = migDays(fixDays(load('days', {})), rv0);
  if (rv0 !== RV) try { localStorage.setItem('cm.days', JSON.stringify(days)); } catch (e) {}
  let acctName = '', acctPhoto = '';
  let cur = null, revealed = false, helped = false, timer, hist = [], seq = 0, okN = 0, badN = 0, nextT;

  // ---------- questões da Unicamp (banco/unicamp, montado em unicamp.json) ----------
  // entram misturadas com as geradas; um tópico que só existe no banco aparece quando o banco carrega
  let BANK = null;
  const BK = {}, BID = new Map();
  let uSeen = new Set(load('useen', []));
  const nb = k => (BK[k] || []).length;
  const avail = k => !!GEN[k].form || !GEN[k].bank || nb(k) > 0;
  const inMode = k => !!GEN[k].form === (mode === 'teoria');
  const listed = k => inMode(k) && avail(k);
  const inSubj = k => listed(k) && (subj === 'all' || GEN[k].s === subj);
  const shown = () => KEYS.filter(inSubj);
  const pool = () => { const p = shown().filter(k => !off.has(k)); return p.length ? p : shown(); };

  // ---------- ajustes ----------
  // tópicos e rating numa lista só, um grupo por matéria; tocar no tópico liga ou desliga
  let openG = load('open', {});
  const rt = $('rt');
  rt.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.k) { const k = b.dataset.k; off.has(k) ? off.delete(k) : off.add(k); }
    else if (b.dataset.g) {
      e.preventDefault();   // o botão fica no título do grupo: não abre nem fecha o grupo
      const ks = KEYS.filter(k => listed(k) && GEN[k].s === b.dataset.g), allOn = ks.every(k => !off.has(k));
      ks.forEach(k => allOn ? off.add(k) : off.delete(k));
    } else return;
    save('off', [...off]); syncSettings();
    if (cur && !revealed && !pool().includes(cur.key)) next();
  });
  rt.addEventListener('toggle', e => {
    const d = e.target; if (!d.dataset || !d.dataset.s || subj !== 'all') return;
    openG[d.dataset.s] = d.open; save('open', openG);
  }, true);
  $('all').addEventListener('click', () => {
    const ks = shown(), allOn = ks.every(k => !off.has(k));
    ks.forEach(k => allOn ? off.add(k) : off.delete(k));
    if (allOn && cur) off.delete(cur.key);   // "só um": fica o tópico atual
    save('off', [...off]); syncSettings();
  });
  $('subj').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    subj = b.dataset.s; save('subj', subj); syncSettings(); if (!revealed || !inSubj(cur.key)) next();
  });
  $('seg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    level = +b.dataset.l; save('level', level); syncSettings(); if (!revealed) next();
  });
  $('rReset').addEventListener('click', () => {
    if (!confirm('Zerar o rating de todos os tópicos?')) return;
    ratings = {}; save('ratings', ratings); drawRatings(); drawEvo(); if (cur && !revealed) next();
  });
  // nome e linha de cada página, como aparecem no topo
  const PT = { exercicios: ['EXERCÍCIOS', 'contas rápidas, resolvidas de cabeça'], teoria: ['TEORIA', 'fórmulas, leis e constantes, sem contas'], marcadas: ['MARCADAS', 'questões guardadas para estudar depois'],
    estatisticas: ['ESTATÍSTICAS', 'o seu treino, dia a dia'], ranking: ['RANKING', 'quem mais respondeu e estudou'], config: ['CONFIGURAÇÕES', 'perfil, aparência e treino'],
    ruido: ['RUÍDO', 'sons constantes que abafam o barulho em volta, e o que a pesquisa diz'], tempo: ['TEMPO', 'timer, cronômetro e pomodoro'],
    metas: ['METAS', 'os seus porquês, para lembrar nos dias difíceis'], calendario: ['CALENDÁRIO', 'blocos de estudo e o tempo que você estudou, hora a hora'],
    habitos: ['HÁBITOS', 'o que você quer fazer sempre, um dia de cada vez'], leitura: ['LEITURA', 'o que você está lendo, onde parou e o que anotou'] };
  const cur_ = (b, on) => on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current');
  function syncSettings() {
    const here = view === 'treino' ? mode : view;
    $('nav').querySelectorAll('button').forEach(b => cur_(b, b.dataset.v === here));
    cur_($('me'), view === 'config' || view === 'conta');
    $('pTitle').textContent = PT[here][0]; $('modeSub').textContent = PT[here][1];
    $('mCount').textContent = marked.length || '';
    $('consts').hidden = mode === 'teoria';
    $('subj').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.s === subj));
    $('seg').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.l === level));
    $('lvlName').textContent = level < 0 ? 'perto do seu rating' : LEVELS[level];
    const ks = shown(), nOn = ks.filter(k => !off.has(k)).length;
    $('tCount').textContent = `· ${nOn}/${ks.length}`;
    $('all').textContent = nOn === ks.length ? 'só um' : 'todos';
    drawRatings(); evoOptions();
  }
  const avg = ks => { const p = ks.filter(k => R(k).n); return p.length ? Math.round(p.reduce((s, k) => s + R(k).r, 0) / p.length) : '—'; };
  function drawRatings() {
    const one = subj !== 'all';
    rt.innerHTML = SK.filter(s => !one || s === subj).map(s => {
      const ks = KEYS.filter(k => listed(k) && GEN[k].s === s), nOn = ks.filter(k => !off.has(k)).length;
      return `<details class="tg" data-s="${s}"${one || openG[s] ? ' open' : ''}><summary><span class="gn">${SUBJ[s]}</span>`
        + `<span class="gc">${nOn}/${ks.length}</span><span class="ga">${avg(ks)}</span><button type="button" data-g="${s}">${nOn === ks.length ? 'nenhum' : 'todos'}</button></summary><div class="rows">`
        + ks.map(k => {
          const o = R(k), w = Math.max(0, Math.min(100, o.r / 25)), on = !off.has(k);
          const lv = o.n ? LNAME[band(o.r)].toLowerCase() : 'novo';
          return `<button type="button" class="tr${cur && cur.key === k ? ' at' : ''}" data-k="${k}" aria-pressed="${on}" title="${on ? 'Tirar do treino' : 'Voltar ao treino'}">`
            + `<span class="n">${GEN[k].name}</span><span class="bar"><i style="width:calc(${w}% - 2px)"></i></span><span class="v">${o.r}</span><span class="l">${lv}</span></button>`;
        }).join('') + '</div></details>';
    }).join('');
    $('rAll').textContent = avg(KEYS.filter(inMode));
  }

  // ---------- jogo ----------
  const ans = $('ans'), act = $('act'), fb = $('fb'), how = $('how'), tips = $('tips'), opts = $('opts');
  const secs = ms => (ms / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' s';
  const isMC = () => cur && Array.isArray(cur.opts);
  const answerTxt = () => (cur.tol ? '≈ ' : '') + f(cur.a).replace(/^-/, '−') + (cur.u ? ' ' + cur.u : '');

  // últimas questões vistas (fica salvo, para não repetir nem depois de recarregar)
  const RECENT = 120;
  let recent = load('recent', []); if (!Array.isArray(recent)) recent = [];
  const remember = q => {
    const id = qid(q); recent = [id, ...recent.filter(x => x !== id)].slice(0, RECENT);
    try { localStorage.setItem('cm.recent', JSON.stringify(recent)); } catch (e) {}
  };

  // sorteia o tópico (de preferência outro, não o da questão anterior), gera várias candidatas
  // e sorteia entre as que estão na faixa certa e não apareceram há pouco:
  // no AUTO, perto do rating do tópico; nos outros, dentro da faixa escolhida.
  // Se o tópico já se esgotou, volta a que foi vista há mais tempo.
  // As da Unicamp entram na mesma disputa; uma já vista só volta quando as outras da faixa acabaram,
  // e, havendo das duas, a da Unicamp sai em PB das vezes (ela é mais longa que uma conta gerada)
  const PB = .3;
  function next() {
    clearTimeout(nextT);
    const all = pool(), keys = cur && all.length > 2 ? all.filter(k => k !== cur.key) : all;
    const age = new Map(recent.map((id, i) => [id, i])), [lo, hi] = BAND[level] || [];
    let best = null, bs = Infinity;
    for (let tries = 0; tries < 8; tries++) {
      const key = pick(keys), target = R(key).r + ri(-120, 120), good = [], goodB = [];
      const dist = r => level < 0 ? Math.abs(r - target) : r >= lo && r < hi ? 0 : Math.min(Math.abs(r - lo), Math.abs(r - hi));
      if (!GEN[key].bank) for (let i = 0; i < 30; i++) {
        const L = i % 3, q = GEN[key].g(L); if (!q) continue;
        const r = qRating(key, q, L), id = qid({ ...q, key }), d = dist(r);
        const seen = age.has(id), score = d + (seen ? 1e6 - age.get(id) * 1e3 : 0);
        if (score < bs) { bs = score; best = { q, key, L, r }; }
        if (!seen && d <= (level < 0 ? 150 : 0)) good.push({ q, key, L, r });
      }
      if (!GEN[key].form) for (const it of BK[key] || []) {
        const id = 'u|' + it.id, d = dist(it.r), seen = uSeen.has(it.id);
        const score = d + (age.has(id) ? 1e6 - age.get(id) * 1e3 : seen ? 5e5 : 0);
        if (score < bs) { bs = score; best = { it }; }
        if (!seen && d <= (level < 0 ? 150 : 0)) goodB.push(it);
      }
      if (goodB.length && (!good.length || Math.random() < PB)) return showBank(pick(goodB));
      if (good.length) { const g = pick(good); return show(g.q, g.key, g.L, g.r); }
    }
    if (best) best.it ? showBank(best.it) : show(best.q, best.key, best.L, best.r);
  }
  // questão do banco no formato do treino: as alternativas são embaralhadas (no arquivo, a certa é sempre a primeira)
  function bankQ(it, keep) {
    const q = { uid: it.id, tm: it.tm, d: it.d || [], fig: it.fig || '', ctx: it.ctx, q: '', h: `<ol class="dg">${(it.h || []).map(x => `<li>${x}</li>`).join('')}</ol>` };
    if (Array.isArray(it.opts)) {
      const o = keep ? it.opts.map((x, i) => [x, i]) : shuffle(it.opts.map((x, i) => [x, i]));
      q.opts = o.map(x => x[0]); q.a = o.findIndex(x => x[1] === it.a);
    } else { q.a = it.a; if (it.u) q.u = it.u; if (it.tol) q.tol = it.tol; }
    return q;
  }
  function showBank(it) {
    uSeen.add(it.id); try { localStorage.setItem('cm.useen', JSON.stringify([...uSeen].slice(-3000))); } catch (e) {}
    show(bankQ(it), it.t, band(it.r), it.r);
  }
  // o banco chega depois da página: as questões da Unicamp entram no sorteio a partir da próxima
  fetch('unicamp.json').then(r => r.ok ? r.json() : []).catch(() => []).then(a => {
    BANK = (Array.isArray(a) ? a : []).filter(it => it && it.id && GEN[it.t] && Number.isFinite(it.r));
    for (const it of BANK) { (BK[it.t] = BK[it.t] || []).push(it); BID.set(it.id, it); }
    syncSettings();
    if (view === 'marcadas') drawMarked();
  });

  // a fonte de título só tem maiúsculas: Zn vira ZN e o Z parece 2. Teoria, química e tudo que tem
  // letra minúscula vai na fonte do texto, que diferencia maiúsculas de minúsculas
  const lowFont = (key, q) => !!GEN[key] && (!!GEN[key].form || GEN[key].s === 'qui' || /[a-zà-ÿα-ωµ]/.test(String(q || '').replace(/<[^>]+>/g, '')));
  // tempo da questão: só corre com a questão na tela e alguém mexendo nela. Pausa com o Faro escondido
  // (outra aba, outro app, tela bloqueada), fora da página de treino e depois de 90 s sem tocar em nada
  const IDLE = 90000, pnow = () => performance.now();
  let qBank = 0, qMark = 0, qLast = 0, qOff = false;
  const qSeen = () => !document.hidden && view === 'treino';
  // guarda o tempo ativo até n e recomeça a medir dali
  function qTick(n) {
    if (!qOff) { const end = Math.min(n, qLast + IDLE); if (end > qMark) qBank += end - qMark; }
    qMark = n;
  }
  const qTime = (n = pnow()) => qBank + (qOff ? 0 : Math.max(0, Math.min(n, qLast + IDLE) - qMark));
  function qStart() { const n = pnow(); qBank = 0; qMark = qLast = n; qOff = !qSeen(); }
  function qPoke() { if (!cur || revealed) return; const n = pnow(); qTick(n); qLast = n; }
  function qSee() {
    if (!cur || revealed || qOff === !qSeen()) return;
    const n = pnow(); qTick(n); qOff = !qOff; if (!qOff) qLast = n;
  }
  function qClock() {
    const n = pnow(), zz = qOff || n - qLast >= IDLE, c = $('clock');
    c.textContent = secs(qTime(n)); c.classList.toggle('zz', zz);
    c.title = zz ? 'pausado: volta a contar quando você mexer na página' : '';
  }
  for (const t of ['keydown', 'pointerdown', 'input', 'wheel', 'touchstart']) document.addEventListener(t, qPoke, { capture: true, passive: true });
  addEventListener('scroll', qPoke, { capture: true, passive: true });
  let qMv = 0;
  document.addEventListener('pointermove', () => { const n = pnow(); if (n - qMv > 1000) { qMv = n; qPoke(); } }, { passive: true });
  document.addEventListener('visibilitychange', qSee);

  function show(q, key, L, r) {
    clearTimeout(nextT);
    if (!Number.isFinite(r)) r = qRating(key, q, L);
    cur = { ...q, key, L, r };
    remember(cur);
    $('topic').textContent = GEN[key].name; $('topic').title = GEN[key].name;
    $('qlvl').innerHTML = `<span class="bw">${LNAME[band(r)]} </span>${r}`;
    $('fig').innerHTML = q.fig || ''; $('fig').hidden = !q.fig;
    $('qbox').classList.toggle('uq', !!q.uid);
    $('ctx').innerHTML = q.ctx || '';
    $('expr').innerHTML = q.q || '';
    $('expr').classList.toggle('f', lowFont(key, q.q));
    $('lg').innerHTML = q.lg ? `<span class="lt">termos</span> ${q.lg}` : '';
    $('qbox').classList.toggle('mc', isMC());
    opts.innerHTML = isMC() ? q.opts.map((o, i) => `<button type="button" class="opt" data-i="${i}"><span class="n">${i + 1}</span><span>${o}</span></button>`).join('') : '';
    $('unit').innerHTML = q.u || '';
    $('form').classList.toggle('hasu', !!q.u);
    ans.value = ''; ans.disabled = false; ans.placeholder = q.tol ? '≈ ?' : '?';
    fb.innerHTML = ''; how.innerHTML = '';
    closeTips();
    act.classList.remove('go', 'tick'); act.innerHTML = 'PULAR <span class="key">esc</span>';
    $('mark').classList.remove('hint');
    $('ok').textContent = $('padOk').textContent = 'OK';
    revealed = false; helped = false;
    syncMark();
    drawRatings();
    qStart();
    clearInterval(timer);
    timer = setInterval(qClock, 100);
    qClock();
    if (!isMC() && matchMedia('(hover: hover)').matches) ans.focus({ preventScroll: true });
  }

  function finish(correct, skipped, chosen) {
    clearInterval(timer);
    qTick(pnow());
    const dt = qBank;
    $('clock').textContent = secs(dt); $('clock').classList.remove('zz'); $('clock').title = '';
    revealed = true; ans.disabled = true;
    hist.push({ ok: correct, t: dt }); if (hist.length > 40) hist.shift();
    if (correct) { okN++; seq++; if (seq > best) { best = seq; save('best', best); } }
    else { badN++; seq = 0; }
    const d = rate(cur.key, cur.r, correct, dt, helped, cur.tm);
    if (!skipped) studyQ(dt);
    logDay(cur.key, !skipped, correct); drawGoal(); drawEvo();
    const dTxt = `rating ${R(cur.key).r} <span class="dr">${d >= 0 ? '+' : '−'}${Math.abs(d)}</span>`;
    const say = (v, ...xs) => { fb.innerHTML = `<b>${v}</b> <span>${[...xs.filter(Boolean), dTxt].join(' · ')}</span>`; };
    stats(); drawHist(); drawRatings();
    if (isMC()) opts.querySelectorAll('.opt').forEach((b, i) => {
      b.disabled = true;
      if (i === cur.a) b.classList.add('right'); else if (i === chosen) b.classList.add('wrong');
    });
    act.classList.add('go'); act.innerHTML = 'PRÓXIMO → <span class="key">enter</span>';
    $('ok').textContent = $('padOk').textContent = '→';
    if (correct) {
      say(`✓ CERTA${helped ? ' COM DICA' : ''}`, secs(dt), cur.tol ? `exato:&nbsp;${f(cur.a)}` : '');
      // na da Unicamp, os degraus ficam fechados: quem acertou abre se quiser conferir
      how.innerHTML = cur.uid ? `<details class="dgs"><summary>ver os degraus</summary>${cur.h}</details>` : cur.h || '';
    } else {
      say(skipped ? 'PULADA' : '✗ ERRADA', isMC() ? 'a certa está em destaque' : `era <i>${answerTxt()}</i>`);
      if (!skipped && !isMC()) ans.value = ans.value + '  ✗';
      closeTips();
      const more = GEN[cur.key].bank ? '' : `<a href="${TIPS_URL}#${tipKey(cur.key)}" target="_blank" rel="noopener" style="color:var(--mute)">· mais dicas ↗</a>`;
      how.innerHTML = cur.uid ? `<p class="dgt">Resolução em degraus</p>${cur.h}${more ? `<p>${more}</p>` : ''}` : `${cur.h || ''} ${more}`;
      // quem erra decide se guarda a questão: o botão MARCAR chama a atenção
      if (!isMarked()) $('mark').classList.add('hint');
    }
    // avançar sozinho só quando a pessoa escolheu isso nas configurações
    if (prefs.auto >= 0 && (correct || prefs.autoBad)) autoNext(correct ? prefs.auto : Math.max(prefs.auto, 1500));
  }
  function autoNext(ms) {
    const d = Math.max(ms, 300);
    act.style.setProperty('--d', d + 'ms'); act.classList.remove('tick'); void act.offsetWidth; act.classList.add('tick');
    nextT = setTimeout(next, d);
  }
  // abrir a dica ou marcar segura a questão na tela
  const holdOn = () => { if (revealed) { clearTimeout(nextT); act.classList.remove('tick'); } };

  // ---------- dúvida: abre as dicas do tópico embaixo da questão, sem sair da página ----------
  function closeTips() { tips.hidden = true; tips.innerHTML = ''; $('help').setAttribute('aria-expanded', 'false'); }
  function openTips() {
    // na teoria, a lista do tópico entregaria a resposta: vai só a dica desta questão
    // nos exercícios, a dica que explica esta conta (tk) vem primeiro, em destaque
    // na da Unicamp, só as dicas da própria questão: as fórmulas e ideias que bastam para resolvê-la
    const all = TIPMAP[tipKey(cur.key)] || TIPMAP.geral || [];
    const ts = GEN[cur.key].form ? [['Dica', cur.t || 'Elimine primeiro as alternativas que você tem certeza de que estão erradas.', '']]
      : cur.uid ? cur.d : [...all.filter(x => x[0] === cur.tk), ...all.filter(x => x[0] !== cur.tk)];
    tips.innerHTML = `<span class="tt"><span>Dicas · ${GEN[cur.key].name}</span><span>${revealed ? '' : 'a questão continua valendo'}</span></span>`
      + ts.map(([t, desc, ex]) => `<p class="tip${t === cur.tk ? ' this' : ''}"><b>${t}</b> ${desc}${ex ? `<span class="ex">ex.: ${ex}</span>` : ''}</p>`).join('')
      + `<span class="links">${revealed ? '' : '<button type="button" id="sol">ver a resolução</button>'}${GEN[cur.key].bank ? '' : `<a href="${TIPS_URL}#${tipKey(cur.key)}" target="_blank" rel="noopener">abrir a página de dicas ↗</a>`}</span>`;
    tips.hidden = false; $('help').setAttribute('aria-expanded', 'true');
    if (!revealed) helped = true;
    holdOn();
    tips.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  const toggleTips = () => { if (!cur) return; tips.hidden ? openTips() : closeTips(); };
  $('help').addEventListener('click', toggleTips);
  tips.addEventListener('click', e => { if (e.target.id === 'sol' && !revealed) finish(false, true); });

  // ---------- resposta: aceita vírgula ou ponto decimal, e ponto de milhar ----------
  const parse = s => {
    s = s.replace(/\s|✗/g, '').replace(/[−–]/g, '-');
    if (!/^-?[\d.,]+$/.test(s)) return [];
    const c = [];
    if (s.includes(',')) c.push(+s.replace(/\./g, '').replace(',', '.'));
    else { c.push(+s); if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) c.push(+s.replace(/\./g, '')); }
    return c.filter(Number.isFinite);
  };
  // nas estimativas (tol), vale qualquer resposta a até tol do valor exato
  const right = s => parse(s).some(v => Math.abs(v - cur.a) <= (cur.tol ? cur.tol * Math.abs(cur.a) : 0) + 1e-9 * Math.max(1, Math.abs(cur.a)));
  // com "conferir sozinho", a resposta certa é aceita assim que é digitada; com "só no OK", nada é conferido antes do OK
  const autoCheck = () => { if (prefs.check === 'auto' && !revealed && !isMC() && right(ans.value)) finish(true, false); };
  ans.addEventListener('input', autoCheck);

  opts.addEventListener('click', e => {
    const b = e.target.closest('.opt'); if (!b || revealed) return;
    finish(+b.dataset.i === cur.a, false, +b.dataset.i);
  });

  const touch = matchMedia('(pointer: coarse), (hover: none)').matches;
  if (touch) { ans.readOnly = true; ans.setAttribute('inputmode', 'none'); }
  $('pad').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset.d;
    if (d === 'ok') return $('form').requestSubmit();
    if (revealed) return;
    if (d === 'del') ans.value = ans.value.slice(0, -1);
    else if (d === 'neg') ans.value = ans.value.startsWith('−') ? ans.value.slice(1) : '−' + ans.value;
    else if (d === ',') { if (!ans.value.includes(',')) ans.value = (/\d$/.test(ans.value) ? ans.value : ans.value + '0') + ','; }
    else if (ans.value.length < 10) ans.value += d;
    autoCheck();
  });

  $('form').addEventListener('submit', e => {
    e.preventDefault();
    if (revealed) return next();
    if (!parse(ans.value).length) return;
    finish(right(ans.value), false);
  });
  act.addEventListener('click', () => revealed ? next() : finish(false, true));
  document.addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('#tnCard')) { if (e.key === 'Escape') { e.preventDefault(); tnClose(); } return; }
    if (e.key === 'Escape' && !$('calCard').hidden) { e.preventDefault(); const f = e.target.closest && e.target.closest('#calCard'); calClose(); if (f) $('calNew').focus(); return; }
    if (e.target.closest && e.target.closest('#calCard')) return;
    if (e.key === 'Escape' && side.classList.contains('open')) return closeSide();
    if (e.key === 'Escape' && !$('tmToast').hidden) return tmHush();
    if (view === 'tempo' || view === 'ruido') {
      if (e.ctrlKey || e.metaKey || e.altKey || (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName) && e.target.type !== 'range')) return;
      if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); if (view === 'tempo') tmGo(); else nzToggle(); }
      else if (view === 'tempo' && (e.key === 'v' || e.key === 'V')) tmAlt();
      else if (view === 'tempo' && (e.key === 'r' || e.key === 'R')) tmReset();
      else if (e.key === 'Escape') go(mode);
      return;
    }
    if (view === 'estatisticas' && e.key === 'Escape' && !$('manForm').hidden) { manOpen(false); $('manOpen').focus(); return; }
    if (view === 'metas' && e.key === 'Escape' && glPg) { if (e.target.tagName === 'TEXTAREA') { glMode = 'ver'; drawGoals(); } else glBack(); return; }
    if (view === 'habitos' && e.key === 'Escape' && !$('hbForm').hidden) { hbClose(); $('hbNew').focus(); return; }
    if (view === 'leitura' && e.key === 'Escape' && (lvPg || !$('lvForm').hidden)) { if (e.target.tagName === 'TEXTAREA') { lvMode = 'ver'; drawRead(); } else if (lvPg) lvBack(); else { $('lvForm').hidden = true; drawRead(); } return; }
    if (view !== 'treino') { if (e.key === 'Escape' && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) go(mode); return; }
    if (e.key === 'Escape' && !revealed) { e.preventDefault(); finish(false, true); }
    else if (e.key === 'Enter' && revealed && e.target.tagName !== 'BUTTON') { e.preventDefault(); next(); }
    else if (e.key === '?') { e.preventDefault(); if (view === 'treino') toggleTips(); }
    else if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey && view === 'treino') { e.preventDefault(); toggleMark(); }
    else if (isMC() && !revealed && /^[1-4]$/.test(e.key) && +e.key <= cur.opts.length) {
      e.preventDefault(); const i = +e.key - 1; finish(i === cur.a, false, i);
    }
  });

  function stats() {
    $('sOk').textContent = okN; $('sBad').textContent = badN;
    $('sSeq').textContent = best ? `${seq}/${best}` : seq;
    const oks = hist.filter(h => h.ok);
    $('sAvg').textContent = oks.length ? secs(oks.reduce((s, h) => s + h.t, 0) / oks.length) : '—';
  }

  // histórico em blocos de "pixel": cheio = acerto, vazado = erro
  const cv = $('hist'), g = cv.getContext('2d');
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const COLS = 40, PX = 4, MAXT = 30000;
  function drawHist() {
    const W = cv.width, H = cv.height, cw = W / COLS, ink = css('--ink'), faint = css('--faint');
    g.clearRect(0, 0, W, H);
    $('histEmpty').hidden = hist.length > 0;
    g.fillStyle = faint;
    for (let y = H / 3; y < H; y += H / 3) g.fillRect(0, Math.round(y), W, 1);
    const offs = COLS - hist.length;
    hist.forEach((h, i) => {
      const x = Math.round((offs + i) * cw) + 1, w = Math.max(2, Math.round(cw) - 4);
      const bh = Math.max(PX, Math.round(Math.min(1, h.t / MAXT) * (H - 4) / PX) * PX);
      g.fillStyle = ink;
      if (h.ok) {
        for (let y = H - PX; y >= H - bh; y -= PX) g.fillRect(x, y + 1, w, PX - 1);
      } else {
        g.fillRect(x, H - bh, w, 1); g.fillRect(x, H - 1, w, 1);
        g.fillRect(x, H - bh, 1, bh); g.fillRect(x + w - 1, H - bh, 1, bh);
      }
    });
  }

  // ---------- ícones em pixel, no mesmo traço das fontes ----------
  const pix = rows => {
    const w = rows[0].length, h = rows.length; let d = '';
    rows.forEach((r, y) => [...r].forEach((c, x) => { if (c === '#') d += `M${x} ${y}h1v1h-1z`; }));
    return `<svg viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg>`;
  };
  const LAMP = pix(['....####....', '..##....##..', '.#........#.', '#..##......#', '#.#........#', '#..........#', '.#........#.', '..#......#..', '...#....#...', '...######...', '............', '...######...', '............', '....####....']);
  const MARK0 = pix(['#########', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#', '#.......#', '#...#...#', '#..#.#..#', '#.#...#.#', '##.....##']);
  const MARK1 = pix(['#########', '#########', '#########', '#########', '#########', '#########', '#########', '#########', '####.####', '###...###', '##.....##', '#.......#']);
  $('icoLamp').innerHTML = LAMP;

  // ---------- perfil e configurações ----------
  const PERSON = pix(['...###...', '..#####..', '..#####..', '..#####..', '...###...', '.........', '.#######.', '#########', '#########', '#########']);
  // a raposa: mascote do Faro, no mesmo traço de pixel das fontes
  const FOX = pix(['......##.##.', '......#.#.#.', '.....#.#.#.#', '.##..#.#.#.#', '#..#..#.#.#.', '#..#...###..', '#.#.#.#...#.', '.#...#....#.', '..#...#.#.#.', '...#..#.#.#.', '....######..']);
  $('logo').innerHTML = FOX;
  $('logo2').innerHTML = FOX;
  const avatar = (el, big) => {
    const src = prefs.photo || acctPhoto;
    if (!src) { el.innerHTML = PERSON; return; }
    const im = new Image(); im.alt = ''; im.src = src; if (big) im.alt = 'Foto de perfil';
    im.onerror = () => { el.innerHTML = PERSON; };
    el.replaceChildren(im);
  };
  function drawProfile() {
    avatar($('meAv')); avatar($('pAv'), true);
    $('meName').textContent = prefs.name || acctName;
    $('pName').placeholder = acctName || 'seu nome';
    if (document.activeElement !== $('pName')) $('pName').value = prefs.name;
    $('pNoPhoto').hidden = !prefs.photo;
  }
  const segOn = (id, v) => $(id).querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.v === +v || b.dataset.v === v));
  function drawConfig() {
    segOn('cTheme', prefs.theme); segOn('cStyle', prefs.estilo); segOn('cFs', prefs.fs); segOn('cAuto', prefs.auto); segOn('cGoal', prefs.goal); segOn('cCheck', prefs.check); segOn('cTNote', prefs.tnote);
    $('tnNoteTxt').textContent = prefs.tnote === 'start' ? 'Ao começar um timer, um cronômetro do zero ou um foco do pomodoro, aparece um campo para escrever o que você vai fazer.'
      : prefs.tnote === 'end' ? 'Quando um timer acaba, um foco do pomodoro termina ou você zera o cronômetro, aparece um campo para escrever o que fez (se ainda não tiver escrito).'
      : 'Nada é perguntado. Dá para escrever mesmo assim, tocando na sessão, na lista da página Tempo.';
    $('checkNote').textContent = prefs.check === 'auto' ? 'A resposta certa é aceita assim que você termina de digitar. Uma resposta errada só é conferida no OK (ou Enter).'
      : 'Nada é conferido até você apertar OK (ou Enter): dá para digitar, apagar e revisar antes.';
    $('cAutoBad').setAttribute('aria-pressed', prefs.autoBad); $('cAutoBad').hidden = prefs.auto < 0;
    $('autoNote').textContent = prefs.auto < 0 ? 'Desligado: a questão fica na tela até você tocar em PRÓXIMO, com tempo para ler a resolução e marcar.'
      : `Depois de acertar, a próxima vem ${prefs.auto ? `em ${prefs.auto / 1000} s` : 'na hora'}${prefs.autoBad ? '; depois de errar ou pular, com pelo menos 1,5 s para ver a resposta' : ''}. Abrir a dica ou marcar a questão segura a tela.`;
    drawProfile(); drawTGoal();
  }
  // escuro agora? (o tema "sistema" segue o aparelho, ou o claude.ai quando ele diz)
  const isDark = () => prefs.theme === 'escuro' || (prefs.theme === 'sistema' && (document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches));
  // o botão do menu troca entre claro e escuro, com ou sem conta
  function drawThemeQ() {
    const d = isDark(), b = $('themeQ');
    b.setAttribute('aria-pressed', d); b.setAttribute('aria-label', d ? 'Usar o tema claro' : 'Usar o tema escuro');
    b.title = d ? 'tema claro' : 'tema escuro'; $('themeQT').textContent = d ? 'claro' : 'escuro';
    const k = d ? 'sun' : 'moon'; if (b.dataset.k !== k) { b.dataset.k = k; b.querySelector('.ico').innerHTML = d ? SUN : MOON; }
  }
  const MOON = pix(['...####..', '.##......', '.#.......', '#........', '#........', '#........', '.#......#', '.##....##', '...####..']);
  const SUN = pix(['....#....', '.#.....#.', '...###...', '..#####..', '#.#####.#', '..#####..', '...###...', '.#.....#.', '....#....']);
  $('themeQ').addEventListener('click', () => setPref('theme', isDark() ? 'claro' : 'escuro'));
  function applyPrefs() {
    const r = document.documentElement;
    r.dataset.tema = prefs.theme; r.dataset.estilo = prefs.estilo; r.style.setProperty('--fs', prefs.fs);
    drawThemeQ();
    drawProfile(); drawGoal(); drawHist(); drawEvo();
    if (view === 'config') drawConfig();
    drawTGoal();
  }
  const setPref = (k, v) => { prefs[k] = v; save('prefs', prefs); applyPrefs(); };
  const segPick = (id, k, num) => $(id).addEventListener('click', e => { const b = e.target.closest('button'); if (b) setPref(k, num ? +b.dataset.v : b.dataset.v); });
  segPick('cTheme', 'theme'); segPick('cStyle', 'estilo'); segPick('cFs', 'fs', true); segPick('cAuto', 'auto', true); segPick('cGoal', 'goal', true); segPick('cCheck', 'check'); segPick('cTNote', 'tnote');
  $('cAutoBad').addEventListener('click', () => setPref('autoBad', !prefs.autoBad));
  $('pName').addEventListener('input', e => { prefs.name = e.target.value.slice(0, 40); save('prefs', prefs); $('meName').textContent = prefs.name.trim() || acctName; });
  $('pName').addEventListener('change', e => { prefs.name = e.target.value.trim().slice(0, 40); save('prefs', prefs); drawProfile(); rkQueue(); });
  $('pPhoto').addEventListener('click', () => $('pFile').click());
  $('pNoPhoto').addEventListener('click', () => setPref('photo', ''));
  // a foto vira um quadrado de 96 px, pequeno o bastante para ir junto com o resto na conta
  $('pFile').addEventListener('change', async e => {
    const file = e.target.files && e.target.files[0]; e.target.value = ''; if (!file) return;
    try {
      const bmp = await createImageBitmap(file), s = Math.min(bmp.width, bmp.height), c = document.createElement('canvas');
      c.width = c.height = 96;
      c.getContext('2d').drawImage(bmp, (bmp.width - s) / 2, (bmp.height - s) / 2, s, s, 0, 0, 96, 96);
      setPref('photo', c.toDataURL('image/jpeg', .85));
    } catch (err) { alert('Não deu para abrir essa imagem. Tente uma foto em JPG ou PNG.'); }
  });
  $('dReset').addEventListener('click', () => {
    if (!confirm('Apagar a evolução do rating e a contagem de dias?')) return;
    days = {}; save('days', days); drawGoal(); drawEvo(); evoOptions();
  });
  // o tema "sistema" acompanha o aparelho e o claude.ai; o histórico em canvas precisa ser redesenhado
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { drawHist(); drawThemeQ(); });
  new MutationObserver(() => drawHist()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ---------- meta do dia e dias seguidos ----------
  function logDay(key, answered, correct) {
    const t = dayKey(), first = !Object.keys(days).length, d = days[t] || (days[t] = { n: 0, ok: 0, r: {} });
    // no primeiro registro entram todos os tópicos já jogados, para a média geral partir do lugar certo
    if (first) for (const k in ratings) if (ratings[k].n) d.r[k] = ratings[k].r;
    if (answered) { d.n++; if (correct) d.ok++; }
    d.r[key] = R(key).r;
    const ks = Object.keys(days).sort(); while (ks.length > 400) delete days[ks.shift()];
    save('days', days); evoOptions(); rkQueue();
  }
  function streak() {
    const need = Math.max(1, prefs.goal), d = new Date(), met = () => ((days[dayKey(d)] || {}).n || 0) >= need;
    let s = 0;
    if (!met()) d.setDate(d.getDate() - 1);
    while (met()) { s++; d.setDate(d.getDate() - 1); }
    return s;
  }
  function drawGoal() {
    const n = (days[dayKey()] || {}).n || 0, g = prefs.goal, s = streak(), done = g && n >= g;
    $('gTxt').innerHTML = !g ? `hoje <b>${n}</b> ${n === 1 ? 'questão' : 'questões'}` : done ? `<span class="gfox">${FOX}</span><b>meta do dia</b> ${n}/${g}` : `hoje <b>${n}</b>/${g}`;
    $('gBar').hidden = !g; $('gFill').style.width = `calc(${Math.min(100, g ? 100 * n / g : 0)}% - 2px)`;
    $('goal').classList.toggle('done', !!done);
    $('gSeq').innerHTML = `<b>${s}</b> ${s === 1 ? 'dia seguido' : 'dias seguidos'}`;
  }

  // ---------- evolução do rating: um ponto por dia jogado ----------
  const evoK = $('evoK');
  function series(k) {
    const last = {}, out = [];
    for (const d of Object.keys(days).sort()) {
      const r = days[d].r; Object.assign(last, r);
      if (k === 'geral') {
        if (!Object.keys(r).some(x => GEN[x] && inMode(x))) continue;
        const ks = Object.keys(last).filter(x => GEN[x] && inMode(x));
        out.push({ d, v: Math.round(ks.reduce((s, x) => s + last[x], 0) / ks.length), n: days[d].n });
      } else if (k in r) out.push({ d, v: r[k], n: days[d].n });
    }
    return out;
  }
  function evoOptions() {
    const seen = new Set(); for (const d in days) for (const k in days[d].r) seen.add(k);
    const ks = KEYS.filter(k => inMode(k) && seen.has(k)).sort((a, b) => GEN[a].name.localeCompare(GEN[b].name, 'pt'));
    const v = evoK.value, html = `<option value="geral">geral${mode === 'teoria' ? ' · teoria' : ''}</option>` + ks.map(k => `<option value="${k}">${GEN[k].name}</option>`).join('');
    if (evoK.dataset.h !== html) { evoK.innerHTML = html; evoK.dataset.h = html; evoK.value = ks.includes(v) ? v : 'geral'; }
  }
  evoK.addEventListener('change', () => drawEvo());
  const fmtD = d => `${d.slice(8, 10)}/${d.slice(5, 7)}`;
  function drawEvo() {
    const box = $('evo'); if (!box || view !== 'estatisticas') return;
    const k = evoK.value || 'geral', pts = series(k).slice(-60), sum = $('evoSum');
    if (!pts.length) { box.innerHTML = '<p class="hempty">o rating de cada dia aparece aqui</p>'; sum.textContent = ''; return; }
    const W = Math.max(200, box.clientWidth - 20), H = 150, ml = 40, mr = 12, mt = 12, mb = 24;
    let lo = Math.min(...pts.map(p => p.v)), hi = Math.max(...pts.map(p => p.v));
    const pad = Math.max(50, (hi - lo) * .15);
    lo = Math.max(0, Math.floor((lo - pad) / 50) * 50); hi = Math.min(2500, Math.ceil((hi + pad) / 50) * 50);
    if (hi - lo < 200) { lo = Math.max(0, Math.min(lo, 2300)); hi = lo + 200; }
    const t0 = Date.parse(pts[0].d), span = Date.parse(pts[pts.length - 1].d) - t0;
    const X = p => span ? ml + (Date.parse(p.d) - t0) / span * (W - ml - mr) : (ml + W - mr) / 2, Y = v => mt + (hi - v) / (hi - lo) * (H - mt - mb);
    const step = [50, 100, 200, 250, 500].find(s => (hi - lo) / s <= 4) || 500;
    let g = '';
    for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) g += `<line class="gl" x1="${ml}" x2="${W - mr}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${ml - 6}" y="${Y(v) + 4}" text-anchor="end">${v}</text>`;
    // as faixas de dificuldade, para ler a curva
    for (const [v, nm] of [[1100, 'médio'], [1400, 'difícil']]) if (v > lo && v < hi) g += `<line class="bl" x1="${ml}" x2="${W - mr}" y1="${Y(v)}" y2="${Y(v)}"/><text class="bt" x="${W - mr}" y="${Y(v) - 4}" text-anchor="end">${nm}</text>`;
    g += `<text x="${ml}" y="${H - 6}">${fmtD(pts[0].d)}</text>` + (pts.length > 1 ? `<text x="${W - mr}" y="${H - 6}" text-anchor="end">${fmtD(pts[pts.length - 1].d)}</text>` : '');
    const path = pts.map((p, i) => `${i ? 'L' : 'M'}${X(p).toFixed(1)} ${Y(p.v).toFixed(1)}`).join('');
    const first = pts[0].v, lastV = pts[pts.length - 1].v, top = Math.max(...pts.map(p => p.v)), dv = lastV - first;
    const label = `${k === 'geral' ? 'Rating geral' : GEN[k].name}: ${first} no primeiro dia, ${lastV} agora, em ${pts.length} ${pts.length === 1 ? 'dia' : 'dias'} de treino`;
    box.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${g}<path class="ln" d="${path}"/>`
      + pts.map(p => `<rect class="pt" x="${X(p) - 3.5}" y="${Y(p.v) - 3.5}" width="7" height="7"/>`).join('')
      + `<line class="cx" id="evoX" y1="${mt}" y2="${H - mb}" visibility="hidden"/></svg><span class="tt" id="evoT" hidden></span>`;
    sum.innerHTML = pts.length === 1 ? `${lastV} hoje · treine em outros dias para ver a curva`
      : `início <b>${first}</b> · agora <b>${lastV}</b> (${dv >= 0 ? '+' : '−'}${Math.abs(dv)}) · melhor <b>${top}</b>`;
    // passar o dedo ou o mouse mostra o dia mais perto
    const svg = box.querySelector('svg'), cx = $('evoX'), tt = $('evoT');
    const hover = e => {
      const bx = svg.getBoundingClientRect(), x = e.clientX - bx.left;
      let p = pts[0]; for (const q of pts) if (Math.abs(X(q) - x) < Math.abs(X(p) - x)) p = q;
      cx.setAttribute('x1', X(p)); cx.setAttribute('x2', X(p)); cx.setAttribute('visibility', 'visible');
      tt.hidden = false; tt.textContent = `${fmtD(p.d)} · ${p.v} · ${p.n} ${p.n === 1 ? 'questão' : 'questões'}`;
      tt.style.left = `${Math.min(Math.max(X(p) + 10, tt.offsetWidth / 2 + 4), box.clientWidth - tt.offsetWidth / 2 - 4)}px`;
    };
    svg.addEventListener('pointermove', hover); svg.addEventListener('pointerdown', hover);
    svg.addEventListener('pointerleave', () => { cx.setAttribute('visibility', 'hidden'); tt.hidden = true; });
  }
  let rsT; addEventListener('resize', () => { clearTimeout(rsT); rsT = setTimeout(drawEvo, 150); });

  // ---------- menu lateral: fixo no computador, gaveta no celular ----------
  const side = $('side');
  const NI = {
    calc: pix(['#########', '#.......#', '#.#####.#', '#.......#', '#.#.#.#.#', '#.......#', '#.#.#.#.#', '#.......#', '#########']),
    book: pix(['.###.###.', '#...#...#', '#...#...#', '#...#...#', '#...#...#', '#...#...#', '.###.###.', '....#....']),
    mark: MARK0,
    stats: pix(['.......##', '.......##', '....##.##', '....##.##', '.##.##.##', '.##.##.##', '.........', '#########']),
    rank: pix(['#########', '##.....##', '##.....##', '.#.....#.', '..#...#..', '...###...', '....#....', '..#####..']),
    flag: pix(['#........', '####.....', '#######..', '#########', '#######..', '####.....', '#........', '#........', '#........']),
    cal: pix(['.#.....#.', '#########', '#.......#', '#########', '#.......#', '#.#.#.#.#', '#.......#', '#.#.#.#.#', '#########']),
    hab: pix(['#########', '#.......#', '#......##', '#.....#.#', '##...#..#', '#.#.#...#', '#..#....#', '#.......#', '#########']),
    read: pix(['##.....##', '#.##.##.#', '#...#...#', '#.#.#.#.#', '#...#...#', '#.#.#.#.#', '#...#...#', '.###.###.', '....#....']),
  };
  $('nav').querySelectorAll('.ni').forEach(n => { n.innerHTML = NI[n.dataset.i]; });
  const XI = pix(['#.....#', '.#...#.', '..#.#..', '...#...', '..#.#..', '.#...#.', '#.....#']);
  $('sideX').innerHTML = XI; document.querySelectorAll('.unpin').forEach(b => { b.innerHTML = XI; });
  $('icoMenu').innerHTML = pix(['#########', '.........', '.........', '#########', '.........', '.........', '#########']);
  function openSide() { side.classList.add('open'); $('scrim').hidden = false; $('menu').setAttribute('aria-expanded', 'true'); const b = side.querySelector('[aria-current]') || side.querySelector('button'); if (b) b.focus({ preventScroll: true }); }
  function closeSide() { if (!side.classList.contains('open')) return; side.classList.remove('open'); $('scrim').hidden = true; $('menu').setAttribute('aria-expanded', 'false'); }
  $('menu').addEventListener('click', openSide);
  for (const id of ['home', 'logo2']) $(id).addEventListener('click', () => { go('exercicios'); scrollTo({ top: 0 }); });
  $('scrim').addEventListener('click', closeSide);
  $('sideX').addEventListener('click', closeSide);

  // ---------- estatísticas ----------
  const weekStart = (d = new Date()) => { const x = new Date(d); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return x; };
  const weekKey = () => dayKey(weekStart());
  function weekN() {
    const s = weekStart(), o = { n: 0, ok: 0 };
    for (let i = 0; i < 7; i++) { const x = new Date(s); x.setDate(s.getDate() + i); const r = days[dayKey(x)]; if (r) { o.n += r.n; o.ok += r.ok; } }
    return o;
  }
  function drawStats() {
    const t = days[dayKey()] || { n: 0, ok: 0 }, w = weekN(), s = streak();
    const pc = (a, b) => b ? `${Math.round(100 * a / b)}% de acerto` : 'nenhuma ainda';
    const tile = (k, v, d) => `<div class="tile"><span>${k}</span><b>${v}</b><em>${d}</em></div>`;
    $('tiles').innerHTML = tile('hoje', t.n, pc(t.ok, t.n)) + tile('esta semana', w.n, pc(w.ok, w.n))
      + tile('dias seguidos', s, prefs.goal ? `com a meta de ${prefs.goal}` : 'com pelo menos 1 questão') + tile('melhor sequência', best, 'acertos seguidos');
    // 12 semanas, de segunda a domingo; cheio = meta cumprida, hachurado = treinou abaixo da meta
    const today = new Date(), start = weekStart(today), need = Math.max(1, prefs.goal);
    start.setDate(start.getDate() - 7 * 11);
    let cells = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map(d => `<span class="wd">${d}</span>`).join(''), played = 0, met = 0;
    for (let i = 0; i < 84; i++) {
      const x = new Date(start); x.setDate(start.getDate() + i);
      const k = dayKey(x), n = (days[k] || {}).n || 0, fut = k > dayKey(today);
      if (n) played++; if (n >= need) met++;
      cells += `<i class="${fut ? 'cf' : n >= need ? 'c2' : n ? 'c1' : 'c0'}${k === dayKey(today) ? ' td' : ''}" title="${fmtD(k)} · ${n} ${n === 1 ? 'questão' : 'questões'}"></i>`;
    }
    $('cal').innerHTML = cells;
    $('cal').setAttribute('aria-label', `Nas últimas 12 semanas: ${played} dias com treino, ${met} com a meta cumprida`);
    $('srMode').textContent = mode === 'teoria' ? 'teoria' : 'exercícios';
    $('subjR').innerHTML = SK.map(sj => {
      const ks = KEYS.filter(k => inMode(k) && GEN[k].s === sj), pl = ks.filter(k => R(k).n).length, a = avg(ks);
      return `<div class="srow"><span class="n">${SUBJ[sj]}</span><span class="bar"><i style="width:calc(${a === '—' ? 0 : Math.min(100, a / 25)}% - 2px)"></i></span><b>${a}</b><em>${pl}/${ks.length} tópicos jogados</em></div>`;
    }).join('');
    evoOptions(); drawEvo(); drawHist(); drawStudy();
  }

  // ---------- ranking: só quantas questões cada um respondeu, no dia e na semana ----------
  let rkDb = null, rkUser = null, uid = null, rkDocs = null, rkOn = false, rkCan = null, rkT = null, rkBusy = false;
  let rkNoAcct = 'O ranking precisa de uma conta conectada: abra o Faro pelo claude.ai, com a sua conta.';
  let rkPer = load('rkPer', 'dia'); if (rkPer !== 'semana') rkPer = 'dia';
  let rkKind = load('rkKind', 'q'); if (rkKind !== 't') rkKind = 'q';
  // dt e wt: tempo de estudo do dia e da semana, em ms
  // dm e wm: quanto desse tempo foi registrado à mão
  const rkMine = () => { const d = tdLive(dayKey()), w = studyWeek(); return { day: dayKey(), dn: (days[dayKey()] || {}).n || 0, week: weekKey(), wn: weekN().n,
    dt: Math.round(d.e), wt: Math.round(w.e), dm: d.m, wm: w.m, name: prefs.name.trim().slice(0, 40), t: Date.now() }; };
  const rkErr = e => { if (e && e.code === 'invalid_argument') { rkCan = false; rkOn = false; } drawRank(); };
  async function rkPush() {
    rkT = null; if (!rkDb || !uid || !rkOn) return;
    if (rkBusy) { rkT = setTimeout(rkPush, 1500); return; }
    rkBusy = true; try { await rkDb.doc('rank/' + uid).set(rkMine()); } catch (e) { rkErr(e); } rkBusy = false;
  }
  function rkQueue() { if (rkOn) { clearTimeout(rkT); rkT = setTimeout(rkPush, 2500); } if (view === 'ranking') drawRank(); }
  function rkStart(db, user, id) {
    rkDb = db; rkUser = user; uid = id;
    user.can('data.write').then(c => { rkCan = c; drawRank(); });
    db.collection('rank').limit(500).onSnapshot(s => {
      rkDocs = s.docs.map(d => ({ id: d.id, ...d.data() }));
      if (!rkBusy) rkOn = rkDocs.some(d => d.id === uid);
      drawRank();
    }, () => { rkDocs = []; drawRank(); });
  }
  let rkDraw = 0;
  async function drawRank() {
    if (view !== 'ranking') return;
    const n0 = ++rkDraw, list = $('rkList'), mine = rkMine(), per = rkPer, tm_ = rkKind === 't';
    segOn('rkSeg', per); segOn('rkKind', rkKind);
    $('rkTitle').textContent = `${tm_ ? 'Tempo de estudo' : 'Questões respondidas'} ${per === 'dia' ? 'hoje' : 'nesta semana'}`;
    const field = tm_ ? (per === 'dia' ? 'dt' : 'wt') : (per === 'dia' ? 'dn' : 'wn'), mf = per === 'dia' ? 'dm' : 'wm';
    $('rkJoin').setAttribute('aria-pressed', rkOn); $('rkJoin').disabled = !rkDb || rkCan === false;
    $('rkNote').textContent = !rkDb ? rkNoAcct
      : rkCan === false ? 'Você pode ver o ranking, mas o seu acesso a este app é só de leitura, então não dá para entrar nele. Peça acesso de edição a quem compartilhou o Faro com você.'
      : 'Aparecem só o seu nome (o das configurações ou, sem ele, o da conta), quantas questões você respondeu e quanto tempo estudou no dia e na semana. Questões puladas não contam. O tempo de estudo é o mesmo das estatísticas e inclui o registrado à mão, que aparece com um lápis ao lado.';
    if (!rkDb) { list.innerHTML = '<li class="rke">Sem conta conectada.</li>'; $('rkN').textContent = ''; return; }
    if (!rkDocs) { list.innerHTML = '<li class="rke">Carregando…</li>'; return; }
    let rows = rkDocs.filter(d => per === 'dia' ? d.day === mine.day : d.week === mine.week).map(d => ({ id: d.id, n: Math.max(0, +d[field] || 0), m: Math.max(0, +d[mf] || 0), name: String(d.name || '') }));
    // a própria linha usa a contagem deste aparelho, que é a mais nova
    rows = rows.filter(r => r.id !== uid);
    if (rkOn) rows.push({ id: uid, n: mine[field], m: mine[mf], name: mine.name });
    rows = rows.filter(r => tm_ ? r.n >= 60000 : r.n > 0).sort((a, b) => b.n - a.n).slice(0, 50);
    $('rkN').textContent = rows.length ? `${rows.length} ${rows.length === 1 ? 'pessoa' : 'pessoas'}` : '';
    const ps = rows.length ? await rkUser.profiles(rows.map(r => r.id)).catch(() => ({})) : {};
    if (n0 !== rkDraw) return;
    if (!rows.length) { list.innerHTML = `<li class="rke"><span class="fox">${FOX}</span>Ninguém do ranking ${tm_ ? 'estudou com o Faro' : 'respondeu questões'} ${per === 'dia' ? 'hoje' : 'nesta semana'} ainda.${rkOn ? '' : ' Entre no ranking aqui embaixo.'}</li>`; return; }
    list.replaceChildren(...rows.map((r, i) => {
      const li = document.createElement('li'), p = ps[r.id] || {}, me = r.id === uid;
      const pos = i && (tm_ ? Math.floor(rows[i - 1].n / 60000) === Math.floor(r.n / 60000) : rows[i - 1].n === r.n) ? null : i + 1;
      li.className = me ? 'you' : '';
      const num = document.createElement('span'); num.className = 'p'; num.textContent = pos ? `${pos}º` : '';
      const av = document.createElement('span'); av.className = 'av';
      const src = me ? (prefs.photo || acctPhoto) : p.avatarUrl;
      if (src) { const im = new Image(); im.alt = ''; im.src = src; av.append(im); } else av.innerHTML = PERSON;
      const nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = (r.name || p.name || 'Alguém') + (me ? ' · você' : '');
      const ct = document.createElement('b'); ct.textContent = tm_ ? fmtRk(r.n) : r.n;
      if (tm_ && r.m >= 60000) {
        const pe = document.createElement('i'); pe.className = 'pen'; pe.innerHTML = PEN; ct.prepend(pe);
        li.title = `${fmtStudy(Math.min(r.m, r.n))} registrados à mão`; ct.setAttribute('aria-label', `${fmtRk(r.n)}, ${li.title}`);
      }
      li.append(num, av, nm, ct); return li;
    }));
  }
  $('rkSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; rkPer = b.dataset.v; save('rkPer', rkPer); drawRank(); });
  $('rkKind').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; rkKind = b.dataset.v; save('rkKind', rkKind); drawRank(); });
  $('rkJoin').addEventListener('click', async () => {
    if (!rkDb || !uid || rkCan === false || rkBusy) return;
    rkBusy = true;
    try {
      if (rkOn) { await rkDb.doc('rank/' + uid).delete(); rkOn = false; }
      else { await rkDb.doc('rank/' + uid).set(rkMine()); rkOn = true; }
    } catch (e) { rkBusy = false; return rkErr(e); }
    rkBusy = false; drawRank();
  });

  // ---------- foco: ruído branco e tempo, cada um com página própria e um painel opcional no menu ----------
  const two = n => String(n).padStart(2, '0');
  const clock = (ms, up) => { const s = up ? Math.floor(ms / 1000) : Math.ceil(ms / 1000), h = Math.floor(s / 3600); return (h ? h + ':' : '') + two(Math.floor(s / 60) % 60) + ':' + two(s % 60); };
  const cent = ms => two(Math.floor(ms % 1000 / 10));
  const lapTxt = ms => clock(ms, true) + ',' + cent(ms);
  const hhmm = t => new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const fmtDur = ms => { const s = Math.round(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, x = s % 60; return [h && h + ' h', m && m + ' min', x && x + ' s'].filter(Boolean).join(' ') || '0 s'; };
  const setT = (el, v) => { if (el.textContent !== v) el.textContent = v; };
  const IC = {
    play: pix(['#....', '##...', '###..', '####.', '#####', '####.', '###..', '##...', '#....']),
    pause: pix(['##.##', '##.##', '##.##', '##.##', '##.##', '##.##', '##.##', '##.##', '##.##']),
    stop: pix(['#######', '#######', '#######', '#######', '#######', '#######', '#######']),
    reset: pix(['..#####..', '.#.....#.', '#.......#', '#.......#', '#.......#', '.......#.', '#....##..', '##.......', '###......']),
    skip: pix(['#...#..##', '##..##.##', '###.#####', '#########', '###.#####', '##..##.##', '#...#..##']),
  };
  NI.noise = pix(['....#....', '...##..#.', '..###...#', '####.#..#', '####.#..#', '####.#..#', '..###...#', '...##..#.', '....#....']);
  NI.clock = pix(['..#####..', '.#.....#.', '#...#...#', '#...#...#', '#...###.#', '#.......#', '#.......#', '.#.....#.', '..#####..']);
  $('nav').querySelectorAll('.ni').forEach(n => { n.innerHTML = NI[n.dataset.i]; });
  $('icoClock').innerHTML = NI.clock;

  // painéis fixos no menu
  const pins = Object.assign({ nz: false, timer: false, crono: false, pomo: false }, load('pins', {}));
  const PINBOX = { nz: 'pinNz', timer: 'pinTimer', crono: 'pinCrono', pomo: 'pinPomo' };
  function drawPins() {
    for (const k in PINBOX) $(PINBOX[k]).hidden = !pins[k];
    $('pins').hidden = !Object.keys(PINBOX).some(k => pins[k]);
    document.querySelectorAll('[data-pin]').forEach(b => b.setAttribute('aria-pressed', !!pins[b.dataset.pin]));
    $('nzPin').setAttribute('aria-pressed', !!pins.nz);
    $('tmPin').setAttribute('aria-pressed', !!pins[tm.tab]);
    $('tmPin').textContent = `mostrar o ${{ timer: 'timer', crono: 'cronômetro', pomo: 'pomodoro' }[tm.tab]} no menu lateral`;
  }
  function setPin(k, on) { pins[k] = on; save('pins', pins); drawPins(); nzUI(); tmPaint(); }
  document.addEventListener('click', e => {
    const u = e.target.closest('[data-unpin]'); if (u) return setPin(u.dataset.unpin, false);
    const p = e.target.closest('[data-pin]'); if (p) return setPin(p.dataset.pin, !pins[p.dataset.pin]);
    if (e.target.closest('[data-go-cfg]')) { go('config'); return scrollTo({ top: 0 }); }
    const g = e.target.closest('[data-go]');
    if (g) { if (g.dataset.go !== 'ruido') { tm.tab = g.dataset.go; tmSave(); } go(g.dataset.go === 'ruido' ? 'ruido' : 'tempo'); scrollTo({ top: 0 }); }
  });
  $('nzPin').addEventListener('click', () => setPin('nz', !pins.nz));
  $('tmPin').addEventListener('click', () => setPin(tm.tab, !pins[tm.tab]));

  // ---------- ruído: um mixer de sons sintetizados na hora, mais batidas binaurais ----------
  // os sons: cada um é uma função que escreve uma amostra estéreo em o[0] e o[1]. Roda dentro do AudioWorklet
  // (o texto da função vai para lá) ou, sem worklet, gera 30 s em loop.
  function nzGen(kind, sr) {
    const R = Math.random, TAU = 2 * Math.PI;
    const gs = () => { const u = 1 - R(), v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); };
    // rosa: filtro de Paul Kellet sobre ruído branco (-3 dB por oitava); marrom: ruído branco integrado (-6 dB por oitava)
    const pink = () => { let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0; return () => { const w = R() * 2 - 1;
      b0 = .99886 * b0 + w * .0555179; b1 = .99332 * b1 + w * .0750759; b2 = .969 * b2 + w * .153852; b3 = .8665 * b3 + w * .3104856; b4 = .55 * b4 + w * .5329522; b5 = -.7616 * b5 - w * .016898;
      const y = b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * .5362; b6 = w * .115926; return y * .11; }; };
    const brown = () => { let b = 0; return () => { b = (b + .02 * (R() * 2 - 1)) / 1.02; return b * 3.5; }; };
    const lp = fc => { let a = Math.exp(-TAU * fc / sr), y = 0; const f = x => (y = (1 - a) * x + a * y); f.set = c => { a = Math.exp(-TAU * c / sr); }; return f; };
    // passa-faixa de estado variável, para o vento
    const bp = () => { let lo = 0, ba = 0; return (x, fc, q) => { const f = 2 * Math.sin(Math.PI * Math.min(fc, sr / 6) / sr); lo += f * ba; const hi = x - lo - q * ba; ba += f * hi; return ba; }; };
    // um valor que vagueia devagar entre a e b (rajadas, ondas)
    const drift = (a, b, sec) => { let v = R(), t = R(); const k = 1 / (sec * sr); return () => { t += (R() - .5) * k * 40; t = Math.max(0, Math.min(1, t)); v += (t - v) * k * 8; return a + (b - a) * v; }; };
    const ev = []; // eventos curtos: gotas, bolhas, estalos
    const evRun = o => { for (let i = ev.length - 1; i >= 0; i--) { const e = ev[i], s = e.f(e); o[0] += s * (1 - e.p); o[1] += s * e.p; if (e.a < 1e-4) ev.splice(i, 1); } };
    if (kind === 'white') return o => { o[0] = gs() * .25; o[1] = gs() * .25; };
    if (kind === 'pink') { const a = pink(), b = pink(); return o => { o[0] = a(); o[1] = b(); }; }
    if (kind === 'brown') { const a = brown(), b = brown(); return o => { o[0] = a(); o[1] = b(); }; }
    if (kind === 'rain') {
      const a = pink(), b = pink(), la = lp(400), lb = lp(400), ha = lp(7000), hb = lp(7000);
      const drop = () => { const l = lp(1200 + R() * 6000), d = Math.exp(-1 / (sr * (.001 + R() * .006))); return { a: .15 + R() * .5, p: R(), f: e => { const s = l((R() * 2 - 1) * e.a); e.a *= d; return s * 2.2; } }; };
      return o => { let x = a(), y = b(); x = ha(x - la(x)); y = hb(y - lb(y)); o[0] = x * .9; o[1] = y * .9; if (R() < 90 / sr) ev.push(drop()); evRun(o); };
    }
    if (kind === 'waves') {
      const a = brown(), b = pink(), c = pink(), la = lp(500), lb = lp(500); let ph = R(), per = 7, n = 0, env = 0;
      return o => {
        if (++n >= 64) { n = 0; ph += 64 / (per * sr); if (ph >= 1) { ph -= 1; per = 6 + R() * 6; }
          const s = Math.sin(Math.PI * ph); env = .12 + .88 * s * s * (ph < .4 ? ph / .4 : 1); la.set(250 + 2600 * env * env); lb.set(250 + 2600 * env * env); }
        const r = a() * .5; o[0] = (la(c()) * 2.2 + r) * env; o[1] = (lb(b()) * 2.2 + r) * (env * .9 + .05);
      };
    }
    if (kind === 'wind') {
      const fa = bp(), fb = bp(), cf = drift(220, 900, 3), g = drift(.25, 1, 4), q = drift(.25, .7, 5); let n = 0, f = 400, gg = .5, qq = .5;
      return o => { if (++n >= 32) { n = 0; f = cf(); gg = g(); qq = q(); } o[0] = fa(R() * 3.4 - 1.7, f, qq) * gg * .55; o[1] = fb(R() * 3.4 - 1.7, f * 1.07, qq) * gg * .55; };
    }
    if (kind === 'stream') {
      const a = pink(), b = pink(), la = lp(300), lb = lp(300), ha = lp(3500), hb = lp(3500);
      // bolhas: senoides curtas que sobem de tom, o som característico da água correndo
      const bub = () => { const f0 = 350 * Math.pow(8, R()), tau = .004 + R() * .016, d = Math.exp(-1 / (tau * sr)), rise = 1 + (1.5 + R() * 3) / (tau * sr); let ph = 0, f = f0;
        return { a: .08 + R() * .22, p: R(), f: e => { ph += TAU * f / sr; f *= rise; const s = Math.sin(ph) * e.a; e.a *= d; return s; } }; };
      return o => { let x = a(), y = b(); x = ha(x - la(x)); y = hb(y - lb(y)); o[0] = x * .45; o[1] = y * .45; if (R() < 70 / sr) ev.push(bub()); evRun(o); };
    }
    if (kind === 'fire') {
      const a = brown(), b = brown(), h = pink(), lh = lp(1500), hh = lp(1500), g = drift(.5, 1, 1.5);
      const crack = () => { const d = Math.exp(-1 / (sr * (.0003 + R() * .0015))), l = lp(2000 + R() * 8000); return { a: .2 + R() * .8, p: .2 + R() * .6, f: e => { const s = l((R() * 2 - 1) * e.a); e.a *= d; return s * 1.6; } }; };
      let n = 0, gg = .7, burst = 0;
      return o => {
        if (++n >= 64) { n = 0; gg = g(); }
        const r = (a() + b()) * .3 * gg, x = h(); o[0] = r + (x - lh(x)) * .06; o[1] = r * .95 + (x - hh(x)) * .06;
        if (burst > 0 ? R() < 600 / sr : R() < 6 / sr) { ev.push(crack()); burst = burst > 0 ? burst - 1 : Math.floor(R() * 5); }
        evRun(o);
      };
    }
    return o => { o[0] = 0; o[1] = 0; };
  }
  // os sons do mixer: nome, o que é, e um ganho que deixa todos com volume parecido
  const NZK = [
    ['white', 'Ruído branco', 'a mesma energia em todas as frequências; chiado de TV', 1],
    ['pink', 'Ruído rosa', 'mais grave que o branco, como chuva fina ou cachoeira ao longe', 1.25],
    ['brown', 'Ruído marrom', 'bem grave, como um avião por dentro ou trovão longe', 1.2],
    ['rain', 'Chuva', 'chuva constante com gotas', 1.9],
    ['waves', 'Mar', 'ondas que vêm e vão, a cada 6 a 12 s', 1.05],
    ['wind', 'Vento', 'rajadas que sobem e descem', 2.1],
    ['stream', 'Riacho', 'água correndo, com bolhas', 2.6],
    ['fire', 'Lareira', 'fogo baixo, com estalos', 2.8]];
  // receitas: [nome, mistura, por que]
  const NZR = [
    ['Branco', { white: 100 }, 'O clássico. Na pesquisa, ruído branco e rosa ajudaram um pouco quem tem dificuldade de atenção.'],
    ['Rosa', { pink: 100 }, 'Parecido com o branco, mais macio. Bom para abafar conversa em volta.'],
    ['Marrom', { brown: 100 }, 'O mais grave. Muita gente acha relaxante; ainda não há estudos sobre ele.'],
    ['Chuva', { rain: 100, brown: 20 }, 'Som da natureza, constante e sem vozes.'],
    ['Mar', { waves: 100 }, 'Natureza, com um ritmo lento de ondas.'],
    ['Riacho', { stream: 90, wind: 15 }, 'Água correndo: natureza que também abafa o barulho em volta.'],
    ['Lareira', { fire: 100, brown: 15 }, 'Fogo baixo com estalos, para estudar à noite.'],
    ['Tempestade', { rain: 100, wind: 55, brown: 45 }, 'Chuva forte com vento: abafa bastante o barulho em volta.']];
  const nz = { ctx: null, gain: null, bus: null, hpf: null, lpf: null, an: null, src: {}, g: {}, bin: null, on: false, raf: 0, offAt: 0, watch: 0 };
  const nzSet = Object.assign({ vol: 40, hp: 0, lp: 1000, off: 0, mix: { white: 100 }, bin: 0, bf: 10 }, load('noise', {}));
  if (![0, 15, 30, 60, 120].includes(+nzSet.off)) nzSet.off = 0;
  if (![6, 10, 16, 40].includes(+nzSet.bf)) nzSet.bf = 10;
  nzSet.bin = Math.max(0, Math.min(100, Math.round(+nzSet.bin) || 0));
  nzSet.mix = Object.fromEntries(NZK.map(([k]) => [k, Math.max(0, Math.min(100, Math.round(+(nzSet.mix || {})[k]) || 0))]));
  const NZQ = n => document.querySelectorAll(`[data-nz="${n}"]`);
  const nzHz = v => 20 * Math.pow(1000, v / 1000);
  const nzFmt = hz => hz >= 1000 ? (hz / 1000).toLocaleString('pt-BR', { maximumFractionDigits: hz >= 10000 ? 0 : 1 }) + ' kHz' : Math.round(hz) + ' Hz';
  // filtros prontos: [corta graves, corta agudos] na escala dos controles (0 a 1000)
  const NZC = { branco: [0, 1000], suave: [0, 767], grave: [0, 515], agudo: [625, 1000] };
  const NZ_WORKLET = `const nzGen = ${nzGen.toString()};
  class FaroSound extends AudioWorkletProcessor {
    constructor(o) { super(); this.g = nzGen(o.processorOptions.kind, sampleRate); this.o = [0, 0]; }
    process(_, outputs) {
      const [l, r] = outputs[0], o = this.o, g = this.g;
      for (let i = 0; i < l.length; i++) { g(o); l[i] = o[0]; if (r) r[i] = o[1]; }
      return true;
    }
  }
  registerProcessor('faro-sound', FaroSound);`;
  let nzWk = null;
  async function nzSource(ctx, kind) {
    if (nzWk === null) nzWk = ctx.audioWorklet ? ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([NZ_WORKLET], { type: 'application/javascript' }))).then(() => true, () => false) : Promise.resolve(false);
    if (await nzWk) return new AudioWorkletNode(ctx, 'faro-sound', { outputChannelCount: [2], processorOptions: { kind } });
    // sem worklet: 30 s do mesmo som, em loop
    const len = ctx.sampleRate * 30, buf = ctx.createBuffer(2, len, ctx.sampleRate), g = nzGen(kind, ctx.sampleRate), o = [0, 0], L = buf.getChannelData(0), Rc = buf.getChannelData(1);
    for (let i = 0; i < len; i++) { g(o); L[i] = o[0]; Rc[i] = o[1]; }
    const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.start(); return s;
  }
  const nzLevel = () => (nzSet.vol / 100) ** 2;
  const nzLayer = k => { const v = nzSet.mix[k] / 100, f = NZK.find(x => x[0] === k)[3]; return v * v * f; };
  const nzAny = () => NZK.some(([k]) => nzSet.mix[k] > 0) || nzSet.bin > 0;
  function nzFilters(instant) {
    if (!nz.ctx) return;
    const ny = nz.ctx.sampleRate / 2, t = nz.ctx.currentTime;
    nz.hpf.frequency.setTargetAtTime(+nzSet.hp === 0 ? 1 : nzHz(nzSet.hp), t, instant ? 0 : 0.03);
    nz.lpf.frequency.setTargetAtTime(+nzSet.lp === 1000 ? ny : Math.min(nzHz(nzSet.lp), ny), t, instant ? 0 : 0.03);
  }
  // cada som só é criado quando entra na mistura; depois fica, em silêncio, para voltar sem atraso
  async function nzLayers(tc = 0.08) {
    if (!nz.ctx) return;
    const t = nz.ctx.currentTime;
    for (const [k] of NZK) {
      const want = nzLayer(k);
      if (want > 0 && !nz.src[k]) {
        nz.src[k] = 'loading';
        const s = await nzSource(nz.ctx, k), g = nz.ctx.createGain(); g.gain.value = 0;
        s.connect(g); g.connect(nz.bus); nz.src[k] = s; nz.g[k] = g;
      }
      if (nz.g[k]) nz.g[k].gain.setTargetAtTime(nzLayer(k), nz.ctx.currentTime || t, tc);
    }
    // batidas binaurais: 200 Hz num ouvido, 200 + a diferença no outro; não passam pelos filtros
    if (nzSet.bin > 0 && !nz.bin) {
      const ctx = nz.ctx, m = ctx.createChannelMerger(2), l = ctx.createOscillator(), r = ctx.createOscillator(), g = ctx.createGain();
      l.frequency.value = 200; r.frequency.value = 200 + +nzSet.bf; g.gain.value = 0;
      l.connect(m, 0, 0); r.connect(m, 0, 1); m.connect(g); g.connect(nz.gain); l.start(); r.start();
      nz.bin = { l, r, g };
    }
    if (nz.bin) { nz.bin.r.frequency.setTargetAtTime(200 + +nzSet.bf, t, 0.05); nz.bin.g.gain.setTargetAtTime((nzSet.bin / 100) ** 2 * 0.35, t, tc); }
  }
  // o volume e o desligamento automático ficam agendados no próprio áudio, que segue na hora com a aba parada
  function nzGain(tc = 0.05) {
    if (!nz.ctx) return;
    const g = nz.gain.gain, t = nz.ctx.currentTime;
    g.cancelScheduledValues(t); g.setTargetAtTime(nz.on ? nzLevel() : 0, t, tc);
    if (nz.on && nz.offAt) g.setTargetAtTime(0, t + Math.max(0, (nz.offAt - Date.now()) / 1000), 0.6);
  }
  function nzWatch() {
    clearInterval(nz.watch); nz.watch = 0;
    if (nz.on && nz.offAt) nz.watch = setInterval(() => { if (nz.on && Date.now() >= nz.offAt + 2000) nzToggle(); else nzUI(); }, 1000);
  }
  const nzSave = () => save('noise', nzSet);
  // o nome do que está tocando: a receita, um som só, ou "mistura"
  function nzName() {
    const r = NZR.find(([, m]) => NZK.every(([k]) => (m[k] || 0) === nzSet.mix[k]));
    if (r) return r[0];
    const on = NZK.filter(([k]) => nzSet.mix[k] > 0);
    return on.length === 1 ? on[0][1] : on.length ? 'mistura' : nzSet.bin ? 'batidas binaurais' : 'nada no mixer';
  }
  function nzUI() {
    const hp = +nzSet.hp, lp = +nzSet.lp;
    NZQ('hpOut').forEach(o => setT(o, hp === 0 ? 'desl.' : nzFmt(nzHz(hp))));
    NZQ('lpOut').forEach(o => setT(o, lp === 1000 ? 'desl.' : nzFmt(nzHz(lp))));
    NZQ('volOut').forEach(o => setT(o, nzSet.vol + '%'));
    if (nz.ctx) NZQ('ny').forEach(o => setT(o, ` (aqui, ${nzFmt(nz.ctx.sampleRate / 2)})`));
    for (const k of ['vol', 'hp', 'lp']) NZQ(k).forEach(i => { if (document.activeElement !== i) i.value = nzSet[k]; });
    const c = Object.keys(NZC).find(k => NZC[k][0] === hp && NZC[k][1] === lp);
    segOn('nzColor', c || '');
    const r = NZR.find(([, m]) => NZK.every(([k]) => (m[k] || 0) === nzSet.mix[k]));
    $('nzRec').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', !!r && b.dataset.r === r[0]));
    setT($('nzPre'), r ? '' : 'personalizada'); setT($('nzRecTxt'), r ? r[2] : 'Mistura sua. Toque numa receita para voltar a uma pronta.');
    for (const [k] of NZK) { const i = $('nzM_' + k); if (document.activeElement !== i) i.value = nzSet.mix[k]; setT($('nzO_' + k), nzSet.mix[k] ? nzSet.mix[k] + '%' : 'desl.'); i.closest('.nzc').classList.toggle('off', !nzSet.mix[k]); }
    if (document.activeElement !== $('nzBin')) $('nzBin').value = nzSet.bin;
    setT($('nzBinOut'), nzSet.bin ? nzSet.bin + '%' : 'desl.'); segOn('nzBf', nzSet.bf);
    setT($('nzWhat'), nzName());
    NZQ('play').forEach(b => {
      b.setAttribute('aria-pressed', nz.on);
      if (b.classList.contains('mp')) { const k = nz.on ? 'stop' : 'play'; if (b.dataset.k !== k) { b.dataset.k = k; b.innerHTML = IC[k]; b.setAttribute('aria-label', nz.on ? 'Parar o ruído' : 'Tocar o ruído'); } }
      else setT(b, nz.on ? '■ PARAR' : '▶ TOCAR');
    });
    const st = !nz.on ? 'desligado' : !nzAny() ? 'tocando, mas o mixer está zerado' : nz.offAt ? `até ${hhmm(nz.offAt)}` : 'tocando';
    NZQ('state').forEach(s => setT(s, st));
    document.querySelectorAll('.noise').forEach(x => x.classList.toggle('on', nz.on));
    setT($('nzNav'), nz.on ? '▶' : '');
    $('nzQuick').hidden = !nz.on || view === 'ruido';
    segOn('nzOff', nzSet.off);
    setT($('nzOffIn'), nz.on && nz.offAt ? `desliga às ${hhmm(nz.offAt)}` : '');
  }
  async function nzToggle() {
    if (!nz.ctx) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      nz.bus = ctx.createGain();
      nz.hpf = ctx.createBiquadFilter(); nz.hpf.type = 'highpass';
      nz.lpf = ctx.createBiquadFilter(); nz.lpf.type = 'lowpass';
      nz.gain = ctx.createGain(); nz.gain.gain.value = 0;
      nz.an = ctx.createAnalyser(); nz.an.fftSize = 512; nz.an.smoothingTimeConstant = 0.85;
      nz.bus.connect(nz.hpf); nz.hpf.connect(nz.lpf); nz.lpf.connect(nz.gain); nz.gain.connect(nz.an); nz.an.connect(ctx.destination);
      nz.ctx = ctx; nzFilters(true);
    }
    if (nz.ctx.state === 'suspended') await nz.ctx.resume();
    nz.on = !nz.on;
    // tocar com o mixer zerado volta para o ruído branco
    if (nz.on && !nzAny()) { nzSet.mix.white = 100; nzSave(); }
    nz.offAt = nz.on && +nzSet.off ? Date.now() + nzSet.off * 60000 : 0;
    nzGain(); nzWatch(); nzUI();
    if (nz.on) { await nzLayers(0); nzDraw(); }
  }
  // espectro em blocos de pixel: um painel pequeno no menu e um grande na página
  function nzFrame(cv, bins) {
    const g = cv.getContext('2d'), W = cv.width, H = cv.height, cols = Math.round(W / 6), cw = W / cols, ink = css('--ink'), faint = css('--faint');
    const step = H > 60 ? 6 : 3;
    g.clearRect(0, 0, W, H); g.fillStyle = faint; g.fillRect(0, H - 1, W, 1); g.fillStyle = ink;
    if (!bins) return false;
    const per = bins.length / cols; let live = false;
    for (let i = 0; i < cols; i++) {
      let s = 0; for (let j = 0; j < per; j++) s += bins[Math.floor(i * per + j)];
      const lv = Math.max(0, Math.min(1, (s / per + 100) / 80)); if (lv > 0) live = true;
      const h = Math.round(lv * (H - 4) / step) * step; if (h) g.fillRect(Math.round(i * cw), H - h, Math.max(1, Math.round(cw) - 2), h);
    }
    return live;
  }
  function nzDraw() {
    cancelAnimationFrame(nz.raf);
    const bins = new Float32Array(nz.an.frequencyBinCount); nz.an.getFloatFrequencyData(bins);
    let live = false;
    NZQ('scope').forEach(cv => { if (cv.offsetParent) live = nzFrame(cv, bins) || live; });
    if (nz.on || live) nz.raf = requestAnimationFrame(nzDraw);
  }
  for (const k of ['vol', 'hp', 'lp']) NZQ(k).forEach(i => i.addEventListener('input', e => {
    nzSet[k] = +e.target.value; nzSave(); nzFilters();
    if (k === 'vol') nzGain(0.03);
    nzUI();
  }));
  $('nzColor').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    [nzSet.hp, nzSet.lp] = NZC[b.dataset.v]; nzSave(); nzFilters(); nzUI();
  });
  $('nzOff').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    nzSet.off = +b.dataset.v; nzSave();
    if (nz.on) { nz.offAt = nzSet.off ? Date.now() + nzSet.off * 60000 : 0; nzGain(); nzWatch(); }
    nzUI();
  });
  $('nzRec').innerHTML = NZR.map(([n]) => `<button type="button" data-r="${n}">${n}</button>`).join('');
  $('nzMix').innerHTML = NZK.map(([k, n, d]) => `<div class="nzc"><label for="nzM_${k}">${n}<small>${d}</small></label><input id="nzM_${k}" type="range" min="0" max="100" step="5" value="0"><output id="nzO_${k}" for="nzM_${k}">desl.</output></div>`).join('');
  $('nzRec').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const r = NZR.find(x => x[0] === b.dataset.r);
    for (const [k] of NZK) nzSet.mix[k] = r[1][k] || 0;
    nzSave(); nzLayers(); nzUI();
    if (!nz.on) nzToggle();
  });
  $('nzMix').addEventListener('input', e => {
    const k = e.target.id.slice(4); if (!(k in nzSet.mix)) return;
    nzSet.mix[k] = +e.target.value; nzSave(); nzLayers(0.03); nzUI();
  });
  $('nzZero').addEventListener('click', () => { for (const [k] of NZK) nzSet.mix[k] = 0; nzSave(); nzLayers(); nzUI(); });
  $('nzBin').addEventListener('input', e => { nzSet.bin = +e.target.value; nzSave(); nzLayers(0.03); nzUI(); });
  $('nzBf').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; nzSet.bf = +b.dataset.v; nzSave(); nzLayers(); nzUI(); });
  NZQ('play').forEach(b => b.addEventListener('click', nzToggle));
  $('nzQuick').addEventListener('click', () => { if (nz.on) nzToggle(); });
  NZQ('scope').forEach(cv => nzFrame(cv));

  // ---------- tempo: timer, cronômetro e pomodoro ----------
  // tudo conta por horário (Date.now): segue certo com a aba em segundo plano e depois de recarregar.
  // O alarme é agendado no áudio quando o tempo começa, então toca na hora mesmo com a aba parada.
  const TP0 = { snd: 'bipe', vol: 60, rep: 3, tick: false, vib: true, foco: 25, curta: 5, longa: 15, ciclos: 4, autoP: true, autoF: false, noise: false, dur: 300000 };
  const tp = (() => {
    const s = Object.assign({}, TP0, load('tmPrefs', {})), n = (v, a, b, d) => Number.isFinite(+v) ? Math.min(b, Math.max(a, Math.round(+v))) : d;
    return { snd: ['bipe', 'sino', '8bits', 'nada'].includes(s.snd) ? s.snd : 'bipe', vol: n(s.vol, 0, 100, 60), rep: [0, 1, 3].includes(+s.rep) ? +s.rep : 3,
      tick: !!s.tick, vib: s.vib !== false, foco: n(s.foco, 1, 180, 25), curta: n(s.curta, 1, 60, 5), longa: n(s.longa, 1, 90, 15), ciclos: n(s.ciclos, 1, 12, 4),
      autoP: s.autoP !== false, autoF: !!s.autoF, noise: !!s.noise, dur: n(s.dur, 1000, 86399000, 300000) };
  })();
  const pd = ph => tp[ph] * 60000;
  const PH = { foco: 'Foco', curta: 'Pausa curta', longa: 'Pausa longa' };
  const tm = (() => {
    const s = load('tm', {}) || {}, o = x => x && typeof x === 'object' ? x : {}, n = (v, d) => Number.isFinite(+v) && +v >= 0 ? +v : d;
    const t = o(s.t), c = o(s.c), p = o(s.p);
    return {
      tab: ['timer', 'crono', 'pomo'].includes(s.tab) ? s.tab : 'timer',
      t: { dur: n(t.dur, 0) || tp.dur, left: n(t.left, tp.dur), end: n(t.end, 0), run: !!t.run && n(t.end, 0) > 0, done: !!t.done, at: n(t.at, 0), from: n(t.from, 0) },
      c: { acc: n(c.acc, 0), start: n(c.start, 0), laps: Array.isArray(c.laps) ? c.laps.filter(x => Number.isFinite(x) && x >= 0).slice(-99) : [] },
      p: { ph: ['foco', 'curta', 'longa'].includes(p.ph) ? p.ph : 'foco', k: Math.min(n(p.k, 0), 11), left: n(p.left, pd('foco')), end: n(p.end, 0), run: !!p.run && n(p.end, 0) > 0, from: n(p.from, 0) },
      sf: n(s.sf, 0),
      // sessão em andamento de cada relógio: quando começou e o que a pessoa escreveu
      ss: Object.fromEntries(['timer', 'crono', 'pomo'].map(w => { const x = o(o(s.ss)[w]); return [w, { a: n(x.a, 0), n: String(x.n || '').slice(0, 120), g: typeof x.g === 'string' ? x.g.slice(0, 24) : '' }]; })),
      // a meta ligada aos relógios: vale para as próximas sessões até a pessoa trocar
      g: typeof s.g === 'string' ? s.g.slice(0, 24) : '',
    };
  })();
  const tmSave = () => save('tm', tm);
  const tpSave = () => save('tmPrefs', tp);
  // tempo de cada dia, em ms: e = tempo de estudo (foco, timer, cronômetro e questões, sem contar duas vezes o que roda junto),
  // e cada parte em separado; nf = focos completos, nt = timers que chegaram ao fim
  const TD0 = { e: 0, foco: 0, pausa: 0, timer: 0, crono: 0, q: 0, nf: 0, nt: 0 };
  const fixTmDays = d => (d && typeof d === 'object' && !Array.isArray(d) ? Object.fromEntries(Object.entries(d).filter(([k, v]) => /^\d{4}-\d\d-\d\d$/.test(k) && v && typeof v === 'object')
    .map(([k, v]) => [k, Object.fromEntries(Object.keys(TD0).map(f => [f, Math.max(0, +v[f] || 0)]))])) : {});
  let tmDays = fixTmDays(load('tmDays', {}));
  { const old = load('pomoDays', null); if (old && typeof old === 'object') { for (const k in old) if (/^\d{4}-\d\d-\d\d$/.test(k) && !tmDays[k]) tmDays[k] = { ...TD0, nf: +old[k].n || 0, foco: (+old[k].min || 0) * 60000, e: (+old[k].min || 0) * 60000 }; try { localStorage.removeItem('cm.pomoDays'); } catch (e) {} } }
  const tday = t => tmDays[dayKey(new Date(t))] || (tmDays[dayKey(new Date(t))] = { ...TD0 });
  // estudo registrado à mão, sem os relógios do Faro; vale a confiança. Cada registro: { id, d: dia, ms, l: o que estudou, t, b: bloco do calendário que o confirmou }
  const DAY = 86400000;
  const fixMan = a => (Array.isArray(a) ? a : []).filter(x => x && typeof x.id === 'string' && /^\d{4}-\d\d-\d\d$/.test(x.d) && +x.ms >= 60000)
    .map(x => ({ id: x.id.slice(0, 24), d: x.d, ms: Math.min(DAY, Math.round(+x.ms)), l: String(x.l || '').slice(0, 40), t: +x.t || 0, ...(typeof x.b === 'string' && x.b ? { b: x.b.slice(0, 24) } : {}) })).slice(-2000);
  let tmMan = fixMan(load('tmMan', []));
  const manDay = k => tmMan.reduce((a, x) => a + (x.d === k ? x.ms : 0), 0);
  // sessões dos relógios (timer, cronômetro e foco do pomodoro) com o que a pessoa escreveu sobre cada uma; só um diário, não mexe no tempo
  const fixLog = a => (Array.isArray(a) ? a : []).filter(x => x && typeof x.id === 'string' && ['timer', 'crono', 'pomo'].includes(x.w) && +x.a > 0 && +x.ms >= 60000)
    .map(x => ({ id: x.id.slice(0, 24), w: x.w, a: +x.a, b: +x.b || +x.a, ms: Math.round(+x.ms), n: String(x.n || '').slice(0, 120), g: typeof x.g === 'string' ? x.g.slice(0, 24) : '', u: +x.u || 0 })).slice(-600);
  let tmLog = fixLog(load('tmLog', [])), tn = null, tnAll = false;
  function logSave() { const cut = Date.now() - 60 * DAY; tmLog = tmLog.filter(x => x.b >= cut).slice(-600); save('tmLog', tmLog); }
  // linha do tempo do estudo, com hora de início e fim, para o calendário: [início, fim, r = relógios ou q = questões, ms que contaram]
  // (antes dela só havia os totais do dia; as sessões dos relógios já anotadas entram como ponto de partida)
  const fixTl = a => (Array.isArray(a) ? a : []).filter(x => Array.isArray(x) && +x[1] > +x[0] && (x[2] === 'r' || x[2] === 'q'))
    .map(x => [+x[0], +x[1], x[2], Math.max(0, Math.min(Math.round(+x[3]) || 0, +x[1] - +x[0]))]).sort((x, y) => x[0] - y[0]).slice(-1500);
  let tmTl = (() => { const t = load('tmTl', null); return t ? fixTl(t) : fixTl(tmLog.map(x => [x.a, x.b, 'r', x.ms])); })();
  function tlSave() { const cut = Date.now() - 120 * DAY; tmTl = tmTl.filter(x => x[1] >= cut).slice(-1500); save('tmTl', tmTl); }
  // questões seguidas (até 2 min entre uma e outra) viram um trecho só
  function tlAdd(k, a, b) {
    if (!(b > a)) return;
    a = Math.max(a, b - 4 * 3600000);
    const l = tmTl.findLast(x => x[2] === k);
    if (l && a >= l[0] && a - l[1] <= (k === 'q' ? 120000 : 1000) && dayKey(new Date(l[0])) === dayKey(new Date(b))) { l[3] += b - Math.max(a, l[1]); l[1] = Math.max(l[1], b); }
    else tmTl.push([a, b, k, b - a]);
    tlSave();
  }
  // o que está rodando agora também aparece
  const tlAll = () => { const now = Date.now(); return tm.sf ? [...tmTl, [Math.max(tm.sf, now - CAP), now, 'r', now - Math.max(tm.sf, now - CAP), 1]] : tmTl; };
  function manSave() { const x = new Date(); x.setDate(x.getDate() - 400); const cut = dayKey(x); tmMan = tmMan.filter(r => r.d >= cut); save('tmMan', tmMan); }
  const CAP = 4 * 3600000;  // um cronômetro esquecido conta no máximo 4 h seguidas
  function tmdSave() { const ks = Object.keys(tmDays).sort(); while (ks.length > 400) delete tmDays[ks.shift()]; save('tmDays', tmDays); }
  function addSpan(k, a, b) {
    if (!a || !(b > a)) return;
    a = Math.max(a, b - CAP);
    while (a < b) { const m = new Date(a); m.setHours(24, 0, 0, 0); const e = Math.min(b, +m); tday(a)[k] += e - a; a = e; }
    tmdSave();
  }
  // o tempo de estudo é a união: começa quando algo passa a rodar e fecha quando nada mais roda
  let rkAt = 0;
  function studySync(at = Date.now()) {
    const on = tm.t.run || !!tm.c.start || (tm.p.run && tm.p.ph === 'foco');
    if (on && !tm.sf) tm.sf = at;
    else if (!on && tm.sf) { addSpan('e', tm.sf, at); tlAdd('r', tm.sf, at); tm.sf = 0; rkQueue(); }
  }
  // questões: o tempo ativo de cada resposta (até 3 min) entra no estudo quando nenhum relógio está rodando
  function studyQ(dt) {
    const now = Date.now(), ms = Math.min(dt, 180000);
    addSpan('q', now - ms, now); if (!tm.sf) { addSpan('e', now - ms, now); tlAdd('q', now - ms, now); }
  }
  const pKind = ph => ph === 'foco' ? 'foco' : 'pausa';
  // os números de um dia, somando o que está rodando agora
  function tdLive(k) {
    const r = { ...TD0, ...(tmDays[k] || {}) };
    if (k === dayKey()) {
      const now = Date.now(), d0 = new Date(); d0.setHours(0, 0, 0, 0);
      const add = (f, from) => { if (from) r[f] += Math.max(0, now - Math.max(from, now - CAP, +d0)); };
      add('e', tm.sf); if (tm.t.run) add('timer', tm.t.from); add('crono', tm.c.start); if (tm.p.run) add(pKind(tm.p.ph), tm.p.from);
    }
    // m = registrado à mão, que soma por cima do tempo dos relógios
    r.m = manDay(k); r.e = Math.min(DAY, r.e + r.m);
    return r;
  }
  const weekDays = () => { const s = weekStart(); return Array.from({ length: 7 }, (_, i) => { const x = new Date(s); x.setDate(s.getDate() + i); return dayKey(x); }); };
  const studyWeek = () => weekDays().reduce((a, k) => { const r = tdLive(k); for (const f in a) a[f] += r[f]; return a; }, { ...TD0, m: 0 });
  const fmtStudy = ms => { const m = Math.floor(ms / 60000), h = Math.floor(m / 60); return ms < 60000 ? (ms >= 1000 ? Math.floor(ms / 1000) + ' s' : '0 min') : h ? `${h} h${m % 60 ? ' ' + (m % 60) + ' min' : ''}` : m + ' min'; };
  const fmtRk = ms => { const m = Math.floor(ms / 60000), h = Math.floor(m / 60); return ms < 60000 ? '<1 min' : h ? `${h}h${two(m % 60)}` : m + ' min'; };

  // sons sintetizados na hora, no mesmo espírito 8 bits da fonte
  let tmAC = null;
  function tmCtx() {
    if (!tmAC) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; try { tmAC = new A(); } catch (e) { return null; } }
    if (tmAC.state === 'suspended') tmAC.resume().catch(() => {});
    return tmAC;
  }
  function tone(c, bus, t, f, d, type, v, ring) {
    const o = c.createOscillator(), g = c.createGain();
    if (typeof type === 'string') o.type = type; else o.setPeriodicWave(type);
    o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.005);
    if (ring) g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    else { g.gain.setValueAtTime(v, t + d - 0.015); g.gain.linearRampToValueAtTime(0, t + d); }
    o.connect(g); g.connect(bus); o.start(t); o.stop(t + d + 0.05);
  }
  // a onda triangular de 16 degraus do NES: continua 8 bits, mas é mais macia que a quadrada
  let triW = null;
  function nesTri(c) {
    if (triW && triW.c === c) return triW.w;
    const N = 32, H = 64, re = new Float32Array(H), im = new Float32Array(H);
    const v = i => (i < 16 ? 15 - i : i - 16) / 7.5 - 1;
    for (let k = 1; k < H; k++) for (let i = 0; i < N; i++) {
      const a = 2 * Math.PI * k * i / N, b = 2 * Math.PI * k * (i + 1) / N;
      re[k] += v(i) * (Math.sin(b) - Math.sin(a)) / (Math.PI * k);
      im[k] += v(i) * (Math.cos(a) - Math.cos(b)) / (Math.PI * k);
    }
    triW = { c, w: c.createPeriodicWave(re, im) };
    return triW.w;
  }
  // cada som devolve quanto dura, em segundos
  const SND = {
    bipe: (c, b, t) => { for (let i = 0; i < 3; i++) tone(c, b, t + i * 0.2, 1046.5, 0.11, 'square', 0.35); return 0.6; },
    sino: (c, b, t) => { tone(c, b, t, 784, 1.8, 'sine', 1, true); tone(c, b, t, 1568, 1.1, 'sine', 0.35, true); tone(c, b, t, 2637, 0.5, 'sine', 0.12, true); return 1.6; },
    // duas notas descendo uma quarta (lá, mi), sem fanfarra
    '8bits': (c, b, t) => { const w = nesTri(c); tone(c, b, t, 880, 0.15, w, 0.6); tone(c, b, t + 0.19, 659.25, 0.42, w, 0.6); return 0.8; },
  };
  const tmVolume = () => (tp.vol / 100) ** 2;
  function tmPlay(at, o = {}) {
    if (tp.snd === 'nada') return null;
    const c = tmCtx(); if (!c) return null;
    const bus = c.createGain(); bus.gain.value = tmVolume(); bus.connect(c.destination);
    const t0 = c.currentTime + Math.max(0.02, (at - Date.now()) / 1000);
    if (o.ticks && tp.tick) for (let i = 3; i >= 1; i--) if (t0 - i > c.currentTime + 0.02) tone(c, bus, t0 - i, 1568, 0.045, 'square', 0.25);
    let t = t0; for (let i = 0, n = o.reps || tp.rep || 40; i < n; i++) t += SND[tp.snd](c, bus, t) + 0.6;
    return { bus, at };
  }
  const tmStop = s => { if (s) try { s.bus.gain.value = 0; s.bus.disconnect(); } catch (e) {} };
  const sched = { timer: null, pomo: null };
  let ringing = null, toastT = 0, testS = null;
  function tmArm(w) {
    tmStop(sched[w]); sched[w] = null;
    const s = w === 'timer' ? tm.t : tm.p; if (!s.run) return;
    const c = tmCtx(); if (!c) return;
    const arm = () => { if (s.run && !sched[w]) sched[w] = tmPlay(s.end, { ticks: true }); };
    if (c.state === 'running') arm(); else c.resume().then(arm).catch(() => {});
  }
  addEventListener('pointerdown', () => { if (tmAC && tmAC.state !== 'running') tmAC.resume().then(() => { for (const w of ['timer', 'pomo']) if (!sched[w]) tmArm(w); }).catch(() => {}); }, { passive: true });

  // aviso: aparece em qualquer página; o som que já estava agendado continua, ou toca agora
  function tmRing(msg, w, s, at, quiet) {
    tmStop(ringing); ringing = null;
    if (quiet) tmStop(s);
    else {
      ringing = s && s.at === at ? s : (tmStop(s), tmPlay(Date.now()));
      if (tp.vib && navigator.vibrate) try { navigator.vibrate([300, 150, 300, 150, 300]); } catch (e) {}
    }
    $('tmToastT').textContent = msg; $('tmToast').dataset.w = w; $('tmToast').hidden = false;
    clearTimeout(toastT); if (tp.rep || quiet) toastT = setTimeout(tmHush, 20000);
  }
  function tmHush() { tmStop(ringing); ringing = null; $('tmToast').hidden = true; clearTimeout(toastT); tmPaint(); }
  $('tmToastOk').addEventListener('click', tmHush);

  // sessões: começam quando um relógio parte do zero (ou quando um foco começa) e terminam no fim, ao zerar ou ao pular o foco
  const TNW = { timer: 'timer', crono: 'cronômetro', pomo: 'foco' };
  function sessStart(w, at, focus) {
    if (tm.ss[w].a) return;
    tm.ss[w] = { a: at, n: '', g: tm.g };
    if (prefs.tnote === 'start') tnAsk({ w }, focus);
  }
  function sessEnd(w, at, ms) {
    const s = tm.ss[w]; if (!s.a) return;
    tm.ss[w] = { a: 0, n: '', g: '' };
    // se o campo desta sessão estava aberto, o que já foi digitado vai junto
    const open = !$('tnCard').hidden && tn && !tn.id && tn.w === w, typed = open ? $('tnIn').value.trim() : '';
    if (ms < 60000) { if (open) tnClose(); return; }
    const x = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), w, a: s.a, b: at, ms: Math.round(ms), n: (typed || s.n).slice(0, 120), g: s.g || '', u: Date.now() };
    tmLog.push(x); logSave(); drawTn();
    if (open || (prefs.tnote === 'end' && !x.n)) tnAsk({ id: x.id }, open && document.activeElement === $('tnIn'), typed);
  }
  // o campo para escrever: aparece em qualquer página, com as últimas anotações para tocar e reaproveitar
  function tnAsk(t, focus, text) {
    const x = t.id && tmLog.find(e => e.id === t.id), w = x ? x.w : t.w;
    if (!x && !tm.ss[w].a) return;
    tn = t;
    $('tnQ').textContent = x ? 'O que você fez?' : 'O que você vai fazer?';
    $('tnCtx').textContent = x ? `${TNW[w]} de ${fmtStudy(x.ms)} · ${hhmm(x.a)}–${hhmm(x.b)}` : `${TNW[w]} · começou às ${hhmm(tm.ss[w].a)}`;
    $('tnIn').value = text || (x ? x.n : tm.ss[w].n);
    const seen = new Set(), rec = [];
    for (let i = tmLog.length - 1; i >= 0 && rec.length < 4; i--) { const n = tmLog[i].n.trim(), k = n.toLowerCase(); if (n && !seen.has(k)) { seen.add(k); rec.push(n); } }
    $('tnRecent').replaceChildren(...rec.map(n => { const b = document.createElement('button'); b.type = 'button'; b.textContent = n; return b; }));
    tnGoalPaint();
    $('tnCard').hidden = false;
    if (focus) $('tnIn').focus({ preventScroll: true });
  }
  function tnClose() { $('tnCard').hidden = true; tn = null; }
  // a meta da sessão, no mesmo cartão: vale na hora, sem precisar salvar
  function tnGoalPaint() {
    const x = tn && tn.id && tmLog.find(e => e.id === tn.id), sel = x ? x.g : tn ? tm.ss[tn.w].g : '', ks = goalKs(sel);
    $('tnGoal').hidden = !ks; $('tnGoal').innerHTML = ks ? '<span class="lb">meta</span>' + ks : '';
  }
  $('tnGoal').addEventListener('click', e => {
    const b = e.target.closest('[data-g]'); if (!b || !tn) return;
    const x = tn.id && tmLog.find(r => r.id === tn.id), cur = x ? x.g : tm.ss[tn.w].g, g = cur === b.dataset.g ? '' : b.dataset.g;
    if (x) { x.g = g; x.u = Date.now(); logSave(); }
    else { tm.ss[tn.w].g = g; tm.g = g; tmSave(); }
    tnGoalPaint(); drawTn(); tmGoalPaint();
  });
  $('tnSkip').innerHTML = XI;
  $('tnSkip').addEventListener('click', tnClose);
  $('tnRecent').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { $('tnIn').value = b.textContent; $('tnIn').focus(); } });
  $('tnCard').addEventListener('submit', e => {
    e.preventDefault();
    const v = $('tnIn').value.trim().slice(0, 120);
    if (tn && tn.id) { const x = tmLog.find(r => r.id === tn.id); if (x) { x.n = v; x.u = Date.now(); logSave(); } }
    else if (tn && tm.ss[tn.w].a) { tm.ss[tn.w].n = v; tmSave(); }
    tnClose(); drawTn(); tmPaint();
  });
  // a lista de sessões, na página Tempo
  function drawTn() {
    if (view !== 'tempo') return;
    const d0 = new Date(); d0.setHours(0, 0, 0, 0); const today = +d0; d0.setDate(d0.getDate() - (tnAll ? 6 : 0));
    const rows = tmLog.filter(x => x.a >= +d0).sort((a, b) => b.a - a.a), nt = tmLog.filter(x => x.a >= today).length, list = $('tnList');
    $('tnBoxN').textContent = nt ? `${nt} hoje` : '';
    list.replaceChildren();
    const li = (cls, txt) => { const e = document.createElement('li'); e.className = cls; e.textContent = txt; return e; };
    if (!rows.length) list.append(li('m0', tnAll ? 'Nenhuma sessão nos últimos 7 dias.' : 'Nenhuma sessão hoje ainda.'));
    let day = '';
    for (const x of rows) {
      const k = dayKey(new Date(x.a));
      if (tnAll && k !== day) { day = k; list.append(li('tnd', dName(k, true))); }
      const e = document.createElement('li'), b = document.createElement('button'), n = document.createElement('span');
      b.type = 'button'; b.className = 'tne'; b.dataset.id = x.id;
      b.innerHTML = `<span class="t">${hhmm(x.a)}</span><span class="k">${TNW[x.w]} · ${fmtStudy(x.ms)}</span>`;
      n.className = x.n ? 'n' : 'n e'; n.textContent = x.n || '+ escrever o que fez'; b.append(n);
      if (metaT(x.g)) { const g = document.createElement('span'); g.className = 'mg'; g.innerHTML = NI.flag; g.append(metaT(x.g)); b.append(g); }
      b.setAttribute('aria-label', `${TNW[x.w]} de ${fmtStudy(x.ms)} às ${hhmm(x.a)}: ${x.n || 'sem anotação'}. Escrever o que fez`);
      e.append(b); list.append(e);
    }
    $('tnMore').textContent = tnAll ? 'mostrar só hoje' : 'mostrar os últimos 7 dias'; $('tnMore').setAttribute('aria-expanded', tnAll);
  }
  $('tnList').addEventListener('click', e => { const b = e.target.closest('.tne'); if (b) tnAsk({ id: b.dataset.id }, true); });
  $('tnMore').addEventListener('click', () => { tnAll = !tnAll; drawTn(); });

  // fases do pomodoro: foco, pausa curta, foco… e, depois do último foco do ciclo, a pausa longa
  function pNext() { const p = tm.p; if (p.ph === 'foco') { p.k++; p.ph = p.k >= tp.ciclos ? 'longa' : 'curta'; } else { if (p.ph === 'longa' || p.k >= tp.ciclos) p.k = 0; p.ph = 'foco'; } }
  let tmNz = Promise.resolve();
  function tmNoise() {
    if (!tp.noise) return;
    tmNz = tmNz.then(() => { const want = tm.p.run && tm.p.ph === 'foco'; if (nz.on !== want) return nzToggle(); }).catch(() => {});
  }
  let tmBoot = true;
  function tmDone(w, at) {
    const s = sched[w]; sched[w] = null;
    // terminou com o Faro fechado: avisa sem som e não emenda a próxima fase
    const quiet = tmBoot && Date.now() - at > 5000, when = quiet ? ` às ${hhmm(at)}` : '';
    if (w === 'timer') {
      addSpan('timer', tm.t.from, at); tday(at).nt++; tmdSave();
      sessEnd('timer', at, tm.t.dur);
      Object.assign(tm.t, { run: false, left: 0, done: true, at });
      studySync(at);
      tmRing(`O timer de ${fmtDur(tm.t.dur)} acabou${when}.`, w, s, at, quiet);
    } else {
      const p = tm.p, was = p.ph;
      addSpan(pKind(was), p.from, at);
      if (was === 'foco') { tday(at).nf++; tmdSave(); sessEnd('pomo', at, pd('foco')); }
      pNext();
      const auto = !quiet && (p.ph === 'foco' ? tp.autoF : tp.autoP), nx = `${PH[p.ph].toLowerCase()} de ${tp[p.ph]} min`;
      p.left = pd(p.ph); p.run = auto; p.end = auto ? at + p.left : 0; p.from = auto ? at : 0;
      if (auto && p.ph === 'foco') sessStart('pomo', at, false);
      studySync(at);
      tmRing(`${was === 'foco' ? 'Fim do foco' : 'Fim da pausa'}${when}. ${auto ? `Começou: ${nx}.` : `Próximo: ${nx}.`}`, w, s, at, quiet);
      tmArm('pomo'); tmNoise();
    }
    tmSave();
    if (view === 'tempo') drawTimeCfg();
  }
  let tmTimer = 0;
  function tmLoop() {
    clearTimeout(tmTimer);
    const now = Date.now();
    if (tm.t.run && now >= tm.t.end) tmDone('timer', tm.t.end);
    while (tm.p.run && now >= tm.p.end) tmDone('pomo', tm.p.end);
    if (tmBoot) studySync(now);
    tmBoot = false;
    if (tm.sf && now - rkAt > 300000) { rkAt = now; rkQueue(); }
    tmPaint();
    if (tm.t.run || tm.p.run || tm.c.start) tmTimer = setTimeout(tmLoop, tm.c.start && view === 'tempo' && tm.tab === 'crono' ? 47 : 250);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { tmLoop(); nzUI(); } });

  // desenho: página, painéis do menu, item do menu e o atalho no topo (celular)
  const tLeft = () => tm.t.run ? Math.max(0, tm.t.end - Date.now()) : tm.t.left;
  const pLeft = () => tm.p.run ? Math.max(0, tm.p.end - Date.now()) : tm.p.left;
  const cEl = () => tm.c.acc + (tm.c.start ? Date.now() - tm.c.start : 0);
  const playIc = (b, run, what) => { const k = run ? 'pause' : 'play'; if (b.dataset.k !== k) { b.dataset.k = k; b.innerHTML = IC[k]; b.setAttribute('aria-label', `${run ? 'Pausar' : 'Iniciar'} ${what}`); } };
  let tsAt = 0;  // última vez que a estatística da página Tempo foi desenhada
  function tmPaint() {
    const t = tm.t, c = tm.c, p = tm.p, T = tLeft(), P = pLeft(), C = cEl();
    const chip = p.run ? clock(P) : t.run ? clock(T) : c.start ? clock(C, true) : '';
    setT($('tmNav'), chip); setT($('tmQuickT'), chip);
    $('tmQuick').hidden = !chip || view === 'tempo';
    const ringW = $('tmToast').hidden ? '' : $('tmToast').dataset.w;
    if (pins.timer) {
      setT($('pinTimer').querySelector('.md'), clock(T));
      setT($('pinTimer').querySelector('.ms'), t.run ? `até ${hhmm(t.end)}` : t.done ? 'acabou' : T < t.dur ? 'pausado' : fmtDur(t.dur));
      playIc($('pinTimer').querySelector('[data-tm-go]'), t.run, 'o timer');
      $('pinTimer').classList.toggle('ring', ringW === 'timer');
    }
    if (pins.crono) {
      setT($('pinCrono').querySelector('.md'), clock(C, true));
      setT($('pinCrono').querySelector('.ms'), c.laps.length ? `${c.laps.length} ${c.laps.length === 1 ? 'volta' : 'voltas'}` : c.start ? 'contando' : C ? 'pausado' : '');
      playIc($('pinCrono').querySelector('[data-tm-go]'), !!c.start, 'o cronômetro');
    }
    if (pins.pomo) {
      setT($('pinPomo').querySelector('.md'), clock(P));
      setT($('pinPomo').querySelector('.ms'), p.ph === 'foco' ? `foco ${Math.min(p.k + 1, tp.ciclos)}/${tp.ciclos}` : PH[p.ph].toLowerCase());
      playIc($('pinPomo').querySelector('[data-tm-go]'), p.run, 'o pomodoro');
      $('pinPomo').classList.toggle('ring', ringW === 'pomo');
    }
    if (view !== 'tempo') return;
    if (tm.sf && Date.now() - tsAt > 15000) drawTStats();
    const w = tm.tab, ss = tm.ss[w];
    $('tmNote').hidden = !ss.a;
    if (ss.a) setT($('tmNote'), ss.n ? `“${ss.n}” · mudar` : '+ escrever o que você está fazendo');
    let big, frac = -1, sub, goTxt, altTxt, altOff = false, rstOff, hd, info = '';
    if (w === 'timer') {
      big = clock(T); frac = t.dur ? 1 - T / t.dur : 0; hd = 'Timer'; info = fmtDur(t.dur);
      sub = t.run ? `termina às ${hhmm(t.end)}` : t.done ? `acabou às ${hhmm(t.at)}` : T < t.dur ? 'pausado' : 'pronto para começar';
      goTxt = t.run ? 'PAUSAR' : t.done ? 'DE NOVO' : T < t.dur ? 'CONTINUAR' : 'INICIAR'; altTxt = '+1 MIN';
      rstOff = !t.run && !t.done && T === t.dur && t.dur === tp.dur;
    } else if (w === 'crono') {
      big = clock(C, true) + `<small>,${cent(C)}</small>`; hd = 'Cronômetro';
      const last = c.laps.length ? c.laps[c.laps.length - 1] : 0;
      sub = c.laps.length ? `volta ${c.laps.length + 1}: ${lapTxt(C - last)}` : c.start ? 'contando' : C ? 'pausado' : 'pronto para começar';
      goTxt = c.start ? 'PAUSAR' : C ? 'CONTINUAR' : 'INICIAR'; altTxt = 'VOLTA'; altOff = !c.start; rstOff = !C;
    } else {
      const full = pd(p.ph), nx = p.ph === 'foco' ? (p.k + 1 >= tp.ciclos ? 'longa' : 'curta') : 'foco';
      big = clock(P); frac = 1 - P / full; hd = PH[p.ph]; info = p.ph === 'foco' ? `foco ${Math.min(p.k + 1, tp.ciclos)} de ${tp.ciclos}` : `${tp[p.ph]} min`;
      sub = `${p.run ? `termina às ${hhmm(p.end)}` : P < full ? 'pausado' : 'pronto para começar'} · depois: ${PH[nx].toLowerCase()}`;
      goTxt = p.run ? 'PAUSAR' : P < full ? 'CONTINUAR' : 'INICIAR'; altTxt = 'PULAR';
      rstOff = !p.run && p.ph === 'foco' && !p.k && P === full;
      $('tmCyc').innerHTML = `<span>${PH[p.ph]}</span><span class="dots" aria-label="${p.k} de ${tp.ciclos} focos feitos neste ciclo">${Array.from({ length: tp.ciclos }, (_, i) => `<i class="${i < p.k ? 'f' : i === p.k && p.ph === 'foco' ? 'n' : ''}"></i>`).join('')}</span>`;
    }
    $('tmCyc').hidden = w !== 'pomo';
    if ($('tmT').innerHTML !== big) $('tmT').innerHTML = big;
    $('tmBar').classList.toggle('off', frac < 0);
    $('tmFill').style.width = `calc(${(Math.min(1, Math.max(0, frac)) * 100).toFixed(2)}% - 2px)`;
    setT($('tmSub'), sub); setT($('tmHd'), hd); setT($('tmInfo'), info);
    setT($('tmGo'), goTxt); setT($('tmAlt'), altTxt);
    $('tmAlt').disabled = altOff; $('tmRst').disabled = rstOff;
    $('tmBox').classList.toggle('ring', ringW === (w === 'crono' ? '-' : w));
  }
  function tmLapsDraw() {
    const L = tm.c.laps, box = $('tmLapBox');
    box.hidden = tm.tab !== 'crono' || !L.length;
    if (box.hidden) return;
    const d = L.map((x, i) => x - (i ? L[i - 1] : 0)), mn = Math.min(...d), mx = Math.max(...d), tag = L.length > 2;
    $('tmLapN').textContent = `${L.length} ${L.length === 1 ? 'volta' : 'voltas'}`;
    $('tmLaps').innerHTML = '<li class="lh"><span>nº</span><span>volta</span><span>total</span><span></span></li>' + L.map((x, i) => {
      const k = tag && d[i] === mn ? 'best' : tag && d[i] === mx ? 'worst' : '';
      return `<li class="${k}"><span class="n">${i + 1}</span><span>${lapTxt(d[i])}</span><span class="tot">${lapTxt(x)}</span><span class="tg">${k === 'best' ? 'melhor' : k === 'worst' ? 'pior' : ''}</span></li>`;
    }).reverse().join('');
  }

  // estatística de tempo: resumo, barras dos últimos 14 dias e as partes da semana
  function drawStudy() {
    const ks = Array.from({ length: 14 }, (_, i) => { const x = new Date(); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - 13 + i); return dayKey(x); });
    const rs = ks.map(tdLive), today = rs[13], wk = studyWeek(), tot = rs.reduce((a, r) => a + r.e, 0);
    const cell = (k, v, d) => `<div><span>${k}</span><b>${v}</b><em>${d}</em></div>`;
    const g = tGoal(), wd = weekDays().filter(k => tdLive(k).e >= (g || 60000)).length;
    $('stSum').innerHTML = cell('hoje', fmtStudy(today.e), g ? (today.e >= g ? 'meta cumprida' : `${Math.floor(100 * today.e / g)}% da meta`)
        : today.nf ? `${today.nf} ${today.nf === 1 ? 'foco completo' : 'focos completos'}` : 'nenhum foco completo')
      + cell('esta semana', fmtStudy(wk.e), `${wd} de 7 dias${g ? ' na meta' : ''}`)
      + cell('média por dia', fmtStudy(tot / 14), 'nos últimos 14 dias');
    const mx = Math.max(...rs.map(r => r.e)), m2 = Math.max(mx, g), step = m2 <= 3600000 ? 900000 : m2 <= 3 * 3600000 ? 1800000 : 3600000, top = Math.max(step, Math.ceil(m2 / step) * step);
    const det = i => { const r = rs[i], ps = [['foco', r.foco], ['timer', r.timer], ['cronômetro', r.crono], ['questões', r.q], ['à mão', r.m]].filter(p => p[1] >= 1000).map(p => `${p[0]} ${fmtStudy(p[1])}`);
      return `${i === 13 ? 'hoje' : fmtD(ks[i])} · ${fmtStudy(r.e)}${ps.length ? ' (' + ps.join(', ') + ')' : ''}`; };
    $('stChart').setAttribute('aria-label', `Tempo de estudo nos últimos 14 dias: ${fmtStudy(tot)} no total`);
    $('stChart').innerHTML = !mx ? '<p class="hempty">o tempo de cada dia aparece aqui</p>'
      : `<div class="sy"><span>${fmtStudy(top)}</span><span>${fmtStudy(top / 2)}</span><span>0</span></div>`
      + `<div class="sbars">${g ? `<b class="sgl" style="bottom:${(g / top * 100).toFixed(1)}%"></b>` : ''}${rs.map((r, i) => `<div class="sb${i === 13 ? ' td' : ''}" data-i="${i}" title="${det(i)}">${r.m ? `<s style="height:${(Math.min(r.m, r.e) / top * 100).toFixed(1)}%"></s>` : ''}<i style="height:${(Math.max(0, r.e - r.m) / top * 100).toFixed(1)}%"></i></div>`).join('')}</div>`
      + `<div class="sx">${ks.map((k, i) => `<span>${i % 2 === 1 || i === 13 ? k.slice(8) : ''}</span>`).join('')}</div><p class="stt" id="stTip">${det(13)}</p>`
      + (rs.some(r => r.m) || g ? `<p class="skey"><span><i></i>${rs.some(r => r.m) ? 'nos relógios do Faro' : 'estudo'}</span>${rs.some(r => r.m) ? '<span><s></s>registrado à mão</span>' : ''}${g ? `<span><u></u>meta de ${fmtStudy(g)}</span>` : ''}</p>` : '');
    $('stChart').onpointerover = $('stChart').onpointerdown = e => { const b = e.target.closest('.sb'); if (b) $('stTip').textContent = det(+b.dataset.i); };
    const P = [['Foco do pomodoro', wk.foco, wk.nf ? `${wk.nf} ${wk.nf === 1 ? 'foco completo' : 'focos completos'}` : ''], ['Pausas do pomodoro', wk.pausa, 'não entram no estudo'],
      ['Timer', wk.timer, wk.nt ? `${wk.nt} ${wk.nt === 1 ? 'chegou' : 'chegaram'} ao fim` : ''], ['Cronômetro', wk.crono, ''], ['Resolvendo questões', wk.q, `${weekN().n} ${weekN().n === 1 ? 'questão' : 'questões'}`]];
    const wn = tmMan.filter(x => weekDays().includes(x.d)).length;
    if (wk.m) P.push(['Registrado à mão', wk.m, `${wn} ${wn === 1 ? 'registro' : 'registros'}`]);
    const pm = Math.max(1, ...P.map(p => p[1]));
    $('stParts').innerHTML = P.map(([n, v, d]) => `<div class="srow"><span class="n">${n}</span><span class="bar"><i style="width:calc(${(v / pm * 100).toFixed(1)}% - 2px)"></i></span><b>${fmtStudy(v)}</b>${d ? `<em>${d}</em>` : ''}</div>`).join('');
    drawMan();
  }


  // ações (o mesmo para a página e para os painéis do menu)
  function tmGo(w = tm.tab) {
    tmCtx(); if ($('tmToast').dataset.w === w || w !== 'crono') tmHush();
    const now = Date.now();
    if (w === 'timer') {
      const t = tm.t;
      if (t.run) { t.left = Math.max(0, t.end - now); t.run = false; addSpan('timer', t.from, now); }
      else { if (t.done || t.left <= 0) t.left = t.dur; t.done = false; t.end = now + t.left; t.run = true; t.from = now; sessStart('timer', now, true); }
      tmArm('timer');
    } else if (w === 'crono') {
      const c = tm.c;
      if (c.start) { c.acc += now - c.start; addSpan('crono', c.start, now); c.start = 0; } else { c.start = now; sessStart('crono', now, true); }
    } else {
      const p = tm.p;
      if (p.run) { p.left = Math.max(0, p.end - now); p.run = false; addSpan(pKind(p.ph), p.from, now); } else { if (p.left <= 0) p.left = pd(p.ph); p.end = now + p.left; p.run = true; p.from = now; if (p.ph === 'foco') sessStart('pomo', now, true); }
      tmArm('pomo'); tmNoise();
    }
    studySync(now); tmSave(); tmLoop(); if (view === 'tempo') drawTimeCfg();
  }
  function tmAlt(w = tm.tab) {
    const now = Date.now();
    if (w === 'timer') {
      const t = tm.t; tmHush();
      if (t.done) { Object.assign(t, { dur: 60000, left: 60000, done: false, run: true, end: now + 60000, from: now }); sessStart('timer', now, true); }
      else if (!t.run && t.left === t.dur) { tp.dur = Math.min(86399000, tp.dur + 60000); tpSave(); t.dur = t.left = tp.dur; }
      else { t.dur += 60000; if (t.run) t.end += 60000; else t.left += 60000; }
      tmArm('timer');
    } else if (w === 'crono') {
      const c = tm.c; if (!c.start) return;
      c.laps.push(c.acc + now - c.start); if (c.laps.length > 99) c.laps.shift();
      tmLapsDraw();
    } else {
      if ($('tmToast').dataset.w === 'pomo') tmHush();
      const p = tm.p, run = p.run;
      if (run) addSpan(pKind(p.ph), p.from, now);
      if (p.ph === 'foco') sessEnd('pomo', now, pd('foco') - pLeft());
      pNext(); p.left = pd(p.ph); p.run = run; p.end = run ? now + p.left : 0; p.from = run ? now : 0;
      if (run && p.ph === 'foco') sessStart('pomo', now, true);
      tmArm('pomo'); tmNoise();
    }
    studySync(now); tmSave(); tmLoop(); if (view === 'tempo') drawTimeCfg();
  }
  function tmReset(w = tm.tab) {
    const now = Date.now();
    if (w === 'timer') sessEnd('timer', now, tm.t.dur - tLeft());
    else if (w === 'crono') sessEnd('crono', now, cEl());
    else if (tm.p.ph === 'foco') sessEnd('pomo', now, pd('foco') - pLeft());
    if (w === 'timer' && tm.t.run) addSpan('timer', tm.t.from, now);
    if (w === 'crono' && tm.c.start) addSpan('crono', tm.c.start, now);
    if (w === 'pomo' && tm.p.run) addSpan(pKind(tm.p.ph), tm.p.from, now);
    if (w === 'timer') Object.assign(tm.t, { dur: tp.dur, left: tp.dur, run: false, done: false, end: 0 });
    else if (w === 'crono') { tm.c = { acc: 0, start: 0, laps: [] }; tmLapsDraw(); }
    else Object.assign(tm.p, { ph: 'foco', k: 0, left: pd('foco'), run: false, end: 0 });
    if (w !== 'crono') { tmArm(w); if ($('tmToast').dataset.w === w) tmHush(); }
    if (w === 'pomo') tmNoise();
    studySync(now); tmSave(); tmLoop(); if (view === 'tempo') drawTimeCfg();
  }
  $('tmGo').addEventListener('click', () => tmGo());
  $('tmAlt').addEventListener('click', () => tmAlt());
  $('tmRst').addEventListener('click', () => tmReset());
  $('pins').addEventListener('click', e => {
    const b = e.target.closest('[data-tm-go], [data-tm-rst], [data-tm-alt]'); if (!b) return;
    if (b.dataset.tmGo) tmGo(b.dataset.tmGo); else if (b.dataset.tmRst) tmReset(b.dataset.tmRst); else tmAlt(b.dataset.tmAlt);
  });
  $('pins').querySelectorAll('[data-tm-rst]').forEach(b => { b.innerHTML = IC.reset; });
  $('pins').querySelectorAll('[data-tm-alt]').forEach(b => { b.innerHTML = IC.skip; });
  $('tmQuick').addEventListener('click', () => {
    tm.tab = tm.p.run ? 'pomo' : tm.t.run ? 'timer' : tm.c.start ? 'crono' : tm.tab; tmSave();
    go('tempo'); scrollTo({ top: 0 });
  });

  // configurações do tempo
  const PRE = [1, 3, 5, 10, 15, 20, 25, 30, 45, 60];
  $('tmPre').innerHTML = PRE.map(m => `<button type="button" data-m="${m}">${m === 60 ? '1 H' : m + ' MIN'}</button>`).join('');
  const stepRow = (id, label, unit, min, max, step) => `<div class="srw"><span class="sl">${label}</span><span class="stp" id="${id}" data-min="${min}" data-max="${max}" data-step="${step}"><button type="button" data-d="-1" aria-label="${label}: menos">−</button><input inputmode="numeric" autocomplete="off" aria-label="${label}${unit ? ', em ' + unit : ''}"><button type="button" data-d="1" aria-label="${label}: mais">+</button></span><span class="u">${unit}</span></div>`;
  $('tmFree').innerHTML = '<span class="lb">Ou escolha o tempo</span>' + stepRow('stH', 'Horas', 'h', 0, 23, 1) + stepRow('stM', 'Minutos', 'min', 0, 59, 1) + stepRow('stS', 'Segundos', 's', 0, 59, 5);
  $('tmPomoSt').innerHTML = stepRow('stFoco', 'Foco', 'min', 1, 180, 5) + stepRow('stCurta', 'Pausa curta', 'min', 1, 60, 1) + stepRow('stLonga', 'Pausa longa', 'min', 1, 90, 5) + stepRow('stCiclos', 'Focos até a pausa longa', '', 1, 12, 1);
  const hms = () => [Math.floor(tp.dur / 3600000), Math.floor(tp.dur / 60000) % 60, Math.floor(tp.dur / 1000) % 60];
  function setDur(ms) {
    if (!tm.t.run && ms >= 1000) {
      tp.dur = Math.min(ms, 86399000); tpSave();
      Object.assign(tm.t, { dur: tp.dur, left: tp.dur, done: false, end: 0 }); tmSave();
      if ($('tmToast').dataset.w === 'timer') tmHush();
    }
    drawTimeCfg(); tmPaint();
  }
  function setPomo(k, v) {
    const p = tm.p, fresh = !p.run && p.left === pd(p.ph);
    tp[k] = v; tpSave();
    if (fresh) p.left = pd(p.ph);
    if (k === 'ciclos' && p.ph !== 'longa') p.k = Math.min(p.k, v - 1);
    tmSave(); drawTimeCfg(); tmPaint();
  }
  const STP = {
    stH: v => { const [, m, s] = hms(); setDur(v * 3600000 + m * 60000 + s * 1000); },
    stM: v => { const [h, , s] = hms(); setDur(h * 3600000 + v * 60000 + s * 1000); },
    stS: v => { const [h, m] = hms(); setDur(h * 3600000 + m * 60000 + v * 1000); },
    stFoco: v => setPomo('foco', v), stCurta: v => setPomo('curta', v), stLonga: v => setPomo('longa', v), stCiclos: v => setPomo('ciclos', v),
  };
  function setStp(id, v, lock) {
    const st = $(id), inp = st.querySelector('input'), [dn, up] = st.querySelectorAll('button');
    if (document.activeElement !== inp) inp.value = v;
    inp.disabled = !!lock; dn.disabled = lock || v <= +st.dataset.min; up.disabled = lock || v >= +st.dataset.max;
  }
  const stepBy = (st, d) => {
    const step = +st.dataset.step, cur = Math.round(+st.querySelector('input').value) || 0;
    const v = d > 0 ? Math.floor(cur / step) * step + step : Math.ceil(cur / step) * step - step;
    STP[st.id](Math.min(+st.dataset.max, Math.max(+st.dataset.min, v)));
  };
  document.addEventListener('click', e => { const b = e.target.closest('.stp button'); if (b) stepBy(b.parentNode, +b.dataset.d); });
  document.addEventListener('change', e => {
    const st = e.target.closest('.stp'); if (!st) return;
    let v = Math.round(+e.target.value.replace(',', '.')); if (!Number.isFinite(v)) v = +st.dataset.min;
    e.target.blur(); STP[st.id](Math.min(+st.dataset.max, Math.max(+st.dataset.min, v)));
  });
  document.addEventListener('keydown', e => {
    const st = e.target.closest && e.target.closest('.stp'); if (!st) return;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); stepBy(st, e.key === 'ArrowUp' ? 1 : -1); }
    else if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); }
  });

  // registrar tempo à mão: dia (hoje ou até 7 dias atrás), duração e, se quiser, o que estudou
  const PEN = pix(['.....##', '....#.#', '...#.#.', '..#.#..', '.#.#...', '#.#....', '##.....']);
  const WD = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const dAgo = n => { const x = new Date(); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - n); return dayKey(x); };
  const dName = (k, full) => { const i = [0, 1].find(n => dAgo(n) === k); return i === 0 ? 'hoje' : i === 1 ? 'ontem' : `${WD[new Date(k + 'T12:00').getDay()]} ${full ? fmtD(k) : k.slice(8)}`; };
  const manWhen = k => k === dayKey() ? 'hoje' : k === dAgo(1) ? 'ontem' : 'em ' + dName(k, true);
  // quanto ainda cabe num dia: hoje, só o que já passou desde a meia-noite
  const manRoom = k => Math.max(0, (k === dayKey() ? Date.now() - new Date(k + 'T00:00') : DAY) - tdLive(k).e);
  let manD = dayKey(), manMs = 30 * 60000;
  STP.stMH = v => { manMs = v * 3600000 + Math.floor(manMs / 60000) % 60 * 60000; manPaint(); };
  STP.stMM = v => { manMs = Math.floor(manMs / 3600000) * 3600000 + v * 60000; manPaint(); };
  $('manDur').innerHTML = stepRow('stMH', 'Horas', 'h', 0, 23, 1) + stepRow('stMM', 'Minutos', 'min', 0, 59, 5);
  function manPaint() {
    const room = manRoom(manD), over = manMs > room, when = manWhen(manD);
    $('manDays').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.d === manD));
    setStp('stMH', Math.floor(manMs / 3600000)); setStp('stMM', Math.floor(manMs / 60000) % 60);
    $('manHint').textContent = room < 60000 ? 'Esse dia já está cheio: não cabe mais tempo nele.' : manMs < 60000 ? 'Escolha quanto tempo você estudou.'
      : over ? `Não cabe: ${when} só sobra ${fmtStudy(room)}.` : `Vai somar ${fmtStudy(manMs)} ${when}.`;
    $('manHint').classList.toggle('bad', over || room < 60000);
    $('manSave').disabled = over || manMs < 60000 || room < 60000;
  }
  function manOpen(on) {
    $('manForm').hidden = !on; $('manOpen').hidden = on; $('manOpen').setAttribute('aria-expanded', on);
    if (!on) return;
    manD = dayKey(); $('manMsg').hidden = true;
    $('manDays').innerHTML = Array.from({ length: 8 }, (_, i) => dAgo(i)).map(k => `<button type="button" data-d="${k}">${dName(k)}</button>`).join('');
    manPaint();
  }
  function manMsg(txt, undo) {
    const m = $('manMsg'); m.hidden = false; m.textContent = txt;
    if (!undo) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'undo'; b.textContent = 'desfazer';
    b.onclick = () => { tmMan.push(undo); manSave(); m.hidden = true; drawStudy(); rkQueue(); };
    m.append(' ', b);
  }
  function drawMan() {
    const ks = Array.from({ length: 14 }, (_, i) => dAgo(i)), rows = tmMan.filter(x => ks.includes(x.d)).sort((a, b) => b.d.localeCompare(a.d) || b.t - a.t);
    if (!rows.length) { $('manList').innerHTML = '<li class="m0">Nenhum registro nos últimos 14 dias.</li>'; return; }
    $('manList').replaceChildren(...rows.map(x => {
      const li = document.createElement('li'), d = document.createElement('span'), w = document.createElement('span'), v = document.createElement('b'), del = document.createElement('button');
      d.textContent = dName(x.d, true); w.className = 'w'; w.textContent = (x.l || 'sem descrição') + (x.b ? ' · bloco do calendário' : ''); v.textContent = fmtStudy(x.ms);
      del.type = 'button'; del.className = 'del'; del.dataset.id = x.id; del.innerHTML = XI; del.setAttribute('aria-label', `Apagar o registro de ${fmtStudy(x.ms)} (${dName(x.d, true)})`);
      li.append(d, w, v, del); return li;
    }));
  }
  $('manOpen').addEventListener('click', () => { manOpen(true); $('manDays').querySelector('[aria-pressed="true"]').focus(); });
  $('manCancel').addEventListener('click', () => { manOpen(false); $('manOpen').focus(); });
  $('manDays').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { manD = b.dataset.d; manPaint(); } });
  $('manForm').addEventListener('submit', e => {
    e.preventDefault();
    // o que estiver digitado nos campos vale, mesmo sem sair deles
    const num = id => Math.max(0, Math.round(+$(id).querySelector('input').value.replace(',', '.')) || 0);
    manMs = Math.min(23, num('stMH')) * 3600000 + Math.min(59, num('stMM')) * 60000;
    if (manMs < 60000 || manMs > manRoom(manD)) return manPaint();
    tmMan.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), d: manD, ms: manMs, l: $('manWhat').value.trim().slice(0, 40), t: Date.now() });
    manSave(); manOpen(false); $('manWhat').value = '';
    drawStudy(); rkQueue(); manMsg(`Pronto: ${fmtStudy(manMs)} ${manWhen(manD)}.`);
  });
  $('manList').addEventListener('click', e => {
    const b = e.target.closest('.del'), i = b ? tmMan.findIndex(x => x.id === b.dataset.id) : -1; if (i < 0) return;
    const [x] = tmMan.splice(i, 1); manSave(); drawStudy(); rkQueue();
    manMsg(`Registro de ${fmtStudy(x.ms)} apagado.`, x);
  });
  $('tmManGo').addEventListener('click', () => { go('estatisticas'); manOpen(true); $('stMan').scrollIntoView({ block: 'start' }); $('manDays').querySelector('[aria-pressed="true"]').focus({ preventScroll: true }); });

  // meta de tempo de estudo por dia, com os mesmos números das estatísticas
  const tGoal = () => prefs.tgoal * 60000;
  $('tsGoalSt').innerHTML = stepRow('tsGH', 'Horas', 'h', 0, 16, 1) + stepRow('tsGM', 'Minutos', 'min', 0, 45, 15);
  $('cTGoal').innerHTML = stepRow('cTgH', 'Horas', 'h', 0, 16, 1) + stepRow('cTgM', 'Minutos', 'min', 0, 45, 15);
  const setTGoal = m => { setPref('tgoal', Math.max(0, Math.min(960, Math.round(m)))); drawTStats(); if (view === 'estatisticas') drawStudy(); };
  STP.tsGH = STP.cTgH = v => setTGoal(v * 60 + prefs.tgoal % 60);
  STP.tsGM = STP.cTgM = v => setTGoal(Math.floor(prefs.tgoal / 60) * 60 + v);
  function drawTGoal() {
    if (!$('tsGH')) return;
    for (const [h, m] of [['tsGH', 'tsGM'], ['cTgH', 'cTgM']]) { setStp(h, Math.floor(prefs.tgoal / 60)); setStp(m, prefs.tgoal % 60); }
    $('tsGoalBtn').textContent = $('tsGoalEd').hidden ? (prefs.tgoal ? 'mudar a meta' : 'definir meta') : 'fechar';
  }
  // dias seguidos com a meta cumprida (sem meta, com pelo menos 1 min de estudo); hoje só entra quando já cumpriu
  function tStreak() {
    const need = tGoal() || 60000, d = new Date(); d.setHours(12, 0, 0, 0);
    const met = () => tdLive(dayKey(d)).e >= need;
    let s = 0;
    if (!met()) d.setDate(d.getDate() - 1);
    while (s < 400 && met()) { s++; d.setDate(d.getDate() - 1); }
    return s;
  }
  // estatística simples na página Tempo: hoje e a meta, a semana, a média, os dias seguidos e os últimos 7 dias
  function drawTStats() {
    if (view !== 'tempo') return;
    tsAt = Date.now();
    const g = tGoal(), ks = Array.from({ length: 7 }, (_, i) => dAgo(6 - i)), rs = ks.map(tdLive), td = rs[6], wk = studyWeek(), s = tStreak(), done = g && td.e >= g;
    $('tsToday').textContent = fmtStudy(td.e); $('tsOf').textContent = g ? `de ${fmtStudy(g)}` : '';
    $('tsBar').hidden = !g; $('tsFill').style.width = `calc(${Math.min(100, g ? 100 * td.e / g : 0)}% - 2px)`;
    $('tsBox').classList.toggle('done', !!done);
    $('tsSub').innerHTML = !g ? 'Sem meta de tempo por dia: escolha uma em DEFINIR META.'
      : done ? `<span class="gfox">${FOX}</span><b>meta do dia cumprida</b>${td.e - g >= 60000 ? ` · ${fmtStudy(td.e - g)} a mais` : ''}` : `faltam <b>${fmtStudy(g - td.e)}</b> para a meta`;
    const cell = (k, v, d) => `<div><span>${k}</span><b>${v}</b><em>${d}</em></div>`, wd = weekDays().filter(k => tdLive(k).e >= (g || 60000)).length;
    $('tsSum').innerHTML = cell('esta semana', fmtStudy(wk.e), `${wd} de 7 dias${g ? ' na meta' : ''}`)
      + cell('média por dia', fmtStudy(rs.reduce((a, r) => a + r.e, 0) / 7), 'nos últimos 7 dias')
      + cell('dias seguidos', s, g ? `na meta de ${fmtStudy(g)}` : 'com estudo');
    const top = Math.max(g, ...rs.map(r => r.e)) || 1;
    $('tsWk').setAttribute('aria-label', `Últimos 7 dias: ${rs.map((r, i) => `${dName(ks[i], true)} ${fmtStudy(r.e)}`).join(', ')}`);
    $('tsWk').innerHTML = `<div class="w7b">${g ? `<b class="sgl" style="bottom:${(g / top * 100).toFixed(1)}%"></b>` : ''}`
      + rs.map((r, i) => `<div class="sb${i === 6 ? ' td' : ''}" title="${dName(ks[i], true)} · ${fmtStudy(r.e)}"><i style="height:${(r.e / top * 100).toFixed(1)}%"></i></div>`).join('')
      + `</div><div class="w7x">${ks.map((k, i) => `<span>${i === 6 ? 'hoje' : WD[new Date(k + 'T12:00').getDay()]}</span>`).join('')}</div>`;
    drawTGoal();
  }
  $('tsGoalBtn').addEventListener('click', () => {
    const on = $('tsGoalEd').hidden; $('tsGoalEd').hidden = !on; $('tsGoalBtn').setAttribute('aria-expanded', on); drawTGoal();
    if (on) $('tsGH').querySelector('input').focus();
  });
  $('tsMore').addEventListener('click', () => { go('estatisticas'); $('stBox').scrollIntoView({ block: 'start' }); });
  function drawTimeCfg() {
    const [h, m, s] = hms(), lock = tm.t.run;
    setStp('stH', h, lock); setStp('stM', m, lock); setStp('stS', s, lock);
    for (const [id, k] of [['stFoco', 'foco'], ['stCurta', 'curta'], ['stLonga', 'longa'], ['stCiclos', 'ciclos']]) setStp(id, tp[k]);
    $('tmPre').querySelectorAll('button').forEach(b => { b.setAttribute('aria-pressed', +b.dataset.m * 60000 === tp.dur); b.disabled = lock; });
    $('tmPreBd').classList.toggle('dis', lock);
    $('tmDur').textContent = lock ? 'pause para mudar' : fmtDur(tp.dur);
    for (const [id, k] of [['tmAutoP', 'autoP'], ['tmAutoF', 'autoF'], ['tmNoise', 'noise'], ['tmTick', 'tick'], ['tmVib', 'vib']]) $(id).setAttribute('aria-pressed', !!tp[k]);
    $('tmVib').hidden = !navigator.vibrate;
    segOn('tmSnd', tp.snd); segOn('tmRep', tp.rep);
    if (document.activeElement !== $('tmVol')) $('tmVol').value = tp.vol;
    $('tmVolOut').textContent = tp.vol + '%';
    const d = tdLive(dayKey());
    $('tmToday').textContent = d.nf ? `hoje: ${d.nf} ${d.nf === 1 ? 'foco' : 'focos'} · ${fmtStudy(d.foco)}` : 'hoje: nenhum foco';
  }
  // a meta dos relógios: a da sessão rodando nesta aba, ou a que vale para as próximas
  function tmGoalPaint() {
    if (view !== 'tempo') return;
    const ss = tm.ss[tm.tab], sel = ss.a ? ss.g : tm.g, ks = goalKs(sel);
    $('tmGoal').hidden = !ks; $('tmGoalKs').innerHTML = ks;
  }
  $('tmGoalKs').addEventListener('click', e => {
    const b = e.target.closest('[data-g]'); if (!b) return;
    const ss = tm.ss[tm.tab], cur = ss.a ? ss.g : tm.g;
    tm.g = cur === b.dataset.g ? '' : b.dataset.g; if (ss.a) ss.g = tm.g;
    tmSave(); tmGoalPaint();
  });
  function drawTime() {
    segOn('tmTabs', tm.tab);
    $('tmPreBox').hidden = tm.tab !== 'timer'; $('tmPomoBox').hidden = tm.tab !== 'pomo';
    drawPins(); drawTimeCfg(); tmLapsDraw(); drawTStats(); drawTn(); tmPaint(); tmGoalPaint();
  }
  $('tmNote').addEventListener('click', () => tnAsk({ w: tm.tab }, true));
  $('tmTabs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; tm.tab = b.dataset.v; tmSave(); drawTime(); tmLoop(); });
  $('tmPre').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setDur(+b.dataset.m * 60000); });
  for (const [id, k] of [['tmAutoP', 'autoP'], ['tmAutoF', 'autoF'], ['tmNoise', 'noise'], ['tmTick', 'tick'], ['tmVib', 'vib']]) $(id).addEventListener('click', () => {
    tp[k] = !tp[k]; tpSave(); drawTimeCfg();
    if (k === 'tick') { tmArm('timer'); tmArm('pomo'); }
    if (k === 'noise' && tp.noise) tmNoise();
  });
  const tmSeg = (id, k, num) => $(id).addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    tp[k] = num ? +b.dataset.v : b.dataset.v; tpSave(); drawTimeCfg(); tmArm('timer'); tmArm('pomo');
  });
  tmSeg('tmSnd', 'snd'); tmSeg('tmRep', 'rep', true);
  $('tmVol').addEventListener('input', e => {
    tp.vol = +e.target.value; tpSave(); $('tmVolOut').textContent = tp.vol + '%';
    for (const s of [sched.timer, sched.pomo, ringing, testS]) if (s) s.bus.gain.value = tmVolume();
  });
  $('tmTest').addEventListener('click', () => { tmStop(testS); testS = tmPlay(Date.now() + 60, { reps: 1 }); });

  drawPins(); nzUI();
  for (const w of ['timer', 'pomo']) if ((w === 'timer' ? tm.t : tm.p).run) tmArm(w);

  // ---------- marcar para estudar depois ----------
  const isMarked = () => cur && marked.some(m => m.id === qid(cur));
  function syncMark() {
    const on = isMarked();
    $('mark').setAttribute('aria-pressed', on);
    $('icoMark').innerHTML = on ? MARK1 : MARK0;
    $('markTxt').textContent = on ? 'MARCADA' : 'MARCAR';
    if (on) $('mark').classList.remove('hint');
    $('mCount').textContent = marked.length || '';
  }
  function toggleMark() {
    if (!cur) return;
    const id = qid(cur);
    if (isMarked()) marked = marked.filter(m => m.id !== id);
    // da Unicamp, guarda só a referência: o texto e a figura voltam do banco (assim a conta não pesa)
    else if (cur.uid) marked.unshift({ id, uid: cur.uid, key: cur.key, L: cur.L, r: cur.r, t: Date.now() });
    else marked.unshift({ id, key: cur.key, L: cur.L, r: cur.r, ctx: cur.ctx || '', q: cur.q || '', opts: cur.opts, a: cur.a, u: cur.u || '', tol: cur.tol || 0, h: cur.h || '', tip: cur.t || '', tk: cur.tk || '', lg: cur.lg || '', t: Date.now() });
    save('marked', marked); syncMark(); holdOn();
  }
  $('mark').addEventListener('click', toggleMark);

  const fmtDate = t => new Date(t).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  function drawMarked() {
    const list = $('mList');
    if (!marked.length) { list.innerHTML = `<p class="empty"><span class="fox">${FOX}</span>Nada marcado ainda. No treino, toque em MARCAR numa questão que você errou ou não sabe e ela aparece aqui.</p>`; return; }
    list.innerHTML = marked.map((m, i) => {
      if (m.uid) {
        const it = BID.get(m.uid), name = GEN[m.key] ? GEN[m.key].name : m.key;
        const head = `<section class="box mq" data-i="${i}"><div class="hd"><span>${name} · ${LNAME[band(m.r)]} ${m.r}</span><span>${fmtDate(m.t)}</span></div><div class="bd">`;
        const acts = (more) => `<div class="acts">${more}<button type="button" data-a="tirar">tirar da lista</button></div></div></section>`;
        if (!it) return head + `<p class="ctx">${BANK ? 'Esta questão não está mais no banco.' : 'Carregando a questão…'}</p>` + acts('');
        const q = bankQ(it, true), ansTxt = Array.isArray(q.opts) ? q.opts[q.a] : (q.tol ? '≈ ' : '') + f(q.a) + (q.u ? ' ' + q.u : '');
        return head + (q.fig ? `<div class="fig">${q.fig}</div>` : '') + `<p class="ctx">${q.ctx}</p>`
          + (Array.isArray(q.opts) ? `<ol>${q.opts.map((o, j) => `<li data-j="${j}"><span class="n">${j + 1}</span><span>${o}</span></li>`).join('')}</ol>` : '')
          + `<div class="sol" hidden><p><b>${ansTxt}</b></p>${q.h}</div>`
          + acts(`<button type="button" data-a="ver">ver a resposta</button><button type="button" data-a="refazer">refazer no treino</button>`);
      }
      const name = GEN[m.key] ? GEN[m.key].name : m.key;
      const ansTxt = Array.isArray(m.opts) ? m.opts[m.a] : (m.tol ? '≈ ' : '') + f(m.a) + (m.u ? ' ' + m.u : '');
      const lv = Number.isFinite(m.r) ? `${LNAME[band(m.r)]} ${m.r}` : LNAME[m.L] || '';
      return `<section class="box mq" data-i="${i}"><div class="hd"><span>${GEN[m.key] && GEN[m.key].form ? 'Teoria · ' : ''}${name} · ${lv}</span><span>${fmtDate(m.t)}</span></div><div class="bd">`
        + (m.ctx ? `<p class="ctx">${m.ctx}</p>` : '') + (m.q ? `<div class="expr${lowFont(m.key, m.q) ? ' f' : ''}">${m.q}</div>` : '')
        + (Array.isArray(m.opts) ? `<ol>${m.opts.map((o, j) => `<li data-j="${j}"><span class="n">${j + 1}</span><span>${o}</span></li>`).join('')}</ol>` : '')
        + (m.lg ? `<p class="lg"><span class="lt">termos</span> ${m.lg}</p>` : '')
        + `<p class="sol" hidden><b>${ansTxt}</b>${m.h ? ' ' + m.h : ''}</p>`
        + `<div class="acts"><button type="button" data-a="ver">ver a resposta</button><button type="button" data-a="refazer">refazer no treino</button><a href="${TIPS_URL}#${tipKey(m.key)}" target="_blank" rel="noopener">dicas ↗</a><button type="button" data-a="tirar">tirar da lista</button></div></div></section>`;
    }).join('');
  }
  $('mList').addEventListener('click', e => {
    const b = e.target.closest('button[data-a]'); if (!b) return;
    const box = b.closest('.mq'), m = marked[+box.dataset.i];
    if (b.dataset.a === 'ver') {
      const sol = box.querySelector('.sol'), open = sol.hidden;
      sol.hidden = !open; b.textContent = open ? 'esconder a resposta' : 'ver a resposta';
      const li = box.querySelector(`li[data-j="${m.a}"]`); if (li) li.classList.toggle('right', open);
    } else if (b.dataset.a === 'tirar') {
      marked.splice(+box.dataset.i, 1); save('marked', marked); drawMarked(); syncMark();
    } else if (b.dataset.a === 'refazer' && m.uid && BID.has(m.uid)) {
      mode = 'exercicios'; save('mode', mode);
      go(mode, false);
      const it = BID.get(m.uid); show(bankQ(it), it.t, band(it.r), it.r);
      scrollTo({ top: 0 });
    } else if (b.dataset.a === 'refazer' && GEN[m.key]) {
      mode = GEN[m.key].form ? 'teoria' : 'exercicios'; save('mode', mode);
      go(mode, false);
      show({ ctx: m.ctx, q: m.q, opts: m.opts, a: m.a, u: m.u, tol: m.tol || 0, h: m.h, t: m.tip, tk: m.tk, lg: m.lg }, m.key, m.L || 0, m.r);
      scrollTo({ top: 0 });
    }
  });
  $('mClear').addEventListener('click', () => {
    if (!marked.length || !confirm('Apagar todas as questões marcadas?')) return;
    marked = []; save('marked', marked); drawMarked(); syncMark();
  });

  // ---------- metas: cada meta é uma página da pessoa, escrita em markdown ----------
  const GK = ['vestibular', 'faculdade', 'curso', 'música', 'idioma', 'leitura', 'concurso'];
  let glPg = null, glQi = null, glMode = 'ver';
  const gid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const gSave = g => { if (g) { g.u = Date.now(); g.y = mdWhy(g.md).slice(0, 600); } save('metas', metas); };
  const mkEl = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const gDue = d => { const n = Math.round((new Date(d + 'T12:00') - new Date(dayKey() + 'T12:00')) / 864e5);
    return n > 1 ? `faltam ${n} dias` : n === 1 ? 'falta 1 dia' : n === 0 ? 'é hoje' : `passou há ${-n} ${n === -1 ? 'dia' : 'dias'}`; };
  // markdown pequeno e seguro: o texto é escapado antes, e só links http(s) viram links
  const mdInline = t => esc(t)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^*\w])\*([^*\s](?:[^*]*[^*\s])?)\*/g, '$1<i>$2</i>')
    .replace(/(^|[^\w])_([^_\s](?:[^_]*[^_\s])?)_/g, '$1<i>$2</i>')
    .replace(/~~([^~]+)~~/g, '<s>$1</s>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  function mdHtml(src, live) {
    const L = String(src || '').replace(/\r/g, '').split('\n'), out = [];
    let para = [], list = null, quote = [];
    const flushP = () => { if (para.length) out.push(`<p>${para.map(mdInline).join('<br>')}</p>`); para = []; };
    const flushL = () => { if (list) out.push(`</${list}>`); list = null; };
    const flushQ = () => { if (quote.length) out.push(`<blockquote>${quote.map(mdInline).join('<br>')}</blockquote>`); quote = []; };
    const flush = () => { flushP(); flushL(); flushQ(); };
    L.forEach((ln, i) => {
      let m;
      if (!ln.trim()) return flush();
      if ((m = /^(#{1,3})\s+(.*)$/.exec(ln))) { flush(); const h = m[1].length + 1; return out.push(`<h${h}>${mdInline(m[2])}</h${h}>`); }
      if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(ln)) { flush(); return out.push('<hr>'); }
      if ((m = /^>\s?(.*)$/.exec(ln))) { flushP(); flushL(); return quote.push(m[1]); }
      flushQ();
      const task = /^\s*[-*+]\s+\[( |x|X)\]\s?(.*)$/.exec(ln), ul = !task && /^\s*[-*+]\s+(.*)$/.exec(ln), ol = !task && !ul && /^\s*\d+[.)]\s+(.*)$/.exec(ln);
      if (task || ul || ol) {
        flushP(); const kind = ol ? 'ol' : 'ul';
        if (list !== kind) { flushL(); list = kind; out.push(`<${kind}${task ? ' class="tk"' : ''}>`); }
        if (task) { const on = task[1] !== ' '; return out.push(`<li class="tk${on ? ' on' : ''}"><button type="button" class="gtk" data-ln="${i}" aria-pressed="${on}"${live ? '' : ' disabled'} aria-label="${on ? 'Desmarcar' : 'Marcar'}: ${esc(task[2])}"></button><span>${mdInline(task[2])}</span></li>`); }
        return out.push(`<li>${mdInline((ul || ol)[1])}</li>`);
      }
      flushL(); para.push(ln.trim());
    });
    flush();
    return out.join('');
  }
  // o motivo da meta: a primeira citação (> …) da página; sem citação, o primeiro parágrafo
  function mdWhy(md) {
    const L = String(md || '').split('\n'), q = [];
    for (const ln of L) { const m = /^>\s?(.*)$/.exec(ln); if (m) q.push(m[1]); else if (q.length) break; }
    if (q.length) return q.join('\n').trim();
    const p = L.find(ln => ln.trim() && !/^\s*(#|[-*+]\s|\d+[.)]\s|>|---)/.test(ln));
    return (p || '').trim();
  }
  const mdPlain = t => String(t || '').replace(/^\s*(#{1,3}|>|[-*+](\s+\[[ xX]\])?|\d+[.)])\s*/gm, '').replace(/[*_~`]/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' ').trim();
  const gTasks = md => { const t = String(md || '').match(/^\s*[-*+]\s+\[( |x|X)\]/gm) || []; return { n: t.length, ok: t.filter(x => /x/i.test(x)).length }; };
  // o lembrete do topo: um motivo por dia, entre as metas em andamento
  function drawWhy() {
    const rs = metas.filter(g => g.st === 'on' && mdWhy(g.md));
    $('glWhy').hidden = !rs.length; if (!rs.length) return;
    if (glQi == null) { glQi = 0; for (const ch of dayKey()) glQi = (glQi * 31 + ch.charCodeAt(0)) % 9973; }
    const g = rs[glQi % rs.length];
    $('glQ').textContent = mdPlain(mdWhy(g.md));
    $('glQm').textContent = `${gName(g)}${g.d ? ' · ' + gDue(g.d) : ''}`;
    $('glNext').hidden = rs.length < 2;
  }
  // uma linha por página na lista, como num caderno
  function gRow(g) {
    const b = mkEl('button', 'gpi' + (g.st !== 'on' ? ' ' + g.st : '')); b.type = 'button'; b.dataset.id = g.id;
    const ic = mkEl('span', 'gpic'); ic.innerHTML = g.st === 'feita' ? FOX : NI.flag;
    const tx = mkEl('span', 'gptx'), t = mkEl('b', '', gName(g)), mt = metaTime(g.id), tk = gTasks(g.md);
    const meta = [g.k, g.st === 'feita' && g.at ? `conquistada em ${new Date(g.at).toLocaleDateString('pt-BR')}` : g.d ? gDue(g.d) : '', tk.n ? `${tk.ok} de ${tk.n} tarefas` : '', mt.t >= 60000 ? `${fmtStudy(mt.t)} em 30 dias` : ''].filter(Boolean).join(' · ');
    tx.append(t);
    if (meta) tx.append(mkEl('span', 'gpm', meta));
    const sn = mdPlain(g.md); if (sn) tx.append(mkEl('span', 'gpsn', sn.length > 140 ? sn.slice(0, 139) + '…' : sn));
    b.append(ic, tx, mkEl('span', 'gpgo', '›'));
    return b;
  }
  // tempo dedicado a uma meta nos últimos 30 dias: blocos que contaram e sessões dos relógios ligadas a ela (sem contar duas vezes)
  function metaTime(id) {
    const now = Date.now(), cut = now - 30 * DAY, bl = cal.filter(b => b.m === id && bSt(b) === 'ok' && bB(b) >= cut);
    let t = bl.reduce((a, b) => a + b.v, 0);
    for (const x of tmLog) if (x.g === id && x.b >= cut && !bl.some(b => x.a < bB(b) && x.b > bA(b))) t += x.ms;
    const nx = cal.filter(b => b.m === id && !b.st && bA(b) > now).sort((a, b) => bA(a) - bA(b))[0];
    return { t, nx };
  }
  function drawGoals() {
    if (view !== 'metas') return;
    const g = glPg && metas.find(x => x.id === glPg); if (!g) glPg = null;
    $('glHome').hidden = !!g; $('glPage').hidden = !g;
    if (g) return drawPage(g);
    const on = metas.filter(g => g.st === 'on'), pa = metas.filter(g => g.st === 'pausa'), fe = metas.filter(g => g.st === 'feita').sort((a, b) => b.at - a.at);
    drawWhy();
    $('glEmpty').hidden = metas.length > 0;
    if (on.length || !metas.length) $('glList').replaceChildren(...on.map(gRow));
    else $('glList').replaceChildren(mkEl('p', 'note gnone', 'Nenhuma meta em andamento agora. Retome uma pausada ou crie uma nova.'));
    $('glPaused').hidden = !pa.length; $('glPausedN').textContent = pa.length; $('glPausedL').replaceChildren(...pa.map(gRow));
    $('glDone').hidden = !fe.length; $('glDoneN').textContent = fe.length; $('glDoneL').replaceChildren(...fe.map(gRow));
  }
  const gpGrow = () => { const t = $('gpEd'); t.style.height = 'auto'; t.style.height = Math.max(220, t.scrollHeight + 2) + 'px'; };
  function drawPage(g) {
    const a = document.activeElement;
    if (a !== $('gpT')) $('gpT').value = g.t;
    if (a !== $('gpK')) $('gpK').value = g.k;
    if (a !== $('gpD')) $('gpD').value = g.d;
    $('gpKs').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === g.k.toLowerCase()));
    $('gpDue').textContent = g.d && g.st !== 'feita' ? gDue(g.d) : '';
    $('gpFox').hidden = g.st !== 'feita'; $('gpFox').innerHTML = FOX;
    segOn('gpSt', g.st); segOn('gpMode', glMode);
    const mt = metaTime(g.id), p = $('gpTm'); p.textContent = '';
    p.append(mt.t >= 60000 ? `${fmtStudy(mt.t)} dedicados nos últimos 30 dias` : 'Nada ainda nos últimos 30 dias');
    const lk = (txt, act, id) => { const x = mkEl('button', 'lnk', txt); x.type = 'button'; x.dataset.a = act; if (id) x.dataset.b = id; p.append(' · ', x); };
    if (mt.nx) lk(`próximo bloco: ${dName(mt.nx.d, true)}, ${hm(mt.nx.s)}`, 'cal', mt.nx.id);
    else if (g.st === 'on') lk('+ planejar um bloco', 'plan');
    const w = glMode === 'escrever';
    $('gpEd').hidden = !w; $('gpView').hidden = w;
    if (w) { if (a !== $('gpEd')) $('gpEd').value = g.md; gpGrow(); }
    else $('gpView').innerHTML = g.md.trim() ? mdHtml(g.md, true) : '<p class="gmd0">Página em branco. Toque em ESCREVER para contar por que essa meta importa, o plano e o que mais quiser.</p>';
  }
  const gName = g => g.t.trim() || 'Sem título';
  let gpSvT;
  const gpSaved = () => { $('gpSaved').textContent = 'salvo'; clearTimeout(gpSvT); gpSvT = setTimeout(() => { $('gpSaved').textContent = ''; }, 1500); };
  const curG = () => glPg && metas.find(x => x.id === glPg);
  function glMsgShow(txt, undo, fox) {
    const m = $('glMsg'); m.hidden = false; m.textContent = '';
    if (fox) { const f = mkEl('span', 'gfox'); f.innerHTML = FOX; m.append(f); }
    m.append(txt);
    if (undo) { const b = mkEl('button', 'undo', 'desfazer'); b.type = 'button'; b.onclick = () => { undo(); m.hidden = true; }; m.append(' ', b); }
  }
  function glOpen(id, write) {
    glPg = id; glMode = write ? 'escrever' : 'ver'; $('glMsg').hidden = true;
    drawGoals(); scrollTo({ top: 0 });
  }
  // voltar para a lista; uma página nova que ficou vazia não é guardada
  function glBack() {
    const g = curG();
    if (g && !g.t.trim() && !g.md.trim()) { metas.splice(metas.indexOf(g), 1); gSave(); }
    glPg = null; drawGoals();
  }
  function glNew(k) {
    const g = { id: gid(), t: '', k: k || '', y: '', md: '', d: '', st: 'on', at: 0, c: Date.now(), u: 0, s: [] };
    metas.push(g); glOpen(g.id, true);
    $('gpT').focus();
  }
  $('gpKs').innerHTML = GK.map(k => `<button type="button" data-k="${k}">${k}</button>`).join('');
  $('glEmptyKs').innerHTML = ['vestibular', 'faculdade', 'curso', 'leitura'].map(k => `<button type="button" data-k="${k}">${k}</button>`).join('') + '<button type="button" data-k="">outra</button>';
  $('glEmptyKs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) glNew(b.dataset.k); });
  $('glNew').addEventListener('click', () => glNew());
  $('glNext').addEventListener('click', () => { glQi++; drawWhy(); });
  $('glHome').addEventListener('click', e => { const b = e.target.closest('.gpi'); if (b) glOpen(b.dataset.id); });
  $('gpBack').addEventListener('click', glBack);
  $('gpEd').placeholder = '> Por que isso importa para mim: …\n\n## Plano\n- [ ] o menor passo que dá para dar esta semana\n\nEscreva do jeito que quiser. A primeira citação (a linha que começa com >) aparece no topo da página Metas nos dias difíceis.';
  $('gpT').addEventListener('input', () => { const g = curG(); if (!g) return; g.t = $('gpT').value.slice(0, 80); gSave(g); gpSaved(); });
  $('gpT').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); glMode = 'escrever'; drawGoals(); $('gpEd').focus(); } });
  $('gpK').addEventListener('input', () => { const g = curG(); if (!g) return; g.k = $('gpK').value.trim().slice(0, 30); gSave(g); drawPage(g); gpSaved(); });
  $('gpKs').addEventListener('click', e => { const b = e.target.closest('button'), g = curG(); if (!b || !g) return; g.k = g.k.toLowerCase() === b.dataset.k ? '' : b.dataset.k; gSave(g); drawPage(g); gpSaved(); });
  $('gpD').addEventListener('change', () => { const g = curG(); if (!g) return; g.d = /^\d{4}-\d\d-\d\d$/.test($('gpD').value) ? $('gpD').value : ''; gSave(g); drawPage(g); gpSaved(); });
  $('gpEd').addEventListener('input', () => { const g = curG(); if (!g) return; g.md = $('gpEd').value.slice(0, 20000); gSave(g); gpGrow(); gpSaved(); });
  $('gpMode').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; glMode = b.dataset.v; drawGoals(); if (glMode === 'escrever') $('gpEd').focus({ preventScroll: true }); });
  // tocar numa tarefa no modo ver marca ou desmarca a linha dela no markdown
  $('gpView').addEventListener('click', e => {
    const b = e.target.closest('.gtk'), g = curG(); if (!b || !g) return;
    const L = g.md.split('\n'), i = +b.dataset.ln; if (!L[i]) return;
    L[i] = L[i].replace(/\[( |x|X)\]/, m => m === '[ ]' ? '[x]' : '[ ]');
    g.md = L.join('\n'); gSave(g); drawPage(g); gpSaved();
    const nb = $('gpView').querySelector(`.gtk[data-ln="${i}"]`); if (nb) nb.focus({ preventScroll: true });
  });
  $('gpSt').addEventListener('click', e => {
    const b = e.target.closest('button'), g = curG(); if (!b || !g || b.dataset.v === g.st) return;
    const was = g.st, at = g.at;
    g.st = b.dataset.v; g.at = g.st === 'feita' ? Date.now() : 0; gSave(g); drawPage(g);
    if (g.st === 'feita') { glBack(); glMsgShow(`Conquista guardada: ${gName(g)}. Parabéns! Ela fica em Conquistas, mais abaixo.`, () => { g.st = was; g.at = at; gSave(g); drawGoals(); }, true); }
    else gpSaved();
  });
  $('gpDel').addEventListener('click', () => {
    const g = curG(); if (!g) return;
    const i = metas.indexOf(g); metas.splice(i, 1); gSave(); glPg = null; drawGoals();
    glMsgShow(`“${gName(g)}” apagada.`, () => { metas.splice(Math.min(i, metas.length), 0, g); gSave(g); drawGoals(); });
  });
  $('gpTm').addEventListener('click', e => {
    const b = e.target.closest('[data-a]'), g = curG(); if (!b || !g) return;
    if (b.dataset.a === 'cal') { const x = cal.find(y => y.id === b.dataset.b); if (!x) return; calRef = x.d; go('calendario'); scrollTo({ top: 0 }); return calOpen(x.id); }
    if (b.dataset.a === 'plan') { calRef = dayKey(); go('calendario'); scrollTo({ top: 0 }); calNew(); cfG = g.id; return cfGPaint(); }
  });

  // ---------- calendário: blocos de estudo planejados e todo o tempo medido, no horário em que aconteceu ----------
  // bloco: { id, d: dia, s e e: minutos desde a meia-noite, t: o que estudar, g: série que se repete, st: '' planejado | ok confirmado | no não rolou,
  //          v: tempo útil confirmado (ms), x: registro à mão que a confirmação criou, m: meta ligada,
  //          a: 1 contou sozinho | 2 a pessoa já mexeu (não conta sozinho de novo), u }
  const fixCal = a => (Array.isArray(a) ? a : []).filter(b => b && typeof b.id === 'string' && /^\d{4}-\d\d-\d\d$/.test(b.d) && +b.s >= 0 && +b.e > +b.s && +b.e <= 1440)
    .map(b => ({ id: b.id.slice(0, 24), d: b.d, s: Math.round(+b.s), e: Math.round(+b.e), t: String(b.t || '').slice(0, 40), g: typeof b.g === 'string' ? b.g.slice(0, 24) : '',
      st: ['ok', 'no'].includes(b.st) ? b.st : '', v: Math.max(0, Math.round(+b.v) || 0), x: typeof b.x === 'string' ? b.x.slice(0, 24) : '', m: typeof b.m === 'string' ? b.m.slice(0, 24) : '', a: [1, 2].includes(+b.a) ? +b.a : 0, u: +b.u || 0 })).slice(-3000);
  let cal = fixCal(load('cal', [])), calRef = dayKey(), calMode = load('calMode', ''), cc = null, cvMs = 0;
  // repetição de um bloco novo: no = não, d = todo dia, w = toda semana no mesmo dia, x = alguns dias da semana; até a data cfU
  let cfR = 'no', cfW = new Set(), cfU = '', cfG = '';
  if (!['dia', 'semana'].includes(calMode)) calMode = '';
  function calSave(b) { if (b) b.u = Date.now(); const x = new Date(); x.setDate(x.getDate() - 400); const cut = dayKey(x); cal = cal.filter(y => y.d >= cut); save('cal', cal); }
  const dAt = (d, m) => { const x = new Date(d + 'T00:00'); x.setMinutes(m); return +x; };
  const bA = b => dAt(b.d, b.s), bB = b => dAt(b.d, b.e);
  const hm = m => `${two(Math.floor(m / 60))}:${two(m % 60)}`;
  const bTitle = b => b.t || 'estudo';
  const bDur = b => (b.e - b.s) * 60000;
  const shiftDay = (k, n) => { const x = new Date(k + 'T12:00'); x.setDate(x.getDate() + n); return dayKey(x); };
  // confirmado só enquanto o registro à mão que ele criou existir (ele pode ser apagado nas estatísticas)
  const bSt = b => b.st === 'ok' && b.x && !tmMan.some(m => m.id === b.x) ? '' : b.st;
  // quanto o Faro mediu entre a e b, em ms
  function measured(a, b) {
    let t = 0;
    for (const x of tlAll()) { const o = Math.min(b, x[1]) - Math.max(a, x[0]); if (o > 0) t += o * x[3] / (x[1] - x[0]); }
    return Math.round(t);
  }
  const pending = () => { const now = Date.now(), cut = dAgo(30); return cal.filter(b => !bSt(b) && b.d >= cut && bB(b) <= now).sort((a, b) => bA(b) - bA(a)); };
  // quem planeja e estuda sem usar os relógios não precisa confirmar: um bloco que passou conta sozinho, inteiro,
  // menos o que o Faro já mediu no horário (e sem passar do que cabe no dia). Dá para ajustar ou dizer que não rolou depois.
  const autoId = b => ('a' + b.id).slice(0, 24);  // o mesmo id em todo aparelho: dois aparelhos não somam o mesmo bloco duas vezes
  function autoCount(b) {
    const dur = bDur(b), meas = Math.min(measured(bA(b), bB(b)), dur);
    const extra = Math.floor(Math.min(Math.max(0, dur - meas), manRoom(b.d)) / 60000) * 60000;
    let x = '';
    if (extra >= 60000) { x = autoId(b); if (!tmMan.some(m => m.id === x)) tmMan.push({ id: x, d: b.d, ms: extra, l: bTitle(b), t: Date.now(), b: b.id }); }
    Object.assign(b, { st: 'ok', v: meas + (x ? extra : 0), x, a: 1 }); b.u = Date.now();
  }
  // -1 (o padrão) conta os blocos que acabaram depois que a contagem sozinha chegou ao Faro; 0 desliga; outro valor, desde aquela hora
  const CAL_AUTO0 = +new Date('2026-11-05T00:00');
  const calAutoFrom = () => prefs.calAuto === -1 ? CAL_AUTO0 : prefs.calAuto;
  function calAutoRun() {
    const from = calAutoFrom(); if (!from) return 0;
    const now = Date.now(); let n = 0;
    for (const b of cal) if (!b.st && !b.a && bB(b) <= now && bB(b) > from) { autoCount(b); n++; }
    if (n) { manSave(); calSave(); drawStudy(); drawTStats(); rkQueue(); hbBadge(); }
    return n;
  }
  // os que já estavam esperando confirmação quando a contagem sozinha começou
  function calCountAll() {
    const pd = pending(); if (!pd.length) return;
    for (const b of pd) { if (b.st === 'ok') unconfirm(b); autoCount(b); }
    manSave(); calChanged();
    calMsg(`${pd.length} ${pd.length === 1 ? 'bloco contado' : 'blocos contados'} como estudo.`, () => { for (const b of pd) { unconfirm(b); b.a = 0; } calChanged(); });
  }
  const calWeek = () => calMode ? calMode === 'semana' : innerWidth >= 600;
  const calDays = () => { if (!calWeek()) return [calRef]; const s = dayKey(weekStart(new Date(calRef + 'T12:00'))); return Array.from({ length: 7 }, (_, i) => shiftDay(s, i)); };
  // blocos que se cruzam dividem a largura da coluna
  function lanes(bl) {
    const m = new Map(); let grp = [], end = -1;
    const flush = () => { const cols = []; for (const b of grp) { let i = cols.findIndex(e => e <= b.s); if (i < 0) { i = cols.length; cols.push(0); } cols[i] = b.e; m.set(b.id, { i, n: 0 }); } for (const b of grp) m.get(b.id).n = cols.length; grp = []; };
    for (const b of bl) { if (b.s >= end) { flush(); end = -1; } grp.push(b); end = Math.max(end, b.e); }
    flush(); return m;
  }
  function calBadge() {
    const n = pending().length;
    $('calNav').textContent = n || '';
    $('tsCal').hidden = !n; $('tsCal').textContent = `${n} ${n === 1 ? 'bloco do calendário' : 'blocos do calendário'} para confirmar ›`;
  }
  function drawCal() {
    if (view !== 'calendario') return;
    calAutoRun();
    const week = calWeek(), ks = calDays(), now = Date.now(), today = dayKey();
    segOn('calMode', week ? 'semana' : 'dia');
    $('calPrev').setAttribute('aria-label', week ? 'Semana anterior' : 'Dia anterior'); $('calNext').setAttribute('aria-label', week ? 'Próxima semana' : 'Próximo dia');
    $('calRange').textContent = week ? `${fmtD(ks[0])} – ${fmtD(ks[6])}` : new Date(calRef + 'T12:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    const strip = $('calDays'); strip.hidden = week;
    if (!week) {
      const s = dayKey(weekStart(new Date(calRef + 'T12:00')));
      strip.innerHTML = Array.from({ length: 7 }, (_, i) => shiftDay(s, i)).map(k => `<button type="button" data-d="${k}" aria-pressed="${k === calRef}"${k === today ? ' class="td"' : ''} aria-label="${dName(k, true)}"><span>${WD[new Date(k + 'T12:00').getDay()]}</span><b>${+k.slice(8)}</b><i${cal.some(b => b.d === k) ? '' : ' hidden'}></i></button>`).join('');
    }
    // o que cai em cada dia: blocos, trechos medidos e o registrado à mão sem horário
    const T = tlAll(), per = ks.map(k => {
      const a0 = dAt(k, 0), a1 = dAt(k, 1440);
      return { k, a0,
        bl: cal.filter(b => b.d === k).sort((x, y) => x.s - y.s || y.e - x.e),
        ms: T.filter(x => x[1] > a0 && x[0] < a1).map(x => { const a = Math.max(x[0], a0), b = Math.min(x[1], a1); return { a, b, k: x[2], ms: x[3] * (b - a) / (x[1] - x[0]), live: !!x[4], A: x[0] }; }),
        man: tmMan.filter(m => m.d === k && (!m.b || !cal.some(b => b.id === m.b))) };
    });
    let lo = 7, hi = 23;
    for (const p of per) {
      for (const b of p.bl) { lo = Math.min(lo, Math.floor(b.s / 60)); hi = Math.max(hi, Math.ceil(b.e / 60)); }
      for (const m of p.ms) { lo = Math.min(lo, Math.floor((m.a - p.a0) / 3600000)); hi = Math.max(hi, Math.ceil((m.b - p.a0) / 3600000)); }
    }
    if (ks.includes(today)) { const h = (now - dAt(today, 0)) / 3600000; lo = Math.min(lo, Math.floor(h)); hi = Math.max(hi, Math.ceil(h + 0.01)); }
    lo = Math.max(0, lo); hi = Math.min(24, hi);
    const HH = week ? 44 : 56, H = (hi - lo) * HH, Y = m => (m - lo * 60) * HH / 60;
    const head = per.map(p => {
      const tot = tdLive(p.k).e, mm = p.man.reduce((a, m) => a + m.ms, 0);
      return `<div class="chd${p.k === today ? ' td' : ''}">`
        + (week ? `<button type="button" class="chn" data-day="${p.k}" aria-label="Ver só ${dName(p.k, true)}"><span>${WD[new Date(p.k + 'T12:00').getDay()]}</span><b>${+p.k.slice(8)}</b></button>` : '<span class="lb">estudo do dia</span>')
        + `<span class="cht" title="estudo do dia">${tot >= 60000 ? fmtRk(tot) : '—'}</span>`
        + (mm ? `<button type="button" class="chm" data-man="${p.k}" title="registrado à mão, sem horário"><i class="pen">${PEN}</i>${fmtRk(mm)}</button>` : '') + '</div>';
    }).join('');
    const gut = Array.from({ length: hi - lo }, (_, i) => `<span style="top:${i * HH}px">${two(lo + i)}h</span>`).join('');
    const cols = per.map(p => {
      let h = '';
      for (const m of p.ms) {
        const t = Y((m.a - p.a0) / 60000), ht = Math.max(3, Y((m.b - p.a0) / 60000) - t), what = m.k === 'q' ? 'questões' : 'relógios';
        h += `<button type="button" class="cm${m.k === 'q' ? ' cq' : ''}${m.live ? ' live' : ''}" style="top:${t.toFixed(1)}px;height:${ht.toFixed(1)}px" data-a="${m.A}" data-k="${m.k}" title="${hhmm(m.a)}–${hhmm(m.b)} · ${what} · ${fmtStudy(m.ms)}" aria-label="Medido pelo Faro: ${what}, ${hhmm(m.a)} às ${hhmm(m.b)}">${week || m.b - m.a < 900000 ? '' : `<span>${fmtRk(m.ms)}</span>`}</button>`;
      }
      const lay = lanes(p.bl);
      for (const b of p.bl) {
        const st = bSt(b), L = lay.get(b.id), t = Y(b.s), ht = Math.max(20, Y(b.e) - t), due = !st && bB(b) <= now, on = !st && bA(b) <= now && now < bB(b);
        const cls = st === 'ok' ? 'ok' : st === 'no' ? 'no' : due ? 'due' : on ? 'on' : '';
        const tag = st === 'ok' ? `${fmtRk(b.v)}${b.a === 1 ? '' : ' útil'}` : st === 'no' ? 'não rolou' : due ? 'falta confirmar' : on ? 'agora' : '';
        const mt = metaT(b.m), sub = week ? (st === 'ok' ? tag : `${hm(b.s)}–${hm(b.e)}`) : `${hm(b.s)}–${hm(b.e)}${tag ? ' · ' + tag : ''}${mt ? ' · ' + mt : ''}`;
        h += `<button type="button" class="cb ${cls}" data-id="${b.id}" style="top:${t.toFixed(1)}px;height:${ht.toFixed(1)}px;--l:${L.i};--n:${L.n}" title="${esc(bTitle(b))} · ${hm(b.s)}–${hm(b.e)}${tag ? ' · ' + tag : ''}${mt ? ' · meta: ' + esc(mt) : ''}"><b>${esc(bTitle(b))}</b><span>${esc(sub)}</span></button>`;
      }
      if (p.k === today) h += `<i class="cnow" style="top:${Y((now - p.a0) / 60000).toFixed(1)}px" aria-hidden="true"></i>`;
      return `<div class="ccol${p.k === today ? ' td' : ''}${p.k < today ? ' pa' : ''}" data-d="${p.k}" style="height:${H}px">${h}</div>`;
    }).join('');
    $('calGrid').innerHTML = `<div class="cg ${week ? 'wk' : 'dy'}" style="--hh:${HH}px;--nd:${ks.length}" data-lo="${lo}" data-hi="${hi}" data-hh="${HH}"><div class="chr"><span></span>${head}</div><div class="cbody"><div class="cgut" style="height:${H}px">${gut}</div>${cols}</div></div>`;
    // para confirmar
    const pd = pending();
    $('calPend').hidden = !pd.length; $('calPendN').textContent = pd.length;
    $('calPendAll').hidden = pd.length < 2 && !calAutoFrom(); $('calPendAll').textContent = pd.length > 1 ? `contar os ${pd.length} como estudados` : 'contar como estudado';
    $('calPendTxt').textContent = calAutoFrom() ? 'Esses blocos passaram antes de a contagem sozinha começar. Conte todos de uma vez, ou toque num para dizer quanto foi estudo.' : 'Esses blocos já passaram. Diga quanto deles foi estudo de verdade para somar ao seu tempo, ou marque que não rolou.';
    segOn('calAuto', calAutoFrom() ? 'on' : 'off');
    $('calAutoTxt').textContent = calAutoFrom() ? 'Quando um bloco acaba, ele entra inteiro no seu tempo de estudo (o que o Faro já mediu no horário não conta duas vezes). Se não foi bem assim, toque no bloco para ajustar ou dizer que não estudou.' : 'Um bloco só vira tempo de estudo quando você confirma quanto dele foi útil.';
    $('calPendL').innerHTML = pd.slice(0, 6).map(b => `<li><button type="button" class="cpi" data-id="${b.id}"><span class="w">${dName(b.d, true)} · ${hm(b.s)}–${hm(b.e)}</span><b>${esc(bTitle(b))}</b><span class="go">confirmar ›</span></button></li>`).join('')
      + (pd.length > 6 ? `<li class="m0">e mais ${pd.length - 6}, mais antigos</li>` : '');
    calBadge();
  }
  function calMsg(txt, undo) {
    const m = $('calMsg'); m.hidden = false; m.textContent = txt;
    if (!undo) return;
    const b = mkEl('button', 'undo', 'desfazer'); b.type = 'button'; b.onclick = () => { undo(); m.hidden = true; }; m.append(' ', b);
  }
  // o cartão do calendário: formulário do bloco, detalhes com a confirmação, ou o que o Faro mediu
  const CC = $('calCard');
  function ccShow(form, hd, ctx) {
    tnClose();
    $('ccHd').textContent = hd; $('ccCtx').textContent = ctx || ''; $('ccCtx').hidden = !ctx;
    $('calForm').hidden = !form; $('calView').hidden = form; CC.hidden = false;
  }
  function calClose() { if (CC.hidden) return; CC.hidden = true; cc = null; }
  const toMin = v => { const m = /^(\d\d):(\d\d)/.exec(v || ''); return m ? +m[1] * 60 + +m[2] : NaN; };
  function cfRead() {
    const d = $('cfD').value, s = toMin($('cfS').value); let e = toMin($('cfE').value);
    if (e === 0 && s > 0) e = 1440;
    const err = !/^\d{4}-\d\d-\d\d$/.test(d) ? 'Escolha o dia.' : !Number.isFinite(s) || !Number.isFinite(e) ? 'Escolha a hora de início e a de fim.'
      : e <= s ? 'O fim precisa ser depois do início (no máximo meia-noite).' : e - s < 10 ? 'O bloco precisa ter pelo menos 10 min.' : '';
    return { d, s, e, err };
  }
  const WDF = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'], WK1 = [1, 2, 3, 4, 5, 6, 0];
  const wdOf = k => new Date(k + 'T12:00').getDay();
  const andList = a => a.length > 1 ? a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1] : a.join('');
  // os dias em que o bloco novo vai existir, do dia escolhido até a data final (no máximo 120 blocos)
  function cfDates(d) {
    if (cfR === 'no' || (cc && cc.id)) return [d];
    const out = [], w0 = wdOf(d);
    for (let k = d; k <= cfU && out.length < 120; k = shiftDay(k, 1)) { const w = wdOf(k); if (cfR === 'd' || (cfR === 'w' ? w === w0 : cfW.has(w))) out.push(k); }
    return out;
  }
  function cfRepErr(d) {
    if (cfR === 'no' || (cc && cc.id)) return '';
    if (!/^\d{4}-\d\d-\d\d$/.test(cfU) || cfU <= d) return 'Escolha até quando repetir: uma data depois do dia do bloco.';
    if (cfU > shiftDay(d, 366)) return 'Dá para repetir por até um ano.';
    if (cfR === 'x' && !cfW.size) return 'Escolha pelo menos um dia da semana.';
    if (!cfDates(d).length) return 'Nenhum dos dias escolhidos cai até essa data.';
    return '';
  }
  function cfHint() {
    const v = cfRead(), h = $('cfHint'), rep = cfR !== 'no' && !(cc && cc.id);
    segOn('cfR', cfR);
    $('cfW').hidden = cfR !== 'x' || !rep; $('cfURow').hidden = !rep;
    $('cfW').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', cfW.has(+b.dataset.d)));
    if (document.activeElement !== $('cfU')) $('cfU').value = cfU;
    const err = v.err || (rep ? cfRepErr(v.d) : '');
    h.classList.toggle('bad', !!err); $('cfSave').disabled = !!err;
    if (err) { h.textContent = err; return; }
    const past = dAt(v.d, v.s) <= Date.now(), ds = cfDates(v.d), w0 = wdOf(v.d);
    const how = cfR === 'd' ? 'todo dia' : cfR === 'w' ? `${w0 === 0 || w0 === 6 ? 'todo' : 'toda'} ${WDF[w0]}` : 'em ' + andList(WK1.filter(w => cfW.has(w)).map(w => WD[w]));
    h.textContent = `${dName(v.d, true)}, ${hm(v.s)}–${hm(v.e)} · ${fmtStudy((v.e - v.s) * 60000)}`
      + (rep ? ` · repete ${how}, até ${fmtD(cfU)}: ${ds.length} ${ds.length === 1 ? 'bloco' : 'blocos'}${ds.length >= 120 ? ' (o máximo)' : ''}` : '')
      + (past && !(cc && cc.id) ? '. Já começou: depois de salvar, diga quanto foi estudo.' : '');
  }
  function calForm(b, p) {
    cc = { form: true, id: b ? b.id : null };
    p = b || p;
    const lock = b && bSt(b) === 'ok';
    $('cfT').value = b ? b.t : ''; $('cfD').value = p.d; $('cfS').value = hm(p.s); $('cfE').value = p.e === 1440 ? '00:00' : hm(p.e);
    for (const id of ['cfD', 'cfS', 'cfE']) $(id).disabled = !!lock;
    cfR = 'no'; cfW = new Set([wdOf(p.d)]); cfU = shiftDay(p.d, 27); $('cfRRow').hidden = !!b; $('cfDel').hidden = !b;
    cfG = b ? b.m : p.m || ''; cfGPaint();
    // títulos recentes: blocos, registros à mão e anotações das sessões
    const seen = new Set(), rec = [], add = t => { t = String(t || '').trim(); const k = t.toLowerCase(); if (t && t.length <= 40 && !seen.has(k) && rec.length < 5) { seen.add(k); rec.push(t); } };
    [...cal].sort((x, y) => y.u - x.u).forEach(x => add(x.t)); [...tmMan].reverse().forEach(x => add(x.l)); [...tmLog].reverse().forEach(x => add(x.n));
    $('cfTs').replaceChildren(...rec.map(t => { const x = mkEl('button', '', t); x.type = 'button'; return x; }));
    ccShow(true, b ? 'Editar bloco' : 'Novo bloco', lock ? 'confirmado: para mudar o dia ou o horário, desfaça a confirmação antes' : '');
    cfHint();
    if (matchMedia('(hover: hover)').matches) $('cfT').focus({ preventScroll: true });
  }
  function calNewAt(d, s) { s = Math.max(0, Math.min(1410, s)); calForm(null, { d, s, e: Math.min(1440, s + 60) }); }
  function calNew() {
    const ks = calDays(), today = dayKey(), d = ks.includes(today) ? today : ks[0];
    const nm = Math.ceil((Date.now() - dAt(today, 0)) / 1800000) * 30;
    calNewAt(d, d === today ? nm : 14 * 60);
  }
  // detalhes de um bloco e a confirmação do tempo útil
  STP.cvH = v => { cvMs = v * 3600000 + Math.floor(cvMs / 60000) % 60 * 60000; cvPaint(); };
  // os minutos passam da hora: de 0 para baixo tira uma hora, de 55 para cima soma uma
  STP.cvM = v => { cvMs = Math.max(0, Math.floor(cvMs / 3600000) * 3600000 + v * 60000); cvPaint(); };
  $('cvDur').innerHTML = stepRow('cvH', 'Horas', 'h', 0, 23, 1) + stepRow('cvM', 'Minutos', 'min', -5, 60, 5);
  // quanto entra no estudo: o útil menos o que o Faro já mediu no horário, sem passar do que cabe no dia
  function cvCalc(b) {
    const now = Date.now(), max = Math.min(bDur(b), now - bA(b)), meas = Math.min(measured(bA(b), Math.min(bB(b), now)), max);
    const extra = Math.max(0, cvMs - meas), room = manRoom(b.d);
    return { max, meas, extra, room, ok: cvMs >= 60000 && cvMs <= max && (extra < 60000 || extra <= room) };
  }
  function cvPaint() {
    const b = cc && cal.find(x => x.id === cc.id); if (!b) return;
    const c = cvCalc(b), h = $('cvHint');
    setStp('cvH', Math.floor(cvMs / 3600000)); setStp('cvM', Math.floor(cvMs / 60000) % 60);
    h.textContent = cvMs < 60000 ? 'Escolha quanto do bloco foi estudo.' : cvMs > c.max ? `O bloco tem ${fmtStudy(c.max)}${bB(b) > Date.now() ? ' até agora' : ''}: o útil não passa disso.`
      : c.extra >= 60000 && c.extra > c.room ? `Não cabe: ${manWhen(b.d)} só sobra ${fmtStudy(c.room)}.`
      : c.meas >= 60000 ? (c.extra >= 60000 ? `${fmtStudy(c.meas)} já foram medidos pelo Faro e contam; vão entrar mais ${fmtStudy(c.extra)}.` : `O Faro já mediu ${fmtStudy(c.meas)} aqui, então não há tempo a somar.`)
      : `Vão entrar ${fmtStudy(c.extra)} no seu estudo de ${manWhen(b.d)}.`;
    h.classList.toggle('bad', !c.ok);
    $('cvOk').disabled = !c.ok;
  }
  const actBtn = (a, txt, pri) => `<button type="button" class="mk${pri ? ' pri' : ''}" data-a="${a}">${txt}</button>`;
  function calOpen(id) {
    const b = cal.find(x => x.id === id); if (!b) return calClose();
    cc = { form: false, id };
    const st = bSt(b), now = Date.now(), started = bA(b) <= now, meas = measured(bA(b), Math.min(bB(b), now));
    ccShow(false, bTitle(b), `${dName(b.d, true)} · ${hm(b.s)}–${hm(b.e)} · ${fmtStudy(bDur(b))}`);
    $('cvSt').textContent = st === 'ok' && b.a === 1 ? `Contou sozinho: ${fmtStudy(b.v)} de estudo${b.v < bDur(b) ? ` (de ${fmtStudy(bDur(b))}; o resto não cabia no dia)` : ''}. Se não foi bem assim, ajuste.`
      : st === 'ok' ? `Confirmado: ${fmtStudy(b.v)} de estudo útil${b.x ? '' : ' (tudo já medido pelo Faro)'}.` : st === 'no' ? 'Marcado como não estudado.'
      : !started ? 'Planejado. Quando o bloco começar, dá para dizer quanto foi estudo.' : bB(b) > now ? 'Acontecendo agora.' : 'Já passou. Quanto dele foi estudo de verdade?';
    $('cvMeas').textContent = meas >= 60000 ? `O Faro mediu ${fmtStudy(meas)} neste horário (relógios ou questões). Esse tempo já conta no seu estudo.` : started && !st ? 'O Faro não mediu nada neste horário.' : '';
    $('cvMeas').hidden = !$('cvMeas').textContent;
    $('cvG').hidden = !metaT(b.m); $('cvG').innerHTML = metaT(b.m) ? `${NI.flag}<span>${esc(metaT(b.m))}</span>` : '';
    const can = started && !st;
    $('cvConf').hidden = !can;
    // começa no bloco inteiro (ou no que cabe no dia); a pessoa diminui para o que foi útil
    if (can) { cvMs = 0; const c = cvCalc(b); cvMs = Math.max(60000, Math.floor(Math.min(c.max, c.meas + c.room) / 60000) * 60000); cvPaint(); }
    $('cvList').hidden = true;
    const next = b.g && cal.some(x => x !== b && x.g === b.g && x.d > b.d && !bSt(x));
    $('cvAct').innerHTML = (st === 'ok' && b.a === 1 ? actBtn('adjust', 'ajustar o tempo', true) + actBtn('notStudied', 'não estudei') : st ? actBtn('undo', st === 'ok' ? 'desfazer confirmação' : 'desfazer') : '') + actBtn('edit', 'editar') + actBtn('del', 'apagar') + (next ? actBtn('delNext', 'apagar este e os próximos') : '');
  }
  function calMeas(A, k) {
    const x = tlAll().find(y => y[0] === A && y[2] === k); if (!x) return;
    cc = { form: false, meas: true };
    ccShow(false, k === 'q' ? 'Questões' : 'Medido pelo Faro', `${dName(dayKey(new Date(x[0])), true)} · ${hhmm(x[0])}–${hhmm(x[1])}`);
    $('cvSt').textContent = k === 'q' ? `${fmtStudy(x[3])} resolvendo questões.` : `${fmtStudy(x[3])} de timer, cronômetro ou foco do pomodoro${x[4] ? ', e ainda rodando' : ''}.`;
    $('cvMeas').textContent = 'Medido sozinho pelo Faro: já está no seu estudo.'; $('cvMeas').hidden = false; $('cvG').hidden = true;
    $('cvConf').hidden = true;
    const ss = tmLog.filter(s => s.a < x[1] && s.b > x[0]);
    $('cvList').hidden = !ss.length;
    $('cvList').innerHTML = ss.map(s => `<li><button type="button" class="tne" data-tn="${s.id}"><span class="t">${hhmm(s.a)}</span><span>${TNW[s.w]} · ${fmtStudy(s.ms)}</span><span class="n${s.n ? '' : ' e'}">${esc(s.n || 'escrever o que fez')}</span></button></li>`).join('');
    const d = dayKey(new Date(x[0])), m0 = Math.floor((x[0] - dAt(d, 0)) / 300000) * 5, m1 = Math.min(1440, Math.ceil((Math.min(x[1], dAt(d, 1440)) - dAt(d, 0)) / 300000) * 5);
    cc.p = { d, s: m0, e: Math.max(m0 + 10, m1) };
    $('cvAct').innerHTML = x[4] ? '' : actBtn('mkBlock', '+ bloco neste horário');
  }
  function calMan(k) {
    const ms = tmMan.filter(m => m.d === k && (!m.b || !cal.some(b => b.id === m.b)));
    cc = { form: false, man: true };
    ccShow(false, 'Registrado à mão', `${dName(k, true)} · ${fmtStudy(ms.reduce((a, m) => a + m.ms, 0))}, sem horário`);
    $('cvSt').textContent = 'Tempo que você somou nas estatísticas, sem dizer o horário.'; $('cvMeas').hidden = true; $('cvConf').hidden = true; $('cvG').hidden = true;
    $('cvList').hidden = false;
    $('cvList').innerHTML = ms.map(m => `<li class="cvm"><span>${esc(m.l || 'sem descrição')}</span><b>${fmtStudy(m.ms)}</b></li>`).join('');
    $('cvAct').innerHTML = actBtn('toStats', 'ver nas estatísticas');
  }
  // tira o registro à mão que a confirmação de um bloco criou; devolve o registro, para poder desfazer
  function unconfirm(b) {
    const i = b.x ? tmMan.findIndex(m => m.id === b.x) : -1, m = i >= 0 ? tmMan.splice(i, 1)[0] : null;
    if (m) manSave();
    Object.assign(b, { st: '', v: 0, x: '', a: 2 });
    return m;
  }
  const calChanged = () => { calSave(); drawCal(); drawStudy(); drawTStats(); rkQueue(); hbBadge(); };
  $('ccX').innerHTML = XI;
  $('ccX').addEventListener('click', calClose);
  $('cfCancel').addEventListener('click', () => { const id = cc && cc.id; if (id) calOpen(id); else calClose(); });
  $('cfTs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { $('cfT').value = b.textContent; $('cfT').focus(); } });
  for (const id of ['cfD', 'cfS', 'cfE']) $(id).addEventListener('input', cfHint);
  function cfGPaint() { const ks = goalKs(cfG); $('cfGRow').hidden = !ks; $('cfG').innerHTML = ks; }
  $('cfG').addEventListener('click', e => { const b = e.target.closest('[data-g]'); if (b) { cfG = cfG === b.dataset.g ? '' : b.dataset.g; cfGPaint(); } });
  $('cfR').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { cfR = b.dataset.v; cfHint(); } });
  $('cfW').innerHTML = WK1.map(d => `<button type="button" data-d="${d}">${WD[d]}</button>`).join('');
  $('cfW').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const d = +b.dataset.d; if (cfW.has(d)) cfW.delete(d); else cfW.add(d); cfHint(); });
  $('cfU').addEventListener('input', () => { cfU = $('cfU').value; cfHint(); });
  // mudar o dia do bloco leva junto a data final e, em alguns dias, o dia da semana
  $('cfD').addEventListener('change', () => { const d = $('cfD').value; if (!/^\d{4}-\d\d-\d\d$/.test(d)) return; if (cfU <= d) cfU = shiftDay(d, 27); if (cfW.size <= 1) cfW = new Set([wdOf(d)]); cfHint(); });
  $('calForm').addEventListener('submit', e => {
    e.preventDefault();
    const v = cfRead(); if (v.err || (!(cc && cc.id) && cfRepErr(v.d))) return cfHint();
    const t = $('cfT').value.trim().slice(0, 40);
    let n = 1;
    let b = cc && cc.id && cal.find(x => x.id === cc.id);
    if (b) {
      b.t = t; b.m = cfG; if (bSt(b) !== 'ok') Object.assign(b, { d: v.d, s: v.s, e: v.e });
      const m = b.x && tmMan.find(x => x.id === b.x); if (m) { m.l = bTitle(b); manSave(); }
      b.u = Date.now();
    } else {
      const ds = cfDates(v.d), g = ds.length > 1 ? gid() : ''; n = ds.length;
      for (const d of ds) { const x = { id: gid(), d, s: v.s, e: v.e, t, g, st: '', v: 0, x: '', m: cfG, u: Date.now() }; cal.push(x); if (!b) b = x; }
    }
    const isNew = !(cc && cc.id);
    calRef = b.d; calChanged();
    if (bA(b) <= Date.now() && !bSt(b)) calOpen(b.id);
    else { calClose(); calMsg(isNew ? `Bloco guardado: ${bTitle(b)}, ${dName(b.d, true)}, ${hm(b.s)}–${hm(b.e)}${n > 1 ? `, e mais ${n - 1} ${n === 2 ? 'repetição' : 'repetições'} até ${fmtD(cfU)}` : ''}.` : 'Bloco atualizado.'); }
  });
  $('cfDel').addEventListener('click', () => { const b = cc && cc.id && cal.find(x => x.id === cc.id); if (b) calDel([b]); });
  function calDel(bs) {
    // o registro à mão de um bloco confirmado sai junto
    const ms = []; for (const b of bs) { const i = b.x ? tmMan.findIndex(m => m.id === b.x) : -1; if (i >= 0) ms.push(tmMan.splice(i, 1)[0]); }
    if (ms.length) manSave();
    cal = cal.filter(x => !bs.includes(x)); calClose(); calChanged();
    const lost = ms.reduce((a, m) => a + m.ms, 0);
    calMsg(`${bs.length > 1 ? `${bs.length} blocos apagados` : `Bloco “${bTitle(bs[0])}” apagado`}${lost ? `, e os ${fmtStudy(lost)} que ele somava ao estudo` : ''}.`, () => {
      for (const b of bs) if (!cal.includes(b)) cal.push(b);
      if (ms.length) { tmMan.push(...ms); manSave(); }
      calChanged();
    });
  }
  $('cvOk').addEventListener('click', () => {
    const b = cc && cal.find(x => x.id === cc.id); if (!b) return;
    const num = id => Math.max(0, Math.round(+$(id).querySelector('input').value.replace(',', '.')) || 0);
    cvMs = Math.min(23, num('cvH')) * 3600000 + Math.min(59, num('cvM')) * 60000;
    const c = cvCalc(b); if (!c.ok) return cvPaint();
    let x = '';
    if (c.extra >= 60000) { x = gid(); tmMan.push({ id: x, d: b.d, ms: c.extra, l: bTitle(b), t: Date.now(), b: b.id }); manSave(); }
    Object.assign(b, { st: 'ok', v: cvMs, x }); b.u = Date.now();
    calClose(); calChanged();
    calMsg(`${bTitle(b)}: ${c.meas < 60000 ? `${fmtStudy(cvMs)} somados ao seu estudo de ${manWhen(b.d)}` : c.extra >= 60000 ? `${fmtStudy(cvMs)} de estudo útil, ${fmtStudy(c.meas)} já medidos pelo Faro e ${fmtStudy(c.extra)} somados agora`
      : `${fmtStudy(cvMs)} de estudo útil, já medidos pelo Faro`}.`, () => { unconfirm(b); calChanged(); });
  });
  $('cvNo').addEventListener('click', () => {
    const b = cc && cal.find(x => x.id === cc.id); if (!b) return;
    b.st = 'no'; calClose(); calChanged();
    calMsg(`${bTitle(b)}: marcado como não estudado.`, () => { b.st = ''; b.a = 2; calChanged(); });
  });
  $('calView').addEventListener('click', e => {
    const t = e.target.closest('[data-tn]'); if (t) { const id = t.dataset.tn; calClose(); return tnAsk({ id }, true); }
    const a = e.target.closest('[data-a]'); if (!a) return;
    const b = cc && cc.id && cal.find(x => x.id === cc.id);
    if (a.dataset.a === 'mkBlock') return calForm(null, cc.p);
    if (a.dataset.a === 'toStats') { calClose(); go('estatisticas'); return $('stMan').scrollIntoView({ block: 'start' }); }
    if (!b) return;
    if (a.dataset.a === 'edit') return calForm(b);
    if (a.dataset.a === 'del') return calDel([b]);
    if (a.dataset.a === 'delNext') return calDel([b, ...cal.filter(x => x !== b && x.g === b.g && x.d > b.d && !bSt(x))]);
    if (a.dataset.a === 'undo') { unconfirm(b); b.u = Date.now(); calChanged(); calOpen(b.id); }
    if (a.dataset.a === 'adjust') { unconfirm(b); b.u = Date.now(); calChanged(); calOpen(b.id); }
    if (a.dataset.a === 'notStudied') {
      const old = { ...b }, m = unconfirm(b); b.st = 'no'; b.u = Date.now(); calClose(); calChanged();
      calMsg(`${bTitle(b)}: marcado como não estudado.`, () => { Object.assign(b, old); if (m) { tmMan.push(m); manSave(); } calChanged(); });
    }
  });
  // computador: arrastar o mouse num horário vazio desenha o bloco, de 15 em 15 min
  let drag = null, dragged = false;
  $('calGrid').addEventListener('pointerdown', e => {
    dragged = false;
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const col = e.target.closest('.ccol'); if (!col || e.target !== col) return;
    const g = col.closest('.cg'), lo = +g.dataset.lo * 60, hi = +g.dataset.hi * 60, hh = +g.dataset.hh, top = col.getBoundingClientRect().top;
    drag = { col, y0: e.clientY, el: null, Y: m => (m - lo) * hh / 60, at: y => Math.max(lo, Math.min(hi, lo + (y - top) / hh * 60)) };
    drag.m0 = drag.at(e.clientY);
    col.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  $('calGrid').addEventListener('pointermove', e => {
    if (!drag || (!drag.el && Math.abs(e.clientY - drag.y0) < 6)) return;
    const m1 = drag.at(e.clientY), a = Math.floor(Math.min(drag.m0, m1) / 15) * 15, b = Math.min(1440, Math.max(a + 15, Math.ceil(Math.max(drag.m0, m1) / 15) * 15));
    if (!drag.el) { drag.el = mkEl('i', 'cghost'); drag.col.append(drag.el); }
    drag.s = a; drag.e = b;
    drag.el.style.top = `${drag.Y(a)}px`; drag.el.style.height = `${drag.Y(b) - drag.Y(a)}px`; drag.el.textContent = `${hm(a)}–${hm(b)}`;
  });
  $('calGrid').addEventListener('pointerup', () => {
    const d = drag; drag = null; if (!d || !d.el) return;
    d.el.remove(); dragged = true;
    calForm(null, { d: d.col.dataset.d, s: d.s, e: d.e });
  });
  $('calGrid').addEventListener('pointercancel', () => { if (drag && drag.el) drag.el.remove(); drag = null; });
  $('calGrid').addEventListener('click', e => {
    if (dragged) { dragged = false; return; }
    const b = e.target.closest('.cb'); if (b) return calOpen(b.dataset.id);
    const m = e.target.closest('.cm'); if (m) return calMeas(+m.dataset.a, m.dataset.k);
    const mn = e.target.closest('.chm'); if (mn) return calMan(mn.dataset.man);
    const dn = e.target.closest('.chn'); if (dn) { calRef = dn.dataset.day; calMode = 'dia'; save('calMode', calMode); return drawCal(); }
    const col = e.target.closest('.ccol'); if (!col || e.target !== col) return;
    const g = col.closest('.cg'), y = e.clientY - col.getBoundingClientRect().top;
    calNewAt(col.dataset.d, +g.dataset.lo * 60 + Math.floor(y / +g.dataset.hh * 2) * 30);
  });
  $('calPendAll').addEventListener('click', calCountAll);
  $('calAuto').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; setPref('calAuto', b.dataset.v === 'on' ? Date.now() : 0); calChanged(); });
  $('calPendL').addEventListener('click', e => { const b = e.target.closest('.cpi'); if (b) calOpen(b.dataset.id); });
  $('calDays').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { calRef = b.dataset.d; drawCal(); } });
  $('calMode').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { calMode = b.dataset.v; save('calMode', calMode); drawCal(); } });
  $('calPrev').addEventListener('click', () => { calRef = shiftDay(calRef, calWeek() ? -7 : -1); drawCal(); });
  $('calNext').addEventListener('click', () => { calRef = shiftDay(calRef, calWeek() ? 7 : 1); drawCal(); });
  $('calToday').addEventListener('click', () => { calRef = dayKey(); drawCal(); });
  $('calNew').addEventListener('click', calNew);
  $('tsCal').addEventListener('click', () => { go('calendario'); scrollTo({ top: 0 }); });
  let calRsT; addEventListener('resize', () => { clearTimeout(calRsT); calRsT = setTimeout(() => { if (!calMode) drawCal(); }, 150); });

  // ---------- hábitos: o que a pessoa quer fazer sempre; os de tempo e de questões se marcam sozinhos ----------
  // hábito: { id, t, a: '' eu marco | tempo | q (questões), v: minutos ou questões por dia, f: d todo dia | w alguns dias | n vezes por semana,
  //           w: dias da semana (0 = domingo), n, st: on | pausa, c: dia em que foi criado, h: { dia: 1 } dias marcados, u }
  const fixHabs = a => (Array.isArray(a) ? a : []).filter(h => h && typeof h.id === 'string' && String(h.t || '').trim()).slice(0, 40).map(h => {
    const w = [...new Set((Array.isArray(h.w) ? h.w : []).map(Number).filter(x => Number.isInteger(x) && x >= 0 && x <= 6))].sort(), A = ['tempo', 'q'].includes(h.a) ? h.a : '';
    const ks = h.h && typeof h.h === 'object' ? Object.keys(h.h).filter(k => /^\d{4}-\d\d-\d\d$/.test(k) && h.h[k]).sort().slice(-400) : [];
    return { id: h.id.slice(0, 24), t: String(h.t).slice(0, 60), a: A, v: Math.min(A === 'q' ? 500 : 960, Math.max(1, Math.round(+h.v) || (A === 'q' ? 20 : 60))),
      f: h.f === 'w' && w.length ? 'w' : h.f === 'n' ? 'n' : 'd', w, n: Math.min(7, Math.max(1, Math.round(+h.n) || 3)), st: h.st === 'pausa' ? 'pausa' : 'on',
      c: /^\d{4}-\d\d-\d\d$/.test(h.c) ? h.c : dayKey(), h: Object.fromEntries(ks.map(k => [k, 1])), u: +h.u || 0 };
  });
  let habs = fixHabs(load('habs', [])), hbEdit = null, hf = null, hMemo = null;
  const hSave = h => { if (h) h.u = Date.now(); save('habs', habs); };
  const hE = k => { if (hMemo && hMemo.has(k)) return hMemo.get(k); const v = tdLive(k).e; if (hMemo) hMemo.set(k, v); return v; };
  const hQ = k => (days[k] && days[k].n) || 0;
  const hDone = (h, k) => h.a === 'tempo' ? hE(k) >= h.v * 60000 : h.a === 'q' ? hQ(k) >= h.v : !!h.h[k];
  const hSched = (h, k) => h.f !== 'w' || h.w.includes(new Date(k + 'T12:00').getDay());
  const hWhen = h => h.f === 'd' ? 'todo dia' : h.f === 'n' ? `${h.n}× por semana` : h.w.join() === '1,2,3,4,5' ? 'de segunda a sexta' : h.w.join() === '0,6' ? 'fim de semana' : WK1.filter(d => h.w.includes(d)).map(d => WD[d]).join(', ');
  const hProg = (h, k) => h.a === 'tempo' ? `${fmtStudy(Math.min(hE(k), h.v * 60000))} de ${fmtStudy(h.v * 60000)}` : h.a === 'q' ? `${Math.min(hQ(k), h.v)} de ${h.v} questões` : '';
  const hWeek = h => weekDays().filter(k => hDone(h, k)).length;
  // sequência: dias marcados seguidos (contando só os dias do hábito); hoje ainda em aberto não quebra. Nos de X por semana, semanas que bateram
  function hStreak(h) {
    if (h.f === 'n') {
      const cnt = s => Array.from({ length: 7 }, (_, i) => shiftDay(s, i)).filter(k => hDone(h, k)).length;
      let s = dayKey(weekStart()), n = 0;
      if (cnt(s) < h.n) s = shiftDay(s, -7);
      while (n < 104 && cnt(s) >= h.n) { n++; s = shiftDay(s, -7); }
      return n;
    }
    let k = dayKey(), n = 0;
    if (!hDone(h, k)) k = shiftDay(k, -1);
    for (let i = 0; i < 400; i++, k = shiftDay(k, -1)) { if (!hSched(h, k)) continue; if (!hDone(h, k)) break; n++; }
    return n;
  }
  // nos últimos 30 dias, quantos dos dias do hábito foram feitos (os de marcar à mão contam só depois de criados)
  function hRate(h) {
    let s = 0, d = 0;
    for (let i = 0; i < 30; i++) { const k = dAgo(i); if (k < h.c) break; if (!hSched(h, k) || (!i && !hDone(h, k))) continue; s++; if (hDone(h, k)) d++; }
    return s ? Math.round(100 * d / s) : null;
  }
  // as últimas 12 semanas, uma coluna por semana
  function hGrid(h) {
    const today = dayKey(), s0 = shiftDay(dayKey(weekStart()), -77);
    let c = WK1.map((d, r) => `<span class="hl" style="grid-row:${r + 1}">${WD[d][0]}</span>`).join('');
    for (let w = 0; w < 12; w++) for (let r = 0; r < 7; r++) {
      const k = shiftDay(s0, w * 7 + r), fut = k > today, dn = !fut && hDone(h, k), sc = hSched(h, k), pre = k < h.c && !dn;
      const cls = fut ? 'f' : dn ? 'y' : !sc || pre || h.f === 'n' || k === today ? 'x' : 'm', pos = `grid-column:${w + 2};grid-row:${r + 1}`;
      const lab = `${dName(k, true)}: ${fut ? 'ainda não chegou' : dn ? 'feito' : sc ? 'não feito' : 'fora dos dias do hábito'}`;
      c += h.a || fut ? `<span class="hc ${cls}${k === today ? ' t' : ''}" style="${pos}" title="${lab}"></span>`
        : `<button type="button" class="hc ${cls}${k === today ? ' t' : ''}" style="${pos}" data-k="${k}" aria-pressed="${dn}" title="${lab}" aria-label="${lab}"></button>`;
    }
    return `<div class="hg" role="group" aria-label="Últimas 12 semanas">${c}</div>`;
  }
  function hCard(h) {
    const box = mkEl('section', 'box gcard hcard' + (h.st === 'pausa' ? ' pausa' : '')), st = hStreak(h), r = h.f === 'n' ? null : hRate(h);
    box.dataset.id = h.id;
    const unit = h.f === 'n' ? (st === 1 ? 'semana seguida' : 'semanas seguidas') : (st === 1 ? 'dia seguido' : 'dias seguidos');
    const line = [h.a === 'tempo' ? `${fmtStudy(h.v * 60000)} de estudo no Faro, conta sozinho` : h.a === 'q' ? `${h.v} questões no Faro, conta sozinho` : '',
      h.f === 'n' ? `esta semana: ${hWeek(h)} de ${h.n}` : r != null ? `${r}% dos dias ${h.c > dAgo(29) ? 'desde que começou' : 'nos últimos 30'}` : ''].filter(Boolean).join(' · ');
    const A = h.st === 'on' ? [['edit', 'editar'], ['pause', 'pausar'], ['del', 'apagar']] : [['resume', 'retomar'], ['edit', 'editar'], ['del', 'apagar']];
    box.innerHTML = `<div class="hd"><span>${hWhen(h)}</span><span>${st ? `<b class="hst">${st}</b> ${unit}` : 'sem sequência ainda'}</span></div>`
      + `<div class="bd"><h3 class="gt">${esc(h.t)}</h3>${line ? `<p class="hs">${line}</p>` : ''}${hGrid(h)}`
      + `<div class="gact">${A.map(([a, t]) => `<button type="button" class="${a === 'resume' ? 'mk pri' : 'mk'}" data-a="${a}">${t}</button>`).join('')}</div></div>`;
    return box;
  }
  function hbBadge() {
    hMemo = new Map();
    const k = dayKey(), on = habs.filter(h => h.st === 'on' && hSched(h, k)), left = on.filter(h => !hDone(h, k) && !(h.f === 'n' && hWeek(h) >= h.n)).length;
    $('hbNav').textContent = left || '';
    hMemo = null;
  }
  function drawHabs() {
    if (view !== 'habitos') return;
    hMemo = new Map();
    const k = dayKey(), on = habs.filter(h => h.st === 'on'), pa = habs.filter(h => h.st === 'pausa'), form = !$('hbForm').hidden, td = on.filter(h => hSched(h, k));
    $('hbTodayBox').hidden = !on.length;
    $('hbTodayN').textContent = td.length ? `${td.filter(h => hDone(h, k)).length} de ${td.length} feitos` : '';
    $('hbToday').innerHTML = td.length ? td.map(h => {
      const x = h.a ? hProg(h, k) + ' · conta sozinho' : h.f === 'n' ? `${hWeek(h)} de ${h.n} nesta semana` : '';
      return `<li><button type="button" class="gck hck" data-h="${h.id}" aria-pressed="${hDone(h, k)}"${h.a ? ' disabled' : ''}>${esc(h.t)}</button>${x ? `<span class="hx">${x}</span>` : ''}</li>`;
    }).join('') : '<li class="m0">Nenhum hábito para hoje. Aproveite o descanso.</li>';
    $('hbNew').hidden = form; $('hbEmpty').hidden = form || habs.length > 0;
    $('hbList').replaceChildren(...on.map(hCard));
    if (!on.length && habs.length) $('hbList').replaceChildren(mkEl('p', 'note gnone', 'Nenhum hábito ativo agora. Retome um pausado ou crie um novo.'));
    $('hbPaused').hidden = !pa.length; $('hbPausedN').textContent = pa.length; $('hbPausedL').replaceChildren(...pa.map(hCard));
    hMemo = null; hbBadge();
  }
  function hbMsg(txt, undo) {
    const m = $('hbMsg'); m.hidden = false; m.textContent = txt;
    if (!undo) return;
    const b = mkEl('button', 'undo', 'desfazer'); b.type = 'button'; b.onclick = () => { undo(); m.hidden = true; }; m.append(' ', b);
  }
  // formulário
  STP.hvM = v => { hf.vm = v; hfPaint(); }; STP.hvQ = v => { hf.vq = v; hfPaint(); }; STP.hvN = v => { hf.n = v; hfPaint(); };
  $('hfVm').innerHTML = stepRow('hvM', 'Minutos por dia', 'min', 15, 960, 15);
  $('hfVq').innerHTML = stepRow('hvQ', 'Questões por dia', '', 5, 500, 5);
  $('hfN').innerHTML = stepRow('hvN', 'Vezes por semana', '', 1, 7, 1);
  $('hfW').innerHTML = WK1.map(d => `<button type="button" data-d="${d}">${WD[d]}</button>`).join('');
  const HB_IDEAS = [
    { t: 'estudar 1 h', a: 'tempo', v: 60 }, { t: '20 questões', a: 'q', v: 20 }, { t: 'revisar a aula do dia', f: 'w', w: [1, 2, 3, 4, 5] },
    { t: 'ler 20 páginas' }, { t: 'atividade física', f: 'n', n: 3 }, { t: 'dormir antes da meia-noite' },
  ];
  $('hbIdeas').innerHTML = HB_IDEAS.map((x, i) => `<button type="button" data-i="${i}">${x.t}</button>`).join('') + '<button type="button" data-i="">outro</button>';
  function hfPaint() {
    segOn('hfA', hf.a); segOn('hfF', hf.f);
    $('hfVm').hidden = hf.a !== 'tempo'; $('hfVq').hidden = hf.a !== 'q'; $('hfW').hidden = hf.f !== 'w'; $('hfN').hidden = hf.f !== 'n';
    setStp('hvM', hf.vm); setStp('hvQ', hf.vq); setStp('hvN', hf.n);
    $('hfW').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', hf.w.has(+b.dataset.d)));
    $('hfANote').textContent = hf.a === 'tempo' ? 'Marca sozinho quando o seu estudo do dia chega lá: relógios do Faro, questões e o registrado à mão.'
      : hf.a === 'q' ? 'Marca sozinho quando você responde essa quantidade de questões no dia.' : 'Você marca cada dia com um toque.';
    $('hfT').placeholder = hf.a === 'tempo' ? `estudar ${fmtStudy(hf.vm * 60000)}` : hf.a === 'q' ? `${hf.vq} questões` : 'ler 20 páginas, revisar a aula do dia…';
  }
  function hbOpen(h, x) {
    hbEdit = h ? h.id : null; const p = h || x || {};
    hf = { a: p.a || '', f: p.f || 'd', w: new Set(p.w || [1, 2, 3, 4, 5]), n: p.n || 3, vm: p.a === 'tempo' ? p.v : 60, vq: p.a === 'q' ? p.v : 20 };
    $('hbForm').hidden = false; $('hbMsg').hidden = true;
    $('hbFormHd').textContent = h ? 'Editar hábito' : 'Novo hábito';
    $('hfT').value = p.t || ''; hfPaint(); drawHabs();
    $('hbForm').scrollIntoView({ block: 'nearest' });
    $('hfT').focus({ preventScroll: true });
  }
  function hbClose() { $('hbForm').hidden = true; hbEdit = null; drawHabs(); }
  $('hbNew').addEventListener('click', () => hbOpen());
  $('hbIdeas').addEventListener('click', e => { const b = e.target.closest('button'); if (b) hbOpen(null, b.dataset.i === '' ? null : HB_IDEAS[+b.dataset.i]); });
  $('hfCancel').addEventListener('click', () => { hbClose(); $('hbNew').focus(); });
  $('hfA').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { hf.a = b.dataset.v; hfPaint(); } });
  $('hfF').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { hf.f = b.dataset.v; hfPaint(); } });
  $('hfW').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const d = +b.dataset.d; if (hf.w.has(d)) hf.w.delete(d); else hf.w.add(d); hfPaint(); });
  $('hbForm').addEventListener('submit', e => {
    e.preventDefault();
    const num = id => Math.round(+$(id).querySelector('input').value.replace(',', '.')) || 0;
    hf.vm = Math.min(960, Math.max(15, num('hvM'))); hf.vq = Math.min(500, Math.max(5, num('hvQ'))); hf.n = Math.min(7, Math.max(1, num('hvN')));
    if (hf.f === 'w' && !hf.w.size) { hfPaint(); $('hfANote').textContent = 'Escolha pelo menos um dia da semana.'; return; }
    const t = $('hfT').value.trim() || (hf.a ? $('hfT').placeholder : ''); if (!t) { $('hfT').focus(); return; }
    const v = { t: t.slice(0, 60), a: hf.a, v: hf.a === 'tempo' ? hf.vm : hf.a === 'q' ? hf.vq : 1, f: hf.f, w: [...hf.w].sort(), n: hf.n };
    let h = hbEdit && habs.find(x => x.id === hbEdit); const isNew = !h;
    if (h) Object.assign(h, v); else { h = { id: gid(), ...v, st: 'on', c: dayKey(), h: {}, u: 0 }; habs.push(h); }
    habs = fixHabs(habs); hSave(habs.find(x => x.id === h.id)); hbClose(); hbMsg(isNew ? 'Hábito criado. Um dia de cada vez.' : 'Hábito atualizado.');
  });
  // marcar hoje, marcar um dia que passou, e as ações dos cartões
  $('vHab').addEventListener('click', e => {
    const t = e.target.closest('.hck');
    if (t) { const h = habs.find(x => x.id === t.dataset.h); if (h && !h.a) { const k = dayKey(); if (h.h[k]) delete h.h[k]; else h.h[k] = 1; hSave(h); drawHabs(); const n = $('hbToday').querySelector(`[data-h="${h.id}"]`); if (n) n.focus({ preventScroll: true }); } return; }
    const card = e.target.closest('.hcard'), h = card && habs.find(x => x.id === card.dataset.id); if (!h) return;
    const c = e.target.closest('.hc[data-k]');
    if (c) { const k = c.dataset.k; if (h.h[k]) delete h.h[k]; else h.h[k] = 1; hSave(h); drawHabs(); const n = $('vHab').querySelector(`.hcard[data-id="${h.id}"] .hc[data-k="${k}"]`); if (n) n.focus({ preventScroll: true }); return; }
    const b = e.target.closest('[data-a]'); if (!b) return;
    const a = b.dataset.a;
    if (a === 'edit') return hbOpen(h);
    if (a === 'del') { const i = habs.indexOf(h); habs.splice(i, 1); hSave(); drawHabs(); return hbMsg(`“${h.t}” apagado.`, () => { habs.splice(Math.min(i, habs.length), 0, h); hSave(h); drawHabs(); }); }
    h.st = a === 'pause' ? 'pausa' : 'on'; hSave(h); drawHabs();
    hbMsg(a === 'pause' ? 'Hábito pausado. Ele fica em Pausados, mais abaixo, e a sequência não conta enquanto isso.' : 'Hábito retomado.');
  });
  // o calendário e os hábitos acompanham o relógio: o agora anda, os de tempo se marcam sozinhos
  setInterval(() => {
    calAutoRun(); calBadge(); hbBadge();
    const a = document.activeElement, busy = a && a !== document.body && (a.closest('#calCard') || a.closest('#hbForm'));
    if (view === 'calendario' && !busy && !drag) drawCal();
    else if (view === 'habitos' && !busy && !(a && a.closest && a.closest('#vHab'))) drawHabs();
  }, 60000);

  // ---------- leitura: os livros que a pessoa lê, quer ler e já leu, com a página em que parou e as anotações ----------
  // livro: { id, t, a: autor, p: páginas (0 = não sei), at: página atual, st: quero | lendo | lido | larguei, c: criado, s: dia em que começou,
  //          f: dia em que terminou, r: nota de 0 a 5, nt: anotações em markdown, lg: { dia: páginas lidas no dia }, u }
  const LST = ['quero', 'lendo', 'lido', 'larguei'];
  const fixBooks = a => (Array.isArray(a) ? a : []).filter(b => b && typeof b.id === 'string' && (String(b.t || '').trim() || String(b.nt || '').trim())).slice(0, 300).map(b => {
    const p = Math.max(0, Math.min(9999, Math.round(+b.p) || 0));
    return { id: b.id.slice(0, 24), t: String(b.t || '').slice(0, 100), a: String(b.a || '').slice(0, 60), p, at: Math.max(0, Math.min(p || 9999, Math.round(+b.at) || 0)),
      st: LST.includes(b.st) ? b.st : 'quero', c: +b.c || 0, s: /^\d{4}-\d\d-\d\d$/.test(b.s) ? b.s : '', f: /^\d{4}-\d\d-\d\d$/.test(b.f) ? b.f : '',
      r: Math.max(0, Math.min(5, Math.round(+b.r) || 0)), nt: String(b.nt || '').slice(0, 20000),
      lg: Object.fromEntries(Object.entries(b.lg && typeof b.lg === 'object' ? b.lg : {}).filter(([k, v]) => /^\d{4}-\d\d-\d\d$/.test(k) && +v > 0).slice(-400).map(([k, v]) => [k, Math.min(9999, Math.round(+v))])), u: +b.u || 0 };
  });
  let books = fixBooks(load('livros', [])), lvPg = null, lvMode = 'ver', lfS = 'lendo';
  const bName = b => b.t.trim() || 'Sem título';
  const lvSave = b => { if (b) b.u = Date.now(); save('livros', books); };
  const pagesOn = k => books.reduce((a, b) => a + (b.lg[k] || 0), 0);
  // ritmo: páginas por dia nos últimos 14 dias em que o livro foi lido, e quando ele termina nesse ritmo
  function bPace(b) {
    const ks = Array.from({ length: 14 }, (_, i) => dAgo(i)), n = ks.reduce((a, k) => a + (b.lg[k] || 0), 0);
    const per = n / 14, left = b.p ? Math.max(0, b.p - b.at) : 0, days = per > 0 && left ? Math.ceil(left / per) : 0;
    return { per, left, days, n };
  }
  // dias seguidos com pelo menos uma página lida (hoje ainda pode entrar)
  function lvStreak() { let n = 0, i = pagesOn(dayKey()) ? 0 : 1; while (pagesOn(dAgo(i)) > 0) { n++; i++; } return n; }
  const yr = () => String(new Date().getFullYear());
  function drawLvBadge() { const n = books.filter(b => b.st === 'lendo').length; $('lvNav').textContent = n || ''; }
  function lvRow(b) {
    const el = mkEl('button', 'gpi' + (b.st === 'larguei' ? ' pausa' : '')); el.type = 'button'; el.dataset.id = b.id;
    const ic = mkEl('span', 'gpic'); ic.innerHTML = b.st === 'lido' ? FOX : NI.read;
    const tx = mkEl('span', 'gptx'); tx.append(mkEl('b', '', bName(b)));
    const meta = [b.a, b.st === 'lido' && b.f ? `lido em ${fmtD(b.f)}` : '', b.r ? '★'.repeat(b.r) : '', b.p ? `${b.p} páginas` : ''].filter(Boolean).join(' · ');
    if (meta) tx.append(mkEl('span', 'gpm', meta));
    el.append(ic, tx, mkEl('span', 'gpgo', '›'));
    return el;
  }
  // cartão de um livro em andamento: progresso e o campo para dizer em que página está
  function lvCard(b) {
    const box = mkEl('section', 'box lvc'), hd = mkEl('div', 'hd'), bd = mkEl('div', 'bd'), pc = bPace(b), pct = b.p ? Math.round(100 * b.at / b.p) : 0;
    box.dataset.id = b.id;
    hd.append(mkEl('span', '', b.a || 'lendo'), mkEl('span', '', b.p ? `${pct}%` : ''));
    const t = mkEl('button', 'lvt', bName(b)); t.type = 'button'; t.dataset.a = 'open'; bd.append(t);
    if (b.p) { const g = mkEl('div', 'gbar'); g.setAttribute('aria-hidden', 'true'); const i = mkEl('i'); i.style.width = `calc(${Math.min(100, pct)}% - 2px)`; g.append(i); bd.append(g); }
    bd.append(mkEl('p', 'lvs', [b.p ? `página ${b.at} de ${b.p}` : `página ${b.at}`, pc.per >= .5 ? `${Math.round(pc.per)} pág./dia` : '', pc.days ? `termina em ~${pc.days} ${pc.days === 1 ? 'dia' : 'dias'}` : ''].filter(Boolean).join(' · ')));
    const f = mkEl('form', 'lvu'), lb = mkEl('label', 'lb', 'estou na página'), i = mkEl('input'), ok = mkEl('button', 'mk pri', 'ok');
    i.type = 'number'; i.inputMode = 'numeric'; i.min = 0; i.max = b.p || 9999; i.value = b.at; i.setAttribute('aria-label', `Página em que está em ${bName(b)}`); ok.type = 'submit';
    lb.append(i); f.append(lb, ok);
    for (const n of [5, 10, 20]) { const x = mkEl('button', 'mk', `+${n}`); x.type = 'button'; x.dataset.a = 'add'; x.dataset.n = n; f.append(x); }
    bd.append(f); box.append(hd, bd);
    return box;
  }
  // mudar a página em que está: a diferença entra no dia de hoje (voltar páginas tira de hoje, sem ficar negativo)
  function lvSetAt(b, at) {
    at = Math.max(0, Math.min(b.p || 9999, Math.round(at) || 0));
    const d = at - b.at, k = dayKey(); if (!d) return 0;
    b.lg[k] = Math.max(0, (b.lg[k] || 0) + d); if (!b.lg[k]) delete b.lg[k];
    b.at = at; if (!b.s) b.s = k;
    if (b.p && at >= b.p && b.st === 'lendo') { b.st = 'lido'; b.f = k; }
    lvSave(b); return d;
  }
  function drawRead() {
    drawLvBadge();
    if (view !== 'leitura') return;
    const b = lvPg && books.find(x => x.id === lvPg); if (!b) lvPg = null;
    $('lvHome').hidden = !!b; $('lvPage').hidden = !b;
    if (b) return drawBook(b);
    const k = dayKey(), wk = weekDays().reduce((a, d) => a + pagesOn(d), 0), done = books.filter(x => x.st === 'lido' && x.f.startsWith(yr())).length, g = prefs.lmeta;
    const cell = (a, v, d) => `<div><span>${a}</span><b>${v}</b><em>${d}</em></div>`;
    $('lvStats').innerHTML = cell('hoje', pagesOn(k), 'páginas') + cell('esta semana', wk, `páginas · ${lvStreak()} ${lvStreak() === 1 ? 'dia seguido' : 'dias seguidos'}`) + cell(`lidos em ${yr()}`, done, g ? `de ${g}` : 'livros');
    $('lvGoalBar').hidden = !g;
    if (g) {
      $('lvGoalFill').style.width = `calc(${Math.min(100, 100 * done / g)}% - 2px)`;
      const doy = (Date.now() - new Date(+yr(), 0, 1)) / 864e5, exp = g * doy / 365;
      $('lvGoalTxt').textContent = done >= g ? 'Meta do ano cumprida. Parabéns!' : done >= Math.floor(exp) ? `No ritmo: faltam ${g - done} ${g - done === 1 ? 'livro' : 'livros'} até o fim do ano.` : `Um pouco atrás: para chegar a ${g}, o esperado até agora era ${Math.floor(exp)}.`;
    }
    setStp('lvGo', g);
    const now = books.filter(x => x.st === 'lendo').sort((a, b2) => b2.u - a.u), want = books.filter(x => x.st === 'quero').sort((a, b2) => b2.c - a.c),
      lid = books.filter(x => x.st === 'lido').sort((a, b2) => (b2.f || '').localeCompare(a.f || '')), drop = books.filter(x => x.st === 'larguei');
    $('lvEmpty').hidden = books.length > 0 || !$('lvForm').hidden; $('lvNew').hidden = !$('lvForm').hidden;
    $('lvNow').replaceChildren(...now.map(lvCard));
    $('lvWant').hidden = !want.length; $('lvWantN').textContent = want.length; $('lvWantL').replaceChildren(...want.map(lvRow));
    $('lvDone').hidden = !lid.length; $('lvDoneN').textContent = lid.length; $('lvDoneL').replaceChildren(...lid.map(lvRow));
    $('lvDrop').hidden = !drop.length; $('lvDropN').textContent = drop.length; $('lvDropL').replaceChildren(...drop.map(lvRow));
  }
  function drawBook(b) {
    const a = document.activeElement, pc = bPace(b);
    if (a !== $('lpT')) $('lpT').value = b.t;
    if (a !== $('lpA')) $('lpA').value = b.a;
    if (a !== $('lpAt')) $('lpAt').value = b.at;
    if (a !== $('lpP')) $('lpP').value = b.p || '';
    segOn('lpS', b.st); segOn('lpMode', lvMode);
    $('lpPace').textContent = b.st === 'lido' ? `lido${b.s ? ` de ${fmtD(b.s)}` : ''}${b.f ? ` a ${fmtD(b.f)}` : ''}` : pc.n ? `${pc.n} páginas nos últimos 14 dias (${Math.round(pc.per * 10) / 10} por dia)${pc.days ? `; nesse ritmo, termina em ~${pc.days} ${pc.days === 1 ? 'dia' : 'dias'}` : ''}` : 'ainda sem páginas registradas';
    $('lpR').innerHTML = [1, 2, 3, 4, 5].map(n => `<button type="button" data-r="${n}" aria-pressed="${n <= b.r}" aria-label="${n} ${n === 1 ? 'estrela' : 'estrelas'}">${n <= b.r ? '★' : '☆'}</button>`).join('');
    const ks = Array.from({ length: 14 }, (_, i) => dAgo(13 - i)), rs = ks.map(k => b.lg[k] || 0), top = Math.max(1, ...rs);
    $('lpWk').hidden = !rs.some(Boolean);
    $('lpWk').setAttribute('aria-label', `Páginas nos últimos 14 dias: ${rs.join(', ')}`);
    $('lpWk').innerHTML = `<div class="w7b">${rs.map((r, i) => `<div class="sb${i === 13 ? ' td' : ''}" title="${dName(ks[i], true)} · ${r} pág."><i style="height:${(r / top * 100).toFixed(1)}%"></i></div>`).join('')}</div>`
      + `<div class="w7x">${ks.map((k, i) => `<span>${i === 13 ? 'hoje' : i % 2 ? '' : +k.slice(8)}</span>`).join('')}</div>`;
    const w = lvMode === 'escrever';
    $('lpEd').hidden = !w; $('lpView').hidden = w;
    if (w) { if (a !== $('lpEd')) $('lpEd').value = b.nt; const t = $('lpEd'); t.style.height = 'auto'; t.style.height = Math.max(220, t.scrollHeight + 2) + 'px'; }
    else $('lpView').innerHTML = b.nt.trim() ? mdHtml(b.nt, true) : '<p class="gmd0">Sem anotações. Toque em ESCREVER para guardar trechos, ideias, personagens, o que cai no vestibular…</p>';
  }
  let lpSvT;
  const lpSaved = () => { $('lpSaved').textContent = 'salvo'; clearTimeout(lpSvT); lpSvT = setTimeout(() => { $('lpSaved').textContent = ''; }, 1500); };
  const curB = () => lvPg && books.find(x => x.id === lvPg);
  function lvMsg(txt, undo) {
    const m = $('lvMsg'); m.hidden = false; m.textContent = txt;
    if (undo) { const b = mkEl('button', 'undo', 'desfazer'); b.type = 'button'; b.onclick = () => { undo(); m.hidden = true; }; m.append(' ', b); }
  }
  function lvOpen(id) { lvPg = id; lvMode = 'ver'; $('lvMsg').hidden = true; drawRead(); scrollTo({ top: 0 }); }
  function lvBack() { lvPg = null; drawRead(); }
  STP.lvGo = v => { setPref('lmeta', Math.max(0, Math.min(200, v))); drawRead(); };
  $('lvGoalSt').innerHTML = stepRow('lvGo', 'Livros', 'no ano', 0, 200, 1);
  $('lvGoalBtn').addEventListener('click', () => { const on = $('lvGoalEd').hidden; $('lvGoalEd').hidden = !on; $('lvGoalBtn').setAttribute('aria-expanded', on); });
  $('lvNew').addEventListener('click', () => { $('lvForm').hidden = false; $('lvMsg').hidden = true; lfS = 'lendo'; segOn('lfS', lfS); for (const id of ['lfT', 'lfA', 'lfP']) $(id).value = ''; drawRead(); $('lfT').focus(); });
  $('lfCancel').addEventListener('click', () => { $('lvForm').hidden = true; drawRead(); });
  $('lfS').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { lfS = b.dataset.v; segOn('lfS', lfS); } });
  $('lvForm').addEventListener('submit', e => {
    e.preventDefault();
    const t = $('lfT').value.trim(); if (!t) return $('lfT').focus();
    const p = Math.max(0, Math.min(9999, Math.round(+$('lfP').value) || 0)), k = dayKey();
    const b = { id: gid(), t: t.slice(0, 100), a: $('lfA').value.trim().slice(0, 60), p, at: lfS === 'lido' ? p : 0, st: lfS, c: Date.now(), s: lfS === 'quero' ? '' : k, f: lfS === 'lido' ? k : '', r: 0, nt: '', lg: {}, u: 0 };
    books.push(b); lvSave(b); $('lvForm').hidden = true; drawRead();
    lvMsg(lfS === 'lido' ? `“${bName(b)}” entrou nos lidos.` : lfS === 'quero' ? `“${bName(b)}” entrou em Quero ler.` : `Boa leitura: ${bName(b)}.`);
  });
  $('lvHome').addEventListener('click', e => {
    const r = e.target.closest('.gpi'); if (r) return lvOpen(r.dataset.id);
    const x = e.target.closest('[data-a]'), card = x && x.closest('.lvc'), b = card && books.find(y => y.id === card.dataset.id); if (!b) return;
    if (x.dataset.a === 'open') return lvOpen(b.id);
    if (x.dataset.a === 'add') { const was = b.st; lvSetAt(b, b.at + +x.dataset.n); drawRead(); if (b.st === 'lido' && was !== 'lido') lvMsg(`Você terminou ${bName(b)}! Ele foi para Lidos.`); else { const n = $('lvNow').querySelector(`.lvc[data-id="${b.id}"] [data-n="${x.dataset.n}"]`); if (n) n.focus({ preventScroll: true }); } }
  });
  $('lvHome').addEventListener('submit', e => {
    const f = e.target.closest('.lvu'); if (!f) return; e.preventDefault();
    const b = books.find(y => y.id === f.closest('.lvc').dataset.id); if (!b) return;
    const was = b.st, d = lvSetAt(b, +f.querySelector('input').value); drawRead();
    if (b.st === 'lido' && was !== 'lido') lvMsg(`Você terminou ${bName(b)}! Ele foi para Lidos.`);
    else if (d) lvMsg(d > 0 ? `+${d} ${d === 1 ? 'página' : 'páginas'} hoje em ${bName(b)}.` : `${bName(b)}: voltou para a página ${b.at}.`);
  });
  $('lpBack').addEventListener('click', lvBack);
  $('lpT').addEventListener('input', () => { const b = curB(); if (!b) return; b.t = $('lpT').value.slice(0, 100); lvSave(b); lpSaved(); });
  $('lpA').addEventListener('input', () => { const b = curB(); if (!b) return; b.a = $('lpA').value.slice(0, 60); lvSave(b); lpSaved(); });
  $('lpP').addEventListener('change', () => { const b = curB(); if (!b) return; b.p = Math.max(0, Math.min(9999, Math.round(+$('lpP').value) || 0)); if (b.p && b.at > b.p) b.at = b.p; lvSave(b); drawBook(b); lpSaved(); });
  $('lpAt').addEventListener('change', () => { const b = curB(); if (!b) return; lvSetAt(b, +$('lpAt').value); drawBook(b); lpSaved(); });
  $('lpS').addEventListener('click', e => {
    const x = e.target.closest('button'), b = curB(); if (!x || !b || x.dataset.v === b.st) return;
    const k = dayKey(); b.st = x.dataset.v;
    if (b.st === 'lendo' && !b.s) b.s = k;
    if (b.st === 'lido') { b.f = k; if (!b.s) b.s = k; if (b.p && b.at < b.p) lvSetAt(b, b.p); } else b.f = '';
    lvSave(b); drawBook(b); lpSaved();
  });
  $('lpR').addEventListener('click', e => { const x = e.target.closest('[data-r]'), b = curB(); if (!x || !b) return; b.r = b.r === +x.dataset.r ? 0 : +x.dataset.r; lvSave(b); drawBook(b); lpSaved(); });
  $('lpMode').addEventListener('click', e => { const x = e.target.closest('button'); if (!x) return; lvMode = x.dataset.v; drawRead(); if (lvMode === 'escrever') $('lpEd').focus({ preventScroll: true }); });
  $('lpEd').addEventListener('input', () => { const b = curB(); if (!b) return; b.nt = $('lpEd').value.slice(0, 20000); lvSave(b); const t = $('lpEd'); t.style.height = 'auto'; t.style.height = Math.max(220, t.scrollHeight + 2) + 'px'; lpSaved(); });
  $('lpView').addEventListener('click', e => {
    const x = e.target.closest('.gtk'), b = curB(); if (!x || !b) return;
    const L = b.nt.split('\n'), i = +x.dataset.ln; if (!L[i]) return;
    L[i] = L[i].replace(/\[( |x|X)\]/, m => m === '[ ]' ? '[x]' : '[ ]'); b.nt = L.join('\n'); lvSave(b); drawBook(b); lpSaved();
  });
  $('lpDel').addEventListener('click', () => {
    const b = curB(); if (!b) return;
    const i = books.indexOf(b); books.splice(i, 1); lvSave(); lvPg = null; drawRead();
    lvMsg(`“${bName(b)}” apagado.`, () => { books.splice(Math.min(i, books.length), 0, b); lvSave(b); drawRead(); });
  });

  // ---------- páginas ----------
  const VDRAW = {};
  const VIEWS = { treino: 'vTrain', marcadas: 'vMarked', estatisticas: 'vStats', ranking: 'vRank', config: 'vConfig', ruido: 'vNoise', tempo: 'vTime', metas: 'vGoals', calendario: 'vCal', habitos: 'vHab', leitura: 'vRead' };
  function go(v, fresh) {
    view = VIEWS[v] && v !== 'treino' ? v : 'treino';
    if (view !== 'calendario') calClose();
    for (const k in VIEWS) $(VIEWS[k]).hidden = k !== view;
    document.body.dataset.view = view;
    qSee();
    if (view === 'marcadas') drawMarked();
    else if (view === 'config') drawConfig();
    else if (view === 'estatisticas') drawStats();
    else if (view === 'ranking') drawRank();
    else if (view === 'tempo') drawTime();
    else if (view === 'metas') { $('glMsg').hidden = true; if (glPg) glBack(); else drawGoals(); }
    else if (view === 'calendario') { $('calMsg').hidden = true; drawCal(); }
    else if (view === 'habitos') { $('hbMsg').hidden = true; drawHabs(); }
    else if (view === 'leitura') { $('lvMsg').hidden = true; lvPg = null; drawRead(); }
    else if (view === 'ruido') { drawPins(); nzUI(); if (nz.on) nzDraw(); else NZQ('scope').forEach(cv => nzFrame(cv)); }
    else if (VDRAW[view]) VDRAW[view]();
    else if (v !== mode) { mode = v; save('mode', mode); if (fresh !== false) { syncSettings(); next(); } }
    syncSettings();
    if (view === 'estatisticas') drawEvo();
    nzUI(); tmLoop();
    closeSide();
    const h = '#' + (view === 'treino' ? mode : view);
    if (location.hash !== h) history.replaceState(null, '', h);
  }
  $('nav').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    go(b.dataset.v); if (view !== 'treino') scrollTo({ top: 0 });
  });
  let meTo = () => 'config';
  $('me').addEventListener('click', () => { go(meTo()); scrollTo({ top: 0 }); });

  // ---------- conta: rating e marcadas salvos na conta Claude de quem está vendo ----------
  const acct = (on, txt) => { for (const id of ['acct', 'acct2']) { $(id).classList.toggle('on', on); $(id).textContent = txt; } };
  const snapshot = () => ({ v: 1, rv: RV, ratings, marked: marked.slice(0, 300), off: [...off], best, prefs, days, tmDays, tmMan, metas, tmLog, tmTl, cal, habs, livros: books, t: Date.now() });
  let pushing = false, again = false, last = 0;
  async function push() {
    pushT = null;
    if (!cloud) return;
    if (pushing) { again = true; return; }
    pushing = true;
    try { const st = snapshot(); last = st.t; await cloud.set(st); }
    catch (e) { cloud = null; acct(false, 'não deu para salvar na conta · o progresso fica neste navegador'); }
    pushing = false;
    if (again) { again = false; push(); }
  }
  function adopt(st) {
    ratings = mig(st.ratings || {}, st.rv);
    if (st.days) st = { ...st, days: migDays(fixDays(st.days), st.rv) };
    marked = fixMarked(st.marked);
    off = new Set((st.off || []).filter(k => GEN[k]));
    best = Math.max(best, +st.best || 0);
    if (st.prefs) prefs = fixPrefs(st.prefs);
    if (st.days) days = fixDays(st.days);
    if (st.tmDays) tmDays = fixTmDays(st.tmDays);
    if (st.tmMan) tmMan = fixMan(st.tmMan);
    if (st.metas) metas = fixMetas(st.metas);
    if (st.tmLog) tmLog = fixLog(st.tmLog);
    if (st.tmTl) tmTl = fixTl(st.tmTl);
    if (st.cal) cal = fixCal(st.cal);
    if (st.habs) habs = fixHabs(st.habs);
    if (st.livros) books = fixBooks(st.livros);
    try { for (const k of SYNCED) localStorage.setItem('cm.' + k, JSON.stringify(k === 'off' ? [...off] : { ratings, marked, best, prefs, days, tmDays, tmMan, metas, tmLog, tmTl, cal, habs, livros: books }[k])); } catch (e) {}
    applyPrefs(); syncSettings(); syncMark(); stats(); calAutoRun();
    if (view === 'config') drawConfig();
    if (view === 'marcadas') drawMarked();
    if (view === 'estatisticas') drawStats();
    if (view === 'metas') drawGoals();
    if (view === 'tempo') drawTn();
    if (view === 'calendario' && !(cc && cc.form)) drawCal();
    if (view === 'habitos' && $('hbForm').hidden) drawHabs();
    if (view === 'leitura' && $('lvForm').hidden && !lvPg) drawRead();
    calBadge(); hbBadge(); drawLvBadge();
    rkQueue();
  }
  // primeira vez neste navegador: junta o que já havia aqui com o que está na conta
  function merge(a, b) {
    const r = { ...(b.ratings || {}) };
    for (const k in a.ratings) if (!r[k] || a.ratings[k].n > r[k].n) r[k] = a.ratings[k];
    const seen = new Set(), m = [...(a.marked || []), ...(b.marked || [])].sort((x, y) => y.t - x.t).filter(x => !seen.has(x.id) && seen.add(x.id));
    const dd = { ...(a.days || {}) };
    for (const k in b.days || {}) { const x = dd[k], y = b.days[k]; dd[k] = !x ? y : { n: Math.max(x.n, y.n), ok: Math.max(x.ok, y.ok), r: x.n >= y.n ? { ...y.r, ...x.r } : { ...x.r, ...y.r } }; }
    const td = fixTmDays(a.tmDays), tb = fixTmDays(b.tmDays);
    for (const k in tb) td[k] = td[k] ? Object.fromEntries(Object.keys(TD0).map(f => [f, Math.max(td[k][f], tb[k][f])])) : tb[k];
    const ids = new Set(), mm = [...fixMan(b.tmMan), ...fixMan(a.tmMan)].filter(x => !ids.has(x.id) && ids.add(x.id));
    const gm = new Map();
    for (const g of [...fixMetas(b.metas), ...fixMetas(a.metas)]) if (!gm.has(g.id) || g.u > gm.get(g.id).u) gm.set(g.id, g);
    const lm = new Map();
    for (const x of [...fixLog(b.tmLog), ...fixLog(a.tmLog)]) if (!lm.has(x.id) || x.u > lm.get(x.id).u) lm.set(x.id, x);
    const tl = new Map();
    for (const x of [...fixTl(b.tmTl), ...fixTl(a.tmTl)]) { const k = x[0] + x[2]; if (!tl.has(k) || x[1] > tl.get(k)[1]) tl.set(k, x); }
    const cm = new Map();
    for (const x of [...fixCal(b.cal), ...fixCal(a.cal)]) if (!cm.has(x.id) || x.u > cm.get(x.id).u) cm.set(x.id, x);
    const bm = new Map();
    for (const x of [...fixBooks(b.livros), ...fixBooks(a.livros)]) if (!bm.has(x.id) || x.u > bm.get(x.id).u) bm.set(x.id, x);
    const hm2 = new Map();
    for (const x of [...fixHabs(b.habs), ...fixHabs(a.habs)]) if (!hm2.has(x.id) || x.u > hm2.get(x.id).u) hm2.set(x.id, x);
    return { ratings: r, marked: m, off: b.off || a.off || [], best: Math.max(a.best || 0, b.best || 0), prefs: b.prefs || a.prefs, days: dd, tmDays: td, tmMan: mm,
      metas: [...gm.values()].sort((x, y) => x.c - y.c), tmLog: [...lm.values()].sort((x, y) => x.a - y.a),
      tmTl: fixTl([...tl.values()]), cal: [...cm.values()], habs: [...hm2.values()], livros: [...bm.values()] };
  }

  // ---------- levar os dados para outro Faro (outro endereço, outro navegador) ----------
  const xMsg = t => { $('xMsg').hidden = !t; $('xMsg').textContent = t; };
  function xShow(m) {
    const out = m === 'out', ta = $('xTa');
    $('xBox').hidden = false; $('xGo').hidden = $('xFile').hidden = out; $('xDl').hidden = !out || !!window.claude;
    ta.readOnly = out; ta.value = out ? JSON.stringify(snapshot()) : ''; ta.placeholder = out ? '' : 'cole aqui';
    $('xLb').textContent = out ? `Seus dados · ${Math.max(1, Math.round(ta.value.length / 1024))} KB` : 'Dados copiados do outro Faro';
    xMsg(''); ta.focus(); if (out) ta.select();
  }
  function xImport(txt) {
    let d = null; try { d = JSON.parse(String(txt).trim()); } catch (e) {}
    if (!d || typeof d !== 'object' || d.v !== 1 || !d.ratings || typeof d.ratings !== 'object') {
      xMsg('Não reconheci esses dados. No outro Faro, toque em "copiar meus dados" de novo e cole o texto inteiro, do começo ao fim.'); return;
    }
    adopt({ ...merge(snapshot(), { ...d, ratings: mig(d.ratings, d.rv), days: migDays(fixDays(d.days), d.rv), marked: fixMarked(d.marked) }), rv: RV });
    if (cloud) { clearTimeout(pushT); push(); }
    $('xBox').hidden = true;
    xMsg('Pronto: os dados foram juntados aos daqui, sem apagar nada.');
  }
  $('xOut').addEventListener('click', async () => {
    xShow('out');
    let ok = false; try { await navigator.clipboard.writeText($('xTa').value); ok = true; } catch (e) {}
    xMsg(ok ? 'Copiado. No outro Faro, abra Configurações › Dados › colar dados de outro Faro, e cole.'
      : 'O texto já está selecionado: copie (Ctrl+C, ou segure e copie no celular) e cole no outro Faro, em Configurações › Dados › colar dados de outro Faro.');
  });
  $('xIn').addEventListener('click', () => xShow('in'));
  $('xGo').addEventListener('click', () => xImport($('xTa').value));
  $('xX').addEventListener('click', () => { $('xBox').hidden = true; xMsg(''); });
  $('xFile').addEventListener('click', () => $('xF').click());
  $('xF').addEventListener('change', () => {
    const f = $('xF').files[0]; $('xF').value = ''; if (!f) return;
    f.text().then(xImport, () => xMsg('Não deu para abrir esse arquivo.'));
  });
  $('xDl').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([$('xTa').value], { type: 'application/json' }));
    a.download = `faro-dados-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  });

  // apaga o que o Faro guardou neste navegador (ao sair da conta, ou quando os dados daqui são de outra conta)
  const localWipe = () => { try { for (const k of Object.keys(localStorage)) if (k.startsWith('cm.')) localStorage.removeItem(k); } catch (e) {} };
  // db e user: a conta Claude (claude.ai) ou a conta do site (web), com a mesma forma
  async function cloudStart(db, user, web) {
    const id = await user.id(); if (!id) return;
    rkStart(db, user, id);
    const ref = db.doc(`data/users/${id}/exatas`);
    let snap; try { snap = await ref.get(); } catch (e) { if (web) acct(false, 'não deu para carregar a sua conta agora · o progresso fica neste navegador; recarregue a página para tentar de novo'); return; }
    const was = load('synced', false);
    // os dados deste navegador são de outra conta: começa limpo
    if (web && was && was !== id) { localWipe(); location.reload(); return; }
    const remote = snap.exists ? snap.data() : null, first = !was;
    if (remote) adopt(first ? { ...merge(snapshot(), { ...remote, ratings: mig(remote.ratings || {}, remote.rv), days: migDays(fixDays(remote.days), remote.rv), marked: fixMarked(remote.marked) }), rv: RV } : remote);
    cloud = ref;
    if (!remote || first) { await push(); if (!cloud) return; }
    save('synced', web ? id : true);
    const me = await user.me();
    acctName = me.name || ''; acctPhoto = me.avatarUrl || ''; drawProfile();
    acct(true, web ? `conta ${me.email} · o progresso fica salvo na conta e vale em qualquer aparelho`
      : `conta ${me.name || 'Claude'} · o rating, as marcadas, a evolução e as configurações ficam salvos e valem em qualquer aparelho`);
    // mudanças feitas em outro aparelho chegam aqui
    if (remote && remote.t > last) last = remote.t;
    ref.onSnapshot(s => { const d = s.exists && s.data(); if (d && !s.metadata.hasPendingWrites && !pushT && !pushing && d.t > last) { last = d.t; adopt(d); } }, () => {});
  }
  (async () => {
    acct(false, 'sem conta conectada · o rating, as marcadas e as configurações ficam só neste navegador');
    if (!window.claude || !claude.use) return;
    const [db, user] = await Promise.all([claude.use('db'), claude.use('user')]);
    if (db && user) cloudStart(db, user, false);
  })();
/*@WEB@*/

  const start = location.hash.slice(1);
  if (start === 'teoria' || start === 'exercicios') mode = start;
  applyPrefs(); syncSettings(); stats(); next(); calAutoRun(); calBadge(); drawLvBadge();
  if (VIEWS[start] && start !== 'treino') go(start); else go(mode);
  calBadge(); hbBadge();
