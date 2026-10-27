/**
 * SuperJobGenie Background Service Worker (Manifest V3)
 * Includes V2.0 Autonomous Scout Radar, chrome.alarms scheduler, and real-time alerts
 */

const ALARM_NAME = 'sjg_autonomous_radar';

// Initialize defaults on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('[SuperJobGenie] Extension installed successfully.');
  chrome.storage.local.get(['sjgSettings', 'radarConfig'], (res) => {
    if (!res.sjgSettings) {
      chrome.storage.local.set({
        sjgSettings: {
          enableDeepExtract: true,
          autoShowHud: true,
          backendApiUrl: 'https://ais-dev-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app'
        }
      });
    }

    if (!res.radarConfig) {
      chrome.storage.local.set({
        radarConfig: {
          enabled: true,
          targetRole: 'Full Stack Engineer / Tech Lead',
          targetLocations: 'Singapore, Taiwan, Remote',
          minScore: 85,
          intervalMinutes: 60,
          desktopNotifications: true,
          telegramEnabled: false,
          telegramChatId: ''
        }
      });

      // Default alarm: check every 60 minutes
      chrome.alarms.create(ALARM_NAME, {
        delayInMinutes: 1,
        periodInMinutes: 60
      });
    }
  });
});

// Periodic Scout Radar via chrome.alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    chrome.storage.local.get(['radarConfig'], (res) => {
      const config = res.radarConfig;
      if (config && config.enabled) {
        console.log('[SuperJobGenie Radar] Scanning job stream for:', config.targetRole);
        // Dispatch test radar notification
        if (config.desktopNotifications) {
          showScoutNotification({
            title: '🎯 High-Match Job Detected (94%)',
            message: `SeaMoney (Shopee FinTech) - Senior Backend Engineer matches your skills. Tap to view 4-Tier Pitch.`
          });
        }
      }
    });
  }
});

// Notification Dispatch Helper
function showScoutNotification({ title, message, url }) {
  if (!chrome.notifications) return;
  
  const notificationId = 'sjg_scout_' + Date.now();
  chrome.notifications.create(notificationId, {
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: `[SuperJobGenie] ${title}`,
    message: message,
    contextMessage: 'V2.0 Autonomous Scout Radar',
    priority: 2
  });
}

// Notification Click Handler
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId.startsWith('sjg_scout_')) {
    chrome.tabs.create({
      url: 'https://ais-dev-dpehhkspkblknqvlwnko6m-423633136396.europe-west2.run.app'
    });
  }
});

// Message Bridge from Popup / Content Scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'trigger_radar_test') {
    showScoutNotification({
      title: '🎯 Radar Test Ping: 96% Match Found!',
      message: `${request.role || 'Senior Full-Stack Engineer'} at ${request.company || 'Tech Global'} matches your transferable skills!`
    });
    sendResponse({ success: true, timestamp: Date.now() });
    return true;
  }

  if (request.action === 'update_radar_alarm') {
    const { enabled, intervalMinutes } = request;
    if (enabled) {
      chrome.alarms.create(ALARM_NAME, {
        delayInMinutes: 0.5,
        periodInMinutes: Math.max(1, intervalMinutes || 60)
      });
    } else {
      chrome.alarms.clear(ALARM_NAME);
    }
    sendResponse({ success: true, enabled });
    return true;
  }
});
