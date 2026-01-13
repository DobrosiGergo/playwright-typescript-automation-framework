/// <reference types="cypress" />

/**
 * BaseComponent - Shared component behaviors and utilities
 * Base class for all reusable UI components
 *
 * CYPRESS PATTERN: No async/await, uses cy commands with chainable assertions
 */
export abstract class BaseComponent {
  protected readonly containerSelector: string;

  protected get container(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.containerSelector);
  }

  constructor(containerSelector: string) {
    this.containerSelector = containerSelector;
  }

  /**
   * Check if element is visible
   * @param {string} selector - CSS selector to check
   * @return {Cypress.Chainable<boolean>} True if element is visible, false otherwise
   */
  protected isVisible(selector: string): Cypress.Chainable<boolean> {
    return cy.get('body').then(($body) => {
      const element = $body.find(selector);
      if (element.length > 0 && element.is(':visible')) {
        return true;
      }
      return false;
    });
  }

  /**
   * Check if element is hidden
   * @param {string} selector - CSS selector to check
   * @return {Cypress.Chainable<boolean>} True if element is hidden or not present, false otherwise
   */
  protected isHidden(selector: string): Cypress.Chainable<boolean> {
    return cy.get('body').then(($body) => {
      const element = $body.find(selector);
      if (element.length === 0 || !element.is(':visible')) {
        return true;
      }
      return false;
    });
  }

  /**
   * Wait for element to be present
   * @param {string} selector - CSS selector to wait for
   * @param {number} [timeout=10000] - Maximum wait time in milliseconds
   * @return {Cypress.Chainable} Chainable element
   */
  protected waitForElement(selector: string, timeout = 10000): Cypress.Chainable {
    return cy.get(selector, { timeout });
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - CSS selector
   * @param {number} [timeout=10000] - Maximum wait time in milliseconds
   * @return {Cypress.Chainable} Chainable element
   */
  protected waitForVisible(selector: string, timeout = 10000): Cypress.Chainable {
    return cy.get(selector, { timeout }).should('be.visible');
  }

  /**
   * Wait for element to disappear
   * @param {string} selector - CSS selector
   * @param {number} [timeout=10000] - Maximum wait time in milliseconds
   * @return {Cypress.Chainable} Chainable element
   */
  protected waitForHidden(selector: string, timeout = 10000): Cypress.Chainable {
    return cy.get(selector, { timeout }).should('not.be.visible');
  }

  /**
   * Click on element
   * @param {string} selector - CSS selector
   * @return {Cypress.Chainable} Chainable element
   */
  protected click(selector: string): Cypress.Chainable {
    return cy.get(selector).click();
  }

  /**
   * Type text into input field
   * @param selector - CSS selector
   * @param text - Text to type
   * @param options - Cypress type options
   */
  protected type(
    selector: string,
    text: string,
    options?: Partial<Cypress.TypeOptions>,
  ): Cypress.Chainable {
    cy.get(selector).clear();
    return cy.get(selector).type(text, options);
  }

  /**
   * Get element text content
   * @param {string} selector - CSS selector
   * @return {Cypress.Chainable<string>} Element text content
   */
  protected getText(selector: string): Cypress.Chainable<string> {
    return cy.get(selector).invoke('text');
  }

  /**
   * Check if element contains text
   * @param {string} selector - CSS selector
   * @param {string} text - Expected text
   * @return {Cypress.Chainable} Chainable element
   */
  protected shouldContainText(selector: string, text: string): Cypress.Chainable {
    return cy.get(selector).should('contain', text);
  }

  /**
   * Get element attribute value
   * @param {string} selector - CSS selector
   * @param {string} attribute - Attribute name
   * @return {Cypress.Chainable<string>} Attribute value
   */
  protected getAttribute(selector: string, attribute: string): Cypress.Chainable<string> {
    return cy.get(selector).invoke('attr', attribute);
  }

  /**
   * Scroll element into view
   * @param {string} selector - CSS selector
   * @return {Cypress.Chainable} Chainable element
   */
  protected scrollIntoView(selector: string): Cypress.Chainable {
    return cy.get(selector).scrollIntoView();
  }
}
