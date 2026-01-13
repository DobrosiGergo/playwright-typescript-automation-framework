/// <reference types="cypress" />

import { AuthService } from "../../../support/api/clients/auth.service";
import { StatusCodes } from "http-status-codes";
import {
  generateValidCredentials,
  generateInvalidCredentials,
  generateMissingUsernameCredentials,
  AUTH_ERROR_MESSAGES,
  AUTH_API_PROPERTIES,
} from "../../../support/api/data/authDataFactory";

/**
 * Authentication API Tests - restful-booker
 * Example test demonstrating Cypress API testing patterns
 */
describe("Authentication API @api @standalone @example", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe("Positive Test Cases @smoke", () => {
    it("should successfully authenticate with valid credentials", () => {
      const credentials = generateValidCredentials();

      authService.createToken(credentials).then((response) => {
        softExpect(response.status).to.eq(StatusCodes.OK);
        softExpect(response.body).to.have.property(AUTH_API_PROPERTIES.TOKEN);
        softExpect(response.body.token).to.be.a("string");
        expect(response.body.token).to.have.length.greaterThan(0);
      });
    });
  });

  describe("Negative Test Cases @negative", () => {
    it("should fail authentication with invalid credentials", () => {
      const credentials = generateInvalidCredentials();

      authService.createToken(credentials).then((response) => {
        softExpect(response.status).to.eq(StatusCodes.OK);
        softExpect(response.body).to.have.property(AUTH_API_PROPERTIES.REASON);
        expect((response.body as any).reason).to.eq(
          AUTH_ERROR_MESSAGES.BAD_CREDENTIALS,
        );
      });
    });

    it("should fail authentication with missing username", () => {
      const credentials = generateMissingUsernameCredentials();

      authService.createToken(credentials).then((response) => {
        softExpect(response.status).to.eq(StatusCodes.OK);
        expect(response.body).to.have.property(AUTH_API_PROPERTIES.REASON);
      });
    });
  });
});
