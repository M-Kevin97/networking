import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterService } from '../shared/service/router/router.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private router: Router,
              private routerService:RouterService) { }

  ngOnInit() {
  }

  isSignInRoute() {
    return this.router.url === '/auth/signin';
  }

  isSignUpRoute() {
    return this.router.url === '/auth/signup';
  }

  goBack() {
    var i = 0;
    const max = this.routerService.previousUrl.length;
    var prevUrl = this.routerService.getPreviousUrlWithPosition(i);

    console.log(prevUrl,i,max);

    while(i < max && (prevUrl === '/auth/signin' 
                  || prevUrl === '/auth/signup' 
                  || prevUrl === '/auth')){

      i++;
      prevUrl = this.routerService.getPreviousUrlWithPosition(i);
      console.log(prevUrl, i);
    }
    this.router.navigate([prevUrl]);
  }  
}
