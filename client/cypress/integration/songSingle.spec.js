describe('Single song page', () => {
  beforeEach(() => {
    cy.seedDatabase()
    cy.visit('/song/blessed-be-your-name')
  })

  describe('Edit song link', () => {
    it('is not visible when not logged in', () => {
      cy.findByText('Edit').should('not.exist')
    })

    it('is visible + clickable when logged in', () => {
      cy.login()
      cy.reload()
      cy.findByText('Edit').should('exist').click()
      cy.location('pathname').should('equal', '/song/blessed-be-your-name/edit')
    })
  })
})
