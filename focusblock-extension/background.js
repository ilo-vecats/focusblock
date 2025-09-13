let blockedSites = [];
let jwtToken = null;

// Function to update blocking rules dynamically
function updateBlockingRules() {
  const rules = blockedSites.map((site, i) => ({
    id: i + 1,
    priority: 1,
    action: { type: "block" },
    condition: { urlFilter: site.url, resourceTypes: ["main_frame"] }
  }));

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map(r => r.id),
    addRules: rules
  });
}

// Listen for JWT token sent from React dashboard
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SET_TOKEN') {
    jwtToken = message.token;
    fetchBlockedSites();  // fetch blocked sites immediately
    sendResponse({ status: 'Token received' });
  }
});

// Fetch blocked sites from backend
async function fetchBlockedSites() {
  if (!jwtToken) return;
  try {
    const res = await fetch('http://localhost:5050/api/blocked', {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    blockedSites = await res.json();  // set the list dynamically
    updateBlockingRules();            // update Chrome blocking rules
    console.log('Blocked sites updated:', blockedSites);
  } catch (err) {
    console.error('Error fetching blocked sites:', err);
  }
}

// Optionally, refresh blocked sites every 5 minutes
setInterval(fetchBlockedSites, 5 * 60 * 1000);