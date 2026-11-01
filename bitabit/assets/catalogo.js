(() => {
  // ../../../../tmp/bitabit-myq0224i/catalogo.js
  var fichas = [...document.querySelectorAll("#catalogo [data-etapa-f]")];
  var botones = [...document.querySelectorAll("[data-etapa-filtro]")];
  var comp = document.getElementById("filtroComp");
  var texto = document.getElementById("filtroTexto");
  var disp = document.getElementById("filtroDisp");
  var cuenta = document.getElementById("filtroCuenta");
  var vacio = document.getElementById("catalogoVacio");
  var etapa = "";
  var normal = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
  function filtrar() {
    const t = normal(texto.value.trim());
    let n = 0;
    for (const f of fichas) {
      const ok = (!etapa || f.dataset.etapaF === etapa) && (!comp.value || f.dataset.comp.split("|").includes(comp.value)) && (!disp.checked || f.dataset.disp === "1") && (!t || f.dataset.texto.includes(t.replace(/^-|-$/g, "")));
      f.hidden = !ok;
      if (ok) n++;
    }
    cuenta.textContent = `${n} de ${fichas.length} laboratorios`;
    vacio.hidden = n > 0;
  }
  botones.forEach(
    (b) => b.addEventListener("click", () => {
      etapa = b.dataset.etapaFiltro;
      botones.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      filtrar();
    })
  );
  comp.addEventListener("change", filtrar);
  texto.addEventListener("input", filtrar);
  disp.addEventListener("change", filtrar);
  filtrar();
})();
