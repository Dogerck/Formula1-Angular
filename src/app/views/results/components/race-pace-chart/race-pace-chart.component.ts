import { Component, ChangeDetectionStrategy, computed, inject, input, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { OpenF1Service } from 'src/app/services/openf1.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

interface LapPoint {
  lap: number;
  duration: number;
}

interface LapPaceSeries {
  driverNumber: number;
  name: string;
  color: string;
  laps: LapPoint[];
}

const CHART_WIDTH = 760;
const CHART_HEIGHT = 280;
const PADDING_X = 12;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 28;
const LABEL_GUTTER = 90;

@Component({
    selector: 'app-race-pace-chart',
    templateUrl: './race-pace-chart.component.html',
    styleUrls: ['./race-pace-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner]
})
export class RacePaceChartComponent {
  private openF1Service = inject(OpenF1Service);
  loaderService = inject(LoaderService);

  readonly season = input.required<string>();
  readonly raceDate = input.required<string>();
  readonly topFinisherNumbers = input<ReadonlySet<number>>(new Set());

  private visibilityOverrides = signal<ReadonlyMap<number, boolean>>(new Map());
  hoverLap = signal<number | null>(null);

  private raceKey = computed(() => ({ season: this.season(), raceDate: this.raceDate() }));

  private sessionKey = toSignal(
    toObservable(this.raceKey).pipe(
      switchMap(({ season, raceDate }) => {
        const year = Number(season);
        if (!year || !raceDate) {
          return of(null);
        }
        return this.openF1Service.getRaceSessions(year).pipe(
          map(sessions => sessions.find(session => session.date_start.startsWith(raceDate))?.session_key ?? null)
        );
      }),
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  private raceData = toSignal(
    toObservable(this.sessionKey).pipe(
      switchMap(key => key
        ? forkJoin({ laps: this.openF1Service.getLaps(key), drivers: this.openF1Service.getDrivers(key) })
        : of(null)
      ),
      catchError(error => {
        console.log('Erro:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  loaded = computed(() => this.raceData() !== null);

  series = computed<LapPaceSeries[]>(() => {
    const data = this.raceData();
    if (!data) {
      return [];
    }

    // Safety car / VSC / red-flag laps can run several times a normal lap
    // duration and would otherwise crush the whole chart's scale, so laps
    // well above the field's median are treated as outliers and dropped.
    const validLaps = data.laps.filter(lap => lap.lap_duration !== null && !lap.is_pit_out_lap);
    const cutoff = this.median(validLaps.map(lap => lap.lap_duration as number)) * 1.6;

    const driverMeta = new Map(data.drivers.map(driver => [driver.driver_number, driver]));
    const byDriver = new Map<number, LapPoint[]>();
    for (const lap of validLaps) {
      if ((lap.lap_duration as number) > cutoff) {
        continue;
      }
      const laps = byDriver.get(lap.driver_number) ?? [];
      laps.push({ lap: lap.lap_number, duration: lap.lap_duration as number });
      byDriver.set(lap.driver_number, laps);
    }

    return Array.from(byDriver.entries())
      .map(([driverNumber, laps]) => {
        const meta = driverMeta.get(driverNumber);
        return {
          driverNumber,
          name: meta?.full_name ?? `#${driverNumber}`,
          color: meta?.team_colour ? `#${meta.team_colour}` : '#64646f',
          laps: laps.sort((a, b) => a.lap - b.lap),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  visibleSeries = computed(() => this.series().filter(series => this.isVisible(series.driverNumber)));

  isVisible(driverNumber: number): boolean {
    const override = this.visibilityOverrides().get(driverNumber);
    return override !== undefined ? override : this.topFinisherNumbers().has(driverNumber);
  }

  private maxLap = computed(() => Math.max(1, ...this.visibleSeries().flatMap(series => series.laps.map(lap => lap.lap))));

  lapTicks = computed(() => {
    const max = this.maxLap();
    const steps = Math.min(5, Math.max(1, max - 1));
    const ticks = new Set<number>();
    for (let i = 0; i <= steps; i++) {
      ticks.add(Math.max(1, Math.round((max / steps) * i)));
    }
    return Array.from(ticks).sort((a, b) => a - b);
  });

  // A handful of safety car / yellow flag laps can still be several times a
  // normal lap even after the outlier cutoff, so the visible axis is scaled
  // to the 2nd-95th percentile of the pack rather than the raw min/max —
  // those rare slow laps just poke above the plot instead of flattening it.
  private valueRange = computed(() => {
    const values = this.visibleSeries().flatMap(series => series.laps.map(lap => lap.duration)).sort((a, b) => a - b);
    if (!values.length) {
      return { min: 0, max: 1 };
    }
    const percentile = (p: number) => values[Math.min(values.length - 1, Math.floor(values.length * p))];
    const min = percentile(0.02);
    const max = percentile(0.95);
    const pad = (max - min) * 0.1 || 1;
    return { min: min - pad, max: max + pad };
  });

  chartWidth = CHART_WIDTH;
  chartHeight = CHART_HEIGHT;
  plotRight = CHART_WIDTH - LABEL_GUTTER;

  xForLap(lap: number): number {
    const max = this.maxLap();
    if (max <= 1) {
      return PADDING_X;
    }
    return PADDING_X + ((lap - 1) / (max - 1)) * (this.plotRight - PADDING_X);
  }

  private yForValue(value: number): number {
    const { min, max } = this.valueRange();
    const usable = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
    const ratio = (value - min) / (max - min || 1);
    return PADDING_TOP + usable - ratio * usable;
  }

  linePath(series: LapPaceSeries): string {
    return series.laps
      .map((point, i) => `${i === 0 ? 'M' : 'L'}${this.xForLap(point.lap)},${this.yForValue(point.duration)}`)
      .join(' ');
  }

  private trueLabelY(series: LapPaceSeries): number {
    const last = series.laps[series.laps.length - 1];
    return last ? this.yForValue(last.duration) : 0;
  }

  // Drivers finishing on similar pace end up with end-of-line labels stacked
  // on top of each other, so they're nudged apart to a minimum gap here —
  // only the text position moves; the dot marking the driver's true final
  // lap time stays put.
  labelPositions = computed(() => {
    const MIN_GAP = 12;
    const entries = this.visibleSeries()
      .map(series => ({ series, dotY: this.trueLabelY(series), labelY: this.trueLabelY(series) }))
      .sort((a, b) => a.labelY - b.labelY);

    for (let i = 1; i < entries.length; i++) {
      const minY = entries[i - 1].labelY + MIN_GAP;
      if (entries[i].labelY < minY) {
        entries[i].labelY = minY;
      }
    }
    return entries;
  });

  gridLines = computed(() => {
    const { min, max } = this.valueRange();
    const steps = 4;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const value = min + ((max - min) / steps) * i;
      return { value, y: this.yForValue(value) };
    });
  });

  hoverX = computed(() => {
    const lap = this.hoverLap();
    return lap === null ? null : this.xForLap(lap);
  });

  hoverReadout = computed(() => {
    const lap = this.hoverLap();
    if (lap === null) {
      return [];
    }
    return this.visibleSeries()
      .map(series => ({ series, point: series.laps.find(point => point.lap === lap) }))
      .filter((entry): entry is { series: LapPaceSeries; point: LapPoint } => !!entry.point)
      .map(entry => ({ ...entry, y: this.yForValue(entry.point.duration) }))
      .sort((a, b) => a.point.duration - b.point.duration);
  });

  onHover(event: MouseEvent): void {
    const max = this.maxLap();
    if (max < 2) {
      return;
    }
    const target = event.currentTarget as SVGRectElement;
    const bounds = target.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left) / bounds.width;
    const lap = Math.round(1 + ratio * (max - 1));
    this.hoverLap.set(Math.min(max, Math.max(1, lap)));
  }

  onLeave(): void {
    this.hoverLap.set(null);
  }

  toggleDriver(driverNumber: number): void {
    const next = new Map(this.visibilityOverrides());
    next.set(driverNumber, !this.isVisible(driverNumber));
    this.visibilityOverrides.set(next);
  }

  private median(values: number[]): number {
    if (!values.length) {
      return 0;
    }
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  formatLapTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainder = (seconds % 60).toFixed(3).padStart(6, '0');
    return `${minutes}:${remainder}`;
  }
}
