import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService,
    private router: Router) { 

    }

  ngOnInit() {
    this.isAuthentifiedGoToFeedPage();
  }

  isAuthentifiedGoToFeedPage () {
    if(this.authService.isAuth) {
    this.router.navigate(['/feed']);
    }
  }

}


