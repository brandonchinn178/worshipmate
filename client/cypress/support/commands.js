import '@testing-library/cypress/add-commands'

Cypress.Commands.add('clearDatabase', () => {
  cy.task('clearDatabase')
})

Cypress.Commands.add('seedDatabase', () => {
  cy.task('seedDatabase')
})
