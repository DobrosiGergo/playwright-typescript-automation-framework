import { faker } from "@faker-js/faker";
import { PaymentData } from "./types";

/**
 * Payment Data Factory - Generates test payment data
 * Reused from Playwright implementation with no changes needed
 */
export class PaymentDataFactory {
  /**
   * Generate valid test payment data
   * @return {PaymentData} Valid payment data for testing
   */
  static generatePaymentData(): PaymentData {
    const currentYear = new Date().getFullYear();

    return {
      nameOnCard: faker.person.fullName(),
      cardNumber: faker.finance
        .creditCardNumber("#### #### #### ####")
        .replace(/\s/g, ""),
      cvc: faker.finance.creditCardCVV(),
      expiryMonth: faker.number
        .int({ min: 1, max: 12 })
        .toString()
        .padStart(2, "0"),
      expiryYear: (
        currentYear + faker.number.int({ min: 1, max: 5 })
      ).toString(),
    };
  }

  /**
   * Generate invalid payment data for negative testing
   * @return {Partial<PaymentData>} Partial payment data with invalid values
   */
  static generateInvalidPaymentData(): Partial<PaymentData> {
    return {
      nameOnCard: "",
      cardNumber: faker.string.numeric(4),
      cvc: faker.string.numeric(2),
      expiryMonth: faker.number.int({ min: 13, max: 99 }).toString(),
      expiryYear: faker.date.past({ years: 5 }).getFullYear().toString(),
    };
  }
}
