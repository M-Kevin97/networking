import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router:Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log('auth guard :',user.uid);
          resolve(true);
        }
        else {
          this.router.navigate([RouteUrl.FEED]);
          resolve(false);
        }
      });
    });
  }
}
