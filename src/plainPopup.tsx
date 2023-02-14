import React from "react";
import ReactDOM from "react-dom";

import { closeTabs, getTabsInCurrentWindow } from "./chrome";
import { TabGroupsList } from "./components/TabGroupsList";
import { isChromeTab } from "./utils/hostname";
import { addHostname, createTree, getTabGroups, TreeRoot } from "./utils/tree";

const getTabTree = async () => {
  const tabsInCurrentWindow = await getTabsInCurrentWindow();
  const tree = createTree();
  for (const tab of tabsInCurrentWindow) {
    if (!tab.url || isChromeTab(tab.url)) continue;
    addHostname(tree, new URL(tab.url).hostname, tab);
  }
  return tree;
};

const App = () => {
  const [tabGroups, setTabGroups] = React.useState<string[]>([]);
  const [tree, setTree] = React.useState<TreeRoot>();

  const updateTabGroups = async () => {
    const tree = await getTabTree();
    const tabGroups = getTabGroups(tree);
    const sortedTabGroups = Array.from(tabGroups.entries())
      .sort((a, b) => {
        return b[1] - a[1];
      })
      .map(([key]) => key);

    setTree(tree);
    setTabGroups(sortedTabGroups);
  };

  React.useEffect(() => {
    updateTabGroups();
  }, []);

  const handleClick = async (tabsToClose: chrome.tabs.Tab[]) => {
    await closeTabs(tabsToClose);
    await updateTabGroups();
  };

  if (!tree) return null;

  return (
    <TabGroupsList tabGroups={tabGroups} tabTree={tree} onClick={handleClick} />
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
