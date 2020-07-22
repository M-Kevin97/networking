import { PageNotFoundComponent } from './core/pages/page-not-found/page-not-found.component';
import { FeedComponent } from './feed/feed/feed.component';
import { RouteUrl } from './core/router/route-url.enum';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { AuthGuardService } from './core/guards/user/auth-guard.service';

const routes: Routes = [
  {path:RouteUrl.HOME.substr(1,RouteUrl.HOME.length),
     component:HomeComponent,
     canActivate: [AuthGuardService]},
  {path:RouteUrl.SEARCH.substr(1,RouteUrl.SEARCH.length), 
    component:SearchComponent},
  {path:RouteUrl.FEED.substr(1,RouteUrl.FEED.length), 
    component:FeedComponent,
    canActivate: [AuthGuardService]},
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'**', component:PageNotFoundComponent}
];

export const AppRoutingRoutes = RouterModule.forRoot(routes, 
                                                    {anchorScrolling: 'enabled',
                                                    onSameUrlNavigation: 'reload',
                                                     preloadingStrategy: PreloadAllModules });
