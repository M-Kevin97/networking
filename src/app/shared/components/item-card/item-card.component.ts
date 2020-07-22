import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Router } from '@angular/router';
import { IItem, Item } from 'src/app/shared/item/item';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements OnInit {

  @Input() iItem:IItem;
  
  constructor(private router:Router) { }

  ngOnInit() {
  }

  getMainAuthor() {
    if(this.iItem.authors)
    {
      return this.iItem.authors[0].firstname+" "+this.iItem.authors[0].lastname;
    }
  }

  getCategory() {

    if(this.iItem.category)
    {
      return this.iItem.category.name;
    }
  }

  goToItemPage() {

    if(Item.instanceOfIEvent(this.iItem)){

      this.router.navigate([RouteUrl.EVENT, this.iItem.id]); 

    } else if(Item.instanceOfICourse(this.iItem)) {

      this.router.navigate([RouteUrl.COURSE, this.iItem.id]); 
    }
    
  }
}
