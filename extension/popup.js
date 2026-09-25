document.addEventListener('DOMContentLoaded', async () => {
  const openInPageModalBtn = document.getElementById('openInPageModal');
  const openLocalDashboardBtn = document.getElementById('openLocalDashboard');
  const jobPreviewBox = document.getElementById('jobPreviewBox');
  const previewTitle = document.getElementById('previewTitle');
  const previewMeta = document.getElementById('previewMeta');
  const statusBadge = document.getElementById('statusBadge');

  let activeTab = null;

  // 1. 获取当前活跃 Tab 并检测状态
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs[0]) {
      activeTab = tabs[0];
      
      chrome.tabs.sendMessage(activeTab.id, { action: 'ping' }, (response) => {
        if (chrome.runtime.lastError) {
          // 当前页面可能尚未注入或为系统页面
          if (statusBadge) {
            statusBadge.innerText = '等待就绪';
            statusBadge.style.color = '#fbbf24';
          }
        } else if (response && response.success) {
          if (statusBadge) {
            statusBadge.innerText = '● 已连接页面';
            statusBadge.style.color = '#34d399';
          }
          if (jobPreviewBox && previewTitle && previewMeta) {
            jobPreviewBox.style.display = 'block';
            previewTitle.innerText = `🎯 ${response.jobTitle || '已捕获职位'}`;
            previewMeta.innerText = `${response.company || ''} • ${response.charCount ? response.charCount.toLocaleString() : 0} 字符 (${response.platform || '招聘网'})`;
          }
        }
      });
    }
  } catch (e) {
    console.error(e);
  }

  // 2. 唤起招聘网页内大弹窗
  if (openInPageModalBtn) {
    openInPageModalBtn.addEventListener('click', async () => {
      if (!activeTab || !activeTab.id) return;

      chrome.tabs.sendMessage(activeTab.id, { action: 'open_inpage_modal' }, async (response) => {
        if (chrome.runtime.lastError) {
          // 若 content script 尚未就绪，尝试动态注入
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
            alert('请在 Indeed、LinkedIn 等招聘职位页面上点击此按钮！');
          }
        } else {
          window.close(); // 成功唤起页面 HUD 后关闭此小弹窗
        }
      });
    });
  }

  // 3. 打开本地/远程 Web 全景控制台
  if (openLocalDashboardBtn) {
    openLocalDashboardBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://ais-dev-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app' });
    });
  }
});
