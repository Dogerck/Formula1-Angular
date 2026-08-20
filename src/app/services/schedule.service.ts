import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService extends BaseService {

  getAll<Schedule>(url: string): Observable<Schedule> {
    return this.getData<Schedule>(`${url}`);
  }
}
