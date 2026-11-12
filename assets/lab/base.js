// Bit a bit · Controlador común de los laboratorios
// Monta el programa (bloques y Python), los botones «Siguiente paso»,
// «Automático» y «Reiniciar», el monitor, los controles de «Estropéalo a
// propósito», las preguntas, la comprobación y el progreso. Cada laboratorio
// aporta su escena y su modelo con crearLab().
import { montarPrograma, textoCodigo } from '../mk/programa.js';
import { datosLab, actualizarLab } from '../progreso.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const nf0 = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 });
export const nf1 = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const nf2 = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const lista = (xs) => (xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' y ' + xs[xs.length - 1]);

export function iniciarLaboratorio(crearLab) {
  const raiz = document.querySelector('[data-lab]');
  const ID_LAB = raiz.dataset.lab;
  const ui = {
    $,
    $$,
    // Monitor: cada dato tiene data-m="clave"
    poner(clave, texto) {
      const el = document.querySelector(`[data-m="${clave}"]`);
      if (el && el.textContent !== String(texto)) el.textContent = texto;
    },
    ponerHTML(clave, html) {
      const el = document.querySelector(`[data-m="${clave}"]`);
      if (el && el.innerHTML !== html) el.innerHTML = html;
    },
    barra(clave, fraccion) {
      const el = document.querySelector(`[data-mb="${clave}"]`);
      if (el) el.style.width = `${Math.max(0, Math.min(1, fraccion)) * 100}%`;
    },
    clase(clave, nombre, on) {
      const el = document.querySelector(`[data-m="${clave}"]`)?.closest('[data-mc]') || document.querySelector(`[data-mc="${clave}"]`);
      el?.classList.toggle(nombre, !!on);
    },
    aviso(texto) {
      const a = $('#escenaAviso');
      if (!a) return;
      a.hidden = !texto;
      if (a.textContent !== (texto || '')) a.textContent = texto || '';
    },
    pie(texto) {
      const p = $('#escenaPie');
      if (p && p.textContent !== texto) p.textContent = texto;
    },
    narrar(html) {
      $('#narracion').innerHTML = html;
    },
    mostrarPieza(titulo, texto, uso) {
      $('#piezaTitulo').textContent = titulo;
      $('#piezaTexto').textContent = texto;
      $('#piezaUso').textContent = uso || '';
      $('#piezaInfo').hidden = false;
    },
    valorControl(id) {
      const el = document.getElementById(id);
      if (!el) return null;
      if (el.type === 'checkbox') return el.checked;
      if (el.type === 'range') return Number(el.value);
      const b = el.querySelector('[aria-pressed="true"]');
      return b ? b.dataset.valor : null;
    },
  };
  const lab = crearLab(ui);

  // ---------------- Programa ----------------
  const programas = lab.programas || [{ nombre: null, programa: lab.programa }];
  let progActual = 0;
  let prog = null;
  function montar(i) {
    progActual = i;
    prog = montarPrograma({ bloques: $('#bloques'), python: $('#python'), programa: programas[i].programa, idioma: idioma });
    lab.alCambiarPrograma?.(i);
  }
  let idioma = 'es';
  montar(0);
  ui.resaltar = (r, cual = null) => {
    if (cual != null && cual !== progActual) return;
    prog?.resaltar(r);
  };
  ui.programaVisible = () => progActual;
  // Cuando un control cambia el programa (p. ej. añade bloques), se vuelve a dibujar
  ui.cambiarPrograma = (nuevo, i = progActual) => {
    programas[i].programa = nuevo;
    if (i === progActual) {
      prog = montarPrograma({ bloques: $('#bloques'), python: $('#python'), programa: nuevo, idioma });
    }
  };
  // Cuando el laboratorio cambia un número del programa (p. ej. la velocidad de un
  // motor), se vuelven a dibujar los bloques y el Python
  ui.repintarPrograma = () => {
    prog = montarPrograma({ bloques: $('#bloques'), python: $('#python'), programa: programas[progActual].programa, idioma });
  };
  $$('#selPrograma button').forEach((b) =>
    b.addEventListener('click', () => {
      $$('#selPrograma button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      montar(Number(b.dataset.i));
    })
  );
  $$('.programa [data-tab]').forEach((b) =>
    b.addEventListener('click', () => {
      $$('.programa [data-tab]').forEach((x) => {
        const on = x === b;
        x.setAttribute('aria-selected', String(on));
        x.setAttribute('aria-pressed', String(on));
      });
      $('#bloques').hidden = b.dataset.tab !== 'bloques';
      $('#python').hidden = b.dataset.tab !== 'python';
      $('#idiomaBloques').hidden = b.dataset.tab !== 'bloques';
    })
  );
  $$('#idiomaBloques button').forEach((b) =>
    b.addEventListener('click', () => {
      $$('#idiomaBloques button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      idioma = b.dataset.lang;
      prog.idiomaBloques(idioma);
    })
  );
  async function copiar(texto, tipo) {
    const aviso = $('#copiadoAviso');
    try {
      await navigator.clipboard.writeText(texto);
      aviso.textContent = tipo === 'py' ? 'Python copiado.' : 'JavaScript copiado: pégalo en la pestaña JavaScript de MakeCode.';
    } catch {
      const ta = $('#copiaManual');
      ta.hidden = false;
      ta.value = texto;
      ta.focus();
      ta.select();
      aviso.textContent = 'Tu navegador no deja copiar desde aquí: el texto está seleccionado, cópialo con Ctrl+C.';
    }
  }
  $('#copiarPython')?.addEventListener('click', () => copiar(textoCodigo(programas[progActual].programa, 'py'), 'py'));
  $('#copiarJS')?.addEventListener('click', () => copiar(textoCodigo(programas[progActual].programa, 'js'), 'js'));

  // ---------------- Escena ----------------
  const escena = $('#escena');
  const vista = lab.montarEscena(escena, ui);
  $('#piezaCerrar')?.addEventListener('click', () => ($('#piezaInfo').hidden = true));
  $$('#vistas button').forEach((b) =>
    b.addEventListener('click', () => {
      $$('#vistas button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      vista.ponerVista?.(b.dataset.vista);
    })
  );
  $$('.opciones [data-opcion]').forEach((b) =>
    b.addEventListener('click', () => {
      const v = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(v));
      vista.opcion?.(b.dataset.opcion, v);
    })
  );

  // ---------------- Tiempo ----------------
  let modo = 'pausa';
  let factor = 1;
  const nFases = $$('#fases li').length;
  function marcarFases(i) {
    $$('#fases li').forEach((li, k) => {
      li.classList.toggle('activa', k === i);
      li.classList.toggle('hecha', i != null && i >= 0 && k < i);
    });
  }
  ui.marcarFases = marcarFases;
  function ponerModo(m) {
    modo = m;
    const auto = m === 'auto';
    $('#btnAuto').setAttribute('aria-pressed', String(auto));
    $('#btnAutoTxt').textContent = auto ? 'Pausa' : 'Automático';
    if (auto) {
      marcarFases(null);
      ui.narrar(lab.narracionAuto?.() || 'En marcha.');
      lab.alEmpezarAuto?.();
    }
  }
  ui.ponerModo = ponerModo;
  ui.modo = () => modo;
  $('#btnAuto').addEventListener('click', () => ponerModo(modo === 'auto' ? 'pausa' : 'auto'));
  $('#velocidad')?.addEventListener('change', (e) => (factor = Number(e.target.value)));
  $('#btnPaso').addEventListener('click', () => {
    if (modo === 'auto') ponerModo('pausa');
    const r = lab.paso();
    if (!r) return;
    if (r.fase != null) marcarFases(r.fase);
    if (r.html) ui.narrar(r.html);
    if (r.resaltar) ui.resaltar(r.resaltar, r.programa ?? null);
    lab.monitor?.();
  });
  function reiniciar() {
    lab.reiniciar();
    marcarFases(null);
    ui.resaltar({});
    $('#piezaInfo') && ($('#piezaInfo').hidden = true);
    lab.monitor?.();
  }
  ui.reiniciar = reiniciar;
  $('#btnReiniciar').addEventListener('click', () => {
    reiniciar();
    ponerModo('pausa');
    ui.narrar(lab.narracionInicio());
  });

  // ---------------- Estropéalo a propósito ----------------
  function cambiarControl(id, valor) {
    lab.cambiar?.(id, valor);
    $('#explica').innerHTML = (lab.explicar?.() || []).map((p) => `<p>${p}</p>`).join('');
    lab.monitor?.();
  }
  $$('[data-control]').forEach((grupo) => {
    const id = grupo.dataset.control;
    if (grupo.matches('.segmento')) {
      grupo.querySelectorAll('button').forEach((b) =>
        b.addEventListener('click', () => {
          grupo.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
          cambiarControl(id, b.dataset.valor);
        })
      );
    } else if (grupo.type === 'checkbox') grupo.addEventListener('change', () => cambiarControl(id, grupo.checked));
    else if (grupo.type === 'range') {
      const salida = document.querySelector(`[data-salida="${id}"]`);
      const pintar = () => salida && (salida.textContent = grupo.dataset.formato ? grupo.dataset.formato.replace('{}', nf0.format(Number(grupo.value))) : grupo.value);
      pintar();
      grupo.addEventListener('input', () => {
        pintar();
        cambiarControl(id, Number(grupo.value));
      });
    }
  });
  $('#normalidad')?.addEventListener('click', () => {
    $$('[data-control]').forEach((grupo) => {
      const id = grupo.dataset.control;
      if (grupo.matches('.segmento')) {
        const def = grupo.dataset.defecto ?? '';
        grupo.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.valor === def)));
        lab.cambiar?.(id, def);
      } else if (grupo.type === 'checkbox') {
        grupo.checked = grupo.dataset.defecto === 'true';
        lab.cambiar?.(id, grupo.checked);
      } else if (grupo.type === 'range') {
        grupo.value = grupo.dataset.defecto;
        grupo.dispatchEvent(new Event('input'));
      }
    });
    $('#explica').innerHTML = (lab.explicar?.() || []).map((p) => `<p>${p}</p>`).join('');
    lab.monitor?.();
  });

  // Error común
  $('#probarError')?.addEventListener('click', () => {
    reiniciar();
    const html = lab.probarError?.();
    if (html) ui.narrar(html);
    escena.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  });

  // ---------------- Preguntas, comprobación y progreso ----------------
  const RESPUESTAS = Object.fromEntries($$('.pregunta').map((f) => [f.dataset.q, f.dataset.correcta]));
  const guardado = datosLab(ID_LAB);
  function corregir(q, valor, guardar = true) {
    const fs = document.querySelector(`[data-q="${q}"]`);
    const bien = valor === RESPUESTAS[q];
    fs.querySelectorAll('.opcion').forEach((o) => {
      const inp = o.querySelector('input');
      o.classList.toggle('bien', inp.checked && bien);
      o.classList.toggle('mal', inp.checked && !bien);
    });
    const out = fs.querySelector('.respuesta');
    out.hidden = false;
    out.className = 'respuesta ' + (bien ? 'bien' : 'mal');
    out.innerHTML = (bien ? '<strong>Correcto.</strong> ' : '<strong>Todavía no.</strong> ') + fs.dataset.explicacion;
    if (guardar) actualizarLab(ID_LAB, { respuestas: { ...(datosLab(ID_LAB).respuestas || {}), [q]: valor } });
    revisarHecho();
  }
  $$('.pregunta input').forEach((inp) => inp.addEventListener('change', () => corregir(inp.name, inp.value)));
  if (guardado.respuestas)
    for (const [q, v] of Object.entries(guardado.respuestas)) {
      const inp = document.querySelector(`.pregunta input[name="${q}"][value="${v}"]`);
      if (inp) {
        inp.checked = true;
        corregir(q, v, false);
      }
    }
  const checks = $$('#comprobacion input');
  checks.forEach((c, i) => {
    if (guardado.comprobacion?.[i]) c.checked = true;
    c.addEventListener('change', () => {
      actualizarLab(ID_LAB, { comprobacion: checks.map((x) => x.checked) });
      revisarHecho();
    });
  });
  function revisarHecho() {
    const d = datosLab(ID_LAB);
    const preguntasBien = Object.keys(RESPUESTAS).every((q) => d.respuestas?.[q] === RESPUESTAS[q]);
    const hecho = !!d.hecho;
    $('#marcarHecho').textContent = hecho ? 'Quitar la marca de hecho' : 'Marcar como hecho';
    $('#estadoHecho').innerHTML = hecho
      ? '<span class="chip hecho">Hecho</span> Aparece así en la ruta de este navegador.'
      : preguntasBien
        ? 'Las tres preguntas están bien. Cuando hagas la práctica con el material real, márcalo como hecho.'
        : 'Cuando acabes la práctica y las preguntas, márcalo como hecho.';
  }
  $('#marcarHecho').addEventListener('click', () => {
    actualizarLab(ID_LAB, { hecho: !datosLab(ID_LAB).hecho });
    revisarHecho();
  });
  revisarHecho();

  // ---------------- Bucle de dibujo ----------------
  let enPantalla = true;
  new IntersectionObserver((ent) => (enPantalla = ent[0].isIntersecting), { threshold: 0.02 }).observe(escena);
  let tPrev = performance.now();
  let tPanel = 0;
  function cuadro(now) {
    const dt = Math.min(64, now - tPrev);
    tPrev = now;
    if (modo === 'auto' && enPantalla && !document.hidden) lab.avanzar(dt * factor);
    if (enPantalla) vista.dibujar?.(now);
    if (now - tPanel > 100) {
      tPanel = now;
      lab.monitor?.();
      if (modo === 'auto') {
        const r = lab.resaltadoAuto?.();
        if (r) ui.resaltar(r, r.programa ?? null);
      }
    }
    requestAnimationFrame(cuadro);
  }
  ui.narrar(lab.narracionInicio());
  $('#explica').innerHTML = (lab.explicar?.() || []).map((p) => `<p>${p}</p>`).join('');
  lab.monitor?.();
  requestAnimationFrame(cuadro);
  return { lab, ui };
}
