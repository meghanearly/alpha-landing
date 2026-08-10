import { useEffect, useRef, useState } from 'react'
import Header from './Header.jsx'
import Quickview from './Quickview.jsx'
import { Reveal, ImageWell } from './ui.jsx'
import { ARCHIVE, FOOTER } from './data.js'
import { SocialIcons } from './icons.jsx'

const SOCIAL = ['Instagram', 'Facebook', 'YouTube', 'TikTok', 'X']

export default function App() {
  // Header state
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [passedHero, setPassedHero] = useState(false)
  const [menu, setMenu] = useState(null) // desktop mega-menu key
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastY = useRef(0)

  // Overlays
  const [quickviewOpen, setQuickviewOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const [dwelled, setDwelled] = useState(false)
  const popupSeen = useRef(false)
  const heroVideo = useRef(null)

  // Scroll: header theme + auto-hide + passed-hero flag.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const atTop = y <= 40
      setScrolled(!atTop)
      setPassedHero(y > window.innerHeight * 0.9)
      if (y > lastY.current + 4) setHidden(true)
      else if (y < lastY.current - 4 || atTop) setHidden(false)
      if (Math.abs(y - lastY.current) > 4) lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ensure the hero video actually autoplays: React doesn't reliably reflect
  // the `muted` attribute onto the DOM property, and browsers block autoplay
  // for non-muted video. Set it imperatively, then kick off playback.
  useEffect(() => {
    const v = heroVideo.current
    if (!v) return
    v.muted = true
    v.defaultMuted = true
    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }, [])

  // Newsletter popup: 15s dwell.
  useEffect(() => {
    const t = setTimeout(() => setDwelled(true), 15000)
    return () => clearTimeout(t)
  }, [])

  // Fire the popup once per session, after dwell + past 90% of the hero.
  useEffect(() => {
    if (!dwelled || !passedHero || popupOpen || popupSeen.current) return
    try {
      popupSeen.current = sessionStorage.getItem('alphaPopupSeen') === '1'
    } catch {
      popupSeen.current = false
    }
    if (!popupSeen.current) {
      popupSeen.current = true
      try { sessionStorage.setItem('alphaPopupSeen', '1') } catch {}
      setPopupOpen(true)
    }
  }, [dwelled, passedHero, popupOpen])

  // Lock body scroll behind the mobile drawer.
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [mobileOpen])

  const menuOpen = !!menu || mobileOpen
  const solidHeader = scrolled || menuOpen
  const hideHeader = hidden && scrolled && !menuOpen

  const openWishlist = () => setWishlistOpen(true)

  return (
    <div className="page">
      <Header
        solid={solidHeader}
        hidden={hideHeader}
        menu={menu}
        setMenu={setMenu}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Hero — real campaign video, fixed behind the sliding page */}
      <section className="hero" aria-label="AW 2026 campaign">
        <video
          ref={heroVideo}
          className="hero-video"
          src="/hero.mp4"
          poster="/hero-poster.jpg"
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
        />
        <div className="hero-scrim-top" />
      </section>

      {/* The Heritage Archive */}
      <section className="section archive">
        <div className="section-heading archive-heading">THE HERITAGE ARCHIVE</div>
        <div className="archive-grid">
          {ARCHIVE.map((item, idx) => (
            <Reveal className="archive-card" key={item.name}>
              <ImageWell
                front={item.img}
                back={item.back}
                baseScale={1.42}
                hoverScale={1.62}
                objectFit="cover"
                aspect="3 / 4"
                alt={item.name}
                onOpen={idx === 0 ? () => setQuickviewOpen(true) : undefined}
                onBookmark={openWishlist}
              />
              <div className="card-meta">
                <div className="card-meta-row">
                  <div className="card-name">{item.name}</div>
                  <div className="card-year">{item.year}</div>
                </div>
                <div className="card-price">{item.price}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <a href="#" className="btn-outline archive-cta">SHOP ALL 2026 BEST SELLERS</a>
      </section>

      {/* Campaign */}
      <section className="campaign" aria-label="Claimed. Not Given.">
        <img className="campaign-img" src="/images/campaign.png" alt="" />
        <div className="campaign-scrim" />
        <Reveal className="campaign-bar">
          <div className="campaign-copy">
            <div className="campaign-headline">Claimed. Not given.</div>
            <p className="campaign-text">
              Alpha AW 2026 has no single muse. Instead, the campaign is a tribute to the unrelenting
              spirit of New York City and people who shape its communities without ever blending in.
              Representing decades of authentic craft, claimed by originals who make their own name.
            </p>
          </div>
          <a href="#" className="btn-outline btn-outline-light campaign-cta">SHOP NOW</a>
        </Reveal>
      </section>

      {/* Menswear — large image left, products + landscape right */}
      <section className="section split menswear">
        <div className="split-head">
          <div className="section-heading">MENSWEAR</div>
          <a href="#" className="explore">EXPLORE</a>
        </div>
        <Reveal className="split-grid split-grid-men">
          <div className="split-hero">
            <img className="zoom-img" src="/images/menswear.jpg" alt="" />
          </div>
          <div className="split-col">
            <div className="pair">
              <ProductCard front="/images/mens-bag.png" baseScale={2.1} hoverScale={2.28} objectFit="contain" name="Nylon Messenger Bag" price="$100.00" onBookmark={openWishlist} />
              <ProductCard front="/images/menswear-tee.png" baseScale={1.42} hoverScale={1.56} objectFit="contain" name="Relaxed Alpha Angels Tee" price="$35.00" onBookmark={openWishlist} />
            </div>
            <div className="split-landscape">
              <img className="zoom-img" src="/images/menswear-2.jpg" alt="" style={{ objectPosition: '50% 18%' }} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Womenswear — mirrored: products left, large image right */}
      <section className="section split womenswear">
        <div className="split-head">
          <div className="section-heading">WOMENSWEAR</div>
          <a href="#" className="explore">EXPLORE</a>
        </div>
        <Reveal className="split-grid split-grid-women">
          <div className="split-col">
            <div className="pair">
              <ProductCard front="/images/womens-bag.png" baseScale={1.5} hoverScale={1.63} objectFit="contain" name="Studio Tote Bag Large" price="$65.00" onBookmark={openWishlist} />
              <ProductCard front="/images/womens-skirt.png" baseScale={1.45} hoverScale={1.58} translateY="3%" objectFit="contain" name="Flight Nylon Mini Skirt Womens" price="$100.00" onBookmark={openWishlist} />
            </div>
            <div className="split-landscape">
              <img className="zoom-img" src="/images/ne-skatepark.png" alt="" style={{ objectPosition: '50% 20%' }} />
            </div>
          </div>
          <div className="split-hero split-hero-women">
            <img className="zoom-img" src="/images/womenswear.jpg" alt="" />
          </div>
        </Reveal>
      </section>

      {/* Youth */}
      <section className="section youth">
        <div className="split-head">
          <div className="section-heading">YOUTH</div>
          <a href="#" className="explore">EXPLORE</a>
        </div>
        <Reveal className="youth-grid">
          <ProductCard front="/images/youth-1.png" baseScale={1} hoverScale={1.05} objectFit="cover" name="Youth N-3B Parka" price="$150.00" onBookmark={openWishlist} />
          <ProductCard front="/images/youth-2.png" baseScale={1.42} hoverScale={1.56} objectFit="contain" name="Youth Quilted Liner Jacket" price="$85.00" onBookmark={openWishlist} />
          <ProductCard front="/images/youth-3.png" baseScale={1} hoverScale={1.05} objectFit="cover" name="Youth NASA MA-1 Bomber" price="$125.00" onBookmark={openWishlist} />
        </Reveal>
      </section>

      {/* Newsletter */}
      <section className="section newsletter">
        <div className="newsletter-inner">
          <h2 className="newsletter-title">Sign up to the Alpha Newsletter</h2>
          <p className="newsletter-copy">
            Sign up for 20% off sale items on your first order and get offers, exclusive content and more
          </p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="E-MAIL" aria-label="Email address" />
            <button type="submit">SIGN UP</button>
          </form>
        </div>
      </section>

      <Footer />

      {quickviewOpen && <Quickview onClose={() => setQuickviewOpen(false)} />}
      {wishlistOpen && <WishlistModal onClose={() => setWishlistOpen(false)} />}
      {popupOpen && <NewsletterPopup onClose={() => setPopupOpen(false)} />}
    </div>
  )
}

// A merchandising product card (well + name + price), no back-image swap.
function ProductCard({ front, baseScale, hoverScale, translateY, objectFit, name, price, onBookmark }) {
  return (
    <div className="product-card">
      <ImageWell
        front={front}
        baseScale={baseScale}
        hoverScale={hoverScale}
        translateY={translateY}
        objectFit={objectFit}
        aspect="4 / 5"
        alt={name}
        onBookmark={onBookmark}
      />
      <div className="card-meta card-meta-tight">
        <div className="card-name">{name}</div>
        <div className="card-price">{price}</div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {FOOTER.map((col) => (
          <div className="footer-col" key={col.title}>
            <div className="footer-heading">{col.title}</div>
            {col.links.map((link) => (
              <a href="#" className="footer-link" key={link}>{link}</a>
            ))}
          </div>
        ))}
        <div className="footer-col">
          <div className="footer-heading">FOLLOW</div>
          <div className="footer-social">
            {SOCIAL.map((name) => {
              const Icon = SocialIcons[name]
              return (
                <a href="#" key={name} aria-label={name} className="footer-social-link">
                  <Icon />
                </a>
              )
            })}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <img className="footer-wordmark" src="/images/alpha-wordmark.svg" alt="Alpha Industries" />
        <span className="footer-copy">© 2026 ALPHA INDUSTRIES — ALL RIGHTS RESERVED</span>
      </div>
    </footer>
  )
}

function WishlistModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="wishlist" onClick={(e) => e.stopPropagation()}>
        <div className="wishlist-head">
          <div className="wishlist-title">WISHLIST</div>
          <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="wishlist-body">
          <h3 className="wishlist-heading">Start your wishlist</h3>
          <p className="wishlist-copy">
            To start a wishlist (and get perks like early access to new drops), you need to become an
            Alpha Industries member
          </p>
          <div className="wishlist-actions">
            <button type="button" className="btn-black">Login</button>
            <button type="button" className="btn-outline btn-outline-block">Create an account</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NewsletterPopup({ onClose }) {
  return (
    <div className="modal-backdrop modal-backdrop-dark">
      <div className="popup">
        <h3 className="popup-title">Sign up for Alpha updates</h3>
        <p className="popup-copy">Be the first to be notified of new arrivals and special offers.</p>
        <input type="email" className="popup-input" placeholder="EMAIL" aria-label="Email address" />
        <button type="button" className="btn-black popup-btn">SUBSCRIBE</button>
        <div className="popup-fine">New subscribers receive 20% off sale items.</div>
        <button type="button" className="modal-close popup-close" aria-label="Close" onClick={onClose}>×</button>
      </div>
    </div>
  )
}
