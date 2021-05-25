describe('Add song', () => {
  it('can add a song', () => {
    cy.login()
    cy.visit('/')
    cy.findByText('Blessed Be Your Name').should('not.exist')
    cy.findByText('Add Song').click()

    cy.findByLabelText('Title').type('Blessed Be Your Name')
    cy.findByLabelText('Recommended Key').type('A')
    cy.findByLabelText('Time Signature').click()
    cy.findByText('3/4').click()
    cy.findByLabelText('BPM').type(140)
    cy.findByText('Submit').click()

    cy.location('pathname').should('equal', '/')
    cy.findByText('Blessed Be Your Name').should('exist')
    cy.findByText('A (1)').should('exist')
    cy.findByText('140 (1)').should('exist')
    cy.findByText('3/4 (1)').should('exist')
  })
})
