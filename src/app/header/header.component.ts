import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { User } from './../models/user';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  public get authService(): AuthService {
    return this._authService;
  }

  constructor(private _authService: AuthService,
              private router:Router) { }

  ngOnInit() {
    
    this.authService.authStateChanged();
  }

  onSignOut(){
    this.authService.signOutUser();
    /* Si utilisateur déconnecté, isAuth = false; */
    console.log('user est déconnecté');
  }

  isHomeRoute() {
    return this.router.url === '/home';
  }
}
