import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ConstructorsService extends BaseService {

  getAll<Driver>(url: string) : Observable<Driver> {
    return this.getData<Driver>(`${url}`);
  }
}
