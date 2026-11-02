# SIGNAL — Abdulrahman Zidan

## Idea
A conversation becomes a qualified opportunity when someone owns the context and the next action. Four branches converge into one clear path. The visual system represents that progression instead of decorative 3D.

## Design system
Background #101719; primary text #F3F1E9; secondary text #A9B5B4; signature accent #75DEC7; borders #2B3739. Proof reverses to an ivory surface with a darker green accent #236653. Contrast is designed around text readability rather than glowing effects.

Space Grotesk for display; DM Sans for body and UI. Latin WOFF2 files are self-hosted with font-display: swap. Large responsive headings, small metadata, crisp borders, square controls, generous editorial space. Portrait preserves the actual image and its identity; a WebP copy reduces bytes.

## Motion and interaction
Native scrolling only. Pointer-reactive WebGL lead paths on desktop; animated probes convey progress. WebGL is dynamically imported and isolated from the document. Small transformations on CTAs, intentional section entry, service and employer detail changes, selectable pipeline stages, an interactive tool map, contextual cursor light, active navigation and page progress. No smooth-scroll library or wheel/touch interception.

Reduced motion removes the ticker, entry animations, cursor and magnetic effects, and uses static SVG instead of WebGL. Mobile has a deliberately vertical composition, a full-screen navigation dialog, touch-first controls, and a lightweight SVG signal.

## Asset presentation
Actual 640×640 portrait in a large editorial frame in About. The uploaded 3:55 MP3 is preserved byte for byte in an inline editorial audio frame. A microphone emblem and a waveform derived from the recording accompany native audio playback, keyboard/touch seeking, skip controls, mute, speed control, synchronized English subtitles and a full transcript. Waveform peaks are precomputed; preload="none" defers audio transfer until requested. No video or old video poster is shipped. Original CV bytes are preserved and display inside the website, with the unchanged PDF available for download.

## Content accuracy
The supplied creative brief governs site claims and contact details: 3+ years, approximately one year of Lead Manager experience, seven named companies, real estate and solar. The supplied PDF has different contact details, a 4+ years claim, an additional company and education timing; it is kept unchanged, and those discrepancies are not silently copied into site copy. Appointment setting and virtual assistance are capabilities, not invented employment records.

## Remaining review
The current build is a first implementation of the selected direction, not a claim of an independently judged agency budget or award. Browser visual QA and live GitHub Pages verification are required before declaring the website finished. English subtitles are transcribed from the uploaded recording, aligned to word timestamps, and grouped into short readable cues. The WebVTT and application caption data use the same timing source.


## Audio design references
Reviewed [Midlife Engineering](https://www.awwwards.com/sites/midlife-engineering) for restrained sound controls and [Daydream Player](https://www.awwwards.com/sites/daydream-player) for a deliberate, tactile player hierarchy. The chosen adaptation keeps SIGNAL’s existing typefaces, colors and page structure: a narrow editorial panel, fine corner marks, a custom line microphone, a prominent circular play control, the recording’s precomputed waveform and a dedicated caption well. Mobile stacks the two panels and retains 44px controls. The subtitle area reserves space for every cue, and the complete transcript uses readable paragraphs.

## SIGNAL interaction details
One native audio element also supplies a compact floating controller after the main frame leaves view. Pause/resume retains that instance and its position; return restores focus to the main control. Dismissal, completion and open navigation/command dialogs suppress the mini player.

Reviewed phrase wording and WebVTT timings remain unchanged. Word highlighting uses recognition timestamps, including corrected product spelling. Terms recognized as one word remain one timed unit; two zero-duration recognition words are grouped with their adjacent spoken term instead of assigning invented times. A 12 Hz RMS envelope is precomputed from the original recording for the microphone light. Native currentTime drives both effects at up to 30 UI updates/second; no Web Audio context, microphone permission, additional media download or runtime service is needed.

The theme reveal uses the browser's same-document View Transitions API and the original toggle as its origin. Reduced motion and unsupported browsers switch directly. Cross-tab preference synchronization and scroll position are preserved. See the [Chrome circular reveal reference](https://view-transitions.chrome.dev/).

World view draws a great-circle collaboration route from a representative [Cairo city point](https://www.geonames.org/360630/cairo.html) to the selected state's existing coordinates, using the map's original projection. The line draws once and the destination responds once. Routes communicate remote work, not physical travel. U.S. view, portrait map instructions and the thirteen selectable states remain available.

The method's signal follows the measured node positions, wrapping outside row text on smaller screens. Each selection gets one short movement. A separate email copy button preserves the mailto link and reports actual clipboard success or failure. New controls have 44px targets; decorative motion honors reduced-motion preferences.
