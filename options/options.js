const getElement = (ID, parent=document) => parent.querySelector(ID);
const addEvent = (element, type, callback) => { element.addEventListener(type, callback); };
let rules = [];

const saveRules = _ => {
    chrome.storage.local.set({ rules });
};

const loadRules = async _ => {
    const result = await chrome.storage.local.get('rules');
    rules = result.rules ?? [];
    renderRules();
};

const removeRule = rule => {
    return _ => {
        rules = rules.filter(r => r.pattern !== rule.pattern);
        saveRules();
        renderRules();
    }
};

const renderRules = _ => {
    const rulesContainer = getElement("#rules");
    rulesContainer.innerHTML = "";
    rules.map( rule => {
        const template = getElement("#rule-item");
        const content = template.content.cloneNode(true);
        getElement('h5', content).innerHTML = rule.pattern;
        addEvent(getElement('button', content), "click", removeRule(rule));
        rulesContainer.appendChild(content);
    });
};

const addRule = ruleElement => {
    return _ => {
        const value = ruleElement.value.trim();
        const newRule = {
            pattern: value,
            action: 'fail',
            enabled: true
        };
        rules = [...rules, newRule];
        saveRules();
        renderRules();
    }
};

document.addEventListener("DOMContentLoaded", _e => {
    loadRules();
    const rulePattern = getElement("#pattern");
    const addRuleButton = getElement("#addRule");
    addEvent(addRuleButton, "click", addRule(rulePattern));
});