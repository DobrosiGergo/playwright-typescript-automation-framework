import { faker } from '@faker-js/faker';
import { UserData } from './types';

/**
 * User Data Factory - Generates unique test user data
 * Reused from Playwright implementation with no changes needed
 */
export class UserDataFactory {
  /**
   * Generate unique email address with UUID
   * @return {string} Unique email address with UUID suffix
   */
  static generateUniqueEmail(): string {
    const uniqueId = faker.string.uuid();
    const username = faker.internet.displayName().toLowerCase();
    return `${username}_${uniqueId}@automation.test`;
  }

  /**
   * Generate complete user data with unique identifiers
   * @return {UserData} Complete user registration data object
   */
  static generateUserData(): UserData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const birthDate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });

    return {
      name: `${firstName} ${lastName}`,
      email: this.generateUniqueEmail(),
      password: faker.internet.password({
        length: 12,
        memorable: false,
        pattern: /[A-Za-z0-9!@#$]/,
      }),
      title: faker.helpers.arrayElement(['Mr', 'Mrs']),
      birth_date: birthDate.getDate().toString(),
      birth_month: birthDate.toLocaleString('en-US', { month: 'long' }),
      birth_year: birthDate.getFullYear().toString(),
      firstname: firstName,
      lastname: lastName,
      company: faker.company.name(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      country: 'India',
      zipcode: faker.location.zipCode(),
      state: faker.location.state(),
      city: faker.location.city(),
      mobile_number: faker.phone.number(),
    };
  }

  /**
   * Generate invalid user data for negative testing
   * @return {Partial<UserData>} Partial user data with invalid values
   */
  static generateInvalidUserData(): Partial<UserData> {
    return {
      email: faker.lorem.word(),
      password: faker.string.alphanumeric(3),
      name: '',
      mobile_number: faker.lorem.word(),
    };
  }

  /**
   * Generate complete but invalid user data for negative testing
   * @return {UserData} Complete user data with invalid/edge case values
   */
  static generateCompleteInvalidUserData(): UserData {
    const invalidBirthDate = faker.date.birthdate({
      min: 1,
      max: 10,
      mode: 'age',
    });

    return {
      name: '',
      email: faker.lorem.word(),
      password: faker.string.alphanumeric(3),
      title: faker.helpers.arrayElement(['Mr', 'Mrs']),
      birth_date: invalidBirthDate.getDate().toString(),
      birth_month: invalidBirthDate.toLocaleString('en-US', { month: 'long' }),
      birth_year: invalidBirthDate.getFullYear().toString(),
      firstname: '',
      lastname: '',
      company: faker.lorem.word(),
      address1: faker.lorem.word(),
      country: faker.location.countryCode(),
      zipcode: faker.location.zipCode(),
      state: faker.location.state({ abbreviated: true }),
      city: faker.location.city(),
      mobile_number: faker.lorem.word(),
    };
  }

  /**
   * Generate non-existent but valid format credentials for negative login tests
   * @return {{ email: string; password: string }} Valid format credentials that don't exist in system
   */
  static generateNonExistentCredentials(): { email: string; password: string } {
    return {
      email: this.generateUniqueEmail(),
      password: faker.internet.password({ length: 12 }),
    };
  }
}
