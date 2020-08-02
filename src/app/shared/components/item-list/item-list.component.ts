import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Item } from '../../item/item';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ItemService } from '../../item/item.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit, OnDestroy{

  @Input() items: Item[];
  itemsSubscription: Subscription;
  tit:string;

  constructor(protected router:Router, 
              protected itemService:ItemService) {
    
    console.log(this.items);
  }

  ngOnInit() {

    console.log(this.items);
  }

  onNewItem(){
    this.router.navigate(['/items', 'newitem']);
  }

  getMainAuthor(item:Item) {
    if(item.authors)
    {
      return item.authors[0].firstname+" "+item.authors[0].lastname;
    }
  }

  onDeleteItem(item: Item){
    this.itemService.removeItem(item);
  }

  ngOnDestroy(){
    if (this.itemsSubscription != null) {
      this.itemsSubscription.unsubscribe();
    }
  }
}
