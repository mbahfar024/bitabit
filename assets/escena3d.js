// Bit a bit · Escena 3D del siguelíneas (Maqueen Plus V2 simplificado sobre la pista)
// Usa three.js. Coordenadas: el motor trabaja en el suelo (x, y) en mm; aquí
// x → X, y → -Z y la altura es Y.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';
import { APROX, MESA, BRILLOS, SALIDA_S, velocidadRueda, DOC } from './engine.js';
import { construirMaqueen, ponerTransparencia } from './lab/maqueen-modelo.js';

const LAT = { L2: 2, L1: 1, M: 0, R1: -1, R2: -2 };
const PRIORIDAD = { microbit: 8, chip: 7, motorI: 6, motorD: 6, bateria: 5, apoyo: 4, ultrasonidos: 4, tecla: 2, faros: 2, rgb: 2, zumbador: 2, ir: 2, interruptor: 1, encendido: 1 };

export const PIEZAS = {
  microbit: {
    nombre: 'micro:bit',
    texto:
      'El cerebro. Ejecuta el programa y, por el bus I2C, pide al chip del Maqueen el estado de los sensores y le manda las órdenes para los motores.',
    uso: 'Se usa: ejecuta el programa.',
  },
  chip: {
    nombre: 'Chip del Maqueen',
    texto:
      'El microcontrolador propio del robot (dirección I2C 0x10). Lee los cinco sensores, resume su estado en un byte y mueve los motores a la velocidad que le pide la micro:bit.',
    uso: 'Se usa: la micro:bit le pregunta en cada vuelta del bucle.',
  },
  sensor: {
    nombre: 'Sensor de línea',
    texto:
      'Emite luz infrarroja (invisible) hacia el suelo y mide cuánta rebota. El blanco la devuelve y la cinta negra casi no: con poca luz de vuelta, el sensor marca 1.',
  },
  motorI: {
    nombre: 'Motor izquierdo',
    texto: 'Motor N20 con reductora metálica. El chip lo hace girar más o menos deprisa según la orden, de 0 a 255.',
    uso: 'Se usa: recibe 100, 160 o 30 según la decisión.',
  },
  motorD: {
    nombre: 'Motor derecho',
    texto: 'Motor N20 con reductora metálica. El chip lo hace girar más o menos deprisa según la orden, de 0 a 255.',
    uso: 'Se usa: recibe 100, 160 o 30 según la decisión.',
  },
  apoyo: {
    nombre: 'Rueda de apoyo',
    texto: 'Sostiene la parte delantera del robot. No tiene motor: el robot gira porque una rueda va más rápida que la otra.',
    uso: 'Siempre en uso, sin programa.',
  },
  bateria: {
    nombre: 'Pilas AA',
    texto:
      'Cuatro pilas AA en el portapilas del piso de arriba: alcalinas de 1,5 V o recargables NiMH de 1,2 V. Esta versión del robot no tiene indicador de carga: con las pilas gastadas, los motores van más despacio.',
    uso: 'En la simulación la carga la controlas con «Pilas», en «Estropéalo a propósito».',
  },
  encendido: {
    nombre: 'Interruptor de encendido',
    texto: 'El interruptor POWER, en el lado derecho, junto al ultrasonidos. Al lado está el conector del cable de las pilas.',
    uso: 'Enciéndelo con la micro:bit ya metida en su ranura.',
  },
  ultrasonidos: {
    nombre: 'Ultrasonidos SR04',
    texto: 'Mide distancias con un eco de sonido que no oímos.',
    uso: 'No se usa en este laboratorio.',
  },
  faros: {
    nombre: 'Faros LED',
    texto: 'Dos luces delanteras que el programa puede encender y apagar.',
    uso: 'No se usan en este laboratorio.',
  },
  rgb: {
    nombre: 'LED RGB de los bajos',
    texto: 'Cuatro LED de colores debajo del robot.',
    uso: 'No se usan en este laboratorio.',
  },
  zumbador: {
    nombre: 'Zumbador',
    texto: 'Suena con la música de la micro:bit, que sale por P0. Con su interruptor se apaga para dejar libre P0.',
    uso: 'No se usa en este laboratorio.',
  },
  interruptor: {
    nombre: 'Interruptor del zumbador',
    texto: 'Desconecta el zumbador de P0. DFRobot lo recomienda si usas P0 para otra cosa o si la micro:bit V2 ya suena por su altavoz.',
    uso: 'No se usa en este laboratorio.',
  },
  ir: {
    nombre: 'Receptor de infrarrojos',
    texto: 'Recibe las órdenes de un mando a distancia de infrarrojos por P16.',
    uso: 'No se usa en este laboratorio.',
  },
  tecla: {
    nombre: 'Tecla de calibración',
    texto:
      'Sirve para calibrar los sensores de línea con el suelo y la luz que tengáis. El procedimiento está en la guía de inicio de DFRobot.',
    uso: 'Se usa en el robot real, no en la simulación.',
  },
};

function leerColor(nombre, defecto) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
  return v || defecto;
}

function texturaSuelo(pista, { brillos = false, rugosidad = false } = {}) {
  const W = 2048;
  const k = W / MESA.ancho;
  const H = Math.round(MESA.alto * k);
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const g = cv.getContext('2d');
  const px = (x) => (x + MESA.ancho / 2) * k;
  const py = (y) => (MESA.alto / 2 - y) * k;
  g.fillStyle = rugosidad ? '#ececec' : '#f6f6f1';
  g.fillRect(0, 0, W, H);
  if (!rugosidad) {
    for (let x = -650; x <= 650; x += 50) {
      g.strokeStyle = x % 100 === 0 ? 'rgba(30,50,40,0.085)' : 'rgba(30,50,40,0.04)';
      g.lineWidth = 1.4;
      g.beginPath();
      g.moveTo(px(x), 0);
      g.lineTo(px(x), H);
      g.stroke();
    }
    for (let y = -450; y <= 450; y += 50) {
      g.strokeStyle = y % 100 === 0 ? 'rgba(30,50,40,0.085)' : 'rgba(30,50,40,0.04)';
      g.lineWidth = 1.4;
      g.beginPath();
      g.moveTo(0, py(y));
      g.lineTo(W, py(y));
      g.stroke();
    }
  }
  const trazar = () => {
    g.beginPath();
    pista.pts.forEach((p, i) => (i ? g.lineTo(px(p.x), py(p.y)) : g.moveTo(px(p.x), py(p.y))));
    g.closePath();
  };
  g.lineJoin = 'round';
  g.lineCap = 'round';
  g.lineWidth = pista.ancho * k;
  g.strokeStyle = rugosidad ? '#b4b4b4' : '#141516';
  trazar();
  g.stroke();
  if (brillos) {
    for (const b of BRILLOS) {
      g.save();
      g.beginPath();
      g.arc(px(b.x), py(b.y), b.r * k, 0, Math.PI * 2);
      g.clip();
      if (rugosidad) {
        g.strokeStyle = '#1c1c1c';
        g.lineWidth = pista.ancho * k;
        trazar();
        g.stroke();
      } else {
        g.lineWidth = pista.ancho * k * 0.42;
        g.strokeStyle = 'rgba(214,226,235,0.85)';
        g.setLineDash([9 * k, 7 * k]);
        trazar();
        g.stroke();
        g.setLineDash([]);
        const grad = g.createRadialGradient(px(b.x), py(b.y), 0, px(b.x), py(b.y), b.r * k);
        grad.addColorStop(0, 'rgba(255,255,255,0.35)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = grad;
        g.fillRect(px(b.x) - b.r * k, py(b.y) - b.r * k, 2 * b.r * k, 2 * b.r * k);
      }
      g.restore();
    }
  }
  if (!rugosidad) {
    // Marca de salida (al lado de la línea, no encima)
    const s = pista.en(SALIDA_S);
    const nx = -Math.sin(s.rumbo);
    const ny = Math.cos(s.rumbo);
    g.strokeStyle = '#d92f2a';
    g.lineWidth = 3 * k;
    g.lineCap = 'butt';
    for (const sg of [1, -1]) {
      g.beginPath();
      g.moveTo(px(s.x + nx * 22 * sg), py(s.y + ny * 22 * sg));
      g.lineTo(px(s.x + nx * 46 * sg), py(s.y + ny * 46 * sg));
      g.stroke();
    }
    g.fillStyle = '#b3271f';
    g.font = `${Math.round(15 * k)}px system-ui, sans-serif`;
    g.fillText('SALIDA', px(s.x + nx * 52) + 2, py(s.y + ny * 52) + 5 * k);
    // Escala de 10 cm
    const x0 = -MESA.ancho / 2 + 40;
    const y0 = -MESA.alto / 2 + 36;
    g.strokeStyle = '#3a403c';
    g.lineWidth = 2.2 * k;
    g.beginPath();
    g.moveTo(px(x0), py(y0));
    g.lineTo(px(x0 + 100), py(y0));
    g.moveTo(px(x0), py(y0 - 6));
    g.lineTo(px(x0), py(y0 + 6));
    g.moveTo(px(x0 + 100), py(y0 - 6));
    g.lineTo(px(x0 + 100), py(y0 + 6));
    g.stroke();
    g.fillStyle = '#3a403c';
    g.font = `${Math.round(13 * k)}px system-ui, sans-serif`;
    g.fillText('10 cm', px(x0 + 112), py(y0) + 4.5 * k);
  }
  return cv;
}

// El suelo visto desde abajo: cristal casi transparente con la cinta pegada encima
function texturaDebajo(pista, { brillos = false } = {}) {
  const W = 2048;
  const k = W / MESA.ancho;
  const H = Math.round(MESA.alto * k);
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const g = cv.getContext('2d');
  const px = (x) => (x + MESA.ancho / 2) * k;
  const py = (y) => (MESA.alto / 2 - y) * k;
  g.fillStyle = 'rgba(186, 212, 220, 0.18)';
  g.fillRect(0, 0, W, H);
  for (let x = -600; x <= 600; x += 100) {
    g.strokeStyle = 'rgba(40, 60, 55, 0.16)';
    g.lineWidth = 1.6;
    g.beginPath();
    g.moveTo(px(x), 0);
    g.lineTo(px(x), H);
    g.stroke();
  }
  for (let y = -400; y <= 400; y += 100) {
    g.beginPath();
    g.moveTo(0, py(y));
    g.lineTo(W, py(y));
    g.stroke();
  }
  const trazar = () => {
    g.beginPath();
    pista.pts.forEach((p, i) => (i ? g.lineTo(px(p.x), py(p.y)) : g.moveTo(px(p.x), py(p.y))));
    g.closePath();
  };
  g.lineJoin = 'round';
  g.lineCap = 'round';
  g.lineWidth = pista.ancho * k;
  g.strokeStyle = '#111213';
  trazar();
  g.stroke();
  if (brillos) {
    for (const b of BRILLOS) {
      g.save();
      g.beginPath();
      g.arc(px(b.x), py(b.y), b.r * k, 0, Math.PI * 2);
      g.clip();
      g.lineWidth = pista.ancho * k * 0.42;
      g.strokeStyle = 'rgba(214,226,235,0.85)';
      g.setLineDash([9 * k, 7 * k]);
      trazar();
      g.stroke();
      g.restore();
    }
  }
  const s = pista.en(SALIDA_S);
  const nx = -Math.sin(s.rumbo);
  const ny = Math.cos(s.rumbo);
  g.strokeStyle = '#d92f2a';
  g.lineWidth = 3 * k;
  g.lineCap = 'butt';
  for (const sg of [1, -1]) {
    g.beginPath();
    g.moveTo(px(s.x + nx * 22 * sg), py(s.y + ny * 22 * sg));
    g.lineTo(px(s.x + nx * 46 * sg), py(s.y + ny * 46 * sg));
    g.stroke();
  }
  return cv;
}

function caja(w, h, d, mat) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
}

export function crearEscena3D({ canvas, contenedor, capaEtiquetas, sim, pista, alPulsarPieza }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' });
  if (!renderer.getContext()) throw new Error('WebGL no disponible');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const fondo = new THREE.Color(leerColor('--escena-fondo', '#e3e6df'));
  scene.background = fondo;
  const camera = new THREE.PerspectiveCamera(38, 1, 4, 30000);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa097, 1.55));
  const sol = new THREE.DirectionalLight(0xffffff, 2.1);
  sol.position.set(-500, 1400, 700);
  scene.add(sol);
  const techo = new THREE.DirectionalLight(0xffffff, 0.9);
  techo.position.set(300, 900, -400);
  scene.add(techo);
  // Luz desde abajo: solo se enciende cuando la cámara mira por debajo del suelo
  const luzDebajo = new THREE.DirectionalLight(0xffffff, 0);
  luzDebajo.position.set(260, -900, 380);
  scene.add(luzDebajo);

  // ---------- Suelo ----------
  const texNormal = new THREE.CanvasTexture(texturaSuelo(pista));
  texNormal.colorSpace = THREE.SRGBColorSpace;
  texNormal.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  let texBrillo = null;
  let rugBrillo = null;
  const rugNormal = new THREE.CanvasTexture(texturaSuelo(pista, { rugosidad: true }));
  const sueloMat = new THREE.MeshStandardMaterial({
    map: texNormal,
    roughnessMap: rugNormal,
    roughness: 1,
    metalness: 0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
  });
  const suelo = new THREE.Mesh(new THREE.PlaneGeometry(MESA.ancho, MESA.alto), sueloMat);
  suelo.rotation.x = -Math.PI / 2;
  scene.add(suelo);
  // Desde abajo, el mismo suelo con otro material: cristal y cinta, sin luces
  const texDebajo = new THREE.CanvasTexture(texturaDebajo(pista));
  texDebajo.colorSpace = THREE.SRGBColorSpace;
  texDebajo.anisotropy = texNormal.anisotropy;
  let texDebajoBrillo = null;
  const sueloMatDebajo = new THREE.MeshBasicMaterial({ map: texDebajo, transparent: true, side: THREE.DoubleSide, depthWrite: false });
  const borde = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(MESA.ancho, 0.1, MESA.alto)),
    new THREE.LineBasicMaterial({ color: 0x8b928c })
  );
  scene.add(borde);
  // Suelo del aula alrededor de la mesa, para que no se vea el vacío
  const aulaMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(leerColor('--escena-fondo', '#e3e6df')).multiplyScalar(0.94), roughness: 1 });
  const aula = new THREE.Mesh(new THREE.PlaneGeometry(14000, 14000), aulaMat);
  aula.rotation.x = -Math.PI / 2;
  aula.position.y = -1.5;
  scene.add(aula);

  // ---------- Robot (modelo común: lab/maqueen-modelo.js) ----------
  const piezas = []; // mallas que se pueden elegir con el ratón
  const anclas = []; // rótulos
  function registrar(id, obj, { ancla, donde = 'arriba', clase = '', texto } = {}) {
    obj.traverse((o) => {
      if (o.isMesh) {
        o.userData.pieza = id;
        piezas.push(o);
      }
    });
    if (ancla) {
      const a = new THREE.Object3D();
      a.position.copy(ancla);
      anclas.push({ id, a, donde, clase, texto: texto || PIEZAS[id.startsWith('s:') ? 'sensor' : id]?.nombre || id });
    }
  }
  const M = construirMaqueen(THREE, { registrar });
  const robot = M.robot;
  scene.add(robot);
  for (const a of anclas) robot.add(a.a);
  const { mats, sensores, ruedas, leds, rutaBus } = M;

  // Una sola etiqueta para la fila de sensores
  const anclaSensores = new THREE.Object3D();
  anclaSensores.position.set(APROX.sensorAdelante + 14, 4, 0);
  robot.add(anclaSensores);
  const barraSens = document.createElement('button');
  barraSens.type = 'button';
  barraSens.className = 'etq barra-sensores';
  barraSens.setAttribute('aria-label', 'Sensores de línea');
  barraSens.innerHTML = DOC.sensores.map((n) => `<b data-s="${n}"><small>${n}</small><span>0</span></b>`).join('');
  barraSens.addEventListener('click', (e) => {
    e.stopPropagation();
    alPulsarPieza?.('s:M');
  });
  // Manchas en el suelo bajo cada sensor (fuera del robot, en coordenadas del mundo)
  const manchas = {};
  for (const nombre of DOC.sensores) {
    const m = new THREE.Mesh(
      new THREE.RingGeometry(2.4, 4.6, 24),
      new THREE.MeshBasicMaterial({ color: 0xff2d2d, transparent: true, opacity: 0.0, depthWrite: false, side: THREE.DoubleSide })
    );
    m.rotation.x = -Math.PI / 2;
    scene.add(m);
    manchas[nombre] = m;
  }

  // Sombra de contacto
  const sombraCv = document.createElement('canvas');
  sombraCv.width = sombraCv.height = 128;
  const sg = sombraCv.getContext('2d');
  const rg = sg.createRadialGradient(64, 64, 8, 64, 64, 64);
  rg.addColorStop(0, 'rgba(0,0,0,0.34)');
  rg.addColorStop(1, 'rgba(0,0,0,0)');
  sg.fillStyle = rg;
  sg.fillRect(0, 0, 128, 128);
  const sombra = new THREE.Mesh(
    new THREE.PlaneGeometry(170, 130),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sombraCv), transparent: true, depthWrite: false })
  );
  sombra.rotation.x = -Math.PI / 2;
  sombra.position.set(6, 0.25, 0);
  robot.add(sombra);

  // Flechas de velocidad de las ruedas
  const colorPlaca = new THREE.Color(leerColor('--placa', '#0d6654'));
  function flecha() {
    const g = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({ color: colorPlaca });
    const asta = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 1, 10), mat);
    asta.rotation.z = -Math.PI / 2;
    asta.position.x = 0.5;
    const punta = new THREE.Mesh(new THREE.ConeGeometry(5, 11, 14), mat);
    punta.rotation.z = -Math.PI / 2;
    g.add(asta, punta);
    return { g, asta, punta, mat };
  }
  const flechas = { I: flecha(), D: flecha() };
  flechas.I.g.position.set(0, 46, -(APROX.distanciaRuedas / 2 + 12));
  flechas.D.g.position.set(0, 46, APROX.distanciaRuedas / 2 + 12);
  robot.add(flechas.I.g, flechas.D.g);

  // Rastro y predicción
  const MAXR = 400;
  const rastroGeo = new THREE.BufferGeometry();
  rastroGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAXR * 3), 3));
  const rastro = new THREE.Line(rastroGeo, new THREE.LineBasicMaterial({ color: 0xd92f2a, transparent: true, opacity: 0.55 }));
  scene.add(rastro);
  const predGeo = new THREE.BufferGeometry();
  predGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(31 * 3), 3));
  const pred = new THREE.Line(predGeo, new THREE.LineDashedMaterial({ color: colorPlaca, dashSize: 6, gapSize: 5 }));
  scene.add(pred);

  // Pulsos del bus I2C (modo paso a paso)
  const pulsos = [];
  const pulsoMat = new THREE.MeshBasicMaterial({ color: 0xffe066 });
  for (let i = 0; i < 6; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(2.6, 12, 8), pulsoMat);
    p.visible = false;
    robot.add(p);
    pulsos.push(p);
  }
  let animaciones = [];

  // ---------- Rótulos ----------
  // Todas las piezas llevan su rótulo a la vez: se ordenan en dos columnas, a los
  // lados del robot, y una línea guía lleva de cada rótulo a su pieza.
  const NS = 'http://www.w3.org/2000/svg';
  const svgGuias = document.createElementNS(NS, 'svg');
  svgGuias.setAttribute('class', 'guias');
  svgGuias.setAttribute('aria-hidden', 'true');
  capaEtiquetas.appendChild(svgGuias);
  function nuevaGuia() {
    const g = document.createElementNS(NS, 'g');
    const halo = document.createElementNS(NS, 'polyline');
    halo.setAttribute('class', 'halo');
    const linea = document.createElementNS(NS, 'polyline');
    linea.setAttribute('class', 'linea');
    const punto = document.createElementNS(NS, 'circle');
    punto.setAttribute('r', '2.6');
    g.append(halo, linea, punto);
    svgGuias.appendChild(g);
    let ultimo = '';
    let oculta = false;
    return {
      poner(puntos) {
        const p = puntos.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
        if (p !== ultimo) {
          halo.setAttribute('points', p);
          linea.setAttribute('points', p);
          const [x, y] = puntos[puntos.length - 1];
          punto.setAttribute('cx', x.toFixed(1));
          punto.setAttribute('cy', y.toFixed(1));
          ultimo = p;
        }
        if (oculta) {
          g.style.display = '';
          oculta = false;
        }
      },
      ocultar() {
        if (!oculta) {
          g.style.display = 'none';
          oculta = true;
        }
      },
    };
  }

  const rotulos = anclas.map((a) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'etq ' + a.clase;
    b.dataset.pieza = a.id;
    const nombre = document.createElement('span');
    nombre.className = 'etq-nombre';
    nombre.textContent = a.texto;
    b.appendChild(nombre);
    let valor = null;
    if (a.id === 'motorI' || a.id === 'motorD') {
      // El rótulo del motor lleva también su orden y la velocidad de la rueda
      valor = document.createElement('span');
      valor.className = 'etq-valor';
      b.appendChild(valor);
    }
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      alPulsarPieza?.(a.id);
    });
    b.hidden = true;
    capaEtiquetas.appendChild(b);
    return { ...a, el: b, valor, guia: nuevaGuia(), prio: PRIORIDAD[a.id] || 3, w: 0, h: 0, medir: true };
  });
  barraSens.hidden = true;
  capaEtiquetas.appendChild(barraSens);
  const celdasSens = Object.fromEntries([...barraSens.querySelectorAll('b')].map((b) => [b.dataset.s, b]));
  const guiasSens = Object.fromEntries(DOC.sensores.map((n) => [n, nuevaGuia()]));
  const barra = { w: 0, h: 0, celdas: null, medir: true };
  // Esquinas de una caja que envuelve el robot (para saber qué ocupa en pantalla)
  const ESQUINAS = M.esquinas;

  // ---------- Cámara orbital ----------
  const cam = { r: 470, az: 0, el: 0.6, objetivo: new THREE.Vector3(), seguir: true, pista: false };
  const opciones = { transparente: true, nombres: true };
  function presetVista(nombre) {
    const r = sim.robot;
    const atras = -r.rumbo + Math.PI; // acimut detrás del robot
    cam.pista = false;
    // En un lienzo estrecho (móvil) la cámara se aleja un poco para que quepa el robot
    const rc = contenedor.getBoundingClientRect();
    const aspecto = rc.width > 0 && rc.height > 0 ? rc.width / rc.height : camera.aspect;
    const k = Math.min(1.8, Math.max(1, 1.45 / aspecto));
    if (nombre === 'lado') Object.assign(cam, { r: 330 * k, el: 0.6, az: atras + 0.85, seguir: true });
    if (nombre === 'arriba') Object.assign(cam, { r: 560 * k, el: 1.45, az: atras + 0.0001, seguir: true });
    if (nombre === 'abajo') Object.assign(cam, { r: 360 * k, el: -0.95, az: atras + 0.3, seguir: true });
    if (nombre === 'pista') {
      // La distancia justa para que quepa toda la mesa, según la forma del lienzo
      const el = 1.15;
      const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const rAlto = ((MESA.alto / 2) * Math.sin(el) + 50) / t;
      const rAncho = (MESA.ancho / 2 + 50) / (t * Math.max(0.5, aspecto));
      Object.assign(cam, { r: Math.min(3200, Math.max(rAlto, rAncho) * 1.06), el, az: Math.PI / 2, seguir: false, pista: true });
    }
    if (cam.pista) cam.objetivo.set(0, 0, 0);
  }
  presetVista('abajo');

  let arrastre = null;
  const punteros = new Map();
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    arrastre = { x: e.clientX, y: e.clientY, movido: 0 };
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!punteros.has(e.pointerId)) return;
    const prev = punteros.get(e.pointerId);
    punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (punteros.size === 2) {
      const [a, b] = [...punteros.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (arrastre?.dist) cam.r = Math.min(3200, Math.max(160, cam.r * (arrastre.dist / dist)));
      arrastre = { ...arrastre, dist, movido: 99 };
      return;
    }
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    if (arrastre) arrastre.movido += Math.abs(dx) + Math.abs(dy);
    cam.az += dx * 0.008;
    cam.el = Math.max(-1.45, Math.min(1.5, cam.el + dy * 0.008));
  });
  const soltar = (e) => {
    punteros.delete(e.pointerId);
    if (punteros.size === 0) {
      if (arrastre && arrastre.movido < 4 && e.type === 'pointerup') elegir(e);
      arrastre = null;
    }
  };
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', soltar);
  let activa = false;
  canvas.addEventListener('pointerenter', () => {});
  canvas.addEventListener('pointerleave', () => (activa = false));
  canvas.addEventListener('pointerdown', () => (activa = true));
  canvas.addEventListener(
    'wheel',
    (e) => {
      if (!activa && !e.ctrlKey) return; // deja que la página haga scroll
      e.preventDefault();
      cam.r = Math.min(3200, Math.max(160, cam.r * Math.exp(e.deltaY * 0.0012)));
    },
    { passive: false }
  );
  function zoom(f) {
    cam.r = Math.min(3200, Math.max(160, cam.r * f));
  }

  const ray = new THREE.Raycaster();
  function elegir(e) {
    const rect = canvas.getBoundingClientRect();
    const v = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(v, camera);
    const hits = ray.intersectObjects(piezas, false);
    const h = hits.find((x) => x.object.visible);
    if (h) alPulsarPieza?.(h.object.userData.pieza);
  }

  // ---------- Tamaño ----------
  let ancho = 1;
  let alto = 1;
  // Franja de arriba que tapa la barra de vistas cuando flota sobre la escena
  let margenSup = 8;
  const barraVistas = contenedor.parentElement?.querySelector('.escena-barra');
  const ro = new ResizeObserver(() => {
    const r = contenedor.getBoundingClientRect();
    ancho = Math.max(1, r.width);
    alto = Math.max(1, r.height);
    renderer.setSize(ancho, alto, false);
    camera.aspect = ancho / alto;
    camera.updateProjectionMatrix();
    margenSup =
      barraVistas && !barraVistas.hidden && getComputedStyle(barraVistas).position === 'absolute'
        ? barraVistas.offsetTop + barraVistas.offsetHeight + 8
        : 8;
    for (const it of rotulos) it.medir = true;
    barra.medir = true;
  });
  ro.observe(contenedor);

  function actualizarTema() {
    fondo.set(leerColor('--escena-fondo', '#e3e6df'));
    aulaMat.color.set(leerColor('--escena-fondo', '#e3e6df')).multiplyScalar(0.94);
    colorPlaca.set(leerColor('--placa', '#0d6654'));
    flechas.I.mat.color.copy(colorPlaca);
    flechas.D.mat.color.copy(colorPlaca);
    pred.material.color.copy(colorPlaca);
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', actualizarTema);
  new MutationObserver(actualizarTema).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ---------- Estado a dibujar ----------
  let reflejosPintados = false;
  const tmp = new THREE.Vector3();
  const tmp2 = new THREE.Vector3();

  function ponerReflejos(on) {
    if (on === reflejosPintados) return;
    reflejosPintados = on;
    if (on && !texBrillo) {
      texBrillo = new THREE.CanvasTexture(texturaSuelo(pista, { brillos: true }));
      texBrillo.colorSpace = THREE.SRGBColorSpace;
      texBrillo.anisotropy = texNormal.anisotropy;
      rugBrillo = new THREE.CanvasTexture(texturaSuelo(pista, { brillos: true, rugosidad: true }));
    }
    sueloMat.map = on ? texBrillo : texNormal;
    sueloMat.roughnessMap = on ? rugBrillo : rugNormal;
    sueloMat.needsUpdate = true;
    if (on && !texDebajoBrillo) {
      texDebajoBrillo = new THREE.CanvasTexture(texturaDebajo(pista, { brillos: true }));
      texDebajoBrillo.colorSpace = THREE.SRGBColorSpace;
      texDebajoBrillo.anisotropy = texNormal.anisotropy;
    }
    sueloMatDebajo.map = on ? texDebajoBrillo : texDebajo;
    sueloMatDebajo.needsUpdate = true;
  }

  function animarFase(fase, eventos) {
    const t0 = performance.now();
    animaciones = [];
    if (fase === 'leer') animaciones.push({ tipo: 'haces', t0, dur: 900 });
    let k = 0;
    for (const e of eventos || []) {
      if (e.tipo === 'leer') animaciones.push({ tipo: 'bus', ida: true, vuelta: true, t0: t0 + k++ * 420, dur: 520 });
      if (e.tipo === 'motor') animaciones.push({ tipo: 'bus', ida: true, vuelta: false, motor: e.lado, t0: t0 + k++ * 420, dur: 520 });
    }
  }

  function dibujar() {
    const r = sim.robot;
    const aj = sim.ajustes;
    ponerReflejos(aj.reflejos);

    robot.position.set(r.x, 0, -r.y);
    robot.rotation.y = r.rumbo;
    ruedas.I.rueda.rotation.z = -r.giroI;
    ruedas.D.rueda.rotation.z = -r.giroD;

    // Transparencia
    const tr = opciones.transparente;
    ponerTransparencia(M, tr);

    // Suelo de cristal cuando la cámara está debajo (se decide con la posición
    // de la cámara del cuadro anterior; la diferencia no se nota)
    const debajo = camera.position.y < 0;
    aula.visible = !debajo;
    suelo.material = debajo ? sueloMatDebajo : sueloMat;
    suelo.renderOrder = debajo ? 10 : 0; // el cristal se pinta después del robot transparente
    luzDebajo.intensity = debajo ? 1.7 : 0;

    // Sensores, haces y manchas
    const lect = sim.leerTodos();
    const ahora = performance.now();
    const animHaz = animaciones.find((a) => a.tipo === 'haces');
    let fHaz = 1;
    if (animHaz) fHaz = Math.min(1, (ahora - animHaz.t0) / animHaz.dur);
    for (const n of DOC.sensores) {
      const s = sensores[n];
      const l = lect[n];
      const tapado = aj.tapado === n;
      s.papel.visible = tapado;
      const v = l.v === 1;
      // Haz: brillante si rebota (blanco o papel), tenue si la cinta negra lo absorbe
      const pulso = animHaz ? 0.55 + 0.45 * Math.sin(fHaz * Math.PI * 3) : 1;
      s.haz.material.opacity = (v ? 0.12 : 0.55) * pulso;
      s.haz.scale.y = tapado ? 0.3 : 1;
      s.em.material.emissive.setHex(0x3355ff);
      s.em.material.emissiveIntensity = 0.6;
      const p = sim.posSensor(n);
      const m = manchas[n];
      // Desde abajo, la mancha va bajo el cristal para que se vea sobre la cinta
      m.position.set(p.x, debajo ? -0.4 : 0.5, -p.y);
      m.renderOrder = debajo ? 11 : 0;
      m.material.color.setHex(v ? 0xff2d2d : 0xffffff);
      m.material.opacity = v ? 0.95 : 0.0;
    }

    // micro:bit: pantalla
    const pat = sim.pantalla;
    for (let f = 0; f < 5; f++)
      for (let c = 0; c < 5; c++) leds[f * 5 + c].material = pat && pat[f][c] ? mats.ledOn : mats.ledOff;

    // Flechas de velocidad
    const esc = 0.16;
    for (const [lado, v] of [
      ['I', r.vI],
      ['D', r.vD],
    ]) {
      const f = flechas[lado];
      const largo = Math.max(0.001, Math.abs(v) * esc);
      f.asta.scale.y = largo;
      f.asta.position.x = (largo / 2) * Math.sign(v || 1);
      f.punta.position.x = (largo + 5) * Math.sign(v || 1);
      f.punta.rotation.z = v < 0 ? Math.PI / 2 : -Math.PI / 2;
      f.g.visible = Math.abs(v) > 1;
    }

    // Rastro
    const pos = rastroGeo.attributes.position.array;
    const R = sim.rastro;
    const n = Math.min(MAXR, R.length);
    for (let i = 0; i < n; i++) {
      const q = R[R.length - n + i];
      pos[i * 3] = q.x;
      pos[i * 3 + 1] = 0.7;
      pos[i * 3 + 2] = -q.y;
    }
    rastroGeo.setDrawRange(0, n);
    rastroGeo.attributes.position.needsUpdate = true;

    // Predicción: 0,6 s con las velocidades actuales
    const pp = predGeo.attributes.position.array;
    let x = r.x, y = r.y, th = r.rumbo;
    const vv = (r.vI + r.vD) / 2;
    const w = (r.vD - r.vI) / APROX.distanciaRuedas;
    for (let i = 0; i <= 30; i++) {
      pp[i * 3] = x;
      pp[i * 3 + 1] = 0.9;
      pp[i * 3 + 2] = -y;
      x += vv * Math.cos(th) * 0.02;
      y += vv * Math.sin(th) * 0.02;
      th += w * 0.02;
    }
    predGeo.attributes.position.needsUpdate = true;
    pred.computeLineDistances();
    pred.visible = Math.abs(vv) > 2;

    // Pulsos del bus
    pulsos.forEach((p) => (p.visible = false));
    let ip = 0;
    animaciones = animaciones.filter((a) => a.tipo !== 'bus' || ahora < a.t0 + a.dur + 50 || a.tipo === 'haces');
    for (const a of animaciones) {
      if (a.tipo !== 'bus' || ahora < a.t0 || ip >= pulsos.length) continue;
      const f = Math.min(1, (ahora - a.t0) / a.dur);
      let u = a.vuelta ? (f < 0.5 ? f * 2 : 2 - f * 2) : f;
      rutaBus.getPointAt(Math.max(0, Math.min(1, u)), tmp);
      pulsos[ip].position.copy(tmp);
      pulsos[ip].position.y += 1;
      pulsos[ip].visible = true;
      ip++;
    }
    if (animHaz && fHaz >= 1) animaciones = animaciones.filter((a) => a !== animHaz);

    // Cámara
    if (cam.seguir) {
      tmp2.set(r.x + Math.cos(r.rumbo) * 15, 18, -(r.y + Math.sin(r.rumbo) * 15));
      cam.objetivo.lerp(tmp2, 0.2);
    } else if (cam.pista) cam.objetivo.lerp(tmp2.set(0, 0, 0), 0.2);
    const ce = Math.cos(cam.el);
    camera.position.set(
      cam.objetivo.x + cam.r * ce * Math.cos(cam.az),
      cam.objetivo.y + cam.r * Math.sin(cam.el),
      cam.objetivo.z + cam.r * ce * Math.sin(cam.az)
    );
    camera.up.set(0, 1, 0);
    camera.lookAt(cam.objetivo);
    renderer.render(scene, camera);

    colocarRotulos({ debajo, tr, lect, r });
    return { debajo };
  }

  // ---------- Colocación de los rótulos ----------
  const MARGEN = 6;
  const SEP = 16; // hueco entre el robot y las columnas de rótulos
  const GAP = 5; // hueco entre dos rótulos de la misma columna
  const enPantalla = (v) => ({ x: ((v.x + 1) / 2) * ancho, y: ((1 - v.y) / 2) * alto, z: v.z });

  function colocarColumna(lista, lado, x0, x1, sup, inf) {
    if (!lista.length) return;
    lista.sort((a, b) => a.ay - b.ay);
    // Si no caben todos, se quitan los de menos prioridad
    let total = lista.reduce((s, it) => s + it.h + GAP, -GAP);
    while (total > inf - sup && lista.length > 1) {
      let peor = 0;
      lista.forEach((it, i) => {
        if (it.prio < lista[peor].prio) peor = i;
      });
      total -= lista[peor].h + GAP;
      lista[peor].oculto = true;
      lista.splice(peor, 1);
    }
    // Cada rótulo a la altura de su pieza; si se pisan, se reparten
    let y = sup;
    for (const it of lista) {
      it.top = Math.max(it.ay - it.h / 2, y);
      y = it.top + it.h + GAP;
    }
    let lim = inf;
    for (let i = lista.length - 1; i >= 0; i--) {
      const it = lista[i];
      if (it.top + it.h > lim) it.top = lim - it.h;
      lim = it.top - GAP;
    }
    for (const it of lista) {
      it.lado = lado;
      it.left = lado === 'izq' ? Math.max(MARGEN, x0 - SEP - it.w) : Math.min(ancho - MARGEN - it.w, x1 + SEP);
    }
  }

  function colocarRotulos({ debajo, tr, lect, r }) {
    const mostrar = opciones.nombres;
    // Los motores muestran su orden y la velocidad de su rueda
    for (const it of rotulos) {
      if (!it.valor) continue;
      const izq = it.id === 'motorI';
      const t = `${izq ? r.ordenI : r.ordenD} → ${Math.round(Math.abs(izq ? r.vI : r.vD))} mm/s`;
      if (it.valor.textContent !== t) {
        if (it.valor.textContent.length !== t.length) it.medir = true;
        it.valor.textContent = t;
      }
    }
    for (const n of DOC.sensores) {
      const b = celdasSens[n];
      const v = lect[n].v;
      b.classList.toggle('on', v === 1);
      b.classList.toggle('tapado', lect[n].tapado);
      b.classList.toggle('ignorado', n === 'L2' || n === 'R2');
      const sp = b.lastChild;
      if (sp.textContent !== String(v)) sp.textContent = String(v);
    }

    // 1. Qué rótulos se ven y dónde cae su pieza en pantalla
    const vivos = [];
    for (const it of rotulos) {
      let visible = mostrar && !cam.pista;
      if (visible && !tr) {
        if (it.donde === 'abajo' || it.donde === 'dentro') visible = debajo;
        if (it.donde === 'arriba') visible = !debajo;
      }
      if (visible) {
        const p = enPantalla(it.a.getWorldPosition(tmp).project(camera));
        visible = p.z <= 1 && p.x > -30 && p.x < ancho + 30 && p.y > -30 && p.y < alto + 30;
        it.ax = p.x;
        it.ay = p.y;
      }
      if (visible) vivos.push(it);
      else {
        it.el.hidden = true;
        it.guia.ocultar();
      }
    }
    let ps = null;
    let verBarra = mostrar;
    if (verBarra) {
      ps = enPantalla(anclaSensores.getWorldPosition(tmp).project(camera));
      verBarra = ps.z <= 1;
    }
    barraSens.hidden = !verBarra;

    // 2. Medir los que han cambiado (todas las lecturas juntas)
    for (const it of vivos) it.el.hidden = false;
    for (const it of vivos) {
      if (it.medir || !it.w) {
        it.w = it.el.offsetWidth;
        it.h = it.el.offsetHeight;
        it.medir = false;
      }
    }
    if (verBarra && (barra.medir || !barra.w)) {
      barra.w = barraSens.offsetWidth;
      barra.h = barraSens.offsetHeight;
      barra.celdas = Object.fromEntries(DOC.sensores.map((n) => [n, celdasSens[n].offsetLeft + celdasSens[n].offsetWidth / 2]));
      barra.medir = false;
    }

    // 3. Lo que ocupa el robot en pantalla
    let x0 = Infinity;
    let x1 = -Infinity;
    let y0 = Infinity;
    let y1 = -Infinity;
    for (const c of ESQUINAS) {
      const p = enPantalla(robot.localToWorld(tmp.copy(c)).project(camera));
      x0 = Math.min(x0, p.x);
      x1 = Math.max(x1, p.x);
      y0 = Math.min(y0, p.y);
      y1 = Math.max(y1, p.y);
    }
    const sup = margenSup;
    const inf = alto - MARGEN;

    // 4. La fila de sensores: un rótulo con los cinco valores, por encima o por
    //    debajo del robot, con una guía a cada sensor
    if (verBarra) {
      let left = ps.x - barra.w / 2;
      let top;
      let guiaAbajo = true;
      if (cam.pista) top = ps.y - 14 - barra.h;
      else if (ps.y < (y0 + y1) / 2) top = y0 - SEP - barra.h;
      else {
        top = y1 + SEP;
        guiaAbajo = false;
      }
      left = Math.min(Math.max(MARGEN, left), ancho - MARGEN - barra.w);
      top = Math.min(Math.max(sup, top), inf - barra.h);
      barraSens.style.transform = `translate(${left.toFixed(1)}px, ${top.toFixed(1)}px)`;
      for (const n of DOC.sensores) {
        if (cam.pista) {
          guiasSens[n].ocultar();
          continue;
        }
        const p = enPantalla(sensores[n].g.localToWorld(tmp.set(0, -1.5, 0)).project(camera));
        const bx = left + barra.celdas[n];
        guiasSens[n].poner([
          [bx, guiaAbajo ? top + barra.h : top],
          [p.x, p.y],
        ]);
      }
    } else for (const n of DOC.sensores) guiasSens[n].ocultar();

    // 5. Dos columnas, a izquierda y derecha del robot
    const centro = (x0 + x1) / 2;
    const izq = [];
    const der = [];
    for (const it of vivos) (it.ax < centro ? izq : der).push(it);
    while (Math.abs(izq.length - der.length) > 2) {
      const [mas, menos] = izq.length > der.length ? [izq, der] : [der, izq];
      let k = 0;
      mas.forEach((it, i) => {
        if (Math.abs(it.ax - centro) < Math.abs(mas[k].ax - centro)) k = i;
      });
      menos.push(mas.splice(k, 1)[0]);
    }
    colocarColumna(izq, 'izq', x0, x1, sup, inf);
    colocarColumna(der, 'der', x0, x1, sup, inf);
    for (const it of vivos) {
      if (it.oculto) {
        it.oculto = false;
        it.el.hidden = true;
        it.guia.ocultar();
        continue;
      }
      it.el.style.transform = `translate(${it.left.toFixed(1)}px, ${it.top.toFixed(1)}px)`;
      const cy = it.top + it.h / 2;
      const bx = it.lado === 'izq' ? it.left + it.w : it.left;
      const dir = it.lado === 'izq' ? 1 : -1;
      it.guia.poner([
        [bx, cy],
        [bx + dir * 8, cy],
        [it.ax, it.ay],
      ]);
    }
  }

  return {
    dibujar,
    animarFase,
    presetVista,
    zoom,
    opciones,
    cam,
    tipo: '3d',
    destruir() {
      ro.disconnect();
      renderer.dispose();
    },
  };
}
