import { BrandVariants, createLightTheme, Theme } from "@fluentui/react-components";

export const siymanBrand: BrandVariants = {
  10: "#0A0805",
  20: "#1B130A",
  30: "#2D1F11",
  40: "#3F2A18",
  50: "#52371F",
  60: "#664527",
  70: "#7B5331",
  80: "#90623B",
  90: "#A67246",
  100: "#B8945A",
  110: "#C8A36B",
  120: "#D6B27D",
  130: "#E2C190",
  140: "#ECCFA4",
  150: "#F2DBB7",
  160: "#F8E7CC",
};

export const siymanTheme: Theme = {
  ...createLightTheme(siymanBrand),
  colorNeutralBackground1: "#FBF7EE",
  colorNeutralBackground2: "#F8F3EA",
  colorNeutralForeground1: "#2A2018",
  colorNeutralForeground2: "#5A4E40",
  colorNeutralStroke1: "#E5DBC9",
  colorBrandBackground: "#B8945A",
  colorBrandForeground1: "#B8945A",
  colorBrandForegroundLink: "#B8945A",
  fontFamilyBase:
    '"Noto Sans SC", "PingFang SC", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
};
