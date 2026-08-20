import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})

export class StandingsService extends BaseService {

  getAll<Standings>(url: string) : Observable<Standings> {
    return this.getData<Standings>(`${url}`);
  }
}