document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
  });
});
let contenedor = document.getElementById("contenedor");
let tarjetas = document.getElementsByClassName('tarjeta');
let imagenes = document.getElementsByClassName('imagenes');

function mostrar(caja,producto){
  caja.innerHTML=
  `<div class="tarjeta col">
        
      <div class="imagenes foto">
          <img src="${producto.image}">
      </div>
      <div class="nombre">${producto.name}</div>
      <div class="text">
          ${producto.description}
      </div>
      <div class="vendidos">Vendidos: ${producto.soldCount} </div>
      <div class="precio">
          ${producto.currency} ${producto.cost}
      </div>
      <div class="comprar">
          <div class="button izq">Comprar</div>
          <div class="button der">Información</div>
      </div>
    </div>
    `
}


let dato = localStorage.getItem("catID");
let pagina = "https://japceibal.github.io/emercado-api/cats_products/"+dato+".json";

fetch(pagina)
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.status);
    }
    return response.json(); // Convertir la respuesta en JSON
  })
  .then(data => {
    // Aquí manejas los datos que recibiste (por ejemplo, mostrar los productos)
    let productos = data.products;
    console.log(data.products);
    let largo = productos.length;
    for (let i=0; i < largo; i++){
      let div = document.createElement('div');
      let produ = productos[i];
      mostrar(div, produ);
      contenedor.appendChild(div);
    }
    let div = document.createElement("div");
    contenedor.appendChild(div);
    // renderProductos(data); // Llamas a una función que renderiza productos en el DOM
  })
  .catch(error => {
    // Manejo de errores
    console.error('Hubo un problema con el fetch:', error);
  });

  //Buscador
// Lista de autos en el propio JS 
const autos = [
  { nombre: "Chevrolet Onix Joy", url: "https://www.autoblog.com.uy/2018/11/lanzamiento-chevrolet-onix-y-prisma-joy.html" },
  { nombre: "Fiat Way", url: "https://www.autoblog.com.uy/2015/06/lanzamiento-fiat-uno-evo-way-my2016.html" },
  { nombre: "Suzuki Celerio", url: "https://www.autoblog.com.uy/2015/04/lanzamiento-suzuki-celerio.html" },
  { nombre: "Peugeot 208", url: "https://www.autoblog.com.uy/2012/10/lanzamiento-peugeot-208.html" },
  { nombre: "Bugatti Chiron", url: "https://www.autoblog.com.uy/2019/09/490484-kmh-el-bugatti-chiron-ahora-es.html" }
];

document.getElementById("busqueda").addEventListener("input", function() {
  const query = this.value.toLowerCase();
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = "";

  if (query.length > 1) {
    const filtrados = autos.filter(auto => auto.nombre.toLowerCase().includes(query));

    if (filtrados.length > 0) {
      filtrados.forEach(auto => {
        const link = document.createElement("a");
        link.href = auto.url;
        link.textContent = auto.nombre;
        link.target = "_blank";
        resultadosDiv.appendChild(link);
        resultadosDiv.appendChild(document.createElement("br"));
      });
    } else {
      // Si no hay coincidencias, muestra un enlace de búsqueda en Wikipedia
      const wikiLink = document.createElement("a");
      wikiLink.href = `https://es.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(this.value)}`;
      wikiLink.textContent = `Buscar "${this.value}" en Wikipedia`;
      wikiLink.target = "_blank";
      resultadosDiv.appendChild(wikiLink);
    }
  }
});

//Footer

  // Seleccionamos todos los botones con la clase toggle-btn
document.querySelectorAll('.toggle-btn').forEach(btn => {
  // Solo para #enlace y #siguenos
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
    // También ocultar cuando el mouse sale del contenido desplegado
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
