import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NextRaceService extends BaseService {

  constructor(http: HttpClient) { super(http) }

  getAll<NextRace>(url: string) : Observable<NextRace> {
    return this.getData<NextRace>(`${url}`);
  }
}
