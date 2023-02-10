import React from "react";

import {
  getFqdnPath,
  getJunctionSegments,
  JunctionSegment,
  TreeRoot,
} from "../utils/tree";

interface TabGroupsListItemProps {
  hostname: string;
  tabTree: TreeRoot;
  onClick: (tabs: chrome.tabs.Tab[]) => void;
}

export const TabGroupsListItem: React.FC<TabGroupsListItemProps> = (props) => {
  const { hostname, tabTree, onClick } = props;

  const getSegmentTabCount = (segment: JunctionSegment) => {
    const path = getFqdnPath(tabTree, segment.fqdn);
    const lastPart = path[0];
    if (!lastPart) return 0;
    return lastPart.tabs.length;
  };

  const junctionSegments = getJunctionSegments(tabTree, hostname);
  const [tabCount, setTabCount] = React.useState<number>(
    getSegmentTabCount(junctionSegments[0])
  );

  const handleClick = (segment: JunctionSegment) => {
    const path = getFqdnPath(tabTree, segment.fqdn);
    const lastPart = path[0];
    if (!lastPart) return;
    onClick(lastPart.tabs);
  };

  const handleMouseOver = (segment: JunctionSegment) => {
    const path = getFqdnPath(tabTree, segment.fqdn);
    const lastPart = path[0];
    if (!lastPart) return;
    setTabCount(lastPart.tabs.length);
  };

  return (
    <li>
      <span>
        {junctionSegments.map((segment, i) => (
          <span
            key={segment.fqdn}
            data-fqdn={segment.fqdn}
            onClick={() => handleClick(segment)}
            onMouseOver={() => handleMouseOver(segment)}
            onMouseOut={() =>
              setTabCount(getSegmentTabCount(junctionSegments[0]))
            }
          >
            {segment.label}
            {i < junctionSegments.length - 1 ? "." : ""}
          </span>
        ))}
      </span>
      <span>{tabCount}</span>
    </li>
  );
};
