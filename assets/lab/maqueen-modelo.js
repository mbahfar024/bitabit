// Bit a bit · Modelo 3D del Maqueen Plus V2 (simplificado)
// Lo usan la escena del siguelíneas (2.5) y la de los demás laboratorios del robot.
// No importa three.js: lo recibe como parámetro, para que cada escena use el suyo.
//
// Coordenadas del robot, en mm: x hacia delante (desde el eje de las ruedas),
// y hacia arriba (desde el suelo) y z hacia la derecha del robot.
// Distribución según las fotos de los robots del IES Fuente Nueva y la de DFRobot
// (repositorio microsoft/microbit-robot, assets/images): ultrasonidos delante y abajo,
// la micro:bit en su ranura justo detrás y con la pantalla hacia delante, faros en
// las esquinas delanteras; en el lado derecho, el receptor IR, el interruptor de
// encendido, el conector de las pilas, el interruptor del zumbador (P0) y el
// zumbador; la tecla de calibración en el izquierdo, delante de la rueda; y el
// portapilas de 4 pilas AA en el piso de arriba (versión MBT0021-EN).
// Las medidas son aproximadas.
import { APROX, DOC, GEOM_SENSORES } from '../engine.js';

export const LAT = { L2: 2, L1: 1, M: 0, R1: -1, R2: -2 };

// Puntos de interés del robot (para rótulos, animaciones y escenas)
export const PUNTOS = {
  microbit: { x: 50, y: 82, z: 0 },
  pantalla: { x: 52, y: 55, z: 0 },
  ultrasonidos: { x: 84, y: 40, z: 0 },
  emisorUS: { x: 88, y: 40, z: 13 }, // transductor T (derecha, visto por el robot)
  receptorUS: { x: 88, y: 40, z: -13 },
  ir: { x: 80, y: 30, z: 6 },
  zumbador: { x: 30, y: 34, z: 22 },
  chip: { x: 14, y: 32, z: 16 },
  bateria: { x: -8, y: 80, z: 0 },
  encendido: { x: 46, y: 31, z: 31 },
  faroI: { x: 67, y: 24, z: -27 },
  faroD: { x: 67, y: 24, z: 27 },
};

function caja(THREE, w, h, d, mat) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
}

// registrar(id, objeto, { ancla: Vector3, donde, texto }) lo pone la escena
export function construirMaqueen(THREE, { registrar = () => {} } = {}) {
  const robot = new THREE.Group();
  const mats = {
    placa: new THREE.MeshStandardMaterial({ color: 0x23292b, roughness: 0.55, metalness: 0.1, transparent: true }),
    placa2: new THREE.MeshStandardMaterial({ color: 0x1c2224, roughness: 0.6, transparent: true }),
    piso: new THREE.MeshStandardMaterial({ color: 0x202628, roughness: 0.55, metalness: 0.1, transparent: true }),
    goma: new THREE.MeshStandardMaterial({ color: 0x1b1c1d, roughness: 0.95, transparent: true }),
    llanta: new THREE.MeshStandardMaterial({ color: 0xd9d9d2, roughness: 0.5, transparent: true }),
    metal: new THREE.MeshStandardMaterial({ color: 0xb9bcb8, roughness: 0.35, metalness: 0.8 }),
    laton: new THREE.MeshStandardMaterial({ color: 0xc9a14a, roughness: 0.4, metalness: 0.8 }),
    oro: new THREE.MeshStandardMaterial({ color: 0xd1a645, roughness: 0.35, metalness: 0.85 }),
    motor: new THREE.MeshStandardMaterial({ color: 0x9aa1a5, roughness: 0.35, metalness: 0.7 }),
    chip: new THREE.MeshStandardMaterial({ color: 0x0c0d0e, roughness: 0.4 }),
    bateria: new THREE.MeshStandardMaterial({ color: 0x2f6fba, roughness: 0.45, metalness: 0.2 }),
    portapilas: new THREE.MeshStandardMaterial({ color: 0x141618, roughness: 0.7, transparent: true }),
    microbit: new THREE.MeshStandardMaterial({ color: 0x121314, roughness: 0.5 }),
    sensor: new THREE.MeshStandardMaterial({ color: 0x2a2f31, roughness: 0.5 }),
    emisor: new THREE.MeshStandardMaterial({ color: 0x5f7fd6, roughness: 0.3, emissive: 0x000000 }),
    receptor: new THREE.MeshStandardMaterial({ color: 0x0b0b0c, roughness: 0.25 }),
    faroOff: new THREE.MeshStandardMaterial({ color: 0x7a2420, roughness: 0.3, transparent: true, opacity: 0.92 }),
    faroOn: new THREE.MeshStandardMaterial({ color: 0xff4a3a, emissive: 0xff2a1f, emissiveIntensity: 2.2 }),
    tecla: new THREE.MeshStandardMaterial({ color: 0xe7e7e2, roughness: 0.6 }),
    ultra: new THREE.MeshStandardMaterial({ color: 0x1f4f8a, roughness: 0.5 }),
    ledOff: new THREE.MeshStandardMaterial({ color: 0x3a1716, roughness: 0.4 }),
    ledOn: new THREE.MeshStandardMaterial({ color: 0xff4136, emissive: 0xff2a1f, emissiveIntensity: 1.6 }),
    batOn: new THREE.MeshStandardMaterial({ color: 0x3ad66b, emissive: 0x22c55e, emissiveIntensity: 1.4 }),
    batOff: new THREE.MeshStandardMaterial({ color: 0x163522, roughness: 0.5 }),
    papel: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }),
    bus: new THREE.MeshBasicMaterial({ color: 0xd1a645 }),
    zumbador: new THREE.MeshStandardMaterial({ color: 0x111213, roughness: 0.6 }),
    interruptor: new THREE.MeshStandardMaterial({ color: 0xf2f2ee, roughness: 0.5 }),
    irDomo: new THREE.MeshStandardMaterial({ color: 0x0d0d0e, roughness: 0.15, metalness: 0.1 }),
  };
  const transparentes = [mats.placa, mats.placa2, mats.piso, mats.goma, mats.llanta, mats.portapilas];
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  // ---------- Placa principal: frente con las esquinas recortadas ----------
  const forma = new THREE.Shape();
  // Con las «orejas» que llevan L2 y R2, delante de las ruedas (fotos de los bajos)
  const pts = [
    [-50, -32],
    [-42, -38],
    [24, -38],
    [24, -50],
    [42, -50],
    [74, -20],
    [74, 20],
    [42, 50],
    [24, 50],
    [24, 38],
    [-42, 38],
    [-50, 32],
  ];
  // La placa se dibuja en el plano (x, z) y luego se tumba
  forma.moveTo(pts[0][0], pts[0][1]);
  for (const [x, z] of pts.slice(1)) forma.lineTo(x, z);
  forma.closePath();
  const gPlaca = new THREE.ExtrudeGeometry(forma, { depth: 1.6, bevelEnabled: false });
  gPlaca.rotateX(Math.PI / 2);
  const placa = new THREE.Mesh(gPlaca, mats.placa);
  placa.position.y = 27.6; // la cara de abajo queda a 26 mm del suelo
  robot.add(placa);
  const bordePlaca = new THREE.LineSegments(new THREE.EdgesGeometry(gPlaca), new THREE.LineBasicMaterial({ color: 0x7c8a86 }));
  bordePlaca.position.copy(placa.position);
  robot.add(bordePlaca);

  // ---------- Sensores de línea: L1, M y R1 en fila; L2 y R2 en las orejas ----------
  // (cada uno cuelga de la placa en un soporte, para que se vea cerca del suelo)
  const placaSens = caja(THREE, 14, 1.6, 2 * APROX.separacionSensores + 14, mats.placa2);
  placaSens.position.set(APROX.sensorAdelante, 8, 0);
  robot.add(placaSens);
  const soportes = [
    [APROX.sensorAdelante, -APROX.separacionSensores - 4],
    [APROX.sensorAdelante, APROX.separacionSensores + 4],
  ];
  for (const n of ['L2', 'R2']) {
    const g = GEOM_SENSORES[n];
    const p = caja(THREE, 12, 1.6, 12, mats.placa2);
    p.position.set(g.adelante, 8, -g.lado);
    robot.add(p);
    soportes.push([g.adelante, -g.lado + (g.lado > 0 ? 4 : -4)]);
  }
  for (const [x, z] of soportes) {
    const poste = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 18, 8), mats.metal);
    poste.position.set(x, 17, z);
    robot.add(poste);
  }
  const sensores = {};
  for (const nombre of DOC.sensores) {
    const { adelante, lado } = GEOM_SENSORES[nombre];
    const z = -lado; // en el modelo, z crece hacia la derecha del robot
    const g = new THREE.Group();
    g.position.set(adelante, 6, z);
    g.add(caja(THREE, 6, 2.2, 8, mats.sensor));
    const em = new THREE.Mesh(new THREE.SphereGeometry(1.5, 12, 8), mats.emisor.clone());
    em.position.set(0, -1.3, -1.9);
    g.add(em);
    const re = new THREE.Mesh(new THREE.SphereGeometry(1.5, 12, 8), mats.receptor);
    re.position.set(0, -1.3, 1.9);
    g.add(re);
    // Haz infrarrojo
    const hazMat = new THREE.MeshBasicMaterial({ color: 0xff2d55, transparent: true, opacity: 0.0, depthWrite: false, blending: THREE.AdditiveBlending });
    const haz = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 3.2, 5, 14, 1, true), hazMat);
    haz.position.set(0, -3.6, 0);
    g.add(haz);
    // Papel que tapa el sensor
    const papel = caja(THREE, 10, 0.6, 11, mats.papel);
    papel.position.set(0, -4.2, 0);
    papel.visible = false;
    g.add(papel);
    robot.add(g);
    registrar('s:' + nombre, g);
    sensores[nombre] = { g, em, haz, papel };
  }

  // ---------- Ruedas y motores ----------
  const ruedas = {};
  for (const [lado, z] of [
    ['I', -(APROX.distanciaRuedas / 2)],
    ['D', APROX.distanciaRuedas / 2],
  ]) {
    const eje = new THREE.Group();
    eje.position.set(0, APROX.radioRueda, z);
    const rueda = new THREE.Group();
    const neum = new THREE.Mesh(new THREE.CylinderGeometry(APROX.radioRueda, APROX.radioRueda, 13, 36), mats.goma);
    neum.rotation.x = Math.PI / 2;
    rueda.add(neum);
    const llanta = new THREE.Mesh(new THREE.CylinderGeometry(14, 14, 13.4, 28), mats.llanta);
    llanta.rotation.x = Math.PI / 2;
    rueda.add(llanta);
    for (let i = 0; i < 3; i++) {
      const radio = caja(THREE, 26, 3, 14, mats.goma);
      radio.rotation.z = (i * Math.PI) / 3;
      rueda.add(radio);
    }
    eje.add(rueda);
    robot.add(eje);
    const motor = new THREE.Group();
    const cuerpoM = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 15, 16), mats.motor);
    cuerpoM.rotation.x = Math.PI / 2;
    cuerpoM.position.z = -Math.sign(z) * 9;
    motor.add(cuerpoM);
    const reductora = caja(THREE, 10, 12, 9, mats.oro);
    reductora.position.z = Math.sign(z) * 3;
    motor.add(reductora);
    motor.position.set(0, APROX.radioRueda, z - Math.sign(z) * 16);
    robot.add(motor);
    const id = lado === 'I' ? 'motorI' : 'motorD';
    registrar(id, motor, { ancla: V(0, 13, z - Math.sign(z) * 14), donde: 'dentro', texto: lado === 'I' ? 'Motor izq.' : 'Motor der.' });
    registrar(id, neum);
    ruedas[lado] = { rueda, neum };
  }

  // ---------- Rueda de apoyo ----------
  const apoyo = new THREE.Group();
  const bola = new THREE.Mesh(new THREE.SphereGeometry(6, 18, 12), mats.metal);
  bola.position.y = 6;
  apoyo.add(bola);
  const soporte = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 14, 16), mats.placa2);
  soporte.position.y = 18;
  apoyo.add(soporte);
  apoyo.position.set(70, 0, 0);
  robot.add(apoyo);
  registrar('apoyo', apoyo, { ancla: V(70, 2, 0), donde: 'abajo', texto: 'Rueda de apoyo' });

  // ---------- Ultrasonidos: delante, enchufado al borde de la placa ----------
  const us = new THREE.Group();
  const usPlaca = caja(THREE, 1.6, 20, 45, mats.ultra);
  us.add(usPlaca);
  const transductores = [];
  for (const z of [-13, 13]) {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 12, 24), mats.metal);
    t.rotation.z = Math.PI / 2;
    t.position.set(6.5, 1, z);
    us.add(t);
    const rejilla = new THREE.Mesh(new THREE.CircleGeometry(6.6, 24), new THREE.MeshStandardMaterial({ color: 0x3b3e3f, roughness: 0.9 }));
    rejilla.rotation.y = Math.PI / 2;
    rejilla.position.set(12.6, 1, z);
    us.add(rejilla);
    transductores.push(t);
  }
  us.position.set(76, 39, 0);
  robot.add(us);
  registrar('ultrasonidos', us, { ancla: V(PUNTOS.ultrasonidos.x, 52, 0), texto: 'Ultrasonidos' });

  // ---------- Faros (LED rojos) en las esquinas delanteras ----------
  const faros = {};
  const farosG = new THREE.Group();
  for (const [lado, z] of [
    ['I', -27],
    ['D', 27],
  ]) {
    const f = new THREE.Group();
    const cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 5, 14), mats.faroOff);
    cuerpo.rotation.z = Math.PI / 2;
    f.add(cuerpo);
    const punta = new THREE.Mesh(new THREE.SphereGeometry(2.6, 14, 10), mats.faroOff);
    punta.position.x = 2.5;
    f.add(punta);
    f.position.set(PUNTOS.faroD.x, PUNTOS.faroD.y, z);
    farosG.add(f);
    faros[lado] = { g: f, cuerpo, punta };
  }
  robot.add(farosG);
  registrar('faros', farosG, { ancla: V(PUNTOS.faroD.x + 3, 24, 27), texto: 'Faros' });

  // ---------- Receptor de infrarrojos (P16), en el borde delantero ----------
  const ir = new THREE.Group();
  const irBase = caja(THREE, 4, 3, 5, mats.chip);
  ir.add(irBase);
  const irDomo = new THREE.Mesh(new THREE.SphereGeometry(1.9, 14, 10), mats.irDomo);
  irDomo.position.set(2, 0.4, 0);
  ir.add(irDomo);
  ir.position.set(PUNTOS.ir.x, PUNTOS.ir.y - 0.5, PUNTOS.ir.z);
  robot.add(ir);
  registrar('ir', ir, { ancla: V(PUNTOS.ir.x + 2, PUNTOS.ir.y, PUNTOS.ir.z), texto: 'Receptor IR' });

  // ---------- micro:bit en su ranura, con la pantalla hacia delante ----------
  const mb = new THREE.Group();
  const ranura = caja(THREE, 8, 7, 58, mats.chip);
  ranura.position.set(0, 3.5, 0);
  mb.add(ranura);
  const tarjeta = caja(THREE, 1.6, 42, 52, mats.microbit);
  tarjeta.position.set(0, 26, 0);
  mb.add(tarjeta);
  const conector = caja(THREE, 1.8, 5, 52, mats.oro);
  conector.position.set(0, 7.5, 0);
  mb.add(conector);
  const leds = [];
  // Vista desde delante del robot: la columna 0 queda a la izquierda de quien mira,
  // que es el lado derecho del robot (+z)
  for (let f = 0; f < 5; f++)
    for (let c = 0; c < 5; c++) {
      const l = caja(THREE, 0.8, 2.1, 1.3, mats.ledOff);
      l.position.set(1.0, 36 - f * 4.4, 8.8 - c * 4.4);
      mb.add(l);
      leds.push(l);
    }
  // Botones A (a la izquierda de quien mira la pantalla) y B
  const botones = {};
  for (const [b, z] of [
    ['A', 17],
    ['B', -17],
  ]) {
    const boton = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 1.6, 14), mats.metal);
    boton.rotation.z = Math.PI / 2;
    boton.position.set(1.2, 27, z);
    mb.add(boton);
    botones[b] = boton;
  }
  // Logo táctil, arriba
  const logo = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.8, 8, 20), mats.oro);
  logo.rotation.y = Math.PI / 2;
  logo.position.set(1.0, 44, 0);
  logo.scale.set(1, 0.7, 1.5);
  mb.add(logo);
  mb.position.set(50, 27.6, 0);
  robot.add(mb);
  registrar('microbit', mb, { ancla: V(PUNTOS.microbit.x, PUNTOS.microbit.y, 0) });

  // ---------- Chip del Maqueen y bus I2C ----------
  const chip = caja(THREE, 9, 1.6, 9, mats.chip);
  chip.position.set(PUNTOS.chip.x, 28.4, PUNTOS.chip.z);
  robot.add(chip);
  registrar('chip', chip, { ancla: V(PUNTOS.chip.x, 30, PUNTOS.chip.z), texto: 'Chip del Maqueen' });
  const rutaBus = new THREE.CatmullRomCurve3([V(46, 28.1, 6), V(36, 28.1, 14), V(24, 28.1, 18), V(PUNTOS.chip.x + 4, 28.1, PUNTOS.chip.z)]);
  const bus = new THREE.Mesh(new THREE.TubeGeometry(rutaBus, 40, 0.7, 6, false), mats.bus);
  robot.add(bus);
  // Pista de P15 (datos de los LED RGB) y de P0 (zumbador), para las animaciones
  const rutaP15 = new THREE.CatmullRomCurve3([V(46, 28.1, -4), V(20, 28.1, -10), V(-10, 28.1, -18), V(-36, 27.0, -24), V(-40, 25.6, -26)]);
  const rutaP0 = new THREE.CatmullRomCurve3([V(46, 28.1, 12), V(42, 28.1, 19), V(37, 28.1, 24), V(PUNTOS.zumbador.x + 3, 28.4, PUNTOS.zumbador.z)]);

  // ---------- Zumbador (comparte P0) y su interruptor, en el lado derecho ----------
  const zumbador = new THREE.Group();
  const zCuerpo = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 6, 24), mats.zumbador);
  zCuerpo.position.y = 3;
  zumbador.add(zCuerpo);
  const zAgujero = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.3, 10), mats.chip);
  zAgujero.position.y = 6.1;
  zumbador.add(zAgujero);
  zumbador.position.set(PUNTOS.zumbador.x, 28.4, PUNTOS.zumbador.z);
  robot.add(zumbador);
  registrar('zumbador', zumbador, { ancla: V(PUNTOS.zumbador.x, 35, PUNTOS.zumbador.z), texto: 'Zumbador (P0)' });
  const interruptor = new THREE.Group();
  interruptor.add(caja(THREE, 7, 3, 4, mats.chip));
  const palanca = caja(THREE, 2, 2.4, 2.4, mats.interruptor);
  palanca.position.set(1.6, 2.4, 0);
  interruptor.add(palanca);
  interruptor.position.set(60, 29, 23);
  robot.add(interruptor);
  registrar('interruptor', interruptor, { ancla: V(60, 31, 23), texto: 'Interruptor del zumbador' });

  // ---------- Interruptor de encendido (POWER) y conector de las pilas ----------
  const encendido = new THREE.Group();
  encendido.add(caja(THREE, 9, 4, 5, mats.metal));
  const palancaOn = caja(THREE, 2.4, 2.6, 2.6, mats.chip);
  palancaOn.position.set(-1.8, 3.2, 0);
  encendido.add(palancaOn);
  encendido.position.set(PUNTOS.encendido.x, 29.6, PUNTOS.encendido.z);
  robot.add(encendido);
  registrar('encendido', encendido, { ancla: V(PUNTOS.encendido.x, PUNTOS.encendido.y + 2, PUNTOS.encendido.z), texto: 'Interruptor de encendido' });
  const conectorPilas = caja(THREE, 6, 5, 7, mats.interruptor);
  conectorPilas.position.set(40, 30.1, 24);
  robot.add(conectorPilas);
  // Cable rojo y negro del conector al portapilas, por fuera del piso de arriba
  for (const [dz, color] of [
    [-1.2, 0x1b1b1b],
    [1.2, 0xd63a2f],
  ]) {
    const ruta = new THREE.CatmullRomCurve3([V(40, 32.6, 24 + dz), V(37, 45, 35 + dz), V(30, 58, 38.5 + dz), V(24, 63.5, 34 + dz), V(18, 65, 29 + dz)]);
    robot.add(new THREE.Mesh(new THREE.TubeGeometry(ruta, 24, 0.8, 6, false), new THREE.MeshStandardMaterial({ color, roughness: 0.6 })));
  }

  // ---------- Piso de arriba: el portapilas con 4 pilas AA ----------
  const gPiso = new THREE.BoxGeometry(84, 1.6, 72);
  const piso = new THREE.Mesh(gPiso, mats.piso);
  piso.position.set(-8, 60, 0);
  robot.add(piso);
  const bordePiso = new THREE.LineSegments(new THREE.EdgesGeometry(gPiso), new THREE.LineBasicMaterial({ color: 0x7c8a86 }));
  bordePiso.position.copy(piso.position);
  robot.add(bordePiso);
  for (const [x, z] of [
    [-44, -30],
    [-44, 30],
    [28, -30],
    [28, 30],
  ]) {
    const separador = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 32, 6), mats.laton);
    separador.position.set(x, 43.6, z);
    robot.add(separador);
  }
  // Portapilas abierto por arriba: las pilas van de delante atrás, una al lado de otra
  // (pilas AA: 14,5 mm de diámetro y 50,5 mm de largo)
  const portapilas = new THREE.Group();
  const LARGO = 58;
  const ANCHO = 64;
  const ALTO = 13;
  const fondo = caja(THREE, LARGO, 2, ANCHO, mats.portapilas);
  fondo.position.y = 1;
  portapilas.add(fondo);
  for (const [w, d, x, z, h] of [
    [LARGO, 2, 0, -ANCHO / 2 + 1, ALTO],
    [LARGO, 2, 0, ANCHO / 2 - 1, ALTO],
    [2, ANCHO, -LARGO / 2 + 1, 0, ALTO],
    [2, ANCHO, LARGO / 2 - 1, 0, ALTO],
    // Nervios bajos entre pila y pila
    [LARGO - 4, 0.8, 0, -15, 7],
    [LARGO - 4, 0.8, 0, 0, 7],
    [LARGO - 4, 0.8, 0, 15, 7],
  ]) {
    const pared = caja(THREE, w, h, d, mats.portapilas);
    pared.position.set(x, h / 2, z);
    portapilas.add(pared);
  }
  portapilas.position.set(PUNTOS.bateria.x, 60.8, 0);
  robot.add(portapilas);
  const pilas = new THREE.Group();
  for (const [i, z] of [-22.5, -7.5, 7.5, 22.5].entries()) {
    const pila = new THREE.Mesh(new THREE.CylinderGeometry(7.25, 7.25, 50.5, 24), mats.bateria);
    pila.rotation.z = Math.PI / 2;
    pila.position.set(0, 0, z);
    pilas.add(pila);
    // El polo positivo: un botón en un extremo, alternando, como van en serie
    const polo = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 1.6, 12), mats.metal);
    polo.rotation.z = Math.PI / 2;
    polo.position.set(i % 2 ? -26 : 26, 0, z);
    pilas.add(polo);
  }
  pilas.position.set(PUNTOS.bateria.x, 62.8 + 7.25, 0);
  robot.add(pilas);
  registrar('bateria', pilas, { ancla: V(PUNTOS.bateria.x, PUNTOS.bateria.y, 0), texto: 'Pilas AA' });
  registrar('bateria', portapilas);
  // La versión de pilas AA no tiene indicador de carga (sí la de batería 18650)
  const ledsBat = [];

  // ---------- LED RGB de los bajos ----------
  const rgb = new THREE.Group();
  const rgbLeds = [];
  for (const [x, z] of [
    [24, -26],
    [-40, -26],
    [-40, 26],
    [24, 26],
  ]) {
    const mat = new THREE.MeshStandardMaterial({ color: 0xe9ece6, roughness: 0.4, emissive: 0x000000, emissiveIntensity: 1.8 });
    const l = caja(THREE, 4, 1, 4, mat);
    l.position.set(x, 25.4, z);
    rgb.add(l);
    rgbLeds.push(l);
  }
  robot.add(rgb);
  registrar('rgb', rgb, { ancla: V(-40, 24.4, -26), donde: 'abajo', texto: 'LED RGB' });

  // ---------- Tecla de calibración: en la oreja izquierda, delante de la rueda ----------
  const tecla = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 2.4, 14), mats.tecla);
  tecla.position.set(33, 28.8, -45);
  robot.add(tecla);
  registrar('tecla', tecla, { ancla: V(33, 32, -45), texto: 'Tecla de calibración' });

  // Esquinas de una caja que envuelve el robot (para saber qué ocupa en pantalla)
  const esquinas = [];
  for (const x of [-52, 92]) for (const y of [0, 82]) for (const z of [-52, 52]) esquinas.push(V(x, y, z));

  return {
    robot,
    mats,
    transparentes,
    bordes: [bordePlaca, bordePiso],
    sensores,
    ruedas,
    leds,
    ledsBat,
    faros,
    rgbLeds,
    zumbador,
    palanca,
    ir,
    irDomo,
    us,
    transductores,
    mb,
    botones,
    chip,
    rutaBus,
    rutaP15,
    rutaP0,
    esquinas,
  };
}

// Transparencia: igual para todas las escenas
export function ponerTransparencia(m, tr) {
  m.mats.placa.opacity = tr ? 0.16 : 1;
  m.mats.placa2.opacity = tr ? 0.3 : 1;
  m.mats.piso.opacity = tr ? 0.14 : 1;
  m.mats.goma.opacity = tr ? 0.45 : 1;
  m.mats.llanta.opacity = tr ? 0.45 : 1;
  m.mats.portapilas.opacity = tr ? 0.25 : 1;
  for (const x of m.transparentes) x.depthWrite = !tr;
  for (const b of m.bordes) b.visible = tr;
}
