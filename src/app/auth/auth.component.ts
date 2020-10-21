import { RouteUrl } from './../core/router/route-url.enum';
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
    return this.router.url === RouteUrl.LOGIN;
  }

  isSignUpRoute() {
    return this.router.url === RouteUrl.SIGNUP;
  }

  goBack() {
    var i = 0;
    const max = this.routerService.previousUrl.length;
    var prevUrl = this.routerService.getPreviousUrlWithPosition(i);

    console.log(prevUrl,i,max);

    while(i < max && (prevUrl === RouteUrl.LOGIN
                  || prevUrl === RouteUrl.SIGNUP)){

      i++;
      prevUrl = this.routerService.getPreviousUrlWithPosition(i);
      console.log(prevUrl, i);
    }
    this.router.navigate([prevUrl]);
  }  
}
