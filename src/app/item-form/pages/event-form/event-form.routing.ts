import { EventDateFormComponent } from '../../components/event-date-form/event-date-form.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { ItemTitleFormComponent } from '../../components/item-title-form/item-title-form.component';
import { ItemCategoryFormComponent } from '../../components/item-category-form/item-category-form.component';
import { ItemPriceFormComponent } from '../../components/item-price-form/item-price-form.component';
import { ItemMediaFormComponent } from '../../components/item-media-form/item-media-form.component';
import { ItemCompleteFormComponent } from '../../components/item-complete-form/item-complete-form.component';
import { AuthGuardService } from 'src/app/core/guards/user/auth-guard.service';
import { EventFormComponent } from './event-form.component';
import { EventLocationFormComponent } from '../../components/event-location-form/event-location-form.component';

const routes: Routes = [
  {path:RouteUrl.NEW_EVENT.substr(1,RouteUrl.NEW_EVENT.length), 
    component:EventFormComponent,
    children: [
      {path:RouteUrl.NEW_TITLE.substr(1,RouteUrl.NEW_TITLE.length), 
        component:ItemTitleFormComponent,
        canActivate: [AuthGuardService]},
      {path:RouteUrl.NEW_CATEGORY.substr(1,RouteUrl.NEW_CATEGORY.length), 
        component:ItemCategoryFormComponent,
        canActivate: [AuthGuardService]},
      {path:RouteUrl.NEW_PRICE.substr(1,RouteUrl.NEW_PRICE.length), 
        component:ItemPriceFormComponent,
        canActivate: [AuthGuardService]},
      {path:RouteUrl.NEW_MEDIA.substr(1,RouteUrl.NEW_MEDIA.length), 
        component:ItemMediaFormComponent,
        canActivate: [AuthGuardService]},
        {path:RouteUrl.NEW_DATES.substr(1,RouteUrl.NEW_DATES.length), 
          component:EventDateFormComponent,
          canActivate: [AuthGuardService]},
        {path:RouteUrl.NEW_LOCATION.substr(1,RouteUrl.NEW_LOCATION.length), 
          component:EventLocationFormComponent,
          canActivate: [AuthGuardService]},
      {path:RouteUrl.NEW_COMPLETED.substr(1,RouteUrl.NEW_COMPLETED.length), 
        component:ItemCompleteFormComponent,
        canActivate: [AuthGuardService]},
      {path:'', redirectTo:RouteUrl.NEW_EVENT+RouteUrl.NEW_TITLE, pathMatch:'full'},
    ]},
    ];

export const EventFormRoutes = RouterModule.forChild(routes);