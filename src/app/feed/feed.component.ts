import { ItemService } from 'src/app/shared/item/item.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { RouteUrl } from '../core/router/route-url.enum';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  
  constructor(private router:Router,
              private auth:AuthService,
              private itemService:ItemService) { }

  ngOnInit() {
  }

  newCourse(){
  this.router.navigate([RouteUrl.NEW_COURSE]);
  }

  newEvent(){
  this.router.navigate([RouteUrl.NEW_EVENT]);
  }

  goToAdmin(){
  this.router.navigate([RouteUrl.ADMIN]);
  }

  goToMyCourses() {
  this.router.navigate([RouteUrl.USER, this.auth.authUser.id], {fragment: 'courses'});
  }

  goToMyEvents() {
  this.router.navigate([RouteUrl.USER, this.auth.authUser.id], {fragment: 'events'});
  }

  displayCoursesFeed() {
    this.router.navigate([RouteUrl.FEED, this.auth.authUser.id], {fragment: 'courses'}); 
  }

  displayEventsFeed() {
    this.router.navigate([RouteUrl.FEED, this.auth.authUser.id], {fragment: 'events'}); 
  }

  displayPostsFeed() {
    this.router.navigate([RouteUrl.FEED, this.auth.authUser.id], {fragment: 'posts'}); 
  }

  getAllCourses() {
    //this.itemService.getItemsFromDB();
  }
}
