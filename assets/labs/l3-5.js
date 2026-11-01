(() => {
  // ../../../../tmp/bitabit-myq0224i/mk/programa.js
  var E = (es, en, py, js) => ({ es, en, py, js });
  var ENUMS = {
    Button: { A: E("A", "A", "Button.A", "Button.A"), B: E("B", "B", "Button.B", "Button.B"), AB: E("A+B", "A+B", "Button.AB", "Button.AB") },
    Dimension: {
      X: E("x", "x", "Dimension.X", "Dimension.X"),
      Y: E("y", "y", "Dimension.Y", "Dimension.Y"),
      Z: E("z", "z", "Dimension.Z", "Dimension.Z"),
      Strength: E("fuerza", "strength", "Dimension.STRENGTH", "Dimension.Strength")
    },
    Gesture: {
      Shake: E("agitar", "shake", "Gesture.SHAKE", "Gesture.Shake"),
      LogoUp: E("logotipo hacia arriba", "logo up", "Gesture.LOGO_UP", "Gesture.LogoUp"),
      LogoDown: E("logotipo hacia abajo", "logo down", "Gesture.LOGO_DOWN", "Gesture.LogoDown"),
      ScreenUp: E("pantalla hacia arriba", "screen up", "Gesture.SCREEN_UP", "Gesture.ScreenUp"),
      ScreenDown: E("pantalla hacia abajo", "screen down", "Gesture.SCREEN_DOWN", "Gesture.ScreenDown"),
      TiltLeft: E("inclinar a la izquierda", "tilt left", "Gesture.TILT_LEFT", "Gesture.TiltLeft"),
      TiltRight: E("inclinar a la derecha", "tilt right", "Gesture.TILT_RIGHT", "Gesture.TiltRight")
    },
    ArrowNames: {
      North: E("Norte", "North", "ArrowNames.NORTH", "ArrowNames.North"),
      South: E("Sur", "South", "ArrowNames.SOUTH", "ArrowNames.South"),
      East: E("Este", "East", "ArrowNames.EAST", "ArrowNames.East"),
      West: E("Oeste", "West", "ArrowNames.WEST", "ArrowNames.West")
    },
    TouchButtonEvent: { Pressed: E("presionado", "pressed", "TouchButtonEvent.PRESSED", "TouchButtonEvent.Pressed") },
    RadioPacketProperty: {
      SignalStrength: E("intensidad de la señal", "signal strength", "RadioPacketProperty.SIGNAL_STRENGTH", "RadioPacketProperty.SignalStrength")
    },
    DetectedSound: { Loud: E("fuerte", "loud", "DetectedSound.LOUD", "DetectedSound.Loud"), Quiet: E("silencioso", "quiet", "DetectedSound.QUIET", "DetectedSound.Quiet") },
    PinPullMode: {
      PullUp: E("arriba", "up", "PinPullMode.PULL_UP", "PinPullMode.PullUp"),
      PullDown: E("abajo", "down", "PinPullMode.PULL_DOWN", "PinPullMode.PullDown"),
      PullNone: E("ninguno", "none", "PinPullMode.PULL_NONE", "PinPullMode.PullNone")
    }
  };
  var PINES = ["P0", "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10", "P11", "P12", "P13", "P14", "P15", "P16", "P19", "P20"];
  ENUMS.DigitalPin = Object.fromEntries(PINES.map((p) => [p, E(p, p, `DigitalPin.${p}`, `DigitalPin.${p}`)]));
  ENUMS.AnalogPin = Object.fromEntries(PINES.map((p) => [p, E(p, p, `AnalogPin.${p}`, `AnalogPin.${p}`)]));
  var ICONOS = {
    Heart: [". # . # .", "# # # # #", "# # # # #", ". # # # .", ". . # . ."],
    SmallHeart: [". . . . .", ". # . # .", ". # # # .", ". . # . .", ". . . . ."],
    Happy: [". . . . .", ". # . # .", ". . . . .", "# . . . #", ". # # # ."],
    Sad: [". . . . .", ". # . # .", ". . . . .", ". # # # .", "# . . . #"],
    Asleep: [". . . . .", "# # . # #", ". . . . .", ". # # # .", ". . . . ."],
    Surprised: [". # . # .", ". . . . .", ". . # . .", ". # . # .", ". . # . ."],
    Yes: [". . . . .", ". . . . #", ". . . # .", "# . # . .", ". # . . ."],
    No: ["# . . . #", ". # . # .", ". . # . .", ". # . # .", "# . . . #"],
    Square: ["# # # # #", "# . . . #", "# . . . #", "# . . . #", "# # # # #"],
    SmallSquare: [". . . . .", ". # # # .", ". # . # .", ". # # # .", ". . . . ."],
    Diamond: [". . # . .", ". # . # .", "# . . . #", ". # . # .", ". . # . ."],
    SmallDiamond: [". . . . .", ". . # . .", ". # . # .", ". . # . .", ". . . . ."],
    Scissors: ["# # . . #", "# # . # .", ". . # . .", "# # . # .", "# # . . #"],
    House: [". . # . .", ". # # # .", "# # # # #", ". # # # .", ". # . # ."],
    Umbrella: [". # # # .", "# # # # #", ". . # . .", "# . # . .", "# # # . ."],
    Target: [". . # . .", ". # # # .", "# # . # #", ". # # # .", ". . # . ."],
    QuarterNote: [". . # . .", ". . # . .", ". . # . .", "# # # . .", "# # # . ."],
    Ghost: [". # # # .", "# . # . #", "# # # # #", "# # # # #", "# . # . #"]
  };
  var ICONO_NOMBRE = {
    Heart: ["corazón", "heart"],
    SmallHeart: ["corazón pequeño", "small heart"],
    Happy: ["contento", "happy"],
    Sad: ["triste", "sad"],
    Asleep: ["dormido", "asleep"],
    Surprised: ["sorprendido", "surprised"],
    Yes: ["sí", "yes"],
    No: ["no", "no"],
    Square: ["cuadrado", "square"],
    SmallSquare: ["cuadrado pequeño", "small square"],
    Diamond: ["diamante", "diamond"],
    SmallDiamond: ["diamante pequeño", "small diamond"],
    Scissors: ["tijeras", "scissors"],
    House: ["casa", "house"],
    Umbrella: ["paraguas", "umbrella"],
    Target: ["diana", "target"],
    QuarterNote: ["negra", "quarter note"],
    Ghost: ["fantasma", "ghost"]
  };
  var snake = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").toUpperCase();
  function snakify(s) {
    const up = s.toUpperCase();
    const lo = s.toLowerCase();
    if (s === up || s === lo) return s;
    if (s.lastIndexOf("_") > 0) return s;
    const esMay = (i2) => s[i2] !== lo[i2];
    const esMin = (i2) => s[i2] !== up[i2];
    let r = "";
    let i = 0;
    while (i < s.length) {
      let modoMay = esMay(i);
      let j = i;
      while (j < s.length) {
        if (modoMay && esMin(j)) {
          if (j - i > 2) {
            j--;
            break;
          } else modoMay = false;
        }
        if (!modoMay && esMay(j)) break;
        j++;
      }
      if (r) r += "_";
      r += s.slice(i, j);
      i = j;
    }
    return r.toUpperCase() === r ? r : r.toLowerCase();
  }
  for (const k of Object.keys(ICONOS)) {
    ENUMS.IconNames = ENUMS.IconNames || {};
    ENUMS.IconNames[k] = E(ICONO_NOMBRE[k][0], ICONO_NOMBRE[k][1], `IconNames.${snake(k)}`, `IconNames.${k}`);
  }
  var NOTAS = {
    131: ["Do bajo", "Low C"],
    147: ["Re bajo", "Low D"],
    165: ["Mi bajo", "Low E"],
    175: ["Fa bajo", "Low F"],
    196: ["Sol bajo", "Low G"],
    220: ["La bajo", "Low A"],
    247: ["Si bajo", "Low B"],
    262: ["Do medio", "Middle C"],
    294: ["Re medio", "Middle D"],
    330: ["Mi medio", "Middle E"],
    349: ["Fa medio", "Middle F"],
    392: ["Sol medio", "Middle G"],
    440: ["La medio", "Middle A"],
    494: ["Si medio", "Middle B"],
    523: ["Do alto", "High C"],
    587: ["Re alto", "High D"],
    659: ["Mi alto", "High E"],
    698: ["Fa alto", "High F"],
    784: ["Sol alto", "High G"],
    880: ["La alto", "High A"],
    988: ["Si alto", "High B"]
  };
  function nombreNota(f, lang = "es") {
    return NOTAS[f] ? NOTAS[f][lang === "es" ? 0 : 1] : `${f} Hz`;
  }
  var TIEMPOS = {
    4: ["4 tiempos", "4 beats", "BeatFraction.BREVE", "BeatFraction.Breve"],
    2: ["2 tiempos", "2 beats", "BeatFraction.DOUBLE", "BeatFraction.Double"],
    1: ["1 tiempo", "1 beat", "BeatFraction.WHOLE", "BeatFraction.Whole"],
    0.5: ["1/2 tiempo", "1/2 beat", "BeatFraction.HALF", "BeatFraction.Half"],
    0.25: ["1/4 de tiempo", "1/4 beat", "BeatFraction.QUARTER", "BeatFraction.Quarter"]
  };
  var C = {};
  function def(nombre, cat, forma, es, en, args = [], extra = {}) {
    C[nombre] = { nombre, cat, forma, es, en, args, ...extra };
  }
  def("basic.showNumber", "basico", "sentencia", "mostrar número $0", "show number $0", ["num"]);
  def("basic.showString", "basico", "sentencia", "mostrar cadena $0", "show string $0", ["txt"]);
  def("basic.showIcon", "basico", "sentencia", "mostrar icono $0", "show icon $0", [{ e: "IconNames" }]);
  def("basic.showArrow", "basico", "sentencia", "mostrar flecha $0", "show arrow $0", [{ e: "ArrowNames" }]);
  def("basic.showLeds", "basico", "sentencia", "mostrar leds $0", "show leds $0", ["leds"]);
  def("basic.clearScreen", "basico", "sentencia", "borrar la pantalla", "clear screen");
  def("basic.pause", "basico", "sentencia", "pausa (ms) $0", "pause (ms) $0", ["num"]);
  def("input.buttonIsPressed", "entrada", "bool", "botón $0 presionado", "button $0 is pressed", [{ e: "Button" }]);
  def("input.logoIsPressed", "entrada", "bool", "logotipo presionado", "logo is pressed");
  def("input.acceleration", "entrada", "valor", "aceleración (mg) $0", "acceleration (mg) $0", [{ e: "Dimension" }]);
  def("input.lightLevel", "entrada", "valor", "nivel de luz", "light level");
  def("input.temperature", "entrada", "valor", "temperatura (°C)", "temperature (°C)");
  def("input.compassHeading", "entrada", "valor", "rumbo de la brújula (°)", "compass heading (°)");
  def("input.calibrateCompass", "entrada", "sentencia", "calibrar la brújula", "calibrate compass");
  def("input.soundLevel", "entrada", "valor", "nivel de sonido", "sound level");
  def("input.runningTime", "entrada", "valor", "tiempo de ejecución (ms)", "running time (ms)");
  def("input.onButtonPressed", "entrada", "evento", "al presionarse el botón $0", "on button $0 pressed", [{ e: "Button" }], {
    py: (a) => `on_button_pressed_${a[0].toLowerCase()}`
  });
  def("input.onLogoEvent", "entrada", "evento", "al presionar el logotipo", "on logo pressed", [], {
    py: () => "on_logo_pressed",
    pyReg: (f) => `input.on_logo_event(TouchButtonEvent.PRESSED, ${f})`,
    jsReg: () => "input.onLogoEvent(TouchButtonEvent.Pressed, $F"
  });
  def("input.onGesture", "entrada", "evento", "al $0", "on $0", [{ e: "Gesture" }], {
    py: (a) => `on_gesture_${snake(a[0]).toLowerCase()}`
  });
  def("led.plot", "led", "sentencia", "graficar x $0 y $1", "plot x $0 y $1", ["num", "num"]);
  def("led.unplot", "led", "sentencia", "apagar x $0 y $1", "unplot x $0 y $1", ["num", "num"]);
  def("led.plotBarGraph", "led", "sentencia", "graficar barras de $0 hasta $1", "plot bar graph of $0 up to $1", ["num", "num"]);
  def("led.setBrightness", "led", "sentencia", "ajustar brillo $0", "set brightness $0", ["num"]);
  def("led.enable", "led", "sentencia", "activar leds $0", "led enable $0", ["bool"]);
  def("music.playTone", "musica", "sentencia", "reproducir tono $0 durante $1", "play tone $0 for $1", ["nota", "tiempo"], {
    pyArgs: (a) => {
      var _a, _b, _c;
      return [a[0], `music.beat(${(_c = (_b = TIEMPOS[(_a = a[1].v) != null ? _a : a[1]]) == null ? void 0 : _b[2]) != null ? _c : "BeatFraction.WHOLE"})`];
    },
    jsArgs: (a) => {
      var _a, _b, _c;
      return [a[0], `music.beat(${(_c = (_b = TIEMPOS[(_a = a[1].v) != null ? _a : a[1]]) == null ? void 0 : _b[3]) != null ? _c : "BeatFraction.Whole"})`];
    }
  });
  def("music.ringTone", "musica", "sentencia", "sonar tono (Hz) $0", "ring tone (Hz) $0", ["nota"]);
  def("music.rest", "musica", "sentencia", "silencio durante $0", "rest for $0", ["tiempo"], {
    pyArgs: (a) => {
      var _a, _b;
      return [`music.beat(${(_b = TIEMPOS[(_a = a[0].v) != null ? _a : a[0]]) == null ? void 0 : _b[2]})`];
    },
    jsArgs: (a) => {
      var _a, _b;
      return [`music.beat(${(_b = TIEMPOS[(_a = a[0].v) != null ? _a : a[0]]) == null ? void 0 : _b[3]})`];
    }
  });
  def("music.stopAllSounds", "musica", "sentencia", "detener todos los sonidos", "stop all sounds");
  ENUMS.PlaybackMode = {
    UntilDone: E("hasta que termine", "until done", "music.PlaybackMode.UNTIL_DONE", "music.PlaybackMode.UntilDone"),
    InBackground: E("en segundo plano", "in background", "music.PlaybackMode.IN_BACKGROUND", "music.PlaybackMode.InBackground"),
    LoopingInBackground: E("en bucle en segundo plano", "looping in background", "music.PlaybackMode.LOOPING_IN_BACKGROUND", "music.PlaybackMode.LoopingInBackground")
  };
  def("music.tonePlayable", "musica", "valor", "tono $0 durante $1", "tone $0 for $1", ["nota", "tiempo"], {
    pyArgs: (a) => {
      var _a, _b, _c;
      return [a[0], `music.beat(${(_c = (_b = TIEMPOS[(_a = a[1].v) != null ? _a : a[1]]) == null ? void 0 : _b[2]) != null ? _c : "BeatFraction.WHOLE"})`];
    },
    jsArgs: (a) => {
      var _a, _b, _c;
      return [a[0], `music.beat(${(_c = (_b = TIEMPOS[(_a = a[1].v) != null ? _a : a[1]]) == null ? void 0 : _b[3]) != null ? _c : "BeatFraction.Whole"})`];
    }
  });
  def("music.play", "musica", "sentencia", "reproducir $0 $1", "play $0 $1", ["num", { e: "PlaybackMode" }]);
  def("radio.setGroup", "radio", "sentencia", "radio establecer grupo $0", "radio set group $0", ["num"]);
  def("radio.setTransmitPower", "radio", "sentencia", "radio establecer potencia de transmisión $0", "radio set transmit power $0", ["num"]);
  def("radio.sendNumber", "radio", "sentencia", "radio enviar número $0", "radio send number $0", ["num"]);
  def("radio.sendString", "radio", "sentencia", "radio enviar cadena $0", "radio send string $0", ["txt"]);
  def("radio.receivedPacket", "radio", "valor", "paquete recibido $0", "received packet $0", [{ e: "RadioPacketProperty" }]);
  def("radio.onReceivedNumber", "radio", "evento", "al recibir radio $p", "on radio received $p", [], {
    param: "receivedNumber",
    py: () => "on_received_number"
  });
  def("radio.onReceivedString", "radio", "evento", "al recibir radio $p", "on radio received $p", [], {
    param: "receivedString",
    py: () => "on_received_string"
  });
  def("pins.digitalReadPin", "pines", "valor", "lectura digital pin $0", "digital read pin $0", [{ e: "DigitalPin" }]);
  def("pins.digitalWritePin", "pines", "sentencia", "escritura digital pin $0 a $1", "digital write pin $0 to $1", [{ e: "DigitalPin" }, "num"]);
  def("pins.analogReadPin", "pines", "valor", "lectura analógica pin $0", "analog read pin $0", [{ e: "AnalogPin" }]);
  def("pins.analogWritePin", "pines", "sentencia", "escritura analógica pin $0 a $1", "analog write pin $0 to $1", [{ e: "AnalogPin" }, "num"]);
  def("pins.servoWritePin", "pines", "sentencia", "servo escribir pin $0 a $1", "servo write pin $0 to $1", [{ e: "AnalogPin" }, "num"]);
  def("pins.setPull", "pines", "sentencia", "establecer pull pin $0 a $1", "set pull pin $0 to $1", [{ e: "DigitalPin" }, { e: "PinPullMode" }]);
  def("pins.analogSetPitchPin", "pines", "sentencia", "establecer pin de tono analógico $0", "analog set pitch pin $0", [{ e: "AnalogPin" }]);
  def("pins.map", "pines", "valor", "mapear $0 de menor $1 de mayor $2 a menor $3 a mayor $4", "map $0 from low $1 from high $2 to low $3 to high $4", [
    "num",
    "num",
    "num",
    "num",
    "num"
  ]);
  def("music.setBuiltInSpeakerEnabled", "musica", "sentencia", "activar altavoz integrado $0", "set built-in speaker $0", ["bool"], {
    py: null
  });
  def("loops.everyInterval", "bucles", "evento", "cada $0 ms", "every $0 ms", ["num"], { py: () => "on_every_interval" });
  def("Math.randomRange", "matematicas", "valor", "escoger al azar de $0 a $1", "pick random $0 to $1", ["num", "num"], {
    pyCall: (a) => `randint(${a[0]}, ${a[1]})`,
    jsCall: (a) => `randint(${a[0]}, ${a[1]})`
  });
  def("Math.abs", "matematicas", "valor", "valor absoluto de $0", "absolute of $0", ["num"], {
    pyCall: (a) => `abs(${a[0]})`,
    jsCall: (a) => `Math.abs(${a[0]})`
  });
  def("Math.round", "matematicas", "valor", "redondear $0", "round $0", ["num"], {
    pyCall: (a) => `Math.round(${a[0]})`,
    jsCall: (a) => `Math.round(${a[0]})`
  });
  def("Math.idiv", "matematicas", "valor", "división entera de $0 entre $1", "integer $0 / $1", ["num", "num"], {
    pyCall: (a) => `Math.idiv(${a[0]}, ${a[1]})`,
    jsCall: (a) => `Math.idiv(${a[0]}, ${a[1]})`
  });
  def("Math.max", "matematicas", "valor", "máximo de $0 y $1", "max of $0 and $1", ["num", "num"], {
    pyCall: (a) => `max(${a[0]}, ${a[1]})`,
    jsCall: (a) => `Math.max(${a[0]}, ${a[1]})`
  });
  def("Math.min", "matematicas", "valor", "mínimo de $0 y $1", "min of $0 and $1", ["num", "num"], {
    pyCall: (a) => `min(${a[0]}, ${a[1]})`,
    jsCall: (a) => `Math.min(${a[0]}, ${a[1]})`
  });
  var CATALOGO = C;
  var siguienteId = 1;
  var nodo = (o) => ({ id: "n" + siguienteId++, ...o });
  var aExpr = (x) => x && typeof x === "object" && x.k ? x : typeof x === "number" ? nodo({ k: "num", v: x }) : typeof x === "string" ? nodo({ k: "lit", v: x }) : typeof x === "boolean" ? nodo({ k: "bool", v: x }) : x;
  var P = {
    programa(...bloques) {
      const prog = { bloques: bloques.flat(), vars: /* @__PURE__ */ new Set() };
      recorrer(prog.bloques, (n) => {
        if (n.k === "asignar" || n.k === "cambiar" || n.k === "var") prog.vars.add(n.n);
      });
      return prog;
    },
    // Eventos
    alIniciar: (cuerpo) => nodo({ k: "evento", ev: "alIniciar", args: [], cuerpo }),
    paraSiempre: (cuerpo) => nodo({ k: "evento", ev: "paraSiempre", args: [], cuerpo }),
    evento: (f, args, cuerpo) => nodo({ k: "evento", ev: f, args: args.map((a) => typeof a === "object" ? a : a), cuerpo }),
    // Sentencias y valores
    c: (f, ...args) => nodo({ k: "llamada", f, args: args.map(aExpr) }),
    si: (cond, entonces, sino = null, sinoSi = []) => nodo({ k: "si", cond: aExpr(cond), entonces, sino, sinoSi: sinoSi.map(([c, b]) => ({ cond: aExpr(c), cuerpo: b })) }),
    repetir: (veces, cuerpo) => nodo({ k: "repetir", veces: aExpr(veces), cuerpo }),
    mientras: (cond, cuerpo) => nodo({ k: "mientras", cond: aExpr(cond), cuerpo }),
    poner: (n, valor) => nodo({ k: "asignar", n, valor: aExpr(valor) }),
    cambiar: (n, por) => nodo({ k: "cambiar", n, por: aExpr(por) }),
    v: (n) => nodo({ k: "var", n }),
    num: (v) => nodo({ k: "num", v }),
    txt: (v) => nodo({ k: "txt", v }),
    leds: (filas) => nodo({ k: "leds", v: Array.isArray(filas) ? filas : filas.trim().split("\n").map((f) => f.trim()) }),
    op: (op, a, b) => nodo({ k: "op", op, a: aExpr(a), b: aExpr(b) }),
    cmp: (op, a, b) => nodo({ k: "cmp", op, a: aExpr(a), b: aExpr(b) }),
    y: (a, b) => nodo({ k: "logico", op: "y", a: aExpr(a), b: aExpr(b) }),
    o: (a, b) => nodo({ k: "logico", op: "o", a: aExpr(a), b: aExpr(b) }),
    no: (a) => nodo({ k: "no", a: aExpr(a) }),
    bool: (v) => nodo({ k: "bool", v })
  };
  function recorrer(lista, fn) {
    const visitar = (n) => {
      if (!n || typeof n !== "object") return;
      if (Array.isArray(n)) return n.forEach(visitar);
      if (n.k) fn(n);
      for (const clave of ["cuerpo", "entonces", "sino", "args", "cond", "valor", "por", "a", "b", "veces"]) if (n[clave]) visitar(n[clave]);
      if (n.sinoSi) n.sinoSi.forEach((s) => (visitar(s.cond), visitar(s.cuerpo)));
    };
    visitar(lista);
  }
  var esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  var T = {
    es: { alIniciar: "al iniciar", paraSiempre: "para siempre", si: "si", entonces: "entonces", siNo: "si no", siNoSi: "si no, si", y: "y", o: "o", no: "no", repetir: (n) => ["repetir", n, "veces"], hacer: "hacer", mientras: "mientras", poner: (v, x) => ["establecer", v, "a", x], cambiar: (v, x) => ["cambiar", v, "por", x], verdadero: "verdadero", falso: "falso" },
    en: { alIniciar: "on start", paraSiempre: "forever", si: "if", entonces: "then", siNo: "else", siNoSi: "else if", y: "and", o: "or", no: "not", repetir: (n) => ["repeat", n, "times"], hacer: "do", mientras: "while", poner: (v, x) => ["set", v, "to", x], cambiar: (v, x) => ["change", v, "by", x], verdadero: "true", falso: "false" }
  };
  var OPS = { "+": "+", "-": "−", "*": "×", "/": "÷", "%": "resto" };
  var CMP_TXT = { "==": "=", "!=": "≠", "<": "<", "<=": "≤", ">": ">", ">=": "≥" };
  function rejilla(filas, clase = "mk-leds") {
    const celdas = filas.map((f) => f.replace(/\s+/g, "").split("").map((c) => `<i${c === "#" ? ' class="on"' : ""}></i>`).join("")).join("");
    return `<span class="${clase}" aria-hidden="true">${celdas}</span>`;
  }
  function exprHTML(x, lang, tipo = "num") {
    if (x == null) return "";
    const t = T[lang];
    switch (x.k) {
      case "num":
        return `<span class="mk-numero" data-nodo="${x.id}">${esc(x.v)}</span>`;
      case "lit":
        return tipo === "txt" ? `<span class="mk-numero mk-txt" data-nodo="${x.id}">“${esc(x.v)}”</span>` : `<span class="mk-numero" data-nodo="${x.id}">${esc(x.v)}</span>`;
      case "txt":
        return `<span class="mk-numero mk-txt" data-nodo="${x.id}">“${esc(x.v)}”</span>`;
      case "bool":
        return `<span class="mk-hex mk-k mk-k-logica" data-nodo="${x.id}"><span>${x.v ? t.verdadero : t.falso}</span></span>`;
      case "var":
        return `<span class="mk-rep mk-k mk-k-variables" data-nodo="${x.id}">${esc(x.n)}</span>`;
      case "op":
        return `<span class="mk-rep mk-k mk-k-matematicas" data-nodo="${x.id}">${exprHTML(x.a, lang)}<span>${OPS[x.op]}</span>${exprHTML(x.b, lang)}</span>`;
      case "cmp":
        return `<span class="mk-hex mk-k mk-k-logica" data-nodo="${x.id}">${exprHTML(x.a, lang)}<span>${CMP_TXT[x.op]}</span>${exprHTML(x.b, lang)}</span>`;
      case "logico":
        return `<span class="mk-hex mk-k mk-k-logica mk-y" data-nodo="${x.id}"><span class="fila">${exprHTML(x.a, lang, "bool")}</span><span class="fila"><span>${x.op === "y" ? t.y : t.o}</span>${exprHTML(x.b, lang, "bool")}</span></span>`;
      case "no":
        return `<span class="mk-hex mk-k mk-k-logica" data-nodo="${x.id}"><span>${t.no}</span>${exprHTML(x.a, lang, "bool")}</span>`;
      case "llamada": {
        const d = C[x.f];
        const cuerpo = partesHTML(d, x.args, lang);
        const forma = d.forma === "bool" ? "mk-hex" : "mk-rep";
        return `<span class="${forma} mk-k mk-k-${d.cat}" data-nodo="${x.id}">${cuerpo}</span>`;
      }
      case "leds":
        return rejilla(x.v);
      default:
        return "";
    }
  }
  function argHTML(tipo, x, lang) {
    var _a, _b, _c, _d, _e;
    if (tipo && typeof tipo === "object" && tipo.e) {
      const clave = (_a = x.v) != null ? _a : x;
      const en = (_b = ENUMS[tipo.e]) == null ? void 0 : _b[clave];
      if (tipo.e === "IconNames") return `<span class="mk-dd mk-dd-icono">${rejilla(ICONOS[clave], "mk-icono")}</span>`;
      return `<span class="mk-dd">${esc(en ? en[lang] : clave)}</span>`;
    }
    if (tipo === "leds") return rejilla(x.v);
    if (tipo === "nota" && (x.k === "num" || x.k === "lit")) return `<span class="mk-numero mk-nota" data-nodo="${x.id}">${esc(nombreNota(x.v, lang))}</span>`;
    if (tipo === "tiempo") {
      const v = (_c = x.v) != null ? _c : x;
      return `<span class="mk-dd">${esc((_e = (_d = TIEMPOS[v]) == null ? void 0 : _d[lang === "es" ? 0 : 1]) != null ? _e : v)}</span>`;
    }
    if (tipo === "bool" && x.k === "bool") return exprHTML(x, lang, "bool");
    return exprHTML(x, lang, tipo);
  }
  function partesHTML(d, args, lang, param) {
    const plantilla = d[lang];
    return plantilla.split(/(\$\d|\$p)/).filter((p) => p !== "").map((p) => {
      if (p === "$p") return `<span class="mk-rep mk-k mk-k-variables">${esc(param)}</span>`;
      const m = p.match(/^\$(\d)$/);
      if (m) return argHTML(d.args[+m[1]], args[+m[1]], lang);
      return `<span>${esc(p.trim())}</span>`;
    }).join("");
  }
  function sentenciasHTML(lista, lang) {
    return lista.map((s) => sentenciaHTML(s, lang)).join("");
  }
  function cBloque(cat, id, cabecera, cuerpos, extraClase = "") {
    let h = `<div class="mk-c mk-k mk-k-${cat} ${extraClase}">`;
    h += `<div class="mk-cab" data-nodo="${id}">${cabecera}</div>`;
    cuerpos.forEach((c, i) => {
      if (i > 0) h += `<div class="mk-medio"${c.id ? ` data-nodo="${c.id}"` : ""}>${c.medio}</div>`;
      h += `<div class="mk-barra"></div><div class="mk-cuerpo">${c.html || '<span class="mk-hueco"></span>'}</div>`;
    });
    h += `<div class="mk-pie"></div></div>`;
    return h;
  }
  function sentenciaHTML(s, lang) {
    const t = T[lang];
    switch (s.k) {
      case "llamada": {
        const d = C[s.f];
        if (s.f === "basic.showLeds") {
          return `<div class="mk-s mk-k mk-k-basico mk-s-leds" data-nodo="${s.id}"><span>${lang === "es" ? "mostrar leds" : "show leds"}</span>${rejilla(s.args[0].v)}</div>`;
        }
        return `<div class="mk-s mk-k mk-k-${d.cat}" data-nodo="${s.id}">${partesHTML(d, s.args, lang)}</div>`;
      }
      case "si": {
        const cuerpos = [{ html: sentenciasHTML(s.entonces, lang) }];
        for (const ss of s.sinoSi || []) cuerpos.push({ medio: `<span>${t.siNoSi}</span>${exprHTML(ss.cond, lang, "bool")}<span>${t.entonces}</span>`, html: sentenciasHTML(ss.cuerpo, lang), id: ss.cond.id + "m" });
        if (s.sino) cuerpos.push({ medio: `<span>${t.siNo}</span>`, html: sentenciasHTML(s.sino, lang), id: s.id + "e" });
        return cBloque("logica", s.id, `<span>${t.si}</span>${exprHTML(s.cond, lang, "bool")}<span>${t.entonces}</span>`, cuerpos);
      }
      case "repetir": {
        const [a, , c] = t.repetir("");
        return cBloque("bucles", s.id, `<span>${a}</span>${exprHTML(s.veces, lang)}<span>${c}</span>`, [{ html: sentenciasHTML(s.cuerpo, lang) }]);
      }
      case "mientras":
        return cBloque("bucles", s.id, `<span>${t.mientras}</span>${exprHTML(s.cond, lang, "bool")}`, [{ html: sentenciasHTML(s.cuerpo, lang) }]);
      case "asignar": {
        const [a, , b] = t.poner("", "");
        return `<div class="mk-s mk-k mk-k-variables" data-nodo="${s.id}"><span>${a}</span><span class="mk-dd">${esc(s.n)}</span><span>${b}</span>${exprHTML(s.valor, lang)}</div>`;
      }
      case "cambiar": {
        const [a, , b] = t.cambiar("", "");
        return `<div class="mk-s mk-k mk-k-variables" data-nodo="${s.id}"><span>${a}</span><span class="mk-dd">${esc(s.n)}</span><span>${b}</span>${exprHTML(s.por, lang)}</div>`;
      }
      default:
        return "";
    }
  }
  function eventoHTML(ev, lang) {
    const t = T[lang];
    let cab;
    let cat = "basico";
    if (ev.ev === "alIniciar") cab = `<span>${t.alIniciar}</span>`;
    else if (ev.ev === "paraSiempre") cab = `<span>${t.paraSiempre}</span>`;
    else {
      const d = C[ev.ev];
      cat = d.cat;
      cab = partesHTML(d, ev.args.map(aExpr), lang, d.param);
    }
    return cBloque(cat, ev.id, cab, [{ html: sentenciasHTML(ev.cuerpo, lang) }], "mk-evento");
  }
  function bloquesHTML(prog, lang) {
    return `<div class="mk" lang="${lang}">${prog.bloques.map((b) => eventoHTML(b, lang)).join("")}</div>`;
  }
  var PREC = { o: 1, y: 2, no: 3, cmp: 4, "+": 5, "-": 5, "*": 6, "/": 6, "%": 6 };
  var precDe = (x) => x.k === "op" ? PREC[x.op] : x.k === "cmp" ? PREC.cmp : x.k === "logico" ? PREC[x.op] : x.k === "no" ? PREC.no : 99;
  var pySnake = (s) => snakify(s);
  function argCodigo(tipo, x, lenguaje) {
    var _a, _b, _c;
    if (tipo && typeof tipo === "object" && tipo.e) {
      const clave = (_a = x.v) != null ? _a : x;
      const en = (_b = ENUMS[tipo.e]) == null ? void 0 : _b[clave];
      const txt = en ? en[lenguaje] : String(clave);
      return tipo.envolver ? `${tipo.envolver}(${txt})` : txt;
    }
    if (tipo === "leds") {
      const filas = x.v.map((f) => "        " + f.replace(/\s+/g, "").split("").join(" "));
      return lenguaje === "py" ? `"""
${filas.join("\n")}
        """` : "`\n" + filas.join("\n") + "\n        `";
    }
    if (tipo === "tiempo") return (_c = x.v) != null ? _c : x;
    return exprCodigo(x, lenguaje);
  }
  function exprCodigo(x, l, padre = 0) {
    const py = l === "py";
    let s;
    switch (x.k) {
      case "num":
        return String(x.v);
      case "lit":
      case "txt":
        return JSON.stringify(String(x.v));
      case "bool":
        return py ? x.v ? "True" : "False" : x.v ? "true" : "false";
      case "var":
        return x.n;
      case "op":
        s = `${exprCodigo(x.a, l, PREC[x.op])} ${x.op} ${exprCodigo(x.b, l, PREC[x.op] + 0.5)}`;
        break;
      case "cmp":
        s = `${exprCodigo(x.a, l, PREC.cmp)} ${x.op} ${exprCodigo(x.b, l, PREC.cmp + 0.5)}`;
        break;
      case "logico":
        s = `${exprCodigo(x.a, l, PREC[x.op])} ${py ? x.op === "y" ? "and" : "or" : x.op === "y" ? "&&" : "||"} ${exprCodigo(x.b, l, PREC[x.op] + 0.5)}`;
        break;
      case "no":
        s = py ? `not ${exprCodigo(x.a, l, PREC.no)}` : `!(${exprCodigo(x.a, l, 0)})`;
        break;
      case "llamada":
        return llamadaCodigo(x, l);
      default:
        return "";
    }
    return precDe(x) < padre ? `(${s})` : s;
  }
  function llamadaCodigo(x, l) {
    const d = C[x.f];
    const py = l === "py";
    let args = d.args.map((t, i) => argCodigo(t, x.args[i], py ? "py" : "js"));
    if (py && d.pyArgs) args = d.pyArgs(args.map((a, i) => d.args[i] === "tiempo" ? x.args[i] : a));
    if (!py && d.jsArgs) args = d.jsArgs(args.map((a, i) => d.args[i] === "tiempo" ? x.args[i] : a));
    if (py && d.pyCall) return d.pyCall(args);
    if (!py && d.jsCall) return d.jsCall(args);
    if (py && d.pyNombre) return `${d.pyNombre}(${args.join(", ")})`;
    const [ns, fn] = x.f.split(".");
    return py ? `${ns}.${pySnake(fn)}(${args.join(", ")})` : `${ns}.${fn}(${args.join(", ")})`;
  }
  function idsDe(x) {
    const ids = [];
    recorrer([x], (n) => ids.push(n.id));
    return ids;
  }
  function sentenciasCodigo(lista, l, sangria, globales) {
    const out = [];
    const py = l === "py";
    const pad = " ".repeat(sangria);
    for (const s of lista) {
      switch (s.k) {
        case "llamada":
          out.push([pad + llamadaCodigo(s, l), idsDe(s)]);
          break;
        case "asignar":
          out.push([pad + (py ? "" : "") + `${s.n} = ${exprCodigo(s.valor, l)}`, idsDe(s)]);
          break;
        case "cambiar":
          out.push([pad + `${s.n} += ${exprCodigo(s.por, l)}`, idsDe(s)]);
          break;
        case "si": {
          out.push([pad + (py ? `if ${exprCodigo(s.cond, l)}:` : `if (${exprCodigo(s.cond, l)}) {`), [s.id, ...idsDe(s.cond)]]);
          out.push(...cuerpoCodigo(s.entonces, l, sangria + 4, globales));
          for (const ss of s.sinoSi || []) {
            out.push([pad + (py ? `elif ${exprCodigo(ss.cond, l)}:` : `} else if (${exprCodigo(ss.cond, l)}) {`), [ss.cond.id + "m", ...idsDe(ss.cond)]]);
            out.push(...cuerpoCodigo(ss.cuerpo, l, sangria + 4, globales));
          }
          if (s.sino) {
            out.push([pad + (py ? "else:" : "} else {"), [s.id + "e"]]);
            out.push(...cuerpoCodigo(s.sino, l, sangria + 4, globales));
          }
          if (!py) out.push([pad + "}", []]);
          break;
        }
        case "repetir":
          out.push([pad + (py ? `for index in range(${exprCodigo(s.veces, l)}):` : `for (let index = 0; index < ${exprCodigo(s.veces, l)}; index++) {`), [s.id, ...idsDe(s.veces)]]);
          out.push(...cuerpoCodigo(s.cuerpo, l, sangria + 4, globales));
          if (!py) out.push([pad + "}", []]);
          break;
        case "mientras":
          out.push([pad + (py ? `while ${exprCodigo(s.cond, l)}:` : `while (${exprCodigo(s.cond, l)}) {`), [s.id, ...idsDe(s.cond)]]);
          out.push(...cuerpoCodigo(s.cuerpo, l, sangria + 4, globales));
          if (!py) out.push([pad + "}", []]);
          break;
      }
    }
    return out;
  }
  function cuerpoCodigo(lista, l, sangria, globales) {
    const out = sentenciasCodigo(lista, l, sangria, globales);
    if (!out.length && l === "py") out.push([" ".repeat(sangria) + "pass", []]);
    return out;
  }
  function asignadas(lista) {
    const s = /* @__PURE__ */ new Set();
    recorrer(lista, (n) => {
      if (n.k === "asignar" || n.k === "cambiar") s.add(n.n);
    });
    return [...s];
  }
  function codigo(prog, l) {
    const py = l === "py";
    const lineas = [];
    const inicio = prog.bloques.find((b) => b.ev === "alIniciar");
    const otros = prog.bloques.filter((b) => b.ev !== "alIniciar" && b.ev !== "paraSiempre");
    const siempre = prog.bloques.filter((b) => b.ev === "paraSiempre");
    const globales = new Set(inicio ? asignadas(inicio.cuerpo) : []);
    const funcion = (ev, nombre, registro, param) => {
      if (py) {
        lineas.push([`def ${nombre}(${param || ""}):`, [ev.id]]);
        const g = asignadas(ev.cuerpo).filter((v) => v !== param);
        if (g.length) lineas.push([`    global ${g.join(", ")}`, []]);
        lineas.push(...cuerpoCodigo(ev.cuerpo, l, 4, globales));
        lineas.push([registro, [ev.id]]);
      } else {
        lineas.push([registro.replace("$F", `function (${param || ""}) {`), [ev.id]]);
        lineas.push(...cuerpoCodigo(ev.cuerpo, l, 4, globales));
        lineas.push(["})", []]);
      }
    };
    for (const ev of otros) {
      const d = C[ev.ev];
      const args = d.args.map((t, i) => argCodigo(t, aExpr(ev.args[i]), py ? "py" : "js"));
      const nombre = d.py ? d.py(ev.args.map((a) => typeof a === "object" ? a.v : a)) : "on_event";
      const [ns, fn] = ev.ev.split(".");
      if (py) {
        const reg = d.pyReg ? d.pyReg(nombre) : `${ns}.${pySnake(fn)}(${[...args, nombre].join(", ")})`;
        funcion(ev, nombre, reg, d.param);
      } else {
        const reg = d.jsReg ? d.jsReg() : `${ns}.${fn}(${[...args, "$F"].join(", ")}`;
        funcion(ev, nombre, reg, d.param);
      }
      lineas.push(["", []]);
    }
    if (inicio) {
      for (const [txt, ids] of sentenciasCodigo(inicio.cuerpo, l, 0, globales)) {
        let t = txt;
        if (!py) {
          const m = t.match(/^(\w+) = /);
          if (m && !lineas.some(([x]) => x.startsWith(`let ${m[1]} =`))) t = "let " + t;
        }
        lineas.push([t, [...ids, inicio.id]]);
      }
      if (inicio.cuerpo.length) lineas.push(["", []]);
    }
    for (const ev of siempre) {
      if (py) funcion(ev, "on_forever", "basic.forever(on_forever)");
      else {
        lineas.push(["basic.forever(function () {", [ev.id]]);
        lineas.push(...cuerpoCodigo(ev.cuerpo, l, 4, globales));
        lineas.push(["})", [ev.id + "p"]]);
      }
    }
    while (lineas.length && lineas[lineas.length - 1][0] === "") lineas.pop();
    return lineas;
  }
  var textoCodigo = (prog, l) => codigo(prog, l).map(([t]) => t).join("\n") + "\n";
  function colorear(linea) {
    return esc(linea).replace(/("[^"]*"|`[^`]*`)/g, '<span class="s">$1</span>').replace(/\b(def|if|elif|else|and|or|not|for|in|while|global|pass|True|False|let|function|true|false)\b(?![^<]*>)/g, '<span class="k">$1</span>').replace(/\b(\d+(?:\.\d+)?)\b(?![^<]*>)/g, '<span class="n">$1</span>');
  }
  function montarPrograma({ bloques, python, programa, idioma = "es" }) {
    let lang = idioma;
    const pintar = () => bloques.innerHTML = bloquesHTML(programa, lang);
    pintar();
    python.innerHTML = codigo(programa, "py").map(([l, ids], i) => `<span class="ln" data-n="${i + 1}" data-nodos="${ids.join(" ")}">${colorear(l) || " "}</span>`).join("");
    let ultimo = { vivos: [], camino: [], insignias: {} };
    function resaltar({ vivos = [], camino = [], insignias = {} } = {}) {
      ultimo = { vivos, camino, insignias };
      const vivo = new Set(vivos);
      const cam = new Set(camino);
      bloques.querySelectorAll("[data-nodo]").forEach((el) => {
        const n = el.dataset.nodo;
        el.classList.toggle("vivo", vivo.has(n));
        el.classList.toggle("camino", !vivo.has(n) && cam.has(n));
      });
      bloques.querySelectorAll(".mk-insignia").forEach((el) => el.remove());
      for (const [id, valor] of Object.entries(insignias)) {
        const el = bloques.querySelector(`[data-nodo="${id}"]`);
        if (!el) continue;
        const b = document.createElement("span");
        b.className = "mk-insignia" + (valor === false ? " no" : "");
        b.textContent = typeof valor === "boolean" ? lang === "es" ? valor ? "sí" : "no" : valor ? "true" : "false" : String(valor);
        el.appendChild(b);
      }
      python.querySelectorAll(".ln").forEach((el) => {
        const ns = el.dataset.nodos ? el.dataset.nodos.split(" ") : [];
        const v = ns.some((n) => vivo.has(n));
        el.classList.toggle("vivo", v);
        el.classList.toggle("camino", !v && ns.some((n) => cam.has(n)));
      });
      const primero = bloques.querySelector(".vivo");
      if (primero && bloques.closest(".programa-cuerpo")) {
        const caja = bloques.closest(".programa-cuerpo");
        const r = primero.getBoundingClientRect();
        const rc = caja.getBoundingClientRect();
        if (r.top < rc.top || r.bottom > rc.bottom) caja.scrollTop += r.top - rc.top - rc.height / 3;
      }
    }
    return {
      resaltar,
      idiomaBloques(nuevo) {
        lang = nuevo;
        pintar();
        resaltar(ultimo);
      }
    };
  }

  // ../../../../tmp/bitabit-myq0224i/mk/maquina.js
  var PASO = { paso: true };
  var Mundo = class {
    constructor({ fisica = null, pasoFisica = 2 } = {}) {
      this.t = 0;
      this.placas = [];
      this.cola = [];
      this.fisica = fisica;
      this.pasoFisica = pasoFisica;
      this.registro = [];
      this.observadores = [];
    }
    agregar(placa) {
      placa.mundo = this;
      this.placas.push(placa);
      return placa;
    }
    programar(dt, fn) {
      this.cola.push({ t: this.t + Math.max(0, dt), fn, orden: this.cola.length + Math.random() * 1e-6 });
      this.cola.sort((a, b) => a.t - b.t || a.orden - b.orden);
    }
    emitir(ev) {
      ev.t = this.t;
      this.registro.push(ev);
      if (this.registro.length > 4e3) {
        this.registro.splice(0, 2e3);
        this.revisadoHasta = Math.max(0, (this.revisadoHasta || 0) - 2e3);
      }
      for (const o of this.observadores) o(ev);
      return ev;
    }
    iniciar() {
      for (const p of this.placas) p.iniciar();
    }
    // Avanza la física (y el hardware de las placas) hasta «hasta»; si se pasa
    // «parar», se detiene en cuanto el hardware emite un evento que lo cumple.
    avanzarFisica(hasta, parar = null) {
      var _a, _b, _c;
      while (this.t < hasta - 1e-9) {
        const dt = Math.min(this.pasoFisica, hasta - this.t);
        (_b = (_a = this.fisica) == null ? void 0 : _a.avanzar) == null ? void 0 : _b.call(_a, dt, this);
        for (const p of this.placas) (_c = p.avanzarHardware) == null ? void 0 : _c.call(p, dt);
        this.t += dt;
        if (parar) {
          const ev = this.revisar(parar);
          if (ev) return ev;
        }
        if (this.cola.length && this.cola[0].t <= this.t + 1e-9) break;
      }
      if (this.t > hasta - 1e-9) this.t = Math.max(this.t, hasta);
      return null;
    }
    // Busca, entre los eventos aún no revisados, el primero que cumpla parar
    revisar(parar) {
      const reg = this.registro;
      for (let i = this.revisadoHasta || 0; i < reg.length; i++) {
        if (parar && parar(reg[i])) {
          this.revisadoHasta = i + 1;
          return reg[i];
        }
      }
      this.revisadoHasta = reg.length;
      return null;
    }
    // Corre hasta el tiempo tFin, o hasta que parar(evento) devuelva true.
    // Devuelve el evento que hizo parar, o null.
    correr(tFin, parar = null) {
      let guarda = 0;
      this.revisadoHasta = this.registro.length;
      for (; ; ) {
        if (++guarda > 2e5) return null;
        while (this.cola.length && this.cola[0].t <= this.t + 1e-9) this.cola.shift().fn(this);
        if (parar) {
          const ev = this.revisar(parar);
          if (ev) return ev;
        }
        let listo = null;
        for (const p of this.placas)
          for (const f of p.hilos) if (!f.fin && f.despierta <= this.t + 1e-9 && (!listo || f.despierta < listo.f.despierta || f.despierta === listo.f.despierta && f.n < listo.f.n)) listo = { p, f };
        if (listo) {
          const ev = listo.p.correrHilo(listo.f, parar);
          if (ev) return ev;
          continue;
        }
        let tSig = tFin;
        for (const p of this.placas) for (const f of p.hilos) if (!f.fin) tSig = Math.min(tSig, f.despierta);
        if (this.cola.length) tSig = Math.min(tSig, this.cola[0].t);
        if (tSig <= this.t + 1e-9) {
          if (this.t >= tFin - 1e-9) return null;
          tSig = Math.min(tFin, this.t + this.pasoFisica);
        }
        const evF = this.avanzarFisica(tSig, parar);
        if (evF) return evF;
        if (this.t >= tFin - 1e-9 && !this.placas.some((p) => p.hilos.some((f) => !f.fin && f.despierta <= this.t + 1e-9)) && !(this.cola.length && this.cola[0].t <= this.t + 1e-9)) return null;
      }
    }
  };
  var contadorHilos = 0;
  var Placa = class {
    constructor({ nombre = "micro:bit", programa, api }) {
      this.nombre = nombre;
      this.programa = programa;
      this.api = api;
      this.hilos = [];
      this.vars = {};
      this.manejadores = {};
      this.mundo = null;
    }
    get t() {
      return this.mundo.t;
    }
    emitir(ev) {
      ev.placa = this.nombre;
      return this.mundo.emitir(ev);
    }
    reiniciarPrograma() {
      this.hilos = [];
      this.vars = {};
      this.manejadores = {};
      for (const v of this.programa.vars) this.vars[v] = 0;
    }
    iniciar() {
      var _a;
      this.reiniciarPrograma();
      const inicio = this.programa.bloques.find((b) => b.ev === "alIniciar");
      for (const b of this.programa.bloques) {
        if (b.ev === "alIniciar" || b.ev === "paraSiempre") continue;
        const clave = this.claveEvento(b);
        ((_a = this.manejadores)[clave] || (_a[clave] = [])).push({ bloque: b, ocupado: false, pendientes: [] });
        if (b.ev === "loops.everyInterval") {
          const ms = b.args[0];
          const tic = () => {
            this.disparar(clave);
            this.mundo.programar(ms, tic);
          };
          this.mundo.programar(ms, tic);
        }
      }
      this.nuevoHilo(this.cuerpo(inicio ? inicio.cuerpo : [], inicio), "inicio", inicio == null ? void 0 : inicio.id);
      for (const b of this.programa.bloques.filter((b2) => b2.ev === "paraSiempre")) this.nuevoHilo(this.siempre(b), "siempre", b.id);
    }
    claveEvento(b) {
      const a = b.args.map((x) => typeof x === "object" ? x.v : x);
      switch (b.ev) {
        case "input.onButtonPressed":
          return "boton:" + a[0];
        case "input.onLogoEvent":
          return "logo";
        case "input.onGesture":
          return "gesto:" + a[0];
        case "radio.onReceivedNumber":
          return "radio:numero";
        case "radio.onReceivedString":
          return "radio:cadena";
        case "loops.everyInterval":
          return "cada:" + a[0];
        default:
          return b.ev + ":" + a.join(",");
      }
    }
    tieneEvento(clave) {
      return !!this.manejadores[clave];
    }
    // Un evento del hardware: cada manejador corre en su propio hilo; si ya está
    // corriendo, el evento espera su turno (en la micro:bit: «queue if busy»)
    disparar(clave, valor) {
      const lista = this.manejadores[clave];
      if (!lista) return false;
      for (const m of lista) {
        if (m.ocupado) {
          m.pendientes.push(valor);
          continue;
        }
        this.lanzarManejador(m, valor);
      }
      return true;
    }
    lanzarManejador(m, valor) {
      m.ocupado = true;
      const placa = this;
      const b = m.bloque;
      const gen = function* () {
        placa.emitir({ tipo: "evento", id: b.id, ev: b.ev, valor });
        yield PASO;
        const param = placa.programaParam(b);
        const antes = param ? placa.vars[param] : void 0;
        if (param) placa.vars[param] = valor;
        yield* placa.ejecutarLista(b.cuerpo);
        if (param) placa.vars[param] = antes != null ? antes : valor;
        m.ocupado = false;
        if (m.pendientes.length) placa.lanzarManejador(m, m.pendientes.shift());
      }();
      this.nuevoHilo(gen, "evento", b.id);
    }
    programaParam(b) {
      var _a;
      return ((_a = CATALOGO[b.ev]) == null ? void 0 : _a.param) || null;
    }
    nuevoHilo(gen, tipo, id) {
      const h = { gen, tipo, id, despierta: this.mundo.t, fin: false, n: ++contadorHilos };
      this.hilos.push(h);
      return h;
    }
    *cuerpo(lista, bloque) {
      if (bloque) {
        this.emitir({ tipo: "evento", id: bloque.id, ev: "alIniciar" });
        yield PASO;
      }
      yield* this.ejecutarLista(lista);
    }
    *siempre(b) {
      for (; ; ) {
        this.emitir({ tipo: "vuelta", id: b.id });
        yield PASO;
        yield* this.ejecutarLista(b.cuerpo);
        this.emitir({ tipo: "esperar", id: b.id + "p", ms: 20, nodo: "pausaSiempre" });
        yield { esperar: 20 };
      }
    }
    // Corre un hilo hasta que espere, acabe o se cumpla parar(evento)
    correrHilo(h, parar) {
      const base = this.mundo.registro.length;
      for (let i = 0; i < 1e5; i++) {
        let r;
        try {
          r = h.gen.next();
        } catch (e) {
          console.error("Error en el programa simulado", e);
          h.fin = true;
          return null;
        }
        if (r.done) {
          h.fin = true;
          this.hilos = this.hilos.filter((x) => !x.fin);
          return null;
        }
        const v = r.value;
        if (v && v.esperar != null) {
          h.despierta = this.mundo.t + v.esperar;
          return this.comprobarParada(base, parar);
        }
        if (parar) {
          const ev = this.comprobarParada(base, parar);
          if (ev) return ev;
        }
      }
      h.despierta = this.mundo.t + 1;
      return null;
    }
    comprobarParada(base, parar) {
      if (!parar) return null;
      return this.mundo.revisar(parar);
    }
    // ---------------- Intérprete ----------------
    *ejecutarLista(lista) {
      for (const s of lista) yield* this.sentencia(s);
    }
    *sentencia(s) {
      switch (s.k) {
        case "llamada": {
          this.emitir({ tipo: "nodo", id: s.id, f: s.f });
          yield PASO;
          const args = [];
          for (const a of s.args) args.push(yield* this.valor(a));
          const r = yield* this.llamar(s, args);
          return r;
        }
        case "si": {
          this.emitir({ tipo: "nodo", id: s.id, k: "si" });
          yield PASO;
          const c = !!(yield* this.valor(s.cond));
          this.emitir({ tipo: "cond", id: s.id, valor: c, cond: s.cond.id });
          yield PASO;
          if (c) return yield* this.ejecutarLista(s.entonces);
          for (const ss of s.sinoSi || []) {
            const c2 = !!(yield* this.valor(ss.cond));
            this.emitir({ tipo: "cond", id: ss.cond.id + "m", valor: c2, cond: ss.cond.id });
            yield PASO;
            if (c2) return yield* this.ejecutarLista(ss.cuerpo);
          }
          if (s.sino) {
            this.emitir({ tipo: "nodo", id: s.id + "e", k: "sino" });
            yield PASO;
            return yield* this.ejecutarLista(s.sino);
          }
          return;
        }
        case "repetir": {
          const n = Math.max(0, Math.floor(yield* this.valor(s.veces)));
          for (let i = 0; i < n; i++) {
            this.emitir({ tipo: "nodo", id: s.id, k: "repetir", vuelta: i + 1, de: n });
            yield PASO;
            yield* this.ejecutarLista(s.cuerpo);
          }
          return;
        }
        case "mientras": {
          let vueltas = 0;
          for (; ; ) {
            const c = !!(yield* this.valor(s.cond));
            this.emitir({ tipo: "cond", id: s.id, valor: c, cond: s.cond.id });
            yield PASO;
            if (!c) return;
            yield* this.ejecutarLista(s.cuerpo);
            if (++vueltas % 5e3 === 0) yield { esperar: 1 };
          }
        }
        case "asignar": {
          const v = yield* this.valor(s.valor);
          this.vars[s.n] = v;
          this.emitir({ tipo: "var", id: s.id, n: s.n, valor: v });
          yield PASO;
          return;
        }
        case "cambiar": {
          const v = yield* this.valor(s.por);
          this.vars[s.n] = (this.vars[s.n] || 0) + v;
          this.emitir({ tipo: "var", id: s.id, n: s.n, valor: this.vars[s.n] });
          yield PASO;
          return;
        }
      }
    }
    *llamar(nodo2, args) {
      const f = this.api[nodo2.f];
      if (!f) throw new Error("Falta el bloque " + nodo2.f);
      const r = f(this, args, nodo2);
      if (r && typeof r.next === "function") return yield* r;
      return r;
    }
    *valor(x) {
      var _a;
      switch (x.k) {
        case "num":
          return x.v;
        case "lit":
        case "txt":
          return x.v;
        case "bool":
          return x.v;
        case "leds":
          return x.v;
        case "var":
          return (_a = this.vars[x.n]) != null ? _a : 0;
        case "op": {
          const a = yield* this.valor(x.a);
          const b = yield* this.valor(x.b);
          switch (x.op) {
            case "+":
              return typeof a === "string" || typeof b === "string" ? String(a) + String(b) : a + b;
            case "-":
              return a - b;
            case "*":
              return a * b;
            case "/":
              return b === 0 ? 0 : a / b;
            case "%":
              return b === 0 ? 0 : a % b;
          }
          return 0;
        }
        case "cmp": {
          const a = yield* this.valor(x.a);
          const b = yield* this.valor(x.b);
          let r;
          switch (x.op) {
            case "==":
              r = a == b;
              break;
            case "!=":
              r = a != b;
              break;
            case "<":
              r = a < b;
              break;
            case "<=":
              r = a <= b;
              break;
            case ">":
              r = a > b;
              break;
            case ">=":
              r = a >= b;
              break;
          }
          this.emitir({ tipo: "comparar", id: x.id, a, b, op: x.op, valor: r });
          return r;
        }
        case "logico": {
          const a = !!(yield* this.valor(x.a));
          if (x.op === "y" && !a) return false;
          if (x.op === "o" && a) return true;
          return !!(yield* this.valor(x.b));
        }
        case "no":
          return !(yield* this.valor(x.a));
        case "llamada": {
          const args = [];
          for (const a of x.args) args.push(yield* this.valor(a));
          const v = yield* this.llamar(x, args);
          this.emitir({ tipo: "leer", id: x.id, f: x.f, args, valor: v });
          yield PASO;
          return v;
        }
      }
      return 0;
    }
  };

  // ../../../../tmp/bitabit-myq0224i/mk/microbit.js
  var FUENTE = [0, 0, 0, 0, 0, 8, 8, 8, 0, 8, 10, 74, 64, 0, 0, 10, 95, 234, 95, 234, 14, 217, 46, 211, 110, 25, 50, 68, 137, 51, 12, 146, 76, 146, 77, 8, 8, 0, 0, 0, 4, 136, 8, 8, 4, 8, 4, 132, 132, 136, 0, 10, 68, 138, 64, 0, 4, 142, 196, 128, 0, 0, 0, 4, 136, 0, 0, 14, 192, 0, 0, 0, 0, 8, 0, 1, 34, 68, 136, 16, 12, 146, 82, 82, 76, 4, 140, 132, 132, 142, 28, 130, 76, 144, 30, 30, 194, 68, 146, 76, 6, 202, 82, 95, 226, 31, 240, 30, 193, 62, 2, 68, 142, 209, 46, 31, 226, 68, 136, 16, 14, 209, 46, 209, 46, 14, 209, 46, 196, 136, 0, 8, 0, 8, 0, 0, 4, 128, 4, 136, 2, 68, 136, 4, 130, 0, 14, 192, 14, 192, 8, 4, 130, 68, 136, 14, 209, 38, 192, 4, 14, 209, 53, 179, 108, 12, 146, 94, 210, 82, 28, 146, 92, 146, 92, 14, 208, 16, 16, 14, 28, 146, 82, 82, 92, 30, 208, 28, 144, 30, 30, 208, 28, 144, 16, 14, 208, 19, 113, 46, 18, 82, 94, 210, 82, 28, 136, 8, 8, 28, 31, 226, 66, 82, 76, 18, 84, 152, 20, 146, 16, 16, 16, 16, 30, 17, 59, 117, 177, 49, 17, 57, 53, 179, 113, 12, 146, 82, 82, 76, 28, 146, 92, 144, 16, 12, 146, 82, 76, 134, 28, 146, 92, 146, 81, 14, 208, 12, 130, 92, 31, 228, 132, 132, 132, 18, 82, 82, 82, 76, 17, 49, 49, 42, 68, 17, 49, 53, 187, 113, 18, 82, 76, 146, 82, 17, 42, 68, 132, 132, 30, 196, 136, 16, 30, 14, 200, 8, 8, 14, 16, 8, 4, 130, 65, 14, 194, 66, 66, 78, 4, 138, 64, 0, 0, 0, 0, 0, 0, 31, 8, 4, 128, 0, 0, 0, 14, 210, 82, 79, 16, 16, 28, 146, 92, 0, 14, 208, 16, 14, 2, 66, 78, 210, 78, 12, 146, 92, 144, 14, 6, 200, 28, 136, 8, 14, 210, 78, 194, 76, 16, 16, 28, 146, 82, 8, 0, 8, 8, 8, 2, 64, 2, 66, 76, 16, 20, 152, 20, 146, 8, 8, 8, 8, 6, 0, 27, 117, 177, 49, 0, 28, 146, 82, 82, 0, 12, 146, 82, 76, 0, 28, 146, 92, 144, 0, 14, 210, 78, 194, 0, 14, 208, 16, 16, 0, 6, 200, 4, 152, 8, 8, 14, 200, 7, 0, 18, 82, 82, 79, 0, 17, 49, 42, 68, 0, 17, 49, 53, 187, 0, 18, 76, 140, 146, 0, 17, 42, 68, 152, 0, 30, 196, 136, 30, 6, 196, 140, 132, 134, 8, 8, 8, 8, 8, 24, 8, 12, 136, 24, 0, 0, 12, 131, 96];
  function columnasCaracter(ch) {
    let c = ch.charCodeAt(0);
    if (c < 32 || c > 126) c = 63;
    const base = (c - 32) * 5;
    const filas = FUENTE.slice(base, base + 5).map((b) => b & 31);
    return [0, 1, 2, 3, 4].map((x) => filas.map((f) => f >> 4 - x & 1));
  }
  var FLECHAS = {
    North: [". . # . .", ". # # # .", "# . # . #", ". . # . .", ". . # . ."],
    East: [". . # . .", ". . . # .", "# # # # #", ". . . # .", ". . # . ."],
    South: [". . # . .", ". . # . .", "# . # . #", ". # # # .", ". . # . ."],
    West: [". . # . .", ". # . . .", "# # # # #", ". # . . .", ". . # . ."]
  };
  function patronAMatriz(filas) {
    return filas.map((f) => f.replace(/\s+/g, "").split("").map((c) => c === "#" ? 255 : 0));
  }
  var formatoNumero = (v) => {
    if (Number.isNaN(v)) return "?";
    const r = Math.round(v * 100) / 100;
    return String(r);
  };
  function crearMicrobit({ nombre = "micro:bit", programa, entorno = {}, extras = {} }) {
    const est = {
      pantalla: Array.from({ length: 5 }, () => [0, 0, 0, 0, 0]),
      // 0–255 por LED
      brillo: 255,
      pantallaActiva: true,
      animando: false,
      botones: { A: false, B: false },
      logo: false,
      luzActiva: false,
      lecturasLuz: 0,
      brujulaCalibrada: false,
      calibrando: false,
      radio: { grupo: 0, potencia: 6, activa: false, intensidad: -128, enviados: 0, recibidos: 0 },
      pines: {},
      // P0: { modo: 'digital'|'analogico'|'servo'|'tono', valor }
      pwm: [],
      // pines con PWM (escritura analógica o servo)
      canales: [null, null, null, null],
      // los 4 canales PWM de la V2 y el pin de cada uno
      ultimoCanal: 3,
      pinTono: "P0",
      altavoz: true,
      tono: { f: 0, hasta: 0 },
      tempo: 120,
      arranque: 0,
      temp: { t: -Infinity, v: 0 }
    };
    const pausa = function* (ms) {
      yield { esperar: Math.max(0, ms) };
    };
    const mostrarMatriz = (m) => {
      for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) est.pantalla[y][x] = m[y][x];
    };
    const borrar = () => mostrarMatriz(Array.from({ length: 5 }, () => [0, 0, 0, 0, 0]));
    function* desplazar(texto, intervalo = 150) {
      const tira = [];
      for (let i = 0; i < 5; i++) tira.push([0, 0, 0, 0, 0]);
      for (const ch of texto) {
        tira.push(...columnasCaracter(ch));
        tira.push([0, 0, 0, 0, 0]);
      }
      est.animando = true;
      for (let k = 1; k + 5 <= tira.length + 5; k++) {
        for (let x = 0; x < 5; x++) {
          const col = tira[k + x] || [0, 0, 0, 0, 0];
          for (let y = 0; y < 5; y++) est.pantalla[y][x] = col[y] ? 255 : 0;
        }
        yield { esperar: intervalo };
      }
      est.animando = false;
    }
    function* mostrarCadena(texto, intervalo = 150) {
      texto = String(texto);
      if (texto.length === 0) {
        borrar();
        yield* pausa(intervalo * 5);
      } else if (texto.length > 1) yield* desplazar(texto, intervalo);
      else {
        const cols = columnasCaracter(texto);
        for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) est.pantalla[y][x] = cols[x][y] ? 255 : 0;
        yield* pausa(intervalo * 5);
      }
    }
    function usarPWM(pin) {
      var _a, _b;
      if (est.canales.includes(pin)) return null;
      const c = (est.ultimoCanal + 1) % est.canales.length;
      est.ultimoCanal = c;
      const fuera = est.canales[c];
      est.canales[c] = pin;
      est.pwm = est.canales.filter(Boolean);
      if (fuera) {
        const p = est.pines[fuera];
        if (p) p.pwmPerdido = true;
        (_b = (_a = entorno.circuito) == null ? void 0 : _a.pwmPerdido) == null ? void 0 : _b.call(_a, fuera);
      }
      return fuera;
    }
    const soltarPWM = (pin) => {
      const i = est.canales.indexOf(pin);
      if (i >= 0) est.canales[i] = null;
      est.pwm = est.canales.filter(Boolean);
    };
    const api = {
      "basic.showNumber": (pl, [v]) => mostrarCadena(formatoNumero(v)),
      "basic.showString": (pl, [t]) => mostrarCadena(t),
      "basic.showLeds": function* (pl, [filas]) {
        mostrarMatriz(patronAMatriz(filas));
        yield* pausa(400);
      },
      "basic.showIcon": function* (pl, [nombreIcono]) {
        mostrarMatriz(patronAMatriz(ICONOS[nombreIcono]));
        yield* pausa(600);
      },
      "basic.showArrow": function* (pl, [dir]) {
        mostrarMatriz(patronAMatriz(FLECHAS[dir] || FLECHAS.North));
        yield* pausa(600);
      },
      "basic.clearScreen": () => borrar(),
      "basic.pause": (pl, [ms]) => pausa(ms),
      "led.plot": (pl, [x, y]) => {
        if (x >= 0 && x < 5 && y >= 0 && y < 5) est.pantalla[Math.floor(y)][Math.floor(x)] = 255;
      },
      "led.unplot": (pl, [x, y]) => {
        if (x >= 0 && x < 5 && y >= 0 && y < 5) est.pantalla[Math.floor(y)][Math.floor(x)] = 0;
      },
      "led.setBrightness": (pl, [b]) => est.brillo = Math.max(0, Math.min(255, b)),
      "led.enable": (pl, [on]) => est.pantallaActiva = !!on,
      "led.plotBarGraph": (pl, [valor, alto]) => {
        if (Number.isNaN(valor)) return borrar();
        const v = Math.abs(valor) / (alto > 0 ? alto : Math.max(1, Math.abs(valor)));
        let k = 0;
        for (let y = 4; y >= 0; --y)
          for (let x = 0; x < 3; ++x) {
            const on = !(k > v);
            est.pantalla[y][2 - x] = on ? 255 : 0;
            est.pantalla[y][2 + x] = on ? 255 : 0;
            k += 1 / 16;
          }
      },
      "input.buttonIsPressed": (pl, [b]) => b === "AB" ? est.botones.A && est.botones.B : !!est.botones[b],
      "input.logoIsPressed": () => est.logo,
      "input.acceleration": (pl, [d]) => {
        var _a, _b;
        const a = (_b = (_a = entorno.aceleracion) == null ? void 0 : _a.call(entorno)) != null ? _b : { x: 0, y: 0, z: -1023 };
        if (d === "Strength") return Math.round(Math.hypot(a.x, a.y, a.z));
        return Math.round(a[d.toLowerCase()]);
      },
      "input.lightLevel": () => {
        var _a, _b;
        if (!est.luzActiva) {
          est.luzActiva = true;
          return 0;
        }
        est.lecturasLuz++;
        return Math.round(Math.max(0, Math.min(255, (_b = (_a = entorno.luz) == null ? void 0 : _a.call(entorno)) != null ? _b : 120)));
      },
      // CODAL (NRF52Thermometer): el sensor del procesador se lee como mucho una vez por
      // segundo y da grados enteros: la medida (en pasos de 0,25 °C) dividida entre 4, sin decimales.
      "input.temperature": (pl) => {
        var _a, _b;
        if (pl.t - est.temp.t >= 1e3) est.temp = { t: pl.t, v: Math.trunc(Math.round(((_b = (_a = entorno.temperatura) == null ? void 0 : _a.call(entorno)) != null ? _b : 21) * 4) / 4) };
        return est.temp.v;
      },
      "input.compassHeading": function* () {
        var _a, _b;
        if (!est.brujulaCalibrada) yield* calibrar();
        return Math.round((_b = (_a = entorno.rumbo) == null ? void 0 : _a.call(entorno)) != null ? _b : 0);
      },
      "input.calibrateCompass": () => calibrar(),
      "input.soundLevel": () => {
        var _a, _b;
        est.micActivo = true;
        return Math.round(Math.max(0, Math.min(255, (_b = (_a = entorno.sonido) == null ? void 0 : _a.call(entorno)) != null ? _b : 10)));
      },
      "input.runningTime": (pl) => Math.round(pl.t - est.arranque),
      "music.playTone": function* (pl, [f, beats]) {
        const ms = 6e4 / est.tempo * beats;
        tocar(f, ms);
        yield* pausa(ms);
        est.tono.f = 0;
      },
      "music.ringTone": (pl, [f]) => tocar(f, Infinity),
      // Un «sonido» que se puede reproducir: aquí, un tono con su duración en tiempos
      "music.tonePlayable": (pl, [f, beats]) => ({ tipo: "tono", f, ms: 6e4 / est.tempo * beats }),
      "music.play": function* (pl, [sonido, modo]) {
        if (!sonido || sonido.tipo !== "tono") return;
        if (modo === "UntilDone") {
          tocar(sonido.f, sonido.ms);
          yield* pausa(sonido.ms);
          est.tono.f = 0;
        } else if (modo === "InBackground") {
          tocar(sonido.f, sonido.ms);
        } else {
          tocar(sonido.f, Infinity);
        }
      },
      "music.rest": (pl, [beats]) => {
        est.tono.f = 0;
        return pausa(6e4 / est.tempo * beats);
      },
      "music.stopAllSounds": () => est.tono.f = 0,
      "music.setBuiltInSpeakerEnabled": (pl, [on]) => est.altavoz = !!on,
      "pins.analogSetPitchPin": (pl, [pin]) => est.pinTono = pin,
      "radio.setGroup": (pl, [g]) => {
        est.radio.grupo = Math.max(0, Math.min(255, Math.round(g)));
        est.radio.activa = true;
      },
      "radio.setTransmitPower": (pl, [p]) => est.radio.potencia = Math.max(0, Math.min(7, Math.round(p))),
      "radio.sendNumber": (pl, [v]) => enviar(pl, "numero", v),
      "radio.sendString": (pl, [v]) => enviar(pl, "cadena", String(v).slice(0, 19)),
      "radio.receivedPacket": () => est.radio.intensidad,
      "pins.digitalReadPin": (pl, [pin]) => {
        var _a, _b, _c;
        ponerPin(pin, "entrada");
        return (_c = (_b = (_a = entorno.circuito) == null ? void 0 : _a.leerDigital) == null ? void 0 : _b.call(_a, pin, est)) != null ? _c : 0;
      },
      "pins.digitalWritePin": (pl, [pin, v]) => {
        var _a, _b;
        soltarPWM(pin);
        ponerPin(pin, "digital", v ? 1 : 0);
        (_b = (_a = entorno.circuito) == null ? void 0 : _a.escribirDigital) == null ? void 0 : _b.call(_a, pin, v ? 1 : 0, est);
      },
      "pins.analogReadPin": (pl, [pin]) => {
        var _a, _b, _c;
        ponerPin(pin, "entradaAnalogica");
        return Math.round(Math.max(0, Math.min(1023, (_c = (_b = (_a = entorno.circuito) == null ? void 0 : _a.leerAnalogico) == null ? void 0 : _b.call(_a, pin, est)) != null ? _c : 0)));
      },
      "pins.analogWritePin": (pl, [pin, v]) => {
        var _a, _b;
        const fuera = usarPWM(pin);
        ponerPin(pin, "pwm", Math.max(0, Math.min(1023, v)));
        (_b = (_a = entorno.circuito) == null ? void 0 : _a.escribirAnalogico) == null ? void 0 : _b.call(_a, pin, Math.max(0, Math.min(1023, v)), est, fuera);
      },
      "pins.servoWritePin": (pl, [pin, v]) => {
        var _a, _b;
        const fuera = usarPWM(pin);
        ponerPin(pin, "servo", v);
        (_b = (_a = entorno.circuito) == null ? void 0 : _a.servo) == null ? void 0 : _b.call(_a, pin, v, est, fuera);
      },
      "pins.setPull": (pl, [pin, modo]) => {
        var _a;
        ponerPin(pin, ((_a = est.pines[pin]) == null ? void 0 : _a.modo) || "entrada");
        est.pines[pin].pull = modo;
      },
      "pins.map": (pl, [v, a, b, c, d]) => b === a ? c : (v - a) * (d - c) / (b - a) + c,
      "Math.randomRange": (pl, [a, b]) => {
        var _a, _b;
        const lo = Math.min(a, b);
        const hi = Math.max(a, b);
        return Math.floor((_b = (_a = entorno.azar) == null ? void 0 : _a.call(entorno)) != null ? _b : Math.random() * (hi - lo + 1)) + lo;
      },
      "Math.abs": (pl, [a]) => Math.abs(a),
      "Math.round": (pl, [a]) => Math.round(a),
      "Math.idiv": (pl, [a, b]) => b === 0 ? 0 : Math.trunc(a / b),
      "Math.max": (pl, [a, b]) => Math.max(a, b),
      "Math.min": (pl, [a, b]) => Math.min(a, b),
      ...extras
    };
    function ponerPin(pin, modo, valor) {
      var _a;
      const p = (_a = est.pines)[pin] || (_a[pin] = { modo, valor: 0, pull: "PullDown" });
      p.modo = modo;
      if (valor !== void 0) p.valor = valor;
      p.pwmPerdido = false;
    }
    function tocar(f, ms) {
      var _a, _b;
      est.tono = { f, hasta: placa.t + ms, pin: est.pinTono };
      (_b = (_a = entorno.circuito) == null ? void 0 : _a.tono) == null ? void 0 : _b.call(_a, est.pinTono, f, est);
    }
    function* calibrar() {
      var _a, _b;
      est.calibrando = true;
      placa.emitir({ tipo: "calibrar", inicio: true });
      let t = 0;
      while (!((_b = (_a = entorno.calibracionHecha) == null ? void 0 : _a.call(entorno, t)) != null ? _b : t >= 4e3)) {
        yield { esperar: 50 };
        t += 50;
      }
      est.brujulaCalibrada = true;
      est.calibrando = false;
      placa.emitir({ tipo: "calibrar", fin: true });
      mostrarMatriz(patronAMatriz(ICONOS.Happy));
      yield* pausa(400);
    }
    function enviar(pl, tipo, valor) {
      var _a, _b, _c;
      est.radio.activa = true;
      est.radio.enviados++;
      pl.emitir({ tipo: "radioEnviar", grupo: est.radio.grupo, clase: tipo, valor });
      const mundo = pl.mundo;
      for (const otra of mundo.placas) {
        if (otra === pl || !otra.microbit) continue;
        const r = otra.microbit.est.radio;
        if (!r.activa) continue;
        const llegada = (_b = (_a = entorno.radioEntrega) == null ? void 0 : _a.call(entorno, pl, otra, est.radio.potencia)) != null ? _b : { llega: true, intensidad: -50 };
        if (!llegada.llega) {
          pl.emitir({ tipo: "radioPerdido", a: otra.nombre, valor, motivo: llegada.motivo });
          continue;
        }
        if (r.grupo !== est.radio.grupo) {
          pl.emitir({ tipo: "radioIgnorado", a: otra.nombre, valor, grupo: r.grupo });
          continue;
        }
        mundo.programar((_c = llegada.retardo) != null ? _c : 1, () => {
          r.intensidad = Math.round(llegada.intensidad);
          r.recibidos++;
          otra.emitir({ tipo: "radioRecibir", de: pl.nombre, clase: tipo, valor, intensidad: r.intensidad });
          otra.disparar(tipo === "numero" ? "radio:numero" : "radio:cadena", valor);
        });
      }
    }
    const placa = new Placa({ nombre, programa, api });
    placa.microbit = { est, api };
    let usaRadio = false;
    const mirar = (n) => {
      if (!n || typeof n !== "object") return;
      if (Array.isArray(n)) return n.forEach(mirar);
      if (n.f && n.f.startsWith("radio.") || n.ev && String(n.ev).startsWith("radio.")) usaRadio = true;
      for (const k of ["cuerpo", "entonces", "sino", "args"]) if (n[k]) mirar(n[k]);
    };
    mirar(programa.bloques);
    est.radio.activa = usaRadio;
    est.contacto = { A: false, B: false, logo: false };
    est.filtro = { A: mkFiltro(), B: mkFiltro(), logo: mkFiltro() };
    est.ab = false;
    function mkFiltro() {
      return { sigma: 0, estado: false, inicio: 0, tick: 0, ultimoCrudo: false };
    }
    placa.avanzarHardware = (dt) => {
      for (const k of ["A", "B", "logo"]) {
        const f = est.filtro[k];
        f.tick += dt;
        while (f.tick >= 6) {
          f.tick -= 6;
          tickFiltro(k, f);
        }
      }
    };
    function tickFiltro(k, f) {
      var _a;
      const t = placa.mundo.t;
      const crudo = entorno.contacto ? entorno.contacto(k, est.contacto[k], t) : est.contacto[k];
      f.ultimoCrudo = crudo;
      if ((_a = entorno.sinFiltro) == null ? void 0 : _a.call(entorno, k)) {
        if (crudo !== f.estado) {
          f.estado = crudo;
          cambio(k, f, crudo, t);
        }
        f.sigma = crudo ? 12 : 0;
        return;
      }
      if (crudo) f.sigma = Math.min(12, f.sigma + 1);
      else f.sigma = Math.max(0, f.sigma - 1);
      if (f.sigma > 8 && !f.estado) {
        f.estado = true;
        cambio(k, f, true, t);
      }
      if (f.sigma < 2 && f.estado) {
        f.estado = false;
        cambio(k, f, false, t);
      }
    }
    function cambio(k, f, abajo, t) {
      if (k === "logo") est.logo = abajo;
      else est.botones[k] = abajo;
      if (abajo) {
        f.inicio = t;
        placa.emitir({ tipo: "abajo", boton: k });
        if (k !== "logo" && est.botones.A && est.botones.B) est.ab = true;
        return;
      }
      const largo = t - f.inicio >= 1e3;
      placa.emitir({ tipo: "arriba", boton: k, duracion: t - f.inicio, largo });
      if (largo) {
        placa.emitir({ tipo: "clickLargo", boton: k });
        return;
      }
      if (k === "logo") return void (placa.emitir({ tipo: "click", boton: k }), placa.disparar("logo"));
      if (est.ab) {
        if (!est.botones.A && !est.botones.B) {
          est.ab = false;
          placa.emitir({ tipo: "click", boton: "AB" });
          placa.disparar("boton:AB");
        }
        return;
      }
      placa.emitir({ tipo: "click", boton: k });
      placa.disparar("boton:" + k);
    }
    placa.pulsarBoton = (b, abajo) => {
      if (b === "AB") {
        est.contacto.A = abajo;
        est.contacto.B = abajo;
      } else est.contacto[b] = abajo;
      placa.emitir({ tipo: "dedo", boton: b, abajo });
    };
    placa.tocarLogo = (abajo) => {
      est.contacto.logo = abajo;
      placa.emitir({ tipo: "dedo", boton: "logo", abajo });
    };
    placa.gesto = (g) => {
      placa.emitir({ tipo: "gesto", gesto: g });
      placa.disparar("gesto:" + g);
    };
    placa.reiniciarMicrobit = () => {
      var _a;
      borrar();
      est.brillo = 255;
      est.pantallaActiva = true;
      est.luzActiva = false;
      est.micActivo = false;
      est.brujulaCalibrada = (_a = est.brujulaCalibradaFija) != null ? _a : false;
      est.radio = { grupo: 0, potencia: 6, activa: usaRadio, intensidad: -128, enviados: 0, recibidos: 0 };
      est.pines = {};
      est.pwm = [];
      est.canales = [null, null, null, null];
      est.ultimoCanal = 3;
      est.contacto = { A: false, B: false, logo: false };
      est.filtro = { A: mkFiltro(), B: mkFiltro(), logo: mkFiltro() };
      est.botones = { A: false, B: false };
      est.logo = false;
      est.ab = false;
      est.pinTono = "P0";
      est.tono = { f: 0, hasta: 0 };
      est.temp = { t: -Infinity, v: 0 };
      est.acebott = null;
      est.arranque = placa.mundo ? placa.mundo.t : 0;
    };
    return placa;
  }

  // ../../../../tmp/bitabit-myq0224i/progreso.js
  var CLAVE = "bitabit.progreso.v1";
  function leerProgreso() {
    try {
      const p = JSON.parse(localStorage.getItem(CLAVE));
      return p && typeof p === "object" && p.labs ? p : { labs: {} };
    } catch {
      return { labs: {} };
    }
  }
  function guardarProgreso(p) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(p));
      return true;
    } catch {
      return false;
    }
  }
  function datosLab(id) {
    return leerProgreso().labs[id] || {};
  }
  function actualizarLab(id, cambios) {
    const p = leerProgreso();
    p.labs[id] = { ...p.labs[id] || {}, ...cambios };
    return guardarProgreso(p);
  }

  // ../../../../tmp/bitabit-myq0224i/lab/base.js
  var $ = (s, el = document) => el.querySelector(s);
  var $$ = (s, el = document) => [...el.querySelectorAll(s)];
  var nf0 = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 });
  var nf1 = new Intl.NumberFormat("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var nf2 = new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function iniciarLaboratorio(crearLab) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const raiz = document.querySelector("[data-lab]");
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
        var _a2;
        const el = ((_a2 = document.querySelector(`[data-m="${clave}"]`)) == null ? void 0 : _a2.closest("[data-mc]")) || document.querySelector(`[data-mc="${clave}"]`);
        el == null ? void 0 : el.classList.toggle(nombre, !!on);
      },
      aviso(texto) {
        const a = $("#escenaAviso");
        if (!a) return;
        a.hidden = !texto;
        if (a.textContent !== (texto || "")) a.textContent = texto || "";
      },
      pie(texto) {
        const p = $("#escenaPie");
        if (p && p.textContent !== texto) p.textContent = texto;
      },
      narrar(html) {
        $("#narracion").innerHTML = html;
      },
      mostrarPieza(titulo, texto, uso) {
        $("#piezaTitulo").textContent = titulo;
        $("#piezaTexto").textContent = texto;
        $("#piezaUso").textContent = uso || "";
        $("#piezaInfo").hidden = false;
      },
      valorControl(id) {
        const el = document.getElementById(id);
        if (!el) return null;
        if (el.type === "checkbox") return el.checked;
        if (el.type === "range") return Number(el.value);
        const b = el.querySelector('[aria-pressed="true"]');
        return b ? b.dataset.valor : null;
      }
    };
    const lab = crearLab(ui);
    const programas = lab.programas || [{ nombre: null, programa: lab.programa }];
    let progActual = 0;
    let prog = null;
    function montar(i) {
      var _a2;
      progActual = i;
      prog = montarPrograma({ bloques: $("#bloques"), python: $("#python"), programa: programas[i].programa, idioma });
      (_a2 = lab.alCambiarPrograma) == null ? void 0 : _a2.call(lab, i);
    }
    let idioma = "es";
    montar(0);
    ui.resaltar = (r, cual = null) => {
      if (cual != null && cual !== progActual) return;
      prog == null ? void 0 : prog.resaltar(r);
    };
    ui.programaVisible = () => progActual;
    ui.cambiarPrograma = (nuevo, i = progActual) => {
      programas[i].programa = nuevo;
      if (i === progActual) {
        prog = montarPrograma({ bloques: $("#bloques"), python: $("#python"), programa: nuevo, idioma });
      }
    };
    ui.repintarPrograma = () => {
      prog = montarPrograma({ bloques: $("#bloques"), python: $("#python"), programa: programas[progActual].programa, idioma });
    };
    $$("#selPrograma button").forEach(
      (b) => b.addEventListener("click", () => {
        $$("#selPrograma button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        montar(Number(b.dataset.i));
      })
    );
    $$(".programa [data-tab]").forEach(
      (b) => b.addEventListener("click", () => {
        $$(".programa [data-tab]").forEach((x) => {
          const on = x === b;
          x.setAttribute("aria-selected", String(on));
          x.setAttribute("aria-pressed", String(on));
        });
        $("#bloques").hidden = b.dataset.tab !== "bloques";
        $("#python").hidden = b.dataset.tab !== "python";
        $("#idiomaBloques").hidden = b.dataset.tab !== "bloques";
      })
    );
    $$("#idiomaBloques button").forEach(
      (b) => b.addEventListener("click", () => {
        $$("#idiomaBloques button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        idioma = b.dataset.lang;
        prog.idiomaBloques(idioma);
      })
    );
    async function copiar(texto, tipo) {
      const aviso = $("#copiadoAviso");
      try {
        await navigator.clipboard.writeText(texto);
        aviso.textContent = tipo === "py" ? "Python copiado." : "JavaScript copiado: pégalo en la pestaña JavaScript de MakeCode.";
      } catch {
        const ta = $("#copiaManual");
        ta.hidden = false;
        ta.value = texto;
        ta.focus();
        ta.select();
        aviso.textContent = "Tu navegador no deja copiar desde aquí: el texto está seleccionado, cópialo con Ctrl+C.";
      }
    }
    (_a = $("#copiarPython")) == null ? void 0 : _a.addEventListener("click", () => copiar(textoCodigo(programas[progActual].programa, "py"), "py"));
    (_b = $("#copiarJS")) == null ? void 0 : _b.addEventListener("click", () => copiar(textoCodigo(programas[progActual].programa, "js"), "js"));
    const escena = $("#escena");
    const vista = lab.montarEscena(escena, ui);
    (_c = $("#piezaCerrar")) == null ? void 0 : _c.addEventListener("click", () => $("#piezaInfo").hidden = true);
    $$("#vistas button").forEach(
      (b) => b.addEventListener("click", () => {
        var _a2;
        $$("#vistas button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        (_a2 = vista.ponerVista) == null ? void 0 : _a2.call(vista, b.dataset.vista);
      })
    );
    $$(".opciones [data-opcion]").forEach(
      (b) => b.addEventListener("click", () => {
        var _a2;
        const v = b.getAttribute("aria-pressed") !== "true";
        b.setAttribute("aria-pressed", String(v));
        (_a2 = vista.opcion) == null ? void 0 : _a2.call(vista, b.dataset.opcion, v);
      })
    );
    let modo = "pausa";
    let factor = 1;
    const nFases = $$("#fases li").length;
    function marcarFases(i) {
      $$("#fases li").forEach((li, k) => {
        li.classList.toggle("activa", k === i);
        li.classList.toggle("hecha", i != null && i >= 0 && k < i);
      });
    }
    ui.marcarFases = marcarFases;
    function ponerModo(m) {
      var _a2, _b2;
      modo = m;
      const auto = m === "auto";
      $("#btnAuto").setAttribute("aria-pressed", String(auto));
      $("#btnAutoTxt").textContent = auto ? "Pausa" : "Automático";
      if (auto) {
        marcarFases(null);
        ui.narrar(((_a2 = lab.narracionAuto) == null ? void 0 : _a2.call(lab)) || "En marcha.");
        (_b2 = lab.alEmpezarAuto) == null ? void 0 : _b2.call(lab);
      }
    }
    ui.ponerModo = ponerModo;
    ui.modo = () => modo;
    $("#btnAuto").addEventListener("click", () => ponerModo(modo === "auto" ? "pausa" : "auto"));
    (_d = $("#velocidad")) == null ? void 0 : _d.addEventListener("change", (e) => factor = Number(e.target.value));
    $("#btnPaso").addEventListener("click", () => {
      var _a2, _b2;
      if (modo === "auto") ponerModo("pausa");
      const r = lab.paso();
      if (!r) return;
      if (r.fase != null) marcarFases(r.fase);
      if (r.html) ui.narrar(r.html);
      if (r.resaltar) ui.resaltar(r.resaltar, (_a2 = r.programa) != null ? _a2 : null);
      (_b2 = lab.monitor) == null ? void 0 : _b2.call(lab);
    });
    function reiniciar() {
      var _a2;
      lab.reiniciar();
      marcarFases(null);
      ui.resaltar({});
      $("#piezaInfo") && ($("#piezaInfo").hidden = true);
      (_a2 = lab.monitor) == null ? void 0 : _a2.call(lab);
    }
    ui.reiniciar = reiniciar;
    $("#btnReiniciar").addEventListener("click", () => {
      reiniciar();
      ponerModo("pausa");
      ui.narrar(lab.narracionInicio());
    });
    function cambiarControl(id, valor) {
      var _a2, _b2, _c2;
      (_a2 = lab.cambiar) == null ? void 0 : _a2.call(lab, id, valor);
      $("#explica").innerHTML = (((_b2 = lab.explicar) == null ? void 0 : _b2.call(lab)) || []).map((p) => `<p>${p}</p>`).join("");
      (_c2 = lab.monitor) == null ? void 0 : _c2.call(lab);
    }
    $$("[data-control]").forEach((grupo) => {
      const id = grupo.dataset.control;
      if (grupo.matches(".segmento")) {
        grupo.querySelectorAll("button").forEach(
          (b) => b.addEventListener("click", () => {
            grupo.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
            cambiarControl(id, b.dataset.valor);
          })
        );
      } else if (grupo.type === "checkbox") grupo.addEventListener("change", () => cambiarControl(id, grupo.checked));
      else if (grupo.type === "range") {
        const salida = document.querySelector(`[data-salida="${id}"]`);
        const pintar = () => salida && (salida.textContent = grupo.dataset.formato ? grupo.dataset.formato.replace("{}", nf0.format(Number(grupo.value))) : grupo.value);
        pintar();
        grupo.addEventListener("input", () => {
          pintar();
          cambiarControl(id, Number(grupo.value));
        });
      }
    });
    (_e = $("#normalidad")) == null ? void 0 : _e.addEventListener("click", () => {
      var _a2, _b2;
      $$("[data-control]").forEach((grupo) => {
        var _a3, _b3, _c2;
        const id = grupo.dataset.control;
        if (grupo.matches(".segmento")) {
          const def2 = (_a3 = grupo.dataset.defecto) != null ? _a3 : "";
          grupo.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.valor === def2)));
          (_b3 = lab.cambiar) == null ? void 0 : _b3.call(lab, id, def2);
        } else if (grupo.type === "checkbox") {
          grupo.checked = grupo.dataset.defecto === "true";
          (_c2 = lab.cambiar) == null ? void 0 : _c2.call(lab, id, grupo.checked);
        } else if (grupo.type === "range") {
          grupo.value = grupo.dataset.defecto;
          grupo.dispatchEvent(new Event("input"));
        }
      });
      $("#explica").innerHTML = (((_a2 = lab.explicar) == null ? void 0 : _a2.call(lab)) || []).map((p) => `<p>${p}</p>`).join("");
      (_b2 = lab.monitor) == null ? void 0 : _b2.call(lab);
    });
    (_f = $("#probarError")) == null ? void 0 : _f.addEventListener("click", () => {
      var _a2;
      reiniciar();
      const html = (_a2 = lab.probarError) == null ? void 0 : _a2.call(lab);
      if (html) ui.narrar(html);
      escena.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    });
    const RESPUESTAS = Object.fromEntries($$(".pregunta").map((f) => [f.dataset.q, f.dataset.correcta]));
    const guardado = datosLab(ID_LAB);
    function corregir(q, valor, guardar = true) {
      const fs = document.querySelector(`[data-q="${q}"]`);
      const bien = valor === RESPUESTAS[q];
      fs.querySelectorAll(".opcion").forEach((o) => {
        const inp = o.querySelector("input");
        o.classList.toggle("bien", inp.checked && bien);
        o.classList.toggle("mal", inp.checked && !bien);
      });
      const out = fs.querySelector(".respuesta");
      out.hidden = false;
      out.className = "respuesta " + (bien ? "bien" : "mal");
      out.innerHTML = (bien ? "<strong>Correcto.</strong> " : "<strong>Todavía no.</strong> ") + fs.dataset.explicacion;
      if (guardar) actualizarLab(ID_LAB, { respuestas: { ...datosLab(ID_LAB).respuestas || {}, [q]: valor } });
      revisarHecho();
    }
    $$(".pregunta input").forEach((inp) => inp.addEventListener("change", () => corregir(inp.name, inp.value)));
    if (guardado.respuestas)
      for (const [q, v] of Object.entries(guardado.respuestas)) {
        const inp = document.querySelector(`.pregunta input[name="${q}"][value="${v}"]`);
        if (inp) {
          inp.checked = true;
          corregir(q, v, false);
        }
      }
    const checks = $$("#comprobacion input");
    checks.forEach((c, i) => {
      var _a2;
      if ((_a2 = guardado.comprobacion) == null ? void 0 : _a2[i]) c.checked = true;
      c.addEventListener("change", () => {
        actualizarLab(ID_LAB, { comprobacion: checks.map((x) => x.checked) });
        revisarHecho();
      });
    });
    function revisarHecho() {
      const d = datosLab(ID_LAB);
      const preguntasBien = Object.keys(RESPUESTAS).every((q) => {
        var _a2;
        return ((_a2 = d.respuestas) == null ? void 0 : _a2[q]) === RESPUESTAS[q];
      });
      const hecho = !!d.hecho;
      $("#marcarHecho").textContent = hecho ? "Quitar la marca de hecho" : "Marcar como hecho";
      $("#estadoHecho").innerHTML = hecho ? '<span class="chip hecho">Hecho</span> Aparece así en la ruta de este navegador.' : preguntasBien ? "Las tres preguntas están bien. Cuando hagas la práctica con el material real, márcalo como hecho." : "Cuando acabes la práctica y las preguntas, márcalo como hecho.";
    }
    $("#marcarHecho").addEventListener("click", () => {
      actualizarLab(ID_LAB, { hecho: !datosLab(ID_LAB).hecho });
      revisarHecho();
    });
    revisarHecho();
    let enPantalla = true;
    new IntersectionObserver((ent) => enPantalla = ent[0].isIntersecting, { threshold: 0.02 }).observe(escena);
    let tPrev = performance.now();
    let tPanel = 0;
    function cuadro(now) {
      var _a2, _b2, _c2, _d2;
      const dt = Math.min(64, now - tPrev);
      tPrev = now;
      if (modo === "auto" && enPantalla && !document.hidden) lab.avanzar(dt * factor);
      if (enPantalla) (_a2 = vista.dibujar) == null ? void 0 : _a2.call(vista, now);
      if (now - tPanel > 100) {
        tPanel = now;
        (_b2 = lab.monitor) == null ? void 0 : _b2.call(lab);
        if (modo === "auto") {
          const r = (_c2 = lab.resaltadoAuto) == null ? void 0 : _c2.call(lab);
          if (r) ui.resaltar(r, (_d2 = r.programa) != null ? _d2 : null);
        }
      }
      requestAnimationFrame(cuadro);
    }
    ui.narrar(lab.narracionInicio());
    $("#explica").innerHTML = (((_g = lab.explicar) == null ? void 0 : _g.call(lab)) || []).map((p) => `<p>${p}</p>`).join("");
    (_h = lab.monitor) == null ? void 0 : _h.call(lab);
    requestAnimationFrame(cuadro);
    return { lab, ui };
  }

  // ../../../../tmp/bitabit-myq0224i/lab/dibujos.js
  var CONECTOR = [
    { p: "P3" },
    { p: "P0", anilla: "0" },
    { p: "P4" },
    { p: "P5" },
    { p: "P6" },
    { p: "P7" },
    { p: "P1", anilla: "1" },
    { p: "P8" },
    { p: "P9" },
    { p: "P10" },
    { p: "P11" },
    { p: "P12" },
    { p: "P2", anilla: "2" },
    { p: "P13" },
    { p: "P14" },
    { p: "P15" },
    { p: "P16" },
    { p: "3V", anilla: "3V" },
    { p: "3V" },
    { p: "3V" },
    { p: "P19" },
    { p: "P20" },
    { p: "GND" },
    { p: "GND" },
    { p: "GND", anilla: "GND" }
  ];
  function posicionesConector() {
    const anillas = { 0: 50, 1: 154, 2: 258, "3V": 362, GND: 466 };
    const res = [];
    let i = 0;
    const grupos = [];
    let actual = [];
    for (const c of CONECTOR) {
      if (c.anilla) {
        grupos.push({ pequenos: actual, anilla: c });
        actual = [];
      } else actual.push(c);
    }
    let xPrev = 6;
    for (const g of grupos) {
      const xA = anillas[g.anilla.anilla];
      const ini = xPrev + (xPrev === 6 ? 0 : 31);
      const fin = xA - 31;
      const n = g.pequenos.length;
      g.pequenos.forEach((c, k) => {
        const x = n === 1 ? (ini + fin) / 2 : ini + (fin - ini) * (k + 0.5) / n;
        res.push({ ...c, x, i: i++ });
      });
      res.push({ ...g.anilla, x: xA, i: i++ });
      xPrev = xA;
    }
    return res;
  }
  var LEDX = (c) => 166 + c * 46;
  var LEDY = (f) => 92 + f * 44;
  function microbitFrente({ interior = "" } = {}) {
    const pos = posicionesConector();
    let leds = "";
    for (let f = 0; f < 5; f++)
      for (let c = 0; c < 5; c++)
        leds += `<g class="mb-led" data-x="${c}" data-y="${f}" transform="translate(${LEDX(c)} ${LEDY(f)})"><rect class="mb-led-halo" x="-17" y="-17" width="34" height="34" rx="17"/><rect class="mb-led-cuerpo" x="-6" y="-11" width="12" height="22" rx="2"/></g>`;
    let conector = "";
    for (const c of pos) {
      if (c.anilla) {
        conector += `<g class="mb-pin mb-anilla" data-pin="${c.p}" data-pieza="pin-${c.p}"><rect x="${c.x - 28}" y="330" width="56" height="90" rx="6" class="oro"/><circle cx="${c.x}" cy="372" r="19" class="agujero"/><text x="${c.x}" y="322" class="serigrafia" text-anchor="middle">${c.anilla}</text></g>`;
      } else conector += `<rect class="mb-pin oro" data-pin="${c.p}" x="${c.x - 3}" y="358" width="6" height="62" rx="1.5"/>`;
    }
    return `
  <g class="microbit frente">
    <g class="carcasa">
      <path class="pcb" d="M30 0 H486 A30 30 0 0 1 516 30 V420 H0 V30 A30 30 0 0 1 30 0 Z"/>
      <text x="258" y="300" class="serigrafia marca" text-anchor="middle">micro:bit</text>
    </g>
    ${interior}
    <g class="mb-logo" data-pieza="logo">
      <path d="M222 22 h72 a20 20 0 0 1 0 40 h-72 a20 20 0 0 1 0 -40 z" class="oro"/>
      <path d="M226 28 h64 a14 14 0 0 1 0 28 h-64 a14 14 0 0 1 0 -28 z" class="pcb-hueco"/>
      <circle cx="240" cy="42" r="6" class="oro"/><circle cx="276" cy="42" r="6" class="oro"/>
    </g>
    <g class="mb-mic-led" data-pieza="microfono"><rect x="322" y="34" width="12" height="16" rx="2" class="led-apagado"/></g>
    <g class="mb-boton" data-boton="A" data-pieza="botonA">
      <rect x="22" y="146" width="66" height="66" rx="8" class="boton-cuerpo"/>
      <circle cx="55" cy="179" r="21" class="boton-tapa"/>
      <text x="55" y="244" class="serigrafia" text-anchor="middle">A</text>
    </g>
    <g class="mb-boton" data-boton="B" data-pieza="botonB">
      <rect x="428" y="146" width="66" height="66" rx="8" class="boton-cuerpo"/>
      <circle cx="461" cy="179" r="21" class="boton-tapa"/>
      <text x="461" y="244" class="serigrafia" text-anchor="middle">B</text>
    </g>
    <g class="mb-pantalla" data-pieza="pantalla">${leds}</g>
    <g class="mb-conector" data-pieza="conector">${conector}</g>
  </g>`;
  }
  var ESTILO_DIBUJOS = `
<style>
  .pcb { fill: #1c2023; stroke: #3a4146; stroke-width: 2; }
  .pcb-hueco { fill: #1c2023; }
  .oro { fill: #d6aa3c; stroke: #a67e22; stroke-width: 1.5; }
  .agujero { fill: var(--escena-agujero, #e3e6df); stroke: #a67e22; stroke-width: 2; }
  .serigrafia { fill: #f2f2ee; font: 700 22px/1 "Archivo", system-ui, sans-serif; letter-spacing: 0.5px; }
  .serigrafia.marca { font-size: 30px; opacity: 0.85; }
  .boton-cuerpo { fill: #4b5257; stroke: #2b3033; stroke-width: 2; }
  .boton-tapa { fill: #15181a; stroke: #000; stroke-width: 1.5; }
  .mb-boton.pulsado .boton-tapa { fill: #000; transform-box: fill-box; transform-origin: center; transform: scale(0.88); }
  .mb-boton { cursor: pointer; }
  .mb-logo { cursor: pointer; }
  .mb-logo.tocado .oro { fill: #ffd76a; }
  .mb-led-cuerpo { fill: #3a1d1b; stroke: #120b0a; stroke-width: 1; }
  .mb-led-halo { fill: #ff2a1f; opacity: 0; }
  .led-apagado { fill: #3a1d1b; }
  .led-encendido { fill: #ff4136; }
  .chip { fill: #22272a; stroke: #4d565c; stroke-width: 2; }
  .chip-texto { fill: #c9d1cd; font: 600 13px/1 "Atkinson Hyperlegible Mono", ui-monospace, monospace; }
  .chip-texto.peq { font-size: 10px; }
  .chip-punto { fill: #4d565c; }
  .metal { fill: #b8bec2; stroke: #7d868c; stroke-width: 1.5; }
  .metal-oscuro { fill: #50585e; }
  .conector-blanco { fill: #efece2; stroke: #b9b39f; stroke-width: 1.5; }
  .altavoz { fill: #101214; stroke: #3d4448; stroke-width: 2; }
  .altavoz-rejilla { fill: none; stroke: #2f3539; stroke-width: 6; stroke-dasharray: 3 5; }
  .altavoz-centro { fill: #3d4448; }
  .interior { opacity: 0; transition: opacity 0.25s; pointer-events: none; }
  .transparente .interior { opacity: 1; }
  .transparente .carcasa .pcb { fill-opacity: 0.62; }
  .pista { fill: none; stroke: #9aa39e; stroke-width: 3; stroke-linecap: round; }
  .pista.on { stroke: #ffcf3f; stroke-width: 5; }
  .pista.baja { stroke: #43c3a5; stroke-width: 5; }
  .etiqueta-pista { fill: #e9ece8; font: 700 15px/1 "Atkinson Hyperlegible Mono", ui-monospace, monospace; }
  .etiqueta-pista.on { fill: #ffd65a; }
  .etiqueta-pista.baja { fill: #6fe0c4; }
  .cota { fill: #c7ccc8; font: 600 14px/1 "Atkinson Hyperlegible Next", system-ui, sans-serif; }
</style>`;

  // ../../../../tmp/bitabit-myq0224i/lab/rotulos.js
  var NS = "http://www.w3.org/2000/svg";
  var MARGEN = 6;
  var SEP = 18;
  var GAP = 5;
  function crearRotulos(capa, { alPulsar } = {}) {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "guias");
    svg.setAttribute("aria-hidden", "true");
    capa.appendChild(svg);
    const items = /* @__PURE__ */ new Map();
    function nuevaGuia() {
      const g = document.createElementNS(NS, "g");
      const halo = document.createElementNS(NS, "polyline");
      halo.setAttribute("class", "halo");
      const linea = document.createElementNS(NS, "polyline");
      linea.setAttribute("class", "linea");
      const punto = document.createElementNS(NS, "circle");
      punto.setAttribute("r", "2.6");
      g.append(halo, linea, punto);
      svg.appendChild(g);
      let ultimo = "";
      return {
        poner(puntos) {
          const p = puntos.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
          if (p !== ultimo) {
            halo.setAttribute("points", p);
            linea.setAttribute("points", p);
            const [x, y] = puntos[puntos.length - 1];
            punto.setAttribute("cx", x.toFixed(1));
            punto.setAttribute("cy", y.toFixed(1));
            ultimo = p;
          }
          g.style.display = "";
        },
        ocultar() {
          g.style.display = "none";
        }
      };
    }
    function definir(lista) {
      var _a;
      for (const it of items.values()) {
        it.el.remove();
        it.guia.ocultar();
      }
      items.clear();
      for (const d of lista) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "etq" + (d.clase ? " " + d.clase : "");
        const n = document.createElement("span");
        n.className = "etq-nombre";
        n.textContent = d.texto;
        b.appendChild(n);
        const v = document.createElement("span");
        v.className = "etq-valor";
        v.hidden = true;
        b.appendChild(v);
        b.hidden = true;
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          alPulsar == null ? void 0 : alPulsar(d.id);
        });
        capa.appendChild(b);
        items.set(d.id, { ...d, el: b, nombre: n, valorEl: v, guia: nuevaGuia(), w: 0, h: 0, medir: true, prio: (_a = d.prio) != null ? _a : 3 });
      }
    }
    function colocar({ anclas, caja, ancho, alto, margenSup = 8, mostrar = true, valores = {}, lados = {} }) {
      const vivos = [];
      for (const it of items.values()) {
        const a = anclas[it.id];
        const v = valores[it.id];
        if (v != null) {
          if (it.valorEl.textContent !== v) {
            if (it.valorEl.textContent.length !== String(v).length) it.medir = true;
            it.valorEl.textContent = v;
          }
          if (it.valorEl.hidden) {
            it.valorEl.hidden = false;
            it.medir = true;
          }
        } else if (!it.valorEl.hidden) {
          it.valorEl.hidden = true;
          it.medir = true;
        }
        if (!mostrar || !a) {
          it.el.hidden = true;
          it.guia.ocultar();
          continue;
        }
        it.ax = a.x;
        it.ay = a.y;
        vivos.push(it);
      }
      for (const it of vivos) it.el.hidden = false;
      for (const it of vivos)
        if (it.medir || !it.w) {
          it.w = it.el.offsetWidth;
          it.h = it.el.offsetHeight;
          it.medir = false;
        }
      const centro = (caja.x0 + caja.x1) / 2;
      const izq = [];
      const der = [];
      for (const it of vivos) {
        const lado = lados[it.id] || (it.ax < centro ? "izq" : "der");
        (lado === "izq" ? izq : der).push(it);
      }
      while (Math.abs(izq.length - der.length) > 2) {
        const [mas, menos] = izq.length > der.length ? [izq, der] : [der, izq];
        let k = 0;
        mas.forEach((it, i) => {
          if (!lados[it.id] && Math.abs(it.ax - centro) < Math.abs(mas[k].ax - centro)) k = i;
        });
        menos.push(mas.splice(k, 1)[0]);
      }
      const sup = margenSup;
      const inf = alto - MARGEN;
      for (const [lista, lado] of [
        [izq, "izq"],
        [der, "der"]
      ]) {
        if (!lista.length) continue;
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
          it.left = lado === "izq" ? Math.max(MARGEN, caja.x0 - SEP - it.w) : Math.min(ancho - MARGEN - it.w, caja.x1 + SEP);
        }
      }
      for (const it of vivos) {
        if (it.oculto) {
          it.oculto = false;
          it.el.hidden = true;
          it.guia.ocultar();
          continue;
        }
        it.el.style.transform = `translate(${it.left.toFixed(1)}px, ${it.top.toFixed(1)}px)`;
        const cy = it.top + it.h / 2;
        const bx = it.lado === "izq" ? it.left + it.w : it.left;
        const dir = it.lado === "izq" ? 1 : -1;
        it.guia.poner([
          [bx, cy],
          [bx + dir * 8, cy],
          [it.ax, it.ay]
        ]);
      }
    }
    function colocarCerca({ anclas, ancho, alto, margenSup = 8, mostrar = true, valores = {}, prohibidas = [], minPrio = 0 }) {
      const vivos = [];
      for (const it of items.values()) {
        const a = anclas[it.id];
        const v = valores[it.id];
        if (v != null) {
          if (it.valorEl.textContent !== v) {
            if (it.valorEl.textContent.length !== String(v).length) it.medir = true;
            it.valorEl.textContent = v;
          }
          if (it.valorEl.hidden) {
            it.valorEl.hidden = false;
            it.medir = true;
          }
        } else if (!it.valorEl.hidden) {
          it.valorEl.hidden = true;
          it.medir = true;
        }
        if (!mostrar || !a || it.prio < minPrio) {
          it.el.hidden = true;
          it.guia.ocultar();
          continue;
        }
        it.ax = a.x;
        it.ay = a.y;
        vivos.push(it);
      }
      for (const it of vivos) it.el.hidden = false;
      for (const it of vivos)
        if (it.medir || !it.w) {
          it.w = it.el.offsetWidth;
          it.h = it.el.offsetHeight;
          it.medir = false;
        }
      vivos.sort((a, b) => b.prio - a.prio);
      const puestas = prohibidas.map((z) => ({ ...z }));
      const pisa = (r, propia) => puestas.some((q) => (!propia || q.id !== propia) && r.x0 < q.x1 && r.x1 > q.x0 && r.y0 < q.y1 && r.y1 > q.y0);
      for (const it of vivos) {
        const { ax, ay, w, h } = it;
        const cand = [];
        for (const d of it.prio < 5 ? [16, 34, 58] : [16, 34, 58, 86, 120, 160]) {
          cand.push([ax - w / 2, ay - h - d], [ax - w / 2, ay + d], [ax + d, ay - h / 2], [ax - w - d, ay - h / 2], [ax + d * 0.7, ay - h - d * 0.7], [ax - w - d * 0.7, ay - h - d * 0.7], [ax + d * 0.7, ay + d * 0.7], [ax - w - d * 0.7, ay + d * 0.7]);
        }
        let elegido = null;
        for (const [x, y] of cand) {
          const r = { x0: x - 2, y0: y - 2, x1: x + w + 2, y1: y + h + 2 };
          if (x < MARGEN || y < margenSup || x + w > ancho - MARGEN || y + h > alto - MARGEN) continue;
          if (!pisa(r, it.zona)) {
            elegido = { x, y, r };
            break;
          }
        }
        if (!elegido) {
          it.el.hidden = true;
          it.guia.ocultar();
          continue;
        }
        puestas.push(elegido.r);
        it.left = elegido.x;
        it.top = elegido.y;
        it.el.style.transform = `translate(${it.left.toFixed(1)}px, ${it.top.toFixed(1)}px)`;
        const bx = Math.min(Math.max(ax, it.left), it.left + w);
        const by = Math.min(Math.max(ay, it.top), it.top + h);
        it.guia.poner([
          [bx, by],
          [ax, ay]
        ]);
      }
    }
    return { definir, colocar, colocarCerca, items };
  }

  // ../../../../tmp/bitabit-myq0224i/lab/escena2d.js
  function crearEscena2D({ contenedor, ancho, alto, svg: marcado, rotulos = [], caja, alPulsar, alDibujar, valores, lados, vistaInicial = null, alCambiarVista, modoRotulos = "columnas", prohibidas = [], alinear = "centro" }) {
    var _a, _b;
    const NS2 = "http://www.w3.org/2000/svg";
    const raiz = document.createElementNS(NS2, "svg");
    raiz.setAttribute("viewBox", `0 0 ${ancho} ${alto}`);
    raiz.setAttribute("preserveAspectRatio", alinear === "arriba" ? "xMidYMin meet" : "xMidYMid meet");
    raiz.setAttribute("class", "lienzo-svg transparente");
    raiz.setAttribute("role", "img");
    raiz.setAttribute("aria-label", contenedor.dataset.descripcion || "Escena del laboratorio");
    raiz.innerHTML = marcado;
    const capa = contenedor.querySelector(".etiquetas");
    contenedor.insertBefore(raiz, capa);
    (_a = contenedor.querySelector("canvas")) == null ? void 0 : _a.remove();
    const opciones = { transparente: true, nombres: true };
    let vista = vistaInicial;
    if (vista) raiz.dataset.vista = vista;
    const rot = crearRotulos(capa, { alPulsar });
    rot.definir(rotulos);
    let W = 1;
    let H = 1;
    let s = 1;
    let ox = 0;
    let oy = 0;
    let margenSup = 8;
    const barra = (_b = contenedor.parentElement) == null ? void 0 : _b.querySelector(".escena-barra");
    const medir = () => {
      const r = contenedor.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      margenSup = barra && !barra.hidden && getComputedStyle(barra).position === "absolute" ? barra.offsetTop + barra.offsetHeight + 8 : 8;
      s = Math.min(W / ancho, H / alto);
      ox = (W - ancho * s) / 2;
      if (alinear === "arriba") {
        oy = Math.max(0, Math.min(margenSup - 10, H - alto * s));
        raiz.style.height = `calc(100% - ${oy.toFixed(0)}px)`;
        raiz.style.marginTop = `${oy.toFixed(0)}px`;
      } else oy = (H - alto * s) / 2;
      for (const it of rot.items.values()) it.medir = true;
    };
    new ResizeObserver(medir).observe(contenedor);
    medir();
    const aPixel = (x, y) => ({ x: x * s + ox, y: y * s + oy });
    raiz.addEventListener("click", (e) => {
      const p = e.target.closest("[data-pieza]");
      if (p) alPulsar == null ? void 0 : alPulsar(p.dataset.pieza, e);
    });
    function dibujar(now) {
      alDibujar == null ? void 0 : alDibujar(raiz, { vista, opciones, now });
      const anclas = {};
      for (const d of rotulos) {
        const a = typeof d.ancla === "function" ? d.ancla(vista) : d.ancla;
        if (!a) continue;
        if (d.vistas && vista && !d.vistas.includes(vista)) continue;
        anclas[d.id] = aPixel(a[0], a[1]);
      }
      if (modoRotulos === "cerca") {
        const zonas = (typeof prohibidas === "function" ? prohibidas(vista) : prohibidas).map(([x0, y0, x1, y1, id]) => {
          const a = aPixel(x0, y0);
          const b = aPixel(x1, y1);
          return { x0: a.x, y0: a.y, x1: b.x, y1: b.y, id };
        });
        const bot = contenedor.querySelector(".botonera");
        if (bot && bot.offsetWidth) zonas.push({ x0: bot.offsetLeft - 4, y0: bot.offsetTop - 4, x1: bot.offsetLeft + bot.offsetWidth + 4, y1: bot.offsetTop + bot.offsetHeight + 4 });
        rot.colocarCerca({ anclas, ancho: W, alto: H, margenSup, mostrar: opciones.nombres, valores: (valores == null ? void 0 : valores()) || {}, prohibidas: zonas, minPrio: W < 520 ? 5 : 0 });
        return;
      }
      const c = typeof caja === "function" ? caja(vista) : caja;
      const p0 = aPixel(c[0], c[1]);
      const p1 = aPixel(c[2], c[3]);
      rot.colocar({
        anclas,
        caja: { x0: p0.x, y0: p0.y, x1: p1.x, y1: p1.y },
        ancho: W,
        alto: H,
        margenSup,
        mostrar: opciones.nombres,
        valores: (valores == null ? void 0 : valores()) || {},
        lados: typeof lados === "function" ? lados(vista) : lados || {}
      });
    }
    return {
      svg: raiz,
      q: (sel) => raiz.querySelector(sel),
      qa: (sel) => [...raiz.querySelectorAll(sel)],
      dibujar,
      aPixel,
      opcion(nombre, v) {
        opciones[nombre] = v;
        if (nombre === "transparente") raiz.classList.toggle("transparente", v);
      },
      ponerVista(v) {
        vista = v;
        raiz.dataset.vista = v;
        alCambiarVista == null ? void 0 : alCambiarVista(v);
      },
      get vista() {
        return vista;
      },
      opciones
    };
  }

  // ../../../../tmp/bitabit-myq0224i/lab/banco.js
  var ELEC = {
    vdd: 3.3,
    maxPin: 3.6,
    // un pin no admite más de 0,3 V por encima de su alimentación
    vih: 0.7 * 3.3,
    // por encima, la entrada lee 1
    vil: 0.3 * 3.3,
    // por debajo, lee 0
    pull: 13
    // kΩ, resistencia interna (hacia GND por defecto, según CODAL)
  };
  var USO_PIN = {
    P0: { libre: true, analogico: true },
    P1: { libre: true, analogico: true },
    P2: { libre: true, analogico: true },
    P3: { pantalla: true, analogico: true },
    P4: { pantalla: true, analogico: true },
    P5: { boton: "A" },
    P6: { pantalla: true },
    P7: { pantalla: true },
    P8: { libre: true },
    P9: { libre: true },
    P10: { pantalla: true, analogico: true },
    P11: { boton: "B" },
    P12: { reservado: true },
    P13: { libre: true },
    P14: { libre: true },
    P15: { libre: true },
    P16: { libre: true },
    P19: { i2c: "SCL" },
    P20: { i2c: "SDA" }
  };
  function usoPin(p) {
    const u = USO_PIN[p] || {};
    if (u.pantalla) return "la pantalla";
    if (u.boton) return `el botón ${u.boton}`;
    if (u.reservado) return "el modo de accesibilidad";
    if (u.i2c) return `el bus I2C (${u.i2c})`;
    return null;
  }
  var FILA1 = ["P0", "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9"];
  var FILA2 = ["P10", "P11", "P12", "P13", "P14", "P15", "P16", "P19", "P20"];
  var SHIELD = { ancho: 600, alto: 390, mbEscala: 0.5, mbX: 150, mbY: -196 };
  var X_IIC = 568;
  var POS_IIC = { SDA: { x: X_IIC, y: 249 }, SCL: { x: X_IIC, y: 276 }, V: { x: X_IIC, y: 303 }, G: { x: X_IIC, y: 330 } };
  var PASO2 = 27;
  var X0 = 302;
  function posConector(pin) {
    let i = FILA1.indexOf(pin);
    let y0 = 150;
    if (i < 0) {
      i = FILA2.indexOf(pin);
      y0 = 276;
    }
    const x = X0 + i * PASO2;
    return { x, y0, fila: y0 === 150 ? 1 : 2, s: { x, y: y0 }, v: { x, y: y0 + PASO2 }, g: { x, y: y0 + 2 * PASO2 } };
  }
  function xRanura(pin) {
    const c = posicionesConector().find((k) => k.p === pin);
    return c ? SHIELD.mbX + c.x * SHIELD.mbEscala : 280;
  }
  function dibujoShield({ ox = 0, oy = 0, usados = [], interiorMicrobit = "" } = {}) {
    const S = SHIELD;
    let conectores = "";
    for (const pin of [...FILA1, ...FILA2]) {
      const p = posConector(pin);
      const u = USO_PIN[pin];
      conectores += `<g class="conector${u.libre ? "" : " ocupado"}" data-conector="${pin}" data-pieza="con-${pin}">
        <rect x="${p.x - 11}" y="${p.y0 - 12}" width="22" height="${2 * PASO2 + 24}" rx="3" class="cabecera"/>
        <rect x="${p.x - 5}" y="${p.s.y - 5}" width="10" height="10" class="clavija s"/>
        <rect x="${p.x - 5}" y="${p.v.y - 5}" width="10" height="10" class="clavija v"/>
        <rect x="${p.x - 5}" y="${p.g.y - 5}" width="10" height="10" class="clavija g"/>
        <text x="${p.x}" y="${p.y0 + 2 * PASO2 + 31}" class="serigrafia-sh" text-anchor="middle">${pin.replace("P", "")}</text>
      </g>`;
    }
    let pistas = "";
    usados.forEach((pin, k) => {
      const carril = 44 + k * 11;
      if (pin === "IIC:SDA") {
        pistas += `<path class="pista-s" data-pista="IIC:SDA" d="M${X_IIC} 249 H531 V${carril} H${xRanura("P20")} V24"/>`;
        return;
      }
      if (pin === "IIC:SCL") {
        pistas += `<path class="pista-s" data-pista="IIC:SCL" d="M${X_IIC} 276 H543 V257 H504 V${carril} H${xRanura("P19")} V24"/>`;
        return;
      }
      const p = posConector(pin);
      const xr = xRanura(pin);
      const xs = p.fila === 1 ? p.x : p.x + 13;
      const inicio = p.fila === 1 ? `M${p.x} ${p.s.y}` : `M${p.x} ${p.s.y} H${xs}`;
      pistas += `<path class="pista-s" data-pista="${pin}" d="${inicio} V${carril} H${xr} V24"/>`;
    });
    const ultimo1 = posConector(FILA1[FILA1.length - 1]).x;
    const ultimo2 = posConector(FILA2[FILA2.length - 1]).x;
    const x3V = xRanura("3V");
    const xGND = SHIELD.mbX + 466 * SHIELD.mbEscala;
    const svg = `
  <g class="shield" transform="translate(${ox} ${oy})">
    <rect class="shield-pcb" x="0" y="0" width="${S.ancho}" height="${S.alto}" rx="16"/>
    <g class="interior">
      <path class="rail-g" d="M${X0 - 20} ${150 + 2 * PASO2} H${ultimo1} M${X0 - 20} ${276 + 2 * PASO2} H${X_IIC} M${X0 - 20} ${150 + 2 * PASO2} V${276 + 2 * PASO2} M${X0 - 20} ${276 + 2 * PASO2} V${S.alto - 26} H30 V100 M${xGND} 24 V36 H${X0 - 20} V${150 + 2 * PASO2}"/>
      <path class="rail-5v" d="M94 119 H122 M168 113 H200 V109 H208 M90 213 H182 V113"/>
      <path class="rail-33" d="M182 160 H168 M122 167 H108 V34 H${x3V} V24 M168 175 H190 V153 H208"/>
      <path class="rail-v rail-v1" d="M213 100 V86 H${X0 - 6} V${150 + PASO2} H${ultimo1}"/>
      <path class="rail-v rail-v2" d="M256 131 H${X0 - 26} V${276 + PASO2} H${X_IIC}"/>
      ${pistas}
    </g>
    <g data-pieza="ranura"><rect x="${S.mbX - 12}" y="0" width="282" height="26" rx="4" class="ranura"/></g>
    <g data-pieza="dc"><rect x="18" y="90" width="76" height="58" rx="6" class="jack"/><circle cx="56" cy="119" r="16" class="jack-agujero"/><text x="56" y="170" class="serigrafia-sh" text-anchor="middle">DC 7–9 V</text></g>
    <g data-pieza="usb"><rect x="22" y="196" width="68" height="34" rx="5" class="metal"/><rect x="33" y="206" width="46" height="14" rx="3" class="metal-oscuro"/><text x="56" y="252" class="serigrafia-sh" text-anchor="middle">USB 5 V</text></g>
    <g data-pieza="regulador5"><rect x="122" y="96" width="46" height="34" rx="3" class="chip"/><text x="145" y="118" class="chip-texto peq" text-anchor="middle">5 V</text></g>
    <g data-pieza="regulador33"><rect x="122" y="150" width="46" height="34" rx="3" class="chip"/><text x="145" y="172" class="chip-texto peq" text-anchor="middle">3,3 V</text></g>
    <g data-pieza="ledPower"><circle cx="145" cy="228" r="9" class="led-power"/><text x="145" y="256" class="serigrafia-sh" text-anchor="middle">ON</text></g>
    <g data-pieza="puente" class="puente">
      <rect x="198" y="96" width="58" height="70" rx="4" class="cabecera"/>
      <rect x="208" y="104" width="10" height="10" class="clavija"/>
      <rect x="208" y="126" width="10" height="10" class="clavija"/>
      <rect x="208" y="148" width="10" height="10" class="clavija"/>
      <rect x="236" y="104" width="10" height="10" class="clavija"/>
      <rect x="236" y="126" width="10" height="10" class="clavija"/>
      <rect x="236" y="148" width="10" height="10" class="clavija"/>
      <rect class="capuchon" data-puente="1" x="202" y="98" width="22" height="42" rx="4"/>
      <rect class="capuchon" data-puente="2" x="230" y="120" width="22" height="42" rx="4"/>
      <text x="262" y="114" class="serigrafia-sh izq">5V</text>
      <text x="262" y="158" class="serigrafia-sh izq">3V3</text>
      <text x="213" y="185" class="serigrafia-sh" text-anchor="middle">V1</text>
      <text x="241" y="185" class="serigrafia-sh" text-anchor="middle">V2</text>
    </g>
    <g class="filas-svg">${conectores}</g>
    <g class="conector" data-pieza="iic">
      <rect x="${X_IIC - 11}" y="237" width="22" height="105" rx="3" class="cabecera"/>
      ${["SDA", "SCL", "V", "G"].map((k) => `<rect x="${X_IIC - 5}" y="${POS_IIC[k].y - 5}" width="10" height="10" class="clavija ${k === "V" ? "v" : k === "G" ? "g" : "s"}"/>`).join("")}
      ${[["20", 249], ["19", 276], ["V2", 303], ["G", 330]].map(([t2, y]) => `<text x="${X_IIC + 15}" y="${y + 4}" class="mini izq">${t2}</text>`).join("")}
      <text x="${X_IIC}" y="361" class="serigrafia-sh" text-anchor="middle">IIC</text>
    </g>
    <text x="${S.ancho - 18}" y="${S.alto - 16}" class="serigrafia-sh marca" text-anchor="end">shield para micro:bit</text>
    <g class="microbit-sh" transform="translate(${S.mbX} ${S.mbY}) scale(${S.mbEscala})">${microbitFrente({ interior: interiorMicrobit })}</g>
  </g>`;
    const A = (x, y) => [ox + x, oy + y];
    const anclas = {
      microbit: A(S.mbX + 14, S.mbY + 100),
      ranura: A(S.mbX + 129, 13),
      dc: A(56, 119),
      usb: A(56, 213),
      regulador5: A(145, 113),
      regulador33: A(145, 167),
      ledPower: A(145, 228),
      puente: A(227, 131),
      iic: A(X_IIC, 289)
    };
    for (const p of [...FILA1, ...FILA2]) {
      const c = posConector(p);
      anclas["con-" + p] = A(c.x, c.v.y);
    }
    const t = (q) => ({ x: ox + q.x, y: oy + q.y });
    return {
      svg,
      anclas,
      conector(pin) {
        const c = posConector(pin);
        return { s: t(c.s), v: t(c.v), g: t(c.g) };
      },
      iic() {
        return { SDA: t(POS_IIC.SDA), SCL: t(POS_IIC.SCL), V: t(POS_IIC.V), G: t(POS_IIC.G) };
      }
    };
  }
  function ponerPuente(svgRaiz, vcc1, vcc2 = 3.3) {
    for (const [n, v] of [
      ["1", vcc1],
      ["2", vcc2]
    ]) {
      const c = svgRaiz.querySelector(`.puente .capuchon[data-puente="${n}"]`);
      if (c) c.setAttribute("y", v > 4 ? "98" : "120");
    }
    svgRaiz.classList.toggle("a5v", vcc1 > 4);
    svgRaiz.classList.toggle("a5v2", vcc2 > 4);
  }
  var MOD = { ancho: 220, alto: 166 };
  function placaModulo(id, x, y, nombre, cuerpo, interior, { pines = ["S", "V", "G"], claves = null, alto = MOD.alto, ancho = MOD.ancho } = {}) {
    const n = pines.length;
    const paso = 26;
    const y0 = alto / 2 - (n - 1) * paso / 2;
    let conector = `<rect x="-14" y="${y0 - 16}" width="26" height="${(n - 1) * paso + 32}" rx="3" class="cabecera"/>`;
    const pos = {};
    pines.forEach((p, i) => {
      const py = y0 + i * paso;
      conector += `<rect x="-6" y="${py - 5}" width="10" height="10" class="clavija ${p.toLowerCase()}"/><text x="18" y="${py + 5}" class="serigrafia-mod izq">${p}</text>`;
      pos[claves ? claves[i] : p] = { x: x - 1, y: y + py };
    });
    const svg = `<g class="modulo" data-modulo="${id}" transform="translate(${x} ${y})">
    <g data-pieza="${id}"><rect class="mod-pcb" x="0" y="0" width="${ancho}" height="${alto}" rx="12"/>
    <circle cx="${ancho - 16}" cy="16" r="7" class="taladro"/><circle cx="${ancho - 16}" cy="${alto - 16}" r="7" class="taladro"/>
    <text x="${ancho / 2 + 10}" y="${alto - 12}" class="serigrafia-mod" text-anchor="middle">${nombre}</text>
    ${cuerpo}</g>
    <g class="interior">${interior}</g>
    ${conector}
  </g>`;
    return { svg, pines: pos, ancho, alto };
  }
  function moduloLED(id, x, y, color = "rojo") {
    const tonos = { rojo: "#ff3b2f", verde: "#2ecc71", azul: "#3d8bff", amarillo: "#ffc928" };
    const m = placaModulo(
      id,
      x,
      y,
      `LED ${color}`,
      `<g data-pieza="${id}-led"><circle class="led-halo" cx="140" cy="72" r="46" style="fill:${tonos[color]}"/><circle class="led-cuerpo" cx="140" cy="72" r="22" style="--led:${tonos[color]}"/><circle cx="133" cy="64" r="6" class="led-brillo"/></g>`,
      `<path class="pista-m s" d="M4 57 H60"/><rect x="60" y="51" width="34" height="12" rx="2" class="resistencia"/><path class="pista-m s" d="M94 57 H120"/><path class="pista-m g" d="M4 109 H150 V94"/>`
    );
    m.anclas = { [id]: [x + 140, y + 72] };
    m.color = tonos[color];
    return m;
  }
  function moduloRGB(id, x, y) {
    const m = placaModulo(
      id,
      x,
      y,
      "LED RGB",
      `<g data-pieza="${id}-led"><circle class="led-halo rgb" cx="140" cy="72" r="50"/><circle class="led-cuerpo rgb" cx="140" cy="72" r="24"/><circle cx="132" cy="63" r="6" class="led-brillo"/></g>`,
      `<path class="pista-m r" d="M4 44 H60 V60 H116"/><path class="pista-m gr" d="M4 70 H116"/><path class="pista-m b" d="M4 96 H60 V82 H116"/><path class="pista-m g" d="M4 122 H140 V96"/>`,
      { pines: ["R", "G", "B", "GND"], claves: ["R", "VERDE", "B", "GND"] }
    );
    m.anclas = { [id]: [x + 140, y + 72] };
    return m;
  }
  function trazo(desde, hasta, arco = 0.4) {
    const dx = hasta.x - desde.x;
    const c1 = { x: desde.x + dx * arco, y: desde.y };
    const c2 = { x: hasta.x - dx * arco, y: hasta.y };
    return `M${desde.x} ${desde.y} C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${hasta.x} ${hasta.y}`;
  }
  function trazoArriba(desde, hasta) {
    const c1 = { x: desde.x, y: desde.y - 110 };
    const c2 = { x: hasta.x + Math.max(60, (desde.x - hasta.x) * 0.45), y: hasta.y };
    return `M${desde.x} ${desde.y} C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${hasta.x} ${hasta.y}`;
  }
  function cable(id, desde, hasta, tipo, { arco = 0.4, arriba = false } = {}) {
    return `<path class="cable ${tipo}" data-cable="${id}" d="${arriba ? trazoArriba(desde, hasta) : trazo(desde, hasta, arco)}"/>`;
  }
  function cablesModulo(id, mod, con, { cruzado = false, sinSenal = false, senal = "S" } = {}) {
    const P2 = mod.pines;
    const op = { arriba: !!mod.arriba };
    let s = "";
    if (!sinSenal) s += cable(id + "-s", P2[senal], con.s, "s", op);
    if (P2.V || P2.VCC) s += cable(id + "-v", P2.V || P2.VCC, cruzado ? con.g : con.v, cruzado ? "v cruzado" : "v", op);
    s += cable(id + "-g", P2.GND || P2.G, cruzado ? con.v : con.g, cruzado ? "g cruzado" : "g", op);
    return `<g class="cables" data-cables="${id}">${s}</g>`;
  }
  function cablesIIC(id, mod, iic) {
    const P2 = mod.pines;
    const s = cable(id + "-sda", P2.SDA, iic.SDA, "s") + cable(id + "-scl", P2.SCL, iic.SCL, "s") + cable(id + "-v", P2.VCC || P2.V, iic.V, "v") + cable(id + "-g", P2.GND || P2.G, iic.G, "g");
    return `<g class="cables" data-cables="${id}">${s}</g>`;
  }
  var ESTILO_BANCO = `${ESTILO_DIBUJOS}
<style>
  .shield-pcb { fill: #17305a; stroke: #0d1d38; stroke-width: 3; }
  .transparente .shield-pcb { fill-opacity: 0.55; }
  .serigrafia-sh { fill: #e9eef7; font: 700 15px/1 "Atkinson Hyperlegible Mono", ui-monospace, monospace; }
  .serigrafia-sh.marca { font: 700 16px/1 "Archivo", system-ui, sans-serif; opacity: 0.75; }
  .serigrafia-sh.izq, .serigrafia-mod.izq { text-anchor: start; }
  .serigrafia-mod { fill: #f3f6f3; font: 700 15px/1 "Archivo", system-ui, sans-serif; }
  .mini { fill: #f3f6f3; font: 600 12px/1 "Atkinson Hyperlegible Mono", ui-monospace, monospace; }
  .ranura { fill: #0e0f10; stroke: #000; stroke-width: 2; }
  .jack { fill: #111315; stroke: #000; stroke-width: 2; }
  .jack-agujero { fill: #3a3f43; stroke: #000; stroke-width: 2; }
  .cabecera { fill: #0f1113; stroke: #000; stroke-width: 1.5; }
  .clavija { fill: #d6aa3c; stroke: #8f6c1d; stroke-width: 1; }
  .clavija.s { fill: #f2c94c; }
  .conector.ocupado .cabecera { stroke: #b08d3a; stroke-dasharray: 4 3; }
  .conector.marcado .cabecera { stroke: #ffd65a; stroke-width: 3; stroke-dasharray: none; }
  .capuchon { fill: #e8463b; stroke: #8f1f17; stroke-width: 2; transition: y 0.2s; }
  .led-power { fill: #3a2422; stroke: #000; stroke-width: 1.5; }
  .encendido .led-power { fill: #ff4b3e; filter: drop-shadow(0 0 6px #ff4b3e); }
  .pista-s { fill: none; stroke: #8ea6c9; stroke-width: 1.6; opacity: 0.45; }
  .pista-s.activa { stroke: #ffd65a; stroke-width: 3; opacity: 1; }
  .pista-s.alta { stroke: #ffcf3f; stroke-width: 3.4; opacity: 1; }
  .pista-s.baja { stroke: #43c3a5; stroke-width: 3.4; opacity: 1; }
  .pista-s.peligro { stroke: #ff3b30; stroke-width: 4.5; opacity: 1; }
  .rail-v, .rail-33, .rail-5v { fill: none; stroke-width: 4; stroke-linecap: round; }
  .rail-33 { stroke: #f39c4a; }
  .rail-5v { stroke: #e54b4b; }
  .rail-v { stroke: #f39c4a; }
  .a5v .rail-v1, .a5v2 .rail-v2 { stroke: #e54b4b; }
  .rail-g { fill: none; stroke: #5c6670; stroke-width: 4; }
  .apagado .rail-v, .apagado .rail-33, .apagado .rail-5v { stroke: #6b7280; }
  .mod-pcb { fill: #1d5a86; stroke: #0f3552; stroke-width: 2.5; }
  .transparente .mod-pcb { fill-opacity: 0.6; }
  .taladro { fill: var(--escena-agujero, #e3e6df); stroke: #c9cfd6; stroke-width: 2; }
  .pista-m { fill: none; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
  .pista-m.s { stroke: #f2c94c; }
  .pista-m.v { stroke: #e54b4b; }
  .pista-m.g { stroke: #9aa5ae; }
  .pista-m.r { stroke: #ff6b5e; } .pista-m.gr { stroke: #4fd17f; } .pista-m.b { stroke: #6ea4ff; }
  .resistencia { fill: #cdbb8c; stroke: #7a6b42; stroke-width: 1.5; }
  .tecla-base { fill: #2d3236; stroke: #111; stroke-width: 2; }
  .tecla-tapa { fill: #e9e2c9; stroke: #6b6550; stroke-width: 2; cursor: pointer; }
  .pulsado .tecla-tapa { fill: #c9c1a3; transform-box: fill-box; transform-origin: center; transform: scale(0.88); }
  .tubo { fill: #c7ced3; stroke: #6f7a82; stroke-width: 2; fill-opacity: 0.9; }
  .bola { fill: #8a939a; stroke: #3c4348; stroke-width: 2; transition: cx 0.25s; }
  .ir-emisor { fill: #e9f1f5; stroke: #8798a3; stroke-width: 2; }
  .ir-receptor { fill: #15181a; stroke: #000; stroke-width: 2; }
  .potenciometro { fill: #2f6fd1; stroke: #173b75; stroke-width: 2; }
  .pot-eje { fill: #f0f2f4; stroke: #8b96a0; stroke-width: 2; }
  .led-indicador { fill: #2b1a19; stroke: #000; stroke-width: 1.5; }
  .led-indicador.on { fill: #ff4b3e; filter: drop-shadow(0 0 5px #ff4b3e); }
  .ldr { fill: #e7d3a6; stroke: #8a6d3b; stroke-width: 2; }
  .ldr-pista { fill: none; stroke: #b2492f; stroke-width: 3; }
  .joy-base { fill: #23272b; stroke: #000; stroke-width: 2; }
  .joy-aro { fill: #34393e; stroke: #111; stroke-width: 2; }
  .joy-pomo { fill: #4a5056; stroke: #111; stroke-width: 2; cursor: grab; }
  .led-cuerpo { fill: color-mix(in srgb, var(--led, #ff3b2f) 30%, #2a1d1c); stroke: #111; stroke-width: 2; }
  .led-cuerpo.rgb { fill: #e8e6e0; }
  .led-halo { opacity: 0; }
  .led-brillo { fill: #fff; opacity: 0.45; }
  .zumb { fill: #121416; stroke: #000; stroke-width: 2; }
  .zumb-agujero { fill: #3b4045; }
  .ondas path { fill: none; stroke: #ff9f43; stroke-width: 4; stroke-linecap: round; opacity: 0; }
  .sonando .ondas path { opacity: 1; animation: onda 0.5s linear infinite; }
  .sonando .ondas path:nth-child(2) { animation-delay: 0.12s; }
  @keyframes onda { from { opacity: 1; } to { opacity: 0.15; } }
  @media (prefers-reduced-motion: reduce) { .sonando .ondas path { animation: none; } }
  .cable { fill: none; stroke-width: 7; stroke-linecap: round; opacity: 0.92; }
  .cable.s { stroke: #f2b632; }
  .cable.v { stroke: #d93d34; }
  .cable.g { stroke: #2b2f33; }
  .cable.cruzado { stroke-dasharray: 14 6; }
  .cable.s.alta { stroke: #ffd84d; filter: drop-shadow(0 0 4px #ffd84d); }
  .cable.s.peligro { stroke: #ff3b30; filter: drop-shadow(0 0 5px #ff3b30); }
  .cable.suelto { opacity: 0.35; stroke-dasharray: 6 8; }
  .pista-s.datos { stroke: #7ad7ff; stroke-width: 3.4; opacity: 1; stroke-dasharray: 7 5; animation: datos 0.5s linear infinite; }
  .cable.s.datos { stroke: #7ad7ff; filter: drop-shadow(0 0 4px #7ad7ff); stroke-dasharray: 12 6; animation: datos 0.5s linear infinite; }
  @keyframes datos { to { stroke-dashoffset: -24; } }
  @media (prefers-reduced-motion: reduce) { .pista-s.datos, .cable.s.datos { animation: none; } }
  .pista-m.abajo { stroke-dasharray: 5 4; opacity: 0.8; }
  .to92 { fill: #1b1d1f; stroke: #000; stroke-width: 2; }
  .pata { fill: none; stroke: #c9ced3; stroke-width: 4; stroke-linecap: round; }
  .termo-ico rect, .termo-ico circle { fill: none; stroke: #e9c46a; stroke-width: 2.5; }
  .chip-metal { fill: #cfd5da; stroke: #7f8a93; stroke-width: 2; }
  .agujero-chip { fill: #2a2f33; }
  .horquilla { fill: #d9b25c; stroke: #8a6a24; stroke-width: 2; }
  .horquilla-punto { fill: #b98d33; }
  .corroida .horquilla { fill: #8f7a52; }
  .destacado { filter: drop-shadow(0 0 6px #ffd65a) drop-shadow(0 0 2px #ffd65a); }
  path.destacado { stroke-width: 6; opacity: 1; }
  .aviso-peligro { fill: #ff3b30; font: 800 20px/1 "Archivo", system-ui, sans-serif; }
</style>`;
  var PIEZAS_SHIELD = {
    microbit: ["micro:bit", "Va de pie en la ranura del shield: cada pin de su conector llega a un conector S del shield."],
    ranura: ["Ranura", "Recibe el conector de la micro:bit. Por ella pasan todas las señales y la alimentación de 3,3 V."],
    dc: ["Entrada DC", "Para un adaptador de 7 a 9 V. El regulador de 5 V la baja a 5 V. Hace falta para servos, motores y bombas."],
    usb: ["Micro USB del shield", "Otra forma de alimentar el shield: 5 V de un cargador o de una batería USB."],
    regulador5: ["Regulador de 5 V", "Saca 5 V estables de la entrada DC. Se calienta si los módulos piden mucha corriente: no lo toques."],
    regulador33: ["Regulador de 3,3 V", "Saca 3,3 V para la micro:bit (por su pin 3V) y para la fila V si el puente está en 3V3."],
    ledPower: ["LED de encendido", "Se enciende cuando el shield tiene alimentación."],
    puente: ["Puentes V1 y V2", "Dos capuchones que eligen 3,3 V o 5 V: V1 para la V de los conectores P0 a P9 y V2 para la de P10 a P20 y los conectores I2C y SPI. Con 5 V, la señal que devuelve un sensor también puede llegar a 5 V, y un pin de la micro:bit no admite más de 3,6 V."],
    pantalla: ["Pantalla de la micro:bit", "Usa los pines P3, P4, P6, P7 y P10: si conectas algo ahí, la pantalla y el módulo se molestan."],
    botonA: ["Botón A", "Va al pin P5: mejor no usar P5 para otra cosa."],
    botonB: ["Botón B", "Va al pin P11: mejor no usar P11 para otra cosa."],
    logo: ["Logo táctil", "Es una entrada de la micro:bit V2; no tiene que ver con el shield."],
    conector: ["Conector de la micro:bit", "Sus contactos llegan, a través de la ranura, a los conectores del shield."],
    iic: ["Conector IIC", "Cuatro contactos para módulos I2C: 20 es SDA (los datos), 19 es SCL (el reloj), V2 la alimentación del puente V2 y G la tierra. Todos los módulos I2C comparten SDA y SCL; cada uno contesta solo a su dirección.", "Se usa: aquí va el módulo I2C."]
  };
  function infoConector(pin) {
    var _a;
    const u = usoPin(pin);
    const n = pin;
    if (!u) return [`Conector ${n}`, `S va al pin ${n} de la micro:bit; V da la tensión del puente; G es la tierra. ${((_a = USO_PIN[pin]) == null ? void 0 : _a.analogico) ? "Este pin también lee valores analógicos (0 a 1023)." : "Este pin solo lee y escribe valores digitales (o PWM)."}`, "Libre: buena elección para un módulo."];
    return [`Conector ${n}`, `S va al pin ${n}, que la micro:bit ya usa para ${u}. Si conectas un módulo aquí, los dos se molestan.`, "Ocupado: mejor no usarlo."];
  }
  function crearBanco({ ui, usos = {}, contenedor = document.getElementById("escena"), modulos = [], shield = { ox: 22, oy: 216 }, zonasExtra = [], extraSVG = "", rotulosExtra = [], piezas = {}, alPulsar, alDibujar, ancho = 1e3, alto = 600, caja = [20, 20, 600, 596], valores, prioridad = {}, vistaInicial = null, alCambiarVista, botonera = "der", fondoSVG = "" } = {}) {
    var _a, _b;
    const usados = [];
    for (const m of modulos) {
      const ps = m.iic ? ["IIC:SDA", "IIC:SCL"] : Object.values(m.pines || { S: m.pin });
      for (const p of ps) if (p && !usados.includes(p)) usados.push(p);
    }
    const sh = dibujoShield({ ...shield, usados });
    let mods = "";
    let cables = "";
    const info = {};
    const rotulos = [];
    const R = (id, texto, ancla, prio = 5) => {
      var _a2;
      return rotulos.push({ id, texto, ancla, prio: (_a2 = prioridad[id]) != null ? _a2 : prio });
    };
    for (const m of modulos) {
      const d = m.crear(m.id, m.x, m.y, m.color);
      m.dibujo = d;
      mods += d.svg;
      const pines = m.iic ? {} : m.pines || { [m.senal || "S"]: m.pin };
      if (m.iic) cables += cablesIIC(m.id, d, sh.iic()).replace('<g class="cables"', `<g class="cables" data-vista-mod="${m.id}"`);
      let k = 0;
      for (const [senal, pin] of Object.entries(pines)) {
        const con = sh.conector(pin);
        if (k === 0) cables += cablesModulo(m.id, d, con, { senal, cruzado: m.cruzado }).replace('<g class="cables"', `<g class="cables" data-vista-mod="${m.id}"`);
        else cables += `<g class="cables" data-vista-mod="${m.id}">${cable(`${m.id}-${senal}`, d.pines[senal], con.s, "s")}</g>`;
        k++;
      }
      for (const [aid, a] of Object.entries(d.anclas || {})) {
        R(aid, ((_a = m.nombres) == null ? void 0 : _a[aid]) || m.nombre, a, 7);
        rotulos[rotulos.length - 1].zona = "mod-" + m.id;
        if (m.vista) rotulos[rotulos.length - 1].vistas = [m.vista];
      }
    }
    if (usados.includes("IIC:SDA")) {
      R("iic", "Conector IIC", sh.anclas.iic, 6);
      const deVistas = modulos.filter((m) => m.iic);
      if (deVistas.every((m) => m.vista)) rotulos[rotulos.length - 1].vistas = deVistas.map((m) => m.vista);
    }
    for (const pin of usados) {
      if (pin.startsWith("IIC:")) continue;
      R("con-" + pin, `Conector ${pin}`, sh.anclas["con-" + pin], 6);
      const deVistas = modulos.filter((m) => Object.values(m.pines || { S: m.pin }).includes(pin));
      if (deVistas.length && deVistas.every((m) => m.vista)) rotulos[rotulos.length - 1].vistas = deVistas.map((m) => m.vista);
    }
    for (const id of ["puente", "regulador33", "regulador5", "usb", "dc", "ledPower", "ranura"]) R(id, PIEZAS_SHIELD[id][0], sh.anclas[id], id === "puente" ? 8 : id === "usb" || id === "regulador33" ? 4 : 3);
    R("microbit", "micro:bit", sh.anclas.microbit, 5);
    rotulos.push(...rotulosExtra);
    const svg = `${ESTILO_BANCO}${fondoSVG}${sh.svg}${mods}<g class="todos-cables">${cables}</g>${extraSVG}`;
    const { ox, oy } = { ox: 22, oy: 216, ...shield };
    const prohibidas = [
      [ox + SHIELD.mbX + 2, oy + SHIELD.mbY + 6, ox + SHIELD.mbX + 256, oy + 14],
      [ox + 16, oy + 88, ox + 96, oy + 150],
      [ox + 20, oy + 194, ox + 92, oy + 232],
      [ox + 120, oy + 94, ox + 170, oy + 186],
      [ox + 134, oy + 217, ox + 156, oy + 239],
      [ox + 196, oy + 82, ox + 290, oy + 192],
      [ox + 288, oy + 136, ox + 598, oy + 368],
      ...modulos.map((m) => [m.x - 16, m.y, m.x + (m.dibujo.ancho || 220), m.y + (m.dibujo.alto || 166), "mod-" + m.id]),
      ...zonasExtra
    ];
    const vista = crearEscena2D({
      contenedor,
      ancho,
      alto,
      svg,
      rotulos,
      caja,
      modoRotulos: "cerca",
      prohibidas,
      alinear: "arriba",
      vistaInicial,
      alCambiarVista,
      alPulsar(id, e) {
        if (alPulsar == null ? void 0 : alPulsar(id, e)) return;
        const p = piezas[id] || PIEZAS_SHIELD[id] || (id.startsWith("con-") ? infoConector(id.slice(4)) : null);
        if (p) ui == null ? void 0 : ui.mostrarPieza(p[0], p[1], usos[id] || p[2] || "");
      },
      alDibujar,
      valores
    });
    const raiz = vista.svg;
    let v2 = 3.3;
    if (botonera === "der") (_b = contenedor.querySelector(".botonera")) == null ? void 0 : _b.classList.add("der");
    return {
      vista,
      svg: raiz,
      shield: sh,
      // Color de la señal de un pin (cable S y pista del shield): 'alta', 'baja', 'peligro' o nada
      senal(pin, estado, idCable) {
        const pista = raiz.querySelector(`.pista-s[data-pista="${pin}"]`);
        if (pista) for (const c of ["alta", "baja", "peligro", "datos"]) pista.classList.toggle(c, estado === c);
        if (idCable) {
          const cab = raiz.querySelector(`[data-cable="${idCable}"]`);
          if (cab) for (const c of ["alta", "peligro", "datos"]) cab.classList.toggle(c, estado === c);
        }
      },
      // V1 (P0 a P9) y V2 (P10 a P20, I2C y SPI). Si no se dice V2, se queda como estaba.
      puente(vcc1, vcc2) {
        if (vcc2 !== void 0) v2 = vcc2;
        ponerPuente(raiz, vcc1, v2);
      },
      // Conecta el módulo con V y G cambiados (o lo deja bien)
      cruzar(id, on) {
        const m = modulos.find((x) => x.id === id);
        if (!m) return;
        const pin = Object.values(m.pines || { S: m.pin })[0];
        const con = sh.conector(pin);
        const P2 = m.dibujo.pines;
        const cv = raiz.querySelector(`[data-cable="${id}-v"]`);
        const cg = raiz.querySelector(`[data-cable="${id}-g"]`);
        if (!cv || !cg) return;
        const f = m.dibujo.arriba ? trazoArriba : trazo;
        cv.setAttribute("d", f(P2.V || P2.VCC, on ? con.g : con.v));
        cg.setAttribute("d", f(P2.G || P2.GND, on ? con.v : con.g));
        cv.classList.toggle("cruzado", on);
        cg.classList.toggle("cruzado", on);
      },
      // Cambia SDA y SCL de un módulo I2C (o los deja bien)
      cruzarIIC(id, on) {
        var _a2, _b2;
        const m = modulos.find((x) => x.id === id);
        if (!m) return;
        const P2 = m.dibujo.pines;
        const c = sh.iic();
        (_a2 = raiz.querySelector(`[data-cable="${id}-sda"]`)) == null ? void 0 : _a2.setAttribute("d", trazo(P2.SDA, on ? c.SCL : c.SDA));
        (_b2 = raiz.querySelector(`[data-cable="${id}-scl"]`)) == null ? void 0 : _b2.setAttribute("d", trazo(P2.SCL, on ? c.SDA : c.SCL));
        raiz.querySelectorAll(`[data-cable="${id}-sda"], [data-cable="${id}-scl"]`).forEach((el) => el.classList.toggle("cruzado", on));
      },
      // Suelta (o vuelve a conectar) el cable S de un módulo
      soltarSenal(id, suelto, senal = "S") {
        const c = raiz.querySelector(`[data-cable="${id}-${senal.toLowerCase()}"]`);
        c == null ? void 0 : c.classList.toggle("suelto", suelto);
      },
      encendido(on) {
        raiz.classList.toggle("encendido", on);
        raiz.classList.toggle("apagado", !on);
      },
      destacar(sel, on = true) {
        raiz.querySelectorAll(".destacado").forEach((el) => el.classList.remove("destacado"));
        if (on && sel) raiz.querySelectorAll(sel).forEach((el) => el.classList.add("destacado"));
      }
    };
  }

  // ../../../../tmp/bitabit-myq0224i/labs/l3-5.js
  var PIN = { R: "P1", VERDE: "P2", B: "P8" };
  var COLOR_NOMBRE = { R: "rojo", VERDE: "verde", B: "azul" };
  function crearPrograma(valores, extra) {
    const n = {};
    n.r = P.c("pins.analogWritePin", PIN.R, valores.R);
    n.g = P.c("pins.analogWritePin", PIN.VERDE, valores.VERDE);
    n.b = P.c("pins.analogWritePin", PIN.B, valores.B);
    const lista = [n.r, n.g, n.b];
    if (extra) {
      n.e1 = P.c("pins.analogWritePin", "P13", 512);
      n.e2 = P.c("pins.analogWritePin", "P14", 512);
      lista.push(n.e1, n.e2);
    }
    n.programa = P.programa(P.alIniciar(lista));
    return n;
  }
  iniciarLaboratorio((ui) => {
    const valores = { R: 1023, VERDE: 0, B: 512 };
    const aj = { extra: false, sueltoVerde: false };
    let n = crearPrograma(valores, false);
    const mundo = new Mundo({ pasoFisica: 2 });
    const placa = mundo.agregar(crearMicrobit({ programa: n.programa }));
    const est = placa.microbit.est;
    function brillo(clave) {
      const pin = PIN[clave];
      if (clave === "VERDE" && aj.sueltoVerde) return 0;
      const p = est.pines[pin];
      if (!p || p.modo !== "pwm" || !est.canales.includes(pin)) return 0;
      return p.valor / 1023;
    }
    function colorMezcla() {
      const r = Math.round(brillo("R") * 255);
      const g = Math.round(brillo("VERDE") * 255);
      const b = Math.round(brillo("B") * 255);
      return { r, g, b, hex: "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("") };
    }
    const brilloLED = (pin) => {
      const p = est.pines[pin];
      return p && p.modo === "pwm" && est.canales.includes(pin) ? p.valor / 1023 : 0;
    };
    const banco = crearBanco({
      ui,
      ancho: 1110,
      modulos: [
        { id: "rgb", crear: moduloRGB, x: 780, y: 200, pines: { R: PIN.R, VERDE: PIN.VERDE, B: PIN.B }, nombre: "LED RGB" },
        { id: "l13", crear: moduloLED, x: 650, y: 420, pin: "P13", nombre: "LED en P13", color: "amarillo", vista: "extra" },
        { id: "l14", crear: moduloLED, x: 880, y: 420, pin: "P14", nombre: "LED en P14", color: "verde", vista: "extra" }
      ],
      vistaInicial: "normal",
      extraSVG: `<style>
      .lienzo-svg[data-vista="normal"] [data-modulo="l13"], .lienzo-svg[data-vista="normal"] [data-modulo="l14"], .lienzo-svg[data-vista="normal"] [data-vista-mod="l13"], .lienzo-svg[data-vista="normal"] [data-vista-mod="l14"], .lienzo-svg[data-vista="normal"] .pista-s[data-pista="P13"], .lienzo-svg[data-vista="normal"] .pista-s[data-pista="P14"] { display: none; }
    </style>`,
      piezas: {
        rgb: ["Módulo LED RGB", "Tres LED en una sola cápsula: rojo, verde y azul, con un pin cada uno (R, G y B) y el común a GND. Según ACEBOTT funciona de 3,3 a 5 V. Cada color necesita su propia salida PWM.", "Se usa: R en P1, G en P2 y B en P8."],
        l13: ["LED en P13", "Un módulo LED más, con su brillo por PWM.", ""],
        l14: ["LED en P14", "Otro módulo LED con brillo por PWM: el quinto pin con PWM.", ""]
      },
      valores: () => ({ "con-P1": `R: ${nf0.format(brillo("R") * 100)} %`, "con-P2": `G: ${nf0.format(brillo("VERDE") * 100)} %`, "con-P8": `B: ${nf0.format(brillo("B") * 100)} %` }),
      alDibujar: () => pintar()
    });
    const svg = banco.svg;
    const botonera = document.querySelector("#escena .botonera");
    if (botonera) {
      botonera.innerHTML = Object.entries({ R: "Rojo", VERDE: "Verde", B: "Azul" }).map(([k, t]) => `<label class="amb deslizador-color" data-color="${k}">${t}<input type="range" min="0" max="1023" step="1" value="${valores[k]}" aria-label="${t}, de 0 a 1023"><span class="num" data-valor-color="${k}">${valores[k]}</span></label>`).join("");
      botonera.addEventListener("input", (e) => {
        const l = e.target.closest("[data-color]");
        if (!l) return;
        const k = l.dataset.color;
        valores[k] = Number(e.target.value);
        l.querySelector("[data-valor-color]").textContent = valores[k];
        aplicarPrograma();
      });
    }
    function aplicarPrograma() {
      n = crearPrograma(valores, aj.extra);
      placa.programa = n.programa;
      ui.cambiarPrograma(n.programa);
      reiniciar(true);
    }
    const halo = svg.querySelector('[data-modulo="rgb"] .led-halo');
    const cuerpo = svg.querySelector('[data-modulo="rgb"] .led-cuerpo');
    function pintar() {
      var _a;
      banco.encendido(true);
      const c = colorMezcla();
      const max = Math.max(c.r, c.g, c.b);
      cuerpo.style.fill = max > 6 ? c.hex : "";
      halo.style.fill = c.hex;
      halo.style.opacity = (max / 255 * 0.6).toFixed(2);
      for (const [clave, pin] of Object.entries(PIN)) banco.senal(pin, brillo(clave) > 0 ? "alta" : "baja", clave === "R" ? "rgb-s" : `rgb-${clave}`);
      (_a = svg.querySelector('[data-cable="rgb-VERDE"]')) == null ? void 0 : _a.classList.toggle("suelto", aj.sueltoVerde);
      for (const [id, pin] of [
        ["l13", "P13"],
        ["l14", "P14"]
      ]) {
        const b = brilloLED(pin);
        const h = svg.querySelector(`[data-modulo="${id}"] .led-halo`);
        const cu = svg.querySelector(`[data-modulo="${id}"] .led-cuerpo`);
        if (h) h.style.opacity = (b * 0.55).toFixed(2);
        if (cu) cu.style.fill = b > 0.05 ? id === "l13" ? "#ffc928" : "#2ecc71" : "";
      }
    }
    let etapa = null;
    function paso() {
      if (etapa === null || etapa >= 3) {
        reiniciar(false);
        mundo.correr(50);
        etapa = 0;
        const lineas = Object.entries(PIN).map(([k, pin]) => `${COLOR_NOMBRE[k]} (${pin}): ${valores[k]}`);
        return {
          fase: 0,
          html: `<strong>1. El programa da un número a cada color.</strong> «escritura analógica» va de 0 (apagado) a 1023 (encendido del todo): ${lineas.join("; ")}.${aj.extra ? " Y dos LED más con brillo: P13 y P14, a 512." : ""}`,
          resaltar: { vivos: [n.r.id, n.g.id, n.b.id, ...aj.extra ? [n.e1.id, n.e2.id] : []] }
        };
      }
      if (etapa === 0) {
        etapa = 1;
        banco.destacar('.pista-s[data-pista="P1"], .pista-s[data-pista="P2"], .pista-s[data-pista="P8"]');
        const canales = est.canales.map((p, i) => `canal ${i}: ${p || "libre"}`).join(", ");
        const robado = aj.extra && !est.canales.includes(PIN.R);
        return {
          fase: 1,
          html: `<strong>2. Cada pin hace PWM.</strong> El pin se enciende y se apaga muy deprisa (50 veces por segundo): está encendido ese número entre 1023 del tiempo. La V2 tiene 4 canales PWM para esto y los reparte por turnos (${canales}).${robado ? " El quinto pin, P14, se ha quedado con el canal del primero: P1, el rojo, ya no tiene PWM." : ""}`,
          resaltar: {}
        };
      }
      if (etapa === 1) {
        etapa = 2;
        banco.destacar('[data-modulo="rgb"]');
        const partes = Object.keys(PIN).map((k) => `${COLOR_NOMBRE[k]} al ${nf0.format(brillo(k) * 100)} %`);
        return {
          fase: 2,
          html: `<strong>3. Cada color brilla en proporción.</strong> ${partes.join(", ")}.${aj.sueltoVerde ? " El verde no se enciende: su cable está suelto." : ""}${aj.extra && brillo("R") === 0 && valores.R > 0 ? " El rojo está apagado aunque el programa le dio " + valores.R + ": perdió su canal." : ""}`,
          resaltar: {}
        };
      }
      etapa = 3;
      banco.destacar(null);
      const c = colorMezcla();
      return {
        fase: 3,
        html: `<strong>4. El ojo mezcla las tres luces.</strong> Los tres LED están tan juntos que vemos un solo color: <span class="muestra-color" style="background:${c.hex}"></span> <span class="num">${c.hex}</span>. Rojo y verde dan amarillo; rojo y azul, morado; los tres a tope, blanco.`,
        resaltar: {}
      };
    }
    function reiniciar(correr = true) {
      mundo.t = 0;
      mundo.cola = [];
      placa.reiniciarMicrobit();
      mundo.iniciar();
      if (correr) mundo.correr(50);
      etapa = null;
      banco.destacar(null);
    }
    reiniciar();
    return {
      programa: n.programa,
      montarEscena: () => banco.vista,
      reiniciar: () => reiniciar(true),
      paso,
      alEmpezarAuto() {
        etapa = null;
        banco.destacar(null);
      },
      avanzar(dt) {
        mundo.correr(mundo.t + dt);
      },
      narracionInicio: () => "Mueve los deslizadores de abajo (cambian los números del programa) y mira el color. Pulsa <strong>Siguiente paso</strong> para seguir cómo se hace la mezcla.",
      narracionAuto: () => "En marcha: mueve los deslizadores. Prueba rojo y verde a tope, o los tres.",
      monitor() {
        const c = colorMezcla();
        ui.poner("rojo", `${valores.R} → ${nf0.format(brillo("R") * 100)} %`);
        ui.barra("rojo", brillo("R"));
        ui.poner("verde", `${valores.VERDE} → ${nf0.format(brillo("VERDE") * 100)} %`);
        ui.barra("verde", brillo("VERDE"));
        ui.poner("azul", `${valores.B} → ${nf0.format(brillo("B") * 100)} %`);
        ui.barra("azul", brillo("B"));
        ui.ponerHTML("mezcla", `<span class="muestra-color" style="background:${c.hex}"></span> ${c.hex}`);
        ui.poner("canales", est.canales.map((p, i) => `${i}: ${p || "libre"}`).join(" · "));
      },
      cambiar(id, v) {
        if (id === "extra") {
          aj.extra = v;
          banco.vista.ponerVista(v ? "extra" : "normal");
          aplicarPrograma();
        }
        if (id === "sueltoVerde") aj.sueltoVerde = v;
      },
      explicar() {
        const p = [];
        if (aj.extra)
          p.push("<strong>Dos LED más con brillo.</strong> Ahora hay cinco pines con PWM. La V2 solo tiene cuatro canales y los da por turnos: el quinto, P14, se queda con el canal del primero, P1, y el rojo se apaga. La documentación de la micro:bit es aún más prudente: habla de tres.");
        if (aj.sueltoVerde) p.push("<strong>Cable del verde suelto.</strong> El programa sigue mandando su PWM por P2, pero no llega al LED: la mezcla pierde el verde.");
        return p;
      },
      probarError() {
        var _a, _b;
        ((_a = document.getElementById("extra")) == null ? void 0 : _a.checked) || ((_b = document.getElementById("extra")) == null ? void 0 : _b.click());
        return "Añadimos al programa dos LED más con brillo, en P13 y P14. Mira el LED RGB: el rojo se apaga, aunque su bloque sigue ahí.";
      }
    };
  });
})();
