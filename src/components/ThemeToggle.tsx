'use client';
import {useEffect, useRef, useState, type MouseEvent} from 'react';
import {flushSync} from 'react-dom';

export default function ThemeToggle() {
 const [theme, setTheme] = useState<'dark' | 'light'>('dark');
 const transitioning = useRef(false);
 useEffect(() => {
  const sync = () => setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  sync();
  const storage = (event: StorageEvent) => {
   if (event.key !== 'az-signal-theme') return;
   document.documentElement.dataset.theme = event.newValue === 'light' ? 'light' : 'dark';
   sync();
  };
  window.addEventListener('storage', storage);
  return () => window.removeEventListener('storage', storage);
 }, []);
 const toggle = async (event: MouseEvent<HTMLButtonElement>) => {
  if (transitioning.current) return;
  const next = theme === 'dark' ? 'light' : 'dark';
  const scroll = {left: window.scrollX, top: window.scrollY, behavior: 'instant' as ScrollBehavior};
  const apply = () => {
   flushSync(() => {document.documentElement.dataset.theme = next; setTheme(next);});
   try {localStorage.setItem('az-signal-theme', next);} catch {}
   window.scrollTo(scroll);
  };
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {apply(); return;}
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.detail ? event.clientX : rect.x + rect.width / 2;
  const y = event.detail ? event.clientY : rect.y + rect.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  transitioning.current = true;
  document.documentElement.dataset.themeTransition = 'circle';
  let transition: ViewTransition | undefined;
  try {
   transition = document.startViewTransition(apply);
   void transition.finished.catch(() => {});
   await transition.ready;
   const reveal = document.documentElement.animate(
    {clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]},
    {duration: matchMedia('(max-width: 600px)').matches ? 300 : 430, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)'}
   );
   await reveal.finished.catch(() => {});
   await transition.finished.catch(() => {});
  } catch {
   transition?.skipTransition();
   if (document.documentElement.dataset.theme !== next) apply();
  } finally {
   delete document.documentElement.dataset.themeTransition;
   transitioning.current = false;
  }
 };
 return <button className="theme-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={toggle}><span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span><span className="theme-word">{theme === 'dark' ? 'LIGHT' : 'DARK'}</span></button>;
}
