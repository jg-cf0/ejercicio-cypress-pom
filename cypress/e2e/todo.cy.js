describe("Pruebas Cypress", () => {
  beforeEach(() => {
    cy.visit("https://todomvc.com/examples/react/dist/#/"); // Visitamos la URL de la app antes de cada test
  });

  it("Crear tarea", () => {
    cy.get(".new-todo").type("Tarea 1{enter}"); // Introducimos tarea por texto
    cy.get(".todo-list li")
      .should("have.length", 1)
      .first()
      .should("contain.text", "Tarea 1"); // Verificar que la tarea se ha creado
  });

  it("Marcar tarea como completada", () => {
    cy.get(".new-todo").type("Tarea a completar{enter}"); // Agregar una tarea
    cy.get(".todo-list li") // Seleccionar la tarea agregada
      .first()
      .find(".toggle") // Buscar el botón de verificación
      .click(); // Hacer clic para marcar como completada
    cy.get(".todo-list li").first().should("have.class", "completed"); // Verificar que la tarea esté marcada como completada
  });

  it("Desmarcar tarea como completada", () => {
    cy.get(".new-todo").type("Tarea a desmarcar{enter}");
    cy.get(".todo-list li").first().find(".toggle").click(); // Marcar tarea como completada
    cy.get(".todo-list li").first().find(".toggle").click(); // Desmarcar tarea
    cy.get(".todo-list li").first().should("not.have.class", "completed"); // Verificar que la tarea ya no está completada
  });

  it("Editar tarea", () => {
    cy.get(".new-todo").type("Tarea editable{enter}"); // Agregar una tarea
    cy.get(".todo-list li").first().dblclick(); // Hacer doble clic sobre la tarea para editar
    cy.get(".todo-list li")
      .first()
      .find("input") // Buscar el campo de entrada para editar
      .clear()
      .type("Tarea editada{enter}"); // Borrar y escribir el nuevo texto
    cy.get(".todo-list li")
      .first() // Verificar que la tarea se haya editado
      .should("contain.text", "Tarea editada");
  });

  it("Borrar una tarea", () => {
    cy.get(".new-todo").type("Tarea a borrar{enter}"); // Agregar una tarea
    cy.get(".todo-list li")
      .first()
      .find(".destroy") // Buscar el botón de eliminar
      .click({ force: true }); // Eliminar la tarea (force es necesario para hacer clic en elementos ocultos)
    cy.get(".todo-list li") // Verificar que la tarea haya sido eliminada
      .should("have.length", 0);
  });

  it("Filtrar tareas alternando entre All, Active, Completed", () => {
    // Agregar tareas con diferentes estados
    cy.get(".new-todo").type("Tarea 1{enter}"); // Agregar la primera tarea
    cy.get(".new-todo").type("Tarea 2{enter}"); // Agregar la segunda tarea
    cy.get(".todo-list li").first().find(".toggle").click(); // Marcar la primera tarea como completada

    // Verificar que todas las tareas se muestran al inicio (All)
    cy.get(".filters").contains("All").click(); // Hacer clic en el botón "All"
    cy.get(".todo-list li").should("have.length", 2); // Verificar que se muestren las 2 tareas

    // Filtrar tareas activas (Active)
    cy.get(".filters").contains("Active").click(); // Hacer clic en el botón "Active"
    cy.get(".todo-list li").should("have.length", 1); // Verificar que solo haya 1 tarea no completada
    cy.get(".todo-list li").first().should("contain.text", "Tarea 2"); // Verificar que es "Tarea 2"

    // Filtrar tareas completadas (Completed)
    cy.get(".filters").contains("Completed").click(); // Hacer clic en el botón "Completed"
    cy.get(".todo-list li").should("have.length", 1); // Verificar que solo haya 1 tarea completada
    cy.get(".todo-list li").first().should("contain.text", "Tarea 1"); // Verificar que es "Tarea 1"

    // Volver a mostrar todas las tareas (All)
    cy.get(".filters").contains("All").click(); // Hacer clic en el botón "All"
    cy.get(".todo-list li").should("have.length", 2); // Verificar que se muestran las 2 tareas
  });

  it("Añadir tarea con un solo carácter", () => {
    cy.get(".new-todo").type("a{enter}"); // Introducimos tarea de un solo caracter
    cy.get(".todo-list li")
      .should("have.length", 1)
      .first()
      .should("contain.text", "a"); // Verificar que la tarea se ha creado
  });

  it("Añadir tarea con espacios antes del texto", () => {
    cy.get(".new-todo").type("      texto{enter}"); // Introducimos tarea de un solo caracter
    cy.get(".todo-list li")
      .should("have.length", 1)
      .first()
      .should("contain.text", "      texto"); // Verificar que la tarea se ha creado
  });

  it("Añadir tarea que contenga caracteres especiales", () => {
    // Cadena con caracteres especiales para introducirlo en el texto
    const caracteresEspec = "!@#$%^&*()_+[]{}|;:',.<>?/`~";

    cy.get(".new-todo").type(`${caracteresEspec}{enter}`); // Introducimos caracteres especiales y presionar Enter
    cy.get(".todo-list li") // Seleccionamos la lista de tareas
      .should("have.length", 1) // Verifica que se haya agregado una tarea
      .first()
      .should("contain.text", caracteresEspec); // Verifica que el texto de la tarea es igual al introducido
  });

  it("Crear tarea duplicada", () => {
    // Nombre de la tarea duplicada
    const duplicada = "Tarea duplicada";

    // Agregar la tarea por primera vez
    cy.get(".new-todo").type(`${duplicada}{enter}`);

    // Agregar la misma tarea nuevamente
    cy.get(".new-todo").type(`${duplicada}{enter}`);

    // Verificar que se han creado exactamente dos tareas con el mismo nombre
    cy.get(".todo-list li").should("have.length", 2);
    cy.get(".todo-list li").each((task) => {
    cy.wrap(task).should("contain.text", duplicada);
    });
  });

  it("Mantener tareas al recargar página", () => {
    // Crear varias tareas
    cy.get(".new-todo").type("Tarea 1{enter}");
    cy.get(".new-todo").type("Tarea 2{enter}");
    cy.get(".new-todo").type("Tarea 3{enter}");

    // Verificar que las tareas están presentes
    cy.get(".todo-list li").should("have.length", 3);
    cy.get(".todo-list li").eq(0).should("contain.text", "Tarea 1");
    cy.get(".todo-list li").eq(1).should("contain.text", "Tarea 2");
    cy.get(".todo-list li").eq(2).should("contain.text", "Tarea 3");

    // Recargar la página
    cy.reload();

    // Verificar nuevamente que las tareas persisten tras la recarga
    cy.get(".todo-list li").should("have.length", 3);
    cy.get(".todo-list li").eq(0).should("contain.text", "Tarea 1");
    cy.get(".todo-list li").eq(1).should("contain.text", "Tarea 2");
    cy.get(".todo-list li").eq(2).should("contain.text", "Tarea 3");
  });

  it("Añadir tarea con caracteres específicos de varios idiomas", () => {
    // Texto con caracteres específicos de varios idiomas
    const multilenguaje =
      "Tarea con acentos áéíóú y caracteres especiales ñçªº";

    // Introducir el texto con caracteres especiales
    cy.get(".new-todo").type(`${multilenguaje}{enter}`);

    // Verificar que la tarea se agregó
    cy.get(".todo-list li").should("have.length", 1);

    // Verificar que el texto de la tarea coincide con el texto introducido
    cy.get(".todo-list li").first().should("contain.text", multilenguaje);
  });

  it("Añadir una tarea con texto extremadamente largo", () => {
    // Texto extremadamente largo
    const textoLargo = "x".repeat(1000);

    // Introducir el texto extremadamente largo
    cy.get(".new-todo").type(`${textoLargo}{enter}`);

    // Verificar que la tarea se agregó
    cy.get(".todo-list li").should("have.length", 1);

    // Verificar que el texto mostrado en la tarea es exactamente igual al texto introducido
    cy.get(".todo-list li").first().should("contain.text", textoLargo);
  });

  it("Añadir 500 tareas", () => {
    // Cantidad de tareas a añadir
    const numTareas = 500;
    for (let i = 1; i <= numTareas; i++) {
      cy.get(".new-todo").type(`Tarea ${i}{enter}`);
    }

    // Verificar que se han creado exactamente 1000 tareas
    cy.get(".todo-list li").should("have.length", numTareas);

    // Verificar que las primeras y últimas tareas tienen el texto correcto
    cy.get(".todo-list li").first().should("contain.text", "Tarea 1"); // Primera tarea
    cy.get(".todo-list li").last().should("contain.text", `Tarea ${numTareas}`); // Última tarea
  });
});
