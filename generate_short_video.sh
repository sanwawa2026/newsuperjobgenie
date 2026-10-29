#!/bin/bash
set -e

# Output file
OUT="public/assets/superjobgenie_short_01.mp4"
AUDIO="public/audio/short_38s_master_mix.wav"

# 5 Scenes:
# 1: card9_video_opener_hud.jpg (3s)
# 2: card1_ats_38.jpg (5s)
# 3: card2_smart_match_97.jpg (6s)
# 4: card3_cover_letter.jpg (5s)
# 5: card4_brand_chrome.jpg (5s)
# Total duration = 24s

ffmpeg -y \
  -loop 1 -t 3 -i public/assets/cards/card9_video_opener_hud.jpg \
  -loop 1 -t 5 -i public/assets/cards/card1_ats_38.jpg \
  -loop 1 -t 6 -i public/assets/cards/card2_smart_match_97.jpg \
  -loop 1 -t 5 -i public/assets/cards/card3_cover_letter.jpg \
  -loop 1 -t 5 -i public/assets/cards/card4_brand_chrome.jpg \
  -i "$AUDIO" \
  -filter_complex "
    [0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0B0F19,setsar=1[v0];
    [1:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0B0F19,setsar=1[v1];
    [2:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0B0F19,setsar=1[v2];
    [3:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0B0F19,setsar=1[v3];
    [4:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0B0F19,setsar=1[v4];
    [v0][v1][v2][v3][v4]concat=n=5:v=1:a=0[vout];
    [5:a]atrim=0:24,afade=t=out:st=23:d=1[aout]
  " \
  -map "[vout]" -map "[aout]" \
  -c:v libx264 -pix_fmt yuv420p -r 30 -b:v 4000k \
  -c:a aac -b:a 192k \
  -shortest \
  "$OUT"

echo "Short video generated successfully at $OUT"
ls -la "$OUT"
