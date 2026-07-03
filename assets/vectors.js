import Svg, { Circle, Path, Rect } from "react-native-svg";

// Custom Svg Sword vector icon
export const VectorSword = ({ color = "#FFB300", size = 32 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/Svg"
    style={{ display: "block" }}
  >
    <Path d="M18 3L21 6L11 16L8 13L18 3Z" fill={color} />
    <Path d="M10.5 14.5L14.5 10.5L15.5 11.5L11.5 15.5L10.5 14.5Z" fill="#000" />
    <Path d="M6 18L8 16L7 15L5 17L6 18Z" fill={color} />
    <Path d="M3 21L5 19L4 18L2 20L3 21Z" fill={color} />
    <Circle cx="3" cy="21" r="1.5" fill={color} />
    <Path d="M8 13L11 16L9.5 17.5L6.5 14.5L8 13Z" fill={color} />
  </Svg>
);

// Standard Target icon
export const TargetIcon = ({ color = "currentColor", size = 20 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/Svg"
  >
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

// Standard Vault icon
export const VaultIcon = ({ color = "currentColor", size = 20 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/Svg"
  >
    <Rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      stroke={color}
      strokeWidth="2"
    />
    <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2" />
    <Path d="M12 8V12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 12H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
