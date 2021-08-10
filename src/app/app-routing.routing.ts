import { CreateComponent } from './create/create.component';
import { VisitorGuardService } from './core/guards/visitor/visitor-guard.service';
import { PageNotFoundComponent } from './core/pages/page-not-found/page-not-found.component';
import { RouteUrl } from './core/router/route-url.enum';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { AuthGuardService } from './core/guards/user/auth-guard.service';
import { FeedComponent } from './feed/feed.component';

const routes: Routes = [
  {
    path: RouteUrl.HOME.substr(1), 
    component:  HomeComponent, 
    canActivate: [VisitorGuardService]
  },
  {
    path: RouteUrl.CREATE_ITEM.substr(1), 
    component:  CreateComponent
  },
  // {
  //   path: RouteUrl.FEED.substr(1),  
  //   component:  FeedComponent,
  //   canActivate: [AuthGuardService]
  // },
  {
    path: '', 
    redirectTo: RouteUrl.HOME.substr(1), 
    pathMatch:  'full'
  },
  {
    path:'**', 
    component:  PageNotFoundComponent
  }
];

export const AppRoutingRoutes = RouterModule.forRoot(routes, { anchorScrolling: 'enabled',
                                                               onSameUrlNavigation: 'reload',
                                                               preloadingStrategy: PreloadAllModules });
