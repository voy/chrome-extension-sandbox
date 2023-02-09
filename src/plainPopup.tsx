import React from "react";
import ReactDOM from "react-dom";

import {
  closeTabs,
  findHighlightedTab,
  getTabsInCurrentWindow,
} from "./chrome";
import { TabGroupsList } from "./components/TabGroupsList";
import { TabGroup } from "./types";
import { groupBy } from "./utils/groupBy";
import { isChromeTab } from "./utils/hostname";

const sortGroupsBySize = (
  groups: Map<string, chrome.tabs.Tab[]>,
  currentTab?: chrome.tabs.Tab
): TabGroup[] => {
  const currentTabHostname =
    currentTab?.url && new URL(currentTab.url).hostname;
  return [...groups.entries()]
    .map(([key, tabs]) => ({ key, tabs }))
    .sort((a, b) => {
      // If the current tab is in the group, move it to the top
      if (a.key === currentTabHostname) return -1;
      if (b.key === currentTabHostname) return 1;
      return b.tabs.length - a.tabs.length;
    });
};

const getTabGroupsSortedBySize = (tabs: chrome.tabs.Tab[]) => {
  const groups: Map<string, chrome.tabs.Tab[]> = groupBy(tabs, (tab) => {
    if (!tab.url || isChromeTab(tab.url)) return;
    return new URL(tab.url).hostname;
  });

  const chromeTabs = tabs.filter((tab) => isChromeTab(tab.url!));
  if (chromeTabs.length > 0) {
    groups.set("Chrome", chromeTabs);
  }

  const currentTab = findHighlightedTab(tabs);

  return sortGroupsBySize(groups, currentTab);
};

const getSortedTabGroups = async () => {
  const tabsInCurrentWindow = await getTabsInCurrentWindow();
  const sortedTabGroups = getTabGroupsSortedBySize(tabsInCurrentWindow);
  return sortedTabGroups;
};

const App = () => {
  const [tabGroups, setTabGroups] = React.useState<TabGroup[]>([]);

  const updateTabGroups = async () => {
    const tabGroups = await getSortedTabGroups();
    setTabGroups(tabGroups);
  };

  React.useEffect(() => {
    updateTabGroups();
  }, []);

  const handleClick = async (tabsToClose: chrome.tabs.Tab[]) => {
    await closeTabs(tabsToClose);
    await updateTabGroups();
  };

  return <TabGroupsList tabGroups={tabGroups} onClick={handleClick} />;
};

ReactDOM.render(<App />, document.getElementById("root"));
