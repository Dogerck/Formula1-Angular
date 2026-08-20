import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NextRaceService extends BaseService {

  getAll<NextRace>(url: string) : Observable<NextRace> {
    return this.getData<NextRace>(`${url}`);
  }
}
