import { RouteUrl } from './../../router/route-url.enum';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent implements OnInit {

  constructor(private authService: AuthService,
              private router:Router) { }

  ngOnInit() {
    
    // Pour reprendre le dernier compte connecté
    //this.authService.authStateChanged();
  }

  goToHome(){
    this.router.navigate(['/feed']);
  }

  onSearch(){
    this.router.navigate(['/search/results']);
  }

  goToInstructor() {
    this.router.navigate([RouteUrl.INSTRUCTOR]);
  }

  goToFeed(){
    this.router.navigate(['/feed']);
  }

  goToShoppingCart(){
    this.router.navigate(['/shopping-cart']);
  }

  onSignOut(){
    this.authService.signOutUser();
    /* Si utilisateur déconnecté, isAuth = false; */
    console.log('user est déconnecté');
  }
}
