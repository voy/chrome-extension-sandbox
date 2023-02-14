import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

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
  onArrowUp: () => void;
  onArrowDown: () => void;
}

export interface TabGroupsListItemHandle {
  focus: () => void;
}

export const TabGroupsListItem = forwardRef<
  TabGroupsListItemHandle,
  TabGroupsListItemProps
>((props, ref) => {
  const { hostname, tabTree, onClick } = props;

  const firstSegmentRef = useRef<HTMLSpanElement | null>(null);
  const segmentRefs = useRef<HTMLSpanElement[]>([]);

  useImperativeHandle(ref, () => ({
    focus() {
      firstSegmentRef.current?.focus();
    },
  }));

  const getSegmentTabCount = (segment: JunctionSegment) => {
    const path = getFqdnPath(tabTree, segment.fqdn);
    const lastPart = path[0];
    if (!lastPart) return 0;
    return lastPart.tabs.length;
  };

  const junctionSegments = getJunctionSegments(tabTree, hostname);
  const [tabCount, setTabCount] = useState<number>(() => {
    const firstSegment = junctionSegments[0];
    if (!firstSegment) return 0;
    return getSegmentTabCount(firstSegment);
  });

  const handleSegmentClick = (segment: JunctionSegment) => {
    const path = getFqdnPath(tabTree, segment.fqdn);
    const lastPart = path[0];
    if (!lastPart) return;
    onClick(lastPart.tabs);
  };

  const handleSegmentMouseOver = (segment: JunctionSegment) => {
    const path = getFqdnPath(tabTree, segment.fqdn);
    const lastPart = path[0];
    if (!lastPart) return;
    setTabCount(lastPart.tabs.length);
  };

  const createSegmentKeyDownHandler =
    (segment: JunctionSegment, i: number) =>
    (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === "Enter") {
        handleSegmentClick(segment);
      } else if (e.key === "ArrowRight") {
        if (i < segmentRefs.current.length - 1) {
          segmentRefs.current[i + 1].focus();
        }
      } else if (e.key === "ArrowLeft") {
        if (i > 0) {
          segmentRefs.current[i - 1].focus();
        }
      }
    };

  const handleListItemKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    e.preventDefault();
    if (e.key === "ArrowUp") {
      props.onArrowUp();
    } else if (e.key === "ArrowDown") {
      props.onArrowDown();
    }
  };

  const handleListItemClick = () => {
    const firstSegment = junctionSegments[0];
    if (!firstSegment) return;
    handleSegmentClick(firstSegment);
  };

  return (
    <li onKeyDown={handleListItemKeyDown} onClick={handleListItemClick}>
      <span>
        {junctionSegments.map((segment, i) => (
          <span
            key={segment.fqdn}
            ref={(element) => {
              if (element) {
                if (i === 0) {
                  firstSegmentRef.current = element;
                }
                segmentRefs.current.push(element);
              }
            }}
            tabIndex={0}
            data-fqdn={segment.fqdn}
            onClick={(e) => {
              e.stopPropagation();
              handleSegmentClick(segment);
            }}
            onMouseOver={() => handleSegmentMouseOver(segment)}
            onMouseOut={() =>
              setTabCount(getSegmentTabCount(junctionSegments[0]))
            }
            onKeyDown={createSegmentKeyDownHandler(segment, i)}
          >
            {segment.label}
            {i < junctionSegments.length - 1 ? "." : ""}
          </span>
        ))}
      </span>
      <span>{tabCount}</span>
    </li>
  );
});
