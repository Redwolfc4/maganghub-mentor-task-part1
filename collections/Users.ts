import type { CollectionConfig } from 'payload'

/**
 * Users Collection
 * 
 * Manages system users and authentication.
 * Uses 'email' as the login identifier.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
