// Maps Open-Meteo's WMO weather codes to a display icon/label.
// https://open-meteo.com/en/docs#weather_variable_documentation
export interface WeatherInfo {
  icon: string;
  label: string;
}

const WEATHER_CODES: Record<number, WeatherInfo> = {
  0: { icon: '☀️', label: 'Clear sky' },
  1: { icon: '🌤️', label: 'Mainly clear' },
  2: { icon: '⛅', label: 'Partly cloudy' },
  3: { icon: '☁️', label: 'Overcast' },
  45: { icon: '🌫️', label: 'Fog' },
  48: { icon: '🌫️', label: 'Fog' },
  51: { icon: '🌦️', label: 'Light drizzle' },
  53: { icon: '🌦️', label: 'Drizzle' },
  55: { icon: '🌦️', label: 'Dense drizzle' },
  61: { icon: '🌧️', label: 'Light rain' },
  63: { icon: '🌧️', label: 'Rain' },
  65: { icon: '🌧️', label: 'Heavy rain' },
  71: { icon: '🌨️', label: 'Light snow' },
  73: { icon: '🌨️', label: 'Snow' },
  75: { icon: '🌨️', label: 'Heavy snow' },
  80: { icon: '🌦️', label: 'Rain showers' },
  81: { icon: '🌦️', label: 'Rain showers' },
  82: { icon: '🌦️', label: 'Violent rain showers' },
  95: { icon: '⛈️', label: 'Thunderstorm' },
  96: { icon: '⛈️', label: 'Thunderstorm w/ hail' },
  99: { icon: '⛈️', label: 'Thunderstorm w/ hail' },
};

export function getWeatherInfo(code: number): WeatherInfo {
  return WEATHER_CODES[code] ?? { icon: '🌡️', label: 'Unknown' };
}
