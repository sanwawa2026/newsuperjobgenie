document.addEventListener('DOMContentLoaded', async () => {
  const openInPageModalBtn = document.getElementById('openInPageModal');
  const openLocalDashboardBtn = document.getElementById('openLocalDashboard');
  const jobPreviewBox = document.getElementById('jobPreviewBox');
  const previewTitle = document.getElementById('previewTitle');
  const previewMeta = document.getElementById('previewMeta');
  const statusBadge = document.getElementById('statusBadge');
  const radarRoleInput = document.getElementById('radarRoleInput');
  const testRadarBtn = document.getElementById('testRadarBtn');
  const radarStatusText = document.getElementById('radarStatusText');

  let activeTab = null;

  // 1. Load saved radar preferences
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['radarConfig'], (res) => {
      if (res && res.radarConfig && res.radarConfig.targetRole) {
        if (radarRoleInput) radarRoleInput.value = res.radarConfig.targetRole;
      }
    });
  }

  // 2. Save radar role on change
  if (radarRoleInput) {
    radarRoleInput.addEventListener('change', () => {
      const val = radarRoleInput.value.trim();
      chrome.storage.local.get(['radarConfig'], (res) => {
        const config = res.radarConfig || {};
        config.targetRole = val;
        chrome.storage.local.set({ radarConfig: config });
      });
    });
  }

  // 3. Test Radar Ping Button
  if (testRadarBtn) {
    testRadarBtn.addEventListener('click', () => {
      const role = radarRoleInput ? radarRoleInput.value : 'Senior Engineer';
      testRadarBtn.disabled = true;
      testRadarBtn.innerText = '📡 Scanning Job Stream...';

      chrome.runtime.sendMessage({
        action: 'trigger_radar_test',
        role: role,
        company: 'SeaMoney / Shopee Tech (SG)'
      }, (res) => {
        setTimeout(() => {
          testRadarBtn.disabled = false;
          testRadarBtn.innerText = '✅ Alert Dispatched (96%)!';
          setTimeout(() => {
            testRadarBtn.innerText = '📡 测试雷达秒推 (Test Scout Alert)';
          }, 2000);
        }, 500);
      });
    });
  }

  // 4. Query current active tab and check page status
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs[0]) {
      activeTab = tabs[0];
      
      chrome.tabs.sendMessage(activeTab.id, { action: 'ping' }, (response) => {
        if (chrome.runtime.lastError) {
          if (statusBadge) {
            statusBadge.innerText = 'Ready on Page';
            statusBadge.style.color = '#fbbf24';
          }
        } else if (response && response.success) {
          if (statusBadge) {
            statusBadge.innerText = '● Connected';
            statusBadge.style.color = '#34d399';
          }
          if (jobPreviewBox && previewTitle && previewMeta) {
            jobPreviewBox.style.display = 'block';
            previewTitle.innerText = `🎯 ${response.jobTitle || 'Job Detected'}`;
            previewMeta.innerText = `${response.company || ''} • ${response.charCount ? response.charCount.toLocaleString() : 0} chars (${response.platform || 'Job Board'})`;
          }
        }
      });
    }
  } catch (e) {
    console.error(e);
  }

  // 5. Trigger in-page HUD modal
  if (openInPageModalBtn) {
    openInPageModalBtn.addEventListener('click', async () => {
      if (!activeTab || !activeTab.id) return;

      chrome.tabs.sendMessage(activeTab.id, { action: 'open_inpage_modal' }, async (response) => {
        if (chrome.runtime.lastError) {
          try {
            await chrome.scripting.executeScript({
              target: { tabId: activeTab.id, allFrames: true },
              files: ['content.js']
            });
            setTimeout(() => {
              chrome.tabs.sendMessage(activeTab.id, { action: 'open_inpage_modal' });
              window.close();
            }, 300);
          } catch (err) {
            alert('Please navigate to a job listing page (Indeed, LinkedIn, etc.) first.');
          }
        } else {
          window.close();
        }
      });
    });
  }

  // 6. Open Web Dashboard
  if (openLocalDashboardBtn) {
    openLocalDashboardBtn.addEventListener('click', () => {
      const dashboardUrl = 'https://ais-dev-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app';
      chrome.tabs.create({ url: dashboardUrl });
    });
  }
});
