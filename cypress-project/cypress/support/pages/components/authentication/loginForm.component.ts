/// <reference types="cypress" />

import { BaseComponent } from '../../base/baseComponent';

/**
 * LoginFormComponent - Handles login form functionality
 * CYPRESS PATTERN: No async/await, returns this for chaining
 */
export class LoginFormComponent extends BaseComponent {
  readonly loginEmailInput = () => this.container.find('input[data-qa="login-email"]');
  readonly loginPasswordInput = () => this.container.find('input[data-qa="login-password"]');
  readonly loginButton = () => this.container.find('button[data-qa="login-button"]');
  readonly loginErrorMessage = () => cy.contains('Your email or password is incorrect!');

  constructor(containerSelector: string) {
    super(containerSelector);
  }

  /**
   * Perform user login
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @return {this} Returns this for method chaining
   */
  login(email: string, password: string): this {
    cy.log(`Filling login credentials for: ${email}`);
    this.loginEmailInput().clear().type(email);
    this.loginPasswordInput().clear().type(password);
    this.loginButton().click();
    return this;
  }

  /**
   * Check if login error message is visible
   * @return {Cypress.Chainable<boolean>} True if error message is visible, false otherwise
   */
  isLoginErrorVisible(): Cypress.Chainable<boolean> {
    return this.loginErrorMessage()
      .should('exist')
      .then(($el: JQuery<HTMLElement> | undefined) => ($el ? $el.is(':visible') : false));
  }
}
