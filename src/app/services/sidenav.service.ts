import { Injectable } from '@angular/core';
import { Observable , Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  
  
  private changeMenu: Subject<SidenavActions> = new Subject();
  
  public changeMenu$: Observable<SidenavActions> = this.changeMenu.asObservable();
  
  public sidebarChange(action: SidenavActions) {
    this.changeMenu.next(action);
  }
}
export type SidenavActions = 'close' | 'open' | 'toggle';