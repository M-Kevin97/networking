import { ItemTypeFormComponent } from './components/item-type-form/item-type-form.component';
import { NavItemFormComponent } from './components/nav-item-form/nav-item-form.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { ItemFormComponent } from './item-form.component';
import { ItemTitleFormComponent } from './components/item-title-form/item-title-form.component';
import { ItemTagsFormComponent } from './components/item-tags-form/item-tags-form.component';
import { ItemPriceFormComponent } from './components/item-price-form/item-price-form.component';
import { ItemMediaFormComponent } from './components/item-media-form/item-media-form.component';
import { EventDateFormComponent } from './components/event-date-form/event-date-form.component';
import { EventLocationFormComponent } from './components/event-location-form/event-location-form.component';
import { ItemReviewFormComponent } from './components/item-review-form/item-review-form.component';
import { DatePipe } from '@angular/common';
import { ItemService } from '../shared/service/item/item.service';
import { ItemFormRoutes } from './item-form.routing';

@NgModule({
  imports: [
    SharedModule,
    ItemFormRoutes,
  ],
  declarations: [
    ItemFormComponent,
    NavItemFormComponent,
    ItemTypeFormComponent,
    ItemTitleFormComponent,
    ItemTagsFormComponent,
    ItemPriceFormComponent,
    ItemMediaFormComponent,
    EventDateFormComponent,
    EventLocationFormComponent,
    ItemReviewFormComponent,
  ],
  providers: [
    ItemService,
    DatePipe,
  ],
  exports: [

  ]
})
export class ItemFormModule { }
