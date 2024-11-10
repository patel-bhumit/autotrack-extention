// Relay messages between the popup and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "FETCH_JOB_DETAILS") {
        // Forward message to the content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
                    sendResponse(response); // Send response back to popup
                });
            }
        });
        return true; // Indicates async response
    }
});
