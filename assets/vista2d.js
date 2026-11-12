// Bit a bit · Vista cenital 2D del siguelíneas (portada y alternativa sin 3D)
import { APROX, MESA, BRILLOS, SALIDA_S, DOC } from './engine.js';

export function crearVista2D({ canvas, contenedor, sim, pista }) {
  const g = canvas.getContext('2d');
  let W = 1;
  let H = 1;
  let dpr = 1;
  let esc = 1;
  let ox = 0;
  let oy = 0;
  let fondo = null;
  let fondoBrillos = null;

  function medir() {
    const r = (contenedor || canvas).getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    esc = Math.min(W / MESA.ancho, H / MESA.alto);
    ox = W / 2;
    oy = H / 2;
    fondo = null;
    fondoBrillos = null;
  }
  const X = (x) => ox + x * esc;
  const Y = (y) => oy - y * esc;

  function pintarFondo(brillos) {
    const cv = document.createElement('canvas');
    cv.width = canvas.width;
    cv.height = canvas.height;
    const c = cv.getContext('2d');
    c.scale(dpr, dpr);
    c.fillStyle = '#f6f6f1';
    c.fillRect(0, 0, W, H);
    c.lineWidth = 1;
    for (let x = -650; x <= 650; x += 50) {
      c.strokeStyle = x % 100 === 0 ? 'rgba(30,50,40,0.09)' : 'rgba(30,50,40,0.04)';
      c.beginPath();
      c.moveTo(X(x), 0);
      c.lineTo(X(x), H);
      c.stroke();
    }
    for (let y = -450; y <= 450; y += 50) {
      c.strokeStyle = y % 100 === 0 ? 'rgba(30,50,40,0.09)' : 'rgba(30,50,40,0.04)';
      c.beginPath();
      c.moveTo(0, Y(y));
      c.lineTo(W, Y(y));
      c.stroke();
    }
    const trazar = () => {
      c.beginPath();
      pista.pts.forEach((p, i) => (i ? c.lineTo(X(p.x), Y(p.y)) : c.moveTo(X(p.x), Y(p.y))));
      c.closePath();
    };
    c.lineJoin = 'round';
    c.lineCap = 'round';
    c.strokeStyle = '#141516';
    c.lineWidth = pista.ancho * esc;
    trazar();
    c.stroke();
    if (brillos) {
      for (const b of BRILLOS) {
        c.save();
        c.beginPath();
        c.arc(X(b.x), Y(b.y), b.r * esc, 0, Math.PI * 2);
        c.clip();
        c.strokeStyle = 'rgba(214,226,235,0.9)';
        c.lineWidth = pista.ancho * esc * 0.42;
        c.setLineDash([9 * esc, 7 * esc]);
        trazar();
        c.stroke();
        c.restore();
      }
    }
    const s = pista.en(SALIDA_S);
    const nx = -Math.sin(s.rumbo);
    const ny = Math.cos(s.rumbo);
    c.strokeStyle = '#d92f2a';
    c.lineWidth = Math.max(1.5, 3 * esc);
    for (const sg of [1, -1]) {
      c.beginPath();
      c.moveTo(X(s.x + nx * 22 * sg), Y(s.y + ny * 22 * sg));
      c.lineTo(X(s.x + nx * 46 * sg), Y(s.y + ny * 46 * sg));
      c.stroke();
    }
    return cv;
  }

  function rectRot(cx, cy, ang, largo, ancho, rad) {
    g.save();
    g.translate(X(cx), Y(cy));
    g.rotate(-ang);
    const l = largo * esc;
    const a = ancho * esc;
    g.beginPath();
    if (g.roundRect) g.roundRect(-l / 2, -a / 2, l, a, rad * esc);
    else g.rect(-l / 2, -a / 2, l, a);
    g.restore();
  }

  function dibujar() {
    if (!fondo) {
      medir();
      fondo = pintarFondo(false);
    }
    const brillos = sim.ajustes.reflejos;
    if (brillos && !fondoBrillos) fondoBrillos = pintarFondo(true);
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.drawImage(brillos ? fondoBrillos : fondo, 0, 0);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Rastro
    const R = sim.rastro;
    if (R.length > 1) {
      g.strokeStyle = 'rgba(217,47,42,0.55)';
      g.lineWidth = Math.max(1, 2.2 * esc * 1.6);
      g.beginPath();
      R.forEach((p, i) => (i ? g.lineTo(X(p.x), Y(p.y)) : g.moveTo(X(p.x), Y(p.y))));
      g.stroke();
    }

    const r = sim.robot;
    const c = Math.cos(r.rumbo);
    const s = Math.sin(r.rumbo);
    // Cuerpo
    const cxr = r.x + c * 6;
    const cyr = r.y + s * 6;
    rectRot(cxr, cyr, r.rumbo, 132, 72, 10);
    g.fillStyle = 'rgba(35,41,43,0.88)';
    g.fill();
    // Ruedas
    for (const lado of [1, -1]) {
      const wx = r.x - s * (APROX.distanciaRuedas / 2) * lado;
      const wy = r.y + c * (APROX.distanciaRuedas / 2) * lado;
      rectRot(wx, wy, r.rumbo, 42, 13, 3);
      g.fillStyle = '#111';
      g.fill();
    }
    // micro:bit
    rectRot(r.x - c * 54, r.y - s * 54, r.rumbo, 4, 52, 1);
    g.fillStyle = '#d1a645';
    g.fill();
    // Sensores
    const lect = sim.leerTodos();
    for (const n of DOC.sensores) {
      const p = sim.posSensor(n);
      const on = lect[n].v === 1;
      g.beginPath();
      g.arc(X(p.x), Y(p.y), Math.max(2.4, 5 * esc), 0, Math.PI * 2);
      g.fillStyle = on ? '#ff3b30' : '#ffffff';
      g.fill();
      g.lineWidth = 1;
      g.strokeStyle = sim.ajustes.tapado === n ? '#ffd400' : 'rgba(0,0,0,0.55)';
      g.stroke();
    }
    // Predicción
    let x = r.x;
    let y = r.y;
    let th = r.rumbo;
    const vv = (r.vI + r.vD) / 2;
    const w = (r.vD - r.vI) / APROX.distanciaRuedas;
    if (Math.abs(vv) > 2) {
      g.setLineDash([5, 4]);
      g.strokeStyle = '#0d6654';
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(X(x), Y(y));
      for (let i = 0; i < 30; i++) {
        x += vv * Math.cos(th) * 0.02;
        y += vv * Math.sin(th) * 0.02;
        th += w * 0.02;
        g.lineTo(X(x), Y(y));
      }
      g.stroke();
      g.setLineDash([]);
    }
    return {};
  }

  const ro = new ResizeObserver(() => {
    fondo = null;
  });
  ro.observe(contenedor || canvas);

  return {
    dibujar,
    tipo: '2d',
    animarFase() {},
    presetVista() {},
    zoom() {},
    opciones: { transparente: false, nombres: false },
    cam: {},
    destruir() {
      ro.disconnect();
    },
  };
}
