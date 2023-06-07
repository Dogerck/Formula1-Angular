import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})

export class CardService extends BaseService {
constructor(http: HttpClient) { super(http) }
  getAll<Standings>(url: string) : Observable<Standings> {
    return this.getData<Standings>(`${url}`);
  }
}