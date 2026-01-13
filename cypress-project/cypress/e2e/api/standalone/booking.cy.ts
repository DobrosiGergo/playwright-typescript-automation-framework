/// <reference types="cypress" />
import { StatusCodes } from "http-status-codes";
import {
  BookingDataFactory,
  BOOKING_VALIDATION,
} from "../../../support/api/data/bookingDataFactory";
import { BookingService } from "../../../support/api/clients/booking.service";
import { AuthService } from "../../../support/api/clients/auth.service";
import { generateValidCredentials } from "../../../support/api/data/authDataFactory";
import type { Booking } from "../../../support/api/data/types";

/**
 * Booking API Tests - CRUD operations
 * Covers all user stories for booking management
 */
describe("Booking API @api @standalone @critical", () => {
  const bookingService = new BookingService();
  const authService = new AuthService();
  const defaultCredentials = generateValidCredentials();

  describe("Positive Test Cases @smoke", () => {
    let sharedBooking: Booking;
    let sharedBookingId: number;
    let authToken: string;

    before(() => {
      sharedBooking = BookingDataFactory.generateBooking();

      cy.wrap(null).then(() => {
        bookingService.createBooking(sharedBooking).then((response) => {
          expect(response.status).to.eq(StatusCodes.OK);
          sharedBookingId = response.body.bookingid;
        });

        authService.createToken(defaultCredentials).then((response) => {
          authToken = response.body.token;
        });
      });
    });

    after(() => {
      if (sharedBookingId && authToken) {
        bookingService.deleteBooking(sharedBookingId, authToken);
      }
    });

    it("should create a new booking and verify details", () => {
      const uniqueBooking = BookingDataFactory.generateBooking();

      bookingService.createBooking(uniqueBooking).then((createResponse) => {
        softExpect(createResponse.status).to.eq(StatusCodes.OK);

        const createdBookingId = createResponse.body.bookingid;

        softExpect(createResponse.body.booking.firstname).to.eq(
          uniqueBooking.firstname,
        );
        softExpect(createResponse.body.booking.lastname).to.eq(
          uniqueBooking.lastname,
        );
        softExpect(createResponse.body.booking.totalprice).to.eq(
          uniqueBooking.totalprice,
        );
        softExpect(createResponse.body.booking.depositpaid).to.eq(
          uniqueBooking.depositpaid,
        );
        softExpect(createResponse.body.booking.bookingdates.checkin).to.eq(
          uniqueBooking.bookingdates.checkin,
        );
        softExpect(createResponse.body.booking.bookingdates.checkout).to.eq(
          uniqueBooking.bookingdates.checkout,
        );

        bookingService.getBookingById(createdBookingId).then((getResponse) => {
          softExpect(getResponse.status).to.eq(StatusCodes.OK);
          softExpect(getResponse.body.firstname).to.eq(uniqueBooking.firstname);
          softExpect(getResponse.body.lastname).to.eq(uniqueBooking.lastname);
          expect(getResponse.body.totalprice).to.eq(uniqueBooking.totalprice);
        });
      });
    });

    it("should retrieve all booking IDs", () => {
      bookingService.getAllBookingIds().then((response) => {
        softExpect(response.status).to.eq(StatusCodes.OK);
        softExpect(response.body).to.be.an("array");
        expect(response.body.length).to.be.greaterThan(
          BOOKING_VALIDATION.MIN_BOOKING_IDS_COUNT,
        );
      });
    });

    it("should filter bookings by name using shared booking", () => {
      bookingService
        .getAllBookingIds({ firstname: sharedBooking.firstname })
        .then((response) => {
          softExpect(response.status).to.eq(StatusCodes.OK);
          softExpect(response.body).to.be.an("array");

          const foundBooking = response.body.find(
            (b: { bookingid: number }) => b.bookingid === sharedBookingId,
          );
          void expect(foundBooking).to.exist;
        });
    });

    it("should update an existing booking", () => {
      const uniqueBooking = BookingDataFactory.generateBooking();

      bookingService.createBooking(uniqueBooking).then((createResponse) => {
        const createdBookingId = createResponse.body.bookingid;
        const updatedBooking =
          BookingDataFactory.generateUpdatedBooking(uniqueBooking);

        authService.createToken(defaultCredentials).then((authResponse) => {
          const token = authResponse.body.token;

          bookingService
            .updateBooking(createdBookingId, updatedBooking, token)
            .then((updateResponse) => {
              softExpect(updateResponse.status).to.eq(StatusCodes.OK);
              softExpect(updateResponse.body.totalprice).to.eq(
                updatedBooking.totalprice,
              );
              softExpect(updateResponse.body.additionalneeds).to.eq(
                updatedBooking.additionalneeds,
              );

              bookingService
                .getBookingById(createdBookingId)
                .then((getResponse) => {
                  softExpect(getResponse.body.totalprice).to.eq(
                    updatedBooking.totalprice,
                  );
                  expect(getResponse.body.additionalneeds).to.eq(
                    updatedBooking.additionalneeds,
                  );
                });
            });
        });
      });
    });

    it("should partially update a booking", () => {
      const uniqueBooking = BookingDataFactory.generateBooking();

      bookingService.createBooking(uniqueBooking).then((createResponse) => {
        const createdBookingId = createResponse.body.bookingid;
        const partialUpdate = BookingDataFactory.generatePartialUpdate();

        authService.createToken(defaultCredentials).then((authResponse) => {
          const token = authResponse.body.token;

          bookingService
            .partialUpdateBooking(createdBookingId, partialUpdate, token)
            .then((updateResponse) => {
              softExpect(updateResponse.status).to.eq(StatusCodes.OK);
              softExpect(updateResponse.body.firstname).to.eq(
                partialUpdate.firstname,
              );
              softExpect(updateResponse.body.lastname).to.eq(
                partialUpdate.lastname,
              );
              expect(updateResponse.body.totalprice).to.eq(
                uniqueBooking.totalprice,
              );
            });
        });
      });
    });

    it("should delete a booking and verify deletion", () => {
      const uniqueBooking = BookingDataFactory.generateBooking();

      bookingService.createBooking(uniqueBooking).then((createResponse) => {
        expect(createResponse.status).to.eq(StatusCodes.OK);
        const createdBookingId = createResponse.body.bookingid;

        authService.createToken(defaultCredentials).then((authResponse) => {
          const token = authResponse.body.token;

          bookingService
            .deleteBooking(createdBookingId, token)
            .then((deleteResponse) => {
              softExpect(deleteResponse.status).to.eq(StatusCodes.CREATED);

              bookingService
                .getBookingById(createdBookingId)
                .then((getResponse) => {
                  expect(getResponse.status).to.eq(StatusCodes.NOT_FOUND);
                });
            });
        });
      });
    });
  });

  describe("Negative Test Cases @negative", () => {
    it("should reject update without authentication token", () => {
      const uniqueBooking = BookingDataFactory.generateBooking();

      bookingService.createBooking(uniqueBooking).then((createResponse) => {
        const createdBookingId = createResponse.body.bookingid;
        const updatedBooking =
          BookingDataFactory.generateUpdatedBooking(uniqueBooking);

        bookingService
          .updateBooking(createdBookingId, updatedBooking)
          .then((response) => {
            expect(response.status).to.eq(StatusCodes.FORBIDDEN);
          });
      });
    });

    it("should reject delete without authentication token", () => {
      const uniqueBooking = BookingDataFactory.generateBooking();

      bookingService.createBooking(uniqueBooking).then((createResponse) => {
        const createdBookingId = createResponse.body.bookingid;

        bookingService.deleteBooking(createdBookingId).then((response) => {
          expect(response.status).to.eq(StatusCodes.FORBIDDEN);
        });
      });
    });

    it("should return 404 for non-existent booking", () => {
      const nonExistentId = BookingDataFactory.generateNonExistentBookingId();

      bookingService.getBookingById(nonExistentId).then((response) => {
        expect(response.status).to.eq(StatusCodes.NOT_FOUND);
      });
    });
  });
});
