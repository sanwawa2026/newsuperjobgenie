/**
 * SuperJobGenie Chrome Extension - Content Script (v2.9.8 Pro)
 * Industrial-grade Shadow DOM Isolation + Floating Executive HUD + Full Resume Ingestion Engine
 * Zero Center Blocking · Single Instance · Accurate Domain Skill Alignment
 * Universal Multi-Platform Engine: Indeed (Global), Glassdoor (US/UK), ZipRecruiter (US/UK/CA), LinkedIn, Workday, Greenhouse, Lever
 */

(function () {
  'use strict';

  // Prevent duplicate script execution or multi-frame stacking
  if (window.__SUPER_JOB_GENIE_INITIALIZED__ || document.getElementById('sjg-shadow-host-root')) {
    return;
  }
  window.__SUPER_JOB_GENIE_INITIALIZED__ = true;

  console.log('[SuperJobGenie v2.9.8 Pro] Executive HUD initialized on:', window.location.href);

  // Candidate Profile State (Default starts neutral/fresh, hydrated from storage)
  let candidateProfile = {
    name: 'Candidate Profile',
    title: 'Senior Software Engineer & Systems Architect',
    targetRole: 'Senior Software Engineer / Tech Lead',
    yearsOfExperience: 10,
    skills: [
      'Java', 'Python', 'Go', 'JavaScript', 'TypeScript', 'Node.js', 'C++', 'SQL',
      'Spring Boot', 'React', 'Docker', 'Kubernetes', 'AWS', 'CI/CD',
      'Microservices', 'Distributed Systems', 'Redis', 'MySQL', 'PostgreSQL',
      'High Concurrency', 'System Design', 'Unit Testing', 'Agile'
    ],
    rawResumeText: ''
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
   * Detect current job platform
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
           s.startsWith('jobs in ') ||
           s.includes('frequently asked questions') ||
           s.includes('people also ask') ||
           s.includes('related searches') ||
           s.includes('hiring insights') ||
           s.includes('job details') ||
           s.includes('full job description') ||
           s.includes('about the company') ||
           s.includes('company overview') ||
           s === 'job description' ||
           s === 'overview' ||
           s === 'faq' ||
           s === 'faqs';
  }

  function isJunkCompany(str) {
    if (!str) return true;
    const s = str.trim().toLowerCase();
    if (s.length < 2 || s.length > 85) return true;
    if (isSearchHeader(s)) return true;
    const junkTerms = [
      'frequently asked questions',
      'job details',
      'full job description',
      'apply now',
      'apply on company site',
      'save job',
      'hiring insights',
      'about us',
      'overview',
      'ratings',
      'reviews',
      'compensation',
      'location',
      'salary',
      'abotts'
    ];
    return junkTerms.some(t => s === t || s.includes(t));
  }

  let lastClickedCard = null;

  /**
   * Deep Extractor: Un-scoped Multi-Channel Extraction
   */
  function extractFullIndeedJob() {
    const platform = detectPlatform();
    let title = '';
    let company = '';
    let location = platform === 'Glassdoor' ? 'London, UK • On-site / Hybrid' : 'On-site / Hybrid';
    let salary = '';
    let fullBodyText = '';
    let extractionSource = `${platform} Dynamic Engine`;
    let isSchemaOrg = false;
    let jk = '';
    let foundJdEl = null;

    // 1. Get jobKey from URL if available
    try {
      const urlParams = new URLSearchParams(window.location.search);
      jk = urlParams.get('vjk') || urlParams.get('jk') || urlParams.get('jobId') || '';
    } catch (e) {}

    // 2. Identify Active Job Pane / Container (Right side details pane across platforms)
    const activePane = 
      // Indeed
      document.querySelector('.jobsearch-JobComponent') ||
      document.querySelector('[data-testid="jobsearch-JobComponent"]') ||
      document.querySelector('.jobsearch-RightPane') ||
      document.querySelector('#jobsearch-ViewjobPaneWrapper') ||
      document.querySelector('[data-testid="jobsearch-ViewJobLayout"]') ||
      document.querySelector('#vjs-container') ||
      // Glassdoor Right Details Pane
      document.querySelector('[data-test="job-details"]') ||
      document.querySelector('[data-brandviews="PAGE:job-details"]') ||
      document.querySelector('[data-test="jobDetails"]') ||
      document.querySelector('#JobDetails') ||
      document.querySelector('[class*="JobDetails_jobDetailsContainer"]') ||
      document.querySelector('[class*="JobDetails_container"]') ||
      document.querySelector('[class*="jobDetails"]') ||
      document.querySelector('div[aria-label*="Job Details"]') ||
      document.querySelector('div[aria-label*="Job details"]') ||
      // ZipRecruiter Details Pane / Main Container
      document.querySelector('[data-testid="job-details"]') ||
      document.querySelector('.job_details') ||
      document.querySelector('[class*="job_details"]') ||
      document.querySelector('[class*="jobDetails"]') ||
      document.querySelector('.job_description_container') ||
      document.querySelector('.job_content') ||
      document.querySelector('article.job_description') ||
      document.querySelector('main#main') ||
      // LinkedIn
      document.querySelector('.jobs-search__job-details') ||
      document.querySelector('.jobs-details') ||
      document.querySelector('.job-view-layout') ||
      document.querySelector('.jobs-search-results-list__list-item--active') ||
      document.querySelector('.job-details-jobs-unified-top-card__container--two-pane') ||
      document.querySelector('.jobs-description') ||
      // Fallback
      document.querySelector('.fastviewjob') ||
      document;

    // 3. Channel 1: Native Live DOM Traversal (Right pane + Document-wide multi-candidate traversal)
    const candidateSelectors = [
      // Indeed (All locales: US, ES, UK, FR, DE, IT, JP, etc.)
      '#jobDescriptionText',
      '[data-testid="jobDescriptionText"]',
      '.jobsearch-jobDescriptionText',
      '.jobsearch-JobComponent-description',
      '[data-testid="jobsearch-JobDescriptionSection"]',
      'div[data-segment-label="JobDescription"]',
      '#jobDescriptionTitle ~ div',
      '#jobDescriptionTitle + div',
      // Glassdoor
      '[data-test="jobDescriptionText"]',
      '[data-test="job-description"]',
      '[data-test="job-description-content"]',
      '[class*="JobDetails_jobDescription"]',
      '[class*="JobDetails_jobDescriptionText"]',
      '[class*="DescStyles_desc"]',
      '[class*="DescStyles_descriptionContainer"]',
      '[class*="JobDetails_desc"]',
      '#JobDescriptionContainer',
      '.jobDescriptionContent',
      '[class*="jobDescription"]',
      // ZipRecruiter
      '.job_description',
      '[data-testid="job-description"]',
      '.jobDescriptionSection',
      '.jobDescriptionContent',
      '[class*="job_description"]',
      '[class*="jobDescription"]',
      'div[itemprop="description"]',
      '#job_desc',
      '.job-description-content',
      '.job_details',
      // LinkedIn
      '.jobs-description-content',
      '.jobs-description-content__text',
      '.jobs-description',
      'div#job-details',
      '#job-details',
      '.jobs-box__html-content',
      '.jobs-unified-description__content',
      '[data-testid="job-details"]'
    ];

    // Priority 1: Check active pane first
    for (const sel of candidateSelectors) {
      const el = activePane.querySelector(sel);
      if (el) {
        const txt = (el.innerText || el.textContent || '').trim();
        if (txt.length > 80) {
          fullBodyText = txt;
          foundJdEl = el;
          extractionSource = `${platform} DOM Active`;
          break;
        }
      }
    }

    // Priority 2: Document-wide candidate traversal (handles multi-instance or split views)
    if (!fullBodyText || fullBodyText.length < 80) {
      for (const sel of candidateSelectors) {
        const els = document.querySelectorAll(sel);
        for (const el of els) {
          const txt = (el.innerText || el.textContent || '').trim();
          if (txt.length > 80) {
            fullBodyText = txt;
            foundJdEl = el;
            extractionSource = `${platform} DOM Global`;
            break;
          }
        }
        if (fullBodyText && fullBodyText.length > 80) break;
      }
    }

    // 4. Channel 2: Multi-lingual Heading Anchor & Container Fallbacks (ES, EN, FR, DE, IT, PT, JP)
    if (!fullBodyText || fullBodyText.length < 80) {
      const isJdHeading = (txt) => {
        if (!txt || txt.length > 70) return false;
        return /^(?:full\s+)?job\s+description|^about\s+the\s+(?:role|job)|^what\s+we(?:'re|\s+are)\s+looking\s+for|descripci[oó]n\s+(?:completa\s+)?del\s+(?:empleo|puesto)|detalles\s+del\s+empleo|description\s+(?:du|compl[eè]te\s+du)\s+poste|stellenbeschreibung|vollst[aä]ndige\s+stellenbeschreibung|descrizione\s+(?:completa\s+dell['’]offerta|del\s+lavoro)|descri[cç][aã]o\s+(?:completa\s+)?da\s+vaga|仕事内容|職務内容/i.test(txt.trim());
      };

      const scopes = [activePane, document.body].filter(Boolean);
      for (const scope of scopes) {
        const allHeadings = scope.querySelectorAll('h1, h2, h3, h4, div, span, p');
        for (const h of allHeadings) {
          const txt = (h.textContent || '').trim();
          if (isJdHeading(txt)) {
            // Traversal A: Next sibling
            let sib = h.nextElementSibling;
            while (sib) {
              const raw = (sib.innerText || sib.textContent || '').trim();
              if (raw.length > 80) {
                fullBodyText = raw;
                extractionSource = `${platform} Heading Sibling`;
                foundJdEl = sib;
                break;
              }
              sib = sib.nextElementSibling;
            }

            // Traversal B: Parent's next sibling (e.g. <div id="jobDescriptionTitle"><h2>...</h2></div> -> <div id="jobDescriptionText">...</div>)
            if (!fullBodyText && h.parentElement?.nextElementSibling) {
              const pSib = h.parentElement.nextElementSibling;
              const raw = (pSib.innerText || pSib.textContent || '').trim();
              if (raw.length > 80) {
                fullBodyText = raw;
                extractionSource = `${platform} Heading Parent Sibling`;
                foundJdEl = pSib;
                break;
              }
            }

            // Traversal C: Closest container block
            if (!fullBodyText && h.parentElement) {
              const container = h.closest('.jobsearch-JobComponent-description, .jobsearch-JobComponent, section, article, div[class*="JobDetails"], div[class*="jobsearch"], div[data-testid*="job"]');
              if (container) {
                const cRaw = (container.innerText || container.textContent || '').trim();
                if (cRaw.length > 120) {
                  fullBodyText = cRaw;
                  extractionSource = `${platform} Heading Block`;
                  foundJdEl = container;
                  break;
                }
              }
            }
          }
          if (fullBodyText && fullBodyText.length > 80) break;
        }
        if (fullBodyText && fullBodyText.length > 80) break;
      }
    }

    // 5. Channel 3: Iframe Fallback
    if (!fullBodyText || fullBodyText.length < 100) {
      const iframes = document.querySelectorAll('iframe');
      for (const iframe of iframes) {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc) {
            const el = doc.querySelector('#jobDescriptionText, [data-testid="jobDescriptionText"], [data-test="job-description"], [class*="JobDetails_jobDescription"]');
            if (el) {
              const raw = (el.innerText || el.textContent || '').trim();
              if (raw.length > 100) {
                fullBodyText = raw;
                foundJdEl = el;
                extractionSource = `${platform} Iframe`;
                break;
              }
            }
          }
        } catch (e) {}
      }
    }

    // 6. Channel 4: Schema.org JSON-LD
    if (!fullBodyText) {
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const script of jsonLdScripts) {
        try {
          const parsed = JSON.parse(script.textContent || '{}');
          const items = Array.isArray(parsed) ? parsed : [parsed];
          for (const item of items) {
            if (item && item['@type'] === 'JobPosting' && item.description && item.description.length > 100) {
              if (item.title && !isSearchHeader(item.title)) title = item.title;
              if (item.hiringOrganization?.name) company = item.hiringOrganization.name;
              if (item.jobLocation?.address?.addressLocality) location = `${item.jobLocation.address.addressLocality} • Active`;
              if (item.baseSalary?.value?.value) salary = `$${item.baseSalary.value.value}`;
              
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = item.description;
              fullBodyText = tempDiv.innerText.trim();
              extractionSource = `${platform} Schema.org`;
              break;
            }
          }
        } catch (e) {}
        if (fullBodyText) break;
      }
    }

    // 7. Dedicated Header Area Resolution (STRICTLY outside #jobDescriptionText)
    const headerContainer = 
      // Indeed
      activePane.querySelector('.jobsearch-JobInfoHeader, [data-testid="jobsearch-JobInfoHeader"], .jobsearch-JobComponent-header, .jobsearch-DesktopStickyContainer, [data-testid="jobsearch-ViewJobTopCard"]') || 
      // Glassdoor Top Card Area
      activePane.querySelector('[data-test="job-details-header"], [class*="JobDetails_jobDetailsHeader"], [class*="JobDetails_header"], header') ||
      // ZipRecruiter Header Area
      activePane.querySelector('.job_header, [class*="job_header"], [class*="jobHeader"], .hiring_details') ||
      activePane;

    // 8. Extract Title ONLY from Header Area
    const titleSelectors = [
      // ZipRecruiter
      'h1.job_title',
      '[data-testid="job-title"]',
      'h1[class*="job_title"]',
      'h1[class*="jobTitle"]',
      '[class*="job_title"]',
      '[class*="jobTitle"]',
      // Glassdoor
      '[data-test="job-title"]',
      '[data-test="jobTitle"]',
      '[data-test="heading-title"]',
      'h1[data-test="jobTitle"]',
      'h1[data-test="job-title"]',
      '[class*="JobDetails_jobTitle"]',
      '[class*="JobDetails_heading"]',
      '[class*="heading-title"]',
      // Indeed
      '[data-testid="jobsearch-JobInfoHeader-title"]',
      'h1.jobsearch-JobInfoHeader-title',
      'h2.jobsearch-JobInfoHeader-title',
      '.jobsearch-JobInfoHeader-title',
      'h1[data-cy="jobTitle"]',
      'h1.jobTitle',
      'h1[class*="JobInfoHeader"]',
      // LinkedIn
      '.job-details-jobs-unified-top-card__job-title',
      '.jobs-unified-top-card__job-title',
      'h1.job-details-jobs-unified-top-card__job-title',
      'h2.job-details-jobs-unified-top-card__job-title',
      '.jobs-details__main-content h1',
      '.jobs-details__main-content h2',
      '.jobs-search__job-details h1',
      '.jobs-search__job-details h2',
      'h1.t-24',
      // Generic
      'h1'
    ];

    if (headerContainer) {
      for (const sel of titleSelectors) {
        const el = headerContainer.querySelector(sel);
        if (el && !el.closest('#jobDescriptionText, [data-testid="jobDescriptionText"], [data-test="job-description"]') && el.innerText.trim()) {
          const clean = el.innerText.replace(/^new\s+/i, '').trim();
          if (!isSearchHeader(clean) && clean.length > 2 && clean.length < 120) {
            title = clean;
            break;
          }
        }
      }
    }

    // Trust clicked card title if header search yielded nothing
    if (!title && lastClickedCard?.title) {
      title = lastClickedCard.title;
    }

    // 9. Extract Company ONLY from Header Area
    const compSelectors = [
      // ZipRecruiter
      'a.hiring_company_text',
      '[data-testid="company-name"]',
      '[data-testid="hiring-company"]',
      'a[class*="company_name"]',
      'span[class*="company_name"]',
      'div[class*="hiring_company"]',
      '[class*="hiring_company_text"]',
      'a.t_company',
      '[itemprop="hiringOrganization"]',
      'span.company_name',
      // Glassdoor
      '[data-test="employer-name"]',
      '[data-test="employerName"]',
      '[class*="JobDetails_companyName"]',
      '[class*="EmployerProfile_employerName"]',
      '[class*="EmployerProfile_compactEmployerName"]',
      '[class*="employerName"]',
      '[data-test="employer-title"]',
      'h4[data-test="employer-name"]',
      'span[class*="EmployerProfile"]',
      // Indeed
      '[data-testid="inlineHeader-companyName"]',
      '[data-company-name="true"]',
      'a[href*="/cmp/"]',
      '[data-testid="jobsearch-CompanyInfoContainer"]',
      '.jobsearch-CompanyInfoContainer',
      '.jobsearch-InlineCompanyRating-companyHeader a',
      '.jobsearch-InlineCompanyRating-companyHeader',
      'a[data-cy="companyName"]',
      '.company-name',
      '#vjs-cn',
      // LinkedIn
      '.job-details-jobs-unified-top-card__company-name',
      '.jobs-unified-top-card__company-name',
      'a.job-details-jobs-unified-top-card__company-name',
      'a.jobs-unified-top-card__company-name',
      '.job-details-jobs-unified-top-card__primary-description a',
      '.jobs-unified-top-card__primary-description a',
      'a.jobs-details-top-card__company-url'
    ];

    if (headerContainer) {
      for (const sel of compSelectors) {
        const el = headerContainer.querySelector(sel);
        if (el && !el.closest('#jobDescriptionText, [data-testid="jobDescriptionText"], [data-test="job-description"]') && el.innerText.trim()) {
          // Remove trailing ratings e.g. "University of Cambridge 4.0 ★" -> "University of Cambridge"
          const clean = el.innerText.replace(/[\d.]+\s*[★*]+.*$/g, '').trim();
          if (!isJunkCompany(clean)) {
            company = clean;
            break;
          }
        }
      }
    }

    // Fallback 1: Clicked Card Company
    if ((!company || isJunkCompany(company)) && lastClickedCard?.company) {
      company = lastClickedCard.company;
    }

    // Fallback 2: Check JD opening lines (if company introduced itself, e.g. Disney Entertainment...)
    if ((!company || isJunkCompany(company)) && fullBodyText) {
      const topLines = fullBodyText.split('\n').map(l => l.trim()).filter(l => l.length > 3 && l.length < 80);
      for (const line of topLines.slice(0, 5)) {
        if (/^full job description$/i.test(line)) continue;
        if (/^(about|overview|summary|responsibilities|qualifications|the team)/i.test(line)) continue;
        if (/(entertainment|technology|corporation|inc|llc|group|studios|media|systems|company|disney|google|apple|amazon|microsoft|meta|netflix|tiktok|freeform|anthropic|cambridge)/i.test(line)) {
          company = line.replace(/[\d.]+\s*[★*]+.*$/g, '').trim();
          break;
        }
      }
    }

    // 10. Location & Salary
    if (headerContainer) {
      const locSelectors = [
        // ZipRecruiter
        '.hiring_location',
        '[data-testid="job-location"]',
        '[class*="hiring_location"]',
        '[class*="job_location"]',
        '[itemprop="jobLocation"]',
        // Glassdoor & Indeed & LinkedIn
        '[data-test="location"]',
        '[data-test="job-location"]',
        '[data-test="jobLocation"]',
        '[class*="JobDetails_location"]',
        '[class*="JobDetails_jobLocation"]',
        '[data-testid="jobsearch-JobInfoHeader-companyLocation"]',
        '.jobsearch-JobInfoHeader-companyLocation',
        '.job-details-jobs-unified-top-card__bullet',
        '.jobs-unified-top-card__bullet',
        '.job-details-jobs-unified-top-card__primary-description',
        '.jobs-unified-top-card__primary-description',
        '.jobs-unified-top-card__workplace-type'
      ];
      for (const sel of locSelectors) {
        const el = headerContainer.querySelector(sel) || document.querySelector(sel);
        if (el && el.innerText.trim()) {
          location = el.innerText.trim();
          break;
        }
      }

      const salSelectors = [
        // ZipRecruiter
        '.salary_text',
        '[data-testid="job-salary"]',
        '[class*="salary_text"]',
        '[class*="compensation"]',
        // Glassdoor & Indeed
        '[data-test="detailSalary"]',
        '[data-test="pay-period"]',
        '[class*="JobDetails_salary"]',
        '[class*="SalaryEstimate"]',
        '[data-test="salaries"]',
        '[class*="BasePayRange"]',
        '#salaryInfoAndJobType',
        '[data-testid="jobsearch-JobDescriptionSection-section--salary"]',
        '[data-testid="attribute_snippets_test_title"]'
      ];
      for (const sel of salSelectors) {
        const el = headerContainer.querySelector(sel) || document.querySelector(sel);
        if (el && el.innerText.trim()) {
          salary = el.innerText.trim();
          break;
        }
      }
    }

    if (!jk) {
      jk = lastClickedCard?.jk || '';
    }

    // 11. Search Card fallback (Indeed, Glassdoor, ZipRecruiter, LinkedIn list cards)
    if (!title || !company) {
      const activeCard = 
        // Active / Selected Card across platforms
        document.querySelector('[data-test="job-listing-item"].selected, [data-test="job-listing-item"][aria-selected="true"], [data-test="jobListing"].selected, [class*="jobListItem"][class*="selected"], [class*="jobCard"][class*="selected"], li.selected:has([data-test="job-title"]), li[data-id][aria-selected="true"], article.job_result.selected, article[data-testid="job-card"][aria-selected="true"], article.selected, li.selected, .jobs-search-results-list__list-item--active, li.jobs-search-results__list-item--active, li.job-card-container--clickable') ||
        // First visible list card
        document.querySelector('article.job_result, article[data-testid="job-card"], [class*="job_result"], [class*="jobCard"], div.job_seen_beacon, div[data-jk], li.css-5lfssm, div.cardOutline, [data-test="job-listing-item"], li[data-test="jobListing"], li[data-id], article[data-test="job-card"], li.job-listing, .jobs-search-results__list-item, div.job-card-container');

      if (activeCard) {
        if (!title) {
          const tEl = activeCard.querySelector('h1.job_title, h2.job_title, [class*="job_title"], a.job_link, a[data-test="job-title"], a[data-test="job-link"], [class*="jobTitle"], a.jcs-JobTitle, h2.jobTitle span[title], h2.jobTitle, a[id^="job_"], a.job-card-list__title, a[class*="job-card-list__title"], h2, h1, a');
          if (tEl && tEl.innerText.trim()) {
            const clean = tEl.innerText.replace(/^new\s+/i, '').trim();
            if (!isSearchHeader(clean) && clean.length > 2 && clean.length < 120) title = clean;
          }
        }
        if (!company) {
          const cEl = activeCard.querySelector('a.hiring_company_text, [data-testid="company-name"], [data-testid="hiring-company"], [class*="hiring_company"], [class*="company_name"], [data-test="employer-short-name"], [data-test="employer-name"], [class*="employerName"], .companyName, span.css-63koeb, .job-card-container__primary-description, span.job-card-container__primary-description');
          if (cEl && cEl.innerText.trim()) {
            const clean = cEl.innerText.replace(/[\d.]+\s*[★*]+.*$/g, '').trim();
            if (!isJunkCompany(clean)) company = clean;
          }
        }
        if (!jk) {
          jk = activeCard.getAttribute('data-jk') || activeCard.getAttribute('data-id') || activeCard.getAttribute('data-jobid') || activeCard.getAttribute('data-job-id') || '';
        }
      }
    }

    // 12. Smart fallback if fullBodyText was successfully captured but title/company were missed
    if (fullBodyText && fullBodyText.length >= 80) {
      if (!title || title.startsWith('Select a Job')) {
        // Try document-wide h1 / h2 in LinkedIn job view
        const topH1 = document.querySelector('.jobs-search__job-details h1, .jobs-details h1, .job-view-layout h1, .jobs-unified-top-card__job-title, .job-details-jobs-unified-top-card__job-title, h1.t-24');
        if (topH1 && topH1.innerText.trim()) {
          const cleanH1 = topH1.innerText.replace(/^new\s+/i, '').trim();
          if (!isSearchHeader(cleanH1) && cleanH1.length > 2 && cleanH1.length < 120) {
            title = cleanH1;
          }
        }
        // If still no title, inspect the first 3 lines of fullBodyText (e.g. "We're looking for a Senior Fullstack Software Engineer...")
        if (!title || title.startsWith('Select a Job')) {
          const roleMatch = fullBodyText.match(/(?:looking for|hiring|seeking)\s+(?:an?\s+)?([A-Za-z0-9\s/&,.-]{3,60}?(?:Engineer|Developer|Manager|Analyst|Scientist|Architect|Specialist|Director|Lead|Consultant|Designer))/i);
          if (roleMatch && roleMatch[1]) {
            title = roleMatch[1].trim();
          } else {
            const firstLines = fullBodyText.split('\n').map(l => l.trim()).filter(l => l.length >= 5 && l.length <= 80 && !isSearchHeader(l));
            if (firstLines.length > 0) {
              title = firstLines[0];
            }
          }
        }
      }

      if (!company || isJunkCompany(company)) {
        const topComp = document.querySelector('.job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name, .job-details-jobs-unified-top-card__primary-description a, .jobs-unified-top-card__primary-description a');
        if (topComp && topComp.innerText.trim()) {
          const cleanComp = topComp.innerText.replace(/[\d.]+\s*[★*]+.*$/g, '').trim();
          if (!isJunkCompany(cleanComp)) {
            company = cleanComp;
          }
        }
        if (!company || isJunkCompany(company)) {
          company = 'Target Employer';
        }
      }
    }

    if (!title) title = `Select a Job on ${platform}`;
    if (!company) company = 'Click any job posting to evaluate';

    const hasRealBody = Boolean(fullBodyText && fullBodyText.length >= 80);

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
   * Multi-Industry Domain Signatures & Disambiguation Engine
   * Eliminates cross-industry polysemy: GCP (Good Clinical Practice vs Cloud), CAD (Cardiology vs AutoCAD), Pipeline, etc.
   */
  const INDUSTRY_DOMAINS = {
    BIOTECH_PHARMA: {
      code: 'BIOTECH_PHARMA',
      label: 'Biotech & Pharma',
      signature: /\b(clinical trial|clinical study|pharmaceutical|biotech|biotechnology|drug development|oncology|pharmacology|in-vivo|in-vitro|fda submission|ind application|nda submission|good clinical practice|gcp guidelines|ich guidelines|gmp|glp|bioassay|cell culture|pipetting|molecular biology|elisa|pcr|western blot|medicinal chemistry|pharmacokinetics|cro|biostatistics|recombinant|mrna|antibody|cro management|small molecule|biologics|preclinical)\b/i
    },
    HEALTHCARE_MEDICINE: {
      code: 'HEALTHCARE_MEDICINE',
      label: 'Healthcare & Clinical Medicine',
      signature: /\b(patient care|hospital|physician|nurse|practitioner|clinical practice|diagnosis|medical doctor|inpatient|outpatient|cardiology|coronary|pathology|surgery|electronic health record|ehr|emr|epic system|cerner|hipaa|medical terminology|vital signs|patient triage|clinical workflow|intensive care|icu|pediatric|oncology clinic)\b/i
    },
    FINANCE_BANKING: {
      code: 'FINANCE_BANKING',
      label: 'Finance, Banking & Accounting',
      signature: /\b(investment banking|private equity|hedge fund|equity research|valuation model|financial modeling|dcf|lbo|comps|portfolio management|fp&a|financial planning|gaap|sec reporting|10-k|10-q|m&a|mergers and acquisitions|bloomberg terminal|factset|derivatives|capital markets|balance sheet|income statement|general ledger|ebitda|audit senior|financial controller)\b/i
    },
    CIVIL_ARCHITECTURE: {
      code: 'CIVIL_ARCHITECTURE',
      label: 'Civil Engineering & Architecture',
      signature: /\b(civil engineer|civil engineering|architectural design|architect|construction management|autocad|revit|building information modeling|\bbim\b|structural engineering|structural design|mep|hvac|steel frame|timber frame|concrete design|building code|site inspection|surveying|blueprints|dwg|contractor|osha 30|osha 10|general contractor|leed)\b/i
    },
    TECH_SOFTWARE: {
      code: 'TECH_SOFTWARE',
      label: 'Software Engineering & Cloud',
      signature: /\b(software engineer|software developer|backend developer|frontend developer|full stack|web developer|systems programming|devops|cloud infrastructure|database administrator|microservices|distributed systems|computer science|programming language|github|docker|kubernetes|aws|api design|full-stack|c\+\+|golang|react|spring boot)\b/i
    }
  };

  /**
   * Universal Dynamic JD Requirement Extractor (NLP Phrase Mining)
   * Dissects arbitrary job postings to extract genuine functional requirements and duties
   * Guarantees ZERO fake jargon fallbacks (never 'Core Domain Execution'!)
   */
  function extractDynamicJdRequirements(combinedText, fullBodyText, domain) {
    if (!fullBodyText && !combinedText) return [];
    const source = (fullBodyText || combinedText);

    // Administrative & non-skill stop patterns (salary, travel, email, legal disclaimers)
    const ADMIN_NOISE_REGEX = /\b(salary|hourly|\$\d+|send res|send resume|email to|hr@|jobs@|travel|relocate|unanticipated|equal opportunity|eeo|benefits|401k|dental|vision|health insurance|full time|part time|on-site|remote|hybrid|irvine|los angeles|california|applicant must|all qualified applicants|background check|drug test|equal opportunity employer)\b/i;

    const extracted = [];
    const seenLabels = new Set();

    // 1. Clean explicit section headers (only when they act as section headings, NEVER plain nouns in sentences)
    const cleanSource = source
      .replace(/(?:^|\n)\s*(?:Basic|Preferred|Minimum|Required)?\s*Qualifications\s*:?/gim, '\n')
      .replace(/(?:^|\n)\s*(?:Job\s+duties|Key\s+Responsibilities|Core\s+Responsibilities|Responsibilities)\s*:?/gim, '\n')
      .replace(/(?:^|\n)\s*(?:Requirements|Role\s+Requirements|Job\s+Requirements)\s*:\s*/gim, '\n')
      .replace(/(?:^|\n)\s*What\s+you(?:'ll| will)\s+do\s*:?/gim, '\n');

    const rawClauses = cleanSource.split(/(?:[;\n•\r·\*\t]|\d+\.\s+)/);

    const STOPWORDS = new Set(['and', 'the', 'for', 'with', 'from', 'that', 'this', 'have', 'has', 'had', 'our', 'you', 'your', 'will', 'all', 'such', 'making', 'writing', 'using', 'into', 'well', 'across', 'including', 'key', 'etc', 'able', 'per', 'their', 'must']);

    for (let raw of rawClauses) {
      let clause = raw.trim();
      if (clause.length < 8 || clause.length > 130) continue;
      if (ADMIN_NOISE_REGEX.test(clause)) continue;

      // Filter out explicit negation phrases ("not required", "no experience needed", etc.)
      const isNegated = /\b(not\s+required|not\s+necessary|no\s+prior\s+(?:experience|knowledge)\s+(?:needed|required)|optional|is\s+a\s+plus(?:\s+only)?)\b/i.test(clause);
      if (isNegated) continue;

      // Clean leading/trailing punctuation, bullet markers, conjunctions & boilerplates
      clause = clause
        .replace(/^[\s\-–—•*·>]+\s*/, '')
        .replace(/^(?:and|or|&|\+|as well as)\s+/i, '')
        .replace(/^(?:must have|ability to|responsible for|experience (?:working in|working with|developing in|leading|managing|building|designing|using|with|in)|prior experience (?:with|in)|hands-on experience (?:with|in)|proven experience (?:with|in)|expert level proficiency in|expert level in|extensive experience (?:with|in)|demonstrated experience (?:with|in)|expertise in|proficient in|proficient with|proficiency in|including|knowledge of|proven track record in|familiarity with|strong understanding of|understanding of|demonstrated|solid)\s+/i, '')
        .replace(/^(?:and|or|&|\+|as well as)\s+/i, '')
        .replace(/[.,;:]+$/, '')
        .trim();

      if (clause.length < 5) continue;

      // Check if clause has technical / functional substance
      const hasSubstance = /\b(node|next\.js|express|react|javascript|typescript|python|java|golang|vue|angular|c\+\+|c#|tailwind|scss|css|html|jest|mocha|vitest|design|dvlp|develop|architecture|system|data|model|interface|api|code|program|test|manage|analysis|clinical|patient|cad|gaap|audit|pipeline|gcp|bim|circuit|hardware|network|security|cloud|database|sql|agile|scrum|lean)\b/i.test(clause);
      if (!hasSubstance) continue;

      // Synthesize clean display title
      let cleanTitle = clause.charAt(0).toUpperCase() + clause.slice(1);
      if (cleanTitle.length > 35) {
        cleanTitle = cleanTitle.substring(0, 32).trim() + '…';
      }

      const dedupeKey = cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seenLabels.has(dedupeKey)) {
        seenLabels.add(dedupeKey);
        
        // Preserve short symbols & critical tech tokens (C++, C#, Go, AI, ML, CI/CD)
        const normalized = clause.toLowerCase()
          .replace(/\bc\+\+/g, 'cpp_token')
          .replace(/\bc#/g, 'csharp_token')
          .replace(/\bci\/cd\b/g, 'cicd_token')
          .replace(/[^a-z0-9_\s]/g, ' ');

        const ALLOWED_SHORT = new Set(['go', 'ai', 'ml', 'qa', 'r']);
        const meaningfulWords = normalized.split(/\s+/)
          .map(w => w === 'cpp_token' ? 'c++' : (w === 'csharp_token' ? 'c#' : (w === 'cicd_token' ? 'ci/cd' : w)))
          .filter(w => (w.length > 2 || ALLOWED_SHORT.has(w) || w === 'c++' || w === 'c#' || w === 'ci/cd') && !STOPWORDS.has(w));

        extracted.push({
          name: cleanTitle,
          fullName: clause,
          key: (meaningfulWords.length > 0 ? meaningfulWords.join('|') : clause.toLowerCase()),
          isDynamic: true
        });
      }

      if (extracted.length >= 6) break;
    }

    return extracted;
  }

  /**
   * Universal Semantic Matching: Determine if candidate satisfies a given requirement
   * Checks explicit skills, resume text, synonyms, and engineering equivalents
   */
  function candidateSatisfiesRequirement(reqSkill, cand) {
    const candSkills = cand.skills || [];
    const rawResume = (cand.rawResumeText || '').toLowerCase();
    const reqNameLower = reqSkill.name.toLowerCase();

    // 1. Direct candidate skill list match
    const ALLOWED_SHORT_KEYS = new Set(['c++', 'c#', 'go', 'ai', 'ml', 'qa', 'r', 'ci/cd']);
    const keys = (reqSkill.key || '').split('|').map(k => k.replace(/\\/g, '').trim().toLowerCase()).filter(Boolean);
    const directSkillMatch = candSkills.some(s => {
      const sLower = s.toLowerCase();
      if (reqNameLower.includes(sLower) || sLower.includes(reqNameLower)) return true;
      return keys.some(k => (k.length > 2 || ALLOWED_SHORT_KEYS.has(k)) && (sLower === k || sLower.includes(k) || k.includes(sLower)));
    });
    if (directSkillMatch) return true;

    // 2. Check full raw resume text for any of the key requirement tokens
    if (rawResume) {
      const resumeTokenMatch = keys.some(k => {
        if (k.length <= 2 && !ALLOWED_SHORT_KEYS.has(k)) return false;
        try {
          if (k.includes('+') || k.includes('#')) {
            const symRegex = new RegExp(`(?:^|[^a-z0-9_#])(${k.replace(/\+/g, '\\+')})(?:$|[^a-z0-9_#])`, 'i');
            return symRegex.test(rawResume);
          }
          const regex = new RegExp(`\\b${k}\\b`, 'i');
          return regex.test(rawResume);
        } catch (e) {
          return rawResume.includes(k);
        }
      });
      if (resumeTokenMatch) return true;
    }

    // 3. Domain & Functional Equivalency Maps
    // C / C++ / Embedded ecosystem
    if (/\b(c\+\+|cpp|c\/c\+\+|embedded)\b/i.test(reqNameLower) || keys.includes('c++')) {
      if (candSkills.some(s => /\b(c\+\+|cpp|embedded)\b/i.test(s)) || (rawResume && /\bc\+\+\b/i.test(rawResume))) return true;
    }

    // Go / Golang ecosystem
    if (/\b(golang|go)\b/i.test(reqNameLower) || keys.includes('go')) {
      if (candSkills.some(s => /\b(go|golang)\b/i.test(s)) || (rawResume && /\bgolang\b/i.test(rawResume))) return true;
    }
    // Node.js, Next.js, Express, JavaScript/React fullstack ecosystem
    if (/\b(node|next(\.js)?|express(\.js)?)\b/i.test(reqNameLower)) {
      if (candSkills.some(s => /\b(node|next|express)\b/i.test(s))) return true;
      if (candSkills.some(s => /javascript/i.test(s)) && candSkills.some(s => /react/i.test(s))) return true;
      if (rawResume && /\b(node|next\.js|express)\b/i.test(rawResume)) return true;
    }

    // Testing frameworks (Jest, Mocha, Vitest, Unit Testing)
    if (/\b(jest|mocha|vitest|unit test|testing framework)\b/i.test(reqNameLower)) {
      if (candSkills.some(s => /\b(unit test|testing|qa)\b/i.test(s))) return true;
    }

    // Tailwind, CSS, SCSS, Frontend Styling
    if (/\b(tailwind|scss|css|styling)\b/i.test(reqNameLower)) {
      if (candSkills.some(s => /\b(react|frontend|javascript|typescript|tailwind|css)\b/i.test(s))) return true;
    }

    // A: Software Architecture & System Design
    if (/\b(system|architecture|design|component|module|interface)\b/i.test(reqNameLower)) {
      if (candSkills.some(s => /\b(system design|microservices|distributed|software architecture|backend)\b/i.test(s))) {
        return true;
      }
    }

    // B: Software Development & Coding
    if (/\b(software|develop|dvlp|engineering|program|coding|application|app)\b/i.test(reqNameLower)) {
      if (candSkills.some(s => /\b(java|python|c\+\+|go|javascript|typescript|c#|rust|software)\b/i.test(s))) {
        return true;
      }
    }

    // C: Databases, SQL, & Data Models
    if (/\b(database|data model|relationship|sql|nosql|storage)\b/i.test(reqNameLower)) {
      if (candSkills.some(s => /\b(sql|mysql|postgresql|postgres|database|redis|mongodb)\b/i.test(s))) {
        return true;
      }
    }

    // D: APIs & Microservices
    if (/\b(api|interface|rest|graphql|microservice|endpoints)\b/i.test(reqNameLower)) {
      if (candSkills.some(s => /\b(api|rest|microservices|spring boot|node|fastapi)\b/i.test(s))) {
        return true;
      }
    }

    // E: Cross-Functional Teamwork & Coordination
    if (/\b(business|coordinate|clarify|team|cross-functional|stakeholder|communication)\b/i.test(reqNameLower)) {
      if (candSkills.some(s => /\b(agile|scrum|cross-functional|pmo|leadership|management)\b/i.test(s)) || cand.yearsOfExperience >= 3) {
        return true;
      }
    }

    // F: Biotech / Pharma (GCP, Clinical, Regulatory)
    if (/\b(gcp|clinical|trial|protocol|fda|glp|gmp)\b/i.test(reqNameLower)) {
      if (candSkills.some(s => /\b(gcp|clinical|trial|regulatory|cra|crc)\b/i.test(s)) || /\b(gcp|clinical trial|ich-gcp)\b/i.test(rawResume)) {
        return true;
      }
    }

    // G: Civil / Architecture (CAD, BIM, Revit)
    if (/\b(cad|drafting|dwg|revit|bim)\b/i.test(reqNameLower)) {
      if (candSkills.some(s => /\b(autocad|revit|bim|cad)\b/i.test(s)) || /\b(autocad|revit|bim)\b/i.test(rawResume)) {
        return true;
      }
    }

    // H: Finance / Banking (GAAP, Valuation, DCF)
    if (/\b(gaap|valuation|financial model|dcf|lbo|accounting)\b/i.test(reqNameLower)) {
      if (candSkills.some(s => /\b(gaap|financial model|valuation|cpa|accounting)\b/i.test(s)) || /\b(cpa|gaap|valuation)\b/i.test(rawResume)) {
        return true;
      }
    }

    return false;
  }

  const COMPREHENSIVE_SKILL_CATALOG = [
    // ==========================================
    // --- TECH & SOFTWARE ENGINEERING ---
    // ==========================================
    { domain: 'TECH_SOFTWARE', name: 'Java / Spring Boot', key: '\\bjava\\b(?!\\s*script)|spring boot|spring cloud|jvm|quarkus' },
    { domain: 'TECH_SOFTWARE', name: 'C++', key: 'c\\+\\+|modern c\\+\\+|cpp' },
    { domain: 'TECH_SOFTWARE', name: 'C# / .NET', key: 'c#|\\.net|dotnet' },
    { domain: 'TECH_SOFTWARE', name: 'Python', key: 'python|fastapi|django|flask' },
    { domain: 'TECH_SOFTWARE', name: 'Go (Golang)', key: 'golang|go language|go programming|go backend|go developer' },
    { domain: 'TECH_SOFTWARE', name: 'TypeScript / JavaScript', key: 'typescript|javascript' },
    { domain: 'TECH_SOFTWARE', name: 'Linux / Unix', key: 'linux|unix|bash|shell scripting' },
    { domain: 'TECH_SOFTWARE', name: 'Distributed Systems & Microservices', key: 'microservice|distributed system|distributed systems' },
    { domain: 'TECH_SOFTWARE', name: 'High Concurrency & Scalability', key: 'high concurrency|concurrency|multithread|high throughput' },
    { domain: 'TECH_SOFTWARE', name: 'Software Development & Engineering', key: 'software develop|software dev|dvlp app|dvlp apps|application develop|software developer|software engineer|software program' },
    { domain: 'TECH_SOFTWARE', name: 'System Architecture & Design', key: 'system architecture|software architecture|softw architecture|system design|distributed architecture|system component' },
    { domain: 'TECH_SOFTWARE', name: 'SQL / Relational Databases', key: 'sql|mysql|postgresql|postgres|database design|data model|data relationship|relational database' },
    { domain: 'TECH_SOFTWARE', name: 'Redis / MongoDB / NoSQL', key: 'redis|mongodb|nosql|elasticsearch' },
    { domain: 'TECH_SOFTWARE', name: 'Docker & Kubernetes', key: 'docker|kubernetes|k8s' },
    { domain: 'TECH_SOFTWARE', name: 'Cloud Infrastructure (AWS/GCP)', key: 'aws|azure|google cloud|cloud computing|gcp cloud' },
    { domain: 'TECH_SOFTWARE', name: 'CI/CD & DevOps', key: 'ci/cd|jenkins|devops|deployment pipeline|ci\\/cd pipeline|automated pipeline' },
    { domain: 'TECH_SOFTWARE', name: 'Unit Testing', key: 'unit test|integration test|automated test|qa test|e2e test|tdd|software testing|jest|mocha|vitest' },
    { domain: 'TECH_SOFTWARE', name: 'Security Clearance (DoD)', key: 'secret clearance|dod clearance|top secret|security clearance|ts\\/sci' },
    { domain: 'TECH_SOFTWARE', name: 'Algorithms & Data Structures', key: 'algorithm|algorithms|data structure|data structures|leetcode' },
    { domain: 'TECH_SOFTWARE', name: 'Machine Learning & AI', key: 'machine learning|deep learning|artificial intelligence|pytorch|tensorflow' },
    { domain: 'TECH_SOFTWARE', name: 'Computer Vision', key: 'computer vision|opencv' },
    { domain: 'TECH_SOFTWARE', name: 'Natural Language Processing (NLP)', key: 'natural language processing|\\bnlp\\b|information retrieval' },
    { domain: 'TECH_SOFTWARE', name: '3D Graphics & Rendering (OpenGL/Vulkan)', key: 'opengl|vulkan|directx|metal api|apple metal|glsl|hlsl|shader|3d rendering|rendering engine|3d graphics' },
    { domain: 'TECH_SOFTWARE', name: 'Game Engines & AR/VR (Unity/Unreal)', key: 'unity|unreal|lens studio|lenscore|augmented reality|ar engine|virtual reality' },
    { domain: 'TECH_SOFTWARE', name: 'React', key: 'react|vue|angular' },
    { domain: 'TECH_SOFTWARE', name: 'Node.js / Express / Next.js', key: 'node\\.js|nodejs|node\\s+js|expressjs|express\\.js|next\\.js' },
    { domain: 'TECH_SOFTWARE', name: 'REST APIs / GraphQL', key: 'developer-facing api|graphql|rest api|api design|restful|app interface|interface|api' },

    // ==========================================
    // --- BIOTECH & PHARMACEUTICAL ---
    // ==========================================
    { domain: 'BIOTECH_PHARMA', name: 'Good Clinical Practice (GCP & ICH Guidelines)', key: 'gcp|good clinical practice|ich-gcp|clinical compliance' },
    { domain: 'BIOTECH_PHARMA', name: 'Drug Discovery & Clinical Pipeline', key: 'drug pipeline|pipeline compound|preclinical pipeline|clinical trial pipeline' },
    { domain: 'BIOTECH_PHARMA', name: 'Clinical Trial Operations (Phase I-IV / CRO)', key: 'clinical trial|phase i|phase ii|phase iii|phase iv|cro management|trial protocol' },
    { domain: 'BIOTECH_PHARMA', name: 'Cell & Tissue Culture (Aseptic Technique)', key: 'cell culture|tissue culture|primary cells|aseptic technique|mammalian cell' },
    { domain: 'BIOTECH_PHARMA', name: 'Molecular Assays (PCR / ELISA / Western Blot)', key: 'pcr|qpcr|elisa|western blot|flow cytometry|bioassay|hplc' },
    { domain: 'BIOTECH_PHARMA', name: 'In-Vivo / In-Vitro Disease Models', key: 'in-vivo|in vivo|in-vitro|in vitro|animal model|xenograft|pharmacokinetics' },
    { domain: 'BIOTECH_PHARMA', name: 'Regulatory Submissions (FDA / IND / NDA)', key: 'fda|ind application|nda submission|regulatory affairs|ema|bla submission' },
    { domain: 'BIOTECH_PHARMA', name: 'GMP / GLP Quality Assurance & Validation', key: 'gmp|glp|equipment validation|iq/oq/pq|cleanroom|qa/qc pharmaceutical' },
    { domain: 'BIOTECH_PHARMA', name: 'Lead Compound Discovery & Medicinal Chemistry', key: 'lead compound|medicinal chemistry|hit-to-lead|structure-activity|hts screening' },
    { domain: 'BIOTECH_PHARMA', name: 'Biostatistics & Clinical Data Analysis (SAS/R)', key: 'sas|biostatistics|clinical data analysis|survival analysis|meddra' },

    // ==========================================
    // --- HEALTHCARE & CLINICAL MEDICINE ---
    // ==========================================
    { domain: 'HEALTHCARE_MEDICINE', name: 'Patient Care & Clinical Diagnosis', key: 'patient care|inpatient care|clinical diagnosis|patient triage|vital signs' },
    { domain: 'HEALTHCARE_MEDICINE', name: 'Cardiovascular Care (Coronary Artery Disease - CAD)', key: 'coronary artery disease|cad patient|cardiology|congestive heart failure|ecg|ekg' },
    { domain: 'HEALTHCARE_MEDICINE', name: 'Electronic Health Records (Epic / Cerner / EMR)', key: 'epic|cerner|electronic health record|emr system|ehr system|allscripts' },
    { domain: 'HEALTHCARE_MEDICINE', name: 'HIPAA Compliance & Patient Privacy', key: 'hipaa|patient privacy|protected health information|phi compliance' },
    { domain: 'HEALTHCARE_MEDICINE', name: 'Diagnostic & Treatment Protocols', key: 'diagnostic protocol|treatment plan|patient charting|infection control|bls|acls' },

    // ==========================================
    // --- CIVIL ENGINEERING & ARCHITECTURE ---
    // ==========================================
    { domain: 'CIVIL_ARCHITECTURE', name: 'Architectural CAD Drafting (AutoCAD / DWG)', key: 'autocad|cad drafting|cad drawings|dwg|microstation|drafting standards' },
    { domain: 'CIVIL_ARCHITECTURE', name: 'Building Information Modeling (BIM & Revit)', key: 'revit|building information modeling|\\bbim\\b|navisworks|clash detection' },
    { domain: 'CIVIL_ARCHITECTURE', name: 'Structural Engineering & Framing Analysis', key: 'structural engineering|structural framing|steel framework|concrete design|etabs|sap2000' },
    { domain: 'CIVIL_ARCHITECTURE', name: 'MEP Systems & Piping/Plumbing Networks', key: 'mep|hvac design|piping design|plumbing engineering|drainage network' },
    { domain: 'CIVIL_ARCHITECTURE', name: 'Construction Project Management & Site Safety (OSHA)', key: 'construction management|site superintendent|osha 30|osha 10|submittals|rfi process' },
    { domain: 'CIVIL_ARCHITECTURE', name: 'Building Codes & Permitting (IBC / Local Codes)', key: 'building code|ibc|ada compliance|zoning|plan check|permitting' },

    // ==========================================
    // --- FINANCE, BANKING & ACCOUNTING ---
    // ==========================================
    { domain: 'FINANCE_BANKING', name: 'Financial Modeling & Valuation (DCF/LBO)', key: 'financial model|financial modeling|valuation model|dcf model|lbo model|comparable company' },
    { domain: 'FINANCE_BANKING', name: 'Accounting & GAAP Standards', key: 'gaap|accounting principles|general ledger|us gaap|ifrs' },
    { domain: 'FINANCE_BANKING', name: 'Advanced Financial Excel & Modeling', key: 'ms excel|microsoft excel|advanced excel|excel vba|excel modeling|pivot table' },
    { domain: 'FINANCE_BANKING', name: 'Corporate FP&A & Capital Budgeting', key: 'fp&a|annual budget|budget planning|budget management|budgeting & forecasting|capex|opex' },
    { domain: 'FINANCE_BANKING', name: 'Data Visualization (Tableau/PowerBI)', key: 'tableau|powerbi|power bi' },
    { domain: 'FINANCE_BANKING', name: 'ERP Systems (SAP/Oracle/NetSuite)', key: 'sap erp|sap s\\/4hana|oracle erp|netsuite|yardi|argus' },
    { domain: 'FINANCE_BANKING', name: 'Audit & Internal Controls (SOX)', key: 'financial audit|internal audit|audit compliance|sox|sox compliance|internal controls' },
    { domain: 'FINANCE_BANKING', name: 'M&A Advisory & Due Diligence', key: 'mergers & acquisitions|m&a|due diligence|deal execution|pitch book' },
    { domain: 'FINANCE_BANKING', name: 'Financial Risk Management (AML / KYC)', key: 'aml|anti-money laundering|kyc|risk assessment|regulatory compliance finance' },

    // ==========================================
    // --- COMMON PROFESSIONAL (ALL DOMAINS) ---
    // ==========================================
    { domain: 'COMMON', name: 'Agile & Project Methodologies', key: 'agile|scrum|kanban|pmp' },
    { domain: 'COMMON', name: 'Cross-Functional Leadership & PMO', key: 'cross-functional leadership|cross-functional team|stakeholder management|pmo|program management' }
  ];

  /**
   * Domain Classifier: Determine the primary industry domain of a job description
   */
  function detectJobDomain(text) {
    if (!text) return INDUSTRY_DOMAINS.TECH_SOFTWARE;

    let highestScore = 0;
    let selectedDomain = INDUSTRY_DOMAINS.TECH_SOFTWARE;

    for (const [key, domain] of Object.entries(INDUSTRY_DOMAINS)) {
      const matches = text.match(domain.signature);
      const score = matches ? matches.length : 0;
      if (score > highestScore) {
        highestScore = score;
        selectedDomain = domain;
      }
    }

    // Default to Tech/Software if ambiguous or zero match
    return selectedDomain;
  }

  /**
   * Evaluate Job Match against Candidate Profile
   * Strict requirement-driven gap analysis: Only report gaps that ACTUALLY appear in JD!
   */
  function evaluateJobMatch(jobData, cand) {
    const hasBody = Boolean(jobData?.fullBodyText && jobData.fullBodyText.length >= 80);
    const isUnselected = !hasBody && (!jobData || !jobData.title || jobData.title.startsWith('Select a Job'));
    const platformName = jobData?.platform || detectPlatform();
    // Step 0: Normalize combinedText to separate glued words without breaking compound tech names (JavaScript, TypeScript, PostgreSQL, GraphQL)
    const rawCombined = ((jobData?.title || '') + ' ' + (jobData?.company || '') + ' ' + (jobData?.fullBodyText || ''));
    const safeCombined = rawCombined
      .replace(/\bJavaScript\b/gi, '@@JAVASCRIPT@@')
      .replace(/\bTypeScript\b/gi, '@@TYPESCRIPT@@')
      .replace(/\bPostgreSQL\b/gi, '@@POSTGRESQL@@')
      .replace(/\bGraphQL\b/gi, '@@GRAPHQL@@');
    const combinedText = safeCombined
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
      .replace(/@@JAVASCRIPT@@/gi, 'javascript')
      .replace(/@@TYPESCRIPT@@/gi, 'typescript')
      .replace(/@@POSTGRESQL@@/gi, 'postgresql')
      .replace(/@@GRAPHQL@@/gi, 'graphql')
      .toLowerCase();
    const candSkills = cand.skills || [];

    // Helper: Match skill keyword considering symbols like ++, #, . and plural variants (s/es)
    function testSkillKey(pattern, text) {
      const subkeys = pattern.split('|');
      return subkeys.some(k => {
        k = k.trim();
        if (!k) return false;
        try {
          if (k.includes('(?') || k.includes('\\b')) {
            const customRegex = new RegExp(k, 'i');
            return customRegex.test(text);
          } else if (k.includes('+') || k.includes('#') || k.startsWith('\\.') || k.startsWith('.')) {
            const symRegex = new RegExp(`(?:^|[^a-z0-9_#])(${k})(?:$|[^a-z0-9_#])`, 'i');
            return symRegex.test(text);
          } else {
            // Support plurals and variations like "system designs", "data models", "interfaces"
            const wordRegex = new RegExp(`(?:^|[^a-z0-9_])(${k})(?:s|es)?(?:$|[^a-z0-9_])`, 'i');
            return wordRegex.test(text);
          }
        } catch (e) {
          return text.includes(k.replace(/\\/g, '').toLowerCase());
        }
      });
    }

    if (isUnselected) {
      return {
        overallMatchScore: 0,
        matchTier: 'Awaiting Job Selection',
        tierTitle: 'Ready to Scan',
        tierDesc: `Click any job posting on ${platformName} to inspect full requirements & real-time skills fit`,
        tierBadge: 'Ready to Scan',
        tierColor: '#94a3b8',
        tierLevel: 'ready',
        matchHeadline: `👉 Click any job on ${platformName} to inspect full requirements & real-time skills fit`,
        verifiedSkills: [],
        missingSkillGaps: [],
        detectedJdSkillsCount: 0,
        isAwaitingJob: true,
        detectedDomain: 'All Industries (Cross-Domain Ready)',
        detectedDomainCode: 'COMMON'
      };
    }

    if (!hasBody) {
      return {
        overallMatchScore: 0,
        matchTier: 'Scanning Job Description',
        tierTitle: 'Scanning Job Description',
        tierDesc: 'Extracting the full job description before scoring — one moment.',
        tierBadge: 'Scanning…',
        tierColor: '#94a3b8',
        tierLevel: 'scanning',
        matchHeadline: '⏳ Extracting the full job description before scoring…',
        verifiedSkills: [],
        missingSkillGaps: [],
        detectedJdSkillsCount: 0,
        isAwaitingJob: false,
        isScanning: true,
        detectedDomain: 'Detecting Domain…',
        detectedDomainCode: 'PENDING'
      };
    }

    // Step 1: Industry Domain Classification & Cross-Industry Disambiguation
    // Guarantees zero cross-domain pollution: GCP (Clinical Trials vs Cloud), CAD (Cardiology vs AutoCAD), Pipeline, etc.
    const jobDomain = detectJobDomain(combinedText);
    const domainSpecificCatalog = COMPREHENSIVE_SKILL_CATALOG.filter(item => {
      return item.domain === jobDomain.code || item.domain === 'COMMON';
    });

    // Step 1.1: Extract authentic in-situ requirements directly from the JD's bullets & clauses
    const dynamicReqs = extractDynamicJdRequirements(combinedText, jobData?.fullBodyText, jobDomain);

    let detectedJdSkills = [];

    // Prioritize authentic dynamic requirements extracted from the employer's actual text
    for (const dReq of dynamicReqs) {
      detectedJdSkills.push(dReq);
    }

    // Supplement with catalog items that matched in text and aren't already represented
    const matchedCatalogSkills = domainSpecificCatalog.filter(item => {
      return testSkillKey(item.key, combinedText);
    });

    for (const catSkill of matchedCatalogSkills) {
      const alreadyCovered = detectedJdSkills.some(d => {
        const dLower = d.name.toLowerCase();
        const catLower = catSkill.name.toLowerCase();
        return dLower.includes(catLower) || catLower.includes(dLower) || testSkillKey(catSkill.key, d.name.toLowerCase());
      });
      if (!alreadyCovered && detectedJdSkills.length < 6) {
        detectedJdSkills.push(catSkill);
      }
    }

    // Baseline fallback if JD is extremely short: extract from Job Title itself (NEVER invent fake jargon)
    if (detectedJdSkills.length === 0) {
      const cleanTitle = (jobData?.title || 'Professional Role').trim();
      detectedJdSkills = [
        { name: cleanTitle, key: cleanTitle.toLowerCase() }
      ];
    }

    // Step 2: Compare candidate skills against JD requirements using Universal Semantic Matcher
    let verifiedSkills = [];
    let missingSkillGaps = [];

    detectedJdSkills.forEach(reqSkill => {
      const hasSkill = candidateSatisfiesRequirement(reqSkill, cand);
      if (hasSkill) {
        verifiedSkills.push(reqSkill);
      } else {
        missingSkillGaps.push(reqSkill);
      }
    });

    const totalDetected = detectedJdSkills.length;
    let ratio = totalDetected > 0 ? (verifiedSkills.length / totalDetected) : 0;

    // Step 3: Fair, Nuanced & Continuous Dynamic Scoring
    let overallMatchScore;
    if (totalDetected === 0) {
      overallMatchScore = 65;
    } else if (missingSkillGaps.length === 0) {
      // All detected core JD requirements are satisfied! Reward with top-tier 93-98% score
      const depthBonus = Math.min(3, Math.floor((jobData?.characterCount || 0) / 2500));
      const expBonus = (cand.yearsOfExperience >= 10) ? 3 : ((cand.yearsOfExperience >= 5) ? 2 : 1);
      overallMatchScore = Math.min(98, 92 + expBonus + depthBonus);
    } else {
      // Gaps exist: natural, nuanced scoring with realistic distribution
      // Example 5/6 matched (83.3%) -> base 82 + exp bonus (3-4) + char depth = 85% ~ 88%
      // Example 4/6 matched (66.7%) -> base 68 + exp bonus (4) + char depth = 73% ~ 76%
      // Example 3/6 matched (50.0%) -> base 50 + exp bonus (4) + char depth = 55% ~ 58%
      const baseRatioScore = ratio * 78; // maps 0.833 -> 65
      const expWeight = (cand.yearsOfExperience >= 10) ? 18 : ((cand.yearsOfExperience >= 5) ? 14 : 10);
      const textDepthJitter = Math.min(3, Math.floor(((jobData?.characterCount || 0) % 1000) / 300));
      const rawScore = Math.round(baseRatioScore + expWeight + textDepthJitter);
      overallMatchScore = Math.max(38, Math.min(91, rawScore));
    }

    if (isBuggyMode) {
      overallMatchScore = 98; // Simulated naive match from truncated 153 chars
    }

    // Tier definitions
    let tierLevel = 'growth';
    let tierTitle = 'Solid Transferable Foundation';
    let tierDesc = 'Core transferable skills detected · Minor gap bridging recommended';
    let tierBadge = 'Transferable (60-74%)';
    let tierColor = '#fbbf24'; // Amber

    if (overallMatchScore >= 90) {
      tierLevel = 'exceptional';
      tierTitle = 'Top 1% Exceptional Match';
      tierDesc = 'Direct technical alignment · Outstanding qualifications · High interview probability';
      tierBadge = 'Top Tier (90-100%)';
      tierColor = '#34d399'; // Emerald
    } else if (overallMatchScore >= 75) {
      tierLevel = 'competitive';
      tierTitle = 'Competitive Strong Match';
      tierDesc = 'High core skill alignment · Meets primary job requirements · Highly recommended to apply';
      tierBadge = 'Competitive (75-89%)';
      tierColor = '#38bdf8'; // Sky blue
    } else if (overallMatchScore >= 60) {
      tierLevel = 'growth';
      tierTitle = 'Solid Transferable Foundation';
      tierDesc = 'Transferable skills present · Highlight relevant technical achievements';
      tierBadge = 'Transferable (60-74%)';
      tierColor = '#fbbf24'; // Amber
    } else {
      tierLevel = 'pivot';
      tierTitle = 'Cross-Track Opportunity';
      tierDesc = 'Cross-domain role · Emphasize core engineering foundations & rapid learning ability';
      tierBadge = 'Cross-Track (<60%)';
      tierColor = '#94a3b8'; // Slate
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
      isAwaitingJob: false,
      isScanning: false,
      detectedDomain: jobDomain.label,
      detectedDomainCode: jobDomain.code
    };
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /**
   * Extract comprehensive skills from raw resume text
   */
  function extractSkillsFromResumeText(text) {
    if (!text) return [];
    
    // Explicit definitions with custom matchers to eliminate common word false positives
    const skillRules = [
      { name: 'Java', regex: /\bJava\b(?!script)/i },
      { name: 'Python', regex: /\bPython\b/i },
      { name: 'Go', regex: /\b(Golang|Go\s*(?:\(Golang\)|developer|engineer|backend|programming|language))\b|\bGo\/(?:Python|Rust|Java|C\+\+)\b/i },
      { name: 'Golang', regex: /\bGolang\b/i },
      { name: 'JavaScript', regex: /\bJavaScript\b/i },
      { name: 'TypeScript', regex: /\bTypeScript\b/i },
      { name: 'C++', regex: /(?:^|[^a-zA-Z0-9_#])(C\+\+|modern\s+C\+\+|CPP)(?:$|[^a-zA-Z0-9_#])/i },
      { name: 'C#', regex: /(?:^|[^a-zA-Z0-9_#])(C#|\.NET|DotNet)(?:$|[^a-zA-Z0-9_#])/i },
      { name: 'Rust', regex: /\bRust\b/i },
      { name: 'Ruby', regex: /\bRuby\b(?:\s+on\s+Rails|\s+Rails|\b)/i },
      { name: 'PHP', regex: /\bPHP\b/i },
      { name: 'SQL', regex: /\bSQL\b/i },
      { name: 'MySQL', regex: /\bMySQL\b/i },
      { name: 'PostgreSQL', regex: /\b(PostgreSQL|Postgres)\b/i },
      { name: 'Oracle', regex: /\b(Oracle\s+DB|Oracle\s+Database|Oracle\s+ERP|Oracle\s+Cloud)\b/i },
      { name: 'MongoDB', regex: /\bMongoDB\b/i },
      { name: 'Redis', regex: /\bRedis\b/i },
      { name: 'Elasticsearch', regex: /\bElasticsearch\b/i },
      { name: 'Cassandra', regex: /\bCassandra\b/i },
      { name: 'Spring Boot', regex: /\bSpring\s+Boot\b/i },
      { name: 'Spring Cloud', regex: /\bSpring\s+Cloud\b/i },
      { name: 'MyBatis', regex: /\bMyBatis\b/i },
      { name: 'Django', regex: /\bDjango\b/i },
      { name: 'Flask', regex: /\bFlask\b/i },
      { name: 'FastAPI', regex: /\bFastAPI\b/i },
      { name: 'Node.js', regex: /\b(Node\.js|NodeJS|Node\s+js)\b/i },
      { name: 'Express', regex: /\b(Express\.js|ExpressJS)\b/i },
      { name: 'React', regex: /\bReact(?:\.js|JS)?\b/i },
      { name: 'Vue', regex: /\bVue(?:\.js|JS)?\b/i },
      { name: 'Angular', regex: /\bAngular(?:\.js|JS)?\b/i },
      { name: 'Next.js', regex: /\bNext\.js\b/i },
      { name: 'Tailwind', regex: /\bTailwind(?:\s+CSS)?\b/i },
      { name: 'GraphQL', regex: /\bGraphQL\b/i },
      { name: 'REST API', regex: /\b(RESTful|REST\s+API|REST\s+APIs)\b/i },
      { name: 'Docker', regex: /\bDocker\b/i },
      { name: 'Kubernetes', regex: /\b(Kubernetes|K8s)\b/i },
      { name: 'Jenkins', regex: /\bJenkins\b/i },
      { name: 'CI/CD', regex: /\bCI\/CD\b/i },
      { name: 'Git', regex: /\bGit\b(?!ted)/i },
      { name: 'Linux', regex: /\bLinux\b/i },
      { name: 'DevOps', regex: /\bDevOps\b/i },
      { name: 'AWS', regex: /\bAWS\b|Amazon\s+Web\s+Services/i },
      { name: 'AliCloud', regex: /\b(AliCloud|Alibaba\s+Cloud)\b/i },
      { name: 'Azure', regex: /\b(Microsoft\s+Azure|Azure\s+Cloud|Azure)\b/i },
      { name: 'Google Cloud', regex: /\b(Google\s+Cloud|GCP)\b/i },
      { name: 'Microservices', regex: /\b(Microservices?|Micro-services?)\b/i },
      { name: 'Distributed Systems', regex: /\bDistributed\s+Systems?\b/i },
      { name: 'High Concurrency', regex: /\b(High\s+Concurrency|High\s+Throughput|Multithread(?:ing)?)\b/i },
      { name: 'System Architecture', regex: /\b(System\s+Architecture|Software\s+Architecture)\b/i },
      { name: 'System Design', regex: /\bSystem\s+Design\b/i },
      { name: 'System Refactoring', regex: /\b(?:Code|System)\s+Refactoring\b/i },
      { name: 'Unit Testing', regex: /\bUnit\s+Test(?:ing|s)?\b/i },
      { name: 'Integration Testing', regex: /\bIntegration\s+Test(?:ing|s)?\b/i },
      { name: 'Automated Testing', regex: /\bAutomated\s+Test(?:ing|s)?\b/i },
      { name: 'Swagger', regex: /\bSwagger\b/i },
      { name: 'Postman', regex: /\bPostman\b/i },
      { name: 'Agile', regex: /\bAgile\b/i },
      { name: 'Scrum', regex: /\bScrum\b/i },
      { name: 'Jira', regex: /\bJira\b/i },
      { name: 'Technical Leadership', regex: /\bTechnical\s+Leadership\b/i },
      { name: 'Team Management', regex: /\b(Team\s+Management|Engineering\s+Management)\b/i },
      { name: 'Financial Software', regex: /\bFinancial\s+Software\b/i },
      { name: 'IoT Platform', regex: /\bIoT(?:\s+Platform)?\b/i },
      { name: 'SaaS Platform', regex: /\bSaaS(?:\s+Platform)?\b/i },
      { name: 'Data Analysis', regex: /\bData\s+Analysis\b/i },
      { name: 'Financial Modeling', regex: /\bFinancial\s+Model(?:ing)?\b/i },
      { name: 'DCF', regex: /\bDCF\b|Discounted\s+Cash\s+Flow/i },
      { name: 'LBO', regex: /\bLBO\b|Leveraged\s+Buyout/i },
      { name: 'Accounting', regex: /\bAccounting\b/i },
      { name: 'GAAP', regex: /\b(?:US\s+)?GAAP\b/i },
      { name: 'FP&A', regex: /\bFP&A\b|Financial\s+Planning\s+and\s+Analysis/i },
      { name: 'Excel', regex: /(?:MS\s+|Microsoft\s+|Advanced\s+)?Excel(?:\s+VBA|\s+Modeling|\s+Formulas)?\b(?!\s+(?:in|at)\b)/i },
      { name: 'VBA', regex: /\bVBA\b/i },
      { name: 'Tableau', regex: /\bTableau\b/i },
      { name: 'PowerBI', regex: /\bPower\s*BI\b/i },
      { name: 'SAP', regex: /\bSAP(?:\s+ERP|\s+S\/4HANA)?\b/i },
      { name: 'Argus', regex: /\bArgus\b/i },
      { name: 'Yardi', regex: /\bYardi\b/i },
      { name: 'Auditing', regex: /\b(Auditing|Internal\s+Audit|Financial\s+Audit)\b/i },
      { name: 'Financial Analysis', regex: /\bFinancial\s+Analysis\b/i },
      { name: 'M&A Advisory', regex: /\b(Mergers\s+(&|and)\s+Acquisitions|M&A\b|Due\s+Diligence)\b/i },
      { name: 'Valuation Modeling', regex: /\b(Valuation\s+Model|DCF|LBO|Discounted\s+Cash\s+Flow)\b/i },
      { name: 'Risk Management (AML/KYC)', regex: /\b(AML|Anti-Money\s+Laundering|KYC|Risk\s+Management)\b/i },

      // --- Biotech & Pharma ---
      { name: 'Good Clinical Practice (GCP)', regex: /\b(GCP|Good\s+Clinical\s+Practice|ICH-GCP)\b/i },
      { name: 'Clinical Trials', regex: /\b(Clinical\s+Trial|Clinical\s+Study|Phase\s+I|Phase\s+II|Phase\s+III|CRO\b)/i },
      { name: 'Cell Culture', regex: /\b(Cell\s+Culture|Tissue\s+Culture|Primary\s+Cells)\b/i },
      { name: 'Molecular Assays (PCR/ELISA)', regex: /\b(PCR|qPCR|ELISA|Western\s+Blot|Flow\s+Cytometry)\b/i },
      { name: 'Regulatory Affairs (FDA)', regex: /\b(FDA\b|IND\s+Application|NDA\s+Submission|Regulatory\s+Affairs)\b/i },
      { name: 'GMP / GLP', regex: /\b(GMP|GLP|Cleanroom|IQ\/OQ\/PQ|Quality\s+Control\s+Pharma)\b/i },
      { name: 'In-Vivo Models', regex: /\b(In-Vivo|In\s+Vivo|Animal\s+Model|Preclinical|Pharmacokinetics)\b/i },
      { name: 'Biostatistics (SAS)', regex: /\b(SAS\b|Biostatistics|Clinical\s+Data\s+Analysis)\b/i },

      // --- Healthcare & Medicine ---
      { name: 'Patient Care', regex: /\b(Patient\s+Care|Inpatient|Outpatient|Clinical\s+Workflow)\b/i },
      { name: 'Clinical Diagnosis', regex: /\b(Clinical\s+Diagnosis|Diagnostic\s+Protocol|Patient\s+Triage)\b/i },
      { name: 'Cardiology', regex: /\b(Cardiology|Coronary|Cardiovascular|ECG|EKG)\b/i },
      { name: 'Electronic Health Records (EHR)', regex: /\b(Epic\b|Cerner\b|Electronic\s+Health\s+Record|EHR|EMR)\b/i },
      { name: 'HIPAA Compliance', regex: /\b(HIPAA|Protected\s+Health\s+Information|PHI\b)\b/i },

      // --- Civil & Architecture ---
      { name: 'AutoCAD', regex: /\b(AutoCAD|CAD\s+Drafting|DWG\b|Microstation)\b/i },
      { name: 'Revit / BIM', regex: /\b(Revit|Building\s+Information\s+Modeling|\bBIM\b|Navisworks)\b/i },
      { name: 'Structural Engineering', regex: /\b(Structural\s+Engineering|Structural\s+Framing|Steel\s+Framework|ETABS|SAP2000)\b/i },
      { name: 'MEP Systems', regex: /\b(MEP\b|HVAC\s+Design|Plumbing\s+Engineering|Piping\s+Design)\b/i },
      { name: 'Construction Management', regex: /\b(Construction\s+Management|Site\s+Superintendent|OSHA\s+30|OSHA\s+10)\b/i },
      { name: 'Building Codes (IBC)', regex: /\b(Building\s+Code|IBC\b|Permitting|Plan\s+Check)\b/i }
    ];

    const found = [];
    skillRules.forEach(rule => {
      try {
        if (rule.regex.test(text)) {
          found.push(rule.name);
        }
      } catch (e) {
        // Safe fallback
      }
    });

    return Array.from(new Set(found));
  }

  /**
   * Ensure Isolated Shadow DOM Host
   */
  function getOrCreateShadowRoot() {
    if (shadowRoot && hostContainer && hostContainer.parentElement === document.body) {
      return shadowRoot;
    }

    if (!document.body) return null;

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
      document.body.appendChild(hostContainer);
    }

    shadowRoot = hostContainer.shadowRoot || hostContainer.attachShadow({ mode: 'open' });
    return shadowRoot;
  }

  const SHADOW_CSS = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

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

    .sjg-hud-panel {
      position: fixed;
      bottom: 16px;
      right: 20px;
      z-index: 2147483647;
      width: 400px;
      max-height: calc(100vh - 32px);
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 16px;
      box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(59, 130, 246, 0.25);
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #f1f5f9;
      pointer-events: auto;
      animation: sjgSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .sjg-hud-panel.open {
      display: flex !important;
    }

    .sjg-fireworks-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    }

    @keyframes sjgSlideUp {
      0% { transform: translateY(20px) scale(0.97); opacity: 0; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }

    @keyframes sjgRingFill {
      from { stroke-dashoffset: 138; }
      to { stroke-dashoffset: var(--sjg-ring-target, 138); }
    }

    @keyframes sjgNumFadeIn {
      from { opacity: 0; transform: scale(0.85); }
      to { opacity: 1; transform: scale(1); }
    }

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

    .sjg-body {
      padding: 10px 14px;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sjg-card {
      background: #0d1424;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 8px 11px;
    }

    .sjg-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
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
      font-size: 13px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.25;
    }

    .sjg-job-sub {
      font-size: 10.5px;
      color: #94a3b8;
      margin-top: 2px;
    }

    .sjg-job-company {
      color: #38bdf8;
      font-weight: 700;
    }

    .sjg-candidate-actions {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 5px;
      font-size: 11px;
    }

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

    .sjg-btn-executive {
      width: 100%;
      background: linear-gradient(135deg, #d97706, #ea580c);
      color: #ffffff;
      border: none;
      border-radius: 9px;
      padding: 9px 12px;
      font-size: 12px;
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
      border-radius: 9px;
      padding: 8px 12px;
      font-size: 11px;
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
      gap: 6px;
    }

    .sjg-btn-letter {
      background: #1e293b;
      color: #cbd5e1;
      border: 1px solid #334155;
      border-radius: 7px;
      padding: 7px;
      font-size: 10.5px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
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
      border-radius: 7px;
      padding: 7px;
      font-size: 10.5px;
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

    .sjg-edit-overlay {
      position: absolute;
      inset: 0;
      background: rgba(9, 13, 22, 0.98);
      border-radius: 20px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 10;
      overflow-y: auto;
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
      font-size: 12px;
      line-height: 1.5;
      font-family: inherit;
    }

    .sjg-input-group textarea {
      resize: vertical;
      min-height: 140px;
      white-space: pre-wrap;
    }

    .sjg-edit-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 10px;
      padding-bottom: 10px;
    }
  `;

  /**
   * Render or Update HUD UI inside Shadow DOM
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
        <!-- Hidden file input for resume uploading (Supports up to 100,000 chars) -->
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
          <div class="sjg-pill-badge">${evaluation.isScanning ? '···' : `${evaluation.overallMatchScore}%`}</div>
        </div>

        <!-- Bottom-Right Floating Panel -->
        <div id="sjg-hud-panel" class="sjg-hud-panel ${isModalOpen ? 'open' : ''}">
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
              <div style="margin-top: 6px; display: flex; align-items: center; gap: 6px;">
                <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 5px; background: rgba(56, 189, 248, 0.12); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3);">
                  🌐 ${escapeHtml(evaluation.detectedDomain || 'Cross-Domain Ready')}
                </span>
              </div>
            </div>

            <!-- Candidate Profile Card -->
            <div class="sjg-card">
              <div class="sjg-card-header">
                <span style="font-size: 11px; font-weight: 700; color: #cbd5e1; display: flex; align-items: center; gap: 5px;">
                  📄 Candidate Profile
                </span>
                <div class="sjg-candidate-actions">
                  <button id="sjg-upload-resume-btn" class="sjg-btn-upload" title="Upload Resume (.pdf, .docx, .txt, .json)">
                    📤 Upload Resume
                  </button>
                  <button id="sjg-quick-save-btn" class="sjg-btn-upload" style="background:#059669; border-color:#10b981;" title="Save profile">
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
                  <div style="font-size:11px; color:#94a3b8; line-height:1.5; max-height:180px; overflow-y:auto; white-space:pre-wrap; background:rgba(0,0,0,0.3); padding:8px; border-radius:6px;">${escapeHtml(candidateProfile.rawResumeText || 'No raw resume content uploaded yet.')}</div>
                </div>
              ` : ''}
            </div>

            <!-- Match Card -->
            <div class="sjg-match-card" style="border-color: ${evaluation.tierColor}66;">
              <div class="sjg-match-header" style="margin-bottom: 6px;">
                <div class="sjg-match-tier">
                  <span style="color: ${evaluation.tierColor}; font-size:16px;">${evaluation.isAwaitingJob ? '🔍' : (evaluation.isScanning ? '⏳' : '✅')}</span>
                  <span style="color: #ffffff; font-weight:800; font-size: 14px;">${evaluation.isAwaitingJob ? 'Ready for Job Selection' : (evaluation.isScanning ? 'Scanning Job Description…' : `Smart Match — ${escapeHtml(evaluation.tierTitle)}`)}</span>
                </div>
              </div>

              <div class="sjg-match-desc" style="font-weight: 700; color: #fff; margin-bottom: 5px;">
                ${evaluation.isAwaitingJob ? `Click any job posting on ${escapeHtml(job.platform || 'board')} to inspect full JD & fit score` : (evaluation.isScanning ? 'Extracting the full job description before scoring…' : `Role Fit Score: ${evaluation.overallMatchScore}% ${escapeHtml(evaluation.tierTitle)}`)}
              </div>
              
              <div class="sjg-match-inner">
                <div class="sjg-ring-box">
                  <svg class="sjg-ring-svg" viewBox="0 0 54 54">
                    <circle cx="27" cy="27" r="22" stroke="#1e293b" stroke-width="4" fill="none" />
                    <circle cx="27" cy="27" r="22" stroke="${evaluation.tierColor}" stroke-width="4" fill="none"
                            stroke-dasharray="138"
                            stroke-dashoffset="${(evaluation.isAwaitingJob || evaluation.isScanning) ? 138 : strokeDashoffset}"
                            stroke-linecap="round"
                            ${(evaluation.isAwaitingJob || evaluation.isScanning) ? '' : `style="--sjg-ring-target: ${strokeDashoffset}; animation: sjgRingFill 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;"`} />
                  </svg>
                  <div class="sjg-ring-text">
                    <span class="sjg-ring-num" style="color:${evaluation.tierColor}; font-size: ${(evaluation.isAwaitingJob || evaluation.isScanning) ? '10px' : '14px'};">${evaluation.isAwaitingJob ? 'READY' : (evaluation.isScanning ? '···' : `${evaluation.overallMatchScore}%`)}</span>
                  </div>
                </div>
                <div class="sjg-match-inner-text">
                  <div class="sjg-match-inner-title" style="font-size: 13px;">${evaluation.isAwaitingJob ? 'Awaiting Target JD' : (evaluation.isScanning ? 'Reading Description' : (evaluation.overallMatchScore >= 75 ? 'Strong Alignment' : 'Transferable Match'))}</div>
                  <div class="sjg-match-inner-stats">
                    ${evaluation.isAwaitingJob 
                      ? `<span style="color:#94a3b8;">Candidate skills ready (${candidateProfile.skills.length})</span>`
                      : (evaluation.isScanning
                        ? `<span style="color:#94a3b8;">Waiting on full job text…</span>`
                        : `Skills: <strong style="color:#34d399;">${evaluation.verifiedSkills.length}</strong> matched | Gaps: <strong style="color:#f59e0b;">${evaluation.missingSkillGaps.length}</strong>`)}
                  </div>
                </div>
              </div>
            </div>

            <!-- Verified Skills -->
            <div class="sjg-section-header">
              <span class="sjg-verified-label">
                ✓ Verified Skills (Have it)
              </span>
              <span class="sjg-total-count">Total ${evaluation.verifiedSkills.length}</span>
            </div>
            <div class="sjg-chips-list">
              ${evaluation.verifiedSkills.length > 0 ? evaluation.verifiedSkills.map(skill => `
                <div class="sjg-chip verified">
                  <span>•</span>
                  <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;" title="${escapeHtml(skill.name)}">${escapeHtml(skill.name)}</span>
                </div>
              `).join('') : '<div style="color:#64748b; font-size:11px; padding:4px 0;">No overlapping skills identified in target JD.</div>'}
            </div>

            <!-- Skill Gaps -->
            <div class="sjg-section-header">
              <span class="sjg-gaps-label">
                ⚠️ Skill Gaps (Missing)
              </span>
              <span class="sjg-total-count">Total ${evaluation.missingSkillGaps.length}</span>
            </div>
            <div class="sjg-chips-list">
              ${evaluation.missingSkillGaps.length > 0 ? evaluation.missingSkillGaps.map(gap => `
                <div class="sjg-chip gap">
                  <span>•</span>
                  <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;" title="${escapeHtml(gap.name)}">${escapeHtml(gap.name)}</span>
                </div>
              `).join('') : '<div style="color:#34d399; font-size:11px; padding:4px 0;">🎉 All core JD requirements covered! Zero skill gaps.</div>'}
            </div>

            <!-- Action Buttons -->
            <div class="sjg-cover-letter-options" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #1e293b;">
              <div style="color: #94a3b8; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; font-weight:700;">Generate Tailored Application</div>
              <div class="sjg-buttons-row">
                <button id="sjg-cl-free-btn" class="sjg-btn-letter">
                  ✉️ 3-Tier Professional
                </button>
                <button id="sjg-cl-pro-btn" class="sjg-btn-faang">
                  👑 4-Tier Executive
                </button>
              </div>
            </div>

            <button id="sjg-open-dashboard-btn" class="sjg-btn-executive">
              👑 Open in Executive Dashboard (PRO)
            </button>

            <button id="sjg-smart-pivot-btn" class="sjg-btn-pivot">
              ✨ 🌟 Smart Career Pivot Discovery (Cross-Domain Analysis)
            </button>

          </div>

          <!-- Edit Candidate Overlay Sub-dialog (Full un-truncated multi-line view) -->
          ${isEditCandidateOpen ? `
            <div class="sjg-edit-overlay">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4 style="color:#fff; font-size:13px; font-weight:800;">✏️ Edit Candidate Profile</h4>
                <button id="sjg-cancel-edit-btn" style="background:none; border:none; color:#64748b; font-size:18px; cursor:pointer;">✕</button>
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
                <label>Skills (Comma-separated, ${candidateProfile.skills.length} total):</label>
                <input id="sjg-edit-skills" value="${escapeHtml(candidateProfile.skills.join(', '))}" />
              </div>
              <div class="sjg-input-group">
                <label>Full Raw Resume / Work Experience Highlights (${candidateProfile.rawResumeText.length} characters):</label>
                <textarea id="sjg-edit-resume" rows="10" placeholder="Paste full resume text here without any character truncation...">${escapeHtml(candidateProfile.rawResumeText)}</textarea>
              </div>
              <div class="sjg-edit-actions">
                <button id="sjg-discard-edit-btn" class="sjg-btn-rescan">Cancel</button>
                <button id="sjg-save-edit-btn" class="sjg-btn-rescan" style="background:#059669; color:#fff; border-color:#10b981; font-weight:700;">💾 Save Full Profile</button>
              </div>
            </div>
          ` : ''}

        </div>
      `;

      // Event Listeners
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

      // Resume Upload Logic - NO TRUNCATION (Up to 100,000 characters)
      const fileInput = wrapper.querySelector('#sjg-resume-file-input');
      const uploadBtn = wrapper.querySelector('#sjg-upload-resume-btn');

      uploadBtn?.addEventListener('click', () => {
        if (fileInput) {
          fileInput.value = '';
          fileInput.click();
        }
      });

      fileInput?.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (uploadBtn) {
          uploadBtn.innerHTML = `⏳ Parsing ${file.name}...`;
        }

        try {
          let text = '';
          let formatName = file.name.split('.').pop()?.toUpperCase() || 'FILE';

          if (typeof SuperJobResumeParser !== 'undefined' && SuperJobResumeParser.parseResumeFile) {
            const parsed = await SuperJobResumeParser.parseResumeFile(file);
            text = parsed.text;
            formatName = parsed.format;
          } else {
            // Fallback plain text reader
            text = await new Promise((res, rej) => {
              const r = new FileReader();
              r.onload = () => res(r.result || '');
              r.onerror = rej;
              r.readAsText(file, 'utf-8');
            });
          }

          if (!text || text.trim().length < 40) {
            alert(`⚠️ Notice: We could not extract readable text from "${file.name}".\n\nThis usually happens if the PDF is a scanned image without a text layer or password-protected.\n\nTip: You can upload a .txt / .docx version, or paste your resume text directly into the "Edit Profile" box!`);
            isEditCandidateOpen = true;
            renderShadowUI();
            return;
          }

          // Improve title/role extraction from file content
          const textLines = text.split('\n').filter(l => l.trim().length > 0);
          const firstLine = textLines[0].trim();
          
          const fileNameClean = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          candidateProfile.name = fileNameClean;
          
          // Try to find a role in the first few lines
          const roleMatch = firstLine.match(/(Software Engineer|Finance Analyst|Data Scientist|Product Manager|Developer)/i) || 
                            textLines.find(l => l.match(/(Software Engineer|Finance Analyst|Data Scientist|Product Manager|Developer)/i));
                            
          candidateProfile.title = roleMatch ? roleMatch[0] : fileNameClean;
          candidateProfile.targetRole = roleMatch ? roleMatch[0] : 'Software Engineer';
          
          // Full unabridged raw text ingestion (up to 100,000 chars)
          candidateProfile.rawResumeText = text.slice(0, 100000);

          // Comprehensive skill extraction across all technical & finance domains
          const extractedSkills = extractSkillsFromResumeText(text);
          if (extractedSkills.length > 0) {
            candidateProfile.skills = extractedSkills;
          }

          // Estimate years of experience if mentioned in text (e.g., "15+ years")
          const expMatch = text.match(/(\d+)\+?\s*years?\s*(?:of)?\s*(?:experience|comprehensive)/i);
          if (expMatch && expMatch[1]) {
            candidateProfile.yearsOfExperience = parseInt(expMatch[1], 10);
          }

          saveProfileToStorage();

          if (uploadBtn) {
            uploadBtn.innerHTML = `✅ Ingested ${formatName} (${extractedSkills.length} skills)!`;
            setTimeout(() => {
              renderShadowUI();
            }, 1200);
          } else {
            renderShadowUI();
          }
        } catch (err) {
          console.error('[SuperJobGenie] Resume parse error:', err);
          alert(`⚠️ Upload Notice: Could not parse "${file.name}".\n\nReason: ${err.message || 'Scanned image or binary format'}.\n\nTip: You can use .txt, .docx, or paste your text directly in "Edit Profile".`);
          isEditCandidateOpen = true;
          renderShadowUI();
        }
      });

      wrapper.querySelector('#sjg-quick-save-btn')?.addEventListener('click', () => {
        saveProfileToStorage();
        const btn = wrapper.querySelector('#sjg-quick-save-btn');
        if (btn) {
          btn.innerText = '✅ Saved!';
          setTimeout(() => {
            btn.innerText = '💾 Save';
          }, 1500);
        }
        renderShadowUI();
      });

      wrapper.querySelector('#sjg-clear-btn')?.addEventListener('click', () => {
        if (confirm('Clear current candidate profile completely?')) {
          candidateProfile = {
            name: 'Candidate (Cleared)',
            title: 'Applicant',
            targetRole: 'Target Role',
            yearsOfExperience: 0,
            skills: [],
            rawResumeText: ''
          };
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

      // Save Full Candidate Profile without truncation
      wrapper.querySelector('#sjg-save-edit-btn')?.addEventListener('click', () => {
        const newTitle = wrapper.querySelector('#sjg-edit-title')?.value || candidateProfile.title;
        const newExp = parseInt(wrapper.querySelector('#sjg-edit-exp')?.value || '0', 10);
        const newSkills = (wrapper.querySelector('#sjg-edit-skills')?.value || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        const newResume = wrapper.querySelector('#sjg-edit-resume')?.value || '';

        candidateProfile.title = newTitle;
        candidateProfile.yearsOfExperience = newExp;
        candidateProfile.skills = newSkills;
        candidateProfile.rawResumeText = newResume;
        saveProfileToStorage();
        isEditCandidateOpen = false;
        renderShadowUI();
      });

      // External actions
      const remoteDashboardUrl = 'https://ais-dev-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app';

      wrapper.querySelector('#sjg-open-dashboard-btn')?.addEventListener('click', () => {
        try {
          const url = new URL(remoteDashboardUrl);
          url.searchParams.set('tab', 'diagnostics');
          if (job?.title && job.title !== 'Select a Job on Indeed') {
            url.searchParams.set('title', job.title);
            url.searchParams.set('company', job.company || '');
          }
          window.open(url.toString(), '_blank');
        } catch (e) {
          window.open(remoteDashboardUrl, '_blank');
        }
      });

      wrapper.querySelector('#sjg-smart-pivot-btn')?.addEventListener('click', () => {
        if (evaluation.overallMatchScore < 60) {
          const pivotQuery = encodeURIComponent(candidateProfile.targetRole || 'Software Engineer');
          window.open(`https://www.indeed.com/jobs?q=${pivotQuery}`, '_blank');
        } else {
          try {
            const url = new URL(remoteDashboardUrl);
            url.searchParams.set('tab', 'pivot');
            if (job?.title && job.title !== 'Select a Job on Indeed') {
              url.searchParams.set('title', job.title);
              url.searchParams.set('company', job.company || '');
              // Sync score and tier for consistent UI across devices
              url.searchParams.set('score', evaluation.overallMatchScore.toString());
              url.searchParams.set('tier', evaluation.matchTier);
            }
            window.open(url.toString(), '_blank');
          } catch (e) {
            window.open(`${remoteDashboardUrl}?tab=pivot`, '_blank');
          }
        }
      });

      wrapper.querySelector('#sjg-cl-free-btn')?.addEventListener('click', () => {
        // Ensure we use the full name without ellipsis
        const topSkills = evaluation.verifiedSkills.length > 0
          ? evaluation.verifiedSkills.map(s => s.fullName || s.name).map(n => n.replace('…', ''))
          : candidateProfile.skills.slice(0, 4);

        // Robustly detect job source using full URL and set display label
        const url = window.location.href.toLowerCase();
        let jobSource = 'our platform';
        let portfolioLabel = 'Portfolio';
        if (url.includes('indeed.com')) {
          jobSource = 'Indeed';
          portfolioLabel = 'Indeed Profile/Portfolio';
        } else if (url.includes('linkedin.com')) {
          jobSource = 'LinkedIn';
          portfolioLabel = 'LinkedIn Profile';
        } else if (url.includes('glassdoor.com')) {
          jobSource = 'Glassdoor';
          portfolioLabel = 'Glassdoor Profile';
        }
        
        const candidateDisplayName = (candidateProfile.name && !candidateProfile.name.includes('PII Scrubbed') && candidateProfile.name !== 'Candidate Profile') 
          ? candidateProfile.name 
          : '[Your Name]';

        const cl = `[Your Name]
[Your Phone Number]  •  [Your Email]  •  [Your ${portfolioLabel} URL]

Dear Hiring Team at ${job.company || 'your organization'},

I am writing to express my strong enthusiasm for the ${job.title || 'engineering'} position, which I discovered through ${jobSource}. Having tracked ${job.company || 'your team'}'s technical innovations, I am eager to contribute my background in architecting scalable systems and resilient software infrastructure to your initiatives.

With over ${candidateProfile.yearsOfExperience || 10} years of hands-on engineering experience, I bring deep domain mastery aligned directly with your core technical requirements:
• ${topSkills[0] || 'High-performance backend systems & microservices'}
• ${topSkills[1] || 'Distributed architecture, data modeling & low-latency execution'}
• ${topSkills[2] || 'End-to-end testing, CI/CD automation & resilient cloud operations'}
${topSkills[3] ? `• ${topSkills[3]}` : ''}

Throughout my career, I have specialized in turning ambiguous product goals into robust, maintainable technical reality while championing clean code and team mentoring. I am particularly excited about ${job.company || 'your team'}'s scale and look forward to discussing how my experience can deliver immediate impact.

Thank you for your time and consideration.

Sincerely,

${candidateDisplayName}`;

        navigator.clipboard.writeText(cl);
        const btn = wrapper.querySelector('#sjg-cl-free-btn');
        if (btn) {
          btn.innerText = '✅ Copied!';
          setTimeout(() => { btn.innerText = '✉️ 3-Tier Professional'; }, 2000);
        }
      });

      wrapper.querySelector('#sjg-cl-pro-btn')?.addEventListener('click', () => {
        window.open(`${remoteDashboardUrl}?tab=coverletter`, '_blank');
      });

      // Fireworks celebration for >= 90% top-tier matches
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
   * Fireworks Particle Engine for Top Tier Matches
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
   * Rescan and Auto-detection Trigger
   */
  let lastJobKey = '';
  let lastBodyLength = 0;
  let lastHadRealBody = false;

  function checkAndAutoRescan(forceRescan = false) {
    if (isEditCandidateOpen) return; // Guard: Never auto-rescan while user is editing profile
    
    const job = extractFullIndeedJob();
    const currentJobKey = `${job.title}::${job.company}::${job.characterCount}::${job.jk || ''}`;
    const hasSubstantialBody = Boolean(job.fullBodyText && job.characterCount >= 80);

    const jobChanged = currentJobKey !== lastJobKey;
    const bodyNewlyArrived = !lastHadRealBody && hasSubstantialBody;
    const bodySignificantlyExpanded = Math.abs(job.characterCount - lastBodyLength) >= 20;

    if (!forceRescan && !jobChanged && !bodyNewlyArrived && !bodySignificantlyExpanded) {
      return;
    }

    lastJobKey = currentJobKey;
    lastBodyLength = job.characterCount;
    lastHadRealBody = hasSubstantialBody;
    cachedJobData = job;

    if (renderDebounceTimer) clearTimeout(renderDebounceTimer);
    if (forceRescan) {
      renderShadowUI();
    } else {
      renderDebounceTimer = setTimeout(() => {
        renderDebounceTimer = null;
        renderShadowUI();
      }, 100);
    }
  }

  // Keyboard Shortcuts
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

  // Extension Message Bridge
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

  // Initialize
  renderShadowUI();

  try {
    const initialJob = extractFullIndeedJob();
    cachedJobData = initialJob;
    renderShadowUI();
  } catch (err) {
    console.error('[SuperJobGenie] Initial scan error:', err);
  }

  // SPA navigation events
  window.addEventListener('popstate', () => {
    setTimeout(() => checkAndAutoRescan(true), 150);
    setTimeout(() => checkAndAutoRescan(true), 600);
  });
  window.addEventListener('hashchange', () => {
    setTimeout(() => checkAndAutoRescan(true), 150);
    setTimeout(() => checkAndAutoRescan(true), 600);
  });

  // Multi-platform Job Card Click Delegation (Indeed, Glassdoor, ZipRecruiter, LinkedIn)
  document.addEventListener('click', (e) => {
    if (e.target && (e.target.closest('#sjg-shadow-host-root') || e.target.id === 'sjg-shadow-host-root')) {
      return;
    }

    // Identify clicked job card across Indeed, Glassdoor, ZipRecruiter, and LinkedIn
    const cardEl = e.target.closest(
      // Indeed
      'div.job_seen_beacon, div[data-jk], li:has([data-jk]), div.cardOutline, .resultContent, a.jcs-JobTitle, ' +
      // Glassdoor
      '[data-test="job-listing-item"], li[data-test="jobListing"], li[data-id], article[data-test="job-card"], [class*="JobsList_jobListItem"], [class*="JobCard_"], a[data-test="job-link"], a[data-test="job-title"], ' +
      // ZipRecruiter
      'article.job_result, article.job_card, [data-testid="job-card"], [data-testid="job-result"], div[class*="job_result"], div[class*="jobCard"], li.job-listing, a.job_link, a[class*="job_link"], ' +
      // LinkedIn
      'li.jobs-search-results__list-item, div.job-card-container, div[data-job-id], .job-card-list, li.job-card-container--clickable, div.jobs-search-results-list__list-item'
    )?.closest('div.job_seen_beacon, div[data-jk], li, div.cardOutline, article, [data-test="job-listing-item"], div.job-card-container');

    if (cardEl && !cardEl.classList.contains('jobsearch-ResultsList') && cardEl.id !== 'mosaic-provider-jobcards') {
      const t = cardEl.querySelector('h1.job_title, h2.job_title, [class*="job_title"], a.job_link, a[data-test="job-title"], a[data-test="job-link"], [class*="jobTitle"], a.jcs-JobTitle, h2.jobTitle span[title], h2.jobTitle, a[id^="job_"], a.job-card-list__title, [class*="job-card-list__title"], h2, h3, a')?.innerText?.replace(/^new\s+/i, '')?.trim();
      const c = cardEl.querySelector('a.hiring_company_text, [data-testid="company-name"], [data-testid="hiring-company"], [class*="hiring_company"], [class*="company_name"], [data-test="employer-short-name"], [data-test="employer-name"], [class*="employerName"], .companyName, span.css-63koeb, [data-company-name="true"], .job-card-container__primary-description, span.job-card-container__primary-description')?.innerText?.trim();
      const jk = cardEl.getAttribute('data-jk') || cardEl.getAttribute('data-id') || cardEl.getAttribute('data-jobid') || cardEl.getAttribute('data-job-id') || cardEl.querySelector('[data-jk]')?.getAttribute('data-jk') || '';
      if (t && !isSearchHeader(t)) {
        lastClickedCard = { 
          title: t, 
          company: c ? c.replace(/[\d.]+\s*[★*]+.*$/g, '').trim() : '', 
          jk: jk || '' 
        };
      }
    }
    const timeouts = [50, 150, 350, 700, 1200, 2000];
    timeouts.forEach(delay => {
      setTimeout(() => checkAndAutoRescan(), delay);
    });
  }, true);

  // MutationObserver on document.body for reactive pane updates
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

  // Heartbeat fallback
  setInterval(() => {
    checkAndAutoRescan();
  }, 1000);

})();
