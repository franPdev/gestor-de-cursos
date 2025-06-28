window.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://corsproxy.io/?https://gestor-de-cursos.onrender.com/cursos";
  const listaCursos = document.getElementById("lista-cursos");
  const formCurso = document.getElementById("form-curso");
  const cursoModalEl = document.getElementById("cursoModal");
  const cursoModal = new bootstrap.Modal(cursoModalEl);

  let cursoEditadoId = null;
  let cursosGlobal = [];

  const textos = {
    categoria: "Categoría",
    duracion: "Duración",
    descripcion: "Descripción",
    estado: "Estado",
    completado: "Completado",
    pendiente: "Pendiente",
    noCursos: "No se encontraron cursos.",
    agregar: "Agregar Curso",
    guardar: "Guardar",
    cancelar: "Cancelar",
    tituloApp: "Gestor de Cursos",
    buscar: "Buscar",
    categoriaLabel: "Categoría",
    duracionLabel: "Duración",
    footer: "Desarrollado por franPdev",
    editar: "Editar Curso",
    agregarModal: "Agregar Curso",
  };

  function actualizarTituloModal() {
    const labelModal = document.getElementById("cursoModalLabel");
    if (labelModal) {
      labelModal.textContent = cursoEditadoId
        ? textos.editar
        : textos.agregarModal;
    }
  }

  function actualizarTextos() {
    const tituloApp = document.querySelector(".navbar-brand");
    if (tituloApp) tituloApp.textContent = textos.tituloApp;

    const btnBuscar = document.querySelector(".search-button");
    if (btnBuscar) btnBuscar.textContent = textos.buscar;

    const btnAgregar = document.querySelector(
      ".btn-success[data-bs-target='#cursoModal']"
    );
    if (btnAgregar) {
      btnAgregar.innerHTML = `<i class="bi bi-plus-circle"></i> ${textos.agregar}`;
    }

    const btnGuardar = document.querySelector(
      "#form-curso button[type='submit']"
    );
    if (btnGuardar) btnGuardar.textContent = textos.guardar;
    const btnCancelar = document.querySelector(
      "#form-curso button.btn-secondary"
    );
    if (btnCancelar) btnCancelar.textContent = textos.cancelar;

    const buscador = document.getElementById("buscador");
    if (buscador) {
      buscador.placeholder = "Buscar cursos...";
    }

    const optOrdenar = document.querySelector(
      "#ordenar-cursos option[value='']"
    );
    if (optOrdenar) optOrdenar.textContent = "Ordenar por...";

    const optCategoria = document.querySelector(
      "#filtrar-categoria option[value='']"
    );
    if (optCategoria) optCategoria.textContent = "Todas las categorías";

    const optTituloAsc = document.querySelector(
      "#ordenar-cursos option[value='titulo-asc']"
    );
    if (optTituloAsc) optTituloAsc.textContent = "Título (A-Z)";
    const optTituloDesc = document.querySelector(
      "#ordenar-cursos option[value='titulo-desc']"
    );
    if (optTituloDesc) optTituloDesc.textContent = "Título (Z-A)";
    const optDuracionAsc = document.querySelector(
      "#ordenar-cursos option[value='duracion-asc']"
    );
    if (optDuracionAsc) optDuracionAsc.textContent = "Duración (menor a mayor)";
    const optDuracionDesc = document.querySelector(
      "#ordenar-cursos option[value='duracion-desc']"
    );
    if (optDuracionDesc)
      optDuracionDesc.textContent = "Duración (mayor a menor)";

    const catProg = document.querySelector(
      "#filtrar-categoria option[value='programación']"
    );
    if (catProg) catProg.textContent = "Programación";
    const catDis = document.querySelector(
      "#filtrar-categoria option[value='diseño']"
    );
    if (catDis) catDis.textContent = "Diseño";
    const catMkt = document.querySelector(
      "#filtrar-categoria option[value='marketing']"
    );
    if (catMkt) catMkt.textContent = "Marketing";
    const catFrontend = document.querySelector(
      "#filtrar-categoria option[value='frontend']"
    );
    if (catFrontend) catFrontend.textContent = "Frontend";
    const catBackend = document.querySelector(
      "#filtrar-categoria option[value='backend']"
    );
    if (catBackend) catBackend.textContent = "Backend";

    const footer = document.getElementById("footer-text");
    if (footer) footer.textContent = textos.footer;

    actualizarTituloModal();
  }

  async function obtenerCursos() {
    const res = await fetch(API_URL);
    const data = await res.json();
    cursosGlobal = data;
    mostrarCursos(data);
  }

  document
    .getElementById("ordenar-cursos")
    .addEventListener("change", function () {
      let lista = [...cursosGlobal];
      const valor = this.value;
      if (valor === "titulo-asc")
        lista.sort((a, b) => a.titulo.localeCompare(b.titulo));
      if (valor === "titulo-desc")
        lista.sort((a, b) => b.titulo.localeCompare(a.titulo));
      if (valor === "duracion-asc")
        lista.sort((a, b) => a.duracion - b.duracion);
      if (valor === "duracion-desc")
        lista.sort((a, b) => b.duracion - a.duracion);
      mostrarCursos(lista);
    });

  document
    .getElementById("filtrar-categoria")
    .addEventListener("change", function () {
      const categoria = this.value;
      let lista = [...cursosGlobal];
      if (categoria) {
        lista = lista.filter(
          (curso) => curso.categoria.toLowerCase() === categoria.toLowerCase()
        );
      }
      mostrarCursos(lista);
    });

  function mostrarCursos(lista) {
    const resultado = document.getElementById("lista-cursos");
    if (lista.length === 0) {
      resultado.innerHTML = `<p>${textos.noCursos}</p>`;
      return;
    }
    resultado.innerHTML = "";

    lista.forEach((curso) => {
      const col = document.createElement("div");
      col.className = "col-md-4 fade-in mb-3";
      const icono =
        typeof getIconByCategoria === "function"
          ? getIconByCategoria(curso.categoria)
          : "bi bi-mortarboard-fill";
      col.innerHTML = `
      <div class="card card-curso h-100 position-relative overflow-hidden">
        ${
          curso.imagen
            ? `<img src="${curso.imagen}" class="card-img-top" alt="${curso.titulo}" style="object-fit:contain;max-height:120px;">`
            : ""
        }
        <i class="${icono} card-bg-icon"></i>
        <div class="card-body position-relative">
          <h5 class="card-title detalle-curso" data-id="${
            curso.id
          }" style="cursor:pointer">${curso.titulo}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${textos.categoriaLabel}: ${
        curso.categoria
      }</h6>
          <p class="card-text">${textos.duracionLabel}: ${
        curso.duracion
      } horas</p>
          <span class="badge ${
            curso.completado ? "bg-success" : "bg-warning text-dark"
          }">
            <span>${
              curso.completado ? textos.completado : textos.pendiente
            }</span>
          </span>
        </div>
        <div class="card-footer bg-transparent border-0 d-flex justify-content-end">
          <button data-id="${
            curso.id
          }" class="btn btn-sm btn-danger me-2 btn-eliminar">🗑️</button>
          <button data-id="${
            curso.id
          }" class="btn btn-sm btn-outline-primary btn-editar">✏️</button>
        </div>
      </div>`;
      resultado.appendChild(col);
    });
  }

  window.mostrarCursos = mostrarCursos;

  function getIconByCategoria(categoria) {
    switch (categoria.toLowerCase()) {
      case "programación":
        return "bi bi-code-slash";
      case "diseño":
        return "bi bi-palette-fill";
      case "marketing":
        return "bi bi-megaphone-fill";
      case "frontend":
        return "bi bi-window";
      case "backend":
        return "bi bi-hdd-network";
      default:
        return "bi bi-mortarboard-fill";
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
        imagen: document.getElementById("imagen")?.value || "",
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
      actualizarTituloModal();
    } catch (error) {
      console.error("Error en agregar/editar curso:", error);
      cursoModal.hide();
      alert("Error al guardar el curso.");
    }
  }

  // Abrir modal para agregar
  const btnAgregar = document.querySelector(
    ".btn-success[data-bs-target='#cursoModal']"
  );
  if (btnAgregar) {
    btnAgregar.addEventListener("click", () => {
      cursoEditadoId = null;
      actualizarTituloModal();
    });
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

        cursoEditadoId = id;
        cursoModal.show();
        actualizarTituloModal();
      } catch (error) {
        console.error("Error al cargar curso para editar:", error);
        alert("Error al cargar el curso.");
      }
    }

    if (e.target.classList.contains("detalle-curso")) {
      const curso = cursosGlobal.find((c) => c.id == id);
      if (curso) {
        document.getElementById("detalleCursoLabel").textContent = curso.titulo;
        document.getElementById("detalleCursoBody").innerHTML = `
          <p><strong>${textos.categoria}:</strong> ${curso.categoria}</p>
          <p><strong>${textos.duracion}:</strong> ${curso.duracion} horas</p>
          <p><strong>${textos.descripcion}:</strong> ${
          curso.descripcion || "Sin descripción"
        }</p>
          <p><strong>${textos.estado}:</strong> ${
          curso.completado ? textos.completado : textos.pendiente
        }</p>
        `;
        new bootstrap.Modal(
          document.getElementById("detalleCursoModal")
        ).show();
      }
    }
  });

  formCurso.addEventListener("submit", agregarCurso);
  obtenerCursos();
  actualizarTextos();
});
