// Bit a bit · Motor de simulación del siguelíneas (Maqueen Plus V2 + micro:bit)
// ---------------------------------------------------------------------------
// Este archivo no dibuja nada: calcula. La escena 3D, la vista 2D y los números
// de la pantalla leen el mismo estado, así que todo sale del mismo modelo.
//
// DOC   = datos sacados de la documentación (extensión oficial de MakeCode de
//         DFRobot, runtime de MakeCode para micro:bit, manual del Maqueen Plus V2).
// APROX = valores aproximados para la simulación. Se pueden comprobar con el
//         robot real (ver la práctica del laboratorio).

export const DOC = {
  sensores: ['L2', 'L1', 'M', 'R1', 'R2'],
  // El chip del Maqueen (dirección I2C 0x10) responde en el registro 0x1D con
  // un byte: un bit por sensor (pxt-DFRobot_MaqueenPlus_v20, readLineSensorState).
  bits: { L2: 0x10, L1: 0x08, M: 0x04, R1: 0x02, R2: 0x01 },
  i2cDireccion: 0x10,
  registroLinea: 0x1d,
  // MakeCode (pxt-microbit, codal.cpp): "para siempre" espera 20 ms entre vueltas.
  pausaBucleMs: 20,
  // controlMotor: velocidad de 0 a 255.
  velocidadMax: 255,
  // I2CInit: reinicio + pausa de 100 ms, muestra ✓ (10 ms) y espera 500 ms.
  initResetMs: 100,
  initCheckMs: 10,
  initPausaMs: 500,
};

export const APROX = {
  distanciaRuedas: 88, // mm entre las dos ruedas
  radioRueda: 21, // mm
  sensorAdelante: 58, // mm desde el eje de las ruedas hasta la fila de L1, M y R1
  separacionSensores: 10, // mm entre L1, M y R1 (medido sobre una foto del robot)
  anchoLinea: 19, // mm (cinta aislante)
  vMaxLlena: 450, // mm/s de cada rueda con la orden 255 y pilas nuevas
  zonaMuertaLlena: 20, // orden mínima que mueve una rueda con pilas nuevas
  zonaMuertaExtra: 100, // cuánto sube esa orden mínima con las pilas gastadas
  tauMotor: 0.08, // s que tarda un motor en alcanzar (casi) la velocidad pedida
  i2cMs: 0.5, // ms por mensaje I2C (estimación a 100 kHz)
  reflejoProb: 0.85, // en una zona con brillo: probabilidad de leer "blanco" estando sobre negro
};

// Dónde está cada sensor de línea, en mm: «adelante» desde el eje de las ruedas y
// «lado» desde el centro (positivo a la izquierda del robot). L1, M y R1 van en fila
// detrás de la rueda de apoyo; L2 y R2, a los lados, delante de las ruedas. Medido
// sobre las fotos de los bajos de los robots del instituto (APROX), tomando como
// escala los 58 mm de la fila de delante.
export const GEOM_SENSORES = {
  L2: { adelante: 31, lado: 45 },
  L1: { adelante: APROX.sensorAdelante, lado: APROX.separacionSensores },
  M: { adelante: APROX.sensorAdelante, lado: 0 },
  R1: { adelante: APROX.sensorAdelante, lado: -APROX.separacionSensores },
  R2: { adelante: 31, lado: -45 },
};

// Zonas de la cinta que brillan (la luz del techo se refleja como en un espejo).
// Solo cuentan cuando se activa "Pista con reflejos".
export const BRILLOS = [
  { x: 60, y: -337, r: 75 },
  { x: -170, y: 105, r: 85 },
  { x: 548, y: -60, r: 80 },
];

export function enBrillo(x, y) {
  for (const b of BRILLOS) if (Math.hypot(x - b.x, y - b.y) <= b.r) return true;
  return false;
}

// Lo que dibuja I2CInit en la pantalla de la micro:bit al conectar (✓).
export const PATRON_OK = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1],
  [0, 0, 0, 1, 0],
  [1, 0, 1, 0, 0],
  [0, 1, 0, 0, 0],
];

// ---------------------------------------------------------------------------
// Utilidades
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TAU = Math.PI * 2;
export function wrapAngle(a) {
  a = (a + Math.PI) % TAU;
  if (a < 0) a += TAU;
  return a - Math.PI;
}

// ---------------------------------------------------------------------------
// Motores y carga de las pilas (APROX)
export function modeloMotor(bateria) {
  const b = Math.max(0, Math.min(1, bateria));
  return {
    vmax: APROX.vMaxLlena * (0.55 + 0.45 * b),
    zonaMuerta: APROX.zonaMuertaLlena + (1 - b) * APROX.zonaMuertaExtra,
  };
}

// Velocidad de una rueda (mm/s) para una orden de 0 a 255.
export function velocidadRueda(orden, bateria) {
  const { vmax, zonaMuerta } = modeloMotor(bateria);
  if (orden <= zonaMuerta) return 0;
  return (vmax * (orden - zonaMuerta)) / (255 - zonaMuerta);
}

// ---------------------------------------------------------------------------
// Pista: línea negra cerrada (spline de Catmull-Rom centrípeta)
function catmull(p0, p1, p2, p3, t, alpha = 0.5) {
  const tj = (ti, a, b) => ti + Math.pow(Math.hypot(b.x - a.x, b.y - a.y), alpha);
  const t0 = 0;
  const t1 = tj(t0, p0, p1);
  const t2 = tj(t1, p1, p2);
  const t3 = tj(t2, p2, p3);
  const tt = t1 + (t2 - t1) * t;
  const lerp = (a, b, ta, tb) => {
    const k = (tt - ta) / (tb - ta || 1e-9);
    return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
  };
  const A1 = lerp(p0, p1, t0, t1);
  const A2 = lerp(p1, p2, t1, t2);
  const A3 = lerp(p2, p3, t2, t3);
  const B1 = lerp(A1, A2, t0, t2);
  const B2 = lerp(A2, A3, t1, t3);
  return lerp(B1, B2, t1, t2);
}

export class Pista {
  constructor(control, { ancho = APROX.anchoLinea, paso = 2 } = {}) {
    this.ancho = ancho;
    this.control = control;
    const n = control.length;
    const fino = [];
    for (let i = 0; i < n; i++) {
      const p0 = control[(i - 1 + n) % n];
      const p1 = control[i];
      const p2 = control[(i + 1) % n];
      const p3 = control[(i + 2) % n];
      for (let k = 0; k < 60; k++) fino.push(catmull(p0, p1, p2, p3, k / 60));
    }
    // Remuestreo uniforme por longitud de arco
    const acum = [0];
    for (let i = 1; i <= fino.length; i++) {
      const a = fino[i - 1];
      const b = fino[i % fino.length];
      acum.push(acum[i - 1] + Math.hypot(b.x - a.x, b.y - a.y));
    }
    const total = acum[acum.length - 1];
    const m = Math.max(16, Math.round(total / paso));
    const pts = [];
    let j = 0;
    for (let k = 0; k < m; k++) {
      const s = (k / m) * total;
      while (acum[j + 1] < s) j++;
      const a = fino[j];
      const b = fino[(j + 1) % fino.length];
      const f = (s - acum[j]) / (acum[j + 1] - acum[j] || 1e-9);
      pts.push({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, s });
    }
    this.pts = pts;
    this.longitud = total;
    this._rejilla();
  }

  _rejilla() {
    this.celda = 40;
    this.grid = new Map();
    const pts = this.pts;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const x0 = Math.floor(Math.min(a.x, b.x) / this.celda);
      const x1 = Math.floor(Math.max(a.x, b.x) / this.celda);
      const y0 = Math.floor(Math.min(a.y, b.y) / this.celda);
      const y1 = Math.floor(Math.max(a.y, b.y) / this.celda);
      for (let cx = x0; cx <= x1; cx++)
        for (let cy = y0; cy <= y1; cy++) {
          const key = cx + ',' + cy;
          let arr = this.grid.get(key);
          if (!arr) this.grid.set(key, (arr = []));
          arr.push(i);
        }
    }
  }

  _segmento(i, x, y) {
    const pts = this.pts;
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const L2 = dx * dx + dy * dy || 1e-9;
    let t = ((x - a.x) * dx + (y - a.y) * dy) / L2;
    t = Math.max(0, Math.min(1, t));
    const px = a.x + dx * t;
    const py = a.y + dy * t;
    return { d: Math.hypot(x - px, y - py), i, t, px, py };
  }

  // Punto más cercano de la línea dentro de un radio (rápido, con rejilla).
  cercano(x, y, radio = 40) {
    const c = this.celda;
    const r = Math.ceil(radio / c);
    const cx = Math.floor(x / c);
    const cy = Math.floor(y / c);
    let best = null;
    const vistos = new Set();
    for (let ix = cx - r; ix <= cx + r; ix++)
      for (let iy = cy - r; iy <= cy + r; iy++) {
        const arr = this.grid.get(ix + ',' + iy);
        if (!arr) continue;
        for (const i of arr) {
          if (vistos.has(i)) continue;
          vistos.add(i);
          const q = this._segmento(i, x, y);
          if (!best || q.d < best.d) best = q;
        }
      }
    return best;
  }

  // Punto más cercano en toda la pista (lento; se usa para vueltas y salidas).
  cercanoGlobal(x, y) {
    const q = this.cercano(x, y, 120);
    if (q) return q;
    let best = null;
    for (let i = 0; i < this.pts.length; i++) {
      const s = this._segmento(i, x, y);
      if (!best || s.d < best.d) best = s;
    }
    return best;
  }

  esNegro(x, y) {
    const q = this.cercano(x, y, 20);
    return !!q && q.d <= this.ancho / 2;
  }

  distancia(x, y) {
    const q = this.cercanoGlobal(x, y);
    return q ? q.d : Infinity;
  }

  progreso(x, y) {
    const q = this.cercanoGlobal(x, y);
    const a = this.pts[q.i];
    const b = this.pts[(q.i + 1) % this.pts.length];
    const sb = q.i + 1 === this.pts.length ? this.longitud : b.s;
    return a.s + (sb - a.s) * q.t;
  }

  // Posición y rumbo de la pista en la longitud s.
  en(s) {
    const L = this.longitud;
    s = ((s % L) + L) % L;
    const n = this.pts.length;
    let i = Math.min(n - 1, Math.floor((s / L) * n));
    while (i > 0 && this.pts[i].s > s) i--;
    while (i < n - 1 && this.pts[i + 1].s <= s) i++;
    const a = this.pts[i];
    const b = this.pts[(i + 1) % n];
    const sb = i + 1 === n ? L : b.s;
    const f = (s - a.s) / (sb - a.s || 1e-9);
    return {
      x: a.x + (b.x - a.x) * f,
      y: a.y + (b.y - a.y) * f,
      rumbo: Math.atan2(b.y - a.y, b.x - a.x),
    };
  }
}

// Circuito del laboratorio (mm). Recta de salida abajo, curva amplia a la
// derecha, una ese en la parte de arriba y una curva más cerrada a la izquierda.
export const CIRCUITO = [
  { x: -430, y: -330 },
  { x: -120, y: -345 },
  { x: 190, y: -330 },
  { x: 430, y: -280 },
  { x: 545, y: -130 },
  { x: 530, y: 60 },
  { x: 420, y: 210 },
  { x: 250, y: 255 },
  { x: 110, y: 170 },
  { x: -20, y: 70 },
  { x: -150, y: 90 },
  { x: -240, y: 215 },
  { x: -370, y: 285 },
  { x: -505, y: 220 },
  { x: -560, y: 60 },
  { x: -545, y: -150 },
];

export const MESA = { ancho: 1400, alto: 960 }; // mm, el suelo visible
export const SALIDA_S = 260; // mm de pista desde el primer punto

// ---------------------------------------------------------------------------
// Programa básico: el ejemplo oficial de la extensión Maqueen Plus V2
// (README de pxt-DFRobot_MaqueenPlus_v20, "Line-tracking Robot").
// Cada `yield` es una operación que la simulación ejecuta con su coste en tiempo.
export function* programaBasico() {
  // al iniciar
  yield { op: 'fase', nombre: 'iniciar' };
  yield { op: 'nodo', id: 'init' };
  yield { op: 'i2c', tipo: 'reinicio' };
  yield { op: 'esperar', ms: DOC.initResetMs };
  yield { op: 'i2c', tipo: 'version' };
  yield { op: 'pantalla', patron: PATRON_OK };
  yield { op: 'esperar', ms: DOC.initCheckMs };
  yield { op: 'fase', nombre: 'conectado' };
  yield { op: 'esperar', ms: DOC.initPausaMs };
  yield { op: 'pantalla', patron: null };

  // para siempre
  while (true) {
    yield { op: 'fase', nombre: 'leer' };
    yield { op: 'fase', nombre: 'decidir' };
    yield { op: 'nodo', id: 'forever' };
    let motores = false;
    const m = yield { op: 'leer', sensor: 'M', nodo: 'c1M' };
    const c1 = m === 1;
    yield { op: 'cond', id: 'if1', valor: c1 };
    if (c1) {
      yield { op: 'fase', nombre: 'motores' };
      motores = true;
      yield { op: 'motor', id: 'm1', lado: 'ambos', dir: 0, vel: 100 };
    } else {
      yield { op: 'nodo', id: 'else1' };
      let c2 = (yield { op: 'leer', sensor: 'L1', nodo: 'c2L1' }) === 0;
      if (c2) c2 = (yield { op: 'leer', sensor: 'R1', nodo: 'c2R1' }) === 1;
      yield { op: 'cond', id: 'if2', valor: c2 };
      if (c2) {
        yield { op: 'fase', nombre: 'motores' };
        motores = true;
        yield { op: 'motor', id: 'm2', lado: 'izquierdo', dir: 0, vel: 160 };
        yield { op: 'motor', id: 'm3', lado: 'derecho', dir: 0, vel: 30 };
      }
      let c3 = (yield { op: 'leer', sensor: 'L1', nodo: 'c3L1' }) === 1;
      if (c3) c3 = (yield { op: 'leer', sensor: 'R1', nodo: 'c3R1' }) === 0;
      yield { op: 'cond', id: 'if3', valor: c3 };
      if (c3) {
        if (!motores) yield { op: 'fase', nombre: 'motores' };
        motores = true;
        yield { op: 'motor', id: 'm4', lado: 'derecho', dir: 0, vel: 160 };
        yield { op: 'motor', id: 'm5', lado: 'izquierdo', dir: 0, vel: 30 };
      }
    }
    if (!motores) yield { op: 'fase', nombre: 'motores' };
    yield { op: 'fase', nombre: 'avanzar' };
    yield { op: 'esperar', ms: DOC.pausaBucleMs, nodo: 'pausa' };
  }
}

// ---------------------------------------------------------------------------
// La simulación
export class Siguelineas {
  constructor({ pista, seed = 7 } = {}) {
    this.pista = pista;
    this.seed = seed;
    this.ajustes = { tapado: null, reflejos: false, bateria: 1 };
    this.reiniciar();
  }

  reiniciar({ desplazamiento = 0 } = {}) {
    // Como en la práctica: el eje sobre la línea y el sensor M encima de ella, más adelante
    const p = this.pista.en(SALIDA_S);
    const q = this.pista.en(SALIDA_S + APROX.sensorAdelante);
    const rumbo = Math.atan2(q.y - p.y, q.x - p.x);
    // desplazamiento > 0 = robot movido hacia su derecha (la línea le queda a la izquierda)
    const nx = Math.sin(rumbo);
    const ny = -Math.cos(rumbo);
    this.robot = {
      x: p.x + nx * desplazamiento,
      y: p.y + ny * desplazamiento,
      rumbo,
      vI: 0, // velocidad real de la rueda izquierda (mm/s)
      vD: 0,
      ordenI: 0, // última orden 0–255 recibida por el chip
      ordenD: 0,
      dirI: 0,
      dirD: 0,
      giroI: 0, // ángulo de las ruedas (rad), para dibujar
      giroD: 0,
    };
    this.desplazamiento = desplazamiento;
    this.rng = mulberry32(this.seed);
    this.t = 0; // ms
    this.gen = programaBasico();
    this.valor = undefined;
    this.actual = null; // operación en curso { op, resta }
    this.pendiente = null; // marca de fase leída pero aún no ejecutada (modo paso a paso)
    this.fase = 'iniciar';
    this.pantalla = null;
    this.eventos = []; // eventos de la vuelta del bucle en curso
    this.vueltaAnterior = null; // eventos de la última vuelta completa
    this.ultimaDecision = null;
    this.vueltasBucle = 0;
    this.marcasBucle = [];
    this.rastro = [];
    this._ultimoRastro = -1e9;
    this.vueltas = 0;
    this.tiemposVuelta = [];
    this._inicioVuelta = null;
    this._avance = 0;
    this._sPrev = this.pista.progreso(this.robot.x, this.robot.y);
    this.fuera = false;
    this._fueraMs = 0;
    this.fueraMesa = false;
    this.parado = false;
    this._paradoMs = 0;
    this.lecturaChip = this.leerTodos();
  }

  ajustar(cambios) {
    Object.assign(this.ajustes, cambios);
  }

  // Posición de cada sensor en el suelo
  posSensor(nombre, r = this.robot) {
    const { adelante: ax, lado: lat } = GEOM_SENSORES[nombre]; // lado positivo: izquierda
    const c = Math.cos(r.rumbo);
    const s = Math.sin(r.rumbo);
    return { x: r.x + ax * c - lat * s, y: r.y + ax * s + lat * c };
  }

  // ¿Hay cinta negra bajo el sensor? (geometría, sin ruido)
  sobreNegro(nombre) {
    const p = this.posSensor(nombre);
    return this.pista.esNegro(p.x, p.y);
  }

  // Lo que el chip tiene en el registro 0x1D: un bit por sensor (sin reflejos)
  leerTodos() {
    const r = {};
    let byte = 0;
    for (const n of DOC.sensores) {
      const tapado = this.ajustes.tapado === n;
      const v = tapado ? 0 : this.sobreNegro(n) ? 1 : 0;
      r[n] = { v, tapado, negro: this.sobreNegro(n) };
      if (v) byte |= DOC.bits[n];
    }
    r.byte = byte;
    return r;
  }

  // Una lectura de readLineSensorState: un mensaje I2C con su resultado
  leerSensor(nombre) {
    const p = this.posSensor(nombre);
    const negro = this.pista.esNegro(p.x, p.y);
    const tapado = this.ajustes.tapado === nombre;
    let v = negro ? 1 : 0;
    let reflejo = false;
    if (tapado) v = 0;
    else if (negro && this.ajustes.reflejos && enBrillo(p.x, p.y) && this.rng() < APROX.reflejoProb) {
      v = 0;
      reflejo = true;
    }
    return { v, negro, tapado, reflejo };
  }

  _coste(op) {
    switch (op.op) {
      case 'leer':
      case 'motor':
      case 'i2c':
        return APROX.i2cMs;
      case 'esperar':
        return op.ms;
      default:
        return 0;
    }
  }

  // Ejecuta el efecto de una operación al empezar
  _ejecutar(op) {
    let valor;
    switch (op.op) {
      case 'fase':
        this.fase = op.nombre;
        if (op.nombre === 'leer') {
          if (this.eventos.length) {
            this.vueltaAnterior = this.eventos;
            this.ultimaDecision = decisionDe(this.eventos);
          }
          this.eventos = [];
          this.lecturaChip = this.leerTodos();
          this.vueltasBucle++;
          this.marcasBucle.push(this.t);
          while (this.marcasBucle.length && this.marcasBucle[0] < this.t - 1000) this.marcasBucle.shift();
        }
        this.eventos.push({ tipo: 'fase', nombre: op.nombre, t: this.t });
        break;
      case 'nodo':
        this.eventos.push({ tipo: 'nodo', id: op.id, t: this.t });
        break;
      case 'leer': {
        const l = this.leerSensor(op.sensor);
        valor = l.v;
        this.eventos.push({ tipo: 'leer', sensor: op.sensor, nodo: op.nodo, ...l, t: this.t });
        break;
      }
      case 'cond':
        this.eventos.push({ tipo: 'cond', id: op.id, valor: op.valor, t: this.t });
        break;
      case 'motor': {
        const r = this.robot;
        if (op.lado === 'izquierdo' || op.lado === 'ambos') {
          r.ordenI = op.vel;
          r.dirI = op.dir;
        }
        if (op.lado === 'derecho' || op.lado === 'ambos') {
          r.ordenD = op.vel;
          r.dirD = op.dir;
        }
        this.eventos.push({ tipo: 'motor', id: op.id, lado: op.lado, vel: op.vel, dir: op.dir, t: this.t });
        break;
      }
      case 'i2c':
        valor = op.tipo === 'version' ? 1 : undefined;
        this.eventos.push({ tipo: 'i2c', que: op.tipo, t: this.t });
        break;
      case 'pantalla':
        this.pantalla = op.patron;
        break;
      case 'esperar':
        this.eventos.push({ tipo: 'esperar', ms: op.ms, nodo: op.nodo, t: this.t });
        break;
    }
    return valor;
  }

  // Siguiente operación del programa (o la marca de fase que quedó pendiente)
  _tomar() {
    if (this.pendiente) {
      const op = this.pendiente;
      this.pendiente = null;
      return op;
    }
    const res = this.gen.next(this.valor);
    this.valor = undefined;
    return res.value;
  }

  _siguienteOp() {
    const op = this._tomar();
    this.valor = this._ejecutar(op);
    return { op, resta: this._coste(op) };
  }

  // Física: avanza dt milisegundos en pasos de 2 ms como máximo
  _fisica(ms) {
    if (this.fueraMesa) return;
    const r = this.robot;
    let quedan = ms;
    while (quedan > 1e-9) {
      const dtms = Math.min(2, quedan);
      quedan -= dtms;
      const dt = dtms / 1000;
      const b = this.ajustes.bateria;
      const objI = velocidadRueda(r.ordenI, b) * (r.dirI ? -1 : 1);
      const objD = velocidadRueda(r.ordenD, b) * (r.dirD ? -1 : 1);
      const k = 1 - Math.exp(-dt / APROX.tauMotor);
      r.vI += (objI - r.vI) * k;
      r.vD += (objD - r.vD) * k;
      const v = (r.vI + r.vD) / 2;
      const w = (r.vD - r.vI) / APROX.distanciaRuedas;
      r.x += v * Math.cos(r.rumbo + (w * dt) / 2) * dt;
      r.y += v * Math.sin(r.rumbo + (w * dt) / 2) * dt;
      r.rumbo = wrapAngle(r.rumbo + w * dt);
      r.giroI += (r.vI / APROX.radioRueda) * dt;
      r.giroD += (r.vD / APROX.radioRueda) * dt;
      this.t += dtms;
      this._vigilar(dtms);
    }
  }

  _vigilar(dtms) {
    const r = this.robot;
    // Rastro cada 25 ms
    if (this.t - this._ultimoRastro >= 25) {
      this._ultimoRastro = this.t;
      this.rastro.push({ x: r.x, y: r.y });
      if (this.rastro.length > 360) this.rastro.shift();
    }
    // ¿Fuera de la mesa?
    if (Math.abs(r.x) > MESA.ancho / 2 - 30 || Math.abs(r.y) > MESA.alto / 2 - 30) {
      this.fueraMesa = true;
      r.vI = r.vD = 0;
    }
    // Progreso y vueltas (cada 10 ms es suficiente)
    if (Math.round(this.t) % 10 === 0) {
      const d = this.pista.distancia(r.x, r.y);
      if (d > 140) this._fueraMs += 10;
      else this._fueraMs = 0;
      this.fuera = this._fueraMs > 800;
      if (d < 60) {
        const s = this.pista.progreso(r.x, r.y);
        const L = this.pista.longitud;
        let ds = s - this._sPrev;
        if (ds < -L / 2) ds += L;
        if (ds > L / 2) ds -= L;
        this._sPrev = s;
        if (Math.abs(ds) < 40) this._avance += ds;
        if (this._inicioVuelta === null && this.fase !== 'iniciar') this._inicioVuelta = this.t;
        if (this._avance >= L) {
          this._avance -= L;
          this.vueltas++;
          this.tiemposVuelta.push(this.t - (this._inicioVuelta ?? 0));
          this._inicioVuelta = this.t;
        }
      }
      const ordenes = r.ordenI > 0 || r.ordenD > 0;
      if (ordenes && Math.abs(r.vI) < 2 && Math.abs(r.vD) < 2) this._paradoMs += 10;
      else this._paradoMs = 0;
      this.parado = this._paradoMs > 1000;
    }
  }

  // Modo automático: avanza ms de tiempo simulado
  avanzar(ms) {
    let quedan = ms;
    let guard = 0;
    while (quedan > 1e-9 && guard++ < 100000) {
      if (this.fueraMesa) return;
      if (!this.actual) this.actual = this._siguienteOp();
      const d = Math.min(quedan, this.actual.resta);
      if (d > 0) this._fisica(d);
      this.actual.resta -= d;
      quedan -= d;
      if (this.actual.resta <= 1e-9) this.actual = null;
    }
  }

  // Modo paso a paso: entra en la fase siguiente, ejecuta todas sus
  // operaciones y se detiene justo antes de la marca de la fase que viene.
  pasoFase() {
    if (this.fueraMesa) return null;
    if (this.actual) {
      this._fisica(this.actual.resta);
      this.actual = null;
    }
    let op = this._tomar();
    let guard = 0;
    while (op.op !== 'fase' && guard++ < 10000) {
      this.valor = this._ejecutar(op);
      const c = this._coste(op);
      if (c > 0) this._fisica(c);
      op = this._tomar();
    }
    const antes = this.eventos.length;
    this.valor = this._ejecutar(op);
    guard = 0;
    while (guard++ < 10000) {
      const sig = this._tomar();
      if (sig.op === 'fase') {
        this.pendiente = sig;
        break;
      }
      this.valor = this._ejecutar(sig);
      const c = this._coste(sig);
      if (c > 0) this._fisica(c);
      if (this.fueraMesa) break;
    }
    const desde = this.fase === 'leer' ? 0 : antes;
    return { fase: this.fase, eventos: this.eventos.slice(desde) };
  }

  // Resumen para la pantalla
  vueltasPorSegundo() {
    return this.marcasBucle.length;
  }
}

export function decisionDe(eventos) {
  const c = {};
  for (const e of eventos) if (e.tipo === 'cond') c[e.id] = e.valor;
  if (c.if1) return 'recto';
  if (c.if2) return 'derecha';
  if (c.if3) return 'izquierda';
  if ('if1' in c) return 'ninguna';
  return null;
}
