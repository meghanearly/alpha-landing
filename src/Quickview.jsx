import { useEffect, useRef, useState } from 'react'
import {
  ACCORDIONS,
  DAY_WORDS,
  RESULTS,
  SIDE_IMG,
  SIZE_ROWS,
  UNAVAILABLE_SIZES,
} from './data.js'
import { asset } from './asset.js'

const LOGO = asset('images/alpha-industries-logo.png')
const EASE = 'cubic-bezier(0.2,0.6,0.2,1)'
const DEFAULT_QUERY = 'How could I style this jacket for a night out with friends in NYC?'

export default function Quickview({ onClose }) {
  const [side, setSide] = useState('black') // 'black' | 'orange'
  const [size, setSize] = useState('M')
  const [open, setOpen] = useState({}) // accordion map
  const [chatOpen, setChatOpen] = useState(false)
  const [query, setQuery] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null) // 'black' | 'orange' | null

  const spinRef = useRef(null)
  const shadowRef = useRef(null)
  const sheenRef = useRef(null)
  const cursorRef = useRef(null)
  const inputRef = useRef(null)

  const rot = useRef(0)
  const dragging = useRef(false)
  const dragX = useRef(0)
  const dragBase = useRef(0)
  const replyTimer = useRef(null)

  // Paint the current rotation onto the group, with depth/sheen treatment.
  function paintSpin(r) {
    const el = spinRef.current
    if (!el) return
    el.style.transform = `rotateX(3deg) rotateY(${r}deg)`
    const t = Math.abs(Math.sin((r * Math.PI) / 180))
    if (shadowRef.current) {
      shadowRef.current.style.filter =
        `drop-shadow(0 ${26 - 10 * t}px ${26 - 8 * t}px rgba(0,0,0,${0.3 - 0.12 * t}))` +
        ` brightness(${1 - 0.22 * t})`
    }
    if (sheenRef.current) sheenRef.current.style.opacity = String(0.75 * t)
  }

  // Animate to the face implied by `side` whenever it changes externally
  // (e.g. STYLE IT result) or on mount.
  useEffect(() => {
    const el = spinRef.current
    if (!el || dragging.current) return
    const want = side === 'orange' ? 180 : 0
    const cur = (((rot.current % 360) + 360) % 360)
    if (cur !== want) {
      rot.current = want
      el.style.transition = `transform 620ms ${EASE}`
      if (shadowRef.current) shadowRef.current.style.transition = 'filter 620ms ease'
    }
    paintSpin(rot.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [side])

  // Lock background scroll while the overlay is open.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      clearTimeout(replyTimer.current)
    }
  }, [])

  function onPointerDown(e) {
    dragX.current = e.clientX
    dragBase.current = rot.current || 0
    dragging.current = true
    if (spinRef.current) spinRef.current.style.transition = 'none'
    if (shadowRef.current) shadowRef.current.style.transition = 'none'
    if (e.currentTarget.setPointerCapture) {
      try { e.currentTarget.setPointerCapture(e.pointerId) } catch {}
    }
  }

  function onPointerMove(e) {
    if (cursorRef.current) {
      const r = e.currentTarget.getBoundingClientRect()
      cursorRef.current.style.transform =
        `translate(${e.clientX - r.left - 52}px,${e.clientY - r.top - 52}px)`
    }
    if (!dragging.current || !spinRef.current) return
    rot.current = dragBase.current + (e.clientX - dragX.current) * 0.6
    paintSpin(rot.current)
  }

  function onPointerUp() {
    if (!dragging.current) return
    dragging.current = false
    const snapped = Math.round((rot.current || 0) / 180) * 180
    rot.current = snapped
    const nextSide = Math.abs(snapped / 180) % 2 === 1 ? 'orange' : 'black'
    if (shadowRef.current) shadowRef.current.style.transition = 'filter 520ms ease'
    if (spinRef.current) {
      spinRef.current.style.transition = `transform 520ms ${EASE}`
      paintSpin(snapped)
    }
    if (nextSide !== side) setSide(nextSide)
  }

  function cursorEnter() { if (cursorRef.current) cursorRef.current.style.opacity = '1' }
  function cursorLeave() { if (cursorRef.current) cursorRef.current.style.opacity = '0' }

  // STYLE IT — scripted, keyword-routed reply (demo only, no API).
  function runStyle() {
    const el = inputRef.current
    const typed = (el && el.value.trim()) || DEFAULT_QUERY
    const raw = typed.toLowerCase()
    const day = DAY_WORDS.some((w) => raw.indexOf(w) !== -1)
    const nextSide = day ? 'orange' : 'black'
    if (el) el.value = ''
    clearTimeout(replyTimer.current)
    setQuery(typed)
    setLoading(true)
    setResult(null)
    replyTimer.current = setTimeout(() => {
      setSide(nextSide)
      setResult(nextSide)
      setLoading(false)
    }, 1500)
  }

  function clearStyle() {
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.focus()
    }
    clearTimeout(replyTimer.current)
    setResult(null)
    setSide('black')
    setQuery(null)
    setLoading(false)
  }

  function toggleChat() {
    setChatOpen((v) => {
      const next = !v
      if (next) setTimeout(() => inputRef.current && inputRef.current.focus(), 340)
      return next
    })
  }

  function toggleAccordion(key) {
    setOpen((s) => ({ ...s, [key]: !s[key] }))
  }

  const resultData = result ? RESULTS[result] : null

  return (
    <div className="qv" role="dialog" aria-modal="true" aria-label="MA-1 Bomber Jacket quick view">
      <button type="button" className="qv-close" aria-label="Close" onClick={onClose}>×</button>

      <div className="qv-inner">
        <div className="qv-grid">
          {/* Left: spin viewer + STYLE IT */}
          <div className="qv-left">
            <div
              className="spin-well"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onPointerEnter={cursorEnter}
              onPointerLeave={cursorLeave}
              onDragStart={(e) => e.preventDefault()}
            >
              <div className="spin-glow" />
              <div className="spin-shadow" ref={shadowRef}>
                <div className="spin-group" ref={spinRef}>
                  <img className="spin-face spin-front" src={SIDE_IMG.black} draggable="false" alt="MA-1 Bomber Jacket, black side" />
                  <img className="spin-face spin-back" src={SIDE_IMG.orange} draggable="false" alt="MA-1 Bomber Jacket, orange side" />
                </div>
              </div>
              <div className="spin-cursor" ref={cursorRef}><span>SPIN</span></div>
              <div className="spin-sheen" ref={sheenRef} />
            </div>

            <div className="qv-actions">
              <button type="button" className="style-it" onClick={toggleChat}>STYLE IT</button>
              <div className="reversible">REVERSIBLE</div>
            </div>

            <div className={`chat ${chatOpen ? 'chat-open' : ''}`}>
              <div className="chat-inner">
                {query && <div className="chat-query">{query}</div>}

                {loading && (
                  <div className="chat-typing">
                    <span /><span /><span />
                  </div>
                )}

                {resultData && (
                  <div className="chat-result" key={result}>
                    <div className="chat-caption">{resultData.caption}</div>
                    <div className="chat-products">
                      {resultData.items.map((it) => (
                        <div className="chat-product" key={it.name}>
                          <div className="chat-product-well">
                            <img src={it.img} alt="" />
                          </div>
                          <div className="chat-product-meta">
                            <div className="chat-product-name">{it.name}</div>
                            <div className="chat-product-price">{it.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="chat-brand">
                  {query && (
                    <button type="button" className="chat-reset" aria-label="Reset" onClick={clearStyle}>←</button>
                  )}
                  <img className="chat-logo" src={LOGO} alt="Alpha Industries" />
                  <div className="chat-note">This chat is AI-powered for faster assistance</div>
                </div>

                <div className="chat-input">
                  <input
                    type="text"
                    ref={inputRef}
                    placeholder="Ask anything..."
                    onKeyDown={(e) => { if (e.key === 'Enter') runStyle() }}
                  />
                  <button type="button" className="chat-send" aria-label="Send" onClick={runStyle}>↑</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: product detail */}
          <div className="qv-right">
            <div className="qv-specs">
              <div className="qv-spec"><span className="qv-spec-label">DESIGNATION</span><span>MA-1</span></div>
              <div className="qv-spec"><span className="qv-spec-label">ISSUED</span><span>1958, US Air Force</span></div>
              <div className="qv-spec"><span className="qv-spec-label">SHELL</span><span>100% flight nylon</span></div>
            </div>

            <h3 className="qv-title">MA-1 Bomber Jacket (Heritage)</h3>
            <div className="qv-price">$200.00</div>

            <p className="qv-desc">
              Constructed from mid-weight flight nylon with water resistance, the MA-1 fighter pilot
              bomber jacket was the first military bomber jacket to cross over into civilian fashion.
              This current version has been kept as close as possible to the classic military specifications.
            </p>

            <div className="qv-sizes">
              {SIZE_ROWS.map((row, i) => (
                <div className="qv-size-row" key={i}>
                  {row.map((label) => {
                    const disabled = UNAVAILABLE_SIZES.includes(label)
                    const selected = size === label
                    return (
                      <button
                        type="button"
                        key={label}
                        className={`qv-size ${selected ? 'qv-size-selected' : ''} ${disabled ? 'qv-size-disabled' : ''}`}
                        onClick={() => { if (!disabled) setSize(label) }}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            <a href="#" className="qv-size-guide">VIEW SIZE GUIDE</a>

            <button type="button" className="qv-add">Add to bag</button>

            <div className="qv-accordions">
              {ACCORDIONS.map((a) => {
                const isOpen = !!open[a.key]
                return (
                  <div className="qv-accordion" key={a.key}>
                    <button type="button" className="qv-accordion-btn" onClick={() => toggleAccordion(a.key)} aria-expanded={isOpen}>
                      <span>{a.label}</span>
                      <span className="qv-accordion-sign">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <ul className="qv-accordion-body">
                        {a.lines.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
