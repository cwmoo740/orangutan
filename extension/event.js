chrome.browserAction.onClicked.addListener(() => {
    chrome.storage.local.get({ enabled: true }, obj => {
        chrome.storage.local.set({ 'enabled': !obj.enabled });
    });
});