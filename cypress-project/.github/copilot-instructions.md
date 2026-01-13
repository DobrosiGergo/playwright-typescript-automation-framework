# AI Copilot Cypress Playbook

**Role Alignment:** Senior Test Automation Engineer specializing in Cypress + TypeScript frameworks.

**Project Context:** This is a Cypress migration parallel to the existing Playwright framework. Use Playwright code in the root folder as reference, but implement Cypress-specific patterns here.

---

## 1. Mission & Quality Bar

This `cypress-e2e` folder delivers a **production-ready Cypress automation platform** with **UI + API hybrid testing** capabilities, migrated from the Playwright framework. All contributions must uphold:

- **Structured & Modular:** Clear separation (UI, API, Shared)
- **Cypress Patterns:** No async/await, use command queue, custom commands instead of fixtures
- **Pattern-Oriented:** Page Objects, Components, Service Layer, Factories, Custom Commands
- **CI-Ready:** ESLint, Prettier, quality gates
- **UI + API Hybrid:** All UI actions verified through backend API calls
- **DRY & KISS:** No duplication, keep it simple
- **Zero Technical Debt:** No unused selectors or code

---

## 2. Migration Context

### Reference Implementation (Playwright)

The root folder contains the **Playwright implementation** with:

- 34 tests (18 API + 16 UI)
- Page Object Model with components
- Service Layer for API
- Fixture-based DI
- Full TypeScript support

### Cypress Implementation (This Folder)

**DO NOT TOUCH** any Playwright code in the root folder.  
**ONLY WORK** inside `cypress-e2e/` folder.

Use Playwright code as a **reference/example** for:

- Test scenarios and flows
- Data factories
- Expected behaviors
- Business logic

But implement using **Cypress patterns**:

- `cy.get()` instead of `page.locator()`
- Custom commands instead of fixtures
- `cy.request()` instead of `APIRequestContext`
- No async/await (use `.then()`)
- `should()` instead of `expect().toBe()`

---

## 3. Folder Structure

\\\
cypress-e2e/
.github/
instructions/ # Cypress-specific guides
agents/ # Cypress-specific agents
cypress/
e2e/ # Test specs
ui/
api/
hybrid/
support/
commands.ts # Custom commands (replaces fixtures)
e2e.ts # Global setup
pages/ # Page Objects
components/ # Components
api/ # API clients
utils/ # Utilities
fixtures/ # Test data JSON
cypress.config.ts # Cypress config
tsconfig.json # TypeScript config
package.json # Dependencies
\\\

---

## 4. Key Cypress Differences from Playwright

| Aspect     | Playwright (Root)        | Cypress (This Folder)     |
| ---------- | ------------------------ | ------------------------- |
| Commands   | `await page.click()`     | `cy.get().click()`        |
| API        | `request.post()`         | `cy.request()`            |
| Assertions | `expect().toBe()`        | `.should()` / `expect()`  |
| DI         | Fixtures (`test.extend`) | Custom Commands           |
| Async      | `async/await`            | `.then()` / command queue |
| Selectors  | `page.locator()`         | `cy.get()`                |
| Waits      | Auto-wait                | Auto-retry assertions     |

---

## 5. Development Guidelines

### Use Existing Playwright Tests as Reference

1. Read Playwright test in `../tests/ui/specs/` or `../tests/api/specs/`
2. Understand the business logic and flow
3. Implement same logic in Cypress patterns in `cypress/e2e/`
4. Reuse data factories from `../tests/common/utils/` (adjust imports)
5. Reuse constants like `httpStatus.ts`

### Never Copy-Paste Playwright Code Directly

- Playwright patterns won't work in Cypress
- Must convert to Cypress command queue
- Remove all `async/await`
- Convert fixtures to custom commands
- Convert `page.locator()` to `cy.get()`

### Commenting

- For UI: Only comment above user action functions
- For API: Only comment above API call functions
- Keep comments concise and purposeful

---

## 6. CI/CD & Reporting

- Setup Allure reporting for Cypress
- Configure parallel execution
- Use same quality gates (ESLint, Prettier)
- Maintain observability through reports

---

## 7. Instruction Files

All Cypress-specific instructions are in `.github/instructions/`:

- `locator_strategy.instructions.md` - Cypress selector patterns
- `patterns_guide.instructions.md` - Cypress design patterns
- `assertion_guide.instructions.md` - Cypress assertion patterns
- `api_guide.instructions.md` - Cypress API testing
- `test_generation_guide.instructions.md` - Cypress test structure

**Always consult relevant instructions when working in those areas.**

---

## 8. Pre-Submission Checklist

- [ ] No async/await used (Cypress doesn't support it)
- [ ] All selectors centralized in page objects
- [ ] Custom commands used for common workflows
- [ ] Tests use page objects, not direct cy commands
- [ ] ESLint and Prettier passing
- [ ] No Playwright code modified in root folder
- [ ] Tests mirror Playwright functionality

---

## 9. References

- [Cypress Docs](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress TypeScript](https://docs.cypress.io/guides/tooling/typescript-support)

---

**This is a migration project. The Playwright code in the root folder is your blueprint, but you must implement Cypress patterns in this folder.**
