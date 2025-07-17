const getElement = ID => document.querySelector(ID);
const addEvent = (element, type, callback) => { element.addEventListener(type, callback); };

const setBadge = (badgeText, badgeColor, status) => {
    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeBackgroundColor({ color: badgeColor });
    chrome.storage.local.set({ status: status });
}

const toggleAction = event => {
    if (event.target.checked) {
        setBadge("ON", "#46f193", "on");
    } else {
        setBadge("OFF", "#ee6363", "off");
    }
};

const openOptionPage = _event => {
    chrome.runtime.openOptionsPage();
};

const closePopup = _event => {
    window.close();
};

const setInitialBadge = toggleElement => {
    return result => {
        const status = result.status;
        if (status === "off") {
            toggleElement.checked = false;
        } else if (status === "on") {
            toggleElement.checked = true;
        }
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const toggleElement = getElement('#toggle');
    const settingsButton = getElement('#settings');
    const closeButton = getElement('#close');
    addEvent(toggleElement, "click", toggleAction);
    addEvent(settingsButton, "click", openOptionPage);
    addEvent(closeButton, "click", closePopup);
    chrome.storage.local.get(['status']).then(setInitialBadge(toggleElement));
});