import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'apex:favorite-driver';

@Injectable({
  providedIn: 'root'
})
export class FavoriteDriverService {
  private driverId = signal<string | null>(this.readStored());

  readonly favoriteDriverId = this.driverId.asReadonly();

  toggle(driverId: string): void {
    const next = this.driverId() === driverId ? null : driverId;
    this.driverId.set(next);
    this.writeStored(next);
  }

  isFavorite(driverId: string): boolean {
    return this.driverId() === driverId;
  }

  private readStored(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private writeStored(value: string | null): void {
    try {
      if (value) {
        localStorage.setItem(STORAGE_KEY, value);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage unavailable (private mode, etc.) — favorite just won't persist.
    }
  }
}
