/// <reference types="cypress" />

import { BasePage } from '../base/basePage';
import { SearchComponent } from '../components/common/search.component';
import { ProductCardsListComponent } from '../components/common/productCard.component';

/**
 * ProductsPage - Handles product listing and product interactions
 * CYPRESS PATTERN: No async/await, returns this for chaining
 */
export class ProductsPage extends BasePage {
  protected pageUrl = '/products';

  // Private locators
  private readonly continueShoppingButton = () => cy.contains('button', 'Continue Shopping');
  private readonly viewCartLink = () => cy.contains('a', 'View Cart');
  private readonly featuresItemsSection = () => cy.get('.features_items');

  readonly searchComponent: SearchComponent;
  readonly productCardsList: ProductCardsListComponent;

  constructor() {
    super();

    this.searchComponent = new SearchComponent();
    this.productCardsList = new ProductCardsListComponent();
  }

  /**
   * Search for products
   * @param {string} searchTerm - Product search term or keyword
   * @return {this} Returns this for method chaining
   */
  searchProducts(searchTerm: string): this {
    this.searchComponent.search(searchTerm);
    return this;
  }

  /**
   * Facade: Add product to cart with post-action (continue shopping or view cart)
   * @param {string} productName - Name of the product to add
   * @param {('continue'|'viewCart')} [action='continue'] - Action after adding (continue shopping or view cart)
   * @return {this} Returns this for method chaining
   */
  addProductToCart(productName: string, action: 'continue' | 'viewCart' = 'continue'): this {
    cy.log(`Adding "${productName}" to cart with action: ${action}`);

    const productCard = this.productCardsList.getProductCardByName(productName);
    productCard.addToCart();

    if (action === 'continue') {
      this.continueShoppingButton().should('be.visible').click();
    } else {
      this.viewCartLink().should('be.visible').click();
    }

    return this;
  }

  /**
   * Add product to cart and continue shopping
   * @param {string} productName - Name of the product to add
   * @return {this} Returns this for method chaining
   */
  addProductToCartAndContinue(productName: string): this {
    return this.addProductToCart(productName, 'continue');
  }

  /**
   * Add product to cart and view cart page
   * @param {string} productName - Name of the product to add
   * @return {this} Returns this for method chaining
   */
  addProductToCartAndViewCart(productName: string): this {
    return this.addProductToCart(productName, 'viewCart');
  }

  /**
   * Get all product names
   * @return {Cypress.Chainable<string[]>} Array of product names
   */
  getProductNames(): Cypress.Chainable<string[]> {
    return this.productCardsList.getAllProductNames();
  }

  /**
   * Get product count
   * @return {Cypress.Chainable<number>} Total number of products
   */
  getProductCount(): Cypress.Chainable<number> {
    return this.productCardsList.getProductCount();
  }

  /**
   * Verify products items section is visible
   * @return {this} Returns this for method chaining
   */
  verifyProductsVisible(): this {
    this.featuresItemsSection().should('be.visible');
    return this;
  }

  /**
   * Verify continue shopping button is not visible
   * @return {this} Returns this for method chaining
   */
  verifyContinueShoppingNotVisible(): this {
    this.continueShoppingButton().should('not.be.visible');
    return this;
  }
}
