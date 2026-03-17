'use client'

import React from 'react'
import Image from 'next/image'

interface StateItem {
  stateName: string
  portalUrl: string
  tagline?: string | null
  themeColor?: string | null
  imageOpacity?: number | null
  backgroundImage?: any
  id?: string | null
}

interface StatesOnboardedBlockProps {
  heading: string
  description?: string | null
  states: StateItem[]
}

export default function StatesOnboardedBlock({ heading, description, states }: StatesOnboardedBlockProps) {
  if (!states || states.length === 0) return null

  // Determine grid columns based on the number of items
  // If 1 item: take full width but constrained max-width
  // If 2 items: 2 columns
  // If 3+ items: responsive grid
  const gridClass =
    states.length === 1
      ? 'max-w-4xl mx-auto'
      : states.length === 2
        ? 'grid md:grid-cols-2 gap-8'
        : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1f2937] tracking-tight mb-4">
            {heading}
          </h2>
          {description && (
            <p className="text-lg text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className={gridClass}>
          {states.map((state) => {
            const themeColor = state.themeColor || '#1e3a5f'
            // Convert 0-100 opacity to CSS 0-1 value
            const imgOpacity = typeof state.imageOpacity === 'number' ? state.imageOpacity / 100 : 0.6
            const bgImgUrl = typeof state.backgroundImage === 'object' ? state.backgroundImage?.url : null

            return (
              <a
                key={state.id || state.stateName}
                href={state.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block rounded-2xl overflow-hidden bg-white hover:bg-white text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-100"
                style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                  border: '1px solid #f3f4f6',
                }}
              >
                {/* Decorative top border based on theme color */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5 z-20"
                  style={{ backgroundColor: themeColor }}
                />

                {/* Background Image with Gradient Fade */}
                {bgImgUrl && (
                  <div className="absolute top-0 right-0 bottom-0 w-3/4 md:w-2/3 pointer-events-none z-0">
                    {/* Stronger gradient mask: solid white on left, smooth fade to transparent on right */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent z-10" />
                    <Image
                      src={bgImgUrl}
                      alt=""
                      fill
                      className="object-cover object-right mix-blend-multiply"
                      style={{ opacity: imgOpacity }}
                    />
                  </div>
                )}

                {/* Card Content */}
                <div className="relative z-10 p-8 sm:p-12 flex flex-col h-full min-h-[220px] md:min-h-[260px] max-w-lg">
                  <div className="flex-1 flex flex-col justify-center">
                    {state.tagline && (
                      <div
                        className="text-sm font-bold uppercase tracking-wider mb-3"
                        style={{ color: themeColor }}
                      >
                        {state.tagline}
                      </div>
                    )}
                    <h3 className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-6 group-hover:text-gray-800 transition-colors">
                      {state.stateName}
                    </h3>
                  </div>

                  {/* Visit Portal Button */}
                  <div className="mt-4">
                    <span
                      className="inline-flex items-center gap-2 font-bold text-sm md:text-base rounded-full py-3 px-8 transition-all duration-300 shadow-sm hover:shadow"
                      style={{
                        backgroundColor: `${themeColor}15`,
                        color: themeColor,
                      }}
                    >
                      Visit Portal
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
