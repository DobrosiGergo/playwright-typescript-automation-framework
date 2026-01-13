/// <reference types="cypress" />

import { BaseComponent } from '../../base/baseComponent';

/**
 * PersonalInfoComponent - Handles personal information
 * Covers first name, last name, company, and mobile number
 * CYPRESS PATTERN: No async/await, returns this for chaining
 */
export class PersonalInfoComponent extends BaseComponent {
  readonly firstNameInput = () => this.container.find('#first_name');
  readonly lastNameInput = () => this.container.find('#last_name');
  readonly companyInput = () => this.container.find('#company');
  readonly mobileNumberInput = () => this.container.find('#mobile_number');

  constructor(containerSelector: string) {
    super(containerSelector);
  }

  /**
   * Fill personal information
   * @param {Object} personalData - Personal information data
   * @param {string} personalData.firstname - User's first name
   * @param {string} personalData.lastname - User's last name
   * @param {string} personalData.company - User's company name
   * @param {string} personalData.mobile_number - User's mobile number
   * @return {this} Returns this for method chaining
   */
  fillPersonalInfo(personalData: {
    firstname: string;
    lastname: string;
    company: string;
    mobile_number: string;
  }): this {
    this.firstNameInput().clear().type(personalData.firstname);
    this.lastNameInput().clear().type(personalData.lastname);
    this.companyInput().clear().type(personalData.company);
    this.mobileNumberInput().clear().type(personalData.mobile_number);
    return this;
  }
}
