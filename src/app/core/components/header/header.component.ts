import { AuthService } from 'src/app/core/auth/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

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

  isHomeRoute() {
    return this.router.url === '/home';
  }

  goToHome(){
    this.router.navigate(['/home']);
  }

  onSearch(){
    this.router.navigate(['/search/results']);
  }

  goToFeed(){
    this.router.navigate(['/feed']);
  }

  goToShoppingCart(){
    this.router.navigate(['/shopping-cart']);
  }

  onSignIn(){
    this.router.navigate(['/feed']);
  }

  onSignUp(){
    this.router.navigate(['/feed']);
  }

  onSignOut(){
    this.authService.signOutUser();
    /* Si utilisateur déconnecté, isAuth = false; */
    console.log('user est déconnecté');
  }
}
