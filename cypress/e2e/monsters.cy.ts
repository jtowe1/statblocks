describe('Monster App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('loads the initial page', () => {
    cy.get('input[placeholder="Search monsters..."]').should('exist')
    cy.get('button').contains('Create Monster').should('exist')
  })

  it('can search for monsters', () => {
    cy.get('input[placeholder="Search monsters..."]').type('orc')
    // Wait for search results
    cy.get('.grid').children().should('have.length.gt', 0)
  })

  it('can select and deselect monsters', () => {
    // Select first monster
    cy.get('.grid > div:first-child input[type="checkbox"]').click()

    // Wait for the selected monsters list to update
    cy.contains('Selected Monsters')
      .parent()
      .parent()  // Go up one more level to find the container
      .find('ul')  // Find the ul that contains the list items
      .find('li')  // Then find the li elements
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
    // Select first monster
    cy.get('.grid > div:first-child input[type="checkbox"]').click()
    cy.get('button[title="Print Selected Monsters"]').should('exist')
  })

  it('toggles image display', () => {
    // Target the label containing "Show Images"
    cy.get('label').contains('Show Images')
      .find('input[type="checkbox"]').click()

    // If there are monsters with images, they should be visible
    cy.get('.grid').find('img').should('exist')
  })
})