/// <reference types="cypress" />

import { BaseComponent } from '../../base/baseComponent';
import { AccountInfoComponent } from './accountInfo.component';
import { PersonalInfoComponent } from './personalInfo.component';
import { AddressInfoComponent } from './addressInfo.component';

/**
 * RegistrationFormComponent - Orchestrates registration form functionality
 * Composes sub-components for account, personal, and address information
 * CYPRESS PATTERN: No async/await, returns this for chaining
 */
export class RegistrationFormComponent extends BaseComponent {
  readonly accountInfoComponent: AccountInfoComponent;
  readonly personalInfoComponent: PersonalInfoComponent;
  readonly addressInfoComponent: AddressInfoComponent;
  readonly createAccountButton = () => this.container.find('button[data-qa="create-account"]');
  readonly accountCreatedMessage = () => cy.contains('Account Created!');
  readonly continueButton = () => cy.contains('a', 'Continue');

  constructor(containerSelector: string) {
    super(containerSelector);

    this.accountInfoComponent = new AccountInfoComponent(containerSelector);
    this.personalInfoComponent = new PersonalInfoComponent(containerSelector);
    this.addressInfoComponent = new AddressInfoComponent(containerSelector);
  }

  /**
   * Complete registration form
   * @param {Object} userData - Complete user registration data
   * @param {string} userData.title - User's title (Mr/Mrs)
   * @param {string} userData.password - User's password
   * @param {string} userData.birth_date - Birth date (day)
   * @param {string} userData.birth_month - Birth month
   * @param {string} userData.birth_year - Birth year
   * @param {string} userData.firstname - User's first name
   * @param {string} userData.lastname - User's last name
   * @param {string} userData.company - User's company name
   * @param {string} userData.address1 - Primary address line
   * @param {string} [userData.address2] - Secondary address line (optional)
   * @param {string} userData.country - Country
   * @param {string} userData.state - State/province
   * @param {string} userData.city - City
   * @param {string} userData.zipcode - Postal/ZIP code
   * @param {string} userData.mobile_number - User's mobile number
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
    cy.log('Completing registration form');

    this.accountInfoComponent.fillAccountInfo({
      title: userData.title,
      password: userData.password,
      birth_date: userData.birth_date,
      birth_month: userData.birth_month,
      birth_year: userData.birth_year,
    });

    this.personalInfoComponent.fillPersonalInfo({
      firstname: userData.firstname,
      lastname: userData.lastname,
      company: userData.company,
      mobile_number: userData.mobile_number,
    });

    this.addressInfoComponent.fillAddressInfo({
      address1: userData.address1,
      ...(userData.address2 && { address2: userData.address2 }),
      country: userData.country,
      state: userData.state,
      city: userData.city,
      zipcode: userData.zipcode,
    });

    cy.log('Submitting registration form');
    this.createAccountButton().click();

    return this;
  }

  /**
   * Check if account created message is visible
   * @return {Cypress.Chainable<boolean>} True if account created message is visible, false otherwise
   */
  isAccountCreatedVisible(): Cypress.Chainable<boolean> {
    return this.accountCreatedMessage()
      .should('exist')
      .then(($el: JQuery<HTMLElement> | undefined) => ($el ? $el.is(':visible') : false));
  }

  /**
   * Click continue button
   * @return {this} Returns this for method chaining
   */
  clickContinue(): this {
    this.continueButton().click();
    return this;
  }
}
