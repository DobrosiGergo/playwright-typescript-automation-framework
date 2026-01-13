/// <reference types="cypress" />

/**
 * BasePage - Shared page behaviors and navigation helpers
 * Encapsulates common page functionality across the application
 *
 * CYPRESS PATTERN: No async/await, returns 'this' for method chaining
 */
export abstract class BasePage {
  protected pageUrl?: string;

  constructor() {
    // Cypress doesn't require page injection like Playwright
  }

  /**
   * Navigate to the page's default URL
   */
  navigate(): this {
    if (!this.pageUrl) {
      throw new Error(`pageUrl is not defined for ${this.constructor.name}`);
    }
    this.navigateTo(this.pageUrl);
    return this;
  }

  /**
   * Navigate to home page
   */
  navigateToHome(): this {
    this.navigateTo('/');
    return this;
  }

  /**
   * Navigate to a specific URL
   * @param {string} url - The relative or absolute URL to navigate to
   * @return {this} Returns this for method chaining
   */
  navigateTo(url: string): this {
    cy.visit(url, {
      timeout: 60000,
      failOnStatusCode: false,
    });
    this.waitForPageReady();
    return this;
  }

  /**
   * Wait for page to be ready for interaction
   */
  protected waitForPageReady(): this {
    // Wait for DOM to be loaded
    cy.document().should('have.property', 'readyState', 'complete');
    return this;
  }

  /**
   * Reload the current page
   */
  reload(): this {
    cy.reload();
    this.waitForPageReady();
    return this;
  }

  /**
   * Get current URL
   * @returns Cypress.Chainable<string>
   */
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  /**
   * Wait for URL to contain specific text
   * @param {string} urlPart - Part of the URL to wait for
   * @return {this} Returns this for method chaining
   */
  waitForUrl(urlPart: string): this {
    cy.url().should('include', urlPart);
    return this;
  }

  /**
   * Check if element exists
   * @param {string} selector - CSS selector
   * @return {Cypress.Chainable<boolean>} True if element exists, false otherwise
   */
  protected elementExists(selector: string): Cypress.Chainable<boolean> {
    return cy.get('body').then(($body) => {
      return $body.find(selector).length > 0;
    });
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - CSS selector
   * @param {number} [timeout=10000] - Maximum wait time in milliseconds
   * @return {Cypress.Chainable} Chainable element
   */
  protected waitForElement(selector: string, timeout = 10000): Cypress.Chainable {
    return cy.get(selector, { timeout }).should('be.visible');
  }

  /**
   * Scroll to element
   * @param {string} selector - CSS selector
   * @return {this} Returns this for method chaining
   */
  protected scrollToElement(selector: string): this {
    cy.get(selector).scrollIntoView();
    return this;
  }

  /**
   * Get page title
   */
  getPageTitle(): Cypress.Chainable<string> {
    return cy.title();
  }
}
