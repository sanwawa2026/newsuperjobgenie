# SuperJobGenie Listing 重写 · 4.0.8 官方发布版
> **适用位置**：Chrome 开发者后台 (Chrome Web Store Developer Dashboard) → 商店资讯 → 产品详情

---

## 一、标题（Title，≤75 字符）

### 推荐方案 A（最佳｜三个高搜索词全在，55 字符内可见）：
```text
AI Resume Matcher & Cover Letter Generator for ATS - SuperJobGenie
```
*(字符数: 65 / 75)*

**备选方案 B（突出"一键"，更抓眼球）：**
```text
1-Click ATS Resume Score & Tailored Cover Letter - SuperJobGenie
```

**备选方案 C（求职场景直击）：**
```text
Beat ATS: Resume Match Score & Cover Letter Writer - SuperJobGenie
```

> **为什么必须换**：`Deep JD Matcher` 是内部工程叫法，**全世界没有任何求职者会在 Chrome 商店搜索框里搜这个词**。真正有海量搜索意向的是：`resume matcher`、`cover letter generator`、`ats resume`！

---

## 二、短描述（Summary，≤132 字符）

```text
Stop pasting job posts into ChatGPT. One click gives you an ATS match score, skill gaps, and a tailored cover letter.
```
*(字符数: 111 / 132，精准对比 ChatGPT 痛点，转化率最高)*

**备选（强调隐私，更易建立信任）：**
```text
One click on any job post: ATS match score, skill gaps, ready-to-send cover letter. Runs in your browser. Nothing uploaded.
```
*(字符数: 119 / 132)*

---

## 三、详细描述（Detailed Description - 整段直接替换现存文本）

```text
Stop copying job descriptions into ChatGPT and rewriting your resume by hand.

SuperJobGenie is a one-click Chrome extension for job seekers who are tired of fighting ATS filters and writing cover letters from scratch.

Open any job posting, click the genie icon, and get everything you need in seconds — no copy-paste, no character limits, no messy formatting.

★ WHAT YOU GET IN ONE CLICK

• Full Job Description Capture
  Grabs the entire posting — including requirements buried far below the fold — instead of the first few hundred characters ChatGPT pastes in.

• ATS Match Score
  See how well your background actually fits the role, scored against what the posting asks for. Stop guessing whether it's worth applying.

• Skill Gap Roadmap
  A clear list of the skills and keywords you're missing, plus how to close each gap before you hit submit.

• Tailored Cover Letter
  A ready-to-send, four-paragraph letter written for that specific role and company. Executive tone, no generic filler. Edit and send.

• Cross-Role Smart Match
  Your skills often fit roles you'd never think to search for. Smart Match surfaces adjacent openings where your experience is already a strong fit — so your search stops being one narrow lane.

• Culture & Team Signals
  Spot work-pace cues, growth signals, and vague hiring language before you invest an hour in an application.

• Interview Talking Points
  Targeted questions and angles pulled from the posting, so you walk in prepared for what they'll actually ask.

• 100% Local Privacy
  Runs entirely in your browser sandbox. Your resume and candidate profile are never uploaded to any remote server or sold to third parties.

★ WHERE IT WORKS

Global & North America / Europe:
• Indeed (All regions)
• LinkedIn Jobs
• Glassdoor (US, UK, DE, Global)
• ZipRecruiter & Dice
• Major ATS: Greenhouse, Lever, Workday, Wellfound

APAC & Taiwan (繁體中文支持):
• 104 人力銀行 (104.com.tw)
• CakeResume (cakeresume.com)
• 1111 人力銀行 (1111.com.tw)
• JobStreet (SG / MY)

★ HOW TO USE

1. Install SuperJobGenie.
2. Set up your candidate profile once (paste your resume or key skills).
3. Browse job postings on your favorite platform — the genie HUD automatically surfaces your match score, key requirements, and tailored cover letter.

Stop shouting into the void. Take control of your job search with SuperJobGenie!
```

---

## 四、后台分类与隐私声明配置（5分钟搞定）
- **主要类别 (Primary Category)**: `Productivity` (生产力)
- **次要类别 (Secondary Category)**: `Search Tools` (搜索工具)
- **单一用途说明 (Single Purpose)**: 
  > SuperJobGenie analyzes live online job postings to calculate ATS skill fit against candidate qualifications and generates tailored cover letters directly within the browser.
- **权限合理性说明 (Permission Justifications)**:
  - `storage`: Saves user candidate profile and settings locally in chrome.storage.local.
  - `activeTab`: Reads live job description text on supported job boards when opened.
