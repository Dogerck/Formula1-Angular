import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ResultsService extends BaseService {

  getAll<Results>(url: string): Observable<Results> {
    return this.getData<Results>(`${url}`);
  }
}
