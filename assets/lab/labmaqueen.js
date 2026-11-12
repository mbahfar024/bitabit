// Bit a bit · Lo común de los laboratorios del Maqueen (etapa 2 y proyecto final)
// Monta la escena 3D con el robot, explica cada pieza al tocarla y anima lo que
// pasa por dentro (mensajes I2C, datos de los LED RGB, el eco del ultrasonidos…)
// a partir de los eventos del mismo modelo que mueve la simulación.
import { crearEscenaMaqueen } from './maqueen3d.js';
import { nf0 } from './base.js';

// Qué es cada pieza. «uso» lo pone cada laboratorio.
export const PIEZAS_MAQUEEN = {
  microbit: ['micro:bit', 'El cerebro: ejecuta el programa. Va de pie en su ranura, justo detrás del ultrasonidos, con la pantalla hacia delante. Habla con el chip del robot por el bus I2C (pines P19 y P20).'],
  chip: ['Chip del Maqueen', 'El microcontrolador del robot, en la dirección I2C 0x10. Guarda las órdenes de la micro:bit y con ellas mueve los motores, enciende los faros y lee los sensores de línea.'],
  motorI: ['Motor izquierdo', 'Motor N20 con reductora metálica. El chip le da más o menos potencia según la orden, de 0 a 255, y en el sentido que se le pide.'],
  motorD: ['Motor derecho', 'Motor N20 con reductora metálica. El chip le da más o menos potencia según la orden, de 0 a 255, y en el sentido que se le pide.'],
  apoyo: ['Rueda de apoyo', 'Sostiene el frente del robot. No tiene motor: el robot gira porque una rueda va más deprisa que la otra.'],
  bateria: ['Pilas AA', 'Cuatro pilas AA en el portapilas del piso de arriba: alcalinas de 1,5 V o recargables NiMH de 1,2 V, todas iguales. Esta versión del robot no tiene indicador de carga: con las pilas gastadas, los motores van más despacio.'],
  encendido: ['Interruptor de encendido', 'El interruptor POWER, en el lado derecho, junto al ultrasonidos. Al lado está el conector del cable de las pilas. Apágalo antes de cambiar las pilas.'],
  ultrasonidos: ['Ultrasonidos SR04', 'Un transductor lanza un chasquido de ultrasonidos y el otro escucha el eco. La micro:bit mide cuánto tarda: TRIG va a P13 y ECHO a P14.'],
  faros: ['Faros', 'Dos LED rojos en las esquinas delanteras. No van a un pin de la micro:bit: los enciende el chip del robot cuando se lo pide por I2C.'],
  rgb: ['LED RGB de los bajos', 'Cuatro LED de colores, numerados del 0 al 3, encadenados en el pin P15. Cada uno se queda con su color (24 bits) y pasa el resto al siguiente.'],
  tecla: ['Tecla de calibración', 'Sirve para ajustar los sensores de línea al suelo y a la luz del aula, con el robot sobre la zona negra del mapa.'],
  zumbador: ['Zumbador', 'Suena con la música de la micro:bit, que sale por P0. La micro:bit V2 suena a la vez por su altavoz.'],
  interruptor: ['Interruptor del zumbador', 'Desconecta el zumbador de P0. DFRobot lo recomienda si usas P0 para otra cosa o si ya te basta el altavoz de la micro:bit V2.'],
  ir: ['Receptor de infrarrojos', 'Recibe los códigos de un mando a distancia de infrarrojos. Va al pin P16.'],
  sensor: ['Sensores de línea', 'Cinco sensores de infrarrojos en los bajos (L2, L1, M, R1 y R2): distinguen la cinta negra del suelo claro.'],
};

// Estado que dibuja la escena, sacado de la micro:bit y del robot
export function estadoRobot(placa) {
  const est = placa.microbit.est;
  const aj = placa.maqueen.ajustes;
  const t = placa.mundo?.t ?? 0;
  const tono = est.tono && est.tono.f > 0 && t < est.tono.hasta;
  return {
    pantalla: est.pantallaActiva ? est.pantalla : null,
    zumbadorOn: aj.zumbadorOn,
    sonando: { zumbador: tono && aj.zumbadorOn && est.tono.pin === 'P0', altavoz: tono && est.altavoz, f: tono ? est.tono.f : 0 },
  };
}

// La escena del robot con lo común ya puesto
export function montarEscenaMaqueen({ ui, placa, mesa, extras, valores, vistaInicial, encuadre, objetivoAdelante, centroICR, usos = {}, nombres, prioridad, ocultar, alPulsarSuelo, alArrastrar, alSoltar, arrastrables, plano2d, piezasExtra = {} }) {
  const escena = document.getElementById('escena');
  const vista = crearEscenaMaqueen({
    contenedor: escena,
    canvas: document.getElementById('lienzo'),
    capaEtiquetas: document.getElementById('etiquetas'),
    mesa,
    robot: () => placa.maqueen.rob,
    estado: () => estadoRobot(placa),
    extras,
    valores,
    nombres,
    prioridad,
    ocultar,
    vistaInicial,
    encuadre,
    objetivoAdelante,
    centroICR,
    alPulsarSuelo,
    alArrastrar,
    alSoltar,
    arrastrables,
    plano2d,
    alPulsarPieza(id) {
      const clave = id.startsWith('s:') ? 'sensor' : id;
      const info = piezasExtra[clave] || PIEZAS_MAQUEEN[clave];
      if (!info) return;
      ui.mostrarPieza(info[0], info[1], usos[clave] || info[2] || 'No se usa en este laboratorio.');
    },
  });
  // Animaciones a partir de los eventos del modelo
  let ultimoEco = -1e9;
  placa.mundo.observadores.push((ev) => {
    if (ev.placa && ev.placa !== placa.nombre) return;
    if (ev.tipo === 'i2c' && !ev.sinRespuesta) vista.pulso('i2c', { vuelta: ev.que === 'linea' || ev.que === 'version' });
    if (ev.tipo === 'rgb' && !ev.sinEfecto) vista.pulso('p15', { dur: 380 });
    // El eco se dibuja a cámara lenta: como mucho uno cada 0,9 s
    if (ev.tipo === 'ultrasonido' && performance.now() - ultimoEco > 900) {
      ultimoEco = performance.now();
      vista.eco(ev);
    }
  });
  return vista;
}

// Textos del monitor que se repiten
export const fmt = {
  orden: (orden, dir) => (orden ? `${dir ? 'atrás' : 'adelante'} ${orden}` : '0 (parado)'),
  mms: (v) => `${nf0.format(Math.abs(v))} mm/s${Math.abs(v) > 1 && v < 0 ? ' hacia atrás' : ''}`,
  bytes: (b) => b.map((x) => '0x' + x.toString(16).toUpperCase().padStart(2, '0')).join(' '),
};

// El sonido de verdad está en sonido.js (también lo usan los laboratorios del banco)
export { crearSonido } from './sonido.js';
