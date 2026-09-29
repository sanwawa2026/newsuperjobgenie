/**
 * SuperJobGenie Chrome Extension - Content Script (v2.7.1)
 * Optimized for Smooth HUD Rendering and Responsiveness
 */

(function () {
  'use strict';

  // Prevent duplicate script execution
  if (window.__SUPER_JOB_GENIE_INITIALIZED__ || document.getElementById('sjg-shadow-host-root')) {
    return;
  }
  window.__SUPER_JOB_GENIE_INITIALIZED__ = true;

  console.log('[SuperJobGenie v2.7.1] Optimized HUD initialized');

  // Candidate Profile State
  let candidateProfile = {
    name: 'Candidate Profile',
    title: 'Financial & Quantitative Analyst',
    targetRole: 'Finance Transformation Analyst',
    yearsOfExperience: 3,
    skills: ['Python', 'SQL', 'Finance', 'Accounting', 'Excel', 'Financial Analysis'],
    rawResumeText: 'Results-driven Master of Science in Finance with solid quantitative modeling, financial analysis, and capital market research capabilities. Proficient in Python, SQL, Excel, and corporate finance.'
  };

  // Hydrate candidate profile
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
  let shadowRoot = null;
  let hostContainer = null;
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

  function isSearchHeader(str) {
    if (!str) return true;
    const s = str.trim().toLowerCase();
    return s.includes(' jobs in ') || 
           s.includes(' jobs near ') || 
           s.includes(' jobs, employment') || 
           s.includes(' jobs available in ') || 
           s.startsWith('jobs in ');
  }

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

    try {
      const urlParams = new URLSearchParams(window.location.search);
      jk = urlParams.get('vjk') || urlParams.get('jk') || '';
    } catch (e) {}

    // Channel 1: Schema.org JSON-LD
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

    // Channel 2: Native DOM Traversal Patch
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

    // Channel 3 & 4 (Simplified for performance)
    if (!fullBodyText) {
        const activeCard = document.querySelector('div.job_seen_beacon[aria-current="true"], li[aria-current="true"], div[data-jk].selected, div.cardOutline.selected');
        if (activeCard) {
            const tEl = activeCard.querySelector('a.jcs-JobTitle, h2.jobTitle span[title], h2.jobTitle, a[id^="job_"]');
            if (tEl && !isSearchHeader(tEl.innerText)) title = tEl.innerText.replace(/^new\s+/i, '').trim();
            const cEl = activeCard.querySelector('[data-testid="company-name"], .companyName, span.css-63koeb');
            if (cEl) company = cEl.innerText.trim();
        }
    }

    return {
      title: title || lastClickedCard?.title || 'Select a Job',
      company: company || lastClickedCard?.company || 'Click to Inspect',
      location,
      salary,
      fullBodyText,
      characterCount: fullBodyText ? fullBodyText.length : 0,
      platform,
      jk
    };
  }

  /**
   * Evaluate Job Match
   */
  function evaluateJobMatch(jobData, cand) {
    const isUnselected = !jobData || !jobData.title || jobData.title === 'Select a Job';
    const hasBody = Boolean(jobData?.fullBodyText && jobData.fullBodyText.length >= 80);
    const combinedText = ((jobData?.title || '') + ' ' + (jobData?.company || '') + ' ' + (jobData?.fullBodyText || '')).toLowerCase();
    const candSkills = cand.skills || [];

    if (isUnselected) {
      return {
        overallMatchScore: 0,
        matchHeadline: '👉 Click a job to scan.',
        verifiedSkills: [],
        missingSkillGaps: [],
        isAwaitingJob: true
      };
    }

    if (!hasBody) {
      return {
        overallMatchScore: 0,
        matchHeadline: '⏳ Parsing job requirements…',
        isAwaitingJob: false,
        isScanning: true
      };
    }

    const catalogSkills = [
      { name: 'TypeScript & JavaScript', key: 'typescript' },
      { name: 'React & Frontend Frameworks', key: 'react' },
      { name: 'Node.js & Backend Services', key: 'node' },
      { name: 'System Design & Scalability', key: 'system design' },
      { name: 'SQL & Database Modeling', key: 'sql' },
      { name: 'Python & Data Analysis', key: 'python' },
      { name: 'AWS & Cloud Infrastructure', key: 'aws' },
      { name: 'CI/CD & DevOps Automation', key: 'ci/cd' },
      { name: 'Financial Modeling & Forecasting', key: 'financ' },
      { name: 'Accounting & GAAP Standards', key: 'account' },
      { name: 'Advanced Excel & Data Analytics', key: 'excel' },
      { name: 'FP&A & Budget Management', key: 'budget' },
      { name: 'Tableau / PowerBI Visualization', key: 'tableau' },
      { name: 'SAP / ERP Transformation', key: 'sap' },
      { name: 'Audit & Internal Controls', key: 'audit' },
      { name: 'Stakeholder & Cross-Functional PMO', key: 'stakeholder' }
    ];

    let detectedJdSkills = catalogSkills.filter(item => {
      const regex = new RegExp(`\\b${item.key}`, 'i');
      return regex.test(combinedText);
    });
    
    let verifiedSkills = [];
    let missingSkillGaps = [];

    detectedJdSkills.forEach(reqSkill => {
      const hasSkill = candSkills.some(s => 
        s.toLowerCase().includes(reqSkill.key) || reqSkill.name.toLowerCase().includes(s.toLowerCase())
      );
      
      if (hasSkill) {
        verifiedSkills.push(reqSkill);
      } else {
        missingSkillGaps.push(reqSkill);
      }
    });

    const totalDetected = detectedJdSkills.length;
    let overallMatchScore;
    if (totalDetected === 0) {
      overallMatchScore = 65;
    } else if (missingSkillGaps.length === 0) {
      overallMatchScore = 95;
    } else {
      const ratio = verifiedSkills.length / totalDetected;
      overallMatchScore = Math.max(45, Math.round(ratio * 80));
    }

    return {
      overallMatchScore,
      matchHeadline: `${overallMatchScore}% Match for ${cand.title}`,
      verifiedSkills,
      missingSkillGaps,
      isAwaitingJob: false,
      isScanning: false
    };
  }

  /**
   * Minimalist HUD Rendering
   */
  function renderShadowUI() {
    const sRoot = getOrCreateShadowRoot();
    if (!sRoot) return;

    const job = cachedJobData || extractFullIndeedJob();
    const evaluation = evaluateJobMatch(job, candidateProfile);

    // Simple, direct structure
    sRoot.innerHTML = `
      <style>
        #sjg-host { position: fixed; bottom: 20px; right: 20px; z-index: 2147483647; font-family: sans-serif; }
        .sjg-hud { width: 360px; background: #000; color: #fff; padding: 15px; border-radius: 12px; border: 1px solid #333; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
        .sjg-score { font-size: 24px; font-weight: bold; color: #34d399; }
        .sjg-skill { display: inline-block; padding: 3px 8px; border-radius: 4px; background: #222; font-size: 12px; margin: 2px; }
      </style>
      <div id="sjg-host">
        <div class="sjg-hud">
          <div style="display:flex; justify-content:space-between;">
            <div>
              <div style="color:#aaa; font-size:11px;">SUPERJOBGENIE</div>
              <div style="font-weight:bold;">${evaluation.matchHeadline}</div>
            </div>
            <div class="sjg-score">${evaluation.overallMatchScore}%</div>
          </div>
          <div style="margin-top:10px;">
            ${evaluation.verifiedSkills.map(s => `<span class="sjg-skill" style="color:#34d399">✓ ${s.name}</span>`).join('')}
            ${evaluation.missingSkillGaps.map(s => `<span class="sjg-skill" style="color:#f59e0b">⚠ ${s.name}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function getOrCreateShadowRoot() {
    let host = document.getElementById('sjg-shadow-host-root');
    if (!host) {
      host = document.createElement('div');
      host.id = 'sjg-shadow-host-root';
      document.body.appendChild(host);
    }
    return host.shadowRoot || host.attachShadow({ mode: 'open' });
  }

  // Auto-scan loop
  setInterval(() => {
    const newJobData = extractFullIndeedJob();
    if (JSON.stringify(newJobData) !== JSON.stringify(cachedJobData)) {
      cachedJobData = newJobData;
      renderShadowUI();
    }
  }, 1000);

  renderShadowUI();
})();
