// Um Supabase de mentira para os testes: responde às rotas de auth e REST que o Faro usa,
// com as mesmas regras do banco de verdade (cada um só lê e escreve o que é seu).
const crypto = require('crypto');
const b64u = o => Buffer.from(JSON.stringify(o)).toString('base64url');
function fakeSupabase({ autoconfirm = false } = {}) {
  const S = { users: new Map(), tokens: new Map(), progresso: new Map(), ranking: new Map(), importar: new Map(), links: [], emailTokens: new Set(), autoconfirm, calls: [] };
  const userOut = u => ({ id: u.id, aud: 'authenticated', role: 'authenticated', email: u.email, email_confirmed_at: u.confirmed ? '2026-10-30T00:00:00Z' : null,
    user_metadata: u.meta, app_metadata: { provider: 'email' }, identities: [{ id: u.id, user_id: u.id, provider: 'email', identity_data: { email: u.email } }], created_at: '2026-10-30T00:00:00Z' });
  const session = u => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const at = `${b64u({ alg: 'HS256', typ: 'JWT' })}.${b64u({ sub: u.id, email: u.email, exp, role: 'authenticated', aud: 'authenticated' })}.sig`;
    const rt = crypto.randomBytes(8).toString('hex');
    S.tokens.set(at, u.id); S.tokens.set('rt:' + rt, u.id);
    return { access_token: at, token_type: 'bearer', expires_in: 3600, expires_at: exp, refresh_token: rt, user: userOut(u) };
  };
  const link = (u, type, redirect) => { const s = session(u); S.links.push({ email: u.email, type, url: `${redirect}#access_token=${s.access_token}&refresh_token=${s.refresh_token}&expires_in=3600&token_type=bearer&type=${type}` }); };
  const err = (status, code, msg) => ({ status, body: { code: status, error_code: code, msg } });
  const who = req => S.tokens.get((req.headers()['authorization'] || '').replace(/^Bearer /, ''));
  const byId = id => [...S.users.values()].find(u => u.id === id);
  const eq = (url, k) => { const v = url.searchParams.get(k); return v && v.startsWith('eq.') ? v.slice(3) : null; };
  function handle(req) {
    const url = new URL(req.url()), p = url.pathname, m = req.method(); let body = null;
    try { body = req.postData() ? JSON.parse(req.postData()) : null; } catch (e) {}
    S.calls.push(m + ' ' + p);
    const uid = who(req), me = uid && byId(uid);
    if (p === '/auth/v1/signup' && m === 'POST') {
      const email = String(body.email).toLowerCase(); const old = S.users.get(email);
      if (old) return { status: 200, body: { ...userOut(old), identities: [] } };
      const u = { id: crypto.randomUUID(), email, password: body.password, meta: body.data || {}, confirmed: S.autoconfirm };
      S.users.set(email, u);
      if (S.autoconfirm) return { status: 200, body: session(u) };
      link(u, 'signup', url.searchParams.get('redirect_to')); return { status: 200, body: userOut(u) };
    }
    if (p === '/auth/v1/token' && m === 'POST') {
      if (url.searchParams.get('grant_type') === 'refresh_token') { const id = S.tokens.get('rt:' + body.refresh_token); return id ? { status: 200, body: session(byId(id)) } : err(400, 'refresh_token_not_found', 'Invalid Refresh Token'); }
      const u = S.users.get(String(body.email).toLowerCase());
      if (!u || u.password !== body.password) return err(400, 'invalid_credentials', 'Invalid login credentials');
      if (!u.confirmed) return err(400, 'email_not_confirmed', 'Email not confirmed');
      return { status: 200, body: session(u) };
    }
    if (p === '/auth/v1/user' && m === 'GET') {
      if (!me) return err(401, 'bad_jwt', 'invalid JWT'); me.confirmed = true;
      // o segundo link da troca de e-mail aplica o e-mail novo
      const tk = (req.headers()['authorization'] || '').replace(/^Bearer /, '');
      if (me.pending && S.emailTokens.has(tk)) { S.users.delete(me.email); me.email = me.pending; me.pending = null; S.users.set(me.email, me); }
      return { status: 200, body: userOut(me) };
    }
    if (p === '/auth/v1/user' && m === 'PUT' && body.email) {
      if (!me) return err(401, 'bad_jwt', 'invalid JWT');
      const ne = String(body.email).toLowerCase(); if (S.users.has(ne)) return err(422, 'email_exists', 'A user with this email address has already been registered');
      me.pending = ne; const redirect = url.searchParams.get('redirect_to');
      S.links.push({ email: me.email, type: 'email_change_old', url: `${redirect}#message=Confirmation+link+accepted.+Please+proceed+to+confirm+link+sent+to+the+other+email` });
      const s2 = session(me); S.emailTokens.add(s2.access_token);
      S.links.push({ email: ne, type: 'email_change', url: `${redirect}#access_token=${s2.access_token}&refresh_token=${s2.refresh_token}&expires_in=3600&token_type=bearer&type=email_change` });
      return { status: 200, body: userOut(me) };
    }
    if (p === '/auth/v1/user' && m === 'PUT') { if (!me) return err(401, 'bad_jwt', 'invalid JWT'); if (body.password) { if (body.password === me.password) return err(422, 'same_password', 'New password should be different'); me.password = body.password; } return { status: 200, body: userOut(me) }; }
    if (p === '/auth/v1/recover' && m === 'POST') { const u = S.users.get(String(body.email).toLowerCase()); if (u) link(u, 'recovery', url.searchParams.get('redirect_to')); return { status: 200, body: {} }; }
    if (p === '/auth/v1/logout') return { status: 204, body: null };
    if (p === '/rest/v1/rpc/importar_meu_progresso') {
      if (!me) return { status: 200, body: false };
      const d = S.importar.get(me.email); if (!d || S.progresso.has(me.id)) return { status: 200, body: false };
      S.progresso.set(me.id, { t: d.t || 0, dados: d }); S.importar.delete(me.email); return { status: 200, body: true };
    }
    if (p === '/rest/v1/rpc/apagar_conta') { if (me) { S.users.delete(me.email); S.progresso.delete(me.id); S.ranking.delete(me.id); } return { status: 204, body: null }; }
    if (p === '/rest/v1/progresso') {
      if (!me) return { status: 401, body: { message: 'no auth' } };
      if (m === 'GET') { const id = eq(url, 'user_id'); const r = id === me.id && S.progresso.get(id); return { status: 200, body: r ? [{ dados: r.dados }] : [] }; }
      if (m === 'POST') { for (const r of [].concat(body)) { if (r.user_id !== me.id) return { status: 403, body: { message: 'RLS' } }; S.progresso.set(r.user_id, { t: r.t, dados: r.dados }); } return { status: 201, body: null }; }
    }
    if (p === '/rest/v1/ranking') {
      if (!me) return { status: 401, body: { message: 'no auth' } };
      if (m === 'GET') return { status: 200, body: [...S.ranking.entries()].map(([user_id, dados]) => ({ user_id, dados })) };
      if (m === 'POST') { for (const r of [].concat(body)) { if (r.user_id !== me.id) return { status: 403, body: { message: 'RLS' } }; S.ranking.set(r.user_id, r.dados); } return { status: 201, body: null }; }
      if (m === 'DELETE') { const id = eq(url, 'user_id'); if (id === me.id) S.ranking.delete(id); return { status: 204, body: null }; }
    }
    return { status: 404, body: { message: 'fake: no route ' + m + ' ' + p } };
  }
  S.attach = async ctx => {
    await ctx.route(/^https:\/\/\w+\.supabase\.co\//, async route => {
      const req = route.request();
      if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
      const r = handle(req);
      await route.fulfill({ status: r.status, headers: { 'access-control-allow-origin': '*', 'content-type': 'application/json' }, body: r.body == null ? '' : JSON.stringify(r.body) });
    });
  };
  return S;
}
module.exports = { fakeSupabase };
