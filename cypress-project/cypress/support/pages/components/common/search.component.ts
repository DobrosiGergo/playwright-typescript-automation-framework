/// <reference types="cypress" />

import { BaseComponent } from "../../base/baseComponent";

/**
 * SearchComponent - Handles product search functionality
 * CYPRESS PATTERN: No async/await, returns this for chaining
 */
export class SearchComponent extends BaseComponent {
  readonly searchInput = () => cy.get('input[name="search"]');
  readonly searchButton = () => cy.get("button#submit_search");

  constructor() {
    super("#search_product"); // Search container
  }

  /**
   * Perform product search
   * @param {string} searchTerm - Product search term or keyword
   * @return {this} Returns this for method chaining
   */
  search(searchTerm: string): this {
    cy.log(`Searching for products: "${searchTerm}"`);
    this.searchInput()
      .clear()
      .type(searchTerm, { parseSpecialCharSequences: false });
    this.searchButton().click();
    return this;
  }

  /**
   * Clear search input field
   * @return {this} Returns this for method chaining
   */
  clearSearch(): this {
    cy.log("Clearing search input");
    this.searchInput().clear();
    return this;
  }

  /**
   * Get current search input value
   * @return {Cypress.Chainable<string>} Current search input value
   */
  getSearchValue(): Cypress.Chainable<string> {
    return this.searchInput()
      .invoke("val")
      .then((val) => String(val || ""));
  }

  /**
   * Verify search input is visible
   * @return {this} Returns this for method chaining
   */
  verifySearchVisible(): this {
    this.searchInput().should("be.visible");
    this.searchButton().should("be.visible");
    return this;
  }
}
