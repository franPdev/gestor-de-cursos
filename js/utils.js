function ordenarCursosPorTitulo(lista, orden = "asc") {
  return [...lista].sort((a, b) =>
    orden === "asc"
      ? a.titulo.localeCompare(b.titulo)
      : b.titulo.localeCompare(a.titulo)
  );
}

module.exports = { ordenarCursosPorTitulo };