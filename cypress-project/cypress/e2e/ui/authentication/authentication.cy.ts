/// <reference types="cypress" />

import { faker } from '@faker-js/faker';
import { UserDataFactory } from '../../../support/data/userDataFactory';
import { AuthenticationPage } from '../../../support/pages/authentication/authentication.page';
import { UserService } from '../../../support/api/clients/user.service';
import { StatusCodes } from 'http-status-codes';
import { USER_API_MESSAGES } from '../../../support/api/data/userConstants';

/**
 * Authentication Tests - UI + API Hybrid
 * Tests user registration, login, and error handling scenarios
 */
describe('Authentication @critical', () => {
  const authPage = new AuthenticationPage();
  let userService: UserService;

  before(() => {
    userService = new UserService();
  });

  beforeEach(() => {
    authPage.navigateToAuthenticationPage();
  });

  describe('Positive Test Cases @smoke', () => {
    let testUser: ReturnType<typeof UserDataFactory.generateUserData>;

    beforeEach(() => {
      testUser = UserDataFactory.generateUserData();
    });

    it('should register new user via UI and verify user creation via API', () => {
      authPage.startSignup(testUser.name, testUser.email);
      authPage.verifyPasswordFieldVisible();

      authPage.completeRegistration(testUser);
      authPage.verifyAccountCreated();

      authPage.registrationForm.clickContinue();
      authPage.verifyNotOnSignupPage();
      authPage.verifyLoggedInAs(testUser.name);

      userService.getUserByEmail(testUser.email).then((response) => {
        const body = response.body;

        softExpect(response.status).to.eq(StatusCodes.OK);
        softExpect(body.user.email).to.eq(testUser.email);
        expect(body.user.name).to.eq(testUser.name);
      });
    });

    it('should display error for duplicate email registration', () => {
      authPage.startSignup(testUser.name, testUser.email);
      authPage.completeRegistration(testUser);
      authPage.verifyAccountCreated();
      authPage.registrationForm.clickContinue();
      authPage.logout();

      authPage.navigateToAuthenticationPage();
      authPage.startSignup(faker.person.fullName(), testUser.email);
      authPage.verifyDuplicateEmailError();
    });
  });

  describe('Negative Test Cases @negative', () => {
    it('should display error for invalid login credentials via UI and verify via API', () => {
      const invalidCredentials = UserDataFactory.generateNonExistentCredentials();

      authPage.login(invalidCredentials.email, invalidCredentials.password);
      authPage.verifyInvalidLoginError();

      userService
        .verifyLogin(invalidCredentials.email, invalidCredentials.password)
        .then((response) => {
          const body = response.body;

          softExpect(response.status).to.eq(StatusCodes.OK);
          softExpect(body.responseCode).to.eq(StatusCodes.NOT_FOUND);
          expect(body.message).to.contain(USER_API_MESSAGES.USER_NOT_FOUND);
        });
    });

    it('should handle invalid email format during registration', () => {
      const invalidData = UserDataFactory.generateInvalidUserData();
      authPage.startSignup(faker.person.fullName(), invalidData.email ?? '');
      authPage.verifyOnLoginPage();
    });

    it('should handle empty required fields during registration', () => {
      authPage.clickSignupButton();
      authPage.verifyOnLoginPage();
      authPage.verifySignupNameFieldInvalid();

      authPage.navigateToAuthenticationPage();
      authPage.enterSignupName(faker.person.fullName());
      authPage.clickSignupButton();
      authPage.verifyOnLoginPage();
      authPage.verifySignupEmailFieldInvalid();
    });

    it('should validate login with non-existent user via UI and API', () => {
      const nonExistentUser = UserDataFactory.generateNonExistentCredentials();

      authPage.login(nonExistentUser.email, nonExistentUser.password);
      authPage.verifyInvalidLoginError();

      userService.verifyLogin(nonExistentUser.email, nonExistentUser.password).then((response) => {
        const body = response.body;

        softExpect(response.status).to.eq(StatusCodes.OK);
        softExpect(body.responseCode).to.eq(StatusCodes.NOT_FOUND);
        expect(body.message).to.contain(USER_API_MESSAGES.USER_NOT_FOUND);
      });
    });
  });
});
