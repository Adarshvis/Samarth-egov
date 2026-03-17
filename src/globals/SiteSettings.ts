import type { GlobalConfig } from 'payload'
import { publicAccess, adminAccess } from '../access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: publicAccess,
    update: adminAccess,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },
    {
      name: 'siteDescription',
      type: 'textarea',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      type: 'group',
      name: 'themeColors',
      label: 'Theme Colors',
      fields: [
        {
          name: 'primaryColor',
          type: 'text',
          defaultValue: '#1E40AF',
          admin: {
            components: {
              Field: '@/components/admin/ColorPickerField#ColorPickerField',
            },
            description: 'Pick primary brand color',
          },
        },
        {
          name: 'secondaryColor',
          type: 'text',
          defaultValue: '#9333EA',
          admin: {
            components: {
              Field: '@/components/admin/ColorPickerField#ColorPickerField',
            },
            description: 'Pick secondary brand color',
          },
        },
        {
          name: 'accentColor',
          type: 'text',
          defaultValue: '#F59E0B',
          admin: {
            components: {
              Field: '@/components/admin/ColorPickerField#ColorPickerField',
            },
            description: 'Pick accent/highlight color',
          },
        },
      ],
    },
    {
      type: 'group',
      name: 'contact',
      label: 'Contact Information',
      fields: [
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'address',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Media Links',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'LinkedIn', value: 'linkedin' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
