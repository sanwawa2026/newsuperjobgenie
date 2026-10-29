import subprocess
import os

font = "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc"

print("--- Step 1: Building Horizontal Video (1920x1080, ~50s) ---")
# 1. Prepare Cat intro (1920x1080 padded, 14 seconds)
# Cat clip: 00:23.0 to 00:29.0 (Mia saying '好餓喔') + 00:59.0 to 01:07.0 ('不如朕親自動手啦')
cmd_cat_part1 = [
    "ffmpeg", "-y",
    "-ss", "00:00:22.5", "-to", "00:00:28.5",
    "-i", "public/assets/aistudio/30252242_133103250869431_4153680661716140032_n__1__dd2499ed.mp4",
    "-vf", f"scale=1080:1080,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,drawtext=fontfile='{font}':text='台灣爆紅成精貓：奴才忘記放飯...':fontcolor=white:fontsize=48:box=1:boxcolor=black@0.6:boxborderw=10:x=(w-text_w)/2:y=60",
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/horiz_cat1.mp4"
]
subprocess.run(cmd_cat_part1, check=True)

cmd_cat_part2 = [
    "ffmpeg", "-y",
    "-ss", "00:00:59.0", "-to", "00:01:06.5",
    "-i", "public/assets/aistudio/30252242_133103250869431_4153680661716140032_n__1__dd2499ed.mp4",
    "-vf", f"scale=1080:1080,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,drawtext=fontfile='{font}':text='「既然奴才賺不到罐罐錢，不如朕親自出馬！」':fontcolor=yellow:fontsize=48:box=1:boxcolor=black@0.7:boxborderw=10:x=(w-text_w)/2:y=60",
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/horiz_cat2.mp4"
]
subprocess.run(cmd_cat_part2, check=True)

# 2. Prepare OBS screen clip (Indeed Hsinchu Cruise + Numbers Table)
# 00:00 - 00:22 (Indeed Cruise) + 01:05 - 01:20 (Numbers table)
# Add looping BGM to OBS parts
cmd_obs_part1 = [
    "ffmpeg", "-y",
    "-ss", "00:00:00.0", "-to", "00:00:22.0",
    "-i", "public/assets/aistudio/20261029______b1290dce.mp4",
    "-i", "temp_edit/bgm.aac",
    "-filter_complex", f"[0:v]setpts=0.8*PTS,drawtext=fontfile='{font}':text='🐾 成精貓親自上 Indeed 巡航新竹外商軟體工程師職缺':fontcolor=white:fontsize=44:box=1:boxcolor=0x111827@0.85:boxborderw=12:x=(w-text_w)/2:y=30[v];[1:a]aloop=loop=-1:size=2e+09,atrim=0:17.6,volume=0.8[a]",
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/horiz_obs1.mp4"
]
subprocess.run(cmd_obs_part1, check=True)

cmd_obs_part2 = [
    "ffmpeg", "-y",
    "-ss", "00:01:05.0", "-to", "00:01:20.0",
    "-i", "public/assets/aistudio/20261029______b1290dce.mp4",
    "-i", "temp_edit/bgm.aac",
    "-filter_complex", f"[0:v]drawtext=fontfile='{font}':text='✨ 貓貓：5秒導出新竹外商高薪表(Lam 97% / Cadence 97% / KLA 95%)，罐罐錢有了！':fontcolor=0x10B981:fontsize=40:box=1:boxcolor=0x111827@0.85:boxborderw=12:x=(w-text_w)/2:y=30,drawtext=fontfile='{font}':text='📥 完整 Excel 下載見置頂留言 · Chrome 商店搜尋：SuperJobGenie 免費安裝':fontcolor=yellow:fontsize=36:box=1:boxcolor=black@0.8:boxborderw=10:x=(w-text_w)/2:y=h-70[v];[1:a]aloop=loop=-1:size=2e+09,atrim=0:15.0,volume=0.8[a]",
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/horiz_obs2.mp4"
]
subprocess.run(cmd_obs_part2, check=True)

# 3. Concatenate into final horizontal video
with open("temp_edit/concat_horiz.txt", "w") as f:
    f.write("file 'horiz_cat1.mp4'\n")
    f.write("file 'horiz_cat2.mp4'\n")
    f.write("file 'horiz_obs1.mp4'\n")
    f.write("file 'horiz_obs2.mp4'\n")

cmd_merge_horiz = [
    "ffmpeg", "-y", "-f", "concat", "-safe", "0",
    "-i", "temp_edit/concat_horiz.txt",
    "-c", "copy",
    "public/youtube_mia_hsinchu_jobs.mp4"
]
subprocess.run(cmd_merge_horiz, check=True)
print(">>> Horizontal video rendered successfully: public/youtube_mia_hsinchu_jobs.mp4")

print("--- Step 2: Building Vertical Shorts Video (1080x1920, ~45s) ---")
# Build a vertical 9:16 layout
# Top half: Cat or title, Bottom half: screen recording
# Or sequential cuts full 9:16 padded
cmd_shorts1 = [
    "ffmpeg", "-y",
    "-ss", "00:00:22.5", "-to", "00:00:28.0",
    "-i", "public/assets/aistudio/30252242_133103250869431_4153680661716140032_n__1__dd2499ed.mp4",
    "-vf", f"scale=1080:1080,pad=1080:1920:0:(oh-ih)/2:0x0f172a,drawtext=fontfile='{font}':text='台灣爆紅成精貓：奴才忘記放飯...':fontcolor=white:fontsize=52:box=1:boxcolor=black@0.7:boxborderw=12:x=(w-text_w)/2:y=240,drawtext=fontfile='{font}':text='喵：噢~ 好餓喔~ (說人話)':fontcolor=yellow:fontsize=48:box=1:boxcolor=black@0.7:boxborderw=10:x=(w-text_w)/2:y=h-300",
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/shorts_part1.mp4"
]
subprocess.run(cmd_shorts1, check=True)

cmd_shorts2 = [
    "ffmpeg", "-y",
    "-ss", "00:00:59.0", "-to", "00:01:05.5",
    "-i", "public/assets/aistudio/30252242_133103250869431_4153680661716140032_n__1__dd2499ed.mp4",
    "-vf", f"scale=1080:1080,pad=1080:1920:0:(oh-ih)/2:0x0f172a,drawtext=fontfile='{font}':text='「既然奴才賺不到罐罐錢...」':fontcolor=white:fontsize=52:box=1:boxcolor=black@0.7:boxborderw=12:x=(w-text_w)/2:y=240,drawtext=fontfile='{font}':text='「不如朕親自上工找工作！」':fontcolor=yellow:fontsize=52:box=1:boxcolor=0x1e3a8a@0.9:boxborderw=14:x=(w-text_w)/2:y=h-300",
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/shorts_part2.mp4"
]
subprocess.run(cmd_shorts2, check=True)

# Shorts part 3: Focus on SuperJobGenie HUD & Job card on Indeed
# Scale 1920x1080 to fit width 1080, padded to 1920 height
cmd_shorts3 = [
    "ffmpeg", "-y",
    "-ss", "00:00:00.0", "-to", "00:00:20.0",
    "-i", "public/assets/aistudio/20261029______b1290dce.mp4",
    "-i", "temp_edit/bgm.aac",
    "-filter_complex", f"[0:v]scale=1080:607,pad=1080:1920:0:(oh-ih)/2:0x0f172a,drawtext=fontfile='{font}':text='🐾 成精貓親自上 Indeed 巡航新竹外商':fontcolor=white:fontsize=48:box=1:boxcolor=0x1e1b4b@0.9:boxborderw=12:x=(w-text_w)/2:y=220,drawtext=fontfile='{font}':text='Cadence 97% / Brooks 95% 絕佳契合':fontcolor=0x34d399:fontsize=46:box=1:boxcolor=black@0.7:boxborderw=10:x=(w-text_w)/2:y=h-340[v];[1:a]aloop=loop=-1:size=2e+09,atrim=0:20.0,volume=0.8[a]",
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/shorts_part3.mp4"
]
subprocess.run(cmd_shorts3, check=True)

# Shorts part 4: Numbers table + CTA
cmd_shorts4 = [
    "ffmpeg", "-y",
    "-ss", "00:01:06.0", "-to", "00:01:19.0",
    "-i", "public/assets/aistudio/20261029______b1290dce.mp4",
    "-i", "temp_edit/bgm.aac",
    "-filter_complex", f"[0:v]scale=1080:607,pad=1080:1920:0:(oh-ih)/2:0x0f172a,drawtext=fontfile='{font}':text='🐱 5秒導出新竹外商高契合職缺表':fontcolor=yellow:fontsize=48:box=1:boxcolor=0x111827@0.85:boxborderw=12:x=(w-text_w)/2:y=200,drawtext=fontfile='{font}':text='罐罐錢有了！快拿去投！':fontcolor=0x10b981:fontsize=44:box=1:boxcolor=black@0.7:boxborderw=10:x=(w-text_w)/2:y=290,drawtext=fontfile='{font}':text='📥 完整 Excel 下載見留言區':fontcolor=white:fontsize=46:box=1:boxcolor=0x2563eb@0.9:boxborderw=12:x=(w-text_w)/2:y=h-340,drawtext=fontfile='{font}':text='Chrome 商店搜尋：SuperJobGenie':fontcolor=yellow:fontsize=42:box=1:boxcolor=black@0.8:boxborderw=10:x=(w-text_w)/2:y=h-240[v];[1:a]aloop=loop=-1:size=2e+09,atrim=0:13.0,volume=0.8[a]",
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/shorts_part4.mp4"
]
subprocess.run(cmd_shorts4, check=True)

with open("temp_edit/concat_shorts.txt", "w") as f:
    f.write("file 'shorts_part1.mp4'\n")
    f.write("file 'shorts_part2.mp4'\n")
    f.write("file 'shorts_part3.mp4'\n")
    f.write("file 'shorts_part4.mp4'\n")

cmd_merge_shorts = [
    "ffmpeg", "-y", "-f", "concat", "-safe", "0",
    "-i", "temp_edit/concat_shorts.txt",
    "-c", "copy",
    "public/shorts_cat_hsinchu_engineer.mp4"
]
subprocess.run(cmd_merge_shorts, check=True)
print(">>> Vertical Shorts rendered successfully: public/shorts_cat_hsinchu_engineer.mp4")

print("All rendering complete!")
