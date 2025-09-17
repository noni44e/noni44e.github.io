let contenedor = document.getElementById("contenedor");
let productosGlobal = []; // Guardará los productos del fetch

// Función para mostrar un producto en una caja
function mostrar(caja, producto) {
  let ide = producto.id;
  caja.innerHTML = `
    <div class="tarjeta col">
      <div class="imagenes foto">
          <img src="${producto.image}">
      </div>
      <div class="nombre">${producto.name}</div>
      <div class="text">${producto.description}</div>
      <div class="vendidos">Vendidos: ${producto.soldCount}</div>
      <div class="precio">${producto.currency} ${producto.cost}</div>
      <div class="comprar">
          <div class="button izq">Comprar</div>
          <div class="button der" data-id="${ide}">Información</div>
      </div>
    </div>
  `;
}

// Función para renderizar un array de productos
function renderizarProductos(lista) {
  contenedor.innerHTML = ""; // Limpiar contenedor
  lista.forEach(prod => {
    let div = document.createElement("div");
    mostrar(div, prod);
    contenedor.appendChild(div);
  });
}

// Fetch de la categoría desde localStorage
let catID = localStorage.getItem("catID");
let pagina = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

fetch(pagina)
  .then(response => response.json())
  .then(data => {
    productosGlobal = data.products;
    renderizarProductos(productosGlobal);
  })
  .catch(error => console.error("Hubo un problema con el fetch:", error));

// Click en botón "Información"
contenedor.addEventListener("click", (e) => {
  if (e.target.classList.contains("der")) {
    let ide = e.target.getAttribute("data-id");
    localStorage.setItem("dato-ide", ide);
    localStorage.setItem("catID", catID); // guardamos la categoría
    window.location.href = "product-info.html";
  }
});

// ======================== Buscador ========================
document.getElementById("busqueda").addEventListener("input", function() {
  const query = this.value.toLowerCase();
  filtrarYOrdenar({ busqueda: query });
});

// ======================== Filtros por precio ========================
document.getElementById("filtrar").addEventListener("click", () => {
  const min = Number(document.getElementById("precioMin").value);
  const max = Number(document.getElementById("precioMax").value);
  filtrarYOrdenar({ precioMin: min, precioMax: max });
});

document.getElementById("limpiar").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("precioMin").value = "";
  document.getElementById("precioMax").value = "";
  document.getElementById("busqueda").value = "";
  renderizarProductos(productosGlobal);
});

// ======================== Ordenamiento ========================
document.getElementById("sortAsc").addEventListener("click", () => filtrarYOrdenar({ orden: "asc" }));
document.getElementById("sortDesc").addEventListener("click", () => filtrarYOrdenar({ orden: "desc" }));
document.getElementById("sortRel").addEventListener("click", () => filtrarYOrdenar({ orden: "rel" }));

// ======================== Función combinada filtrado + orden ========================
function filtrarYOrdenar({ busqueda = "", precioMin = -Infinity, precioMax = Infinity, orden = null } = {}) {
  let lista = productosGlobal.filter(producto => {
    const nombre = producto.name.toLowerCase();
    const descripcion = producto.description.toLowerCase();
    const cumpleBusqueda = busqueda === "" || nombre.includes(busqueda) || descripcion.includes(busqueda);
    const cumplePrecio = producto.cost >= precioMin && producto.cost <= precioMax;
    return cumpleBusqueda && cumplePrecio;
  });

  if (orden === "asc") lista.sort((a, b) => a.cost - b.cost);
  if (orden === "desc") lista.sort((a, b) => b.cost - a.cost);
  if (orden === "rel") lista.sort((a, b) => b.soldCount - a.soldCount);

  renderizarProductos(lista);
}

// ======================== Footer ========================
document.querySelectorAll('.toggle-btn').forEach(btn => {
  if (btn.id === 'enlace' || btn.id === 'siguenos') {
    btn.addEventListener('mouseover', () => {
      const content = btn.nextElementSibling;
      content.style.display = 'block';
      content.classList.add('show');
      // Scroll automático si el menú queda fuera de vista
      setTimeout(() => {
        content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    });

    btn.addEventListener('mouseout', () => {
      const content = btn.nextElementSibling;
      content.style.display = 'none';
      content.classList.remove('show');
    });

    const content = btn.nextElementSibling;
    content.addEventListener('mouseleave', () => {
      content.style.display = 'none';
      content.classList.remove('show');
    });
    content.addEventListener('mouseenter', () => {
      content.style.display = 'block';
      content.classList.add('show');
    });
  }
});
