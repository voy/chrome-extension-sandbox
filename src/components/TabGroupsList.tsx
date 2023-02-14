import React, { useLayoutEffect, useMemo, useRef } from "react";
import { filterTabsBySegment } from "../chrome";

import { TreeRoot } from "../utils/tree";
import {
  TabGroupsListItem,
  TabGroupsListItemHandle,
} from "./TabGroupsListItem";

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
  const itemRefs = useRef<TabGroupsListItemHandle[]>([]);
  const initialFocus = useRef(false);

  itemRefs.current = [];

  useLayoutEffect(() => {
    if (tabGroups.length > 0 && !initialFocus.current) {
      itemRefs.current[0]?.focus();
      initialFocus.current = true;
    }
  }, [tabGroups.length]);

  return (
    <ul>
      {tabGroups.map((hostname, i) => {
        return (
          <TabGroupsListItem
            ref={(ref) => {
              if (ref) {
                itemRefs.current.push(ref);
              }
            }}
            key={hostname}
            hostname={hostname}
            tabTree={tabTree}
            onClick={(tabs) => onClick(tabs)}
            onArrowDown={() => {
              if (i < itemRefs.current.length - 1) {
                itemRefs.current[i + 1].focus();
              }
            }}
            onArrowUp={() => {
              if (i > 0) {
                itemRefs.current[i - 1].focus();
              }
            }}
          />
        );
      })}
    </ul>
  );
};
