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
