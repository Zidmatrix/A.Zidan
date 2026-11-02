'use client';
import {useEffect, useRef, useState} from 'react';

export default function CopyEmail({email}: {email: string}) {
 const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
 const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
 useEffect(() => () => clearTimeout(timer.current), []);
 const copy = async () => {
  clearTimeout(timer.current);
  try {
   await navigator.clipboard.writeText(email);
   setStatus('copied');
  } catch {setStatus('error');}
  timer.current = setTimeout(() => setStatus('idle'), 3000);
 };
 return <span className="email-copy">
  <button type="button" className="copy-email" aria-label="Copy email address" title="Copy email address" data-state={status} onClick={copy}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{status === 'copied' ? <path className="email-copy-check" d="m5 12 4 4L19 6"/> : <><rect x="8" y="8" width="12" height="13" rx="1"/><path d="M16 8V3H3v13h5"/></>}</svg></button>
  <span className="copy-feedback" role="status">{status === 'copied' ? 'Email copied ✓' : status === 'error' ? 'Copy unavailable' : ''}</span>
 </span>;
}
