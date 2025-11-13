document.addEventListener("DOMContentLoaded", () => {

  const productos = document.querySelectorAll(".product-card");
  const inputSubtotal = document.querySelector(".summary-box input[readonly]");
  const btnsQty = document.querySelectorAll(".btn-qty");

  const btncar = document.getElementById('carritocantidad');
  const btncar3 = document.getElementById('car');
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let conta = 0;
  for(let i=0; i<carrito.length; i++){
    conta += carrito[i].cantidad;
  };
  btncar.innerText = conta;
  btncar3.innerText = conta;

  // ====== Función: calcular el subtotal de todos los productos ======
  function actualizarSubtotal() {
    let subtotal = 0;

    productos.forEach(producto => {
      const totalTexto = producto.querySelector("p.mt-2 strong").textContent; // Ej: "15000 USD"
      const total = parseFloat(totalTexto.split(" ")[0]); // Extrae solo el número
      subtotal += total;
    });

    inputSubtotal.value = subtotal.toFixed(2) + " USD";
  }

  // ====== Función: actualizar total de un producto según cantidad ======
  function actualizarProducto(producto) {
    const precioTexto = producto.querySelector(".product-info p strong").textContent; // Ej: "15000 USD"
    const precioUnitario = parseFloat(precioTexto.split(" ")[0]);

    const inputCantidad = producto.querySelector("input");
    let cantidad = parseInt(inputCantidad.value);

    if (isNaN(cantidad) || cantidad < 1) {
      cantidad = 1;
      inputCantidad.value = 1;
    }

    const total = precioUnitario * cantidad;
    const totalElemento = producto.querySelector(".product-info p.mt-2 strong");
    totalElemento.textContent = total.toFixed(2) + " USD";

    actualizarSubtotal();
  }

  // ====== Eventos para los botones + y - ======
  btnsQty.forEach(boton => {
    boton.addEventListener("click", e => {
      const producto = e.target.closest(".product-card");
      const inputCantidad = producto.querySelector("input");
      let cantidad = parseInt(inputCantidad.value);

      if (e.target.textContent.trim() === "+") {
        cantidad++;

      } else if (e.target.textContent.trim() === "-") {
        cantidad = Math.max(1, cantidad - 1); // Evita valores menores que 1
      }

      inputCantidad.value = cantidad;
      actualizarProducto(producto);
      let contador = 0;
      for(let i=0; i<cantcar; i++){
        contador += carrito[i].cantidad;
      };
      btncar.innerText = contador;
      btncar3.innerText = contador;
    });
  });

  // ====== Evento al modificar cantidad manualmente ======
  productos.forEach(producto => {
    const inputCantidad = producto.querySelector("input");
    inputCantidad.addEventListener("change", () => actualizarProducto(producto));
  });

  // ====== Calcular el subtotal inicial ======
  actualizarSubtotal();
});


// ==== validacion y alerta

document.addEventListener("DOMContentLoaded", function () {
  const btnComprar = document.querySelector(".btn-buy");
  const inputs = document.querySelectorAll(".form-control");

  btnComprar.addEventListener("click", (e) => {
    e.preventDefault();
    let valido = true;

    // Validar los campos
    inputs.forEach(input => {
      if (input.value.trim() === "") {
        input.classList.add("is-invalid");
        valido = false;
      } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
      }
    });

    // Eliminar alerta anterior si existe
    const alertaExistente = document.querySelector(".alerta");
    if (alertaExistente) alertaExistente.remove();

    // Crear contenedor de alerta
    const alerta = document.createElement("div");
    alerta.classList.add("alerta");
    alerta.style.textAlign = "center";
    alerta.style.marginTop = "10px";
    alerta.style.padding = "10px";
    alerta.style.borderRadius = "5px";

    // Spinner (círculo de carga)
    const spinner = document.createElement("div");
    spinner.classList.add("spinner-border");
    spinner.style.width = "1.5rem";
    spinner.style.height = "1.5rem";
    spinner.style.borderWidth = "3px";
    spinner.style.color = "#0d6efd";

    // Desactivar botón y mostrar spinner
    btnComprar.disabled = true;
    const textoOriginal = btnComprar.textContent;
    btnComprar.innerHTML = ""; 
    btnComprar.appendChild(spinner);

    // Simular proceso (ej: validación / pago)
    setTimeout(() => {
      btnComprar.disabled = false;
      btnComprar.textContent = textoOriginal;

      if (valido) {
        alerta.textContent = "✅ ¡Compra realizada con éxito! Tu pedido será enviado pronto.";
        alerta.style.backgroundColor = "#d4edda";
        alerta.style.color = "#155724";
        inputs.forEach(input => {
          input.value = "";
          input.classList.remove("is-valid");
        });
      } else {
        alerta.textContent = "⚠️ Por favor, completa todos los campos correctamente.";
        alerta.style.backgroundColor = "#f8d7da";
        alerta.style.color = "#721c24";
      }

      // Insertar alerta
      btnComprar.insertAdjacentElement("afterend", alerta);

      // Quitar alerta después de unos segundos
      setTimeout(() => alerta.remove(), 4000);
    }, 2000); // ← 2 segundos de "procesamiento"
  });
});


/* P R U E B A*/
/* === CARRITO DESDE LOCALSTORAGE === */

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector(".col-md-7");
  const inputSubtotal = document.querySelector(".summary-box input[readonly]");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // ====== Mostrar productos en el carrito ======
  function mostrarCarrito() {
    contenedor.innerHTML = "";

    // Si no hay productos, mostrar mensaje
    if (carrito.length === 0) {
      contenedor.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-cart-x fs-1 text-muted"></i>
          <p class="mt-3 text-muted">Tu carrito está vacío.</p>
          <a href="categories.html" class="btn btn-primary mt-2">Volver a comprar</a>
        </div>
      `;
      inputSubtotal.value = "0 USD";
      return;
    }

    carrito.forEach((p, index) => {
      contenedor.innerHTML += `
        <div class="product-card d-flex align-items-center mb-3 border rounded p-2">
          <img src="${p.imagen}" class="product-img me-3 rounded" alt="${p.nombre}" style="width: 100px; height: auto;">
          <div class="product-info flex-grow-1">
            <h6 class="mb-1">${p.nombre}</h6>
            <p class="mb-1">Costo: <strong>${p.costo} ${p.moneda}</strong></p>

            <div class="d-flex align-items-center mb-2">
              <button class="btn btn-outline-secondary btn-qty" data-index="${index}" data-action="restar">-</button>
              <input 
                type="number" 
                class="form-control text-center mx-2 cantidad-input" 
                style="width: 60px;" 
                value="${p.cantidad}" 
                min="1" 
                data-index="${index}"
              >
              <button class="btn btn-outline-secondary btn-qty" data-index="${index}" data-action="sumar">+</button>
            </div>

            <p class="mt-0 mb-2">Total: <strong>${(p.costo * p.cantidad).toFixed(2)} ${p.moneda}</strong></p>
          </div>
          <button class="btn btn-sm btn-danger btn-eliminar ms-2" data-index="${index}">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </div>`;
    });

    asignarEventos();
    asignarEventosCantidad();
    asignarBotonesEliminar();
    actualizarSubtotal();
  }

  // ====== Actualizar subtotal general (maneja USD y UYU) ======
function actualizarSubtotal() {
  let subtotalUSD = 0;
  let subtotalUYU = 0;

  carrito.forEach(p => {
    const total = p.costo * p.cantidad;
    if (p.moneda === "USD") subtotalUSD += total;
    else if (p.moneda === "UYU") subtotalUYU += total;
  });

  // Mostrar resultado
  if (subtotalUSD > 0 && subtotalUYU > 0) {
    inputSubtotal.value = `${subtotalUSD.toFixed(2)} USD + ${subtotalUYU.toFixed(2)} UYU`;
  } else if (subtotalUSD > 0) {
    inputSubtotal.value = `${subtotalUSD.toFixed(2)} USD`;
  } else if (subtotalUYU > 0) {
    inputSubtotal.value = `${subtotalUYU.toFixed(2)} UYU`;
  } else {
    inputSubtotal.value = "0";
  }
}


  // ====== Botones + y - ======
  function asignarEventos() {
    document.querySelectorAll(".btn-qty").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        const action = e.target.getAttribute("data-action");

        if (action === "sumar") {
          carrito[index].cantidad++;
          let cant = localStorage.getItem('cancar');
          cant++;
          localStorage.setItem('cancar', cant);
          
        }
        if (action === "restar" && carrito[index].cantidad > 1) {
          carrito[index].cantidad--;
          let cant = localStorage.getItem('cancar');
          cant--;
          localStorage.setItem('cancar', cant);
          
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
        let contador = 0;
        let cantcar = carrito.length;
        for(let i=0; i<cantcar; i++){
          contador += carrito[i].cantidad;
        };
        document.getElementById('carritocantidad').innerText = contador;
        document.getElementById('car').innerText = contador;
      });
    });
  }

  // ====== Input change manual ======
  function asignarEventosCantidad() {
    document.querySelectorAll(".cantidad-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const index = e.target.getAttribute("data-index");
        let nuevaCantidad = parseInt(e.target.value);

        if (isNaN(nuevaCantidad) || nuevaCantidad < 1) nuevaCantidad = 1;
        carrito[index].cantidad = nuevaCantidad;

        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
        let contador = 0;
        let cantcar = carrito.length;
        for(let i=0; i<cantcar; i++){
          contador += carrito[i].cantidad;
        };
        document.getElementById('carritocantidad').innerText = contador;
        document.getElementById('car').innerText = contador;
      });
    });
  }

  // ====== Eliminar producto individual ======
  function asignarBotonesEliminar() {
    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.closest("button").getAttribute("data-index");
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
        let contador = 0;
        let cantcar = carrito.length;
        for(let i=0; i<cantcar; i++){
          contador += carrito[i].cantidad;
        };
        document.getElementById('carritocantidad').innerText = contador;
        document.getElementById('car').innerText = contador;
      });
    });
  }

  // Mostrar carrito inicial
  mostrarCarrito();


});

// Datos requeridos
const radiosEnvio = document.querySelectorAll('input[name="tipoEnvio"]');
const subtotalInput = document.getElementById('subtotal');
const envioInput = document.getElementById('envioCosto');
const totalInput = document.getElementById('total');

let subtotal = 120; // ejemplo, deberías reemplazar con el total real del carrito
subtotalInput.value = subtotal + ' USD';

radiosEnvio.forEach(radio => {
  radio.addEventListener('change', () => {
    const porcentaje = parseFloat(radio.value);
    const costoEnvio = subtotal * porcentaje;
    envioInput.value = costoEnvio.toFixed(2) + ' USD';
    totalInput.value = (subtotal + costoEnvio).toFixed(2) + ' USD';
  });
});
// ====== VALIDACIÓN Y FINALIZAR COMPRA ======
document.addEventListener("DOMContentLoaded", function () {
  const btnFinalizar = document.querySelector("#costos button.btn-success"); // tu botón verde
  const inputsDireccion = document.querySelectorAll("#direccion .form-control");
  const radiosEnvio = document.querySelectorAll('input[name="tipoEnvio"]');
  const radiosPago = document.querySelectorAll('input[name="pago"]');

  btnFinalizar.addEventListener("click", (e) => {
    e.preventDefault();

    // Verificar tipo de envío seleccionado
    const envioSeleccionado = Array.from(radiosEnvio).some(radio => radio.checked);

    // Verificar forma de pago seleccionada
    const pagoSeleccionado = Array.from(radiosPago).some(radio => radio.checked);

    // Verificar dirección completa
    let direccionValida = true;
    inputsDireccion.forEach(input => {
      if (input.value.trim() === "") {
        input.classList.add("is-invalid");
        direccionValida = false;
      } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
      }
    });

    // Validación final
    if (!envioSeleccionado || !pagoSeleccionado || !direccionValida) {
      mostrarAlerta("⚠️ Completa todos los datos requeridos antes de finalizar la compra.", false);
      return;
    }

    // Si pasa la validación → simular carga con spinner
    const textoOriginal = btnFinalizar.textContent;
    btnFinalizar.disabled = true;
    btnFinalizar.innerHTML = `
      <div class="spinner-border spinner-border-sm text-light" role="status"></div> Procesando...
    `;

    setTimeout(() => {
      btnFinalizar.disabled = false;
      btnFinalizar.textContent = textoOriginal;
      // Mostrar modal de confirmación
      const modal = new bootstrap.Modal(document.getElementById("modalResumen"));
      modal.show();

      // Limpiar formularios
      inputsDireccion.forEach(i => i.value = "");
      radiosEnvio.forEach(r => r.checked = false);
      radiosPago.forEach(r => r.checked = false);
      document.getElementById("subtotal").value = "0 USD";
      document.getElementById("envioCosto").value = "0 USD";
      document.getElementById("total").value = "0 USD";
    }, 2000);
  });

  // ==== Función para mostrar alerta temporal ====
  function mostrarAlerta(mensaje, exito) {
    const alertaExistente = document.querySelector(".alerta");
    if (alertaExistente) alertaExistente.remove();

    const alerta = document.createElement("div");
    alerta.classList.add("alerta", "mt-2", "text-center", "p-2", "rounded");
    alerta.style.transition = "opacity 0.3s ease";

    if (exito) {
      alerta.style.backgroundColor = "#d4edda";
      alerta.style.color = "#155724";
      alerta.textContent = mensaje;
    } else {
      alerta.style.backgroundColor = "#f8d7da";
      alerta.style.color = "#721c24";
      alerta.textContent = mensaje;
    }

    btnFinalizar.insertAdjacentElement("afterend", alerta);

    setTimeout(() => alerta.remove(), 4000);
  }
});

// ====== VALIDACIÓN Y FINALIZAR COMPRA ======
document.addEventListener("DOMContentLoaded", function () {
  const btnFinalizar = document.querySelector("#costos button.btn-success"); // tu botón verde
  const inputsDireccion = document.querySelectorAll("#direccion .form-control");
  const radiosEnvio = document.querySelectorAll('input[name="tipoEnvio"]');
  const radiosPago = document.querySelectorAll('input[name="pago"]');

  btnFinalizar.addEventListener("click", (e) => {
    e.preventDefault();

    // Verificar tipo de envío seleccionado
    const envioSeleccionado = Array.from(radiosEnvio).some(radio => radio.checked);

    // Verificar forma de pago seleccionada
    const pagoSeleccionado = Array.from(radiosPago).some(radio => radio.checked);

    // Verificar dirección completa
    let direccionValida = true;
    inputsDireccion.forEach(input => {
      if (input.value.trim() === "") {
        input.classList.add("is-invalid");
        direccionValida = false;
      } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
      }
    });

    // Validación final
    if (!envioSeleccionado || !pagoSeleccionado || !direccionValida) {
      mostrarAlerta("⚠️ Completa todos los datos requeridos antes de finalizar la compra.", false);
      return;
    }

    // Si pasa la validación → simular carga con spinner
    const textoOriginal = btnFinalizar.textContent;
    btnFinalizar.disabled = true;
    btnFinalizar.innerHTML = `
      <div class="spinner-border spinner-border-sm text-light" role="status"></div> Procesando...
    `;

    setTimeout(() => {
      btnFinalizar.disabled = false;
      btnFinalizar.textContent = textoOriginal;
      // Mostrar modal de confirmación
      const modal = new bootstrap.Modal(document.getElementById("modalResumen"));
      modal.show();

      // Limpiar formularios
      inputsDireccion.forEach(i => i.value = "");
      radiosEnvio.forEach(r => r.checked = false);
      radiosPago.forEach(r => r.checked = false);
      document.getElementById("subtotal").value = "0 USD";
      document.getElementById("envioCosto").value = "0 USD";
      document.getElementById("total").value = "0 USD";
    }, 2000);
  });

  // ==== Función para mostrar alerta temporal ====
  function mostrarAlerta(mensaje, exito) {
    const alertaExistente = document.querySelector(".alerta");
    if (alertaExistente) alertaExistente.remove();

    const alerta = document.createElement("div");
    alerta.classList.add("alerta", "mt-2", "text-center", "p-2", "rounded");
    alerta.style.transition = "opacity 0.3s ease";

    if (exito) {
      alerta.style.backgroundColor = "#d4edda";
      alerta.style.color = "#155724";
      alerta.textContent = mensaje;
    } else {
      alerta.style.backgroundColor = "#f8d7da";
      alerta.style.color = "#721c24";
      alerta.textContent = mensaje;
    }

    btnFinalizar.insertAdjacentElement("afterend", alerta);

    setTimeout(() => alerta.remove(), 4000);
  }
});
const numeroTarjeta = document.getElementById('numeroTarjeta');
const iconVisa = document.getElementById('iconVisa');
const iconMastercard = document.getElementById('iconMastercard');

numeroTarjeta.addEventListener('input', () => {
  const valor = numeroTarjeta.value;
  if (/^4/.test(valor)) {
    iconVisa.style.display = 'block';
    iconMastercard.style.display = 'none';
  } else if (/^5[1-5]/.test(valor)) {
    iconVisa.style.display = 'none';
    iconMastercard.style.display = 'block';
  } else {
    iconVisa.style.display = 'none';
    iconMastercard.style.display = 'none';
  }
});
