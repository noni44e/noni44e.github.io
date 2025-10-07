function temaOscuro() {
  const body = document.body;
  const icono = document.querySelector(".dl-icon");
  const temaActual = body.getAttribute("data-bs-theme");

  if (temaActual === "light") {
    body.setAttribute("data-bs-theme", "dark");
    icono.classList.remove("bi-sun");
    icono.classList.add("bi-moon-stars-fill");
  } else {
    body.setAttribute("data-bs-theme", "light");
    icono.classList.remove("bi-moon-stars-fill");
    icono.classList.add("bi-sun");
  }

  // Guardar preferencia
  localStorage.setItem("tema", body.getAttribute("data-bs-theme"));
}

document.addEventListener("DOMContentLoaded", () => {
  const temaGuardado = localStorage.getItem("tema") || "light";
  document.body.setAttribute("data-bs-theme", temaGuardado);

  const icono = document.querySelector(".dl-icon");
  icono.classList.add(temaGuardado === "dark" ? "bi-moon-stars-fill" : "bi-sun");
});
