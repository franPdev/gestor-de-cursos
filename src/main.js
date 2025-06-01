window.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'http://localhost:3000/cursos';

  const listaCursos = document.getElementById('lista-cursos');
  const formCurso = document.getElementById('form-curso');
  const cursoModalEl = document.getElementById('cursoModal');
  const cursoModal = new bootstrap.Modal(cursoModalEl);
  let cursoEditadoId = null; 

  // Mostrar los cursos en la lista
  async function obtenerCursos() {
    const res = await fetch(API_URL);
    const data = await res.json();

    listaCursos.innerHTML = ''; // limpiar la lista antes de mostrar

    data.forEach(curso => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <div>
          <strong>${curso.titulo}</strong> - ${curso.duracion}h 
          <span class="badge bg-secondary">${curso.categoria}</span>
          ${curso.completado ? '<span class="badge bg-success ms-2">Completado</span>' : '<span class="badge bg-warning text-dark ms-2">Pendiente</span>'}
        </div>
        <div>
          <button data-id="${curso.id}" class="btn btn-sm btn-danger me-2 btn-eliminar">🗑️</button>
          <button data-id="${curso.id}" class="btn btn-sm btn-outline-primary btn-editar">✏️</button>
        </div>
      `;
      listaCursos.appendChild(li);
    });
  }

  // Agregar o editar un curso




  async function agregarCurso(e) {
    e.preventDefault();

    const nuevoCurso = {
      titulo: document.getElementById('titulo').value.trim(),
      duracion: Number(document.getElementById('duracion').value),
      categoria: document.getElementById('categoria').value,
      completado: document.getElementById('completado').checked
    };

    // Validación simple
    if (!nuevoCurso.titulo || !nuevoCurso.duracion || !nuevoCurso.categoria) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (cursoEditadoId) {
      // Editar curso existente
      await fetch(`${API_URL}/${cursoEditadoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoCurso)
      });
      cursoEditadoId = null;
    } else {
      // Crear curso nuevo
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoCurso)
      });
    }

    formCurso.reset();
    cursoEditadoId = null;

    document.getElementById('cursoModalLabel').textContent = 'Agregar Curso';


    obtenerCursos();

   cursoModal.hide();
  }

  // Manejar clicks en la lista (delegación de eventos)
  listaCursos.addEventListener('click', async (e) => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains('btn-eliminar')) {
      // Eliminar curso
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      obtenerCursos();
    }

    if (e.target.classList.contains('btn-editar')) {
      // Editar curso: cargar datos en formulario y guardar id para editar
      const res = await fetch(`${API_URL}/${id}`);
      const curso = await res.json();

      document.getElementById('titulo').value = curso.titulo;
      document.getElementById('duracion').value = curso.duracion;
      document.getElementById('categoria').value = curso.categoria;
      document.getElementById('completado').checked = curso.completado;

      document.getElementById('cursoModalLabel').textContent = 'Editar Curso';
      cursoModal.show();

      cursoEditadoId = id;
    }
  });

  // Eventos
  formCurso.addEventListener('submit', agregarCurso);

  // Al iniciar, cargar la lista de cursos
  obtenerCursos();
});
