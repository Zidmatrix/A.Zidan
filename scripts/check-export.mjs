import {readFile,stat,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const html=await readFile('out/index.html','utf8');
const expected=['top','about','services','method','experience','markets','proof','systems','introduction','cv','contact'];
for(const id of expected) assert(html.includes(`id="${id}"`),`Missing section: ${id}`);
for(const file of ['profile.jpg','profile.webp','intro.mp3','intro.vtt','cv/page-1.webp','cv/page-2.webp','Abdulrahman-Zidan-CV.pdf','fonts/display.woff2','fonts/body.woff2','fonts/body-semibold.woff2','icon.svg','sitemap.xml','robots.txt']) {
 const source=await stat(`public/${file}`),output=await stat(`out/${file}`);
 assert(source.size>0&&source.size===output.size,`Missing or truncated asset: ${file}`);
}
for(const anchor of html.matchAll(/href="#([^"]+)"/g)) assert(expected.includes(anchor[1]),`Broken anchor: ${anchor[1]}`);
for(const cv of html.matchAll(/<a[^>]+href="\/A\.Zidan\/Abdulrahman-Zidan-CV\.pdf"[^>]*>/g)) {
 assert(cv[0].includes('download=')&&!cv[0].includes('target='),'Original PDF must be available for download in place');
 assert(html.includes('href="#cv"')&&html.includes('/cv/page-1.webp'),'CV reader and navigation missing');
}
for(const path of html.matchAll(/(?:src|href)="(\/A\.Zidan\/[^"#?]+)"/g)) {
 const local=path[1].slice('/A.Zidan/'.length);
 if(!local.endsWith('/'))assert((await stat(`out/${local}`)).size>0,`Broken export reference: ${local}`);
}
assert(html.includes('src="/A.Zidan/profile.webp"')&&html.includes('src="/A.Zidan/intro.mp3"'),'Real portrait and audio introduction must be integrated');
assert(!html.includes('<video')&&!html.includes('intro.mp4')&&!html.includes('intro-poster.jpg'),'Old video must not render');
assert(html.includes('preload="none"')&&html.includes('Synchronized English subtitles')&&html.includes('READ THE FULL TRANSCRIPT'),'On-demand audio and accessible subtitles/transcript must render');
assert(html.includes('Abdulrahman')&&html.includes('Zidan'),'Identity missing');
console.log('PASS: all sections, anchors, assets, local fonts, embedded CV and PDF download and exported file references.');

for (const name of ['Michigan','Florida','Texas','California','Georgia','Arizona','North Carolina','Pennsylvania','Virginia','Tennessee','Indiana','Illinois','Ohio']) assert(html.includes(name),`Missing market: ${name}`);
assert(html.includes('abdulra7man-zidan/?isSelfProfile=true'),'Correct LinkedIn missing');
assert(html.includes('For more than two years'),'Direct-client experience missing');

assert(html.includes('Switch to light theme')&&html.includes('13 U.S. MARKETS'),'Theme control or market count missing');
assert((html.match(/class="map-marker"/g)||[]).length===13,'All thirteen map markers must render');

assert(!html.includes('art-figure')&&!html.includes('/art/'),'Added editorial photos must not render');
assert(html.includes('signal-fallback')&&html.includes('service-orbit'),'Original signal and service artwork missing');

for(const w of [320,640,960,1280])assert((await stat(`out/photography/hero-remote-${w}.webp`)).size<120000,'Hero photo exceeds byte budget');
assert((html.match(/class="hero-photo-detail"/g)||[]).length===1,'Hero photograph must appear once');

const photoSections=['about','services','experience','markets','proof','systems','introduction','cv','contact'];
for(const section of photoSections){
 assert((html.match(new RegExp(`data-photo-section="${section}"`,'g'))||[]).length===1,`One stock photograph required in ${section}`);
 const photoName=section==='experience'?'experience-callcenter':section;
 for(const w of [320,640,960]){const source=await stat(`public/photography/${photoName}-${w}.webp`),exported=await stat(`out/photography/${photoName}-${w}.webp`);assert(source.size===exported.size&&source.size<100000,`Photo export or byte budget failed: ${section}/${w}`);}
}
const photoSources=JSON.parse(await readFile('public/photography/sources.json','utf8'));
assert(new Set([10376213,...photoSources.map(p=>p.pexelsId)]).size===10,'Stock photographs must be unique across all ten sections');
assert(photoSources.every(p=>p.source.startsWith('https://www.pexels.com/photo/')&&p.license==='https://www.pexels.com/license/'),'Source and licensing provenance required');
console.log('PASS: ten unique licensed stock photos, responsive variants and production byte budgets.');

assert(html.includes('href="mailto:abd3lra7manzidan@gmail.com"'),'Correct contact email must render');
assert(!html.includes('abd3lra7man'+'@gmail.com'),'Incorrect contact email must not render');
assert(html.includes('Rotate your phone to landscape'),'Phone map orientation notice missing');

const vtt=await readFile('out/intro.vtt','utf8');
assert(vtt.startsWith('WEBVTT\n'),'WebVTT header missing');
const cues=[...vtt.matchAll(/(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})\n([^\n]+)/g)];
assert(cues.length>50,'Full introduction captions must survive export');
const seconds=s=>s.split(':').reduce((a,v)=>a*60+Number(v),0);
let previous=0;
for(const cue of cues){const start=seconds(cue[1]),end=seconds(cue[2]);assert(start>=previous&&end>start&&end<=234.841,'Invalid or out-of-order caption cue');previous=start;}
assert(seconds(cues.at(-1)[2])>230,'Subtitles must cover the closing words');
assert((await stat('out/intro.mp3')).size<4000000,'Audio exceeds original upload size budget');
console.log('PASS: original MP3, on-demand playback, full timed subtitles/transcript and video replacement.');

const intro=JSON.parse(await readFile('src/data/introduction.json','utf8'));
assert.equal(createHash('sha256').update(await readFile('out/intro.mp3')).digest('hex'),intro.sha256,'Published audio must be byte-identical to the uploaded source');
assert.equal(cues.length,intro.captions.length,'VTT and application must contain the same captions');
for(let i=0;i<cues.length;i++){
 const cue=intro.captions[i];
 assert.equal(Math.round(seconds(cues[i][1])*1000),Math.round(cue.start*1000));assert.equal(Math.round(seconds(cues[i][2])*1000),Math.round(cue.end*1000));assert.equal(cues[i][3],cue.text);
 assert(cue.end-cue.start>=1.1 && cue.text.length<=85,'Subtitle must remain readable');
 if(i)assert(cue.start>=intro.captions[i-1].end,'Caption overlap');
}
assert.equal(intro.waveform.length,100);assert(intro.waveform.every(p=>p>0&&p<=1),'Invalid precomputed waveform');
assert.equal((html.match(/<audio /g)||[]).length,1,'All introduction CTAs must share one audio');
for(const old of ['intro.mp4','intro-poster.jpg'])await assert.rejects(access(`out/${old}`),'Old video assets must not ship');
console.log('PASS: source audio SHA-256, matching JSON/WebVTT, readable nonoverlapping cues, single media instance and no shipped video.');
