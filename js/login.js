let es = document.getElementById('es');
let en = document.getElementById('en');
let deu = document.getElementById('deu');

let español = ['Mercado', 
    'tu sitio de compras favorito', 
    'Ingresa tu usuario',
    'Ingresa tu contraseña',
    'Entrar'
];

let english = ['Comerce', 
    'your favorite shopping site',
    'Enter your user',
    'Enter your password',
    'Log In'
];

let deutsch = ['Markt',
    'Ihre Lieblings-Shopping-Site',
    'Benutzer',
    'Passwort',
    'Eingeben'
];

function cambiaridioma(idioma){
    document.getElementById('merc').textContent = idioma[0];
    document.getElementById('h2').textContent = idioma[1];
    document.getElementById('text').placeholder = idioma[2];
    document.getElementById('password').placeholder = idioma[3];
    document.getElementById('boton').textContent = idioma[4];
}

es.addEventListener("click", ()=>{
    en.classList.remove('en');
    deu.classList.remove('deu');
    es.classList.add('es');
    cambiaridioma(español);
});

en.addEventListener("click", ()=>{
    es.classList.remove('es');
    deu.classList.remove('deu');
    en.classList.add('en');
    cambiaridioma(english);
});

deu.addEventListener('click', ()=>{
    es.classList.remove('es');
    en.classList.remove('en');
    deu.classList.add('deu');
    cambiaridioma(deutsch);
});

let form = document.getElementById('form');

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    let text = document.getElementById('text').value;
    let pass = document.getElementById('password').value;
    if (text !== "" && pass !== ""){
        localStorage.setItem("usuario", text);
        localStorage.setItem("password", pass);
        alert("datos guardados correctamente.");
        localStorage.setItem("registro", "true");//guardamos en un la memoria una variable registro con el valor true
        window.location.href ="index.html";
    }
    
});

