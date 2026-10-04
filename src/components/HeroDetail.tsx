'use client';
import {useEffect,useRef,useState} from 'react';
import {asset} from '@/lib/content';

export function HeroCount({value,suffix='',label}:{value:number;suffix?:string;label:string}){
 const ref=useRef<HTMLSpanElement>(null);
 const [count,setCount]=useState(value);
 useEffect(()=>{
  const node=ref.current;if(!node||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let frame=0;
  const observer=new IntersectionObserver(entries=>{
   if(!entries.some(e=>e.isIntersecting))return;
   observer.disconnect();const start=performance.now();setCount(0);
   const tick=(now:number)=>{const p=Math.min((now-start)/850,1);setCount(Math.round(value*(1-Math.pow(1-p,3))));if(p<1)frame=requestAnimationFrame(tick);};
   frame=requestAnimationFrame(tick);
  },{threshold:.6});observer.observe(node);
  return ()=>{observer.disconnect();cancelAnimationFrame(frame);};
 },[value]);
 return <span ref={ref} aria-label={`${value}${suffix} ${label}`}><span aria-hidden="true"><span className="hero-count-value">{count}{suffix}</span> {label}</span></span>;
}

export default function HeroDetail(){
 return <figure className="hero-photo-detail">
  <div className="hero-photo-window"><img src={asset('photography/hero-remote-640.webp')} srcSet={[320,640,960,1280].map(w=>`${asset(`photography/hero-remote-${w}.webp`)} ${w}w`).join(', ')} sizes="(max-width:600px) 88vw, 380px" width="640" height="427" loading="lazy" decoding="async" fetchPriority="low" alt="Hands moving between a laptop and phone during focused remote work"/></div>
  <figcaption>PHOTOGRAPHY / RDNE STOCK PROJECT · PEXELS</figcaption>
 </figure>;
}
