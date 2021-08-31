import { PreAuthComponent } from './components/pre-auth/pre-auth.component';
import { SignupWithComponent } from './pages/signup-with/signup-with.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { PasswordForgottenComponent } from './pages/password-forgotten/password-forgotten.component';
import { PasswordBoxComponent } from './components/password-box/password-box.component';
import { EmailBoxComponent } from './components/email-box/email-box.component';
import { LoginBoxComponent } from './components/login-box/login-box.component';
import { CoreModule } from './../core/core.module';
import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingRoutes } from './auth-routing.routing';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { CountdownModule } from 'ngx-countdown';
import { VerificationComponent } from './components/verification/verification.component';

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    AuthRoutingRoutes,
    CountdownModule,
  ],
  declarations: [
    AuthComponent,
    SigninComponent,
    SignupComponent,
    LoginBoxComponent,
    VerificationComponent,
    EmailBoxComponent,
    PasswordBoxComponent,
    PasswordForgottenComponent,
    PasswordResetComponent,
    SignupWithComponent,
    PreAuthComponent
  ],
  exports: [
    LoginBoxComponent,
    PreAuthComponent
  ]
})
export class AuthModule { }
