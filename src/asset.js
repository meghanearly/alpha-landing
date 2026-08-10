// Resolve a public asset URL against Vite's configured base path so links work
// both in dev (base '/') and when deployed under a subpath such as GitHub
// Pages' '/alpha-landing/'. Pass a path relative to /public, e.g.
// asset('images/foo.png') or asset('hero.mp4').
export const asset = (p) => import.meta.env.BASE_URL + String(p).replace(/^\/+/, '')
