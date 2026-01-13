/// <reference types="cypress" />
import { StatusCodes } from 'http-status-codes';
import { faker } from '@faker-js/faker';
import { UserDataFactory } from '../../../support/data/userDataFactory';
import { UserService } from '../../../support/api/clients/user.service';
import type { UserData } from '../../../support/data/types';
import { USER_API_MESSAGES } from '../../../support/api/data/userConstants';

/**
 * User API Tests - Backend API validation for UI testing
 * Tests user-related API endpoints for automationexercise.com
 */
describe('User Backend API @api @backend @critical', () => {
  const userService = new UserService();
  let testUser: UserData;

  describe('Positive Test Cases @smoke', () => {
    beforeEach(() => {
      testUser = UserDataFactory.generateUserData();
    });

    afterEach(() => {
      if (testUser) {
        userService.deleteUser(testUser.email, testUser.password);
      }
    });

    it('should create user account via API', () => {
      userService.createUser(testUser).then((response) => {
        softExpect(response.status).to.eq(StatusCodes.OK);
        softExpect(response.body.responseCode).to.eq(StatusCodes.CREATED);
        expect(response.body.message).to.contain(USER_API_MESSAGES.USER_CREATED);
      });
    });

    it('should verify login with valid credentials', () => {
      userService.createUser(testUser).then(() => {
        userService.verifyLogin(testUser.email, testUser.password).then((loginResponse) => {
          softExpect(loginResponse.status).to.eq(StatusCodes.OK);
          softExpect(loginResponse.body.responseCode).to.eq(StatusCodes.OK);
          expect(loginResponse.body.message).to.contain(USER_API_MESSAGES.USER_EXISTS);
        });
      });
    });

    it('should get user details by email', () => {
      userService.createUser(testUser).then(() => {
        userService.getUserByEmail(testUser.email).then((getUserResponse) => {
          softExpect(getUserResponse.status).to.eq(StatusCodes.OK);
          softExpect(getUserResponse.body.user.email).to.eq(testUser.email);
          softExpect(getUserResponse.body.user.name).to.eq(testUser.name);
          softExpect(getUserResponse.body.user.first_name).to.eq(testUser.firstname);
          expect(getUserResponse.body.user.last_name).to.eq(testUser.lastname);
        });
      });
    });
  });

  describe('Negative Test Cases @negative', () => {
    it('should return error for invalid login credentials', () => {
      userService
        .verifyLogin(faker.internet.email(), faker.internet.password())
        .then((loginResponse) => {
          softExpect(loginResponse.status).to.eq(StatusCodes.OK);
          softExpect(loginResponse.body.responseCode).to.eq(StatusCodes.NOT_FOUND);
          expect(loginResponse.body.message).to.contain(USER_API_MESSAGES.USER_NOT_FOUND);
        });
    });

    it('should return error for non-existent user email', () => {
      userService.getUserByEmail(faker.internet.email()).then((getUserResponse) => {
        softExpect(getUserResponse.status).to.eq(StatusCodes.OK);
        softExpect(getUserResponse.body.responseCode).to.eq(StatusCodes.NOT_FOUND);
        expect(getUserResponse.body.message).to.contain(USER_API_MESSAGES.ACCOUNT_NOT_FOUND);
      });
    });
  });
});
