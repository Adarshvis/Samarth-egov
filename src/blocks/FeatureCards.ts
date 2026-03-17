import type { Block } from 'payload'
import { sectionHeadingFields, iconField } from './shared'

export const FeatureCards: Block = {
  slug: 'featureCards',
  labels: { singular: 'Feature Cards', plural: 'Feature Cards' },
  fields: [
    ...sectionHeadingFields,
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      fields: [
        iconField('icon', 'Card Icon'),
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            description: 'Optional URL this card links to',
          },
        },
      ],
    },
  ],
}
