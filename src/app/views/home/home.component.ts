import { AfterViewInit, Component, ElementRef, inject, Renderer2, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { LoaderService } from 'src/app/services/loader-service.service';
import { NextRaceComponent } from './components/next-race/next-race.component';
import { StandingsComponent } from './components/standings/standings.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NextRaceComponent, StandingsComponent, MatProgressSpinner]
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('iframe', { static: false }) iframe!: ElementRef<HTMLIFrameElement>;
  constructor (public loaderService: LoaderService){}
  private renderer = inject(Renderer2);
  loading: boolean = true;


  ngAfterViewInit(): void {
    this.renderer.setStyle(this.iframe.nativeElement, 'display', 'none');
    this.iframe.nativeElement.onload = () => {
      this.loading = false;
      this.renderer.setStyle(this.iframe.nativeElement, 'display', 'block');
    };   
    console.log(this.iframe.nativeElement);
    
}
 }
