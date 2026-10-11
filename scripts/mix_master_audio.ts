import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve(process.cwd(), 'public', 'audio');

async function createMasterMix() {
  console.log('--- Step 1: Adjusting scene timings to match 60s video cuts ---');
  
  // Scene 1: 0:00 - 0:09 (Target: ~8.8s)
  execSync(`ffmpeg -y -i ${path.join(outDir, 'scene1.wav')} -filter:a "atempo=1.28" ${path.join(outDir, 'scene1_timed.wav')}`);
  
  // Scene 2: 0:10 - 0:19 (Target: ~9.2s)
  execSync(`ffmpeg -y -i ${path.join(outDir, 'scene2.wav')} -filter:a "atempo=1.6" ${path.join(outDir, 'scene2_timed.wav')}`);
  
  // Scene 3: 0:20 - 0:34 (Target: ~13.5s)
  execSync(`ffmpeg -y -i ${path.join(outDir, 'scene3.wav')} -filter:a "atempo=1.12" ${path.join(outDir, 'scene3_timed.wav')}`);
  
  // Scene 4: 0:35 - 0:47 (Target: ~10.2s - already perfect!)
  execSync(`ffmpeg -y -i ${path.join(outDir, 'scene4.wav')} -filter:a "atempo=1.0" ${path.join(outDir, 'scene4_timed.wav')}`);
  
  // Scene 5: 0:48 - 1:00 (Target: ~10.5s)
  execSync(`ffmpeg -y -i ${path.join(outDir, 'scene5.wav')} -filter:a "atempo=1.2" ${path.join(outDir, 'scene5_timed.wav')}`);

  console.log('--- Step 2: Synthesizing 60s Dark Cyber Ambient BGM Track ---');
  // Generate a rich, deep cinematic tech drone with subtle sub-bass pulses and high-tech texture
  const bgmPath = path.join(outDir, 'cyber_bgm_track.wav');
  const bgmCommand = `ffmpeg -y -f lavfi -i "
    anoisesrc=d=60:c=pink:r=48000:a=0.03,lowpass=f=220[noise];
    sine=f=65.4:d=60,volume=0.35[sub1];
    sine=f=130.8:d=60,volume=0.2[sub2];
    sine=f=196:d=60,volume=0.15[fifth];
    sine=f=261.6:d=60,volume=0.1[octave];
    [sub1][sub2][fifth][octave][noise]amix=inputs=5:normalize=0,
    aecho=0.8:0.88:120|240:0.4|0.25,
    flanger=delay=8:depth=4:speed=0.2,
    volume=0.22,
    afade=t=in:ss=0:d=2.5,
    afade=t=out:st=57.5:d=2.5
  " -ar 48000 ${bgmPath}`;

  execSync(bgmCommand.replace(/\n\s+/g, ' '));
  console.log('Generated cyber ambient BGM track!');

  console.log('--- Step 3: Mixing all 5 voiceover tracks onto the 60s timeline with BGM ---');
  // Offsets:
  // Scene 1 starts at 0.5s
  // Scene 2 starts at 10.0s
  // Scene 3 starts at 20.2s
  // Scene 4 starts at 35.5s
  // Scene 5 starts at 48.2s
  const masterMixPath = path.join(outDir, 'superjobgenie_trailer_master_mix.wav');
  const mixCommand = `ffmpeg -y \\
    -i ${bgmPath} \\
    -i ${path.join(outDir, 'scene1_timed.wav')} \\
    -i ${path.join(outDir, 'scene2_timed.wav')} \\
    -i ${path.join(outDir, 'scene3_timed.wav')} \\
    -i ${path.join(outDir, 'scene4_timed.wav')} \\
    -i ${path.join(outDir, 'scene5_timed.wav')} \\
    -filter_complex "
      [1]adelay=500|500,volume=1.4[v1];
      [2]adelay=10000|10000,volume=1.4[v2];
      [3]adelay=20200|20200,volume=1.4[v3];
      [4]adelay=35500|35500,volume=1.4[v4];
      [5]adelay=48200|48200,volume=1.4[v5];
      [0]volume=0.45[bgm];
      [bgm][v1][v2][v3][v4][v5]amix=inputs=6:duration=longest:dropout_transition=2,
      alimiter=limit=0.98:attack=5:release=50
    " -ar 48000 ${masterMixPath}`;

  execSync(mixCommand.replace(/\\\n\s+/g, ' ').replace(/\n\s+/g, ' '));
  console.log('Successfully rendered master mix:', masterMixPath);
  
  // Clean temporary files
  const timedFiles = ['scene1_timed.wav', 'scene2_timed.wav', 'scene3_timed.wav', 'scene4_timed.wav', 'scene5_timed.wav'];
  timedFiles.forEach(f => {
    try { fs.unlinkSync(path.join(outDir, f)); } catch (_) {}
  });
}

createMasterMix().catch(console.error);
