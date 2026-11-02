'use client';
import {useEffect, useImperativeHandle, useRef, useState, type Ref} from 'react';
import {asset} from '@/lib/content';
import {introduction, captions, waveform} from '@/lib/introduction';

export type AudioIntroductionHandle = {play: () => void};
const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
function Microphone() {
 return <svg viewBox="0 0 160 160" fill="none" aria-hidden="true"><circle cx="80" cy="80" r="72"/><circle cx="80" cy="80" r="57"/><rect x="65" y="38" width="30" height="60" rx="15"/><path d="M53 77v9a27 27 0 0 0 54 0v-9M80 113v18m-17 0h34M73 51h14m-14 9h14m-14 9h14"/><path className="mic-signal" d="M39 66v28m-8-21v14m90-21v28m8-21v14"/></svg>;
}
function PlayIcon({playing, ended}: {playing: boolean; ended: boolean}) {
 if (ended) return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 8a8 8 0 1 1-1 7M5 3v5h5" fill="none" stroke="currentColor" strokeWidth="2"/></svg>;
 return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={playing ? 'M7 5h4v14H7zm7 0h4v14h-4z' : 'm9 5 11 7-11 7Z'}/></svg>;
}

export default function AudioIntroduction({ref}: {ref?: Ref<AudioIntroductionHandle>}) {
 const audio = useRef<HTMLAudioElement>(null);
 const playButton = useRef<HTMLButtonElement>(null);
 const pendingSeek = useRef<number | null>(null);
 const [playing, setPlaying] = useState(false);
 const [waiting, setWaiting] = useState(false);
 const [time, setTime] = useState(0);
 const [duration, setDuration] = useState(introduction.duration);
 const [error, setError] = useState(false);
 const [started, setStarted] = useState(false);
 const [ended, setEnded] = useState(false);
 const [cc, setCc] = useState(true);
 const [muted, setMuted] = useState(false);
 const [speed, setSpeed] = useState(1);
 const cue = (started || time > 0) ? captions.find(c => time >= c.start && time < c.end) : undefined;

 // Sample the media clock; no independent elapsed-time counter can drift at a new rate.
 useEffect(() => {
  if (!playing) return;
  let frame = 0;
  const sample = () => {if (audio.current) setTime(audio.current.currentTime); frame = requestAnimationFrame(sample);};
  frame = requestAnimationFrame(sample);
  return () => cancelAnimationFrame(frame);
 }, [playing]);
 const syncTime = () => {if (audio.current) setTime(audio.current.currentTime);};
 const play = () => {
  const media = audio.current;
  if (!media) return;
  if (media.error) media.load();
  if (media.ended) {media.currentTime = 0; setTime(0);}
  setError(false); setEnded(false); setWaiting(media.readyState < 3);
  // Call within the click handler so iOS retains the user's playback gesture.
  void media.play().catch((reason: DOMException) => {
   if (reason.name !== 'AbortError') {setWaiting(false); setError(true);}
  });
 };
 useImperativeHandle(ref, () => ({play: () => {play(); playButton.current?.focus({preventScroll: true});}}));
 const seek = (value: number) => {
  const media = audio.current;
  if (!media) return;
  const next = Math.min(duration, Math.max(0, value));
  setEnded(false);
  if (media.readyState === 0) {pendingSeek.current = next; setWaiting(true); media.load();}
  else {media.currentTime = next; syncTime();}
 };
 const status = error ? 'AUDIO UNAVAILABLE' : waiting ? 'LOADING AUDIO…' : ended ? 'PLAY AGAIN' : playing ? 'LISTENING' : started ? 'PAUSED' : 'READY WHEN YOU ARE';
 const caption = !cc ? 'Switch CC on to follow along.' : cue?.text || (ended ? captions[captions.length - 1].text : started || time > 0 ? '…' : 'Press play. Hear my introduction.');

 return <div className="audio-frame" data-playing={playing} role="region" aria-label="Abdulrahman’s audio introduction">
  <div className="audio-editorial"><span className="tiny-label">THE VOICE BEHIND THE WORK</span><div className="audio-emblem"><Microphone/></div><p className="audio-editorial-title">A voice.<br/><em>A point of view.</em></p><div className="audio-signature"><span>ABDULRAHMAN ZIDAN</span><span>CAIRO ↗ U.S. TEAMS</span></div></div>
  <div className="audio-deck">
   <div className="audio-topline"><span><i className="live-dot"/> PERSONAL INTRODUCTION</span><span>EN / {introduction.label}</span></div>
   <div className="audio-title-row"><button ref={playButton} type="button" className="audio-play" onClick={() => playing ? audio.current?.pause() : play()} aria-label={playing ? 'Pause audio introduction' : ended ? 'Replay audio introduction' : 'Play audio introduction'}><PlayIcon playing={playing} ended={ended}/></button><div><h3>Meet Abdulrahman<span className="accent">.</span></h3><p>Real estate sales & lead management</p></div></div>
   <div className="audio-wave-seek"><svg viewBox="0 0 600 84" preserveAspectRatio="none" aria-hidden="true">{waveform.map((peak, i) => <rect key={i} x={i * 600 / waveform.length} y={42 - peak * 38} width="2.5" height={Math.max(3, peak * 76)} rx="1.25" className={time > 0 && i / waveform.length <= time / duration ? 'heard' : ''}/>)}</svg><input className="audio-seek" type="range" min="0" max={duration} step="0.1" value={time} aria-label="Seek audio introduction" aria-valuetext={`${clock(time)} of ${clock(Math.ceil(duration))}`} onChange={e => seek(Number(e.target.value))} onKeyDown={e => {if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {e.preventDefault(); seek(time + (e.key === 'ArrowRight' ? 5 : -5));}}}/></div>
   <div className="audio-timeline"><span>{clock(ended ? Math.ceil(duration) : time)}</span><span>{clock(Math.ceil(duration))}</span></div>
   <div className="audio-controls"><div><button type="button" onClick={() => seek((audio.current?.currentTime || 0) - 10)} aria-label="Rewind 10 seconds">↶ <span>10s</span></button><button type="button" onClick={() => seek((audio.current?.currentTime || 0) + 10)} aria-label="Forward 10 seconds"><span>10s</span> ↷</button></div><div><select aria-label="Playback speed" value={speed} onChange={e => {const value = Number(e.target.value); setSpeed(value); if (audio.current) audio.current.playbackRate = value;}}>{[0.75, 1, 1.25, 1.5].map(value => <option key={value} value={value}>{value}×</option>)}</select><button type="button" className="audio-cc" aria-label="English subtitles" aria-pressed={cc} onClick={() => setCc(v => !v)}>CC</button><button type="button" aria-label={muted ? 'Unmute audio' : 'Mute audio'} aria-pressed={muted} onClick={() => {if (audio.current) audio.current.muted = !muted; setMuted(v => !v);}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m11 5-6 4H2v6h3l6 4Z"/>{muted ? <path d="m16 9 6 6m0-6-6 6"/> : <path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/>}</svg></button></div></div>
   <div className="audio-caption" aria-label="Synchronized English subtitles" aria-live="off" data-enabled={cc}><span className="tiny-label"><span className="caption-indicator"/>{!cc ? 'SUBTITLES OFF' : waiting ? 'BUFFERING' : ended ? 'END OF INTRODUCTION' : playing ? 'NOW SPEAKING / ENGLISH' : 'ENGLISH SUBTITLES'}</span><p>{caption}</p></div>
   {error && <p className="audio-error" role="alert">The audio could not load or start. Check your connection and <button type="button" onClick={() => {audio.current?.load(); play();}}>try again →</button></p>}
   <div className="audio-bottomline"><span>REAL VOICE. REAL CONTEXT.</span><span role="status">{status} <span aria-hidden="true">↗</span></span></div>
  </div>
  <audio ref={audio} src={asset('intro.mp3')} preload="none" onLoadedMetadata={() => {
   const media = audio.current;
   if (!media) return;
   if (Number.isFinite(media.duration)) setDuration(media.duration);
   media.playbackRate = speed;
   if (pendingSeek.current !== null) {media.currentTime = pendingSeek.current; pendingSeek.current = null;}
   syncTime(); setWaiting(false);
  }} onTimeUpdate={syncTime} onSeeking={syncTime} onSeeked={syncTime} onPlay={() => {setPlaying(true); setStarted(true); setEnded(false); setError(false);}} onPlaying={() => setWaiting(false)} onCanPlay={() => setWaiting(false)} onPause={() => {setPlaying(false); setWaiting(false); syncTime();}} onWaiting={() => setWaiting(true)} onEnded={() => {setPlaying(false); setWaiting(false); setEnded(true); syncTime();}} onError={() => {setError(true); setPlaying(false); setWaiting(false);}}><track kind="captions" src={asset('intro.vtt')} srcLang="en" label="English"/></audio>
  <details className="audio-transcript"><summary>READ THE FULL TRANSCRIPT <span aria-hidden="true">↗</span></summary><div>{introduction.transcript.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div></details>
 </div>;
}
