import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriversService extends BaseService {

  getAll<Driver>(url: string) : Observable<Driver> {
    return this.getData<Driver>(`${url}`);
  }
}
