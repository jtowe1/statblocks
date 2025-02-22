/// <reference types="cypress" />

// Add custom commands here
// Example:
// Cypress.Commands.add('login', (email, password) => { ... })

declare global {
  namespace Cypress {
    interface Chainable {
      // Add types for custom commands here
      // login(email: string, password: string): Chainable<void>
    }
  }
}

export {}