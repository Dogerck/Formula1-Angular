import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDrawer } from '@angular/material/sidenav';
import { SidenavDirective } from './sidenav.directive';
import { SidenavService } from '../services/sidenav.service';

@Component({
  template: `<div [appSidenav]="drawer"></div>`,
  imports: [SidenavDirective]
})
class HostComponent {
  drawer = jasmine.createSpyObj<MatDrawer>('MatDrawer', ['toggle', 'open', 'close']);
}

describe('SidenavDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let sidenavService: SidenavService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    sidenavService = TestBed.inject(SidenavService);
    fixture.detectChanges();
  });

  it('toggles the bound drawer when the sidenav service emits', () => {
    sidenavService.sidebarChange('toggle');
    expect(fixture.componentInstance.drawer.toggle).toHaveBeenCalled();
  });
});
