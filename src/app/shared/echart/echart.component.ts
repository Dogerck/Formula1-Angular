import { Component, ChangeDetectionStrategy, DestroyRef, ElementRef, afterNextRender, effect, inject, input, viewChild } from '@angular/core';
import * as echarts from 'echarts/core';
import { BarChart, CustomChart, LineChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { ComposeOption } from 'echarts/core';
import type { BarSeriesOption, CustomSeriesOption, LineSeriesOption } from 'echarts/charts';
import type {
  DataZoomComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from 'echarts/components';

echarts.use([
  LineChart,
  BarChart,
  CustomChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  TitleComponent,
  CanvasRenderer,
]);

// The set of series/component options this wrapper's consumers may use.
// Extend this union if a chart needs an ECharts feature not listed here.
export type EChartOption = ComposeOption<
  | LineSeriesOption
  | BarSeriesOption
  | CustomSeriesOption
  | GridComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | DataZoomComponentOption
  | TitleComponentOption
>;

@Component({
  selector: 'app-echart',
  templateUrl: './echart.component.html',
  styleUrls: ['./echart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EchartComponent {
  readonly options = input.required<EChartOption>();
  readonly height = input<string>('320px');

  private container = viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');
  private instance: echarts.ECharts | undefined;
  private resizeObserver: ResizeObserver | undefined;

  constructor() {
    afterNextRender(() => this.init());

    effect(() => {
      const options = this.options();
      this.instance?.setOption(options, true);
    });

    inject(DestroyRef).onDestroy(() => {
      this.resizeObserver?.disconnect();
      this.instance?.dispose();
    });
  }

  private init(): void {
    const el = this.container().nativeElement;
    this.instance = echarts.init(el, undefined, { renderer: 'canvas' });
    this.instance.setOption(this.options());

    this.resizeObserver = new ResizeObserver(() => this.instance?.resize());
    this.resizeObserver.observe(el);
  }
}
