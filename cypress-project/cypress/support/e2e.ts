// cypress/support/e2e.ts
// Global Cypress setup and configuration

// Import custom commands
import "./commands";

// Optional: Allure reporter support
// import '@mmisty/cypress-allure-adapter/support';

// Global before hook
before(() => {
  cy.log(" Cypress E2E Test Suite Starting");
});

// Global after hook
after(() => {
  cy.log(" Cypress E2E Test Suite Completed");
});

// Prevent uncaught exceptions from failing tests
Cypress.on("uncaught:exception", (err, _runnable) => {
  // Log the error but don't fail the test
  console.error("Uncaught exception:", err.message);
  return false;
});
