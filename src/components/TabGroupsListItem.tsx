import React from "react";
import { filterTabsBySegment } from "../chrome";

import { TabGroup } from "../types";
import { DomainPath } from "./DomainPath";

interface TabGroupsListItemProps {
  allTabs: chrome.tabs.Tab[];
  tabGroup: TabGroup;
  onClick: (segment: string) => void;
}

export const TabGroupsListItem: React.FC<TabGroupsListItemProps> = (props) => {
  const { tabGroup, allTabs, onClick } = props;

  const [tabCount, setTabCount] = React.useState<number>(tabGroup.tabs.length);

  const handleSegmentMouseOver = (segment: string) => {
    const segmentTabs = filterTabsBySegment(segment, allTabs);
    setTabCount(segmentTabs.length);
  };

  const handleMouseOut = () => {
    setTabCount(tabGroup.tabs.length);
  };

  return (
    <li key={tabGroup.key} tabIndex={0}>
      <span onMouseOut={handleMouseOut}>
        <DomainPath
          segment={false}
          hostname={tabGroup.key}
          onClick={onClick}
          onSegmentMouseOver={handleSegmentMouseOver}
        />
      </span>
      <span>{tabCount}</span>
    </li>
  );
};
