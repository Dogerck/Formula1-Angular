import { Injectable, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MobileNavService {

  private openedSignal = signal(false);
  readonly opened = this.openedSignal.asReadonly();

  private savedScrollY = 0;

  constructor() {
    // Block the page behind the sidenav from scrolling while it's open,
    // since mat-sidenav's "over" mode doesn't do this on its own. <html>,
    // not <body>, is this page's scrolling element, so it has to be locked too.
    // Setting overflow: hidden also resets scrollTop to 0 in most browsers,
    // so the position has to be saved and restored around the toggle.
    effect(() => {
      if (this.openedSignal()) {
        this.savedScrollY = window.scrollY;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      } else {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        window.scrollTo(0, this.savedScrollY);
      }
    });
  }

  toggle() {
    this.openedSignal.update(opened => !opened);
  }

  close() {
    this.openedSignal.set(false);
  }
}
