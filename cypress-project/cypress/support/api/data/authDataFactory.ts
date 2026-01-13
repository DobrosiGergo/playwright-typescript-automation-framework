import { faker } from '@faker-js/faker';
import type { AuthCredentials } from './types';

/**
 * Auth API error messages
 */
export const AUTH_ERROR_MESSAGES = {
  BAD_CREDENTIALS: 'Bad credentials',
} as const;

/**
 * Auth API response property names
 */
export const AUTH_API_PROPERTIES = {
  TOKEN: 'token',
  REASON: 'reason',
} as const;

/**
 * Auth response validation constants
 */
export const AUTH_VALIDATION = {
  TOKEN_TYPE: 'string',
  MIN_TOKEN_LENGTH: 0,
} as const;

/**
 * Generate valid auth credentials (default for restful-booker)
 */
export function generateValidCredentials(): AuthCredentials {
  return {
    username: 'admin',
    password: 'password123',
  };
}

/**
 * Generate invalid auth credentials for negative testing
 */
export function generateInvalidCredentials(): AuthCredentials {
  return {
    username: faker.internet.displayName(),
    password: faker.internet.password(),
  };
}

/**
 * Generate credentials with missing username
 */
export function generateMissingUsernameCredentials(): AuthCredentials {
  return {
    username: '',
    password: faker.internet.password(),
  };
}

/**
 * Generate credentials with missing password
 */
export function generateMissingPasswordCredentials(): AuthCredentials {
  return {
    username: faker.internet.displayName(),
    password: '',
  };
}
