import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/guards/user/auth-guard.service';
import { RouteUrl } from '../core/router/route-url.enum';
import { ProfileSettingComponent } from './pages/profile-setting/profile-setting.component';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: RouteUrl.SETTINGS.substr(1),
    component:  SettingsComponent,
    canActivate: [AuthGuardService],
    children: 
    [
      {
        path: RouteUrl.PROFILE_SETTINGS.substr(1), 
        component:  ProfileSettingComponent,
      },
      {
        path: '', 
        component:  ProfileSettingComponent,
      }
    ]
  }
];

export const SettingsRoutes = RouterModule.forChild(routes);
