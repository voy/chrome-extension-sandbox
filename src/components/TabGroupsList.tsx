import React, { useMemo } from "react";
import { filterTabsBySegment } from "../chrome";

import { TabGroup } from "../types";
import { TabGroupsListItem } from "./TabGroupsListItem";

interface TabGroupsListProps {
  tabGroups: TabGroup[];
  onClick: (tabs: chrome.tabs.Tab[]) => void;
}

export const TabGroupsList: React.FC<TabGroupsListProps> = ({
  tabGroups,
  onClick,
}) => {
  const allTabs = useMemo(
    () => tabGroups.flatMap((tabGroup) => tabGroup.tabs),
    [tabGroups]
  );

  const handleClick = (segment: string) => {
    const segmentTabs = filterTabsBySegment(segment, allTabs);
    onClick(segmentTabs);
  };

  return (
    <ul>
      {tabGroups.map((option) => {
        return (
          <TabGroupsListItem
            key={option.key}
            allTabs={allTabs}
            tabGroup={option}
            onClick={handleClick}
          />
        );
      })}
    </ul>
  );
};
