---
applyTo: '**'
---

# API Assertion & Response Validation Guide

## Purpose

Define consistent practices for validating API responses, handling authentication, and covering both positive and negative scenarios.  
All API-focused tests and services must follow this guide.

---

## Testing Strategy Overview

This framework supports **two distinct API testing approaches**:

1. **Standalone API Testing** (`tests/api/specs/standalone/`):
   - Pure API tests against external APIs (e.g., restful-booker)
   - Tests API endpoints independently without UI interaction
   - Focus on API functionality, authentication, CRUD operations, and error handling

2. **Backend API Validation** (`tests/api/specs/backend/`):
   - API services used to validate backend state during UI testing
   - Part of UI + API hybrid testing (e.g., automationexercise.com)
   - Verifies that UI actions correctly update backend data

Both approaches share common principles but serve different purposes.

---

## Principles

- **Fail-Fast & No False Positives**
  - Every critical assertion must be a hard assertion (`expect`).
  - Tests must fail as soon as the response (status, schema, or payload) is incorrect.

- **Schema Validation First**
  - Validate the response schema before asserting business logic.
  - Use TypeScript interfaces plus a runtime validator (e.g., Zod, Ajv) to ensure response shape and types.

- **Positive Scenarios**
  - Cover successful flows where the backend returns valid data.
  - Assert:
    - The correct status code using shared constants/enums (e.g., `HttpStatus.OK`).
    - Schema validity (run the validator and expect no errors).
    - Business fields (IDs, totals, etc.) via typed property checks.
    - Use status codes from shared enums/constants, not hardcoded numbers.

- **Negative Scenarios**
  - Intentionally trigger errors (invalid inputs, unauthorized access, out-of-stock, etc.).
  - Assert:
    - Correct error status (e.g., `HttpStatus.BAD_REQUEST`, `HttpStatus.UNAUTHORIZED`).
    - Schema/body of the error response (message codes, fields).
    - Clear failure messages if the expected error is not returned.

- **Authentication Handling**
  - Resolve tokens/credentials through fixtures (login flow, token endpoint, secret manager).
  - Never hardcode tokens; tests must fail gracefully if authentication cannot be obtained.

- **Idempotency & Clean State**
  - Ensure tests can run repeatedly:
    - Use factories for unique data.
    - Clean up created resources where the API supports deletion.
    - Reset or isolate state in fixtures.

---

## Reusable API Call Abstraction (Service Layer Pattern)

To keep API logic maintainable and DRY, implement a reusable “base API request” function that encapsulates shared HTTP behavior. Feature-specific functions (e.g., `getTeams`) call this base function, supplying only endpoint-specific details. This follows the **Service Layer / API Client abstraction** pattern.

### Base Request (shared utility)

```ts
// src/api/base/baseApiRequest.ts
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiRequestOptions<TBody = unknown> {
  path: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean>;
  body?: TBody;
}

const API_BASE_URL = process.env.API_BASE_URL ?? 'https://api.example.com';

export async function baseApiRequest<TResponse, TBody = unknown>({
  path,
  method = 'GET',
  headers = {},
  query,
  body,
}: ApiRequestOptions<TBody>): Promise<TResponse> {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as TResponse;
}
```

### Feature Function Example

```ts
// src/api/services/team.service.ts
import { baseApiRequest } from '../base/baseApiRequest';
import { teamsResponseSchema, TeamsResponse } from '../data/team.schema';

interface GetTeamsParams {
  slug: string;
  authToken: string;
}

export async function getTeams({ slug, authToken }: GetTeamsParams): Promise<TeamsResponse> {
  const data = await baseApiRequest<TeamsResponse>({
    path: `/teams/${slug}`,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  // Schema validation before returning
  return teamsResponseSchema.parse(data);
}
```

- `baseApiRequest` centralizes base URL handling, query parameters, headers, JSON parsing, and error handling.
- Feature functions (like `getTeams`) provide only endpoint-specific details and perform schema validation.
- Additional endpoints (e.g., `createOrder`, `getUser`) follow the same pattern.

---

## Implementation Guidelines

- **Centralize API Calls**
  - Each feature service class extends `BaseApiClient` located in `tests/api/clients/`.
  - Tests call service methods via fixtures, never raw `fetch` or duplicated logic.
  - Service classes are instantiated with Playwright's `APIRequestContext`.

- **Use TypeScript for Maintainability**
  - Define request/response types and data factories in `tests/api/data/`.
  - Define payload builders in `tests/api/data/` (e.g., `userPayloads.ts`, `bookingPayloads.ts`).
  - Use TypeScript interfaces for type safety without runtime schema validation.

- **Fixtures for Auth and Service Injection**
  - Use Playwright fixtures to inject service instances and auth tokens.
  - Example from project:
    ```ts
    // tests/api/fixtures/backendFixtures.ts
    export const test = base.extend<{
      userService: UserService;
      productService: ProductService;
    }>({
      userService: async ({ request }, use) => {
        await use(new UserService(request));
      },
      productService: async ({ request }, use) => {
        await use(new ProductService(request));
      },
    });
    ```

- **Logging & Allure**
  - Use `Logger.info()` and `Logger.error()` from `tests/common/utils/logger.util.ts`.
  - BaseApiClient automatically logs failed requests with full details.
  - Attach request/response payloads to Allure when tests fail.

---

## Service Factory Pattern for beforeAll/afterAll Hooks

When tests need to create shared test data in `beforeAll` hooks, use the **Service Factory** pattern instead of fixture-based services. Service factories use native `fetch` and don't require Playwright's fixture context.

### Service Factory Structure

```ts
// tests/api/factories/userServiceFactory.ts
export const UserServiceFactory = {
  async createUser(userData: UserData): Promise<Response> {
    const formData = new FormData();
    const payload = buildCreateUserPayload(userData);

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value);
    });

    return fetch(`${API_BASE_URL}/createAccount`, {
      method: 'POST',
      body: formData,
    });
  },

  async deleteUser(email: string, password: string): Promise<Response> {
    // ... implementation
  },
};
```

### Centralized Export

```ts
// tests/api/factories/serviceFactory.ts
import { UserServiceFactory } from './userServiceFactory';
import { ProductServiceFactory } from './productServiceFactory';

export const ServiceFactory = {
  user: UserServiceFactory,
  product: ProductServiceFactory,
};
```

---

## Test Organization Pattern

Organize tests into **Positive** and **Negative** test suites with shared test data setup:

### Recommended Structure (Actual Project Example)

```ts
// tests/api/specs/backend/user.spec.ts
import { test, expect } from '../../fixtures/backendFixtures';
import { StatusCodes } from 'http-status-codes';
import { faker } from '@faker-js/faker';
import { ServiceFactory } from '../../factories/serviceFactory';
import { UserDataFactory } from '../../../common/utils/userDataFactory';

/**
 * User API Tests - Backend API validation for UI testing
 * Tests user-related API endpoints for automationexercise.com
 */
test.describe('User Backend API @api @backend @critical', () => {
  test.describe('Positive Test Cases @smoke', () => {
    let testUser: ReturnType<typeof UserDataFactory.generateUserData>;
    let createdUserResponse: { status: number; responseCode: number; message: string };

    test.beforeAll(async () => {
      // Create shared test data using ServiceFactory (no fixtures needed)
      testUser = UserDataFactory.generateUserData();
      const response = await ServiceFactory.user.createUser(testUser);
      const responseJson = await response.json();
      createdUserResponse = {
        status: response.status,
        responseCode: responseJson.responseCode,
        message: responseJson.message,
      };
    });

    test.afterAll(async () => {
      // Cleanup shared test data
      await ServiceFactory.user.deleteUser(testUser.email, testUser.password);
    });

    test('should create user account via API', async () => {
      // Validate creation response stored in beforeAll
      expect.soft(createdUserResponse.status).toBe(StatusCodes.OK);
      expect.soft(createdUserResponse.responseCode).toBe(StatusCodes.CREATED);
      expect(createdUserResponse.message).toContain('User created!');
    });

    test('should verify login with valid credentials', async ({ userService }) => {
      // Use fixture-based service for test-specific operations
      const loginResponse = await userService.verifyLogin(testUser.email, testUser.password);
      expect.soft(loginResponse.status()).toBe(StatusCodes.OK);

      const loginResponseJson = await loginResponse.json();
      expect.soft(loginResponseJson.responseCode).toBe(StatusCodes.OK);
      expect(loginResponseJson.message).toContain('User exists!');
    });

    test('should get user details by email', async ({ userService }) => {
      const getUserResponse = await userService.getUserByEmail(testUser.email);
      expect.soft(getUserResponse.status()).toBe(StatusCodes.OK);

      const userData = await getUserResponse.json();
      expect.soft(userData.user.email).toBe(testUser.email);
      expect.soft(userData.user.name).toBe(testUser.name);
      expect.soft(userData.user.first_name).toBe(testUser.firstname);
      expect(userData.user.last_name).toBe(testUser.lastname);
    });
  });

  test.describe('Negative Test Cases @negative', () => {
    test('should return error for invalid login credentials', async ({ userService }) => {
      const loginResponse = await userService.verifyLogin(
        faker.internet.email(),
        faker.internet.password(),
      );
      expect.soft(loginResponse.status()).toBe(StatusCodes.OK);

      const responseJson = await loginResponse.json();
      expect.soft(responseJson.responseCode).toBe(StatusCodes.NOT_FOUND);
      expect(responseJson.message).toContain('User not found!');
    });

    test('should return error for non-existent user email', async ({ userService }) => {
      const getUserResponse = await userService.getUserByEmail(faker.internet.email());
      expect.soft(getUserResponse.status()).toBe(StatusCodes.OK);

      const responseJson = await getUserResponse.json();
      expect.soft(responseJson.responseCode).toBe(StatusCodes.NOT_FOUND);
      expect(responseJson.message).toContain('Account not found');
    });
  });
});
```

### Key Benefits

1. **Separation of Concerns**: Positive tests share one user, negative tests run independently
2. **Performance**: Create test data once in `beforeAll` instead of per-test
3. **No Fixture Dependencies**: `ServiceFactory` works without Playwright fixtures
4. **Clear Organization**: `@smoke` for positive flows, `@negative` for error cases
5. **Automatic Cleanup**: `afterAll` ensures no test data pollution

---

## Recommended Test Structure

1. **Setup (beforeAll)**
   - Create shared test data using `ServiceFactory`
   - Store responses in variables for validation

## Recommended Test Structure

- Resolve authentication.
- Generate data via factories.

2. **Schema Validation**
   - Validate response schema immediately after the call returns.

3. **Positive Cases**
   - Assert status code via shared constants/enums (when using Playwright request context).
   - Assert business fields.

4. **Negative Cases**
   - Trigger expected errors.
   - Assert error status and payload.

5. **Cleanup**
   - Remove or reset created resources.

---

## Example Test (Standalone API)

```ts
// tests/api/specs/standalone/booking/booking.spec.ts
import { test, expect } from '../../../fixtures/apiFixtures';
import { StatusCodes } from 'http-status-codes';
import { BookingDataFactory } from '../../../data/bookingDataFactory';
import { ServiceFactory } from '../../../factories/serviceFactory';

/**
 * Booking API Tests - CRUD operations
 * Tests restful-booker.herokuapp.com API
 */
test.describe('Booking API @api @standalone @critical', () => {
  test.describe('Positive Test Cases @smoke', () => {
    let sharedBooking: ReturnType<typeof BookingDataFactory.generateBooking>;
    let sharedBookingId: number;
    let authToken: string;

    test.beforeAll(async ({ authService, defaultCredentials }) => {
      // Create shared booking using ServiceFactory
      sharedBooking = BookingDataFactory.generateBooking();
      const createResponse = await ServiceFactory.booking.createBooking(sharedBooking);
      const createBody = await createResponse.json();
      sharedBookingId = createBody.bookingid;

      // Get auth token using fixture-based service
      const authResponse = await authService.createToken(defaultCredentials);
      const authBody = await authResponse.json();
      authToken = authBody.token;
    });

    test.afterAll(async () => {
      // Cleanup: delete booking
      if (sharedBookingId && authToken) {
        await ServiceFactory.booking.deleteBooking(sharedBookingId, authToken);
      }
    });

    test('should create a new booking and verify details', async ({
      bookingService,
      uniqueBooking,
    }) => {
      const response = await bookingService.createBooking(uniqueBooking);
      expect.soft(response.status()).toBe(StatusCodes.OK);

      const responseBody = await response.json();
      expect.soft(responseBody.booking.firstname).toBe(uniqueBooking.firstname);
      expect.soft(responseBody.booking.totalprice).toBe(uniqueBooking.totalprice);
      expect(responseBody.bookingid).toBeDefined();
    });

    test('should update an existing booking', async ({ bookingService, authToken }) => {
      const updatedBooking = BookingDataFactory.generateUpdatedBooking(sharedBooking);
      const response = await bookingService.updateBooking(
        sharedBookingId,
        updatedBooking,
        authToken,
      );

      expect.soft(response.status()).toBe(StatusCodes.OK);
      const updatedData = await response.json();
      expect(updatedData.totalprice).toBe(updatedBooking.totalprice);
    });
  });

  test.describe('Negative Test Cases @negative', () => {
    test('should return 404 for non-existent booking', async ({ bookingService }) => {
      const nonExistentId = BookingDataFactory.generateNonExistentBookingId();
      const response = await bookingService.getBookingById(nonExistentId);
      expect(response.status()).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
```

---

## Common Mistakes

- Validating only status codes without checking response schemas.
- Skipping schema validation and relying solely on TypeScript structural typing.
- Hardcoding status codes instead of using shared constants/enums.
- Duplicating HTTP request logic instead of using the base API request helper.
- Hardcoding authentication tokens rather than resolving them dynamically.
- Failing to clean up state, causing subsequent runs to fail.

---

## Checklist

- [ ] Does the test validate the response schema before business assertions?
- [ ] Are status codes asserted via shared constants/enums (e.g., `StatusCodes.OK`)?
- [ ] Do positive scenarios verify all required fields?
- [ ] Do negative scenarios confirm error status/payload?
- [ ] Do service functions reuse the shared `baseApiRequest` helper?
- [ ] Is authentication resolved dynamically (no hardcoded tokens)?
- [ ] Are tests organized into Positive (@smoke) and Negative (@negative) test suites?
- [ ] Is `ServiceFactory` used in `beforeAll` for shared test data creation?
- [ ] Is cleanup performed in `afterAll` using `ServiceFactory`?
- [ ] Can tests run repeatedly without polluting state?
- [ ] Are failures logged and attached to Allure?

---

## References

- [Martin Fowler – Service Layer Pattern](https://martinfowler.com/eaaCatalog/serviceLayer.html)
- [TypeScript Handbook – Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Zod Documentation – Runtime Schema Validation](https://zod.dev/)
- [MDN – Fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API)
- [Playwright Test – API Testing](https://playwright.dev/docs/test-api-testing)
