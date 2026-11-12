// Bit a bit · El Maqueen Plus V2 para el intérprete de MakeCode
// Añade a la micro:bit los bloques de la extensión oficial de DFRobot y simula lo
// que hacen: mensajes I2C al chip del robot (motores y faros), los LED RGB por P15,
// el ultrasonidos por P13 y P14 y el receptor de infrarrojos por P16.
//
// Fuentes: pxt-DFRobot_MaqueenPlus_v20 (maqueenPlusV2.ts y _locales/es-es),
// pxt-dfrobot_ir (ir.ts, ReceiverIR.cpp) y el tutorial de iniciación de DFRobot.
import { definirBloque, definirEnum } from '../mk/programa.js';
import { crearMicrobit } from '../mk/microbit.js';
import { APROX, DOC, velocidadRueda, wrapAngle, GEOM_SENSORES } from '../engine.js';

// ---------------------------------------------------------------------------
// Bloques (textos en español de _locales/es-es; en inglés, los de maqueenPlusV2.ts)
const NS = { ns: 'maqueenPlusV2' };
definirEnum('MyEnumMotor', { LeftMotor: ['motor izquierdo', 'left motor'], RightMotor: ['motor derecho', 'right motor'], AllMotor: ['dos motores', 'all motor'] }, NS);
definirEnum('MyEnumDir', { Forward: ['hacia adelante', 'rotate forward'], Backward: ['hacia atrás', 'backward'] }, NS);
definirEnum('MyEnumLed', { LeftLed: ['LED izquierda', 'left led light'], RightLed: ['LED derecha', 'right led light'], AllLed: ['dos LEDs', 'all led light'] }, NS);
definirEnum('MyEnumSwitch', { Close: ['apagado', 'close'], Open: ['encendido', 'open'] }, NS);
definirEnum('MyEnumLineSensor', { SensorL2: ['L2', 'L2'], SensorL1: ['L1', 'L1'], SensorM: ['M', 'M'], SensorR1: ['R1', 'R1'], SensorR2: ['R2', 'R2'] }, NS);
definirEnum(
  'NeoPixelColors',
  {
    Red: ['rojo', 'red'],
    Orange: ['naranja', 'orange'],
    Yellow: ['amarillo', 'yellow'],
    Green: ['verde', 'green'],
    Blue: ['azul', 'blue'],
    Indigo: ['índigo', 'indigo'],
    Violet: ['violeta', 'violet'],
    Purple: ['morado', 'purple'],
    White: ['blanco', 'white'],
    Black: ['apagado', 'black'],
  },
  NS
);
const COLOR_BLOQUE = { e: 'NeoPixelColors', envolver: 'maqueenPlusV2.colors' };
definirBloque('maqueenPlusV2.I2CInit', 'maqueen', 'sentencia', 'inicializar el Maqueen', 'initialize via I2C until success');
definirBloque('maqueenPlusV2.controlMotor', 'maqueen', 'sentencia', 'activar $0 $1 velocidad $2', 'set $0 direction $1 speed $2', [{ e: 'MyEnumMotor' }, { e: 'MyEnumDir' }, 'num']);
definirBloque('maqueenPlusV2.controlMotorStop', 'maqueen', 'sentencia', 'detener $0', 'set $0 stop', [{ e: 'MyEnumMotor' }]);
definirBloque('maqueenPlusV2.controlLED', 'maqueen', 'sentencia', 'controlar $0 $1', 'control $0 $1', [{ e: 'MyEnumLed' }, { e: 'MyEnumSwitch' }]);
definirBloque('maqueenPlusV2.readLineSensorState', 'maqueen', 'valor', 'estado del sensor de línea $0', 'read line sensor $0 state', [{ e: 'MyEnumLineSensor' }]);
definirBloque('maqueenPlusV2.readUltrasonic', 'maqueen', 'valor', 'distancia en cm (pines TRIG $0 / ECHO $1)', 'set ultrasonic sensor TRIG pin $0 ECHO pin $1 read data unit:cm', [
  { e: 'DigitalPin' },
  { e: 'DigitalPin' },
]);
definirBloque('maqueenPlusV2.setBrightness', 'maqueen', 'sentencia', 'establecer brillo de los LEDs RGB en $0', 'set RGB brightness to $0', ['num']);
definirBloque('maqueenPlusV2.showColor', 'maqueen', 'sentencia', 'establecer PIN $0 mostrar RGB color $1', 'SET PIN $0 RGB show color $1', [{ e: 'DigitalPin' }, COLOR_BLOQUE]);
definirBloque('maqueenPlusV2.setIndexColor', 'maqueen', 'sentencia', 'establecer PIN $0 luz RGB $1 mostrar color $2', 'SET PIN $0 RGB light $1 show color $2', [{ e: 'DigitalPin' }, 'num', COLOR_BLOQUE]);
definirBloque('maqueenPlusV2.ledRange', 'maqueen', 'valor', 'conjunto de LEDs RGB de $0 a $1', 'range from $0 with $1 leds', ['num', 'num']);
definirBloque('maqueenPlusV2.ledBlank', 'maqueen', 'sentencia', 'establecer PIN $0 limpia todos los RGBs', 'Set pin $0 clear all RGB', [{ e: 'DigitalPin' }]);
// Infrarrojos (pxt-dfrobot_ir): el manejador recibe el código de la tecla en «message»
definirBloque('IR.IR_callbackUser', 'maqueen', 'evento', 'Al recibir IR $p', 'on IR received $p', [], {
  param: 'message',
  py: () => 'on_ir_callbackuser',
  pyReg: (f) => `IR.IR_callbackUser(${f})`,
  jsReg: () => 'IR.IR_callbackUser($F',
});
definirBloque('IR.IR_read', 'maqueen', 'valor', 'Leer IR', 'read IR key value');

export const COLORES = {
  Red: 0xff0000,
  Orange: 0xffa500,
  Yellow: 0xffff00,
  Green: 0x00ff00,
  Blue: 0x0000ff,
  Indigo: 0x4b0082,
  Violet: 0x8a2be2,
  Purple: 0xff00ff,
  White: 0xffffff,
  Black: 0x000000,
};

// Datos de la extensión y aproximaciones de la simulación
export const MAQ = {
  direccion: 0x10,
  registros: { motorI: 0x00, motorD: 0x02, faroI: 0x0b, faroD: 0x0c, linea: 0x1d, version: 0x32, reinicio: 0x49 },
  ledsBuffer: 16, // la extensión prepara 16 LED (48 bytes) aunque el robot tenga 4
  ledsRobot: 4,
  ws2812Ms: (16 * 24 * 1.25) / 1000, // 48 bytes a 800 kHz: 0,48 ms
  usPorCm: 59.259, // la extensión divide el tiempo del eco entre 59,259 µs (sonido a 337,5 m/s)
  timeoutUs: 58000, // pulseIn espera como mucho 58 ms
  ecoMaxUs: 38000, // APROX: lo que mantiene el módulo la salida ECHO sin eco (HC-SR04)
  alcanceMm: 4000, // APROX
  disparoMs: 0.25, // APROX: pulso de 10 µs más los 8 pulsos de 40 kHz antes de medir
  irMs: 68, // APROX: una trama NEC dura unos 67,5 ms
  irSondeoMs: 50, // la extensión mira el receptor cada 50 ms
};

const byte = (v) => ((Math.trunc(Number(v) || 0) % 256) + 256) % 256;

// ---------------------------------------------------------------------------
// crearMaqueen: una micro:bit montada en el robot
//   entorno: lo de la micro:bit (luz, radio…) y además, del robot:
//     sueloNegro(x, y) → si hay cinta negra en ese punto del suelo (mm)
//     eco(x, y, rumbo) → { d (mm hasta la superficie), tipo: 'duro'|'blando'|'inclinado' } o null
//     choque(rob) → true si el robot toca un obstáculo (la física no le deja avanzar)
//     mesa → { ancho, alto } en mm, con el centro en (0, 0)
export function crearMaqueen({ nombre = 'robot', programa, entorno = {}, pose = { x: 0, y: 0, rumbo: 0 } }) {
  const rob = {};
  const ajustes = {
    bateria: 1, // 0–1
    fuerzaI: 1, // un motor más flojo: menos de 1
    fuerzaD: 1,
    encendido: true, // interruptor de encendido (POWER)
    usConectado: true,
    zumbadorOn: true, // interruptor del zumbador
    ledRoto: -1, // LED RGB que corta la cadena de datos (−1: ninguno)
  };
  const buf = new Uint8Array(MAQ.ledsBuffer * 3); // neopixel_buf de la extensión (G, R, B)
  let brilloRGB = 255; // _brightness de la extensión
  let ultimoIR = -1;

  function reiniciarRobot(p = pose) {
    Object.assign(rob, {
      x: p.x,
      y: p.y,
      rumbo: p.rumbo,
      vI: 0,
      vD: 0,
      ordenI: 0,
      ordenD: 0,
      dirI: 0,
      dirD: 0,
      giroI: 0,
      giroD: 0,
      faroI: 0,
      faroD: 0,
      rgb: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      iniciado: false,
      rastro: [],
      chocado: false,
      fueraMesa: false,
      recorrido: 0, // mm recorridos por el centro del robot
      giroTotal: 0, // rad girados (positivo: a la izquierda)
      ultimaDistancia: null, // última lectura del ultrasonidos
      eco: null, // el último eco, para dibujarlo
      i2c: [], // últimos mensajes I2C (bytes)
    });
    buf.fill(0);
    brilloRGB = 255;
    ultimoIR = -1;
    tRastro = -1e9;
  }
  let tRastro = -1e9;

  // Mensaje I2C a 0x10: tarda un poco y queda registrado
  function* i2c(pl, que, bytes) {
    if (!ajustes.encendido) {
      pl.emitir({ tipo: 'i2c', que, bytes, sinRespuesta: true });
      yield { esperar: MAQ.timeoutUs / 1e6 }; // casi nada: el mensaje se pierde
      return false;
    }
    rob.i2c.push({ t: pl.t, que, bytes });
    if (rob.i2c.length > 12) rob.i2c.shift();
    pl.emitir({ tipo: 'i2c', que, bytes });
    yield { esperar: APROX.i2cMs };
    return true;
  }

  function enviarLEDs(pl, pin) {
    // ws2812b.sendBuffer(neopixel_buf, pin): solo cuenta si el pin es el de los LED (P15)
    if (pin !== 'P15') {
      pl.emitir({ tipo: 'rgb', pin, sinEfecto: true });
      return;
    }
    for (let i = 0; i < MAQ.ledsRobot; i++) {
      // Un LED roto corta la cadena: los de detrás no reciben datos
      if (ajustes.ledRoto >= 0 && i >= ajustes.ledRoto) {
        if (i === ajustes.ledRoto) rob.rgb[i] = [0, 0, 0];
        continue;
      }
      rob.rgb[i] = [buf[i * 3 + 1], buf[i * 3], buf[i * 3 + 2]];
    }
    pl.emitir({ tipo: 'rgb', pin, colores: rob.rgb.map((c) => [...c]), bytes: [...buf.slice(0, MAQ.ledsRobot * 3)] });
  }
  function escribirColor(i, rgb) {
    const r = Math.round((rgb >> 16) * (brilloRGB / 255));
    const g = Math.round(((rgb >> 8) & 0xff) * (brilloRGB / 255));
    const b = Math.round((rgb & 0xff) * (brilloRGB / 255));
    buf[i * 3] = g;
    buf[i * 3 + 1] = r;
    buf[i * 3 + 2] = b;
  }
  const valorColor = (c) => (typeof c === 'number' ? c : COLORES[c] ?? 0);

  const extras = {
    // Reinicia el chip, espera 100 ms, pregunta la versión y enseña ✓ (o ✗ hasta que responda)
    'maqueenPlusV2.I2CInit': function* (pl) {
      const est = pl.microbit.est;
      yield* i2c(pl, 'reinicio', [MAQ.registros.reinicio, 1]);
      if (ajustes.encendido) {
        rob.ordenI = rob.ordenD = 0;
        rob.dirI = rob.dirD = 0;
        rob.faroI = rob.faroD = 0;
      }
      yield { esperar: 100 };
      for (;;) {
        const ok = yield* i2c(pl, 'version', [MAQ.registros.version]);
        if (ok) break;
        // basic.showLeds(✗, 10), pausa de 500 ms, borrar y volver a preguntar
        poner(est, ['# . . . #', '. # . # .', '. . # . .', '. # . # .', '# . . . #']);
        yield { esperar: 10 };
        yield { esperar: 500 };
        poner(est, null);
      }
      poner(est, ['. . . . .', '. . . . #', '. . . # .', '# . # . .', '. # . . .']);
      yield { esperar: 10 };
      yield { esperar: 500 };
      poner(est, null);
      rob.iniciado = true;
      pl.emitir({ tipo: 'maqueenListo' });
    },
    'maqueenPlusV2.controlMotor': function* (pl, [m, dir, vel]) {
      const d = dir === 'Backward' ? 1 : 0;
      const v = byte(vel);
      const bytes = m === 'LeftMotor' ? [MAQ.registros.motorI, d, v] : m === 'RightMotor' ? [MAQ.registros.motorD, d, v] : [MAQ.registros.motorI, d, v, d, v];
      const ok = yield* i2c(pl, 'motor', bytes);
      if (!ok) return;
      if (m !== 'RightMotor') {
        rob.ordenI = v;
        rob.dirI = d;
      }
      if (m !== 'LeftMotor') {
        rob.ordenD = v;
        rob.dirD = d;
      }
    },
    'maqueenPlusV2.controlMotorStop': function* (pl, [m]) {
      const bytes = m === 'LeftMotor' ? [MAQ.registros.motorI, 0, 0] : m === 'RightMotor' ? [MAQ.registros.motorD, 0, 0] : [MAQ.registros.motorI, 0, 0, 0, 0];
      const ok = yield* i2c(pl, 'motor', bytes);
      if (!ok) return;
      if (m !== 'RightMotor') rob.ordenI = rob.dirI = 0;
      if (m !== 'LeftMotor') rob.ordenD = rob.dirD = 0;
    },
    'maqueenPlusV2.controlLED': function* (pl, [led, sw]) {
      const v = sw === 'Open' ? 1 : 0;
      const bytes = led === 'LeftLed' ? [MAQ.registros.faroI, v] : led === 'RightLed' ? [MAQ.registros.faroD, v] : [MAQ.registros.faroI, v, v];
      const ok = yield* i2c(pl, 'faro', bytes);
      if (!ok) return;
      if (led !== 'RightLed') rob.faroI = v;
      if (led !== 'LeftLed') rob.faroD = v;
    },
    'maqueenPlusV2.readLineSensorState': function* (pl, [s]) {
      const ok = yield* i2c(pl, 'linea', [MAQ.registros.linea]);
      if (!ok) return 0;
      const n = s.replace('Sensor', '');
      return sensorNegro(n) ? 1 : 0;
    },
    'maqueenPlusV2.readUltrasonic': function* (pl, [trig, echo]) {
      const medida = medirEco(trig, echo);
      rob.eco = { ...medida, t: pl.t };
      pl.emitir({ tipo: 'ultrasonido', ...medida });
      yield { esperar: medida.duracionMs };
      rob.ultimaDistancia = medida.lectura;
      return medida.lectura;
    },
    'maqueenPlusV2.setBrightness': (pl, [b]) => {
      brilloRGB = Math.max(0, Math.min(255, Number(b) || 0));
    },
    'maqueenPlusV2.showColor': function* (pl, [pin, c]) {
      const rgb = valorColor(c);
      for (let i = 0; i < MAQ.ledsBuffer; i++) escribirColor(i, rgb);
      yield { esperar: MAQ.ws2812Ms };
      enviarLEDs(pl, pin);
    },
    'maqueenPlusV2.setIndexColor': function* (pl, [pin, index, c]) {
      const rgb = valorColor(c);
      let f = index;
      let t = index;
      if (index > 15) {
        if (((index >> 8) & 0xff) === 0x02) {
          f = index >> 16;
          t = index & 0xff;
        } else {
          f = 0;
          t = -1;
        }
      }
      for (let i = f; i <= t; i++) if (i >= 0 && i < MAQ.ledsBuffer) escribirColor(i, rgb);
      yield { esperar: MAQ.ws2812Ms };
      enviarLEDs(pl, pin);
    },
    'maqueenPlusV2.ledRange': (pl, [a, b]) => (a << 16) + (2 << 8) + b,
    'maqueenPlusV2.ledBlank': function* (pl, [pin]) {
      for (let i = 0; i < MAQ.ledsBuffer; i++) escribirColor(i, 0);
      yield { esperar: MAQ.ws2812Ms };
      enviarLEDs(pl, pin);
    },
    'IR.IR_read': () => ultimoIR,
  };

  function poner(est, filas) {
    for (let y = 0; y < 5; y++)
      for (let x = 0; x < 5; x++) est.pantalla[y][x] = filas ? (filas[y].replace(/\s+/g, '')[x] === '#' ? 255 : 0) : 0;
  }

  // Posición de un sensor de línea en el suelo
  function posSensor(n) {
    const { adelante: ax, lado: lat } = GEOM_SENSORES[n];
    const c = Math.cos(rob.rumbo);
    const s = Math.sin(rob.rumbo);
    return { x: rob.x + ax * c - lat * s, y: rob.y + ax * s + lat * c };
  }
  function sensorNegro(n) {
    const p = posSensor(n);
    return !!entorno.sueloNegro?.(p.x, p.y);
  }

  // El ultrasonidos: posición de los transductores y el eco
  function posUltrasonidos() {
    const c = Math.cos(rob.rumbo);
    const s = Math.sin(rob.rumbo);
    return { x: rob.x + 88 * c, y: rob.y + 88 * s };
  }
  function medirEco(trig, echo) {
    const p = posUltrasonidos();
    const T = entorno.temperaturaAire?.() ?? 20;
    const c = (331.3 + 0.606 * T) / 1000; // mm/µs
    let base = { x: p.x, y: p.y, rumbo: rob.rumbo, temperatura: T };
    // Sin el sensor (o con los pines cambiados) nunca llega el eco: pulseIn espera
    // 58 ms, la extensión lo intenta otra vez y devuelve 0
    if (!ajustes.usConectado || trig !== 'P13' || echo !== 'P14' || !ajustes.encendido) {
      return { ...base, sinSensor: true, ecoUs: 0, lectura: 0, duracionMs: (2 * MAQ.timeoutUs) / 1000 + 0.02, d: null };
    }
    const r = entorno.eco?.(p.x, p.y, rob.rumbo) || null;
    let ecoUs;
    let sinEco = false;
    if (!r || r.tipo === 'blando' || r.tipo === 'inclinado' || r.d > MAQ.alcanceMm) {
      sinEco = true;
      ecoUs = MAQ.ecoMaxUs;
    } else ecoUs = (2 * Math.max(r.d, 15)) / c;
    let lectura = ecoUs / MAQ.usPorCm;
    if (lectura <= 0) lectura = 0;
    else if (lectura > 300) lectura = 300;
    else lectura = Math.round(lectura);
    return { ...base, d: r ? r.d : null, superficie: r?.tipo || null, objeto: r?.objeto || null, sinEco, ecoUs, lectura, duracionMs: MAQ.disparoMs + ecoUs / 1000, velocidadSonido: c * 1000 };
  }

  const placa = crearMicrobit({ nombre, programa, entorno, extras });

  // Física: tracción diferencial, como en el siguelíneas (engine.js)
  function avanzar(dt, mundo) {
    if (rob.fueraMesa) return;
    const dts = dt / 1000;
    const b = ajustes.encendido ? ajustes.bateria : 0;
    const objI = (ajustes.encendido ? velocidadRueda(rob.ordenI, b) * ajustes.fuerzaI : 0) * (rob.dirI ? -1 : 1);
    const objD = (ajustes.encendido ? velocidadRueda(rob.ordenD, b) * ajustes.fuerzaD : 0) * (rob.dirD ? -1 : 1);
    const k = 1 - Math.exp(-dts / APROX.tauMotor);
    rob.vI += (objI - rob.vI) * k;
    rob.vD += (objD - rob.vD) * k;
    const v = (rob.vI + rob.vD) / 2;
    const w = (rob.vD - rob.vI) / APROX.distanciaRuedas;
    const antes = { x: rob.x, y: rob.y, rumbo: rob.rumbo };
    rob.x += v * Math.cos(rob.rumbo + (w * dts) / 2) * dts;
    rob.y += v * Math.sin(rob.rumbo + (w * dts) / 2) * dts;
    rob.rumbo = wrapAngle(rob.rumbo + w * dts);
    rob.giroI += (rob.vI / APROX.radioRueda) * dts;
    rob.giroD += (rob.vD / APROX.radioRueda) * dts;
    // Choques: el robot no atraviesa los obstáculos (las ruedas patinan)
    if (entorno.choque?.(rob)) {
      rob.x = antes.x;
      rob.y = antes.y;
      rob.rumbo = antes.rumbo;
      if (!rob.chocado) mundo?.emitir?.({ tipo: 'choque', placa: nombre });
      rob.chocado = true;
    } else {
      rob.chocado = false;
      rob.recorrido += Math.abs(v) * dts;
      rob.giroTotal += w * dts;
    }
    // Borde de la mesa
    const mesa = entorno.mesa;
    if (mesa && (Math.abs(rob.x) > mesa.ancho / 2 - 20 || Math.abs(rob.y) > mesa.alto / 2 - 20)) {
      rob.fueraMesa = true;
      rob.vI = rob.vD = 0;
      mundo?.emitir?.({ tipo: 'fueraMesa', placa: nombre });
    }
    if ((mundo?.t ?? 0) - tRastro >= 40) {
      tRastro = mundo?.t ?? 0;
      rob.rastro.push({ x: rob.x, y: rob.y });
      if (rob.rastro.length > 500) rob.rastro.shift();
    }
  }

  // Un mando de infrarrojos manda un código: la trama tarda unos 68 ms y la
  // extensión mira el receptor cada 50 ms; después lanza «Al recibir IR»
  function recibirIR(codigo, mundo, retardo = MAQ.irMs + Math.random() * MAQ.irSondeoMs) {
    mundo.programar(retardo, () => {
      ultimoIR = codigo & 0xff;
      placa.emitir({ tipo: 'irRecibir', codigo: ultimoIR });
      placa.disparar('IR.IR_callbackUser:', ultimoIR);
    });
  }

  reiniciarRobot();
  placa.maqueen = {
    rob,
    ajustes,
    buf,
    brillo: () => brilloRGB,
    avanzar,
    reiniciar(p) {
      reiniciarRobot(p);
      placa.reiniciarMicrobit();
    },
    posSensor,
    sensorNegro,
    posUltrasonidos,
    recibirIR,
    velocidadRueda: (orden, fuerza = 1) => velocidadRueda(orden, ajustes.bateria) * fuerza,
  };
  return placa;
}

// Radio de giro y velocidades del robot a partir de las dos ruedas (mm, mm/s, rad/s)
export function movimiento(vI, vD) {
  const v = (vI + vD) / 2;
  const w = (vD - vI) / APROX.distanciaRuedas;
  let radio;
  if (Math.abs(w) < 1e-3) radio = Infinity;
  else radio = v / w; // con signo: positivo, gira a la izquierda
  return { v, w, radio };
}

export { DOC };
