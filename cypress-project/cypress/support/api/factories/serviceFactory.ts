import { UserServiceFactory } from './userServiceFactory';

/**
 * Service Factory - Central export for all API service factories
 * Can be used in before/beforeEach hooks without fixture dependencies
 *
 * Usage:
 *   before(async () => {
 *     const response = await ServiceFactory.user.createUser(userData);
 *   });
 */
export const ServiceFactory = {
  user: UserServiceFactory,
};
