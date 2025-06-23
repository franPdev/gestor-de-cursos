window.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/cursos";
  window.mostrarCursos = mostrarCursos;

  const listaCursos = document.getElementById("lista-cursos");
  const formCurso = document.getElementById("form-curso");
  const cursoModalEl = document.getElementById("cursoModal");
  const cursoModal = new bootstrap.Modal(cursoModalEl);
  let cursoEditadoId = null;
  let cursosGlobal = []; 




  async function obtenerCursos() {
  const res = await fetch(API_URL);
  const data = await res.json();
  cursosGlobal = data; 
  mostrarCursos(data);
}

// Ordenar cursos
document.getElementById("ordenar-cursos").addEventListener("change", function() {
  let lista = [...cursosGlobal];
  const valor = this.value;
  if (valor === "titulo-asc") lista.sort((a, b) => a.titulo.localeCompare(b.titulo));
  if (valor === "titulo-desc") lista.sort((a, b) => b.titulo.localeCompare(a.titulo));
  if (valor === "duracion-asc") lista.sort((a, b) => a.duracion - b.duracion);
  if (valor === "duracion-desc") lista.sort((a, b) => b.duracion - a.duracion);
  mostrarCursos(lista);
});

//filtro

document.getElementById("filtrar-categoria").addEventListener("change", function() {
  const categoria = this.value;
  let lista = [...cursosGlobal];
  if (categoria) {
    lista = lista.filter(curso => curso.categoria.toLowerCase() === categoria.toLowerCase());
  }
  mostrarCursos(lista);
});


   function mostrarCursos(lista) {
  listaCursos.innerHTML = "";

  if (lista.length === 0) {
    listaCursos.innerHTML = "<p>No se encontraron cursos.</p>";
    return;
  }

  lista.forEach((curso) => {
    const col = document.createElement("div");
    const icono = getIconByCategoria(curso.categoria);
    col.className = "col-md-4 fade-in mb-3";
    col.innerHTML = `
      <div class="card card-curso h-100 position-relative overflow-hidden">
        <i class="${icono} card-bg-icon"></i>
        <div class="card-body position-relative">
         <h5 class="card-title detalle-curso" data-id="${curso.id}" style="cursor:pointer">${curso.titulo}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Categoría: ${curso.categoria}</h6>
          <p class="card-text">Duración: ${curso.duracion} horas</p>
          <span class="badge ${curso.completado ? 'bg-success' : 'bg-warning text-dark'}">
            ${curso.completado ? 'Completado' : 'Pendiente'}
          </span>
          <span class="badge bg-info text-dark mb-2">${curso.categoria}</span>
        </div>
        <div class="card-footer bg-transparent border-0 d-flex justify-content-end">
          <button data-id="${curso.id}" class="btn btn-sm btn-danger me-2 btn-eliminar">🗑️</button>
          <button data-id="${curso.id}" class="btn btn-sm btn-outline-primary btn-editar">✏️</button>
        </div>
      </div>
    `;
    listaCursos.appendChild(col);
  });
}
window.mostrarCursos = mostrarCursos;



  // Función para obtener el icono según la categoría
  function getIconByCategoria(categoria) {
  switch (categoria.toLowerCase()) {
    case "programación": return "bi bi-code-slash";
    case "diseño": return "bi bi-palette-fill";
    case "marketing": return "bi bi-megaphone-fill";
    default: return "bi bi-mortarboard-fill";
  }
}

  async function agregarCurso(e) {
    e.preventDefault();
    try {
      const nuevoCurso = {
        titulo: document.getElementById("titulo").value.trim(),
        duracion: Number(document.getElementById("duracion").value),
        categoria: document.getElementById("categoria").value,
        completado: document.getElementById("completado").checked,
      };

      
if (!nuevoCurso.titulo || !nuevoCurso.duracion || !nuevoCurso.categoria) {
  mostrarToast("Por favor, completa todos los campos.", "warning");
  return;
}
if (nuevoCurso.duracion <= 0) {
  mostrarToast("La duración debe ser mayor a 0.", "warning");
  return;
}

      if (cursoEditadoId) {
        await fetch(`${API_URL}/${cursoEditadoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoCurso),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoCurso),
        });
      }

      cursoModal.hide();
      await obtenerCursos();

      formCurso.reset();
      cursoEditadoId = null;
      document.getElementById("cursoModalLabel").textContent = "Agregar Curso";

    } catch (error) {
      console.error("Error en agregar/editar curso:", error);
      cursoModal.hide();
      alert("Error al guardar el curso.");
    }
  }

 listaCursos.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("btn-eliminar")) {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      await obtenerCursos();
    } catch (error) {
      console.error("Error al eliminar curso:", error);
      alert("Error al eliminar el curso.");
    }
  }

  if (e.target.classList.contains("btn-editar")) {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const curso = await res.json();

      document.getElementById("titulo").value = curso.titulo;
      document.getElementById("duracion").value = curso.duracion;
      document.getElementById("categoria").value = curso.categoria;
      document.getElementById("completado").checked = curso.completado;

      document.getElementById("cursoModalLabel").textContent = "Editar Curso";
      cursoModal.show();
      cursoEditadoId = id;
    } catch (error) {
      console.error("Error al cargar curso para editar:", error);
      alert("Error al cargar el curso.");
    }
  }

  // Vista de detalles
  if (e.target.classList.contains("detalle-curso")) {
    const curso = cursosGlobal.find(c => c.id == id);
    if (curso) {
      document.getElementById("detalleCursoLabel").textContent = curso.titulo;
      document.getElementById("detalleCursoBody").innerHTML = `
        <p><strong>Categoría:</strong> ${curso.categoria}</p>
        <p><strong>Duración:</strong> ${curso.duracion} horas</p>
        <p><strong>Descripción:</strong> ${curso.descripcion || "Sin descripción"}</p>
        <p><strong>Estado:</strong> ${curso.completado ? "Completado" : "Pendiente"}</p>
      `;
      new bootstrap.Modal(document.getElementById("detalleCursoModal")).show();
    }
  }
});
  formCurso.addEventListener("submit", agregarCurso);
  obtenerCursos();
});
