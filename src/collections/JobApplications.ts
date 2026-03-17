import type { CollectionConfig } from 'payload'
import { adminAccess } from '../access/roles'

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  labels: {
    singular: 'Job Application',
    plural: 'Job Applications',
  },
  admin: {
    useAsTitle: 'applicantName',
    group: 'Job Applications',
    defaultColumns: ['applicantName', 'email', 'jobTitle', 'status', 'createdAt'],
    description: 'Resume submissions from job applicants',
    hidden: true,
  },
  access: {
    // Anyone can submit an application
    create: () => true,
    // Only admins can view, update, delete
    read: adminAccess,
    update: adminAccess,
    delete: adminAccess,
  },
  fields: [
    {
      name: 'applicantName',
      type: 'text',
      label: 'Applicant Name',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'jobTitle',
      type: 'text',
      label: 'Position Applied For',
      required: true,
      admin: {
        description: 'The position the candidate indicated they are applying for',
      },
    },
    {
      name: 'resume',
      type: 'relationship',
      label: 'Resume / CV',
      relationTo: 'resumes',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Application Status',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Shortlisted', value: 'shortlisted' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      label: 'Submitted At',
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
}
