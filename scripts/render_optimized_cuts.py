import subprocess
import os
import shutil

font = 'public/assets/fonts/jf-openhuninn-2.1.ttf'
cat_mp4 = 'public/assets/aistudio/30252242_133103250869431_4153680661716140032_n__1__dd2499ed.mp4'
obs_mp4 = 'public/assets/aistudio/20261029______b1290dce.mp4'
bgm_wav = 'public/audio/viral_shorts_bgm.wav'

os.makedirs('temp_render3', exist_ok=True)

print("==================================================")
print("  CareerCat 24/7 - Rock-Solid Video Cuts with Viral Audio")
print("  1. Upbeat, Addictive YouTube Shorts BGM ('上頭' 旋律)")
print("  2. Front-and-Center Mia Vocal ('好餓喔' + 喵叫 清楚大聲)")
print("  3. Frame-accurate concat filter (Perfect AV Sync)")
print("  4. Vertical Shorts <= 20s (Exact ~19.5s)")
print("  5. Horizontal Video <= 30s (Exact ~26.5s)")
print("  6. CSV Blank Space Callout Box (置頂留言下載 + Chrome 外掛)")
print("==================================================")

# Outro meow asset
subprocess.run([
    'ffmpeg', '-y',
    '-ss', '00:00:23.2', '-to', '00:00:24.4',
    '-i', cat_mp4,
    '-vn', '-af', 'volume=2.4,afade=t=out:st=0.9:d=0.3',
    'temp_render3/outro_meow.wav'
], check=True)

# Boosted Mia Hook Vocal (Loud & Clear human speech)
subprocess.run([
    'ffmpeg', '-y',
    '-ss', '00:00:23.2', '-to', '00:00:27.4',
    '-i', cat_mp4,
    '-vn', '-af', 'volume=2.8,highpass=f=90,lowpass=f=8000,alimiter=limit=0.98',
    'temp_render3/mia_hook_vocal.wav'
], check=True)


# ====================================================
# 1. VERTICAL SHORTS (1080x1920, strictly 19.5s <= 20s)
# ====================================================
print('\n--- [1/2] Rendering Vertical Shorts <= 20s ---')
# S1: Mia hook (4.2s: 23.2 to 27.4)
subprocess.run([
    'ffmpeg', '-y',
    '-ss', '00:00:23.2', '-to', '00:00:27.4',
    '-i', cat_mp4,
    '-vf', f"scale=1080:1080,pad=1080:1920:0:(oh-ih)/2:0x0b0f19,format=yuv420p,drawtext=fontfile='{font}':text='台灣爆紅成精貓 Mia：奴才忘記餵罐罐...':fontcolor=white:fontsize=52:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=240,drawtext=fontfile='{font}':text='喵：「噢～好餓喔～」(說人話)':fontcolor=0xffb800:fontsize=58:borderw=8:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=h-300",
    '-r', '30', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '19', '-an',
    'temp_render3/s1_v.mp4'
], check=True)

# S2: Mia cabinet (2.2s: 1:00.2 to 1:02.4)
subprocess.run([
    'ffmpeg', '-y',
    '-ss', '00:01:00.2', '-to', '00:01:02.4',
    '-i', cat_mp4,
    '-vf', f"scale=1080:1080,pad=1080:1920:0:(oh-ih)/2:0x0b0f19,format=yuv420p,drawtext=fontfile='{font}':text='「既然奴才賺不到罐罐錢...」':fontcolor=white:fontsize=52:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=240,drawtext=fontfile='{font}':text='「不如朕親自出馬找工作！」':fontcolor=0xffb800:fontsize=58:borderw=8:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=h-300",
    '-r', '30', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '19', '-an',
    'temp_render3/s2_v.mp4'
], check=True)

# S3: Indeed Cruise (6.5s: 0:03.0 to 0:09.5)
subprocess.run([
    'ffmpeg', '-y',
    '-ss', '00:00:03.0', '-to', '00:00:09.5',
    '-i', obs_mp4,
    '-vf', f"scale=1080:607,pad=1080:1920:0:(oh-ih)/2:0x0b0f19,format=yuv420p,drawtext=fontfile='{font}':text='成精貓親自上 Indeed 巡航新竹外商':fontcolor=white:fontsize=50:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=220,drawtext=fontfile='{font}':text='Cadence 97% · Brooks 95% 秒速捕捉！':fontcolor=0x34d399:fontsize=48:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=h-340",
    '-r', '30', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '19', '-an',
    'temp_render3/s3_v.mp4'
], check=True)

# S4: CSV Table + High-Contrast Card in CSV blank space (6.6s: 1:12.0 to 1:18.6)
s4_vf = (
    f"scale=1080:607,pad=1080:1920:0:(oh-ih)/2:0x0b0f19,format=yuv420p,"
    f"drawtext=fontfile='{font}':text='貓咪 5 秒導出新竹外商高薪職缺表':fontcolor=0xffb800:fontsize=46:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=3:shadowy=3:x=(w-text_w)/2:y=480,"
    f"drawbox=x=40:y=890:w=1000:h=340:color=0x0b0f19@0.95:t=fill,"
    f"drawbox=x=40:y=890:w=1000:h=340:color=0xffb800:t=4,"
    f"drawtext=fontfile='{font}':text='【新竹外商高薪 Excel / CSV 表格哪裡領？】':fontcolor=0xffb800:fontsize=36:x=(w-text_w)/2:y=915,"
    f"drawtext=fontfile='{font}':text='點擊下方【置頂留言第一條】即可免費下載！':fontcolor=white:fontsize=32:x=(w-text_w)/2:y=980,"
    f"drawtext=fontfile='{font}':text='【影片同款 1秒自動掃描職缺外掛】':fontcolor=0x34d399:fontsize=34:x=(w-text_w)/2:y=1045,"
    f"drawtext=fontfile='{font}':text='Chrome 商店搜尋：SuperJobGenie':fontcolor=0xffb800:fontsize=36:x=(w-text_w)/2:y=1115,"
    f"drawtext=fontfile='{font}':text='留言「求職」立即發送安裝網址！':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=1175,"
    f"drawtext=fontfile='{font}':text='罐罐錢有了！快去投履歷！':fontcolor=0x10b981:fontsize=44:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=3:shadowy=3:x=(w-text_w)/2:y=1320"
)
subprocess.run([
    'ffmpeg', '-y',
    '-ss', '00:01:12.0', '-to', '00:01:18.6',
    '-i', obs_mp4,
    '-vf', s4_vf,
    '-r', '30', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '19', '-an',
    'temp_render3/s4_v.mp4'
], check=True)

# Frame-accurate video concat filter (total 4.2 + 2.2 + 6.5 + 6.6 = 19.5s)
subprocess.run([
    'ffmpeg', '-y',
    '-i', 'temp_render3/s1_v.mp4',
    '-i', 'temp_render3/s2_v.mp4',
    '-i', 'temp_render3/s3_v.mp4',
    '-i', 'temp_render3/s4_v.mp4',
    '-filter_complex', '[0:v][1:v][2:v][3:v]concat=n=4:v=1:a=0[v]',
    '-map', '[v]',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '18',
    'temp_render3/shorts_video_only.mp4'
], check=True)

# Master Audio Mix for Shorts (19.5s):
# 0.0s - 4.2s: Mia's vocal front and center, BGM soft at volume=0.22
# 4.2s - 19.5s: Upbeat BGM kicks in full bounce at volume=0.45
# 18.0s: Outro victory meow
shorts_audio_filter = (
    "[0:a]atrim=0:19.5,volume=0.40,afade=t=in:st=0:d=0.2,afade=t=out:st=18.5:d=1.0[bgm];"
    "[1:a]adelay=0|0,volume=2.5[hook_vocal];"
    "[2:a]adelay=17500|17500,volume=2.2[meow];"
    "[bgm][hook_vocal]amix=inputs=2:duration=first:weights=0.35 1.0[m1];"
    "[m1][meow]amix=inputs=2:duration=first:weights=1.0 1.0,alimiter=limit=0.98[a]"
)
subprocess.run([
    'ffmpeg', '-y',
    '-i', bgm_wav,
    '-i', 'temp_render3/mia_hook_vocal.wav',
    '-i', 'temp_render3/outro_meow.wav',
    '-filter_complex', shorts_audio_filter,
    '-map', '[a]',
    '-c:a', 'aac', '-b:a', '192k',
    'temp_render3/shorts_audio_master.m4a'
], check=True)

# Final Mux Shorts
subprocess.run([
    'ffmpeg', '-y',
    '-i', 'temp_render3/shorts_video_only.mp4',
    '-i', 'temp_render3/shorts_audio_master.m4a',
    '-c:v', 'copy', '-c:a', 'copy',
    'public/shorts_cat_hsinchu_20s_fast.mp4'
], check=True)
print('>>> Finished Shorts: public/shorts_cat_hsinchu_20s_fast.mp4')


# ====================================================
# 2. HORIZONTAL VIDEO (1920x1080, strictly 26.5s <= 30s)
# ====================================================
print('\n--- [2/2] Rendering Horizontal Video <= 30s ---')
# H1: Mia hook (4.2s: 23.2 to 27.4)
subprocess.run([
    'ffmpeg', '-y',
    '-ss', '00:00:23.2', '-to', '00:00:27.4',
    '-i', cat_mp4,
    '-vf', f"scale=1080:1080,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,format=yuv420p,drawtext=fontfile='{font}':text='台灣爆紅成精貓 Mia：奴才忘記餵罐罐...':fontcolor=white:fontsize=50:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=3:shadowy=3:x=(w-text_w)/2:y=50,drawtext=fontfile='{font}':text='喵：「噢～好餓喔～」(說人話)':fontcolor=0xffb800:fontsize=54:borderw=7:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=h-90",
    '-r', '30', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '19', '-an',
    'temp_render3/h1_v.mp4'
], check=True)

# H2: Mia cabinet (2.7s: 1:00.0 to 1:02.7)
subprocess.run([
    'ffmpeg', '-y',
    '-ss', '00:01:00.0', '-to', '00:01:02.7',
    '-i', cat_mp4,
    '-vf', f"scale=1080:1080,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,format=yuv420p,drawtext=fontfile='{font}':text='「既然奴才賺不到罐罐錢，不如朕親自出馬！」':fontcolor=0xffb800:fontsize=50:borderw=7:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=50",
    '-r', '30', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '19', '-an',
    'temp_render3/h2_v.mp4'
], check=True)

# H3: Indeed Cruise (10.5s: 0:02.0 to 0:12.5)
subprocess.run([
    'ffmpeg', '-y',
    '-ss', '00:00:02.0', '-to', '00:00:12.5',
    '-i', obs_mp4,
    '-vf', f"format=yuv420p,drawtext=fontfile='{font}':text='成精貓親自上 Indeed 巡航新竹外商軟體職缺':fontcolor=white:fontsize=46:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=3:shadowy=3:x=(w-text_w)/2:y=30,drawtext=fontfile='{font}':text='Cadence 97% · Brooks 95% 絕佳匹配度秒速捕捉':fontcolor=0x34d399:fontsize=42:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=3:shadowy=3:x=(w-text_w)/2:y=h-70",
    '-r', '30', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '19', '-an',
    'temp_render3/h3_v.mp4'
], check=True)

# H4: CSV with Large Callout Badge in Blank Area (9.1s: 1:10.0 to 1:19.1)
h4_vf = (
    f"format=yuv420p,"
    f"drawtext=fontfile='{font}':text='貓咪 5 秒導出新竹外商高薪職缺表(Lam 97% / Cadence 97% / KLA 95%)':fontcolor=0x10B981:fontsize=42:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=3:shadowy=3:x=(w-text_w)/2:y=30,"
    f"drawbox=x=140:y=520:w=1640:h=410:color=0x0b0f19@0.94:t=fill,"
    f"drawbox=x=140:y=520:w=1640:h=410:color=0xffb800:t=5,"
    f"drawtext=fontfile='{font}':text='【新竹外商高薪 Excel / CSV 表格哪裡領？】':fontcolor=0xffb800:fontsize=46:x=(w-text_w)/2:y=555,"
    f"drawtext=fontfile='{font}':text='點擊下方【置頂留言第一條】或【影片資訊欄】免費下載！':fontcolor=white:fontsize=38:x=(w-text_w)/2:y=635,"
    f"drawtext=fontfile='{font}':text='【影片同款 1秒自動掃描職缺外掛下載】':fontcolor=0x34d399:fontsize=42:x=(w-text_w)/2:y=715,"
    f"drawtext=fontfile='{font}':text='Chrome 線上應用程式商店搜尋：SuperJobGenie':fontcolor=0xffb800:fontsize=42:x=(w-text_w)/2:y=795"
)
subprocess.run([
    'ffmpeg', '-y',
    '-ss', '00:01:10.0', '-to', '00:01:19.1',
    '-i', obs_mp4,
    '-vf', h4_vf,
    '-r', '30', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '19', '-an',
    'temp_render3/h4_v.mp4'
], check=True)

# Frame-accurate horizontal video concat filter (total 4.2 + 2.7 + 10.5 + 9.1 = 26.5s)
subprocess.run([
    'ffmpeg', '-y',
    '-i', 'temp_render3/h1_v.mp4',
    '-i', 'temp_render3/h2_v.mp4',
    '-i', 'temp_render3/h3_v.mp4',
    '-i', 'temp_render3/h4_v.mp4',
    '-filter_complex', '[0:v][1:v][2:v][3:v]concat=n=4:v=1:a=0[v]',
    '-map', '[v]',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '18',
    'temp_render3/horiz_video_only.mp4'
], check=True)

# Master Audio Mix for Horizontal (26.5s):
horiz_audio_filter = (
    "[0:a]atrim=0:26.5,volume=0.40,afade=t=in:st=0:d=0.2,afade=t=out:st=25.2:d=1.3[bgm];"
    "[1:a]adelay=0|0,volume=2.5[hook_vocal];"
    "[2:a]adelay=24500|24500,volume=2.2[meow];"
    "[bgm][hook_vocal]amix=inputs=2:duration=first:weights=0.35 1.0[m1];"
    "[m1][meow]amix=inputs=2:duration=first:weights=1.0 1.0,alimiter=limit=0.98[a]"
)
subprocess.run([
    'ffmpeg', '-y',
    '-i', bgm_wav,
    '-i', 'temp_render3/mia_hook_vocal.wav',
    '-i', 'temp_render3/outro_meow.wav',
    '-filter_complex', horiz_audio_filter,
    '-map', '[a]',
    '-c:a', 'aac', '-b:a', '192k',
    'temp_render3/horiz_audio_master.m4a'
], check=True)

# Final Mux Horizontal
subprocess.run([
    'ffmpeg', '-y',
    '-i', 'temp_render3/horiz_video_only.mp4',
    '-i', 'temp_render3/horiz_audio_master.m4a',
    '-c:v', 'copy', '-c:a', 'copy',
    'public/youtube_mia_hsinchu_jobs.mp4'
], check=True)
print('>>> Finished Horizontal: public/youtube_mia_hsinchu_jobs.mp4')

# Clean up temporary folder
shutil.rmtree('temp_render3', ignore_errors=True)
print('\n🎉 ALL DONE! Both videos rendered with frame-accurate sync, viral audio & crystal clear vocal!')
