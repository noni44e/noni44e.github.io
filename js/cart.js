document.addEventListener("DOMContentLoaded", () => {
  // actualizar contador del carrito en el navbar (si existe)
  const btncar = document.getElementById('carritocantidad');
  const btncar3 = document.getElementById('car');
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let conta = 0;
  for (let i = 0; i < carrito.length; i++) conta += carrito[i].cantidad;
  if (btncar) btncar.innerText = conta;
  if (btncar3) btncar3.innerText = conta;

  // elementos del DOM para el carrito / resumen
  const contenedor = document.querySelector(".col-md-7");
  const inputSubtotal = document.querySelector(".summary-box input[readonly]");
  const envioInput = document.getElementById('envioCosto');
  const totalInput = document.getElementById('total');

  // Mostrar productos en el carrito
  function mostrarCarrito() {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    contenedor.innerHTML = "";

    if (!contenedor) return;

    // Si no hay productos, mostrar mensaje
    if (carrito.length === 0) {
      contenedor.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-cart-x fs-1 text-muted"></i>
          <p class="mt-3 text-muted">Tu carrito está vacío.</p>
          <a href="categories.html" class="btn btn-primary mt-2">Volver a comprar</a>
        </div>
      `;
      if (inputSubtotal) inputSubtotal.value = "0 USD";
      if (envioInput) envioInput.value = "0 USD";
      if (totalInput) totalInput.value = "0 USD";
      actualizarContadoresNavbar();
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
    actualizarSubtotal(); // recalcula subtotal/envío/total
    actualizarContadoresNavbar();
  }

  // recalcula y muestra subtotal (USD + UYU si aplica)
  function actualizarSubtotal() {
    let subtotalUSD = 0;
    let subtotalUYU = 0;

    carrito.forEach(p => {
      const total = p.costo * p.cantidad;
      if (p.moneda === "USD") subtotalUSD += total;
      else if (p.moneda === "UYU") subtotalUYU += total;
    });

    if (inputSubtotal) {
      if (subtotalUSD > 0 && subtotalUYU > 0) inputSubtotal.value = `${subtotalUSD.toFixed(2)} USD + ${subtotalUYU.toFixed(2)} UYU`;
      else if (subtotalUSD > 0) inputSubtotal.value = `${subtotalUSD.toFixed(2)} USD`;
      else if (subtotalUYU > 0) inputSubtotal.value = `${subtotalUYU.toFixed(2)} UYU`;
      else inputSubtotal.value = "0";
    }

    calcularTotal(subtotalUSD, subtotalUYU);
  }

  // calcula envío y total según subtotal recibido (separado por moneda)
  function calcularTotal(subtotalUSD = 0, subtotalUYU = 0) {
    const radio = document.querySelector('input[name="tipoEnvio"]:checked');
    const porcentaje = radio ? parseFloat(radio.value) : 0;

    const envioUSD = subtotalUSD * porcentaje;
    const envioUYU = subtotalUYU * porcentaje;

    if (envioInput) {
      if (envioUSD > 0 && envioUYU > 0) envioInput.value = `${envioUSD.toFixed(2)} USD + ${envioUYU.toFixed(2)} UYU`;
      else if (envioUSD > 0) envioInput.value = `${envioUSD.toFixed(2)} USD`;
      else if (envioUYU > 0) envioInput.value = `${envioUYU.toFixed(2)} UYU`;
      else envioInput.value = "0";
    }

    if (totalInput) {
      const totalUSDtoShow = subtotalUSD + envioUSD;
      const totalUYUtoShow = subtotalUYU + envioUYU;

      if (totalUSDtoShow > 0 && totalUYUtoShow > 0) totalInput.value = `${totalUSDtoShow.toFixed(2)} USD + ${totalUYUtoShow.toFixed(2)} UYU`;
      else if (totalUSDtoShow > 0) totalInput.value = `${totalUSDtoShow.toFixed(2)} USD`;
      else if (totalUYUtoShow > 0) totalInput.value = `${totalUYUtoShow.toFixed(2)} UYU`;
      else totalInput.value = "0";
    }
  }

  // asigna listeners a botones + / -
  function asignarEventos() {
    document.querySelectorAll(".btn-qty").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.currentTarget.getAttribute("data-index"));
        const action = e.currentTarget.getAttribute("data-action");

        if (action === "sumar") {
          carrito[index].cantidad++;
        }
        if (action === "restar" && carrito[index].cantidad > 1) {
          carrito[index].cantidad--;
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
      });
    });
  }

  // input cantidad manual
  function asignarEventosCantidad() {
    document.querySelectorAll(".cantidad-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        let nuevaCantidad = parseInt(e.target.value);
        if (isNaN(nuevaCantidad) || nuevaCantidad < 1) nuevaCantidad = 1;
        carrito[index].cantidad = nuevaCantidad;

        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
      });
    });
  }

  // botones eliminar
  function asignarBotonesEliminar() {
    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.currentTarget.getAttribute("data-index"));
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
      });
    });
  }

  // actualizar contador en navbar (después de cambios)
  function actualizarContadoresNavbar() {
    let contador = 0;
    for (let i = 0; i < carrito.length; i++) contador += carrito[i].cantidad;
    const btncarEl = document.getElementById('carritocantidad');
    const btncarEl2 = document.getElementById('car');
    if (btncarEl) btncarEl.innerText = contador;
    if (btncarEl2) btncarEl2.innerText = contador;
  }

  // recalcular envío/total cuando cambie tipo de envío
  document.querySelectorAll('input[name="tipoEnvio"]').forEach(r => {
    r.addEventListener('change', () => {
      // forzar recalculo leyendo el subtotal actual mostrado
      let subtotalUSD = 0;
      let subtotalUYU = 0;
      carrito.forEach(p => {
        const total = p.costo * p.cantidad;
        if (p.moneda === "USD") subtotalUSD += total;
        else if (p.moneda === "UYU") subtotalUYU += total;
      });
      calcularTotal(subtotalUSD, subtotalUYU);
    });
  });

  // Mostrar carrito inicial
  mostrarCarrito();
});

// ====== VALIDACIÓN Y FINALIZAR COMPRA ======
document.addEventListener("DOMContentLoaded", function () {
  const btnFinalizar = document.querySelector("#costos button.btn-success"); // tu botón verde
  if (!btnFinalizar) return;
  const inputsDireccion = document.querySelectorAll("#direccion .form-control");
  const radiosEnvio = document.querySelectorAll('input[name="tipoEnvio"]');
  const radiosPago = document.querySelectorAll('input[name="pago"]');

  btnFinalizar.addEventListener("click", (e) => {
    e.preventDefault();
  
    // ✅ Validar que haya productos en el carrito
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'Tu carrito está vacío. Agrega productos antes de finalizar la compra.'
      });
      return; // salir de la función
    }
    // Verificar tipo de envío seleccionado
    const envioSeleccionado = Array.from(radiosEnvio).some(radio => radio.checked);

    // Verificar forma de pago seleccionada
    const pagoSeleccionado = Array.from(radiosPago).some(radio => radio.checked);

    // Verificar dirección completa
    // Verificar dirección completa y tipo de datos
let direccionValida = true;

inputsDireccion.forEach(input => {
  const valor = input.value.trim();
  const tipo = input.dataset.tipo; // "texto" o "numero"

  // Campo vacío
  if (valor === "") {
    direccionValida = false;
    input.classList.add("is-invalid");
    return;
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  }

  // Validación de tipo
  if (tipo === "texto" && /\d/.test(valor)) {
    direccionValida = false;
    input.classList.add("is-invalid");
    Swal.fire({
      icon: 'error',
      title: 'Campo inválido',
      text: `El campo "${input.placeholder}" solo puede contener letras.`
    });
  }

  if (tipo === "numero" && !/^\d+$/.test(valor)) {
    direccionValida = false;
    input.classList.add("is-invalid");
    Swal.fire({
      icon: 'error',
      title: 'Campo inválido',
      text: `El campo "${input.placeholder}" solo puede contener números.`
    });
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

      // ✅ Se reemplaza por SweetAlert
  Swal.fire({
    icon: 'success',
    title: 'Compra realizada',
    html: '<p>¡Tu compra fue realizada con éxito!</p>',
    confirmButtonText: 'Aceptar',
    allowOutsideClick: false
  }).then(() => {
    // Limpiar formularios y carrito después de cerrar SweetAlert
    inputsDireccion.forEach(i => i.value = "");
    radiosEnvio.forEach(r => r.checked = false);
    radiosPago.forEach(r => r.checked = false);
    const subtotalEl = document.getElementById("subtotal");
    const envioEl = document.getElementById("envioCosto");
    const totalEl = document.getElementById("total");
    if (subtotalEl) subtotalEl.value = "0 USD";
    if (envioEl) envioEl.value = "0 USD";
    if (totalEl) totalEl.value = "0 USD";

    localStorage.removeItem("carrito");
    mostrarCarrito(); // actualizar pantalla y badges
  });

}, 2000);

      // Limpiar formularios
      inputsDireccion.forEach(i => i.value = "");
      radiosEnvio.forEach(r => r.checked = false);
      radiosPago.forEach(r => r.checked = false);
      const subtotalEl = document.getElementById("subtotal");
      const envioEl = document.getElementById("envioCosto");
      const totalEl = document.getElementById("total");
      if (subtotalEl) subtotalEl.value = "0 USD";
      if (envioEl) envioEl.value = "0 USD";
      if (totalEl) totalEl.value = "0 USD";

      // 🟢 SOLO cuando se cierra el modal, vacía el carrito
const modalResumen = document.getElementById("modalResumen");
modalResumen.addEventListener("hidden.bs.modal", () => {
  localStorage.removeItem("carrito");

  mostrarCarrito(); // 🔥 ACTUALIZA LA PANTALLA SIN REFRESCAR

  document.body.classList.remove("modal-open");
  document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
  const contenedor = document.querySelector(".col-md-7");
  if (contenedor) {
    contenedor.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-cart-x fs-1 text-muted"></i>
        <p class="mt-3 text-muted">Tu carrito está vacío 🛒</p>
        <a href="categories.html" class="btn btn-primary mt-2">Volver a comprar</a>
      </div>
    `;
  }
  // actualizar badges
  const btncarEl = document.getElementById('carritocantidad');
  const btncarEl2 = document.getElementById('car');
  if (btncarEl) btncarEl.innerText = "0";
  if (btncarEl2) btncarEl2.innerText = "0";
});
    }, 2000);

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

// tarjeta icons (solo si existen)
document.addEventListener("DOMContentLoaded", () => {
  const numeroTarjeta = document.getElementById('numeroTarjeta');
  const iconVisa = document.getElementById('iconVisa');
  const iconMastercard = document.getElementById('iconMastercard');

  if (!numeroTarjeta || !iconVisa || !iconMastercard) return;

  numeroTarjeta.addEventListener('input', () => {
    const value = numeroTarjeta.value;
    if (value.startsWith('4')) {
      iconVisa.classList.add('active');
      iconMastercard.classList.remove('active');
    } else if (value.startsWith('5')) {
      iconMastercard.classList.add('active');
      iconVisa.classList.remove('active');
    } else {
      iconVisa.classList.remove('active');
      iconMastercard.classList.remove('active');
    }
  });
});


