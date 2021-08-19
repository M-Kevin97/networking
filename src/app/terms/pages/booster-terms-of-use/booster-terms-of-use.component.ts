import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RouteUrl } from 'src/app/core/router/route-url.enum';

@Component({
  selector: 'app-booster-terms-of-use',
  templateUrl: './booster-terms-of-use.component.html',
  styleUrls: ['./booster-terms-of-use.component.scss']
})
export class BoosterTermsOfUseComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  goToGeneralTerms() {
    
    this.router.navigate([RouteUrl.TERMS+RouteUrl.GENERAL_TERMS]);
  }

}
