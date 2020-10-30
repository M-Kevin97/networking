import { AuthService } from 'src/app/core/auth/auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { RouteUrl } from '../../router/route-url.enum';

@Injectable({
  providedIn: 'root'
})
export class VisitorGuardService {

  constructor(private router:Router,
              private authService:AuthService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
   
      if (this.authService.isAuth) {

        this.router.navigate([RouteUrl.FEED]);
        resolve(false);
      }
      else {  
        resolve(true);
      }
    });
  }
}