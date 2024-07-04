import { Component } from '@angular/core';

@Component({
  selector: 'app-latest',
  templateUrl: './latest.component.html',
  styleUrls: ['./latest.component.scss']
})
export class LatestComponent {
  ngAfterViewInit(): void {
    (<any>window).twttr.widgets.load();
}
}
