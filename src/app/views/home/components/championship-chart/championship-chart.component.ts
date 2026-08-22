import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { DriverSeries } from 'src/app/models/driver-series';
import { StandingsService } from 'src/app/services/standings.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { getTeamColor } from 'src/app/constants/team-colors';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

const CHART_WIDTH = 760;
const CHART_HEIGHT = 280;
const PADDING_X = 12;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 28;
const LABEL_GUTTER = 70;

@Component({
    selector: 'app-championship-chart',
    templateUrl: './championship-chart.component.html',
    styleUrls: ['./championship-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner]
})
export class ChampionshipChartComponent {
  private standingsService = inject(StandingsService);
  loaderService = inject(LoaderService);

  showTable = signal(false);
  hoverIndex = signal<number | null>(null);
  hiddenDriverIds = signal<ReadonlySet<string>>(new Set());

  private currentStandings = toSignal(
    this.standingsService.getAll<Ergast>('current/driverStandings.json').pipe(
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  private driverMeta = computed(() => {
    const list = this.currentStandings()?.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
    const meta = new Map<string, { familyName: string; team: string }>();
    list.slice(0, 10).forEach(standing => meta.set(standing.Driver.driverId, {
      familyName: standing.Driver.familyName,
      team: standing.Constructors[0]?.name ?? '',
    }));
    return meta;
  });

  private history = toSignal(
    toObservable(this.currentStandings).pipe(
      switchMap(ergast => {
        const list = ergast?.MRData.StandingsTable.StandingsLists[0];
        const season = list?.season;
        const round = Number(list?.round ?? 0);
        const topIds = (list?.DriverStandings ?? []).slice(0, 10).map(standing => standing.Driver.driverId);
        if (!season || !round || !topIds.length) {
          return of(null);
        }
        const requests = Array.from({ length: round }, (_, i) =>
          this.standingsService.getAll<Ergast>(`${season}/${i + 1}/driverStandings.json`)
        );
        return forkJoin(requests).pipe(map(responses => ({ topIds, responses })));
      }),
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  series = computed<DriverSeries[]>(() => {
    const history = this.history();
    if (!history) {
      return [];
    }
    const meta = this.driverMeta();
    return history.topIds.map(driverId => {
      const info = meta.get(driverId);
      const points = history.responses.map(ergast => {
        const standings = ergast.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
        const found = standings.find(standing => standing.Driver.driverId === driverId);
        return Number(found?.points ?? 0);
      });
      return {
        driverId,
        familyName: info?.familyName ?? driverId,
        color: getTeamColor(info?.team ?? ''),
        points,
      };
    });
  });

  rounds = computed(() => {
    const count = this.series()[0]?.points.length ?? 0;
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  visibleSeries = computed(() => this.series().filter(s => !this.hiddenDriverIds().has(s.driverId)));

  private maxPoints = computed(() => Math.max(1, ...this.visibleSeries().flatMap(s => s.points)));

  chartWidth = CHART_WIDTH;
  chartHeight = CHART_HEIGHT;
  plotRight = CHART_WIDTH - LABEL_GUTTER;

  private xForIndex(index: number): number {
    const count = this.rounds().length;
    if (count <= 1) {
      return PADDING_X;
    }
    return PADDING_X + (index / (count - 1)) * (this.plotRight - PADDING_X);
  }

  private yForValue(value: number): number {
    const usable = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
    return PADDING_TOP + usable - (value / this.maxPoints()) * usable;
  }

  linePath(series: DriverSeries): string {
    return series.points.map((value, i) => `${i === 0 ? 'M' : 'L'}${this.xForIndex(i)},${this.yForValue(value)}`).join(' ');
  }

  labelY(series: DriverSeries): number {
    return this.yForValue(series.points[series.points.length - 1] ?? 0);
  }

  gridLines = computed(() => {
    const max = this.maxPoints();
    const steps = 4;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const value = Math.round((max / steps) * i);
      return { value, y: this.yForValue(value) };
    });
  });

  hoverX = computed(() => {
    const index = this.hoverIndex();
    return index === null ? null : this.xForIndex(index);
  });

  yForHover(series: DriverSeries): number {
    const index = this.hoverIndex();
    return index === null ? 0 : this.yForValue(series.points[index] ?? 0);
  }

  onHover(event: MouseEvent): void {
    const count = this.rounds().length;
    if (count < 2) {
      return;
    }
    const target = event.currentTarget as SVGRectElement;
    const bounds = target.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left) / bounds.width;
    const index = Math.round(ratio * (count - 1));
    this.hoverIndex.set(Math.min(count - 1, Math.max(0, index)));
  }

  onLeave(): void {
    this.hoverIndex.set(null);
  }

  toggleTable(): void {
    this.showTable.set(!this.showTable());
  }

  toggleDriver(driverId: string): void {
    const next = new Set(this.hiddenDriverIds());
    if (next.has(driverId)) {
      next.delete(driverId);
    } else {
      next.add(driverId);
    }
    this.hiddenDriverIds.set(next);
  }
}
