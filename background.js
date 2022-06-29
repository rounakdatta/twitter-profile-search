chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
        // check only for `complete` status events
        if (changeInfo.status == 'complete') {
            chrome.tabs.sendMessage(tabId, {
                message: 'BUILD_TWITTER_PROFILE_SEARCH',
                url: tab.url
            })
        }
    }
);
