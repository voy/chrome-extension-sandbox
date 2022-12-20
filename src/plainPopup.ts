import { closeTabs, getTabsInCurrentWindow } from "./chrome";
import { renderOptions } from "./dom";
import { TabGroup } from "./types";
import { groupBy } from "./utils/groupBy";
import { getSLD, isChromeTab } from "./utils/hostname";

const sortGroupsBySize = (
  groups: Map<string, chrome.tabs.Tab[]>
): TabGroup[] => {
  return [...groups.entries()]
    .map(([key, tabs]) => ({ key, tabs }))
    .sort((a, b) => b.tabs.length - a.tabs.length);
};

const getTabGroupsSortedBySize = (tabs: chrome.tabs.Tab[]) => {
  const groups: Map<string, chrome.tabs.Tab[]> = new Map();
  const tabsBySLD = groupBy(tabs, (tab) => {
    if (!tab.url || isChromeTab(tab.url)) return;
    const url = new URL(tab.url);
    return getSLD(url.hostname);
  });

  for (const [sld, tabs] of tabsBySLD.entries()) {
    const tabsByHostname = groupBy(
      tabs,
      (tab) => tab.url && new URL(tab.url).hostname
    );

    for (const [hostname, tabs] of tabsByHostname.entries()) {
      groups.set(hostname, tabs);
    }

    if (tabsByHostname.size > 1) {
      groups.set(sld, tabs);
    }
  }

  return sortGroupsBySize(groups);
};

const renderList = async () => {
  const tabsInCurrentWindow = await getTabsInCurrentWindow();
  const sortedTabGroups = getTabGroupsSortedBySize(tabsInCurrentWindow);
  renderOptions(sortedTabGroups, {
    onClick: (tabsToClose) => {
      closeTabs(tabsToClose);
      renderList();
    },
  });
};

const main = () => {
  renderList();
};

main();
