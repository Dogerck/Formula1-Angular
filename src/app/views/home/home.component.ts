import { AfterViewInit, Component, ElementRef, ChangeDetectionStrategy, signal, viewChild } from '@angular/core';
import { NextRaceComponent } from './components/next-race/next-race.component';
import { StandingsComponent } from './components/standings/standings.component';
import { ChampionshipChartComponent } from './components/championship-chart/championship-chart.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { F1TimelineComponent } from "./components/x-timeline/x-timeline.component";

interface TwitterWidgets {
  ready(callback: (twttr: { widgets: { load(el?: HTMLElement): Promise<HTMLElement[]> } }) => void): void;
}

declare global {
  interface Window {
    twttr?: TwitterWidgets;
  }
}

type FeedState = 'loading' | 'loaded' | 'error';

const FEED_LOAD_TIMEOUT_MS = 8000;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NextRaceComponent, StandingsComponent, ChampionshipChartComponent, MatProgressSpinner, F1TimelineComponent]
})
export class HomeComponent implements AfterViewInit {
  readonly feedContainer = viewChild.required<ElementRef<HTMLElement>>('feedContainer');

  feedState = signal<FeedState>('loading');

  ngAfterViewInit(): void {
    if ((window as any).twttr && (window as any).twttr.widgets) {
      (window as any).twttr.widgets.load();
    }
  }
}
