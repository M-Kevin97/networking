import { Routes, RouterModule } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { AuthGuardService } from '../core/guards/user/auth-guard.service';
import { EventDateFormComponent } from './components/event-date-form/event-date-form.component';
import { EventLocationFormComponent } from './components/event-location-form/event-location-form.component';
import { ItemMediaFormComponent } from './components/item-media-form/item-media-form.component';
import { ItemPriceFormComponent } from './components/item-price-form/item-price-form.component';
import { ItemReviewFormComponent } from './components/item-review-form/item-review-form.component';
import { ItemTagsFormComponent } from './components/item-tags-form/item-tags-form.component';
import { ItemTitleFormComponent } from './components/item-title-form/item-title-form.component';
import { ItemFormComponent } from './item-form.component';



const routes: Routes = [
  {  
    path: RouteUrl.NEW_ITEM.substr(1), 
    component:  ItemFormComponent,
    canActivate: [AuthGuardService],
    children: 
    [
      // {
      //   path:RouteUrl.NEW_TYPE.substr(1), 
      //   component:ItemTypeFormComponent,
      //   canActivate: [AuthGuardService]
      // },
      {
        path:RouteUrl.NEW_TITLE.substr(1), 
        component:ItemTitleFormComponent,
        canActivate: [AuthGuardService]
      },
      {
        path:RouteUrl.NEW_TAGS.substr(1), 
        component:ItemTagsFormComponent,
        canActivate: [AuthGuardService]
      },
      {
        path:RouteUrl.NEW_PRICE.substr(1), 
        component:ItemPriceFormComponent,
        canActivate: [AuthGuardService]
      },
      {
        path:RouteUrl.NEW_MEDIA.substr(1), 
        component:ItemMediaFormComponent,
        canActivate: [AuthGuardService]
      },
      {
        path:RouteUrl.NEW_DATES.substr(1), 
        component:EventDateFormComponent,
        canActivate: [AuthGuardService]
      },
      {
        path:RouteUrl.NEW_LOCATION.substr(1), 
        component:EventLocationFormComponent,
        canActivate: [AuthGuardService]
      },
      {
        path:RouteUrl.NEW_REVIEW.substr(1), 
        component:ItemReviewFormComponent,
        canActivate: [AuthGuardService]
      },
      {
        // path:'', redirectTo:RouteUrl.NEW_ITEM+RouteUrl.NEW_TYPE, pathMatch:'full'
        path:'', 
        redirectTo:RouteUrl.NEW_ITEM+RouteUrl.NEW_TITLE, 
        pathMatch:'full'
      }
    ]
  },
];

export const ItemFormRoutes = RouterModule.forChild(routes);

