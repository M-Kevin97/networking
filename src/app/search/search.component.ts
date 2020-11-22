import { FilterService } from './../shared/service/search/filter/filter.service';
import { IUser } from 'src/app/shared/model/user/user';
import { Course } from 'src/app/shared/model/item/course';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { RouterService } from './../shared/service/router/router.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { EventItem } from '../shared/model/item/event-item';
import { ItemService } from '../shared/service/item/item.service';
import { Subscription } from 'rxjs';
import { Category } from '../shared/model/category/category';
import { DefautCategory, ISearchQuery, ISortOption, ItemResult } from '../shared/model/ISearchQuery';
import { CategoryService } from '../shared/service/category/category.service';
import { SearchService } from '../shared/service/search/search.service';
import { Database } from '../core/database/database.enum';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  
  // variable pour la barre de navigation (Formation, Catégorie, Formateur)
  activeTab = ItemResult.COURSES;

  categoryName:string = '';
  query:string = '';
  mySubscription: Subscription;
  private searchSubscription: Subscription;

  // ---------------- Sort Option Select ----------------
  sortOptionSelected:ISortOption;
  sortOptions:ISortOption[] =[];

  // ---------------- Categories array ----------------
  categoriesToDisplay:Category[] = [];
  categoryValues:Category[] = [];

  itemsList:Array<Course|EventItem> = [];
  coursesList:Array<Course|EventItem> = [];
  eventsList:Array<Course|EventItem> = [];
  usersList:Array<IUser> = [];

  constructor(private itemService:ItemService,
              private searchService:SearchService,
              private filterService:FilterService,
              private categoryService:CategoryService,
              private previousRouteService:RouterService,
              private router:Router,
              private route: ActivatedRoute) {  }

  ngOnInit() { }

  onSearchByTag(TagName:string) {

    if (TagName) {
      this.searchService.search('', TagName,'','');
    }
  }

  ngOnDestroy(){

    if(this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    if(this.mySubscription) {
      this.mySubscription.unsubscribe();
    }

  }
}
