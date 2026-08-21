import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

interface OpenMeteoDailyResponse {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.open-meteo.com/v1/forecast';

  getForecast(lat: string, long: string, startDate: string, endDate: string): Observable<DailyForecast[]> {
    const params = {
      latitude: lat,
      longitude: long,
      daily: 'weather_code,temperature_2m_max,temperature_2m_min',
      timezone: 'auto',
      start_date: startDate,
      end_date: endDate,
    };
    return this.http.get<OpenMeteoDailyResponse>(this.apiUrl, { params }).pipe(
      map(response => response.daily.time.map((date, i) => ({
        date,
        weatherCode: response.daily.weather_code[i],
        tempMax: response.daily.temperature_2m_max[i],
        tempMin: response.daily.temperature_2m_min[i],
      })))
    );
  }
}
