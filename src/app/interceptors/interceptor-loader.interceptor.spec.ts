import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { loaderInterceptor } from './interceptor-loader.interceptor';
import { LoaderService } from '../services/loader-service.service';

describe('loaderInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;
  let loaderService: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loaderInterceptor])),
        provideHttpClientTesting(),
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    loaderService = TestBed.inject(LoaderService);
  });

  afterEach(() => httpTesting.verify());

  it('shows the loader while the request is in flight and hides it when it completes', () => {
    const showSpy = spyOn(loaderService, 'show').and.callThrough();
    const hideSpy = spyOn(loaderService, 'hide').and.callThrough();

    httpClient.get('/api/test').subscribe();

    expect(showSpy).toHaveBeenCalled();
    expect(hideSpy).not.toHaveBeenCalled();

    httpTesting.expectOne('/api/test').flush({});

    expect(hideSpy).toHaveBeenCalled();
  });
});
