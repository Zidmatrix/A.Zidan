'use client';
import {useEffect, useRef, useState} from 'react';
import {stages} from '@/lib/content';

type Point = {x: number; y: number};
function connect(points: Point[]) {
 if (!points.length) return '';
 let path = `M${points[0].x} ${points[0].y}`;
 for (let i = 1; i < points.length; i++) {
  const previous = points[i - 1], next = points[i];
  // Wrap around the outside of each row instead of crossing its text.
  if (Math.abs(next.y - previous.y) > 2) path += ` L-8 ${previous.y} L-8 ${next.y}`;
  path += ` L${next.x} ${next.y}`;
 }
 return path;
}
export default function MethodJourney() {
 const root = useRef<HTMLDivElement>(null);
 const [stage, setStage] = useState(0);
 const [travel, setTravel] = useState({from: 0, revision: 0});
 const [geometry, setGeometry] = useState<{width: number; height: number; points: Point[]} | null>(null);
 useEffect(() => {
  if (!root.current) return;
  const element = root.current;
  const measure = () => {
   const box = element.getBoundingClientRect();
   const points = [...element.querySelectorAll('.path-node')].map(node => {
    const r = node.getBoundingClientRect();
    return {x: +(r.x - box.x + r.width / 2).toFixed(2), y: +(r.y - box.y + r.height / 2).toFixed(2)};
   });
   setGeometry({width: box.width, height: box.height, points});
  };
  measure();
  const observer = new ResizeObserver(measure);
  observer.observe(element);
  return () => observer.disconnect();
 }, []);
 const select = (index: number) => {
  if (index === stage) return;
  setTravel(value => ({from: stage, revision: value.revision + 1}));
  setStage(index);
 };
 const direction = stage >= travel.from ? 1 : -1;
 const routePoints = geometry ? Array.from({length: Math.abs(stage - travel.from) + 1}, (_, i) => geometry.points[travel.from + i * direction]) : [];
 const route = connect(routePoints);
 return <>
  <div ref={root} className="method-path" data-enhanced={!!geometry}>
   {geometry && <div className="method-signal-layer" aria-hidden="true"><svg width="100%" height="100%" viewBox={`0 0 ${geometry.width} ${geometry.height}`}><path d={connect(geometry.points)}/></svg>{travel.revision > 0 && <span key={travel.revision} className="method-traveller" style={{offsetPath: `path("${route}")`}}/>}</div>}
   {stages.map((item, i) => <button key={item.name} aria-pressed={stage === i} className={stage === i ? 'selected' : ''} onClick={() => select(i)}><span className="path-node"><span>0{i + 1}</span></span><strong>{item.name}</strong><span>{item.text}</span></button>)}
  </div>
  <div className="method-detail" aria-live="polite"><span className="tiny-label">0{stage + 1} / {stages[stage].name.toUpperCase()}</span><p key={stage} className="method-copy">{stages[stage].detail}</p><span aria-hidden="true" className="arrow">→</span></div>
 </>;
}
