import { AuthService } from 'src/app/core/auth/auth.service';
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

  constructor(private router:Router, 
              private authService:AuthService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {

    if(this.authService.hasAuthResult && this.authService.isAuth) {

      return true;
    } 
    else {
      this.router.navigate([RouteUrl.LOGIN]);
      return false;
    } 

    // return this.authService.authStateChanged().then(
    //   (val) => {
    //     if(val) return true;
    //     else {
    //       this.router.navigate([RouteUrl.LOGIN]);
    //       return false;
    //     }
    //   }
    // ).catch(
    //   (error) => {
    //     console.error(error.message);
    //     this.router.navigate([RouteUrl.LOGIN]);
    //     return false;
    //   }
    // );
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
  }
}
