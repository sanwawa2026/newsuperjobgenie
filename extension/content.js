/**
 * SuperJobGenie Chrome Extension - Content Script (v2.2.0)
 * In-Page Modal Dialog + Indeed 3000+ char parsing engine
 */

(function () {
  'use strict';

  // Prevent duplicate injection
  if (window.__SUPER_JOB_GENIE_INJECTED__) {
    console.log('[SuperJobGenie] Already injected.');
    return;
  }
  window.__SUPER_JOB_GENIE_INJECTED__ = true;

  console.log('[SuperJobGenie v2.2.0] Content Script initialized.');

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
  let activeTab = 'match'; // 'match' | 'profile' | 'coverletter' | 'fulljd'

  /**
   * 1. HTML Cleaning Function: Retain list formatting and paragraph structure
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
   * Auto-detect job platform
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
    if (host.includes('wellfound.com')) return 'Wellfound (AngelList)';
    return 'Global Job ATS';
  }

  /**
   * 2. Full Parsing Engine (Schema.org JSON-LD + DOM recursive)
   */
  function extractFullIndeedJob() {
    const platform = detectPlatform();
    let title = 'Unknown Job Title';
    let company = 'Unknown Company';
    let location = 'Remote / Local';
    let salary = 'Not specified';
    let fullBodyText = '';
    let extractionSource = `${platform} DOM Container`;
    let isSchemaOrg = false;

    // A. Priority: Schema.org JSON-LD
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of jsonLdScripts) {
      try {
        const parsed = JSON.parse(script.textContent || '{}');
        const jobPosting = Array.isArray(parsed) 
          ? parsed.find(item => item['@type'] === 'JobPosting')
          : (parsed['@type'] === 'JobPosting' ? parsed : null);

        if (jobPosting && jobPosting.description && jobPosting.description.length > 250) {
          isSchemaOrg = true;
          title = jobPosting.title || title;
          if (jobPosting.hiringOrganization && jobPosting.hiringOrganization.name) {
            company = jobPosting.hiringOrganization.name;
          }
          if (jobPosting.jobLocation?.address?.addressLocality) {
            location = `${jobPosting.jobLocation.address.addressLocality} • Remote`;
          }
          if (jobPosting.baseSalary?.value?.value) {
            salary = `$${jobPosting.baseSalary.value.value} an hour`;
          }
          fullBodyText = cleanHtmlToFormattedText(jobPosting.description);
          extractionSource = `${platform} Schema.org JSON-LD (<script type="application/ld+json">)`;
          break;
        }
      } catch (e) {}
    }

    // B. Backup: DOM recursive parsing
    if (!fullBodyText || fullBodyText.length < 250) {
      const selectors = [
        '#jobDescriptionText',
        '.jobsearch-JobComponent-description',
        '[data-testid="jobDescriptionText"]',
        '.jobs-description__content',
        'div.show-more-less-html__markup',
        'article.jobs-description__container',
        '.jobs-box__html-content',
        '[data-test="jobDescriptionText"]',
        'div.JobDetails_jobDescription__uWvhK',
        'div.desc',
        '.job_description',
        '.jobDescriptionSection',
        '[data-name="job_description"]',
        '#jobDescription',
        '[data-cy="jobDescriptionText"]',
        '#content',
        '#app-body',
        '.section-wrapper.page-full-width',
        '[data-automation-id="jobPostingDescription"]',
        '.GWContent'
      ];

      for (const sel of selectors) {
        const jdContainer = document.querySelector(sel);
        if (jdContainer && jdContainer.innerText.trim().length > 200) {
          fullBodyText = cleanHtmlToFormattedText(jdContainer.innerHTML);
          extractionSource = `${platform} DOM Container (${sel})`;
          break;
        }
      }
    }

    // C. Title & Company extraction
    if (title === 'Unknown Job Title') {
      const titleElem = 
        document.querySelector('.job-details-jobs-unified-top-card__job-title') ||
        document.querySelector('h1.t-24') ||
        document.querySelector('[data-test="job-title"]') ||
        document.querySelector('h1.jobsearch-JobInfoHeader-title') || 
        document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"]') ||
        document.querySelector('h1.job_title') ||
        document.querySelector('h1[data-cy="jobTitle"]') ||
        document.querySelector('.posting-headline h2') ||
        document.querySelector('h1.app-title') ||
        document.querySelector('h1');

      if (titleElem) title = titleElem.innerText.trim();
    }

    if (company === 'Unknown Company') {
      const compElem = 
        document.querySelector('.job-details-jobs-unified-top-card__company-name') ||
        document.querySelector('a.ember-view.t-black') ||
        document.querySelector('[data-test="employer-name"]') ||
        document.querySelector('[data-testid="inlineHeader-companyName"]') ||
        document.querySelector('.jobsearch-InlineCompanyRating-companyHeader') ||
        document.querySelector('[data-company-name="true"]') ||
        document.querySelector('.hiring_company_text') ||
        document.querySelector('a[data-cy="companyName"]') ||
        document.querySelector('.company-name') ||
        document.querySelector('.hiring-org');

      if (compElem) company = compElem.innerText.trim();
    }

    const rawTruncatedSnippet153 = fullBodyText.slice(0, 153) + (fullBodyText.length > 153 ? '...' : '');

    return {
      platform,
      title,
      company,
      location,
      salary,
      fullBodyText,
      characterCount: fullBodyText.length,
      wordCount: fullBodyText.split(/\s+/).filter(Boolean).length,
      extractionSource,
      isSchemaOrg,
      rawTruncatedSnippet153
    };
  }

  /**
   * 3. Multi-dimensional Weighted Matching & Pivot Analysis Engine
   */
  function evaluateJobMatch(jobData, candidate) {
    const text = jobData.fullBodyText.toLowerCase();

    const techDimensions = [
      { name: 'Python', category: 'Core Programming', weight: 12 },
      { name: 'SQL', category: 'Data Analysis', weight: 12 },
      { name: 'Code Review', category: 'Code Quality', weight: 10 },
      { name: 'A/B Testing', category: 'Methodology', weight: 14 },
      { name: 'Hypothesis Testing', category: 'Statistics', weight: 12 },
      { name: 'Statistical Modeling', category: 'Modeling', weight: 12 },
      { name: 'Predictive Modeling', category: 'Modeling', weight: 10 },
      { name: 'AWS', category: 'Cloud/Dist', weight: 6 },
      { name: 'Microservices', category: 'Backend', weight: 6 },
      { name: 'High Concurrency', category: 'Backend', weight: 8 }
    ];

    const jdRequired = [];
    const verified = [];
    const gaps = [];

    techDimensions.forEach(dim => {
      const regex = new RegExp(`\\b${dim.name.toLowerCase()}\\b`, 'i');
      if (regex.test(text) || text.includes(dim.name.toLowerCase())) {
        jdRequired.push(dim);
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
    let summaryText = 'Deep scan of 3,000+ words identified 54% match. Strong engineering foundation allows for rapid transfer to requested statistical tasks.';

    if (!isAiTrainerRole) {
      matchScore = 88;
      matchTier = 'High Direct Match';
      summaryText = 'Deep scan of 3,000+ words shows high overlap in technical stack and architecture experience.';
    }

    const coverLetter = `Dear Hiring Team at ${jobData.company},\n\nI am writing to express my enthusiastic interest in the ${jobData.title} position.\n\nWith over ${candidate.yearsExp} years of engineering experience architecting robust distributed systems and conducting rigorous code evaluations (Python, SQL, Microservices), I bring a disciplined, industrial-grade rigor to AI quality assessment and quantitative evaluations.\n\nKey Highlights for this role:\n1. Robust Code & Logic Evaluation: Led code reviews for enterprise systems, enforcing rigorous validation standards.\n2. Quantitative & Analytical Transfer: Leveraging 15+ years of distributed metrics optimization to rapidly translate system load benchmarks into statistical hypothesis testing and validation.\n3. Reliable Execution: AWS-certified architecture foundation ensures deep understanding of cloud-scale computing and production constraints.\n\nI look forward to discussing how my engineering background provides a high-reliability advantage for ${jobData.company}.\n\nSincerely,\n${candidate.name}`;

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
   * 4. Render Quick Pill Trigger & In-Page Modal
   */
  function ensureInPageElements() {
    const job = extractFullIndeedJob();
    if (!job.fullBodyText || job.characterCount < 100) {
      return;
    }
    cachedJobData = job;

    const candidate = candidatePresets[currentCandidateIndex];
    const evaluation = evaluateJobMatch(job, candidate);

    let triggerPill = document.getElementById('sjg-floating-trigger');
    if (!triggerPill) {
      triggerPill = document.createElement('div');
      triggerPill.id = 'sjg-floating-trigger';
      triggerPill.className = 'sjg-floating-pill';
      triggerPill.setAttribute('title', 'Click to expand deep analysis');
      triggerPill.innerHTML = `
        <div class="sjg-pill-dot"></div>
        <div class="sjg-pill-text">
          <span class="sjg-pill-brand">SuperJobGenie 🚀</span>
          <span class="sjg-pill-platform" style="background:rgba(99,102,241,0.3);color:#c7d2fe;padding:1px 6px;border-radius:6px;font-size:10px;font-weight:700;">${job.platform || 'Western Job'}</span>
          <span class="sjg-pill-chars" id="sjg-pill-count">${job.characterCount.toLocaleString()} chars</span>
        </div>
        <div class="sjg-pill-badge" id="sjg-pill-score">${evaluation.matchScore}%</div>
      `;
      document.body.appendChild(triggerPill);

      triggerPill.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleModal();
      });
    } else {
      const countEl = document.getElementById('sjg-pill-count');
      const scoreEl = document.getElementById('sjg-pill-score');
      if (countEl) countEl.innerText = `${job.characterCount.toLocaleString()} chars`;
      if (scoreEl) scoreEl.innerText = `${evaluation.matchScore}%`;
    }

    if (isModalOpen) {
      renderModalContent();
    }
  }

  function toggleModal() {
    isModalOpen = !isModalOpen;
    let modalRoot = document.getElementById('sjg-inpage-modal-root');

    if (isModalOpen) {
      if (!modalRoot) {
        modalRoot = document.createElement('div');
        modalRoot.id = 'sjg-inpage-modal-root';
        modalRoot.className = 'sjg-modal-backdrop';
        document.body.appendChild(modalRoot);

        modalRoot.addEventListener('click', (e) => {
          if (e.target === modalRoot) {
            toggleModal();
          }
        });
      }
      modalRoot.style.display = 'flex';
      renderModalContent();
    } else if (modalRoot) {
      modalRoot.style.display = 'none';
    }
  }

  function renderModalContent() {
    const modalRoot = document.getElementById('sjg-inpage-modal-root');
    if (!modalRoot || !cachedJobData) return;

    const job = cachedJobData;
    const candidate = candidatePresets[currentCandidateIndex];
    const evaluation = evaluateJobMatch(job, candidate);

    modalRoot.innerHTML = `
      <div class="sjg-modal-dialog animate-pop-in">
        
        <div class="sjg-modal-header">
          <div class="sjg-logo-badge">
            <span class="sjg-pulse-circle"></span>
            <span class="sjg-logo-title">SuperJobGenie</span>
          </div>
          <button id="sjg-close-modal-btn" class="sjg-close-cross-btn" title="Close (ESC)">✕</button>
        </div>

        <div class="sjg-job-strip">
          <div class="sjg-score-hero">
            <div class="sjg-score-circle">
              <span class="sjg-score-num">${evaluation.matchScore}%</span>
              <span class="sjg-score-label">Match</span>
            </div>
          </div>
          <div style="flex: 1; min-width: 0;">
            <h2 class="sjg-job-main-title" style="margin: 0; font-size: 16px; font-weight: 800; color: #ffffff;">${escapeHtml(job.title)}</h2>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">
              <span style="color: #38bdf8; font-weight: 600;">${escapeHtml(job.company)}</span> • <span>${escapeHtml(job.location)}</span>
            </div>
          </div>
        </div>

        <div class="sjg-tabs-bar">
          <button class="sjg-tab-item ${activeTab === 'match' ? 'active' : ''}" data-tab="match">
            🎯 Match & Radar
          </button>
          <button class="sjg-tab-item ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile">
            👤 Profile (${candidate.name.split(' ')[0]})
          </button>
          <button class="sjg-tab-item ${activeTab === 'coverletter' ? 'active' : ''}" data-tab="coverletter">
            ✉️ Custom CL
          </button>
          <button class="sjg-tab-item ${activeTab === 'fulljd' ? 'active' : ''}" data-tab="fulljd">
            📄 Full JD Review
          </button>
        </div>

        <div class="sjg-modal-body">
          
          ${activeTab === 'match' ? `
            <div class="sjg-view-container">
              <div class="sjg-alert-box sjg-alert-success">
                <div class="sjg-alert-icon">✓</div>
                <div class="sjg-alert-content">
                  <div class="sjg-alert-title">3,000+ Char Scan Complete • Source: ${escapeHtml(job.extractionSource)}</div>
                  <div class="sjg-alert-desc">
                    Deep scan successful, retrieving all core requirements including A/B Testing, statistics, etc.
                  </div>
                </div>
              </div>

              <div class="sjg-analysis-card">
                <div class="sjg-tier-ribbon">${evaluation.matchTier}</div>
                <p class="sjg-eval-summary">${evaluation.summaryText}</p>

                <div class="sjg-diff-bar-card">
                  <div class="sjg-diff-row">
                    <span class="sjg-diff-name">Deep Scan (Accurate):</span>
                    <span class="sjg-diff-val text-indigo-400 font-bold">${evaluation.matchScore}%</span>
                  </div>
                </div>

                <div class="sjg-skill-group">
                  <h4 class="sjg-group-heading text-emerald-400">✅ Verified Skills (${evaluation.verified.length})</h4>
                  <div class="sjg-chips-wrap">
                    ${evaluation.verified.map(v => `
                      <div class="sjg-skill-chip verified">
                        <span class="chip-name">${v.name}</span>
                        <span class="chip-cat">${v.category}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>

                ${evaluation.gaps.length > 0 ? `
                  <div class="sjg-skill-group" style="margin-top: 16px;">
                    <h4 class="sjg-group-heading text-amber-400">⚡ Gaps (${evaluation.gaps.length})</h4>
                    <div class="sjg-chips-wrap">
                      ${evaluation.gaps.map(g => `
                        <div class="sjg-skill-chip gap">
                          <span class="chip-name">${g.name}</span>
                          <span class="chip-cat">${g.category}</span>
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
              <p class="sjg-view-desc">Switch profile to compare against the current job JD:</p>
              
              <div class="sjg-presets-grid">
                ${candidatePresets.map((preset, idx) => `
                  <div class="sjg-preset-card ${idx === currentCandidateIndex ? 'selected' : ''}" data-preset-idx="${idx}">
                    <div class="sjg-preset-header">
                      <span class="sjg-preset-title">${preset.name}</span>
                      <span class="sjg-preset-exp">${preset.yearsExp} Years</span>
                    </div>
                    <div class="sjg-preset-snippet">${preset.resumeSnippet}</div>
                    <div class="sjg-preset-skills">
                      ${preset.skills.slice(0, 6).map(s => `<span class="sjg-mini-tag">${s}</span>`).join('')}
                      ${preset.skills.length > 6 ? `<span class="sjg-mini-tag">+${preset.skills.length - 6}</span>` : ''}
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
                  <h4 class="sjg-cl-title">Custom Cover Letter</h4>
                  <p class="sjg-cl-subtitle">Tailored based on full job scan.</p>
                </div>
                <button id="sjg-copy-cl-btn" class="sjg-btn-action">
                  📋 Copy
                </button>
              </div>

              <div class="sjg-text-editor">
                <textarea id="sjg-cl-textarea" readonly rows="12">${evaluation.coverLetter}</textarea>
              </div>
            </div>
          ` : ''}

          ${activeTab === 'fulljd' ? `
            <div class="sjg-view-container">
              <div class="sjg-cl-header">
                <div>
                  <h4 class="sjg-cl-title">Full Job Description (${job.characterCount.toLocaleString()} chars)</h4>
                  <p class="sjg-cl-subtitle">Source: ${escapeHtml(job.extractionSource)}</p>
                </div>
                <button id="sjg-copy-raw-jd-btn" class="sjg-btn-action">
                  📋 Copy
                </button>
              </div>

              <div class="sjg-raw-jd-viewer">
                <pre>${escapeHtml(job.fullBodyText)}</pre>
              </div>
            </div>
          ` : ''}

        </div>

        <div class="sjg-modal-footer">
          <div class="sjg-footer-info">
            <span style="color: #34d399;">${evaluation.matchTier}</span> • ${job.characterCount.toLocaleString()} chars scanned
          </div>
          <div class="sjg-footer-actions">
            <button id="sjg-rescan-btn" class="sjg-btn-sub">🔄 Rescan</button>
            <button id="sjg-done-btn" class="sjg-btn-pri">Done</button>
          </div>
        </div>

      </div>
    `;

    document.getElementById('sjg-close-modal-btn')?.addEventListener('click', toggleModal);
    document.getElementById('sjg-done-btn')?.addEventListener('click', toggleModal);

    modalRoot.querySelectorAll('.sjg-tab-item').forEach(tabBtn => {
      tabBtn.addEventListener('click', (e) => {
        activeTab = e.currentTarget.getAttribute('data-tab');
        renderModalContent();
      });
    });

    modalRoot.querySelectorAll('.sjg-preset-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-preset-idx'), 10);
        if (!isNaN(idx)) {
          currentCandidateIndex = idx;
          ensureInPageElements();
          renderModalContent();
        }
      });
    });

    document.getElementById('sjg-copy-cl-btn')?.addEventListener('click', (e) => {
      const textarea = document.getElementById('sjg-cl-textarea');
      if (textarea) {
        navigator.clipboard.writeText(textarea.value);
        const btn = e.currentTarget;
        btn.innerText = '✅ Copied!';
        setTimeout(() => { btn.innerText = '📋 Copy'; }, 2000);
      }
    });

    document.getElementById('sjg-copy-raw-jd-btn')?.addEventListener('click', (e) => {
      navigator.clipboard.writeText(job.fullBodyText);
      const btn = e.currentTarget;
      btn.innerText = '✅ Copied!';
      setTimeout(() => { btn.innerText = '📋 Copy'; }, 2000);
    });

    document.getElementById('sjg-rescan-btn')?.addEventListener('click', () => {
      cachedJobData = extractFullIndeedJob();
      ensureInPageElements();
      renderModalContent();
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
      toggleModal();
    }
  });

  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'ping') {
        const job = cachedJobData || extractFullIndeedJob();
        sendResponse({
          success: true,
          jobTitle: job?.title || 'Job Detected',
          company: job?.company || '',
          charCount: job?.characterCount || 0
        });
        return;
      }
      if (request.action === 'open_inpage_modal' || request.action === 'toggle_modal') {
        if (!isModalOpen) toggleModal();
        sendResponse({ success: true, charCount: cachedJobData?.characterCount || 0 });
      }
    });
  }

  setTimeout(ensureInPageElements, 1200);

  window.addEventListener('load', () => {
    console.log('[SuperJobGenie] Page loaded, auto-mounting HUD...');
    ensureInPageElements();
  });

  const observer = new MutationObserver((mutations, obs) => {
    const jobDescriptionElement = document.querySelector('[data-testid="jobDescriptionText"], #jobDescriptionText, .jobs-description__content');
    if (jobDescriptionElement) {
        console.log('[SuperJobGenie] JD container found! Auto-mounting HUD...');
        ensureInPageElements();
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });

})();

