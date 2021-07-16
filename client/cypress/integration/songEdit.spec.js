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
    cy.findByLabelText('Artist').should('have.value', 'Matt Redman')
    cy.findByLabelText('Recommended Key').should('have.value', 'A')
    cy.findDropdownByLabelText('Time Signature').should('have.text', '4/4')
    cy.findByLabelText('BPM').should('have.value', 140)

    // edit some fields
    cy.findByLabelText('Recommended Key').clear().type('D')
    cy.findByLabelText('BPM').clear().type(200)
    cy.findByText('Submit').click()

    // TODO: add more assertions that 'song details' page shows new info
  })

  it('immediately uses new slug', () => {
    cy.findByLabelText('Slug').clear().type('foo')
    cy.findByText('Submit').click()

    // should go to song page, with new slug
    cy.location('pathname').should('equal', '/song/foo')

    // home page should show new information
    cy.findByTestId('home-logo').click()
    cy.findByText('Blessed Be Your Name').should(
      'have.attr',
      'href',
      '/song/foo',
    )
  })

  it('shows new song title after editing', () => {
    cy.findByLabelText('Title').clear().type('New Foo Song')
    cy.findByText('Submit').click()

    cy.findByTestId('home-logo').click()
    cy.findByText('New Foo Song').should('exist')
  })

  it('shows new song artist after editing', () => {
    cy.findByLabelText('Artist').clear().type('New Foo Artist')
    cy.findByText('Submit').click()

    cy.findByTestId('home-logo').click()
    cy.findByText('New Foo Artist').should('exist')
  })
})
