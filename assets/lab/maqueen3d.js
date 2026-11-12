// Bit a bit · Escena 3D del Maqueen para los laboratorios de la etapa 2 y el proyecto
// La mesa del aula, el robot (modelo común) y lo que cada laboratorio añade
// (linterna, obstáculos, mando…). Lee el estado del modelo en cada cuadro: lo que se
// ve sale de los mismos números que el monitor.
// Coordenadas: el modelo trabaja en el suelo (x, y) en mm; aquí x → X, y → −Z.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';
import { construirMaqueen, ponerTransparencia, PUNTOS } from './maqueen-modelo.js';
import { APROX } from '../engine.js';

function leerColor(nombre, defecto) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
  return v || defecto;
}

// Textura de la mesa: tablero claro con cuadrícula de 5 cm y una escala de 10 cm
function texturaMesa(mesa) {
  const W = 2048;
  const k = W / mesa.ancho;
  const H = Math.round(mesa.alto * k);
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const g = cv.getContext('2d');
  const px = (x) => (x + mesa.ancho / 2) * k;
  const py = (y) => (mesa.alto / 2 - y) * k;
  g.fillStyle = '#f4f3ee';
  g.fillRect(0, 0, W, H);
  for (let x = -Math.floor(mesa.ancho / 100) * 50; x <= mesa.ancho / 2; x += 50) {
    g.strokeStyle = x % 100 === 0 ? 'rgba(30,50,40,0.09)' : 'rgba(30,50,40,0.045)';
    g.lineWidth = 1.4;
    g.beginPath();
    g.moveTo(px(x), 0);
    g.lineTo(px(x), H);
    g.stroke();
  }
  for (let y = -Math.floor(mesa.alto / 100) * 50; y <= mesa.alto / 2; y += 50) {
    g.strokeStyle = y % 100 === 0 ? 'rgba(30,50,40,0.09)' : 'rgba(30,50,40,0.045)';
    g.lineWidth = 1.4;
    g.beginPath();
    g.moveTo(0, py(y));
    g.lineTo(W, py(y));
    g.stroke();
  }
  mesa.pintar?.(g, px, py, k);
  // Escala de 10 cm
  const x0 = -mesa.ancho / 2 + 40;
  const y0 = -mesa.alto / 2 + 36;
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
  return cv;
}

// ---------------------------------------------------------------------------
// opciones:
//   contenedor, canvas, capaEtiquetas
//   mesa: { ancho, alto, pintar(g, px, py, k) }
//   robot: () => rob (el estado del modelo: x, y, rumbo, vI, vD…)
//   estado: () => { pantalla 5×5 (0–255), brillo, sonando: { zumbador, altavoz, f } }
//   nombres: { id: texto } para cambiar el texto de un rótulo
//   prioridad: { id: número } (más alto, antes se ve)
//   valores: { id: () => texto } valor que acompaña al rótulo (p. ej. la orden del motor)
//   extras(ctx) → { actualizar(ahora) }: lo que añade el laboratorio
//   alPulsarPieza(id)
//   vistaInicial: 'lado' | 'arriba' | 'delante' | 'abajo' | 'mesa'
//   centroICR: dibuja el centro de giro (2.1)
export function crearEscenaMaqueen(op) {
  const { contenedor, canvas, capaEtiquetas, mesa, robot: leerRobot, estado = () => ({}), alPulsarPieza } = op;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' });
    if (!renderer.getContext()) throw new Error('sin WebGL');
  } catch (e) {
    return crearVistaPlana(op);
  }
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
  const luzDebajo = new THREE.DirectionalLight(0xffffff, 0);
  luzDebajo.position.set(260, -900, 380);
  scene.add(luzDebajo);

  // ---------- Mesa ----------
  const texMesa = new THREE.CanvasTexture(texturaMesa(mesa));
  texMesa.colorSpace = THREE.SRGBColorSpace;
  texMesa.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const mesaMat = new THREE.MeshStandardMaterial({ map: texMesa, roughness: 0.95, metalness: 0, side: THREE.DoubleSide, transparent: true });
  const suelo = new THREE.Mesh(new THREE.PlaneGeometry(mesa.ancho, mesa.alto), mesaMat);
  suelo.rotation.x = -Math.PI / 2;
  scene.add(suelo);
  const borde = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(mesa.ancho, 0.1, mesa.alto)), new THREE.LineBasicMaterial({ color: 0x8b928c }));
  scene.add(borde);
  const aulaMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(leerColor('--escena-fondo', '#e3e6df')).multiplyScalar(0.94), roughness: 1 });
  const aula = new THREE.Mesh(new THREE.PlaneGeometry(14000, 14000), aulaMat);
  aula.rotation.x = -Math.PI / 2;
  aula.position.y = -1.5;
  scene.add(aula);
  function repintarMesa() {
    const cv = texturaMesa(mesa);
    texMesa.image = cv;
    texMesa.needsUpdate = true;
  }

  // ---------- Robot ----------
  const piezas = [];
  const anclas = [];
  function registrar(id, obj, { ancla, donde = 'arriba', texto } = {}) {
    obj.traverse((o) => {
      if (o.isMesh) {
        o.userData.pieza = id;
        piezas.push(o);
      }
    });
    if (ancla) {
      const a = new THREE.Object3D();
      a.position.copy(ancla);
      anclas.push({ id, a, donde, texto: op.nombres?.[id] || texto || NOMBRES[id] || id, robot: true });
    }
  }
  const M = construirMaqueen(THREE, { registrar });
  const robot = M.robot;
  scene.add(robot);
  for (const a of anclas) robot.add(a.a);

  // Sombra de contacto
  const sombraCv = document.createElement('canvas');
  sombraCv.width = sombraCv.height = 128;
  const sg = sombraCv.getContext('2d');
  const rg = sg.createRadialGradient(64, 64, 8, 64, 64, 64);
  rg.addColorStop(0, 'rgba(0,0,0,0.34)');
  rg.addColorStop(1, 'rgba(0,0,0,0)');
  sg.fillStyle = rg;
  sg.fillRect(0, 0, 128, 128);
  const sombra = new THREE.Mesh(new THREE.PlaneGeometry(170, 130), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sombraCv), transparent: true, depthWrite: false }));
  sombra.rotation.x = -Math.PI / 2;
  sombra.position.set(12, 0.25, 0);
  robot.add(sombra);

  // Luz de los LED RGB y de los faros sobre la mesa
  const brilloCv = document.createElement('canvas');
  brilloCv.width = brilloCv.height = 128;
  const bg = brilloCv.getContext('2d');
  const bgr = bg.createRadialGradient(64, 64, 4, 64, 64, 64);
  bgr.addColorStop(0, 'rgba(255,255,255,1)');
  bgr.addColorStop(0.35, 'rgba(255,255,255,0.45)');
  bgr.addColorStop(1, 'rgba(255,255,255,0)');
  bg.fillStyle = bgr;
  bg.fillRect(0, 0, 128, 128);
  const texBrillo = new THREE.CanvasTexture(brilloCv);
  function manchaLuz(x, z, w, d) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, d),
      new THREE.MeshBasicMaterial({ map: texBrillo, color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.45, z);
    robot.add(m);
    return m;
  }
  const luzRGB = M.rgbLeds.map((l) => manchaLuz(l.position.x, l.position.z, 90, 90));
  const luzFaros = { I: manchaLuz(118, -30, 90, 60), D: manchaLuz(118, 30, 90, 60) };
  luzFaros.I.material.color.setHex(0xff3b2f);
  luzFaros.D.material.color.setHex(0xff3b2f);

  // Flechas de velocidad de las ruedas
  const colorPlaca = new THREE.Color(leerColor('--placa', '#0d6654'));
  function flecha(color) {
    const g = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({ color });
    const asta = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 1, 10), mat);
    asta.rotation.z = -Math.PI / 2;
    asta.position.x = 0.5;
    const punta = new THREE.Mesh(new THREE.ConeGeometry(5, 11, 14), mat);
    punta.rotation.z = -Math.PI / 2;
    g.add(asta, punta);
    return { g, asta, punta, mat };
  }
  const flechas = { I: flecha(colorPlaca), D: flecha(colorPlaca) };
  flechas.I.g.position.set(0, 46, -(APROX.distanciaRuedas / 2 + 12));
  flechas.D.g.position.set(0, 46, APROX.distanciaRuedas / 2 + 12);
  robot.add(flechas.I.g, flechas.D.g);

  // Rastro y predicción
  const MAXR = 500;
  const rastroGeo = new THREE.BufferGeometry();
  rastroGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAXR * 3), 3));
  const rastro = new THREE.Line(rastroGeo, new THREE.LineBasicMaterial({ color: 0xd92f2a, transparent: true, opacity: 0.55 }));
  scene.add(rastro);
  const predGeo = new THREE.BufferGeometry();
  predGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(61 * 3), 3));
  const pred = new THREE.Line(predGeo, new THREE.LineDashedMaterial({ color: colorPlaca, dashSize: 6, gapSize: 5 }));
  scene.add(pred);
  // Centro de giro (2.1): un punto en el suelo y la circunferencia que recorre el robot
  const icr = new THREE.Group();
  const icrPunto = new THREE.Mesh(new THREE.RingGeometry(3, 7, 24), new THREE.MeshBasicMaterial({ color: 0xd92f2a, side: THREE.DoubleSide }));
  icrPunto.rotation.x = -Math.PI / 2;
  icr.add(icrPunto);
  const circGeo = new THREE.BufferGeometry();
  circGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(129 * 3), 3));
  const circ = new THREE.Line(circGeo, new THREE.LineDashedMaterial({ color: 0xd92f2a, dashSize: 8, gapSize: 6, transparent: true, opacity: 0.8 }));
  scene.add(icr, circ);
  icr.visible = circ.visible = false;

  // Pulsos por las pistas (I2C, P15, P0)
  const pulsos = [];
  const pulsoMats = { i2c: new THREE.MeshBasicMaterial({ color: 0xffe066 }), p15: new THREE.MeshBasicMaterial({ color: 0x7ad7ff }), p0: new THREE.MeshBasicMaterial({ color: 0xff9f43 }) };
  for (let i = 0; i < 8; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(2.6, 12, 8), pulsoMats.i2c);
    p.visible = false;
    robot.add(p);
    pulsos.push(p);
  }
  let animaciones = [];
  const RUTAS = { i2c: M.rutaBus, p15: M.rutaP15, p0: M.rutaP0 };

  // Ondas de sonido del zumbador y del altavoz de la micro:bit
  function anillosSonido(pos, color) {
    const g = new THREE.Group();
    const anillos = [];
    for (let i = 0; i < 3; i++) {
      const a = new THREE.Mesh(new THREE.TorusGeometry(10, 0.7, 6, 32), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 }));
      a.rotation.x = Math.PI / 2;
      g.add(a);
      anillos.push(a);
    }
    g.position.copy(pos);
    robot.add(g);
    return { g, anillos };
  }
  const sonidoZumbador = anillosSonido(new THREE.Vector3(PUNTOS.zumbador.x, 36, PUNTOS.zumbador.z), 0xff9f43);
  const sonidoAltavoz = anillosSonido(new THREE.Vector3(48, 50, 0), 0x7ad7ff);
  sonidoAltavoz.g.rotation.z = Math.PI / 2; // la micro:bit está de pie: las ondas salen por detrás

  // El eco del ultrasonidos: un arco que sale y otro que vuelve (a cámara lenta)
  const arcoMat = new THREE.MeshBasicMaterial({ color: 0x2f9e8f, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
  const arcoVueltaMat = new THREE.MeshBasicMaterial({ color: 0xe0a91b, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
  const arcoIda = new THREE.Mesh(new THREE.RingGeometry(0.94, 1, 40, 1, -0.26, 0.52), arcoMat);
  const arcoVuelta = new THREE.Mesh(new THREE.RingGeometry(0.94, 1, 40, 1, Math.PI - 0.3, 0.6), arcoVueltaMat);
  arcoIda.rotation.x = arcoVuelta.rotation.x = -Math.PI / 2;
  scene.add(arcoIda, arcoVuelta);
  let ping = null;

  // ---------- Rótulos ----------
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
  const rotulos = [];
  function crearRotulo(a) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'etq';
    b.dataset.pieza = a.id;
    const nombre = document.createElement('span');
    nombre.className = 'etq-nombre';
    nombre.textContent = a.texto;
    b.appendChild(nombre);
    let valor = null;
    if (op.valores?.[a.id]) {
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
    const r = { ...a, el: b, nombre, valor, guia: nuevaGuia(), prio: a.prio ?? op.prioridad?.[a.id] ?? PRIORIDAD[a.id] ?? 3, w: 0, h: 0, medir: true };
    rotulos.push(r);
    return r;
  }
  for (const a of anclas) if (!(op.ocultar || []).includes(a.id)) crearRotulo(a);

  // ---------- Lo que añade el laboratorio ----------
  const mundo = { x: (x) => x, z: (y) => -y };
  const ext =
    op.extras?.({
      THREE,
      scene,
      robot,
      M,
      registrarPieza(id, obj) {
        obj.traverse((o) => {
          if (o.isMesh) {
            o.userData.pieza = id;
            piezas.push(o);
          }
        });
      },
      rotulo(id, obj, texto, { prio = 4, donde = 'mundo' } = {}) {
        return crearRotulo({ id, a: obj, donde, texto, prio, robot: false });
      },
      repintarMesa,
      mundo,
    }) || {};

  // ---------- Cámara ----------
  const tmp2 = new THREE.Vector3();
  const cam = { r: 470, az: 0, el: 0.6, objetivo: new THREE.Vector3(), seguir: true, mesa: false };
  const opciones = { transparente: true, nombres: true };
  function aspecto() {
    const rc = contenedor.getBoundingClientRect();
    return rc.width > 0 && rc.height > 0 ? rc.width / rc.height : camera.aspect;
  }
  function presetVista(nombre) {
    const r = leerRobot();
    const atras = -r.rumbo + Math.PI;
    const k = Math.min(1.8, Math.max(1, 1.45 / aspecto()));
    cam.mesa = false;
    cam.seguir = true;
    cam.adelante = 25;
    if (nombre === 'lado') Object.assign(cam, { r: 380 * k, el: 0.55, az: atras + 0.9 });
    // De perfil y más lejos, mirando un poco por delante del robot (para ver lo que tiene enfrente)
    if (nombre === 'perfil') Object.assign(cam, { r: 820 * k, el: 0.45, az: -r.rumbo - Math.PI / 2 + 0.25, adelante: op.objetivoAdelante ?? 260 });
    if (nombre === 'arriba') Object.assign(cam, { r: 600 * k, el: 1.45, az: atras + 0.0001 });
    if (nombre === 'delante') Object.assign(cam, { r: 330 * k, el: 0.32, az: -r.rumbo + 0.35 });
    if (nombre === 'abajo') Object.assign(cam, { r: 380 * k, el: -0.95, az: atras + 0.3 });
    cam.encuadre = false;
    if (nombre === 'mesa' && op.encuadre) {
      // Encuadre de lo que importa (p. ej. el mando y el robot), que se mantiene al moverse
      Object.assign(cam, { el: 1.0, az: Math.PI / 2, seguir: false, mesa: true, encuadre: true, manual: false });
      ajustarEncuadre(true);
      vistaActual = nombre;
      return;
    }
    if (nombre === 'mesa') {
      const el = 1.1;
      const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const rAlto = ((mesa.alto / 2) * Math.sin(el) + 60) / t;
      const rAncho = (mesa.ancho / 2 + 60) / (t * Math.max(0.5, aspecto()));
      Object.assign(cam, { r: Math.min(4000, Math.max(rAlto, rAncho) * 1.08), el, az: Math.PI / 2, seguir: false, mesa: true });
      cam.objetivo.set(0, 0, 0);
    }
    vistaActual = nombre;
  }
  function ajustarEncuadre(inmediato) {
    const pts = op.encuadre();
    let x0 = Infinity;
    let x1 = -Infinity;
    let y0 = Infinity;
    let y1 = -Infinity;
    for (const q of pts) {
      x0 = Math.min(x0, q.x);
      x1 = Math.max(x1, q.x);
      y0 = Math.min(y0, q.y);
      y1 = Math.max(y1, q.y);
    }
    const margen = 230;
    const hw = (x1 - x0) / 2 + margen;
    const hh = (y1 - y0) / 2 + margen;
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const rAlto = (hh * Math.sin(cam.el) + 60) / t;
    const rAncho = (hw + 60) / (t * Math.max(0.5, aspecto()));
    const rObj = Math.min(4000, Math.max(520, Math.max(rAlto, rAncho) * 1.05));
    tmp2.set((x0 + x1) / 2, 0, -(y0 + y1) / 2);
    if (inmediato) {
      cam.objetivo.copy(tmp2);
      cam.r = rObj;
    } else {
      cam.objetivo.lerp(tmp2, 0.06);
      if (!cam.manual) cam.r += (rObj - cam.r) * 0.06;
    }
  }
  let vistaActual = op.vistaInicial || 'lado';
  presetVista(vistaActual);

  let arrastre = null;
  const punteros = new Map();
  let arrastrePieza = null; // pieza del laboratorio que se mueve arrastrándola (linterna, caja…)
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    arrastre = { x: e.clientX, y: e.clientY, movido: 0 };
    activa = true;
    arrastrePieza = null;
    if (op.arrastrables?.length && punteros.size === 1) {
      const h = rayoDesde(e).intersectObjects(piezas, false).find((x) => x.object.visible);
      if (h && op.arrastrables.includes(h.object.userData.pieza)) {
        arrastrePieza = h.object.userData.pieza;
        canvas.style.cursor = 'grabbing';
      }
    }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!punteros.has(e.pointerId)) return;
    const prev = punteros.get(e.pointerId);
    punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (punteros.size === 2) {
      const [a, b] = [...punteros.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (arrastre?.dist) cam.r = Math.min(4000, Math.max(140, cam.r * (arrastre.dist / dist)));
      cam.manual = true;
      arrastre = { ...arrastre, dist, movido: 99 };
      return;
    }
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    if (arrastre) arrastre.movido += Math.abs(dx) + Math.abs(dy);
    if (arrastrePieza) {
      const p = puntoSuelo(e);
      if (p) op.alArrastrar?.(arrastrePieza, p);
      return;
    }
    cam.az += dx * 0.008;
    cam.el = Math.max(-1.45, Math.min(1.5, cam.el + dy * 0.008));
  });
  const soltar = (e) => {
    punteros.delete(e.pointerId);
    if (punteros.size === 0) {
      if (arrastre && arrastre.movido < 4 && e.type === 'pointerup') elegir(e);
      if (arrastrePieza) op.alSoltar?.(arrastrePieza);
      arrastre = null;
      arrastrePieza = null;
      canvas.style.cursor = '';
    }
  };
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', soltar);
  let activa = false;
  canvas.addEventListener('pointerleave', () => (activa = false));
  canvas.addEventListener(
    'wheel',
    (e) => {
      if (!activa && !e.ctrlKey) return;
      e.preventDefault();
      cam.r = Math.min(4000, Math.max(140, cam.r * Math.exp(e.deltaY * 0.0012)));
      cam.manual = true;
    },
    { passive: false }
  );
  const ray = new THREE.Raycaster();
  function rayoDesde(e) {
    const rect = canvas.getBoundingClientRect();
    const v = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(v, camera);
    return ray;
  }
  function elegir(e) {
    const hits = rayoDesde(e).intersectObjects(piezas, false);
    const h = hits.find((x) => x.object.visible);
    if (h) alPulsarPieza?.(h.object.userData.pieza);
    else op.alPulsarSuelo?.(puntoSuelo(e));
  }
  // Punto del suelo (mm) bajo el puntero
  const planoSuelo = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  function puntoSuelo(e) {
    const p = new THREE.Vector3();
    if (!rayoDesde(e).ray.intersectPlane(planoSuelo, p)) return null;
    return { x: p.x, y: -p.z };
  }

  // ---------- Tamaño ----------
  let ancho = 1;
  let alto = 1;
  let margenSup = 8;
  let margenInf = 6;
  const barraVistas = contenedor.parentElement?.querySelector('.escena-barra');
  const botonera = contenedor.querySelector('.botonera');
  const ro = new ResizeObserver(() => {
    const r = contenedor.getBoundingClientRect();
    ancho = Math.max(1, r.width);
    alto = Math.max(1, r.height);
    renderer.setSize(ancho, alto, false);
    camera.aspect = ancho / alto;
    camera.updateProjectionMatrix();
    margenSup = barraVistas && !barraVistas.hidden && getComputedStyle(barraVistas).position === 'absolute' ? barraVistas.offsetTop + barraVistas.offsetHeight + 8 : 8;
    // Los rótulos no se ponen detrás de los botones de abajo
    margenInf = botonera ? alto - botonera.offsetTop + 6 : 6;
    for (const it of rotulos) it.medir = true;
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

  // ---------- Dibujar ----------
  const tmp = new THREE.Vector3();
  const colorTmp = new THREE.Color();
  function dibujar(ahora = performance.now()) {
    const r = leerRobot();
    const est = estado() || {};
    robot.position.set(r.x, 0, -r.y);
    robot.rotation.y = r.rumbo;
    M.ruedas.I.rueda.rotation.z = -r.giroI;
    M.ruedas.D.rueda.rotation.z = -r.giroD;
    const tr = opciones.transparente;
    ponerTransparencia(M, tr);
    const debajo = camera.position.y < 0;
    aula.visible = !debajo;
    mesaMat.opacity = debajo ? 0.35 : 1;
    luzDebajo.intensity = debajo ? 1.7 : 0;

    // Pantalla de la micro:bit (con su brillo)
    const pant = est.pantalla;
    for (let f = 0; f < 5; f++)
      for (let c = 0; c < 5; c++) {
        const v = pant ? pant[f][c] : 0;
        M.leds[f * 5 + c].material = v > 20 ? M.mats.ledOn : M.mats.ledOff;
      }
    // Faros
    for (const [lado, on] of [
      ['I', r.faroI],
      ['D', r.faroD],
    ]) {
      const f = M.faros[lado];
      const mat = on ? M.mats.faroOn : M.mats.faroOff;
      if (f.cuerpo.material !== mat) f.cuerpo.material = f.punta.material = mat;
    }
    // LED RGB y la luz que echan sobre la mesa
    r.rgb?.forEach(([R, G, B], i) => {
      const l = M.rgbLeds[i];
      const n = Math.max(R, G, B);
      if (n > 2) {
        colorTmp.setRGB(R / 255, G / 255, B / 255, THREE.SRGBColorSpace);
        l.material.color.copy(colorTmp);
        l.material.emissive.copy(colorTmp);
        l.material.emissiveIntensity = 0.6 + 1.6 * (n / 255);
        luzRGB[i].material.color.setRGB(R / n, G / n, B / n, THREE.SRGBColorSpace);
        luzRGB[i].material.opacity = 0.25 + 0.6 * (n / 255);
      } else {
        l.material.color.setHex(0xe9ece6);
        l.material.emissive.setHex(0x000000);
        luzRGB[i].material.opacity = 0;
      }
    });
    luzFaros.I.material.opacity = r.faroI ? 0.75 : 0;
    luzFaros.D.material.opacity = r.faroD ? 0.75 : 0;
    // Interruptor del zumbador
    M.palanca.position.z = est.zumbadorOn === false ? -1.2 : 1.2;

    // Sonido: anillos que se abren mientras suena
    const s = est.sonando || {};
    for (const [cual, on] of [
      [sonidoZumbador, s.zumbador],
      [sonidoAltavoz, s.altavoz],
    ]) {
      cual.anillos.forEach((a, i) => {
        if (!on) {
          a.material.opacity = 0;
          return;
        }
        const fase = ((ahora / 600 + i / 3) % 1 + 1) % 1;
        a.scale.setScalar(0.4 + fase * 2.2);
        a.material.opacity = 0.75 * (1 - fase);
      });
    }

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
    const R = r.rastro || [];
    const n = Math.min(MAXR, R.length);
    for (let i = 0; i < n; i++) {
      const q = R[R.length - n + i];
      pos[i * 3] = q.x;
      pos[i * 3 + 1] = 0.7;
      pos[i * 3 + 2] = -q.y;
    }
    rastroGeo.setDrawRange(0, n);
    rastroGeo.attributes.position.needsUpdate = true;

    // Predicción: 1,2 s con las velocidades de ahora
    const pp = predGeo.attributes.position.array;
    let x = r.x;
    let y = r.y;
    let th = r.rumbo;
    const vv = (r.vI + r.vD) / 2;
    const w = (r.vD - r.vI) / APROX.distanciaRuedas;
    for (let i = 0; i <= 60; i++) {
      pp[i * 3] = x;
      pp[i * 3 + 1] = 0.9;
      pp[i * 3 + 2] = -y;
      x += vv * Math.cos(th) * 0.02;
      y += vv * Math.sin(th) * 0.02;
      th += w * 0.02;
    }
    predGeo.attributes.position.needsUpdate = true;
    pred.computeLineDistances();
    pred.visible = Math.abs(vv) > 2 || Math.abs(w) > 0.05;

    // Centro de giro
    if (op.centroICR && Math.abs(w) > 0.02) {
      const radio = vv / w; // a la izquierda del robot si es positivo
      const cx = r.x - Math.sin(r.rumbo) * radio;
      const cy = r.y + Math.cos(r.rumbo) * radio;
      if (Math.abs(radio) < 3000) {
        icr.visible = circ.visible = true;
        icr.position.set(cx, 0.6, -cy);
        const cp = circGeo.attributes.position.array;
        const rr = Math.abs(radio);
        for (let i = 0; i <= 128; i++) {
          const a = (i / 128) * Math.PI * 2;
          cp[i * 3] = cx + rr * Math.cos(a);
          cp[i * 3 + 1] = 0.8;
          cp[i * 3 + 2] = -(cy + rr * Math.sin(a));
        }
        circGeo.attributes.position.needsUpdate = true;
        circ.computeLineDistances();
      } else icr.visible = circ.visible = false;
    } else icr.visible = circ.visible = false;

    // Pulsos por las pistas
    pulsos.forEach((p) => (p.visible = false));
    let ip = 0;
    animaciones = animaciones.filter((a) => ahora < a.t0 + a.dur + 50);
    for (const a of animaciones) {
      if (ahora < a.t0 || ip >= pulsos.length) continue;
      const f = Math.min(1, (ahora - a.t0) / a.dur);
      const u = a.vuelta ? (f < 0.5 ? f * 2 : 2 - f * 2) : f;
      RUTAS[a.ruta].getPointAt(Math.max(0, Math.min(1, u)), tmp);
      pulsos[ip].material = pulsoMats[a.ruta];
      pulsos[ip].position.copy(tmp);
      pulsos[ip].position.y += 1;
      pulsos[ip].visible = true;
      ip++;
    }

    // Eco del ultrasonidos
    arcoMat.opacity = arcoVueltaMat.opacity = 0;
    if (ping) {
      const f = (ahora - ping.t0) / ping.dur;
      if (f >= 1) ping = null;
      else {
        const c = Math.cos(ping.rumbo);
        const sn = Math.sin(ping.rumbo);
        const d = ping.d ?? 600;
        const ida = ping.sinEco ? Math.min(1, f) : Math.min(1, f * 2);
        // El arco de ida avanza desde el sensor hasta el obstáculo
        const rI = Math.max(4, ida * d);
        arcoIda.position.set(ping.x, 40, -ping.y);
        arcoIda.rotation.set(-Math.PI / 2, 0, ping.rumbo);
        arcoIda.scale.setScalar(rI);
        arcoMat.opacity = ping.sinEco ? 0.8 * (1 - f) : f < 0.5 ? 0.85 : 0;
        if (!ping.sinEco && f >= 0.5) {
          // El de vuelta, desde el obstáculo hacia el sensor
          const g = (f - 0.5) * 2;
          const ox = ping.x + c * d;
          const oy = ping.y + sn * d;
          arcoVuelta.position.set(ox, 40, -oy);
          arcoVuelta.rotation.set(-Math.PI / 2, 0, ping.rumbo);
          arcoVuelta.scale.setScalar(Math.max(4, g * d));
          arcoVueltaMat.opacity = 0.85;
        }
      }
    }

    ext.actualizar?.(ahora, est);

    // Cámara
    if (cam.seguir) {
      const ad = cam.adelante ?? 25;
      tmp2.set(r.x + Math.cos(r.rumbo) * ad, 30, -(r.y + Math.sin(r.rumbo) * ad));
      cam.objetivo.lerp(tmp2, 0.2);
    } else if (cam.encuadre) ajustarEncuadre(false);
    else if (cam.mesa) cam.objetivo.lerp(tmp2.set(0, 0, 0), 0.2);
    const ce = Math.cos(cam.el);
    camera.position.set(cam.objetivo.x + cam.r * ce * Math.cos(cam.az), cam.objetivo.y + cam.r * Math.sin(cam.el), cam.objetivo.z + cam.r * ce * Math.sin(cam.az));
    camera.up.set(0, 1, 0);
    camera.lookAt(cam.objetivo);
    renderer.render(scene, camera);
    colocarRotulos({ debajo, tr });
    return { debajo };
  }

  // ---------- Colocación de los rótulos (dos columnas, como en el 2.5) ----------
  const MARGEN = 6;
  const SEP = 16;
  const GAP = 5;
  const enPantalla = (v) => ({ x: ((v.x + 1) / 2) * ancho, y: ((1 - v.y) / 2) * alto, z: v.z });
  function colocarColumna(lista, lado, x0, x1, sup, inf) {
    if (!lista.length) return;
    lista.sort((a, b) => a.ay - b.ay);
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
  function colocarRotulos({ debajo, tr }) {
    const mostrar = opciones.nombres;
    for (const it of rotulos) {
      if (!it.valor) continue;
      const t = op.valores[it.id]() ?? '';
      if (it.valor.textContent !== t) {
        if (it.valor.textContent.length !== t.length) it.medir = true;
        it.valor.textContent = t;
      }
    }
    const vivos = [];
    for (const it of rotulos) {
      let visible = mostrar && (!cam.mesa || !it.robot || it.prio >= 8);
      if (visible && it.robot && !tr) {
        if (it.donde === 'abajo' || it.donde === 'dentro') visible = debajo;
        if (it.donde === 'arriba') visible = !debajo;
      }
      if (visible && it.visible && !it.visible()) visible = false;
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
    for (const it of vivos) it.el.hidden = false;
    for (const it of vivos) {
      if (it.medir || !it.w) {
        it.w = it.el.offsetWidth;
        it.h = it.el.offsetHeight;
        it.medir = false;
      }
    }
    // Lo que ocupa el robot en pantalla (en la vista de toda la mesa, solo el centro)
    let x0 = Infinity;
    let x1 = -Infinity;
    for (const c of M.esquinas) {
      const p = enPantalla(robot.localToWorld(tmp.copy(c)).project(camera));
      x0 = Math.min(x0, p.x);
      x1 = Math.max(x1, p.x);
    }
    const sup = margenSup;
    const inf = alto - Math.max(MARGEN, margenInf);
    // Los objetos de la mesa llevan su rótulo encima, junto a ellos
    for (const it of vivos) {
      if (it.robot) continue;
      it.left = Math.min(Math.max(MARGEN, it.ax - it.w / 2), ancho - MARGEN - it.w);
      it.top = Math.min(Math.max(sup, it.ay - it.h - 16), inf - it.h);
      it.encima = true;
    }
    const centro = (x0 + x1) / 2;
    const izq = [];
    const der = [];
    for (const it of vivos) if (it.robot) (it.ax < centro ? izq : der).push(it);
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
      if (it.encima) {
        const bx = Math.min(Math.max(it.left + 8, it.ax), it.left + it.w - 8);
        it.guia.poner([
          [bx, it.top + it.h],
          [it.ax, it.ay],
        ]);
        continue;
      }
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
    tipo: '3d',
    THREE,
    scene,
    M,
    camera,
    cam,
    dibujar,
    ponerVista: presetVista,
    vista: () => vistaActual,
    opcion(nombre, v) {
      if (nombre in opciones) opciones[nombre] = v;
      if (nombre === 'seguir') cam.seguir = v;
      ext.opcion?.(nombre, v);
    },
    opciones,
    // Un pulso por una pista del robot: 'i2c' (bus), 'p15' (LED RGB) o 'p0' (zumbador)
    pulso(ruta, { vuelta = false, retraso = 0, dur = 520 } = {}) {
      animaciones.push({ ruta, vuelta, t0: performance.now() + retraso, dur });
    },
    // El eco del ultrasonidos, a cámara lenta: { x, y, rumbo, d, sinEco }
    eco(m, dur = 1100) {
      ping = { ...m, t0: performance.now(), dur };
    },
    puntoSuelo,
    repintarMesa,
    rotulo: (id) => rotulos.find((r) => r.id === id),
    destruir() {
      ro.disconnect();
      renderer.dispose();
    },
  };
}

const NOMBRES = {
  microbit: 'micro:bit',
  chip: 'Chip del Maqueen',
  motorI: 'Motor izq.',
  motorD: 'Motor der.',
  apoyo: 'Rueda de apoyo',
  bateria: 'Pilas AA',
  encendido: 'Interruptor de encendido',
  ultrasonidos: 'Ultrasonidos',
  faros: 'Faros',
  rgb: 'LED RGB',
  tecla: 'Tecla de calibración',
  zumbador: 'Zumbador (P0)',
  interruptor: 'Interruptor del zumbador',
  ir: 'Receptor IR',
};
const PRIORIDAD = { microbit: 8, chip: 7, motorI: 6, motorD: 6, bateria: 5, apoyo: 3, ultrasonidos: 4, tecla: 2, faros: 3, rgb: 3, zumbador: 3, ir: 2, interruptor: 2, encendido: 2 };

// ---------------------------------------------------------------------------
// Sin WebGL: la mesa desde arriba en un lienzo 2D, con el robot y lo que añada
// el laboratorio (op.plano2d(g, px, py, k)). Mismo modelo, mismos números.
function crearVistaPlana(op) {
  const { contenedor, canvas, mesa, robot: leerRobot } = op;
  const aviso = document.createElement('p');
  aviso.className = 'escena-aviso';
  aviso.style.top = 'auto';
  aviso.textContent = 'Este navegador no puede mostrar el 3D: ves la mesa desde arriba.';
  contenedor.appendChild(aviso);
  let ancho = 1;
  let alto = 1;
  const ro = new ResizeObserver(() => {
    const r = contenedor.getBoundingClientRect();
    ancho = Math.max(1, r.width);
    alto = Math.max(1, r.height);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(ancho * dpr);
    canvas.height = Math.round(alto * dpr);
  });
  ro.observe(contenedor);
  function dibujar() {
    const g = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const k = Math.min(W / (mesa.ancho + 60), H / (mesa.alto + 60));
    const px = (x) => W / 2 + x * k;
    const py = (y) => H / 2 - y * k;
    g.fillStyle = '#e3e6df';
    g.fillRect(0, 0, W, H);
    g.fillStyle = '#f4f3ee';
    g.fillRect(px(-mesa.ancho / 2), py(mesa.alto / 2), mesa.ancho * k, mesa.alto * k);
    mesa.pintar?.(g, px, py, k);
    op.plano2d?.(g, px, py, k);
    const r = leerRobot();
    g.strokeStyle = 'rgba(217,47,42,0.6)';
    g.lineWidth = 2;
    g.beginPath();
    (r.rastro || []).forEach((q, i) => (i ? g.lineTo(px(q.x), py(q.y)) : g.moveTo(px(q.x), py(q.y))));
    g.stroke();
    g.save();
    g.translate(px(r.x), py(r.y));
    g.rotate(-r.rumbo);
    g.fillStyle = '#23292b';
    g.fillRect(-50 * k, -38 * k, 124 * k, 76 * k);
    g.fillStyle = '#1b1c1d';
    g.fillRect(-21 * k, -51 * k, 42 * k, 13 * k);
    g.fillRect(-21 * k, 38 * k, 42 * k, 13 * k);
    g.fillStyle = '#1f4f8a';
    g.fillRect(74 * k, -22 * k, 14 * k, 44 * k);
    g.restore();
  }
  return {
    tipo: '2d',
    dibujar,
    ponerVista() {},
    vista: () => 'arriba',
    opcion() {},
    opciones: { transparente: true, nombres: false },
    pulso() {},
    eco() {},
    puntoSuelo: () => null,
    repintarMesa() {},
    rotulo: () => null,
    destruir() {
      ro.disconnect();
    },
  };
}
