import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { DefautCategory, ItemResult } from './../shared/model/ISearchQuery';
import { SearchService } from 'src/app/shared/service/search/search.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService,
              private searchService: SearchService,
              private router: Router) {}

  ngOnInit() { }

  goToCreateCourse() {
    this.router.navigate([RouteUrl.CREATE_ITEM]);
  }

  goToCreateEvent() {
    this.router.navigate([RouteUrl.CREATE_ITEM]);
  }

  goToSearchPage() {
    this.router.navigate([RouteUrl.SEARCH]);
  }


}


