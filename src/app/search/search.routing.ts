import { ResultsComponent } from './pages/results/results.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteUrl } from '../core/router/route-url.enum';
import { AuthGuardService } from '../core/guards/user/auth-guard.service';
import { SearchComponent } from './search.component';

const routes: Routes = [
  {
    path: RouteUrl.SEARCH.substr(1), 
    component:  SearchComponent,
  },
  {
    path: RouteUrl.RESULTS.substr(1), 
    component:  ResultsComponent
  }

];

export const SearchRoutes = RouterModule.forChild(routes);
