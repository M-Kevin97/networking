import { EventItem } from 'src/app/shared/item/event-item';
import { ItemListComponent } from './../item-list/item-list.component';
import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../../item/course';
import { Router } from '@angular/router';
import { ItemService } from '../../item/item.service';
import { RouteUrl } from 'src/app/core/router/route-url.enum';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent extends ItemListComponent implements OnInit {

  @Input() events: EventItem[];

  constructor(router:Router, 
              itemService:ItemService) {
                
    super(router, itemService);
    console.log(this.events);
  }

  ngOnInit() { }

  onViewItem(id: number){
    this.router.navigate([RouteUrl.EVENT, id]);
  }

}
