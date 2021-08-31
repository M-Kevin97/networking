import { TermsRoutes } from './terms.routing';
import { SharedModule } from './../shared/shared.module';
import { LegalNoticeComponent } from './pages/legal-notice/legal-notice.component';
import { ConfidentialityComponent } from './pages/confidentiality/confidentiality.component';
import { GeneralTermsOfUseComponent } from './pages/general-terms-of-use/general-terms-of-use.component';
import { BoosterTermsOfUseComponent } from './pages/booster-terms-of-use/booster-terms-of-use.component';
import { NgModule } from '@angular/core';
import { TermsComponent } from './terms.component';

@NgModule({
  declarations: [
    TermsComponent,
    BoosterTermsOfUseComponent,
    GeneralTermsOfUseComponent,
    ConfidentialityComponent,
    LegalNoticeComponent,
  ],
  imports: [
    SharedModule,
    TermsRoutes
  ],
  exports: [
  ]
})
export class TermsModule { }
