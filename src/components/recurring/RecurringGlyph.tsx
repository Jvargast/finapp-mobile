import React from "react";
import Svg, { Circle as SvgCircle, Path } from "react-native-svg";

type RecurringGlyphProps = {
  size?: number;
  stroke: string;
  fill: string;
  ringOpacity?: number;
};

export const RecurringGlyph = ({
  size = 22,
  stroke,
  fill,
  ringOpacity = 0.5,
}: RecurringGlyphProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <SvgCircle
      cx="12"
      cy="12"
      r="9"
      stroke={stroke}
      strokeWidth="1.5"
      strokeDasharray="4 3"
      opacity={ringOpacity}
    />
    <Path
      d="M7.5 8.2a6 6 0 0 1 8.4 0"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M15.9 8.2V5.5m0 2.7h-2.7"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.5 15.8a6 6 0 0 1-8.4 0"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M8.1 15.8v2.7m0-2.7h2.7"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <SvgCircle cx="12" cy="12" r="2.2" fill={fill} />
  </Svg>
);
