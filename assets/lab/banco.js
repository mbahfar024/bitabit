// Bit a bit · El banco de trabajo de las etapas 3, 4 y 5: la micro:bit en su shield,
// los módulos de la caja de sensores y los cables. Dibujos en SVG (unidades de
// 0,1 mm, como los de la micro:bit) y las reglas eléctricas que comparten.
//
// El shield de la caja, según la foto de la ficha L3P10, es un «micro:bit Shield» de
// ACEBOTT como el Keyestudio KS0360 (65 × 58 × 12 mm): entrada DC de 7–9 V o micro USB
// de 5 V, reguladores de 5 V y 3,3 V, un conector S-V-G por pin y dos puentes: V1 da
// la V de P0 a P9 y V2 la de P10 a P20 y los conectores I2C y SPI. En el shield los
// conectores van en dos columnas; aquí, en dos filas (P0–P9 arriba, P10–P20 abajo).
// A la derecha de la segunda fila va el conector IIC de 4 contactos, con el orden
// de la serigrafía: 20 (SDA), 19 (SCL), V2 y G.
//
// Los módulos siguen la documentación de ACEBOTT (acebott.com/docs): botón QB038,
// inclinación QB123, obstáculos QB096, luz QB068, joystick QB015, zumbador pasivo
// QB010, LED QB007 y RGB QB014.
import { microbitFrente, posicionesConector, ESTILO_DIBUJOS } from './dibujos.js';
import { crearEscena2D } from './escena2d.js';

// ---------------------------------------------------------------------------
// Datos eléctricos de la micro:bit V2 (tech.microbit.org, nRF52833)
export const ELEC = {
  vdd: 3.3,
  maxPin: 3.6, // un pin no admite más de 0,3 V por encima de su alimentación
  vih: 0.7 * 3.3, // por encima, la entrada lee 1
  vil: 0.3 * 3.3, // por debajo, lee 0
  pull: 13, // kΩ, resistencia interna (hacia GND por defecto, según CODAL)
};

// Lo que lee la micro:bit con «lectura digital» para una tensión en el pin
export function nivelDigital(v, anterior = 0) {
  if (v >= ELEC.vih) return 1;
  if (v <= ELEC.vil) return 0;
  return anterior; // zona dudosa: se queda como estaba
}
// Lo que lee con «lectura analógica» (10 bits, de 0 a 3,3 V)
export function lecturaAnalogica(v) {
  return Math.max(0, Math.min(1023, Math.round((v / ELEC.vdd) * 1023)));
}
export const pinEnPeligro = (v) => v > ELEC.maxPin;

// ---------------------------------------------------------------------------
// Pines de la micro:bit V2 y para qué los usa la placa (tech.microbit.org)
export const USO_PIN = {
  P0: { libre: true, analogico: true },
  P1: { libre: true, analogico: true },
  P2: { libre: true, analogico: true },
  P3: { pantalla: true, analogico: true },
  P4: { pantalla: true, analogico: true },
  P5: { boton: 'A' },
  P6: { pantalla: true },
  P7: { pantalla: true },
  P8: { libre: true },
  P9: { libre: true },
  P10: { pantalla: true, analogico: true },
  P11: { boton: 'B' },
  P12: { reservado: true },
  P13: { libre: true },
  P14: { libre: true },
  P15: { libre: true },
  P16: { libre: true },
  P19: { i2c: 'SCL' },
  P20: { i2c: 'SDA' },
};
export function usoPin(p) {
  const u = USO_PIN[p] || {};
  if (u.pantalla) return 'la pantalla';
  if (u.boton) return `el botón ${u.boton}`;
  if (u.reservado) return 'el modo de accesibilidad';
  if (u.i2c) return `el bus I2C (${u.i2c})`;
  return null;
}

// ---------------------------------------------------------------------------
// El shield. Origen: esquina de arriba a la izquierda de la placa del shield.
// La micro:bit va de pie en la ranura: se dibuja encima, de frente.
const FILA1 = ['P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9'];
const FILA2 = ['P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P19', 'P20'];
export const SHIELD = { ancho: 600, alto: 390, mbEscala: 0.5, mbX: 150, mbY: -196 };
// El conector IIC: SDA (20), SCL (19), V2 y G, de arriba abajo
const X_IIC = 568;
export const POS_IIC = { SDA: { x: X_IIC, y: 249 }, SCL: { x: X_IIC, y: 276 }, V: { x: X_IIC, y: 303 }, G: { x: X_IIC, y: 330 } };
const PASO = 27;
const X0 = 302; // primer conector
// Posición de los tres contactos de un conector (S arriba, V en medio, G abajo)
export function posConector(pin) {
  let i = FILA1.indexOf(pin);
  let y0 = 150;
  if (i < 0) {
    i = FILA2.indexOf(pin);
    y0 = 276;
  }
  const x = X0 + i * PASO;
  return { x, y0, fila: y0 === 150 ? 1 : 2, s: { x, y: y0 }, v: { x, y: y0 + PASO }, g: { x, y: y0 + 2 * PASO } };
}
// Dónde está cada pin en el conector de la micro:bit (coordenadas del shield)
function xRanura(pin) {
  const c = posicionesConector().find((k) => k.p === pin);
  return c ? SHIELD.mbX + c.x * SHIELD.mbEscala : 280;
}

// ox, oy: dónde va el shield en la escena; usados: pines con su pista de señal dibujada.
// Devuelve { svg, anclas, conector(pin) }
export function dibujoShield({ ox = 0, oy = 0, usados = [], interiorMicrobit = '' } = {}) {
  const S = SHIELD;
  let conectores = '';
  for (const pin of [...FILA1, ...FILA2]) {
    const p = posConector(pin);
    const u = USO_PIN[pin];
    conectores += `<g class="conector${u.libre ? '' : ' ocupado'}" data-conector="${pin}" data-pieza="con-${pin}">
        <rect x="${p.x - 11}" y="${p.y0 - 12}" width="22" height="${2 * PASO + 24}" rx="3" class="cabecera"/>
        <rect x="${p.x - 5}" y="${p.s.y - 5}" width="10" height="10" class="clavija s"/>
        <rect x="${p.x - 5}" y="${p.v.y - 5}" width="10" height="10" class="clavija v"/>
        <rect x="${p.x - 5}" y="${p.g.y - 5}" width="10" height="10" class="clavija g"/>
        <text x="${p.x}" y="${p.y0 + 2 * PASO + 31}" class="serigrafia-sh" text-anchor="middle">${pin.replace('P', '')}</text>
      </g>`;
  }
  // Pistas de señal de los pines usados: del contacto S a su pin en la ranura
  let pistas = '';
  usados.forEach((pin, k) => {
    const carril = 44 + k * 11;
    if (pin === 'IIC:SDA') {
      pistas += `<path class="pista-s" data-pista="IIC:SDA" d="M${X_IIC} 249 H531 V${carril} H${xRanura('P20')} V24"/>`;
      return;
    }
    if (pin === 'IIC:SCL') {
      pistas += `<path class="pista-s" data-pista="IIC:SCL" d="M${X_IIC} 276 H543 V257 H504 V${carril} H${xRanura('P19')} V24"/>`;
      return;
    }
    const p = posConector(pin);
    const xr = xRanura(pin);
    const xs = p.fila === 1 ? p.x : p.x + 13;
    const inicio = p.fila === 1 ? `M${p.x} ${p.s.y}` : `M${p.x} ${p.s.y} H${xs}`;
    pistas += `<path class="pista-s" data-pista="${pin}" d="${inicio} V${carril} H${xr} V24"/>`;
  });
  const ultimo1 = posConector(FILA1[FILA1.length - 1]).x;
  const ultimo2 = posConector(FILA2[FILA2.length - 1]).x;
  const x3V = xRanura('3V');
  const xGND = SHIELD.mbX + 466 * SHIELD.mbEscala;
  const svg = `
  <g class="shield" transform="translate(${ox} ${oy})">
    <rect class="shield-pcb" x="0" y="0" width="${S.ancho}" height="${S.alto}" rx="16"/>
    <g class="interior">
      <path class="rail-g" d="M${X0 - 20} ${150 + 2 * PASO} H${ultimo1} M${X0 - 20} ${276 + 2 * PASO} H${X_IIC} M${X0 - 20} ${150 + 2 * PASO} V${276 + 2 * PASO} M${X0 - 20} ${276 + 2 * PASO} V${S.alto - 26} H30 V100 M${xGND} 24 V36 H${X0 - 20} V${150 + 2 * PASO}"/>
      <path class="rail-5v" d="M94 119 H122 M168 113 H200 V109 H208 M90 213 H182 V113"/>
      <path class="rail-33" d="M182 160 H168 M122 167 H108 V34 H${x3V} V24 M168 175 H190 V153 H208"/>
      <path class="rail-v rail-v1" d="M213 100 V86 H${X0 - 6} V${150 + PASO} H${ultimo1}"/>
      <path class="rail-v rail-v2" d="M256 131 H${X0 - 26} V${276 + PASO} H${X_IIC}"/>
      ${pistas}
    </g>
    <g data-pieza="ranura"><rect x="${S.mbX - 12}" y="0" width="282" height="26" rx="4" class="ranura"/></g>
    <g data-pieza="dc"><rect x="18" y="90" width="76" height="58" rx="6" class="jack"/><circle cx="56" cy="119" r="16" class="jack-agujero"/><text x="56" y="170" class="serigrafia-sh" text-anchor="middle">DC 7–9 V</text></g>
    <g data-pieza="usb"><rect x="22" y="196" width="68" height="34" rx="5" class="metal"/><rect x="33" y="206" width="46" height="14" rx="3" class="metal-oscuro"/><text x="56" y="252" class="serigrafia-sh" text-anchor="middle">USB 5 V</text></g>
    <g data-pieza="regulador5"><rect x="122" y="96" width="46" height="34" rx="3" class="chip"/><text x="145" y="118" class="chip-texto peq" text-anchor="middle">5 V</text></g>
    <g data-pieza="regulador33"><rect x="122" y="150" width="46" height="34" rx="3" class="chip"/><text x="145" y="172" class="chip-texto peq" text-anchor="middle">3,3 V</text></g>
    <g data-pieza="ledPower"><circle cx="145" cy="228" r="9" class="led-power"/><text x="145" y="256" class="serigrafia-sh" text-anchor="middle">ON</text></g>
    <g data-pieza="puente" class="puente">
      <rect x="198" y="96" width="58" height="70" rx="4" class="cabecera"/>
      <rect x="208" y="104" width="10" height="10" class="clavija"/>
      <rect x="208" y="126" width="10" height="10" class="clavija"/>
      <rect x="208" y="148" width="10" height="10" class="clavija"/>
      <rect x="236" y="104" width="10" height="10" class="clavija"/>
      <rect x="236" y="126" width="10" height="10" class="clavija"/>
      <rect x="236" y="148" width="10" height="10" class="clavija"/>
      <rect class="capuchon" data-puente="1" x="202" y="98" width="22" height="42" rx="4"/>
      <rect class="capuchon" data-puente="2" x="230" y="120" width="22" height="42" rx="4"/>
      <text x="262" y="114" class="serigrafia-sh izq">5V</text>
      <text x="262" y="158" class="serigrafia-sh izq">3V3</text>
      <text x="213" y="185" class="serigrafia-sh" text-anchor="middle">V1</text>
      <text x="241" y="185" class="serigrafia-sh" text-anchor="middle">V2</text>
    </g>
    <g class="filas-svg">${conectores}</g>
    <g class="conector" data-pieza="iic">
      <rect x="${X_IIC - 11}" y="237" width="22" height="105" rx="3" class="cabecera"/>
      ${['SDA', 'SCL', 'V', 'G'].map((k) => `<rect x="${X_IIC - 5}" y="${POS_IIC[k].y - 5}" width="10" height="10" class="clavija ${k === 'V' ? 'v' : k === 'G' ? 'g' : 's'}"/>`).join('')}
      ${[['20', 249], ['19', 276], ['V2', 303], ['G', 330]].map(([t, y]) => `<text x="${X_IIC + 15}" y="${y + 4}" class="mini izq">${t}</text>`).join('')}
      <text x="${X_IIC}" y="361" class="serigrafia-sh" text-anchor="middle">IIC</text>
    </g>
    <text x="${S.ancho - 18}" y="${S.alto - 16}" class="serigrafia-sh marca" text-anchor="end">shield para micro:bit</text>
    <g class="microbit-sh" transform="translate(${S.mbX} ${S.mbY}) scale(${S.mbEscala})">${microbitFrente({ interior: interiorMicrobit })}</g>
  </g>`;
  const A = (x, y) => [ox + x, oy + y];
  const anclas = {
    microbit: A(S.mbX + 14, S.mbY + 100),
    ranura: A(S.mbX + 129, 13),
    dc: A(56, 119),
    usb: A(56, 213),
    regulador5: A(145, 113),
    regulador33: A(145, 167),
    ledPower: A(145, 228),
    puente: A(227, 131),
    iic: A(X_IIC, 289),
  };
  for (const p of [...FILA1, ...FILA2]) {
    const c = posConector(p);
    anclas['con-' + p] = A(c.x, c.v.y);
  }
  const t = (q) => ({ x: ox + q.x, y: oy + q.y });
  return {
    svg,
    anclas,
    conector(pin) {
      const c = posConector(pin);
      return { s: t(c.s), v: t(c.v), g: t(c.g) };
    },
    iic() {
      return { SDA: t(POS_IIC.SDA), SCL: t(POS_IIC.SCL), V: t(POS_IIC.V), G: t(POS_IIC.G) };
    },
  };
}

// La posición de los capuchones: arriba une 5V con V1 (o V2); abajo, con 3V3.
// V1 da la V de P0 a P9; V2, la de P10 a P20 y los conectores I2C y SPI.
export function ponerPuente(svgRaiz, vcc1, vcc2 = 3.3) {
  for (const [n, v] of [
    ['1', vcc1],
    ['2', vcc2],
  ]) {
    const c = svgRaiz.querySelector(`.puente .capuchon[data-puente="${n}"]`);
    if (c) c.setAttribute('y', v > 4 ? '98' : '120');
  }
  svgRaiz.classList.toggle('a5v', vcc1 > 4);
  svgRaiz.classList.toggle('a5v2', vcc2 > 4);
}

// ---------------------------------------------------------------------------
// Módulos. Cada uno: { svg, pines: { S, V, G } (puntos del conector), anclas }
// en coordenadas de la escena. Tamaño de la placa: 220 × 166 (los de ACEBOTT miden
// 31,6 × 23,8 mm). El conector va a la izquierda: S arriba, V en medio y G abajo.
const MOD = { ancho: 220, alto: 166 };
function placaModulo(id, x, y, nombre, cuerpo, interior, { pines = ['S', 'V', 'G'], claves = null, alto = MOD.alto, ancho = MOD.ancho } = {}) {
  const n = pines.length;
  const paso = 26;
  const y0 = alto / 2 - ((n - 1) * paso) / 2;
  let conector = `<rect x="-14" y="${y0 - 16}" width="26" height="${(n - 1) * paso + 32}" rx="3" class="cabecera"/>`;
  const pos = {};
  pines.forEach((p, i) => {
    const py = y0 + i * paso;
    conector += `<rect x="-6" y="${py - 5}" width="10" height="10" class="clavija ${p.toLowerCase()}"/><text x="18" y="${py + 5}" class="serigrafia-mod izq">${p}</text>`;
    pos[claves ? claves[i] : p] = { x: x - 1, y: y + py };
  });
  const svg = `<g class="modulo" data-modulo="${id}" transform="translate(${x} ${y})">
    <g data-pieza="${id}"><rect class="mod-pcb" x="0" y="0" width="${ancho}" height="${alto}" rx="12"/>
    <circle cx="${ancho - 16}" cy="16" r="7" class="taladro"/><circle cx="${ancho - 16}" cy="${alto - 16}" r="7" class="taladro"/>
    <text x="${ancho / 2 + 10}" y="${alto - 12}" class="serigrafia-mod" text-anchor="middle">${nombre}</text>
    ${cuerpo}</g>
    <g class="interior">${interior}</g>
    ${conector}
  </g>`;
  return { svg, pines: pos, ancho, alto };
}

// Botón (ACEBOTT QB038): suelto da 1 y pulsado 0. Lleva su resistencia hacia V.
export function moduloPulsador(id, x, y) {
  const m = placaModulo(
    id,
    x,
    y,
    'botón',
    `<g class="pulsador" data-pieza="${id}-tecla"><rect x="92" y="34" width="84" height="84" rx="8" class="tecla-base"/><circle cx="134" cy="76" r="26" class="tecla-tapa"/></g>`,
    `<path class="pista-m v" d="M4 83 H40 V48"/><rect x="34" y="44" width="12" height="28" rx="2" class="resistencia"/><text x="50" y="62" class="mini">10 kΩ</text>
     <path class="pista-m s" d="M4 57 H40 V72"/><path class="pista-m s" d="M40 72 V92 H96"/><path class="pista-m g" d="M4 109 H70 V128 H172 V100"/>`
  );
  m.anclas = { [id]: [x + 134, y + 76] };
  return m;
}

// Sensor de inclinación (ACEBOTT QB123): plano da 0; inclinado, 1
export function moduloInclinacion(id, x, y) {
  const m = placaModulo(
    id,
    x,
    y,
    'inclinación',
    `<g data-pieza="${id}-tubo"><rect x="96" y="58" width="96" height="40" rx="18" class="tubo"/><circle class="bola" cx="116" cy="78" r="13"/><rect x="186" y="66" width="12" height="24" rx="3" class="metal"/></g>`,
    `<path class="pista-m s" d="M4 57 H70 V78 H96"/><path class="pista-m g" d="M4 109 H200 V90"/>`
  );
  m.anclas = { [id]: [x + 144, y + 78] };
  return m;
}

// Obstáculos por infrarrojos (ACEBOTT QB096): con un obstáculo delante, la salida baja a 0
export function moduloObstaculo(id, x, y) {
  const m = placaModulo(
    id,
    x,
    y,
    'obstáculos IR',
    `<g data-pieza="${id}-emisor"><rect x="196" y="34" width="34" height="26" rx="6" class="ir-emisor"/></g>
     <g data-pieza="${id}-receptor"><rect x="196" y="100" width="34" height="26" rx="6" class="ir-receptor"/></g>
     <g data-pieza="${id}-pot"><rect x="96" y="50" width="40" height="40" rx="4" class="potenciometro"/><circle cx="116" cy="70" r="12" class="pot-eje"/></g>
     <g data-pieza="${id}-led"><circle class="led-indicador" cx="116" cy="120" r="8"/></g>`,
    `<path class="pista-m s" d="M4 57 H60 V120 H108"/><path class="pista-m v" d="M4 83 H160 V47 H196"/><path class="pista-m g" d="M4 109 H50 V140 H210 V126"/>`
  );
  m.anclas = { [id + '-emisor']: [x + 213, y + 47], [id + '-receptor']: [x + 213, y + 113], [id + '-pot']: [x + 116, y + 70], [id + '-led']: [x + 116, y + 120] };
  return m;
}

// Sensor de luz (ACEBOTT QB068): fotorresistencia; con más luz, valor más bajo.
// Divisor de tensión: resistencia fija hacia V y fotorresistencia hacia G (deducido
// de que el valor baja con la luz; el valor de la resistencia fija es aproximado).
export function moduloLuz(id, x, y) {
  const m = placaModulo(
    id,
    x,
    y,
    'luz',
    `<g data-pieza="${id}-ldr"><circle cx="146" cy="70" r="30" class="ldr"/><path d="M130 58 h10 v8 h12 v8 h-12 v8 h10" class="ldr-pista"/></g>`,
    `<path class="pista-m v" d="M4 83 H52 V40 H70"/><rect x="70" y="34" width="34" height="12" rx="2" class="resistencia"/><text x="70" y="28" class="mini">10 kΩ</text>
     <path class="pista-m s" d="M104 40 H120 V54"/><path class="pista-m s" d="M4 57 H40 V58 H120"/><path class="pista-m g" d="M146 100 V128 H40 V109 H4"/>`
  );
  m.anclas = { [id]: [x + 146, y + 70] };
  return m;
}

// Joystick (ACEBOTT QB015): dos potenciómetros (X e Y) y un pulsador (SW)
export function moduloJoystick(id, x, y) {
  const m = placaModulo(
    id,
    x,
    y,
    'joystick',
    `<g data-pieza="${id}-palanca"><rect x="78" y="22" width="122" height="122" rx="12" class="joy-base"/><circle cx="139" cy="83" r="44" class="joy-aro"/><circle class="joy-pomo" cx="139" cy="83" r="26"/></g>`,
    `<path class="pista-m s" d="M4 32 H70 V60 H95"/><path class="pista-m s" d="M4 58 H60 V106 H95"/>`,
    { pines: ['X', 'Y', 'SW', 'V', 'G'], alto: 166, ancho: 220 }
  );
  m.anclas = { [id]: [x + 139, y + 83] };
  return m;
}

// LED de un color (ACEBOTT QB007): con S a 1 se enciende
export function moduloLED(id, x, y, color = 'rojo') {
  const tonos = { rojo: '#ff3b2f', verde: '#2ecc71', azul: '#3d8bff', amarillo: '#ffc928' };
  const m = placaModulo(
    id,
    x,
    y,
    `LED ${color}`,
    `<g data-pieza="${id}-led"><circle class="led-halo" cx="140" cy="72" r="46" style="fill:${tonos[color]}"/><circle class="led-cuerpo" cx="140" cy="72" r="22" style="--led:${tonos[color]}"/><circle cx="133" cy="64" r="6" class="led-brillo"/></g>`,
    `<path class="pista-m s" d="M4 57 H60"/><rect x="60" y="51" width="34" height="12" rx="2" class="resistencia"/><path class="pista-m s" d="M94 57 H120"/><path class="pista-m g" d="M4 109 H150 V94"/>`
  );
  m.anclas = { [id]: [x + 140, y + 72] };
  m.color = tonos[color];
  return m;
}

// LED RGB (ACEBOTT QB014): cuatro pines, uno por color y el común a GND
export function moduloRGB(id, x, y) {
  const m = placaModulo(
    id,
    x,
    y,
    'LED RGB',
    `<g data-pieza="${id}-led"><circle class="led-halo rgb" cx="140" cy="72" r="50"/><circle class="led-cuerpo rgb" cx="140" cy="72" r="24"/><circle cx="132" cy="63" r="6" class="led-brillo"/></g>`,
    `<path class="pista-m r" d="M4 44 H60 V60 H116"/><path class="pista-m gr" d="M4 70 H116"/><path class="pista-m b" d="M4 96 H60 V82 H116"/><path class="pista-m g" d="M4 122 H140 V96"/>`,
    { pines: ['R', 'G', 'B', 'GND'], claves: ['R', 'VERDE', 'B', 'GND'] }
  );
  m.anclas = { [id]: [x + 140, y + 72] };
  return m;
}

// Zumbador pasivo (ACEBOTT QB010): hay que darle una onda cuadrada (2–5 kHz suena mejor)
export function moduloZumbador(id, x, y) {
  const m = placaModulo(
    id,
    x,
    y,
    'zumbador pasivo',
    `<g data-pieza="${id}-zumbador"><circle cx="140" cy="72" r="38" class="zumb"/><circle cx="140" cy="72" r="7" class="zumb-agujero"/><text x="164" y="40" class="serigrafia-mod">+</text>
       <g class="ondas"><path d="M188 52 q14 20 0 40"/><path d="M200 42 q22 30 0 60"/></g></g>`,
    `<path class="pista-m s" d="M4 57 H60 V72 H102"/><path class="pista-m g" d="M4 109 H140 V110"/>`
  );
  m.anclas = { [id]: [x + 140, y + 72] };
  return m;
}

// Sensor de temperatura LM35 (módulo «LM35 Sensor» de ACEBOTT): 10 mV por grado en S.
// Patas del LM35: +Vs, Vout y GND. Su hoja de datos pide de 4 a 30 V.
export function moduloLM35(id, x, y) {
  const m = placaModulo(
    id,
    x,
    y,
    'LM35',
    `<g data-pieza="${id}-chip"><path d="M146 48 H168 A30 30 0 0 1 168 108 H146 Z" class="to92"/><text x="166" y="82" class="chip-texto peq" text-anchor="middle">LM35</text>
       <path d="M110 60 H146 M110 78 H146 M110 96 H146" class="pata"/></g>
     <g class="termo-ico" transform="translate(64 26)"><rect x="-4" y="0" width="8" height="26" rx="4"/><circle cx="0" cy="30" r="7"/></g>`,
    `<path class="pista-m s" d="M4 57 H60 V78 H110"/><path class="pista-m v abajo" d="M4 83 H84 V60 H110"/><path class="pista-m g" d="M4 109 H96 V96 H110"/>`
  );
  m.anclas = { [id]: [x + 160, y + 78] };
  return m;
}

// Presión y temperatura BMP280 (ACEBOTT QB103): I2C. Conector: SCL, SDA, VCC y GND.
export function moduloBMP280(id, x, y) {
  const m = placaModulo(
    id,
    x,
    y,
    'BMP280',
    `<g data-pieza="${id}-chip"><rect x="128" y="56" width="44" height="52" rx="4" class="chip-metal"/><circle cx="139" cy="67" r="3.5" class="agujero-chip"/></g>`,
    `<path class="pista-m s" d="M4 44 H90 V66 H128"/><path class="pista-m s" d="M4 70 H80 V78 H128"/><path class="pista-m v" d="M4 96 H80 V92 H128"/><path class="pista-m g" d="M4 122 H150 V108"/>`,
    { pines: ['SCL', 'SDA', 'VCC', 'GND'] }
  );
  m.anclas = { [id]: [x + 150, y + 82] };
  return m;
}

// Humedad del suelo (ACEBOTT QB040): placa de 23 × 63 mm con el conector arriba
// (S, V y G) y una horquilla que se clava en la tierra. Según ACEBOTT, su salida va
// de 0 a 2,3 V y sube cuanto más mojada está la tierra.
export function moduloHumedad(id, x, y) {
  const W = 161;
  const H = 440;
  const xs = { S: 54, V: 80, G: 106 };
  const svg = `<g class="modulo" data-modulo="${id}" transform="translate(${x} ${y})">
    <g data-pieza="${id}">
      <rect class="mod-pcb" x="0" y="0" width="${W}" height="196" rx="12"/>
      <circle cx="24" cy="44" r="13" class="taladro"/><circle cx="137" cy="44" r="13" class="taladro"/>
      <rect x="70" y="70" width="22" height="14" rx="2" class="chip"/><rect x="40" y="104" width="26" height="10" rx="2" class="resistencia"/><rect x="96" y="104" width="26" height="10" rx="2" class="resistencia"/>
      <text x="${W / 2}" y="178" class="serigrafia-mod" text-anchor="middle">humedad</text>
    </g>
    <g data-pieza="${id}-horquilla">
      <path d="M18 186 H62 V392 L40 436 L18 392 Z" class="horquilla"/><path d="M99 186 H143 V392 L121 436 L99 392 Z" class="horquilla"/>
      ${[230, 270, 310, 350].map((yy) => `<circle cx="40" cy="${yy}" r="4" class="horquilla-punto"/><circle cx="121" cy="${yy}" r="4" class="horquilla-punto"/>`).join('')}
    </g>
    <g class="interior">
      <path class="pista-m s" d="M${xs.S} 10 V77 H70"/><path class="pista-m v" d="M${xs.V} 10 V40 H121 V186"/><path class="pista-m g" d="M${xs.G} 10 V20 H134 V109 H122"/>
      <path class="pista-m s" d="M40 186 V128 H81 V84"/>
    </g>
    <rect x="38" y="-16" width="84" height="24" rx="3" class="cabecera"/>
    ${Object.entries(xs).map(([k, xx]) => `<rect x="${xx - 5}" y="-11" width="10" height="10" class="clavija ${k.toLowerCase()}"/><text x="${xx}" y="26" class="serigrafia-mod" text-anchor="middle">${k}</text>`).join('')}
  </g>`;
  const pines = Object.fromEntries(Object.entries(xs).map(([k, xx]) => [k, { x: x + xx, y: y - 6 }]));
  return { svg, pines, ancho: W, alto: H, arriba: true, anclas: { [id]: [x + 80, y + 92], [id + '-horquilla']: [x + 80, y + 300] } };
}

// ---------------------------------------------------------------------------
// Cables: tres hilos de colores (S amarillo, V rojo, G negro), con curva
export function trazo(desde, hasta, arco = 0.4) {
  const dx = hasta.x - desde.x;
  const c1 = { x: desde.x + dx * arco, y: desde.y };
  const c2 = { x: hasta.x - dx * arco, y: hasta.y };
  return `M${desde.x} ${desde.y} C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${hasta.x} ${hasta.y}`;
}
// Desde un contacto que mira hacia arriba: el hilo sube y luego va hacia el shield
export function trazoArriba(desde, hasta) {
  const c1 = { x: desde.x, y: desde.y - 110 };
  const c2 = { x: hasta.x + Math.max(60, (desde.x - hasta.x) * 0.45), y: hasta.y };
  return `M${desde.x} ${desde.y} C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${hasta.x} ${hasta.y}`;
}
export function cable(id, desde, hasta, tipo, { arco = 0.4, arriba = false } = {}) {
  return `<path class="cable ${tipo}" data-cable="${id}" d="${arriba ? trazoArriba(desde, hasta) : trazo(desde, hasta, arco)}"/>`;
}
// Los tres hilos de un módulo a un conector del shield. «cruzado» cambia V y G (el error)
export function cablesModulo(id, mod, con, { cruzado = false, sinSenal = false, senal = 'S' } = {}) {
  const P = mod.pines;
  const op = { arriba: !!mod.arriba };
  let s = '';
  if (!sinSenal) s += cable(id + '-s', P[senal], con.s, 's', op);
  // Un módulo sin pata V (como el LED RGB) solo lleva señal y tierra
  if (P.V || P.VCC) s += cable(id + '-v', P.V || P.VCC, cruzado ? con.g : con.v, cruzado ? 'v cruzado' : 'v', op);
  s += cable(id + '-g', P.GND || P.G, cruzado ? con.v : con.g, cruzado ? 'g cruzado' : 'g', op);
  return `<g class="cables" data-cables="${id}">${s}</g>`;
}
// Un módulo I2C al conector IIC del shield: SDA con 20, SCL con 19, VCC con V2 y GND con G
export function cablesIIC(id, mod, iic) {
  const P = mod.pines;
  const s =
    cable(id + '-sda', P.SDA, iic.SDA, 's') +
    cable(id + '-scl', P.SCL, iic.SCL, 's') +
    cable(id + '-v', P.VCC || P.V, iic.V, 'v') +
    cable(id + '-g', P.GND || P.G, iic.G, 'g');
  return `<g class="cables" data-cables="${id}">${s}</g>`;
}

// ---------------------------------------------------------------------------
export const ESTILO_BANCO = `${ESTILO_DIBUJOS}
<style>
  .shield-pcb { fill: #17305a; stroke: #0d1d38; stroke-width: 3; }
  .transparente .shield-pcb { fill-opacity: 0.55; }
  .serigrafia-sh { fill: #e9eef7; font: 700 15px/1 "Atkinson Hyperlegible Mono", ui-monospace, monospace; }
  .serigrafia-sh.marca { font: 700 16px/1 "Archivo", system-ui, sans-serif; opacity: 0.75; }
  .serigrafia-sh.izq, .serigrafia-mod.izq { text-anchor: start; }
  .serigrafia-mod { fill: #f3f6f3; font: 700 15px/1 "Archivo", system-ui, sans-serif; }
  .mini { fill: #f3f6f3; font: 600 12px/1 "Atkinson Hyperlegible Mono", ui-monospace, monospace; }
  .ranura { fill: #0e0f10; stroke: #000; stroke-width: 2; }
  .jack { fill: #111315; stroke: #000; stroke-width: 2; }
  .jack-agujero { fill: #3a3f43; stroke: #000; stroke-width: 2; }
  .cabecera { fill: #0f1113; stroke: #000; stroke-width: 1.5; }
  .clavija { fill: #d6aa3c; stroke: #8f6c1d; stroke-width: 1; }
  .clavija.s { fill: #f2c94c; }
  .conector.ocupado .cabecera { stroke: #b08d3a; stroke-dasharray: 4 3; }
  .conector.marcado .cabecera { stroke: #ffd65a; stroke-width: 3; stroke-dasharray: none; }
  .capuchon { fill: #e8463b; stroke: #8f1f17; stroke-width: 2; transition: y 0.2s; }
  .led-power { fill: #3a2422; stroke: #000; stroke-width: 1.5; }
  .encendido .led-power { fill: #ff4b3e; filter: drop-shadow(0 0 6px #ff4b3e); }
  .pista-s { fill: none; stroke: #8ea6c9; stroke-width: 1.6; opacity: 0.45; }
  .pista-s.activa { stroke: #ffd65a; stroke-width: 3; opacity: 1; }
  .pista-s.alta { stroke: #ffcf3f; stroke-width: 3.4; opacity: 1; }
  .pista-s.baja { stroke: #43c3a5; stroke-width: 3.4; opacity: 1; }
  .pista-s.peligro { stroke: #ff3b30; stroke-width: 4.5; opacity: 1; }
  .rail-v, .rail-33, .rail-5v { fill: none; stroke-width: 4; stroke-linecap: round; }
  .rail-33 { stroke: #f39c4a; }
  .rail-5v { stroke: #e54b4b; }
  .rail-v { stroke: #f39c4a; }
  .a5v .rail-v1, .a5v2 .rail-v2 { stroke: #e54b4b; }
  .rail-g { fill: none; stroke: #5c6670; stroke-width: 4; }
  .apagado .rail-v, .apagado .rail-33, .apagado .rail-5v { stroke: #6b7280; }
  .mod-pcb { fill: #1d5a86; stroke: #0f3552; stroke-width: 2.5; }
  .transparente .mod-pcb { fill-opacity: 0.6; }
  .taladro { fill: var(--escena-agujero, #e3e6df); stroke: #c9cfd6; stroke-width: 2; }
  .pista-m { fill: none; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
  .pista-m.s { stroke: #f2c94c; }
  .pista-m.v { stroke: #e54b4b; }
  .pista-m.g { stroke: #9aa5ae; }
  .pista-m.r { stroke: #ff6b5e; } .pista-m.gr { stroke: #4fd17f; } .pista-m.b { stroke: #6ea4ff; }
  .resistencia { fill: #cdbb8c; stroke: #7a6b42; stroke-width: 1.5; }
  .tecla-base { fill: #2d3236; stroke: #111; stroke-width: 2; }
  .tecla-tapa { fill: #e9e2c9; stroke: #6b6550; stroke-width: 2; cursor: pointer; }
  .pulsado .tecla-tapa { fill: #c9c1a3; transform-box: fill-box; transform-origin: center; transform: scale(0.88); }
  .tubo { fill: #c7ced3; stroke: #6f7a82; stroke-width: 2; fill-opacity: 0.9; }
  .bola { fill: #8a939a; stroke: #3c4348; stroke-width: 2; transition: cx 0.25s; }
  .ir-emisor { fill: #e9f1f5; stroke: #8798a3; stroke-width: 2; }
  .ir-receptor { fill: #15181a; stroke: #000; stroke-width: 2; }
  .potenciometro { fill: #2f6fd1; stroke: #173b75; stroke-width: 2; }
  .pot-eje { fill: #f0f2f4; stroke: #8b96a0; stroke-width: 2; }
  .led-indicador { fill: #2b1a19; stroke: #000; stroke-width: 1.5; }
  .led-indicador.on { fill: #ff4b3e; filter: drop-shadow(0 0 5px #ff4b3e); }
  .ldr { fill: #e7d3a6; stroke: #8a6d3b; stroke-width: 2; }
  .ldr-pista { fill: none; stroke: #b2492f; stroke-width: 3; }
  .joy-base { fill: #23272b; stroke: #000; stroke-width: 2; }
  .joy-aro { fill: #34393e; stroke: #111; stroke-width: 2; }
  .joy-pomo { fill: #4a5056; stroke: #111; stroke-width: 2; cursor: grab; }
  .led-cuerpo { fill: color-mix(in srgb, var(--led, #ff3b2f) 30%, #2a1d1c); stroke: #111; stroke-width: 2; }
  .led-cuerpo.rgb { fill: #e8e6e0; }
  .led-halo { opacity: 0; }
  .led-brillo { fill: #fff; opacity: 0.45; }
  .zumb { fill: #121416; stroke: #000; stroke-width: 2; }
  .zumb-agujero { fill: #3b4045; }
  .ondas path { fill: none; stroke: #ff9f43; stroke-width: 4; stroke-linecap: round; opacity: 0; }
  .sonando .ondas path { opacity: 1; animation: onda 0.5s linear infinite; }
  .sonando .ondas path:nth-child(2) { animation-delay: 0.12s; }
  @keyframes onda { from { opacity: 1; } to { opacity: 0.15; } }
  @media (prefers-reduced-motion: reduce) { .sonando .ondas path { animation: none; } }
  .cable { fill: none; stroke-width: 7; stroke-linecap: round; opacity: 0.92; }
  .cable.s { stroke: #f2b632; }
  .cable.v { stroke: #d93d34; }
  .cable.g { stroke: #2b2f33; }
  .cable.cruzado { stroke-dasharray: 14 6; }
  .cable.s.alta { stroke: #ffd84d; filter: drop-shadow(0 0 4px #ffd84d); }
  .cable.s.peligro { stroke: #ff3b30; filter: drop-shadow(0 0 5px #ff3b30); }
  .cable.suelto { opacity: 0.35; stroke-dasharray: 6 8; }
  .pista-s.datos { stroke: #7ad7ff; stroke-width: 3.4; opacity: 1; stroke-dasharray: 7 5; animation: datos 0.5s linear infinite; }
  .cable.s.datos { stroke: #7ad7ff; filter: drop-shadow(0 0 4px #7ad7ff); stroke-dasharray: 12 6; animation: datos 0.5s linear infinite; }
  @keyframes datos { to { stroke-dashoffset: -24; } }
  @media (prefers-reduced-motion: reduce) { .pista-s.datos, .cable.s.datos { animation: none; } }
  .pista-m.abajo { stroke-dasharray: 5 4; opacity: 0.8; }
  .to92 { fill: #1b1d1f; stroke: #000; stroke-width: 2; }
  .pata { fill: none; stroke: #c9ced3; stroke-width: 4; stroke-linecap: round; }
  .termo-ico rect, .termo-ico circle { fill: none; stroke: #e9c46a; stroke-width: 2.5; }
  .chip-metal { fill: #cfd5da; stroke: #7f8a93; stroke-width: 2; }
  .agujero-chip { fill: #2a2f33; }
  .horquilla { fill: #d9b25c; stroke: #8a6a24; stroke-width: 2; }
  .horquilla-punto { fill: #b98d33; }
  .corroida .horquilla { fill: #8f7a52; }
  .destacado { filter: drop-shadow(0 0 6px #ffd65a) drop-shadow(0 0 2px #ffd65a); }
  path.destacado { stroke-width: 6; opacity: 1; }
  .aviso-peligro { fill: #ff3b30; font: 800 20px/1 "Archivo", system-ui, sans-serif; }
</style>`;

// ---------------------------------------------------------------------------
// Montar el banco: el shield con la micro:bit y los módulos conectados por cables.
//   modulos: [{ id, crear: moduloLED…, x, y, pin, senal: 'S' (o 'X', 'R'…), pines: { S: 'P1', … } }]
//   Para módulos de varios pines de señal, «pines» dice a qué conector va cada uno.
// Devuelve la escena 2D y funciones para pintar el estado eléctrico.
export const PIEZAS_SHIELD = {
  microbit: ['micro:bit', 'Va de pie en la ranura del shield: cada pin de su conector llega a un conector S del shield.'],
  ranura: ['Ranura', 'Recibe el conector de la micro:bit. Por ella pasan todas las señales y la alimentación de 3,3 V.'],
  dc: ['Entrada DC', 'Para un adaptador de 7 a 9 V. El regulador de 5 V la baja a 5 V. Hace falta para servos, motores y bombas.'],
  usb: ['Micro USB del shield', 'Otra forma de alimentar el shield: 5 V de un cargador o de una batería USB.'],
  regulador5: ['Regulador de 5 V', 'Saca 5 V estables de la entrada DC. Se calienta si los módulos piden mucha corriente: no lo toques.'],
  regulador33: ['Regulador de 3,3 V', 'Saca 3,3 V para la micro:bit (por su pin 3V) y para la fila V si el puente está en 3V3.'],
  ledPower: ['LED de encendido', 'Se enciende cuando el shield tiene alimentación.'],
  puente: ['Puentes V1 y V2', 'Dos capuchones que eligen 3,3 V o 5 V: V1 para la V de los conectores P0 a P9 y V2 para la de P10 a P20 y los conectores I2C y SPI. Con 5 V, la señal que devuelve un sensor también puede llegar a 5 V, y un pin de la micro:bit no admite más de 3,6 V.'],
  pantalla: ['Pantalla de la micro:bit', 'Usa los pines P3, P4, P6, P7 y P10: si conectas algo ahí, la pantalla y el módulo se molestan.'],
  botonA: ['Botón A', 'Va al pin P5: mejor no usar P5 para otra cosa.'],
  botonB: ['Botón B', 'Va al pin P11: mejor no usar P11 para otra cosa.'],
  logo: ['Logo táctil', 'Es una entrada de la micro:bit V2; no tiene que ver con el shield.'],
  conector: ['Conector de la micro:bit', 'Sus contactos llegan, a través de la ranura, a los conectores del shield.'],
  iic: ['Conector IIC', 'Cuatro contactos para módulos I2C: 20 es SDA (los datos), 19 es SCL (el reloj), V2 la alimentación del puente V2 y G la tierra. Todos los módulos I2C comparten SDA y SCL; cada uno contesta solo a su dirección.', 'Se usa: aquí va el módulo I2C.'],
};
export function infoConector(pin) {
  const u = usoPin(pin);
  const n = pin;
  if (!u) return [`Conector ${n}`, `S va al pin ${n} de la micro:bit; V da la tensión del puente; G es la tierra. ${USO_PIN[pin]?.analogico ? 'Este pin también lee valores analógicos (0 a 1023).' : 'Este pin solo lee y escribe valores digitales (o PWM).'}`, 'Libre: buena elección para un módulo.'];
  return [`Conector ${n}`, `S va al pin ${n}, que la micro:bit ya usa para ${u}. Si conectas un módulo aquí, los dos se molestan.`, 'Ocupado: mejor no usarlo.'];
}

export function crearBanco({ ui, usos = {}, contenedor = document.getElementById('escena'), modulos = [], shield = { ox: 22, oy: 216 }, zonasExtra = [], extraSVG = '', rotulosExtra = [], piezas = {}, alPulsar, alDibujar, ancho = 1000, alto = 600, caja = [20, 20, 600, 596], valores, prioridad = {}, vistaInicial = null, alCambiarVista, botonera = 'der', fondoSVG = '' } = {}) {
  const usados = [];
  for (const m of modulos) {
    // Los módulos I2C van al conector IIC: SDA primero (su pista va por el carril de arriba)
    const ps = m.iic ? ['IIC:SDA', 'IIC:SCL'] : Object.values(m.pines || { S: m.pin });
    for (const p of ps) if (p && !usados.includes(p)) usados.push(p);
  }
  const sh = dibujoShield({ ...shield, usados });
  let mods = '';
  let cables = '';
  const info = {};
  const rotulos = [];
  const R = (id, texto, ancla, prio = 5) => rotulos.push({ id, texto, ancla, prio: prioridad[id] ?? prio });
  for (const m of modulos) {
    const d = m.crear(m.id, m.x, m.y, m.color);
    m.dibujo = d;
    mods += d.svg;
    const pines = m.iic ? {} : m.pines || { [m.senal || 'S']: m.pin };
    if (m.iic) cables += cablesIIC(m.id, d, sh.iic()).replace('<g class="cables"', `<g class="cables" data-vista-mod="${m.id}"`);
    let k = 0;
    for (const [senal, pin] of Object.entries(pines)) {
      const con = sh.conector(pin);
      // El primer pin de señal lleva también V y G; el resto, solo su señal
      // Cada grupo de cables lleva el id de su módulo (para ocultarlo con su vista)
      if (k === 0) cables += cablesModulo(m.id, d, con, { senal, cruzado: m.cruzado }).replace('<g class="cables"', `<g class="cables" data-vista-mod="${m.id}"`);
      else cables += `<g class="cables" data-vista-mod="${m.id}">${cable(`${m.id}-${senal}`, d.pines[senal], con.s, 's')}</g>`;
      k++;
    }
    for (const [aid, a] of Object.entries(d.anclas || {})) {
      R(aid, m.nombres?.[aid] || m.nombre, a, 7);
      rotulos[rotulos.length - 1].zona = 'mod-' + m.id;
      // Un módulo que solo está en una vista (se elige con los botones de la escena)
      if (m.vista) rotulos[rotulos.length - 1].vistas = [m.vista];
    }
  }
  if (usados.includes('IIC:SDA')) {
    R('iic', 'Conector IIC', sh.anclas.iic, 6);
    const deVistas = modulos.filter((m) => m.iic);
    if (deVistas.every((m) => m.vista)) rotulos[rotulos.length - 1].vistas = deVistas.map((m) => m.vista);
  }
  for (const pin of usados) {
    if (pin.startsWith('IIC:')) continue;
    R('con-' + pin, `Conector ${pin}`, sh.anclas['con-' + pin], 6);
    // Si solo lo usan módulos de ciertas vistas, el rótulo sale solo en ellas
    const deVistas = modulos.filter((m) => Object.values(m.pines || { S: m.pin }).includes(pin));
    if (deVistas.length && deVistas.every((m) => m.vista)) rotulos[rotulos.length - 1].vistas = deVistas.map((m) => m.vista);
  }
  for (const id of ['puente', 'regulador33', 'regulador5', 'usb', 'dc', 'ledPower', 'ranura']) R(id, PIEZAS_SHIELD[id][0], sh.anclas[id], id === 'puente' ? 8 : id === 'usb' || id === 'regulador33' ? 4 : 3);
  R('microbit', 'micro:bit', sh.anclas.microbit, 5);
  rotulos.push(...rotulosExtra);
  // fondoSVG va detrás del shield y de los módulos; extraSVG, delante de todo
  const svg = `${ESTILO_BANCO}${fondoSVG}${sh.svg}${mods}<g class="todos-cables">${cables}</g>${extraSVG}`;
  // Zonas que los rótulos no deben tapar: la pantalla, la alimentación, los conectores y los módulos
  const { ox, oy } = { ox: 22, oy: 216, ...shield };
  const prohibidas = [
    [ox + SHIELD.mbX + 2, oy + SHIELD.mbY + 6, ox + SHIELD.mbX + 256, oy + 14],
    [ox + 16, oy + 88, ox + 96, oy + 150],
    [ox + 20, oy + 194, ox + 92, oy + 232],
    [ox + 120, oy + 94, ox + 170, oy + 186],
    [ox + 134, oy + 217, ox + 156, oy + 239],
    [ox + 196, oy + 82, ox + 290, oy + 192],
    [ox + 288, oy + 136, ox + 598, oy + 368],
    ...modulos.map((m) => [m.x - 16, m.y, m.x + (m.dibujo.ancho || 220), m.y + (m.dibujo.alto || 166), 'mod-' + m.id]),
    ...zonasExtra,
  ];
  const vista = crearEscena2D({
    contenedor,
    ancho,
    alto,
    svg,
    rotulos,
    caja,
    modoRotulos: 'cerca',
    prohibidas,
    alinear: 'arriba',
    vistaInicial,
    alCambiarVista,
    alPulsar(id, e) {
      if (alPulsar?.(id, e)) return;
      const p = piezas[id] || PIEZAS_SHIELD[id] || (id.startsWith('con-') ? infoConector(id.slice(4)) : null);
      if (p) ui?.mostrarPieza(p[0], p[1], usos[id] || p[2] || '');
    },
    alDibujar,
    valores,
  });
  const raiz = vista.svg;
  let v2 = 3.3;
  if (botonera === 'der') contenedor.querySelector('.botonera')?.classList.add('der');
  return {
    vista,
    svg: raiz,
    shield: sh,
    // Color de la señal de un pin (cable S y pista del shield): 'alta', 'baja', 'peligro' o nada
    senal(pin, estado, idCable) {
      const pista = raiz.querySelector(`.pista-s[data-pista="${pin}"]`);
      if (pista) for (const c of ['alta', 'baja', 'peligro', 'datos']) pista.classList.toggle(c, estado === c);
      if (idCable) {
        const cab = raiz.querySelector(`[data-cable="${idCable}"]`);
        if (cab) for (const c of ['alta', 'peligro', 'datos']) cab.classList.toggle(c, estado === c);
      }
    },
    // V1 (P0 a P9) y V2 (P10 a P20, I2C y SPI). Si no se dice V2, se queda como estaba.
    puente(vcc1, vcc2) {
      if (vcc2 !== undefined) v2 = vcc2;
      ponerPuente(raiz, vcc1, v2);
    },
    // Conecta el módulo con V y G cambiados (o lo deja bien)
    cruzar(id, on) {
      const m = modulos.find((x) => x.id === id);
      if (!m) return;
      const pin = Object.values(m.pines || { S: m.pin })[0];
      const con = sh.conector(pin);
      const P = m.dibujo.pines;
      const cv = raiz.querySelector(`[data-cable="${id}-v"]`);
      const cg = raiz.querySelector(`[data-cable="${id}-g"]`);
      if (!cv || !cg) return;
      const f = m.dibujo.arriba ? trazoArriba : trazo;
      cv.setAttribute('d', f(P.V || P.VCC, on ? con.g : con.v));
      cg.setAttribute('d', f(P.G || P.GND, on ? con.v : con.g));
      cv.classList.toggle('cruzado', on);
      cg.classList.toggle('cruzado', on);
    },
    // Cambia SDA y SCL de un módulo I2C (o los deja bien)
    cruzarIIC(id, on) {
      const m = modulos.find((x) => x.id === id);
      if (!m) return;
      const P = m.dibujo.pines;
      const c = sh.iic();
      raiz.querySelector(`[data-cable="${id}-sda"]`)?.setAttribute('d', trazo(P.SDA, on ? c.SCL : c.SDA));
      raiz.querySelector(`[data-cable="${id}-scl"]`)?.setAttribute('d', trazo(P.SCL, on ? c.SDA : c.SCL));
      raiz.querySelectorAll(`[data-cable="${id}-sda"], [data-cable="${id}-scl"]`).forEach((el) => el.classList.toggle('cruzado', on));
    },
    // Suelta (o vuelve a conectar) el cable S de un módulo
    soltarSenal(id, suelto, senal = 'S') {
      const c = raiz.querySelector(`[data-cable="${id}-${senal.toLowerCase()}"]`);
      c?.classList.toggle('suelto', suelto);
    },
    encendido(on) {
      raiz.classList.toggle('encendido', on);
      raiz.classList.toggle('apagado', !on);
    },
    destacar(sel, on = true) {
      raiz.querySelectorAll('.destacado').forEach((el) => el.classList.remove('destacado'));
      if (on && sel) raiz.querySelectorAll(sel).forEach((el) => el.classList.add('destacado'));
    },
  };
}
