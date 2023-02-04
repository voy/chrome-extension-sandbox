import React, { useState } from "react";

const getSegments = (hostname: string): Segment[] => {
  const segments = hostname.split(".");

  if (segments.length > 1) {
    const lastSegment = segments.pop();
    const penultimateSegment = segments.pop();
    segments.push(`${penultimateSegment}.${lastSegment}`);
  }

  return segments.map((segment, i) => {
    return {
      label: segment,
      hostname: segments.slice(i).join("."),
    };
  });
};

type Segment = {
  label: string;
  hostname: string;
};

interface DomainPathProps {
  hostname: string;
  segment: boolean;
  onClick: (segment: string) => void;
  onSegmentMouseOver: (segment: string) => void;
}

export const DomainPath: React.FC<DomainPathProps> = (props) => {
  const { hostname, segment, onClick, onSegmentMouseOver } = props;
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const segments = segment
    ? getSegments(hostname)
    : [{ label: hostname, hostname }];

  const renderSegment = (segment: Segment, i: number) => {
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick(segments[i].hostname);
    };
    const handleMouseOver = (e: React.MouseEvent) => {
      e.stopPropagation();
      setHoveredSegment(i);
      onSegmentMouseOver(segments[i].hostname);
    };
    const handleMouseOut = (e: React.MouseEvent) => {
      setHoveredSegment(null);
    };

    return (
      <span
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        className={i === hoveredSegment ? "hover" : ""}
      >
        {segment.label}
        {i !== segments.length - 1 && "."}
        {i < segments.length - 1 && renderSegment(segments[i + 1], i + 1)}
      </span>
    );
  };

  return renderSegment(segments[0], 0);
};
