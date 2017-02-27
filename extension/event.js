chrome.browserAction.onClicked.addListener(() => {
    chrome.storage.local.get({ enabled: true }, obj => {
        chrome.storage.local.set({ 'enabled': !obj.enabled });
        updateIcon(!obj.enabled);
    });
});

chrome.storage.local.get('enabled', obj => {
    updateIcon(obj.enabled);
});

function updateIcon(enabled) {
    if (enabled) {
        chrome.browserAction.setIcon({ path: 'icons/16.png' });
    } else {
        chrome.browserAction.setIcon({ path: 'icons/16gray.png' });
    }
}



