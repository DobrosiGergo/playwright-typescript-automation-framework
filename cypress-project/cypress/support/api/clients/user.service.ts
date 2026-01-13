/// <reference types="cypress" />

import { BaseApiClient } from "./baseApiClient";

/**
 * UserService - Handles user-related API operations for backend validation
 *
 * CYPRESS PATTERN: Returns Cypress.Chainable, no async/await
 */
export class UserService extends BaseApiClient {
  constructor() {
    super(
      Cypress.env("BACKEND_API_BASE_URL") ||
        "https://automationexercise.com/api",
    );
  }

  /**
   * Create a new user account via API
   */
  createUser(userData: {
    name: string;
    email: string;
    password: string;
    title: string;
    birth_date: string;
    birth_month: string;
    birth_year: string;
    firstname: string;
    lastname: string;
    company: string;
    address1: string;
    address2?: string;
    country: string;
    zipcode: string;
    state: string;
    city: string;
    mobile_number: string;
  }): Cypress.Chainable<Cypress.Response<any>> {
    const boundary = `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
    let body = "";

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        body += `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
        body += `${value}\r\n`;
      }
    });
    body += `--${boundary}--\r\n`;

    return cy
      .request({
        method: "POST",
        url: `${this.baseUrl}/createAccount`,
        body: body,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
        },
        failOnStatusCode: false,
      })
      .then((response) => {
        if (
          typeof response.body === "string" &&
          response.body.trim().startsWith("{")
        ) {
          response.body = JSON.parse(response.body);
        }
        return response;
      });
  }

  /**
   * Get user details by email address
   * @param {string} email - The email address of the user to retrieve
   * @return {Cypress.Chainable<Cypress.Response<any>>} Cypress response containing user details
   */
  getUserByEmail(email: string): Cypress.Chainable<Cypress.Response<any>> {
    return cy
      .request({
        method: "GET",
        url: `${this.baseUrl}/getUserDetailByEmail`,
        qs: { email },
        failOnStatusCode: false,
      })
      .then((response) => {
        if (
          typeof response.body === "string" &&
          response.body.trim().startsWith("{")
        ) {
          response.body = JSON.parse(response.body);
        }
        return response;
      });
  }

  /**
   * Verify login credentials for a user
   * @param {string} email - The user's email address
   * @param {string} password - The user's password
   * @return {Cypress.Chainable<Cypress.Response<any>>} Cypress response containing login verification result
   */
  verifyLogin(
    email: string,
    password: string,
  ): Cypress.Chainable<Cypress.Response<any>> {
    const boundary = `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
    let body = "";
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="email"\r\n\r\n${email}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="password"\r\n\r\n${password}\r\n`;
    body += `--${boundary}--\r\n`;

    return cy
      .request({
        method: "POST",
        url: `${this.baseUrl}/verifyLogin`,
        body: body,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
        },
        failOnStatusCode: false,
      })
      .then((response) => {
        if (
          typeof response.body === "string" &&
          response.body.trim().startsWith("{")
        ) {
          response.body = JSON.parse(response.body);
        }
        return response;
      });
  }

  /**
   * Delete user account
   * @param {string} email - The user's email address
   * @param {string} password - The user's password for authentication
   * @return {Cypress.Chainable<Cypress.Response<any>>} Cypress response object
   */
  deleteUser(
    email: string,
    password: string,
  ): Cypress.Chainable<Cypress.Response<any>> {
    const boundary = `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
    let body = "";
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="email"\r\n\r\n${email}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="password"\r\n\r\n${password}\r\n`;
    body += `--${boundary}--\r\n`;

    return cy.request({
      method: "DELETE",
      url: `${this.baseUrl}/deleteAccount`,
      body: body,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      failOnStatusCode: false,
    });
  }
}
