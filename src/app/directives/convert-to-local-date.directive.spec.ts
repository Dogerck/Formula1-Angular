import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConvertToLocalDateDirective } from './convert-to-local-date.directive';

@Component({
  template: `<span [appConvertToLocalDate]="utcDate"></span>`,
  imports: [ConvertToLocalDateDirective]
})
class HostComponent {
  utcDate = '2024-05-01';
}

describe('ConvertToLocalDateDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('renders the formatted local date on the host element', () => {
    const span: HTMLSpanElement = fixture.nativeElement.querySelector('span');
    expect(span.textContent).toContain('2024');
  });
});
