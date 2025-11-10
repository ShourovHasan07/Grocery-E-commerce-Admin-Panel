import { createMongoAbility } from '@casl/ability';

/**
 * Define abilities from CASL rules
 * @param {Object} session - NextAuth session object containing user permissions
 * @returns {MongoAbility} CASL ability instance
 */
export function defineAbilitiesFor(session) {
  // Get permissions array from session
  const permissions = session?.permissions || [];

  // Create ability directly from CASL rules format
  // This is the simplest and most direct way
  return createMongoAbility(permissions);
}

/**
 * Helper function to check if user has specific permission
 * @param {Object} session - NextAuth session
 * @param {string} action - Action to check (e.g., 'read', 'create')
 * @param {string} subject - Subject to check (e.g., 'Post', 'User')
 * @returns {boolean}
 */
export function can(session, action, subject) {
  const ability = defineAbilitiesFor(session);

  
return ability.can(action, subject);
}
