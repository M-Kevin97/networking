import { SearchService } from './../search/service/search.service';
import { VisitorGuardService } from './guards/visitor/visitor-guard.service';
import { SharedModule } from './../shared/shared.module';
import { RouterService } from './router/router.service';
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgModule } from '@angular/core';
import { CoreComponent } from './core.component';
import { AuthService } from './auth/auth.service';
import { AuthGuardService } from './guards/user/auth-guard.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({

  imports: [  
    SharedModule,
  ],
  declarations: [
    CoreComponent,
    HeaderUserComponent,
    FooterComponent
  ],
  exports: [
    HeaderUserComponent,
    FooterComponent
  ],
  providers: [
    AuthService,
    AuthGuardService,
    VisitorGuardService,
    RouterService,
    SearchService,
  ]
})
export class CoreModule { }
