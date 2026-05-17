import { BrandVariants, createLightTheme, Theme } from "@fluentui/react-components";

/**
 * Sipimo Brand · 森林白绿
 * 主色：从皙妍居首页吸取的鲜嫩森林绿（#5C8A48 主，#B6E0A1 嫩）
 */
export const siymanBrand: BrandVariants = {
  10:  "#050803",
  20:  "#0E1709",
  30:  "#172412",
  40:  "#1F311A",
  50:  "#283F22",
  60:  "#314D2A",
  70:  "#3B5C32",
  80:  "#446A3A",
  90:  "#4E7943",
  100: "#5C8A48", // 主 · 鲜森林
  110: "#6FA15A",
  120: "#82B16E",
  130: "#97BD86",
  140: "#ACC99E",
  150: "#C2D6B7",
  160: "#D8E3D0",
};

export const siymanTheme: Theme = {
  ...createLightTheme(siymanBrand),
  colorNeutralBackground1: "#FAFBF7",
  colorNeutralBackground2: "#F4F7F0",
  colorNeutralBackground3: "#FFFFFF",
  colorNeutralForeground1: "#15201A",
  colorNeutralForeground2: "#485446",
  colorNeutralForeground3: "#8A958A",
  colorNeutralStroke1: "#E5ECDF",
  colorNeutralStroke2: "#EEF2EA",
  colorBrandBackground: "#5C8A48",
  colorBrandForeground1: "#5C8A48",
  colorBrandForegroundLink: "#466F36",
  colorBrandForegroundLinkHover: "#2F4F25",
  fontFamilyBase:
    '"Noto Sans SC", "PingFang SC", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
};
