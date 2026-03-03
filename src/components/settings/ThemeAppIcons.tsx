import Svg, { Circle as SvgCircle, Path, Rect } from "react-native-svg";

type ThemeIconProps = {
  size?: number;
  color?: string;
};

const DEFAULT_AUTO = "#6366F1";
const DEFAULT_MANUAL = "#8B5CF6";
const STROKE_WIDTH = 1.8;

const BASE_PROPS = {
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: STROKE_WIDTH,
};

const MoonOutline = ({ color }: { color: string }) => (
  <Path
    d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 3.009V3Z"
    stroke={color}
    {...BASE_PROPS}
  />
);

export const ThemeAutoIcon = ({ size = 18, color = DEFAULT_AUTO }: ThemeIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <MoonOutline color={color} />
    <Path
      d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2"
      stroke={color}
      {...BASE_PROPS}
    />
    <Path d="M19 11h2m-1 -1v2" stroke={color} {...BASE_PROPS} />
  </Svg>
);

export const ThemeManualIcon = ({
  size = 18,
  color = DEFAULT_MANUAL,
}: ThemeIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <MoonOutline color={color} />
    <Rect
      x="5"
      y="15.2"
      width="14"
      height="3.6"
      rx="1.8"
      stroke={color}
      strokeWidth={STROKE_WIDTH}
    />
    <SvgCircle cx="9.2" cy="17" r="1.2" fill={color} />
  </Svg>
);

type ScheduleIconProps = ThemeIconProps & {
  direction: "start" | "end";
};

const ThemeScheduleIcon = ({
  size = 18,
  color = DEFAULT_AUTO,
  direction,
}: ScheduleIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5a7 7 0 1 0 0 14a7 7 0 0 0 0 -14"
      stroke={color}
      {...BASE_PROPS}
    />
    <Path d="M12 9v3.4l2.2 1.4" stroke={color} {...BASE_PROPS} />
    {direction === "start" ? (
      <Path d="M14.9 14.7 18 16.7 14.9 18.7Z" fill={color} />
    ) : (
      <Rect x="14.9" y="14.9" width="2.8" height="2.8" rx="0.5" fill={color} />
    )}
  </Svg>
);

export const ThemeStartIcon = (props: ThemeIconProps) => (
  <ThemeScheduleIcon {...props} direction="start" />
);

export const ThemeEndIcon = (props: ThemeIconProps) => (
  <ThemeScheduleIcon {...props} direction="end" />
);
