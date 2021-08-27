import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss']
})
export class CrmComponent implements OnInit {

  
  constructor(private router: Router) { }


  ngOnInit() {
  }

  goToSignUpPage() {

    this.router.navigate([RouteUrl.SIGNUP]);
  }


  goToSurvey() {

    window.open("https://docs.google.com/forms/d/e/1FAIpQLSd1EXXa57eaPeE0qiB89BBpmVl4pmhlTh9J8eDxoD-DCC8oXw/viewform?usp=sf_link", "_blank");
  }

}
