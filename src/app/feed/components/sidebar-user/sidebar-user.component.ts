import { AuthService } from 'src/app/core/auth/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { User, auth } from 'firebase';
import { RouteUrl } from 'src/app/core/router/route-url.enum';

@Component({
  selector: 'app-sidebar-user',
  templateUrl: './sidebar-user.component.html',
  styleUrls: ['./sidebar-user.component.css']
})
export class SidebarUserComponent implements OnInit {

  constructor(private router:Router,
              private auth:AuthService) { }

  ngOnInit() {
  }

  getUser() {
    return this.auth.authUser;
  }

  goToMyCourses() {
    this.router.navigate([RouteUrl.USER, this.auth.authUser.id], {fragment: 'courses'});
  }

  goToMyEvents() {
  this.router.navigate([RouteUrl.USER, this.auth.authUser.id], {fragment: 'events'});
  }

  goToAdmin(){
    this.router.navigate([RouteUrl.ADMIN]);
  }  

  goToAuthUserPage() {
    this.router.navigate([RouteUrl.USER, this.auth.authUser.id]);
  }

  newCourse(){
    this.router.navigate([RouteUrl.NEW_COURSE]);
  }
  
  newEvent(){
    this.router.navigate([RouteUrl.NEW_EVENT]);
  }

}
