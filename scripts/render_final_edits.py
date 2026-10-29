import subprocess
import os
import shutil

os.makedirs("temp_edit", exist_ok=True)
font = "public/assets/fonts/jf-openhuninn-2.1.ttf"

print("==================================================")
print("  CareerCat 24/7 - 台湾Looker Pets 原生粉圆体版 (Pro Render)")
print("  1. 字体升级为台湾综艺圆体 (jf-openhuninn)，与原版猫片无缝契合")
print("  2. 金黄+纯白双色描边，无违和感")
print("  3. 前5秒震撼人话勾子，中段科技纯享无猫叫，尾段单个萌音收尾")
print("==================================================")

# ----------------------------------------------------
# 1. Extract clean cute outro meow (0.8s)
# ----------------------------------------------------
subprocess.run([
    "ffmpeg", "-y",
    "-ss", "00:00:23.0", "-to", "00:00:24.2",
    "-i", "public/assets/aistudio/30252242_133103250869431_4153680661716140032_n__1__dd2499ed.mp4",
    "-vn", "-af", "afade=t=out:st=0.8:d=0.4,volume=1.2",
    "temp_edit/cute_meow.wav"
], check=True)

# ----------------------------------------------------
# 2. HORIZONTAL VIDEO (1920x1080, ~46 seconds)
# ----------------------------------------------------
print("--- [1/2] Rendering Horizontal Video with jf-openhuninn (1920x1080) ---")

# Horiz Part 1: Mia walking in, "好餓喔" (4.5s)
subprocess.run([
    "ffmpeg", "-y",
    "-ss", "00:00:23.0", "-to", "00:00:27.5",
    "-i", "public/assets/aistudio/30252242_133103250869431_4153680661716140032_n__1__dd2499ed.mp4",
    "-vf", f"scale=1080:1080,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,drawtext=fontfile='{font}':text='台灣爆紅成精貓 Mia：奴才忘記餵罐罐...':fontcolor=white:fontsize=50:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=3:shadowy=3:x=(w-text_w)/2:y=50,drawtext=fontfile='{font}':text='喵：「噢～好餓喔～」(說人話)':fontcolor=0xffb800:fontsize=52:borderw=7:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=h-90",
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/h_cat1.mp4"
], check=True)

# Horiz Part 2: Mia opens cabinet (4.0s)
subprocess.run([
    "ffmpeg", "-y",
    "-ss", "00:00:59.2", "-to", "01:03.2",
    "-i", "public/assets/aistudio/30252242_133103250869431_4153680661716140032_n__1__dd2499ed.mp4",
    "-vf", f"scale=1080:1080,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,drawtext=fontfile='{font}':text='「既然奴才賺不到罐罐錢，不如朕親自出馬！」':fontcolor=0xffb800:fontsize=50:borderw=7:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=50",
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/h_cat2.mp4"
], check=True)

# Horiz Part 3: Indeed Cruise (18.0s) - Clean Tech BGM, NO Cat Meows!
subprocess.run([
    "ffmpeg", "-y",
    "-ss", "00:00:01.0", "-to", "00:00:19.0",
    "-i", "public/assets/aistudio/20261029______b1290dce.mp4",
    "-i", "public/audio/cyber_bgm_38s.wav",
    "-filter_complex", f"[0:v]drawtext=fontfile='{font}':text='🐾 成精貓親自上 Indeed 巡航新竹外商軟體職缺':fontcolor=white:fontsize=46:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=3:shadowy=3:x=(w-text_w)/2:y=30,drawtext=fontfile='{font}':text='Cadence 97% · Brooks 95% 絕佳匹配度秒速捕捉':fontcolor=0x34d399:fontsize=42:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=3:shadowy=3:x=(w-text_w)/2:y=h-70[v];[1:a]atrim=0:18.0,afade=t=in:st=0:d=0.5,volume=0.45[a]",
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/h_obs1.mp4"
], check=True)

# Horiz Part 4: Numbers Spreadsheet & Outro (16.0s) - BGM + One cute outro meow at 13s
subprocess.run([
    "ffmpeg", "-y",
    "-ss", "00:01:05.0", "-to", "00:01:21.0",
    "-i", "public/assets/aistudio/20261029______b1290dce.mp4",
    "-i", "public/audio/cyber_bgm_38s.wav",
    "-i", "temp_edit/cute_meow.wav",
    "-filter_complex", f"[0:v]drawtext=fontfile='{font}':text='✨ 貓貓：5秒導出新竹外商高薪表(Lam 97% / Cadence 97% / KLA 95%)':fontcolor=0x10B981:fontsize=42:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=3:shadowy=3:x=(w-text_w)/2:y=30,drawtext=fontfile='{font}':text='📥 完整 Excel 下載見置頂留言 · Chrome 商店搜尋：SuperJobGenie 免費安裝':fontcolor=0xffb800:fontsize=40:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=3:shadowy=3:x=(w-text_w)/2:y=h-70[v];[1:a]atrim=18.0:34.0,asetpts=PTS-STARTPTS,afade=t=out:st=14.5:d=1.5,volume=0.45[bgm];[2:a]adelay=12500|12500[meow];[bgm][meow]amix=inputs=2:duration=first[a]",
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/h_obs2.mp4"
], check=True)

# Merge Horizontal Video
with open("temp_edit/concat_h.txt", "w") as f:
    f.write("file 'h_cat1.mp4'\n")
    f.write("file 'h_cat2.mp4'\n")
    f.write("file 'h_obs1.mp4'\n")
    f.write("file 'h_obs2.mp4'\n")

subprocess.run([
    "ffmpeg", "-y", "-f", "concat", "-safe", "0",
    "-i", "temp_edit/concat_h.txt",
    "-c", "copy",
    "public/youtube_mia_hsinchu_jobs.mp4"
], check=True)
print(">>> Horizontal finished: public/youtube_mia_hsinchu_jobs.mp4")

# ----------------------------------------------------
# 3. VERTICAL SHORTS (1080x1920, ~42 seconds)
# ----------------------------------------------------
print("--- [2/2] Rendering Vertical Shorts with jf-openhuninn (1080x1920) ---")

# Shorts 1: Mia "好餓喔" (4.5s)
subprocess.run([
    "ffmpeg", "-y",
    "-ss", "00:00:23.0", "-to", "00:00:27.5",
    "-i", "public/assets/aistudio/30252242_133103250869431_4153680661716140032_n__1__dd2499ed.mp4",
    "-vf", f"scale=1080:1080,pad=1080:1920:0:(oh-ih)/2:0x0b0f19,drawtext=fontfile='{font}':text='台灣爆紅成精貓 Mia：奴才忘記餵罐罐...':fontcolor=white:fontsize=52:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=240,drawtext=fontfile='{font}':text='喵：「噢～好餓喔～」(說人話)':fontcolor=0xffb800:fontsize=58:borderw=8:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=h-300",
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/s_cat1.mp4"
], check=True)

# Shorts 2: Mia opens cabinet (3.5s)
subprocess.run([
    "ffmpeg", "-y",
    "-ss", "00:00:59.5", "-to", "01:03.0",
    "-i", "public/assets/aistudio/30252242_133103250869431_4153680661716140032_n__1__dd2499ed.mp4",
    "-vf", f"scale=1080:1080,pad=1080:1920:0:(oh-ih)/2:0x0b0f19,drawtext=fontfile='{font}':text='「既然奴才賺不到罐罐錢...」':fontcolor=white:fontsize=52:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=240,drawtext=fontfile='{font}':text='「不如朕親自上工找工作！」':fontcolor=0xffb800:fontsize=58:borderw=8:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=h-300",
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/s_cat2.mp4"
], check=True)

# Shorts 3: Screen Indeed Cruise (18.0s) - Clean Tech BGM, NO Cat Meows
subprocess.run([
    "ffmpeg", "-y",
    "-ss", "00:00:01.0", "-to", "00:00:19.0",
    "-i", "public/assets/aistudio/20261029______b1290dce.mp4",
    "-i", "public/audio/cyber_bgm_38s.wav",
    "-filter_complex", f"[0:v]scale=1080:607,pad=1080:1920:0:(oh-ih)/2:0x0b0f19,drawtext=fontfile='{font}':text='🐾 成精貓親自上 Indeed 巡航新竹外商':fontcolor=white:fontsize=50:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=220,drawtext=fontfile='{font}':text='Cadence 97% / Brooks 95% 絕佳契合':fontcolor=0x34d399:fontsize=48:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=h-340[v];[1:a]atrim=0:18.0,afade=t=in:st=0:d=0.5,volume=0.45[a]",
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/s_obs1.mp4"
], check=True)

# Shorts 4: Numbers Table (16.0s) - BGM + single cute outro meow at 13s
subprocess.run([
    "ffmpeg", "-y",
    "-ss", "00:01:05.0", "-to", "00:01:21.0",
    "-i", "public/assets/aistudio/20261029______b1290dce.mp4",
    "-i", "public/audio/cyber_bgm_38s.wav",
    "-i", "temp_edit/cute_meow.wav",
    "-filter_complex", f"[0:v]scale=1080:607,pad=1080:1920:0:(oh-ih)/2:0x0b0f19,drawtext=fontfile='{font}':text='🐱 5秒導出新竹外商高契合職缺表':fontcolor=0xffb800:fontsize=52:borderw=7:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=200,drawtext=fontfile='{font}':text='罐罐錢有了！快拿去投！':fontcolor=0x10b981:fontsize=46:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=280,drawtext=fontfile='{font}':text='📥 完整 Excel 下載見留言區':fontcolor=white:fontsize=48:borderw=7:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=h-340,drawtext=fontfile='{font}':text='Chrome 商店搜尋：SuperJobGenie':fontcolor=0xffb800:fontsize=44:borderw=6:bordercolor=black:shadowcolor=black@0.9:shadowx=4:shadowy=4:x=(w-text_w)/2:y=h-240[v];[1:a]atrim=18.0:34.0,asetpts=PTS-STARTPTS,afade=t=out:st=14.5:d=1.5,volume=0.45[bgm];[2:a]adelay=12500|12500[meow];[bgm][meow]amix=inputs=2:duration=first[a]",
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/s_obs2.mp4"
], check=True)

# Merge Shorts
with open("temp_edit/concat_s.txt", "w") as f:
    f.write("file 's_cat1.mp4'\n")
    f.write("file 's_cat2.mp4'\n")
    f.write("file 's_obs1.mp4'\n")
    f.write("file 's_obs2.mp4'\n")

subprocess.run([
    "ffmpeg", "-y", "-f", "concat", "-safe", "0",
    "-i", "temp_edit/concat_s.txt",
    "-c", "copy",
    "public/shorts_cat_hsinchu_engineer.mp4"
], check=True)
print(">>> Vertical Shorts finished: public/shorts_cat_hsinchu_engineer.mp4")

shutil.rmtree("temp_edit", ignore_errors=True)
print("ALL COMPLETED! Cleaned temp files.")
