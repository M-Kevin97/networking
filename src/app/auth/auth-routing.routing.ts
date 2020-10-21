import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { VerificationLinkService } from './../core/guards/verification/verification-link.service';
import { VerificationComponent } from './pages/verification/verification.component';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';


const routes: Routes = [
  {
    path: RouteUrl.SIGNUP.substr(1), component:SignupComponent
  },
  {
    path: RouteUrl.LOGIN.substr(1), component:SigninComponent
  },
  {
    path: RouteUrl.VERIFICATION_LINK.substr(1), component:VerificationComponent, 
    canActivate: [VerificationLinkService]
  },
];

export const AuthRoutingRoutes = RouterModule.forRoot(routes);
