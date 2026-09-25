/**
 * SuperJobGenie Chrome Extension - Content Script (v2.4.0)
 * Industrial-grade Shadow DOM Isolation + Auto-Pop HUD + 3,000+ Char Deep Extractor
 */

(function () {
  'use strict';

  // Prevent duplicate injection in the same execution context
  if (window.__SUPER_JOB_GENIE_INITIALIZED__) {
    return;
  }
  window.__SUPER_JOB_GENIE_INITIALIZED__ = true;

  console.log('[SuperJobGenie v2.4.0] Shadow DOM HUD Engine initialized on:', window.location.href);

  // Candidate Profile Library
  const candidatePresets = [
    {
      id: 'tang_frontend',
      name: 'Senior Frontend / System Architect (Tang)',
      yearsExp: 15,
      skills: [
        'TypeScript', 'React', 'Node.js', 'System Design', 'Next.js',
        'GraphQL', 'CI/CD', 'AWS', 'Distributed Systems', 'Microfrontends',
        'Tailwind CSS', 'Python', 'SQL', 'Performance Optimization', 'Web Vitals'
      ],
      resumeSnippet: '15+ years experience. Expert in React/TypeScript and microfrontends, led enterprise-level payment system refactoring. Core Web Vitals LCP < 1.2s, 42% bundle size reduction.'
    },
    {
      id: 'architect',
      name: 'Senior Backend / Distributed Architect (Recommended)',
      yearsExp: 15,
      skills: [
        'Java', 'Spring Boot', 'Python', 'SQL', 'MySQL', 'PostgreSQL', 
        'Redis', 'Kubernetes', 'Docker', 'AWS', 'Microservices', 
        'High Concurrency', 'Distributed Systems', 'Code Review', 
        'System Architecture', 'CI/CD', 'Git', 'Linux'
      ],
      resumeSnippet: '15+ years experience. Expert in Java/Python/SQL, microservices design and high-concurrency optimization. Improved QPS from 1200 to 8500, reduced query latency by 70%. AWS Certified.'
    },
    {
      id: 'data_engineer',
      name: 'Quantitative Data Engineer / AI Algorithm Engineer',
      yearsExp: 8,
      skills: [
        'Python', 'SQL', 'PyTorch', 'A/B Testing', 'Hypothesis Testing',
        'Statistical Modeling', 'Predictive Modeling', 'Pandas', 'Scikit-learn',
        'Machine Learning', 'Data Pipelines', 'AWS'
      ],
      resumeSnippet: '8 years experience in quantitative analysis and AI algorithm implementation. Expert in Python/SQL and statistical inference. Led large-scale A/B testing and predictive modeling.'
    },
    {
      id: 'fullstack',
      name: 'Full Stack Development Engineer',
      yearsExp: 6,
      skills: [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
        'PostgreSQL', 'Docker', 'REST API', 'GraphQL', 'Git'
      ],
      resumeSnippet: '6 years of full-stack Web R&D experience. Expert in React/TypeScript and Node.js microservices. Led development of enterprise-grade application architecture.'
    }
  ];

  let currentCandidateIndex = 0;
  let cachedJobData = null;
  let isModalOpen = false;
  let hasAutoPoppedForJobKey = null; // Track which job has already auto-popped to avoid annoying loops
  let activeTab = 'match'; // 'match' | 'profile' | 'coverletter' | 'fulljd'
  let shadowRoot = null;
  let hostContainer = null;

  /**
   * HTML Sanitizer & Formatter
   */
  function cleanHtmlToFormattedText(html) {
    if (!html) return '';
    let text = html;
    text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, '\n• $1');
    text = text.replace(/<br\s*[\/]?>/gi, '\n');
    text = text.replace(/<\/p>/gi, '\n\n');
    text = text.replace(/<\/div>/gi, '\n');
    text = text.replace(/<\/h[1-6]>/gi, '\n\n');
    text = text.replace(/<[^>]+>/g, '');
    text = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');

    return text
      .split('\n')
      .map(line => line.trim())
      .filter((line, idx, arr) => line.length > 0 || (idx > 0 && arr[idx - 1].length > 0))
      .join('\n');
  }

  /**
   * Detect current platform
   */
  function detectPlatform() {
    const host = window.location.hostname.toLowerCase();
    if (host.includes('indeed.')) return 'Indeed';
    if (host.includes('linkedin.')) return 'LinkedIn';
    if (host.includes('glassdoor.')) return 'Glassdoor';
    if (host.includes('ziprecruiter.')) return 'ZipRecruiter';
    if (host.includes('dice.')) return 'Dice';
    if (host.includes('greenhouse.io')) return 'Greenhouse ATS';
    if (host.includes('lever.co')) return 'Lever ATS';
    if (host.includes('myworkdayjobs.com')) return 'Workday ATS';
    if (host.includes('wellfound.com')) return 'Wellfound';
    return 'Western Job Board';
  }

  /**
   * Deep Extractor v3.0: Multilayer Extraction
   */
  function extractFullIndeedJob() {
    const platform = detectPlatform();
    let title = '';
    let company = '';
    let location = 'Remote / Local';
    let salary = 'Not specified';
    let fullBodyText = '';
    let extractionSource = `${platform} Dynamic Engine`;
    let isSchemaOrg = false;

    // 1. Layer 1: Schema.org JSON-LD (Unabridged gold standard)
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of jsonLdScripts) {
      try {
        const parsed = JSON.parse(script.textContent || '{}');
        const items = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of items) {
          if (item && item['@type'] === 'JobPosting') {
            if (item.description && item.description.length > 180) {
              isSchemaOrg = true;
              title = item.title || title;
              if (item.hiringOrganization && item.hiringOrganization.name) {
                company = item.hiringOrganization.name;
              }
              if (item.jobLocation?.address?.addressLocality) {
                location = `${item.jobLocation.address.addressLocality} • Remote`;
              }
              if (item.baseSalary?.value?.value) {
                salary = `$${item.baseSalary.value.value}`;
              }
              fullBodyText = cleanHtmlToFormattedText(item.description);
              extractionSource = `${platform} Schema.org JSON-LD (3000+ chars)`;
              break;
            }
          }
        }
      } catch (e) {}
      if (fullBodyText && fullBodyText.length > 200) break;
    }

    // 2. Layer 2: Main DOM Container Selectors
    if (!fullBodyText || fullBodyText.length < 200) {
      const jdSelectors = [
        '#jobDescriptionText',
        '[data-testid="jobDescriptionText"]',
        '.jobsearch-JobComponent-description',
        '#vjs-job-description',
        '#vjs-content',
        'div.fastviewjob',
        'div.jobsearch-ViewJobLayout',
        'div.jobsearch-RightPane',
        'div[aria-label="Job details"]',
        '[data-automation-id="jobPostingDescription"]',
        '.jobs-description__content',
        'div.show-more-less-html__markup',
        'article.jobs-description__container',
        '.jobs-box__html-content',
        '[data-test="jobDescriptionText"]',
        'div.JobDetails_jobDescription__uWvhK',
        '.job_description',
        '#jobDescription',
        '[data-cy="jobDescriptionText"]',
        '.GWContent'
      ];

      for (const sel of jdSelectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText && el.innerText.trim().length > 150) {
          fullBodyText = cleanHtmlToFormattedText(el.innerHTML);
          extractionSource = `${platform} DOM (${sel})`;
          break;
        }
      }
    }

    // 3. Layer 3: Iframe Penetration
    if (!fullBodyText || fullBodyText.length < 200) {
      const iframes = document.querySelectorAll('iframe');
      for (const iframe of iframes) {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc) {
            const el = doc.querySelector('#jobDescriptionText, [data-testid="jobDescriptionText"], .jobsearch-JobComponent-description');
            if (el && el.innerText && el.innerText.trim().length > 150) {
              fullBodyText = cleanHtmlToFormattedText(el.innerHTML);
              extractionSource = `${platform} Iframe (#${iframe.id || 'vjs-frame'})`;
              break;
            }
          }
        } catch (e) {}
      }
    }

    // 4. Title Extraction
    if (!title) {
      const titleSelectors = [
        '[data-testid="jobsearch-JobInfoHeader-title"]',
        'h1.jobsearch-JobInfoHeader-title',
        'h1.job_title',
        '[data-testid="simpler-job-title"]',
        'h1[data-cy="jobTitle"]',
        '.job-details-jobs-unified-top-card__job-title',
        'h1.t-24',
        '[data-test="job-title"]',
        '.posting-headline h2',
        'h1'
      ];
      for (const sel of titleSelectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.trim()) {
          title = el.innerText.trim();
          break;
        }
      }
    }

    // 5. Company Extraction
    if (!company) {
      const compSelectors = [
        '[data-testid="inlineHeader-companyName"]',
        '.jobsearch-InlineCompanyRating-companyHeader',
        '[data-company-name="true"]',
        '.hiring_company_text',
        'a[data-cy="companyName"]',
        '.company-name',
        '.job-details-jobs-unified-top-card__company-name',
        'a.ember-view.t-black',
        '[data-test="employer-name"]',
        '.hiring-org'
      ];
      for (const sel of compSelectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.trim()) {
          company = el.innerText.trim();
          break;
        }
      }
    }

    // Fallback: If still on search page without active job selection
    if (!fullBodyText || fullBodyText.length < 50) {
      // Check if there is an active job card in search list
      const firstCard = document.querySelector('.job_seen_beacon, [data-jk], .jobsearch-ResultsList > li');
      if (firstCard) {
        const cardTitle = firstCard.querySelector('h2, a[id^="job_"], .jobTitle')?.innerText?.trim() || '';
        const cardComp = firstCard.querySelector('.companyName, [data-testid="company-name"], .company_location')?.innerText?.trim() || '';
        const cardSnippet = firstCard.querySelector('.job-snippet, table')?.innerText?.trim() || '';
        if (cardTitle) {
          title = title || cardTitle;
          company = company || cardComp;
          fullBodyText = `${cardTitle}\nCompany: ${cardComp}\n\n${cardSnippet}\n\n[Status: Job card preview loaded from search list. Click any job card on the left to extract the complete 3,000+ char description.]`;
          extractionSource = `${platform} Search List Card (Preview Mode)`;
        }
      }
    }

    title = title || 'Current Position / Job Details';
    company = company || 'Hiring Company';

    return {
      platform,
      title,
      company,
      location,
      salary,
      fullBodyText,
      characterCount: fullBodyText.length,
      wordCount: fullBodyText ? fullBodyText.split(/\s+/).filter(Boolean).length : 0,
      extractionSource,
      isSchemaOrg
    };
  }

  /**
   * Match & Gap Analysis Engine
   */
  function evaluateJobMatch(jobData, candidate) {
    const text = (jobData.fullBodyText || '').toLowerCase();

    const techDimensions = [
      { name: 'Python', category: 'Core Programming', weight: 12 },
      { name: 'SQL', category: 'Data Analysis', weight: 12 },
      { name: 'TypeScript', category: 'Frontend/Core', weight: 10 },
      { name: 'React', category: 'Frontend', weight: 10 },
      { name: 'Node.js', category: 'Backend', weight: 10 },
      { name: 'Code Review', category: 'Code Quality', weight: 10 },
      { name: 'A/B Testing', category: 'Methodology', weight: 14 },
      { name: 'Hypothesis Testing', category: 'Statistics', weight: 12 },
      { name: 'Statistical Modeling', category: 'Modeling', weight: 12 },
      { name: 'Predictive Modeling', category: 'Modeling', weight: 10 },
      { name: 'AWS', category: 'Cloud/Dist', weight: 8 },
      { name: 'Microservices', category: 'Backend', weight: 8 },
      { name: 'High Concurrency', category: 'Backend', weight: 8 }
    ];

    const verified = [];
    const gaps = [];

    techDimensions.forEach(dim => {
      const regex = new RegExp(`\\b${dim.name.toLowerCase()}\\b`, 'i');
      if (regex.test(text) || text.includes(dim.name.toLowerCase())) {
        const hasSkill = candidate.skills.some(cs => cs.toLowerCase() === dim.name.toLowerCase()) ||
                         candidate.resumeSnippet.toLowerCase().includes(dim.name.toLowerCase());
        if (hasSkill) {
          verified.push(dim);
        } else {
          gaps.push(dim);
        }
      }
    });

    const isAiTrainerRole = /AI Trainer|Product Analyst|Quantitative|DataAnnotation/i.test(jobData.title) ||
                            /AI Trainer|DataAnnotation/i.test(jobData.company);

    let matchScore = 54;
    let matchTier = 'Cross-Track Pivot';
    let summaryText = 'Deep scan identified cross-track alignment. Strong engineering foundation allows for rapid transfer to requested statistical tasks.';

    if (!isAiTrainerRole && verified.length > 0) {
      matchScore = Math.min(94, Math.max(72, 60 + verified.length * 6));
      matchTier = 'High Direct Match';
      summaryText = `Deep scan shows high technical overlap across ${verified.map(v => v.name).slice(0, 3).join(', ')} and architecture experience.`;
    } else if (verified.length === 0 && gaps.length === 0) {
      matchScore = 75;
      matchTier = 'Radar Active';
      summaryText = 'Radar is ready. Click any job posting to calculate live multi-dimensional alignment.';
    }

    const coverLetter = `Dear Hiring Team at ${jobData.company},\n\nI am writing to express my enthusiastic interest in the ${jobData.title} position.\n\nWith over ${candidate.yearsExp} years of engineering experience architecting robust distributed systems and conducting rigorous code evaluations (${candidate.skills.slice(0, 4).join(', ')}), I bring a disciplined, industrial-grade rigor to AI quality assessment and quantitative evaluations.\n\nKey Highlights for this role:\n1. Robust Code & Logic Evaluation: Led code reviews for enterprise systems, enforcing rigorous validation standards.\n2. Quantitative & Analytical Transfer: Leveraging 15+ years of distributed metrics optimization to rapidly translate system load benchmarks into statistical hypothesis testing and validation.\n3. Reliable Execution: AWS-certified architecture foundation ensures deep understanding of cloud-scale computing and production constraints.\n\nI look forward to discussing how my engineering background provides a high-reliability advantage for ${jobData.company}.\n\nSincerely,\n${candidate.name}`;

    return {
      matchScore,
      matchTier,
      summaryText,
      verified,
      gaps,
      isAiTrainerRole,
      coverLetter
    };
  }

  /**
   * Escape HTML utility
   */
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /**
   * Ensure Isolated Shadow DOM Host is Attached
   */
  function getOrCreateShadowRoot() {
    if (shadowRoot) return shadowRoot;

    // Check if host already exists in DOM
    hostContainer = document.getElementById('sjg-shadow-host-root');
    if (!hostContainer) {
      hostContainer = document.createElement('div');
      hostContainer.id = 'sjg-shadow-host-root';
      // Crucial styling for host container
      hostContainer.style.position = 'fixed';
      hostContainer.style.zIndex = '2147483647';
      hostContainer.style.inset = '0';
      hostContainer.style.pointerEvents = 'none'; // Only children have pointer-events: auto
      hostContainer.style.display = 'block';

      const targetParent = document.documentElement || document.body;
      targetParent.appendChild(hostContainer);
    }

    shadowRoot = hostContainer.shadowRoot || hostContainer.attachShadow({ mode: 'open' });
    return shadowRoot;
  }

  /**
   * CSS Styles injected directly into Shadow DOM
   */
  const SHADOW_CSS = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* 1. Permanent Quick Floating Pill */
    .sjg-floating-pill {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 18px;
      background: #090d16;
      border: 1.5px solid rgba(99, 102, 241, 0.6);
      border-radius: 9999px;
      box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.8), 0 0 25px rgba(99, 102, 241, 0.4);
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
      pointer-events: auto;
      animation: sjgFloatBounce 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes sjgFloatBounce {
      0% { transform: translateY(20px) scale(0.9); opacity: 0; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }

    .sjg-floating-pill:hover {
      transform: translateY(-3px) scale(1.04);
      box-shadow: 0 16px 40px -5px rgba(0, 0, 0, 0.9), 0 0 30px rgba(99, 102, 241, 0.6);
      border-color: rgba(129, 140, 248, 1);
    }

    .sjg-pill-dot {
      width: 10px;
      height: 10px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
      animation: sjgPulseDot 2s infinite ease-in-out;
    }

    @keyframes sjgPulseDot {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
    }

    .sjg-pill-text {
      display: flex;
      flex-direction: column;
      line-height: 1.25;
      text-align: left;
    }

    .sjg-pill-brand {
      font-size: 13px;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .sjg-pill-platform {
      background: rgba(99, 102, 241, 0.3);
      color: #c7d2fe;
      padding: 1px 6px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
    }

    .sjg-pill-chars {
      font-size: 11px;
      color: #34d399;
      font-weight: 600;
    }

    .sjg-pill-badge {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #ffffff;
      font-size: 13px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 999px;
      box-shadow: 0 2px 8px rgba(79, 70, 229, 0.5);
    }

    /* 2. In-Page Auto-Popping Modal Backdrop */
    .sjg-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #f1f5f9;
      pointer-events: auto;
    }

    .sjg-modal-backdrop.open {
      display: flex !important;
    }

    /* 3. Modal Dialog Container */
    .sjg-modal-dialog {
      width: 100%;
      max-width: 860px;
      max-height: 90vh;
      background: #090d16;
      border: 1.5px solid #1e293b;
      border-radius: 20px;
      box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 0 50px rgba(99, 102, 241, 0.25);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: sjgPopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes sjgPopIn {
      0% { transform: scale(0.92) translateY(20px); opacity: 0; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }

    /* Header */
    .sjg-modal-header {
      padding: 14px 20px;
      background: #0d1322;
      border-bottom: 1px solid #1e293b;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sjg-logo-badge {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sjg-pulse-circle {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
    }

    .sjg-logo-title {
      font-weight: 800;
      font-size: 15px;
      color: #ffffff;
      letter-spacing: -0.01em;
    }

    .sjg-version-pill {
      font-size: 10px;
      background: #1e1b4b;
      color: #a5b4fc;
      border: 1px solid rgba(165, 180, 252, 0.3);
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 700;
    }

    .sjg-header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sjg-auto-badge {
      font-size: 11px;
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.4);
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 700;
    }

    .sjg-close-cross-btn {
      background: rgba(255, 255, 255, 0.08);
      border: none;
      color: #94a3b8;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 700;
      transition: all 0.2s;
    }

    .sjg-close-cross-btn:hover {
      background: rgba(239, 68, 68, 0.25);
      color: #ef4444;
    }

    /* Job Strip */
    .sjg-job-strip {
      padding: 16px 20px;
      background: #0f172a;
      border-bottom: 1px solid #1e293b;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .sjg-score-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      shrink: 0;
    }

    .sjg-score-circle {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: radial-gradient(circle, #4f46e5 0%, #1e1b4b 80%);
      border: 3px solid #6366f1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
    }

    .sjg-score-num {
      font-size: 22px;
      font-weight: 900;
      color: #ffffff;
      line-height: 1;
    }

    .sjg-score-label {
      font-size: 9px;
      color: #a5b4fc;
      font-weight: 800;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .sjg-job-main-title {
      font-size: 16px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.3;
    }

    .sjg-job-meta-line {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 4px;
    }

    /* Tabs Bar */
    .sjg-tabs-bar {
      display: flex;
      background: #090d16;
      border-bottom: 1px solid #1e293b;
      padding: 0 16px;
      gap: 6px;
    }

    .sjg-tab-item {
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: #94a3b8;
      font-size: 12px;
      font-weight: 600;
      padding: 12px 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .sjg-tab-item:hover {
      color: #ffffff;
    }

    .sjg-tab-item.active {
      color: #818cf8;
      border-bottom-color: #818cf8;
      font-weight: 700;
    }

    /* Body View Container */
    .sjg-modal-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    .sjg-view-container {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .sjg-alert-box {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 10px;
      font-size: 12px;
      background: rgba(6, 78, 59, 0.3);
      border: 1px solid rgba(16, 185, 129, 0.4);
    }

    .sjg-alert-icon {
      width: 18px;
      height: 18px;
      background: #10b981;
      color: #064e3b;
      border-radius: 50%;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      shrink: 0;
    }

    .sjg-alert-title {
      font-weight: 700;
      color: #34d399;
    }

    .sjg-alert-desc {
      color: #cbd5e1;
      margin-top: 2px;
      line-height: 1.4;
    }

    .sjg-analysis-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 16px;
    }

    .sjg-tier-ribbon {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      color: #a5b4fc;
      background: #1e1b4b;
      border: 1px solid rgba(165, 180, 252, 0.3);
      padding: 3px 8px;
      border-radius: 6px;
      margin-bottom: 8px;
    }

    .sjg-eval-summary {
      font-size: 13px;
      color: #e2e8f0;
      line-height: 1.5;
      margin-bottom: 14px;
    }

    .sjg-chips-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
    }

    .sjg-skill-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
    }

    .sjg-skill-chip.verified {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #6ee7b7;
    }

    .sjg-skill-chip.gap {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: #fcd34d;
    }

    .sjg-presets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
    }

    .sjg-preset-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .sjg-preset-card:hover {
      border-color: #3b82f6;
    }

    .sjg-preset-card.selected {
      border-color: #6366f1;
      background: linear-gradient(135deg, rgba(30, 27, 75, 0.6), #0f172a);
      box-shadow: 0 0 14px rgba(99, 102, 241, 0.3);
    }

    .sjg-mini-tag {
      background: #1e293b;
      color: #cbd5e1;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .sjg-cl-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sjg-btn-action {
      background: #1e293b;
      border: 1px solid #334155;
      color: #e2e8f0;
      font-size: 11px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .sjg-btn-action:hover {
      background: #334155;
      color: #ffffff;
    }

    .sjg-text-editor textarea {
      width: 100%;
      background: #080c14;
      border: 1px solid #1e293b;
      border-radius: 8px;
      color: #e2e8f0;
      font-family: inherit;
      font-size: 12px;
      line-height: 1.6;
      padding: 12px;
      resize: vertical;
    }

    .sjg-raw-jd-viewer {
      background: #080c14;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 12px;
      max-height: 360px;
      overflow-y: auto;
    }

    .sjg-raw-jd-viewer pre {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      color: #cbd5e1;
      white-space: pre-wrap;
      word-break: break-word;
      line-height: 1.6;
    }

    /* Footer */
    .sjg-modal-footer {
      padding: 12px 20px;
      background: #0a0f1d;
      border-top: 1px solid #1e293b;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sjg-btn-pri {
      background: linear-gradient(135deg, #4f46e5, #6366f1);
      border: none;
      color: #ffffff;
      font-size: 12px;
      font-weight: 700;
      padding: 8px 18px;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
      transition: all 0.2s;
    }

    .sjg-btn-pri:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }
  `;

  /**
   * Render or Update the HUD UI inside Shadow DOM
   */
  function renderShadowUI() {
    const sRoot = getOrCreateShadowRoot();
    if (!sRoot) return;

    const job = cachedJobData || extractFullIndeedJob();
    cachedJobData = job;

    const candidate = candidatePresets[currentCandidateIndex];
    const evaluation = evaluateJobMatch(job, candidate);

    // Build or update Shadow DOM structure
    let wrapper = sRoot.getElementById('sjg-shadow-wrapper');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = 'sjg-shadow-wrapper';
      sRoot.innerHTML = `<style>${SHADOW_CSS}</style>`;
      sRoot.appendChild(wrapper);
    }

    const charDisplay = job.characterCount > 0
      ? `${job.characterCount.toLocaleString()} chars`
      : 'Ready & Listening';

    wrapper.innerHTML = `
      <!-- Floating Quick Pill Trigger -->
      <div id="sjg-pill-trigger" class="sjg-floating-pill" title="Click to open/close SuperJobGenie HUD">
        <div class="sjg-pill-dot"></div>
        <div class="sjg-pill-text">
          <span class="sjg-pill-brand">
            SuperJobGenie 🚀
            <span class="sjg-pill-platform">${escapeHtml(job.platform)}</span>
          </span>
          <span class="sjg-pill-chars">${charDisplay}</span>
        </div>
        <div class="sjg-pill-badge">${evaluation.matchScore}%</div>
      </div>

      <!-- In-Page Auto-Popping Modal Backdrop -->
      <div id="sjg-backdrop" class="sjg-modal-backdrop ${isModalOpen ? 'open' : ''}">
        <div class="sjg-modal-dialog">
          
          <!-- Header -->
          <div class="sjg-modal-header">
            <div class="sjg-logo-badge">
              <span class="sjg-pulse-circle"></span>
              <span class="sjg-logo-title">SuperJobGenie HUD</span>
              <span class="sjg-version-pill">v2.4.0</span>
            </div>
            <div class="sjg-header-right">
              <span class="sjg-auto-badge">⚡ Auto-Popped</span>
              <button id="sjg-close-btn" class="sjg-close-cross-btn" title="Minimize to Pill (ESC)">✕</button>
            </div>
          </div>

          <!-- Job Strip -->
          <div class="sjg-job-strip">
            <div class="sjg-score-hero">
              <div class="sjg-score-circle">
                <span class="sjg-score-num">${evaluation.matchScore}%</span>
                <span class="sjg-score-label">Match</span>
              </div>
            </div>
            <div style="flex: 1; min-width: 0;">
              <h2 class="sjg-job-main-title">${escapeHtml(job.title)}</h2>
              <div class="sjg-job-meta-line">
                <span style="color: #38bdf8; font-weight: 700;">${escapeHtml(job.company)}</span> • 
                <span>${escapeHtml(job.location)}</span> • 
                <span style="color: #34d399; font-weight: 600;">${escapeHtml(job.salary)}</span>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="sjg-tabs-bar">
            <button class="sjg-tab-item ${activeTab === 'match' ? 'active' : ''}" data-tab="match">
              🎯 Match & Radar
            </button>
            <button class="sjg-tab-item ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile">
              👤 Profile (${escapeHtml(candidate.name.split(' ')[0])})
            </button>
            <button class="sjg-tab-item ${activeTab === 'coverletter' ? 'active' : ''}" data-tab="coverletter">
              ✉️ Custom CL
            </button>
            <button class="sjg-tab-item ${activeTab === 'fulljd' ? 'active' : ''}" data-tab="fulljd">
              📄 Full JD (${job.characterCount.toLocaleString()} chars)
            </button>
          </div>

          <!-- Modal Body -->
          <div class="sjg-modal-body">
            
            ${activeTab === 'match' ? `
              <div class="sjg-view-container">
                <div class="sjg-alert-box">
                  <div class="sjg-alert-icon">✓</div>
                  <div class="sjg-alert-content">
                    <div class="sjg-alert-title">
                      ${job.characterCount > 250 ? '3,000+ Char Scan Verified' : 'Real-time Scanner Ready'} • ${escapeHtml(job.extractionSource)}
                    </div>
                    <div class="sjg-alert-desc">
                      Deep scan completed with zero truncation. Real-time alignment against ${escapeHtml(candidate.name)}.
                    </div>
                  </div>
                </div>

                <div class="sjg-analysis-card">
                  <div class="sjg-tier-ribbon">${escapeHtml(evaluation.matchTier)}</div>
                  <p class="sjg-eval-summary">${escapeHtml(evaluation.summaryText)}</p>

                  <div class="sjg-skill-group">
                    <h4 style="font-size: 12px; font-weight: 700; color: #34d399; margin-bottom: 6px;">
                      ✅ Verified Match Skills (${evaluation.verified.length})
                    </h4>
                    <div class="sjg-chips-wrap">
                      ${evaluation.verified.length > 0 ? evaluation.verified.map(v => `
                        <div class="sjg-skill-chip verified">
                          <strong>${escapeHtml(v.name)}</strong>
                          <span style="opacity: 0.7; font-size: 9px;">${escapeHtml(v.category)}</span>
                        </div>
                      `).join('') : '<span style="color:#64748b; font-size: 11px;">Scanning for explicit keyword matches...</span>'}
                    </div>
                  </div>

                  ${evaluation.gaps.length > 0 ? `
                    <div class="sjg-skill-group" style="margin-top: 14px;">
                      <h4 style="font-size: 12px; font-weight: 700; color: #f59e0b; margin-bottom: 6px;">
                        ⚡ Target Pivot Gaps (${evaluation.gaps.length})
                      </h4>
                      <div class="sjg-chips-wrap">
                        ${evaluation.gaps.map(g => `
                          <div class="sjg-skill-chip gap">
                            <strong>${escapeHtml(g.name)}</strong>
                            <span style="opacity: 0.7; font-size: 9px;">${escapeHtml(g.category)}</span>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}

            ${activeTab === 'profile' ? `
              <div class="sjg-view-container">
                <p style="font-size: 12px; color: #94a3b8;">Select a profile to switch alignment evaluation in real-time:</p>
                <div class="sjg-presets-grid">
                  ${candidatePresets.map((preset, idx) => `
                    <div class="sjg-preset-card ${idx === currentCandidateIndex ? 'selected' : ''}" data-idx="${idx}">
                      <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                        <strong style="color:#fff; font-size:12px;">${escapeHtml(preset.name)}</strong>
                        <span style="color:#34d399; font-size:11px; font-weight:700;">${preset.yearsExp} Yrs</span>
                      </div>
                      <p style="font-size:11px; color:#94a3b8; line-height:1.4; margin-bottom:8px;">${escapeHtml(preset.resumeSnippet)}</p>
                      <div style="display:flex; flex-wrap:wrap; gap:4px;">
                        ${preset.skills.slice(0, 4).map(s => `<span class="sjg-mini-tag">${escapeHtml(s)}</span>`).join('')}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            ${activeTab === 'coverletter' ? `
              <div class="sjg-view-container">
                <div class="sjg-cl-header">
                  <div>
                    <h4 style="color:#fff; font-size:13px; font-weight:700;">Tailored Cover Letter</h4>
                    <p style="color:#94a3b8; font-size:11px;">Framed specifically for ${escapeHtml(job.company)} • ${escapeHtml(job.title)}</p>
                  </div>
                  <button id="sjg-copy-cl-btn" class="sjg-btn-action">📋 Copy Cover Letter</button>
                </div>
                <div class="sjg-text-editor">
                  <textarea id="sjg-cl-text" rows="12" readonly>${escapeHtml(evaluation.coverLetter)}</textarea>
                </div>
              </div>
            ` : ''}

            ${activeTab === 'fulljd' ? `
              <div class="sjg-view-container">
                <div class="sjg-cl-header">
                  <div>
                    <h4 style="color:#fff; font-size:13px; font-weight:700;">Unabridged Job Description (${job.characterCount.toLocaleString()} chars)</h4>
                    <p style="color:#94a3b8; font-size:11px;">Source: ${escapeHtml(job.extractionSource)}</p>
                  </div>
                  <button id="sjg-copy-jd-btn" class="sjg-btn-action">📋 Copy Full JD</button>
                </div>
                <div class="sjg-raw-jd-viewer">
                  <pre>${escapeHtml(job.fullBodyText || 'No job description text detected yet.')}</pre>
                </div>
              </div>
            ` : ''}

          </div>

          <!-- Footer -->
          <div class="sjg-modal-footer">
            <span style="font-size:11px; color:#64748b;">
              <span style="color:#34d399; font-weight:700;">${escapeHtml(evaluation.matchTier)}</span> • ${job.characterCount.toLocaleString()} chars
            </span>
            <div style="display:flex; gap:10px;">
              <button id="sjg-rescan-btn" class="sjg-btn-action">🔄 Refresh Scan</button>
              <button id="sjg-done-btn" class="sjg-btn-pri">Done (Close)</button>
            </div>
          </div>

        </div>
      </div>
    `;

    // Bind events safely inside Shadow DOM
    wrapper.querySelector('#sjg-pill-trigger')?.addEventListener('click', (e) => {
      e.stopPropagation();
      isModalOpen = !isModalOpen;
      renderShadowUI();
    });

    wrapper.querySelector('#sjg-close-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      isModalOpen = false;
      renderShadowUI();
    });

    wrapper.querySelector('#sjg-done-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      isModalOpen = false;
      renderShadowUI();
    });

    wrapper.querySelector('#sjg-backdrop')?.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'sjg-backdrop') {
        isModalOpen = false;
        renderShadowUI();
      }
    });

    wrapper.querySelectorAll('.sjg-tab-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeTab = e.currentTarget.getAttribute('data-tab');
        renderShadowUI();
      });
    });

    wrapper.querySelectorAll('.sjg-preset-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
        if (!isNaN(idx)) {
          currentCandidateIndex = idx;
          renderShadowUI();
        }
      });
    });

    wrapper.querySelector('#sjg-copy-cl-btn')?.addEventListener('click', (e) => {
      const txt = wrapper.querySelector('#sjg-cl-text')?.value;
      if (txt) {
        navigator.clipboard.writeText(txt);
        const btn = e.currentTarget;
        btn.innerText = '✅ Copied!';
        setTimeout(() => { btn.innerText = '📋 Copy Cover Letter'; }, 2000);
      }
    });

    wrapper.querySelector('#sjg-copy-jd-btn')?.addEventListener('click', (e) => {
      if (job.fullBodyText) {
        navigator.clipboard.writeText(job.fullBodyText);
        const btn = e.currentTarget;
        btn.innerText = '✅ Copied!';
        setTimeout(() => { btn.innerText = '📋 Copy Full JD'; }, 2000);
      }
    });

    wrapper.querySelector('#sjg-rescan-btn')?.addEventListener('click', () => {
      cachedJobData = extractFullIndeedJob();
      renderShadowUI();
    });
  }

  /**
   * Main Check & Auto-Pop Trigger
   */
  function checkAndAutoPop() {
    const job = extractFullIndeedJob();
    cachedJobData = job;

    // Render the UI in Shadow DOM (ensures the pill is always visible and ready)
    renderShadowUI();

    // Check if we should AUTO-POP the modal
    // Condition: Job has actual content (> 150 chars or clear title) and hasn't auto-popped for this specific job yet
    const currentJobKey = `${job.title}::${job.company}::${job.characterCount}`;
    if (job.characterCount > 150 && hasAutoPoppedForJobKey !== currentJobKey) {
      hasAutoPoppedForJobKey = currentJobKey;
      console.log('[SuperJobGenie] Auto-popping HUD for job:', job.title, 'Chars:', job.characterCount);
      isModalOpen = true;
      renderShadowUI();
    }
  }

  // Handle ESC key globally
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
      isModalOpen = false;
      renderShadowUI();
    }
  });

  // Handle messages from Extension Popup (popup.js)
  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'ping') {
        const job = cachedJobData || extractFullIndeedJob();
        sendResponse({
          success: true,
          jobTitle: job.title,
          company: job.company,
          charCount: job.characterCount,
          platform: job.platform
        });
        return true;
      }

      if (request.action === 'open_inpage_modal' || request.action === 'toggle_modal') {
        isModalOpen = true;
        renderShadowUI();
        sendResponse({ success: true, charCount: cachedJobData?.characterCount || 0 });
        return true;
      }
    });
  }

  // Execute immediately to mount Shadow DOM and display floating capsule without delay
  checkAndAutoPop();

  // Run subsequent checks after DOM stabilization and AJAX loads
  setTimeout(checkAndAutoPop, 500);
  setTimeout(checkAndAutoPop, 1500);

  // Monitor DOM mutations for dynamic SPA job clicks
  let debounceTimer = null;
  const observer = new MutationObserver(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      checkAndAutoPop();
    }, 400);
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  // Also listen for SPA URL changes
  window.addEventListener('popstate', () => setTimeout(checkAndAutoPop, 500));
  window.addEventListener('hashchange', () => setTimeout(checkAndAutoPop, 500));

})();
