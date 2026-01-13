/// <reference types="cypress" />

import { BasePage } from "../base/basePage";
import { LoginFormComponent } from "../components/authentication/loginForm.component";
import { SignupFormComponent } from "../components/authentication/signupForm.component";
import { RegistrationFormComponent } from "../components/authentication/registrationForm.component";

/**
 * AuthenticationPage - Handles login and signup functionality
 * CYPRESS PATTERN: No async/await, returns chainable or void
 */
export class AuthenticationPage extends BasePage {
  protected pageUrl = "/login";

  readonly loginForm: LoginFormComponent;
  readonly signupForm: SignupFormComponent;
  readonly registrationForm: RegistrationFormComponent;

  private readonly loggedInText = () => cy.contains("Logged in as");
  private readonly passwordField = () => cy.get('input[name="password"]');
  private readonly accountCreatedMessage = () =>
    cy.contains("Account Created!");
  private readonly duplicateEmailMessage = () =>
    cy.contains("Email Address already exist!");
  private readonly invalidLoginMessage = () =>
    cy.contains("Your email or password is incorrect!");
  private readonly signupNameField = () =>
    cy.get('input[data-qa="signup-name"]');
  private readonly signupEmailField = () =>
    cy.get('input[data-qa="signup-email"]');
  private readonly signupButton = () =>
    cy.get('button[data-qa="signup-button"]');
  private readonly logoutLink = () => cy.get("a").contains(" Logout");

  constructor() {
    super();

    this.loginForm = new LoginFormComponent(
      'form:has(input[data-qa="login-email"])',
    );
    this.signupForm = new SignupFormComponent(
      'form:has(input[data-qa="signup-name"])',
    );
    this.registrationForm = new RegistrationFormComponent(
      'form:has(input[name="password"])',
    );
  }

  /**
   * Navigate to authentication page
   * @return {this} Returns this for method chaining
   */
  navigateToAuthenticationPage(): this {
    this.navigate();
    return this;
  }

  /**
   * Perform user login
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @return {this} Returns this for method chaining
   */
  login(email: string, password: string): this {
    this.loginForm.login(email, password);
    return this;
  }

  /**
   * Start signup process with name and email
   * @param {string} name - User's display name
   * @param {string} email - User's email address
   * @return {this} Returns this for method chaining
   */
  startSignup(name: string, email: string): this {
    this.signupForm.startSignup(name, email);
    return this;
  }

  /**
   * Complete registration form
   * @param {Object} userData - User registration data
   * @param {string} userData.title - User's title (Mr/Mrs)
   * @param {string} userData.password - User's password
   * @param {string} userData.birth_date - Day of birth
   * @param {string} userData.birth_month - Month of birth
   * @param {string} userData.birth_year - Year of birth
   * @param {string} userData.firstname - First name
   * @param {string} userData.lastname - Last name
   * @param {string} userData.company - Company name
   * @param {string} userData.address1 - Primary address
   * @param {string} [userData.address2] - Secondary address (optional)
   * @param {string} userData.country - Country
   * @param {string} userData.state - State/Province
   * @param {string} userData.city - City
   * @param {string} userData.zipcode - Postal code
   * @param {string} userData.mobile_number - Mobile phone number
   * @return {this} Returns this for method chaining
   */
  completeRegistration(userData: {
    title: string;
    password: string;
    birth_date: string;
    birth_month: string;
    birth_year: string;
    firstname: string;
    lastname: string;
    company: string;
    address1: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobile_number: string;
  }): this {
    this.registrationForm.completeRegistration(userData);
    return this;
  }

  /**
   * Get logged in username
   * @return {Cypress.Chainable<string>} Chainable that resolves to the username
   */
  getLoggedInUsername(): Cypress.Chainable<string> {
    return this.loggedInText()
      .invoke("text")
      .then((text) => text.replace("Logged in as ", "").trim());
  }

  /**
   * Facade: Verify user is logged in (optionally with specific username)
   * @param {string} [username] - Optional username to verify (if not provided, only checks logged in state)
   * @return {this} Returns this for method chaining
   */
  verifyUserLoggedIn(username?: string): this {
    this.loggedInText().should("be.visible");
    if (username) {
      cy.contains(username).should("be.visible");
    }
    return this;
  }

  /**
   * Verify user is logged in with specific username
   * @deprecated Use verifyUserLoggedIn(username) instead
   * @param {string} username - Username to verify
   * @return {this} Returns this for method chaining
   */
  verifyLoggedInAs(username: string): this {
    return this.verifyUserLoggedIn(username);
  }

  /**
   * Verify password field is visible (after starting signup)
   * @return {this} Returns this for method chaining
   */
  verifyPasswordFieldVisible(): this {
    this.passwordField().should("be.visible");
    return this;
  }

  /**
   * Verify account created message
   * @return {this} Returns this for method chaining
   */
  verifyAccountCreated(): this {
    this.accountCreatedMessage().should("be.visible");
    return this;
  }

  /**
   * Verify not on signup page
   * @return {this} Returns this for method chaining
   */
  verifyNotOnSignupPage(): this {
    cy.url().should("not.contain", "/signup");
    return this;
  }

  /**
   * Verify duplicate email error message
   * @return {this} Returns this for method chaining
   */
  verifyDuplicateEmailError(): this {
    this.duplicateEmailMessage().should("be.visible");
    return this;
  }

  /**
   * Verify invalid login error message
   * @return {this} Returns this for method chaining
   */
  verifyInvalidLoginError(): this {
    this.invalidLoginMessage().should("be.visible");
    return this;
  }

  /**
   * Verify on login page
   * @return {this} Returns this for method chaining
   */
  verifyOnLoginPage(): this {
    cy.url().should("contain", "/login");
    return this;
  }

  /**
   * Facade: Verify signup field validity (name or email)
   * @param {('name'|'email')} fieldType - Type of field to validate
   * @return {this} Returns this for method chaining
   */
  verifySignupFieldInvalid(fieldType: "name" | "email"): this {
    const field =
      fieldType === "name" ? this.signupNameField() : this.signupEmailField();
    field.then(($input) => {
      void expect(($input[0] as HTMLInputElement).validity.valid).to.be.false;
    });
    return this;
  }

  /**
   * Verify signup name field validity
   * @deprecated Use verifySignupFieldInvalid('name') instead
   * @return {this} Returns this for method chaining
   */
  verifySignupNameFieldInvalid(): this {
    return this.verifySignupFieldInvalid("name");
  }

  /**
   * Verify signup email field validity
   * @deprecated Use verifySignupFieldInvalid('email') instead
   * @return {this} Returns this for method chaining
   */
  verifySignupEmailFieldInvalid(): this {
    return this.verifySignupFieldInvalid("email");
  }

  /**
   * Click signup button
   * @return {this} Returns this for method chaining
   */
  clickSignupButton(): this {
    this.signupButton().click();
    return this;
  }

  /**
   * Enter signup name
   * @param {string} name - Name to enter in signup field
   * @return {this} Returns this for method chaining
   */
  enterSignupName(name: string): this {
    this.signupNameField().type(name);
    return this;
  }

  /**
   * Logout current user
   * @return {this} Returns this for method chaining
   */
  logout(): this {
    this.logoutLink().click();
    cy.document().should("have.property", "readyState", "complete");
    return this;
  }

  /**
   * Facade: Complete user registration (signup + registration form + verification)
   * @param {Object} userData - Complete user data for registration
   * @param {string} userData.name - User's display name for signup
   * @param {string} userData.email - User's email address
   * @param {string} userData.title - User's title (Mr/Mrs)
   * @param {string} userData.password - User's password
   * @param {string} userData.birth_date - Day of birth
   * @param {string} userData.birth_month - Month of birth
   * @param {string} userData.birth_year - Year of birth
   * @param {string} userData.firstname - First name
   * @param {string} userData.lastname - Last name
   * @param {string} userData.company - Company name
   * @param {string} userData.address1 - Primary address
   * @param {string} [userData.address2] - Secondary address (optional)
   * @param {string} userData.country - Country
   * @param {string} userData.state - State/Province
   * @param {string} userData.city - City
   * @param {string} userData.zipcode - Postal code
   * @param {string} userData.mobile_number - Mobile phone number
   * @param {boolean} [shouldLogout=false] - Whether to logout after registration
   * @return {this} Returns this for method chaining
   */
  registerUser(
    userData: {
      name: string;
      email: string;
      title: string;
      password: string;
      birth_date: string;
      birth_month: string;
      birth_year: string;
      firstname: string;
      lastname: string;
      company: string;
      address1: string;
      address2?: string;
      country: string;
      state: string;
      city: string;
      zipcode: string;
      mobile_number: string;
    },
    shouldLogout: boolean = false,
  ): this {
    this.startSignup(userData.name, userData.email);
    this.completeRegistration(userData);
    this.registrationForm.clickContinue();
    this.verifyUserLoggedIn();

    if (shouldLogout) {
      this.logout();
    }

    return this;
  }
}
