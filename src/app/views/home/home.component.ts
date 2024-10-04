import { AfterViewInit, Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { LoaderService } from 'src/app/services/loader-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
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
