// Bit a bit · Dibujos en SVG que se repiten en varios laboratorios
// La micro:bit V2 se dibuja en décimas de milímetro: 516 × 420 (51,6 × 42 mm).
// Es un esquema simplificado: posiciones aproximadas, piezas y pines reales.

export const MB = { ancho: 516, alto: 420 };

// Conector del borde, visto por delante, de izquierda a derecha
// (tech.microbit.org/hardware/edgeconnector). Las anillas grandes van con «anilla».
export const CONECTOR = [
  { p: 'P3' },
  { p: 'P0', anilla: '0' },
  { p: 'P4' },
  { p: 'P5' },
  { p: 'P6' },
  { p: 'P7' },
  { p: 'P1', anilla: '1' },
  { p: 'P8' },
  { p: 'P9' },
  { p: 'P10' },
  { p: 'P11' },
  { p: 'P12' },
  { p: 'P2', anilla: '2' },
  { p: 'P13' },
  { p: 'P14' },
  { p: 'P15' },
  { p: 'P16' },
  { p: '3V', anilla: '3V' },
  { p: '3V' },
  { p: '3V' },
  { p: 'P19' },
  { p: 'P20' },
  { p: 'GND' },
  { p: 'GND' },
  { p: 'GND', anilla: 'GND' },
];

// Posición x (en la placa) de cada contacto del conector
export function posicionesConector() {
  const anillas = { 0: 50, 1: 154, 2: 258, '3V': 362, GND: 466 };
  const res = [];
  let i = 0;
  // pequeños entre anillas: reparto uniforme en cada hueco
  const grupos = [];
  let actual = [];
  for (const c of CONECTOR) {
    if (c.anilla) {
      grupos.push({ pequenos: actual, anilla: c });
      actual = [];
    } else actual.push(c);
  }
  let xPrev = 6;
  for (const g of grupos) {
    const xA = anillas[g.anilla.anilla];
    const ini = xPrev + (xPrev === 6 ? 0 : 31);
    const fin = xA - 31;
    const n = g.pequenos.length;
    g.pequenos.forEach((c, k) => {
      const x = n === 1 ? (ini + fin) / 2 : ini + ((fin - ini) * (k + 0.5)) / n;
      res.push({ ...c, x, i: i++ });
    });
    res.push({ ...g.anilla, x: xA, i: i++ });
    xPrev = xA;
  }
  return res;
}

const LEDX = (c) => 166 + c * 46;
const LEDY = (f) => 92 + f * 44;
export const posLED = (c, f) => ({ x: LEDX(c), y: LEDY(f) });

// micro:bit por delante. Devuelve marcado SVG; las piezas llevan data-pieza.
export function microbitFrente({ interior = '' } = {}) {
  const pos = posicionesConector();
  let leds = '';
  for (let f = 0; f < 5; f++)
    for (let c = 0; c < 5; c++)
      leds += `<g class="mb-led" data-x="${c}" data-y="${f}" transform="translate(${LEDX(c)} ${LEDY(f)})"><rect class="mb-led-halo" x="-17" y="-17" width="34" height="34" rx="17"/><rect class="mb-led-cuerpo" x="-6" y="-11" width="12" height="22" rx="2"/></g>`;
  let conector = '';
  for (const c of pos) {
    if (c.anilla) {
      conector += `<g class="mb-pin mb-anilla" data-pin="${c.p}" data-pieza="pin-${c.p}"><rect x="${c.x - 28}" y="330" width="56" height="90" rx="6" class="oro"/><circle cx="${c.x}" cy="372" r="19" class="agujero"/><text x="${c.x}" y="322" class="serigrafia" text-anchor="middle">${c.anilla}</text></g>`;
    } else conector += `<rect class="mb-pin oro" data-pin="${c.p}" x="${c.x - 3}" y="358" width="6" height="62" rx="1.5"/>`;
  }
  return `
  <g class="microbit frente">
    <g class="carcasa">
      <path class="pcb" d="M30 0 H486 A30 30 0 0 1 516 30 V420 H0 V30 A30 30 0 0 1 30 0 Z"/>
      <text x="258" y="300" class="serigrafia marca" text-anchor="middle">micro:bit</text>
    </g>
    ${interior}
    <g class="mb-logo" data-pieza="logo">
      <path d="M222 22 h72 a20 20 0 0 1 0 40 h-72 a20 20 0 0 1 0 -40 z" class="oro"/>
      <path d="M226 28 h64 a14 14 0 0 1 0 28 h-64 a14 14 0 0 1 0 -28 z" class="pcb-hueco"/>
      <circle cx="240" cy="42" r="6" class="oro"/><circle cx="276" cy="42" r="6" class="oro"/>
    </g>
    <g class="mb-mic-led" data-pieza="microfono"><rect x="322" y="34" width="12" height="16" rx="2" class="led-apagado"/></g>
    <g class="mb-boton" data-boton="A" data-pieza="botonA">
      <rect x="22" y="146" width="66" height="66" rx="8" class="boton-cuerpo"/>
      <circle cx="55" cy="179" r="21" class="boton-tapa"/>
      <text x="55" y="244" class="serigrafia" text-anchor="middle">A</text>
    </g>
    <g class="mb-boton" data-boton="B" data-pieza="botonB">
      <rect x="428" y="146" width="66" height="66" rx="8" class="boton-cuerpo"/>
      <circle cx="461" cy="179" r="21" class="boton-tapa"/>
      <text x="461" y="244" class="serigrafia" text-anchor="middle">B</text>
    </g>
    <g class="mb-pantalla" data-pieza="pantalla">${leds}</g>
    <g class="mb-conector" data-pieza="conector">${conector}</g>
  </g>`;
}

// micro:bit por detrás (vista como si la dieras la vuelta de izquierda a derecha)
export function microbitDetras({ interior = '' } = {}) {
  const pos = posicionesConector();
  let conector = '';
  for (const c of pos) {
    const x = 516 - c.x;
    if (c.anilla) conector += `<g class="mb-pin mb-anilla" data-pin="${c.p}"><rect x="${x - 28}" y="330" width="56" height="90" rx="6" class="oro"/><circle cx="${x}" cy="372" r="19" class="agujero"/></g>`;
    else conector += `<rect class="mb-pin oro" data-pin="${c.p}" x="${x - 3}" y="358" width="6" height="62" rx="1.5"/>`;
  }
  return `
  <g class="microbit detras">
    <g class="carcasa">
      <path class="pcb" d="M30 0 H486 A30 30 0 0 1 516 30 V420 H0 V30 A30 30 0 0 1 30 0 Z"/>
    </g>
    ${interior}
    <g data-pieza="usb"><rect x="314" y="-6" width="74" height="40" rx="5" class="metal"/><rect x="326" y="4" width="50" height="14" rx="3" class="metal-oscuro"/></g>
    <g data-pieza="bateria"><rect x="96" y="-4" width="64" height="44" rx="4" class="conector-blanco"/><rect x="106" y="8" width="44" height="20" rx="2" class="metal-oscuro"/></g>
    <g data-pieza="reset"><rect x="230" y="14" width="40" height="30" rx="4" class="boton-cuerpo"/><circle cx="250" cy="29" r="9" class="boton-tapa"/></g>
    <g data-pieza="interfaz"><rect x="320" y="70" width="52" height="52" rx="4" class="chip"/><text x="346" y="100" class="chip-texto" text-anchor="middle">nRF52820</text></g>
    <g data-pieza="procesador"><rect x="300" y="168" width="84" height="84" rx="6" class="chip"/><circle cx="312" cy="180" r="4" class="chip-punto"/><text x="342" y="214" class="chip-texto" text-anchor="middle">nRF52833</text></g>
    <g data-pieza="movimiento"><rect x="126" y="196" width="40" height="40" rx="3" class="chip"/><text x="146" y="221" class="chip-texto peq" text-anchor="middle">LSM303</text></g>
    <g data-pieza="altavoz"><circle cx="190" cy="120" r="50" class="altavoz"/><circle cx="190" cy="120" r="34" class="altavoz-rejilla"/><circle cx="190" cy="120" r="6" class="altavoz-centro"/></g>
    <g data-pieza="microfono"><rect x="166" y="34" width="26" height="20" rx="3" class="metal"/><circle cx="179" cy="44" r="4" class="metal-oscuro"/></g>
    <g data-pieza="leds-estado"><rect x="402" y="50" width="12" height="16" rx="2" class="led-apagado"/><rect x="420" y="50" width="12" height="16" rx="2" class="led-apagado"/></g>
    <g class="mb-conector">${conector}</g>
  </g>`;
}

// Puntos para los rótulos (en coordenadas de la placa)
export const ANCLAS_FRENTE = {
  pantalla: [258, 180],
  botonA: [55, 179],
  botonB: [461, 179],
  logo: [258, 42],
  microfono: [328, 42],
  conector: [258, 395],
};
export const ANCLAS_DETRAS = {
  procesador: [342, 210],
  movimiento: [146, 216],
  altavoz: [190, 120],
  microfono: [179, 44],
  usb: [351, 14],
  bateria: [128, 18],
  interfaz: [346, 96],
  reset: [250, 29],
};

// Estilos comunes de los dibujos (van dentro del SVG para que funcionen igual en todas partes)
export const ESTILO_DIBUJOS = `
<style>
  .pcb { fill: #1c2023; stroke: #3a4146; stroke-width: 2; }
  .pcb-hueco { fill: #1c2023; }
  .oro { fill: #d6aa3c; stroke: #a67e22; stroke-width: 1.5; }
  .agujero { fill: var(--escena-agujero, #e3e6df); stroke: #a67e22; stroke-width: 2; }
  .serigrafia { fill: #f2f2ee; font: 700 22px/1 "Archivo", system-ui, sans-serif; letter-spacing: 0.5px; }
  .serigrafia.marca { font-size: 30px; opacity: 0.85; }
  .boton-cuerpo { fill: #4b5257; stroke: #2b3033; stroke-width: 2; }
  .boton-tapa { fill: #15181a; stroke: #000; stroke-width: 1.5; }
  .mb-boton.pulsado .boton-tapa { fill: #000; transform-box: fill-box; transform-origin: center; transform: scale(0.88); }
  .mb-boton { cursor: pointer; }
  .mb-logo { cursor: pointer; }
  .mb-logo.tocado .oro { fill: #ffd76a; }
  .mb-led-cuerpo { fill: #3a1d1b; stroke: #120b0a; stroke-width: 1; }
  .mb-led-halo { fill: #ff2a1f; opacity: 0; }
  .led-apagado { fill: #3a1d1b; }
  .led-encendido { fill: #ff4136; }
  .chip { fill: #22272a; stroke: #4d565c; stroke-width: 2; }
  .chip-texto { fill: #c9d1cd; font: 600 13px/1 "Atkinson Hyperlegible Mono", ui-monospace, monospace; }
  .chip-texto.peq { font-size: 10px; }
  .chip-punto { fill: #4d565c; }
  .metal { fill: #b8bec2; stroke: #7d868c; stroke-width: 1.5; }
  .metal-oscuro { fill: #50585e; }
  .conector-blanco { fill: #efece2; stroke: #b9b39f; stroke-width: 1.5; }
  .altavoz { fill: #101214; stroke: #3d4448; stroke-width: 2; }
  .altavoz-rejilla { fill: none; stroke: #2f3539; stroke-width: 6; stroke-dasharray: 3 5; }
  .altavoz-centro { fill: #3d4448; }
  .interior { opacity: 0; transition: opacity 0.25s; pointer-events: none; }
  .transparente .interior { opacity: 1; }
  .transparente .carcasa .pcb { fill-opacity: 0.62; }
  .pista { fill: none; stroke: #9aa39e; stroke-width: 3; stroke-linecap: round; }
  .pista.on { stroke: #ffcf3f; stroke-width: 5; }
  .pista.baja { stroke: #43c3a5; stroke-width: 5; }
  .etiqueta-pista { fill: #e9ece8; font: 700 15px/1 "Atkinson Hyperlegible Mono", ui-monospace, monospace; }
  .etiqueta-pista.on { fill: #ffd65a; }
  .etiqueta-pista.baja { fill: #6fe0c4; }
  .cota { fill: #c7ccc8; font: 600 14px/1 "Atkinson Hyperlegible Next", system-ui, sans-serif; }
</style>`;
