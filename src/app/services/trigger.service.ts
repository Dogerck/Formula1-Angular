import { Injectable, EventEmitter  } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TriggerService {

  private sidenavOpen = new BehaviorSubject<boolean>(false);
  sidenavClose = this.sidenavOpen.asObservable();

  constructor() { }

  toggleSidenav() {
    this.sidenavOpen.next(!this.sidenavOpen.value);
  }
}
