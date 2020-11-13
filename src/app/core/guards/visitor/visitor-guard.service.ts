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

    return new Promise((resolve, reject) => {

      this.AuthSubscription = this.authService.getAuth().subscribe(bool => {
        if (bool) {
          this.router.navigate([RouteUrl.FEED]);
          resolve(false);
        } else {
          // clear messages when empty message received
          //this.router.navigate([RouteUrl.LOGIN]);
          resolve(true);
        }
      });
    });
  }
}