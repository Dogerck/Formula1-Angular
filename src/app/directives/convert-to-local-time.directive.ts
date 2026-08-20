import { Directive, ElementRef, OnInit, inject, input } from '@angular/core';

@Directive({ selector: '[appConvertToLocalTime]' })
export class ConvertToLocalTimeDirective implements OnInit {
  private el = inject(ElementRef);

  readonly utcTime = input.required<string>({ alias: 'appConvertToLocalTime' });

  ngOnInit(): void {
    if(this.utcTime()) {
      const localTime = this.convertToLocalTime(this.utcTime());
      this.el.nativeElement.innerText = localTime;
    }
  }

  private convertToLocalTime(utcTime: string): string {
    const date = new Date(`1970-01-01T${utcTime}`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

}
