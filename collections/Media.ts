import type { CollectionConfig } from 'payload'

/**
 * Media Collection
 * 
 * Manages file uploads and media assets.
 * Currently configured to allow public read access.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
