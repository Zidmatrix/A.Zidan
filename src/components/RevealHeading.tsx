'use client';
import {Children,cloneElement,isValidElement,useEffect,useRef,useState,type ReactNode} from 'react';
function words(node:ReactNode,state:{index:number}):ReactNode{
 if(typeof node==='string')return node.split(/(\s+)/).map((part,i)=>part.trim()?<span className="reveal-word" key={i} style={{'--word-delay':`${Math.min(state.index++,16)*.035}s`} as React.CSSProperties}>{part}</span>:part);
 if(isValidElement<{children?:ReactNode}>(node)){if(node.type==='br')return node;return cloneElement(node,{},words(node.props.children,state));}
 return Children.map(node,child=>typeof child==='number'?child:words(child,state));
}
export default function RevealHeading({children}:{children:ReactNode}){
 const ref=useRef<HTMLHeadingElement>(null),[active,setActive]=useState(false);
 useEffect(()=>{const node=ref.current;if(!node||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setActive(true);observer.disconnect();}},{threshold:.25});observer.observe(node);return ()=>observer.disconnect();},[]);
 return <h2 ref={ref} className="reveal-heading" data-revealed={active}>{words(children,{index:0})}</h2>;
}
