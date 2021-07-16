Cypress.Commands.add('getRecommendedKeyFilter', (key) => {
  cy.findByText('Recommended Key')
    .siblings()
    .findByText((content) => {
      const match = content.match(/^(\w) \(\d+\)$/)
      return match && match[1] === key
    })
})

describe('Home page', () => {
  beforeEach(() => {
    cy.seedDatabase()
    cy.visit('/')
  })

  it('loads, searches, and filters songs', () => {
    cy.findByText('Recommended Key').should('exist')
    cy.findByText('6 songs').should('exist')
    cy.findByText('Blessed Be Your Name').should('exist')
    cy.findByText('Build My Life').should('exist')
    cy.findByText('Ever Be').should('exist')
    cy.findByText('Jireh').should('exist')
    cy.findByText('Great Are You Lord').should('exist')
    cy.findByText('Man of Your Word').should('exist')

    // Add filter for key of A
    cy.getRecommendedKeyFilter('A').click()
    cy.findByText('2 songs').should('exist')
    cy.findByText('Blessed Be Your Name').should('exist')
    cy.findByText('Build My Life').should('not.exist')
    cy.findByText('Ever Be').should('not.exist')
    cy.findByText('Jireh').should('exist')
    cy.findByText('Great Are You Lord').should('not.exist')
    cy.findByText('Man of Your Word').should('not.exist')

    // Remove filter for key of A
    cy.getRecommendedKeyFilter('A').click()
    cy.findByText('6 songs').should('exist')
    cy.findByText('Blessed Be Your Name').should('exist')
    cy.findByText('Build My Life').should('exist')
    cy.findByText('Ever Be').should('exist')
    cy.findByText('Jireh').should('exist')
    cy.findByText('Great Are You Lord').should('exist')
    cy.findByText('Man of Your Word').should('exist')

    // Add filter for key of E
    cy.getRecommendedKeyFilter('E').click()
    cy.findByText('2 songs').should('exist')
    cy.findByText('Blessed Be Your Name').should('not.exist')
    cy.findByText('Build My Life').should('exist')
    cy.findByText('Ever Be').should('exist')
    cy.findByText('Jireh').should('not.exist')
    cy.findByText('Great Are You Lord').should('not.exist')
    cy.findByText('Man of Your Word').should('not.exist')

    // Search with filter
    cy.get('input[name=search]').type('Build My Life{enter}')
    cy.findByText('1 song').should('exist')
    cy.findByText('Blessed Be Your Name').should('not.exist')
    cy.findByText('Build My Life').should('exist')
    cy.findByText('Ever Be').should('not.exist')
    cy.findByText('Jireh').should('not.exist')
    cy.findByText('Great Are You Lord').should('not.exist')
    cy.findByText('Man of Your Word').should('not.exist')
  })

  it('persists filters', () => {
    cy.getRecommendedKeyFilter('A').click()
    cy.getRecommendedKeyFilter('A').should('have.class', 'active')
    cy.findByText('2 songs').should('exist')
    cy.findByText('Blessed Be Your Name').should('exist')
    cy.findByText('Build My Life').should('not.exist')
    cy.findByText('Ever Be').should('not.exist')
    cy.findByText('Jireh').should('exist')
    cy.findByText('Great Are You Lord').should('not.exist')
    cy.findByText('Man of Your Word').should('not.exist')

    cy.reload()
    cy.getRecommendedKeyFilter('A').should('have.class', 'active')
    cy.findByText('2 songs').should('exist')
    cy.findByText('Blessed Be Your Name').should('exist')
    cy.findByText('Build My Life').should('not.exist')
    cy.findByText('Ever Be').should('not.exist')
    cy.findByText('Jireh').should('exist')
    cy.findByText('Great Are You Lord').should('not.exist')
    cy.findByText('Man of Your Word').should('not.exist')
  })

  it('persists search', () => {
    cy.get('input[name=search]')
      .as('searchBar')
      .type('Blessed Be Your Name{enter}')
    cy.get('@searchBar').should('have.value', 'Blessed Be Your Name')
    cy.findByText('1 song').should('exist')
    cy.findByText('Blessed Be Your Name').should('exist')
    cy.findByText('Build My Life').should('not.exist')
    cy.findByText('Ever Be').should('not.exist')
    cy.findByText('Great Are You Lord').should('not.exist')

    cy.reload()
    cy.get('@searchBar').should('have.value', 'Blessed Be Your Name')
    cy.findByText('1 song').should('exist')
    cy.findByText('Blessed Be Your Name').should('exist')
    cy.findByText('Build My Life').should('not.exist')
    cy.findByText('Ever Be').should('not.exist')
    cy.findByText('Great Are You Lord').should('not.exist')
  })

  describe('Add song link', () => {
    it('is not visible when not logged in', () => {
      cy.findByText('Add Song').should('not.exist')
    })

    it('is visible + clickable when logged in', () => {
      cy.login()
      cy.reload()
      cy.findByText('Add Song').should('exist').click()
      cy.location('pathname').should('equal', '/add-song')
    })
  })

  describe('Song row', () => {
    it('contains a clickable song title', () => {
      cy.findByText('Blessed Be Your Name').click()
      cy.location('pathname').should('equal', '/song/blessed-be-your-name')
    })

    describe('Edit song icon', () => {
      it('is not visible when not logged in', () => {
        cy.findAllByTestId('icon-edit').should('not.exist')
      })

      it('is visible + clickable when logged in', () => {
        cy.login()
        cy.reload()
        cy.get('input[name=search]').type('Blessed Be Your Name{enter}')
        cy.findByTestId('icon-edit').should('exist').click()
        cy.location('pathname').should(
          'equal',
          '/song/blessed-be-your-name/edit',
        )
      })
    })
  })
})
