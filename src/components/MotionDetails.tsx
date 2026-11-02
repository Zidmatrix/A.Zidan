'use client';
import {useEffect,useRef,type Dispatch,type RefObject,type SetStateAction} from 'react';

export default function MotionDetails({selectService,manualService}:{selectService:Dispatch<SetStateAction<number>>;manualService:RefObject<boolean>}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const rail=ref.current,main=rail?.parentElement;
  if(!rail||!main)return;
  const services=main.querySelector<HTMLElement>('#services');
  const rows=[...main.querySelectorAll<HTMLElement>('.service-list [role="tab"]')];
  const motion=matchMedia('(prefers-reduced-motion: no-preference)');
  const story=matchMedia('(min-width: 1050px) and (min-height: 700px)');
  const fine=matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)');
  let frame=0,start=0,height=1,mainTop=0,lastAuto=-1;
  let depth:HTMLElement|null=null,depthRect:DOMRect|null=null;
  const resetDepth=()=>{if(depth)delete depth.dataset.depthActive;depth=null;depthRect=null;};
  const update=()=>{
   frame=0;
   const position=Math.max(0,Math.min(height,window.scrollY+window.innerHeight*.36-mainTop-start));
   let selected=-1;
   if(motion.matches&&story.matches&&services){
    const bounds=services.getBoundingClientRect();
    if(bounds.bottom<=0||bounds.top>=window.innerHeight){manualService.current=false;lastAuto=-1;}
    else if(!manualService.current&&!services.contains(document.activeElement)){
     selected=0;
     rows.forEach((row,index)=>{if(row.getBoundingClientRect().top<=window.innerHeight*.55)selected=index;});
    }
   }
   rail.style.setProperty('--connector-progress',String(position/height));
   rail.style.setProperty('--connector-position',`${position}px`);
   if(selected>=0&&selected!==lastAuto){lastAuto=selected;selectService(selected);}
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const measure=()=>{
   const first=main.querySelector<HTMLElement>('#about .section-label');
   const last=main.querySelector<HTMLElement>('#contact .section-label');
   if(!first||!last)return;
   const mainBounds=main.getBoundingClientRect(),a=first.getBoundingClientRect(),b=last.getBoundingClientRect();
   mainTop=mainBounds.top+window.scrollY;
   start=a.top-mainBounds.top+a.height/2;
   height=Math.max(1,b.top-mainBounds.top+b.height/2-start);
   rail.style.top=`${start}px`;rail.style.height=`${height}px`;
   resetDepth();schedule();
  };
  const configure=()=>{
   rail.hidden=!motion.matches;
   if(services)services.dataset.scrollStory=String(motion.matches&&story.matches);
   if(!motion.matches||!fine.matches)resetDepth();
   manualService.current=false;lastAuto=-1;measure();
  };
  const pointer=(event:PointerEvent)=>{
   if(!motion.matches||!fine.matches||event.pointerType==='touch')return;
   const target=event.target instanceof Element?event.target.closest<HTMLElement>('.service-panel,.system-detail,.company-panel,.proof-grid>div,.section-photo,.hero-photo-detail,.portrait-wrap'):null;
   if(!target||!main.contains(target)){resetDepth();return;}
   if(target!==depth){resetDepth();depth=target;depthRect=target.getBoundingClientRect();}
   if(!depthRect)return;
   const x=Math.max(0,Math.min(1,(event.clientX-depthRect.left)/depthRect.width));
   const y=Math.max(0,Math.min(1,(event.clientY-depthRect.top)/depthRect.height));
   target.style.setProperty('--depth-x',`${x*100}%`);target.style.setProperty('--depth-y',`${y*100}%`);
   target.style.setProperty('--depth-rx',`${(.5-y)*2.4}deg`);target.style.setProperty('--depth-ry',`${(x-.5)*2.4}deg`);
   target.dataset.depthActive='true';
  };
  const out=(event:PointerEvent)=>{if(depth&&(!event.relatedTarget||!depth.contains(event.relatedTarget as Node)))resetDepth();};
  const scroll=()=>{resetDepth();schedule();};
  const resize=new ResizeObserver(measure);resize.observe(main);
  motion.addEventListener('change',configure);story.addEventListener('change',configure);fine.addEventListener('change',configure);
  window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',measure);
  main.addEventListener('pointermove',pointer,{passive:true});main.addEventListener('pointerout',out);main.addEventListener('pointerleave',resetDepth);
  configure();
  return()=>{
   cancelAnimationFrame(frame);resize.disconnect();resetDepth();
   motion.removeEventListener('change',configure);story.removeEventListener('change',configure);fine.removeEventListener('change',configure);
   window.removeEventListener('scroll',scroll);window.removeEventListener('resize',measure);
   main.removeEventListener('pointermove',pointer);main.removeEventListener('pointerout',out);main.removeEventListener('pointerleave',resetDepth);
   delete services?.dataset.scrollStory;
  };
 },[selectService,manualService]);
 return <div ref={ref} className="section-connector" aria-hidden="true" hidden><span/><i/></div>;
}
