import { Subject } from 'rxjs';
import { SidenavDirective } from './sidenav.directive';
import { SidenavActions, SidenavService } from '../services/sidenav.service';

describe('SidenavDirective', () => {
  it('should create an instance', () => {
    const sidenavService = { changeMenu$: new Subject<SidenavActions>() } as unknown as SidenavService;
    const directive = new SidenavDirective(sidenavService);
    expect(directive).toBeTruthy();
  });
});
