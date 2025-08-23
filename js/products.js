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

fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
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