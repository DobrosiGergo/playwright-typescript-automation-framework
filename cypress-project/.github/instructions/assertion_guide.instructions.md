---
applyTo: '**'
---

# Cypress Assertion & Validation Guide

## Purpose

This guide defines best practices for assertions and validations in Cypress UI and API automation.

**Always consult this guide before writing or reviewing assertions in tests.**

---

## Principles

- **No False Positives:** All assertions must accurately reflect the intended outcome
- **Use Cypress Assertions:** Use `should()` and `expect()` (Chai assertions)
- **Implicit Assertions:** Leverage Cypress's built-in retry-ability
- **Multiple Assertions:** Chain assertions with `.should()` or use `.and()`
- **Expressive & Clear:** Assertions should clearly state what is being validated

---

## Cypress Assertion Patterns

### UI Assertions (should)

\\\ ypescript
// Good: Cypress auto-retries until assertion passes
cy.get('[data-cy="username"]').should('be.visible');
cy.get('[data-cy="email"]').should('have.value', 'test@example.com');

// Chain multiple assertions
cy.get('[data-cy="button"]')
.should('be.visible')
.and('be.enabled')
.and('have.text', 'Submit');

// Use contains for text matching
cy.contains('Welcome').should('be.visible');
\\\

### API Assertions (expect)

\\\ ypescript
// API response validation
cy.request('/api/user').then((response) => {
expect(response.status).to.eq(200);
expect(response.body).to.have.property('user');
expect(response.body.user.email).to.eq('test@example.com');
});
\\\

### Multiple Assertions Pattern

**Unlike Playwright's soft assertions, Cypress assertions are synchronous and will fail immediately.**

For comprehensive validation:

\\\ ypescript
// Multiple property checks
cy.request('/api/user').then((response) => {
expect(response.status).to.eq(200); // Will fail if not 200
expect(response.body.user).to.deep.include({
email: 'test@example.com',
name: 'Test User',
active: true
});
});

// UI multi-checks
cy.get('[data-cy="product-card"]')
.should('be.visible')
.and('contain', 'Product Name')
.and('have.attr', 'data-available', 'true');
\\\

---

## Common Cypress Assertions

### Existence & Visibility

\\\ ypescript
cy.get(selector).should('exist');
cy.get(selector).should('be.visible');
cy.get(selector).should('not.exist');
cy.get(selector).should('be.hidden');
\\\

### State Assertions

\\\ ypescript
cy.get(selector).should('be.enabled');
cy.get(selector).should('be.disabled');
cy.get(selector).should('be.checked');
cy.get(selector).should('have.class', 'active');
\\\

### Content Assertions

\\\ ypescript
cy.get(selector).should('have.text', 'Expected Text');
cy.get(selector).should('contain', 'Partial Text');
cy.get(selector).should('have.value', 'input value');
cy.get(selector).should('have.attr', 'href', '/path');
\\\

### Length & Count

\\\ ypescript
cy.get('[data-cy=\"item\"]').should('have.length', 5);
cy.get('[data-cy=\"list\"]').children().should('have.length.gt', 0);
\\\

---

## Anti-Patterns to Avoid

\\\ ypescript
// Don't use arbitrary waits
cy.wait(5000); // Use proper assertions instead

// Don't use expect without .then()
cy.get(selector).expect(value).to.eq(123); // Wrong

// Correct way
cy.get(selector).invoke('val').should('eq', '123');

// Don't over-assert
cy.get(selector).should('exist').should('be.visible'); // Redundant
cy.get(selector).should('be.visible'); // Implies existence

// Playwright soft assertion pattern (doesn't exist in Cypress)
// expect.soft() // Not available in Cypress
\\\

---

## API Testing Assertions

\\\ ypescript
// Full API validation
cy.request({
method: 'POST',
url: '/api/users',
body: userData,
}).then((response) => {
// Status assertion
expect(response.status).to.eq(201);

// Response structure
expect(response.body).to.have.property('id');
expect(response.body).to.have.property('email');

// Value assertions
expect(response.body.email).to.eq(userData.email);
expect(response.body.name).to.eq(userData.name);
});
\\\

---

## Retry-ability

Cypress automatically retries assertions until they pass or timeout:

\\\ ypescript
// Will retry until element is visible (default 4s timeout)
cy.get('[data-cy=\"loading\"]').should('not.be.visible');
cy.get('[data-cy=\"content\"]').should('be.visible');

// Custom timeout
cy.get('[data-cy=\"slow-load\"]', { timeout: 10000 }).should('be.visible');
\\\

---

## Checklist for Reviewers

- [ ] Are UI assertions using `.should()` for auto-retry?
- [ ] Are API assertions using `expect()` inside `.then()`?
- [ ] Are arbitrary `cy.wait()` calls avoided?
- [ ] Are assertion messages clear?
- [ ] Is Cypress's retry-ability properly leveraged?
- [ ] Are redundant assertions removed?

---

## References

- [Cypress Assertions](https://docs.cypress.io/guides/references/assertions)
- [Chai Assertions](https://www.chaijs.com/api/bdd/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)

---

**Reference this guide before writing assertions. Reliable assertions ensure trustworthy automation!**
