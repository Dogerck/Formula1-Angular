import { Directive, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { WikipediaImageService } from '../services/wikipedia-image.service';

@Directive({
  selector: 'img[appWikipediaPhoto]',
  host: {
    '[src]': 'photoUrl()'
  }
})
export class WikipediaPhotoDirective {
  private wikipediaImageService = inject(WikipediaImageService);

  readonly appWikipediaPhoto = input.required<string>();

  protected photoUrl = toSignal(
    toObservable(this.appWikipediaPhoto).pipe(
      switchMap(url => this.wikipediaImageService.getImageUrl(url))
    ),
    { initialValue: null }
  );
}
