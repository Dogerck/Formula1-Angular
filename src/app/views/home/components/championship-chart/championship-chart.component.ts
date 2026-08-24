import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { Ergast } from 'src/app/models/Ergast/ergast';
import { DriverSeries } from 'src/app/models/driver-series';
import { StandingsService } from 'src/app/services/standings.service';
import { LoaderService } from 'src/app/services/loader-service.service';
import { getTeamColor } from 'src/app/constants/team-colors';
import { CHART_COLORS, chartAxisLabel, chartAxisLine, chartGrid, chartLegendTextStyle, chartSplitLine, chartTooltip } from 'src/app/constants/echart-theme';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { EchartComponent, EChartOption } from 'src/app/shared/echart/echart.component';

@Component({
    selector: 'app-championship-chart',
    templateUrl: './championship-chart.component.html',
    styleUrls: ['./championship-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressSpinner, EchartComponent]
})
export class ChampionshipChartComponent {
  private standingsService = inject(StandingsService);
  loaderService = inject(LoaderService);

  showTable = signal(false);

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

  chartOptions = computed<EChartOption>(() => ({
    backgroundColor: 'transparent',
    grid: chartGrid,
    tooltip: {
      trigger: 'axis',
      ...chartTooltip,
      valueFormatter: value => `${value} pts`,
    },
    legend: {
      type: 'scroll',
      top: 0,
      textStyle: chartLegendTextStyle,
      inactiveColor: CHART_COLORS.textFaint,
    },
    xAxis: {
      type: 'category',
      data: this.rounds().map(round => `R${round}`),
      axisLabel: chartAxisLabel,
      axisLine: chartAxisLine,
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: chartAxisLabel,
      splitLine: chartSplitLine,
    },
    dataZoom: [{ type: 'inside' }],
    // Direct end-of-line labels collide when several drivers finish close in
    // points, and ECharts' own overlap-avoidance doesn't reposition endLabel
    // (open upstream limitation). The legend plus hover-to-highlight below
    // identifies a line without that clutter.
    series: this.series().map(driver => ({
      name: driver.familyName,
      type: 'line',
      data: driver.points,
      color: driver.color,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: { width: 2 },
      emphasis: { focus: 'series', lineStyle: { width: 3 } },
      blur: { lineStyle: { opacity: 0.15 }, itemStyle: { opacity: 0.15 } },
    })),
  }));

  toggleTable(): void {
    this.showTable.set(!this.showTable());
  }
}
