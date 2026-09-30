# SuperJobGenie — Chrome Web Store Listing Package

> **Ready-to-publish assets, copy, and configuration for Google Chrome Web Store Developer Console.**

---

## 1. Product Summary & Metadata

- **Extension Name**: `SuperJobGenie: AI Career & Job Fit Copilot`
- **Short Name**: `SuperJobGenie`
- **Version**: `2.9.2`
- **Primary Category**: `Productivity`
- **Secondary Category**: `Search Tools`
- **Supported Languages**: `English (United States)`
- **Website URL**: `https://ais-dev-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app`

---

## 2. Short Description (Max 132 characters)
> Instant 3,000+ char deep JD extractor & AI skill fit analyzer on Indeed, LinkedIn, and Glassdoor. Zero spam, 100% private.

---

## 3. Detailed Store Description (Formatted for Web Store Markdown)

```markdown
SuperJobGenie is your real-time AI career intelligence copilot for Western job markets. 

Stop applying blindly to black-hole job postings. SuperJobGenie injects an industrial-grade, non-intrusive floating HUD directly into your job search workflow on Indeed, LinkedIn, Glassdoor, ZipRecruiter, and major ATS platforms (Greenhouse, Lever, Workday).

🚀 WHY SUPERJOBGENIE?
Most job board aggregators truncate job descriptions to 150 characters, hiding essential qualifications, stack requirements, and salary markers. SuperJobGenie bypasses DOM truncation traps, reading the full, uncut 3,000+ character Schema.org JSON-LD and live job descriptions to score your exact technical alignment in real time.

✨ CORE FEATURES

1. ⚡ 3,000+ Character Uncut Deep Extractor
• Automatically extracts complete, unabridged job descriptions from Schema.org microdata, shadow trees, dynamic React containers, and iframes.
• Live verified character counter ensures you never miss hidden requirements.

2. 🎯 Requirement-Driven Match Scoring
• Transparent 4-Tier Match Benchmarking (Top Tier 90-100%, Competitive 75-89%, Transferable 60-74%, Cross-Track <60%).
• Strict word-boundary algorithm: Only flags skills that are ACTUALLY required by the job posting. No hallucinated gaps!

3. 🛡️ Real-Time Verified Skills vs. Missing Gaps
• Instantly highlights your verified qualifications in green.
• Accurately flags missing technical or domain gaps in yellow, so you know exactly what to tailor before clicking apply.

4. 📄 In-HUD Full Resume Ingestion (Up to 100,000 Chars)
• Upload or paste your complete 15+ year resume (.pdf, .docx, .txt, .json).
• Zero truncation: Full work experience bullet points and system architecture details are 100% preserved.
• Automatic skill detection across 60+ engineering & finance domains (Java, Python, C++, Go, Kubernetes, AWS, High Concurrency, Financial Modeling, GAAP, etc.).

5. ✉️ 1-Click Executive Application Generator
• Generate instant 3-Tier Professional or 4-Tier Executive Cover Letters tailored specifically to the live job you are viewing.
• Copy directly to clipboard with a single tap.

6. 🔒 100% Client-Side Privacy (Zero Data Selling)
• All resume data and job evaluations remain exclusively on your local device via Chrome's sandboxed storage.
• No telemetry, no third-party tracking, and zero ads.

💡 SUPPORTED PLATFORMS
• Indeed (US, UK, CA, DE, FR, JP, etc.)
• LinkedIn Jobs
• Glassdoor
• ZipRecruiter & Dice
• Greenhouse ATS, Lever ATS, and Workday ATS
• Wellfound (AngelList Talent)

Transform your job search from a numbers game into high-probability surgical applications with SuperJobGenie!
```

---

## 4. Single-Purpose Justification (For Chrome Reviewer)
> *"SuperJobGenie serves a single, dedicated purpose: helping job seekers analyze their qualifications against live online job descriptions directly within job board web pages, providing real-time skill alignment and application preparation assistance."*

---

## 5. Permission Justifications

| Permission | Why It Is Strictly Needed |
| :--- | :--- |
| `storage` | Stores the user's candidate profile and evaluated job cached data locally on their browser. |
| `activeTab` | Inspects the currently active job tab to extract job posting text and display the non-blocking HUD. |
| `host_permissions` | Restricted specifically to supported job search domains (e.g., `*.indeed.com`, `*.linkedin.com`, `*.greenhouse.io`, etc.) to run the in-page extractor. |

---

## 6. Chrome Web Store Graphic Assets Checklist

1. **Store Icon**: `128 x 128` PNG (provided in `/extension/icons/icon128.png`)
2. **Screenshots (Minimum 1, Recommended 4-5)**:
   - Dimensions: `1280 x 800` or `640 x 400` PNG/JPEG.
   - Screenshot 1: *SuperJobGenie HUD active on an Indeed job with 95% Match Score & Verified Skills*.
   - Screenshot 2: *Candidate Profile & Full Resume Ingestion panel with zero truncation*.
   - Screenshot 3: *Skill Gaps detection & real-time character extraction counter*.
   - Screenshot 4: *1-Click Tailored Cover Letter Generator*.
3. **Small Promo Tile (Optional)**: `440 x 280` PNG
4. **Marquee Promo Tile (Optional)**: `1400 x 560` PNG
