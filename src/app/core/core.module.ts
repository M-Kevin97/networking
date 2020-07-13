import { RouterService } from './router/router.service';
import { HeaderVisitorComponent } from './components/header-visitor/header-visitor.component';
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminGuardService } from './guards/admin/admin-guard.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { AuthService } from './auth/auth.service';
import { AuthGuardService } from './guards/user/auth-guard.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({

  declarations: [
    CoreComponent,
    HeaderUserComponent,
    HeaderVisitorComponent,
    FooterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderUserComponent,
    HeaderVisitorComponent,
    FooterComponent
  ],
  providers: [
    AuthService,
    AuthGuardService,
    AdminGuardService,
    RouterService
  ]
})
export class CoreModule { }
