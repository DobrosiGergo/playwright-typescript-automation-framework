# Cypress E2E Automation Framework

**Migrated from Playwright** - This folder contains a Cypress TypeScript automation framework based on the Playwright implementation in the root folder.

---

## Overview

This is a **parallel migration project** where:

- **Root folder** contains the production Playwright framework (reference implementation)
- **cypress-e2e folder** (this folder) contains the Cypress migration
- Both frameworks test the same applications with identical test scenarios

### Applications Under Test

- **UI**: [Automation Exercise](https://automationexercise.com/) - E-commerce platform
- **API**: [Restful Booker](https://restful-booker.herokuapp.com/) - RESTful API platform

---

## Migration Status

### Target: 34 Tests (Migrated from Playwright)

| Category                 | Tests | Status  |
| ------------------------ | ----- | ------- |
| **Standalone API Tests** | 13    | Pending |
| **Backend API Tests**    | 5     | Pending |
| **UI Tests**             | 16    | Pending |

---

## Project Structure

\\\
cypress-e2e/
.github/
instructions/ # Cypress-specific coding guidelines
locator_strategy.instructions.md
patterns_guide.instructions.md
assertion_guide.instructions.md
... (more guides)
agents/ # AI agent configurations
cypress-tester.agent.md
copilot-instructions.md
cypress/
e2e/ # Test specifications
ui/ # UI tests
api/ # API tests (standalone & backend)
hybrid/ # UI + API hybrid tests
support/
e2e.ts # Global setup
commands.ts # Custom commands (replaces fixtures)
pages/ # Page Objects
base/ # Base classes
components/ # Reusable components
api/
clients/ # API service classes
utils/ # Shared utilities
fixtures/ # Test data (JSON)
cypress.config.ts # Cypress configuration
tsconfig.json # TypeScript configuration
package.json # Dependencies
README.md # This file
\\\

---

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn

### Installation

\\\ash
cd cypress-e2e
npm install
\\\

### Configuration

The framework reuses the .env file from the parent (Playwright) folder:

\\\ash

# Located at ../env (root folder)

BASE_URL=https://automationexercise.com
BACKEND_API_BASE_URL=https://automationexercise.com/api
RESTFUL_BOOKER_BASE_URL=https://restful-booker.herokuapp.com
\\\

---

## Running Tests

### Interactive Mode (Cypress Test Runner)

\\\ash
npm run cy:open
\\\

### Headless Mode

\\\ash

# Run all tests

npm run cy:run

# Run specific test types

npm run cy:run:ui # UI tests only
npm run cy:run:api # API tests only
npm run cy:run:hybrid # Hybrid tests only

# Run in specific browser

npm run cy:run:chrome
npm run cy:run:firefox
npm run cy:run:edge
\\\

---

## Code Quality

### Linting

\\\ash
npm run lint # Check for issues
npm run lint:fix # Auto-fix issues
\\\

### Formatting

\\\ash
npm run format # Check formatting
npm run format:fix # Auto-format code
\\\

---

## Reporting

### Allure Reports

\\\ash

# Generate Allure report

npm run allure:generate

# Open Allure report

npm run allure:open
\\\

---

## Key Differences: Cypress vs Playwright

| Aspect          | Playwright (Root)    | Cypress (This Folder)    |
| --------------- | -------------------- | ------------------------ |
| **Async/Await** | Required             | Not supported            |
| **Commands**    | `await page.click()` | `cy.get().click()`       |
| **API Calls**   | `request.post()`     | `cy.request()`           |
| **Assertions**  | `expect().toBe()`    | `.should()` / `expect()` |
| **DI Pattern**  | Fixtures             | Custom Commands          |
| **Selectors**   | `page.locator()`     | `cy.get()`               |

---

## Development Guidelines

### Using Playwright as Reference

1. **Read** the Playwright test in `../tests/`
2. **Understand** the business logic and flow
3. **Implement** in Cypress patterns (no async/await)
4. **Reuse** data factories from `../tests/common/utils/` (adjust imports)
5. **Never** copy-paste Playwright code directly

### Cypress Patterns

- **No async/await** - Use command queue with `.then()`
- **Page Objects** - All selectors in page objects as private properties
- **Custom Commands** - For common workflows (replaces fixtures)
- **API Testing** - Use `cy.request()` wrapped in service classes
- **Assertions** - Use `.should()` for UI, `expect()` for API

---

## Documentation

All Cypress-specific coding guidelines are in `.github/instructions/`:

- `locator_strategy.instructions.md` - Selector patterns
- `patterns_guide.instructions.md` - Design patterns
- `assertion_guide.instructions.md` - Assertion patterns
- `api_guide.instructions.md` - API testing
- `test_generation_guide.instructions.md` - Test structure

**Always consult these guides when writing code.**

---

## Pre-Commit Checklist

- [ ] No async/await used
- [ ] All selectors in page objects (not in tests)
- [ ] Custom commands for common flows
- [ ] Tests mirror Playwright functionality
- [ ] ESLint passing
- [ ] Prettier formatting applied
- [ ] Tests pass reliably (3+ consecutive runs)

---

## References

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress TypeScript Support](https://docs.cypress.io/guides/tooling/typescript-support)
- [Playwright Framework (Reference)](../)

---

## License

ISC

---

**This is a migration project. Use the Playwright code in the root folder as your blueprint, but implement Cypress patterns in this folder.**
