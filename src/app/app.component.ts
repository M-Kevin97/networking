import { AuthService } from 'src/app/core/auth/auth.service';
import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { RouterService } from './shared/service/router/router.service';
import { RouteUrl } from './core/router/route-url.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router,
              private authService: AuthService,
              private routerService: RouterService){

    //this.firebaseConfiguration();
    this.authService.authStateChanged();
  }

  private firebaseConfiguration(){
    
    // Web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyDkDnIA6BAD2rW8NVBDXtSaA87OUDBUl7s",
      authDomain: "network-55b29.firebaseapp.com",
      databaseURL: "https://network-55b29.firebaseio.com",
      projectId: "network-55b29",
      storageBucket: "network-55b29.appspot.com",
      messagingSenderId: "156096192940",
      appId: "1:156096192940:web:aa59dea901f2da043c5a09"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  private isAuthRoute() {
    return (this.router.url.includes(RouteUrl.LOGIN) || this.router.url.includes(RouteUrl.SIGNUP)
                                                     || this.router.url.includes(RouteUrl.AUTH)
                                                     || this.router.url.includes(RouteUrl.PASSWORD_FORGOTTEN));
  }

  displayHeader()
  {
    return (!this.isAuthRoute() && !this.isNewItemRoute());
  }

  isAuth()
  {
    return this.authService.isAuth;
  }

  isNewItemRoute() {
    return this.router.url.startsWith(RouteUrl.NEW_ITEM);
  }
}
