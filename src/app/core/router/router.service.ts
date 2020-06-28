import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  private currentUrl: string = null;

  private _previousUrl: string[] = [];

  public get previousUrl(): string[] {
    return this._previousUrl;
  }

  constructor(private router: Router) {
    this.currentUrl = this.router.url;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl.push(this.currentUrl);
        this.currentUrl = event.url;
      }
    });
  }

  public getPreviousUrl() {
    return this.previousUrl[0];
  }

  public getPreviousUrlWithPosition(i:number) {
    return this.previousUrl[i];
  }
}
