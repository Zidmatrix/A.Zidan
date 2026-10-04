'use client';
import {useState} from 'react';
import {markets,marketDescription} from '@/lib/markets';
import {worldPaths} from '@/lib/world-paths';
const point=(coordinates:readonly [number,number])=>[(coordinates[0]+180)*1000/360,(90-coordinates[1])*500/180];
export default function Markets({editorial=false}:{editorial?:boolean}){
 const [selected,setSelected]=useState(0),[world,setWorld]=useState(false);
 const current=markets[selected];const [x,y]=point(current.coordinates);const font=world?12:4.2;
 return <section id="markets" className={`${editorial?'chapter':'section'} markets-section`}>
  <div className="section-label"><span>05</span><span>U.S. MARKETS / EXPERIENCE ACROSS STATES</span><span className="label-rule"/></div>
  <div className="markets-heading"><h2>{editorial?<>Across eight states.<br/><i>One clear practice.</i></>:<>U.S. markets.<br/><em>Real experience.</em></>}</h2><p>Cold calling & lead management.<br/>Explore the states I’ve worked in.</p></div>
  <div className="markets-layout"><div className="market-map-panel"><div className="map-toolbar"><span>MARKET COVERAGE / UNITED STATES</span><div role="group" aria-label="Map view"><button aria-pressed={!world} onClick={()=>setWorld(false)}>U.S. VIEW</button><button aria-pressed={world} onClick={()=>setWorld(true)}>WORLD VIEW</button></div></div>
   <svg className="market-map" viewBox={world?'0 0 1000 500':'140 100 195 110'} role="group" aria-labelledby="markets-map-title"><title id="markets-map-title">World map with eight U.S. state markets. Select a marker for details.</title>
    <g className="map-grid" aria-hidden="true">{[0,100,200,300,400,500].map(v=><path key={`h${v}`} d={`M0 ${v}H1000`}/>)}{[0,100,200,300,400,500,600,700,800,900,1000].map(v=><path key={`v${v}`} d={`M${v} 0V500`}/>)}</g>
    <g aria-hidden="true">{worldPaths.map(country=><path key={country.id} d={country.d} className={country.id==='USA'?'map-country map-us':'map-country'} fillRule="evenodd" vectorEffect="non-scaling-stroke"/>)}</g>
    {markets.map((market,i)=>{const [mx,my]=point(market.coordinates);const radius=world?4.5:2.7;return <g key={market.name} role="button" tabIndex={0} aria-label={`${market.name} — ${marketDescription}`} aria-pressed={selected===i} className="map-marker" onMouseEnter={()=>setSelected(i)} onFocus={()=>setSelected(i)} onClick={()=>setSelected(i)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(i);}}}><title>{market.name}</title><circle cx={mx} cy={my} r={radius*2.2} className="map-hit"/><circle cx={mx} cy={my} r={radius*1.55} className="map-pulse" style={{animationDelay:`${i*.25}s`}}/><circle cx={mx} cy={my} r={radius} className="map-pin-core"/></g>;})}
    <g className="map-pin-label" aria-hidden="true" transform={`translate(${x},${y-(world?14:8)})`}><rect x={-(current.name.length*font*.61+font*2)/2} y={-font*1.35} width={current.name.length*font*.61+font*2} height={font*2.05} rx={font*.25}/><text textAnchor="middle" style={{fontSize:font}}>{current.name}</text></g>
   </svg><div className="map-foot"><span>08 STATES / REMOTE U.S. REAL ESTATE WORK</span><span>SELECT A PIN TO EXPLORE ↗</span></div></div>
   <div className="market-aside"><div className="market-detail" aria-live="polite"><span className="eyebrow">SELECTED MARKET / {String(selected+1).padStart(2,'0')}</span><h3>{current.name}</h3><p>{marketDescription}</p><span className="market-detail-note">U.S. real estate · Remote collaboration</span></div><div className="market-state-list" aria-label="Select a U.S. state market">{markets.map((m,i)=><button key={m.name} aria-pressed={selected===i} onClick={()=>setSelected(i)}><span aria-hidden="true">⌖</span>{m.name}</button>)}</div><p className="market-source">Representative state locations.<br/>Map geometry: Natural Earth.</p></div>
  </div>
 </section>;
}
