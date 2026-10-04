# A.Zidan / SIGNAL

Personal brand website for Abdulrahman Zidan. New, isolated project; the old portfolio repository is unchanged.

## Run
Node.js 22 recommended.

```sh
npm ci
npm run dev
```

Open http://localhost:3000/A.Zidan/.

```sh
npm run typecheck
npm run build
node scripts/check-export.mjs
```

`out/` is the production static export. No server, database or API routes are needed. GitHub Pages base path is `/A.Zidan`.

## Structure
```
.github/workflows/pages.yml   build and GitHub Pages deployment
src/app/                     page, metadata, layout, responsive styles
src/components/Portfolio.tsx sections and accessible interactions
src/components/Signal.tsx    dynamic WebGL boundary and SVG fallback
src/components/SignalScene.tsx Three.js lead-path renderer
src/lib/content.ts           editable factual content
public/                      real assets, fonts and SEO files
scripts/check-export.mjs     production asset and anchor verification
DESIGN.md                    design and motion system
```

## Integrated assets
* `public/profile.jpg` — real uploaded JPEG; `file.enc` was a valid JPEG, not encrypted.
* `public/profile.webp` — optimized portrait used by the page.
* `public/intro.mp4` — real uploaded introduction, optimized for web delivery.
* `public/intro-poster.jpg` — still from the actual introduction.
* `public/Abdulrahman-Zidan-CV.pdf` — unchanged uploaded PDF; available through the in-page reader and DOWNLOAD CV.
* `public/fonts/` — self-hosted display/body fonts and their licenses.

The real assets are already included. The user does not need to rename or upload them separately. Missing portrait/video states keep the rest of the page usable.

## GitHub Pages
The public repository is https://github.com/Zidmatrix/A.Zidan. GitHub Actions is configured as the Pages source; pushes to `main` build and deploy automatically.

Published site: https://zidmatrix.github.io/A.Zidan/.

## Accessibility and resilience
Native modal dialogs, keyboard focus restoration, Escape-to-close, visible focus, service arrow-key navigation, semantic sections, reduced motion, responsive touch controls, native video controls, WebGL constructor/error/context-loss fallback and resource cleanup. No hover-only essential information.

## Validation status
Production build, TypeScript and export asset checks pass. Live testing verified native video playback (67.5 seconds), the original two-page CV through the in-page reader, keyboard service tabs, method/company/tool selectors, command search, mobile navigation and responsive layouts. The cloud browser disables WebGL, so the SVG fallback was verified; hardware WebGL and native fullscreen remain unverified in this environment. Portrait and video poster load from the published Pages site.

## Versions
Stable npm package versions were checked before installation; exact dependencies and lockfile are included. Next.js 16.3.8, React 19.3.0, Motion 14.0.0 and Three.js 0.186.1. Three.js is used directly to avoid an unnecessary renderer layer. No alpha or WebGPU dependency.

## Markets and CV update

Eight state markets use a keyboard-accessible static SVG world map, centered on the U.S. by default, with selectable pins and U.S./world views. Mobile uses an interactive state list. Coordinates are separate in `src/lib/markets.ts`; public-domain Natural Earth geometry is bundled locally. No API key or external map requests.

The original two-page CV is rendered faithfully in a framed in-site reader with pagination, zoom, accessible extracted text, and an optional original-PDF download. All VIEW CV links navigate to this section. PDF bytes are unchanged. The LinkedIn URL and more-than-two-years direct-client/company experience follow the user's latest supplied information.
