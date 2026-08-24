// Official F1 tyre compound colors, as shown on broadcast graphics.
export const TIRE_COMPOUND_COLORS: Record<string, string> = {
  SOFT: '#e6002b',
  MEDIUM: '#f5c518',
  HARD: '#f0f0f0',
  INTERMEDIATE: '#3ea63e',
  WET: '#0067ad',
};

const FALLBACK_COLOR = '#64646f';

export function getTireCompoundColor(compound: string): string {
  return TIRE_COMPOUND_COLORS[compound] ?? FALLBACK_COLOR;
}
