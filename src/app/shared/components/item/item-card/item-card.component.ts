import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Router } from '@angular/router';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IItem } from 'src/app/shared/model/item/item';
import { ItemListComponent } from '../item-list/item-list.component';
import { SearchService } from 'src/app/shared/service/search/search.service';
import { ItemService } from 'src/app/shared/service/item/item.service';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent extends ItemListComponent implements OnInit, OnChanges {

  @Input() isAuthor:   boolean = false;
  @Input() iItem:   IItem;
  @Input() width:   string;
  @Input() height:  string;
  
  constructor(router:Router, 
              itemService:ItemService,
              searchService:SearchService) {
                
    super(router,
          itemService,
          searchService);
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  getMainAuthor() {
    if(this.iItem && this.iItem.iAuthors)
    {
      return this.iItem.iAuthors[0].firstname+" "+this.iItem.iAuthors[0].lastname;
    }
  }

  getCategory() {

    if(this.iItem && this.iItem.category)
    {
      return this.iItem.category.name;
    }
  }

  onConsultItem() {
    if (this.iItem) {
      if(this.iItem.type === 'event'){

        this.router.navigate([RouteUrl.EVENT, this.iItem.id]); 
      
      } else if(this.iItem.type === 'course') {
  
        this.router.navigate([RouteUrl.COURSE, this.iItem.id]); 
      }
    }
  }
}
