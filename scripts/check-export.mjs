import {readFile,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await readFile('out/index.html','utf8');
const expected=['top','about','services','method','experience','proof','systems','introduction','contact'];
for(const id of expected) assert(html.includes(`id="${id}"`),`Missing section: ${id}`);
for(const file of ['profile.jpg','profile.webp','intro.mp4','intro-poster.jpg','Abdulrahman-Zidan-CV.pdf','fonts/display.woff2','fonts/body.woff2','fonts/body-semibold.woff2','icon.svg','sitemap.xml','robots.txt']) {
 const source=await stat(`public/${file}`),output=await stat(`out/${file}`);
 assert(source.size>0&&source.size===output.size,`Missing or truncated asset: ${file}`);
}
for(const anchor of html.matchAll(/href="#([^"]+)"/g)) assert(expected.includes(anchor[1]),`Broken anchor: ${anchor[1]}`);
for(const cv of html.matchAll(/<a[^>]+href="\/A\.Zidan\/Abdulrahman-Zidan-CV\.pdf"[^>]*>/g)) {
 assert(cv[0].includes('target="_blank"')&&cv[0].includes('rel="noreferrer"'),'CV must open in a new tab');
 assert(!cv[0].includes('download'),'CV must not force download');
}
for(const path of html.matchAll(/(?:src|href)="(\/A\.Zidan\/[^"#?]+)"/g)) {
 const local=path[1].slice('/A.Zidan/'.length);
 if(!local.endsWith('/'))assert((await stat(`out/${local}`)).size>0,`Broken export reference: ${local}`);
}
assert(html.includes('src="/A.Zidan/profile.webp"')&&html.includes('src="/A.Zidan/intro-poster.jpg"'),'Real portrait and video poster must be integrated');
assert(html.includes('Abdulrahman')&&html.includes('Zidan'),'Identity missing');
console.log('PASS: all sections, anchors, assets, local fonts, CV new-tab behavior and exported file references.');
