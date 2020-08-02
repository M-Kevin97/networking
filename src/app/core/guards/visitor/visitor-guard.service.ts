import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { RouteUrl } from '../../router/route-url.enum';

@Injectable({
  providedIn: 'root'
})
export class VisitorGuardService {

  constructor(private router:Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log('auth guard :',user.uid);
          this.router.navigate([RouteUrl.FEED]);
          resolve(false);
        }
        else {
          console.log(this.router.url);
          console.log('auth guard :',user);
          resolve(true);
        }
      });
    });
  }
}