const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tmpDir = '/tmp/shorts4s_build';
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

console.log('1. Generating 4 visual plates (1080x1920 vertical)...');

// Plate 1: 0-1s "Looking for a job? 💼"
// Dark gradient, glowing ATS match warning, briefcase icon
execSync(`
convert -size 1080x1920 'xc:#0a0c10' \\
  -fill '#1e1b4b' -draw 'circle 540,800 540,400' -blur 0x80 \\
  -fill '#ffffff' -font Liberation-Sans-Bold -pointsize 72 -gravity north -annotate +0+260 'YOUTUBE SHORTS 4S LOOP' \\
  -fill '#a5b4fc' -font Liberation-Sans -pointsize 36 -gravity north -annotate +0+360 'ATS BUSTER // FAST CAREER PIVOT' \\
  -fill '#312e81' -stroke '#6366f1' -strokewidth 4 -draw 'roundrectangle 140,540 940,1260 40,40' \\
  -fill '#4338ca' -stroke none -draw 'roundrectangle 180,580 900,940 30,30' \\
  -fill '#ffffff' -font Liberation-Sans-Bold -pointsize 140 -gravity center -annotate +0-160 '💼' \\
  -fill '#ef4444' -font Liberation-Sans-Bold -pointsize 48 -gravity center -annotate +0+80 'ATS REJECTION RATE: 75%' \\
  -fill '#94a3b8' -font Liberation-Sans -pointsize 32 -gravity center -annotate +0+150 'Tired of the application black hole?' \\
  ${tmpDir}/plate1.png
`);
console.log('Plate 1 created');

// Plate 2: 1-2s "Need a cover letter? 📝"
// ATS Match boosted, cover letter generated
execSync(`
convert -size 1080x1920 'xc:#0b0f17' \\
  -fill '#064e3b' -draw 'circle 540,850 540,450' -blur 0x90 \\
  -fill '#10b981' -font Liberation-Sans-Bold -pointsize 40 -gravity north -annotate +0+260 'INSTANT TAILORED APPLICATION' \\
  -fill '#ffffff' -font Liberation-Sans-Bold -pointsize 64 -gravity north -annotate +0+340 'EXECUTIVE COVER LETTER' \\
  -fill '#0f172a' -stroke '#10b981' -strokewidth 4 -draw 'roundrectangle 140,480 940,1320 40,40' \\
  -fill '#022c22' -stroke '#059669' -strokewidth 2 -draw 'roundrectangle 200,540 880,720 20,20' \\
  -fill '#34d399' -font Liberation-Sans-Bold -pointsize 54 -gravity center -annotate +0-320 'MATCH FIT: 97%' \\
  -fill '#ffffff' -font Liberation-Sans-Bold -pointsize 130 -gravity center -annotate +0-100 '📝' \\
  -fill '#e2e8f0' -font Liberation-Sans -pointsize 34 -gravity center -annotate +0+100 '11,000+ Chars JD Deep-Parsed' \\
  -fill '#6ee7b7' -font Liberation-Sans-Bold -pointsize 36 -gravity center -annotate +0+170 '✓ 1-Click Executive Pitch Generated' \\
  ${tmpDir}/plate2.png
`);
console.log('Plate 2 created');

// Plate 3: 2-3s "SuperJobGenie ⚡"
// Featuring the beloved Retro Computer-Head Person in center stage!
execSync(`
convert public/assets/aistudio/retro_person_avatar_pure.jpg -resize 780x -gravity center \\
  ${tmpDir}/avatar_scaled.png
`);

execSync(`
convert -size 1080x1920 'xc:#07090e' \\
  -fill '#854d0e' -draw 'circle 540,880 540,480' -blur 0x90 \\
  -fill '#f59e0b' -font Liberation-Sans-Bold -pointsize 42 -gravity north -annotate +0+240 'MEET THE AI CO-PILOT' \\
  -fill '#1e293b' -stroke '#eab308' -strokewidth 6 -draw 'roundrectangle 130,420 950,1380 40,40' \\
  ${tmpDir}/plate3_base.png
`);

execSync(`
composite -gravity center -geometry +0-50 ${tmpDir}/avatar_scaled.png ${tmpDir}/plate3_base.png ${tmpDir}/plate3_merged.png
`);

execSync(`
convert ${tmpDir}/plate3_merged.png \\
  -fill '#ffffff' -font Liberation-Sans-Bold -pointsize 72 -gravity south -annotate +0+660 'SUPERJOBGENIE ⚡' \\
  -fill '#fde047' -font Liberation-Sans-Bold -pointsize 36 -gravity south -annotate +0+600 'LOCAL-FIRST CAREER INTELLIGENCE' \\
  ${tmpDir}/plate3.png
`);
console.log('Plate 3 created');

// Plate 4: 3-4s "100% FREE! 🔥"
// High energy, flame glow, Chrome Web Store badge, explosion effect
execSync(`
convert -size 1080x1920 'xc:#110505' \\
  -fill '#7f1d1d' -draw 'circle 540,900 540,400' -blur 0x90 \\
  -fill '#f97316' -draw 'circle 540,900 540,600' -blur 0x80 \\
  -fill '#000000' -stroke '#ef4444' -strokewidth 8 -draw 'roundrectangle 120,400 960,1400 50,50' \\
  -fill '#ef4444' -font Liberation-Sans-Bold -pointsize 130 -gravity center -annotate +0-280 '🔥' \\
  -fill '#facc15' -stroke '#000000' -strokewidth 6 -font Liberation-Sans-Bold -pointsize 120 -gravity center -annotate +0-120 '100% FREE!' \\
  -fill '#ffffff' -stroke none -font Liberation-Sans-Bold -pointsize 48 -gravity center -annotate +0+60 'NO SUBSCRIPTION · NO ADS' \\
  -fill '#10b981' -font Liberation-Sans-Bold -pointsize 44 -gravity center -annotate +0+160 'OFFICIAL CHROME EXTENSION' \\
  -fill '#38bdf8' -font Liberation-Sans -pointsize 34 -gravity center -annotate +0+250 'chromewebstore.google.com' \\
  ${tmpDir}/plate4.png
`);
console.log('Plate 4 created');

console.log('2. Rendering 4 animated 1-second clips with dynamic karaoke subtitles & camera zoom...');

// Clip 1: 0-1s "Looking for a job?"
// Subtitle: pure white with black stroke, pop-up
execSync(`
ffmpeg -y -loop 1 -i ${tmpDir}/plate1.png \\
  -vf "zoompan=z='1+0.04*on/60':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=60:s=1080x1920:fps=60, \\
      drawtext=fontfile=/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf: \\
      text='LOOKING FOR A JOB? 💼':fontcolor=white:bordercolor=black:borderw=10:fontsize=84: \\
      x=(w-text_w)/2:y=h-380" \\
  -t 1.0 -c:v libx264 -preset fast -pix_fmt yuv420p ${tmpDir}/clip1.mp4
`);

// Clip 2: 1-2s "Need a cover letter?"
execSync(`
ffmpeg -y -loop 1 -i ${tmpDir}/plate2.png \\
  -vf "zoompan=z='1+0.04*on/60':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=60:s=1080x1920:fps=60, \\
      drawtext=fontfile=/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf: \\
      text='NEED A COVER LETTER? 📝':fontcolor=white:bordercolor=black:borderw=10:fontsize=76: \\
      x=(w-text_w)/2:y=h-380" \\
  -t 1.0 -c:v libx264 -preset fast -pix_fmt yuv420p ${tmpDir}/clip2.mp4
`);

// Clip 3: 2-3s "SuperJobGenie ⚡"
// Yellow cyber branding
execSync(`
ffmpeg -y -loop 1 -i ${tmpDir}/plate3.png \\
  -vf "zoompan=z='1+0.04*on/60':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=60:s=1080x1920:fps=60, \\
      drawtext=fontfile=/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf: \\
      text='SUPERJOBGENIE ⚡':fontcolor=#facc15:bordercolor=black:borderw=12:fontsize=92: \\
      x=(w-text_w)/2:y=h-380" \\
  -t 1.0 -c:v libx264 -preset fast -pix_fmt yuv420p ${tmpDir}/clip3.mp4
`);

// Clip 4: 3-4s "100% FREE! 🔥"
// Red/yellow font with vibration shake (sinusoidal coordinate jitter)
execSync(`
ffmpeg -y -loop 1 -i ${tmpDir}/plate4.png \\
  -vf "zoompan=z='1+0.06*on/60':x='iw/2-(iw/zoom/2)+12*sin(2*PI*on/6)':y='ih/2-(ih/zoom/2)+12*cos(2*PI*on/6)':d=60:s=1080x1920:fps=60, \\
      drawtext=fontfile=/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf: \\
      text='100% FREE! 🔥💥':fontcolor=#f87171:bordercolor=yellow:borderw=14:fontsize=104: \\
      x='(w-text_w)/2+8*sin(2*PI*n/4)':y='h-400+8*cos(2*PI*n/4)'" \\
  -t 1.0 -c:v libx264 -preset fast -pix_fmt yuv420p ${tmpDir}/clip4.mp4
`);

console.log('3. Concatenating 4 clips into video track...');
fs.writeFileSync(`${tmpDir}/concat.txt`, `file '${tmpDir}/clip1.mp4'\nfile '${tmpDir}/clip2.mp4'\nfile '${tmpDir}/clip3.mp4'\nfile '${tmpDir}/clip4.mp4'\n`);

execSync(`
ffmpeg -y -f concat -safe 0 -i ${tmpDir}/concat.txt -c copy ${tmpDir}/video_track.mp4
`);

console.log('4. Muxing video track with master 4s audio into final YouTube Shorts MP4...');
const finalPath = 'public/assets/superjobgenie_shorts_4s_loop.mp4';
execSync(`
ffmpeg -y -i ${tmpDir}/video_track.mp4 -i /tmp/shorts_4s_master_audio.wav \\
  -c:v libx264 -b:v 4500k -pix_fmt yuv420p \\
  -c:a aac -b:a 192k -shortest \\
  ${finalPath}
`);

// Copy to dist and other mirrors
execSync(`cp ${finalPath} dist/assets/superjobgenie_shorts_4s_loop.mp4`);
execSync(`cp ${finalPath} public/assets/superjobgenie_short_01.mp4`);
execSync(`cp ${finalPath} dist/assets/superjobgenie_short_01.mp4`);

console.log('SUCCESS! Generated:', finalPath, 'Size:', fs.statSync(finalPath).size);
