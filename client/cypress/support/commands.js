import '@testing-library/cypress/add-commands'

Cypress.Commands.add('clearDatabase', () => {
  cy.request('POST', 'http://localhost:4040/clearDatabase')
})

Cypress.Commands.add('seedDatabase', () => {
  cy.request('POST', 'http://localhost:4040/seedDatabase')
})

Cypress.Commands.add('login', () => {
  cy.setCookie('authenticated', 'TRUE')
})
