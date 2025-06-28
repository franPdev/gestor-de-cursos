const { ordenarCursosPorTitulo } = require("./utils");

describe("ordenarCursosPorTitulo", () => {
  const cursos = [
    { titulo: "React" },
    { titulo: "Angular" },
    { titulo: "Vue" }
  ];

  test("ordena ascendente", () => {
    const resultado = ordenarCursosPorTitulo(cursos, "asc");
    expect(resultado[0].titulo).toBe("Angular");
    expect(resultado[1].titulo).toBe("React");
    expect(resultado[2].titulo).toBe("Vue");
  });

  test("ordena descendente", () => {
    const resultado = ordenarCursosPorTitulo(cursos, "desc");
    expect(resultado[0].titulo).toBe("Vue");
    expect(resultado[2].titulo).toBe("Angular");
  });
});