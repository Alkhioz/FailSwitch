const buildBlockRulesFromStorage = async _ => {
    const { rules = [] } = await chrome.storage.local.get('rules');
    let nextId = 1;
    return rules
        .filter(rule => rule.enabled && rule.action === "fail")
        .map(rule => ({
            id: nextId++,
            priority: 1,
            action: { type: "block" },
            condition: {
                urlFilter: rule.pattern,
                resourceTypes: [
                    'main_frame',
                    'sub_frame',
                    'script',
                    'image',
                    'xmlhttprequest',
                    'stylesheet'
                ]
            }
        }));
};

const updateFailSwitchRules = async _ => {
    try {
        const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
        const currentIds = currentRules.map(rule => rule.id);

        const newRules = await buildBlockRulesFromStorage();

        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: currentIds,
            addRules: newRules
        });

        console.log(`[FailSwitch] Updated ${newRules.length} block rule(s).`);
    } catch (err) {
        console.error('[FailSwitch] Failed to update rules:', err);
    }
}

const clearAllFailSwitchRules = async _ => {
  try {
    const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = currentRules.map(rule => rule.id);
    if (ruleIds.length === 0) {
      console.log('[FailSwitch] No rules to remove.');
      return;
    }
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIds
    });
    console.log(`[FailSwitch] Removed ${ruleIds.length} rule(s).`);
  } catch (err) {
    console.error('[FailSwitch] Failed to clear rules:', err);
  }
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({ text: 'ON' });
    chrome.action.setBadgeBackgroundColor({ color: '#46f193' });
    chrome.storage.local.set({ status: 'on' });
    updateFailSwitchRules();
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.rules) {
        updateFailSwitchRules();
    }
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.status) {
        const { newValue: status } = changes.status;
        if (status === 'on') {
            updateFailSwitchRules();
        } else {
            clearAllFailSwitchRules();
        }
    }
});