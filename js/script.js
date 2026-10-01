// 1. Seleccion de elementos del DOM
const formulario = document.getElementById("form-gasto");
const inputConcepto = document.getElementById("concepto");
const selectCategoria = document.getElementById("categoria");
const inputMonto = document.getElementById("monto");
const mensajeError = document.getElementById("mensaje-error");
const cuerpoTabla = document.getElementById("cuerpo-tabla");

// Elementos del resumen y totales
const totalFijosTexto = document.getElementById("total-fijos");
const totalVariablesTexto = document.getElementById("total-variables");
const totalOcioTexto = document.getElementById("total-ocio");
const totalCulturaTexto = document.getElementById("total-cultura");
const totalGeneralTexto = document.getElementById("total-general");
const alertaRecorteTexto = document.getElementById("alerta-recorte");

// 2. Estado y persistencia localstorage
let gastos = JSON.parse(localStorage.getItem("gastos-ipap")) || [];

// Renderizar datos guardados al iniciar la aplicación
actualizarTabla();

// 3. Registrar nuevo gasto 
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault(); // Evita recargar la página

    const concepto = inputConcepto.value.trim();
    const categoria = selectCategoria.value;
    const monto = parseFloat(inputMonto.value);

    // Validación de inputs
    if (concepto === "" || categoria === "" || isNaN(monto) || monto <= 0) {
        mensajeError.textContent = "Por favor, ingrese un concepto, seleccione categoría y un monto válido superior a 0.";
        return;
    }

    mensajeError.textContent = ""; // Limpiar errores

    // Objeto del gasto
    const nuevoGasto = {
        id: Date.now(),
        concepto: concepto,
        categoria: categoria,
        monto: monto
    };

    gastos.push(nuevoGasto);
    guardarEnLocalStorage();
    actualizarTabla();

    formulario.reset();
    inputConcepto.focus();
});

// 4. Funciones

// 4.1 Eliminar gasto por ID
function eliminarGasto(idGasto) {
    gastos = gastos.filter(function(gasto) {
        return gasto.id !== idGasto;
    });
    guardarEnLocalStorage();
    actualizarTabla();
}

// 4.2 Guardar en LocalStorage
function guardarEnLocalStorage() {
    localStorage.setItem("gastos-ipap", JSON.stringify(gastos));
}

// 4.3 Renderizar tabla y actualizar resumenes
function actualizarTabla() {
    cuerpoTabla.innerHTML = ""; // Vacia la tabla

    let totalGeneral = 0;
    let totalFijos = 0;
    let totalVariables = 0;
    let totalOcio = 0;
    let totalCultura = 0;

    gastos.forEach(function(gasto) {
        const fila = document.createElement("tr");

        let claseBadge = "";
        if (gasto.categoria === "Gasto Fijo") {
            claseBadge = "badge-fijo";
            totalFijos += gasto.monto;
        } else if (gasto.categoria === "Variable Esencial") {
            claseBadge = "badge-variable";
            totalVariables += gasto.monto;
        } else if (gasto.categoria === "Ocio y Gustos") {
            claseBadge = "badge-ocio";
            totalOcio += gasto.monto;
        } else if (gasto.categoria === "Cultura y Deporte") {
            claseBadge = "badge-cultura";
            totalCultura += gasto.monto;
        }

        totalGeneral += gasto.monto;

        fila.innerHTML = `
            <td>${gasto.concepto}</td>
            <td><span class="badge ${claseBadge}">${gasto.categoria}</span></td>
            <td class="texto-derecha">$${gasto.monto.toFixed(2)}</td>
            <td class="texto-centro">
                <button class="boton-eliminar" onclick="eliminarGasto(${gasto.id})" title="Eliminar gasto">🗑️</button>
            </td>
        `;

        cuerpoTabla.appendChild(fila);
    });

    // Actualizar datos en pantalla
    totalFijosTexto.textContent = "$" + totalFijos.toFixed(2);
    totalVariablesTexto.textContent = "$" + totalVariables.toFixed(2);
    totalOcioTexto.textContent = "$" + totalOcio.toFixed(2);
    totalCulturaTexto.textContent = "$" + totalCultura.toFixed(2);
    totalGeneralTexto.textContent = "$" + totalGeneral.toFixed(2);

    // Mensaje de sugerencia sobre ahorrar gastos
    if (totalGeneral > 0 && totalOcio > 0) {
        const porcentaje = ((totalOcio / totalGeneral) * 100).toFixed(0);
        alertaRecorteTexto.textContent = `Podrías reducir hasta $${totalOcio.toFixed(2)} (${porcentaje}% del total) ajustando el rubro Ocio y Gustos.`;
    } else {
        alertaRecorteTexto.textContent = "";
    }
}