// Bit a bit · La extensión de ACEBOTT para MakeCode (github.com/ACEBOTTteam/Acebott)
// Bloques de los módulos de la caja y lo que hace cada uno, copiado de su código
// (Acebott.ts, AcebottBMP280.ts). La extensión no trae traducción al español: en
// MakeCode sus bloques salen en inglés, y aquí también.
//
// Lo que la micro:bit lee por I2C de una dirección donde no contesta nadie son ceros
// (pxt-microbit, pins.cpp: i2cReadBuffer devuelve el búfer vacío sin mirar el error).
import { definirBloque, definirEnum } from '../mk/programa.js';

// ---------------------------------------------------------------------------
// Enumeraciones de la extensión (fuera de su espacio de nombres, como en el código)
const PINES_ANALOG = ['P0', 'P1', 'P2'];
definirEnum('AnalogReadPin', Object.fromEntries(PINES_ANALOG.map((p) => [p, [p, p, `AnalogReadPin.${p}`, `AnalogReadPin.${p}`]])));
// Sin texto propio: MakeCode enseña el nombre del valor
definirEnum('BMP280_I2C_ADDRESS', { ADDR_0x76: ['ADDR_0x76', 'ADDR_0x76'], ADDR_0x77: ['ADDR_0x77', 'ADDR_0x77'] });
export const DIR_BMP = { ADDR_0x76: 0x76, ADDR_0x77: 0x77 };

const B = (nombre, forma, texto, args = [], extra = {}) => definirBloque(nombre, 'acebott', forma, texto, texto, args, extra);
// Sensores
B('Acebott.sensor_temperature', 'valor', 'Pin $0 reads the analog value of the LM35', [{ e: 'AnalogPin' }]);
B('Acebott.bmp280GetTemperature', 'valor', 'BMP280 get temperature (°C)');
B('Acebott.bmp280GetPressure', 'valor', 'BMP280 get pressure (hPa)');
B('Acebott.bmp280SetAddress', 'sentencia', 'BMP280 set address $0', [{ e: 'BMP280_I2C_ADDRESS' }]);
B('Acebott.Mosisture', 'valor', 'Mosisture Sensor at $0 get value', [{ e: 'AnalogReadPin' }]);
B('Acebott.SoundSensor', 'valor', 'Sound Sensor at $0 get value', [{ e: 'AnalogReadPin' }]);

// ---------------------------------------------------------------------------
// Lo que hacen. El laboratorio da el «bus»: quién contesta en cada dirección y
// los aparatos que hay conectados.
//   bus.responde(dir) → true si un aparato contesta en esa dirección
//   bus.bmp280 → { temperatura() en °C, presion() en Pa }
export function apiAcebott(bus = {}) {
  const estado = (pl) =>
    (pl.microbit.est.acebott ||= {
      bmpDir: 0x76, // la que usa la extensión si no se dice otra
      bmpIniciado: false,
      bmpCalibrado: false,
      bmpP: 0,
    });
  const leer = (pl, pin) => pl.microbit.api['pins.analogReadPin'](pl, [pin]);
  const i2c = (pl, dir, que) => {
    const ok = !!bus.responde?.(dir);
    pl.emitir({ tipo: 'i2c', dir, ok, que });
    return ok;
  };
  // El BMP280 lee su calibración una sola vez, al primer uso (o al cambiar de
  // dirección). Si entonces no contestó, se queda con ceros y las cuentas dan 0.
  function iniciarBMP(pl) {
    const a = estado(pl);
    a.bmpIniciado = true;
    a.bmpCalibrado = i2c(pl, a.bmpDir, 'calibración');
  }
  function medirBMP(pl) {
    const a = estado(pl);
    if (!a.bmpIniciado) iniciarBMP(pl);
    const ok = i2c(pl, a.bmpDir, 'medida') && a.bmpCalibrado;
    // Temperatura: centésimas de grado divididas (división entera) entre 100
    const t = ok ? Math.trunc(Math.round(bus.bmp280.temperatura() * 100) / 100) : 0;
    // Presión en pascales (entero). Con la calibración a cero, el código no la cambia.
    if (ok) a.bmpP = Math.round(bus.bmp280.presion());
    return { t, p: a.bmpP, ok };
  }
  return {
    // (lectura / 1023) × 3,3 × 100, con dos decimales
    'Acebott.sensor_temperature': (pl, [pin]) => {
      const t = (leer(pl, pin) / 1023) * 3.3 * 100;
      return Math.round(t * 100) / 100;
    },
    'Acebott.Mosisture': (pl, [pin]) => leer(pl, pin),
    'Acebott.SoundSensor': (pl, [pin]) => leer(pl, pin),
    'Acebott.bmp280GetTemperature': (pl) => medirBMP(pl).t,
    // getPressureHpa: Math.round(p / 100 * 100) / 100
    'Acebott.bmp280GetPressure': (pl) => Math.round(medirBMP(pl).p) / 100,
    'Acebott.bmp280SetAddress': (pl, [dir]) => {
      const a = estado(pl);
      a.bmpDir = DIR_BMP[dir] ?? 0x76;
      iniciarBMP(pl); // setAddress vuelve a leer la calibración
    },
  };
}
