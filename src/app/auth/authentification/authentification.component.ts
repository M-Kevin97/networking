import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent implements OnInit {

  constructor(private router: Router,
              private location: Location) { }

  ngOnInit() {
  }

  isSignInRoute() {
    return this.router.url === '/auth/signin';
  }

  isSignUpRoute() {
    return this.router.url === '/auth/signup';
  }

  goBack() {
    this.location.back();
  }  
}
