import { UserService } from 'src/app/shared/service/user/user.service';
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
      firebase.auth().onAuthStateChanged((firebase_user) => {
        if (firebase_user) {
          console.log('°°°°°°auth guard :',firebase_user.uid);
          console.log(this.router.url);
          //if(this.router.url===RouteUrl.HOME) this.router.navigate([RouteUrl.FEED]);
          resolve(true);
        }
        else {
          console.log(this.router.url);
          this.router.navigate([RouteUrl.SIGNIN]);
          console.log('auth guard :',firebase_user);
          resolve(false);
        }
      });
    });
  }
}
