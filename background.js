chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "edit-element",
    title: "ClickStyle — Edit styles",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "edit-element") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        if (window.__eeActivate) window.__eeActivate();
      }
    });
  }
});