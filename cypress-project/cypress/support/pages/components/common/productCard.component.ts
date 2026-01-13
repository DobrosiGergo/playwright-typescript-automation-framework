/// <reference types="cypress" />

import { BaseComponent } from '../../base/baseComponent';

/**
 * ProductCardComponent - Handles individual product card interactions
 * CYPRESS PATTERN: No async/await, returns this for chaining
 */
export class ProductCardComponent extends BaseComponent {
  readonly productImage = () => this.container.find('img').first();
  readonly productPrice = () => this.container.find('h2');
  readonly productName = () => this.container.find('p');
  readonly addToCartButton = () => this.container.find('[data-product-id]').first();
  readonly viewProductLink = () => this.container.contains('a', 'View Product');

  constructor(containerSelector: string) {
    super(containerSelector);
  }

  /**
   * Add product to cart
   * @return {this} Returns this for method chaining
   */
  addToCart(): this {
    cy.log('Adding product to cart from product card');
    this.addToCartButton().click({ force: true });
    return this;
  }

  /**
   * View product details page
   * @return {this} Returns this for method chaining
   */
  viewProduct(): this {
    cy.log('Viewing product details');
    this.viewProductLink().click();
    return this;
  }

  /**
   * Get product name
   * @return {Cypress.Chainable<string>} Product name text
   */
  getProductName(): Cypress.Chainable<string> {
    return this.productName()
      .invoke('text')
      .then((text) => text.trim());
  }

  /**
   * Get product price
   * @return {Cypress.Chainable<string>} Product price as formatted string
   */
  getProductPrice(): Cypress.Chainable<string> {
    return this.productPrice()
      .invoke('text')
      .then((text) => text.trim());
  }

  /**
   * Verify product card is visible
   * @return {this} Returns this for method chaining
   */
  verifyVisible(): this {
    this.container.should('be.visible');
    return this;
  }
}

/**
 * ProductCardsListComponent - Handles list of product cards
 * Provides utilities to interact with multiple product cards
 * CYPRESS PATTERN: No async/await, returns this for chaining
 */
export class ProductCardsListComponent extends BaseComponent {
  // Private locators
  private readonly bodyElement = () => cy.get('body');
  private readonly productWrapperByName = (productName: string) =>
    cy.contains('.product-image-wrapper', productName);

  readonly productsContainer = () => cy.get('.features_items');
  readonly productCards = () => cy.get('.product-image-wrapper');

  constructor() {
    super('.features_items'); // Products container
  }

  /**
   * Get product card by name
   * @param {string} productName - Name of the product to find
   * @return {ProductCardComponent} Product card component instance
   */
  getProductCardByName(productName: string): ProductCardComponent {
    const selector = `.product-image-wrapper:contains("${productName}")`;
    return new ProductCardComponent(selector);
  }

  /**
   * Get product card by index
   * @param {number} index - Zero-based index of the product card
   * @return {ProductCardComponent} Product card component instance
   */
  getProductCardByIndex(index: number): ProductCardComponent {
    const selector = `.product-image-wrapper:eq(${index})`;
    return new ProductCardComponent(selector);
  }

  /**
   * Get all product names
   * @return {Cypress.Chainable<string[]>} Array of all product names
   */
  getAllProductNames(): Cypress.Chainable<string[]> {
    return this.productCards()
      .find('p')
      .then(($elements) => {
        const names: string[] = [];
        $elements.each((_, el) => {
          names.push(Cypress.$(el).text().trim());
        });
        return names;
      });
  }

  /**
   * Get product count
   * @return {Cypress.Chainable<number>} Total number of product cards
   */
  getProductCount(): Cypress.Chainable<number> {
    return this.bodyElement().then(($body) => {
      const cards = $body.find('.product-image-wrapper');
      return cards.length;
    });
  }

  /**
   * Verify product exists by name
   * @param {string} productName - Name of the product to verify
   * @return {this} Returns this for method chaining
   */
  verifyProductExists(productName: string): this {
    this.productWrapperByName(productName).should('exist');
    return this;
  }

  /**
   * Verify products are displayed
   * @return {this} Returns this for method chaining
   */
  verifyProductsDisplayed(): this {
    this.productCards().should('have.length.greaterThan', 0);
    return this;
  }
}
