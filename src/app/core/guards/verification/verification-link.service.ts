import { AuthService } from 'src/app/core/auth/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import * as firebase from 'firebase';
import { RouteUrl } from '../../router/route-url.enum';

@Injectable({
  providedIn: 'root'
})
export class VerificationLinkService implements CanActivate {

    constructor(private router:Router, private authService:AuthService) { }
  
    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
      return new Promise((resolve, reject) => {

        this.authService.isEmailVerificationLink().then(
          (bool) => {
            if(bool) {
              resolve(true);
            }
            else this.router.navigate([RouteUrl.HOME]);
          }
        ).catch(
          (error) => {
            console.error(error.message);
            this.router.navigate([RouteUrl.HOME]);
          }
        );
      }
    );
  }
}
