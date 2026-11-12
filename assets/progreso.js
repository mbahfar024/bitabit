// Bit a bit · Progreso guardado en este navegador (localStorage).
// Si el navegador no deja guardar, la web funciona igual: solo no recuerda.
const CLAVE = 'bitabit.progreso.v1';

export function leerProgreso() {
  try {
    const p = JSON.parse(localStorage.getItem(CLAVE));
    return p && typeof p === 'object' && p.labs ? p : { labs: {} };
  } catch {
    return { labs: {} };
  }
}

export function guardarProgreso(p) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(p));
    return true;
  } catch {
    return false;
  }
}

export function datosLab(id) {
  return leerProgreso().labs[id] || {};
}

export function actualizarLab(id, cambios) {
  const p = leerProgreso();
  p.labs[id] = { ...(p.labs[id] || {}), ...cambios };
  return guardarProgreso(p);
}

export function labsHechos() {
  const p = leerProgreso();
  return Object.entries(p.labs)
    .filter(([, v]) => v && v.hecho)
    .map(([k]) => k);
}
