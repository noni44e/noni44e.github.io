// Menu desplegable 
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('usuario'); // borrar usuario guardado en localStorage
  alert('Sesión cerrada'); 
  window.location.href = 'login.html'; // redirige al inicio
});
// Botón Mi carrito
const carritoBtn = document.getElementById('carritoBtn');
if (carritoBtn) {
  carritoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'cart.html';
  });
} 

let url = "/img/perfilpre.jpg";

document.addEventListener('DOMContentLoaded', ()=>{
    //elementos como botones
    let botonId = document.getElementById('nameId');
    let btnam = document.getElementById('nombrepersonal');
    let btnape = document.getElementById('apellido');
    let btnemail = document.getElementById('email');
    let btntel = document.getElementById('telefono');

    //datos almacenados en el local
    let nombre = localStorage.getItem('usuario');
    let email = localStorage.getItem('email');
    let name = localStorage.getItem('nam');
    let apellido = localStorage.getItem('apellido');
    let telefono = localStorage.getItem('telefono');
    
    //cargar todos los datos posibles
    botonId.value = nombre;
    
    let arreglo=[];
    let bloque=[];
    arreglo.push(name);
    arreglo.push(apellido);
    arreglo.push(nombre);
    arreglo.push(telefono);

    bloque.push(btnam);
    bloque.push(btnape);
    bloque.push(btnemail);
    bloque.push(btntel);

    let cantidad = arreglo.length;
    for(let i=0; i < cantidad;i++){
        if(arreglo[i] !== null){
        bloque[i].value = arreglo[i];
        } else {
            bloque[i].placeholder = 'Ingresa tu dato';
        }
    }

    const imagenGuardada = localStorage.getItem('imgPerfil');
    if (imagenGuardada){
        document.getElementById('imgprincipal').src = imagenGuardada;
    }

    
});

    let botonId = document.getElementById('nameId');
    let btnam = document.getElementById('nombrepersonal');
    let btnape = document.getElementById('apellido');
    let btnemail = document.getElementById('email');
    let btntel = document.getElementById('telefono');

let cambiarpass = document.getElementById('guardar');
let passw = localStorage.getItem('password');
let alerta = document.getElementById('alerta');
let exito = document.getElementById('exito');

//evento para cambiar contraseña
cambiarpass.addEventListener('click', (e)=>{
    e.preventDefault();
    let passingresada = document.getElementById('pass').value;
    let nuevapass = document.getElementById('newpass').value
    if (passw == passingresada && nuevapass != ''){
        exito.classList.add('visible');
        exito.classList.remove('invisible');
        setTimeout(()=>{
            exito.classList.remove('visible');
            exito.classList.add('invisible');
        },5000);
        localStorage.setItem('password', nuevapass);
        console.log(passw);
    } else {
        alerta.classList.add('visible');
        alerta.classList.remove('invisible');
        setTimeout(()=>{
            alerta.classList.remove('visible');
            alerta.classList.add('invisible');
        },6000);
        console.log(passw);
    }
});

document.getElementById('guardarIP').addEventListener('click', (e)=>{
    e.preventDefault(); 
    localStorage.setItem('email', btnemail.value);
    localStorage.setItem('nam', btnam.value);
    localStorage.setItem('telefono',btntel.value);
    localStorage.setItem('apellido',btnape.value);
    exito.classList.add('visible');
    exito.classList.remove('invisible');
    setTimeout(()=>{
        exito.classList.remove('visible');
        exito.classList.add('invisible');
    },5000);
});

document.getElementById('cambiar').addEventListener('click',()=>{
    document.getElementById('agregarimg').click();
});

document.getElementById('imgperfil').addEventListener('click',()=>{
    document.getElementById('agregarimg').click();
});

document.getElementById('agregarimg').addEventListener('change', (event)=>{
    const archivo = event.target.files[0];
    if(!archivo) {

        return;
    }

    if(archivo.size > 4 * 1024 * 1024){
        alert('Esta imagen es un snorlax');
        return;
    } else{

        const reader = new FileReader();
        reader.onload = function(e){
            const base64 = e.target.result;
            document.getElementById('imgprincipal').src = base64;
            localStorage.setItem('imgPerfil', base64);
        };

    reader.readAsDataURL(archivo);
    }
});

document.getElementById('borrar').addEventListener('click',(e)=>{
    e.preventDefault();
    document.getElementById('imgprincipal').src = url;
    localStorage.setItem('imgPerfil', url);
});

