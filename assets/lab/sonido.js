// Bit a bit · Sonido de verdad (opcional): una onda cuadrada a la frecuencia del tono, como la
// que sale por P0. Solo empieza cuando se pulsa el botón (los navegadores lo exigen).
export function crearSonido() {
  let ctx = null;
  let osc = null;
  let gan = null;
  let activo = false;
  return {
    get activo() {
      return activo;
    },
    activar(on) {
      activo = on;
      try {
        if (on && !ctx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          ctx = new AC();
          gan = ctx.createGain();
          gan.gain.value = 0;
          gan.connect(ctx.destination);
          osc = ctx.createOscillator();
          osc.type = 'square';
          osc.connect(gan);
          osc.start();
        }
        if (ctx && on) ctx.resume?.();
        if (gan && !on) gan.gain.setTargetAtTime(0, ctx.currentTime, 0.01);
      } catch {
        activo = false;
      }
    },
    // f en Hz; volumen 0–1 (el zumbador suena más fuerte que el altavoz)
    poner(f, volumen) {
      if (!ctx || !activo) return;
      if (f > 0 && volumen > 0) {
        osc.frequency.setTargetAtTime(f, ctx.currentTime, 0.004);
        gan.gain.setTargetAtTime(0.035 * volumen, ctx.currentTime, 0.004);
      } else gan.gain.setTargetAtTime(0, ctx.currentTime, 0.004);
    },
  };
}
