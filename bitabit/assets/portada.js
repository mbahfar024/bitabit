(() => {
  // ../../../../tmp/bitabit-myq0224i/engine.js
  var DOC = {
    sensores: ["L2", "L1", "M", "R1", "R2"],
    // El chip del Maqueen (dirección I2C 0x10) responde en el registro 0x1D con
    // un byte: un bit por sensor (pxt-DFRobot_MaqueenPlus_v20, readLineSensorState).
    bits: { L2: 16, L1: 8, M: 4, R1: 2, R2: 1 },
    i2cDireccion: 16,
    registroLinea: 29,
    // MakeCode (pxt-microbit, codal.cpp): "para siempre" espera 20 ms entre vueltas.
    pausaBucleMs: 20,
    // controlMotor: velocidad de 0 a 255.
    velocidadMax: 255,
    // I2CInit: reinicio + pausa de 100 ms, muestra ✓ (10 ms) y espera 500 ms.
    initResetMs: 100,
    initCheckMs: 10,
    initPausaMs: 500
  };
  var APROX = {
    distanciaRuedas: 88,
    // mm entre las dos ruedas
    radioRueda: 21,
    // mm
    sensorAdelante: 58,
    // mm desde el eje de las ruedas hasta la fila de L1, M y R1
    separacionSensores: 10,
    // mm entre L1, M y R1 (medido sobre una foto del robot)
    anchoLinea: 19,
    // mm (cinta aislante)
    vMaxLlena: 450,
    // mm/s de cada rueda con la orden 255 y pilas nuevas
    zonaMuertaLlena: 20,
    // orden mínima que mueve una rueda con pilas nuevas
    zonaMuertaExtra: 100,
    // cuánto sube esa orden mínima con las pilas gastadas
    tauMotor: 0.08,
    // s que tarda un motor en alcanzar (casi) la velocidad pedida
    i2cMs: 0.5,
    // ms por mensaje I2C (estimación a 100 kHz)
    reflejoProb: 0.85
    // en una zona con brillo: probabilidad de leer "blanco" estando sobre negro
  };
  var GEOM_SENSORES = {
    L2: { adelante: 31, lado: 45 },
    L1: { adelante: APROX.sensorAdelante, lado: APROX.separacionSensores },
    M: { adelante: APROX.sensorAdelante, lado: 0 },
    R1: { adelante: APROX.sensorAdelante, lado: -APROX.separacionSensores },
    R2: { adelante: 31, lado: -45 }
  };
  var BRILLOS = [
    { x: 60, y: -337, r: 75 },
    { x: -170, y: 105, r: 85 },
    { x: 548, y: -60, r: 80 }
  ];
  function enBrillo(x, y) {
    for (const b of BRILLOS) if (Math.hypot(x - b.x, y - b.y) <= b.r) return true;
    return false;
  }
  var PATRON_OK = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0]
  ];
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function() {
      a = a + 1831565813 >>> 0;
      let t = a;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var TAU = Math.PI * 2;
  function wrapAngle(a) {
    a = (a + Math.PI) % TAU;
    if (a < 0) a += TAU;
    return a - Math.PI;
  }
  function modeloMotor(bateria) {
    const b = Math.max(0, Math.min(1, bateria));
    return {
      vmax: APROX.vMaxLlena * (0.55 + 0.45 * b),
      zonaMuerta: APROX.zonaMuertaLlena + (1 - b) * APROX.zonaMuertaExtra
    };
  }
  function velocidadRueda(orden, bateria) {
    const { vmax, zonaMuerta } = modeloMotor(bateria);
    if (orden <= zonaMuerta) return 0;
    return vmax * (orden - zonaMuerta) / (255 - zonaMuerta);
  }
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
  var Pista = class {
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
        const s = k / m * total;
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
      this.grid = /* @__PURE__ */ new Map();
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
            const key = cx + "," + cy;
            let arr = this.grid.get(key);
            if (!arr) this.grid.set(key, arr = []);
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
      const vistos = /* @__PURE__ */ new Set();
      for (let ix = cx - r; ix <= cx + r; ix++)
        for (let iy = cy - r; iy <= cy + r; iy++) {
          const arr = this.grid.get(ix + "," + iy);
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
      s = (s % L + L) % L;
      const n = this.pts.length;
      let i = Math.min(n - 1, Math.floor(s / L * n));
      while (i > 0 && this.pts[i].s > s) i--;
      while (i < n - 1 && this.pts[i + 1].s <= s) i++;
      const a = this.pts[i];
      const b = this.pts[(i + 1) % n];
      const sb = i + 1 === n ? L : b.s;
      const f = (s - a.s) / (sb - a.s || 1e-9);
      return {
        x: a.x + (b.x - a.x) * f,
        y: a.y + (b.y - a.y) * f,
        rumbo: Math.atan2(b.y - a.y, b.x - a.x)
      };
    }
  };
  var CIRCUITO = [
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
    { x: -545, y: -150 }
  ];
  var MESA = { ancho: 1400, alto: 960 };
  var SALIDA_S = 260;
  function* programaBasico() {
    yield { op: "fase", nombre: "iniciar" };
    yield { op: "nodo", id: "init" };
    yield { op: "i2c", tipo: "reinicio" };
    yield { op: "esperar", ms: DOC.initResetMs };
    yield { op: "i2c", tipo: "version" };
    yield { op: "pantalla", patron: PATRON_OK };
    yield { op: "esperar", ms: DOC.initCheckMs };
    yield { op: "fase", nombre: "conectado" };
    yield { op: "esperar", ms: DOC.initPausaMs };
    yield { op: "pantalla", patron: null };
    while (true) {
      yield { op: "fase", nombre: "leer" };
      yield { op: "fase", nombre: "decidir" };
      yield { op: "nodo", id: "forever" };
      let motores = false;
      const m = yield { op: "leer", sensor: "M", nodo: "c1M" };
      const c1 = m === 1;
      yield { op: "cond", id: "if1", valor: c1 };
      if (c1) {
        yield { op: "fase", nombre: "motores" };
        motores = true;
        yield { op: "motor", id: "m1", lado: "ambos", dir: 0, vel: 100 };
      } else {
        yield { op: "nodo", id: "else1" };
        let c2 = (yield { op: "leer", sensor: "L1", nodo: "c2L1" }) === 0;
        if (c2) c2 = (yield { op: "leer", sensor: "R1", nodo: "c2R1" }) === 1;
        yield { op: "cond", id: "if2", valor: c2 };
        if (c2) {
          yield { op: "fase", nombre: "motores" };
          motores = true;
          yield { op: "motor", id: "m2", lado: "izquierdo", dir: 0, vel: 160 };
          yield { op: "motor", id: "m3", lado: "derecho", dir: 0, vel: 30 };
        }
        let c3 = (yield { op: "leer", sensor: "L1", nodo: "c3L1" }) === 1;
        if (c3) c3 = (yield { op: "leer", sensor: "R1", nodo: "c3R1" }) === 0;
        yield { op: "cond", id: "if3", valor: c3 };
        if (c3) {
          if (!motores) yield { op: "fase", nombre: "motores" };
          motores = true;
          yield { op: "motor", id: "m4", lado: "derecho", dir: 0, vel: 160 };
          yield { op: "motor", id: "m5", lado: "izquierdo", dir: 0, vel: 30 };
        }
      }
      if (!motores) yield { op: "fase", nombre: "motores" };
      yield { op: "fase", nombre: "avanzar" };
      yield { op: "esperar", ms: DOC.pausaBucleMs, nodo: "pausa" };
    }
  }
  var Siguelineas = class {
    constructor({ pista, seed = 7 } = {}) {
      this.pista = pista;
      this.seed = seed;
      this.ajustes = { tapado: null, reflejos: false, bateria: 1 };
      this.reiniciar();
    }
    reiniciar({ desplazamiento = 0 } = {}) {
      const p = this.pista.en(SALIDA_S);
      const q = this.pista.en(SALIDA_S + APROX.sensorAdelante);
      const rumbo = Math.atan2(q.y - p.y, q.x - p.x);
      const nx = Math.sin(rumbo);
      const ny = -Math.cos(rumbo);
      this.robot = {
        x: p.x + nx * desplazamiento,
        y: p.y + ny * desplazamiento,
        rumbo,
        vI: 0,
        // velocidad real de la rueda izquierda (mm/s)
        vD: 0,
        ordenI: 0,
        // última orden 0–255 recibida por el chip
        ordenD: 0,
        dirI: 0,
        dirD: 0,
        giroI: 0,
        // ángulo de las ruedas (rad), para dibujar
        giroD: 0
      };
      this.desplazamiento = desplazamiento;
      this.rng = mulberry32(this.seed);
      this.t = 0;
      this.gen = programaBasico();
      this.valor = void 0;
      this.actual = null;
      this.pendiente = null;
      this.fase = "iniciar";
      this.pantalla = null;
      this.eventos = [];
      this.vueltaAnterior = null;
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
      const { adelante: ax, lado: lat } = GEOM_SENSORES[nombre];
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
        case "leer":
        case "motor":
        case "i2c":
          return APROX.i2cMs;
        case "esperar":
          return op.ms;
        default:
          return 0;
      }
    }
    // Ejecuta el efecto de una operación al empezar
    _ejecutar(op) {
      let valor;
      switch (op.op) {
        case "fase":
          this.fase = op.nombre;
          if (op.nombre === "leer") {
            if (this.eventos.length) {
              this.vueltaAnterior = this.eventos;
              this.ultimaDecision = decisionDe(this.eventos);
            }
            this.eventos = [];
            this.lecturaChip = this.leerTodos();
            this.vueltasBucle++;
            this.marcasBucle.push(this.t);
            while (this.marcasBucle.length && this.marcasBucle[0] < this.t - 1e3) this.marcasBucle.shift();
          }
          this.eventos.push({ tipo: "fase", nombre: op.nombre, t: this.t });
          break;
        case "nodo":
          this.eventos.push({ tipo: "nodo", id: op.id, t: this.t });
          break;
        case "leer": {
          const l = this.leerSensor(op.sensor);
          valor = l.v;
          this.eventos.push({ tipo: "leer", sensor: op.sensor, nodo: op.nodo, ...l, t: this.t });
          break;
        }
        case "cond":
          this.eventos.push({ tipo: "cond", id: op.id, valor: op.valor, t: this.t });
          break;
        case "motor": {
          const r = this.robot;
          if (op.lado === "izquierdo" || op.lado === "ambos") {
            r.ordenI = op.vel;
            r.dirI = op.dir;
          }
          if (op.lado === "derecho" || op.lado === "ambos") {
            r.ordenD = op.vel;
            r.dirD = op.dir;
          }
          this.eventos.push({ tipo: "motor", id: op.id, lado: op.lado, vel: op.vel, dir: op.dir, t: this.t });
          break;
        }
        case "i2c":
          valor = op.tipo === "version" ? 1 : void 0;
          this.eventos.push({ tipo: "i2c", que: op.tipo, t: this.t });
          break;
        case "pantalla":
          this.pantalla = op.patron;
          break;
        case "esperar":
          this.eventos.push({ tipo: "esperar", ms: op.ms, nodo: op.nodo, t: this.t });
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
      this.valor = void 0;
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
        const dt = dtms / 1e3;
        const b = this.ajustes.bateria;
        const objI = velocidadRueda(r.ordenI, b) * (r.dirI ? -1 : 1);
        const objD = velocidadRueda(r.ordenD, b) * (r.dirD ? -1 : 1);
        const k = 1 - Math.exp(-dt / APROX.tauMotor);
        r.vI += (objI - r.vI) * k;
        r.vD += (objD - r.vD) * k;
        const v = (r.vI + r.vD) / 2;
        const w = (r.vD - r.vI) / APROX.distanciaRuedas;
        r.x += v * Math.cos(r.rumbo + w * dt / 2) * dt;
        r.y += v * Math.sin(r.rumbo + w * dt / 2) * dt;
        r.rumbo = wrapAngle(r.rumbo + w * dt);
        r.giroI += r.vI / APROX.radioRueda * dt;
        r.giroD += r.vD / APROX.radioRueda * dt;
        this.t += dtms;
        this._vigilar(dtms);
      }
    }
    _vigilar(dtms) {
      var _a;
      const r = this.robot;
      if (this.t - this._ultimoRastro >= 25) {
        this._ultimoRastro = this.t;
        this.rastro.push({ x: r.x, y: r.y });
        if (this.rastro.length > 360) this.rastro.shift();
      }
      if (Math.abs(r.x) > MESA.ancho / 2 - 30 || Math.abs(r.y) > MESA.alto / 2 - 30) {
        this.fueraMesa = true;
        r.vI = r.vD = 0;
      }
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
          if (this._inicioVuelta === null && this.fase !== "iniciar") this._inicioVuelta = this.t;
          if (this._avance >= L) {
            this._avance -= L;
            this.vueltas++;
            this.tiemposVuelta.push(this.t - ((_a = this._inicioVuelta) != null ? _a : 0));
            this._inicioVuelta = this.t;
          }
        }
        const ordenes = r.ordenI > 0 || r.ordenD > 0;
        if (ordenes && Math.abs(r.vI) < 2 && Math.abs(r.vD) < 2) this._paradoMs += 10;
        else this._paradoMs = 0;
        this.parado = this._paradoMs > 1e3;
      }
    }
    // Modo automático: avanza ms de tiempo simulado
    avanzar(ms) {
      let quedan = ms;
      let guard = 0;
      while (quedan > 1e-9 && guard++ < 1e5) {
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
      while (op.op !== "fase" && guard++ < 1e4) {
        this.valor = this._ejecutar(op);
        const c = this._coste(op);
        if (c > 0) this._fisica(c);
        op = this._tomar();
      }
      const antes = this.eventos.length;
      this.valor = this._ejecutar(op);
      guard = 0;
      while (guard++ < 1e4) {
        const sig = this._tomar();
        if (sig.op === "fase") {
          this.pendiente = sig;
          break;
        }
        this.valor = this._ejecutar(sig);
        const c = this._coste(sig);
        if (c > 0) this._fisica(c);
        if (this.fueraMesa) break;
      }
      const desde = this.fase === "leer" ? 0 : antes;
      return { fase: this.fase, eventos: this.eventos.slice(desde) };
    }
    // Resumen para la pantalla
    vueltasPorSegundo() {
      return this.marcasBucle.length;
    }
  };
  function decisionDe(eventos) {
    const c = {};
    for (const e of eventos) if (e.tipo === "cond") c[e.id] = e.valor;
    if (c.if1) return "recto";
    if (c.if2) return "derecha";
    if (c.if3) return "izquierda";
    if ("if1" in c) return "ninguna";
    return null;
  }

  // ../../../../tmp/bitabit-myq0224i/vista2d.js
  function crearVista2D({ canvas: canvas2, contenedor, sim, pista }) {
    const g = canvas2.getContext("2d");
    let W = 1;
    let H = 1;
    let dpr = 1;
    let esc = 1;
    let ox = 0;
    let oy = 0;
    let fondo = null;
    let fondoBrillos = null;
    function medir() {
      const r = (contenedor || canvas2).getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      canvas2.width = Math.round(W * dpr);
      canvas2.height = Math.round(H * dpr);
      esc = Math.min(W / MESA.ancho, H / MESA.alto);
      ox = W / 2;
      oy = H / 2;
      fondo = null;
      fondoBrillos = null;
    }
    const X = (x) => ox + x * esc;
    const Y = (y) => oy - y * esc;
    function pintarFondo(brillos) {
      const cv = document.createElement("canvas");
      cv.width = canvas2.width;
      cv.height = canvas2.height;
      const c = cv.getContext("2d");
      c.scale(dpr, dpr);
      c.fillStyle = "#f6f6f1";
      c.fillRect(0, 0, W, H);
      c.lineWidth = 1;
      for (let x = -650; x <= 650; x += 50) {
        c.strokeStyle = x % 100 === 0 ? "rgba(30,50,40,0.09)" : "rgba(30,50,40,0.04)";
        c.beginPath();
        c.moveTo(X(x), 0);
        c.lineTo(X(x), H);
        c.stroke();
      }
      for (let y = -450; y <= 450; y += 50) {
        c.strokeStyle = y % 100 === 0 ? "rgba(30,50,40,0.09)" : "rgba(30,50,40,0.04)";
        c.beginPath();
        c.moveTo(0, Y(y));
        c.lineTo(W, Y(y));
        c.stroke();
      }
      const trazar = () => {
        c.beginPath();
        pista.pts.forEach((p, i) => i ? c.lineTo(X(p.x), Y(p.y)) : c.moveTo(X(p.x), Y(p.y)));
        c.closePath();
      };
      c.lineJoin = "round";
      c.lineCap = "round";
      c.strokeStyle = "#141516";
      c.lineWidth = pista.ancho * esc;
      trazar();
      c.stroke();
      if (brillos) {
        for (const b of BRILLOS) {
          c.save();
          c.beginPath();
          c.arc(X(b.x), Y(b.y), b.r * esc, 0, Math.PI * 2);
          c.clip();
          c.strokeStyle = "rgba(214,226,235,0.9)";
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
      c.strokeStyle = "#d92f2a";
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
      const R = sim.rastro;
      if (R.length > 1) {
        g.strokeStyle = "rgba(217,47,42,0.55)";
        g.lineWidth = Math.max(1, 2.2 * esc * 1.6);
        g.beginPath();
        R.forEach((p, i) => i ? g.lineTo(X(p.x), Y(p.y)) : g.moveTo(X(p.x), Y(p.y)));
        g.stroke();
      }
      const r = sim.robot;
      const c = Math.cos(r.rumbo);
      const s = Math.sin(r.rumbo);
      const cxr = r.x + c * 6;
      const cyr = r.y + s * 6;
      rectRot(cxr, cyr, r.rumbo, 132, 72, 10);
      g.fillStyle = "rgba(35,41,43,0.88)";
      g.fill();
      for (const lado of [1, -1]) {
        const wx = r.x - s * (APROX.distanciaRuedas / 2) * lado;
        const wy = r.y + c * (APROX.distanciaRuedas / 2) * lado;
        rectRot(wx, wy, r.rumbo, 42, 13, 3);
        g.fillStyle = "#111";
        g.fill();
      }
      rectRot(r.x - c * 54, r.y - s * 54, r.rumbo, 4, 52, 1);
      g.fillStyle = "#d1a645";
      g.fill();
      const lect = sim.leerTodos();
      for (const n of DOC.sensores) {
        const p = sim.posSensor(n);
        const on = lect[n].v === 1;
        g.beginPath();
        g.arc(X(p.x), Y(p.y), Math.max(2.4, 5 * esc), 0, Math.PI * 2);
        g.fillStyle = on ? "#ff3b30" : "#ffffff";
        g.fill();
        g.lineWidth = 1;
        g.strokeStyle = sim.ajustes.tapado === n ? "#ffd400" : "rgba(0,0,0,0.55)";
        g.stroke();
      }
      let x = r.x;
      let y = r.y;
      let th = r.rumbo;
      const vv = (r.vI + r.vD) / 2;
      const w = (r.vD - r.vI) / APROX.distanciaRuedas;
      if (Math.abs(vv) > 2) {
        g.setLineDash([5, 4]);
        g.strokeStyle = "#0d6654";
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
    ro.observe(contenedor || canvas2);
    return {
      dibujar,
      tipo: "2d",
      animarFase() {
      },
      presetVista() {
      },
      zoom() {
      },
      opciones: { transparente: false, nombres: false },
      cam: {},
      destruir() {
        ro.disconnect();
      }
    };
  }

  // ../../../../tmp/bitabit-myq0224i/portada.js
  var canvas = document.getElementById("lienzoPortada");
  var caja = document.getElementById("pistaViva");
  var estado = document.getElementById("estadoPortada");
  var boton = document.getElementById("pausaPortada");
  if (canvas && caja) {
    let cuadro = function(now) {
      const dt = Math.min(64, now - t0);
      t0 = now;
      if (enMarcha && visible && !document.hidden) sim.avanzar(dt * 2);
      if (visible) vista.dibujar();
      if (now - tTexto > 200) {
        tTexto = now;
        estado.textContent = TEXTO[sim.ultimaDecision] || "Arrancando";
      }
      requestAnimationFrame(cuadro);
    };
    const pista = new Pista(CIRCUITO);
    const sim = new Siguelineas({ pista, seed: 3 });
    sim.avanzar(4200);
    const vista = crearVista2D({ canvas, contenedor: caja, sim, pista });
    const TEXTO = {
      recto: "Recto: M ve la línea",
      derecha: "Gira a la derecha: R1 ve la línea",
      izquierda: "Gira a la izquierda: L1 ve la línea",
      ninguna: "Nada nuevo: sigue con la última orden"
    };
    let enMarcha = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    new IntersectionObserver((e) => visible = e[0].isIntersecting).observe(caja);
    const ponerBoton = () => boton.textContent = enMarcha ? "Pausa" : "Ponlo en marcha";
    ponerBoton();
    boton.addEventListener("click", () => {
      enMarcha = !enMarcha;
      ponerBoton();
    });
    let t0 = performance.now();
    let tTexto = 0;
    vista.dibujar();
    requestAnimationFrame(cuadro);
  }
})();
