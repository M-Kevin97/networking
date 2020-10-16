import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { IItem } from 'src/app/shared/model/item/item';

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

  goToItemPage() {
    if (this.iItem) {
      if(this.iItem.type==='event'){

        this.router.navigate([RouteUrl.EVENT, this.iItem.id]); 
  
      } else if(this.iItem.type==='course') {
  
        this.router.navigate([RouteUrl.COURSE, this.iItem.id]); 
      }
    }
  }
}
