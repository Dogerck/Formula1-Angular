import { Component, Input } from '@angular/core';
import { Standings } from 'src/app/models/standings';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent {

  @Input() standings: Standings | undefined
}
