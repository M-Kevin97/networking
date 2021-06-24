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
import { Tag } from '../shared/model/tag/tag';

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
  // ---------------- Tag array ----------------
  tagsList:Tag[] = [];

  itemsList:Array<Course|EventItem> = [];
  coursesList:Array<Course|EventItem> = [];
  eventsList:Array<Course|EventItem> = [];
  usersList:Array<IUser> = [];
  

  constructor(private itemService:ItemService,
              private searchService:SearchService,
              private filterService:FilterService,
              private previousRouteService:RouterService,
              private router:Router,
              private route: ActivatedRoute) {  }

  ngOnInit() { 

    console.error('ngOnInit');
    this.searchCourses();
  }


  onSearchByTag(TagName:string) {

    if (TagName) {
      this.searchService.search('', TagName,'','');
    }
  }

  // methode pour rechercher des formations dans la DB
  searchCourses() {


    this.tagsList = [];
    this.itemsList = [];
    this.coursesList = [];
    this.eventsList = [];
    this.usersList = [];

    this.itemService.getItemsFromDB(
        (itemSnap:Course|EventItem) => {

        this.allocateItem(itemSnap);
      }
    ); 
  }

  private allocateItem(res:Course|EventItem) {
    if(res) {

      // if items match with the filter 
      if(res.published) {
        if(this.filterService.filterItem(res)) {

          // attribuate each item to his list (courseList or EventList)
          if(res instanceof Course) this.coursesList.push(res);
          else if(res instanceof EventItem) this.eventsList.push(res);
  
          console.error(res.iAuthors);
  
          // Creation of the user's list
          res.iAuthors.forEach(
            (user) => {
              // if isn't already in array
              if(!this.usersList.find(usr => usr.id === user.id)) 
                this.usersList.push(user);
            }
          );
  
          // Creation of the user's list
          res.tags.forEach(
            (tag) => {
              // if isn't already in array and isn't the query
              if(!this.tagsList.find(t => t.name === tag.name) && tag.name !== this.query) 
                this.tagsList.push(tag);
            }
          );
        }
      }
    }
  }

  onAllocateItemList(){

    this.coursesList = [];
    this.eventsList = [];
    this.usersList = [];

    this.filterService.itemList.forEach(
      (item) => {
        this.allocateItem(item);
      }
    );
  }

  /**
   *    ----------- Destroy ----------- 
   */

  ngOnDestroy(){

    if(this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    if(this.mySubscription) {
      this.mySubscription.unsubscribe();
    }

  }
}
