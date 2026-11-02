// Optional browser QA: NODE_PATH=/path/to/playwright/node_modules node scripts/check-audio-browser.mjs
// PORTFOLIO_TEST_URL points to the actual Pages deployment for the same checks.
import {createRequire} from 'node:module';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
const data=JSON.parse(await readFile('src/data/introduction.json','utf8'));
const base=process.env.PORTFOLIO_TEST_URL||'http://127.0.0.1:4173/A.Zidan/';
const live=base.startsWith('https:');
const output=process.env.PORTFOLIO_QA_DIR||join(tmpdir(),'a-zidan-audio-qa');
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],...(live&&process.env.HTTPS_PROXY?{proxy:{server:new URL(process.env.HTTPS_PROXY).origin}}:{})});
const results=[];
const passed=(name,details={})=>{results.push({name,...details});console.log('PASS',name,JSON.stringify(details));};
const errors=[];
async function cueMatches(page){
 const t=await page.locator('audio').evaluate(a=>a.currentTime);
 const cue=data.captions.find(c=>t>=c.start&&t<c.end);
 const actual=await page.locator('.audio-caption p').innerText();
 if(cue)assert.equal(actual,cue.text,`Caption at ${t}`);
}
try {
 const page=await browser.newPage({viewport:{width:1440,height:1280}});
 const requests=[];
 page.on('request',r=>requests.push(r.url()));
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base,{waitUntil:'networkidle'});
 await page.waitForTimeout(600);
 assert.equal(await page.locator('audio').count(),1);assert.equal(await page.locator('video').count(),0);
 assert(!requests.some(u=>/\.mp3|\.mp4|intro-poster/.test(u)));
 assert(await page.locator('audio').evaluate(a=>a.paused&&a.currentTime===0&&a.preload==='none'));
 passed('one native player; no autoplay or media download on page load');
 await page.getByRole('button',{name:/HEAR MY INTRO/}).click();
 await page.waitForFunction(()=>document.querySelector('audio').currentTime>.3);
 assert(page.url().endsWith('#introduction'));await cueMatches(page);
 assert(await page.locator('audio').evaluate(a=>!a.paused&&a.readyState>=3));
 passed('Hero CTA starts actual decoded audio and synchronized opening caption');
 await page.locator('.audio-play').click();
 const paused=await page.locator('audio').evaluate(a=>a.currentTime);
 await page.waitForTimeout(450);
 assert(Math.abs(await page.locator('audio').evaluate(a=>a.currentTime)-paused)<.01);
 for(const selector of ['#about','#contact']){
  await page.locator(selector).getByRole('button',{name:/INTRODUCTION/}).click();
  assert(page.url().endsWith('#introduction'));
  await page.waitForFunction(()=>!document.querySelector('audio').paused);
  assert.equal(await page.locator('audio').count(),1);
  await page.locator('.audio-play').click();
 }
 passed('Hero, About and Contact share playback; pause/resume keeps position');
 const slider=page.getByRole('slider',{name:'Seek audio introduction'});
 await slider.press('Home');for(let i=0;i<24;i++)await slider.press('ArrowRight');
 await page.waitForTimeout(150);
 assert(Math.abs(await page.locator('audio').evaluate(a=>a.currentTime)-120)<.3);await cueMatches(page);
 await page.getByRole('button',{name:'Rewind 10 seconds'}).click();
 assert(Math.abs(await page.locator('audio').evaluate(a=>a.currentTime)-110)<.3);
 await page.getByRole('button',{name:'Forward 10 seconds'}).click();
 assert(Math.abs(await page.locator('audio').evaluate(a=>a.currentTime)-120)<.3);
 await page.getByLabel('Playback speed').selectOption('1.5');
 await page.locator('.audio-play').click();
 const start=await page.locator('audio').evaluate(a=>a.currentTime);
 await page.waitForTimeout(1000);
 const delta=await page.locator('audio').evaluate(a=>a.currentTime)-start;
 assert(delta>1.1&&delta<2.1);await cueMatches(page);
 await page.locator('.audio-play').click();
 passed('keyboard seeking, ±10 seconds, and real 1.5× playback with synchronized middle captions',{delta});
 await page.getByRole('button',{name:'Mute audio',exact:true}).click();assert(await page.locator('audio').evaluate(a=>a.muted));
 await page.getByRole('button',{name:'Unmute audio',exact:true}).click();
 await page.getByRole('button',{name:'English subtitles',exact:true}).click();assert.equal(await page.locator('.audio-caption').getAttribute('data-enabled'),'false');
 await page.getByRole('button',{name:'English subtitles',exact:true}).click();await cueMatches(page);
 await page.locator('.audio-transcript summary').click();assert((await page.locator('.audio-transcript').innerText()).includes('quality of my work over time'));
 await page.locator('.audio-transcript summary').click();
 passed('mute, CC default/toggle and complete expandable transcript');
 // Seek via native media API for exact boundary and end-of-file regression checks.
 await page.locator('audio').evaluate(a=>{a.currentTime=a.duration-1.2});
 await page.waitForTimeout(150);await cueMatches(page);
 await page.locator('.audio-play').click();await page.waitForFunction(()=>document.querySelector('audio').ended);
 assert.equal(await page.locator('.audio-play').getAttribute('aria-label'),'Replay audio introduction');
 await page.locator('.audio-play').click();await page.waitForFunction(()=>document.querySelector('audio').currentTime>.1&&!document.querySelector('audio').ended);
 assert((await page.locator('audio').evaluate(a=>a.currentTime))<2);await cueMatches(page);
 await page.locator('.audio-play').click();
 passed('closing caption, completion status and replay');
 const response=await page.request.get(new URL('intro.mp3',base).href);
 assert(response.ok());const hash=createHash('sha256').update(await response.body()).digest('hex');assert.equal(hash,data.sha256);
 assert.equal((await page.request.get(new URL('intro.vtt',base).href)).status(),200);
 if(live){assert.equal((await page.request.get(new URL('intro.mp4',base).href)).status(),404);assert.equal((await page.request.get(new URL('intro-poster.jpg',base).href)).status(),404);}
 passed('served audio matches uploaded recording SHA-256; captions resolve',{sha256:hash});
 // Exercise existing features without modifying their implementation.
 await page.getByRole('button',{name:'Open command menu'}).click();
 const dialog=page.locator('dialog[open]');assert(await dialog.isVisible());
 assert.notEqual(await dialog.evaluate(d=>getComputedStyle(d).cursor),'none');
 await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);
 await page.getByRole('button',{name:'Texas',exact:true}).click();assert.equal(await page.locator('.market-detail h3').innerText(),'Texas');
 await page.getByRole('button',{name:'Next CV page'}).click();assert(await page.getByAltText('Original CV, page 2 of 2').isVisible());
 await page.getByRole('button',{name:'Previous CV page'}).click();
 await page.locator('#top').scrollIntoViewIfNeeded();
 await page.waitForTimeout(500);
 const signal=await page.locator('.signal').getAttribute('data-renderer');
 assert.equal(await page.locator('.signal canvas,.signal-fallback').count(),1);
 assert.equal(signal,'webgl');
 passed('command menu / cursor, interactive map and two-page CV remain functional',{signal});
 for(const theme of ['dark','light']){
  if(theme==='light')await page.getByRole('button',{name:'Switch to light theme'}).click();
  await page.locator('audio').evaluate(a=>{a.currentTime=13});await page.waitForTimeout(100);await cueMatches(page);
  await page.evaluate(()=>window.scrollTo(0,document.querySelector('#introduction').offsetTop-100));
  await page.mouse.move(1430,1270);await page.waitForTimeout(400);
  await page.screenshot({path:`${output}/introduction-desktop-${theme}.png`});
 }
 const mobile=await browser.newPage({viewport:{width:390,height:1000},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 mobile.on('pageerror',e=>errors.push(e.message));
 await mobile.goto(base,{waitUntil:'networkidle'});
 await mobile.getByRole('button',{name:'Open navigation'}).click();assert(await mobile.locator('dialog[open]').isVisible());
 await mobile.locator('dialog[open]').getByRole('link',{name:/Introduction/}).click();assert.equal(await mobile.locator('dialog[open]').count(),0);
 await mobile.locator('.audio-play').tap();await mobile.waitForFunction(()=>document.querySelector('audio').currentTime>.2);await mobile.locator('.audio-play').tap();
 for(const width of [320,390,768,1024]){
  await mobile.setViewportSize({width,height:1100});
  assert(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`horizontal overflow at ${width}`);
  const heights=[];
  for(const cue of data.captions){
   await mobile.locator('audio').evaluate((a,t)=>{a.currentTime=t},(cue.start+cue.end)/2);
   await mobile.waitForTimeout(20);
   heights.push(await mobile.locator('.audio-caption').evaluate(e=>({height:e.getBoundingClientRect().height,overflow:e.scrollHeight>e.clientHeight+1})));
  }
  assert(heights.every(h=>!h.overflow),`caption clipped at ${width}`);
  assert(Math.max(...heights.map(h=>h.height))-Math.min(...heights.map(h=>h.height))<1,`caption layout shift at ${width}`);
 }
 await mobile.setViewportSize({width:390,height:1280});
 for(const theme of ['dark','light']){
  if(theme==='light')await mobile.getByRole('button',{name:'Switch to light theme'}).tap();
  await mobile.locator('audio').evaluate(a=>{a.currentTime=13});await mobile.waitForTimeout(100);
  await mobile.evaluate(()=>window.scrollTo(0,document.querySelector('#introduction').offsetTop-85));await mobile.waitForTimeout(400);
  await mobile.screenshot({path:`${output}/introduction-mobile-${theme}.png`});
 }
 passed('mobile touch playback/navigation; both themes; all captions stable at 320, 390, 768, 1024px');
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto(base);await reduced.locator('.audio-play').click();
 assert.equal(await reduced.locator('.audio-emblem circle').first().evaluate(e=>getComputedStyle(e).animationName),'none');await reduced.close();
 // A genuine failed request, followed by successful retry using the player control.
 const recovery=await browser.newPage();await recovery.route('**/intro.mp3',route=>route.abort('failed'));await recovery.goto(base);
 await recovery.locator('.audio-play').click();await recovery.getByRole('alert').waitFor();
 await recovery.unroute('**/intro.mp3');await recovery.getByRole('button',{name:/try again/i}).click();await recovery.waitForFunction(()=>document.querySelector('audio').currentTime>.2);
 await recovery.close();passed('reduced motion and recoverable network-error playback');
 assert.deepEqual(errors,[]);passed('no uncaught browser errors');
 await writeFile(`${output}/verification.json`,JSON.stringify({base,checkedAt:new Date().toISOString(),results,errors},null,2));
} finally {await browser.close();}
