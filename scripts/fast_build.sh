#!/bin/bash
set -e

echo "=== Fast rendering video clips ==="
ffmpeg -y -loop 1 -t 1.80 -i temp_short_frames/scene1.png -vf "scale=1080:1920,format=yuv420p" -r 30 -c:v libx264 -preset ultrafast temp_short_frames/v1.mp4
ffmpeg -y -loop 1 -t 1.60 -i temp_short_frames/scene2.png -vf "scale=1080:1920,format=yuv420p" -r 30 -c:v libx264 -preset ultrafast temp_short_frames/v2.mp4
ffmpeg -y -loop 1 -t 1.72 -i temp_short_frames/scene3.png -vf "scale=1080:1920,format=yuv420p" -r 30 -c:v libx264 -preset ultrafast temp_short_frames/v3.mp4
ffmpeg -y -loop 1 -t 3.18 -i temp_short_frames/scene4.png -vf "scale=1080:1920,format=yuv420p" -r 30 -c:v libx264 -preset ultrafast temp_short_frames/v4.mp4
ffmpeg -y -loop 1 -t 3.22 -i temp_short_frames/scene5.png -vf "scale=1080:1920,format=yuv420p" -r 30 -c:v libx264 -preset ultrafast temp_short_frames/v5.mp4

cat << 'CONCAT_EOF' > temp_short_frames/concat_list.txt
file 'v1.mp4'
file 'v2.mp4'
file 'v3.mp4'
file 'v4.mp4'
file 'v5.mp4'
CONCAT_EOF

ffmpeg -y -f concat -safe 0 -i temp_short_frames/concat_list.txt -c copy temp_short_frames/video_full.mp4

echo "=== Mixing audio with punchy BGM ==="
# Mix voice with viral bgm: bgm at 0.28 volume, voice with slight boost
ffmpeg -y -i public/assets/aistudio/tts_hr_no.wav -i public/assets/aistudio/tts_announcer_free.wav -i public/audio/viral_shorts_bgm.wav -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1,volume=1.2[voice];[2:a]volume=0.28,atrim=0:11.52[bgm];[voice][bgm]amix=inputs=2:duration=first:dropout_transition=0.5[aout]" -map "[aout]" temp_short_frames/final_audio.wav

FINAL_OUTPUT="public/assets/aistudio/superjobgenie_cover_letter_viral_short.mp4"
ffmpeg -y -i temp_short_frames/video_full.mp4 -i temp_short_frames/final_audio.wav -c:v copy -c:a aac -b:a 192k -shortest "$FINAL_OUTPUT"

echo "=== SUCCESS! ==="
ls -lh "$FINAL_OUTPUT"
ffprobe -i "$FINAL_OUTPUT"
