import { useEffect, useRef, useState } from 'react'
import { BookmarkIcon } from './icons.jsx'

// Scroll reveal: fades/rises in once when 15% visible (IntersectionObserver).
export function Reveal({ as: Tag = 'div', className, style, children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        })
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(26px)',
        transition:
          'opacity 900ms cubic-bezier(0.2,0.6,0.2,1), transform 900ms cubic-bezier(0.2,0.6,0.2,1)',
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// Product image "well": grey backdrop, hover swaps to the back view (if any),
// zooms, and fades a centred VIEW label in. A bookmark button (stopPropagation)
// opens the wishlist without triggering the card's own click.
export function ImageWell({
  front,
  back,
  baseScale = 1.42,
  hoverScale,
  translateY,
  objectFit = 'cover',
  aspect = '3 / 4',
  alt = '',
  onOpen,
  onBookmark,
}) {
  const [hover, setHover] = useState(false)
  const hs = hoverScale ?? baseScale * 1.14
  const t = translateY ? ` translateY(${translateY})` : ''
  const src = hover && back ? back : front
  const scale = hover ? hs : baseScale

  return (
    <div
      className="well"
      style={{ aspectRatio: aspect }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onOpen}
    >
      <img
        src={src}
        alt={alt}
        draggable="false"
        className="well-img"
        style={{ objectFit, transform: `scale(${scale})${t}` }}
      />
      <div className="well-overlay" style={{ opacity: hover ? 1 : 0 }}>
        <span className="well-view">VIEW</span>
      </div>
      <button
        type="button"
        className="bookmark"
        aria-label="Save"
        onClick={(e) => {
          e.stopPropagation()
          onBookmark && onBookmark()
        }}
      >
        <BookmarkIcon />
      </button>
    </div>
  )
}
