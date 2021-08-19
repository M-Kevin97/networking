import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';

@Component({
  selector: 'app-confidentiality',
  templateUrl: './confidentiality.component.html',
  styleUrls: ['./confidentiality.component.scss']
})
export class ConfidentialityComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  goToBoosterTerms() {
    
    this.router.navigate([RouteUrl.TERMS+RouteUrl.BOOSTER_TERMS]);
  }

  goToGeneralTerms() {
    
    this.router.navigate([RouteUrl.TERMS+RouteUrl.GENERAL_TERMS]);
  }
}
