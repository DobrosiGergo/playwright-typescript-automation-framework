/// <reference types="cypress" />

import { BaseComponent } from '../../base/baseComponent';

/**
 * AccountInfoComponent - Handles account setup information
 * Covers title, password, and date of birth
 * CYPRESS PATTERN: No async/await, returns this for chaining
 */
export class AccountInfoComponent extends BaseComponent {
  readonly titleMrRadio = () => this.container.find('input[value="Mr"]');
  readonly titleMrsRadio = () => this.container.find('input[value="Mrs"]');
  readonly passwordInput = () => this.container.find('#password');
  readonly daySelect = () => this.container.find('#days');
  readonly monthSelect = () => this.container.find('#months');
  readonly yearSelect = () => this.container.find('#years');

  constructor(containerSelector: string) {
    super(containerSelector);
  }

  /**
   * Fill account information
   * @param {Object} accountData - Account setup information
   * @param {string} accountData.title - User's title (Mr/Mrs)
   * @param {string} accountData.password - User's password
   * @param {string} accountData.birth_date - Birth date (day)
   * @param {string} accountData.birth_month - Birth month
   * @param {string} accountData.birth_year - Birth year
   * @return {this} Returns this for method chaining
   */
  fillAccountInfo(accountData: {
    title: string;
    password: string;
    birth_date: string;
    birth_month: string;
    birth_year: string;
  }): this {
    if (accountData.title === 'Mr') {
      this.titleMrRadio().check();
    } else {
      this.titleMrsRadio().check();
    }

    this.passwordInput().clear().type(accountData.password);

    this.daySelect().select(accountData.birth_date);
    this.monthSelect().select(accountData.birth_month);
    this.yearSelect().select(accountData.birth_year);

    return this;
  }
}
