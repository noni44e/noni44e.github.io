//este js lo que hace es agregar el usuario a las paginas donde esta el "header".
let nom = localStorage.getItem('usuario');
let nombre = document.getElementById('nombre');
nombre.innerHTML = `<a class="nav-link">${nom}</a>`;
