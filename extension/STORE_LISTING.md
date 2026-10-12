# SuperJobGenie — Chrome Web Store Official Submission Package (v2.9.9 Flagship)

> **Ready-to-publish assets, store copy, privacy justification, and 5-minute submission guide for the Google Chrome Web Store Developer Dashboard.**

---

## 1. Product Summary & Developer Console Metadata

*   **Extension Name**: `SuperJobGenie: AI Career Intelligence & Deep JD Matcher`
*   **Short Name**: `SuperJobGenie`
*   **Version**: `2.9.9`
*   **Primary Category**: `Productivity`
*   **Secondary Category**: `Search Tools`
*   **Supported Language**: `English (United States)`
*   **Privacy Policy URL**: `https://ais-dev-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app` (or your custom landing page domain)
*   **Official Website**: `https://ais-dev-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app`

---

## 2. Short Description (Max 132 Characters)
> Uncut 3,000+ char deep JD extractor, 97% AI skill fit scoring, and career pivot discovery across Indeed, LinkedIn, Glassdoor & ATS.

---

## 3. Detailed Store Description (Copy & Paste directly into Web Store Editor)

```markdown
SuperJobGenie is your local-first AI career intelligence copilot for modern job search.

Move faster. Switch tracks.

Stop applying blindly to black-hole job boards. SuperJobGenie injects an industrial-grade, non-intrusive floating HUD directly into your job search workflow on Indeed, LinkedIn, Glassdoor, ZipRecruiter, and major ATS platforms (Greenhouse, Lever, Workday).

🚀 WHY SUPERJOBGENIE?
Most job scrapers choke on modern Single-Page Applications (SPAs) and only capture 150 characters of greeting text, hiding critical technical requirements, tech stacks, and compensation markers. SuperJobGenie bypasses DOM truncation traps, reading the full, uncut 3,000 to 11,000+ character Schema.org JSON-LD and live job descriptions to calculate your exact technical alignment in milliseconds.

✨ CORE SUPERPOWERS

1. ⚡ 3,000+ Character Uncut Deep Extractor
• Automatically extracts complete, unabridged job descriptions from Schema.org microdata, shadow trees, dynamic React containers, and iframes.
• Real-time verified character counter ensures zero truncation loss.

2. 🎯 Requirement-Driven Match Scoring
• Transparent 4-Tier Match Benchmarking (Top Tier 90-100%, Competitive 75-89%, Transferable 60-74%, Cross-Track <60%).
• Strict word-boundary algorithm: Only flags skills that are ACTUALLY required by the employer. Zero hallucinated gaps!

3. 🧭 Smart Career Pivot Discovery (NEW)
• Stuck in a saturated track? Our cross-domain semantic engine maps your foundational engineering and analytical skills to high-demand, high-compensation adjacent industries (AI Infrastructure, DevTools, Quantitative Systems).

4. 🛡️ Real-Time Verified Skills vs. Missing Gaps
• Highlights verified qualifications with instant green checkmarks.
• Identifies genuine skill gaps so you know exactly what to address before applying.

5. 📄 Local Resume Ingestion (Up to 100,000 Chars)
• Ingests complete 15+ year resumes (.pdf, .docx, .txt) with zero truncation.
• Automatic skill detection across 60+ engineering, finance, and healthcare domains.

6. ✉️ 1-Click Executive Application Generator
• Generates tailored 3-Tier Professional or 4-Tier Executive Cover Letters customized directly with live job requirements.
• Direct-to-clipboard export in seconds.

7. 🔒 100% Local-First & Privacy Protected
• Your confidential career history, contact details, and resumes never leave your browser sandbox.
• Zero data selling, zero third-party telemetry tracking, and zero ads. Fully GDPR and CCPA compliant.

💡 SUPPORTED PLATFORMS
• Indeed (US, UK, CA, DE, FR, JP, etc.)
• LinkedIn Jobs
• Glassdoor
• ZipRecruiter & Dice
• Greenhouse ATS, Lever ATS, and Workday ATS
• Wellfound (AngelList Talent)

Transform your job search from shouting into the void into high-probability surgical applications with SuperJobGenie!
```

---

## 4. Single-Purpose Justification (Mandatory for Reviewers)

> *"SuperJobGenie serves a single dedicated purpose: assisting job seekers in analyzing their skill alignment against live online job descriptions directly within job board web pages, providing real-time local skill matching, career pivot discovery, and tailored cover letter generation."*

---

## 5. Permission Justifications (Mandatory for Reviewers)

| Permission | Why It Is Strictly Needed |
| :--- | :--- |
| `storage` | Stores the user's candidate profile, extracted skill preferences, and cached evaluation scores locally on their browser sandbox. |
| `activeTab` | Inspects the currently active job board tab to extract job posting text and render the non-blocking floating HUD when the user visits supported job engines. |
| `host_permissions` | Restricted strictly to supported job board domains (`*.indeed.com`, `*.linkedin.com`, `*.glassdoor.com`, `*.ziprecruiter.com`, ATS platforms) to allow the DOM extractor to read uncut job postings. |

---

## 6. Data Privacy Declarations (Privacy Tab)

*   **Do you collect user data?**: No. All candidate profiles and parsed job details remain in local storage (`chrome.storage.local`).
*   **Personally Identifiable Information**: Stored locally only, never transmitted to external servers.
*   **Authentication Information**: Not collected.
*   **Financial & Payment Information**: Not collected.

---

## 7. 5-Minute Submission Step-by-Step Guide

1.  **Download the Release Zip**:
    *   File location: `public/superjobgenie-v2.9.9-chrome-webstore-release.zip` (43 KB).
    *   Direct URL: `https://<YOUR_APP_URL>/superjobgenie-v2.9.9-chrome-webstore-release.zip`
2.  **Open Chrome Web Store Developer Console**:
    *   Go to: [https://chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole)
    *   Sign in with your Google account (one-time $5 developer registration fee if new).
3.  **Upload the Zip**:
    *   Click **"Add new item"** and drag-and-drop `superjobgenie-v2.9.9-chrome-webstore-release.zip`.
4.  **Fill in Store Listing Details**:
    *   Copy & paste the **Short Description** and **Detailed Description** from Sections 2 & 3 above.
    *   Upload Store Icon: `extension/icons/icon128.png`.
    *   Upload Screenshots (1280x800 or 640x400): Use screenshots of the Indeed HUD showcase and Radar.
    *   Add your YouTube promo video link if desired!
5.  **Submit for Review**:
    *   Fill in the Privacy tab using the declarations in Section 6.
    *   Click **"Submit for review"**. Standard approval typically takes 24–48 hours.
