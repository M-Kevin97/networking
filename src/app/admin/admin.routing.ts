import { NewElementComponent } from './pages/new-element/new-element.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuardService } from '../core/guards/admin/admin-guard.service';
import { RouteUrl } from '../core/router/route-url.enum';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {path:RouteUrl.ADMIN.substr(1), 
    component:AdminComponent,
    canActivate: [AdminGuardService],
    children:[
      {
        path:RouteUrl.ADMIN_NEW_ELEMENT.substr(1), 
        component:NewElementComponent,
        canActivate: [AdminGuardService]
      }
    ]
  },
];

export const AdminRoutes = RouterModule.forChild(routes);