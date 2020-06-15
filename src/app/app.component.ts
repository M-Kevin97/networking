import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router){

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

  isSignInRoute() {
    return this.router.url === '/auth/signin';
  }

  isSignUpRoute() {
    return this.router.url === '/auth/signup';
  }

  isNewItemRoute() {
    return (this.router.url === '/new/title' || this.router.url === '/new/category'
                                             || this.router.url === '/new/price'
                                             || this.router.url === '/new/media'
                                             || this.router.url === '/new/complete');
  }

  isNewEventRoute() {
    return this.router.url === '/new';
  }
}
