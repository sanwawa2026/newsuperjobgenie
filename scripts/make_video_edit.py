import subprocess
import os

cat_vid = "public/assets/aistudio/30252242_133103250869431_4153680661716140032_n__1__dd2499ed.mp4"
obs_vid = "public/assets/aistudio/20261029______b1290dce.mp4"

os.makedirs("temp_edit", exist_ok=True)

# 1. Extract Cat Hook: Mia saying "噢~好餓喔~" (00:22.5 to 00:30.0 -> 7.5s)
cmd1 = [
    "ffmpeg", "-y", "-ss", "00:00:22.5", "-to", "00:00:30.0",
    "-i", cat_vid,
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/cat_hook.mp4"
]
subprocess.run(cmd1, check=True)

# 2. Extract Cat Action: "不如朕親自動手啦" (00:59.0 to 01:07.5 -> 8.5s)
cmd2 = [
    "ffmpeg", "-y", "-ss", "00:00:59.0", "-to", "00:01:07.5",
    "-i", cat_vid,
    "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k",
    "temp_edit/cat_action.mp4"
]
subprocess.run(cmd2, check=True)

# 3. Extract OBS Screen Cruise: Indeed Hsinchu Software Engineer (00:00 to 00:32, speed up 1.35x -> ~23s)
cmd3 = [
    "ffmpeg", "-y", "-ss", "00:00:00.0", "-to", "00:00:32.0",
    "-i", obs_vid,
    "-filter_complex", "[0:v]setpts=0.74*PTS[v]",
    "-map", "[v]",
    "-c:v", "libx264",
    "temp_edit/obs_cruise.mp4"
]
subprocess.run(cmd3, check=True)

# 4. Extract OBS Numbers Sheet (01:05.0 to 01:22.0 -> 17s)
cmd4 = [
    "ffmpeg", "-y", "-ss", "00:01:05.0", "-to", "00:01:22.0",
    "-i", obs_vid,
    "-c:v", "libx264",
    "temp_edit/obs_sheet.mp4"
]
subprocess.run(cmd4, check=True)

print("All raw clips extracted successfully!")
