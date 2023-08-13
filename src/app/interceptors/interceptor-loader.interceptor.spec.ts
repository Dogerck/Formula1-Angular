import { TestBed } from '@angular/core/testing';

import { LoaderInterceptor } from './interceptor-loader.interceptor';

describe('InterceptorLoaderInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LoaderInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: LoaderInterceptor = TestBed.inject(LoaderInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
