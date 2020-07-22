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

  constructor(private router:Router, 
              private itemService:ItemService) {
    this.items = [];
  }

  ngOnInit() {
    this.getItemsFromService();
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

  getItemsFromService(){
    this.itemsSubscription = this.itemService.itemsSubject.subscribe(
      (data:Item[]) => {
        for(var _i = 0; _i < data.length; _i++) 
        {
          this.items[_i] = Item.itemFromJson(data[_i]);
          console.log('Titre '+this.items[_i].title);
        }
      },
      (err: string) => console.error('Observer got an error: ' + err),
      () => {
        console.log('Observer got a complete notification');
      }
    );
    this.itemService.emitItems();
  }

  onDeleteItem(item: Item){
    this.itemService.removeItem(item);
  }

  onViewItem(id: number){
    this.router.navigate(['/items', 'item', id]);
  }

  ngOnDestroy(){
    if (this.itemsSubscription != null) {
      this.itemsSubscription.unsubscribe();
    }
  }
}
