import { EventFormRoutes } from './pages/event-form/event-form.routing';
import { NavItemFormComponent } from './components/nav-item-form/nav-item-form.component';
import { SharedModule } from './../shared/shared.module';
import { ItemService } from '../shared/item/item.service';
import { NgModule } from '@angular/core';
import { ItemFormComponent } from './item-form.component';
import { CourseFormComponent } from './pages/course-form/course-form.component';
import { EventFormComponent } from './pages/event-form/event-form.component';
import { ItemTitleFormComponent } from './components/item-title-form/item-title-form.component';
import { ItemCategoryFormComponent } from './components/item-category-form/item-category-form.component';
import { ItemPriceFormComponent } from './components/item-price-form/item-price-form.component';
import { ItemMediaFormComponent } from './components/item-media-form/item-media-form.component';
import { EventDateFormComponent } from './components/event-date-form/event-date-form.component';
import { EventLocationFormComponent } from './components/event-location-form/event-location-form.component';
import { ItemCompleteFormComponent } from './components/item-complete-form/item-complete-form.component';
import { CourseFormRoutes } from './pages/course-form/course-form.routing';
import { CountdownModule } from 'ngx-countdown';
import { DatePipe } from '@angular/common';

@NgModule({
  imports: [
    SharedModule,
    CourseFormRoutes,
    EventFormRoutes,
    CountdownModule
  ],
  declarations: [
    ItemFormComponent,
    NavItemFormComponent,
    CourseFormComponent,
    EventFormComponent,
    ItemTitleFormComponent,
    ItemCategoryFormComponent,
    ItemPriceFormComponent,
    ItemMediaFormComponent,
    EventDateFormComponent,
    EventLocationFormComponent,
    ItemCompleteFormComponent,
  ],
  providers: [
    ItemService,
    DatePipe,
  ],
  exports: [

  ]
})
export class ItemFormModule { }
