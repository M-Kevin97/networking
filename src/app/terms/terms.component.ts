import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrl } from '../core/router/route-url.enum';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToLegalNotice() {

    this.router.navigate([RouteUrl.TERMS+RouteUrl.LEGAL_NOTICE]);
  }

  goToGeneralTerms() {
    
    this.router.navigate([RouteUrl.TERMS+RouteUrl.GENERAL_TERMS]);
  }

  goToBoosterTerms() {
    
    this.router.navigate([RouteUrl.TERMS+RouteUrl.BOOSTER_TERMS]);
  }

  goToConfidentiality() {

    this.router.navigate([RouteUrl.TERMS+RouteUrl.CONFIDENTIALITY]);
  }

}
