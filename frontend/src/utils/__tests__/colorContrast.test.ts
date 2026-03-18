import {
  checkContrastHex,
  commonColorCombinations,
  generateAccessibilityReport,
  getAccessibleColor,
  getContrastRatio,
  hexToRgb,
  rgbToHex,
  validateThemeContrast,
} from '@/utils/colorContrast';

describe('colorContrast utilities', () => {
  it('converts hex to rgb and back', () => {
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
  });

  it('returns null for invalid hex', () => {
    expect(hexToRgb('bad')).toBeNull();
    expect(checkContrastHex('bad', '#ffffff')).toBeNull();
  });

  it('computes higher contrast for black on white', () => {
    const ratio = getContrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 });
    expect(ratio).toBeGreaterThan(7);
  });

  it('adjusts color toward target ratio', () => {
    const adjusted = getAccessibleColor(
      { r: 140, g: 140, b: 140 },
      { r: 255, g: 255, b: 255 },
      4.5
    );
    const adjustedRatio = getContrastRatio(adjusted, { r: 255, g: 255, b: 255 });
    expect(adjustedRatio).toBeGreaterThanOrEqual(4.5);
  });

  it('can adjust by lightening for dark backgrounds', () => {
    const adjusted = getAccessibleColor(
      { r: 40, g: 40, b: 40 },
      { r: 10, g: 10, b: 10 },
      3
    );
    const adjustedRatio = getContrastRatio(adjusted, { r: 10, g: 10, b: 10 });
    expect(adjustedRatio).toBeGreaterThanOrEqual(3);
  });

  it('stops adjustment at color bounds for extreme target ratios', () => {
    const adjusted = getAccessibleColor(
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      100
    );
    expect(adjusted).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('validates theme contrast and creates report', () => {
    const results = validateThemeContrast(commonColorCombinations.lightTheme);
    expect(results.text).toBeDefined();

    const report = generateAccessibilityReport(commonColorCombinations.lightTheme);
    expect(report.passing + report.failing).toBe(report.details.length);
  });

  it('throws when theme has no background', () => {
    expect(() => validateThemeContrast({ text: { r: 0, g: 0, b: 0 } } as any)).toThrow(
      'Theme must include a background color'
    );
  });
});
