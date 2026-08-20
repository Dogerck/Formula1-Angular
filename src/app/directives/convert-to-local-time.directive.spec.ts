import { ElementRef } from '@angular/core';
import { ConvertToLocalTimeDirective } from './convert-to-local-time.directive';

describe('ConvertToLocalTimeDirective', () => {
  it('should create an instance', () => {
    const directive = new ConvertToLocalTimeDirective(new ElementRef(document.createElement('span')));
    expect(directive).toBeTruthy();
  });
});
