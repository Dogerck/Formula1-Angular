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
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  }
}
