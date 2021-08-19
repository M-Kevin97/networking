import { LegalNoticeComponent } from './pages/legal-notice/legal-notice.component';
import { ConfidentialityComponent } from './pages/confidentiality/confidentiality.component';
import { BoosterTermsOfUseComponent } from './pages/booster-terms-of-use/booster-terms-of-use.component';
import { GeneralTermsOfUseComponent } from './pages/general-terms-of-use/general-terms-of-use.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteUrl } from '../core/router/route-url.enum';
import { TermsComponent } from './terms.component';


const routes: Routes = [
  { 
    path: RouteUrl.TERMS.substr(1),
    component:  TermsComponent,
    children: 
    [
      {
        path: RouteUrl.GENERAL_TERMS.substr(1), 
        component:  GeneralTermsOfUseComponent,
      },
      {
        path: RouteUrl.BOOSTER_TERMS.substr(1), 
        component:  BoosterTermsOfUseComponent,
      },
      {
        path: RouteUrl.CONFIDENTIALITY.substr(1), 
        component:  ConfidentialityComponent,
      },
      {
        path: RouteUrl.LEGAL_NOTICE.substr(1), 
        component:  LegalNoticeComponent,
      },
      // {
      //   path: '', 
      //   redirectTo: RouteUrl.TERMS, 
      //   pathMatch:'full'
      // }
    ]
  }
];

export const TermsRoutes = RouterModule.forChild(routes);