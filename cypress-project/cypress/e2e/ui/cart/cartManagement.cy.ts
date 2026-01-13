/// <reference types="cypress" />

import { UserDataFactory } from "../../../support/data/userDataFactory";
import { AuthenticationPage } from "../../../support/pages/authentication/authentication.page";
import { ProductsPage } from "../../../support/pages/products/products.page";
import { CartPage } from "../../../support/pages/cart/cart.page";
import { NavbarComponent } from "../../../support/pages/components/common/navbar.component";
import { UserService } from "../../../support/api/clients/user.service";
import { ProductService } from "../../../support/api/clients/product.service";
import { StatusCodes } from "http-status-codes";
import { PRODUCT_API_PROPERTIES } from "../../../support/api/data/userConstants";
import { ServiceFactory } from "../../../support/api/factories/serviceFactory";

/**
 * Cart Management Tests - UI + API Hybrid
 * Tests cart functionality with user authentication and product management
 */
describe("Cart Management - Login + Cart Verification @critical @regression", () => {
  const authPage = new AuthenticationPage();
  const productsPage = new ProductsPage();
  const cartPage = new CartPage();
  const navbar = new NavbarComponent();
  let userService: UserService;
  let productService: ProductService;

  before(() => {
    userService = new UserService();
    productService = new ProductService();
  });

  it("should create user via API, login via UI, and manage cart @hybrid @api-to-ui", () => {
    const testUser = UserDataFactory.generateUserData();

    ServiceFactory.user
      .createUser(testUser)
      .then((response) => {
        expect(response.status).to.eq(StatusCodes.OK);
        return response.json();
      })
      .then((body) => {
        expect(body.responseCode).to.eq(StatusCodes.CREATED);
      });

    productService.getAllProducts().then((response) => {
      const body = response.body;

      softExpect(response.status).to.eq(StatusCodes.OK);
      softExpect(body).to.have.property(PRODUCT_API_PROPERTIES.PRODUCTS);
      void expect(body.products).to.not.be.undefined;
      void expect(body.products.length).to.be.gt(0);
    });

    authPage.navigateToAuthenticationPage();
    authPage.login(testUser.email, testUser.password);
    authPage.verifyUserLoggedIn();

    navbar.goToProducts();
    productsPage.verifyProductsVisible();

    productsPage.getProductNames().then((productNames) => {
      expect(productNames.length).to.be.gt(0);

      if (productNames[0]) {
        productsPage.addProductToCartAndContinue(productNames[0]);
      }
    });

    navbar.goToCart();
    cartPage.verifyCartTableVisible();

    cartPage.getCartItemCount().then((count) => {
      expect(count).to.be.gt(0);
    });

    cartPage.verifyCartHasItems();

    cy.then(() => {
      ServiceFactory.user.deleteUser(testUser.email, testUser.password);
    });
  });

  it("should login via UI, add products to cart, and verify user state via API", () => {
    const testUser = UserDataFactory.generateUserData();

    authPage.navigateToAuthenticationPage();
    authPage.startSignup(testUser.name, testUser.email);
    authPage.completeRegistration(testUser);
    authPage.registrationForm.clickContinue();

    authPage.verifyUserLoggedIn();

    navbar.goToProducts();
    productsPage.verifyProductsVisible();

    productsPage.getProductNames().then((productNames) => {
      expect(productNames.length).to.be.gt(0);

      if (productNames[0]) {
        productsPage.addProductToCartAndContinue(productNames[0]);
        productsPage.verifyContinueShoppingNotVisible();
        productsPage.verifyProductsVisible();
      }

      if (productNames.length > 1 && productNames[1]) {
        productsPage.addProductToCartAndContinue(productNames[1]);
        productsPage.verifyContinueShoppingNotVisible();
        productsPage.verifyProductsVisible();
      }
    });

    navbar.goToCart();
    cartPage.verifyCartTableVisible();

    cartPage.getCartItemCount().then((count) => {
      expect(count).to.be.gt(0);
      expect(count).to.be.lte(2);
    });

    cartPage.verifyCartHasItems();

    userService.getUserByEmail(testUser.email).then((response) => {
      const body = response.body;

      softExpect(response.status).to.eq(StatusCodes.OK);
      softExpect(body.user.email).to.eq(testUser.email);
      expect(body.user.name).to.eq(testUser.name);
    });

    authPage.verifyUserLoggedIn();
  });

  it("should handle basic cart operations without login", () => {
    authPage.navigateToHome();
    navbar.verifyHomeVisible();

    navbar.goToProducts();
    productsPage.verifyProductsVisible();

    productsPage.getProductNames().then((productNames) => {
      if (productNames[0]) {
        productsPage.addProductToCartAndViewCart(productNames[0]);
      }
    });

    cartPage.verifyCartTableVisible();

    cartPage.getCartItemCount().then((count) => {
      expect(count).to.eq(1);
    });

    cartPage.getCartItems().then((items) => {
      expect(items.length).to.be.gt(0);
    });
  });
});
