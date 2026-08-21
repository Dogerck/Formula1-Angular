import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { Races } from 'src/app/models/races';
import { CircuitsService } from 'src/app/services/circuits.service';
import { WikipediaImageService } from 'src/app/services/wikipedia-image.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FlagDirective } from 'src/app/directives/flag.directive';
import { WikipediaPhotoDirective } from 'src/app/directives/wikipedia-photo.directive';
import { CircuitTrackComponent } from 'src/app/shared/circuit-track/circuit-track.component';
import { CircuitMapComponent } from 'src/app/shared/circuit-map/circuit-map.component';

interface TopEntry {
  name: string;
  wins: number;
}

@Component({
    selector: 'app-circuit-detail',
    templateUrl: './circuit-detail.component.html',
    styleUrls: ['./circuit-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, FlagDirective, WikipediaPhotoDirective, RouterLink, CircuitTrackComponent, CircuitMapComponent]
})
export class CircuitDetailComponent {
  private circuitsService = inject(CircuitsService);
  private wikipediaService = inject(WikipediaImageService);
  loaderService = inject(LoaderService);

  readonly circuitId = input.required<string>();

  private circuitErgast = toSignal(
    toObservable(this.circuitId).pipe(
      switchMap(id => this.circuitsService.getAll<Ergast>(`circuits/${id}.json`)),
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  circuit = computed(() => this.circuitErgast()?.MRData.CircuitTable?.Circuits[0] ?? null);

  private winnersErgast = toSignal(
    toObservable(this.circuitId).pipe(
      switchMap(id => this.circuitsService.getAll<Ergast>(`circuits/${id}/results/1.json?limit=100`)),
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  private winningRaces = computed(() => this.winnersErgast()?.MRData.RaceTable.Races ?? []);

  totalRaces = computed(() => Number(this.winnersErgast()?.MRData.total ?? this.winningRaces().length));

  firstRaceYear = computed(() => this.winningRaces()[0]?.season ?? null);

  mostWinsDriver = computed<TopEntry | null>(() =>
    this.topWinner(race => {
      const driver = race.Results?.[0]?.Driver;
      return driver ? `${driver.givenName} ${driver.familyName}` : '';
    })
  );

  mostWinsConstructor = computed<TopEntry | null>(() =>
    this.topWinner(race => race.Results?.[0]?.Constructor.name ?? '')
  );

  recentWinners = computed(() => [...this.winningRaces()].reverse().slice(0, 8));

  private summary = toSignal(
    toObservable(this.circuit).pipe(
      switchMap(circuit => circuit ? this.wikipediaService.getSummary(circuit.url) : of(null))
    ),
    { initialValue: null }
  );

  description = computed(() => this.summary()?.extract ?? null);

  private topWinner(keyFn: (race: Races) => string): TopEntry | null {
    const counts = new Map<string, number>();
    for (const race of this.winningRaces()) {
      const key = keyFn(race);
      if (!key) {
        continue;
      }
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    let best: TopEntry | null = null;
    for (const [name, wins] of counts) {
      if (!best || wins > best.wins) {
        best = { name, wins };
      }
    }
    return best;
  }
}
