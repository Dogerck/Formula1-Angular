import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { CIRCUIT_TRACKS } from 'src/app/constants/circuit-tracks';

@Component({
  selector: 'app-circuit-track',
  templateUrl: './circuit-track.component.html',
  styleUrls: ['./circuit-track.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircuitTrackComponent {
  readonly circuitId = input.required<string>();

  protected trackPath = computed(() => CIRCUIT_TRACKS[this.circuitId()] ?? null);
}
