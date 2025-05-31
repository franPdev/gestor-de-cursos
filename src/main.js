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
    li.innerHTML = `
        ${curso.titulo} - ${curso.duracion}h [${curso.categoria}] ${curso.completado ? '✅' : '❌'}
        <button data-id="${curso.id}" class="btn-eliminar">🗑️</button>
    `;
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