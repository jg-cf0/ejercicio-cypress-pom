import { todoPage } from "../support/pageObjects/todoPage.js"; // Importamos todoPage de la carpeta especificada

describe("Pruebas Cypress con Page Object Model", () => {
  beforeEach(() => {
    todoPage.visit();
  });

  it("Crear tarea", () => {
    todoPage.addTask("Tarea 1");
    todoPage
      .getTasks()
      .should("have.length", 1)
      .first()
      .should("contain.text", "Tarea 1");
  });

  it("Marcar tarea como completada", () => {
    todoPage.addTask("Tarea a completar");
    todoPage.toggleTask(0);
    todoPage.getTask(0).should("have.class", "completed");
  });

  it("Desmarcar tarea como completada", () => {
    todoPage.addTask("Tarea a desmarcar");
    todoPage.toggleTask(0); // Marcar como completada
    todoPage.toggleTask(0); // Desmarcar
    todoPage.getTask(0).should("not.have.class", "completed");
  });

  it("Editar tarea", () => {
    todoPage.addTask("Tarea editable");
    todoPage.editTask(0, "Tarea editada");
    todoPage.getTask(0).should("contain.text", "Tarea editada");
  });

  it("Borrar una tarea", () => {
    todoPage.addTask("Tarea a borrar");
    todoPage.deleteTask(0);
    todoPage.getTasks().should("have.length", 0);
  });

  it("Filtrar tareas alternando entre All, Active, Completed", () => {
    todoPage.addTask("Tarea 1");
    todoPage.addTask("Tarea 2");
    todoPage.toggleTask(0); // Completar "Tarea 1"

    todoPage.filterBy("All");
    todoPage.getTasks().should("have.length", 2);

    todoPage.filterBy("Active");
    todoPage
      .getTasks()
      .should("have.length", 1)
      .first()
      .should("contain.text", "Tarea 2");

    todoPage.filterBy("Completed");
    todoPage
      .getTasks()
      .should("have.length", 1)
      .first()
      .should("contain.text", "Tarea 1");

    todoPage.filterBy("All");
    todoPage.getTasks().should("have.length", 2);
  });

  it("Añadir tarea con un solo carácter", () => {
    todoPage.addTask("a");
    todoPage
      .getTasks()
      .should("have.length", 1)
      .first()
      .should("contain.text", "a");
  });

  it("Añadir tarea con espacios antes del texto", () => {
    todoPage.addTask("      texto");
    todoPage
      .getTasks()
      .should("have.length", 1)
      .first()
      .should("contain.text", "      texto");
  });

  it("Añadir tarea que contenga caracteres especiales", () => {
    const caracteresEspec = "!@#$%^&*()_+[]{}|;:',.<>?/`~";
    todoPage.addTask(caracteresEspec);
    todoPage
      .getTasks()
      .should("have.length", 1)
      .first()
      .should("contain.text", caracteresEspec);
  });

  it("Crear tarea duplicada", () => {
    const duplicada = "Tarea duplicada";
    todoPage.addTask(duplicada);
    todoPage.addTask(duplicada);
    todoPage
      .getTasks()
      .should("have.length", 2)
      .each((task) => {
        cy.wrap(task).should("contain.text", duplicada);
      });
  });

  it("Mantener tareas al recargar página", () => {
    todoPage.addTask("Tarea 1");
    todoPage.addTask("Tarea 2");
    todoPage.addTask("Tarea 3");

    todoPage.getTasks().should("have.length", 3);
    todoPage.reloadPage();
    todoPage.getTasks().should("have.length", 3);
  });

  it("Añadir tarea con caracteres específicos de varios idiomas", () => {
    const multilenguaje =
      "Tarea con acentos áéíóú y caracteres especiales ñçªº";
    todoPage.addTask(multilenguaje);
    todoPage
      .getTasks()
      .should("have.length", 1)
      .first()
      .should("contain.text", multilenguaje);
  });

  it("Añadir una tarea con texto extremadamente largo", () => {
    const textoLargo = "x".repeat(1000);
    todoPage.addTask(textoLargo);
    todoPage
      .getTasks()
      .should("have.length", 1)
      .first()
      .should("contain.text", textoLargo);
  });

  it("Añadir 500 tareas", () => {
    const numTareas = 500;
    for (let i = 1; i <= numTareas; i++) {
      todoPage.addTask(`Tarea ${i}`);
    }
    todoPage.getTasks().should("have.length", numTareas);
    todoPage.getTask(0).should("contain.text", "Tarea 1");
    todoPage
      .getTask(numTareas - 1)
      .should("contain.text", `Tarea ${numTareas}`);
  });
});
