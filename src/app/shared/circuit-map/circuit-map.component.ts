import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-circuit-map',
  templateUrl: './circuit-map.component.html',
  styleUrls: ['./circuit-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircuitMapComponent {
  private sanitizer = inject(DomSanitizer);

  readonly lat = input.required<string>();
  readonly long = input.required<string>();
  readonly label = input<string>('');

  protected mapUrl = computed<SafeResourceUrl>(() => {
    const query = encodeURIComponent(`${this.lat()},${this.long()}`);
    const url = `https://maps.google.com/maps?q=${query}&z=15&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });
}
