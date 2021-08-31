import { Routes, RouterModule } from '@angular/router';
import { RouteUrl } from '../core/router/route-url.enum';
import { SearchComponent } from './search.component';

const routes: Routes = [
  {
    path: RouteUrl.SEARCH.substr(1),  
    component:  SearchComponent,
  }
];

export const SearchRoutes = RouterModule.forChild(routes);
