import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CircuitsService extends BaseService {

  getAll<Circuit>(url: string) : Observable<Circuit> {
    return this.getData<Circuit>(`${url}`);
  }
}
