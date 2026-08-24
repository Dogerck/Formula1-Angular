import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, of, switchMap } from 'rxjs';
import { OpenF1Service } from 'src/app/services/openf1.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { CHART_COLORS, chartAxisLabel, chartAxisLine, chartGrid, chartLegendTextStyle, chartSplitLine, chartTooltip } from 'src/app/constants/echart-theme';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { EchartComponent, EChartOption } from 'src/app/shared/echart/echart.component';

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

@Component({
    selector: 'app-race-pace-chart',
    templateUrl: './race-pace-chart.component.html',
    styleUrls: ['./race-pace-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, EchartComponent]
})
export class RacePaceChartComponent {
  private openF1Service = inject(OpenF1Service);
  loaderService = inject(LoaderService);

  readonly season = input.required<string>();
  readonly raceDate = input.required<string>();
  readonly topFinisherNumbers = input<ReadonlySet<number>>(new Set());

  private raceKey = computed(() => ({ season: this.season(), raceDate: this.raceDate() }));

  private sessionKey = toSignal(
    toObservable(this.raceKey).pipe(
      switchMap(({ season, raceDate }) => this.openF1Service.getSessionKeyForRace(season, raceDate)),
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

  // A handful of safety car / yellow flag laps can still be several times a
  // normal lap even after the outlier cutoff, so the visible axis is scaled
  // to the 2nd-95th percentile of the pack rather than the raw min/max —
  // those rare slow laps just poke above the plot instead of flattening it.
  private valueRange = computed(() => {
    const values = this.series().flatMap(series => series.laps.map(lap => lap.duration)).sort((a, b) => a - b);
    if (!values.length) {
      return { min: 0, max: 1 };
    }
    const percentile = (p: number) => values[Math.min(values.length - 1, Math.floor(values.length * p))];
    const min = percentile(0.02);
    const max = percentile(0.95);
    const pad = (max - min) * 0.1 || 1;
    return { min: min - pad, max: max + pad };
  });

  chartOptions = computed<EChartOption>(() => {
    const series = this.series();
    const topNumbers = this.topFinisherNumbers();
    const { min, max } = this.valueRange();

    const selected: Record<string, boolean> = {};
    series.forEach(driver => {
      selected[driver.name] = topNumbers.size === 0 || topNumbers.has(driver.driverNumber);
    });

    return {
      backgroundColor: 'transparent',
      grid: chartGrid,
      tooltip: {
        trigger: 'axis',
        ...chartTooltip,
        valueFormatter: value => this.formatLapTime(value as number),
      },
      legend: {
        type: 'scroll',
        top: 0,
        textStyle: chartLegendTextStyle,
        inactiveColor: CHART_COLORS.textFaint,
        selected,
      },
      xAxis: {
        type: 'value',
        min: 1,
        axisLabel: { ...chartAxisLabel, formatter: (value: number) => `L${value}` },
        axisLine: chartAxisLine,
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        min,
        max,
        axisLabel: { ...chartAxisLabel, formatter: (value: number) => this.formatLapTime(value) },
        splitLine: chartSplitLine,
      },
      dataZoom: [{ type: 'inside' }],
      // Direct end-of-line labels collide once several drivers converge on
      // similar pace, and ECharts' overlap-avoidance doesn't reposition
      // endLabel (open upstream limitation). The legend plus hover-to-
      // highlight below identifies a line without that clutter.
      series: series.map(driver => ({
        name: driver.name,
        type: 'line',
        data: driver.laps.map(lap => [lap.lap, lap.duration]),
        color: driver.color,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { width: 2 },
        emphasis: { focus: 'series', lineStyle: { width: 3 } },
        blur: { lineStyle: { opacity: 0.15 }, itemStyle: { opacity: 0.15 } },
      })),
    };
  });

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
