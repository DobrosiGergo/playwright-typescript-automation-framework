/// <reference types="cypress" />

import { BaseApiClient } from './baseApiClient';
import type { Booking, BookingResponse } from '../data/types';

/**
 * BookingService - Handles booking CRUD operations for restful-booker API
 *
 * CYPRESS PATTERN: Returns Cypress.Chainable, no async/await
 */
export class BookingService extends BaseApiClient {
  constructor() {
    super(Cypress.env('RESTFUL_BOOKER_BASE_URL') || 'https://restful-booker.herokuapp.com');
  }

  /**
   * Get all booking IDs with optional filtering
   */
  getAllBookingIds(params?: {
    firstname?: string;
    lastname?: string;
    checkin?: string;
    checkout?: string;
  }): Cypress.Chainable<Cypress.Response<any>> {
    return this.get('/booking', params ? { qs: params } : undefined);
  }

  /**
   * Get booking details by ID
   * @param {number} bookingId - The booking ID to retrieve
   * @return {Cypress.Chainable<Cypress.Response<any>>} Cypress response containing booking details
   */
  getBookingById(bookingId: number): Cypress.Chainable<Cypress.Response<any>> {
    return this.get(`/booking/${bookingId}`);
  }

  /**
   * Create a new booking
   * @param {Booking} bookingData - Booking information (firstname, lastname, dates, etc.)
   * @return {Cypress.Chainable<Cypress.Response<BookingResponse>>} Cypress response containing created booking
   */
  createBooking(bookingData: Booking): Cypress.Chainable<Cypress.Response<BookingResponse>> {
    cy.log(`API: Creating booking for ${bookingData.firstname} ${bookingData.lastname}`);
    return this.post('/booking', {
      body: bookingData,
    });
  }

  /**
   * Update an existing booking (full update, requires authentication)
   */
  updateBooking(
    bookingId: number,
    bookingData: Booking,
    token?: string,
  ): Cypress.Chainable<Cypress.Response<any>> {
    cy.log(`API: Updating booking ${bookingId}`);
    return this.put(`/booking/${bookingId}`, {
      body: bookingData,
      headers: token ? { Cookie: `token=${token}` } : undefined,
    });
  }

  /**
   * Partially update a booking (PATCH, requires authentication)
   */
  partialUpdateBooking(
    bookingId: number,
    bookingData: Partial<Booking>,
    token?: string,
  ): Cypress.Chainable<Cypress.Response<any>> {
    cy.log(`API: Partially updating booking ${bookingId}`);
    return this.patch(`/booking/${bookingId}`, {
      body: bookingData,
      headers: token ? { Cookie: `token=${token}` } : undefined,
    });
  }

  /**
   * Delete a booking (requires authentication)
   * @param {number} bookingId - The booking ID to delete
   * @param {string} [token] - Optional authentication token
   * @return {Cypress.Chainable<Cypress.Response<any>>} Cypress response object
   */
  deleteBooking(bookingId: number, token?: string): Cypress.Chainable<Cypress.Response<any>> {
    cy.log(`API: Deleting booking ${bookingId}`);
    return this.delete(`/booking/${bookingId}`, {
      headers: token ? { Cookie: `token=${token}` } : undefined,
    });
  }
}
