/// <reference types="cypress" />

import { BaseApiClient } from './baseApiClient';

/**
 * ProductService - Handles product-related API operations
 *
 * CYPRESS PATTERN: Returns Cypress.Chainable, no async/await
 */
export class ProductService extends BaseApiClient {
  constructor() {
    super(Cypress.env('BACKEND_API_BASE_URL') || 'https://automationexercise.com/api');
  }

  /**
   * Get all products list
   */
  getAllProducts(): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('API: Fetching all products');
    return this.get('/productsList').then((response) => {
      if (typeof response.body === 'string' && response.body.trim().startsWith('{')) {
        response.body = JSON.parse(response.body);
      }
      return response;
    });
  }

  /**
   * Search for products by term
   * @param {string} searchTerm - The search term to find products
   * @return {Cypress.Chainable<Cypress.Response<any>>} Cypress response containing search results
   */
  searchProduct(searchTerm: string): Cypress.Chainable<Cypress.Response<any>> {
    cy.log(`API: Searching products for "${searchTerm}"`);
    return this.post('/searchProduct', {
      body: { search_product: searchTerm },
      form: true,
    });
  }

  /**
   * Get all brands list
   */
  getAllBrands(): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('API: Fetching all brands');
    return this.get('/brandsList');
  }
}
