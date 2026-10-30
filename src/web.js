  // ---------- contas do site (Supabase): entrar, criar conta, progresso em qualquer aparelho e ranking ----------
  // a chave publicável pode ficar no código: quem protege os dados são as regras do banco (cada um só vê o que é seu)
  // o site estável usa o banco de verdade; qualquer outro endereço (a versão de teste, o computador) usa o banco de teste
  const SB_ESTAVEL = location.hostname === 'farovest.vercel.app';
  const SB_URL = SB_ESTAVEL ? 'https://osiboauffnkqkjjvmpvv.supabase.co' : 'https://tyuaivehqcljbuyiolcc.supabase.co',
    SB_KEY = SB_ESTAVEL ? 'sb_publishable_V38yZQEpIBXnf8VmUAhpOA_oChBLz6-' : 'sb_publishable_gHGkOXL6jq7fuXdDHGblXA_ZC8KK-8K';
  if (!SB_ESTAVEL) { document.title += ' · teste'; document.body.insertAdjacentHTML('beforeend', '<div class="tst" aria-hidden="true">versão de teste</div>'); }
  const sb = SB_URL && window.supabase && supabase.createClient
    ? supabase.createClient(SB_URL, SB_KEY, { auth: { flowType: 'implicit', detectSessionInUrl: false, persistSession: true, autoRefreshToken: true, storageKey: 'faro.auth' } }) : null;
  // os links dos e-mails (confirmar a conta, nova senha) voltam com o resultado no endereço; lido antes de a navegação trocar o #
  const acLink = (() => {
    const h = new URLSearchParams(location.hash.slice(1)), q = new URLSearchParams(location.search);
    const r = h.has('access_token') || h.has('error_description') || h.has('message') ? h : q.has('error_description') ? q : null;
    if (r) history.replaceState(null, '', location.pathname);
    return r;
  })();
  let acUser = null, acTabV = 'in', acRecOn = false, acStarted = false, acBusyOn = false;
  const acHere = () => location.origin + location.pathname;
  const acNameOf = u => String((u.user_metadata && u.user_metadata.nome) || '').trim().slice(0, 40) || u.email.split('@')[0];
  const okPhoto = s => typeof s === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(s) && s.length < 40000 ? s : '';
  const acMsg = (t, bad) => { const m = $('acMsg'); m.hidden = !t; m.textContent = t || ''; m.classList.toggle('bad', !!bad); };
  const acErr = e => {
    const c = String(e && e.code || ''), m = String(e && e.message || '');
    if (c === 'invalid_credentials' || /invalid login/i.test(m)) return 'E-mail ou senha incorretos.';
    if (c === 'email_not_confirmed' || /not confirmed/i.test(m)) return 'Falta confirmar o e-mail: abra o link que enviamos quando você criou a conta (veja também o spam).';
    if (c === 'user_already_exists' || c === 'email_exists' || /already registered/i.test(m)) return 'Já existe uma conta com esse e-mail. Entre com a sua senha, ou use "esqueci a senha".';
    if (c === 'weak_password') return 'Essa senha é fraca demais. Use pelo menos 8 caracteres, misturando letras e números.';
    if (c === 'same_password') return 'A senha nova precisa ser diferente da atual.';
    if (c === 'email_address_not_authorized') return 'Ainda não dá para enviar e-mails para esse endereço: o envio de e-mails do Faro está sendo configurado. Tente de novo mais tarde.';
    if (c === 'email_address_invalid' || /invalid.*email|email.*invalid/i.test(m)) return 'Esse e-mail não parece válido.';
    if (c === 'signup_disabled') return 'A criação de contas está fechada no momento.';
    if (c.startsWith('over_') || (e && e.status === 429) || /rate limit|too many/i.test(m)) return 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.';
    if (/fetch|network|load failed/i.test(m)) return 'Sem conexão com o servidor. Confira a internet e tente de novo.';
    return 'Algo deu errado: ' + (m || 'tente de novo.');
  };
  const acBusy = on => { acBusyOn = on; for (const b of document.querySelectorAll('#vAcct button')) b.disabled = on; };

  // o progresso e o ranking no Supabase, com a mesma forma do banco do claude.ai que o resto do Faro já usa
  function sbCloud(u) {
    const rk = new Map(), snap = (exists, d) => ({ exists, data: () => d, metadata: { hasPendingWrites: false } });
    const pull = async () => {
      const { data, error } = await sb.from('progresso').select('dados').eq('user_id', u.id).maybeSingle();
      if (error) throw error;
      return snap(!!data, data && data.dados);
    };
    const doc = path => path.startsWith('rank/') ? {
      set: async v => { const { error } = await sb.from('ranking').upsert({ user_id: u.id, dados: { ...v, foto: okPhoto(prefs.photo), an: acNameOf(u) } }); if (error) throw error; },
      delete: async () => { const { error } = await sb.from('ranking').delete().eq('user_id', u.id); if (error) throw error; }
    } : {
      get: pull,
      set: async v => { const { error } = await sb.from('progresso').upsert({ user_id: u.id, t: +v.t || Date.now(), dados: v }); if (error) throw error; },
      // o aviso traz só a hora; os dados vêm de novo do banco quando são mais novos que os daqui
      onSnapshot: (cb, err) => {
        const check = async t => { if (t != null && !(+t > last)) return; try { cb(await pull()); } catch (e) { if (err) err(e); } };
        sb.channel('progresso-' + u.id)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'progresso', filter: 'user_id=eq.' + u.id }, p => check(p.new && p.new.t))
          .subscribe();
        // a conexão em tempo real pode cair com a aba parada: ao voltar, confere
        document.addEventListener('visibilitychange', () => { if (!document.hidden) check(null); });
      }
    };
    const collection = () => ({ limit: n => ({ onSnapshot: (cb, err) => {
      let t = null;
      const emit = () => cb({ docs: [...rk.entries()].map(([id, d]) => ({ id, data: () => d })) });
      const load_ = async () => {
        const since = new Date(Date.now() - 9 * 864e5).toISOString();
        const { data, error } = await sb.from('ranking').select('user_id,dados').gte('atualizado', since).limit(n);
        if (error) { if (err) err(error); return; }
        rk.clear(); for (const r of data) rk.set(r.user_id, r.dados || {}); emit();
      };
      load_(); setInterval(load_, 10 * 60000);
      sb.channel('ranking').on('postgres_changes', { event: '*', schema: 'public', table: 'ranking' }, p => {
        if (p.eventType === 'DELETE') { if (p.old) rk.delete(p.old.user_id); } else if (p.new) rk.set(p.new.user_id, p.new.dados || {});
        clearTimeout(t); t = setTimeout(emit, 300);
      }).subscribe();
    } }) });
    const user = {
      id: async () => u.id,
      me: async () => ({ name: acNameOf(u), avatarUrl: '', email: u.email }),
      can: async () => true,
      profiles: async ids => Object.fromEntries(ids.map(id => { const d = rk.get(id) || {}; return [id, { name: String(d.an || '').slice(0, 40), avatarUrl: okPhoto(d.foto) }]; }))
    };
    return { db: { doc, collection }, user };
  }

  // ---------- página Conta ----------
  PT.conta = ['CONTA', 'entre para salvar o progresso em qualquer aparelho'];
  VIEWS.conta = 'vAcct';
  meTo = () => sb && !acUser ? 'conta' : 'config';
  rkNoAcct = 'O ranking é para quem tem conta. Entre ou crie uma na página Conta, pelo menu.';
  const acQuick = document.createElement('button');
  acQuick.type = 'button'; acQuick.className = 'acq'; acQuick.id = 'acQuick'; acQuick.textContent = 'ENTRAR'; acQuick.hidden = true;
  acQuick.addEventListener('click', () => { go('conta'); scrollTo({ top: 0 }); });
  document.querySelector('.ph .qk').append(acQuick);
  // em Configurações › Dados, o caminho para a conta
  $('acct2').insertAdjacentHTML('afterend', '<div class="lk"><button type="button" id="acGoCfg">conta, entrar e sair</button></div>');
  $('acGoCfg').addEventListener('click', () => { go('conta'); scrollTo({ top: 0 }); });

  function acTab(v) {
    acTabV = v; const neu = v === 'new', fg = v === 'forgot';
    segOn('acTab', v); $('acTab').hidden = fg;
    $('acOutT').textContent = fg ? 'Esqueci a senha' : neu ? 'Criar conta' : 'Entrar';
    $('acNameRow').hidden = !neu; $('acPassRow').hidden = fg;
    $('acPass').autocomplete = neu ? 'new-password' : 'current-password';
    $('acGo').textContent = fg ? 'enviar o link' : neu ? 'criar a conta' : 'entrar';
    $('acHint').textContent = fg ? 'Mandamos um link para o seu e-mail. Abrindo o link, você escolhe uma senha nova.' : neu ? 'Senha com pelo menos 8 caracteres. Enviamos um link para confirmar o e-mail.' : '';
    $('acHint').hidden = !$('acHint').textContent;
    $('acForgot').hidden = fg; $('acBack').hidden = !fg;
  }
  function drawAcct() {
    $('acOff').hidden = !!sb;
    $('acRec').hidden = !(sb && acUser && acRecOn);
    $('acIn').hidden = !(sb && acUser && !acRecOn);
    $('acOut').hidden = !(sb && !acUser);
    if (acUser) $('acWho').textContent = acUser.email;
    if (!acUser) acTab(acTabV);
  }
  VDRAW.conta = drawAcct;
  function acSide() {
    const out = !!sb && !acUser;
    PT.conta[1] = !sb ? 'o progresso fica neste navegador' : out ? 'entre para salvar o progresso em qualquer aparelho' : 'o seu progresso, salvo em qualquer aparelho';
    syncSettings();
    $('me').querySelector('.ms').textContent = out ? 'entrar ou criar conta' : 'configurações';
    acQuick.hidden = !out;
  }

  $('acTab').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; acTab(b.dataset.v); acMsg(''); });
  $('acForgot').addEventListener('click', () => { acTab('forgot'); acMsg(''); $('acEmail').focus(); });
  $('acBack').addEventListener('click', () => { acTab('in'); acMsg(''); });
  $('acForm').addEventListener('submit', async e => {
    e.preventDefault(); if (!sb || acBusyOn) return;
    const email = $('acEmail').value.trim().toLowerCase(), pass = $('acPass').value, nome = $('acName').value.trim().slice(0, 40);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { acMsg('Confira o e-mail.', 1); $('acEmail').focus(); return; }
    if (acTabV !== 'forgot' && pass.length < 8) { acMsg('A senha precisa ter pelo menos 8 caracteres.', 1); $('acPass').focus(); return; }
    acBusy(true); acMsg('Um momento…');
    try {
      if (acTabV === 'forgot') {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: acHere() });
        if (error) throw error;
        acMsg(`Se existir uma conta com ${email}, enviamos um link para criar uma senha nova. Veja também o spam.`);
      } else if (acTabV === 'new') {
        const { data, error } = await sb.auth.signUp({ email, password: pass, options: { data: { nome }, emailRedirectTo: acHere() } });
        if (error) throw error;
        if (nome && !prefs.name) setPref('name', nome);
        if (data.user && Array.isArray(data.user.identities) && !data.user.identities.length) acMsg('Já existe uma conta com esse e-mail. Entre com a sua senha, ou use "esqueci a senha".', 1);
        else if (data.session) acMsg('');
        else if (!data.session) { acMsg(`Quase lá: enviamos um link para ${email}. Abra o e-mail e toque no link para ativar a conta (veja também o spam).`); $('acPass').value = ''; }
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
        acMsg(''); $('acPass').value = '';
      }
    } catch (err) { acMsg(acErr(err), 1); }
    acBusy(false);
  });
  $('acRecForm').addEventListener('submit', async e => {
    e.preventDefault(); if (acBusyOn) return;
    const pass = $('acNew').value;
    if (pass.length < 8) { acMsg('A senha precisa ter pelo menos 8 caracteres.', 1); return; }
    acBusy(true);
    const { error } = await sb.auth.updateUser({ password: pass });
    acBusy(false);
    if (error) { acMsg(acErr(error), 1); return; }
    acRecOn = false; $('acNew').value = ''; drawAcct(); acMsg('Senha nova salva. Você já está dentro da conta.');
  });
  // um formulário de cada vez na página da conta
  const acOnly = id => { for (const x of ['acEmForm', 'acPwForm', 'acDelBox']) $(x).hidden = x !== id; acMsg(''); };
  $('acEmBtn').addEventListener('click', () => { acOnly('acEmForm'); $('acEm').value = ''; $('acEm').focus(); });
  $('acEmNo').addEventListener('click', () => { $('acEmForm').hidden = true; });
  $('acEmForm').addEventListener('submit', async e => {
    e.preventDefault(); if (acBusyOn) return;
    const email = $('acEm').value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { acMsg('Confira o e-mail novo.', 1); $('acEm').focus(); return; }
    if (email === acUser.email) { acMsg('Esse já é o e-mail da conta.', 1); return; }
    acBusy(true);
    const { error } = await sb.auth.updateUser({ email }, { emailRedirectTo: acHere() });
    acBusy(false);
    if (error) { acMsg(acErr(error), 1); return; }
    $('acEmForm').hidden = true;
    acMsg(`Enviamos um link para ${email} e outro para ${acUser.email}. A troca vale depois que você abrir os dois (veja também o spam). Até lá, a conta continua com o e-mail atual.`);
  });
  $('acPwBtn').addEventListener('click', () => { acOnly('acPwForm'); $('acPw').focus(); });
  $('acPwNo').addEventListener('click', () => { $('acPwForm').hidden = true; $('acPw').value = ''; });
  $('acPwForm').addEventListener('submit', async e => {
    e.preventDefault(); if (acBusyOn) return;
    const pass = $('acPw').value;
    if (pass.length < 8) { acMsg('A senha precisa ter pelo menos 8 caracteres.', 1); return; }
    acBusy(true);
    const { error } = await sb.auth.updateUser({ password: pass });
    acBusy(false);
    if (error) { acMsg(acErr(error), 1); return; }
    $('acPwForm').hidden = true; $('acPw').value = ''; acMsg('Senha trocada.');
  });
  // sair: o que ainda não foi para a conta vai antes; depois este navegador fica limpo
  async function acLeave(del) {
    acBusy(true);
    if (!del && cloud) { clearTimeout(pushT); try { await push(); } catch (e) {} }
    if (del) { const { error } = await sb.rpc('apagar_conta'); if (error) { acBusy(false); acMsg(acErr(error), 1); return; } }
    await sb.auth.signOut({ scope: 'local' }).catch(() => {});
    localWipe(); location.replace(acHere() + (del ? '#conta' : ''));
  }
  $('acOutBtn').addEventListener('click', () => acLeave(false));
  $('acDelBtn').addEventListener('click', () => acOnly('acDelBox'));
  $('acDelNo').addEventListener('click', () => { $('acDelBox').hidden = true; });
  $('acDelYes').addEventListener('click', () => acLeave(true));

  // o e-mail pode mudar enquanto a conta ainda carrega (link de troca aberto com a sessão antiga)
  const acFoot = () => { if (cloud && acUser) acct(true, `conta ${acUser.email} · o progresso fica salvo na conta e vale em qualquer aparelho`); };
  function acSession(ev, session) {
    const u = session && session.user;
    if (u && !acUser) {
      acUser = u; acSide(); drawAcct();
      // quem trouxe progresso da versão do claude.ai: ele vira o progresso da conta antes da primeira leitura
      if (!acStarted) { acStarted = true; const c = sbCloud(u); sb.rpc('importar_meu_progresso').then(() => {}, () => {}).then(() => cloudStart(c.db, c.user, true)).then(acFoot); }
    } else if (u) { acUser = u; drawAcct(); acFoot(); }
    else if (!u && acUser) { localWipe(); location.replace(acHere()); } // saiu em outra aba
    else { acSide(); drawAcct(); }
  }
  if (sb) {
    acct(false, 'sem conta · o progresso fica só neste navegador. Para salvar em qualquer aparelho, entre ou crie uma conta.');
    sb.auth.onAuthStateChange((ev, session) => setTimeout(() => acSession(ev, session), 0));
    if (acLink) (async () => {
      const ty = acLink.get('type'), bad = acLink.get('error_description'), note = acLink.get('message');
      let msg = '', err = false;
      // troca de e-mail: o primeiro dos dois links só avisa que falta o outro
      if (note && !acLink.has('access_token')) msg = /other email|outro/i.test(note) ? 'Um dos links foi confirmado. Falta abrir o link enviado para o outro e-mail.' : note;
      else if (bad) { err = true; msg = /expired|invalid/i.test(bad) || acLink.get('error_code') === 'otp_expired' ? 'Esse link expirou ou já foi usado. Entre com e-mail e senha, ou peça outro em "esqueci a senha".' : 'Não deu para usar esse link: ' + bad; }
      else {
        const { error } = await sb.auth.setSession({ access_token: acLink.get('access_token'), refresh_token: acLink.get('refresh_token') });
        if (error) { err = true; msg = acErr(error); }
        else if (ty === 'recovery') acRecOn = true;
        else if (ty === 'signup') msg = 'E-mail confirmado. A sua conta está pronta.';
        else if (ty === 'email_change') msg = 'Pronto, o e-mail da conta foi trocado.';
      }
      go('conta'); drawAcct(); acMsg(msg, err);
    })();
  } else acct(false, 'o rating, as marcadas, o tempo e as configurações ficam salvos neste navegador');
  acSide();
