import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { ItemService } from '../../shared/item/item.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  constructor(private router:Router) { }

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
}
