window.addEventListener('DOMContentLoaded', () => {

const API_URL = 'http://localhost:3000/cursos'

const listaCursos = document.getElementById('lista-cursos');
const formCurso = document.getElementById('form-curso');


//Mostrar los cursos

async function obtenerCursos() {
    const res = await fetch(API_URL);
    const data = await res.json();

    listaCursos.innerHTML = ''; //Limpiar la lista antes de mostrar los cursos
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
    `
   
    listaCursos.appendChild(li);
});


//Eliminar un curso
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', async () => {
            const id = boton.getAttribute('data-id');
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            obtenerCursos(); // Recargar la lista luego de eliminar
        });
    });

}

//Agregar un curso
async function agregarCurso(e) {
    e.preventDefault()

    const nuevoCurso = {
        titulo: document.getElementById('titulo').value,
        duracion: Number(document.getElementById('duracion').value),
        categoria: document.getElementById('categoria').value,
        completado: document.getElementById('completado').checked

}
 // Validación simple

 if (!nuevoCurso.titulo || !nuevoCurso.duracion || !nuevoCurso.categoria) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoCurso)
    });
    formCurso.reset(); //Limpiar el formulario
    obtenerCursos(); //Actualizar la lista de cursos
}

//Eventos
formCurso.addEventListener('submit', agregarCurso);

//Cargar los cursos al iniciar
obtenerCursos();

});