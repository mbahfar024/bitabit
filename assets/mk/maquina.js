// Bit a bit · Intérprete de programas de MakeCode
// Ejecuta el mismo árbol que se dibuja en bloques y Python. Cada micro:bit
// (Placa) tiene sus hilos, como en la placa de verdad: «al iniciar», cada
// «para siempre» y cada evento corren por turnos y solo ceden el turno cuando
// esperan (pausa, mostrar algo en la pantalla, los 20 ms de «para siempre»…).
// El Mundo lleva el tiempo de todas las placas y de la física del laboratorio.

import { CATALOGO } from './programa.js';

export const PASO = { paso: true }; // marca para poder parar entre dos acciones

export class Mundo {
  constructor({ fisica = null, pasoFisica = 2 } = {}) {
    this.t = 0;
    this.placas = [];
    this.cola = []; // eventos programados del hardware: { t, fn }
    this.fisica = fisica;
    this.pasoFisica = pasoFisica;
    this.registro = []; // lo que ha pasado (para narrar y resaltar)
    this.observadores = [];
  }
  agregar(placa) {
    placa.mundo = this;
    this.placas.push(placa);
    return placa;
  }
  programar(dt, fn) {
    this.cola.push({ t: this.t + Math.max(0, dt), fn, orden: this.cola.length + Math.random() * 1e-6 });
    this.cola.sort((a, b) => a.t - b.t || a.orden - b.orden);
  }
  emitir(ev) {
    ev.t = this.t;
    this.registro.push(ev);
    if (this.registro.length > 4000) {
      this.registro.splice(0, 2000);
      this.revisadoHasta = Math.max(0, (this.revisadoHasta || 0) - 2000);
    }
    for (const o of this.observadores) o(ev);
    return ev;
  }
  iniciar() {
    for (const p of this.placas) p.iniciar();
  }
  // Avanza la física (y el hardware de las placas) hasta «hasta»; si se pasa
  // «parar», se detiene en cuanto el hardware emite un evento que lo cumple.
  avanzarFisica(hasta, parar = null) {
    while (this.t < hasta - 1e-9) {
      const dt = Math.min(this.pasoFisica, hasta - this.t);
      this.fisica?.avanzar?.(dt, this);
      for (const p of this.placas) p.avanzarHardware?.(dt);
      this.t += dt;
      if (parar) {
        const ev = this.revisar(parar);
        if (ev) return ev;
      }
      // Lo programado para este instante (radio, eventos…) se atiende sin esperar
      if (this.cola.length && this.cola[0].t <= this.t + 1e-9) break;
    }
    if (this.t > hasta - 1e-9) this.t = Math.max(this.t, hasta);
    return null;
  }
  // Busca, entre los eventos aún no revisados, el primero que cumpla parar
  revisar(parar) {
    const reg = this.registro;
    for (let i = this.revisadoHasta || 0; i < reg.length; i++) {
      if (parar && parar(reg[i])) {
        this.revisadoHasta = i + 1;
        return reg[i];
      }
    }
    this.revisadoHasta = reg.length;
    return null;
  }
  // Corre hasta el tiempo tFin, o hasta que parar(evento) devuelva true.
  // Devuelve el evento que hizo parar, o null.
  correr(tFin, parar = null) {
    let guarda = 0;
    // Lo ocurrido antes de esta llamada ya no cuenta para parar
    this.revisadoHasta = this.registro.length;
    for (;;) {
      if (++guarda > 200000) return null;
      // 1. Eventos del hardware que tocan ya
      while (this.cola.length && this.cola[0].t <= this.t + 1e-9) this.cola.shift().fn(this);
      if (parar) {
        const ev = this.revisar(parar);
        if (ev) return ev;
      }
      // 2. Hilos listos
      let listo = null;
      for (const p of this.placas)
        for (const f of p.hilos) if (!f.fin && f.despierta <= this.t + 1e-9 && (!listo || f.despierta < listo.f.despierta || (f.despierta === listo.f.despierta && f.n < listo.f.n))) listo = { p, f };
      if (listo) {
        const ev = listo.p.correrHilo(listo.f, parar);
        if (ev) return ev;
        continue;
      }
      // 3. Avanzar el tiempo hasta lo siguiente que pase
      let tSig = tFin;
      for (const p of this.placas) for (const f of p.hilos) if (!f.fin) tSig = Math.min(tSig, f.despierta);
      if (this.cola.length) tSig = Math.min(tSig, this.cola[0].t);
      if (tSig <= this.t + 1e-9) {
        if (this.t >= tFin - 1e-9) return null;
        tSig = Math.min(tFin, this.t + this.pasoFisica);
      }
      const evF = this.avanzarFisica(tSig, parar);
      if (evF) return evF;
      if (this.t >= tFin - 1e-9 && !this.placas.some((p) => p.hilos.some((f) => !f.fin && f.despierta <= this.t + 1e-9)) && !(this.cola.length && this.cola[0].t <= this.t + 1e-9)) return null;
    }
  }
}

let contadorHilos = 0;

export class Placa {
  constructor({ nombre = 'micro:bit', programa, api }) {
    this.nombre = nombre;
    this.programa = programa;
    this.api = api; // { 'basic.showNumber': (placa, args, nodo) => valor | iterador }
    this.hilos = [];
    this.vars = {};
    this.manejadores = {};
    this.mundo = null;
  }
  get t() {
    return this.mundo.t;
  }
  emitir(ev) {
    ev.placa = this.nombre;
    return this.mundo.emitir(ev);
  }
  reiniciarPrograma() {
    this.hilos = [];
    this.vars = {};
    this.manejadores = {};
    for (const v of this.programa.vars) this.vars[v] = 0;
  }
  iniciar() {
    this.reiniciarPrograma();
    const inicio = this.programa.bloques.find((b) => b.ev === 'alIniciar');
    // Los eventos se registran antes de empezar, como en MakeCode
    for (const b of this.programa.bloques) {
      if (b.ev === 'alIniciar' || b.ev === 'paraSiempre') continue;
      const clave = this.claveEvento(b);
      (this.manejadores[clave] ||= []).push({ bloque: b, ocupado: false, pendientes: [] });
      if (b.ev === 'loops.everyInterval') {
        const ms = b.args[0];
        const tic = () => {
          this.disparar(clave);
          this.mundo.programar(ms, tic);
        };
        this.mundo.programar(ms, tic);
      }
    }
    this.nuevoHilo(this.cuerpo(inicio ? inicio.cuerpo : [], inicio), 'inicio', inicio?.id);
    for (const b of this.programa.bloques.filter((b) => b.ev === 'paraSiempre')) this.nuevoHilo(this.siempre(b), 'siempre', b.id);
  }
  claveEvento(b) {
    const a = b.args.map((x) => (typeof x === 'object' ? x.v : x));
    switch (b.ev) {
      case 'input.onButtonPressed':
        return 'boton:' + a[0];
      case 'input.onLogoEvent':
        return 'logo';
      case 'input.onGesture':
        return 'gesto:' + a[0];
      case 'radio.onReceivedNumber':
        return 'radio:numero';
      case 'radio.onReceivedString':
        return 'radio:cadena';
      case 'loops.everyInterval':
        return 'cada:' + a[0];
      default:
        return b.ev + ':' + a.join(',');
    }
  }
  tieneEvento(clave) {
    return !!this.manejadores[clave];
  }
  // Un evento del hardware: cada manejador corre en su propio hilo; si ya está
  // corriendo, el evento espera su turno (en la micro:bit: «queue if busy»)
  disparar(clave, valor) {
    const lista = this.manejadores[clave];
    if (!lista) return false;
    for (const m of lista) {
      if (m.ocupado) {
        m.pendientes.push(valor);
        continue;
      }
      this.lanzarManejador(m, valor);
    }
    return true;
  }
  lanzarManejador(m, valor) {
    m.ocupado = true;
    const placa = this;
    const b = m.bloque;
    const gen = (function* () {
      placa.emitir({ tipo: 'evento', id: b.id, ev: b.ev, valor });
      yield PASO;
      const param = placa.programaParam(b);
      const antes = param ? placa.vars[param] : undefined;
      if (param) placa.vars[param] = valor;
      yield* placa.ejecutarLista(b.cuerpo);
      if (param) placa.vars[param] = antes ?? valor;
      m.ocupado = false;
      if (m.pendientes.length) placa.lanzarManejador(m, m.pendientes.shift());
    })();
    this.nuevoHilo(gen, 'evento', b.id);
  }
  programaParam(b) {
    // El parámetro que recibe el evento (receivedNumber, message…), según el catálogo
    return CATALOGO[b.ev]?.param || null;
  }
  nuevoHilo(gen, tipo, id) {
    const h = { gen, tipo, id, despierta: this.mundo.t, fin: false, n: ++contadorHilos };
    this.hilos.push(h);
    return h;
  }
  *cuerpo(lista, bloque) {
    if (bloque) {
      this.emitir({ tipo: 'evento', id: bloque.id, ev: 'alIniciar' });
      yield PASO;
    }
    yield* this.ejecutarLista(lista);
  }
  *siempre(b) {
    for (;;) {
      this.emitir({ tipo: 'vuelta', id: b.id });
      yield PASO;
      yield* this.ejecutarLista(b.cuerpo);
      // «para siempre» cede el turno 20 ms en cada vuelta (pxt-microbit, codal.cpp)
      this.emitir({ tipo: 'esperar', id: b.id + 'p', ms: 20, nodo: 'pausaSiempre' });
      yield { esperar: 20 };
    }
  }
  // Corre un hilo hasta que espere, acabe o se cumpla parar(evento)
  correrHilo(h, parar) {
    const base = this.mundo.registro.length;
    for (let i = 0; i < 100000; i++) {
      let r;
      try {
        r = h.gen.next();
      } catch (e) {
        console.error('Error en el programa simulado', e);
        h.fin = true;
        return null;
      }
      if (r.done) {
        h.fin = true;
        this.hilos = this.hilos.filter((x) => !x.fin);
        return null;
      }
      const v = r.value;
      if (v && v.esperar != null) {
        h.despierta = this.mundo.t + v.esperar;
        return this.comprobarParada(base, parar);
      }
      if (parar) {
        const ev = this.comprobarParada(base, parar);
        if (ev) return ev;
      }
    }
    h.despierta = this.mundo.t + 1; // bucle sin esperas: se fuerza un respiro
    return null;
  }
  comprobarParada(base, parar) {
    if (!parar) return null;
    return this.mundo.revisar(parar);
  }

  // ---------------- Intérprete ----------------
  *ejecutarLista(lista) {
    for (const s of lista) yield* this.sentencia(s);
  }
  *sentencia(s) {
    switch (s.k) {
      case 'llamada': {
        this.emitir({ tipo: 'nodo', id: s.id, f: s.f });
        yield PASO;
        const args = [];
        for (const a of s.args) args.push(yield* this.valor(a));
        const r = yield* this.llamar(s, args);
        return r;
      }
      case 'si': {
        this.emitir({ tipo: 'nodo', id: s.id, k: 'si' });
        yield PASO;
        const c = !!(yield* this.valor(s.cond));
        this.emitir({ tipo: 'cond', id: s.id, valor: c, cond: s.cond.id });
        yield PASO;
        if (c) return yield* this.ejecutarLista(s.entonces);
        for (const ss of s.sinoSi || []) {
          const c2 = !!(yield* this.valor(ss.cond));
          this.emitir({ tipo: 'cond', id: ss.cond.id + 'm', valor: c2, cond: ss.cond.id });
          yield PASO;
          if (c2) return yield* this.ejecutarLista(ss.cuerpo);
        }
        if (s.sino) {
          this.emitir({ tipo: 'nodo', id: s.id + 'e', k: 'sino' });
          yield PASO;
          return yield* this.ejecutarLista(s.sino);
        }
        return;
      }
      case 'repetir': {
        const n = Math.max(0, Math.floor(yield* this.valor(s.veces)));
        for (let i = 0; i < n; i++) {
          this.emitir({ tipo: 'nodo', id: s.id, k: 'repetir', vuelta: i + 1, de: n });
          yield PASO;
          yield* this.ejecutarLista(s.cuerpo);
        }
        return;
      }
      case 'mientras': {
        let vueltas = 0;
        for (;;) {
          const c = !!(yield* this.valor(s.cond));
          this.emitir({ tipo: 'cond', id: s.id, valor: c, cond: s.cond.id });
          yield PASO;
          if (!c) return;
          yield* this.ejecutarLista(s.cuerpo);
          if (++vueltas % 5000 === 0) yield { esperar: 1 };
        }
      }
      case 'asignar': {
        const v = yield* this.valor(s.valor);
        this.vars[s.n] = v;
        this.emitir({ tipo: 'var', id: s.id, n: s.n, valor: v });
        yield PASO;
        return;
      }
      case 'cambiar': {
        const v = yield* this.valor(s.por);
        this.vars[s.n] = (this.vars[s.n] || 0) + v;
        this.emitir({ tipo: 'var', id: s.id, n: s.n, valor: this.vars[s.n] });
        yield PASO;
        return;
      }
    }
  }
  *llamar(nodo, args) {
    const f = this.api[nodo.f];
    if (!f) throw new Error('Falta el bloque ' + nodo.f);
    const r = f(this, args, nodo);
    if (r && typeof r.next === 'function') return yield* r;
    return r;
  }
  *valor(x) {
    switch (x.k) {
      case 'num':
        return x.v;
      case 'lit':
      case 'txt':
        return x.v;
      case 'bool':
        return x.v;
      case 'leds':
        return x.v;
      case 'var':
        return this.vars[x.n] ?? 0;
      case 'op': {
        const a = yield* this.valor(x.a);
        const b = yield* this.valor(x.b);
        switch (x.op) {
          case '+':
            return typeof a === 'string' || typeof b === 'string' ? String(a) + String(b) : a + b;
          case '-':
            return a - b;
          case '*':
            return a * b;
          case '/':
            return b === 0 ? 0 : a / b;
          case '%':
            return b === 0 ? 0 : a % b;
        }
        return 0;
      }
      case 'cmp': {
        const a = yield* this.valor(x.a);
        const b = yield* this.valor(x.b);
        let r;
        switch (x.op) {
          case '==':
            r = a == b;
            break;
          case '!=':
            r = a != b;
            break;
          case '<':
            r = a < b;
            break;
          case '<=':
            r = a <= b;
            break;
          case '>':
            r = a > b;
            break;
          case '>=':
            r = a >= b;
            break;
        }
        this.emitir({ tipo: 'comparar', id: x.id, a, b, op: x.op, valor: r });
        return r;
      }
      case 'logico': {
        const a = !!(yield* this.valor(x.a));
        if (x.op === 'y' && !a) return false;
        if (x.op === 'o' && a) return true;
        return !!(yield* this.valor(x.b));
      }
      case 'no':
        return !(yield* this.valor(x.a));
      case 'llamada': {
        const args = [];
        for (const a of x.args) args.push(yield* this.valor(a));
        const v = yield* this.llamar(x, args);
        this.emitir({ tipo: 'leer', id: x.id, f: x.f, args, valor: v });
        yield PASO;
        return v;
      }
    }
    return 0;
  }
}
