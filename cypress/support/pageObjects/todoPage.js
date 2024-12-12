export class TodoPage {
  visit() {
    cy.visit("https://todomvc.com/examples/react/dist/#/");
  }

  addTask(taskName) {
    cy.get(".new-todo").type(`${taskName}{enter}`);
  }

  getTasks() {
    return cy.get(".todo-list li");
  }

  getTask(index) {
    return cy.get(".todo-list li").eq(index);
  }

  toggleTask(index) {
    this.getTask(index).find(".toggle").click();
  }

  deleteTask(index) {
    this.getTask(index).find(".destroy").click({ force: true });
  }

  editTask(index, newName) {
    this.getTask(index).dblclick(); // Hacer doble click para activar la edición
    cy.focused().clear().type(`${newName}{enter}`); // Asegurarse de que el input está enfocado antes de editar
  }  

  filterBy(filterName) {
    cy.get(".filters").contains(filterName).click();
  }

  reloadPage() {
    cy.reload();
  }
}

export const todoPage = new TodoPage();
