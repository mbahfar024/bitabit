// Bit a bit · Programas de MakeCode como datos
// Un programa se escribe una vez como árbol (con P.*) y de ahí salen los bloques
// (en español y en inglés), el Python de MakeCode y el JavaScript de MakeCode.
// El intérprete (maquina.js) ejecuta ese mismo árbol: lo que se ve es lo que corre.
//
// Textos en inglés de los bloques: pxt-microbit (libs/*/_locales/*-strings.json).
// Textos en español: los del editor en español; pueden variar un poco según la
// versión de MakeCode. Python: reglas de MakeCode (funciones en snake_case y
// valores de enumeración en MAYÚSCULAS).

// ---------------------------------------------------------------------------
// Colores de las categorías (los de MakeCode)
export const COLOR = {
  basico: '#1E90FF',
  entrada: '#D400D4',
  musica: '#E63022',
  led: '#5C2D91',
  radio: '#E3008C',
  bucles: '#00AA00',
  logica: '#00A4A6',
  variables: '#DC143C',
  matematicas: '#9400D3',
  pines: '#B22222',
  texto: '#B8860B',
  maqueen: '#0fbc11',
  acebott: '#3b6ea5',
};

// ---------------------------------------------------------------------------
// Enumeraciones: etiqueta en cada idioma y nombre en Python y JavaScript
const E = (es, en, py, js) => ({ es, en, py, js });
export const ENUMS = {
  Button: { A: E('A', 'A', 'Button.A', 'Button.A'), B: E('B', 'B', 'Button.B', 'Button.B'), AB: E('A+B', 'A+B', 'Button.AB', 'Button.AB') },
  Dimension: {
    X: E('x', 'x', 'Dimension.X', 'Dimension.X'),
    Y: E('y', 'y', 'Dimension.Y', 'Dimension.Y'),
    Z: E('z', 'z', 'Dimension.Z', 'Dimension.Z'),
    Strength: E('fuerza', 'strength', 'Dimension.STRENGTH', 'Dimension.Strength'),
  },
  Gesture: {
    Shake: E('agitar', 'shake', 'Gesture.SHAKE', 'Gesture.Shake'),
    LogoUp: E('logotipo hacia arriba', 'logo up', 'Gesture.LOGO_UP', 'Gesture.LogoUp'),
    LogoDown: E('logotipo hacia abajo', 'logo down', 'Gesture.LOGO_DOWN', 'Gesture.LogoDown'),
    ScreenUp: E('pantalla hacia arriba', 'screen up', 'Gesture.SCREEN_UP', 'Gesture.ScreenUp'),
    ScreenDown: E('pantalla hacia abajo', 'screen down', 'Gesture.SCREEN_DOWN', 'Gesture.ScreenDown'),
    TiltLeft: E('inclinar a la izquierda', 'tilt left', 'Gesture.TILT_LEFT', 'Gesture.TiltLeft'),
    TiltRight: E('inclinar a la derecha', 'tilt right', 'Gesture.TILT_RIGHT', 'Gesture.TiltRight'),
  },
  ArrowNames: {
    North: E('Norte', 'North', 'ArrowNames.NORTH', 'ArrowNames.North'),
    South: E('Sur', 'South', 'ArrowNames.SOUTH', 'ArrowNames.South'),
    East: E('Este', 'East', 'ArrowNames.EAST', 'ArrowNames.East'),
    West: E('Oeste', 'West', 'ArrowNames.WEST', 'ArrowNames.West'),
  },
  TouchButtonEvent: { Pressed: E('presionado', 'pressed', 'TouchButtonEvent.PRESSED', 'TouchButtonEvent.Pressed') },
  RadioPacketProperty: {
    SignalStrength: E('intensidad de la señal', 'signal strength', 'RadioPacketProperty.SIGNAL_STRENGTH', 'RadioPacketProperty.SignalStrength'),
  },
  DetectedSound: { Loud: E('fuerte', 'loud', 'DetectedSound.LOUD', 'DetectedSound.Loud'), Quiet: E('silencioso', 'quiet', 'DetectedSound.QUIET', 'DetectedSound.Quiet') },
  PinPullMode: {
    PullUp: E('arriba', 'up', 'PinPullMode.PULL_UP', 'PinPullMode.PullUp'),
    PullDown: E('abajo', 'down', 'PinPullMode.PULL_DOWN', 'PinPullMode.PullDown'),
    PullNone: E('ninguno', 'none', 'PinPullMode.PULL_NONE', 'PinPullMode.PullNone'),
  },
};
const PINES = ['P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P19', 'P20'];
ENUMS.DigitalPin = Object.fromEntries(PINES.map((p) => [p, E(p, p, `DigitalPin.${p}`, `DigitalPin.${p}`)]));
ENUMS.AnalogPin = Object.fromEntries(PINES.map((p) => [p, E(p, p, `AnalogPin.${p}`, `AnalogPin.${p}`)]));

// Iconos (dibujos de libs/core/icons.ts)
export const ICONOS = {
  Heart: ['. # . # .', '# # # # #', '# # # # #', '. # # # .', '. . # . .'],
  SmallHeart: ['. . . . .', '. # . # .', '. # # # .', '. . # . .', '. . . . .'],
  Happy: ['. . . . .', '. # . # .', '. . . . .', '# . . . #', '. # # # .'],
  Sad: ['. . . . .', '. # . # .', '. . . . .', '. # # # .', '# . . . #'],
  Asleep: ['. . . . .', '# # . # #', '. . . . .', '. # # # .', '. . . . .'],
  Surprised: ['. # . # .', '. . . . .', '. . # . .', '. # . # .', '. . # . .'],
  Yes: ['. . . . .', '. . . . #', '. . . # .', '# . # . .', '. # . . .'],
  No: ['# . . . #', '. # . # .', '. . # . .', '. # . # .', '# . . . #'],
  Square: ['# # # # #', '# . . . #', '# . . . #', '# . . . #', '# # # # #'],
  SmallSquare: ['. . . . .', '. # # # .', '. # . # .', '. # # # .', '. . . . .'],
  Diamond: ['. . # . .', '. # . # .', '# . . . #', '. # . # .', '. . # . .'],
  SmallDiamond: ['. . . . .', '. . # . .', '. # . # .', '. . # . .', '. . . . .'],
  Scissors: ['# # . . #', '# # . # .', '. . # . .', '# # . # .', '# # . . #'],
  House: ['. . # . .', '. # # # .', '# # # # #', '. # # # .', '. # . # .'],
  Umbrella: ['. # # # .', '# # # # #', '. . # . .', '# . # . .', '# # # . .'],
  Target: ['. . # . .', '. # # # .', '# # . # #', '. # # # .', '. . # . .'],
  QuarterNote: ['. . # . .', '. . # . .', '. . # . .', '# # # . .', '# # # . .'],
  Ghost: ['. # # # .', '# . # . #', '# # # # #', '# # # # #', '# . # . #'],
};
const ICONO_NOMBRE = {
  Heart: ['corazón', 'heart'],
  SmallHeart: ['corazón pequeño', 'small heart'],
  Happy: ['contento', 'happy'],
  Sad: ['triste', 'sad'],
  Asleep: ['dormido', 'asleep'],
  Surprised: ['sorprendido', 'surprised'],
  Yes: ['sí', 'yes'],
  No: ['no', 'no'],
  Square: ['cuadrado', 'square'],
  SmallSquare: ['cuadrado pequeño', 'small square'],
  Diamond: ['diamante', 'diamond'],
  SmallDiamond: ['diamante pequeño', 'small diamond'],
  Scissors: ['tijeras', 'scissors'],
  House: ['casa', 'house'],
  Umbrella: ['paraguas', 'umbrella'],
  Target: ['diana', 'target'],
  QuarterNote: ['negra', 'quarter note'],
  Ghost: ['fantasma', 'ghost'],
};
const snake = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').toUpperCase();
// Nombres de Python de MakeCode: el mismo algoritmo que pxt (pxtlib/util.ts, snakify).
// Funciones en minúsculas (I2CInit → i2c_init); valores de enumeración en mayúsculas
// (pxtlib/service.ts: snakify(...).toUpperCase()).
export function snakify(s) {
  const up = s.toUpperCase();
  const lo = s.toLowerCase();
  if (s === up || s === lo) return s;
  if (s.lastIndexOf('_') > 0) return s;
  const esMay = (i) => s[i] !== lo[i];
  const esMin = (i) => s[i] !== up[i];
  let r = '';
  let i = 0;
  while (i < s.length) {
    let modoMay = esMay(i);
    let j = i;
    while (j < s.length) {
      if (modoMay && esMin(j)) {
        if (j - i > 2) {
          j--;
          break;
        } else modoMay = false;
      }
      if (!modoMay && esMay(j)) break;
      j++;
    }
    if (r) r += '_';
    r += s.slice(i, j);
    i = j;
  }
  return r.toUpperCase() === r ? r : r.toLowerCase();
}
for (const k of Object.keys(ICONOS)) {
  ENUMS.IconNames = ENUMS.IconNames || {};
  ENUMS.IconNames[k] = E(ICONO_NOMBRE[k][0], ICONO_NOMBRE[k][1], `IconNames.${snake(k)}`, `IconNames.${k}`);
}

// Notas: frecuencia → nombre (Do medio = 262 Hz, como en MakeCode)
const NOTAS = {
  131: ['Do bajo', 'Low C'],
  147: ['Re bajo', 'Low D'],
  165: ['Mi bajo', 'Low E'],
  175: ['Fa bajo', 'Low F'],
  196: ['Sol bajo', 'Low G'],
  220: ['La bajo', 'Low A'],
  247: ['Si bajo', 'Low B'],
  262: ['Do medio', 'Middle C'],
  294: ['Re medio', 'Middle D'],
  330: ['Mi medio', 'Middle E'],
  349: ['Fa medio', 'Middle F'],
  392: ['Sol medio', 'Middle G'],
  440: ['La medio', 'Middle A'],
  494: ['Si medio', 'Middle B'],
  523: ['Do alto', 'High C'],
  587: ['Re alto', 'High D'],
  659: ['Mi alto', 'High E'],
  698: ['Fa alto', 'High F'],
  784: ['Sol alto', 'High G'],
  880: ['La alto', 'High A'],
  988: ['Si alto', 'High B'],
};
export function nombreNota(f, lang = 'es') {
  return NOTAS[f] ? NOTAS[f][lang === 'es' ? 0 : 1] : `${f} Hz`;
}
const TIEMPOS = {
  4: ['4 tiempos', '4 beats', 'BeatFraction.BREVE', 'BeatFraction.Breve'],
  2: ['2 tiempos', '2 beats', 'BeatFraction.DOUBLE', 'BeatFraction.Double'],
  1: ['1 tiempo', '1 beat', 'BeatFraction.WHOLE', 'BeatFraction.Whole'],
  0.5: ['1/2 tiempo', '1/2 beat', 'BeatFraction.HALF', 'BeatFraction.Half'],
  0.25: ['1/4 de tiempo', '1/4 beat', 'BeatFraction.QUARTER', 'BeatFraction.Quarter'],
};

// ---------------------------------------------------------------------------
// Catálogo de bloques. Cada entrada: categoría, forma, texto en cada idioma
// ($0, $1… son los huecos) y tipos de los argumentos.
//   forma: 'sentencia' | 'valor' | 'bool' | 'evento'
//   args:  'num' | 'txt' | 'bool' | 'leds' | 'nota' | 'tiempo' | { e: 'Enum' }
const C = {};
function def(nombre, cat, forma, es, en, args = [], extra = {}) {
  C[nombre] = { nombre, cat, forma, es, en, args, ...extra };
}
// Básico
def('basic.showNumber', 'basico', 'sentencia', 'mostrar número $0', 'show number $0', ['num']);
def('basic.showString', 'basico', 'sentencia', 'mostrar cadena $0', 'show string $0', ['txt']);
def('basic.showIcon', 'basico', 'sentencia', 'mostrar icono $0', 'show icon $0', [{ e: 'IconNames' }]);
def('basic.showArrow', 'basico', 'sentencia', 'mostrar flecha $0', 'show arrow $0', [{ e: 'ArrowNames' }]);
def('basic.showLeds', 'basico', 'sentencia', 'mostrar leds $0', 'show leds $0', ['leds']);
def('basic.clearScreen', 'basico', 'sentencia', 'borrar la pantalla', 'clear screen');
def('basic.pause', 'basico', 'sentencia', 'pausa (ms) $0', 'pause (ms) $0', ['num']);
// Entrada
def('input.buttonIsPressed', 'entrada', 'bool', 'botón $0 presionado', 'button $0 is pressed', [{ e: 'Button' }]);
def('input.logoIsPressed', 'entrada', 'bool', 'logotipo presionado', 'logo is pressed');
def('input.acceleration', 'entrada', 'valor', 'aceleración (mg) $0', 'acceleration (mg) $0', [{ e: 'Dimension' }]);
def('input.lightLevel', 'entrada', 'valor', 'nivel de luz', 'light level');
def('input.temperature', 'entrada', 'valor', 'temperatura (°C)', 'temperature (°C)');
def('input.compassHeading', 'entrada', 'valor', 'rumbo de la brújula (°)', 'compass heading (°)');
def('input.calibrateCompass', 'entrada', 'sentencia', 'calibrar la brújula', 'calibrate compass');
def('input.soundLevel', 'entrada', 'valor', 'nivel de sonido', 'sound level');
def('input.runningTime', 'entrada', 'valor', 'tiempo de ejecución (ms)', 'running time (ms)');
def('input.onButtonPressed', 'entrada', 'evento', 'al presionarse el botón $0', 'on button $0 pressed', [{ e: 'Button' }], {
  py: (a) => `on_button_pressed_${a[0].toLowerCase()}`,
});
def('input.onLogoEvent', 'entrada', 'evento', 'al presionar el logotipo', 'on logo pressed', [], {
  py: () => 'on_logo_pressed',
  pyReg: (f) => `input.on_logo_event(TouchButtonEvent.PRESSED, ${f})`,
  jsReg: () => 'input.onLogoEvent(TouchButtonEvent.Pressed, $F',
});
def('input.onGesture', 'entrada', 'evento', 'al $0', 'on $0', [{ e: 'Gesture' }], {
  py: (a) => `on_gesture_${snake(a[0]).toLowerCase()}`,
});
// LED
def('led.plot', 'led', 'sentencia', 'graficar x $0 y $1', 'plot x $0 y $1', ['num', 'num']);
def('led.unplot', 'led', 'sentencia', 'apagar x $0 y $1', 'unplot x $0 y $1', ['num', 'num']);
def('led.plotBarGraph', 'led', 'sentencia', 'graficar barras de $0 hasta $1', 'plot bar graph of $0 up to $1', ['num', 'num']);
def('led.setBrightness', 'led', 'sentencia', 'ajustar brillo $0', 'set brightness $0', ['num']);
def('led.enable', 'led', 'sentencia', 'activar leds $0', 'led enable $0', ['bool']);
// Música
def('music.playTone', 'musica', 'sentencia', 'reproducir tono $0 durante $1', 'play tone $0 for $1', ['nota', 'tiempo'], {
  pyArgs: (a) => [a[0], `music.beat(${TIEMPOS[a[1].v ?? a[1]]?.[2] ?? 'BeatFraction.WHOLE'})`],
  jsArgs: (a) => [a[0], `music.beat(${TIEMPOS[a[1].v ?? a[1]]?.[3] ?? 'BeatFraction.Whole'})`],
});
def('music.ringTone', 'musica', 'sentencia', 'sonar tono (Hz) $0', 'ring tone (Hz) $0', ['nota']);
def('music.rest', 'musica', 'sentencia', 'silencio durante $0', 'rest for $0', ['tiempo'], {
  pyArgs: (a) => [`music.beat(${TIEMPOS[a[0].v ?? a[0]]?.[2]})`],
  jsArgs: (a) => [`music.beat(${TIEMPOS[a[0].v ?? a[0]]?.[3]})`],
});
def('music.stopAllSounds', 'musica', 'sentencia', 'detener todos los sonidos', 'stop all sounds');
// El bloque de tono de la caja de herramientas actual (pxt-microbit, playable.ts):
// reproducir [tono … durante …] [hasta que termine / en segundo plano]
ENUMS.PlaybackMode = {
  UntilDone: E('hasta que termine', 'until done', 'music.PlaybackMode.UNTIL_DONE', 'music.PlaybackMode.UntilDone'),
  InBackground: E('en segundo plano', 'in background', 'music.PlaybackMode.IN_BACKGROUND', 'music.PlaybackMode.InBackground'),
  LoopingInBackground: E('en bucle en segundo plano', 'looping in background', 'music.PlaybackMode.LOOPING_IN_BACKGROUND', 'music.PlaybackMode.LoopingInBackground'),
};
def('music.tonePlayable', 'musica', 'valor', 'tono $0 durante $1', 'tone $0 for $1', ['nota', 'tiempo'], {
  pyArgs: (a) => [a[0], `music.beat(${TIEMPOS[a[1].v ?? a[1]]?.[2] ?? 'BeatFraction.WHOLE'})`],
  jsArgs: (a) => [a[0], `music.beat(${TIEMPOS[a[1].v ?? a[1]]?.[3] ?? 'BeatFraction.Whole'})`],
});
def('music.play', 'musica', 'sentencia', 'reproducir $0 $1', 'play $0 $1', ['num', { e: 'PlaybackMode' }]);
// Radio
def('radio.setGroup', 'radio', 'sentencia', 'radio establecer grupo $0', 'radio set group $0', ['num']);
def('radio.setTransmitPower', 'radio', 'sentencia', 'radio establecer potencia de transmisión $0', 'radio set transmit power $0', ['num']);
def('radio.sendNumber', 'radio', 'sentencia', 'radio enviar número $0', 'radio send number $0', ['num']);
def('radio.sendString', 'radio', 'sentencia', 'radio enviar cadena $0', 'radio send string $0', ['txt']);
def('radio.receivedPacket', 'radio', 'valor', 'paquete recibido $0', 'received packet $0', [{ e: 'RadioPacketProperty' }]);
def('radio.onReceivedNumber', 'radio', 'evento', 'al recibir radio $p', 'on radio received $p', [], {
  param: 'receivedNumber',
  py: () => 'on_received_number',
});
def('radio.onReceivedString', 'radio', 'evento', 'al recibir radio $p', 'on radio received $p', [], {
  param: 'receivedString',
  py: () => 'on_received_string',
});
// Pines
def('pins.digitalReadPin', 'pines', 'valor', 'lectura digital pin $0', 'digital read pin $0', [{ e: 'DigitalPin' }]);
def('pins.digitalWritePin', 'pines', 'sentencia', 'escritura digital pin $0 a $1', 'digital write pin $0 to $1', [{ e: 'DigitalPin' }, 'num']);
def('pins.analogReadPin', 'pines', 'valor', 'lectura analógica pin $0', 'analog read pin $0', [{ e: 'AnalogPin' }]);
def('pins.analogWritePin', 'pines', 'sentencia', 'escritura analógica pin $0 a $1', 'analog write pin $0 to $1', [{ e: 'AnalogPin' }, 'num']);
def('pins.servoWritePin', 'pines', 'sentencia', 'servo escribir pin $0 a $1', 'servo write pin $0 to $1', [{ e: 'AnalogPin' }, 'num']);
def('pins.setPull', 'pines', 'sentencia', 'establecer pull pin $0 a $1', 'set pull pin $0 to $1', [{ e: 'DigitalPin' }, { e: 'PinPullMode' }]);
def('pins.analogSetPitchPin', 'pines', 'sentencia', 'establecer pin de tono analógico $0', 'analog set pitch pin $0', [{ e: 'AnalogPin' }]);
def('pins.map', 'pines', 'valor', 'mapear $0 de menor $1 de mayor $2 a menor $3 a mayor $4', 'map $0 from low $1 from high $2 to low $3 to high $4', [
  'num',
  'num',
  'num',
  'num',
  'num',
]);
def('music.setBuiltInSpeakerEnabled', 'musica', 'sentencia', 'activar altavoz integrado $0', 'set built-in speaker $0', ['bool'], {
  py: null,
});
// Bucles
def('loops.everyInterval', 'bucles', 'evento', 'cada $0 ms', 'every $0 ms', ['num'], { py: () => 'on_every_interval' });
// Matemáticas
def('Math.randomRange', 'matematicas', 'valor', 'escoger al azar de $0 a $1', 'pick random $0 to $1', ['num', 'num'], {
  pyCall: (a) => `randint(${a[0]}, ${a[1]})`,
  jsCall: (a) => `randint(${a[0]}, ${a[1]})`,
});
def('Math.abs', 'matematicas', 'valor', 'valor absoluto de $0', 'absolute of $0', ['num'], {
  pyCall: (a) => `abs(${a[0]})`,
  jsCall: (a) => `Math.abs(${a[0]})`,
});
def('Math.round', 'matematicas', 'valor', 'redondear $0', 'round $0', ['num'], {
  pyCall: (a) => `Math.round(${a[0]})`,
  jsCall: (a) => `Math.round(${a[0]})`,
});
def('Math.idiv', 'matematicas', 'valor', 'división entera de $0 entre $1', 'integer $0 / $1', ['num', 'num'], {
  pyCall: (a) => `Math.idiv(${a[0]}, ${a[1]})`,
  jsCall: (a) => `Math.idiv(${a[0]}, ${a[1]})`,
});
def('Math.max', 'matematicas', 'valor', 'máximo de $0 y $1', 'max of $0 and $1', ['num', 'num'], {
  pyCall: (a) => `max(${a[0]}, ${a[1]})`,
  jsCall: (a) => `Math.max(${a[0]}, ${a[1]})`,
});
def('Math.min', 'matematicas', 'valor', 'mínimo de $0 y $1', 'min of $0 and $1', ['num', 'num'], {
  pyCall: (a) => `min(${a[0]}, ${a[1]})`,
  jsCall: (a) => `Math.min(${a[0]}, ${a[1]})`,
});

export const CATALOGO = C;
// Las extensiones (Maqueen, sensores…) añaden sus bloques con esta función
export function definirBloque(nombre, cat, forma, es, en, args = [], extra = {}) {
  def(nombre, cat, forma, es, en, args, extra);
}
// valores: { Clave: [es, en] } o [es, en, py, js]. Con «ns», los nombres de Python y
// JavaScript salen solos: ns.Enum.Clave y ns.Enum.CLAVE_EN_MAYUSCULAS.
export function definirEnum(nombre, valores, { ns = null } = {}) {
  ENUMS[nombre] = Object.fromEntries(
    Object.entries(valores).map(([k, v]) => {
      if (v.length >= 4) return [k, E(...v)];
      const base = ns ? `${ns}.${nombre}` : nombre;
      return [k, E(v[0], v[1], `${base}.${snakify(k).toUpperCase()}`, `${base}.${k}`)];
    })
  );
}

// ---------------------------------------------------------------------------
// Construir programas
let siguienteId = 1;
const nodo = (o) => ({ id: 'n' + siguienteId++, ...o });
const aExpr = (x) => (x && typeof x === 'object' && x.k ? x : typeof x === 'number' ? nodo({ k: 'num', v: x }) : typeof x === 'string' ? nodo({ k: 'lit', v: x }) : typeof x === 'boolean' ? nodo({ k: 'bool', v: x }) : x);

export const P = {
  programa(...bloques) {
    const prog = { bloques: bloques.flat(), vars: new Set() };
    recorrer(prog.bloques, (n) => {
      if (n.k === 'asignar' || n.k === 'cambiar' || n.k === 'var') prog.vars.add(n.n);
    });
    return prog;
  },
  // Eventos
  alIniciar: (cuerpo) => nodo({ k: 'evento', ev: 'alIniciar', args: [], cuerpo }),
  paraSiempre: (cuerpo) => nodo({ k: 'evento', ev: 'paraSiempre', args: [], cuerpo }),
  evento: (f, args, cuerpo) => nodo({ k: 'evento', ev: f, args: args.map((a) => (typeof a === 'object' ? a : a)), cuerpo }),
  // Sentencias y valores
  c: (f, ...args) => nodo({ k: 'llamada', f, args: args.map(aExpr) }),
  si: (cond, entonces, sino = null, sinoSi = []) => nodo({ k: 'si', cond: aExpr(cond), entonces, sino, sinoSi: sinoSi.map(([c, b]) => ({ cond: aExpr(c), cuerpo: b })) }),
  repetir: (veces, cuerpo) => nodo({ k: 'repetir', veces: aExpr(veces), cuerpo }),
  mientras: (cond, cuerpo) => nodo({ k: 'mientras', cond: aExpr(cond), cuerpo }),
  poner: (n, valor) => nodo({ k: 'asignar', n, valor: aExpr(valor) }),
  cambiar: (n, por) => nodo({ k: 'cambiar', n, por: aExpr(por) }),
  v: (n) => nodo({ k: 'var', n }),
  num: (v) => nodo({ k: 'num', v }),
  txt: (v) => nodo({ k: 'txt', v }),
  leds: (filas) => nodo({ k: 'leds', v: Array.isArray(filas) ? filas : filas.trim().split('\n').map((f) => f.trim()) }),
  op: (op, a, b) => nodo({ k: 'op', op, a: aExpr(a), b: aExpr(b) }),
  cmp: (op, a, b) => nodo({ k: 'cmp', op, a: aExpr(a), b: aExpr(b) }),
  y: (a, b) => nodo({ k: 'logico', op: 'y', a: aExpr(a), b: aExpr(b) }),
  o: (a, b) => nodo({ k: 'logico', op: 'o', a: aExpr(a), b: aExpr(b) }),
  no: (a) => nodo({ k: 'no', a: aExpr(a) }),
  bool: (v) => nodo({ k: 'bool', v }),
};

// Recorre todos los nodos (sentencias y expresiones)
export function recorrer(lista, fn) {
  const visitar = (n) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(visitar);
    if (n.k) fn(n);
    for (const clave of ['cuerpo', 'entonces', 'sino', 'args', 'cond', 'valor', 'por', 'a', 'b', 'veces']) if (n[clave]) visitar(n[clave]);
    if (n.sinoSi) n.sinoSi.forEach((s) => (visitar(s.cond), visitar(s.cuerpo)));
  };
  visitar(lista);
}

// ---------------------------------------------------------------------------
// Bloques en HTML
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const T = {
  es: { alIniciar: 'al iniciar', paraSiempre: 'para siempre', si: 'si', entonces: 'entonces', siNo: 'si no', siNoSi: 'si no, si', y: 'y', o: 'o', no: 'no', repetir: (n) => ['repetir', n, 'veces'], hacer: 'hacer', mientras: 'mientras', poner: (v, x) => ['establecer', v, 'a', x], cambiar: (v, x) => ['cambiar', v, 'por', x], verdadero: 'verdadero', falso: 'falso' },
  en: { alIniciar: 'on start', paraSiempre: 'forever', si: 'if', entonces: 'then', siNo: 'else', siNoSi: 'else if', y: 'and', o: 'or', no: 'not', repetir: (n) => ['repeat', n, 'times'], hacer: 'do', mientras: 'while', poner: (v, x) => ['set', v, 'to', x], cambiar: (v, x) => ['change', v, 'by', x], verdadero: 'true', falso: 'false' },
};
const OPS = { '+': '+', '-': '−', '*': '×', '/': '÷', '%': 'resto' };
const CMP_TXT = { '==': '=', '!=': '≠', '<': '<', '<=': '≤', '>': '>', '>=': '≥' };

function rejilla(filas, clase = 'mk-leds') {
  const celdas = filas
    .map((f) => f.replace(/\s+/g, '').split('').map((c) => `<i${c === '#' ? ' class="on"' : ''}></i>`).join(''))
    .join('');
  return `<span class="${clase}" aria-hidden="true">${celdas}</span>`;
}

function exprHTML(x, lang, tipo = 'num') {
  if (x == null) return '';
  const t = T[lang];
  switch (x.k) {
    case 'num':
      return `<span class="mk-numero" data-nodo="${x.id}">${esc(x.v)}</span>`;
    case 'lit':
      return tipo === 'txt' ? `<span class="mk-numero mk-txt" data-nodo="${x.id}">“${esc(x.v)}”</span>` : `<span class="mk-numero" data-nodo="${x.id}">${esc(x.v)}</span>`;
    case 'txt':
      return `<span class="mk-numero mk-txt" data-nodo="${x.id}">“${esc(x.v)}”</span>`;
    case 'bool':
      return `<span class="mk-hex mk-k mk-k-logica" data-nodo="${x.id}"><span>${x.v ? t.verdadero : t.falso}</span></span>`;
    case 'var':
      return `<span class="mk-rep mk-k mk-k-variables" data-nodo="${x.id}">${esc(x.n)}</span>`;
    case 'op':
      return `<span class="mk-rep mk-k mk-k-matematicas" data-nodo="${x.id}">${exprHTML(x.a, lang)}<span>${OPS[x.op]}</span>${exprHTML(x.b, lang)}</span>`;
    case 'cmp':
      return `<span class="mk-hex mk-k mk-k-logica" data-nodo="${x.id}">${exprHTML(x.a, lang)}<span>${CMP_TXT[x.op]}</span>${exprHTML(x.b, lang)}</span>`;
    case 'logico':
      return `<span class="mk-hex mk-k mk-k-logica mk-y" data-nodo="${x.id}"><span class="fila">${exprHTML(x.a, lang, 'bool')}</span><span class="fila"><span>${x.op === 'y' ? t.y : t.o}</span>${exprHTML(x.b, lang, 'bool')}</span></span>`;
    case 'no':
      return `<span class="mk-hex mk-k mk-k-logica" data-nodo="${x.id}"><span>${t.no}</span>${exprHTML(x.a, lang, 'bool')}</span>`;
    case 'llamada': {
      const d = C[x.f];
      const cuerpo = partesHTML(d, x.args, lang);
      const forma = d.forma === 'bool' ? 'mk-hex' : 'mk-rep';
      return `<span class="${forma} mk-k mk-k-${d.cat}" data-nodo="${x.id}">${cuerpo}</span>`;
    }
    case 'leds':
      return rejilla(x.v);
    default:
      return '';
  }
}

function argHTML(tipo, x, lang) {
  if (tipo && typeof tipo === 'object' && tipo.e) {
    const clave = x.v ?? x;
    const en = ENUMS[tipo.e]?.[clave];
    if (tipo.e === 'IconNames') return `<span class="mk-dd mk-dd-icono">${rejilla(ICONOS[clave], 'mk-icono')}</span>`;
    return `<span class="mk-dd">${esc(en ? en[lang] : clave)}</span>`;
  }
  if (tipo === 'leds') return rejilla(x.v);
  if (tipo === 'nota' && (x.k === 'num' || x.k === 'lit')) return `<span class="mk-numero mk-nota" data-nodo="${x.id}">${esc(nombreNota(x.v, lang))}</span>`;
  if (tipo === 'tiempo') {
    const v = x.v ?? x;
    return `<span class="mk-dd">${esc(TIEMPOS[v]?.[lang === 'es' ? 0 : 1] ?? v)}</span>`;
  }
  if (tipo === 'bool' && x.k === 'bool') return exprHTML(x, lang, 'bool');
  return exprHTML(x, lang, tipo);
}

function partesHTML(d, args, lang, param) {
  const plantilla = d[lang];
  return plantilla
    .split(/(\$\d|\$p)/)
    .filter((p) => p !== '')
    .map((p) => {
      if (p === '$p') return `<span class="mk-rep mk-k mk-k-variables">${esc(param)}</span>`;
      const m = p.match(/^\$(\d)$/);
      if (m) return argHTML(d.args[+m[1]], args[+m[1]], lang);
      return `<span>${esc(p.trim())}</span>`;
    })
    .join('');
}

function sentenciasHTML(lista, lang) {
  return lista.map((s) => sentenciaHTML(s, lang)).join('');
}

function cBloque(cat, id, cabecera, cuerpos, extraClase = '') {
  // cuerpos: [{ html, medio? }] — el primero va tras la cabecera
  let h = `<div class="mk-c mk-k mk-k-${cat} ${extraClase}">`;
  h += `<div class="mk-cab" data-nodo="${id}">${cabecera}</div>`;
  cuerpos.forEach((c, i) => {
    if (i > 0) h += `<div class="mk-medio"${c.id ? ` data-nodo="${c.id}"` : ''}>${c.medio}</div>`;
    h += `<div class="mk-barra"></div><div class="mk-cuerpo">${c.html || '<span class="mk-hueco"></span>'}</div>`;
  });
  h += `<div class="mk-pie"></div></div>`;
  return h;
}

function sentenciaHTML(s, lang) {
  const t = T[lang];
  switch (s.k) {
    case 'llamada': {
      const d = C[s.f];
      if (s.f === 'basic.showLeds') {
        return `<div class="mk-s mk-k mk-k-basico mk-s-leds" data-nodo="${s.id}"><span>${lang === 'es' ? 'mostrar leds' : 'show leds'}</span>${rejilla(s.args[0].v)}</div>`;
      }
      return `<div class="mk-s mk-k mk-k-${d.cat}" data-nodo="${s.id}">${partesHTML(d, s.args, lang)}</div>`;
    }
    case 'si': {
      const cuerpos = [{ html: sentenciasHTML(s.entonces, lang) }];
      for (const ss of s.sinoSi || []) cuerpos.push({ medio: `<span>${t.siNoSi}</span>${exprHTML(ss.cond, lang, 'bool')}<span>${t.entonces}</span>`, html: sentenciasHTML(ss.cuerpo, lang), id: ss.cond.id + 'm' });
      if (s.sino) cuerpos.push({ medio: `<span>${t.siNo}</span>`, html: sentenciasHTML(s.sino, lang), id: s.id + 'e' });
      return cBloque('logica', s.id, `<span>${t.si}</span>${exprHTML(s.cond, lang, 'bool')}<span>${t.entonces}</span>`, cuerpos);
    }
    case 'repetir': {
      const [a, , c] = t.repetir('');
      return cBloque('bucles', s.id, `<span>${a}</span>${exprHTML(s.veces, lang)}<span>${c}</span>`, [{ html: sentenciasHTML(s.cuerpo, lang) }]);
    }
    case 'mientras':
      return cBloque('bucles', s.id, `<span>${t.mientras}</span>${exprHTML(s.cond, lang, 'bool')}`, [{ html: sentenciasHTML(s.cuerpo, lang) }]);
    case 'asignar': {
      const [a, , b] = t.poner('', '');
      return `<div class="mk-s mk-k mk-k-variables" data-nodo="${s.id}"><span>${a}</span><span class="mk-dd">${esc(s.n)}</span><span>${b}</span>${exprHTML(s.valor, lang)}</div>`;
    }
    case 'cambiar': {
      const [a, , b] = t.cambiar('', '');
      return `<div class="mk-s mk-k mk-k-variables" data-nodo="${s.id}"><span>${a}</span><span class="mk-dd">${esc(s.n)}</span><span>${b}</span>${exprHTML(s.por, lang)}</div>`;
    }
    default:
      return '';
  }
}

function eventoHTML(ev, lang) {
  const t = T[lang];
  let cab;
  let cat = 'basico';
  if (ev.ev === 'alIniciar') cab = `<span>${t.alIniciar}</span>`;
  else if (ev.ev === 'paraSiempre') cab = `<span>${t.paraSiempre}</span>`;
  else {
    const d = C[ev.ev];
    cat = d.cat;
    cab = partesHTML(d, ev.args.map(aExpr), lang, d.param);
  }
  return cBloque(cat, ev.id, cab, [{ html: sentenciasHTML(ev.cuerpo, lang) }], 'mk-evento');
}

export function bloquesHTML(prog, lang) {
  return `<div class="mk" lang="${lang}">${prog.bloques.map((b) => eventoHTML(b, lang)).join('')}</div>`;
}

// ---------------------------------------------------------------------------
// Python y JavaScript de MakeCode
const PREC = { o: 1, y: 2, no: 3, cmp: 4, '+': 5, '-': 5, '*': 6, '/': 6, '%': 6 };
const precDe = (x) => (x.k === 'op' ? PREC[x.op] : x.k === 'cmp' ? PREC.cmp : x.k === 'logico' ? PREC[x.op] : x.k === 'no' ? PREC.no : 99);
const pySnake = (s) => snakify(s);

function argCodigo(tipo, x, lenguaje) {
  if (tipo && typeof tipo === 'object' && tipo.e) {
    const clave = x.v ?? x;
    const en = ENUMS[tipo.e]?.[clave];
    const txt = en ? en[lenguaje] : String(clave);
    // Algunos desplegables son un bloque aparte (p. ej. los colores del Maqueen)
    return tipo.envolver ? `${tipo.envolver}(${txt})` : txt;
  }
  if (tipo === 'leds') {
    const filas = x.v.map((f) => '        ' + f.replace(/\s+/g, '').split('').join(' '));
    return lenguaje === 'py' ? `"""\n${filas.join('\n')}\n        """` : '`\n' + filas.join('\n') + '\n        `';
  }
  if (tipo === 'tiempo') return x.v ?? x;
  return exprCodigo(x, lenguaje);
}

export function exprCodigo(x, l, padre = 0) {
  const py = l === 'py';
  let s;
  switch (x.k) {
    case 'num':
      return String(x.v);
    case 'lit':
    case 'txt':
      return JSON.stringify(String(x.v));
    case 'bool':
      return py ? (x.v ? 'True' : 'False') : x.v ? 'true' : 'false';
    case 'var':
      return x.n;
    case 'op':
      s = `${exprCodigo(x.a, l, PREC[x.op])} ${x.op} ${exprCodigo(x.b, l, PREC[x.op] + 0.5)}`;
      break;
    case 'cmp':
      s = `${exprCodigo(x.a, l, PREC.cmp)} ${x.op} ${exprCodigo(x.b, l, PREC.cmp + 0.5)}`;
      break;
    case 'logico':
      s = `${exprCodigo(x.a, l, PREC[x.op])} ${py ? (x.op === 'y' ? 'and' : 'or') : x.op === 'y' ? '&&' : '||'} ${exprCodigo(x.b, l, PREC[x.op] + 0.5)}`;
      break;
    case 'no':
      s = py ? `not ${exprCodigo(x.a, l, PREC.no)}` : `!(${exprCodigo(x.a, l, 0)})`;
      break;
    case 'llamada':
      return llamadaCodigo(x, l);
    default:
      return '';
  }
  return precDe(x) < padre ? `(${s})` : s;
}

function llamadaCodigo(x, l) {
  const d = C[x.f];
  const py = l === 'py';
  let args = d.args.map((t, i) => argCodigo(t, x.args[i], py ? 'py' : 'js'));
  if (py && d.pyArgs) args = d.pyArgs(args.map((a, i) => (d.args[i] === 'tiempo' ? x.args[i] : a)));
  if (!py && d.jsArgs) args = d.jsArgs(args.map((a, i) => (d.args[i] === 'tiempo' ? x.args[i] : a)));
  if (py && d.pyCall) return d.pyCall(args);
  if (!py && d.jsCall) return d.jsCall(args);
  if (py && d.pyNombre) return `${d.pyNombre}(${args.join(', ')})`;
  const [ns, fn] = x.f.split('.');
  return py ? `${ns}.${pySnake(fn)}(${args.join(', ')})` : `${ns}.${fn}(${args.join(', ')})`;
}

// Líneas de código: [texto, [ids de nodos de esa línea]]
function idsDe(x) {
  const ids = [];
  recorrer([x], (n) => ids.push(n.id));
  return ids;
}

function sentenciasCodigo(lista, l, sangria, globales) {
  const out = [];
  const py = l === 'py';
  const pad = ' '.repeat(sangria);
  for (const s of lista) {
    switch (s.k) {
      case 'llamada':
        out.push([pad + llamadaCodigo(s, l), idsDe(s)]);
        break;
      case 'asignar':
        out.push([pad + (py ? '' : '') + `${s.n} = ${exprCodigo(s.valor, l)}`, idsDe(s)]);
        break;
      case 'cambiar':
        out.push([pad + `${s.n} += ${exprCodigo(s.por, l)}`, idsDe(s)]);
        break;
      case 'si': {
        out.push([pad + (py ? `if ${exprCodigo(s.cond, l)}:` : `if (${exprCodigo(s.cond, l)}) {`), [s.id, ...idsDe(s.cond)]]);
        out.push(...cuerpoCodigo(s.entonces, l, sangria + 4, globales));
        for (const ss of s.sinoSi || []) {
          out.push([pad + (py ? `elif ${exprCodigo(ss.cond, l)}:` : `} else if (${exprCodigo(ss.cond, l)}) {`), [ss.cond.id + 'm', ...idsDe(ss.cond)]]);
          out.push(...cuerpoCodigo(ss.cuerpo, l, sangria + 4, globales));
        }
        if (s.sino) {
          out.push([pad + (py ? 'else:' : '} else {'), [s.id + 'e']]);
          out.push(...cuerpoCodigo(s.sino, l, sangria + 4, globales));
        }
        if (!py) out.push([pad + '}', []]);
        break;
      }
      case 'repetir':
        out.push([pad + (py ? `for index in range(${exprCodigo(s.veces, l)}):` : `for (let index = 0; index < ${exprCodigo(s.veces, l)}; index++) {`), [s.id, ...idsDe(s.veces)]]);
        out.push(...cuerpoCodigo(s.cuerpo, l, sangria + 4, globales));
        if (!py) out.push([pad + '}', []]);
        break;
      case 'mientras':
        out.push([pad + (py ? `while ${exprCodigo(s.cond, l)}:` : `while (${exprCodigo(s.cond, l)}) {`), [s.id, ...idsDe(s.cond)]]);
        out.push(...cuerpoCodigo(s.cuerpo, l, sangria + 4, globales));
        if (!py) out.push([pad + '}', []]);
        break;
    }
  }
  return out;
}

function cuerpoCodigo(lista, l, sangria, globales) {
  const out = sentenciasCodigo(lista, l, sangria, globales);
  if (!out.length && l === 'py') out.push([' '.repeat(sangria) + 'pass', []]);
  return out;
}

function asignadas(lista) {
  const s = new Set();
  recorrer(lista, (n) => {
    if (n.k === 'asignar' || n.k === 'cambiar') s.add(n.n);
  });
  return [...s];
}

export function codigo(prog, l) {
  const py = l === 'py';
  const lineas = [];
  const inicio = prog.bloques.find((b) => b.ev === 'alIniciar');
  const otros = prog.bloques.filter((b) => b.ev !== 'alIniciar' && b.ev !== 'paraSiempre');
  const siempre = prog.bloques.filter((b) => b.ev === 'paraSiempre');
  const globales = new Set(inicio ? asignadas(inicio.cuerpo) : []);
  const funcion = (ev, nombre, registro, param) => {
    if (py) {
      lineas.push([`def ${nombre}(${param || ''}):`, [ev.id]]);
      const g = asignadas(ev.cuerpo).filter((v) => v !== param);
      if (g.length) lineas.push([`    global ${g.join(', ')}`, []]);
      lineas.push(...cuerpoCodigo(ev.cuerpo, l, 4, globales));
      lineas.push([registro, [ev.id]]);
    } else {
      lineas.push([registro.replace('$F', `function (${param || ''}) {`), [ev.id]]);
      lineas.push(...cuerpoCodigo(ev.cuerpo, l, 4, globales));
      lineas.push(['})', []]);
    }
  };
  for (const ev of otros) {
    const d = C[ev.ev];
    const args = d.args.map((t, i) => argCodigo(t, aExpr(ev.args[i]), py ? 'py' : 'js'));
    const nombre = d.py ? d.py(ev.args.map((a) => (typeof a === 'object' ? a.v : a))) : 'on_event';
    const [ns, fn] = ev.ev.split('.');
    if (py) {
      const reg = d.pyReg ? d.pyReg(nombre) : `${ns}.${pySnake(fn)}(${[...args, nombre].join(', ')})`;
      funcion(ev, nombre, reg, d.param);
    } else {
      const reg = d.jsReg ? d.jsReg() : `${ns}.${fn}(${[...args, '$F'].join(', ')}`;
      funcion(ev, nombre, reg, d.param);
    }
    lineas.push(['', []]);
  }
  if (inicio) {
    for (const [txt, ids] of sentenciasCodigo(inicio.cuerpo, l, 0, globales)) {
      // En JavaScript, la primera asignación de cada variable se declara con let
      let t = txt;
      if (!py) {
        const m = t.match(/^(\w+) = /);
        if (m && !lineas.some(([x]) => x.startsWith(`let ${m[1]} =`))) t = 'let ' + t;
      }
      lineas.push([t, [...ids, inicio.id]]);
    }
    if (inicio.cuerpo.length) lineas.push(['', []]);
  }
  for (const ev of siempre) {
    if (py) funcion(ev, 'on_forever', 'basic.forever(on_forever)');
    else {
      lineas.push(['basic.forever(function () {', [ev.id]]);
      lineas.push(...cuerpoCodigo(ev.cuerpo, l, 4, globales));
      lineas.push(['})', [ev.id + 'p']]);
    }
  }
  while (lineas.length && lineas[lineas.length - 1][0] === '') lineas.pop();
  return lineas;
}

export const textoCodigo = (prog, l) => codigo(prog, l).map(([t]) => t).join('\n') + '\n';

// ---------------------------------------------------------------------------
// Montar el programa en la página, con resaltado
function colorear(linea) {
  return esc(linea)
    .replace(/("[^"]*"|`[^`]*`)/g, '<span class="s">$1</span>')
    .replace(/\b(def|if|elif|else|and|or|not|for|in|while|global|pass|True|False|let|function|true|false)\b(?![^<]*>)/g, '<span class="k">$1</span>')
    .replace(/\b(\d+(?:\.\d+)?)\b(?![^<]*>)/g, '<span class="n">$1</span>');
}

export function montarPrograma({ bloques, python, programa, idioma = 'es' }) {
  let lang = idioma;
  const pintar = () => (bloques.innerHTML = bloquesHTML(programa, lang));
  pintar();
  python.innerHTML = codigo(programa, 'py')
    .map(([l, ids], i) => `<span class="ln" data-n="${i + 1}" data-nodos="${ids.join(' ')}">${colorear(l) || ' '}</span>`)
    .join('');
  let ultimo = { vivos: [], camino: [], insignias: {} };
  function resaltar({ vivos = [], camino = [], insignias = {} } = {}) {
    ultimo = { vivos, camino, insignias };
    const vivo = new Set(vivos);
    const cam = new Set(camino);
    bloques.querySelectorAll('[data-nodo]').forEach((el) => {
      const n = el.dataset.nodo;
      el.classList.toggle('vivo', vivo.has(n));
      el.classList.toggle('camino', !vivo.has(n) && cam.has(n));
    });
    bloques.querySelectorAll('.mk-insignia').forEach((el) => el.remove());
    for (const [id, valor] of Object.entries(insignias)) {
      const el = bloques.querySelector(`[data-nodo="${id}"]`);
      if (!el) continue;
      const b = document.createElement('span');
      b.className = 'mk-insignia' + (valor === false ? ' no' : '');
      b.textContent = typeof valor === 'boolean' ? (lang === 'es' ? (valor ? 'sí' : 'no') : valor ? 'true' : 'false') : String(valor);
      el.appendChild(b);
    }
    python.querySelectorAll('.ln').forEach((el) => {
      const ns = el.dataset.nodos ? el.dataset.nodos.split(' ') : [];
      const v = ns.some((n) => vivo.has(n));
      el.classList.toggle('vivo', v);
      el.classList.toggle('camino', !v && ns.some((n) => cam.has(n)));
    });
    const primero = bloques.querySelector('.vivo');
    if (primero && bloques.closest('.programa-cuerpo')) {
      const caja = bloques.closest('.programa-cuerpo');
      const r = primero.getBoundingClientRect();
      const rc = caja.getBoundingClientRect();
      if (r.top < rc.top || r.bottom > rc.bottom) caja.scrollTop += r.top - rc.top - rc.height / 3;
    }
  }
  return {
    resaltar,
    idiomaBloques(nuevo) {
      lang = nuevo;
      pintar();
      resaltar(ultimo);
    },
  };
}
