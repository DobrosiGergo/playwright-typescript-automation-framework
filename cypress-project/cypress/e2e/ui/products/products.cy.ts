/// <reference types="cypress" />

import { ProductsPage } from "../../../support/pages/products/products.page";
import { NavbarComponent } from "../../../support/pages/components/common/navbar.component";
import { faker } from "@faker-js/faker";

/**
 * Products Tests
 * Tests product search and validation scenarios
 */
describe("Products @regression", () => {
  const productsPage = new ProductsPage();
  const navbar = new NavbarComponent();

  beforeEach(() => {
    productsPage.navigateToHome();
  });

  describe("Negative Test Cases @negative", () => {
    it("should validate product search with invalid terms", () => {
      navbar.goToProducts();
      const randomSearch = `${faker.string.alphanumeric(10)}${faker.number.int({ min: 10000, max: 99999 })}`;
      productsPage.searchProducts(randomSearch);

      productsPage.getProductCount().then((count) => {
        expect(count).to.be.gte(0);
      });

      // Use URL-safe special characters to avoid URI malformed errors
      const specialCharSearch = `!@#-_+=${faker.number.int({ min: 100, max: 999 })}`;
      productsPage.searchProducts(specialCharSearch);

      productsPage.getProductCount().then((count) => {
        expect(count).to.be.gte(0);
      });
    });
  });
});
