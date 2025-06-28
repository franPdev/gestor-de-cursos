let cursos = [];

document.addEventListener("DOMContentLoaded", () => {
  const buscador = document.getElementById("buscador");

  fetch("http://localhost:3000/cursos")
    .then((res) => res.json())
    .then((data) => {
      cursos = data;
      window.mostrarCursos(cursos); // Usa la función global de main.js
    })
    .catch((err) => {
      document.getElementById("lista-cursos").innerHTML =
        "<p>Error al cargar los cursos.</p>";
      console.error("Error al cargar los cursos:", err);
    });

  buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase().trim();

    const filtrados = cursos.filter(
      (curso) =>
        curso.titulo.toLowerCase().includes(texto) ||
        curso.categoria.toLowerCase().includes(texto)
    );

    window.mostrarCursos(filtrados); // Siempre usa la función global
  });
});


