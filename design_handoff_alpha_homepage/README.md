# Handoff: Alpha Industries Homepage Redesign

## Overview
A desktop homepage concept for Alpha Industries (AW 2026 "Claimed. Not Given." campaign). It covers a full-viewport video hero, a heritage archive product row with an interactive quickview, campaign editorial, menswear / womenswear / youth merchandising sections, a newsletter block, and a footer. The quickview includes a drag-to-spin 3D-ish product viewer for the reversible MA-1 and an AI "STYLE IT" chat panel (demo-scripted, not a real model call).

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype of the intended look and behavior, not production code to copy directly. The task is to **recreate this design in the target codebase's existing environment** (React, Next.js, Vue, Shopify/Liquid, etc.) using its established patterns, component library, and styling approach. If no environment exists yet, pick the framework that best fits the project and implement there.

Do not port the prototype's styling approach. All styles are inline `style="…"` attributes because of the authoring tool's constraints. In a real codebase these belong in CSS modules / Tailwind / styled-components with proper media queries.

`Alpha Landing.dc.html` uses a small custom runtime (`support.js`) with `<sc-for>`, `<sc-if>`, and `{{ }}` template holes. Read it as markup + a logic class; ignore the runtime.

## Fidelity
**High-fidelity, desktop only.** Colors, type, spacing, and interaction timings are final and should be matched closely at desktop widths (design was reviewed around 1440px).

**Not responsive.** There are no breakpoints. Mobile/tablet layouts must be designed during build. Intent:
- Header: nav collapses to a hamburger; full-screen drawer replaces the hover mega-menu.
- Archive row: 4 across → 2 across on tablet → 1 on phone.
- Men's / Women's split layouts: stack to single column, product pair stays 2-up.
- Youth row: 3 across → 1 across.
- Quickview: single column, image on top; drag-to-spin becomes a horizontal swipe (`touch-action` already set to `pan-y`).
- Footer: 4 columns → 2 → 1.

---

## Design Tokens

### Colors
| Token | Value | Use |
|---|---|---|
| Bone (page bg) | `#F5F4F1` | All light sections, panels, modals |
| Black | `#000000` | Text, borders, primary buttons, dark section bg |
| Alpha Orange | `#FF6B00` | Hover fill on all secondary/outline CTAs |
| Card grey | `#D9D9D9` | Product image backgrounds |
| Army green | `#636A4E` | Footer background |
| White | `#FFFFFF` | Text over imagery, footer headings |
| Muted black | `rgba(0,0,0,0.55)` | Secondary copy, prices |
| Faint black | `rgba(0,0,0,0.35)` | Tertiary labels, years |
| Hairline | `rgba(0,0,0,0.12–0.15)` | Borders |
| Footer body | `rgba(255,255,255,0.78)` | Footer links |
| Footer muted | `rgba(255,255,255,0.62)` | Copyright line |

### Typography
Single family: **Roboto Mono** (Google Fonts), weights 300 / 400 / 500 / 700.

| Role | Size | Weight | Letter-spacing | Notes |
|---|---|---|---|---|
| Nav links | 12px | 400 | 0.10em | uppercase, `white-space:nowrap` |
| Section headings | 16px | 500 | 0.12em | uppercase (THE HERITAGE ARCHIVE, MENSWEAR…) |
| Campaign headline | 26px | 500 | 0.03em | uppercase, white |
| Quickview product title | 26px | 500 | 0.02em | uppercase |
| Product name (card) | 11–12px | 400–500 | 0.06em | uppercase |
| Price | 11px | 400 | 0.06em | `rgba(0,0,0,0.55)` |
| Body copy | 12–13px | 300 | — | line-height 1.65–1.75, `text-wrap:pretty` |
| Button / CTA label | 11–12px | 400–500 | 0.14–0.16em | uppercase |
| Mega-menu links | 10px | 400 | 0.10em | uppercase |
| Mega-menu headings | 9px | 400 | 0.12em | `rgba(0,0,0,0.35)` |

### Spacing & motion
- Section horizontal padding: 64px (archive row uses 4px so cards go near edge-to-edge; its heading/CTA are indented 60px).
- Section vertical rhythm: 80–150px.
- Grid gaps: 4px (archive), 40px (split layouts), 24px (paired product cards), 56px (footer columns).
- Standard easing: `cubic-bezier(0.2, 0.6, 0.2, 1)`.
- Durations: 200–220ms (color/hover), 320ms (overlay fade), 620ms (spin snap), 900ms (image zoom, scroll reveal), 1200ms (large image hover zoom).
- No border radius anywhere except: the chat input bar (`999px` pill), the chat send button and spin cursor (circles), and chat message bubbles (20px).

---

## Screens / Views

### 1. Header (fixed, always mounted)
- Fixed, `z-index:80`, height 84px, padding `0 40px`. Grid `1fr auto 1fr`, column-gap 32px.
- Left: MEN, WOMEN, YOUTH, ACCESSORIES (gap 20px). Center: Alpha logo image, height 50px. Right: COLLABORATIONS, BRAND (gap 20px, margin-right 8px) then three 19px stroke SVG icons — search, account, bag (gap 26px).
- **Transparent over the hero** with white text and `filter:invert(1)` on the logo. Once `scrollY > 40` (or a menu is open) it goes solid `#F5F4F1` with black text, black logo, and a `rgba(0,0,0,0.12)` bottom border.
- **Auto-hide:** translates `-100%` when scrolling down, returns on scroll up or at top. Suppressed while a menu is open. 520ms transition.

### 2. Mega-menu (hover)
- Opens on `mouseenter` of a nav item; closes on `mouseleave` of the whole header.
- Panel: 360px wide, absolutely positioned under the header, background `#F5F4F1`, padding `28px 36px 32px`, `overflow-y:auto`.
- **Alignment:** left-edge for MEN / WOMEN / YOUTH / ACCESSORIES; right-edge for COLLABORATIONS / BRAND.
- **Height:** MEN and WOMEN run the full `calc(100vh - 84px)`; the other four are a uniform `260px`.
- Content: one or two link groups (9px grey heading + 10px links, gap 10px, underline on hover), then for MEN/WOMEN a full-bleed image pinned to the bottom (negative margins `8px -36px -32px`, `flex:1 1 auto`, `min-height:280px`, `object-fit:cover`).

Menu contents:
- **MEN** — CLOTHING: Shop All Mens, All Outerwear, Bomber Jackets, Field Jackets, Parkas, Utility Jackets & Vests, Lightweight Jackets, Shirt Jackets, Pants + Shorts, Hoodies + Sweatshirts, Tees + Tops. FEATURED: Best Sellers, Autumn/Winter 2026, Heritage Collection. Image: `man-patchbomber.png`.
- **WOMEN** — CLOTHING: Shop All Womens, All Outerwear, Parkas, Bomber Jackets, Lightweight Jackets, Field + Utility Jackets, Hoodies + Sweatshirts, Pants + Skirts, Tees + Tops. FEATURED: same three. Image: `pne.png`.
- **YOUTH** — Shop All Youth, Bomber Jackets, Parkas + Liners, Tees + Sweatshirts, NASA.
- **ACCESSORIES** — Shop All, Bags + Backpacks, Hats + Beanies, Belts, Lanyards + Wallets, Pets.
- **COLLABORATIONS** — Claimed. Not Given., Peggy Gou, Mastermind World, thisisneverthat, View All Collaborations.
- **BRAND** — Our Company, Heritage, Operation Re:Supply, Stories.

### 3. Hero
- `position:sticky; top:0; z-index:0`, height 90vh, black background.
- **Placeholder image `hero-poster.png` stands in for a looping campaign video.** In production this is a muted, autoplaying, looping `<video>` with the poster as its fallback. `data-media-slot="campaign-video"` marks the slot.
- Two gradient scrims: top (220px, `rgba(0,0,0,0.62)` → transparent) for nav legibility; bottom (34%, `rgba(0,0,0,0.55)` → transparent).
- Only overlay text: `AUTUMN WINTER 2026`, 11px, 0.12em, white, bottom-left at 44px/40px.
- **Scroll behavior:** the hero is sticky and every following section is `position:relative; z-index:1` with an opaque background, so the page slides up over the pinned hero.

### 4. The Heritage Archive
- Heading `THE HERITAGE ARCHIVE`, 16px/500, margin `0 0 56px 60px`. Section padding `80px 4px 60px`.
- Grid `repeat(4, 1fr)`, gap 4px — near edge-to-edge with 4px of breathing room at both ends.
- **Card:** 3:4 image well on `#D9D9D9`, image `object-fit:cover` at `scale(1.42)`.
  - Hover: image swaps to the back view (`data-back`) and zooms to `scale(1.42 → 1.62)` over 900ms; a `rgba(217,217,217,0.22)` overlay fades in over 320ms with **VIEW** centered (11px, weight 700, white, 0.12em).
  - Bookmark save icon top-right (14×18, 0.9 stroke, opacity 0.75 → 1 on hover), `stopPropagation` — opens the wishlist modal, not the quickview.
  - Below: name (12px/500 uppercase) left, year (11px, `rgba(0,0,0,0.35)`) right, price (11px, `rgba(0,0,0,0.55)`) underneath. Padding `0 14px`.
- Data: MA-1 Bomber Jacket / 1958 / $200.00 · M-65 Field Jacket / 1965 / $250.00 · B-15 Flight Jacket / 1940s / $215.00 · B-3 Sherpa Leather Jacket / 1934 / $1,300.00.
- Clicking a card opens the Quickview (currently only MA-1 has full content).
- CTA below: `SHOP ALL 2026 BEST SELLERS`, outlined box, padding `15px 34px`, margin `56px 0 28px 60px`, hover fills `#FF6B00` with white text.

### 5. Campaign
- Full-bleed section, height 92vh (intended 100vh — verify), black bg, `alpha-hero.png` at `object-fit:cover; object-position:center 12%`.
- Bottom gradient 46% tall, `rgba(0,0,0,0.62)` → transparent.
- Bottom bar at `left/right:44px, bottom:44px`, space-between, align-items flex-end:
  - Left: `Claimed. Not given.` (26px/500 uppercase white) + one paragraph, 12px/300, `rgba(255,255,255,0.78)`, max-width 52ch:
    > Alpha AW 2026 has no single muse. Instead, the campaign is a tribute to the unrelenting spirit of New York City and people who shape its communities without ever blending in. Representing decades of authentic craft, claimed by originals who make their own name.
  - Right: `SHOP NOW` outlined link, white border `rgba(255,255,255,0.65)`, padding `15px 34px`.

### 6. Menswear
- Heading row: `MENSWEAR` (16px/500) left, `EXPLORE` underlined link right. Section padding `150px 64px 40px`.
- Grid `minmax(0,1fr) minmax(0,1.15fr)`, gap 40px, `align-items:stretch`.
  - Left: large lifestyle image, aspect 5/8, `object-position:50% 0%`, hover `scale(1.03)` over 1200ms.
  - Right column (flex, gap 40px): a 2-up product grid (gap 24px), then a landscape lifestyle image that flexes to fill so both columns bottom-align.
- Products: **Nylon Messenger Bag $100.00** (`mens-bag.png`, contain, base scale 2.1 / hover 2.28) and **Relaxed Alpha Angels Tee $35.00** (`menswear-tee.png`, contain, 1.42 / 1.56). Both carry the bookmark icon and the same fade-to-VIEW hover as archive cards.

### 7. Womenswear
- Same pattern mirrored: products left, large image right. Grid `minmax(0,1.15fr) minmax(0,1fr)`.
- Large image `womenswear.jpg`, aspect ratio ~5/6.6.
- Landscape image `ne-skatepark.png`, `min-height:280px`, `object-position:50% 20%`.
- Products: **Studio Tote Bag Large $65.00** (`womens-bag.png`, contain, 1.5 / 1.63) and **Flight Nylon Mini Skirt Womens $100.00** (`womens-skirt.png`, contain, 1.45 / 1.58, `mix-blend-mode:multiply` because the source has a white background, plus `translateY(3%)`).
  - *Build note:* replace the blend-mode hack with a properly cut-out transparent PNG.

### 8. Youth
- Heading `YOUTH` + `EXPLORE`. Grid `repeat(3, 1fr)`, gap 40px. Cards use the 4:5 well, bookmark, and fade-to-VIEW hover.
- Youth N-3B Parka $150.00 (`youth-1.png`, cover) · Youth Quilted Liner Jacket $85.00 (`youth-2.png`, contain 1.42/1.56) · Youth NASA MA-1 Bomber $125.00 (`youth-3.png`, cover).
- Product names are placeholders pending real catalogue copy.

### 9. Newsletter
- Centered, max-width 640px, padding `140px 64px 150px`.
- `SIGN UP TO THE ALPHA NEWSLETTER` (16px/500 uppercase) + supporting line (13px/300, `rgba(0,0,0,0.55)`).
- Joined input + button (no gap, shared border): email input `16px 18px`, `SIGN UP` button `16px 26px`, hover fills `#FF6B00`.

### 10. Footer
- Background `#636A4E`, padding `72px 64px 40px`.
- Grid `repeat(3, minmax(0,1fr)) auto`, gap 56px: HELP, COMPANY, PROGRAMS, FOLLOW.
  - HELP: FAQ & Help Center, Contact Us, Order Status, Returns & Exchanges, Shipping Policy, International Shipping, Sizing & Fit, Privacy, Do Not Sell or Share My Personal Information.
  - COMPANY: Company History, Alpha Stories, NYC Flagship Store, Store Locator, Terms & Conditions, Satisfaction Guarantee, Jobs.
  - PROGRAMS: Affiliate Program, Educator Discount, Military Discount, First Responders & Medical Discount, Bulk Orders.
  - FOLLOW: Instagram, Facebook, YouTube, TikTok, X — 19px filled SVGs, gap 20px.
- Headings 11px/500 white; links 12px/300 `rgba(255,255,255,0.78)`, hover white + underline.
- Bottom bar (margin-top 56px, padding-top 28px, top border `rgba(255,255,255,0.25)`): wordmark image at `width:min(32vw,420px)` (currently white via `mix-blend-mode:screen; filter:invert(1)` — **replace with a white SVG wordmark in production**) and `© 2026 ALPHA INDUSTRIES — ALL RIGHTS RESERVED` right-aligned, 11px, `padding-bottom:26px` to sit level with the logo baseline.

### 11. Quickview (full-screen overlay, MA-1)
`position:fixed; inset:0; z-index:120; background:#F5F4F1; overflow-y:auto`. Close × top-right at 34/44px. Inner max-width 1440px, padding `64px 80px 96px`, grid `1fr 1fr`, gap 80px.

**Left column** (sticky, `top:64px`):
- 4:5 image well, `#D9D9D9`, `perspective:1600px`, `cursor:none`, `touch-action:pan-y`, `user-select:none`.
- Two stacked `<img>` in a `preserve-3d` container: black front at `translateZ(7px) scale(1.42)`, orange front at `rotateY(180deg) translateZ(7px) scale(1.42)`, both `backface-visibility:hidden`. This is the reversible-jacket spin.
- Depth treatment: a radial highlight/shadow layer behind, `drop-shadow` on the rotating group that eases from `0 26px 26px rgba(0,0,0,0.3)` toward flatter as rotation approaches 90°, a brightness dip to ~0.78 at the edge, and a diagonal sheen gradient whose opacity peaks at 90°. Base tilt `rotateX(3deg)`.
- **Interaction:** pointer drag rotates 1:1-ish; on release it snaps to the nearer face over 620ms. A 104px translucent circular cursor labelled **SPIN** follows the pointer inside the well (blurred backdrop, fades in on enter).
- Below: **STYLE IT** button (13px/500, 0.16em, transparent → `#FF6B00` fill with white text on hover, padding `9px 14px`, left-aligned with the image) and the word **REVERSIBLE** (11px, `rgba(0,0,0,0.55)`) right-aligned.
- **STYLE IT chat panel** — collapsed (`max-height:0; opacity:0`), slides open over 560ms. Contents top-to-bottom: user's typed message as a right-aligned bubble; a three-dot typing indicator; the AI reply (caption + a 2-up product grid); then the Alpha logo, the line "This chat is AI-powered for faster assistance" (10px), a back-arrow reset button, and a pill input `Ask anything…` with a black circular ↑ send button.
  - **Demo logic:** on submit, show the query, show the loader for 1500ms, then reply. If the text contains any of `day, daytime, morning, afternoon, walk, casual, errand, weekend, coffee, sun, park, brunch` → the **orange** response (jacket spins to the orange side; Essential Relaxed Tee $45.00 + P41 HBT Combat Trouser $150.00). Otherwise the **black** response (OVO x Alpha Garment Dyed Tee $95.00 + Classic Trouser $120.00). Captions are in `RESULTS` in the source. **Replace with a real API call in production.**

**Right column:**
- Spec rows (11px, 0.12em, 150px label column): DESIGNATION MA-1 · ISSUED 1958, US Air Force · SHELL 100% flight nylon.
- Title `MA-1 BOMBER JACKET (HERITAGE)` 26px/500, price `$200.00` 15px.
- Description paragraph (12px/300, line-height 1.75) — see source for exact copy.
- Size grid: two rows of `repeat(7, 1fr)`, gap 8px. Row 1: XS S M L XL 2XL 3XL. Row 2: 4XL 5XL MT LT. Selected = black fill, white text. Unavailable = faded border/text with a diagonal strikethrough gradient. Default selected `M`.
- `VIEW SIZE GUIDE` underlined link, then full-width black `ADD TO BAG` button (padding `20px 16px`).
- Accordions with 1px black dividers, +/− signs: BENEFITS, FEATURES, FABRICS & CARE (contents in `ACCORDIONS` in the source).

### 12. Wishlist modal
Triggered by any bookmark icon. Backdrop `rgba(0,0,0,0.4)`, panel max-width 620px, `#F5F4F1`. Header bar with centered `WISHLIST` label and ×. Body: `START YOUR WISHLIST` (18px/500 uppercase) + "To start a wishlist (and get perks like early access to new drops), you need to become an Alpha Industries member" + two buttons — `LOGIN` (black fill) and `CREATE AN ACCOUNT` (outline, hover `#FF6B00`).

### 13. Newsletter popup
Appears once per session, 15s after load **and** past 90% of hero height; suppressed via `sessionStorage['alphaPopupSeen']`. Backdrop `rgba(0,0,0,0.45)`, panel max-width 480px. `SIGN UP FOR ALPHA UPDATES`, "Be the first to be notified of new arrivals and special offers.", email input, black `SUBSCRIBE` button, fine print "New subscribers receive 20% off sale items."

---

## Interactions & Behavior Summary
| Behavior | Trigger | Detail |
|---|---|---|
| Header theme swap | `scrollY > 40` or menu open | transparent/white → `#F5F4F1`/black, 400ms |
| Header auto-hide | scroll direction | ±4px threshold, `translateY(-100%)`, 520ms |
| Mega-menu | nav hover / header mouseleave | see §2 |
| Sticky hero reveal | scroll | hero `position:sticky`, later sections opaque at `z-index:1` |
| Scroll reveal | IntersectionObserver, threshold 0.15 | `opacity 0→1`, `translateY(26px)→0`, 900ms, fires once (`[data-reveal]`) |
| Card hover | `mouseenter`/`mouseleave` | back-image swap + zoom + VIEW overlay |
| Quickview | archive card click | full-screen overlay |
| Spin | pointer drag in image well | 1:1 rotation, snap to nearest face, 620ms |
| Style chat | STYLE IT click | slide open 560ms, keyword-routed scripted reply after 1500ms |
| Wishlist | bookmark click | modal; `stopPropagation` so the card doesn't open |
| Newsletter popup | 15s dwell + past hero | once per session |

## State
`menu` (null | MEN | WOMEN | YOUTH | ACCESSORIES | COLLABORATIONS | BRAND) · `archive` (open card index | null) · `side` ('black' | 'orange') · `size` (default 'M') · `open` (accordion map) · `chatOpen` · `query` · `loading` · `result` · `popup` · `wishlist` · `scrolled` · `passedHero` · `dwelled`.

No data fetching. All catalogue data is hardcoded in `ARCHIVE`, `RESULTS`, `MENUS`, `MENU_IMG`, `FOOTER`, `SIZE_ROWS`, `ACCORDIONS` at the top of the script block — swap these for real product/nav data.

## Assets
All images are in `uploads/` in this bundle, supplied by the client. Notes:
- `hero-poster.png` — **placeholder for the campaign video loop.**
- `Alpha-Industries-logo-text.jpg` — JPEG on white, faked to white via blend mode. Get a proper SVG wordmark.
- `womens-skirt.png` — white background, faked transparent via `mix-blend-mode:multiply`. Get a cut-out.
- `*-back.png` files are the hover states for archive cards.
- Social icons and header icons are inline SVG paths in the source — copy them directly.

## Files
- `Alpha Landing.dc.html` — the full design. Markup is between `<x-dc>` and `</x-dc>`; the logic class and all data constants are in the `<script type="text/x-dc">` block at the bottom.
- `support.js` — the prototype runtime. Needed only to open the HTML in a browser; do not port it.
- `uploads/` — all image assets.

To view the prototype: serve this folder over a local HTTP server and open `Alpha Landing.dc.html` (file:// will block the asset loads).
