import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionTimeDirective } from './session-time.directive';

@Component({
  template: `<span [appSessionTime]="iso" [appSessionTimeZone]="timezone"></span>`,
  imports: [SessionTimeDirective]
})
class HostComponent {
  iso = '2026-08-23T10:00:00Z';
  timezone: string | undefined;
}

describe('SessionTimeDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
  });

  it('formats the session time in the given IANA timezone', () => {
    fixture.componentInstance.timezone = 'Europe/Amsterdam';
    fixture.detectChanges();
    const span: HTMLSpanElement = fixture.nativeElement.querySelector('span');
    // 10:00 UTC in August (CEST, UTC+2) is 12:00 in Amsterdam.
    expect(span.textContent).toContain('12:00');
  });

  it('falls back to the viewer local timezone when none is provided', () => {
    fixture.detectChanges();
    const span: HTMLSpanElement = fixture.nativeElement.querySelector('span');
    expect(span.textContent?.length).toBeGreaterThan(0);
  });
});
