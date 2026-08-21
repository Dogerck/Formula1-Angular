import { Component, ChangeDetectionStrategy, DestroyRef, computed, inject, input, signal } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownComponent {
  readonly target = input.required<string>();

  private now = signal(Date.now());

  constructor() {
    const intervalId = setInterval(() => this.now.set(Date.now()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(intervalId));
  }

  private remainingMs = computed(() => Math.max(0, new Date(this.target()).getTime() - this.now()));

  days = computed(() => Math.floor(this.remainingMs() / 86400000));
  hours = computed(() => Math.floor((this.remainingMs() % 86400000) / 3600000));
  minutes = computed(() => Math.floor((this.remainingMs() % 3600000) / 60000));
  seconds = computed(() => Math.floor((this.remainingMs() % 60000) / 1000));

  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
