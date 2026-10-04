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
* `public/Abdulrahman-Zidan-CV.pdf` — unchanged uploaded PDF; opens with `target="_blank" rel="noreferrer"`.
* `public/fonts/` — self-hosted display/body fonts and their licenses.

The real assets are already included. The user does not need to rename or upload them separately. Missing portrait/video states keep the rest of the page usable.

## GitHub Pages
Create the public repository `Zidmatrix/A.Zidan`, with `main` as its default branch. Push this project to it. In Settings → Pages, select **GitHub Actions** as the source. The included workflow builds, checks the static export, uploads the artifact and deploys it.

Expected final URL: https://zidmatrix.github.io/A.Zidan/.

The repository itself and its Pages configuration have not yet been created because the available GitHub connector has no repository-creation or Pages-settings operation; the browser requires sign-in. No deployment success is claimed until live verification.

## Accessibility and resilience
Native modal dialogs, keyboard focus restoration, Escape-to-close, visible focus, service arrow-key navigation, semantic sections, reduced motion, responsive touch controls, native video controls, WebGL constructor/error/context-loss fallback and resource cleanup. No hover-only essential information.

## Validation status
Production build and TypeScript pass. Static export checks are run separately. Live desktop/mobile interaction, video playback, fullscreen, CV popup and WebGL runtime behavior require browser verification after deployment. The cloud browser does not permit access to this local development server.

## Versions
Stable npm package versions were checked before installation; exact dependencies and lockfile are included. Next.js 16.3.8, React 19.3.0, Motion 14.0.0 and Three.js 0.186.1. Three.js is used directly to avoid an unnecessary renderer layer. No alpha or WebGPU dependency.
