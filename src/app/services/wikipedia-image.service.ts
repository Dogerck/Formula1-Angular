import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';

interface WikipediaSummary {
  thumbnail?: { source: string };
  originalimage?: { source: string };
}

@Injectable({
  providedIn: 'root'
})
export class WikipediaImageService {
  private http = inject(HttpClient);
  private cache = new Map<string, Observable<string | null>>();

  getImageUrl(wikipediaUrl: string): Observable<string | null> {
    const summaryUrl = this.toSummaryApiUrl(wikipediaUrl);
    if (!summaryUrl) {
      return of(null);
    }

    if (!this.cache.has(summaryUrl)) {
      const request$ = this.http.get<WikipediaSummary>(summaryUrl).pipe(
        map(summary => summary.thumbnail?.source ?? summary.originalimage?.source ?? null),
        catchError(() => of(null)),
        shareReplay(1)
      );
      this.cache.set(summaryUrl, request$);
    }

    return this.cache.get(summaryUrl)!;
  }

  private toSummaryApiUrl(wikipediaUrl: string): string | null {
    try {
      const url = new URL(wikipediaUrl);
      const match = url.pathname.match(/^\/wiki\/(.+)$/);
      if (!match) {
        return null;
      }
      return `https://${url.hostname}/api/rest_v1/page/summary/${match[1]}`;
    } catch {
      return null;
    }
  }
}
