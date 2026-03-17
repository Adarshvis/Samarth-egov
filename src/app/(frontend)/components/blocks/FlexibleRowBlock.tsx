'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// ── Shared helpers ──

function getMediaUrl(media: unknown): string | null {
  if (typeof media === 'object' && media && 'url' in media) {
    return (media as { url: string }).url
  }
  return null
}

function getMediaAlt(media: unknown): string {
  if (typeof media === 'object' && media && 'alt' in media) {
    return (media as { alt: string }).alt || ''
  }
  return ''
}

function getYouTubeEmbedUrl(url: string, autoplay: boolean, controls: boolean): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  if (!match) return null
  const id = match[1]
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: autoplay ? '1' : '0',
    controls: controls ? '1' : '0',
    rel: '0',
  })
  if (autoplay) params.set('playlist', id)
  return `https://www.youtube.com/embed/${id}?${params.toString()}`
}

function getVimeoEmbedUrl(url: string, autoplay: boolean, controls: boolean): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  if (!match) return null
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    muted: autoplay ? '1' : '0',
    background: controls ? '0' : '1',
  })
  return `https://player.vimeo.com/video/${match[1]}?${params.toString()}`
}

// ── Section Heading (local copy to avoid cross-imports) ──

function SectionHeading({
  heading,
  description,
  alignment = 'center',
}: {
  heading?: string | null
  description?: string | null
  alignment?: string | null
}) {
  if (!heading) return null
  const align = alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center'
  return (
    <div className={`mb-12 ${align}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{heading}</h2>
      {description && <p className="text-gray-600 text-lg max-w-3xl mx-auto">{description}</p>}
    </div>
  )
}

// ── Sub-block renderers ──

function FlexRichText({
  content,
  fontFamily = 'inherit',
  fontSize = 'base',
  textColor = '#1F2937',
}: {
  content: unknown
  fontFamily?: string | null
  fontSize?: string | null
  textColor?: string | null
}) {
  const sizeClass: Record<string, string> = {
    sm: 'prose-sm',
    base: 'prose-base',
    lg: 'prose-lg',
    xl: 'prose-xl',
    '2xl': 'prose-2xl',
  }
  return (
    <div
      className={`prose max-w-none aspect-video overflow-auto rounded-lg p-4 ${sizeClass[fontSize || 'base'] || 'prose-base'}`}
      style={{
        fontFamily: fontFamily && fontFamily !== 'inherit' ? `"${fontFamily}", sans-serif` : undefined,
        color: textColor || undefined,
      }}
    >
      <RichText data={content as SerializedEditorState} />
    </div>
  )
}

function FlexImage({
  image,
  caption,
  captionColor = '#6B7280',
  objectFit = 'cover',
  rounded = 'lg',
}: {
  image: unknown
  caption?: string | null
  captionColor?: string | null
  objectFit?: string | null
  rounded?: string | null
}) {
  const url = getMediaUrl(image)
  if (!url) return null
  const alt = getMediaAlt(image)
  const roundedClass: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }
  return (
    <figure>
      <div className={`relative aspect-video overflow-hidden ${roundedClass[rounded || 'lg'] || 'rounded-lg'}`}>
        <Image
          src={url}
          alt={alt}
          fill
          className={`transition-transform duration-300 hover:scale-105`}
          style={{ objectFit: (objectFit as React.CSSProperties['objectFit']) || 'cover' }}
        />
      </div>
      {caption && (
        <figcaption
          className="mt-2 text-sm text-center"
          style={{ color: captionColor || '#6B7280' }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

function FlexVideo({
  videoSource = 'upload',
  uploadedVideo,
  youtubeUrl,
  vimeoUrl,
  externalVideoUrl,
  poster,
  autoplay = false,
  loop = false,
  controls = true,
}: {
  videoSource?: string | null
  uploadedVideo?: unknown
  youtubeUrl?: string | null
  vimeoUrl?: string | null
  externalVideoUrl?: string | null
  poster?: unknown
  autoplay?: boolean | null
  loop?: boolean | null
  controls?: boolean | null
}) {
  const posterUrl = getMediaUrl(poster)
  const shouldAutoplay = autoplay === true
  const shouldLoop = loop === true
  const showControls = controls !== false

  if (videoSource === 'youtube' && youtubeUrl) {
    const embedUrl = getYouTubeEmbedUrl(youtubeUrl, shouldAutoplay, showControls)
    if (!embedUrl) return <p className="text-red-500 text-sm">Invalid YouTube URL</p>
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
          loading="lazy"
          title="YouTube video"
        />
      </div>
    )
  }

  if (videoSource === 'vimeo' && vimeoUrl) {
    const embedUrl = getVimeoEmbedUrl(vimeoUrl, shouldAutoplay, showControls)
    if (!embedUrl) return <p className="text-red-500 text-sm">Invalid Vimeo URL</p>
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; fullscreen"
          allowFullScreen
          loading="lazy"
          title="Vimeo video"
        />
      </div>
    )
  }

  if (videoSource === 'externalUrl' && externalVideoUrl) {
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <video
          src={externalVideoUrl}
          poster={posterUrl || undefined}
          autoPlay={shouldAutoplay}
          muted={shouldAutoplay}
          loop={shouldLoop}
          controls={showControls}
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  // Default: uploaded video
  const videoUrl = getMediaUrl(uploadedVideo)
  if (!videoUrl) return null
  return (
    <div className="relative aspect-video rounded-lg overflow-hidden">
      <video
        src={videoUrl}
        poster={posterUrl || undefined}
        autoPlay={shouldAutoplay}
        muted={shouldAutoplay}
        loop={shouldLoop}
        controls={showControls}
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  )
}

function FlexCarousel({
  slides,
  autoplay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
}: {
  slides?: {
    id?: string
    mediaType?: string | null
    image?: unknown
    video?: unknown
    youtubeUrl?: string | null
    caption?: string | null
  }[]
  autoplay?: boolean | null
  interval?: number | null
  showDots?: boolean | null
  showArrows?: boolean | null
}) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const validSlides = slides?.filter(Boolean) || []
  const total = validSlides.length

  const next = useCallback(() => setCurrent((p) => (p + 1) % total), [total])
  const prev = useCallback(() => setCurrent((p) => (p - 1 + total) % total), [total])

  useEffect(() => {
    if (autoplay && total > 1) {
      timerRef.current = setInterval(next, interval || 5000)
      return () => clearInterval(timerRef.current)
    }
  }, [autoplay, interval, next, total])

  if (total === 0) return null

  const renderSlide = (slide: (typeof validSlides)[0]) => {
    if (slide.mediaType === 'youtube' && slide.youtubeUrl) {
      const embedUrl = getYouTubeEmbedUrl(slide.youtubeUrl, false, true)
      if (!embedUrl) return null
      return (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
          loading="lazy"
          title="YouTube video"
        />
      )
    }
    if (slide.mediaType === 'video') {
      const videoUrl = getMediaUrl(slide.video)
      if (!videoUrl) return null
      return (
        <video
          src={videoUrl}
          controls
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )
    }
    // Default: image
    const url = getMediaUrl(slide.image)
    if (!url) return null
    return (
      <Image
        src={url}
        alt={getMediaAlt(slide.image)}
        fill
        className="object-cover"
      />
    )
  }

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden group">
      {validSlides.map((slide, i) => (
        <div
          key={slide.id || i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {renderSlide(slide)}
        </div>
      ))}

      {/* Caption */}
      {validSlides[current]?.caption && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
          <p className="text-white text-sm">{validSlides[current].caption}</p>
        </div>
      )}

      {/* Arrows */}
      {showArrows && total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {validSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === current ? 'bg-white scale-110' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FlexMapEmbed({
  embedType = 'iframe',
  iframeUrl,
  html,
  height = 400,
}: {
  embedType?: string | null
  iframeUrl?: string | null
  html?: string | null
  height?: number | null
}) {
  if (embedType === 'html' && html) {
    return (
      <div
        className="rounded-lg overflow-hidden"
        style={{ height: height || 400 }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
  if (iframeUrl) {
    return (
      <iframe
        src={iframeUrl}
        className="w-full rounded-lg border-0"
        style={{ height: height || 400 }}
        loading="lazy"
        allowFullScreen
        title="Embedded content"
      />
    )
  }
  return null
}

function FlexAnimation({
  animationType = 'lottie',
  lottieUrl,
  gif,
  loop = true,
  autoplay = true,
}: {
  animationType?: string | null
  lottieUrl?: string | null
  gif?: unknown
  loop?: boolean | null
  autoplay?: boolean | null
}) {
  if (animationType === 'gif') {
    const url = getMediaUrl(gif)
    if (!url) return null
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image src={url} alt="Animation" fill className="object-contain" />
      </div>
    )
  }

  // Lottie – use dotlottie-player web component
  if (lottieUrl) {
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <iframe
          src={`https://lottie.host/embed?src=${encodeURIComponent(lottieUrl)}&loop=${loop !== false}&autoplay=${autoplay !== false}`}
          className="w-full h-full border-0"
          loading="lazy"
          title="Lottie animation"
        />
      </div>
    )
  }
  return null
}

// ── Sub-block router ──

function RenderSubBlock(block: { blockType: string; [key: string]: unknown }) {
  const { blockType, ...rest } = block
  switch (blockType) {
    case 'flexRichText':
      return <FlexRichText {...(rest as Parameters<typeof FlexRichText>[0])} />
    case 'flexImage':
      return <FlexImage {...(rest as Parameters<typeof FlexImage>[0])} />
    case 'flexVideo':
      return <FlexVideo {...(rest as Parameters<typeof FlexVideo>[0])} />
    case 'flexCarousel':
      return <FlexCarousel {...(rest as Parameters<typeof FlexCarousel>[0])} />
    case 'flexMapEmbed':
      return <FlexMapEmbed {...(rest as Parameters<typeof FlexMapEmbed>[0])} />
    case 'flexAnimation':
      return <FlexAnimation {...(rest as Parameters<typeof FlexAnimation>[0])} />
    default:
      return null
  }
}

// ── Column width map ──

const widthStyles: Record<string, string> = {
  auto: '',
  '25': 'w-full md:w-1/4',
  '33': 'w-full md:w-1/3',
  '50': 'w-full md:w-1/2',
  '66': 'w-full md:w-2/3',
  '75': 'w-full md:w-3/4',
  '100': 'w-full',
}

const gapClasses: Record<string, string> = {
  '0': 'gap-0',
  '4': 'gap-4',
  '6': 'gap-6',
  '8': 'gap-8',
  '12': 'gap-12',
}

const paddingClasses: Record<string, string> = {
  '0': 'p-0',
  '4': 'p-4',
  '6': 'p-6',
  '8': 'p-8',
}

const alignClasses: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

// ── Main Component ──

interface ColumnData {
  id?: string
  width?: string | null
  columnBgColor?: string | null
  padding?: string | null
  blocks?: { blockType: string; id?: string; [key: string]: unknown }[]
}

interface FlexibleRowBlockProps {
  sectionHeading?: string | null
  sectionDescription?: string | null
  headingAlignment?: 'left' | 'center' | 'right' | null
  sectionBgColor?: string | null
  gap?: string | null
  verticalAlign?: string | null
  columns?: ColumnData[]
}

export default function FlexibleRowBlock({
  sectionHeading,
  sectionDescription,
  headingAlignment,
  sectionBgColor = '#FFFFFF',
  gap = '6',
  verticalAlign = 'start',
  columns,
}: FlexibleRowBlockProps) {
  if (!columns || columns.length === 0) return null

  const allAuto = columns.every((c) => !c.width || c.width === 'auto')

  // Grid columns: 1-3 → that count per row, 4+ → 2 per row (wraps into 2×2, 2×3, etc.)
  const gridCols = columns.length <= 3 ? columns.length : 2

  return (
    <section
      className="py-16 px-6"
      style={{ backgroundColor: sectionBgColor || '#FFFFFF' }}
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          heading={sectionHeading}
          description={sectionDescription}
          alignment={headingAlignment}
        />

        <div
          className={`flex flex-wrap ${gapClasses[gap || '6'] || 'gap-6'} ${alignClasses[verticalAlign || 'start'] || 'items-start'}`}
          style={allAuto ? { display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)` } : undefined}
        >
          {columns.map((col, i) => {
            const w = col.width || 'auto'
            const isAuto = w === 'auto'
            const bgColor = col.columnBgColor && col.columnBgColor !== 'transparent' ? col.columnBgColor : undefined

            return (
              <div
                key={col.id || i}
                className={`${!isAuto ? widthStyles[w] || '' : ''} ${paddingClasses[col.padding || '0'] || ''} ${bgColor ? 'rounded-lg' : ''} flex-shrink-0`}
                style={{
                  backgroundColor: bgColor || undefined,
                  // For auto columns in flex mode, use 2-col layout for 4+ columns
                  ...(isAuto && !allAuto ? { flex: `1 1 calc(${columns.length > 3 ? '50%' : '33.333%'} - 1.5rem)`, minWidth: '280px' } : {}),
                }}
              >
                {col.blocks?.map((block, j) => (
                  <div key={block.id || j} className={j > 0 ? 'mt-4' : ''}>
                    <RenderSubBlock {...block} />
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
