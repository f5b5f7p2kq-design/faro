# Monta public/unicamp.json, o banco de questões da Unicamp no formato do treino do Faro.
# Lê banco/unicamp/ANO.json (a fonte, uma lista de itens por vestibular) e adapta cada item ao jeito do Faro:
#   - alternativa que é só número (com a mesma unidade nas quatro) vira resposta digitada;
#   - resposta aproximada com 4 ou mais algarismos significativos é arredondada a 3, aceitando 2% de erro,
#     para dar conta de cabeça com √2 ≈ 1,41, √3 ≈ 1,73 e π ≈ 3,14;
#   - resposta muito grande ou muito pequena (3 × 10²⁰, 4,2 × 10⁻⁵) vira mantissa digitada, com a potência de 10 na unidade;
#   - a origem (src) fica só na fonte: o Faro não mostra de onde a questão foi tirada;
#   - avisa quando um enunciado passa de 250 caracteres (o comando deve ser curto).
# uso: python3 banco/montar.py   (o build.sh já chama)
import glob, json, math, os, re

H = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(H, '..', 'public', 'unicamp.json')

SUP = str.maketrans('⁰¹²³⁴⁵⁶⁷⁸⁹⁻', '0123456789-')
NUM = re.compile(r'^\s*(R\$\s*)?([−-]?\d{1,3}(?:\.\d{3})+(?:,\d+)?|[−-]?\d+(?:,\d+)?)(\s*)(?:[×x·]\s*10([⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+))?\s*(.*?)\s*\.?\s*$')


def opt_num(o):
    """'6.200 m/s.' → (6200, 0, 'm/s'); None se a alternativa não for só um número com unidade"""
    m = NUM.match(re.sub(r'<(?!/?su[bp]>)[^>]+>', '', o).strip())
    if not m:
        return None
    rs, n, sp, e, u = m.groups()
    if u and (u[0] in '/+−-' or (not sp and not e and re.match(r'[A-Za-z]', u))):
        return None  # 1/n, 3kq/R, 4d₁: é expressão, não unidade
    if re.search(r'\d', re.sub(r'<su[bp]>\d+</su[bp]>', '', u)) or len(u) > 14 or re.search(r'\b(e|ou|a|de|vezes|maior|menor|nos|para)\b', u):
        return None
    v = float(n.replace('−', '-').replace('.', '').replace(',', '.'))
    k = int(e.translate(SUP)) if e else 0
    return v * 10 ** k, k, ('R$ ' if rs else '') + u.strip(), n


def sig(x):
    s = ('%.10g' % abs(x)).split('e')[0].replace('.', '').lstrip('0').rstrip('0')
    return len(s)


def r3(x):
    if x == 0:
        return 0
    d = 3 - int(math.floor(math.log10(abs(x)))) - 1
    v = round(x, d)
    return int(v) if v == int(v) and abs(v) >= 100 else v


SUPS = str.maketrans('0123456789-', '⁰¹²³⁴⁵⁶⁷⁸⁹⁻')


def sci(q):
    """a = 3e20 → a = 3 e unidade '× 10²⁰ …': não dá para digitar 21 algarismos"""
    a, tol = q['a'], q.get('tol', 0)
    if not a or not (abs(a) < 1e-3 or (abs(a) >= 1e6 and (tol or a != int(a) or abs(a) >= 1e9))):
        return q
    k = math.floor(math.log10(abs(a)))
    m = a / 10 ** k
    m = r3(m) if tol else round(m, 6)
    if abs(m) >= 10:
        m, k = m / 10, k + 1
    q['a'] = int(m) if m == int(m) else m
    q['u'] = '× 10' + str(k).translate(SUPS) + (' ' + q['u'] if q.get('u') else '')
    return q


def adapt(it):
    q = {k: it[k] for k in ('id', 's', 't', 'r', 'tm', 'ctx') if k in it}
    if 'fig' in it:
        q['fig'] = it['fig']
    q['d'], q['h'] = it['d'], it['h']
    if 'opts' in it:
        P = [opt_num(o) for o in it['opts']]
        binary = all(re.fullmatch(r'[01]{4,}\.?', o.strip()) for o in it['opts'])
        if all(P) and len({p[2] for p in P}) == 1 and abs(P[0][1]) < 4 and not binary:
            a = P[0][0]
            gap = min(abs(p[0] - a) for p in P[1:]) / abs(a) if a else 1
            q['a'] = a
            if P[0][2]:
                q['u'] = P[0][2]
            if ',' in P[0][3] or re.search(r'aproximad|cerca de|estim', it['ctx'], re.I):
                q['tol'] = round(max(0.005, min(0.03, gap / 2.5)), 3)
            if it['fase'] == 1 and it['ano'] >= 2011:
                q['r'] = min(2500, it['r'] + 80)  # digitar não tem chute: um pouco mais difícil que marcar
            return sci(q)
        q['opts'], q['a'] = it['opts'], 0
        return q
    a, tol = it['a'], it.get('tol') or 0
    if tol >= 0.001 and sig(a) >= 4:
        a, tol = r3(a), max(tol, 0.02)
    q['a'] = a
    if it.get('u'):
        q['u'] = it['u']
    if tol:
        q['tol'] = tol
    return sci(q)


items, n_typed = [], 0
for fn in sorted(glob.glob(os.path.join(H, 'unicamp', '*.json'))):
    for it in json.load(open(fn, encoding='utf-8')):
        q = adapt(it)
        n_typed += 'opts' not in q and 'opts' in it
        items.append(q)
json.dump(items, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
mc = sum('opts' in q for q in items)
print(f'unicamp.json: {len(items)} questões, {len(items) - mc} digitadas ({n_typed} eram alternativas), {mc} de alternativa, {os.path.getsize(OUT) // 1024} KB')
# o Faro é para descontração: comando curto (até ~200 caracteres, no máximo 250), mesmo com problema difícil
longos = [(q['id'], n) for q in items if (n := len(re.sub(r'<[^>]+>', '', q['ctx']))) > 250]
if longos:
    print(f'aviso: {len(longos)} enunciado(s) com mais de 250 caracteres:', ', '.join(f'{i} ({n})' for i, n in longos))
