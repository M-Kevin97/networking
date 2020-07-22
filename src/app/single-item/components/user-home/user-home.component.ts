import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { User } from 'src/app/shared/user/user';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  @Input() user:User;

  constructor(private router:Router) { }

  ngOnInit() {
  }

  getICoursesLength() {
    if(this.user.courses){
      return this.user.courses.length;
    }else { return 0 }
  }

  getIEventsLength() {
    if(this.user.events){
      return this.user.events.length;
    } else { return 0 }
  }

  displayUserCourses() {

    this.router.navigate([RouteUrl.USER, this.user.id], {fragment: 'courses'}); 
  }

  displayUserEvents() {

    this.router.navigate([RouteUrl.USER, this.user.id], {fragment: 'events'}); 
  }

}
