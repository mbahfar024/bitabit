// Bit a bit · El programa del siguelíneas en bloques (estilo MakeCode) y en Python.
// Textos de los bloques tomados de la extensión oficial (pxt-DFRobot_MaqueenPlus_v20,
// _locales/es-es y _locales/en). Nombres de Python según las reglas de MakeCode
// (funciones en snake_case, valores de enumeración en MAYÚSCULAS).

const TXT = {
  es: {
    alIniciar: 'al iniciar',
    paraSiempre: 'para siempre',
    si: 'si',
    entonces: 'entonces',
    siNo: 'si no',
    y: 'y',
    init: 'inicializar el Maqueen',
    motor: (m, d, v) => ['activar', dd(m), dd(d), 'velocidad', num(v)],
    estado: (s) => ['estado del sensor de línea', dd(s)],
    ambos: 'dos motores',
    izq: 'motor izquierdo',
    der: 'motor derecho',
    adelante: 'hacia adelante',
    pausa: 'Al terminar cada vuelta, «para siempre» espera 20 ms',
  },
  en: {
    alIniciar: 'on start',
    paraSiempre: 'forever',
    si: 'if',
    entonces: 'then',
    siNo: 'else',
    y: 'and',
    init: 'Initialize Maqueen Plus',
    motor: (m, d, v) => ['Set', dd(m), 'direction', dd(d), 'speed', num(v)],
    estado: (s) => ['Read line sensor', dd(s), 'state'],
    ambos: 'All Motors',
    izq: 'Left Motor',
    der: 'Right Motor',
    adelante: 'Forward',
    pausa: 'After each pass, forever waits 20 ms',
  },
};

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}
function dd(t) {
  return `<span class="mk-dd">${esc(t)}</span>`;
}
function num(n) {
  return `<span class="mk-numero">${n}</span>`;
}
function partes(arr) {
  return arr.map((p) => (p.startsWith('<') ? p : `<span>${esc(p)}</span>`)).join('');
}

function bloquesHTML(lang) {
  const t = TXT[lang];
  const rep = (nodo, s) => `<span class="mk-rep" data-nodo="${nodo}">${partes(t.estado(s))}</span>`;
  const cmp = (nodo, sensor, valor) =>
    `<span class="mk-hex" data-cmp="${nodo}">${rep(nodo, sensor)}<span>=</span>${num(valor)}</span>`;
  const y = (a, b) => `<span class="mk-hex mk-y"><span class="fila">${a}</span><span class="fila"><span>${esc(t.y)}</span>${b}</span></span>`;
  const motor = (nodo, m, v) =>
    `<div class="mk-s mk-maqueen" data-nodo="${nodo}">${partes(t.motor(m, t.adelante, v))}</div>`;
  const cab = (nodo, html) => `<div class="mk-cab" data-nodo="${nodo}">${html}</div>`;
  const si = (nodo, cond) => cab(nodo, `<span>${esc(t.si)}</span>${cond}<span>${esc(t.entonces)}</span>`);
  return `
<div class="mk" lang="${lang}">
  <div class="mk-c mk-basico">
    ${cab('inicio', `<span>${esc(t.alIniciar)}</span>`)}
    <div class="mk-barra"></div>
    <div class="mk-cuerpo">
      <div class="mk-s mk-maqueen" data-nodo="init"><span>${esc(t.init)}</span></div>
    </div>
    <div class="mk-pie"></div>
  </div>
  <div class="mk-c mk-basico">
    ${cab('forever', `<span>${esc(t.paraSiempre)}</span>`)}
    <div class="mk-barra"></div>
    <div class="mk-cuerpo">
      <div class="mk-c mk-logica">
        ${si('if1', cmp('c1M', 'M', 1))}
        <div class="mk-barra"></div>
        <div class="mk-cuerpo">${motor('m1', t.ambos, 100)}</div>
        <div class="mk-medio" data-nodo="else1"><span>${esc(t.siNo)}</span></div>
        <div class="mk-barra"></div>
        <div class="mk-cuerpo">
          <div class="mk-c mk-logica">
            ${si('if2', y(cmp('c2L1', 'L1', 0), cmp('c2R1', 'R1', 1)))}
            <div class="mk-barra"></div>
            <div class="mk-cuerpo">${motor('m2', t.izq, 160)}${motor('m3', t.der, 30)}</div>
            <div class="mk-pie"></div>
          </div>
          <div class="mk-c mk-logica">
            ${si('if3', y(cmp('c3L1', 'L1', 1), cmp('c3R1', 'R1', 0)))}
            <div class="mk-barra"></div>
            <div class="mk-cuerpo">${motor('m4', t.der, 160)}${motor('m5', t.izq, 30)}</div>
            <div class="mk-pie"></div>
          </div>
        </div>
        <div class="mk-pie"></div>
      </div>
    </div>
    <div class="mk-pie" data-nodo="pausa" title="${esc(t.pausa)}"></div>
  </div>
</div>`;
}

// ---------------------------------------------------------------------------
// Python de MakeCode y JavaScript de MakeCode
const S = (s) => `maqueenPlusV2.read_line_sensor_state(maqueenPlusV2.MyEnumLineSensor.SENSOR_${s})`;
const M = (m, v) => `maqueenPlusV2.control_motor(maqueenPlusV2.MyEnumMotor.${m}, maqueenPlusV2.MyEnumDir.FORWARD, ${v})`;

export const PYTHON = [
  ['maqueenPlusV2.i2c_init()', ['init', 'inicio']],
  ['', []],
  ['def on_forever():', ['forever']],
  [`    if ${S('M')} == 1:`, ['if1', 'c1M']],
  [`        ${M('ALL_MOTOR', 100)}`, ['m1']],
  ['    else:', ['else1']],
  [`        if ${S('L1')} == 0 and ${S('R1')} == 1:`, ['if2', 'c2L1', 'c2R1']],
  [`            ${M('LEFT_MOTOR', 160)}`, ['m2']],
  [`            ${M('RIGHT_MOTOR', 30)}`, ['m3']],
  [`        if ${S('L1')} == 1 and ${S('R1')} == 0:`, ['if3', 'c3L1', 'c3R1']],
  [`            ${M('RIGHT_MOTOR', 160)}`, ['m4']],
  [`            ${M('LEFT_MOTOR', 30)}`, ['m5']],
  ['basic.forever(on_forever)', ['pausa']],
];

const JS_S = (s) => `maqueenPlusV2.readLineSensorState(maqueenPlusV2.MyEnumLineSensor.Sensor${s})`;
const JS_M = (m, v) => `maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.${m}, maqueenPlusV2.MyEnumDir.Forward, ${v})`;
export const JAVASCRIPT = `maqueenPlusV2.I2CInit()
basic.forever(function () {
    if (${JS_S('M')} == 1) {
        ${JS_M('AllMotor', 100)}
    } else {
        if (${JS_S('L1')} == 0 && ${JS_S('R1')} == 1) {
            ${JS_M('LeftMotor', 160)}
            ${JS_M('RightMotor', 30)}
        }
        if (${JS_S('L1')} == 1 && ${JS_S('R1')} == 0) {
            ${JS_M('RightMotor', 160)}
            ${JS_M('LeftMotor', 30)}
        }
    }
})
`;

export const PYTHON_TEXTO = PYTHON.map(([l]) => l).join('\n') + '\n';

function colorear(linea) {
  return esc(linea)
    .replace(/\b(def|if|else|and)\b/g, '<span class="k">$1</span>')
    .replace(/\b(\d+)\b(?![^<]*>)/g, '<span class="n">$1</span>');
}

function pythonHTML() {
  return PYTHON.map(([l, nodos], i) => `<span class="ln" data-n="${i + 1}" data-nodos="${nodos.join(' ')}">${colorear(l) || ' '}</span>`).join('');
}

// ---------------------------------------------------------------------------
export function montarPrograma({ bloques, python, idioma = 'es' }) {
  let lang = idioma;
  const pintar = () => {
    bloques.innerHTML = bloquesHTML(lang);
  };
  pintar();
  python.innerHTML = pythonHTML();

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
      const cabeza = bloques.querySelector(`[data-nodo="${id}"]`);
      if (cabeza) {
        const b = document.createElement('span');
        b.className = 'mk-insignia' + (valor ? '' : ' no');
        b.textContent = lang === 'es' ? (valor ? 'sí' : 'no') : valor ? 'true' : 'false';
        cabeza.appendChild(b);
      }
    }
    python.querySelectorAll('.ln').forEach((el) => {
      const ns = el.dataset.nodos ? el.dataset.nodos.split(' ') : [];
      const v = ns.some((n) => vivo.has(n));
      el.classList.toggle('vivo', v);
      el.classList.toggle('camino', !v && ns.some((n) => cam.has(n)));
    });
  }

  function idiomaBloques(nuevo) {
    lang = nuevo;
    pintar();
    resaltar(ultimo);
  }

  return { resaltar, idiomaBloques };
}
