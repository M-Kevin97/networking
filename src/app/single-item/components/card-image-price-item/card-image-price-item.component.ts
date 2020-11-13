import { EventItem } from 'src/app/shared/model/item/event-item';
import { Database } from 'src/app/core/database/database.enum';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Course } from 'src/app/shared/model/item/course';

@Component({
  selector: 'app-card-image-price-item',
  templateUrl: './card-image-price-item.component.html',
  styleUrls: ['./card-image-price-item.component.css']
})
export class CardImagePriceItemComponent implements OnInit {

  @Input() item:Course|EventItem;

  constructor(private router:Router) { }

  ngOnInit() { }

  getDefaultImage() {
    return Database.DEFAULT_IMG_COURSE;
  }

  goToRatingsSection() {
    this.router.navigate([RouteUrl.COURSE, this.item.id],{ fragment: 'ratings' });
  }
}
