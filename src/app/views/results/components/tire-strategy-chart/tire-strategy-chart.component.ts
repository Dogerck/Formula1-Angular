import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, of, switchMap } from 'rxjs';
import { OpenF1Service, OpenF1Stint } from 'src/app/services/openf1.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { getTireCompoundColor } from 'src/app/constants/tire-compound-colors';
import { chartAxisLabel, chartAxisLine, chartGrid, chartTooltip, MONO_FONT } from 'src/app/constants/echart-theme';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { EchartComponent, EChartOption } from 'src/app/shared/echart/echart.component';

interface DriverStints {
  driverNumber: number;
  name: string;
  stints: OpenF1Stint[];
}

const ROW_HEIGHT = 28;
const CHART_MIN_HEIGHT = 200;
const CHART_CHROME_HEIGHT = 70;

@Component({
    selector: 'app-tire-strategy-chart',
    templateUrl: './tire-strategy-chart.component.html',
    styleUrls: ['./tire-strategy-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, EchartComponent]
})
export class TireStrategyChartComponent {
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
        ? forkJoin({ stints: this.openF1Service.getStints(key), drivers: this.openF1Service.getDrivers(key) })
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

  drivers = computed<DriverStints[]>(() => {
    const data = this.raceData();
    if (!data) {
      return [];
    }

    const driverMeta = new Map(data.drivers.map(driver => [driver.driver_number, driver]));
    const byDriver = new Map<number, OpenF1Stint[]>();
    for (const stint of data.stints) {
      const stints = byDriver.get(stint.driver_number) ?? [];
      stints.push(stint);
      byDriver.set(stint.driver_number, stints);
    }

    const order = this.driverOrder();
    const numbers = order.length ? order : Array.from(byDriver.keys());

    return numbers
      .filter(driverNumber => byDriver.has(driverNumber))
      .map(driverNumber => ({
        driverNumber,
        name: driverMeta.get(driverNumber)?.full_name ?? `#${driverNumber}`,
        stints: (byDriver.get(driverNumber) ?? []).sort((a, b) => a.stint_number - b.stint_number),
      }));
  });

  usedCompounds = computed(() => {
    const compounds = new Set(this.drivers().flatMap(driver => driver.stints.map(stint => stint.compound)));
    return Array.from(compounds);
  });

  chartHeight = computed(() => `${Math.max(CHART_MIN_HEIGHT, this.drivers().length * ROW_HEIGHT + CHART_CHROME_HEIGHT)}px`);

  getCompoundColor(compound: string): string {
    return getTireCompoundColor(compound);
  }

  chartOptions = computed<EChartOption>(() => {
    const drivers = this.drivers();
    const maxStints = Math.max(1, ...drivers.map(driver => driver.stints.length));

    return {
      backgroundColor: 'transparent',
      grid: chartGrid,
      tooltip: {
        trigger: 'item',
        ...chartTooltip,
        formatter: (params: any) => {
          const info = params.data?.stintInfo;
          if (!info) {
            return '';
          }
          const laps = info.lapEnd - info.lapStart + 1;
          return `<strong>${params.name}</strong><br/>${info.compound} &middot; Laps ${info.lapStart}-${info.lapEnd} (${laps} laps)`;
        },
      },
      xAxis: {
        type: 'value',
        axisLabel: chartAxisLabel,
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
      series: Array.from({ length: maxStints }, (_, stintIndex) => ({
        name: `Stint ${stintIndex + 1}`,
        type: 'bar' as const,
        stack: 'laps',
        barMaxWidth: 18,
        label: {
          show: true,
          position: 'inside' as const,
          color: '#0b0b0e',
          fontFamily: MONO_FONT,
          fontSize: 10,
          fontWeight: 700 as const,
          formatter: (params: any) => (params.value > 0 ? params.value : ''),
        },
        data: drivers.map(driver => {
          const stint = driver.stints[stintIndex];
          if (!stint) {
            return { value: 0 };
          }
          return {
            value: stint.lap_end - stint.lap_start + 1,
            itemStyle: { color: getTireCompoundColor(stint.compound) },
            stintInfo: { compound: stint.compound, lapStart: stint.lap_start, lapEnd: stint.lap_end },
          };
        }),
      })),
    };
  });
}
