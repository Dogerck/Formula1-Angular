import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConvertToLocalTimeDirective } from './convert-to-local-time.directive';

@Component({
  template: `<span [appConvertToLocalTime]="utcTime"></span>`,
  imports: [ConvertToLocalTimeDirective]
})
class HostComponent {
  utcTime = '14:30:00';
}

describe('ConvertToLocalTimeDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('renders the formatted local time on the host element', () => {
    const span: HTMLSpanElement = fixture.nativeElement.querySelector('span');
    expect(span.textContent?.length).toBeGreaterThan(0);
  });
});
