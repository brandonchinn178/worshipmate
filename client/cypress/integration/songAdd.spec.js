describe('Add song', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/add-song')
  })

  it('requires login', () => {
    cy.logout()
    cy.reload()
    cy.location('pathname').should('equal', '/login')
  })

  it('can add a song', () => {
    cy.findByLabelText('Title').type('Blessed Be Your Name')
    cy.findByLabelText('Recommended Key').type('A')
    cy.findDropdownByLabelText('Time Signature').click()
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
