import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { WikipediaPhotoDirective } from './wikipedia-photo.directive';

@Component({
  template: `<img [appWikipediaPhoto]="wikipediaUrl">`,
  imports: [WikipediaPhotoDirective]
})
class HostComponent {
  wikipediaUrl = 'https://en.wikipedia.org/wiki/Alexander_Albon';
}

describe('WikipediaPhotoDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    fixture = TestBed.createComponent(HostComponent);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('sets the img src once the Wikipedia photo resolves', () => {
    fixture.detectChanges();

    httpTesting.expectOne('https://en.wikipedia.org/api/rest_v1/page/summary/Alexander_Albon')
      .flush({ thumbnail: { source: 'https://upload.wikimedia.org/albon.jpg' } });
    fixture.detectChanges();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.src).toBe('https://upload.wikimedia.org/albon.jpg');
  });
});
