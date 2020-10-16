
import { Database } from 'src/app/core/database/database.enum';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Category } from 'src/app/shared/model/category/category';

@Component({
  selector: 'app-card-image-price-item',
  templateUrl: './card-image-price-item.component.html',
  styleUrls: ['./card-image-price-item.component.css']
})
export class CardImagePriceItemComponent implements OnInit {

  @Input() id:string;
  @Input() imageLink:string;
  @Input() price:number;
  @Input() nbRatings:number;
  @Input() globalNote:number;
  @Input() category:Category;
  @Input() isData:boolean;

  constructor(private router:Router) { }

  ngOnInit() { }

  getDefaultImage() {
    return Database.DEFAULT_IMG_COURSE;
  }

  goToRatingsSection() {
    this.router.navigate([RouteUrl.COURSE, this.id],{ fragment: 'ratings' });
  }
}
