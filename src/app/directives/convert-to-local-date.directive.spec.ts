import { ElementRef } from '@angular/core';
import { ConvertToLocalDateDirective } from './convert-to-local-date.directive';

describe('ConvertToLocalDateDirective', () => {
  it('should create an instance', () => {
    const directive = new ConvertToLocalDateDirective(new ElementRef(document.createElement('span')));
    expect(directive).toBeTruthy();
  });
});
