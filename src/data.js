// All catalogue / nav / copy data is hardcoded here, mirroring the design
// handoff's ARCHIVE, MENUS, MENU_IMG, FOOTER, SIZE_ROWS, ACCORDIONS and RESULTS
// constants. Swap these for real product/nav data in production.

const IMG = '/images'

export const ARCHIVE = [
  { year: '1958', price: '$200.00', name: 'MA-1 Bomber Jacket', img: `${IMG}/ma1-black-frontview.png`, back: `${IMG}/ma1-black-backview.png` },
  { year: '1965', price: '$250.00', name: 'M-65 Field Jacket', img: `${IMG}/m65-card.png`, back: `${IMG}/m65-card-back.png` },
  { year: '1940s', price: '$215.00', name: 'B-15 Flight Jacket', img: `${IMG}/b15-card.png`, back: `${IMG}/b15-card-back.png` },
  { year: '1934', price: '$1,300.00', name: 'B-3 Sherpa Leather Jacket', img: `${IMG}/b3-card.png`, back: `${IMG}/b3-card-back.png` },
]

export const SIDE_IMG = {
  black: `${IMG}/ma1-black-frontview.png`,
  orange: `${IMG}/ma1-orange-frontview.png`,
}

export const SIZE_ROWS = [
  ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  ['4XL', '5XL', 'MT', 'LT'],
]

// Sizes that are shown as unavailable (faded + strikethrough).
export const UNAVAILABLE_SIZES = ['LT']

export const ACCORDIONS = [
  { key: 'benefits', label: 'BENEFITS', lines: ['Water Resistant', 'Reversible'] },
  {
    key: 'features',
    label: 'FEATURES',
    lines: [
      'Alpha logo on zig-zag zipper extension',
      'MA-1 utility pocket on sleeve',
      'Signature red ribbon on utility pocket',
      'Sleeve shirring',
      'Two lower flap pockets',
      'Two interior welt pockets',
      'Knit rib collar, cuffs and waistband',
      'Ottoman knit cuffs',
      'This garment is a unisex style. This jacket fits true to size for a men’s core fit. Women are recommended to choose 2 size’s down.',
    ],
  },
  {
    key: 'fabrics',
    label: 'FABRICS & CARE',
    lines: [
      'SHELL: 100% Flight Nylon',
      'LINING: 100% Nylon',
      'FILL: 100% Polyester',
      'Recommended care: dry clean only.',
    ],
  },
]

// STYLE IT scripted responses. Demo only — replace with a real API call in
// production. Keyword routing picks orange (daytime) vs black (default).
export const RESULTS = {
  black: {
    caption:
      'Black side for night. The OVO tee runs longer than the jacket, so the crop reads intentional. Classic trouser keeps the line straight underneath.',
    items: [
      { name: 'OVO x Alpha Garment Dyed Tee', price: '$95.00', img: `${IMG}/ovoxalpha-garmentdyedtee.png` },
      { name: 'Classic Trouser', price: '$120.00', img: `${IMG}/classic-trouser.png` },
    ],
  },
  orange: {
    caption:
      'Orange side for daylight — the rescue lining was built to be seen. P41 combat trouser and a plain tee keep the ground quiet.',
    items: [
      { name: 'Essential Relaxed Tee', price: '$45.00', img: `${IMG}/essential-relaxed-tee.png` },
      { name: 'P41 HBT Combat Trouser', price: '$150.00', img: `${IMG}/p41-hbt-combatpant.png` },
    ],
  },
}

export const DAY_WORDS = [
  'day', 'daytime', 'morning', 'afternoon', 'walk', 'casual',
  'errand', 'weekend', 'coffee', 'sun', 'park', 'brunch',
]

export const MENU_IMG = {
  MEN: `${IMG}/man-patchbomber.png`,
  WOMEN: `${IMG}/pne.png`,
}

export const MENUS = {
  MEN: [
    { title: 'CLOTHING', links: ['SHOP ALL MENS', 'ALL OUTERWEAR', 'BOMBER JACKETS', 'FIELD JACKETS', 'PARKAS', 'UTILITY JACKETS & VESTS', 'LIGHTWEIGHT JACKETS', 'SHIRT JACKETS', 'PANTS + SHORTS', 'HOODIES + SWEATSHIRTS', 'TEES + TOPS'] },
    { title: 'FEATURED', links: ['BEST SELLERS', 'AUTUMN/WINTER 2026', 'HERITAGE COLLECTION'] },
  ],
  WOMEN: [
    { title: 'CLOTHING', links: ['SHOP ALL WOMENS', 'ALL OUTERWEAR', 'PARKAS', 'BOMBER JACKETS', 'LIGHTWEIGHT JACKETS', 'FIELD + UTILITY JACKETS', 'HOODIES + SWEATSHIRTS', 'PANTS + SKIRTS', 'TEES + TOPS'] },
    { title: 'FEATURED', links: ['BEST SELLERS', 'AUTUMN/WINTER 2026', 'HERITAGE COLLECTION'] },
  ],
  YOUTH: [
    { title: 'CLOTHING', links: ['SHOP ALL YOUTH', 'BOMBER JACKETS', 'PARKAS + LINERS', 'TEES + SWEATSHIRTS', 'NASA'] },
  ],
  COLLABORATIONS: [
    { title: 'COLLABORATIONS', links: ['CLAIMED. NOT GIVEN.', 'PEGGY GOU', 'MASTERMIND WORLD', 'THISISNEVERTHAT', 'VIEW ALL COLLABORATIONS'] },
  ],
  BRAND: [
    { title: 'BRAND', links: ['OUR COMPANY', 'HERITAGE', 'OPERATION RE:SUPPLY', 'STORIES'] },
  ],
  ACCESSORIES: [
    { title: 'ACCESSORIES', links: ['SHOP ALL', 'BAGS + BACKPACKS', 'HATS + BEANIES', 'BELTS', 'LANYARDS + WALLETS', 'PETS'] },
  ],
}

// Order of nav items across the header (left group + right group).
export const NAV_LEFT = ['MEN', 'WOMEN', 'YOUTH', 'ACCESSORIES']
export const NAV_RIGHT = ['COLLABORATIONS', 'BRAND']

export const FOOTER = [
  { title: 'HELP', links: ['FAQ & Help Center', 'Contact Us', 'Order Status', 'Returns & Exchanges', 'Shipping Policy', 'International Shipping', 'Sizing & Fit', 'Privacy', 'Do Not Sell or Share My Personal Information'] },
  { title: 'COMPANY', links: ['Company History', 'Alpha Stories', 'NYC Flagship Store', 'Store Locator', 'Terms & Conditions', 'Satisfaction Guarantee', 'Jobs'] },
  { title: 'PROGRAMS', links: ['Affiliate Program', 'Educator Discount', 'Military Discount', 'First Responders & Medical Discount', 'Bulk Orders'] },
]
