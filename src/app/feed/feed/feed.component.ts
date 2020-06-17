import { ItemService } from '../../shared/item/item.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  constructor(private router:Router,
              private itemService:ItemService) { }

  ngOnInit() {
  }

  onNewItem(){
    this.router.navigate(['/new']);
  }

  onNewCourse(){
    this.router.navigate(['/newcourse']);
  }

  goToAdmin(){
    this.router.navigate(['/ad']);
  }
}
