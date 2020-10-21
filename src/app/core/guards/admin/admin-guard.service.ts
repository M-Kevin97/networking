import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserLevel } from './../../../shared/model/UserLevel.enum';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor(private router:Router, private authService:AuthService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((firebase_user) => {
        this.authService.getCurrentUserDataWithId(firebase_user.uid).then(
          (bool) => {
            if(bool) {
              if(UserLevel.ADMIN === this.authService.authUser.accessLevel) resolve(true);
              else this.router.navigate([RouteUrl.HOME]);
            } else {
              this.router.navigate([RouteUrl.HOME]);
            }
          }
        )
      });
    });
  }
}
