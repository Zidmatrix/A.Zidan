'use client';
import {useState} from 'react';
import {asset} from '@/lib/content';
import {cvPages} from '@/lib/cv-pages';
export default function CvViewer({editorial=false}:{editorial?:boolean}){
 const [page,setPage]=useState(0),[zoom,setZoom]=useState(100),[loadedPage,setLoadedPage]=useState(-1),[failedPage,setFailedPage]=useState(-1);
 const current=cvPages[page];
 const turn=(next:number)=>{setPage(Math.max(0,Math.min(cvPages.length-1,next)));setZoom(100);};
 return <section id="cv" className={`${editorial?'chapter':'section'} cv-section`}><div className="section-label"><span>09</span><span>THE FULL BACKGROUND / CV</span><span className="label-rule"/></div><div className="cv-section-heading"><h2>{editorial?<>The full picture.<br/><i>Right here.</i></>:<>The full background.<br/><em>Stay in the conversation.</em></>}</h2><p>Read my original CV inside the page.<br/>Keep a copy whenever you need it.</p></div>
  <div className="cv-viewer" role="region" aria-label="CV reader" tabIndex={0} onKeyDown={e=>{if(e.target===e.currentTarget&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();turn(page+(e.key==='ArrowRight'?1:-1));}}}>
   <div className="cv-frame-heading"><div><span className="cv-document-mark" aria-hidden="true">A.Z</span><span>ABDULRAHMAN ZIDAN<small>ORIGINAL CV / PDF / 02 PAGES</small></span></div><a className="cv-download" href={asset('Abdulrahman-Zidan-CV.pdf')} download="Abdulrahman-Zidan-CV.pdf">DOWNLOAD CV <span aria-hidden="true">↓</span></a></div>
   <div className="cv-reader-tools"><div className="cv-page-controls"><button aria-label="Previous CV page" disabled={page===0} onClick={()=>turn(page-1)}>←</button><span role="status">PAGE {page+1} / {cvPages.length}</span><button aria-label="Next CV page" disabled={page===cvPages.length-1} onClick={()=>turn(page+1)}>→</button></div><div className="cv-zoom-controls"><button aria-label="Zoom CV out" disabled={zoom<=100} onClick={()=>setZoom(v=>Math.max(100,v-25))}>−</button><span>{zoom}%</span><button aria-label="Zoom CV in" disabled={zoom>=200} onClick={()=>setZoom(v=>Math.min(200,v+25))}>+</button><button className="cv-fit" onClick={()=>setZoom(100)}>FIT PAGE</button></div></div>
   <div className="cv-stage" key={`${page}-${zoom}`}><div className="cv-sheet" style={{width:`${zoom}%`}}>{failedPage===page?<p className="cv-page-error">This page could not load. Use DOWNLOAD CV to read the original PDF.</p>:<><img key={page} src={asset(current.file)} width={current.width} height={current.height} loading="lazy" alt={`Original CV, page ${page+1} of ${cvPages.length}`} onLoad={()=>setLoadedPage(page)} onError={()=>setFailedPage(page)}/>{loadedPage!==page&&<span className="cv-loading" role="status">Loading CV page…</span>}</>}</div></div>
   <div className="cv-frame-foot"><span>ORIGINAL DOCUMENT / READ IN PLACE</span><span>Use + to enlarge. Scroll inside the frame.</span></div>
  </div><details className="cv-transcript"><summary>READ PAGE {page+1} AS TEXT</summary><pre>{current.text}</pre></details>
 </section>;
}
