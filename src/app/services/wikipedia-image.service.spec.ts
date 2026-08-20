import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { WikipediaImageService } from './wikipedia-image.service';

describe('WikipediaImageService', () => {
  let service: WikipediaImageService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(WikipediaImageService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetches the thumbnail from the Wikipedia REST summary API', () => {
    let result: string | null | undefined;
    service.getImageUrl('https://en.wikipedia.org/wiki/Alexander_Albon').subscribe(url => result = url);

    const req = httpTesting.expectOne('https://en.wikipedia.org/api/rest_v1/page/summary/Alexander_Albon');
    req.flush({ thumbnail: { source: 'https://upload.wikimedia.org/albon.jpg' } });

    expect(result).toBe('https://upload.wikimedia.org/albon.jpg');
  });

  it('falls back to originalimage when there is no thumbnail', () => {
    let result: string | null | undefined;
    service.getImageUrl('https://en.wikipedia.org/wiki/Fernando_Alonso').subscribe(url => result = url);

    httpTesting.expectOne('https://en.wikipedia.org/api/rest_v1/page/summary/Fernando_Alonso')
      .flush({ originalimage: { source: 'https://upload.wikimedia.org/alonso-original.jpg' } });

    expect(result).toBe('https://upload.wikimedia.org/alonso-original.jpg');
  });

  it('returns null for a non-Wikipedia URL instead of making a request', () => {
    let result: string | null | undefined;
    service.getImageUrl('https://example.com/not-wikipedia').subscribe(url => result = url);

    httpTesting.expectNone(() => true);
    expect(result).toBeNull();
  });

  it('returns null when the request fails', () => {
    let result: string | null | undefined;
    service.getImageUrl('https://en.wikipedia.org/wiki/Unknown_Driver').subscribe(url => result = url);

    httpTesting.expectOne('https://en.wikipedia.org/api/rest_v1/page/summary/Unknown_Driver')
      .flush('not found', { status: 404, statusText: 'Not Found' });

    expect(result).toBeNull();
  });

  it('caches requests for the same Wikipedia URL', () => {
    let firstResult: string | null | undefined;
    let secondResult: string | null | undefined;
    service.getImageUrl('https://en.wikipedia.org/wiki/Lando_Norris').subscribe(url => firstResult = url);
    service.getImageUrl('https://en.wikipedia.org/wiki/Lando_Norris').subscribe(url => secondResult = url);

    httpTesting.expectOne('https://en.wikipedia.org/api/rest_v1/page/summary/Lando_Norris')
      .flush({ thumbnail: { source: 'https://upload.wikimedia.org/norris.jpg' } });

    expect(firstResult).toBe('https://upload.wikimedia.org/norris.jpg');
    expect(secondResult).toBe('https://upload.wikimedia.org/norris.jpg');
  });
});
