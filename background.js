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
        console.log(newRules);

        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: currentIds,
            addRules: newRules
        });

        console.log(`[FailSwitch] Updated ${newRules.length} block rule(s).`);
    } catch (err) {
        console.error('[FailSwitch] Failed to update rules:', err);
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