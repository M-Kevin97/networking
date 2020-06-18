import { AuthComponent } from './auth.component';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';

const routes: Routes = [
  {path:'auth', component: AuthComponent, children: [
    {path: '', component:SignupComponent},
    {path: 'signup', component:SignupComponent},
    {path: 'signin', component:SigninComponent}
  ]}
];

export const AuthRoutingRoutes = RouterModule.forRoot(routes);
