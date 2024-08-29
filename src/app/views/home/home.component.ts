import { Component } from '@angular/core';
import { LoaderService } from 'src/app/services/loader-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor (public loaderService: LoaderService){}
  
 }
