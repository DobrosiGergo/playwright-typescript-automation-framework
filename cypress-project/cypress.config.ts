import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from parent folder (reuse Playwright's env file)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'https://automationexercise.com',
    env: {
      BACKEND_API_BASE_URL:
        process.env.BACKEND_API_BASE_URL || 'https://automationexercise.com/api',
      RESTFUL_BOOKER_BASE_URL:
        process.env.RESTFUL_BOOKER_BASE_URL || 'https://restful-booker.herokuapp.com',
      DEBUG_LOGGING: process.env.DEBUG_LOGGING || 'false',
    },
    setupNodeEvents(_on, config) {
      // Allure reporter integration
      // require('@mmisty/cypress-allure-adapter/writer').default(on, config);
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
  },

  retries: {
    runMode: 0,
    openMode: 0,
  },

  video: false,
  screenshotOnRunFailure: false,

  viewportWidth: 1280,
  viewportHeight: 720,

  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 30000,

  chromeWebSecurity: false,
  watchForFileChanges: true,
});
