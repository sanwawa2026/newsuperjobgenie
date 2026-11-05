import subprocess
import os
import shutil

print("=== Rendering SuperJobGenie 18s Flagship Shorts from 3-Platform Recording ===")

source_mp4 = 'public/assets/aistudio/2026-11-04_21-30-03_fe218cee.mp4'
bgm_wav = 'public/audio/viral_shorts_bgm.wav'
font_bold = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
out_dir = '/tmp/render_shorts_18s'
os.makedirs(out_dir, exist_ok=True)

final_mp4 = 'public/superjobgenie_shorts_18s_master.mp4'

# Clip 1: 0-3s Hook "STOP PASTING INTO CHATGPT"
print("[1/5] Rendering Hook Clip (0-3s)...")
hook_vf = (
    "drawbox=x=0:y=0:w=1080:h=1920:color=0x0b0f19:t=fill,"
    "drawbox=x=60:y=500:w=960:h=920:color=0x1e1014@0.95:t=fill,"
    "drawbox=x=60:y=500:w=960:h=920:color=0xef4444:t=6,"
    f"drawtext=fontfile='{font_bold}':text='STOP':fontcolor=0xef4444:fontsize=120:x=(w-text_w)/2:y=580:borderw=10:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='PASTING JOB POSTS':fontcolor=white:fontsize=76:x=(w-text_w)/2:y=730:borderw=8:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='INTO CHATGPT! 🛑':fontcolor=0xfacc15:fontsize=76:x=(w-text_w)/2:y=830:borderw=8:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='Tired of manual copying?':fontcolor=0x94a3b8:fontsize=42:x=(w-text_w)/2:y=980,"
    f"drawtext=fontfile='{font_bold}':text='Watch this 1-click magic ⚡':fontcolor=0x38bdf8:fontsize=48:x=(w-text_w)/2:y=1080:borderw=6:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='GLASSDOOR · LINKEDIN · INDEED':fontcolor=0x10b981:fontsize=40:x=(w-text_w)/2:y=1240"
)

subprocess.run([
    'ffmpeg', '-y',
    '-f', 'lavfi', '-i', 'color=c=#07090e:s=1080x1920:d=3.0:r=30',
    '-vf', hook_vf,
    '-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p',
    f'{out_dir}/clip1_hook.mp4'
], check=True)

# Helper crop for 1920x1080 -> 1080x1920:
# Focus on the SuperJobGenie sidebar (right side) and job title
# Crop region: x=840, y=0, w=1080, h=1080, scaled & padded to 1080x1920

# Clip 2: 3-7s Glassdoor Live Demo (4s: from 00:00:33.5 to 00:00:37.5)
print("[2/5] Rendering Glassdoor Live Demo (3-7s)...")
c2_vf = (
    "crop=1080:1080:840:0,"
    "pad=1080:1920:0:420:0x0b0f19,"
    "drawbox=x=40:y=100:w=1000:h=260:color=0x0f172a@0.95:t=fill,"
    "drawbox=x=40:y=100:w=1000:h=260:color=0x059669:t=4,"
    f"drawtext=fontfile='{font_bold}':text='STEP 1: GLASSDOOR ⚡':fontcolor=0x34d399:fontsize=52:x=(w-text_w)/2:y=130:borderw=6:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='1-Click Full JD Capture & 83% Match':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=205:borderw=6:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='Zero typing · Instant ATS breakdown':fontcolor=0xfde047:fontsize=36:x=(w-text_w)/2:y=275,"
    "drawbox=x=40:y=1580:w=1000:h=220:color=0x022c22@0.92:t=fill,"
    "drawbox=x=40:y=1580:w=1000:h=220:color=0x10b981:t=4,"
    f"drawtext=fontfile='{font_bold}':text='ATS SCORE: 83% (STRONG MATCH)':fontcolor=0x34d399:fontsize=48:x=(w-text_w)/2:y=1620:borderw=6:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='Missing: C++, Docker, Kubernetes':fontcolor=0xfca5a5:fontsize=38:x=(w-text_w)/2:y=1700"
)

subprocess.run([
    'ffmpeg', '-y',
    '-ss', '00:00:33.5', '-to', '00:00:37.5',
    '-i', source_mp4,
    '-vf', c2_vf,
    '-r', '30', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '20', '-an',
    f'{out_dir}/clip2_glassdoor.mp4'
], check=True)

# Clip 3: 7-12s LinkedIn Live Demo (5s: from 00:00:56.0 to 00:01:01.0)
print("[3/5] Rendering LinkedIn Live Demo (7-12s)...")
c3_vf = (
    "crop=1080:1080:840:0,"
    "pad=1080:1920:0:420:0x0b0f19,"
    "drawbox=x=40:y=100:w=1000:h=260:color=0x0f172a@0.95:t=fill,"
    "drawbox=x=40:y=100:w=1000:h=260:color=0x0284c7:t=4,"
    f"drawtext=fontfile='{font_bold}':text='STEP 2: LINKEDIN 📄':fontcolor=0x38bdf8:fontsize=52:x=(w-text_w)/2:y=130:borderw=6:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='Instant Tailored Cover Letter':fontcolor=white:fontsize=44:x=(w-text_w)/2:y=205:borderw=6:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='Customized to Hiring Manager in Seconds':fontcolor=0xfde047:fontsize=36:x=(w-text_w)/2:y=275,"
    "drawbox=x=40:y=1580:w=1000:h=220:color=0x082f49@0.92:t=fill,"
    "drawbox=x=40:y=1580:w=1000:h=220:color=0x38bdf8:t=4,"
    f"drawtext=fontfile='{font_bold}':text='100% LOCAL PRIVACY · NO DATA LEAK':fontcolor=0x38bdf8:fontsize=46:x=(w-text_w)/2:y=1620:borderw=6:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='Runs 100% inside your Chrome browser':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=1700"
)

subprocess.run([
    'ffmpeg', '-y',
    '-ss', '00:00:56.0', '-to', '00:01:01.0',
    '-i', source_mp4,
    '-vf', c3_vf,
    '-r', '30', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '20', '-an',
    f'{out_dir}/clip3_linkedin.mp4'
], check=True)

# Clip 4: 12-15s Indeed Live Demo (3s: from 00:01:45.0 to 00:01:48.0)
print("[4/5] Rendering Indeed Live Demo (12-15s)...")
c4_vf = (
    "crop=1080:1080:840:0,"
    "pad=1080:1920:0:420:0x0b0f19,"
    "drawbox=x=40:y=100:w=1000:h=260:color=0x0f172a@0.95:t=fill,"
    "drawbox=x=40:y=100:w=1000:h=260:color=0x7c3aed:t=4,"
    f"drawtext=fontfile='{font_bold}':text='STEP 3: INDEED 🚀':fontcolor=0xa78bfa:fontsize=52:x=(w-text_w)/2:y=130:borderw=6:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='Switch Jobs Seamlessly':fontcolor=white:fontsize=44:x=(w-text_w)/2:y=205:borderw=6:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='All 3 Sites Auto-Synced!':fontcolor=0xfde047:fontsize=38:x=(w-text_w)/2:y=275,"
    "drawbox=x=40:y=1580:w=1000:h=220:color=0x2e1065@0.92:t=fill,"
    "drawbox=x=40:y=1580:w=1000:h=220:color=0xa855f7:t=4,"
    f"drawtext=fontfile='{font_bold}':text='ONE EXTENSION. ALL JOB BOARDS.':fontcolor=0xfacc15:fontsize=46:x=(w-text_w)/2:y=1620:borderw=6:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='Save 30 mins on EVERY application':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=1700"
)

subprocess.run([
    'ffmpeg', '-y',
    '-ss', '00:01:45.0', '-to', '00:01:48.0',
    '-i', source_mp4,
    '-vf', c4_vf,
    '-r', '30', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '20', '-an',
    f'{out_dir}/clip4_indeed.mp4'
], check=True)

# Clip 5: 15-18s High-Energy CTA Outro (3s)
print("[5/5] Rendering High-Energy CTA Outro (15-18s)...")
c5_vf = (
    "drawbox=x=0:y=0:w=1080:h=1920:color=0x07090e:t=fill,"
    "drawbox=x=60:y=420:w=960:h=1080:color=0x0f172a@0.95:t=fill,"
    "drawbox=x=60:y=420:w=960:h=1080:color=0xf59e0b:t=6,"
    f"drawtext=fontfile='{font_bold}':text='SUPERJOBGENIE':fontcolor=0xfacc15:fontsize=84:x=(w-text_w)/2:y=500:borderw=10:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='100% FREE ON CHROME':fontcolor=white:fontsize=64:x=(w-text_w)/2:y=620:borderw=8:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='🔥 NO SUBSCRIPTION · NO ADS 🔥':fontcolor=0xef4444:fontsize=44:x=(w-text_w)/2:y=740:borderw=6:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='✅ Auto-parse LinkedIn & Indeed':fontcolor=0x34d399:fontsize=40:x=(w-text_w)/2:y=860,"
    f"drawtext=fontfile='{font_bold}':text='✅ Auto-score ATS fit & skill gaps':fontcolor=0x34d399:fontsize=40:x=(w-text_w)/2:y=940,"
    f"drawtext=fontfile='{font_bold}':text='✅ 1-Click Tailored Cover Letters':fontcolor=0x34d399:fontsize=40:x=(w-text_w)/2:y=1020,"
    "drawbox=x=100:y=1160:w=880:h=260:color=0x1e1b4b@0.95:t=fill,"
    "drawbox=x=100:y=1160:w=880:h=260:color=0x6366f1:t=4,"
    f"drawtext=fontfile='{font_bold}':text='LINK IN PINNED COMMENT 👇':fontcolor=0x38bdf8:fontsize=52:x=(w-text_w)/2:y=1210:borderw=8:bordercolor=black,"
    f"drawtext=fontfile='{font_bold}':text='Chrome Web Store Official':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=1310"
)

subprocess.run([
    'ffmpeg', '-y',
    '-f', 'lavfi', '-i', 'color=c=#07090e:s=1080x1920:d=3.0:r=30',
    '-vf', c5_vf,
    '-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p',
    f'{out_dir}/clip5_outro.mp4'
], check=True)

# Concat video clips
print("[6/7] Concatenating 5 video segments into 18s video...")
with open(f'{out_dir}/concat.txt', 'w') as f:
    f.write(f"file '{out_dir}/clip1_hook.mp4'\n")
    f.write(f"file '{out_dir}/clip2_glassdoor.mp4'\n")
    f.write(f"file '{out_dir}/clip3_linkedin.mp4'\n")
    f.write(f"file '{out_dir}/clip4_indeed.mp4'\n")
    f.write(f"file '{out_dir}/clip5_outro.mp4'\n")

subprocess.run([
    'ffmpeg', '-y',
    '-f', 'concat', '-safe', '0',
    '-i', f'{out_dir}/concat.txt',
    '-c', 'copy',
    f'{out_dir}/video_concat.mp4'
], check=True)

# Mux with High-Energy Music
print("[7/7] Muxing video with viral audio track...")
subprocess.run([
    'ffmpeg', '-y',
    '-i', f'{out_dir}/video_concat.mp4',
    '-i', bgm_wav,
    '-c:v', 'libx264', '-b:v', '5500k', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k',
    '-t', '18.0',
    '-af', 'volume=1.2,afade=t=out:st=16.8:d=1.2',
    final_mp4
], check=True)

# Mirror to dist and showcase
os.makedirs('dist', exist_ok=True)
os.makedirs('public/assets', exist_ok=True)
shutil.copyfile(final_mp4, 'dist/superjobgenie_shorts_18s_master.mp4')
shutil.copyfile(final_mp4, 'public/assets/superjobgenie_shorts_18s_master.mp4')

print(f"SUCCESS! 18s Flagship Shorts generated at: {final_mp4}")
print("File size:", os.path.getsize(final_mp4), "bytes")
