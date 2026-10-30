// contas no site: criar, confirmar, trazer o progresso antigo, sincronizar, ranking, sair, senha nova, apagar
const { chromium, devices } = require('playwright');
const { fakeSupabase } = require('./fake-supabase');
const fs = require('fs');
const URL0 = process.env.FARO_URL || 'http://localhost:8124/';
const OLD = process.env.FARO_OLD && JSON.parse(fs.readFileSync(process.env.FARO_OLD, 'utf8'));
const shots = process.env.SHOTS || '/tmp';
(async () => {
  const b = await chromium.launch(); const errs = []; let ok = 0, bad = 0;
  const check = (name, cond, extra = '') => { cond ? ok++ : bad++; console.log((cond ? 'ok   ' : 'FAIL ') + name + (extra ? ' · ' + extra : '')); };
  const S = fakeSupabase();
  if (OLD) S.importar.set('lumi@exemplo.com', OLD);
  const newPage = async (opt = { viewport: { width: 1280, height: 860 } }, tag) => {
    const c = await b.newContext(opt); await S.attach(c); const p = await c.newPage();
    p.on('pageerror', e => errs.push(tag + ': ' + e.message));
    p.on('console', m => { if (m.type() === 'error' && !/WebSocket|websocket|realtime|ERR_TUNNEL|net::/.test(m.text())) errs.push(tag + ': ' + m.text()); });
    return { c, p };
  };
  const ls = (p, k) => p.evaluate(k => { try { return JSON.parse(localStorage.getItem('cm.' + k)); } catch (e) { return null; } }, k);
  const msg = p => p.textContent('#acMsg');
  const nav = async (pg, h) => { await pg.goto(URL0 + h); await pg.reload(); await pg.waitForTimeout(900); };

  // 1. sem conta
  const A = await newPage(undefined, 'A'); let p = A.p;
  await p.goto(URL0); await p.waitForTimeout(600);
  check('sem conta: menu chama para entrar', (await p.textContent('#me .ms')) === 'entrar ou criar conta');
  await p.click('#me'); await p.waitForTimeout(200);
  check('menu leva à página Conta', await p.evaluate(() => document.body.dataset.view) === 'conta');
  await p.screenshot({ path: shots + '/c-d-entrar.png' });

  // 2. criar conta (com confirmação por e-mail)
  await p.click('#acTab [data-v="new"]');
  await p.fill('#acName', 'Lumi'); await p.fill('#acEmail', 'Lumi@Exemplo.com'); await p.fill('#acPass', 'curta');
  await p.click('#acGo'); check('senha curta é recusada', /8 caracteres/.test(await msg(p)));
  await p.fill('#acPass', 'senha-boa-123'); await p.click('#acGo'); await p.waitForTimeout(400);
  check('criar conta pede confirmação', /enviamos um link para lumi@exemplo\.com/.test(await msg(p)), await msg(p));
  await p.click('#acTab [data-v="in"]'); await p.fill('#acEmail', 'lumi@exemplo.com'); await p.fill('#acPass', 'senha-boa-123'); await p.click('#acGo'); await p.waitForTimeout(400);
  check('entrar antes de confirmar avisa', /confirmar o e-mail/.test(await msg(p)), await msg(p));
  // abre o link do e-mail (numa aba nova, como faria o app de e-mail)
  const conf = S.links.find(l => l.type === 'signup');
  await p.close(); p = await A.c.newPage(); p.on('pageerror', e => errs.push('A: ' + e.message));
  await p.goto(conf.url); await p.waitForTimeout(1200);
  check('link de confirmação entra na conta', !(await p.isHidden('#acIn')) && (await p.textContent('#acWho')) === 'lumi@exemplo.com');
  check('mensagem de e-mail confirmado', /E-mail confirmado/.test(await msg(p)), await msg(p));
  check('endereço sem o token', !/access_token/.test(p.url()), p.url());
  if (OLD) {
    check('progresso antigo foi trazido', (await ls(p, 'metas') || []).map(g => g.id + g.t).join() === OLD.metas.map(g => g.id + g.t).join(), (await ls(p, 'metas') || []).length + ' metas');
    check('marcadas antigas', (await ls(p, 'marked') || []).length === OLD.marked.length);
    check('tema antigo aplicado', (await ls(p, 'prefs')).theme === OLD.prefs.theme);
    check('importar foi consumido', !S.importar.has('lumi@exemplo.com'));
  }
  check('rodapé mostra a conta', /conta lumi@exemplo\.com/.test(await p.textContent('#acct')));
  check('menu volta a ser configurações', (await p.textContent('#me .ms')) === 'configurações' && !(await p.isVisible('#acQuick')));
  await p.screenshot({ path: shots + '/c-d-conta.png' });
  const uid = S.users.get('lumi@exemplo.com').id;
  check('progresso salvo no banco', S.progresso.has(uid));

  // 3. outro aparelho: entra e recebe; muda algo e o primeiro recebe ao voltar para a aba
  const B = await newPage({ ...devices['iPhone 13'] }, 'B'); const q = B.p;
  await q.goto(URL0); await q.waitForTimeout(600);
  check('celular: botão ENTRAR no topo', await q.isVisible('#acQuick'));
  await q.click('#acQuick'); await q.waitForTimeout(200);
  check('celular: ENTRAR abre a Conta e some', await q.evaluate(() => document.body.dataset.view) === 'conta' && !(await q.isVisible('#acQuick')));
  await q.screenshot({ path: shots + '/c-m-entrar.png' });
  await q.fill('#acEmail', 'lumi@exemplo.com'); await q.fill('#acPass', 'errada-errada'); await q.click('#acGo'); await q.waitForTimeout(300);
  check('senha errada', (await msg(q)) === 'E-mail ou senha incorretos.');
  await q.fill('#acPass', 'senha-boa-123'); await q.click('#acGo'); await q.waitForTimeout(1200);
  check('celular entrou', !(await q.isHidden('#acIn')));
  if (OLD) check('celular recebeu as metas', ((await ls(q, 'metas')) || []).length === OLD.metas.length);
  await q.screenshot({ path: shots + '/c-m-conta.png' });
  // muda o tema no celular
  await nav(q, '#config');
  const tm0 = (await ls(q, 'prefs')).theme, tm1 = tm0 === 'claro' ? 'escuro' : 'claro';
  await q.click(`#cTheme [data-v="${tm1}"]`); await q.waitForTimeout(2000);
  check('mudança foi para o banco', S.progresso.get(uid).dados.prefs.theme === tm1);
  await p.evaluate(() => document.dispatchEvent(new Event('visibilitychange'))); await p.waitForTimeout(800);
  check('computador recebeu a mudança', (await ls(p, 'prefs')).theme === tm1);

  // 4. ranking
  await nav(q, '#ranking');
  await q.click('#rkJoin'); await q.waitForTimeout(500);
  check('entrou no ranking', S.ranking.has(uid) && S.ranking.get(uid).an === 'Lumi', JSON.stringify(Object.keys(S.ranking.get(uid) || {})));
  check('nota do ranking', !/claude\.ai/.test(await q.textContent('#rkNote')));

  // 5. sair
  await nav(p, '#conta');
  await p.click('#acOutBtn'); await p.waitForTimeout(1200);
  check('saiu: navegador limpo', (await p.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('cm.') && k !== 'cm.mode' && k !== 'cm.rv').length)) <= 3,
    await p.evaluate(() => Object.keys(localStorage).join(',')));
  check('saiu: volta a pedir para entrar', (await p.textContent('#me .ms')) === 'entrar ou criar conta');
  check('saiu: progresso continua no banco', S.progresso.has(uid));

  // 6. esqueci a senha
  await p.click('#me'); await p.click('#acForgot'); await p.fill('#acEmail', 'lumi@exemplo.com'); await p.click('#acGo'); await p.waitForTimeout(400);
  check('pedido de senha nova', /enviamos um link para criar uma senha nova/.test(await msg(p)));
  const rec = S.links.filter(l => l.type === 'recovery').pop();
  await p.close(); p = await A.c.newPage(); p.on('pageerror', e => errs.push('A: ' + e.message));
  await p.goto(rec.url); await p.waitForTimeout(1200);
  check('link de senha nova abre o formulário', !(await p.isHidden('#acRec')));
  await p.fill('#acNew', 'outra-senha-456'); await p.click('#acRecForm [type="submit"]'); await p.waitForTimeout(500);
  check('senha nova salva', S.users.get('lumi@exemplo.com').password === 'outra-senha-456' && !(await p.isHidden('#acIn')), await msg(p));

  // 7. e-mail já usado
  const C = await newPage(undefined, 'C'); const r = C.p;
  await r.goto(URL0 + '#conta'); await r.waitForTimeout(600);
  await r.click('#acTab [data-v="new"]'); await r.fill('#acEmail', 'lumi@exemplo.com'); await r.fill('#acPass', 'qualquer-coisa'); await r.click('#acGo'); await r.waitForTimeout(400);
  check('e-mail já usado', /Já existe uma conta/.test(await msg(r)));

  // 8. apagar a conta
  await p.click('#acDelBtn'); await p.waitForTimeout(100);
  await p.screenshot({ path: shots + '/c-d-apagar.png' });
  await p.click('#acDelYes'); await p.waitForTimeout(1200);
  check('conta apagada', !S.users.has('lumi@exemplo.com') && !S.progresso.has(uid) && !S.ranking.has(uid));
  check('depois de apagar, sem conta', (await p.textContent('#me .ms')) === 'entrar ou criar conta');

  console.log(`\n${ok} ok, ${bad} falhas`); console.log('erros', errs);
  await b.close(); process.exit(bad || errs.length ? 1 : 0);
})();
