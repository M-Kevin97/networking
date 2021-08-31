import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/guards/user/auth-guard.service';
import { RouteUrl } from '../core/router/route-url.enum';
import { GetstartedComponent } from './getstarted.component';

const routes: Routes = [
  { 
    path: RouteUrl.GET_STARTED.substr(1), 
    component:  GetstartedComponent,
    canActivate: [AuthGuardService],
    // children: 
    // [
    //   // {
    //   //   path:RouteUrl.NEW_TYPE.substr(1), 
    //   //   component:ItemTypeFormComponent,
    //   //   canActivate: [AuthGuardService]
    //   // },
    //   {
    //     path:RouteUrl.NEW_TITLE.substr(1), 
    //     component:ItemTitleFormComponent,
    //     canActivate: [AuthGuardService]
    //   },
    //   {
    //     path:RouteUrl.NEW_TAGS.substr(1), 
    //     component:ItemTagsFormComponent,
    //     canActivate: [AuthGuardService]
    //   },
    //   {
    //     path:RouteUrl.NEW_PRICE.substr(1), 
    //     component:ItemPriceFormComponent,
    //     canActivate: [AuthGuardService]
    //   },
    //   {
    //     path:RouteUrl.NEW_MEDIA.substr(1), 
    //     component:ItemMediaFormComponent,
    //     canActivate: [AuthGuardService]
    //   },
    //   {
    //     path:RouteUrl.NEW_DATES.substr(1), 
    //     component:EventDateFormComponent,
    //     canActivate: [AuthGuardService]
    //   },
    //   {
    //     path:RouteUrl.NEW_LOCATION.substr(1), 
    //     component:EventLocationFormComponent,
    //     canActivate: [AuthGuardService]
    //   },
    //   {
    //     path:RouteUrl.NEW_REVIEW.substr(1), 
    //     component:ItemReviewFormComponent,
    //     canActivate: [AuthGuardService]
    //   },
    //   {
    //     // path:'', redirectTo:RouteUrl.NEW_ITEM+RouteUrl.NEW_TYPE, pathMatch:'full'
    //     path:'', 
    //     redirectTo:RouteUrl.NEW_ITEM+RouteUrl.NEW_TITLE, 
    //     pathMatch:'full'
    //   }
    // ]
   },
];

export const GetstartedRoutes = RouterModule.forChild(routes);
