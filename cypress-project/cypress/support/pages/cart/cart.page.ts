/// <reference types="cypress" />

import { BasePage } from '../base/basePage';

/**
 * CartPage - Shopping cart management
 * CYPRESS PATTERN: No async/await, returns this for chaining
 */
export class CartPage extends BasePage {
  protected pageUrl = '/view_cart';

  // Private locators
  private readonly cartInfoTable = () => cy.get('#cart_info_table');

  // Selectors
  readonly cartTableRows = () => cy.get('#cart_info_table tbody tr');
  readonly cartProductRow = (productName: string) =>
    cy.contains('#cart_info_table tbody tr', productName);
  readonly proceedToCheckoutButton = () => cy.contains('a', 'Proceed To Checkout');
  readonly emptyCartMessage = () => cy.contains('Cart is empty!');

  /**
   * Get all cart items
   * @return {Cypress.Chainable<JQuery<HTMLElement>>} Chainable jQuery elements of cart rows
   */
  getCartItems(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.cartTableRows();
  }

  /**
   * Get cart item count
   * @return {Cypress.Chainable<number>} Number of items in cart (excluding subscription row)
   */
  getCartItemCount(): Cypress.Chainable<number> {
    return this.cartTableRows().then(($rows) => {
      return $rows.filter(':not(:contains("Subscription"))').length;
    });
  }

  /**
   * Verify product is in cart
   * @param {string} productName - Name of the product to verify
   * @return {this} Returns this for method chaining
   */
  verifyProductInCart(productName: string): this {
    this.cartProductRow(productName).should('be.visible');
    return this;
  }

  /**
   * Get product quantity
   * @param {string} productName - Name of the product
   * @return {Cypress.Chainable<number>} Product quantity as number
   */
  getProductQuantity(productName: string): Cypress.Chainable<number> {
    return this.cartProductRow(productName)
      .find('.cart_quantity button')
      .invoke('text')
      .then((text) => parseInt(text.trim(), 10));
  }

  /**
   * Get product price
   * @param {string} productName - Name of the product
   * @return {Cypress.Chainable<string>} Product price as formatted string
   */
  getProductPrice(productName: string): Cypress.Chainable<string> {
    return this.cartProductRow(productName)
      .find('.cart_price p')
      .invoke('text')
      .then((text) => text.trim());
  }

  /**
   * Get product total
   * @param {string} productName - Name of the product
   * @return {Cypress.Chainable<string>} Product total price as formatted string
   */
  getProductTotal(productName: string): Cypress.Chainable<string> {
    return this.cartProductRow(productName)
      .find('.cart_total_price')
      .invoke('text')
      .then((text) => text.trim());
  }

  /**
   * Remove product from cart
   * @param {string} productName - Name of the product to remove
   * @return {this} Returns this for method chaining
   */
  removeProduct(productName: string): this {
    this.cartProductRow(productName).find('.cart_delete a').click();
    return this;
  }

  /**
   * Proceed to checkout
   * @return {this} Returns this for method chaining
   */
  proceedToCheckout(): this {
    this.proceedToCheckoutButton().click();
    return this;
  }

  /**
   * Verify cart is empty
   * @return {this} Returns this for method chaining
   */
  verifyCartIsEmpty(): this {
    this.emptyCartMessage().should('be.visible');
    return this;
  }

  /**
   * Verify cart has items
   * @return {this} Returns this for method chaining
   */
  verifyCartHasItems(): this {
    this.cartTableRows().should('have.length.greaterThan', 0);
    return this;
  }

  /**
   * Verify cart table is visible
   * @return {this} Returns this for method chaining
   */
  verifyCartTableVisible(): this {
    this.cartInfoTable().should('be.visible');
    return this;
  }
}
