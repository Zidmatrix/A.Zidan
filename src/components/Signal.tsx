'use client';
import {Component,useCallback,useEffect,useState,type ReactNode} from 'react';
import dynamic from 'next/dynamic';
const Scene=dynamic(()=>import('./SignalScene'),{ssr:false});
class SceneBoundary extends Component<{children:ReactNode;onFailure:()=>void},{failed:boolean}> {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 componentDidCatch(){this.props.onFailure();}
 render(){return this.state.failed?null:this.props.children;}
}
export default function Signal(){
 const [enabled,setEnabled]=useState(false);
 const [failed,setFailed]=useState(false);
 const fail=useCallback(()=>setFailed(true),[]);
 useEffect(()=>{
  const media=matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)');
  const update=()=>setEnabled(media.matches);
  update();media.addEventListener('change',update);return ()=>media.removeEventListener('change',update);
 },[]);
 return <div className="signal" data-renderer={enabled&&!failed?'webgl':'svg'}>
  {(!enabled||failed)&&<svg className="signal-fallback" viewBox="0 0 700 550" fill="none" aria-hidden="true"><defs><linearGradient id="signalColor"><stop stopColor="#28594e"/><stop offset=".5" stopColor="#a3f6df"/><stop offset="1" stopColor="#438f7c"/></linearGradient></defs>{[0,1,2,3].map(i=><path key={i} d={`M 20 ${190+i*25} C 150 ${190+i*25},110 ${70+i*25},280 ${70+i*25} S 630 ${210+i*25},470 ${340+i*25} S 150 ${430+i*15},230 ${280+i*12} S 500 285, 680 285`} stroke="url(#signalColor)" strokeWidth="6"/>)}<circle cx="595" cy="285" r="9" fill="#f3fff9"/></svg>}
  {enabled&&!failed&&<SceneBoundary onFailure={fail}><Scene onFailure={fail}/></SceneBoundary>}
  <div className="signal-note note-a"><i/>FIRST CONTACT<span>01 / CONNECT</span></div>
  <div className="signal-note note-b"><i/>NEXT OPPORTUNITY<span>02 / QUALIFY</span></div>
  <div className="signal-caption"><span className="live-dot"/> A CLEAR PATH FORWARD <span>↗</span></div>
 </div>;
}
