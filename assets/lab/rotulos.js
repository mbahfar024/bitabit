// Bit a bit · Rótulos con líneas guía (escenas en 2D)
// Todas las piezas llevan su rótulo a la vez: se ordenan en dos columnas, a los
// lados del objeto, y una línea guía lleva de cada rótulo a su pieza.
const NS = 'http://www.w3.org/2000/svg';
const MARGEN = 6;
const SEP = 18;
const GAP = 5;

export function crearRotulos(capa, { alPulsar } = {}) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'guias');
  svg.setAttribute('aria-hidden', 'true');
  capa.appendChild(svg);
  const items = new Map();

  function nuevaGuia() {
    const g = document.createElementNS(NS, 'g');
    const halo = document.createElementNS(NS, 'polyline');
    halo.setAttribute('class', 'halo');
    const linea = document.createElementNS(NS, 'polyline');
    linea.setAttribute('class', 'linea');
    const punto = document.createElementNS(NS, 'circle');
    punto.setAttribute('r', '2.6');
    g.append(halo, linea, punto);
    svg.appendChild(g);
    let ultimo = '';
    return {
      poner(puntos) {
        const p = puntos.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
        if (p !== ultimo) {
          halo.setAttribute('points', p);
          linea.setAttribute('points', p);
          const [x, y] = puntos[puntos.length - 1];
          punto.setAttribute('cx', x.toFixed(1));
          punto.setAttribute('cy', y.toFixed(1));
          ultimo = p;
        }
        g.style.display = '';
      },
      ocultar() {
        g.style.display = 'none';
      },
    };
  }

  function definir(lista) {
    for (const it of items.values()) {
      it.el.remove();
      it.guia.ocultar();
    }
    items.clear();
    for (const d of lista) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'etq' + (d.clase ? ' ' + d.clase : '');
      const n = document.createElement('span');
      n.className = 'etq-nombre';
      n.textContent = d.texto;
      b.appendChild(n);
      const v = document.createElement('span');
      v.className = 'etq-valor';
      v.hidden = true;
      b.appendChild(v);
      b.hidden = true;
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        alPulsar?.(d.id);
      });
      capa.appendChild(b);
      items.set(d.id, { ...d, el: b, nombre: n, valorEl: v, guia: nuevaGuia(), w: 0, h: 0, medir: true, prio: d.prio ?? 3 });
    }
  }

  // anclas: { id: {x, y} } en píxeles de la capa; caja: {x0, x1, y0, y1} del objeto
  function colocar({ anclas, caja, ancho, alto, margenSup = 8, mostrar = true, valores = {}, lados = {} }) {
    const vivos = [];
    for (const it of items.values()) {
      const a = anclas[it.id];
      const v = valores[it.id];
      if (v != null) {
        if (it.valorEl.textContent !== v) {
          if (it.valorEl.textContent.length !== String(v).length) it.medir = true;
          it.valorEl.textContent = v;
        }
        if (it.valorEl.hidden) {
          it.valorEl.hidden = false;
          it.medir = true;
        }
      } else if (!it.valorEl.hidden) {
        it.valorEl.hidden = true;
        it.medir = true;
      }
      if (!mostrar || !a) {
        it.el.hidden = true;
        it.guia.ocultar();
        continue;
      }
      it.ax = a.x;
      it.ay = a.y;
      vivos.push(it);
    }
    for (const it of vivos) it.el.hidden = false;
    for (const it of vivos)
      if (it.medir || !it.w) {
        it.w = it.el.offsetWidth;
        it.h = it.el.offsetHeight;
        it.medir = false;
      }
    const centro = (caja.x0 + caja.x1) / 2;
    const izq = [];
    const der = [];
    for (const it of vivos) {
      const lado = lados[it.id] || (it.ax < centro ? 'izq' : 'der');
      (lado === 'izq' ? izq : der).push(it);
    }
    while (Math.abs(izq.length - der.length) > 2) {
      const [mas, menos] = izq.length > der.length ? [izq, der] : [der, izq];
      let k = 0;
      mas.forEach((it, i) => {
        if (!lados[it.id] && Math.abs(it.ax - centro) < Math.abs(mas[k].ax - centro)) k = i;
      });
      menos.push(mas.splice(k, 1)[0]);
    }
    const sup = margenSup;
    const inf = alto - MARGEN;
    for (const [lista, lado] of [
      [izq, 'izq'],
      [der, 'der'],
    ]) {
      if (!lista.length) continue;
      lista.sort((a, b) => a.ay - b.ay);
      let total = lista.reduce((s, it) => s + it.h + GAP, -GAP);
      while (total > inf - sup && lista.length > 1) {
        let peor = 0;
        lista.forEach((it, i) => {
          if (it.prio < lista[peor].prio) peor = i;
        });
        total -= lista[peor].h + GAP;
        lista[peor].oculto = true;
        lista.splice(peor, 1);
      }
      let y = sup;
      for (const it of lista) {
        it.top = Math.max(it.ay - it.h / 2, y);
        y = it.top + it.h + GAP;
      }
      let lim = inf;
      for (let i = lista.length - 1; i >= 0; i--) {
        const it = lista[i];
        if (it.top + it.h > lim) it.top = lim - it.h;
        lim = it.top - GAP;
      }
      for (const it of lista) {
        it.lado = lado;
        it.left = lado === 'izq' ? Math.max(MARGEN, caja.x0 - SEP - it.w) : Math.min(ancho - MARGEN - it.w, caja.x1 + SEP);
      }
    }
    for (const it of vivos) {
      if (it.oculto) {
        it.oculto = false;
        it.el.hidden = true;
        it.guia.ocultar();
        continue;
      }
      it.el.style.transform = `translate(${it.left.toFixed(1)}px, ${it.top.toFixed(1)}px)`;
      const cy = it.top + it.h / 2;
      const bx = it.lado === 'izq' ? it.left + it.w : it.left;
      const dir = it.lado === 'izq' ? 1 : -1;
      it.guia.poner([
        [bx, cy],
        [bx + dir * 8, cy],
        [it.ax, it.ay],
      ]);
    }
  }
  // Modo «cerca»: cada rótulo junto a su pieza, en el primer hueco libre (por orden de
  // prioridad) que no pise otros rótulos ni las zonas prohibidas. Si no cabe, se oculta.
  function colocarCerca({ anclas, ancho, alto, margenSup = 8, mostrar = true, valores = {}, prohibidas = [], minPrio = 0 }) {
    const vivos = [];
    for (const it of items.values()) {
      const a = anclas[it.id];
      const v = valores[it.id];
      if (v != null) {
        if (it.valorEl.textContent !== v) {
          if (it.valorEl.textContent.length !== String(v).length) it.medir = true;
          it.valorEl.textContent = v;
        }
        if (it.valorEl.hidden) {
          it.valorEl.hidden = false;
          it.medir = true;
        }
      } else if (!it.valorEl.hidden) {
        it.valorEl.hidden = true;
        it.medir = true;
      }
      if (!mostrar || !a || it.prio < minPrio) {
        it.el.hidden = true;
        it.guia.ocultar();
        continue;
      }
      it.ax = a.x;
      it.ay = a.y;
      vivos.push(it);
    }
    for (const it of vivos) it.el.hidden = false;
    for (const it of vivos)
      if (it.medir || !it.w) {
        it.w = it.el.offsetWidth;
        it.h = it.el.offsetHeight;
        it.medir = false;
      }
    vivos.sort((a, b) => b.prio - a.prio);
    const puestas = prohibidas.map((z) => ({ ...z }));
    const pisa = (r, propia) => puestas.some((q) => (!propia || q.id !== propia) && r.x0 < q.x1 && r.x1 > q.x0 && r.y0 < q.y1 && r.y1 > q.y0);
    for (const it of vivos) {
      const { ax, ay, w, h } = it;
      const cand = [];
      // Los rótulos menos importantes no se alejan de su pieza
      for (const d of it.prio < 5 ? [16, 34, 58] : [16, 34, 58, 86, 120, 160]) {
        cand.push([ax - w / 2, ay - h - d], [ax - w / 2, ay + d], [ax + d, ay - h / 2], [ax - w - d, ay - h / 2], [ax + d * 0.7, ay - h - d * 0.7], [ax - w - d * 0.7, ay - h - d * 0.7], [ax + d * 0.7, ay + d * 0.7], [ax - w - d * 0.7, ay + d * 0.7]);
      }
      let elegido = null;
      for (const [x, y] of cand) {
        const r = { x0: x - 2, y0: y - 2, x1: x + w + 2, y1: y + h + 2 };
        if (x < MARGEN || y < margenSup || x + w > ancho - MARGEN || y + h > alto - MARGEN) continue;
        if (!pisa(r, it.zona)) {
          elegido = { x, y, r };
          break;
        }
      }
      if (!elegido) {
        it.el.hidden = true;
        it.guia.ocultar();
        continue;
      }
      puestas.push(elegido.r);
      it.left = elegido.x;
      it.top = elegido.y;
      it.el.style.transform = `translate(${it.left.toFixed(1)}px, ${it.top.toFixed(1)}px)`;
      // La guía sale del punto del borde del rótulo más cercano a la pieza
      const bx = Math.min(Math.max(ax, it.left), it.left + w);
      const by = Math.min(Math.max(ay, it.top), it.top + h);
      it.guia.poner([
        [bx, by],
        [ax, ay],
      ]);
    }
  }
  return { definir, colocar, colocarCerca, items };
}
