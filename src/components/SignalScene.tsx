'use client';
import {useEffect,useRef} from 'react';
import * as THREE from 'three';

// Four branches converge into one qualified path. No decorative particle field.
export default function SignalScene({onFailure}:{onFailure:()=>void}) {
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const host=root.current;
  if(!host)return;
  let renderer:THREE.WebGLRenderer;
  try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});} catch {onFailure();return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
  renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,1,0.1,100);camera.position.set(0,0,13);
  const group=new THREE.Group();scene.add(group);
  scene.add(new THREE.AmbientLight(0xbce7e0,1.5));
  const light=new THREE.DirectionalLight(0xecfff9,4);light.position.set(2,5,6);scene.add(light);
  const rim=new THREE.PointLight(0x75dec7,40);rim.position.set(-3,-1,3);scene.add(rim);
  const curves:THREE.CatmullRomCurve3[]=[];
  const materials:THREE.Material[]=[];
  const geometries:THREE.BufferGeometry[]=[];
  const probes:THREE.Mesh[]=[];
  for(let n=0;n<4;n++) {
   const offset=(n-1.5)*.58;
   const points=[new THREE.Vector3(-3.8,offset*1.7,-.8),new THREE.Vector3(-2.7,offset*1.5,.4),new THREE.Vector3(-1.7,2.1+offset,.3),new THREE.Vector3(.5,2.15+offset,-.6),new THREE.Vector3(2.25,.8+offset,-.4),new THREE.Vector3(1.45,-1.65+offset,.9),new THREE.Vector3(-.75,-1.55+offset,1.1),new THREE.Vector3(-1.2,-.2+offset*.6,.6),new THREE.Vector3(.2,.1,0),new THREE.Vector3(3.6,-.3,0)];
   const curve=new THREE.CatmullRomCurve3(points);curves.push(curve);
   const geometry=new THREE.TubeGeometry(curve,200,.075,8,false);geometries.push(geometry);
   const material=new THREE.MeshStandardMaterial({color:n===1?0xa3f6df:0x3b9b86,metalness:.58,roughness:.26});materials.push(material);
   group.add(new THREE.Mesh(geometry,material));
   const probeGeometry=new THREE.SphereGeometry(.105,12,12);geometries.push(probeGeometry);
   const probeMaterial=new THREE.MeshBasicMaterial({color:0xf0fff8});materials.push(probeMaterial);
   const probe=new THREE.Mesh(probeGeometry,probeMaterial);group.add(probe);probes.push(probe);
  }
  group.rotation.z=-.18;
  let targetX=0,targetY=0,frame=0,visible=true,disposed=false;
  const resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(w&&h){renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}};
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});intersection.observe(host);
  const pointer=(event:PointerEvent)=>{targetY=(event.clientX/window.innerWidth-.5)*.35;targetX=(event.clientY/window.innerHeight-.5)*.18;};
  window.addEventListener('pointermove',pointer,{passive:true});
  const lost=(event:Event)=>{event.preventDefault();onFailure();};renderer.domElement.addEventListener('webglcontextlost',lost);
  const start=performance.now();
  const render=()=>{
   if(disposed)return;
   frame=requestAnimationFrame(render);
   if(!visible||document.hidden)return;
   const t=(performance.now()-start)/1000;
   group.rotation.y+=(targetY-group.rotation.y)*.035;
   group.rotation.x+=(targetX-group.rotation.x)*.035;
   group.position.y=Math.sin(t*.32)*.07;
   group.rotation.z=-.18+Math.min(window.scrollY/window.innerHeight,1)*.2;
   probes.forEach((probe,i)=>probe.position.copy(curves[i].getPointAt((t*.06+i*.24)%1)));
   try {renderer.render(scene,camera);} catch {disposed=true;cancelAnimationFrame(frame);onFailure();}
  };render();
  return ()=>{disposed=true;cancelAnimationFrame(frame);window.removeEventListener('pointermove',pointer);observer.disconnect();intersection.disconnect();renderer.domElement.removeEventListener('webglcontextlost',lost);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
 },[onFailure]);
 return <div ref={root} className="webgl-host" aria-hidden="true"/>;
}
