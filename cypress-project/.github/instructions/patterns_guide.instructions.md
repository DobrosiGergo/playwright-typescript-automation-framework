---
applyTo: "**"
---

# Cypress Patterns & Abstractions Guide

## Purpose

This guide defines the required design patterns and abstractions for all UI and API automation code in Cypress.  
It is referenced by Copilot and reviewers to ensure code is modular, maintainable, and consistent.

**Always consult this guide before creating, updating, or reviewing page objects, components, custom commands, or tests.**

---

## 1. Page Object Model (POM) UI

- Encapsulate UI structure and actions in page object classes
- Place feature-specific page objects in `cypress/support/pages/<feature>/` as `<feature>.page.ts`
- Page object class names must use PascalCase and end with `Page` (e.g., `ProductsPage`)
- All page objects must extend `BasePage` from `cypress/support/pages/base/basePage.ts`
- Compose page objects from reusable components imported from `cypress/support/pages/components/`
- **Never** use direct cy commands or selectors in test specs; always interact through page objects or components
- Methods should return `this` for method chaining or `Cypress.Chainable` for assertions

---

## 2. Component Pattern UI

- Encapsulate reusable UI fragments (headers, modals, widgets, etc.) as components
- Place all components in `cypress/support/pages/components/` as `<feature>.component.ts`
- **Common components** (used across multiple features) must be in `cypress/support/pages/components/common/`
- Component class names must use PascalCase and end with `Component` (e.g., `NavbarComponent`)
- All components must extend `BaseComponent` from `cypress/support/pages/base/baseComponent.ts`
- **Do not** place components inside feature folders

---

## 3. Custom Commands Pattern Replaces Fixtures

Cypress uses **Custom Commands** instead of fixtures for dependency injection and common workflows.

### Command Organization

\\\ ypescript
// cypress/support/commands.ts
declare global {
namespace Cypress {
interface Chainable {
// Authentication commands
loginViaUI(email: string, password: string): Chainable<void>;
registerUserViaUI(userData: UserData): Chainable<void>;

      // API helper commands
      createUserViaAPI(userData: UserData): Chainable<Response>;
      verifyUserViaAPI(email: string): Chainable<Response>;

      // Cart operations
      addProductToCart(productName: string): Chainable<void>;
    }

}
}

Cypress.Commands.add('loginViaUI', (email: string, password: string) => {
const authPage = new AuthPage();
authPage.login(email, password);
});
\\\

### Best Practices

- Use custom commands for repeatable workflows
- Keep commands focused and single-purpose
- Properly type all commands in the Chainable interface
- Commands replace Playwright's fixture pattern

---

## 4. Service Pattern API Testing

- Encapsulate API endpoints in service classes
- Place base client in `cypress/support/api/clients/baseApiClient.ts`
- Place feature services in `cypress/support/api/clients/` as `<feature>.service.ts`
- Service class names must use PascalCase and end with `Service`
- All services must extend `BaseApiClient`
- Use `cy.request()` for API calls, not fetch

### Example

\\\ ypescript
// cypress/support/api/clients/user.service.ts
export class UserService extends BaseApiClient {
constructor() {
super(Cypress.env('BACKEND_API_BASE_URL'));
}

createUser(userData: UserData) {
return cy.request({
method: 'POST',
url: `\/createAccount`,
form: true,
body: userData,
});
}
}
\\\

---

## 5. Factory & Builder Patterns

- Generate test data using factories
- Place utilities in:
  - `cypress/support/utils/` for data factories
  - `cypress/support/api/factories/` for service factories
- Reuse Playwright factories where possible (adjust imports only)

---

## 6. Configuration & Environment

- Use `Cypress.env()` to access environment variables
- Configure base URLs in `cypress.config.ts`
- Store sensitive data in `cypress.env.json` (git-ignored)
- **Do not** hardcode URLs, endpoints, or credentials

---

## 7. No Async/Await in Cypress

**Critical Difference from Playwright:**

\\\ ypescript
// WRONG (Playwright pattern)
async fillForm(data: UserData): Promise<void> {
await this.emailInput.type(data.email);
}

// CORRECT (Cypress pattern)
fillForm(data: UserData): this {
cy.get(this.\_emailInput).type(data.email);
return this;
}
\\\

- Cypress uses command queue, not promises
- No `async/await` in page objects or tests
- Return `this` for chaining or `Cypress.Chainable` for assertions
- Use `.then()` when you need to work with values

---

## 8. Anti-Patterns to Avoid

- Using async/await (Cypress doesn't support it)
- Direct cy commands in test specs (always use abstractions)
- Duplicating logic across specs and page objects
- Hardcoded data, selectors, URLs
- Arbitrary `cy.wait()` calls (use proper assertions)
- Chaining multiple `cy.get()` calls (use `.find()` or `.within()`)

---

## 9. Checklist for Reviewers & Copilot

- [ ] Are all UI actions encapsulated in page objects/components?
- [ ] Are all API calls encapsulated in service classes?
- [ ] Are custom commands used for common workflows?
- [ ] Is test data generated via factories, not hardcoded?
- [ ] Are patterns applied consistently?
- [ ] Is async/await avoided (Cypress doesn't support it)?
- [ ] Are methods returning `this` or `Cypress.Chainable`?
- [ ] Are URLs and endpoints configured, not hardcoded?

---

## References

- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)
- [Page Object Pattern in Cypress](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Page-objects)

---

**Reference this guide before every new abstraction. Consistent patterns are key to maintainable Cypress tests!**
