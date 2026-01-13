// cypress/support/commands.ts
// Custom Cypress commands for reusable workflows

/// <reference types="cypress" />

import type { UserData } from './data/types';
import { ServiceFactory } from './api/factories/serviceFactory';
import { AuthenticationPage } from './pages/authentication/authentication.page';
import { ProductsPage } from './pages/products/products.page';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login via UI using page objects
       * @param {string} email - User's email address
       * @param {string} password - User's password
       * @return {Chainable<void>} Chainable void for command chaining
       * @example cy.loginViaUI('user@example.com', 'password123')
       */
      loginViaUI(email: string, password: string): Chainable<void>;

      /**
       * Register user via UI using page objects
       * @param {UserData} userData - Complete user registration data
       * @return {Chainable<void>} Chainable void for command chaining
       * @example cy.registerUserViaUI(userData)
       */
      registerUserViaUI(userData: UserData): Chainable<void>;

      /**
       * Create user via API (native fetch)
       * @param {UserData} userData - Complete user registration data
       * @return {Chainable<Response<any>>} Chainable Response object
       * @example cy.createUserViaAPI(userData)
       */
      createUserViaAPI(userData: UserData): Chainable<Response<any>>;

      /**
       * Delete user via API (native fetch)
       * @param {string} email - User's email address
       * @param {string} password - User's password
       * @return {Chainable<Response<any>>} Chainable Response object
       * @example cy.deleteUserViaAPI('user@example.com', 'password123')
       */
      deleteUserViaAPI(email: string, password: string): Chainable<Response<any>>;

      /**
       * Add product to cart via UI
       * @param {string} productName - Name of the product to add to cart
       * @param {('continue'|'viewCart')} [action='continue'] - Action after adding (continue shopping or view cart)
       * @return {Chainable<void>} Chainable void for command chaining
       * @example cy.addProductToCart('Blue Top')
       * @example cy.addProductToCart('Blue Top', 'viewCart')
       */
      addProductToCart(productName: string, action?: 'continue' | 'viewCart'): Chainable<void>;

      /**
       * Navigate to a specific page
       * @param {('home'|'products'|'cart'|'login'|'signup')} page - Page to navigate to
       * @return {Chainable<void>} Chainable void for command chaining
       * @example cy.navigateToPage('products')
       */
      navigateToPage(page: 'home' | 'products' | 'cart' | 'login' | 'signup'): Chainable<void>;
    }
  }

  /**
   * Soft assertion function (not a Cypress command)
   * Collects failures without stopping test execution
   * @example softExpect(value).to.eq(expected)
   */
  function softExpect(actual: any): {
    to: {
      eq: (expected: any) => void;
      have: { property: (prop: string) => void };
      be: { a: (type: string) => void; an: (type: string) => void };
      contain: (value: any) => void;
    };
  };
}

/**
 * Login via UI using Authentication Page Object
 * @param {string} email - User's email address
 * @param {string} password - User's password
 */
Cypress.Commands.add('loginViaUI', (email: string, password: string) => {
  cy.log(`Logging in as: ${email}`);
  const authPage = new AuthenticationPage();
  authPage.navigate();
  authPage.login(email, password);
  authPage.verifyUserLoggedIn();
});

/**
 * Register user via UI using Authentication Page Object
 * @param {UserData} userData - Complete user registration data
 */
Cypress.Commands.add('registerUserViaUI', (userData: UserData) => {
  cy.log(`Registering user: ${userData.email}`);
  const authPage = new AuthenticationPage();
  authPage.registerUser(userData, false);
});

/**
 * Create user via API using ServiceFactory
 * @param {UserData} userData - Complete user registration data
 */
Cypress.Commands.add('createUserViaAPI', (userData: UserData) => {
  cy.log(`Creating user via API: ${userData.email}`);
  cy.wrap(null).then(async () => {
    return await ServiceFactory.user.createUser(userData);
  });
});

/**
 * Delete user via API using ServiceFactory
 * @param {string} email - User's email address
 * @param {string} password - User's password
 */
Cypress.Commands.add('deleteUserViaAPI', (email: string, password: string) => {
  cy.log(`Deleting user via API: ${email}`);
  cy.wrap(null).then(async () => {
    return await ServiceFactory.user.deleteUser(email, password);
  });
});

/**
 * Add product to cart via UI using Products Page Object
 * @param {string} productName - Name of the product to add to cart
 * @param {('continue'|'viewCart')} [action='continue'] - Action after adding (continue shopping or view cart)
 */
Cypress.Commands.add(
  'addProductToCart',
  (productName: string, action: 'continue' | 'viewCart' = 'continue') => {
    cy.log(`Adding "${productName}" to cart`);
    const productsPage = new ProductsPage();
    productsPage.addProductToCart(productName, action);
  },
);

/**
 * Navigate to a specific page
 * @param {('home'|'products'|'cart'|'login'|'signup')} page - Page to navigate to
 */
Cypress.Commands.add(
  'navigateToPage',
  (page: 'home' | 'products' | 'cart' | 'login' | 'signup') => {
    const pageUrls: Record<string, string> = {
      home: '/',
      products: '/products',
      cart: '/view_cart',
      login: '/login',
      signup: '/signup',
    };

    cy.log(`Navigating to: ${page}`);
    cy.visit(pageUrls[page]);
  },
);

/**
 * Soft assertion implementation for Cypress
 * Stores failures and continues test execution
 */
const softAssertionFailures: string[] = [];

/**
 * Soft expect function (not a Cypress command)
 * Use this inside .then() callbacks for API testing
 */
(global as any).softExpect = (actual: any) => {
  return {
    to: {
      eq: (expected: any) => {
        try {
          expect(actual).to.eq(expected);
        } catch (error: any) {
          softAssertionFailures.push(error.message);
        }
      },
      have: {
        property: (prop: string) => {
          try {
            expect(actual).to.have.property(prop);
          } catch (error: any) {
            softAssertionFailures.push(error.message);
          }
        },
      },
      be: {
        a: (type: string) => {
          try {
            expect(actual).to.be.a(type);
          } catch (error: any) {
            softAssertionFailures.push(error.message);
          }
        },
        an: (type: string) => {
          try {
            expect(actual).to.be.an(type);
          } catch (error: any) {
            softAssertionFailures.push(error.message);
          }
        },
      },
      contain: (value: any) => {
        try {
          expect(actual).to.contain(value);
        } catch (error: any) {
          softAssertionFailures.push(error.message);
        }
      },
    },
  };
};

// Report soft assertion failures after each test
afterEach(() => {
  if (softAssertionFailures.length > 0) {
    const failures = softAssertionFailures.join('\n');
    softAssertionFailures.length = 0; // Clear array
    throw new Error(`Soft assertion failures:\n${failures}`);
  }
});

export {};
