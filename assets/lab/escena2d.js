// Bit a bit · Escenas en 2D (SVG) con transparencia y rótulos
import { crearRotulos } from './rotulos.js';

export function crearEscena2D({ contenedor, ancho, alto, svg: marcado, rotulos = [], caja, alPulsar, alDibujar, valores, lados, vistaInicial = null, alCambiarVista, modoRotulos = 'columnas', prohibidas = [], alinear = 'centro' }) {
  const NS = 'http://www.w3.org/2000/svg';
  const raiz = document.createElementNS(NS, 'svg');
  raiz.setAttribute('viewBox', `0 0 ${ancho} ${alto}`);
  raiz.setAttribute('preserveAspectRatio', alinear === 'arriba' ? 'xMidYMin meet' : 'xMidYMid meet');
  raiz.setAttribute('class', 'lienzo-svg transparente');
  raiz.setAttribute('role', 'img');
  raiz.setAttribute('aria-label', contenedor.dataset.descripcion || 'Escena del laboratorio');
  raiz.innerHTML = marcado;
  const capa = contenedor.querySelector('.etiquetas');
  contenedor.insertBefore(raiz, capa);
  contenedor.querySelector('canvas')?.remove();

  const opciones = { transparente: true, nombres: true };
  let vista = vistaInicial;
  if (vista) raiz.dataset.vista = vista;
  const rot = crearRotulos(capa, { alPulsar });
  rot.definir(rotulos);

  // Escala del SVG dentro del contenedor (meet)
  let W = 1;
  let H = 1;
  let s = 1;
  let ox = 0;
  let oy = 0;
  let margenSup = 8;
  const barra = contenedor.parentElement?.querySelector('.escena-barra');
  const medir = () => {
    const r = contenedor.getBoundingClientRect();
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    margenSup = barra && !barra.hidden && getComputedStyle(barra).position === 'absolute' ? barra.offsetTop + barra.offsetHeight + 8 : 8;
    s = Math.min(W / ancho, H / alto);
    ox = (W - ancho * s) / 2;
    // Arriba, pero por debajo de los botones de vista si caben: el SVG baja ese tanto
    if (alinear === 'arriba') {
      oy = Math.max(0, Math.min(margenSup - 10, H - alto * s));
      raiz.style.height = `calc(100% - ${oy.toFixed(0)}px)`;
      raiz.style.marginTop = `${oy.toFixed(0)}px`;
    } else oy = (H - alto * s) / 2;
    for (const it of rot.items.values()) it.medir = true;
  };
  new ResizeObserver(medir).observe(contenedor);
  medir();
  const aPixel = (x, y) => ({ x: x * s + ox, y: y * s + oy });

  raiz.addEventListener('click', (e) => {
    const p = e.target.closest('[data-pieza]');
    if (p) alPulsar?.(p.dataset.pieza, e);
  });

  function dibujar(now) {
    alDibujar?.(raiz, { vista, opciones, now });
    const anclas = {};
    for (const d of rotulos) {
      const a = typeof d.ancla === 'function' ? d.ancla(vista) : d.ancla;
      if (!a) continue;
      if (d.vistas && vista && !d.vistas.includes(vista)) continue;
      anclas[d.id] = aPixel(a[0], a[1]);
    }
    if (modoRotulos === 'cerca') {
      const zonas = (typeof prohibidas === 'function' ? prohibidas(vista) : prohibidas).map(([x0, y0, x1, y1, id]) => {
        const a = aPixel(x0, y0);
        const b = aPixel(x1, y1);
        return { x0: a.x, y0: a.y, x1: b.x, y1: b.y, id };
      });
      // Los botones que flotan sobre la escena tampoco se tapan
      const bot = contenedor.querySelector('.botonera');
      if (bot && bot.offsetWidth) zonas.push({ x0: bot.offsetLeft - 4, y0: bot.offsetTop - 4, x1: bot.offsetLeft + bot.offsetWidth + 4, y1: bot.offsetTop + bot.offsetHeight + 4 });
      // En pantallas estrechas, solo los rótulos más importantes
      rot.colocarCerca({ anclas, ancho: W, alto: H, margenSup, mostrar: opciones.nombres, valores: valores?.() || {}, prohibidas: zonas, minPrio: W < 520 ? 5 : 0 });
      return;
    }
    const c = typeof caja === 'function' ? caja(vista) : caja;
    const p0 = aPixel(c[0], c[1]);
    const p1 = aPixel(c[2], c[3]);
    rot.colocar({
      anclas,
      caja: { x0: p0.x, y0: p0.y, x1: p1.x, y1: p1.y },
      ancho: W,
      alto: H,
      margenSup,
      mostrar: opciones.nombres,
      valores: valores?.() || {},
      lados: typeof lados === 'function' ? lados(vista) : lados || {},
    });
  }

  return {
    svg: raiz,
    q: (sel) => raiz.querySelector(sel),
    qa: (sel) => [...raiz.querySelectorAll(sel)],
    dibujar,
    aPixel,
    opcion(nombre, v) {
      opciones[nombre] = v;
      if (nombre === 'transparente') raiz.classList.toggle('transparente', v);
    },
    ponerVista(v) {
      vista = v;
      raiz.dataset.vista = v;
      alCambiarVista?.(v);
    },
    get vista() {
      return vista;
    },
    opciones,
  };
}
