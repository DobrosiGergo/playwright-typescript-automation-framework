/// <reference types="cypress" />

import { BaseComponent } from "../../base/baseComponent";

/**
 * SignupFormComponent - Handles initial signup form functionality
 * CYPRESS PATTERN: No async/await, returns this for chaining
 */
export class SignupFormComponent extends BaseComponent {
  readonly signupNameInput = () =>
    this.container.find('input[data-qa="signup-name"]');
  readonly signupEmailInput = () =>
    this.container.find('input[data-qa="signup-email"]');
  readonly signupButton = () =>
    this.container.find('button[data-qa="signup-button"]');

  constructor(containerSelector: string) {
    super(containerSelector);
  }

  /**
   * Start signup process with name and email
   * @param {string} name - User's display name
   * @param {string} email - User's email address
   * @return {this} Returns this for method chaining
   */
  startSignup(name: string, email: string): this {
    cy.log(`Filling signup form for: ${name}`);
    this.signupNameInput().clear().type(name);
    this.signupEmailInput().clear().type(email);
    this.signupButton().click();
    return this;
  }
}
