  // ================== FÓRMULAS: reconhecer, nomear e isolar, sem contas ==================
  // h é a resolução (fórmula + o que ela diz), t é a dica que não entrega a resposta
  const fx = (l, r) => l ? `${l} = ${r}` : r;
  const about = n => ABOUT[n] ? ` <span class="d">(${ABOUT[n]})</span>` : '';
  const mct = (o, t) => Object.assign(mc(o), { t: t || '' });
  const fsol = it => `<b>${fx(it[1], it[2])}</b> ${it[0]}${ABOUT[it[0]] ? ` (${ABOUT[it[0]]})` : ''}${FDESC[it[0]] ? `: ${FDESC[it[0]]}` : ''}`;
  FORMS.forEach(([key, s, name, , items, iso]) => {
    // legenda: os termos da pergunta e de todas as alternativas, para não apontar a certa
    const byR = new Map(items.map(x => [x[2], x[0]]));
    const withLg = (q, parts) => Object.assign(q, { lg: legend(key, parts) });
    const lv = [
      // fácil: dado o nome, achar o lado direito entre fórmulas do mesmo tópico
      L => { const it = pick(items), others = items.filter(x => x !== it && x[2] !== it[2]).map(x => x[2]);
        const q = mct({ ctx: it[0] + about(it[0]), q: `${it[1]} = ?`, ok: it[2], no: others, h: fsol(it) }, FDESC[it[0]]);
        return withLg(q, [[it[1], it[0]], ...q.opts.map(o => [o, byR.get(o) || it[0]])]); },
      // médio: dada a fórmula, achar o nome (com o assunto, para quem conhece a lei pelo que ela faz)
      L => { if (L < 1) return null; const it = pick(items), others = items.filter(x => x !== it && fx(x[1], x[2]) !== fx(it[1], it[2]));
        const nm = x => x[0] + (ABOUT[x[0]] ? ` · ${ABOUT[x[0]]}` : '');
        return withLg(mct({ ctx: 'Esta fórmula é:', q: fx(it[1], it[2]), ok: nm(it), no: others.map(nm), h: fsol(it) }, FDESC[it[0]]), [[fx(it[1], it[2]), it[0]]]); },
      // difícil: alternativas quase iguais
      L => { if (L < 2) return null; const it = pick(items);
        const q = mct({ ctx: it[0] + about(it[0]), q: `${it[1]} = ?`, ok: it[2], no: it[3], h: fsol(it) }, FDESC[it[0]]);
        return withLg(q, [[it[1], it[0]], ...q.opts.map(o => [o, it[0]])]); },
      // isolar ou rearranjar, sem números
      L => { if (L < 1 || !iso.length) return null; const [c, q, ok, no] = pick(iso);
        const r = mct({ ctx: c, q, ok, no, h: `<b>${ok}</b>${ISOH[c] ? ` ${ISOH[c]}` : ''}` }, ISOH[c]);
        return withLg(r, [[q, c], ...r.opts.map(o => [o, c])]); },
    ];
    topic(key, s, name, lv);
    GEN[key].form = true;
  });

  // ================== TEORIA: leis, teoremas e constantes ==================
  // [chave, matéria, nome, [[nome, enunciado ou valor, [erradas]]]]
  LAWS.forEach(([key, s, name, items]) => {
    const isK = key[0] === 'K';
    const sol = it => `<b>${it[0]}</b>${ABOUT[it[0]] ? ` (${ABOUT[it[0]]})` : ''}: ${it[1]}`;
    const ask = it => isK ? `Valor de: ${it[0]}` : `O que diz: ${it[0]}${about(it[0])}?`;
    const tip = it => isK ? 'Pense na ordem de grandeza e na unidade: a alternativa com unidade errada já cai.'
      : ABOUT[it[0]] ? `Assunto da resposta: ${ABOUT[it[0]]}.` : 'Elimine as alternativas que falam de outro assunto.';
    const lv = [
      L => { const it = pick(items);
        return mct({ ctx: ask(it), q: '', ok: it[1], no: items.filter(x => x !== it).map(x => x[1]), h: sol(it) }, isK ? tip(it) : 'Elimine as alternativas que falam de outro assunto: só uma combina com o nome.'); },
      L => { if (L < 1) return null; const it = pick(items);
        return mct({ ctx: isK ? 'Este valor é:' : `Qual lei ou princípio diz isto?<br>“${it[1]}”`, q: isK ? it[1] : '', ok: it[0], no: items.filter(x => x !== it).map(x => x[0]), h: sol(it) }, tip(it)); },
      L => { if (L < 2) return null; const it = pick(items);
        return mct({ ctx: ask(it), q: '', ok: it[1], no: it[2], h: sol(it) }, isK ? tip(it) : 'Leia cada palavra: as alternativas trocam um detalhe só.'); },
    ];
    topic(key, s, name, lv);
    GEN[key].form = true;
  });
