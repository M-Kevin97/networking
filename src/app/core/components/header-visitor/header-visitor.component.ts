import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-visitor',
  templateUrl: './header-visitor.component.html',
  styleUrls: ['./header-visitor.component.css']
})
export class HeaderVisitorComponent implements OnInit {

  constructor(private authService: AuthService,
    private router:Router) { }

  ngOnInit() {

  // Pour reprendre le dernier compte connecté
  //this.authService.authStateChanged();
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
  this.router.navigate(['/auth/signin']);
  }
}