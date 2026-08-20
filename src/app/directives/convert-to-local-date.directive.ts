import { Directive, ElementRef, OnInit, inject, input } from '@angular/core';

@Directive({ selector: '[appConvertToLocalDate]' })
export class ConvertToLocalDateDirective implements OnInit {
  private el = inject(ElementRef);

  readonly utcDate = input.required<string>({ alias: 'appConvertToLocalDate' });

  ngOnInit(): void {
    if (this.utcDate()) {
      const formattedDate = this.convertToLocalDate(this.utcDate());
      this.el.nativeElement.innerText = formattedDate;
    }
  }

  private convertToLocalDate(utcDate: string): string {
    const date = new Date(utcDate);
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return localDate.toLocaleDateString('en-GB', options);
  }
}
