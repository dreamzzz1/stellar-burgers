Cypress.Commands.add('addIngredient', (name) => {
  cy.contains(name)
    .parent()
    .find('button')
    .click();
});

Cypress.Commands.add('mockIngredients', () => {
  cy.intercept('GET', '**/api/ingredients', {
    fixture: 'ingredients.json'
  }).as('getIngredients');
});