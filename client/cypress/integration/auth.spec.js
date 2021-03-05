describe('Authentication', () => {
  it('lets a user log in', () => {
    cy.visit('/')
    cy.findByText('Login', { selector: 'a' }).click()

    cy.findByLabelText('Username').type('testuser')
    cy.findByLabelText('Password').type('password')
    cy.findByText('Login', { selector: 'button' }).click()

    cy.findByText('Dashboard').should('exist')
    cy.location('pathname').should('equal', '/')
  })

  it('lets a user log in after a failed log in', () => {
    cy.visit('/')
    cy.findByText('Login', { selector: 'a' }).click()

    cy.findByLabelText('Username').type('testuser')
    cy.findByLabelText('Password').type('wrong-password')
    cy.findByText('Login', { selector: 'button' }).click()

    cy.findByText('Dashboard').should('not.exist')

    cy.findByLabelText('Password').clear().type('password')
    cy.findByText('Login', { selector: 'button' }).click()

    cy.findByText('Dashboard').should('exist')
    cy.location('pathname').should('equal', '/')
  })
})
