import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { DefautCategory, ItemResult } from './../shared/model/ISearchQuery';
import { SearchService } from 'src/app/shared/service/search/search.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService,
              private searchService: SearchService,
              private router: Router) {}

  ngOnInit() {
    this.isAuthentifiedGoToFeedPage();
  }

  isAuthentifiedGoToFeedPage () {
    if(this.authService.isAuth) {
    this.router.navigate(['/feed']);
    }
  }

  onSearchCourses(){
    this.searchService.search(DefautCategory.ID, '', '', ItemResult.COURSES);
  }

  onSearchEvents(){
    this.searchService.search(DefautCategory.ID, '', '', ItemResult.EVENTS);
  }

  goToCreateItems(){
    this.router.navigate([RouteUrl.NEW_COURSE]);
  }

  onSearchByCategory(categoryId: string) {

    if (categoryId) {

      console.warn('onSearchByCategory', categoryId);
      this.searchService.search(categoryId, '','','');
    }
  }

}


