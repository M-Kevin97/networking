import { Database } from 'src/app/core/database/database.enum';
import { Component, OnInit, Input } from '@angular/core';
import { Item } from 'src/app/shared/item/item';
import { Router } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';

@Component({
  selector: 'app-card-image-price-item',
  templateUrl: './card-image-price-item.component.html',
  styleUrls: ['./card-image-price-item.component.css']
})
export class CardImagePriceItemComponent implements OnInit {

  @Input() item:Item;

  constructor(private router:Router) { }

  ngOnInit() {
  }

  checkImageLink() {
    if(this.item.imageLink===null || this.item.imageLink===undefined
                                  || this.item.imageLink==='')
    {
      return false;
    }
    else {
      return true;
    }
  }

  getDefaultImage() {
    return Database.DEFAULT_IMG_COURSE;
  }

  goToRatingsSection() {
    this.router.navigate([RouteUrl.COURSE, this.item.id],{ fragment: 'ratings' });
  }
}
