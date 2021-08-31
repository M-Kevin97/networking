import { HomeComponent } from '../../../landing-page/home/home.component';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserService } from 'src/app/shared/service/user/user.service';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  AuthSubscription: Subscription;

  constructor(private router:Router,
              private authService:AuthService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {

    return new Promise((resolve) => {

      this.authService.authStateChanged().then(
        (val) => {
          // console.warn('canActivate', val);
          if(val) resolve(true);
          else {
            this.router.navigate([RouteUrl.LOGIN]);
            return resolve(false);
          }
        }
      ).catch(
        (error) => {
          // console.warn('canActivate', error);
          // console.error(error.message);
          this.router.navigate([RouteUrl.LOGIN]);
          resolve(false);
        }
      );

      // this.AuthSubscription = this.authService.getAuth().subscribe(bool => {
      //   if (bool) {
      //     resolve(true);
      //   } else {

      //     this.router.navigate([RouteUrl.HOME]);
      //   }
      // });
    });
  }
}

    // return new Promise((resolve, reject) => {
    //   firebase.auth().onAuthStateChanged((firebase_user) => {
    //     if (firebase_user) {
    //       console.log('°°°°°°auth guard :',firebase_user.uid);
    //       console.log(this.router.url);
    //       //if(this.router.url===RouteUrl.HOME) this.router.navigate([RouteUrl.FEED]);
    //       resolve(true);
    //     }
    //     else {
    //       console.log(this.router.url);
    //       this.router.navigate([RouteUrl.LOGIN]);
    //       console.log('auth guard :',firebase_user);
    //       resolve(false);
    //     }
    //   });
    // });
