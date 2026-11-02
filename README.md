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
* `public/intro.mp3` — the user’s uploaded audio introduction, byte-identical (3:55, 3.77 MB).
* `public/intro.vtt` — synchronized English captions transcribed from the recording.
* `src/data/introduction.json` — matching caption cues, transcript, audio SHA-256 and precomputed waveform peaks.
* `public/Abdulrahman-Zidan-CV.pdf` — unchanged uploaded PDF; available through the in-page reader and DOWNLOAD CV.
* `public/fonts/` — self-hosted display/body fonts and their licenses.

The real assets are already included. The user does not need to rename or upload them separately. Missing portrait/audio states keep the rest of the page usable.

## GitHub Pages
The public repository is https://github.com/Zidmatrix/A.Zidan. GitHub Actions is configured as the Pages source; pushes to `main` build and deploy automatically.

Published site: https://zidmatrix.github.io/A.Zidan/.

## Accessibility and resilience
Native modal dialogs, keyboard focus restoration, Escape-to-close, visible focus, service arrow-key navigation, semantic sections, reduced motion, responsive touch controls, accessible native-audio-based custom controls, WebGL constructor/error/context-loss fallback and resource cleanup. No hover-only essential information.

## Validation status
Run `npm run typecheck`, `npm run build`, and `node scripts/check-export.mjs` for release checks. `scripts/check-audio-browser.mjs` exercises actual native playback, all three CTAs, seek/pause/rate/replay/subtitle behavior, failed-request recovery, both themes and responsive layouts. It also checks the command menu, map and CV reader. Run with Playwright available through `NODE_PATH` and an optional `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`; set `PORTFOLIO_TEST_URL=https://zidmatrix.github.io/A.Zidan/` for live verification. Hardware-specific WebGL and physical iOS devices require device testing; browser checks cover Chromium with mobile emulation and software WebGL.

## Versions
Stable npm package versions were checked before installation; exact dependencies and lockfile are included. Next.js 16.3.8, React 19.3.0, Motion 14.0.0 and Three.js 0.186.1. Three.js is used directly to avoid an unnecessary renderer layer. No alpha or WebGPU dependency.

## Markets and CV update

Eight state markets use a keyboard-accessible static SVG world map, centered on the U.S. by default, with selectable pins and U.S./world views. Mobile uses an interactive state list. Coordinates are separate in `src/lib/markets.ts`; public-domain Natural Earth geometry is bundled locally. No API key or external map requests.

The original two-page CV is rendered faithfully in a framed in-site reader with pagination, zoom, accessible extracted text, and an optional original-PDF download. All VIEW CV links navigate to this section. PDF bytes are unchanged. The LinkedIn URL and more-than-two-years direct-client/company experience follow the user's latest supplied information.

## SIGNAL visual and theme update

Markets now include Virginia, Tennessee, Indiana, Illinois and Ohio, bringing the total to 13. Marker count and coverage labels come from the separate state data array.

The header uses the real uploaded portrait. A persistent Light/Dark theme control is available in the header at all widths; preference is applied before paint and stored locally. The opening brief identifies U.S. real estate sales experience directly.

Four bespoke conceptual images (headset, pipeline desk, interconnected systems, residential architecture) are locally bundled as 1440px and 640px WebP variants with responsive loading. These are editorial illustrations of the work, not client records or proof of property transactions. The real portrait, uploaded audio and unchanged CV remain integrated.

## Audio introduction (October 2026)
The old video is replaced by one in-page audio player. All introduction CTAs start the same recording and navigate to its framed player. Captions follow native media currentTime, including after seeking or changing speed; CC and the full transcript are available without external services. The waveform is computed from the original recording, and no media library or new runtime dependency is added. Both themes and reduced-motion preferences are respected. Audio and captions are local assets under the GitHub Pages base path.


### Recording and caption provenance
Original file: `Intro.mp3`, SHA-256 `6228fad4092c9b5bcca755a5dbda87e53279d89e9c1ffdd13629a21315d88778`; 3,774,390 bytes; 234.840813 seconds; MP3 mono, 44.1 kHz, approximately 128 kbps. The source is retained unchanged as `public/intro.mp3`; no re-encoding is needed. Measured peak is −0.9 dBFS and mean level −21.7 dBFS.

The recording was independently recognized with faster-whisper `small.en`, beam size 5, word timestamps, no VAD, entirely offline with the optional ONNX dependency excluded. `scripts/data/intro-recognition.json` retains the raw word times and source hash. Reviewed phrase boundaries and product spelling corrections produce 81 short English cues. The earlier erroneous “client’s experience” recognition is corrected from the actual audio to “quality of my work over time.” Caption ends are held briefly through pauses, without overlapping the next phrase. `python scripts/prepare-intro.py` regenerates JSON, matching WebVTT and waveform from this evidence using numpy and ffmpeg. None of these authoring dependencies run in the browser or GitHub Pages workflow.

## Interaction refinements
The same audio instance now powers an optional mini player outside the introduction, recognized-word highlighting and a microphone light driven by a precomputed 12 Hz recording envelope. The MP3, reviewed phrase text, phrase timestamps, waveform and WebVTT are unchanged. Zero-duration recognition words are kept with an adjacent timed term; no subword timing is guessed. The mini player can be paused, resumed, dismissed or used to return to the main player, and hides behind open dialogs.

The theme toggle uses a circular native View Transition when supported and motion is allowed, with a direct fallback. World-map selections draw Cairo-to-state collaboration paths from geographic coordinates. Method selections move a signal along measured nodes without crossing row text. Contact includes clipboard copying with truthful inline feedback. No runtime dependency, backend or external asset is added.
