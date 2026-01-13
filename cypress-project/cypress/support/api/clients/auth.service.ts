/// <reference types="cypress" />

import { BaseApiClient } from "./baseApiClient";

import type { AuthCredentials, AuthResponse } from "../data/types";

/**
 * AuthService - Handles authentication operations for restful-booker API
 *
 * CYPRESS PATTERN: Returns Cypress.Chainable, no async/await
 */
export class AuthService extends BaseApiClient {
  constructor() {
    super(
      Cypress.env("RESTFUL_BOOKER_BASE_URL") ||
        "https://restful-booker.herokuapp.com",
    );
  }

  /**
   * Authenticate and obtain access token
   * @param {AuthCredentials} credentials - User credentials (username and password)
   * @return {Cypress.Chainable<Cypress.Response<AuthResponse>>} Cypress response containing auth token
   */
  createToken(
    credentials: AuthCredentials,
  ): Cypress.Chainable<Cypress.Response<AuthResponse>> {
    cy.log(`API: Creating auth token for ${credentials.username}`);
    return this.post("/auth", {
      body: credentials,
    });
  }

  /**
   * Extract token from authentication response
   * @param {Cypress.Response<AuthResponse>} response - Authentication response object
   * @return {string} Extracted authentication token
   */
  getTokenFromResponse(response: Cypress.Response<AuthResponse>): string {
    return response.body.token!;
  }
}
