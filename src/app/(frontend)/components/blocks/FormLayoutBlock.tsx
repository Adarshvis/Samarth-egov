import React from 'react'
import SectionHeading from '../ui/SectionHeading'
import FormBuilderEmbed from './FormBuilderEmbed'

interface FormLayoutBlockProps {
  sectionHeading?: string | null
  sectionDescription?: string | null
  headingAlignment?: 'left' | 'center' | 'right' | null
  form?: unknown
  maxWidth?: 'narrow' | 'medium' | 'wide' | 'full' | null
}

const widthClasses: Record<string, string> = {
  narrow: 'max-w-2xl',
  medium: 'max-w-3xl',
  wide: 'max-w-5xl',
  full: 'max-w-full',
}

export default function FormLayoutBlock({
  sectionHeading,
  sectionDescription,
  headingAlignment,
  form,
  maxWidth = 'medium',
}: FormLayoutBlockProps) {
  if (!form) return null

  return (
    <section className="py-16 px-6">
      <div className={`mx-auto ${widthClasses[maxWidth || 'medium'] || 'max-w-3xl'}`}>
        <SectionHeading
          heading={sectionHeading}
          description={sectionDescription}
          alignment={headingAlignment}
        />
        <FormBuilderEmbed form={form} />
      </div>
    </section>
  )
}
