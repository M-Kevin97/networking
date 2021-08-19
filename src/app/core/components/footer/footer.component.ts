import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrl } from '../../router/route-url.enum';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

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
