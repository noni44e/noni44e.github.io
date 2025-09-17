let info = localStorage.getItem("dato-ide");
let contenedor = document.getElementById("principal");
let pagina = "https://japceibal.github.io/emercado-api/products/" + info + ".json";

// ================== Mostrar producto principal ==================
function mostrar(dato, producto) {
  dato.innerHTML = `
    <div class='arriba'>
      <div class='btn category'>Categoria:${producto.category}</div>
      <div class='btn masvendido hidden'>Mas vendido</div>
    </div>
    <div id='bloque'>
        <div id='imagen'>
            <div id='imagenprincipal'>
                <img class='imagen' src='${producto.images[0]}'>
            </div>
            <div id='imagenes' class='imagenes'></div>
        </div>
        <div id="info">
            <p>${producto.name}</p>
            <div class='description'>${producto.description}</div>
            <div class='juntos'>
              <div class='btn precio'>${producto.currency}$${producto.cost}</div>
              <div class='btn' id='comprar'>Comprar</div>
            </div>
            <div id='vendidos'>
              <div class='btn vendidos'>${producto.soldCount} vendidos.</div>
            </div>
            </div>
    </div>
  `;
}

// ================== Agregar miniaturas ==================
function agregarImagenes(caja, cantidad, producto) {
  for (let i = 0; i < cantidad; i++) {
    let div = document.createElement("div");
    div.id = i;
    div.innerHTML = `<img class='imag miniatura' data-id='${i}' src='${producto.images[i]}'>`;
    caja.appendChild(div);
  }

  const mainImg = document.querySelector("#imagenprincipal .imagen");
  const miniaturas = caja.querySelectorAll(".miniatura");

  function cambiarImagen(src, thumb) {
    mainImg.style.opacity = 0;
    setTimeout(() => {
      mainImg.src = src;
      mainImg.style.opacity = 1;
    }, 200);
    miniaturas.forEach(img => img.classList.remove("active"));
    thumb.classList.add("active");
  }

  miniaturas.forEach(thumb => {
    thumb.addEventListener("click", () => {
      cambiarImagen(thumb.src, thumb);
    });
  });

  if (miniaturas[0]) miniaturas[0].classList.add("active");
}

// ================== Mostrar productos relacionados ==================
function mostrarRelacionados(relacionados) {
  let contenedorRel = document.getElementById("relacionados-container");
  contenedorRel.innerHTML = `<h2>Productos relacionados</h2><div id="relacionados" style="display:flex; gap:2em; flex-wrap:wrap;"></div>`;
  
  contenedorRel = contenedorRel.querySelector("#relacionados");

  relacionados.forEach(rel => {
    let url = `https://japceibal.github.io/emercado-api/products/${rel.id}.json`;
    fetch(url)
      .then(res => res.json())
      .then(prod => {
        let card = document.createElement("div");
        card.classList.add("relacionado");
        card.style = "cursor:pointer; width:15em; text-align:center;";

        card.innerHTML = `
          <img src="${prod.images[0]}" style="width:100%; border-radius:1em;">
          <h3>${prod.name}</h3>
          <p>${prod.currency} ${prod.cost}</p>
        `;

        card.addEventListener("click", () => {
          localStorage.setItem("dato-ide", prod.id);
          window.location.href = "product-info.html";
        });

        contenedorRel.appendChild(card);
      });
  });
}

// ================== Lógica de "más vendido" ==================
function masvendido(producto) {
  fetch("https://japceibal.github.io/emercado-api/cats/cat.json")
    .then(res => res.json())
    .then(data => {
      let categoria = data.find(cat => cat.name === producto.category);
      return fetch(`https://japceibal.github.io/emercado-api/cats_products/${categoria.id}.json`);
    })
    .then(res => res.json())
    .then(dato => {
      let vendidos = producto.soldCount;
      let maxVendidos = Math.max(...dato.products.map(p => p.soldCount));
      if (vendidos >= maxVendidos) {
        document.querySelector(".btn.masvendido").classList.remove("hidden");
      }
    })
    .catch(err => console.error("Hubo un problema con el fetch:", err));
}

// ================== Cargar producto principal ==================
fetch(pagina)
  .then(res => res.json())
  .then(data => {
    let div = document.createElement("div");
    mostrar(div, data);
    contenedor.appendChild(div);

    let imagenes = document.querySelector("#imagenes");
    let cantidad = data.images.length;
    agregarImagenes(imagenes, cantidad, data);

    masvendido(data);

    // 🔹 Ahora mostramos relacionados en el footer
    if (data.relatedProducts && data.relatedProducts.length > 0) {
      mostrarRelacionados(data.relatedProducts);
    }
  })
  .catch(err => console.error("Hubo un problema con el fetch:", err));