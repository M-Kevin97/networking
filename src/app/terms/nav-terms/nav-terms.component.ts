import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';

@Component({
  selector: 'app-nav-terms',
  templateUrl: './nav-terms.component.html',
  styleUrls: ['./nav-terms.component.scss']
})
export class NavTermsComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  
}
