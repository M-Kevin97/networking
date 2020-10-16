import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser, User } from '../../model/user/user';
import { Database } from 'src/app/core/database/database.enum';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @Input() users: User[] | IUser[];

  constructor(private router:Router) { }

  ngOnInit() { }

  onConsultUser(user: User | IUser){
    if(user && !user.data){
      // rediriger vers l'événement
      this.router.navigate([RouteUrl.USER, user.id]);
    }
  }

  getTheSartOfDescription(user:User|IUser) {
    
    return user.bio ? user.bio.substring(0,30) : '';
  }

  userHasPpLink(user:User|IUser) {

    if(user) return user.ppLink === Database.DEFAULT_PP_USER;
    return false;
  }

}
