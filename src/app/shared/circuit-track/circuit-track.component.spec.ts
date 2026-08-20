import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitTrackComponent } from './circuit-track.component';

@Component({
  template: `<app-circuit-track [circuitId]="circuitId" [animated]="animated"></app-circuit-track>`,
  imports: [CircuitTrackComponent]
})
class HostComponent {
  circuitId = 'zandvoort';
  animated = true;
}

describe('CircuitTrackComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
  });

  it('renders the track outline for a known circuit', () => {
    fixture.detectChanges();
    const path = fixture.nativeElement.querySelector('.circuit-track__outline');
    expect(path).toBeTruthy();
    expect(path.getAttribute('d')?.length).toBeGreaterThan(0);
  });

  it('renders nothing for an unknown circuit', () => {
    fixture.componentInstance.circuitId = 'not-a-real-circuit';
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeNull();
  });

  it('renders the animated dot by default', () => {
    fixture.detectChanges();
    const dot = fixture.nativeElement.querySelector('.circuit-track__dot');
    expect(dot).toBeTruthy();
  });

  it('omits the animated dot when animated is false', () => {
    fixture.componentInstance.animated = false;
    fixture.detectChanges();
    const dot = fixture.nativeElement.querySelector('.circuit-track__dot');
    const path = fixture.nativeElement.querySelector('.circuit-track__outline');
    expect(dot).toBeNull();
    expect(path).toBeTruthy();
  });
});
