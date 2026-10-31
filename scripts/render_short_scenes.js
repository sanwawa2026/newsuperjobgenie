import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const OUT_DIR = 'temp_short_frames';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Helper to escape XML
function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Generate SVG scenes
function generateScenes() {
  // Scene 1: Looking for a job? (0 - 1.8s)
  const svg1 = `
  <svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg1" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#141e33" />
        <stop offset="100%" stop-color="#07090e" />
      </radialGradient>
      <filter id="glow1" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="15" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <rect width="1080" height="1920" fill="url(#bg1)" />
    
    <!-- Cyber Grid Lines -->
    <path d="M 0 300 L 1080 300 M 0 600 L 1080 600 M 0 1300 L 1080 1300 M 0 1600 L 1080 1600" stroke="#1e293b" stroke-width="2" opacity="0.4" />
    <path d="M 270 0 L 270 1920 M 540 0 L 540 1920 M 810 0 L 810 1920" stroke="#1e293b" stroke-width="2" opacity="0.3" />

    <!-- Top Badge -->
    <rect x="340" y="320" width="400" height="60" rx="30" fill="#1e293b" stroke="#38bdf8" stroke-width="3" />
    <text x="540" y="360" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" font-size="28" fill="#38bdf8" text-anchor="middle">💼 2026 JOB MARKET</text>

    <!-- Main Typography -->
    <g transform="translate(540, 780)" text-anchor="middle">
      <text y="0" font-family="Liberation Sans, Arial, sans-serif" font-weight="900" font-size="125" fill="#FFFFFF" letter-spacing="4">LOOKING</text>
      <text y="140" font-family="Liberation Sans, Arial, sans-serif" font-weight="900" font-size="125" fill="#FFFFFF" letter-spacing="4">FOR A</text>
      <text y="300" font-family="Liberation Sans, Arial, sans-serif" font-weight="900" font-size="145" fill="#FACC15" filter="url(#glow1)" letter-spacing="4">JOB? 💼</text>
    </g>

    <!-- Bottom Pulse Indicator -->
    <rect x="290" y="1450" width="500" height="90" rx="45" fill="#0f172a" stroke="#64748b" stroke-width="2" />
    <text x="540" y="1505" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" font-size="34" fill="#94a3b8" text-anchor="middle">⚡ STOP GETTING GHOSTED</text>
  </svg>`;

  // Scene 2: Another generic cover letter? (1.8s - 3.4s)
  const svg2 = `
  <svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg2" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#241426" />
        <stop offset="100%" stop-color="#09050b" />
      </radialGradient>
      <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="15" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <rect width="1080" height="1920" fill="url(#bg2)" />

    <!-- Top Badge -->
    <rect x="310" y="320" width="460" height="60" rx="30" fill="#2d132c" stroke="#f43f5e" stroke-width="3" />
    <text x="540" y="360" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" font-size="28" fill="#fb7185" text-anchor="middle">⚠️ THE #1 APPLICATION TRAP</text>

    <!-- Main Typography -->
    <g transform="translate(540, 750)" text-anchor="middle">
      <text y="0" font-family="Liberation Sans, Arial, sans-serif" font-weight="900" font-size="110" fill="#FFFFFF" letter-spacing="3">ANOTHER</text>
      <text y="130" font-family="Liberation Sans, Arial, sans-serif" font-weight="900" font-size="120" fill="#FB7185" filter="url(#glow2)" letter-spacing="3">GENERIC</text>
      <text y="260" font-family="Liberation Sans, Arial, sans-serif" font-weight="900" font-size="95" fill="#FFFFFF" letter-spacing="3">COVER</text>
      <text y="390" font-family="Liberation Sans, Arial, sans-serif" font-weight="900" font-size="110" fill="#FFFFFF" letter-spacing="3">LETTER? 📝</text>
    </g>

    <!-- Sub warning -->
    <rect x="240" y="1450" width="600" height="90" rx="45" fill="#1f0a1c" stroke="#f43f5e" stroke-width="2" />
    <text x="540" y="1505" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" font-size="32" fill="#fda4af" text-anchor="middle">❌ ChatGPT templates get detected in 2s</text>
  </svg>`;

  // Scene 3: HR saying NO! NO! (3.4s - 5.12s)
  const svg3 = `
  <svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg3" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#450a0a" />
        <stop offset="100%" stop-color="#140202" />
      </radialGradient>
      <filter id="glow3" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="25" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <rect width="1080" height="1920" fill="url(#bg3)" />

    <!-- Danger Border Frame -->
    <rect x="40" y="40" width="1000" height="1840" rx="40" fill="none" stroke="#ef4444" stroke-width="8" stroke-dasharray="30 15" opacity="0.8" />

    <!-- Top Badge -->
    <rect x="320" y="280" width="440" height="70" rx="35" fill="#7f1d1d" stroke="#f87171" stroke-width="3" />
    <text x="540" y="327" font-family="Liberation Sans, Arial, sans-serif" font-weight="900" font-size="32" fill="#fef2f2" text-anchor="middle">🚨 RECRUITER VERDICT 🚨</text>

    <!-- Main EXPLOSIVE NO! NO! -->
    <g transform="translate(540, 780)" text-anchor="middle">
      <text y="0" font-family="Liberation Sans, Arial, sans-serif" font-weight="900" font-size="190" fill="#EF4444" filter="url(#glow3)" letter-spacing="8">NO! NO! ❌</text>
      <text y="140" font-family="Liberation Sans, Arial, sans-serif" font-weight="900" font-size="80" fill="#FFFFFF" letter-spacing="3">AUTO-REJECTED</text>
    </g>

    <!-- Reasons why HR says NO -->
    <g transform="translate(540, 1150)" text-anchor="middle">
      <rect x="-380" y="0" width="760" height="80" rx="40" fill="#450a0a" stroke="#ef4444" stroke-width="2" />
      <text y="50" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" font-size="32" fill="#fca5a5">🚫 0 Customization to Job Description</text>

      <rect x="-380" y="110" width="760" height="80" rx="40" fill="#450a0a" stroke="#ef4444" stroke-width="2" />
      <text y="160" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" font-size="32" fill="#fca5a5">🚫 Missing Critical ATS Keywords</text>
    </g>

    <text x="540" y="1600" font-family="Liberation Sans, Arial, sans-serif" font-weight="900" font-size="44" fill="#F87171" text-anchor="middle">75% OF RESUMES GO TO THE TRASH</text>
  </svg>`;

  // Scene 4: SuperJobGenie Solution (5.12s - 8.3s)
  const svg4 = `
  <svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg4" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#0c2540" />
        <stop offset="100%" stop-color="#040812" />
      </radialGradient>
      <filter id="glow4" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="20" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <rect width="1080" height="1920" fill="url(#bg4)" />

    <!-- Top Glow Header -->
    <g transform="translate(540, 140)" text-anchor="middle">
      <rect x="-320" y="0" width="640" height="56" rx="28" fill="#0f2b48" stroke="#38bdf8" stroke-width="2" />
      <text y="38" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" font-size="26" fill="#38bdf8">⚡ THE SECRET TO 100% REPLIES ⚡</text>

      <text y="130" font-family="Liberation Sans, Arial, sans-serif" font-weight="900" font-size="82" fill="#38BDF8" filter="url(#glow4)" letter-spacing="3">SuperJobGenie</text>
      <text y="195" font-family="Liberation Sans, Arial, sans-serif" font-weight="900" font-size="44" fill="#FACC15" letter-spacing="2">TAILORED IN 3 SECONDS ⚡</text>
    </g>

    <!-- Bottom Highlights -->
    <g transform="translate(540, 1720)" text-anchor="middle">
      <rect x="-420" y="0" width="840" height="90" rx="45" fill="#0c1e33" stroke="#00f2fe" stroke-width="3" />
      <text y="58" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" font-size="36" fill="#38bdf8">🚀 Scans Live JD &amp; Matches Real ATS Keys</text>
    </g>
  </svg>`;

  // Scene 5: 100% FREE! (8.3s - 11.51s)
  const svg5 = `
  <svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg5" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#1e1b4b" />
        <stop offset="100%" stop-color="#09071c" />
      </radialGradient>
      <filter id="goldglow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="25" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <rect width="1080" height="1920" fill="url(#bg5)" />

    <!-- Top Badge -->
    <rect x="250" y="240" width="580" height="60" rx="30" fill="#2e1065" stroke="#a855f7" stroke-width="2" />
    <text x="540" y="280" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" font-size="28" fill="#d8b4fe" text-anchor="middle">🚫 STOP PAYING $40/MO FOR AI TOOLS</text>

    <!-- Brand & 100% FREE -->
    <g transform="translate(540, 620)" text-anchor="middle">
      <text y="0" font-family="Liberation Sans, Arial, sans-serif" font-weight="900" font-size="90" fill="#FFFFFF" letter-spacing="3">SuperJobGenie</text>
      
      <!-- GIANT 100% FREE -->
      <text y="190" font-family="Liberation Sans, Arial, sans-serif" font-weight="900" font-size="160" fill="#F59E0B" filter="url(#goldglow)" letter-spacing="6">100% FREE! 🔥</text>
      <text y="280" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" font-size="44" fill="#38BDF8">NO SUBSCRIPTION • NO CATCH</text>
    </g>

    <!-- Feature Checklist -->
    <g transform="translate(540, 1080)" text-anchor="middle">
      <rect x="-380" y="0" width="760" height="80" rx="40" fill="#1e1b4b" stroke="#4ade80" stroke-width="2" />
      <text y="52" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" font-size="34" fill="#4ade80">✅ 0-Install Instant Web Matcher</text>

      <rect x="-380" y="110" width="760" height="80" rx="40" fill="#1e1b4b" stroke="#38bdf8" stroke-width="2" />
      <text y="162" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" font-size="34" fill="#38bdf8">✅ Official Chrome Store Extension</text>

      <rect x="-380" y="220" width="760" height="80" rx="40" fill="#1e1b4b" stroke="#facc15" stroke-width="2" />
      <text y="272" font-family="Liberation Sans, Arial, sans-serif" font-weight="bold" font-size="34" fill="#facc15">✅ 1-Click Cover Letter Generator</text>
    </g>

    <!-- Big Action Button CTA -->
    <g transform="translate(540, 1600)" text-anchor="middle">
      <rect x="-420" y="0" width="840" height="110" rx="55" fill="#0284c7" stroke="#38bdf8" stroke-width="4" filter="url(#goldglow)" />
      <text y="70" font-family="Liberation Sans, Arial, sans-serif" font-weight="900" font-size="44" fill="#FFFFFF">👇 LINK IN PINNED COMMENT 👇</text>
    </g>
  </svg>`;

  fs.writeFileSync(`${OUT_DIR}/scene1.svg`, svg1);
  fs.writeFileSync(`${OUT_DIR}/scene2.svg`, svg2);
  fs.writeFileSync(`${OUT_DIR}/scene3.svg`, svg3);
  fs.writeFileSync(`${OUT_DIR}/scene4_bg.svg`, svg4);
  fs.writeFileSync(`${OUT_DIR}/scene5.svg`, svg5);
  console.log('SVG scenes written to', OUT_DIR);
}

generateScenes();
