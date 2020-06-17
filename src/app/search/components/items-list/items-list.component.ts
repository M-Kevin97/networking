import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs';
import { Item } from 'src/app/shared/item/item';
import { Router } from '@angular/router';
import { ItemService } from 'src/app/shared/item/item.service';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit, OnDestroy{

  items: Item[];
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

  getItemsFromService(){
    this.itemsSubscription = this.itemService.itemsSubject.subscribe(
      (data:Item[]) => {
        for(var _i = 0; _i < data.length; _i++) 
        {
          this.items[_i] = Item.fromJson(data[_i]);
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
