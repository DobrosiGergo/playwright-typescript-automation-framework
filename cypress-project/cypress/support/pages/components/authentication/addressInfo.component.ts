/// <reference types="cypress" />

import { BaseComponent } from '../../base/baseComponent';

/**
 * AddressInfoComponent - Handles address information
 * Covers address, country, state, city, and zipcode
 * CYPRESS PATTERN: No async/await, returns this for chaining
 */
export class AddressInfoComponent extends BaseComponent {
  readonly address1Input = () => this.container.find('#address1');
  readonly address2Input = () => this.container.find('#address2');
  readonly countrySelect = () => this.container.find('#country');
  readonly stateInput = () => this.container.find('#state');
  readonly cityInput = () => this.container.find('#city');
  readonly zipcodeInput = () => this.container.find('#zipcode');

  constructor(containerSelector: string) {
    super(containerSelector);
  }

  /**
   * Fill address information
   * Selects random country from available dropdown options
   * @param {Object} addressData - Address information data
   * @param {string} addressData.address1 - Primary address line
   * @param {string} [addressData.address2] - Secondary address line (optional)
   * @param {string} [addressData.country] - Country (optional, randomly selected if not provided)
   * @param {string} addressData.state - State/province
   * @param {string} addressData.city - City
   * @param {string} addressData.zipcode - Postal/ZIP code
   * @return {this} Returns this for method chaining
   */
  fillAddressInfo(addressData: {
    address1: string;
    address2?: string;
    country?: string;
    state: string;
    city: string;
    zipcode: string;
  }): this {
    this.address1Input().clear().type(addressData.address1);

    if (addressData.address2) {
      this.address2Input().clear().type(addressData.address2);
    }

    // Select random country from dropdown
    this.countrySelect()
      .find('option')
      .then(($options) => {
        if ($options.length > 0) {
          const randomIndex = Math.floor(Math.random() * $options.length);
          const selectedCountry = $options[randomIndex].value;
          if (selectedCountry) {
            this.countrySelect().select(selectedCountry);
          }
        }
      });

    this.stateInput().clear().type(addressData.state);
    this.cityInput().clear().type(addressData.city);
    this.zipcodeInput().clear().type(addressData.zipcode);

    return this;
  }
}
