import { CoreModule } from './../core/core.module';
import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingRoutes } from './auth-routing.routing';

@NgModule({
  imports: [
    SharedModule,
    AuthRoutingRoutes,
    CoreModule,
  ],
  declarations: [
    AuthComponent,
    SigninComponent,
    SignupComponent
  ],
  exports: [
    SigninComponent,
    SignupComponent
  ]
})
export class AuthModule { }
