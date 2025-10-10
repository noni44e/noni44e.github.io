let info = localStorage.getItem("dato-ide");
let contenedor = document.getElementById("principal");
let pagina = "https://japceibal.github.io/emercado-api/products/" + info + ".json";
let nombredeusuario = localStorage.getItem('usuario');
// ================== Mostrar producto principal ==================
function mostrar(dato, producto) {
  dato.innerHTML = `
    <div class='arriba'>
      <div class='category'>Categoria:${producto.category}</div>
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
              <div class='vendidos'>${producto.soldCount} vendidos.</div>
              
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
          <p id="prelacionados">${prod.currency} ${prod.cost}</p>
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

// ================== Mostrar calificaciones ================== -- new
function mostrarCalificaciones(comentarios) {
  let contenedorComentarios = document.getElementById("comentarios-container");

  // Calcular promedio de estrellas
  let promedio = 0;
  if (comentarios.length > 0) {
    promedio = comentarios.reduce((acc, c) => acc + c.score, 0) / comentarios.length;
    promedio = Math.round(promedio * 10) / 10; 
    
  }

  // Mostrar estrellas promedio == new
  let estrellasProm = "";
  for (let i = 1; i <= 5; i++) {
    estrellasProm += i <= Math.round(promedio) ? "⭐" : "☆";
  }

  // 🔹 Mostrar promedio == new
  let infoDiv = document.getElementById("info");
  if (infoDiv) {
    let promedioDiv = document.getElementById("promedio-estrellas");
    if (!promedioDiv) {
      promedioDiv = document.createElement("div");
      promedioDiv.id = "promedio-estrellas";
      infoDiv.appendChild(promedioDiv);
    }
    promedioDiv.innerHTML = `<strong>${promedio} / 5</strong> <span>${estrellasProm}</span>`;
  }

  contenedorComentarios.innerHTML = `
    <h2>Calificaciones</h2>
    <div id="lista-comentarios" style="display:flex; flex-direction:column; gap:1em;"></div>
  `;

  let lista = contenedorComentarios.querySelector("#lista-comentarios");

  comentarios.forEach(c => {
    let div = document.createElement("div");
    div.classList.add("comentario");
    div.style = "padding:1em; border:1px solid #ccc; border-radius:0.5em; background:#f9f9f9;";

    // estrellas dinámicas
    let estrellas = "";
    for (let i = 1; i <= 5; i++) {
      estrellas += i <= c.score ? "⭐" : "☆";
    }

    div.innerHTML = `
      <p><strong>${c.user}</strong> - <small>${c.dateTime}</small></p>
      <p>${c.description}</p>
      <p>${estrellas}</p>
    `;

    lista.appendChild(div);
  });
}

function estrellas(cantidad){
  let dibujar= '';
  for(let i = 0; i < cantidad;i++){
    dibujar += '⭐';
  }
  let nuevacantidad = 5 - cantidad;
  for(let i = 0; i < nuevacantidad;i++){
    dibujar+= '☆';
  }
  return dibujar;
}

function hacercomentario(data){
  //hacer comentario
  document.getElementById('formulario').addEventListener('submit',function(e){
    
    let tiempo = new Date();
    let fecha = tiempo.toLocaleDateString();
    let hora = tiempo.toLocaleTimeString();
    let idfecha = data.id+'fecha';
    let idhora = data.id+'hora';
    let lista = document.getElementById("comentarios-container");
    e.preventDefault();
    let text = document.getElementById('inputtext').value.trim();
    console.log(text);
    let cal = document.getElementById('calificacion').value;
    let estrellastexto = estrellas(parseInt(cal));
    let ide = "texto"+ data.id;
    let cali = "cal"+data.id;
    localStorage.setItem(idfecha, fecha);
    localStorage.setItem(idhora, hora);
    localStorage.setItem(ide, text);
    localStorage.setItem(cali, cal);
      
    if (localStorage.getItem(ide) === null){
    
      let div = document.createElement("div");
      div.classList.add("comentario");
      div.classList.add("clase");
      /* div.style = "padding:1em; border:1px solid #ccc; border-radius:0.5em; background:#f9f9f9;"; */
      div.id = "comentario_"+ data.id;
      div.innerHTML = `
        <p><strong>${nombredeusuario}</strong> - <small>${fecha}</small> <small>${hora}</small></p>
        <p>${text}</p>
        <p>${estrellastexto}</p>

      `;
      lista.appendChild(div);
    } else{
      let cajaid = "comentario_"+ data.id;

      let caja = document.getElementById(cajaid);
      caja.innerHTML = `
      <p><strong>${nombredeusuario}</strong> - <small>${fecha}</small> <small>${hora}</small></p>
      <p>${text}</p>
      <p>${estrellastexto}</p>
      
    `;

    }
    document.getElementById('inputtext').value = '';
});
}

function cargarcomentario(data){
  let ide = "texto"+data.id;
  let idfecha = data.id+'fecha';
  let idhora = data.id+'hora';
  if(localStorage.getItem(ide) !== null){
    let lista = document.getElementById("comentarios-container");
    let hora = localStorage.getItem(idhora);
    let fecha = localStorage.getItem(idfecha);
    let div = document.createElement("div");
    div.classList.add("comentario");
    div.classList.add("clase");
    div.style = "padding:1em; border:1px solid #ccc; border-radius:0.5em; background:#f9f9f9;";
    let contenido = localStorage.getItem(ide);
    div.id = "comentario_"+data.id;
    let cal = document.getElementById('calificacion').value;
    let estrellastexto = estrellas(parseInt(cal));
    
    div.innerHTML = `
      <p><strong>${nombredeusuario}</strong> - <small>${fecha}</small> <small>${hora}</small></p>
      <p>${contenido}</p>
      <p>${estrellastexto}</p>
    `;
    lista.appendChild(div);
  }
};

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

    // 🔹 Comentarios dinámicos -- new
    fetch(`https://japceibal.github.io/emercado-api/products_comments/${data.id}.json`)
      .then(res => res.json())
      .then(comentarios => {
        if (comentarios.length > 0) {
          mostrarCalificaciones(comentarios);
        }
        cargarcomentario(data);
        hacercomentario(data);
      })
      .catch(err => console.error("Error cargando comentarios:", err));
  })
  .catch(err => console.error("Hubo un problema con el fetch:", err));
