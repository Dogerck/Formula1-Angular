import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
}

export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.open-meteo.com/v1/forecast';

  getCurrentWeather(lat: string, long: string): Observable<CurrentWeather> {
    const params = {
      latitude: lat,
      longitude: long,
      current: 'temperature_2m,weather_code',
    };
    return this.http.get<OpenMeteoResponse>(this.apiUrl, { params }).pipe(
      map(response => ({
        temperature: response.current.temperature_2m,
        weatherCode: response.current.weather_code,
      }))
    );
  }
}
