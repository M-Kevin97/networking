import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';

@Component({
  selector: 'app-general-terms-of-use',
  templateUrl: './general-terms-of-use.component.html',
  styleUrls: ['./general-terms-of-use.component.scss']
})
export class GeneralTermsOfUseComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  goToBoosterTerms() {
    
    this.router.navigate([RouteUrl.TERMS+RouteUrl.BOOSTER_TERMS]);
  }

  goToConfidentiality() {
    
    this.router.navigate([RouteUrl.TERMS+RouteUrl.CONFIDENTIALITY]);
  }
}
