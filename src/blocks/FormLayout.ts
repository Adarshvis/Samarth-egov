import type { Block } from 'payload'
import { sectionHeadingFields } from './shared'

export const FormLayout: Block = {
  slug: 'formLayout',
  labels: { singular: 'Form', plural: 'Forms' },
  fields: [
    ...sectionHeadingFields,
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      admin: {
        description: 'Select a Form Builder form to display in this section.',
      },
    },
    {
      name: 'maxWidth',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Narrow (640px)', value: 'narrow' },
        { label: 'Medium (768px)', value: 'medium' },
        { label: 'Wide (1024px)', value: 'wide' },
        { label: 'Full Width', value: 'full' },
      ],
    },
  ],
}
