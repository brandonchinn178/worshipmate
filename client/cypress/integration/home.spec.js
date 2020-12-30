Cypress.Commands.add('getRecommendedKeyFilter', (key) => {
  cy.findByText('Recommended Key')
    .siblings()
    .findByText((content) => {
      const match = content.match(/^(\w) \(\d+\)$/)
      return match && match[1] === key
    })
})

describe('Home page', () => {
  beforeEach(cy.seedDatabase)

  it('loads, searches, and filters songs', () => {
    cy.visit('/')
    cy.findByText('Recommended Key').should('exist')
    cy.findByText('4 songs').should('exist')
    cy.findByText('Blessed Be Your Name').should('exist')
    cy.findByText('Build My Life').should('exist')
    cy.findByText('Ever Be').should('exist')
    cy.findByText('Great Are You Lord').should('exist')

    // Add filter for key of A
    cy.getRecommendedKeyFilter('A').click()
    cy.findByText('1 song').should('exist')
    cy.findByText('Blessed Be Your Name').should('exist')
    cy.findByText('Build My Life').should('not.exist')
    cy.findByText('Ever Be').should('not.exist')
    cy.findByText('Great Are You Lord').should('not.exist')

    // Remove filter for key of A
    cy.getRecommendedKeyFilter('A').click()
    cy.findByText('4 songs').should('exist')
    cy.findByText('Blessed Be Your Name').should('exist')
    cy.findByText('Build My Life').should('exist')
    cy.findByText('Ever Be').should('exist')
    cy.findByText('Great Are You Lord').should('exist')

    // Add filter for key of E
    cy.getRecommendedKeyFilter('E').click()
    cy.findByText('2 songs').should('exist')
    cy.findByText('Blessed Be Your Name').should('not.exist')
    cy.findByText('Build My Life').should('exist')
    cy.findByText('Ever Be').should('exist')
    cy.findByText('Great Are You Lord').should('not.exist')

    // Search with filter
    cy.get('input[name=search]').type('Build My Life{enter}')
    cy.findByText('1 song').should('exist')
    cy.findByText('Blessed Be Your Name').should('not.exist')
    cy.findByText('Build My Life').should('exist')
    cy.findByText('Ever Be').should('not.exist')
    cy.findByText('Great Are You Lord').should('not.exist')
  })
})
