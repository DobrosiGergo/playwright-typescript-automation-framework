/// <reference types="cypress" />

import { BasePage } from "../base/basePage";
import type { PaymentData } from "../../utils/types";

/**
 * CheckoutPage - Handles checkout and payment flow
 * CYPRESS PATTERN: No async/await, returns this for chaining
 */
export class CheckoutPage extends BasePage {
  protected pageUrl = "/checkout";

  // Private locators
  private readonly continueButton = () => cy.contains("a", "Continue");
  private readonly checkoutUrl = () => cy.url();
  private readonly paymentDoneUrl = () => cy.url({ timeout: 15000 });
  private readonly orderPlacedText = () => cy.contains("Order Placed!");

  // Selectors
  readonly orderCommentTextarea = () => cy.get('textarea[name="message"]');
  readonly placeOrderButton = () => cy.contains("a", "Place Order");

  // Payment form selectors
  readonly cardNameInput = () => cy.get('input[name="name_on_card"]');
  readonly cardNumberInput = () => cy.get('input[name="card_number"]');
  readonly cvcInput = () => cy.get('input[name="cvc"]');
  readonly expiryMonthInput = () => cy.get('input[name="expiry_month"]');
  readonly expiryYearInput = () => cy.get('input[name="expiry_year"]');
  readonly payAndConfirmButton = () => cy.get('button[data-qa="pay-button"]');

  // Success/Error messages
  readonly successMessage = () => cy.get('div[class*="alert-success"]');
  readonly orderPlacedMessage = () => cy.contains("Order Placed!");

  /**
   * Add order comment
   * @param {string} comment - Comment/message for the order
   * @return {this} Returns this for method chaining
   */
  addOrderComment(comment: string): this {
    this.orderCommentTextarea().clear().type(comment);
    return this;
  }

  /**
   * Click place order button
   * @return {this} Returns this for method chaining
   */
  placeOrder(): this {
    this.placeOrderButton().click();
    return this;
  }

  /**
   * Fill payment details
   * @param {Object} paymentData - Payment information
   * @param {string} paymentData.nameOnCard - Name on credit card
   * @param {string} paymentData.cardNumber - Credit card number
   * @param {string} paymentData.cvc - Card CVC/CVV code
   * @param {string} paymentData.expiryMonth - Card expiry month
   * @param {string} paymentData.expiryYear - Card expiry year
   * @return {this} Returns this for method chaining
   */
  fillPaymentDetails(paymentData: PaymentData): this {
    this.cardNameInput().clear().type(paymentData.nameOnCard);
    this.cardNumberInput().clear().type(paymentData.cardNumber);
    this.cvcInput().clear().type(paymentData.cvc);
    this.expiryMonthInput().clear().type(paymentData.expiryMonth);
    this.expiryYearInput().clear().type(paymentData.expiryYear);
    return this;
  }

  /**
   * Click pay and confirm button
   * @return {this} Returns this for method chaining
   */
  payAndConfirm(): this {
    this.payAndConfirmButton().click();
    return this;
  }

  /**
   * Complete payment (fill details + confirm)
   * @param {Object} paymentData - Payment information
   * @param {string} paymentData.nameOnCard - Name on credit card
   * @param {string} paymentData.cardNumber - Credit card number
   * @param {string} paymentData.cvc - Card CVC/CVV code
   * @param {string} paymentData.expiryMonth - Card expiry month
   * @param {string} paymentData.expiryYear - Card expiry year
   * @return {this} Returns this for method chaining
   */
  completePayment(paymentData: PaymentData): this {
    this.fillPaymentDetails(paymentData);
    this.payAndConfirm();
    return this;
  }

  /**
   * Facade: Complete entire checkout flow (place order + payment)
   * @param {Object} paymentData - Payment information
   * @param {string} paymentData.nameOnCard - Name on credit card
   * @param {string} paymentData.cardNumber - Credit card number
   * @param {string} paymentData.cvc - Card CVC/CVV code
   * @param {string} paymentData.expiryMonth - Card expiry month
   * @param {string} paymentData.expiryYear - Card expiry year
   * @param {string} [comment] - Optional order comment/message
   * @return {this} Returns this for method chaining
   */
  completeCheckout(paymentData: PaymentData, comment?: string): this {
    cy.log("Completing entire checkout flow");

    if (comment) {
      this.addOrderComment(comment);
    }

    this.placeOrder();
    this.completePayment(paymentData);
    return this;
  }

  /**
   * Facade: Verify order status (success message, placed message, or payment done URL)
   * @param {('success'|'placed'|'paymentUrl'|'checkoutUrl')} [type='success'] - Type of verification to perform
   * @return {this} Returns this for method chaining
   */
  verifyOrderStatus(
    type: "success" | "placed" | "paymentUrl" | "checkoutUrl" = "success",
  ): this {
    switch (type) {
      case "success":
        this.orderPlacedMessage().should("be.visible");
        this.successMessage().should(
          "contain",
          "Congratulations! Your order has been confirmed!",
        );
        break;
      case "placed":
        this.orderPlacedText().should("be.visible");
        break;
      case "paymentUrl":
        this.paymentDoneUrl().should("include", "/payment_done");
        break;
      case "checkoutUrl":
        this.checkoutUrl().should("include", "/checkout");
        break;
    }
    return this;
  }

  /**
   * @deprecated Use verifyOrderStatus('success') instead
   * @return {this} Returns this for method chaining
   */
  verifyOrderSuccess(): this {
    return this.verifyOrderStatus("success");
  }

  /**
   * Verify pay button is visible
   * @return {this} Returns this for method chaining
   */
  verifyPayButtonVisible(): this {
    this.payAndConfirmButton().should("be.visible");
    return this;
  }

  /**
   * @deprecated Use verifyOrderStatus('paymentUrl') instead
   * @return {this} Returns this for method chaining
   */
  verifyPaymentSuccess(): this {
    return this.verifyOrderStatus("paymentUrl");
  }

  /**
   * @deprecated Use verifyOrderStatus('placed') instead
   * @return {this} Returns this for method chaining
   */
  verifyOrderPlaced(): this {
    return this.verifyOrderStatus("placed");
  }

  /**
   * @deprecated Use verifyOrderStatus('checkoutUrl') instead
   * @return {this} Returns this for method chaining
   */
  verifyOnCheckoutPage(): this {
    return this.verifyOrderStatus("checkoutUrl");
  }

  /**
   * Click continue button after order placed
   * @return {this} Returns this for method chaining
   */
  clickContinueAfterOrder(): this {
    this.continueButton().click();
    return this;
  }

  /**
   * Get order placed message
   * @return {Cypress.Chainable<string>} Order placed message text
   */
  getOrderPlacedMessage(): Cypress.Chainable<string> {
    return this.orderPlacedMessage().invoke("text");
  }
}
