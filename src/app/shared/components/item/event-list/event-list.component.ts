import { SearchService } from 'src/app/shared/service/search/search.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EventItem } from 'src/app/shared/model/item/event-item';
import { ItemService } from 'src/app/shared/service/item/item.service';
import { ItemListComponent } from '../item-list/item-list.component';


@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent extends ItemListComponent implements OnInit {

  @Input() event: EventItem;

  constructor(router:Router, 
              itemService:ItemService,
              searchService:SearchService) {
                
    super(router, itemService, searchService);
    console.log(this.event);
  }

  ngOnInit() { }

}
