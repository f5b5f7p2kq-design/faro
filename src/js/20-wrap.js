  Object.assign(EXTRA, EXTRA_ADD);
  // cada tópico sorteia entre o gerador base e as variações extras válidas no nível
  for (const k in EXTRA) {
    const base = GEN[k].g;
    GEN[k].g = L => {
      for (let i = 0; i < 20; i++) {
        const j = ri(0, EXTRA[k].length);
        const q = j === EXTRA[k].length ? base(L) : EXTRA[k][j](L);
        if (q) { if (j < EXTRA[k].length) q._v = 'x' + j; return q; }
      }
      return base(L);
    };
  }
