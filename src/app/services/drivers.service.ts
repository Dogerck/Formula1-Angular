import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriversService extends BaseService {

  constructor(http: HttpClient) { super(http) }

  getAll<Driver>(url: string) : Observable<Driver> {
    return this.getData<Driver>(`${url}`);
  }
}
