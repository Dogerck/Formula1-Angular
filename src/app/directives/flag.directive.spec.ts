import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagDirective } from './flag.directive';

@Component({
  template: `<img [appFlag]="country">`,
  imports: [FlagDirective]
})
class HostComponent {
  country = 'Thai';
}

describe('FlagDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
  });

  it('resolves a driver nationality (demonym) to its flag URL', () => {
    fixture.detectChanges();
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.src).toBe('https://flagcdn.com/w40/th.png');
  });

  it('resolves a circuit country name to its flag URL', () => {
    fixture.componentInstance.country = 'Netherlands';
    fixture.detectChanges();
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.src).toBe('https://flagcdn.com/w40/nl.png');
  });

  it('leaves src empty for an unmapped country', () => {
    fixture.componentInstance.country = 'Atlantis';
    fixture.detectChanges();
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.getAttribute('src')).toBe('');
  });
});
