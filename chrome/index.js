console.log("test", chrome)
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: () => {alert("test extension tool.")}
    })
})