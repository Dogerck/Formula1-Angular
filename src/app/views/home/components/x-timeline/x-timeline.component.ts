import { Component, AfterViewInit, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-f1-timeline',
  standalone: true,
  imports: [],
  templateUrl: './x-timeline.component.html',
  styleUrls: ['./x-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F1TimelineComponent implements AfterViewInit {
  // Signal de Input com o link oficial da F1 como padrão
  profileUrl = input<string>('https://x.com');

  ngAfterViewInit() {
    this.carregarWidgetX();
  }

  private carregarWidgetX() {
    const win = window as any;
    // Dispara a renderização do widget nativo do X
    if (win.twttr && win.twttr.widgets) {
      win.twttr.widgets.load();
    }
  }
}
