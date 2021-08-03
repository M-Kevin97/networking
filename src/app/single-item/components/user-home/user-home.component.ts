import { EventItem } from 'src/app/shared/model/item/event-item';
import { Course } from 'src/app/shared/model/item/course';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { User } from 'src/app/shared/model/user/user';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  @Input() user:User;
  @Input() courses:Course[];
  @Input() events:EventItem[];

  constructor(private router:Router) { }

  ngOnInit() {
  }

  getICoursesLength() {
    if(this.courses){
      return this.courses.length;
    }else { return 0 }
  }

  getIEventsLength() {
    if(this.events){
      return this.events.length;
    } else { return 0 }
  }

  displayUserCourses() {

    this.router.navigate([RouteUrl.USER, this.user.id], {fragment: 'courses'}); 
  }

  displayUserEvents() {

    this.router.navigate([RouteUrl.USER, this.user.id], {fragment: 'events'}); 
  }

}
