import {asset} from '@/lib/content';
export const sectionPhotos={
 about:{alt:'A green journal and coffee on a quiet work desk',caption:'FOCUS / PERSONAL WORK RHYTHM',credit:'HAN'},
 services:{alt:'Hands holding a professional headset before a conversation',caption:'COMMUNICATION / THE FIRST CONVERSATION',credit:'YAN KRUKAU'},
 experience:{alt:'Two men reviewing project plans together in an office',caption:'COLLABORATION / PROFESSIONAL CONTEXT',credit:'ANTONI SHKRABA PRODUCTION'},
 markets:{alt:'Aerial view of residential streets in Costa Mesa, California',caption:'RESIDENTIAL CONTEXT / COSTA MESA, CA',credit:'8 K'},
 proof:{alt:'A professional handshake over working documents',caption:'TRUST / PROFESSIONAL PARTNERSHIP',credit:'YAN KRUKAU'},
 systems:{alt:'An analyst reviewing a dashboard on a laptop',caption:'DATA / WORKFLOW CONTEXT',credit:'TIGER LILY'},
 introduction:{alt:'A studio microphone ready for a human voice',caption:'VOICE / A HUMAN INTRODUCTION',credit:'JOHN TARAN'},
 cv:{alt:'A hand writing thoughtfully on a document',caption:'DETAIL / THE PROFESSIONAL BACKGROUND',credit:'RYUTARO TSUKATA'},
 contact:{alt:'A telephone beside neatly organized office documents',caption:'CONTACT / THE NEXT CONVERSATION',credit:'RON LACH'},
} as const;
export type PhotoSection=keyof typeof sectionPhotos;
export default function SectionPhoto({section}:{section:PhotoSection}){
 const photo=sectionPhotos[section];
 const photoName=section==='experience'?'experience-men':section;
 const width={about:280,services:260,experience:350,markets:280,proof:260,systems:320,introduction:280,cv:240,contact:340}[section];
 return <figure className={`section-photo photo-${section}`} data-photo-section={section}>
  <div className="section-photo-window"><img src={asset(`photography/${photoName}-640.webp`)} srcSet={[320,640,960].map(w=>`${asset(`photography/${photoName}-${w}.webp`)} ${w}w`).join(', ')} sizes={`(max-width:600px) min(88vw, 320px), ${width}px`} width="640" height="320" loading="lazy" decoding="async" fetchPriority="low" alt={photo.alt}/></div>
  <figcaption><span>{photo.caption}</span><small>{photo.credit} / PEXELS</small></figcaption>
 </figure>;
}
