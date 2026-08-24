import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, of, switchMap } from 'rxjs';
import { OpenF1Service } from 'src/app/services/openf1.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { CHART_COLORS, chartAxisLabel, chartAxisLine, chartGrid, chartLegendTextStyle, chartTooltip } from 'src/app/constants/echart-theme';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { EchartComponent, EChartOption } from 'src/app/shared/echart/echart.component';

interface DriverSectors {
  driverNumber: number;
  name: string;
  best: [number | null, number | null, number | null];
}

const SECTOR_COLORS = [CHART_COLORS.cyan, '#f5c518', '#ff6b9d'];
const ROW_HEIGHT = 26;
const CHART_MIN_HEIGHT = 220;
const CHART_CHROME_HEIGHT = 60;

@Component({
    selector: 'app-sector-comparison-chart',
    templateUrl: './sector-comparison-chart.component.html',
    styleUrls: ['./sector-comparison-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, EchartComponent]
})
export class SectorComparisonChartComponent {
  private openF1Service = inject(OpenF1Service);
  loaderService = inject(LoaderService);

  readonly season = input.required<string>();
  readonly raceDate = input.required<string>();
  readonly driverOrder = input<readonly number[]>([]);

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

  drivers = computed<DriverSectors[]>(() => {
    const data = this.raceData();
    if (!data) {
      return [];
    }

    const driverMeta = new Map(data.drivers.map(driver => [driver.driver_number, driver]));
    const best = new Map<number, [number | null, number | null, number | null]>();
    for (const lap of data.laps) {
      const current = best.get(lap.driver_number) ?? [null, null, null];
      const sectors: (number | null)[] = [lap.duration_sector_1, lap.duration_sector_2, lap.duration_sector_3];
      sectors.forEach((value, i) => {
        if (value !== null && (current[i] === null || value < (current[i] as number))) {
          current[i] = value;
        }
      });
      best.set(lap.driver_number, current);
    }

    const order = this.driverOrder();
    const numbers = order.length ? order : Array.from(best.keys());

    return numbers
      .filter(driverNumber => best.has(driverNumber))
      .map(driverNumber => ({
        driverNumber,
        name: driverMeta.get(driverNumber)?.full_name ?? `#${driverNumber}`,
        best: best.get(driverNumber) as [number | null, number | null, number | null],
      }));
  });

  chartHeight = computed(() => `${Math.max(CHART_MIN_HEIGHT, this.drivers().length * ROW_HEIGHT + CHART_CHROME_HEIGHT)}px`);

  chartOptions = computed<EChartOption>(() => {
    const drivers = this.drivers();

    return {
      backgroundColor: 'transparent',
      grid: chartGrid,
      tooltip: {
        trigger: 'item',
        ...chartTooltip,
        valueFormatter: value => this.formatSectorTime(value as number),
      },
      legend: {
        top: 0,
        textStyle: chartLegendTextStyle,
        inactiveColor: CHART_COLORS.textFaint,
      },
      xAxis: {
        type: 'value',
        min: 'dataMin',
        axisLabel: { ...chartAxisLabel, formatter: (value: number) => this.formatSectorTime(value) },
        axisLine: chartAxisLine,
        splitLine: { show: false },
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: drivers.map(driver => driver.name),
        axisLabel: chartAxisLabel,
        axisLine: chartAxisLine,
      },
      series: [0, 1, 2].map(sectorIndex => ({
        name: `Sector ${sectorIndex + 1}`,
        type: 'bar' as const,
        color: SECTOR_COLORS[sectorIndex],
        barMaxWidth: 8,
        data: drivers.map(driver => driver.best[sectorIndex] ?? 0),
      })),
    };
  });

  private formatSectorTime(seconds: number): string {
    return seconds.toFixed(3);
  }
}
