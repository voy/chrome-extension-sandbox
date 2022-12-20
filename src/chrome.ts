/**
 * The functions in this file are the only ones that should call the chrome.* APIs.
 */

export const getTabsInCurrentWindow = async (): Promise<chrome.tabs.Tab[]> => {
  const currentWindow = await chrome.windows.getCurrent();
  return await chrome.tabs.query({ windowId: currentWindow.id });
};

const findHighlightedTab = (
  tabs: chrome.tabs.Tab[]
): chrome.tabs.Tab | undefined => {
  return tabs.find((tab) => tab.highlighted);
};

export const closeTabs = async (tabs: chrome.tabs.Tab[]): Promise<void> => {
  const currentTab = findHighlightedTab(tabs);
  let tabsToClose: chrome.tabs.Tab[];

  if (tabs.length === 1) {
    tabsToClose = [...tabs];
  } else if (currentTab) {
    tabsToClose = tabs.filter((tab) => tab.id !== currentTab.id);
  } else {
    tabsToClose = [...tabs].sort((a, b) => b.index - a.index);
    tabsToClose.pop();
  }

  if (tabsToClose.length > 0) {
    await chrome.tabs.remove(tabsToClose.map((tab) => tab.id!));
  }
};
