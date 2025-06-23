let cursos = [];

document.addEventListener("DOMContentLoaded", () => {
  const buscador = document.getElementById("buscador");

  fetch("http://localhost:3000/cursos") // Usa la misma URL que en main.js
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

function mostrarCursos(lista) {
  const resultado = document.getElementById("lista-cursos");
  resultado.innerHTML = "";

  if (lista.length === 0) {
    resultado.innerHTML = "<p>No se encontraron cursos.</p>";
    return;
  }

  lista.forEach((curso) => {
    const col = document.createElement("div");
    col.className = "col-md-4 fade-in mb-3";
    col.innerHTML = `
      <div class="card card-curso h-100">
        <div class="card-body">
          <h5 class="card-title">${curso.titulo}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Categoría: ${
            curso.categoria
          }</h6>
          <p class="card-text">Duración: ${curso.duracion} horas</p>
          <span class="badge ${
            curso.completado ? "bg-success" : "bg-warning text-dark"
          }">
            ${curso.completado ? "Completado" : "Pendiente"}
          </span>
        </div>
      </div>
    `;
    resultado.appendChild(col);
  });
}
