/// <reference types="cypress" />

import { BaseComponent } from '../../base/baseComponent';

/**
 * NavbarComponent - Handles navigation bar functionality
 * Common component used across all pages (Singleton pattern)
 * CYPRESS PATTERN: No async/await, returns this for chaining
 */
export class NavbarComponent extends BaseComponent {
  // Private locators
  private readonly usernameText = (username: string) => cy.contains(username);

  readonly homeLink = () => cy.contains('a', ' Home');
  readonly productsLink = () => cy.contains('a', ' Products');
  readonly cartLink = () => cy.contains('a', ' Cart');
  readonly signupLoginLink = () => cy.contains('a', ' Signup / Login');
  readonly testCasesLink = () => cy.contains('a', ' Test Cases');
  readonly apiTestingLink = () => cy.contains('a', ' API Testing');
  readonly videoTutorialsLink = () => cy.contains('a', ' Video Tutorials');
  readonly contactUsLink = () => cy.contains('a', ' Contact us');
  readonly logoutLink = () => cy.contains('a', ' Logout');
  readonly loggedInUserText = () => cy.contains('Logged in as');

  constructor() {
    super('header'); // Navbar container
  }

  /**
   * Navigate to home page
   * @return {this} Returns this for method chaining
   */
  goToHome(): this {
    cy.log('Navigating to home via navbar');
    this.homeLink().click();
    return this;
  }

  /**
   * Navigate to products page
   * @return {this} Returns this for method chaining
   */
  goToProducts(): this {
    cy.log('Navigating to products via navbar');
    this.productsLink().click();
    return this;
  }

  /**
   * Navigate to cart page
   * @return {this} Returns this for method chaining
   */
  goToCart(): this {
    cy.log('Navigating to cart via navbar');
    this.cartLink().click();
    return this;
  }

  /**
   * Navigate to signup/login page
   * @return {this} Returns this for method chaining
   */
  goToSignupLogin(): this {
    cy.log('Navigating to signup/login via navbar');
    this.signupLoginLink().click();
    return this;
  }

  /**
   * Navigate to test cases page
   * @return {this} Returns this for method chaining
   */
  goToTestCases(): this {
    cy.log('Navigating to test cases via navbar');
    this.testCasesLink().click();
    return this;
  }

  /**
   * Logout user
   * @return {this} Returns this for method chaining
   */
  logout(): this {
    cy.log('Logging out via navbar');
    this.logoutLink().click();
    return this;
  }

  /**
   * Verify user is logged in
   * @param {string} username - Username to verify in navbar
   * @return {this} Returns this for method chaining
   */
  verifyLoggedIn(username: string): this {
    this.loggedInUserText().should('be.visible');
    this.usernameText(username).should('be.visible');
    return this;
  }

  /**
   * Verify signup/login link is visible (user not logged in)
   * @return {this} Returns this for method chaining
   */
  verifyNotLoggedIn(): this {
    this.signupLoginLink().should('be.visible');
    return this;
  }

  /**
   * Verify home link is visible
   * @return {this} Returns this for method chaining
   */
  verifyHomeVisible(): this {
    this.homeLink().should('be.visible');
    return this;
  }
}
