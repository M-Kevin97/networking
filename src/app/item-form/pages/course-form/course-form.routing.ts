import { Routes, RouterModule } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { ItemTitleFormComponent } from '../../components/item-title-form/item-title-form.component';
import { ItemCategoryFormComponent } from '../../components/item-category-form/item-category-form.component';
import { ItemPriceFormComponent } from '../../components/item-price-form/item-price-form.component';
import { ItemMediaFormComponent } from '../../components/item-media-form/item-media-form.component';
import { ItemCompleteFormComponent } from '../../components/item-complete-form/item-complete-form.component';
import { AuthGuardService } from 'src/app/core/guards/user/auth-guard.service';
import { CourseFormComponent } from './course-form.component';
import { ItemFormComponent } from '../../item-form.component';

const routes: Routes = [
  {
    path:RouteUrl.NEW_ITEM.substr(1), 
    component:ItemFormComponent,
    canActivate: [AuthGuardService],
    children: 
    [
      {
        path:RouteUrl.COURSE.substr(1), 
        component:CourseFormComponent,
          children: 
          [
            {
              path:RouteUrl.NEW_TITLE.substr(1), 
              component:ItemTitleFormComponent,
              canActivate: [AuthGuardService]
            },
            {
              path:RouteUrl.NEW_CATEGORY.substr(1), 
              component:ItemCategoryFormComponent,
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
              path:RouteUrl.NEW_COMPLETED.substr(1), 
              component:ItemCompleteFormComponent,
              canActivate: [AuthGuardService]
            },
            {
              path:'', redirectTo:RouteUrl.NEW_COURSE+RouteUrl.NEW_TITLE, pathMatch:'full'
            }
        ]
      }
    ]
  }
];

export const CourseFormRoutes = RouterModule.forChild(routes);