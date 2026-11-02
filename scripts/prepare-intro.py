"""Build reviewed captions, VTT and waveform from the unchanged owner recording.
Requires Python/numpy and ffmpeg/ffprobe. Recognition is stored with its source hash;
there is no transcription service or model in the website or CI build.
Run: python scripts/prepare-intro.py [path/to/Intro.mp3]
"""
from pathlib import Path
import hashlib, json, re, subprocess, sys
import numpy as np

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1]) if len(sys.argv) > 1 else root/'public/intro.mp3'
raw = json.loads((root/'scripts/data/intro-recognition.json').read_text())
digest = hashlib.sha256(source.read_bytes()).hexdigest()
assert digest == raw['sha256'], 'Recognition belongs to another recording'
duration = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(source)]))
words = []
for segment in raw['segments']:
 for item in segment['words']:
  w = dict(item)
  if words and not w['word'].startswith(' '):
   words[-1]['word'] += w['word']; words[-1]['end'] = w['end']
  else: words.append(w)
# Recognition wording is retained. Only spelling, punctuation and phrase grouping
# are editorial. Product names have been reviewed against the spoken recording.
fixes = {'Zidane':'Zidan','REI-Sift':'REI Sift','Go High Level':'GoHighLevel','Ready Mode':'ReadyMode','Call Tools':'CallTools','REI SIFT':'REI Sift','REI Sift':'REI Sift','Lead Management Systems':'lead management systems','hand-off':'handoff'}
def clean(text):
 for a,b in fixes.items(): text = text.replace(a,b)
 return re.sub(r'\bUS\b', 'U.S.', text.strip())
# Human-reviewed phrase boundaries preserve complete grammatical units and names.
# Boundaries index the actual recognized words; times never come from word count.
phrases = json.loads((root/'scripts/data/intro-phrases.json').read_text())
word_index = 0
cues = []
for phrase in phrases:
 target = re.sub(r'\W+', '', phrase).lower()
 group = []
 while word_index < len(words):
  group.append(words[word_index]); word_index += 1
  spoken = re.sub(r'\W+', '', clean(''.join(w['word'] for w in group))).lower()
  if spoken == target: break
  assert target.startswith(spoken), f'Phrase mismatches recognition: {spoken!r} / {target!r}'
 assert spoken == target, f'Missing phrase: {phrase}'
 cues.append({'start':round(group[0]['start'],3),'end':round(group[-1]['end'],3),'text':phrase})
assert word_index == len(words), 'Uncaptioned words'
for i,cue in enumerate(cues):
 # Hold through short pauses to avoid flashing blank frames between phrases.
 next_start = cues[i+1]['start'] if i+1 < len(cues) else duration
 cue['end'] = round(min(next_start, max(cue['end'] + .18, cue['start'] + 1.25)),3)
 assert cue['end'] > cue['start'] and len(cue['text']) <= 85
pcm = np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(source),'-ac','1','-ar','8000','-f','f32le','-']),dtype=np.float32)
peaks = np.array([np.sqrt(np.mean(x*x)) for x in np.array_split(pcm,100)])
peaks = np.maximum(.04, peaks / max(peaks))
paragraphs = []
for segment in raw['segments']:
 paragraphs.append(clean(''.join(w['word'] for w in segment['words'])))
# Use readable paragraph breaks independently of Whisper's 30-second segments.
transcript = ' '.join(c['text'] for c in cues)
starts = ['When it comes to cold calling,','In real estate,','As a lead manager,',"I'm also comfortable working with the systems",'Beyond the technical side,',"I've worked toward performance targets,",'Whether you need someone',"My goal isn't just", "If you're looking", 'Thank you for taking']
for start in starts: transcript = transcript.replace(' '+start,'\n\n'+start)
manifest = {'duration':duration,'label':f'{int(np.ceil(duration))//60}:{int(np.ceil(duration))%60:02}','sha256':digest,'bytes':source.stat().st_size,'transcript':transcript.split('\n\n'),'waveform':[round(float(p),3) for p in peaks],'captions':cues}
(root/'src/data/introduction.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
def stamp(t):
 ms = round(t*1000)
 return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02}.{ms%1000:03}'
(root/'public/intro.vtt').write_text('WEBVTT\n\n'+'\n\n'.join(f'{i+1}\n{stamp(c["start"])} --> {stamp(c["end"])}\n{c["text"]}' for i,c in enumerate(cues))+'\n')
print(f'{len(cues)} reviewed cues; {len(words)} words; {duration:.3f}s; SHA-256 {digest}')
