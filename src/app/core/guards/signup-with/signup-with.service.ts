import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { RouteUrl } from '../../router/route-url.enum';

@Injectable({
  providedIn: 'root'
})
export class SignupWithService {


  constructor(private router:Router, 
              private authService:AuthService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authService.preSignUpUser) {
      return true;
    }
    else {
      this.router.navigate([RouteUrl.LOGIN]);
      return false;
    }
  }
}
