import subprocess
import os

frames = [
    'public/assets/aistudio/touxian_frame2.jpg',
    'public/assets/aistudio/hf_hero_frame3.jpg',
    'public/assets/aistudio/draft_frame5.jpg',
    'public/assets/aistudio/verify_clean_frame8.jpg',
    'public/assets/aistudio/draft_frame5.jpg',
    'public/assets/aistudio/hf_hero_frame3.jpg',
]

output_file = 'public/assets/aistudio/retro_avatar_loop.mp4'

# Create a concat file for ffmpeg or generate with crossfades
# Let's create an mp4 at 25 fps where each frame lasts ~0.6 seconds with smooth minterpolate / tblend
concat_str = ""
for f in frames:
    concat_str += f"file '{os.path.abspath(f)}'\nduration 0.7\n"
concat_str += f"file '{os.path.abspath(frames[-1])}'\n"

with open('public/assets/aistudio/concat_list.txt', 'w') as out:
    out.write(concat_str)

cmd = [
    'ffmpeg', '-y',
    '-f', 'concat', '-safe', '0',
    '-i', 'public/assets/aistudio/concat_list.txt',
    '-vf', 'fps=30,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '22',
    output_file
]

subprocess.run(cmd, check=True)
print("Successfully generated", output_file)
