---
applyTo: '**'
---

# Cypress Locator Strategy & Selector Patterns Guide

## Purpose

This guide defines best practices for selecting elements in Cypress-based UI automation.  
It is referenced by Copilot and reviewers to ensure selectors are robust, maintainable, and consistent across the codebase.

**Always consult this guide before creating, updating, or reviewing selectors in page objects, components, or tests.**

---

## Locator Strategy Principles

- **Centralize selectors:**  
  All selectors must be defined in page objects or components as private/protected properties, never directly in test specs.

- **Prefer semantic selectors:**  
   Use Cypress best practices for selector priority:
  1. data-cy, data-test, data-testid attributes (most stable)
  2. data-\* attributes that won't change
  3. Accessible ARIA attributes (ria-label,
     ole)
  4. Semantic HTML elements with unique attributes
  5. CSS selectors (only as last resort)

- **Fallback order:**  
  If no data attribute is available, use:
  1. Custom test attributes (data-cy='submit-button')
  2. ARIA attributes ([aria-label='Submit'])
  3. Text content (.contains('Submit'))
  4. CSS selectors (avoid nth-child, auto-generated classes)

- **Avoid anti-patterns:**
  - Never use auto-generated class names, random IDs, or nth-child selectors
  - Avoid long, deeply nested selector chains
  - Do not use inline selectors in test specs
  - Don't rely on visual position or styling

- **Parameterize dynamic selectors:**  
  Create methods that accept parameters to build dynamic selectors

- **Use cy.get() with clear selectors:**  
  Store selectors as private properties and reference them in methods

- **One selector per element:**  
  Define only one selector per element for clarity and maintainability

- **Follow DRY and KISS principles:**  
  Avoid duplication and keep selectors simple

---

## Selector Naming Conventions

- Use **camelCase** for selector properties in page objects/components
- Prefix selector properties with underscore: private \_submitButton = '[data-cy=\"submit-btn\"]';
- Name selectors after the element's purpose: \_loginButton, \_emailInput, \_cartItemList
- For parameterized selectors, use descriptive method names: getProductCard(name: string)

---

## Examples

### Good (Cypress Pattern)

\\\ ypescript
// In cypress/support/pages/home.page.ts
import { BasePage } from './base/basePage';

export class HomePage extends BasePage {
private \_searchInput = '[data-cy=\"search-input\"]';
private \_submitButton = '[data-cy=\"submit-btn\"]';
private \_productCard = '[data-cy=\"product-card\"]';

searchForProduct(term: string): this {
cy.get(this.\_searchInput).type(term);
cy.get(this.\_submitButton).click();
return this;
}

getProductCard(productName: string): Cypress.Chainable {
return cy.get(this.\_productCard).contains(productName);
}
}
\\\

### Bad

\\\ ypescript
// In test file
cy.get('.sc-xyz-123 > input').type('search'); // Brittle, not centralized
cy.get('button:nth-child(2)').click(); // Brittle, unclear intent
cy.get('[data-testid=\"btn\"][class*=\"random\"]').click(); // Long, unstable

// Hardcoded in page object
class HomePage {
search(term: string) {
cy.get('.input-class-123').type(term); // Auto-generated class
}
}
\\\

---

## Cypress-Specific Best Practices

### Use Cypress Commands for Common Patterns

\\\ ypescript
// Good: Use .contains() for text matching
cy.contains('button', 'Submit').click();

// Good: Use .find() for scoped searches
cy.get('[data-cy=\"product-list\"]').find('[data-cy=\"product-item\"]').first();

// Good: Use .within() for contextual queries
cy.get('[data-cy=\"login-form\"]').within(() => {
cy.get('[data-cy=\"email\"]').type('test@example.com');
cy.get('[data-cy=\"password\"]').type('password');
});
\\\

### Avoid These Patterns

\\\ ypescript
// Don't use cy.wait() with arbitrary timeouts
cy.wait(5000); // Use proper assertions instead

// Don't chain get() calls
cy.get('.parent').get('.child'); // Use .find() or .within()

// Don't use overly specific selectors
cy.get('div > ul > li:nth-child(3) > a'); // Brittle
\\\

---

## Common Mistakes to Avoid

- Defining selectors directly in test specs
- Using unstable or auto-generated attributes
- Relying on visual position (nth-child, nth-of-type)
- Duplicating selector definitions across files
- Writing long, brittle selector chains
- Not using data-cy attributes when they should be added

---

## Enforcement

- All selectors must be private/protected properties in page objects or components
- Use data-cy attributes as primary strategy (advocate for adding them to the app)
- Review all selectors for stability and maintainability
- **Use only one selector per element**
- **Centralize all selectors in page objects or components**
- **Follow DRY and KISS principles**

---

## References

- [Cypress Best Practices - Selecting Elements](https://docs.cypress.io/guides/references/best-practices#Selecting-Elements)
- [Cypress Selector Strategies](https://docs.cypress.io/guides/references/best-practices#How-It-Works)
- [Testing Library Principles](https://testing-library.com/docs/queries/about/)

---

**Reference this guide before every new selector implementation or review. Reliable selectors are key to stable automation!**
