import type { Metadata } from 'next';
import './globals.css';
import './additions.css';
import './premium.css';
export const metadata: Metadata = {
 metadataBase: new URL('https://zidmatrix.github.io'),
 title:'Abdulrahman Zidan — Real Estate Sales & Lead Management',
 description:'3+ years in U.S. real estate. Cold calling, lead management, appointment setting and sales-focused remote support. Cairo, Egypt. Working with U.S. teams.',
 alternates:{canonical:'/A.Zidan/'},
 openGraph:{title:'Abdulrahman Zidan — Conversations into opportunities',description:'Real Estate Sales & Lead Management',url:'/A.Zidan/',type:'website',images:[{url:'/A.Zidan/profile.jpg',width:640,height:640}]},
 twitter:{card:'summary_large_image',title:'Abdulrahman Zidan',description:'Real Estate Sales & Lead Management',images:['/A.Zidan/profile.jpg']},
 icons:{icon:'/A.Zidan/icon.svg'},
};
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`try{document.documentElement.dataset.theme=localStorage.getItem('az-signal-theme')==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}`}}/></head><body>{children}</body></html>;
}
