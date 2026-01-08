---
applyTo: '**'
---

# Test Data Management & Factory Guide

## Purpose

Define consistent practices for generating, randomizing, and cleaning up test data in both UI and API layers.

---

## Principles

- **Factory Pattern**
  - Generate dynamic test data via factory/builder utilities.
  - UI-specific factories live under `tests/common/utils/` (e.g., `userDataFactory.ts`, `paymentDataFactory.ts`).
  - API-specific factories live under `tests/api/data/` and `tests/api/factories/`.

- **Randomization**
  - Avoid data collisions by appending unique suffixes (timestamps, GUIDs) or using libraries like `@faker-js/faker`.
  - Provide reusable helpers (e.g., `generateUniqueEmail()`) within data factory modules.

- **Data Cleanup**
  - Use `beforeAll`/`afterAll` hooks for creating and cleaning test data as appropriate.
  - If the backend lacks deletion endpoints, use unique prefixes so leftover data can be differentiated (and document this behavior).

- **Configuration Awareness**
  - Never hardcode URLs, credentials, or environment-dependent values; retrieve them from shared configuration utilities.

---

## Implementation Guidelines

- **Factory Files**
  - UI example: `tests/common/utils/userDataFactory.ts`
  - API example: `tests/api/data/bookingDataFactory.ts`
  - Service factory example: `tests/api/factories/userServiceFactory.ts`
  - For feature-specific needs, create dedicated builders (e.g., `userPayloads.ts`) in the relevant domain directory.

- **Type Definitions**
  - Define TypeScript interfaces for all generated payloads (e.g., `UserData`, `Booking`) in `tests/common/data/` or `tests/api/data/`.

- **Seeding / Deterministic Runs**
  - When reproducibility is required, allow seeding (e.g., `faker.seed(...)`) via config or environment variables.

---

## Checklist

- [ ] Are all mutable data inputs generated via factories/builders?
- [ ] Is cleanup logic implemented (where possible) to remove created data?
- [ ] Are unique identifiers in place to avoid conflicts?
- [ ] Are sensitive or environment-specific values sourced from configuration rather than hardcoded?

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.
