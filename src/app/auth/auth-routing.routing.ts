import { SignupWithService } from './../core/guards/signup-with/signup-with.service';
import { SignupWithComponent } from './pages/signup-with/signup-with.component';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { VerificationLinkService } from './../core/guards/verification/verification-link.service';
import { VerificationComponent } from './components/verification/verification.component';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AuthComponent } from './auth.component';
import { PasswordForgottenComponent } from './pages/password-forgotten/password-forgotten.component';


const routes: Routes = [
  {
    path: RouteUrl.SIGNUP.substr(1), component:SignupComponent
  },
  {
    path: RouteUrl.SIGNUP_WITH.substr(1), component:SignupWithComponent, canActivate: [SignupWithService]
  },
  {
    path: RouteUrl.LOGIN.substr(1), component:SigninComponent
  },
  {
    path: RouteUrl.AUTH.substr(1), component:AuthComponent
  },
  {
    path: RouteUrl.PASSWORD_FORGOTTEN.substr(1), component:PasswordForgottenComponent
  },
];

export const AuthRoutingRoutes = RouterModule.forRoot(routes);
