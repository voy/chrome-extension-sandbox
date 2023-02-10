import React, { useMemo } from "react";
import { filterTabsBySegment } from "../chrome";

import { TreeRoot } from "../utils/tree";
import { TabGroupsListItem } from "./TabGroupsListItem";

interface TabGroupsListProps {
  tabGroups: string[];
  tabTree: TreeRoot;
  onClick: (tabs: chrome.tabs.Tab[]) => void;
}

export const TabGroupsList: React.FC<TabGroupsListProps> = ({
  tabGroups,
  tabTree,
  onClick,
}) => {
  return (
    <ul>
      {tabGroups.map((hostname) => {
        return (
          <TabGroupsListItem
            key={hostname}
            hostname={hostname}
            tabTree={tabTree}
            onClick={(tabs) => onClick(tabs)}
          />
        );
      })}
    </ul>
  );
};
