/// <reference types="cypress" />

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  body?: any;
  headers?: Record<string, string>;
  form?: boolean;
  qs?: Record<string, any>;
}

/**
 * BaseApiClient - Base class for API service classes
 * Provides common HTTP methods using cy.request()
 *
 * CYPRESS PATTERN: Uses cy.request() instead of Playwright's APIRequestContext
 * No async/await, returns Cypress.Chainable
 */
export abstract class BaseApiClient {
  protected readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Build full URL from endpoint and base URL
   */
  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${cleanEndpoint}`;
  }

  /**
   * Perform GET request
   * @param {string} endpoint - API endpoint path (relative to baseUrl)
   * @param {RequestOptions} [options] - Optional request options (headers, query params)
   * @return {Cypress.Chainable<Cypress.Response<any>>} Cypress response object
   */
  protected get(
    endpoint: string,
    options?: RequestOptions,
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: 'GET',
      url: this.buildUrl(endpoint),
      headers: options?.headers,
      qs: options?.qs,
      failOnStatusCode: false,
    });
  }

  /**
   * Perform POST request
   * @param {string} endpoint - API endpoint path (relative to baseUrl)
   * @param {RequestOptions} [options] - Optional request options (body, headers, form data)
   * @return {Cypress.Chainable<Cypress.Response<any>>} Cypress response object
   */
  protected post(
    endpoint: string,
    options?: RequestOptions,
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: 'POST',
      url: this.buildUrl(endpoint),
      body: options?.body,
      headers: options?.headers,
      form: options?.form,
      qs: options?.qs,
      failOnStatusCode: false,
    });
  }

  /**
   * Perform PUT request
   * @param {string} endpoint - API endpoint path (relative to baseUrl)
   * @param {RequestOptions} [options] - Optional request options (body, headers)
   * @return {Cypress.Chainable<Cypress.Response<any>>} Cypress response object
   */
  protected put(
    endpoint: string,
    options?: RequestOptions,
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: 'PUT',
      url: this.buildUrl(endpoint),
      body: options?.body,
      headers: options?.headers,
      qs: options?.qs,
      failOnStatusCode: false,
    });
  }

  /**
   * Perform PATCH request
   * @param {string} endpoint - API endpoint path (relative to baseUrl)
   * @param {RequestOptions} [options] - Optional request options (body, headers)
   * @return {Cypress.Chainable<Cypress.Response<any>>} Cypress response object
   */
  protected patch(
    endpoint: string,
    options?: RequestOptions,
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: 'PATCH',
      url: this.buildUrl(endpoint),
      body: options?.body,
      headers: options?.headers,
      qs: options?.qs,
      failOnStatusCode: false,
    });
  }

  /**
   * Perform DELETE request
   * @param {string} endpoint - API endpoint path (relative to baseUrl)
   * @param {RequestOptions} [options] - Optional request options (body, headers)
   * @return {Cypress.Chainable<Cypress.Response<any>>} Cypress response object
   */
  protected delete(
    endpoint: string,
    options?: RequestOptions,
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: 'DELETE',
      url: this.buildUrl(endpoint),
      body: options?.body,
      headers: options?.headers,
      qs: options?.qs,
      failOnStatusCode: false,
    });
  }

  /**
   * Log API request details (for debugging)
   * @param {HttpMethod} method - HTTP method (GET, POST, PUT, PATCH, DELETE)
   * @param {string} endpoint - API endpoint path
   * @param {any} [data] - Optional request data to log
   */
  protected logRequest(method: HttpMethod, endpoint: string, data?: any): void {
    cy.log(`API ${method}: ${endpoint}`);
    if (data) {
      cy.log('Request Data:', JSON.stringify(data));
    }
  }

  /**
   * Log API response details (for debugging)
   * @param {Cypress.Response<any>} response - Cypress response object
   */
  protected logResponse(response: Cypress.Response<any>): void {
    cy.log(`Response Status: ${response.status}`);
    if (Cypress.env('DEBUG_LOGGING') === 'true') {
      cy.log('Response Body:', JSON.stringify(response.body));
    }
  }
}
