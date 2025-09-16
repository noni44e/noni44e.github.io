let info = localStorage.getItem("dato-ide");
let contenedor = document.getElementById("principal");
let pagina = "https://japceibal.github.io/emercado-api/products/"+info+".json"
//le ingreso el contenedor principal y luego el producto que quiero mostrar. con esto luego voy a hacer un for para mostrar el producto
function mostrar(dato, producto){
    
    dato.innerHTML=`
    <div class='arriba'>
      
      <div class='btn category'>Categoria:${producto.category}</div>
      <div class='btn masvendido hidden'>Mas vendido</div>
    </div>
    <div id='bloque'>
        
        <div id='imagen'>
            <div id='imagenprincipal'>
                <img id='imgvar' class='imagen' src='${producto.images[0]}'>
            </div>
            <div id='imagenes' class='imagenes'>
            </div>
        </div>
        <div id="info">
            <p>${producto.name}</p>
            <div class='description'>${producto.description}
            
            </div>
            
            <div class='juntos'>
              <div class='btn precio'>${producto.currency}$${producto.cost}</div>
              <div class='btn' id='comprar'>Comprar</div>
            </div>
            <div id='vendidos'>
              <div class='btn vendidos'>${producto.soldCount} vendidos.</div>
            </div>
        </div>
    </div>
    
    `
    dato.appendChild
};
//caja = div, cantidad es la cantidad de imagenes que hay, de producto voy a conseguir las imagenes.
function agregarImagenes(caja, cantidad, producto){
    for(let i=0; i < cantidad; i++){
        let div = document.createElement('div');
        div.id=i;
        div.innerHTML=`<img class='imag' id='${i}' src='${producto.images[i]}'>`
        caja.appendChild(div);
    }
};


function masvendido(producto){
  fetch('https://japceibal.github.io/emercado-api/cats/cat.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.status);
    }
    return response.json(); // Convertir la respuesta en JSON
  })
  .then(data => {
    // Aquí manejas los datos que recibiste (por ejemplo, mostrar los productos)
    let cantidad = data.length;
    let i = 0;
    while (i<cantidad && data[i].name != producto.category){
      i++;
    };
    fetch("https://japceibal.github.io/emercado-api/cats_products/"+data[i].id+".json")
    .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.status);
    }
    return response.json(); // Convertir la respuesta en JSON
  })
  .then(dato => {
    // Aquí manejas los datos que recibiste (por ejemplo, mostrar los productos)
    let vendidos = producto.soldCount;
    let cant = dato.products.length;
    let a = 0;
    while (a < cant && (vendidos >= dato.products[a].soldCount)){
      a++;
    };
    if (a == cant){
      document.querySelector('.btn.masvendido').classList.remove('hidden');
    } else {
      document.querySelector('.btn.masvendido').classList.add('hidden');
    }
    // renderProductos(data); // Llamas a una función que renderiza productos en el DOM
  })
  .catch(error => {
    // Manejo de errores
    console.error('Hubo un problema con el fetch:', error);
});
    // renderProductos(data); // Llamas a una función que renderiza productos en el DOM
  })
  .catch(error => {
    // Manejo de errores
    console.error('Hubo un problema con el fetch:', error);
});
}

fetch(pagina)
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.status);
    }
    return response.json(); // Convertir la respuesta en JSON
  })
  .then(data => {
    // Aquí manejas los datos que recibiste (por ejemplo, mostrar los productos)
    let div = document.createElement('div');
    mostrar(div, data);
    contenedor.appendChild(div);

    let imagenes = document.querySelector('#imagenes');
    let cantidad = data.images.length;
    agregarImagenes(imagenes,cantidad,data);
    masvendido(data);
    //variables utiles que no se pueden definir antes de usar mostrar.
    //código para cambiar la imagen principal cuando se le da click 
    //a una de las imagenes que esta por debajo de la imagen principal.
    document.querySelectorAll('#imagenes img').forEach(e =>{
      e.addEventListener('click', ()=>{
        let imagen = document.getElementById('imgvar');
        imagen.src=e.src;
      });
    });


    // renderProductos(data); // Llamas a una función que renderiza productos en el DOM
  })
  .catch(error => {
    // Manejo de errores
    console.error('Hubo un problema con el fetch:', error);
});


//código para cambiar la imagen principal cuando se le da click 
//a una de las imagenes que esta por debajo de la imagen principal.
document.querySelectorAll('imagenes').forEach(btn =>{
  btn.addEventListener('click', ()=>{
    imagen.src='httmp.com';
  });
});

