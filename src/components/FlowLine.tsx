import React from "react";

interface FlowLineProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  color: string;
  animate?: boolean;
}

const FlowLine: React.FC<FlowLineProps> = ({ start, end, color, animate = true }) => {
  const pathD = `M ${start.x} ${start.y} C ${(start.x + end.x) / 2} ${start.y}, ${
    (start.x + end.x) / 2
  } ${end.y}, ${end.x} ${end.y}`;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <path
        d={pathD}
        stroke={color}
        strokeWidth="2"
        fill="none"
        className={animate ? "flow-line animate-flow" : ""}
      />
    </svg>
  );
};

export default FlowLine;