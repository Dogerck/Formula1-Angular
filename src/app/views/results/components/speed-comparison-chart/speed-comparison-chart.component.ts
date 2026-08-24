import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, of, switchMap } from 'rxjs';
import { OpenF1Service } from 'src/app/services/openf1.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { chartAxisLabel, chartAxisLine, chartGrid, chartTooltip } from 'src/app/constants/echart-theme';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { EchartComponent, EChartOption } from 'src/app/shared/echart/echart.component';

interface DriverTopSpeed {
  driverNumber: number;
  name: string;
  color: string;
  topSpeed: number;
}

const ROW_HEIGHT = 26;
const CHART_MIN_HEIGHT = 200;
const CHART_CHROME_HEIGHT = 50;

@Component({
    selector: 'app-speed-comparison-chart',
    templateUrl: './speed-comparison-chart.component.html',
    styleUrls: ['./speed-comparison-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, EchartComponent]
})
export class SpeedComparisonChartComponent {
  private openF1Service = inject(OpenF1Service);
  loaderService = inject(LoaderService);

  readonly season = input.required<string>();
  readonly raceDate = input.required<string>();

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

  drivers = computed<DriverTopSpeed[]>(() => {
    const data = this.raceData();
    if (!data) {
      return [];
    }

    const driverMeta = new Map(data.drivers.map(driver => [driver.driver_number, driver]));
    const bestByDriver = new Map<number, number>();
    for (const lap of data.laps) {
      if (lap.st_speed === null) {
        continue;
      }
      const current = bestByDriver.get(lap.driver_number) ?? 0;
      if (lap.st_speed > current) {
        bestByDriver.set(lap.driver_number, lap.st_speed);
      }
    }

    return Array.from(bestByDriver.entries())
      .map(([driverNumber, topSpeed]) => {
        const meta = driverMeta.get(driverNumber);
        return {
          driverNumber,
          name: meta?.full_name ?? `#${driverNumber}`,
          color: meta?.team_colour ? `#${meta.team_colour}` : '#64646f',
          topSpeed,
        };
      })
      .sort((a, b) => b.topSpeed - a.topSpeed);
  });

  chartHeight = computed(() => `${Math.max(CHART_MIN_HEIGHT, this.drivers().length * ROW_HEIGHT + CHART_CHROME_HEIGHT)}px`);

  chartOptions = computed<EChartOption>(() => {
    const drivers = [...this.drivers()].reverse();

    return {
      backgroundColor: 'transparent',
      grid: chartGrid,
      tooltip: {
        trigger: 'item',
        ...chartTooltip,
        formatter: (params: any) => `<strong>${params.name}</strong><br/>${params.value} km/h`,
      },
      xAxis: {
        type: 'value',
        min: 'dataMin',
        axisLabel: { ...chartAxisLabel, formatter: (value: number) => `${value}` },
        axisLine: chartAxisLine,
        splitLine: { show: false },
      },
      yAxis: {
        type: 'category',
        data: drivers.map(driver => driver.name),
        axisLabel: chartAxisLabel,
        axisLine: chartAxisLine,
      },
      series: [{
        type: 'bar',
        barMaxWidth: 16,
        data: drivers.map(driver => ({ value: driver.topSpeed, itemStyle: { color: driver.color } })),
      }],
    };
  });
}
