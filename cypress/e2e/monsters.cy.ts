describe('Monster App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    // Wait for the initial data load and grid to be populated
    cy.get('.grid', { timeout: 10000 }).should('exist')
    cy.get('.grid').children().should('have.length.gt', 0)
    // Wait for at least one monster name to be visible
    cy.get('.grid h1').should('have.length.gt', 0)
  })

  it('loads the initial page', () => {
    cy.get('input[placeholder="Search monsters..."]').should('exist')
    cy.get('button').contains('Create Monster').should('exist')
  })

  it('can search for monsters', () => {
    // Get a monster name from the statblock title
    cy.get('.grid h1').first().invoke('text').then((name) => {
      // Take first 3 characters of the name to search
      const searchTerm = name.slice(0, 3).toLowerCase()

      // Type the search term
      cy.get('input[placeholder="Search monsters..."]').type(searchTerm)

      // Wait for filtered results and verify they contain the search term
      cy.get('.grid').children().should('exist')
      cy.get('.grid h1').each(($el) => {
        expect($el.text().toLowerCase()).to.include(searchTerm)
      })
    })
  })

  it('toggles image display', () => {
    // Target the label containing "Show Images"
    cy.get('label').contains('Show Images')
      .find('input[type="checkbox"]').click()

    // Wait for monsters and then check for images
    cy.get('.grid').children().should('have.length.gt', 0)
    cy.get('.grid').find('.monster-image-container').should('exist')
  })

  it('can create a new monster and close the modal', () => {
    // Set up the intercept before any actions
    cy.intercept('POST', '/api/monsters').as('createMonster')

    // Click create monster button in the sidebar
    cy.contains('button', 'Create Monster').click()

    // Verify modal is visible
    cy.get('.fixed.inset-0').should('exist')

    // Fill out required fields
    const uniqueName = `Test Monster ${Date.now()}`
    cy.get('input[name="name"]').type(uniqueName)
    cy.get('input[name="meta"]').type('Medium humanoid, neutral evil')
    cy.get('input[name="ArmorClass"]').type('15')
    cy.get('input[name="HitPoints"]').type('20')
    cy.get('input[name="Speed"]').type('30 ft.')
    cy.get('input[name="STR"]').type('16')
    cy.get('input[name="DEX"]').type('14')
    cy.get('input[name="CON"]').type('14')
    cy.get('input[name="INT"]').type('10')
    cy.get('input[name="WIS"]').type('10')
    cy.get('input[name="CHA"]').type('10')
    cy.get('input[name="Challenge"]').type('1')

    // Submit the form by clicking the submit button
    cy.get('form').submit()

    // Wait for the POST request to complete
    cy.wait('@createMonster')

    // Verify modal is gone
    cy.get('.fixed.inset-0').should('not.exist')
  })
})