import { Routes, RouterModule } from '@angular/router';
import { RouteUrl } from '../core/router/route-url.enum';
import { AuthGuardService } from '../core/guards/user/auth-guard.service';
import { SearchComponent } from './search.component';

const routes: Routes = [
  {path:RouteUrl.RESULTS.substr(1,RouteUrl.RESULTS.length), 
    component:SearchComponent},
];

export const SearchRoutes = RouterModule.forChild(routes);
