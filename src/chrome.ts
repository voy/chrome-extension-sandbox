/**
 * The functions in this file are the only ones that should call the chrome.* APIs.
 */

export const getTabsInCurrentWindow = async (): Promise<chrome.tabs.Tab[]> => {
  const currentWindow = await chrome.windows.getCurrent();
  const tabs = await chrome.tabs.query({ windowId: currentWindow.id });
  return tabs.filter((tab) => !tab.pinned);
};

const findHighlightedTab = (
  tabs: chrome.tabs.Tab[]
): chrome.tabs.Tab | undefined => {
  return tabs.find((tab) => tab.highlighted);
};

export const closeTabs = async (tabs: chrome.tabs.Tab[]): Promise<void> => {
  const currentTab = findHighlightedTab(tabs);
  let tabsToClose: chrome.tabs.Tab[];

  if (currentTab) {
    tabsToClose = tabs.filter((tab) => tab.id !== currentTab.id);
  } else {
    tabsToClose = tabs;
  }

  if (tabsToClose.length > 0) {
    await chrome.tabs.remove(tabsToClose.map((tab) => tab.id!));
  }
};

/**
 * Filter tabs by segment of hostname.
 */
export const filterTabsBySegment = (
  segment: string,
  tabs: chrome.tabs.Tab[]
) => {
  return tabs.filter((tab) => {
    if (!tab.url) return false;
    const hostname = new URL(tab.url).hostname;
    return new RegExp(`(^|\.)${segment}$`).test(hostname);
  });
};
