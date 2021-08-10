import { AuthService } from 'src/app/core/auth/auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import * as firebase from 'firebase';
import { RouteUrl } from '../../router/route-url.enum';

@Injectable({
  providedIn: 'root'
})
export class VisitorGuardService {

  AuthSubscription: Subscription;

  constructor(private router:Router,
              private authService:AuthService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {

    return new Promise((resolve) => {

      this.authService.authStateChanged().then(
        (val) => {
          console.warn('canActivate', val);
          if(val) {
            this.router.navigate([RouteUrl.SEARCH]);
            resolve(false);
          }
          else {
            return resolve(true);
          }
        }
      ).catch(
        (error) => {
          console.warn('canActivate', error);
          console.error(error.message);
          resolve(true);
        }
      );
    });
  }
}