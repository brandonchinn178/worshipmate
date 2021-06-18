describe('Edit song', () => {
  beforeEach(() => {
    cy.seedDatabase()
    cy.login()
    cy.visit('/song/blessed-be-your-name/edit')
  })

  it('requires login', () => {
    cy.logout()
    cy.reload()
    cy.location('pathname').should('equal', '/login')
  })

  it('can edit a song', () => {
    // all fields should be populated
    cy.findByLabelText('Slug').should('have.value', 'blessed-be-your-name')
    cy.findByLabelText('Title').should('have.value', 'Blessed Be Your Name')
    cy.findByLabelText('Recommended Key').should('have.value', 'A')
    cy.findDropdownByLabelText('Time Signature').should('have.text', '4/4')
    cy.findByLabelText('BPM').should('have.value', 140)

    // edit some fields
    cy.findByLabelText('Slug').clear().type('foo')
    cy.findByLabelText('Title').clear().type('New Foo Song')
    cy.findByText('Submit').click()

    // should go to song page, with new slug
    cy.location('pathname').should('equal', '/song/foo')

    // home page should show new information
    cy.findByText('Back to song list').click()
    cy.location('pathname').should('equal', '/')
    cy.findByText('New Foo Song')
      .should('exist')
      .and('have.attr', 'href', '/song/foo')
  })
})
