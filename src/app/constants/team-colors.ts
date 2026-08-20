// Single source of truth for constructor accent colors, reused across the
// standings podium, the teams table and the results table.
export const TEAM_COLORS: Record<string, string> = {
  Mercedes: '#27F4D2',
  'Red Bull': '#3671C6',
  'Aston Martin': '#229971',
  Ferrari: '#E8002D',
  McLaren: '#ff8000',
  'Alpine F1 Team': '#FF87BC',
  Williams: '#64C4FF',
  'Haas F1 Team': '#B6BABD',
  Sauber: '#52E252',
  'RB F1 Team': '#6692FF',
  Audi: '#BB0A30',
  'Cadillac F1 Team': '#C9A227',
};

const FALLBACK_COLOR = '#64646f';

export function getTeamColor(teamName: string): string {
  return TEAM_COLORS[teamName] ?? FALLBACK_COLOR;
}
