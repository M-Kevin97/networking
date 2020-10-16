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

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl.push(this.currentUrl);
        this.currentUrl = event.url;

        console.log('ertjgkhjlk:',this.previousUrl, this.currentUrl);
      }
    });
  }

  public getCurrentUrl() {
    return this.currentUrl;
  }

  public getPreviousUrl() {
    return this.previousUrl[0];
  }

  public getPreviousUrlWithPosition(i:number) {
    return this.previousUrl[i];
  }

  public getLastPreviousUrl() {
    return this.previousUrl[this.previousUrl.length - 1];
  }
}
