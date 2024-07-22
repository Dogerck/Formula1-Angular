import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appConvertToLocalDate]'
})
export class ConvertToLocalDateDirective implements OnInit {
  @Input('appConvertToLocalDate') utcDate!: string;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.utcDate) {
      const formattedDate = this.convertToLocalDate(this.utcDate);
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
