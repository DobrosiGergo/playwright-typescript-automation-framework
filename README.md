#  Automation Testing Monorepo

Enterprise-grade test automation frameworks featuring **Playwright** and **Cypress** with TypeScript, implementing best practices for UI + API testing.

---

##  Projects

###  Playwright Project
**Location:** [`playwright-project/`](playwright-project/)

Production-ready Playwright + TypeScript framework with UI + API hybrid testing.

- **Tests:** 34 (16 UI + 18 API)
- **Patterns:** Page Object Model, Service Layer, Component Pattern, DI
- **Quality:** ESLint, Prettier, Husky pre-commit hooks

[ Full Documentation](playwright-project/README.md)

###  Cypress Project  
**Location:** [`cypress-project/`](cypress-project/)

Enterprise Cypress + TypeScript framework migrated from Playwright patterns.

- **Tests:** 30 (UI + API + Hybrid)
- **Patterns:** Page Object Model, Service Layer, Custom Commands
- **Quality:** ESLint, Prettier, Husky pre-commit hooks

[ Full Documentation](cypress-project/README.md)

---

##  Quick Start

### Playwright
```bash
cd playwright-project
npm install
npm run test:all
```

### Cypress
```bash
cd cypress-project
npm install
npm run cy:run
```

---

##  Repository Structure

```
playwright-typescript-automation-framework/
 playwright-project/         # Playwright testing framework
    tests/                 # Test specs (UI + API)
    .github/               # Instructions & CI configs
    package.json
    playwright.config.ts

 cypress-project/            # Cypress testing framework
    cypress/               # Test specs & support
    .github/               # Instructions & CI configs  
    package.json
    cypress.config.ts

 README.md                   # This file (monorepo overview)
 .gitignore                  # Root-level ignores
```

---

##  Features

Both projects share common architectural patterns:

### Design Patterns
- **Page Object Model (POM)** - Centralized UI element management
- **Component Pattern** - Reusable UI components
- **Service Layer** - API abstraction and business logic
- **Factory Pattern** - Test data generation
- **Dependency Injection** - Fixture-based architecture

### Quality Standards
-  TypeScript strict mode
-  ESLint with custom rules
-  Prettier code formatting
-  Husky pre-commit hooks
-  Comprehensive test coverage
-  Allure + HTML reporting

---

##  Test Results

| Project    | UI Tests | API Tests | Total | Status |
|------------|----------|-----------|-------|--------|
| Playwright | 16       | 18        | 34    |       |
| Cypress    | ~20      | ~10       | 30    |       |
| **Total**  | **~36**  | **~28**   | **64**|       |

---

##  Documentation

- [Playwright Project Documentation](playwright-project/README.md)
- [Cypress Project Documentation](cypress-project/README.md)
- [Coding Standards & Patterns](.github/copilot-instructions.md)

---

##  Development

Each project is fully independent with its own:
- Dependencies (`node_modules/`)
- Configuration files
- Git hooks
- CI/CD pipelines
- Test reports

Work on each project in isolation - no cross-dependencies or interference.

---

##  License

ISC
