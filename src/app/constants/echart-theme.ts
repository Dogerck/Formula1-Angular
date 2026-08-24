// Shared style tokens for ECharts options, mirroring the APEX design system
// (see _tokens.scss) since ECharts can't read CSS custom properties itself.
export const CHART_COLORS = {
  text: '#f4f4f2',
  textDim: '#9a9aa6',
  textFaint: '#64646f',
  border: 'rgba(255, 255, 255, .08)',
  borderStrong: 'rgba(255, 255, 255, .16)',
  surface: '#17171d',
  cyan: '#27f4d2',
  red: '#e10600',
} as const;

export const MONO_FONT = "'Space Mono', monospace";
const LABEL_FONT = "'Titillium Web', sans-serif";

export const chartAxisLabel = {
  color: CHART_COLORS.textFaint,
  fontFamily: MONO_FONT,
  fontSize: 10,
};

export const chartAxisLine = {
  lineStyle: { color: CHART_COLORS.border },
};

export const chartSplitLine = {
  lineStyle: { color: CHART_COLORS.border },
};

export const chartLegendTextStyle = {
  color: CHART_COLORS.textDim,
  fontFamily: LABEL_FONT,
  fontWeight: 700 as const,
  fontSize: 11,
};

export const chartTooltip = {
  backgroundColor: CHART_COLORS.surface,
  borderColor: CHART_COLORS.border,
  borderWidth: 1,
  textStyle: {
    color: CHART_COLORS.text,
    fontFamily: MONO_FONT,
    fontSize: 12,
  },
};

export const chartGrid = {
  left: 8,
  right: 24,
  top: 28,
  bottom: 32,
};
