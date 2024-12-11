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
    this.getTask(index).dblclick();
    this.getTask(index).find("input.edit").clear().type(`${newName}{enter}`);
  }

  filterBy(filterName) {
    cy.get(".filters").contains(filterName).click();
  }

  reloadPage() {
    cy.reload();
  }
}

export const todoPage = new TodoPage();
