import { ItemService } from '../../shared/item/item.service';
import { Item } from '../../shared/item/item';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-item',
  templateUrl: './single-item.component.html',
  styleUrls: ['./single-item.component.css']
})
export class SingleItemComponent implements OnInit {

  item: Item;

  constructor(private route:ActivatedRoute,
              private itemsService:ItemService,
              private router:Router) { }

  ngOnInit() {
    this.item = new Item(null,null,null,null,null,null,null,null, null);
    const id = this.route.snapshot.params['id'];
    this.itemsService.getSingleItemFromDB(+id).then(
      (item:Item) => {
        this.item = item;
      }
    );
  }

  onBack(){
    this.router.navigate(['/items']);
  }
}
