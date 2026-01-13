/// <reference types="cypress" />

import { faker } from '@faker-js/faker';
import { UserDataFactory } from '../../../support/data/userDataFactory';
import { PaymentDataFactory } from '../../../support/data/paymentDataFactory';
import { AuthenticationPage } from '../../../support/pages/authentication/authentication.page';
import { ProductsPage } from '../../../support/pages/products/products.page';
import { CartPage } from '../../../support/pages/cart/cart.page';
import { CheckoutPage } from '../../../support/pages/checkout/checkout.page';
import { NavbarComponent } from '../../../support/pages/components/common/navbar.component';
import { UserService } from '../../../support/api/clients/user.service';
import { StatusCodes } from 'http-status-codes';
import { ServiceFactory } from '../../../support/api/factories/serviceFactory';

/**
 * Order Completion Tests - UI + API Hybrid
 * Tests end-to-end purchase flow and order verification
 */
describe('Order Completion - Purchase + Order History @critical @e2e', () => {
  const authPage = new AuthenticationPage();
  const productsPage = new ProductsPage();
  const cartPage = new CartPage();
  const checkoutPage = new CheckoutPage();
  const navbar = new NavbarComponent();
  let userService: UserService;

  before(() => {
    userService = new UserService();
  });

  beforeEach(() => {
    authPage.navigateToAuthenticationPage();
  });

  it('should complete purchase flow and verify order confirmation and user via API', () => {
    const testUser = UserDataFactory.generateUserData();

    authPage.startSignup(testUser.name, testUser.email);
    authPage.completeRegistration(testUser);
    authPage.registrationForm.clickContinue();

    authPage.verifyUserLoggedIn();

    navbar.goToProducts();
    productsPage.getProductNames().then((productNames) => {
      if (productNames[0]) {
        productsPage.addProductToCartAndContinue(productNames[0]);
      }
      if (productNames.length > 1 && productNames[1]) {
        productsPage.addProductToCartAndContinue(productNames[1]);
      }
    });

    navbar.goToCart();
    cartPage.getCartItemCount().then((count) => {
      expect(count).to.be.gt(0);
    });

    cartPage.proceedToCheckout();

    checkoutPage.addOrderComment(faker.lorem.sentence());
    checkoutPage.placeOrder();

    checkoutPage.verifyPayButtonVisible();

    const paymentData = PaymentDataFactory.generatePaymentData();
    checkoutPage.completePayment(paymentData);

    checkoutPage.verifyPaymentSuccess();

    userService.getUserByEmail(testUser.email).then((response) => {
      const body = response.body;

      softExpect(response.status).to.eq(StatusCodes.OK);
      softExpect(body.user.email).to.eq(testUser.email);
      expect(body.user.name).to.eq(testUser.name);
    });

    checkoutPage.clickContinueAfterOrder();
    authPage.verifyUserLoggedIn();

    cy.then(() => {
      ServiceFactory.user.deleteUser(testUser.email, testUser.password);
    });
  });

  it('should handle checkout with single product', () => {
    const testUser = UserDataFactory.generateUserData();

    authPage.startSignup(testUser.name, testUser.email);
    authPage.completeRegistration(testUser);
    authPage.registrationForm.clickContinue();

    authPage.verifyUserLoggedIn();

    navbar.goToProducts();
    productsPage.getProductNames().then((productNames) => {
      if (productNames[0]) {
        productsPage.addProductToCartAndViewCart(productNames[0]);
      }
    });

    cartPage.verifyCartTableVisible();
    cartPage.getCartItemCount().then((count) => {
      expect(count).to.eq(1);
    });

    cartPage.proceedToCheckout();

    checkoutPage.addOrderComment(faker.lorem.sentence());
    checkoutPage.placeOrder();

    const paymentData = PaymentDataFactory.generatePaymentData();
    checkoutPage.completePayment(paymentData);

    checkoutPage.verifyOrderPlaced();
  });

  it('should validate order details match cart contents', () => {
    const testUser = UserDataFactory.generateUserData();

    authPage.startSignup(testUser.name, testUser.email);
    authPage.completeRegistration(testUser);
    authPage.registrationForm.clickContinue();

    authPage.verifyUserLoggedIn();

    navbar.goToProducts();
    productsPage.getProductNames().then((productNames) => {
      if (productNames[0]) {
        productsPage.addProductToCartAndContinue(productNames[0]);
      }
    });

    navbar.goToCart();
    cartPage.verifyCartTableVisible();

    cartPage.getCartItemCount().then((count) => {
      expect(count).to.eq(1);
    });

    cartPage.proceedToCheckout();

    checkoutPage.verifyOnCheckoutPage();

    cy.then(() => {
      ServiceFactory.user.deleteUser(testUser.email, testUser.password);
    });
  });
});
