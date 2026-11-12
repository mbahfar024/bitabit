// Bit a bit · Modelo de una micro:bit V2 para el intérprete
// Pantalla (con el desplazamiento de texto), botones, logo, sensores, radio,
// pines y música. Lo que depende del laboratorio (luz, temperatura, inclinación,
// módulos conectados…) lo pone el «entorno».
//
// Datos de la placa: pxt-microbit (basic.cpp, input.cpp), codal-microbit-v2
// (MicroBit.cpp, NRF52LedMatrix.h, MicroBitRadio.h) y tech.microbit.org.
import { Placa } from './maquina.js';
import { ICONOS } from './programa.js';

// Tipografía de la pantalla (pendolino3 de codal-core, BitmapFont.cpp): 5 bytes
// por carácter desde el espacio (ASCII 32); en cada byte, los 5 bits bajos son una fila.
const FUENTE = [0x0, 0x0, 0x0, 0x0, 0x0, 0x8, 0x8, 0x8, 0x0, 0x8, 0xa, 0x4a, 0x40, 0x0, 0x0, 0xa, 0x5f, 0xea, 0x5f, 0xea, 0xe, 0xd9, 0x2e, 0xd3, 0x6e, 0x19, 0x32, 0x44, 0x89, 0x33, 0xc, 0x92, 0x4c, 0x92, 0x4d, 0x8, 0x8, 0x0, 0x0, 0x0, 0x4, 0x88, 0x8, 0x8, 0x4, 0x8, 0x4, 0x84, 0x84, 0x88, 0x0, 0xa, 0x44, 0x8a, 0x40, 0x0, 0x4, 0x8e, 0xc4, 0x80, 0x0, 0x0, 0x0, 0x4, 0x88, 0x0, 0x0, 0xe, 0xc0, 0x0, 0x0, 0x0, 0x0, 0x8, 0x0, 0x1, 0x22, 0x44, 0x88, 0x10, 0xc, 0x92, 0x52, 0x52, 0x4c, 0x4, 0x8c, 0x84, 0x84, 0x8e, 0x1c, 0x82, 0x4c, 0x90, 0x1e, 0x1e, 0xc2, 0x44, 0x92, 0x4c, 0x6, 0xca, 0x52, 0x5f, 0xe2, 0x1f, 0xf0, 0x1e, 0xc1, 0x3e, 0x2, 0x44, 0x8e, 0xd1, 0x2e, 0x1f, 0xe2, 0x44, 0x88, 0x10, 0xe, 0xd1, 0x2e, 0xd1, 0x2e, 0xe, 0xd1, 0x2e, 0xc4, 0x88, 0x0, 0x8, 0x0, 0x8, 0x0, 0x0, 0x4, 0x80, 0x4, 0x88, 0x2, 0x44, 0x88, 0x4, 0x82, 0x0, 0xe, 0xc0, 0xe, 0xc0, 0x8, 0x4, 0x82, 0x44, 0x88, 0xe, 0xd1, 0x26, 0xc0, 0x4, 0xe, 0xd1, 0x35, 0xb3, 0x6c, 0xc, 0x92, 0x5e, 0xd2, 0x52, 0x1c, 0x92, 0x5c, 0x92, 0x5c, 0xe, 0xd0, 0x10, 0x10, 0xe, 0x1c, 0x92, 0x52, 0x52, 0x5c, 0x1e, 0xd0, 0x1c, 0x90, 0x1e, 0x1e, 0xd0, 0x1c, 0x90, 0x10, 0xe, 0xd0, 0x13, 0x71, 0x2e, 0x12, 0x52, 0x5e, 0xd2, 0x52, 0x1c, 0x88, 0x8, 0x8, 0x1c, 0x1f, 0xe2, 0x42, 0x52, 0x4c, 0x12, 0x54, 0x98, 0x14, 0x92, 0x10, 0x10, 0x10, 0x10, 0x1e, 0x11, 0x3b, 0x75, 0xb1, 0x31, 0x11, 0x39, 0x35, 0xb3, 0x71, 0xc, 0x92, 0x52, 0x52, 0x4c, 0x1c, 0x92, 0x5c, 0x90, 0x10, 0xc, 0x92, 0x52, 0x4c, 0x86, 0x1c, 0x92, 0x5c, 0x92, 0x51, 0xe, 0xd0, 0xc, 0x82, 0x5c, 0x1f, 0xe4, 0x84, 0x84, 0x84, 0x12, 0x52, 0x52, 0x52, 0x4c, 0x11, 0x31, 0x31, 0x2a, 0x44, 0x11, 0x31, 0x35, 0xbb, 0x71, 0x12, 0x52, 0x4c, 0x92, 0x52, 0x11, 0x2a, 0x44, 0x84, 0x84, 0x1e, 0xc4, 0x88, 0x10, 0x1e, 0xe, 0xc8, 0x8, 0x8, 0xe, 0x10, 0x8, 0x4, 0x82, 0x41, 0xe, 0xc2, 0x42, 0x42, 0x4e, 0x4, 0x8a, 0x40, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x1f, 0x8, 0x4, 0x80, 0x0, 0x0, 0x0, 0xe, 0xd2, 0x52, 0x4f, 0x10, 0x10, 0x1c, 0x92, 0x5c, 0x0, 0xe, 0xd0, 0x10, 0xe, 0x2, 0x42, 0x4e, 0xd2, 0x4e, 0xc, 0x92, 0x5c, 0x90, 0xe, 0x6, 0xc8, 0x1c, 0x88, 0x8, 0xe, 0xd2, 0x4e, 0xc2, 0x4c, 0x10, 0x10, 0x1c, 0x92, 0x52, 0x8, 0x0, 0x8, 0x8, 0x8, 0x2, 0x40, 0x2, 0x42, 0x4c, 0x10, 0x14, 0x98, 0x14, 0x92, 0x8, 0x8, 0x8, 0x8, 0x6, 0x0, 0x1b, 0x75, 0xb1, 0x31, 0x0, 0x1c, 0x92, 0x52, 0x52, 0x0, 0xc, 0x92, 0x52, 0x4c, 0x0, 0x1c, 0x92, 0x5c, 0x90, 0x0, 0xe, 0xd2, 0x4e, 0xc2, 0x0, 0xe, 0xd0, 0x10, 0x10, 0x0, 0x6, 0xc8, 0x4, 0x98, 0x8, 0x8, 0xe, 0xc8, 0x7, 0x0, 0x12, 0x52, 0x52, 0x4f, 0x0, 0x11, 0x31, 0x2a, 0x44, 0x0, 0x11, 0x31, 0x35, 0xbb, 0x0, 0x12, 0x4c, 0x8c, 0x92, 0x0, 0x11, 0x2a, 0x44, 0x98, 0x0, 0x1e, 0xc4, 0x88, 0x1e, 0x6, 0xc4, 0x8c, 0x84, 0x86, 0x8, 0x8, 0x8, 0x8, 0x8, 0x18, 0x8, 0xc, 0x88, 0x18, 0x0, 0x0, 0xc, 0x83, 0x60];

export function columnasCaracter(ch) {
  let c = ch.charCodeAt(0);
  if (c < 32 || c > 126) c = 63; // ?
  const base = (c - 32) * 5;
  const filas = FUENTE.slice(base, base + 5).map((b) => b & 0x1f);
  // 5 columnas de 5 bits (bit 4 = columna 0)
  return [0, 1, 2, 3, 4].map((x) => filas.map((f) => (f >> (4 - x)) & 1));
}

// Flechas de images.arrowImage (pxt-microbit, libs/core/icons.ts)
export const FLECHAS = {
  North: ['. . # . .', '. # # # .', '# . # . #', '. . # . .', '. . # . .'],
  East: ['. . # . .', '. . . # .', '# # # # #', '. . . # .', '. . # . .'],
  South: ['. . # . .', '. . # . .', '# . # . #', '. # # # .', '. . # . .'],
  West: ['. . # . .', '. # . . .', '# # # # #', '. # . . .', '. . # . .'],
};

export function patronAMatriz(filas) {
  return filas.map((f) => f.replace(/\s+/g, '').split('').map((c) => (c === '#' ? 255 : 0)));
}

const formatoNumero = (v) => {
  if (Number.isNaN(v)) return '?';
  const r = Math.round(v * 100) / 100;
  return String(r);
};

// ---------------------------------------------------------------------------
// Estado de la placa y bloques
export function crearMicrobit({ nombre = 'micro:bit', programa, entorno = {}, extras = {} }) {
  const est = {
    pantalla: Array.from({ length: 5 }, () => [0, 0, 0, 0, 0]), // 0–255 por LED
    brillo: 255,
    pantallaActiva: true,
    animando: false,
    botones: { A: false, B: false },
    logo: false,
    luzActiva: false,
    lecturasLuz: 0,
    brujulaCalibrada: false,
    calibrando: false,
    radio: { grupo: 0, potencia: 6, activa: false, intensidad: -128, enviados: 0, recibidos: 0 },
    pines: {}, // P0: { modo: 'digital'|'analogico'|'servo'|'tono', valor }
    pwm: [], // pines con PWM (escritura analógica o servo)
    canales: [null, null, null, null], // los 4 canales PWM de la V2 y el pin de cada uno
    ultimoCanal: 3,
    pinTono: 'P0',
    altavoz: true,
    tono: { f: 0, hasta: 0 },
    tempo: 120,
    arranque: 0,
    temp: { t: -Infinity, v: 0 },
  };

  const pausa = function* (ms) {
    yield { esperar: Math.max(0, ms) };
  };
  const mostrarMatriz = (m) => {
    for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) est.pantalla[y][x] = m[y][x];
  };
  const borrar = () => mostrarMatriz(Array.from({ length: 5 }, () => [0, 0, 0, 0, 0]));

  function* desplazar(texto, intervalo = 150) {
    // Tira de columnas: 5 vacías + (5 columnas + 1 de separación) por carácter
    const tira = [];
    for (let i = 0; i < 5; i++) tira.push([0, 0, 0, 0, 0]);
    for (const ch of texto) {
      tira.push(...columnasCaracter(ch));
      tira.push([0, 0, 0, 0, 0]);
    }
    est.animando = true;
    for (let k = 1; k + 5 <= tira.length + 5; k++) {
      for (let x = 0; x < 5; x++) {
        const col = tira[k + x] || [0, 0, 0, 0, 0];
        for (let y = 0; y < 5; y++) est.pantalla[y][x] = col[y] ? 255 : 0;
      }
      yield { esperar: intervalo };
    }
    est.animando = false;
  }
  function* mostrarCadena(texto, intervalo = 150) {
    texto = String(texto);
    if (texto.length === 0) {
      borrar();
      yield* pausa(intervalo * 5);
    } else if (texto.length > 1) yield* desplazar(texto, intervalo);
    else {
      const cols = columnasCaracter(texto);
      for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) est.pantalla[y][x] = cols[x][y] ? 255 : 0;
      yield* pausa(intervalo * 5);
    }
  }

  // PWM de la escritura analógica y de los servos, como en la V2 (codal-nrf52,
  // NRF52Pin.cpp): un solo periférico con 4 canales que se reparten por turnos. Un pin
  // nuevo coge el canal siguiente y, si estaba ocupado, se lo quita al pin que lo tenía,
  // que deja de dar su señal. La documentación técnica de la micro:bit habla de 3 pines
  // a la vez. La música de la V2 va por otro periférico (MicroBitAudio) y no cuenta.
  function usarPWM(pin) {
    if (est.canales.includes(pin)) return null;
    const c = (est.ultimoCanal + 1) % est.canales.length;
    est.ultimoCanal = c;
    const fuera = est.canales[c];
    est.canales[c] = pin;
    est.pwm = est.canales.filter(Boolean);
    if (fuera) {
      const p = est.pines[fuera];
      if (p) p.pwmPerdido = true;
      entorno.circuito?.pwmPerdido?.(fuera);
    }
    return fuera;
  }
  const soltarPWM = (pin) => {
    const i = est.canales.indexOf(pin);
    if (i >= 0) est.canales[i] = null;
    est.pwm = est.canales.filter(Boolean);
  };

  const api = {
    'basic.showNumber': (pl, [v]) => mostrarCadena(formatoNumero(v)),
    'basic.showString': (pl, [t]) => mostrarCadena(t),
    'basic.showLeds': function* (pl, [filas]) {
      mostrarMatriz(patronAMatriz(filas));
      yield* pausa(400);
    },
    'basic.showIcon': function* (pl, [nombreIcono]) {
      mostrarMatriz(patronAMatriz(ICONOS[nombreIcono]));
      yield* pausa(600);
    },
    'basic.showArrow': function* (pl, [dir]) {
      // pxt-microbit, icons.ts: showArrow(direction, interval = 600)
      mostrarMatriz(patronAMatriz(FLECHAS[dir] || FLECHAS.North));
      yield* pausa(600);
    },
    'basic.clearScreen': () => borrar(),
    'basic.pause': (pl, [ms]) => pausa(ms),
    'led.plot': (pl, [x, y]) => {
      if (x >= 0 && x < 5 && y >= 0 && y < 5) est.pantalla[Math.floor(y)][Math.floor(x)] = 255;
    },
    'led.unplot': (pl, [x, y]) => {
      if (x >= 0 && x < 5 && y >= 0 && y < 5) est.pantalla[Math.floor(y)][Math.floor(x)] = 0;
    },
    'led.setBrightness': (pl, [b]) => (est.brillo = Math.max(0, Math.min(255, b))),
    'led.enable': (pl, [on]) => (est.pantallaActiva = !!on),
    'led.plotBarGraph': (pl, [valor, alto]) => {
      // Como en pxt-microbit (led.ts): de abajo arriba y del centro hacia los lados,
      // en pasos de 1/16. Con 0 queda encendido el LED de abajo en el centro.
      if (Number.isNaN(valor)) return borrar();
      const v = Math.abs(valor) / (alto > 0 ? alto : Math.max(1, Math.abs(valor)));
      let k = 0;
      for (let y = 4; y >= 0; --y)
        for (let x = 0; x < 3; ++x) {
          const on = !(k > v);
          est.pantalla[y][2 - x] = on ? 255 : 0;
          est.pantalla[y][2 + x] = on ? 255 : 0;
          k += 1 / 16;
        }
    },
    'input.buttonIsPressed': (pl, [b]) => (b === 'AB' ? est.botones.A && est.botones.B : !!est.botones[b]),
    'input.logoIsPressed': () => est.logo,
    'input.acceleration': (pl, [d]) => {
      const a = entorno.aceleracion?.() ?? { x: 0, y: 0, z: -1023 };
      if (d === 'Strength') return Math.round(Math.hypot(a.x, a.y, a.z));
      return Math.round(a[d.toLowerCase()]);
    },
    'input.lightLevel': () => {
      // La primera lectura enciende el sensor y devuelve 0 (documentación de MakeCode)
      if (!est.luzActiva) {
        est.luzActiva = true;
        return 0;
      }
      est.lecturasLuz++;
      return Math.round(Math.max(0, Math.min(255, entorno.luz?.() ?? 120)));
    },
    // CODAL (NRF52Thermometer): el sensor del procesador se lee como mucho una vez por
    // segundo y da grados enteros: la medida (en pasos de 0,25 °C) dividida entre 4, sin decimales.
    'input.temperature': (pl) => {
      if (pl.t - est.temp.t >= 1000) est.temp = { t: pl.t, v: Math.trunc(Math.round((entorno.temperatura?.() ?? 21) * 4) / 4) };
      return est.temp.v;
    },
    'input.compassHeading': function* () {
      if (!est.brujulaCalibrada) yield* calibrar();
      return Math.round(entorno.rumbo?.() ?? 0);
    },
    'input.calibrateCompass': () => calibrar(),
    'input.soundLevel': () => {
      est.micActivo = true; // el LED del micrófono se enciende mientras se usa
      return Math.round(Math.max(0, Math.min(255, entorno.sonido?.() ?? 10)));
    },
    'input.runningTime': (pl) => Math.round(pl.t - est.arranque),
    'music.playTone': function* (pl, [f, beats]) {
      const ms = (60000 / est.tempo) * beats;
      tocar(f, ms);
      yield* pausa(ms);
      est.tono.f = 0;
    },
    'music.ringTone': (pl, [f]) => tocar(f, Infinity),
    // Un «sonido» que se puede reproducir: aquí, un tono con su duración en tiempos
    'music.tonePlayable': (pl, [f, beats]) => ({ tipo: 'tono', f, ms: (60000 / est.tempo) * beats }),
    'music.play': function* (pl, [sonido, modo]) {
      if (!sonido || sonido.tipo !== 'tono') return;
      if (modo === 'UntilDone') {
        tocar(sonido.f, sonido.ms);
        yield* pausa(sonido.ms);
        est.tono.f = 0;
      } else if (modo === 'InBackground') {
        // runInParallel: el programa sigue sin esperar; la nota acaba sola
        tocar(sonido.f, sonido.ms);
      } else {
        // En bucle en segundo plano: se repite hasta «detener todos los sonidos»
        tocar(sonido.f, Infinity);
      }
    },
    'music.rest': (pl, [beats]) => {
      est.tono.f = 0;
      return pausa((60000 / est.tempo) * beats);
    },
    'music.stopAllSounds': () => (est.tono.f = 0),
    'music.setBuiltInSpeakerEnabled': (pl, [on]) => (est.altavoz = !!on),
    'pins.analogSetPitchPin': (pl, [pin]) => (est.pinTono = pin),
    'radio.setGroup': (pl, [g]) => {
      est.radio.grupo = Math.max(0, Math.min(255, Math.round(g)));
      est.radio.activa = true;
    },
    'radio.setTransmitPower': (pl, [p]) => (est.radio.potencia = Math.max(0, Math.min(7, Math.round(p)))),
    'radio.sendNumber': (pl, [v]) => enviar(pl, 'numero', v),
    'radio.sendString': (pl, [v]) => enviar(pl, 'cadena', String(v).slice(0, 19)),
    'radio.receivedPacket': () => est.radio.intensidad,
    'pins.digitalReadPin': (pl, [pin]) => {
      ponerPin(pin, 'entrada');
      return entorno.circuito?.leerDigital?.(pin, est) ?? 0;
    },
    'pins.digitalWritePin': (pl, [pin, v]) => {
      soltarPWM(pin);
      ponerPin(pin, 'digital', v ? 1 : 0);
      entorno.circuito?.escribirDigital?.(pin, v ? 1 : 0, est);
    },
    'pins.analogReadPin': (pl, [pin]) => {
      ponerPin(pin, 'entradaAnalogica');
      return Math.round(Math.max(0, Math.min(1023, entorno.circuito?.leerAnalogico?.(pin, est) ?? 0)));
    },
    'pins.analogWritePin': (pl, [pin, v]) => {
      const fuera = usarPWM(pin);
      ponerPin(pin, 'pwm', Math.max(0, Math.min(1023, v)));
      entorno.circuito?.escribirAnalogico?.(pin, Math.max(0, Math.min(1023, v)), est, fuera);
    },
    'pins.servoWritePin': (pl, [pin, v]) => {
      const fuera = usarPWM(pin);
      ponerPin(pin, 'servo', v);
      entorno.circuito?.servo?.(pin, v, est, fuera);
    },
    'pins.setPull': (pl, [pin, modo]) => {
      ponerPin(pin, est.pines[pin]?.modo || 'entrada');
      est.pines[pin].pull = modo;
    },
    'pins.map': (pl, [v, a, b, c, d]) => (b === a ? c : ((v - a) * (d - c)) / (b - a) + c),
    'Math.randomRange': (pl, [a, b]) => {
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      return Math.floor(entorno.azar?.() ?? Math.random() * (hi - lo + 1)) + lo;
    },
    'Math.abs': (pl, [a]) => Math.abs(a),
    'Math.round': (pl, [a]) => Math.round(a),
    'Math.idiv': (pl, [a, b]) => (b === 0 ? 0 : Math.trunc(a / b)),
    'Math.max': (pl, [a, b]) => Math.max(a, b),
    'Math.min': (pl, [a, b]) => Math.min(a, b),
    ...extras,
  };

  function ponerPin(pin, modo, valor) {
    const p = (est.pines[pin] ||= { modo, valor: 0, pull: 'PullDown' });
    p.modo = modo;
    if (valor !== undefined) p.valor = valor;
    p.pwmPerdido = false;
  }
  function tocar(f, ms) {
    est.tono = { f, hasta: placa.t + ms, pin: est.pinTono };
    entorno.circuito?.tono?.(est.pinTono, f, est);
  }
  function* calibrar() {
    est.calibrando = true;
    placa.emitir({ tipo: 'calibrar', inicio: true });
    // La micro:bit pide inclinarla hasta llenar la pantalla; el entorno decide cuándo termina
    let t = 0;
    while (!(entorno.calibracionHecha?.(t) ?? t >= 4000)) {
      yield { esperar: 50 };
      t += 50;
    }
    est.brujulaCalibrada = true;
    est.calibrando = false;
    placa.emitir({ tipo: 'calibrar', fin: true });
    mostrarMatriz(patronAMatriz(ICONOS.Happy));
    yield* pausa(400);
  }
  function enviar(pl, tipo, valor) {
    est.radio.activa = true;
    est.radio.enviados++;
    pl.emitir({ tipo: 'radioEnviar', grupo: est.radio.grupo, clase: tipo, valor });
    const mundo = pl.mundo;
    for (const otra of mundo.placas) {
      if (otra === pl || !otra.microbit) continue;
      const r = otra.microbit.est.radio;
      if (!r.activa) continue;
      // Entrega: el entorno decide si llega y con qué intensidad (dBm)
      const llegada = entorno.radioEntrega?.(pl, otra, est.radio.potencia) ?? { llega: true, intensidad: -50 };
      if (!llegada.llega) {
        pl.emitir({ tipo: 'radioPerdido', a: otra.nombre, valor, motivo: llegada.motivo });
        continue;
      }
      if (r.grupo !== est.radio.grupo) {
        pl.emitir({ tipo: 'radioIgnorado', a: otra.nombre, valor, grupo: r.grupo });
        continue;
      }
      mundo.programar(llegada.retardo ?? 1, () => {
        r.intensidad = Math.round(llegada.intensidad);
        r.recibidos++;
        otra.emitir({ tipo: 'radioRecibir', de: pl.nombre, clase: tipo, valor, intensidad: r.intensidad });
        otra.disparar(tipo === 'numero' ? 'radio:numero' : 'radio:cadena', valor);
      });
    }
  }

  const placa = new Placa({ nombre, programa, api });
  placa.microbit = { est, api };
  // Si el programa usa la radio, la radio se enciende al arrancar (grupo 0 si no se elige otro)
  let usaRadio = false;
  const mirar = (n) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(mirar);
    if ((n.f && n.f.startsWith('radio.')) || (n.ev && String(n.ev).startsWith('radio.'))) usaRadio = true;
    for (const k of ['cuerpo', 'entonces', 'sino', 'args']) if (n[k]) mirar(n[k]);
  };
  mirar(programa.bloques);
  est.radio.activa = usaRadio;
  // Botones y logo como en CODAL (Button.cpp): se mira el contacto cada 6 ms y un
  // contador (sigma, de 0 a 12) filtra los rebotes. Pulsado si sigma > 8; suelto si
  // sigma < 2. Al soltar: «click» si duró menos de 1 s, «click largo» si no.
  // «al presionarse el botón» y «al presionar el logotipo» escuchan el click.
  est.contacto = { A: false, B: false, logo: false };
  est.filtro = { A: mkFiltro(), B: mkFiltro(), logo: mkFiltro() };
  est.ab = false;
  function mkFiltro() {
    return { sigma: 0, estado: false, inicio: 0, tick: 0, ultimoCrudo: false };
  }
  placa.avanzarHardware = (dt) => {
    for (const k of ['A', 'B', 'logo']) {
      const f = est.filtro[k];
      f.tick += dt;
      while (f.tick >= 6) {
        f.tick -= 6;
        tickFiltro(k, f);
      }
    }
  };
  function tickFiltro(k, f) {
    const t = placa.mundo.t;
    // El laboratorio puede cambiar lo que ve el pin (rebotes, ruido, guantes…)
    const crudo = entorno.contacto ? entorno.contacto(k, est.contacto[k], t) : est.contacto[k];
    f.ultimoCrudo = crudo;
    if (entorno.sinFiltro?.(k)) {
      // Sin filtro: cada cambio del contacto cuenta
      if (crudo !== f.estado) {
        f.estado = crudo;
        cambio(k, f, crudo, t);
      }
      f.sigma = crudo ? 12 : 0;
      return;
    }
    if (crudo) f.sigma = Math.min(12, f.sigma + 1);
    else f.sigma = Math.max(0, f.sigma - 1);
    if (f.sigma > 8 && !f.estado) {
      f.estado = true;
      cambio(k, f, true, t);
    }
    if (f.sigma < 2 && f.estado) {
      f.estado = false;
      cambio(k, f, false, t);
    }
  }
  function cambio(k, f, abajo, t) {
    if (k === 'logo') est.logo = abajo;
    else est.botones[k] = abajo;
    if (abajo) {
      f.inicio = t;
      placa.emitir({ tipo: 'abajo', boton: k });
      if (k !== 'logo' && est.botones.A && est.botones.B) est.ab = true;
      return;
    }
    const largo = t - f.inicio >= 1000;
    placa.emitir({ tipo: 'arriba', boton: k, duracion: t - f.inicio, largo });
    if (largo) {
      placa.emitir({ tipo: 'clickLargo', boton: k });
      return;
    }
    if (k === 'logo') return void (placa.emitir({ tipo: 'click', boton: k }), placa.disparar('logo'));
    if (est.ab) {
      // A+B: el click sale al soltar el último de los dos
      if (!est.botones.A && !est.botones.B) {
        est.ab = false;
        placa.emitir({ tipo: 'click', boton: 'AB' });
        placa.disparar('boton:AB');
      }
      return;
    }
    placa.emitir({ tipo: 'click', boton: k });
    placa.disparar('boton:' + k);
  }
  // Acciones del usuario sobre la placa
  placa.pulsarBoton = (b, abajo) => {
    if (b === 'AB') {
      est.contacto.A = abajo;
      est.contacto.B = abajo;
    } else est.contacto[b] = abajo;
    placa.emitir({ tipo: 'dedo', boton: b, abajo });
  };
  placa.tocarLogo = (abajo) => {
    est.contacto.logo = abajo;
    placa.emitir({ tipo: 'dedo', boton: 'logo', abajo });
  };
  placa.gesto = (g) => {
    placa.emitir({ tipo: 'gesto', gesto: g });
    placa.disparar('gesto:' + g);
  };
  placa.reiniciarMicrobit = () => {
    borrar();
    est.brillo = 255;
    est.pantallaActiva = true;
    est.luzActiva = false;
    est.micActivo = false;
    est.brujulaCalibrada = est.brujulaCalibradaFija ?? false;
    est.radio = { grupo: 0, potencia: 6, activa: usaRadio, intensidad: -128, enviados: 0, recibidos: 0 };
    est.pines = {};
    est.pwm = [];
    est.canales = [null, null, null, null];
    est.ultimoCanal = 3;
    est.contacto = { A: false, B: false, logo: false };
    est.filtro = { A: mkFiltro(), B: mkFiltro(), logo: mkFiltro() };
    est.botones = { A: false, B: false };
    est.logo = false;
    est.ab = false;
    est.pinTono = 'P0';
    est.tono = { f: 0, hasta: 0 };
    est.temp = { t: -Infinity, v: 0 };
    est.acebott = null;
    est.arranque = placa.mundo ? placa.mundo.t : 0;
  };
  return placa;
}
