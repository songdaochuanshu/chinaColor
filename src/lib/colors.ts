import colorData from '../assets/data/colors.json';
import type { FamilyKey, IColor, ReadableColors } from '../types';

/** The JSON keeps a stray trailing space in one entry's CMYK key. */
interface RawColor {
  name: string;
  pinyin: string;
  hex: string;
  RGB?: number[];
  CMYK?: number[];
  'CMYK '?: number[];
}

const INK = '#0f0f0f';
const PAPER = '#ffffff';

export function loadColors(): IColor[] {
  const list = (colorData as unknown as { colorList: RawColor[] }).colorList;
  return list.map((raw) => {
    const cmyk = raw.CMYK ?? raw['CMYK '] ?? [0, 0, 0, 0];
    const rgb = raw.RGB ?? [0, 0, 0];
    return {
      name: raw.name,
      pinyin: raw.pinyin,
      hex: raw.hex.toLowerCase(),
      RGB: [rgb[0], rgb[1], rgb[2]] as [number, number, number],
      CMYK: [cmyk[0], cmyk[1], cmyk[2], cmyk[3]] as [number, number, number, number],
    };
  });
}

export function hexToRgb(hex: string): [number, number, number] {
  let value = hex.replace('#', '').trim();
  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const parsed = Number.parseInt(value.slice(0, 6), 16);
  if (Number.isNaN(parsed)) return [0, 0, 0];
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255];
}

/** WCAG 2.1 relative luminance. */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio, between 1 and 21. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Pick near-black or white for text drawn on `hex`, whichever has the better
 * WCAG contrast. Keeps pale colours such as 月白 readable instead of white-on-white.
 */
export function readableOn(hex: string): ReadableColors {
  const onInk = contrastRatio(hex, INK);
  const onPaper = contrastRatio(hex, PAPER);
  return onPaper >= onInk
    ? { fg: PAPER, isLight: false, contrast: onPaper }
    : { fg: INK, isLight: true, contrast: onInk };
}

export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const [r255, g255, b255] = hexToRgb(hex);
  const r = r255 / 255;
  const g = g255 / 255;
  const b = b255 / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;
  if (delta === 0) return { h: 0, s: 0, l };
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h *= 60;
  if (h < 0) h += 360;
  return { h, s, l };
}

/**
 * Group a colour by hue, with near-neutral colours (white, grey, ink) separated
 * out so that 月白 or 银鼠灰 do not end up inside a chromatic family.
 */
export function familyOf(hex: string): FamilyKey {
  const { h, s, l } = hexToHsl(hex);
  const [r, g, b] = hexToRgb(hex);
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  if (chroma < 12 || s < 0.09 || l < 0.09 || l > 0.97) return 'neutral';
  if (h < 20 || h >= 330) return 'red';
  if (h < 70) return 'orange';
  if (h < 170) return 'green';
  if (h < 260) return 'cyan';
  return 'purple';
}

/** CSS custom-property name for a colour, e.g. `--color-zhongguohong`. */
export function cssVarName(color: IColor): string {
  const slug = color.pinyin
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `--color-${slug || 'color'}`;
}

export function rgbString(color: IColor): string {
  return `rgb(${color.RGB.join(', ')})`;
}

export function cmykString(color: IColor): string {
  return `cmyk(${color.CMYK.join(', ')})`;
}
