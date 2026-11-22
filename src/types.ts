export interface IColor {
  name: string;
  pinyin: string;
  hex: string;
  RGB: [number, number, number];
  CMYK: [number, number, number, number];
}

/** Colour families used by the filter pills. */
export type FamilyKey = 'red' | 'orange' | 'green' | 'cyan' | 'purple' | 'neutral';

export type FilterKey = FamilyKey | 'all' | 'favorites';

export interface ReadableColors {
  /** Text colour that has the stronger WCAG contrast against the colour. */
  fg: string;
  /** True when the background is light, i.e. dark text was chosen. */
  isLight: boolean;
  contrast: number;
}
