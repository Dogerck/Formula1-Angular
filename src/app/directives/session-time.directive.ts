import { Directive, ElementRef, effect, inject, input } from '@angular/core';

@Directive({ selector: '[appSessionTime]' })
export class SessionTimeDirective {
  private el = inject(ElementRef);

  // ISO-ish datetime, e.g. "2026-08-23T10:00:00Z" (session date + time combined
  // by the caller, since the API returns them as separate fields).
  readonly appSessionTime = input.required<string>();

  // IANA timezone (e.g. "Europe/Amsterdam"). Omit to format in the viewer's
  // own local timezone.
  readonly timezone = input<string | undefined>(undefined, { alias: 'appSessionTimeZone' });

  constructor() {
    effect(() => {
      const iso = this.appSessionTime();
      if (!iso) {
        return;
      }
      const date = new Date(iso);
      const timezone = this.timezone();
      const zoneOption = timezone ? { timeZone: timezone } : {};
      const weekdayFormatter = new Intl.DateTimeFormat('en-GB', { weekday: 'short', ...zoneOption });
      const timeFormatter = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', ...zoneOption });
      this.el.nativeElement.innerText = `${weekdayFormatter.format(date)} · ${timeFormatter.format(date)}`;
    });
  }
}
