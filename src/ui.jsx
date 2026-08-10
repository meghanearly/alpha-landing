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
  autoRevealOnMobile = false,
}) {
  const [hover, setHover] = useState(false)
  const wellRef = useRef(null)
  const isTouch = useRef(false)
  const hs = hoverScale ?? baseScale * 1.14
  const t = translateY ? ` translateY(${translateY})` : ''
  const src = hover && back ? back : front
  const scale = hover ? hs : baseScale

  // On touch devices (no hover), drive the reveal from scroll position instead
  // of a tap: activate when the card is prominently in view, revert as it
  // leaves. Desktop keeps its mouse-driven hover untouched.
  useEffect(() => {
    if (!autoRevealOnMobile || typeof window === 'undefined') return
    if (!window.matchMedia('(hover: none)').matches) return
    isTouch.current = true
    const el = wellRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    let timer
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const active = e.isIntersecting && e.intersectionRatio >= 0.6
        clearTimeout(timer)
        if (active) {
          // Hold on the front briefly so it's seen before the flip/zoom.
          timer = setTimeout(() => setHover(true), 550)
        } else {
          setHover(false)
        }
      }),
      { threshold: [0, 0.6, 1] },
    )
    io.observe(el)
    return () => { clearTimeout(timer); io.disconnect() }
  }, [autoRevealOnMobile])

  return (
    <div
      ref={wellRef}
      className="well"
      style={{ aspectRatio: aspect }}
      onMouseEnter={() => { if (!isTouch.current) setHover(true) }}
      onMouseLeave={() => { if (!isTouch.current) setHover(false) }}
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
