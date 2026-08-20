import { Directive, computed, input } from '@angular/core';
import { countryToIso2 } from '../constants/country-iso-codes';

@Directive({
  selector: 'img[appFlag]',
  host: {
    '[src]': 'flagUrl()'
  }
})
export class FlagDirective {
  readonly appFlag = input.required<string>();

  protected flagUrl = computed(() => {
    const iso2 = countryToIso2(this.appFlag());
    return iso2 ? `https://flagcdn.com/w40/${iso2}.png` : '';
  });
}
