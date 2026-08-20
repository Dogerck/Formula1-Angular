import { AfterViewInit, Component, ElementRef, ChangeDetectionStrategy, signal, viewChild } from '@angular/core';
import { NextRaceComponent } from './components/next-race/next-race.component';
import { StandingsComponent } from './components/standings/standings.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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
    imports: [NextRaceComponent, StandingsComponent, MatProgressSpinner]
})
export class HomeComponent implements AfterViewInit {
  readonly feedContainer = viewChild.required<ElementRef<HTMLElement>>('feedContainer');

  feedState = signal<FeedState>('loading');

  ngAfterViewInit(): void {
    const timeout = setTimeout(() => this.feedState.set('error'), FEED_LOAD_TIMEOUT_MS);

    if (!window.twttr) {
      clearTimeout(timeout);
      this.feedState.set('error');
      return;
    }

    window.twttr.ready(twttr => {
      twttr.widgets
        .load(this.feedContainer().nativeElement)
        .then(widgets => {
          clearTimeout(timeout);
          this.feedState.set(widgets.length ? 'loaded' : 'error');
        })
        .catch(() => {
          clearTimeout(timeout);
          this.feedState.set('error');
        });
    });
  }
}
