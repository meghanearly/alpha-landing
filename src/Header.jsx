import { useState } from 'react'
import { MENUS, MENU_IMG, NAV_LEFT, NAV_RIGHT } from './data.js'
import { SearchIcon, AccountIcon, BagIcon, MenuIcon } from './icons.jsx'
import { asset } from './asset.js'

const LOGO = asset('images/alpha-industries-logo.png')

// Desktop hover mega-menu panel.
function MegaMenu({ menu }) {
  const columns = MENUS[menu] || []
  const image = MENU_IMG[menu] || null
  const align = menu === 'BRAND' || menu === 'COLLABORATIONS' ? 'flex-end' : 'flex-start'
  const panelHeight = image ? 'calc(100vh - 84px)' : '260px'

  return (
    <div className="mega" style={{ justifyContent: align }}>
      <div className="mega-panel" style={{ height: panelHeight }}>
        {columns.map((col) => (
          <div className="mega-col" key={col.title}>
            <div className="mega-heading">{col.title}</div>
            {col.links.map((link) => (
              <a href="#" className="mega-link" key={link}>
                {link}
              </a>
            ))}
          </div>
        ))}
        {image && (
          <div className="mega-image">
            <img src={image} alt="" />
          </div>
        )}
      </div>
    </div>
  )
}

// Full-screen mobile drawer that replaces the hover mega-menu.
function MobileDrawer({ open, onClose }) {
  const [expanded, setExpanded] = useState(null)
  const items = [...NAV_LEFT, ...NAV_RIGHT]

  return (
    <div className={`drawer ${open ? 'drawer-open' : ''}`} aria-hidden={!open}>
      <div className="drawer-top">
        <img className="drawer-logo" src={LOGO} alt="Alpha Industries" />
        <button type="button" className="icon-btn drawer-close" aria-label="Close menu" onClick={onClose}>
          ×
        </button>
      </div>
      <nav className="drawer-nav">
        {items.map((key) => {
          const isOpen = expanded === key
          return (
            <div className="drawer-item" key={key}>
              <button
                type="button"
                className="drawer-item-btn"
                aria-expanded={isOpen}
                onClick={() => setExpanded(isOpen ? null : key)}
              >
                <span>{key}</span>
                <span className="drawer-sign">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="drawer-groups">
                  {MENUS[key].map((col) => (
                    <div className="drawer-group" key={col.title}>
                      <div className="drawer-group-heading">{col.title}</div>
                      {col.links.map((link) => (
                        <a href="#" className="drawer-link" key={link} onClick={onClose}>
                          {link}
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}

export default function Header({
  solid,
  hidden,
  menu,
  setMenu,
  mobileOpen,
  setMobileOpen,
}) {
  const showMenu = !!menu

  return (
    <header
      className={`header ${solid ? 'header-solid' : ''} ${hidden ? 'header-hidden' : ''}`}
      onMouseLeave={() => setMenu(null)}
    >
      <div className="header-bar">
        {/* Left: primary nav (desktop) + hamburger (mobile) */}
        <div className="header-left">
          <button
            type="button"
            className="icon-btn hamburger"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </button>
          <nav className="nav nav-left">
            {NAV_LEFT.map((key) => (
              <a
                href="#"
                key={key}
                className="nav-link"
                onMouseEnter={() => setMenu(key)}
              >
                {key}
              </a>
            ))}
          </nav>
        </div>

        {/* Center: logo */}
        <a href="#" className="header-logo" aria-label="Alpha Industries">
          <img src={LOGO} alt="Alpha Industries" />
        </a>

        {/* Right: secondary nav + utility icons */}
        <div className="header-right">
          <nav className="nav nav-right">
            {NAV_RIGHT.map((key) => (
              <a
                href="#"
                key={key}
                className="nav-link"
                onMouseEnter={() => setMenu(key)}
              >
                {key}
              </a>
            ))}
          </nav>
          <div className="header-icons">
            <button type="button" className="icon-btn" aria-label="Search"><SearchIcon /></button>
            <button type="button" className="icon-btn" aria-label="Account"><AccountIcon /></button>
            <button type="button" className="icon-btn" aria-label="Bag"><BagIcon /></button>
          </div>
        </div>
      </div>

      {showMenu && <MegaMenu menu={menu} />}

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}
