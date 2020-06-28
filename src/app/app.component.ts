import { RouterService } from './core/router/router.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router,
              private authService:AuthService,
              private routerService:RouterService){

    this.firebaseConfiguration();
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

  private isSignRoute() {
    return (this.router.url === '/auth/signin' || this.router.url === '/auth/signup'
                                               || this.router.url === '/auth');
  }

  private isNewItemRoute() {
    return (this.router.url === '/new/title' || this.router.url === '/new/category'
                                             || this.router.url === '/new/price'
                                             || this.router.url === '/new/media'
                                             || this.router.url === '/new/complete');
  }

  isRouteOK()
  {
    return (!this.isSignRoute() && !this.isNewItemRoute());
  }

  isAuth()
  {
    return this.authService.isAuth;
  }

  isNewEventRoute() {
    return this.router.url === '/new';
  }
}
