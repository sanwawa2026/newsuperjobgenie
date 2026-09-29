/**
 * SuperJobGenie Chrome Extension - Content Script (v2.7.0)
 * Industrial-grade Shadow DOM Isolation + Bottom-Right Floating Panel + Zero Center Blocking + Single Instance
 */

(function () {
  'use strict';

  // Prevent duplicate script execution or multi-frame stacking
  if (window.__SUPER_JOB_GENIE_INITIALIZED__ || document.getElementById('sjg-shadow-host-root')) {
    return;
  }
  window.__SUPER_JOB_GENIE_INITIALIZED__ = true;

  console.log('[SuperJobGenie v2.7.0] English Pro HUD initialized on:', window.location.href);

  // Candidate Profile State (Default starts neutral/fresh, hydrated from storage)
  let candidateProfile = {
    name: 'Candidate Profile',
    title: 'Financial & Quantitative Analyst',
    targetRole: 'Finance Transformation Analyst',
    yearsOfExperience: 3,
    skills: ['Python', 'SQL', 'Finance', 'Accounting', 'Excel', 'Financial Analysis'],
    rawResumeText: 'Results-driven Master of Science in Finance with solid quantitative modeling, financial analysis, and capital market research capabilities. Proficient in Python, SQL, Excel, and corporate finance.'
  };

  // Hydrate candidate profile from chrome.storage.local or localStorage immediately
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['sjg_candidate_profile'], (res) => {
        if (res && res.sjg_candidate_profile) {
          candidateProfile = { ...candidateProfile, ...res.sjg_candidate_profile };
          renderShadowUI();
        }
      });
    } else {
      const saved = localStorage.getItem('sjg_candidate_profile');
      if (saved) {
        candidateProfile = { ...candidateProfile, ...JSON.parse(saved) };
      }
    }
  } catch (e) {}

  function saveProfileToStorage() {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.set({ sjg_candidate_profile: candidateProfile });
      }
      localStorage.setItem('sjg_candidate_profile', JSON.stringify(candidateProfile));
    } catch (e) {}
  }

  // UI State
  let cachedJobData = null;
  let isModalOpen = false;
  let isCandidateExpanded = false;
  let isBuggyMode = false;
  let isEditCandidateOpen = false;
  let hasAutoPoppedForJobKey = null;
  let shadowRoot = null;
  let hostContainer = null;
  let fireworkParticles = [];
  let fireworkAnimId = null;
  let lastFireworksJobKey = null;
  let renderDebounceTimer = null; // Coalesces rapid back-to-back rescans into a single render

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
    return 'Indeed / Web';
  }

  /**
   * Deep Extractor v3.0: Multilayer Extraction
   */
  /**
   * Helper: Filter out search page headers like "finance analyst jobs in Los Angeles, CA"
   */
  function isSearchHeader(str) {
    if (!str) return true;
    const s = str.trim().toLowerCase();
    return s.includes(' jobs in ') || 
           s.includes(' jobs near ') || 
           s.includes(' jobs, employment') || 
           s.includes(' jobs available in ') || 
           s.startsWith('jobs in ');
  }

  // Track the most recent job card the user clicked in the search list
  let lastClickedCard = null;

  /**
   * Deep Extractor v4.0: Global Un-scoped Extraction & Resilient Matcher
   */
  function extractFullIndeedJob() {
    const platform = detectPlatform();
    let title = '';
    let company = '';
    let location = 'Los Angeles, CA • On-site / Hybrid';
    let salary = '';
    let fullBodyText = '';
    let extractionSource = `${platform} Dynamic Engine`;
    let isSchemaOrg = false;
    let jk = '';
    let foundJdEl = null;

    // 1. Get jobKey from URL if available
    try {
      const urlParams = new URLSearchParams(window.location.search);
      jk = urlParams.get('vjk') || urlParams.get('jk') || '';
    } catch (e) {}

    // ==========================================
    // ⚔️ CHANNEL 1: The Legendary 3,000+ Char Schema.org JSON-LD Priority Extractor
    // Direct from source, immune to all DOM layout/styling/skeleton traps
    // ==========================================
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"], script#mosaic-data, script[type="application/json"]');
    for (const script of jsonLdScripts) {
      try {
        const parsed = JSON.parse(script.textContent || '{}');
        const items = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of items) {
          if (item && item['@type'] === 'JobPosting' && item.description && item.description.length > 150) {
            isSchemaOrg = true;
            if (item.title && !isSearchHeader(item.title)) title = item.title;
            if (item.hiringOrganization?.name) company = item.hiringOrganization.name;
            if (item.jobLocation?.address?.addressLocality) location = `${item.jobLocation.address.addressLocality} • Active`;
            if (item.baseSalary?.value?.value) salary = `$${item.baseSalary.value.value}`;
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = item.description;
            fullBodyText = tempDiv.innerText.trim();
            extractionSource = `${platform} Schema.org (3000+ Uncut Patch)`;
            break;
          }
        }
      } catch (e) {}
      if (fullBodyText && fullBodyText.length > 200) break;
    }

    // ==========================================
    // ⚔️ CHANNEL 2: The 3,000+ Char Native DOM Traversal Patch
    // Traverses primary JD containers taking full native browser formatted text
    // ==========================================
    if (!fullBodyText || fullBodyText.length < 150) {
      const jdContainers = [
        document.querySelector('#jobDescriptionText'),
        document.querySelector('[data-testid="jobDescriptionText"]'),
        document.querySelector('div[data-segment-label="JobDescription"]'),
        document.querySelector('.jobsearch-jobDescriptionText'),
        document.querySelector('.jobsearch-JobComponent-description'),
        document.querySelector('div.jobsearch-ViewJobLayout-mainContent'),
        document.querySelector('#vjs-job-description'),
        document.querySelector('#vjs-content')
      ].filter(Boolean);

      for (const container of jdContainers) {
        const directText = (container.innerText || container.textContent || '').trim();
        if (directText.length > 150) {
          fullBodyText = directText;
          foundJdEl = container;
          extractionSource = `${platform} DOM (3000+ Native)`;
          break;
        }
      }
    }

    // ==========================================
    // ⚔️ CHANNEL 3: Heading Anchor & Right Pane Fallbacks
    // ==========================================
    if (!fullBodyText || fullBodyText.length < 150) {
      const allHeadings = document.querySelectorAll('h1, h2, h3, h4, div, span, p');
      for (const h of allHeadings) {
        const txt = (h.textContent || '').trim();
        if (/^full job description$/i.test(txt) || /^job description$/i.test(txt)) {
          let sib = h.nextElementSibling;
          while (sib) {
            const raw = (sib.innerText || sib.textContent || '').trim();
            if (raw.length > 150) {
              fullBodyText = raw;
              extractionSource = `${platform} Heading Anchor (${txt})`;
              foundJdEl = sib;
              break;
            }
            sib = sib.nextElementSibling;
          }
          if (!fullBodyText && h.parentElement) {
            const pRaw = (h.parentElement.innerText || h.parentElement.textContent || '').trim();
            if (pRaw.length > 200) {
              fullBodyText = pRaw;
              extractionSource = `${platform} Heading Container`;
              foundJdEl = h.parentElement;
              break;
            }
          }
        }
        if (fullBodyText && fullBodyText.length > 150) break;
      }
    }

    // ==========================================
    // ⚔️ CHANNEL 4: Cross-Frame / Iframe Fallback
    // ==========================================
    if (!fullBodyText || fullBodyText.length < 150) {
      const iframes = document.querySelectorAll('iframe');
      for (const iframe of iframes) {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc) {
            const el = doc.querySelector('#jobDescriptionText, [data-testid="jobDescriptionText"], .jobsearch-JobComponent-description');
            if (el) {
              const raw = (el.innerText || el.textContent || '').trim();
              if (raw.length > 150) {
                fullBodyText = raw;
                foundJdEl = el;
                extractionSource = `${platform} Iframe (#${iframe.id || 'vjs-frame'})`;
                break;
              }
            }
          }
        } catch (e) {}
      }
    }

    // 5. Extract Title
    const titleSelectors = [
      '[data-testid="jobsearch-JobInfoHeader-title"]',
      'h1.jobsearch-JobInfoHeader-title',
      'h2.jobsearch-JobInfoHeader-title',
      '.jobsearch-JobInfoHeader-title',
      'h1[data-cy="jobTitle"]',
      '[data-testid="simpler-job-title"]',
      '#vjs-jobtitle',
      '.job-details-jobs-unified-top-card__job-title',
      '[data-test="job-title"]'
    ];

    // Priority A: Right pane header (scoped near found description if available)
    if (foundJdEl) {
      const container = foundJdEl.closest('div.jobsearch-RightPane, div.jobsearch-ViewJobLayout, div[aria-label="Job details"], div.fastviewjob, #vjs-container, #jobsearch-ViewjobPaneWrapper, div[role="main"]') || foundJdEl.parentElement?.parentElement;
      if (container) {
        for (const sel of titleSelectors) {
          const el = container.querySelector(sel);
          if (el && el.innerText.trim()) {
            const clean = el.innerText.replace(/^new\s+/i, '').trim();
            if (!isSearchHeader(clean)) {
              title = clean;
              break;
            }
          }
        }
        if (!title) {
          const h = container.querySelector('h1, h2');
          if (h && h.innerText.trim()) {
            const clean = h.innerText.replace(/^new\s+/i, '').trim();
            if (!isSearchHeader(clean)) title = clean;
          }
        }
      }
    }

    // Direct document query for title if still not found
    if (!title) {
      for (const sel of titleSelectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.trim()) {
          const clean = el.innerText.replace(/^new\s+/i, '').trim();
          if (!isSearchHeader(clean)) {
            title = clean;
            break;
          }
        }
      }
    }

    // Priority B: Use last clicked card from left list
    if (!title && lastClickedCard?.title) {
      title = lastClickedCard.title;
    }

    // Priority C: Check active / selected card in left list
    if (!title) {
      const activeCard = document.querySelector('div.job_seen_beacon[aria-current="true"], li[aria-current="true"], div[data-jk].selected, div.cardOutline.selected');
      if (activeCard) {
        const tEl = activeCard.querySelector('a.jcs-JobTitle, h2.jobTitle span[title], h2.jobTitle, a[id^="job_"]');
        if (tEl && tEl.innerText.trim()) {
          const clean = tEl.innerText.replace(/^new\s+/i, '').trim();
          if (!isSearchHeader(clean)) title = clean;
        }
      }
    }

    // 6. Extract Company
    const compSelectors = [
      '[data-testid="inlineHeader-companyName"]',
      '.jobsearch-InlineCompanyRating-companyHeader a',
      '.jobsearch-InlineCompanyRating-companyHeader',
      '[data-company-name="true"]',
      'a[data-cy="companyName"]',
      '.company-name',
      '#vjs-cn',
      '.job-details-jobs-unified-top-card__company-name',
      '[data-test="employer-name"]'
    ];

    if (foundJdEl) {
      const container = foundJdEl.closest('div.jobsearch-RightPane, div.jobsearch-ViewJobLayout, div[aria-label="Job details"], div.fastviewjob, #vjs-container, #jobsearch-ViewjobPaneWrapper, div[role="main"]') || foundJdEl.parentElement?.parentElement;
      if (container) {
        for (const sel of compSelectors) {
          const el = container.querySelector(sel);
          if (el && el.innerText.trim()) {
            company = el.innerText.trim();
            break;
          }
        }
      }
    }

    if (!company) {
      for (const sel of compSelectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.trim()) {
          company = el.innerText.trim();
          break;
        }
      }
    }

    if (!company && lastClickedCard?.company) {
      company = lastClickedCard.company;
    }

    // 7. Location & Salary
    if (foundJdEl) {
      const container = foundJdEl.closest('div.jobsearch-RightPane, div.jobsearch-ViewJobLayout, div[aria-label="Job details"], div.fastviewjob, #vjs-container') || foundJdEl.parentElement?.parentElement;
      if (container) {
        const locEl = container.querySelector('[data-testid="jobsearch-JobInfoHeader-companyLocation"], .jobsearch-JobInfoHeader-companyLocation');
        if (locEl && locEl.innerText.trim()) location = locEl.innerText.trim();
        const salEl = container.querySelector('#salaryInfoAndJobType, [data-testid="jobsearch-JobDescriptionSection-section--salary"]');
        if (salEl && salEl.innerText.trim()) salary = salEl.innerText.trim();
      }
    }

    if (!jk) {
      jk = lastClickedCard?.jk || '';
    }

    // 8. Fallback to the first card in the search list if on search results page
    if (!title || !company) {
      const firstCard = document.querySelector('div.job_seen_beacon, div[data-jk], li.css-5lfssm, div.cardOutline');
      if (firstCard) {
        if (!title) {
          const tEl = firstCard.querySelector('a.jcs-JobTitle, h2.jobTitle span[title], h2.jobTitle, a[id^="job_"]');
          if (tEl && tEl.innerText.trim()) {
            const clean = tEl.innerText.replace(/^new\s+/i, '').trim();
            if (!isSearchHeader(clean)) title = clean;
          }
        }
        if (!company) {
          const cEl = firstCard.querySelector('[data-testid="company-name"], .companyName, span.css-63koeb');
          if (cEl && cEl.innerText.trim()) company = cEl.innerText.trim();
        }
        if (!jk) {
          jk = firstCard.getAttribute('data-jk') || firstCard.querySelector('[data-jk]')?.getAttribute('data-jk') || '';
        }
      }
    }

    if (!title) title = 'Select a Job on Indeed';
    if (!company) company = 'Click to Inspect JD';

    const hasRealBody = Boolean(fullBodyText && fullBodyText.length >= 100);

    return {
      title,
      company,
      location,
      salary,
      fullBodyText,
      characterCount: fullBodyText ? fullBodyText.length : 0,
      wordCount: fullBodyText ? fullBodyText.split(/\s+/).filter(Boolean).length : 0,
      platform,
      extractionSource,
      isSchemaOrg,
      hasRealBody,
      jk
    };
  }

  /**
   * Evaluate Job Match against Candidate Profile (Fully Dynamic & Multi-Domain)
   */
  function evaluateJobMatch(jobData, cand) {
    const isUnselected = !jobData || !jobData.title || jobData.title === 'Select a Job on Indeed';
    const hasBody = Boolean(jobData?.fullBodyText && jobData.fullBodyText.length >= 80);
    const combinedText = ((jobData?.title || '') + ' ' + (jobData?.company || '') + ' ' + (jobData?.fullBodyText || '')).toLowerCase();
    const candSkills = cand.skills || [];

    if (isUnselected) {
      return {
        overallMatchScore: 0,
        matchTier: 'Awaiting Job Selection',
        tierTitle: 'Ready to Scan',
        tierDesc: 'Click any job posting on Indeed to inspect full requirements & real-time skills fit',
        tierBadge: 'Ready to Scan',
        tierColor: '#94a3b8',
        tierLevel: 'ready',
        matchHeadline: '👉 Click any job on Indeed to inspect full requirements & real-time skills fit',
        verifiedSkills: [],
        missingSkillGaps: [],
        detectedJdSkillsCount: 0,
        isAwaitingJob: true
      };
    }

    // All possible domain skill candidates to check in the JD
    const catalogSkills = [
      // Tech / Software
      { name: 'TypeScript & JavaScript', key: 'typescript' },
      { name: 'React & Frontend Frameworks', key: 'react' },
      { name: 'Node.js & Backend Services', key: 'node' },
      { name: 'System Design & Scalability', key: 'system design' },
      { name: 'SQL & Database Modeling', key: 'sql' },
      { name: 'Python & Data Analysis', key: 'python' },
      { name: 'AWS & Cloud Infrastructure', key: 'aws' },
      { name: 'CI/CD & DevOps Automation', key: 'ci/cd' },
      // Finance / Accounting / Business
      { name: 'Financial Modeling & Forecasting', key: 'financ' },
      { name: 'Accounting & GAAP Standards', key: 'account' },
      { name: 'Advanced Excel & Data Analytics', key: 'excel' },
      { name: 'FP&A & Budget Management', key: 'budget' },
      { name: 'Tableau / PowerBI Visualization', key: 'tableau' },
      { name: 'SAP / ERP Transformation', key: 'sap' },
      { name: 'Audit & Internal Controls', key: 'audit' },
      { name: 'Stakeholder & Cross-Functional PMO', key: 'stakeholder' }
    ];

    // Detect which skills the JD actually requires (from full body + title)
    let detectedJdSkills = catalogSkills.filter(item => combinedText.includes(item.key));
    
    // If no specific catalog skills found in body, provide balanced baseline
    if (detectedJdSkills.length === 0) {
      detectedJdSkills = [
        { name: 'Core Domain Execution', key: 'domain' },
        { name: 'Data & Quantitative Analysis', key: 'analysis' },
        { name: 'Cross-Functional Collaboration', key: 'communication' },
        { name: 'Operational Problem Solving', key: 'operations' },
        { name: 'Strategic Planning & Execution', key: 'strategy' }
      ];
    }

    let verifiedSkills = [];
    let missingSkillGaps = [];

    detectedJdSkills.forEach(dim => {
      const match = candSkills.some(s => 
        s.toLowerCase().includes(dim.key) || dim.name.toLowerCase().includes(s.toLowerCase())
      );
      if (match) {
        verifiedSkills.push(dim);
      } else {
        missingSkillGaps.push(dim);
      }
    });

    const totalDetected = detectedJdSkills.length;
    const effectiveTotal = Math.max(totalDetected, totalDetected < 4 ? 5 : totalDetected);
    let ratio = totalDetected > 0 ? (verifiedSkills.length / effectiveTotal) : 0.4;
    
    // Calculate realistic dynamic score
    let overallMatchScore = Math.min(99, Math.max(25, Math.round(ratio * 70 + (cand.yearsOfExperience > 0 ? 25 : 10))));
    if (isBuggyMode) {
      overallMatchScore = 98; // simulated naive match from truncated 153 chars
    }

    // Determine strict tier definitions based on the EXACT calculated overallMatchScore
    let tierLevel = 'growth'; // 'exceptional' | 'competitive' | 'growth' | 'pivot'
    let tierTitle = 'Pivot & Growth Opportunity';
    let tierDesc = 'Core transferable skills detected · Minor gap bridging needed';
    let tierBadge = 'Growth Match (60-74%)';
    let tierColor = '#f59e0b'; // amber

    if (overallMatchScore >= 90) {
      tierLevel = 'exceptional';
      tierTitle = 'Top 1% Exceptional Match';
      tierDesc = 'Direct domain overlap · Outstanding qualification alignment · High callback probability';
      tierBadge = 'Top Tier (90-100%)';
      tierColor = '#34d399'; // emerald
    } else if (overallMatchScore >= 75) {
      tierLevel = 'competitive';
      tierTitle = 'Competitive Strong Match';
      tierDesc = 'High core skill alignment · Meets primary job requirements · Recommended to apply';
      tierBadge = 'Competitive (75-89%)';
      tierColor = '#38bdf8'; // sky blue
    } else if (overallMatchScore >= 60) {
      tierLevel = 'growth';
      tierTitle = 'Solid Transferable Foundation';
      tierDesc = 'Transferable skills present · Tailor resume highlights to bridge domain gaps';
      tierBadge = 'Transferable (60-74%)';
      tierColor = '#fbbf24'; // amber
    } else {
      tierLevel = 'pivot';
      tierTitle = 'Cross-Track Exploration';
      tierDesc = 'Cross-domain role · Emphasize soft skills and core analytical fundamentals';
      tierBadge = 'Cross-Track (<60%)';
      tierColor = '#94a3b8'; // slate
    }

    const candRole = cand.title || 'Applicant';
    const candExp = cand.yearsOfExperience > 0 ? `${cand.yearsOfExperience} Yrs Exp` : 'Target Domain';
    
    const matchTier = `${overallMatchScore}% ${tierTitle}`;
    const matchHeadline = isBuggyMode
      ? '⚠️ Naive 98% Match: Based solely on 153 chars truncated preview. Click mode toggle to scan full JD!'
      : `${overallMatchScore}% Match for ${candRole} (${candExp}) · ${tierDesc}`;

    return {
      overallMatchScore,
      matchTier,
      tierTitle,
      tierDesc,
      tierBadge,
      tierColor,
      tierLevel,
      matchHeadline,
      verifiedSkills,
      missingSkillGaps,
      detectedJdSkillsCount: totalDetected,
      isAwaitingJob: false
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
   * Ensure Isolated Shadow DOM Host is Attached directly to document.body
   */
  function getOrCreateShadowRoot() {
    if (shadowRoot && hostContainer && hostContainer.parentElement === document.body) {
      return shadowRoot;
    }

    if (!document.body) {
      return null;
    }

    hostContainer = document.getElementById('sjg-shadow-host-root');
    if (!hostContainer) {
      hostContainer = document.createElement('div');
      hostContainer.id = 'sjg-shadow-host-root';
      hostContainer.style.position = 'fixed';
      hostContainer.style.zIndex = '2147483647';
      hostContainer.style.inset = '0';
      hostContainer.style.pointerEvents = 'none';
      hostContainer.style.display = 'block';
      document.body.appendChild(hostContainer);
    } else if (hostContainer.parentElement !== document.body) {
      // Reparent to document.body so it is never trapped outside the body context
      document.body.appendChild(hostContainer);
    }

    shadowRoot = hostContainer.shadowRoot || hostContainer.attachShadow({ mode: 'open' });
    return shadowRoot;
  }

  /**
   * CSS Styles injected directly into Shadow DOM (Bottom-Right Floating Panel, Zero Center Blocking)
   */
  const SHADOW_CSS = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* 1. Permanent Quick Floating Pill in Bottom-Right */
    .sjg-floating-pill {
      position: fixed;
      bottom: 24px;
      right: 24px;
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
    }

    .sjg-floating-pill:hover {
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 16px 40px -5px rgba(0, 0, 0, 0.9), 0 0 30px rgba(99, 102, 241, 0.6);
      border-color: rgba(129, 140, 248, 1);
    }

    .sjg-pill-dot {
      width: 10px;
      height: 10px;
      background-color: #06b6d4;
      border-radius: 50%;
      box-shadow: 0 0 10px #06b6d4;
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
    }

    /* 2. Bottom-Right Floating Panel (Zero Center Blocking, No Dark Backdrop) */
    .sjg-hud-panel {
      position: fixed;
      bottom: 84px;
      right: 24px;
      z-index: 2147483647;
      width: 420px;
      max-height: 82vh;
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 20px;
      box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(59, 130, 246, 0.25);
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #f1f5f9;
      pointer-events: auto;
      animation: sjgSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* Fireworks Canvas Overlay */
    .sjg-fireworks-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    }

    .sjg-hud-panel.open {
      display: flex !important;
    }

    @keyframes sjgSlideUp {
      0% { transform: translateY(20px) scale(0.97); opacity: 0; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }

    /* Header */
    .sjg-header {
      padding: 14px 16px;
      background: #0d1322;
      border-bottom: 1px solid #1e293b;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sjg-header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sjg-cyan-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #06b6d4;
      box-shadow: 0 0 10px #06b6d4;
    }

    .sjg-title {
      font-weight: 900;
      font-size: 13px;
      color: #ffffff;
      letter-spacing: 0.05em;
    }

    .sjg-pro-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 6px;
      border: 1px solid rgba(245, 158, 11, 0.4);
    }

    .sjg-header-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .sjg-btn-rescan {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #1e293b;
      border: 1px solid #334155;
      color: #cbd5e1;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .sjg-btn-rescan:hover {
      background: #334155;
      color: #ffffff;
    }

    .sjg-btn-close {
      background: transparent;
      border: none;
      color: #64748b;
      width: 26px;
      height: 26px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      transition: all 0.2s;
    }

    .sjg-btn-close:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    /* Sub-bar: Extraction Mode */
    .sjg-mode-bar {
      padding: 8px 16px;
      background: #090e1a;
      border-bottom: 1px solid #1e293b;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
    }

    .sjg-mode-label {
      color: #94a3b8;
    }

    .sjg-mode-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      background: rgba(6, 78, 59, 0.4);
      color: #34d399;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 6px;
      border: 1px solid rgba(16, 185, 129, 0.4);
      cursor: pointer;
    }

    /* Scrollable Content Body */
    .sjg-body {
      padding: 14px 16px;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Card 1: Live Job Target */
    .sjg-card {
      background: #0d1424;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 12px 14px;
    }

    .sjg-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .sjg-red-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #ef4444;
      display: inline-block;
      margin-right: 6px;
    }

    .sjg-chars-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(6, 78, 59, 0.35);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.35);
      padding: 2px 8px;
      border-radius: 999px;
      font-family: ui-monospace, monospace;
      font-size: 10px;
      font-weight: 700;
    }

    .sjg-job-title {
      font-size: 14px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.3;
    }

    .sjg-job-sub {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 3px;
    }

    .sjg-job-company {
      color: #38bdf8;
      font-weight: 700;
    }

    /* Card 2: Candidate Profile */
    .sjg-candidate-actions {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 5px;
      font-size: 11px;
    }

    /* Prominent Upload Button */
    .sjg-btn-upload {
      background: rgba(99, 102, 241, 0.2);
      border: 1px solid #6366f1;
      color: #a5b4fc;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      transition: all 0.2s;
    }

    .sjg-btn-upload:hover {
      background: #4f46e5;
      color: #ffffff;
      box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
    }

    .sjg-btn-link {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 2px 4px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .sjg-btn-link:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.05);
    }

    .sjg-btn-link.expand {
      color: #38bdf8;
      font-weight: 600;
    }

    .sjg-cand-skills-text {
      font-size: 11px;
      color: #cbd5e1;
      line-height: 1.45;
      margin-top: 4px;
    }

    .sjg-cand-skills-label {
      color: #94a3b8;
    }

    .sjg-cand-expand-box {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #1e293b;
      font-size: 11px;
      color: #cbd5e1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    /* Card 3: Match Overview Card (Dynamic Tier Glow Border) */
    .sjg-match-card {
      background: #0d1428;
      border: 1.5px solid rgba(59, 130, 246, 0.4);
      border-radius: 14px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .sjg-match-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sjg-match-tier {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 800;
      color: #ffffff;
    }

    .sjg-match-tier-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 3px 9px;
      border-radius: 999px;
      letter-spacing: 0.02em;
    }

    /* Clear, self-explaining 4-tier benchmark scale */
    .sjg-tier-legend {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      background: #070b14;
      padding: 6px;
      border-radius: 8px;
      border: 1px solid #1e293b;
      margin: 2px 0;
    }

    .sjg-tier-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4px 2px;
      border-radius: 6px;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid transparent;
      opacity: 0.45;
      transition: all 0.2s;
    }

    .sjg-tier-step.active {
      opacity: 1;
      border-color: currentColor;
      background: rgba(30, 41, 59, 0.9);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.08);
      transform: scale(1.02);
    }

    .sjg-tier-step-range {
      font-size: 9px;
      font-family: ui-monospace, monospace;
      font-weight: 800;
    }

    .sjg-tier-step-label {
      font-size: 8px;
      font-weight: 700;
      white-space: nowrap;
      margin-top: 1px;
    }

    .sjg-match-desc {
      font-size: 11px;
      color: #cbd5e1;
      line-height: 1.45;
    }

    .sjg-match-inner {
      background: #090e1a;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .sjg-ring-box {
      width: 54px;
      height: 54px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .sjg-ring-svg {
      width: 54px;
      height: 54px;
      transform: rotate(-90deg);
    }

    .sjg-ring-text {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .sjg-ring-num {
      font-size: 12px;
      font-weight: 900;
      color: #ffffff;
    }

    .sjg-ring-sub {
      font-size: 7px;
      font-weight: 800;
      color: #94a3b8;
      letter-spacing: 0.05em;
      margin-top: 1px;
    }

    .sjg-match-inner-text {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .sjg-match-inner-title {
      font-size: 12px;
      font-weight: 800;
      color: #ffffff;
    }

    .sjg-match-inner-stats {
      font-size: 10px;
      font-family: ui-monospace, monospace;
      color: #94a3b8;
    }

    /* Skills Verification Sections */
    .sjg-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 800;
      margin-top: 2px;
    }

    .sjg-verified-label {
      color: #10b981;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .sjg-gaps-label {
      color: #f59e0b;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .sjg-total-count {
      color: #94a3b8;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      font-weight: 600;
    }

    .sjg-chips-list {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .sjg-chip {
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
      width: fit-content;
    }

    .sjg-chip.verified {
      background: rgba(6, 78, 59, 0.4);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.4);
    }

    .sjg-chip.gap {
      background: rgba(136, 19, 55, 0.4);
      color: #f43f5e;
      border: 1px solid rgba(244, 63, 94, 0.4);
    }

    /* Action Buttons */
    .sjg-btn-executive {
      width: 100%;
      background: linear-gradient(135deg, #d97706, #ea580c);
      color: #ffffff;
      border: none;
      border-radius: 10px;
      padding: 12px;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      box-shadow: 0 4px 15px rgba(234, 88, 12, 0.35);
      transition: all 0.2s;
    }

    .sjg-btn-executive:hover {
      opacity: 0.95;
      transform: translateY(-1px);
    }

    .sjg-btn-pivot {
      width: 100%;
      background: #181838;
      color: #c7d2fe;
      border: 1px solid #4338ca;
      border-radius: 10px;
      padding: 11px;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .sjg-btn-pivot:hover {
      background: #232352;
      color: #ffffff;
    }

    .sjg-buttons-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .sjg-btn-letter {
      background: #1e293b;
      color: #cbd5e1;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 9px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      transition: all 0.2s;
    }

    .sjg-btn-letter:hover {
      background: #334155;
      color: #ffffff;
    }

    .sjg-btn-faang {
      background: #3b0764;
      color: #f3e8ff;
      border: 1px solid #7e22ce;
      border-radius: 8px;
      padding: 9px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      transition: all 0.2s;
    }

    .sjg-btn-faang:hover {
      background: #581c87;
      color: #ffffff;
    }

    /* Edit Candidate Overlay Sub-dialog */
    .sjg-edit-overlay {
      position: absolute;
      inset: 0;
      background: rgba(9, 13, 22, 0.96);
      border-radius: 20px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 10;
    }

    .sjg-input-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .sjg-input-group label {
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
    }

    .sjg-input-group input, .sjg-input-group textarea {
      background: #0d1424;
      border: 1px solid #334155;
      color: #ffffff;
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-family: inherit;
    }

    .sjg-edit-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: auto;
    }
  `;

  /**
   * Render or Update the HUD UI inside Shadow DOM
   */
  function renderShadowUI() {
    try {
      const sRoot = getOrCreateShadowRoot();
      if (!sRoot) {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => renderShadowUI(), { once: true });
        } else {
          setTimeout(renderShadowUI, 100);
        }
        return;
      }

      const job = cachedJobData || {
        title: 'Select a Job on Indeed',
        company: 'Click any job posting to evaluate',
        location: 'Los Angeles, CA • On-site / Hybrid',
        salary: '',
        fullBodyText: '',
        characterCount: 0,
        wordCount: 0,
        platform: detectPlatform(),
        extractionSource: 'Awaiting Selection',
        isSchemaOrg: false,
        hasRealBody: false,
        jk: ''
      };

      const evaluation = evaluateJobMatch(job, candidateProfile);
      const displayChars = isBuggyMode ? 153 : (job.characterCount || 0);

      let wrapper = sRoot.querySelector('#sjg-shadow-wrapper');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.id = 'sjg-shadow-wrapper';
        sRoot.innerHTML = `<style>${SHADOW_CSS}</style>`;
        sRoot.appendChild(wrapper);
      }

      const strokeDashoffset = Math.round(138 - (138 * evaluation.overallMatchScore) / 100);

    wrapper.innerHTML = `
      <!-- Hidden file input for resume uploading -->
      <input type="file" id="sjg-resume-file-input" accept=".txt,.json,.md,.pdf,.docx" style="display:none;" />

      <!-- Floating Quick Pill Trigger in Bottom-Right -->
      <div id="sjg-pill-trigger" class="sjg-floating-pill" title="Click to open/close SuperJobGenie HUD">
        <div class="sjg-pill-dot"></div>
        <div class="sjg-pill-text">
          <span class="sjg-pill-brand">
            SuperJobGenie 🚀
          </span>
          <span class="sjg-pill-chars">${displayChars.toLocaleString()} chars</span>
        </div>
        <div class="sjg-pill-badge">${evaluation.overallMatchScore}%</div>
      </div>

      <!-- Bottom-Right Floating Panel (Zero Center Blocking) -->
      <div id="sjg-hud-panel" class="sjg-hud-panel ${isModalOpen ? 'open' : ''}">
        <!-- Celebratory Fireworks Canvas for >=90% Matches -->
        <canvas id="sjg-fireworks-canvas" class="sjg-fireworks-canvas" width="420" height="600"></canvas>
        
        <!-- Top Header -->
        <div class="sjg-header">
          <div class="sjg-header-left">
            <span class="sjg-cyan-dot"></span>
            <span class="sjg-title">SUPERJOBGENIE HUD</span>
            <span class="sjg-pro-badge">👑 PRO (3/3)</span>
          </div>
          <div class="sjg-header-actions">
            <button id="sjg-rescan-btn" class="sjg-btn-rescan">
              🔄 Rescan
            </button>
            <button id="sjg-close-btn" class="sjg-btn-close" title="Close (ESC)">✕</button>
          </div>
        </div>

        <!-- Mode Banner -->
        <div class="sjg-mode-bar">
          <span class="sjg-mode-label">Career Pivot Intelligence:</span>
          <div id="sjg-toggle-buggy-btn" class="sjg-mode-badge" title="Click to toggle between 153 chars truncated vs full-body chars">
            ${isBuggyMode 
              ? '⚠️ Truncated: 153 Chars (Naive)' 
              : (job.characterCount >= 200 
                  ? `🛡️ Full Body: ${job.characterCount.toLocaleString()} Chars Verified` 
                  : (job.characterCount > 0 
                      ? `⏳ Parsing: ${job.characterCount} Chars` 
                      : (job.title && job.title !== 'Select a Job on Indeed'
                          ? `🛡️ Selected: ${escapeHtml(job.company || job.title)}`
                          : '🔍 Select a Job to Verify Full Body')))}
          </div>
        </div>

        <!-- Main Scrollable Body -->
        <div class="sjg-body">
          
          <!-- Live Job Target Card -->
          <div class="sjg-card">
            <div class="sjg-card-header">
              <span style="font-size: 11px; font-weight: 600; color: #94a3b8; display: flex; align-items: center;">
                <span class="sjg-red-dot"></span>
                Live Job Target (${escapeHtml(job.platform)}):
              </span>
              <span class="sjg-chars-badge">
                ⚡ ${displayChars > 0 
                    ? `Captured ${displayChars.toLocaleString()} chars body` 
                    : (job.title && job.title !== 'Select a Job on Indeed' 
                        ? `Target Active (${escapeHtml(job.company || 'Selected')})` 
                        : 'Waiting for job click')}
              </span>
            </div>
            <div class="sjg-job-title">${escapeHtml(job.title)}</div>
            <div class="sjg-job-sub">
              <span class="sjg-job-company">🏢 ${escapeHtml(job.company)}</span> • 
              <span>${escapeHtml(job.location)}</span>
            </div>
          </div>

          <!-- Candidate Profile Card (With Upload Resume, Save, Clear, Edit, Expand) -->
          <div class="sjg-card">
            <div class="sjg-card-header">
              <span style="font-size: 11px; font-weight: 700; color: #cbd5e1; display: flex; align-items: center; gap: 5px;">
                📄 Candidate Profile
              </span>
              <div class="sjg-candidate-actions">
                <button id="sjg-upload-resume-btn" class="sjg-btn-upload" title="Upload Resume (.pdf, .docx, .txt, .json)">
                  📤 Upload Resume
                </button>
                <button id="sjg-quick-save-btn" class="sjg-btn-upload" style="background:#059669; border-color:#10b981;" title="Save current candidate profile and re-evaluate">
                  💾 Save
                </button>
                <button id="sjg-clear-btn" class="sjg-btn-link" title="Clear Profile">🗑️ Clear</button>
                <button id="sjg-edit-btn" class="sjg-btn-link" title="Edit Profile">✏️ Edit</button>
                <button id="sjg-expand-btn" class="sjg-btn-link expand">
                  ${isCandidateExpanded ? 'Collapse ∧' : 'Expand ∨'}
                </button>
              </div>
            </div>
            <div class="sjg-cand-skills-text">
              <span class="sjg-cand-skills-label">Identified Skills (${candidateProfile.skills.length}): </span>
              ${candidateProfile.skills.length > 0 ? escapeHtml(candidateProfile.skills.join(', ')) : '<span style="color:#64748b;">No skills specified yet (Upload or Edit)</span>'}
            </div>

            ${isCandidateExpanded ? `
              <div class="sjg-cand-expand-box">
                <div><strong style="color:#fff;">Role:</strong> ${escapeHtml(candidateProfile.title)}</div>
                <div><strong style="color:#fff;">Experience:</strong> ${candidateProfile.yearsOfExperience} Years Relevant Domain</div>
                <div style="font-size:10px; color:#94a3b8; line-height:1.4;">${escapeHtml(candidateProfile.rawResumeText)}</div>
              </div>
            ` : ''}
          </div>

          <!-- Match Card -->
          <div class="sjg-match-card" style="border-color: ${evaluation.tierColor}66;">
            <div class="sjg-match-header" style="margin-bottom: 6px;">
              <div class="sjg-match-tier">
                <span style="color: ${evaluation.tierColor}; font-size:16px;">${evaluation.isAwaitingJob ? '🔍' : '✅'}</span>
                <span style="color: #ffffff; font-weight:800; font-size: 14px;">${evaluation.isAwaitingJob ? 'Ready for Job Selection' : `Smart Match — ${escapeHtml(evaluation.tierTitle)}`}</span>
              </div>
            </div>

            <div class="sjg-match-desc" style="font-weight: 700; color: #fff; margin-bottom: 5px;">
              ${evaluation.isAwaitingJob ? 'Click any job posting on Indeed to inspect full JD & fit score' : `Role Fit Score: ${evaluation.overallMatchScore}% ${escapeHtml(evaluation.tierTitle)}`}
            </div>
            
            <div class="sjg-match-inner">
              <div class="sjg-ring-box">
                <svg class="sjg-ring-svg" viewBox="0 0 54 54">
                  <circle cx="27" cy="27" r="22" stroke="#1e293b" stroke-width="4" fill="none" />
                  <circle cx="27" cy="27" r="22" stroke="${evaluation.tierColor}" stroke-width="4" fill="none"
                          stroke-dasharray="138" stroke-dashoffset="${evaluation.isAwaitingJob ? 138 : strokeDashoffset}" stroke-linecap="round" />
                </svg>
                <div class="sjg-ring-text">
                  <span class="sjg-ring-num" style="color:${evaluation.tierColor}; font-size: ${evaluation.isAwaitingJob ? '10px' : '14px'};">${evaluation.isAwaitingJob ? 'READY' : `${evaluation.overallMatchScore}%`}</span>
                </div>
              </div>
              <div class="sjg-match-inner-text">
                <div class="sjg-match-inner-title" style="font-size: 13px;">${evaluation.isAwaitingJob ? 'Awaiting Target JD' : (evaluation.overallMatchScore >= 75 ? 'Strong Alignment' : 'Transferable Match')}</div>
                <div class="sjg-match-inner-stats">
                  ${evaluation.isAwaitingJob 
                    ? `<span style="color:#94a3b8;">Candidate skills ready (${candidateProfile.skills.length})</span>`
                    : `Skills: <strong style="color:#34d399;">${evaluation.verifiedSkills.length}</strong> matched | Gaps: <strong style="color:#f59e0b;">${evaluation.missingSkillGaps.length}</strong>`}
                </div>
              </div>
            </div>
          </div>

          ${evaluation.isAwaitingJob ? `
            <div class="sjg-section-header">
              <span class="sjg-verified-label">✓ Candidate Core Skills Loaded</span>
              <span class="sjg-total-count">${candidateProfile.skills.length} Loaded</span>
            </div>
            <div class="sjg-chips-list">
              ${candidateProfile.skills.slice(0, 8).map(skill => `
                <div class="sjg-chip verified">
                  <span>•</span>
                  <span>${escapeHtml(skill)}</span>
                </div>
              `).join('')}
            </div>
            <div style="margin: 10px 0; padding: 12px; background: rgba(30, 41, 59, 0.4); border-radius: 8px; border: 1px dashed #334155; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.5;">
              👉 <strong>Click any job in Indeed's left list</strong> to parse its full description and see your exact fit score & matched skills!
            </div>
          ` : `
            <!-- Verified Skills -->
            <div class="sjg-section-header">
              <span class="sjg-verified-label">
                ✓ Verified Skills (Have it)
              </span>
              <span class="sjg-total-count">Total ${evaluation.verifiedSkills.length}</span>
            </div>
            <div class="sjg-chips-list">
              ${evaluation.verifiedSkills.map(skill => `
                <div class="sjg-chip verified">
                  <span>•</span>
                  <span>${escapeHtml(skill.name)}</span>
                </div>
              `).join('')}
            </div>

            <!-- Skill Gaps -->
            <div class="sjg-section-header">
              <span class="sjg-gaps-label">
                ⚠️ Skill Gaps (Missing)
              </span>
              <span class="sjg-total-count">Total ${evaluation.missingSkillGaps.length}</span>
            </div>
            <div class="sjg-chips-list">
              ${evaluation.missingSkillGaps.map(gap => `
                <div class="sjg-chip gap">
                  <span>•</span>
                  <span>${escapeHtml(gap.name)}</span>
                </div>
              `).join('')}
            </div>
          `}

          <!-- Bottom Action Buttons -->
          <div class="sjg-cover-letter-options" style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #333;">
            <div style="color: #bbb; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Generate Cover Letter</div>
            <button id="sjg-gen-pro-letter" class="sjg-btn" style="width: 100%; margin-bottom: 5px; padding: 6px; font-size: 12px; border-radius: 4px; background: #333; color: #fff; cursor: pointer;">
              ✉️ 3-Tier Professional
            </button>
            <button id="sjg-gen-exec-letter" class="sjg-btn" style="width: 100%; padding: 6px; font-size: 12px; border-radius: 4px; background: #222; color: #ffd700; border: 1px solid #ffd700; cursor: pointer;">
              👑 4-Tier Executive
            </button>
          </div>

          <button id="sjg-open-dashboard-btn" class="sjg-btn-executive" style="margin-top: 10px;">
            👑 Open in Executive Dashboard (PRO)
          </button>

          <button id="sjg-smart-pivot-btn" class="sjg-btn-pivot">
            ✨ 🌟 Smart Career Pivot Discovery (Cross-Domain Analysis)
          </button>

          <div class="sjg-buttons-row">
            <button id="sjg-cl-free-btn" class="sjg-btn-letter">
              ✉️ 3-Tier Cover Letter (Free)
            </button>
            <button id="sjg-cl-pro-btn" class="sjg-btn-faang">
              👑 👑 4-Tier FAANG Strategy (Pro)
            </button>
          </div>

        </div>

        <!-- Edit Candidate Overlay Sub-dialog -->
        ${isEditCandidateOpen ? `
          <div class="sjg-edit-overlay">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h4 style="color:#fff; font-size:13px; font-weight:800;">✏️ Edit Candidate Profile</h4>
              <button id="sjg-cancel-edit-btn" style="background:none; border:none; color:#64748b; font-size:16px; cursor:pointer;">✕</button>
            </div>
            <div class="sjg-input-group">
              <label>Job Title / Target Role:</label>
              <input id="sjg-edit-title" value="${escapeHtml(candidateProfile.title)}" />
            </div>
            <div class="sjg-input-group">
              <label>Years of Experience:</label>
              <input id="sjg-edit-exp" type="number" value="${candidateProfile.yearsOfExperience}" />
            </div>
            <div class="sjg-input-group">
              <label>Skills (Comma-separated):</label>
              <input id="sjg-edit-skills" value="${escapeHtml(candidateProfile.skills.join(', '))}" />
            </div>
            <div class="sjg-input-group">
              <label>Raw Resume / Highlights:</label>
              <textarea id="sjg-edit-resume" rows="4">${escapeHtml(candidateProfile.rawResumeText)}</textarea>
            </div>
            <div class="sjg-edit-actions">
              <button id="sjg-discard-edit-btn" class="sjg-btn-rescan">Cancel</button>
              <button id="sjg-save-edit-btn" class="sjg-btn-rescan" style="background:#059669; color:#fff; border-color:#10b981;">Save Profile</button>
            </div>
          </div>
        ` : ''}

      </div>
    `;

    // Bind event handlers inside Shadow DOM
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

    wrapper.querySelector('#sjg-rescan-btn')?.addEventListener('click', () => {
      cachedJobData = extractFullIndeedJob();
      renderShadowUI();
    });

    wrapper.querySelector('#sjg-toggle-buggy-btn')?.addEventListener('click', () => {
      isBuggyMode = !isBuggyMode;
      renderShadowUI();
    });

    wrapper.querySelector('#sjg-expand-btn')?.addEventListener('click', () => {
      isCandidateExpanded = !isCandidateExpanded;
      renderShadowUI();
    });

    // Upload Resume Button & File Input handler
    const fileInput = wrapper.querySelector('#sjg-resume-file-input');
    const uploadBtn = wrapper.querySelector('#sjg-upload-resume-btn');

    uploadBtn?.addEventListener('click', () => {
      if (fileInput) {
        fileInput.value = '';
        fileInput.click();
      }
    });

    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const text = loadEvent.target?.result;
        if (typeof text === 'string') {
          // Completely overwrite old candidate profile
          candidateProfile.name = file.name.replace(/\.[^/.]+$/, '');
          candidateProfile.title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          candidateProfile.targetRole = candidateProfile.title;
          candidateProfile.yearsOfExperience = 8;
          candidateProfile.rawResumeText = text.slice(0, 2000);
          
          const commonKeywords = [
            'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Go', 'Java',
            'AWS', 'GCP', 'Docker', 'Kubernetes', 'GraphQL', 'Next.js', 'SQL',
            'System Design', 'CI/CD', 'Microfrontends', 'Tailwind', 'DevOps',
            'Finance', 'Accounting', 'FP&A', 'Excel', 'Tableau', 'PowerBI',
            'SAP', 'Oracle', 'Budgeting', 'Forecasting', 'Auditing', 'GAAP', 'Financial Analysis'
          ];
          const found = commonKeywords.filter(k => new RegExp(`\\b${k}\\b`, 'i').test(text));
          candidateProfile.skills = found.length > 0 ? Array.from(new Set(found)) : ['Financial Analysis', 'Excel', 'SQL', 'GAAP'];
          saveProfileToStorage();

          if (uploadBtn) {
            uploadBtn.innerHTML = '✅ Uploaded!';
            setTimeout(() => {
              renderShadowUI();
            }, 1000);
          } else {
            renderShadowUI();
          }
        }
      };
      reader.readAsText(file);
    });

    wrapper.querySelector('#sjg-quick-save-btn')?.addEventListener('click', () => {
      saveProfileToStorage();
      const btn = wrapper.querySelector('#sjg-quick-save-btn');
      if (btn) {
        btn.innerText = '✅ Saved & Updated!';
        setTimeout(() => {
          btn.innerText = '💾 Save';
        }, 1800);
      }
      renderShadowUI();
    });

    wrapper.querySelector('#sjg-clear-btn')?.addEventListener('click', () => {
      if (confirm('Clear current candidate profile completely?')) {
        candidateProfile.name = 'Candidate (Cleared)';
        candidateProfile.title = 'General Applicant';
        candidateProfile.targetRole = 'Target Role';
        candidateProfile.yearsOfExperience = 0;
        candidateProfile.skills = [];
        candidateProfile.rawResumeText = '';
        saveProfileToStorage();
        renderShadowUI();
      }
    });

    wrapper.querySelector('#sjg-edit-btn')?.addEventListener('click', () => {
      isEditCandidateOpen = true;
      renderShadowUI();
    });

    wrapper.querySelector('#sjg-cancel-edit-btn')?.addEventListener('click', () => {
      isEditCandidateOpen = false;
      renderShadowUI();
    });

    wrapper.querySelector('#sjg-discard-edit-btn')?.addEventListener('click', () => {
      isEditCandidateOpen = false;
      renderShadowUI();
    });

    wrapper.querySelector('#sjg-save-edit-btn')?.addEventListener('click', () => {
      const newTitle = wrapper.querySelector('#sjg-edit-title')?.value || candidateProfile.title;
      const newExp = parseInt(wrapper.querySelector('#sjg-edit-exp')?.value || '0', 10);
      const newSkills = (wrapper.querySelector('#sjg-edit-skills')?.value || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const newResume = wrapper.querySelector('#sjg-edit-resume')?.value || candidateProfile.rawResumeText;

      candidateProfile.title = newTitle;
      candidateProfile.yearsOfExperience = newExp;
      candidateProfile.skills = newSkills;
      candidateProfile.rawResumeText = newResume;
      saveProfileToStorage();
      isEditCandidateOpen = false;
      renderShadowUI();
    });

    // Action buttons
    const remoteDashboardUrl = 'https://ais-dev-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app';

    wrapper.querySelector('#sjg-open-dashboard-btn')?.addEventListener('click', () => {
      window.open(remoteDashboardUrl, '_blank');
    });

    wrapper.querySelector('#sjg-smart-pivot-btn')?.addEventListener('click', () => {
      // If low match score, pivot to Indeed search for the target role instead of dashboard
      if (evaluation.overallMatchScore < 60) {
        const pivotQuery = encodeURIComponent(candidateProfile.targetRole || 'Software Engineer');
        window.open(`https://www.indeed.com/jobs?q=${pivotQuery}`, '_blank');
      } else {
        window.open(`${remoteDashboardUrl}?tab=pivot`, '_blank');
      }
    });

    wrapper.querySelector('#sjg-cl-free-btn')?.addEventListener('click', () => {
      const cl = `Dear Hiring Team at ${job.company},\n\nI am writing to express my strong interest in the ${job.title} position.\n\nSincerely,\n${candidateProfile.name}`;
      navigator.clipboard.writeText(cl);
      const btn = wrapper.querySelector('#sjg-cl-free-btn');
      if (btn) {
        btn.innerText = '✅ Copied!';
        setTimeout(() => { btn.innerText = '✉️ 3-Tier Cover Letter (Free)'; }, 2000);
      }
    });

    wrapper.querySelector('#sjg-cl-pro-btn')?.addEventListener('click', () => {
      window.open(`${remoteDashboardUrl}?tab=coverletter`, '_blank');
    });

    // Launch Fireworks Celebration if Score >= 90% (like FAANG top tier celebration)
    if (evaluation.overallMatchScore >= 90 && isModalOpen) {
      const currentJobId = `${job.title}::${job.company}::${evaluation.overallMatchScore}`;
      if (lastFireworksJobKey !== currentJobId) {
        lastFireworksJobKey = currentJobId;
        setTimeout(() => {
          launchCelebrationFireworks(wrapper.querySelector('#sjg-fireworks-canvas'));
        }, 150);
      }
    }
    } catch (err) {
      console.error('[SuperJobGenie] renderShadowUI error:', err);
    }
  }

  /**
   * Fireworks Particle Engine for >=90% Exceptional Match
   */
  function launchCelebrationFireworks(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (fireworkAnimId) {
      cancelAnimationFrame(fireworkAnimId);
      fireworkAnimId = null;
    }

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 420;
    canvas.height = rect.height || 600;

    const colors = ['#38bdf8', '#34d399', '#f59e0b', '#ec4899', '#a855f7', '#60a5fa', '#fbbf24', '#ffffff'];
    const particles = [];

    // Create 3 burst origins
    const burstCenters = [
      { x: canvas.width * 0.5, y: 140 },
      { x: canvas.width * 0.25, y: 190 },
      { x: canvas.width * 0.75, y: 170 }
    ];

    burstCenters.forEach(burst => {
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        particles.push({
          x: burst.x,
          y: burst.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          size: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          gravity: 0.12
        });
      }
    });

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      for (let p of particles) {
        if (p.alpha > 0) {
          aliveCount++;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.alpha -= p.decay;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      if (aliveCount > 0) {
        fireworkAnimId = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fireworkAnimId = null;
      }
    }

    frame();
  }

  /**
   * Main Check & Auto-Rescan Trigger (Auto-scans whenever user clicks or navigates to a new job)
   */
  let lastJobKey = '';
  let lastBodyLength = 0;
  let lastHadRealBody = false;

  function checkAndAutoRescan(forceRescan = false) {
    if (isEditCandidateOpen) return; // Guard: Prevent auto-rescan while editing
    
    const job = extractFullIndeedJob();
    const currentJobKey = `${job.title}::${job.company}::${job.jk || ''}`;
    const hasSubstantialBody = Boolean(job.fullBodyText && job.characterCount >= 80);

    // Decision logic:
    // 1. Force rescan requested (e.g. user clicked Rescan button or popstate)
    // 2. The job identity (title/company/jk) changed
    // 3. Previously we didn't have the real body text, but now it has finished loading!
    // 4. The body grew or changed by >= 30 chars
    const jobChanged = currentJobKey !== lastJobKey;
    const bodyNewlyArrived = !lastHadRealBody && hasSubstantialBody;
    const bodySignificantlyExpanded = Math.abs(job.characterCount - lastBodyLength) >= 30;

    if (!forceRescan && !jobChanged && !bodyNewlyArrived && !bodySignificantlyExpanded) {
      return;
    }

    lastJobKey = currentJobKey;
    lastBodyLength = job.characterCount;
    lastHadRealBody = hasSubstantialBody;
    cachedJobData = job;

    console.log('[SuperJobGenie] Rescanned job:', job.title, 'at', job.company, 'Chars:', job.characterCount, 'hasRealBody:', hasSubstantialBody);

    // Debounce the actual DOM rebuild: if another rescan lands within 250ms
    // (e.g. Indeed's Schema.org data and full DOM text arriving moments apart),
    // only the last one triggers renderShadowUI(), avoiding a double rebuild/flicker.
    if (renderDebounceTimer) clearTimeout(renderDebounceTimer);
    renderDebounceTimer = setTimeout(() => {
      renderDebounceTimer = null;
      renderShadowUI();
    }, 250);
  }

  // Handle ESC key globally
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
      if (isEditCandidateOpen) {
        isEditCandidateOpen = false;
      } else {
        isModalOpen = false;
      }
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

  // Execute immediately to paint the floating pill without blocking
  renderShadowUI();

  // Then perform extraction and update UI
  try {
    const initialJob = extractFullIndeedJob();
    cachedJobData = initialJob;
    hasAutoPoppedForJobKey = `${initialJob.title}::${initialJob.company}::${initialJob.characterCount}`;
    renderShadowUI();
  } catch (err) {
    console.error('[SuperJobGenie] Initial scan error:', err);
  }

  // 1. Auto-rescan on SPA URL changes
  window.addEventListener('popstate', () => {
    setTimeout(() => checkAndAutoRescan(true), 150);
    setTimeout(() => checkAndAutoRescan(true), 600);
  });
  window.addEventListener('hashchange', () => {
    setTimeout(() => checkAndAutoRescan(true), 150);
    setTimeout(() => checkAndAutoRescan(true), 600);
  });

  // 2. Auto-rescan on Click Delegation (When clicking job cards in the left list on Indeed)
  document.addEventListener('click', (e) => {
    // If the click is inside our own extension UI, don't trigger
    if (e.target && (e.target.closest('#sjg-shadow-host-root') || e.target.id === 'sjg-shadow-host-root')) {
      return;
    }
    // Check if user clicked a job card or link in Indeed/LinkedIn/Glassdoor
    const jobItem = e.target.closest('li, a, div[data-jk], div.job_seen_beacon, .tapItem, .jobsearch-ResultsList, div.cardOutline, h2.jobTitle');
    if (jobItem) {
      const cardEl = jobItem.closest('div.job_seen_beacon, div[data-jk], li, div.cardOutline') || jobItem;
      const t = cardEl.querySelector('a.jcs-JobTitle, h2.jobTitle span[title], h2.jobTitle, a[id^="job_"]')?.innerText?.replace(/^new\s+/i, '')?.trim();
      const c = cardEl.querySelector('[data-testid="company-name"], .companyName, span.css-63koeb')?.innerText?.trim();
      const jk = cardEl.getAttribute('data-jk') || cardEl.querySelector('[data-jk]')?.getAttribute('data-jk') || '';
      if (t && !isSearchHeader(t)) {
        lastClickedCard = { title: t, company: c || '', jk: jk || '' };
        console.log('[SuperJobGenie] User clicked card:', t, 'at', c);
      }
    }
    // Timeout polling sequence to guarantee catching Indeed's async right pane
    const timeouts = [40, 150, 350, 700, 1200, 1800, 2600, 3600];
    timeouts.forEach(delay => {
      setTimeout(() => checkAndAutoRescan(), delay);
    });
  }, true);

  // 3. MutationObserver on document.body (Never unmounts, catches all React/SPA view swaps)
  let paneObserverTimeout = null;
  const bodyObserver = new MutationObserver(() => {
    if (paneObserverTimeout) clearTimeout(paneObserverTimeout);
    paneObserverTimeout = setTimeout(() => {
      checkAndAutoRescan();
    }, 250);
  });

  if (document.body) {
    bodyObserver.observe(document.body, { childList: true, subtree: true });
  }

  // 4. Heartbeat Safety Net (Every 800ms, ultra-lightweight check to guarantee 100% responsiveness)
  setInterval(() => {
    checkAndAutoRescan();
  }, 800);

})();
