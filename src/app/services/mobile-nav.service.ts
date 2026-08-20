import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MobileNavService {

  private openedSignal = signal(false);
  readonly opened = this.openedSignal.asReadonly();

  toggle() {
    this.openedSignal.update(opened => !opened);
  }

  close() {
    this.openedSignal.set(false);
  }
}
