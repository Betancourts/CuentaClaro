let salario = 0;
let auxilio = 0;
let dias = 0;

function formatear(valor) {
  return "$ " + Math.round(valor).toLocaleString("es-CO");
}

function dias360(inicio, fin) {
  let p1 = inicio.split("-");
  let p2 = fin.split("-");
  let d1 = Math.min(Number(p1[2]), 30);
  let d2 = Math.min(Number(p2[2]), 30);
  return (Number(p2[0]) - Number(p1[0])) * 360 + (Number(p2[1]) - Number(p1[1])) * 30 + (d2 - d1) + 1;
}

function imprimir() {
  window.print();
}

function calcularLiquidacion() {
  salario = Number(document.getElementById("liq-salario").value);
  auxilio = Number(document.getElementById("liq-auxilio").value);
  let ingreso = document.getElementById("liq-ingreso").value;
  let retiro = document.getElementById("liq-retiro").value;
  let tomadas = Number(document.getElementById("liq-vacaciones").value);

  if (salario <= 0 || ingreso == "" || retiro == "" || retiro < ingreso) {
    alert("Revisa los datos: escribe el salario y fechas de ingreso y retiro válidas.");
    return;
  }

  let base = salario + auxilio;
  let diasTotal = dias360(ingreso, retiro);
  let anio = retiro.split("-")[0];
  let mesRetiro = Number(retiro.split("-")[1]);

  let inicioAnio = anio + "-01-01";
  let inicioSemestre = anio + "-01-01";
  if (mesRetiro > 6) {
    inicioSemestre = anio + "-07-01";
  }

  let desdeCes = inicioAnio;
  if (ingreso > inicioAnio) {
    desdeCes = ingreso;
  }
  let desdePrima = inicioSemestre;
  if (ingreso > inicioSemestre) {
    desdePrima = ingreso;
  }

  let diasCes = dias360(desdeCes, retiro);
  let diasPrima = dias360(desdePrima, retiro);

  let cesantias = base * diasCes / 360;
  let intereses = cesantias * diasCes * 0.12 / 360;
  let prima = base * diasPrima / 360;
  let vacaciones = salario * diasTotal / 720 - salario * tomadas / 30;
  if (vacaciones < 0) {
    vacaciones = 0;
  }
  let total = cesantias + intereses + prima + vacaciones;

  document.getElementById("liq-ces").textContent = formatear(cesantias);
  document.getElementById("liq-int").textContent = formatear(intereses);
  document.getElementById("liq-pri").textContent = formatear(prima);
  document.getElementById("liq-vac").textContent = formatear(vacaciones);
  document.getElementById("liq-tot").textContent = formatear(total);
  document.getElementById("liq-paso").textContent = "Base: " + formatear(base) + ". Días usados (año de 360): cesantías e intereses " + diasCes + ", prima " + diasPrima + ", vacaciones " + diasTotal + ".";
  document.getElementById("liq-resultado").style.display = "block";
}

function ejemploLiquidacion() {
  document.getElementById("liq-salario").value = 2000000;
  document.getElementById("liq-auxilio").value = 0;
  document.getElementById("liq-ingreso").value = "2025-03-15";
  document.getElementById("liq-retiro").value = "2026-10-27";
  document.getElementById("liq-vacaciones").value = 0;
  calcularLiquidacion();
}

function calcularPrima() {
  salario = Number(document.getElementById("pri-salario").value);
  auxilio = Number(document.getElementById("pri-auxilio").value);
  dias = Number(document.getElementById("pri-dias").value);

  if (salario <= 0 || dias <= 0 || dias > 180) {
    alert("Revisa los datos: salario mayor a 0 y días entre 1 y 180.");
    return;
  }

  let prima = (salario + auxilio) * dias / 360;
  document.getElementById("pri-tot").textContent = formatear(prima);
  document.getElementById("pri-paso").textContent = "(" + formatear(salario) + " + " + formatear(auxilio) + ") x " + dias + " días / 360 = " + formatear(prima);
  document.getElementById("pri-resultado").style.display = "block";
}

function ejemploPrima() {
  document.getElementById("pri-salario").value = 2000000;
  document.getElementById("pri-auxilio").value = 0;
  document.getElementById("pri-dias").value = 180;
  calcularPrima();
}

function calcularCesantias() {
  salario = Number(document.getElementById("ces-salario").value);
  auxilio = Number(document.getElementById("ces-auxilio").value);
  dias = Number(document.getElementById("ces-dias").value);

  if (salario <= 0 || dias <= 0 || dias > 360) {
    alert("Revisa los datos: salario mayor a 0 y días entre 1 y 360.");
    return;
  }

  let cesantias = (salario + auxilio) * dias / 360;
  let intereses = cesantias * dias * 0.12 / 360;
  document.getElementById("ces-valor").textContent = formatear(cesantias);
  document.getElementById("ces-inter").textContent = formatear(intereses);
  document.getElementById("ces-paso").textContent = "Cesantías: (" + formatear(salario) + " + " + formatear(auxilio) + ") x " + dias + " / 360. Intereses: " + formatear(cesantias) + " x " + dias + " x 12% / 360.";
  document.getElementById("ces-resultado").style.display = "block";
}

function ejemploCesantias() {
  document.getElementById("ces-salario").value = 2000000;
  document.getElementById("ces-auxilio").value = 0;
  document.getElementById("ces-dias").value = 360;
  calcularCesantias();
}

let porcentajesHoras = [0.35, 0.25, 0.75, 0.90, 1.15, 1.65, 1.25];
let esExtra = [false, true, true, false, true, true, false];

function calcularHoras() {
  salario = Number(document.getElementById("hor-salario").value);
  let semanal = Number(document.getElementById("hor-semanal").value);

  if (salario <= 0 || semanal <= 0 || semanal > 48) {
    alert("Revisa los datos: salario mayor a 0 y jornada semanal entre 1 y 48 horas.");
    return;
  }

  let horasMes = semanal / 6 * 30;
  let valorHora = salario / horasMes;
  let total = 0;

  for (let i = 0; i < 7; i++) {
    let cantidad = Number(document.getElementById("hor-" + i).value);
    let valor = valorHora * porcentajesHoras[i] * cantidad;
    if (esExtra[i]) {
      valor = valorHora * (1 + porcentajesHoras[i]) * cantidad;
    }
    total = total + valor;
    document.getElementById("hor-v" + i).textContent = formatear(valor);
  }

  document.getElementById("hor-valor").textContent = formatear(valorHora);
  document.getElementById("hor-tot").textContent = formatear(total);
  document.getElementById("hor-paso").textContent = "Hora ordinaria: " + formatear(salario) + " / " + horasMes + " horas del mes = " + formatear(valorHora) + ".";
  document.getElementById("hor-resultado").style.display = "block";
}

function ejemploHoras() {
  document.getElementById("hor-salario").value = 2000000;
  document.getElementById("hor-semanal").value = 42;
  document.getElementById("hor-0").value = 0;
  document.getElementById("hor-1").value = 10;
  document.getElementById("hor-2").value = 0;
  document.getElementById("hor-3").value = 4;
  document.getElementById("hor-4").value = 0;
  document.getElementById("hor-5").value = 0;
  document.getElementById("hor-6").value = 0;
  calcularHoras();
}

function calcularNeto() {
  salario = Number(document.getElementById("net-salario").value);
  let minimo = Number(document.getElementById("net-smmlv").value);
  auxilio = Number(document.getElementById("net-auxilio").value);

  if (salario <= 0 || minimo <= 0) {
    alert("Revisa los datos: escribe el salario y el salario mínimo vigente.");
    return;
  }

  let salud = salario * 0.04;
  let pension = salario * 0.04;
  let veces = salario / minimo;
  let tasa = 0;
  if (veces >= 4) {
    tasa = 0.01;
  }
  if (veces >= 16) {
    tasa = 0.012;
  }
  if (veces >= 17) {
    tasa = 0.014;
  }
  if (veces >= 18) {
    tasa = 0.016;
  }
  if (veces >= 19) {
    tasa = 0.018;
  }
  if (veces >= 20) {
    tasa = 0.02;
  }
  let solidaridad = salario * tasa;

  let auxPagado = auxilio;
  if (veces > 2) {
    auxPagado = 0;
  }

  let neto = salario - salud - pension - solidaridad + auxPagado;

  document.getElementById("net-salud").textContent = formatear(salud);
  document.getElementById("net-pension").textContent = formatear(pension);
  document.getElementById("net-fsp").textContent = formatear(solidaridad);
  document.getElementById("net-aux").textContent = formatear(auxPagado);
  document.getElementById("net-tot").textContent = formatear(neto);
  document.getElementById("net-paso").textContent = "Salario " + formatear(salario) + " - salud " + formatear(salud) + " - pensión " + formatear(pension) + " - solidaridad " + formatear(solidaridad) + " + auxilio " + formatear(auxPagado) + " = " + formatear(neto) + ".";
  document.getElementById("net-resultado").style.display = "block";
}

function ejemploNeto() {
  document.getElementById("net-salario").value = 2000000;
  document.getElementById("net-smmlv").value = 1750905;
  document.getElementById("net-auxilio").value = 249095;
  calcularNeto();
}

function calcularIndemnizacion() {
  salario = Number(document.getElementById("ind-salario").value);
  let minimo = Number(document.getElementById("ind-smmlv").value);
  let tipo = document.getElementById("ind-tipo").value;
  let ingreso = document.getElementById("ind-ingreso").value;
  let retiro = document.getElementById("ind-retiro").value;
  let fin = document.getElementById("ind-fin").value;

  if (salario <= 0 || minimo <= 0 || ingreso == "" || retiro == "" || retiro < ingreso) {
    alert("Revisa los datos: escribe el salario, el salario mínimo y fechas de ingreso y despido válidas.");
    return;
  }

  let valorDia = salario / 30;
  let diasIndemnizacion = 0;
  let paso = "";

  if (tipo == "indefinido") {
    let anios = dias360(ingreso, retiro) / 360;
    let primero = 30;
    let adicional = 20;
    if (salario >= minimo * 10) {
      primero = 20;
      adicional = 15;
    }
    diasIndemnizacion = primero;
    if (anios > 1) {
      diasIndemnizacion = primero + adicional * (anios - 1);
    }
    paso = "Tiempo trabajado: " + anios.toFixed(2) + " años. Días: " + diasIndemnizacion.toFixed(1) + ". Valor del día: " + formatear(valorDia) + ".";
  } else {
    if (fin == "" || fin <= retiro) {
      alert("En contrato a término fijo escribe la fecha en que terminaba el contrato, posterior al despido.");
      return;
    }
    diasIndemnizacion = dias360(retiro, fin) - 1;
    paso = "Días que faltaban para terminar el contrato: " + diasIndemnizacion + ". Valor del día: " + formatear(valorDia) + ".";
  }

  let valor = valorDia * diasIndemnizacion;
  document.getElementById("ind-dias").textContent = diasIndemnizacion.toFixed(1);
  document.getElementById("ind-valor").textContent = formatear(valor);
  document.getElementById("ind-paso").textContent = paso;
  document.getElementById("ind-resultado").style.display = "block";
}

function ejemploIndemnizacion() {
  document.getElementById("ind-tipo").value = "indefinido";
  document.getElementById("ind-salario").value = 2000000;
  document.getElementById("ind-smmlv").value = 1750905;
  document.getElementById("ind-ingreso").value = "2025-03-15";
  document.getElementById("ind-retiro").value = "2026-10-27";
  document.getElementById("ind-fin").value = "";
  calcularIndemnizacion();
}

let diasGanados = 0;
let diasPendientes = 0;
let festivosEncontrados = "";
let fueraDeRango = false;

function formatearDias(valor) {
  return valor.toLocaleString("es-CO", { maximumFractionDigits: 2 });
}

function cambiarVariable() {
  let marcada = document.getElementById("vac-variable").checked;
  if (marcada) {
    document.getElementById("vac-aviso-variable").style.display = "block";
  } else {
    document.getElementById("vac-aviso-variable").style.display = "none";
  }
}

function calcularVacaciones() {
  salario = Number(document.getElementById("vac-salario").value);
  let inicio = document.getElementById("vac-inicio").value;
  let corte = document.getElementById("vac-corte").value;
  let tomados = Number(document.getElementById("vac-tomados").value);

  if (salario <= 0) {
    alert("Revisa los datos: escribe un salario mayor a 0.");
    return;
  }

  if (inicio != "" || corte != "") {
    if (inicio == "" || corte == "" || corte < inicio) {
      alert("Revisa las fechas: escribe la fecha de inicio y una fecha de corte igual o posterior.");
      return;
    }
    document.getElementById("vac-dias").value = dias360(inicio, corte);
  }

  dias = Number(document.getElementById("vac-dias").value);

  if (dias <= 0) {
    alert("Revisa los datos: escribe los días trabajados (mayor a 0) o las fechas de inicio y corte.");
    return;
  }
  if (tomados < 0) {
    alert("Revisa los datos: los días ya disfrutados no pueden ser negativos.");
    return;
  }

  let valorDia = salario / 30;
  let valorTotal = salario * dias / 720;
  let valorTomado = valorDia * tomados;
  diasGanados = dias * 15 / 360;
  diasPendientes = diasGanados - tomados;
  let valorPendiente = valorTotal - valorTomado;
  if (diasPendientes < 0) {
    diasPendientes = 0;
    valorPendiente = 0;
  }

  document.getElementById("vac-ganados").textContent = formatearDias(diasGanados);
  document.getElementById("vac-disfrutados").textContent = formatearDias(tomados);
  document.getElementById("vac-pendientes").textContent = formatearDias(diasPendientes);
  document.getElementById("vac-tot").textContent = formatear(valorPendiente);
  document.getElementById("vac-paso1").textContent = "1. Valor de las vacaciones ganadas: " + formatear(salario) + " x " + dias + " días / 720 = " + formatear(valorTotal) + ".";
  document.getElementById("vac-paso2").textContent = "2. Días hábiles ganados: " + dias + " x 15 / 360 = " + formatearDias(diasGanados) + " días.";
  document.getElementById("vac-paso3").textContent = "3. Valor de un día: " + formatear(salario) + " / 30 = " + formatear(valorDia) + ". Días ya disfrutados: " + formatearDias(tomados) + " x " + formatear(valorDia) + " = " + formatear(valorTomado) + ".";
  document.getElementById("vac-paso4").textContent = "4. Pendiente: " + formatear(valorTotal) + " - " + formatear(valorTomado) + " = " + formatear(valorPendiente) + ".";
  if (diasGanados - tomados < 0) {
    document.getElementById("vac-paso4").textContent = "4. Ya disfrutaste más días de los que ganaste en este periodo, así que no queda nada pendiente.";
  }
  document.getElementById("vac-resultado").style.display = "block";
}

function ejemploVacaciones() {
  document.getElementById("vac-salario").value = 1750905;
  document.getElementById("vac-dias").value = 360;
  document.getElementById("vac-inicio").value = "";
  document.getElementById("vac-corte").value = "";
  document.getElementById("vac-tomados").value = 0;
  calcularVacaciones();
}

function esFestivo(texto) {
  switch (texto) {
    case "2026-01-01":
    case "2026-01-12":
    case "2026-03-23":
    case "2026-04-02":
    case "2026-04-03":
    case "2026-05-01":
    case "2026-05-18":
    case "2026-06-08":
    case "2026-06-15":
    case "2026-06-29":
    case "2026-07-13":
    case "2026-07-20":
    case "2026-08-07":
    case "2026-08-17":
    case "2026-10-12":
    case "2026-11-02":
    case "2026-11-16":
    case "2026-12-08":
    case "2026-12-25":
    case "2027-01-01":
    case "2027-01-11":
    case "2027-03-22":
    case "2027-03-25":
    case "2027-03-26":
    case "2027-05-01":
    case "2027-05-10":
    case "2027-05-31":
    case "2027-06-07":
    case "2027-07-05":
    case "2027-07-12":
    case "2027-07-20":
    case "2027-08-07":
    case "2027-08-16":
    case "2027-10-18":
    case "2027-11-01":
    case "2027-11-15":
    case "2027-12-08":
    case "2027-12-25":
      return true;
    default:
      return false;
  }
}

function nombreDia(numero) {
  switch (numero) {
    case 0: return "domingo";
    case 1: return "lunes";
    case 2: return "martes";
    case 3: return "miércoles";
    case 4: return "jueves";
    case 5: return "viernes";
    default: return "sábado";
  }
}

function nombreMes(numero) {
  switch (numero) {
    case 0: return "enero";
    case 1: return "febrero";
    case 2: return "marzo";
    case 3: return "abril";
    case 4: return "mayo";
    case 5: return "junio";
    case 6: return "julio";
    case 7: return "agosto";
    case 8: return "septiembre";
    case 9: return "octubre";
    case 10: return "noviembre";
    default: return "diciembre";
  }
}

function textoFecha(fecha) {
  return fecha.toISOString().slice(0, 10);
}

function fechaLarga(fecha) {
  return nombreDia(fecha.getUTCDay()) + " " + fecha.getUTCDate() + " de " + nombreMes(fecha.getUTCMonth()) + " de " + fecha.getUTCFullYear();
}

function esDiaHabil(fecha, trabajaSabados) {
  let diaSemana = fecha.getUTCDay();
  let texto = textoFecha(fecha);
  let anio = fecha.getUTCFullYear();

  if (anio < 2026 || anio > 2027) {
    fueraDeRango = true;
  }

  if (diaSemana == 0) {
    return false;
  }
  if (diaSemana == 6 && trabajaSabados == "no") {
    return false;
  }
  if (esFestivo(texto)) {
    if (festivosEncontrados != "") {
      festivosEncontrados = festivosEncontrados + ", ";
    }
    festivosEncontrados = festivosEncontrados + fechaLarga(fecha);
    return false;
  }
  return true;
}

function calcularRegreso() {
  let salida = document.getElementById("reg-salida").value;
  let habiles = Number(document.getElementById("reg-dias").value);
  let sabados = document.getElementById("reg-sabados").value;

  if (salida == "" || habiles < 1 || habiles > 60 || Math.floor(habiles) != habiles) {
    alert("Revisa los datos: escribe la fecha de salida y un número entero de días hábiles entre 1 y 60.");
    return;
  }

  festivosEncontrados = "";
  fueraDeRango = false;

  let primerDia = new Date(salida + "T00:00:00Z");
  let fecha = new Date(salida + "T00:00:00Z");
  let contados = 0;
  let ultimo = new Date(salida + "T00:00:00Z");

  while (contados < habiles) {
    if (esDiaHabil(fecha, sabados)) {
      contados = contados + 1;
      ultimo = new Date(fecha.getTime());
    }
    fecha.setUTCDate(fecha.getUTCDate() + 1);
  }

  let regreso = new Date(ultimo.getTime());
  regreso.setUTCDate(regreso.getUTCDate() + 1);
  let festivosAntes = festivosEncontrados;
  while (esDiaHabil(regreso, sabados) == false) {
    regreso.setUTCDate(regreso.getUTCDate() + 1);
  }
  festivosEncontrados = festivosAntes;

  let calendario = Math.round((regreso.getTime() - primerDia.getTime()) / 86400000);

  let textoSabados = "Los sábados no se cuentan porque no trabajas ese día.";
  if (sabados == "si") {
    textoSabados = "Los sábados sí se cuentan porque trabajas ese día.";
  }

  document.getElementById("reg-ultimo").textContent = fechaLarga(ultimo);
  document.getElementById("reg-regreso").textContent = fechaLarga(regreso);
  document.getElementById("reg-calendario").textContent = calendario + " días";
  document.getElementById("reg-paso").textContent = "Desde el " + fechaLarga(primerDia) + " se cuentan " + habiles + " días hábiles, sin domingos ni festivos. " + textoSabados + " Vuelves el siguiente día hábil.";
  if (festivosEncontrados == "") {
    document.getElementById("reg-festivos").textContent = "No cayó ningún festivo dentro de tus vacaciones.";
  } else {
    document.getElementById("reg-festivos").textContent = "Festivos que cayeron dentro y no se descuentan: " + festivosEncontrados + ".";
  }
  if (fueraDeRango) {
    document.getElementById("reg-aviso").style.display = "block";
  } else {
    document.getElementById("reg-aviso").style.display = "none";
  }
  document.getElementById("reg-resultado").style.display = "block";
}

function ejemploRegreso() {
  document.getElementById("reg-salida").value = "2026-12-14";
  document.getElementById("reg-dias").value = 15;
  document.getElementById("reg-sabados").value = "no";
  calcularRegreso();
}

let elementosRevelar = [];

function prepararRevelar() {
  elementosRevelar = document.querySelectorAll(".tarjeta, h2, .aviso, .bloque");
  for (let i = 0; i < elementosRevelar.length; i++) {
    elementosRevelar[i].classList.add("revelar");
  }
  revisarScroll();
}

function revisarScroll() {
  let limite = window.innerHeight - 60;
  for (let i = 0; i < elementosRevelar.length; i++) {
    if (elementosRevelar[i].getBoundingClientRect().top < limite) {
      elementosRevelar[i].classList.add("visible");
    }
  }
}

window.addEventListener("scroll", revisarScroll);
window.addEventListener("load", prepararRevelar);
