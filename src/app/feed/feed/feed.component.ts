import { ItemsService } from '../../services/items.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  constructor(private router:Router,
              private itemService:ItemsService) { }

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
