import { SearchService } from './service/search.service';
import { Params } from './../core/params/params.enum';
import { Category } from 'src/app/shared/item/category/category';
import { Course } from 'src/app/shared/item/course';
import { ItemService } from 'src/app/shared/item/item.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { map, filter, scan } from 'rxjs/operators';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  courseList:Course[]= [];
  categoryName:string = "";
  query:string = "";
  mySubscription: any;

  constructor(private itemService:ItemService,
              private route: ActivatedRoute,
              private searchService:SearchService,
              private router:Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
        this.categoryName = params['category'];
        this.query = params['q'];
        console.log('ngOnInit seach :', this.categoryName);
        console.log('ngOnInit seach :', this.query);
         
        // Code pour rafraichir la page sans ke l'url change
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });

       /* this.itemService.getCoursesByCategory(category).then(
          (val) => {
            this.courseList = Course.coursesFromJson(val);
          }
        );*/
      }
    );

   /* let cat = this.searchService.category;

    console.log('ngOnInit SearchComponent', cat);

    if(cat) {
      this.itemService.getCoursesByCategory(cat).then(
        (val) => {
          this.courseList = Course.coursesFromJson(val);
        }
      );
    }*/
  }

  setCourseList(list) {
    console.log('getCourseList ', list);
    if(list) {
      this.courseList = [];
      this.courseList= Array.from(list);
    } 
  }
}
