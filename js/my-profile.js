// Menu desplegable 
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', (e) => {
  e.preventDefault(); // evita que el link haga scroll
  localStorage.removeItem('usuario'); // borrar usuario guardado en localStorage
  alert('Sesión cerrada'); // opcional
  window.location.href = 'login.html'; // redirige al inicio
});

// Cambio de imagen 
document.addEventListener('DOMContentLoaded', () => {
  const perfilImg = document.getElementById('perfilImg');
  const cambiarBtn = document.getElementById('btnCambiar');
  const borrarBtn = document.getElementById('btnBorrar');
  const inputFile = document.getElementById('cambiarImg');

  // Mostrar imagen guardada si existe
  const imgGuardada = localStorage.getItem('perfilImg');
  if (imgGuardada) {
    perfilImg.src = imgGuardada;
  }

  // Abrir selector al hacer clic en "Cambiar"
  cambiarBtn.addEventListener('click', () => {
    inputFile.click();
  });

  // Guardar nueva imagen
  inputFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      perfilImg.src = reader.result;       
      localStorage.setItem('perfilImg', reader.result); 
    };
    reader.readAsDataURL(file); // convierte a Base64
  });

  // Borrar imagen (volver a la predeterminada)
  borrarBtn.addEventListener('click', () => {
    perfilImg.src = '/img/perfilpre.jpg';
    localStorage.removeItem('perfilImg');
  });
});


// Informacion Personal 
document.addEventListener('DOMContentLoaded', () => {
  // Cargar datos si existen
  const nombre = localStorage.getItem('nombre');
  const apellido = localStorage.getItem('apellido');
  const email = localStorage.getItem('email');

  if(nombre) document.getElementById('inputNombre').value = nombre;
  if(apellido) document.getElementById('inputApellido').value = apellido;
  if(email) document.getElementById('inputEmail').value = email;

  // Guardar datos al hacer click
  document.getElementById('guardarInfo').addEventListener('click', () => {
    localStorage.setItem('nombre', document.getElementById('inputNombre').value);
    localStorage.setItem('apellido', document.getElementById('inputApellido').value);
    localStorage.setItem('email', document.getElementById('inputEmail').value);
    alert('Información guardada ✅');
  });
});

// === CAMBIO DE CONTRASEÑA ===
const guardarPassBtn = document.getElementById("guardarPass");
const passNueva = document.getElementById("passNueva");

guardarPassBtn.addEventListener("click", () => {
  const nueva = passNueva.value.trim();
  if(nueva.length < 4){
    alert("La contraseña debe tener al menos 4 caracteres.");
    return;
  }
  localStorage.setItem("password", nueva);
  alert("Contraseña actualizada correctamente ✅");
  passNueva.value = "";
});

// === ELIMINAR CUENTA CON CONFIRMACIÓN ===
const eliminarCuentaBtn = document.getElementById("eliminarCuenta");

eliminarCuentaBtn.addEventListener("click", () => {
  // Pedir confirmación escribiendo la palabra "CONFIRMAR"
  const confirmacion = prompt("Para eliminar tu cuenta, escribe la palabra CONFIRMAR:");
  
  if(confirmacion === "CONFIRMAR", "confirmar", "Confirmar") {
    // Elimina todos los datos del usuario
    localStorage.removeItem("nombre");
    localStorage.removeItem("apellido");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("perfilImg");
    localStorage.removeItem("usuario");

    alert("Cuenta eliminada correctamente ✅");
    window.location.href = "login.html"; // redirige al inicio
  } else if(confirmacion !== null) {
    // Si escribió algo distinto, avisar que no se eliminó
    alert("No se eliminó la cuenta. La palabra ingresada no coincide.");
  }
  // Si canceló prompt (confirmacion === null) no hace nada
});