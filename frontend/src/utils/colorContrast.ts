/**
 * Color contrast utilities for accessibility compliance
 */

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface ContrastResult {
  ratio: number;
  meetsAA: boolean;
  meetsAAA: boolean;
  meetsAALarge: boolean;
  meetsAAALarge: boolean;
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): ColorRGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result || !result[1] || !result[2] || !result[3]) {
    return null;
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 guidelines
 */
export function getLuminance(color: ColorRGB): number {
  const { r, g, b } = color;

  const values = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  const rs = values[0] ?? 0;
  const gs = values[1] ?? 0;
  const bs = values[2] ?? 0;

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: ColorRGB, color2: ColorRGB): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export function checkContrast(
  foreground: ColorRGB,
  background: ColorRGB
): ContrastResult {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio,
    meetsAA: ratio >= 4.5,
    meetsAAA: ratio >= 7,
    meetsAALarge: ratio >= 3,
    meetsAAALarge: ratio >= 4.5,
  };
}

/**
 * Check contrast for hex colors
 */
export function checkContrastHex(
  foregroundHex: string,
  backgroundHex: string
): ContrastResult | null {
  const foreground = hexToRgb(foregroundHex);
  const background = hexToRgb(backgroundHex);

  if (!foreground || !background) {
    return null;
  }

  return checkContrast(foreground, background);
}

/**
 * Get accessible color suggestions
 */
export function getAccessibleColor(
  baseColor: ColorRGB,
  backgroundColor: ColorRGB,
  targetRatio: number = 4.5
): ColorRGB {
  const baseLuminance = getLuminance(baseColor);
  const bgLuminance = getLuminance(backgroundColor);

  // Determine if we need to make the color lighter or darker
  // If the foreground is brighter than the background, lighten further.
  // Otherwise darken to increase contrast against a lighter background.
  const shouldLighten = baseLuminance > bgLuminance;

  let adjustedColor = { ...baseColor };
  let currentRatio = getContrastRatio(adjustedColor, backgroundColor);

  // Adjust color until we meet the target ratio
  while (currentRatio < targetRatio) {
    if (shouldLighten) {
      // Lighten the color
      adjustedColor.r = Math.min(255, adjustedColor.r + 5);
      adjustedColor.g = Math.min(255, adjustedColor.g + 5);
      adjustedColor.b = Math.min(255, adjustedColor.b + 5);
    } else {
      // Darken the color
      adjustedColor.r = Math.max(0, adjustedColor.r - 5);
      adjustedColor.g = Math.max(0, adjustedColor.g - 5);
      adjustedColor.b = Math.max(0, adjustedColor.b - 5);
    }

    currentRatio = getContrastRatio(adjustedColor, backgroundColor);

    // Prevent infinite loop
    if (
      (shouldLighten &&
        adjustedColor.r === 255 &&
        adjustedColor.g === 255 &&
        adjustedColor.b === 255) ||
      (!shouldLighten &&
        adjustedColor.r === 0 &&
        adjustedColor.g === 0 &&
        adjustedColor.b === 0)
    ) {
      break;
    }
  }

  return adjustedColor;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(color: ColorRGB): string {
/**
 * To Hex.
 * @param c - c value.
 */
  const toHex = (c: number) => {
    const hex = Math.round(c).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

/**
 * Common color combinations for testing
 */
export const commonColorCombinations = {
  // Light theme
  lightTheme: {
    background: { r: 255, g: 255, b: 255 }, // white
    text: { r: 0, g: 0, b: 0 }, // black
    primary: { r: 59, g: 130, b: 246 }, // blue-500
    secondary: { r: 107, g: 114, b: 128 }, // gray-500
    success: { r: 16, g: 185, b: 129 }, // green-500
    warning: { r: 245, g: 158, b: 11 }, // yellow-500
    error: { r: 239, g: 68, b: 68 }, // red-500
  },

  // Dark theme
  darkTheme: {
    background: { r: 17, g: 24, b: 39 }, // gray-900
    text: { r: 249, g: 250, b: 251 }, // gray-50
    primary: { r: 96, g: 165, b: 250 }, // blue-400
    secondary: { r: 156, g: 163, b: 175 }, // gray-400
    success: { r: 52, g: 211, b: 153 }, // green-400
    warning: { r: 251, g: 191, b: 36 }, // yellow-400
    error: { r: 248, g: 113, b: 113 }, // red-400
  },
};

/**
 * Validate all color combinations in a theme
 */
export function validateThemeContrast(theme: Record<string, ColorRGB>) {
  const results: Record<string, ContrastResult> = {};
  const background = theme['background'];

  if (!background) {
    throw new Error('Theme must include a background color');
  }

  Object.entries(theme).forEach(([key, color]) => {
    if (key !== "background") {
      results[key] = checkContrast(color, background);
    }
  });

  return results;
}

/**
 * Generate accessibility report for a theme
 */
export function generateAccessibilityReport(theme: Record<string, ColorRGB>) {
  const results = validateThemeContrast(theme);
  const report = {
    passing: 0,
    failing: 0,
    details: [] as Array<{
      color: string;
      ratio: number;
      status: "pass" | "fail";
      level: string;
    }>,
  };

  Object.entries(results).forEach(([color, result]) => {
    const status = result.meetsAA ? "pass" : "fail";
    const level = result.meetsAAA ? "AAA" : result.meetsAA ? "AA" : "Fail";

    report.details.push({
      color,
      ratio: Math.round(result.ratio * 100) / 100,
      status,
      level,
    });

    if (status === "pass") {
      report.passing++;
    } else {
      report.failing++;
    }
  });

  return report;
}
