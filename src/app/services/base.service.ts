import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class BaseService {
private http = inject(HttpClient);


protected urlApi: string = environment.apiUrl;

protected getData<T>(url: string): Observable<T> { 
  return this.http.get<any>(`${this.urlApi}${url}`)
}
}