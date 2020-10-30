import { AuthService } from 'src/app/core/auth/auth.service';
import { User } from '../../../shared/model/user/user';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';

@Component({
  selector: 'app-card-author',
  templateUrl: './card-author.component.html',
  styleUrls: ['./card-author.component.css']
})
export class CardAuthorComponent implements OnInit {

  @Input() author:User;

  constructor(private router:Router,
              private authService:AuthService) { }

  ngOnInit() {
    console.log('CardAuthorComponent', this.author);
  }

  goToUserPage(){
    console.log('CardAuthorComponent', this.author.id);
    if(!this.author.data) this.router.navigate([RouteUrl.USER, this.author.id]);
  }

  onFollowUser() {
    if(this.authService.isAuth) {

    }
    else {
      this.router.navigate([RouteUrl.LOGIN]);
    }
  }

}
