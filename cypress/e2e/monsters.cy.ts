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

  it('can select and deselect monsters', () => {
    // Wait for monsters to load and select first one
    cy.get('.grid').children().first().within(() => {
      cy.get('input[type="checkbox"]').click()
    })

    // Wait for the selected monsters list to update
    cy.contains('Selected Monsters')
      .parent()
      .parent()
      .find('ul')
      .find('li')
      .should('have.length', 1)

    // Deselect using X button
    cy.contains('Selected Monsters')
      .parent()
      .parent()
      .find('button')
      .contains('×')
      .click()

    // Verify no monsters selected
    cy.contains('No monsters selected').should('exist')
  })

  it('shows print button when monsters are selected', () => {
    // Wait for monsters to load and select first one
    cy.get('.grid').children().first().within(() => {
      cy.get('input[type="checkbox"]').click()
    })
    cy.get('button[title="Print Selected Monsters"]').should('exist')
  })

  it('toggles image display', () => {
    // Target the label containing "Show Images"
    cy.get('label').contains('Show Images')
      .find('input[type="checkbox"]').click()

    // Wait for monsters and then check for images
    cy.get('.grid').children().should('have.length.gt', 0)
    cy.get('.grid').find('.monster-image-container').should('exist')
  })
})