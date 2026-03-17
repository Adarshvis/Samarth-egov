import React from 'react'
import * as LucideIcons from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'

interface FeatureCardsBlockProps {
  sectionHeading?: string | null
  sectionDescription?: string | null
  headingAlignment?: 'left' | 'center' | 'right' | null
  columns?: '2' | '3' | '4' | null
  cards: {
    icon?: string | null
    title: string
    description?: string | null
    link?: string | null
    id?: string | null
  }[]
}

const gridClasses = {
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

function getIcon(name: string) {
  const Icon = (LucideIcons as any)[name]
  return Icon ? <Icon size={32} /> : null
}

export default function FeatureCardsBlock({ sectionHeading, sectionDescription, headingAlignment, columns = '3', cards }: FeatureCardsBlockProps) {
  const cols = columns || '3'

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading heading={sectionHeading} description={sectionDescription} alignment={headingAlignment} />
        <div className={`grid gap-8 ${gridClasses[cols]}`}>
          {cards?.map((card) => {
            const content = (
              <div key={card.id || card.title} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                {card.icon && (
                  <div className="text-blue-400 mb-4">{getIcon(card.icon)}</div>
                )}
                <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                {card.description && <p className="text-gray-400">{card.description}</p>}
              </div>
            )
            if (card.link) {
              return <a key={card.id || card.title} href={card.link} className="no-underline">{content}</a>
            }
            return content
          })}
        </div>
      </div>
    </section>
  )
}
