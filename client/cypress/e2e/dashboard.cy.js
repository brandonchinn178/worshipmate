describe('Dashboard', () => {
  it('can be accessed after logging in', () => {
    cy.login()
    cy.visit('/')
    cy.findByText('Dashboard').click()
    cy.findByText(/^Welcome/).should('exist')
    cy.location('pathname').should('equal', '/dashboard')
  })
})
