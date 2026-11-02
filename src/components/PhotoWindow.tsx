'use client';
import {useEffect,useRef,type ReactNode} from 'react';

/** A cover reveals the existing photograph; its original parallax stays independent. */
export default function PhotoWindow({children,className}:{children:ReactNode;className:string}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const node=ref.current;if(!node)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let observer:IntersectionObserver|undefined;
  const show=()=>{node.dataset.photoMotion='shown';observer?.disconnect();};
  if(reduced.matches||node.getBoundingClientRect().bottom<=0)show();
  else{
   node.dataset.photoMotion='pending';
   observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))show();},{threshold:.12});
   observer.observe(node);
  }
  const preference=()=>{if(reduced.matches)show();};
  reduced.addEventListener('change',preference);
  return()=>{observer?.disconnect();reduced.removeEventListener('change',preference);};
 },[]);
 return <div ref={ref} className={className}>{children}</div>;
}
