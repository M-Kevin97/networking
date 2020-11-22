import { FilterService } from 'src/app/shared/service/search/filter/filter.service';
import { IUser } from 'src/app/shared/model/user/user';
import { Course } from 'src/app/shared/model/item/course';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { RouterService } from 'src/app/shared/service/router/router.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { EventItem } from 'src/app/shared/model/item/event-item';
import { ItemService } from 'src/app/shared/service/item/item.service';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/shared/model/category/category';
import { DefautCategory, ISearchQuery, ISortOption, ItemResult } from 'src/app/shared/model/ISearchQuery';
import { CategoryService } from 'src/app/shared/service/category/category.service';
import { SearchService } from 'src/app/shared/service/search/search.service';
import { Tag } from 'src/app/shared/model/tag/tag';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {

  
  // variable pour la barre de navigation (Formation, Catégorie, Formateur)
  activeTab = ItemResult.COURSES;
  query:string = '';
  mySubscription: Subscription;
  private searchSubscription: Subscription;

  // ---------------- Sort Option Select ----------------
  sortOptionSelected:ISortOption;
  sortOptions:ISortOption[] =[];

  // ---------------- Tag array ----------------
  tagsList:Tag[] = [];

  itemsList:Array<Course|EventItem> = [];
  coursesList:Array<Course> = [];
  eventsList:Array<EventItem> = [];
  usersList:Array<IUser> = [];

  constructor(private itemService:ItemService,
              private searchService:SearchService,
              private filterService:FilterService,
              private categoryService:CategoryService,
              private previousRouteService:RouterService,
              private router:Router,
              private route: ActivatedRoute) {  }

  ngOnInit() {

    // lancer la recherche 
    console.error('SearchComponent ngOnInit', this.searchService.currentSearchQuery);

    this.getSearchQueryFromService();

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
      console.info('poiuytrezsdfghjk***********:',this.searchService.currentSearchQuery);
      console.info('URL:', this.previousRouteService.getLastPreviousUrl(), 'eeee', this.previousRouteService.getCurrentUrl());
        if(this.previousRouteService.getLastPreviousUrl().includes(RouteUrl.RESULTS) 
            && this.previousRouteService.getCurrentUrl() !== this.previousRouteService.getLastPreviousUrl()) {
          if(this.searchService.currentSearchQuery) this.searchService.searchSubject.next(this.searchService.currentSearchQuery);
        }
      }
    });

    if(!this.previousRouteService.getPreviousUrl().includes(RouteUrl.RESULTS)) {
      console.info('poiuytrezsdfghjk%%%%%%%%%%%:',this.searchService.currentSearchQuery);
      if(this.searchService.currentSearchQuery) this.searchService.searchSubject.next(this.searchService.currentSearchQuery);
    }

    // getting search params from url
    // this.route.params.subscribe(params => {
    //   // PARAMS CHANGED .. TO SOMETHING REALLY COOL HERE ..
  
    //   if(this.course && this.course.id && params['id'] !== this.course.id) window.location.reload();
  
    // }); 
  } 

  getSearchQueryFromService(){

    console.log('getSearchQueryFromService');
    
    this.searchSubscription = this.searchService.searchSubject
    .subscribe(
      (data:ISearchQuery) => {
        if(data) {
          console.error('getSearchQueryFromService', data);
          this.searchCourses(data);
        }
      },
      (err: string) => console.error('Observer got an error: ' + err),
      () => {
        console.log('Observer got a complete notification');
      }
    );
  }

  getNbResults(){

    if(this.coursesList && this.eventsList && this.usersList)
      return this.coursesList.length + this.eventsList.length + this.usersList.length;
    else return 0;
  }

  onSearchByTag(TagName:string) {

    if (TagName) {
      this.searchService.search('', TagName,'','');
    }
  }

  // methode pour rechercher des formations dans la DB en fonction de la categorie choisie et des mots clés
  searchCourses(eventQuery:ISearchQuery) {

    let categoryId:string = eventQuery.categoryId;
    this.query = eventQuery.query;

    console.error('searchCourses',eventQuery);

    this.tagsList = [];
    this.itemsList = [];
    this.coursesList = [];
    this.eventsList = [];
    this.usersList = [];

    // choisir les résultats à afficher
    switch(eventQuery.item) { 
      case ItemResult.COURSES: { 
        this.activeTab = ItemResult.COURSES;
         break; 
      } 
      case ItemResult.EVENTS: { 
        this.activeTab = ItemResult.EVENTS;
         break; 
      } 
      case ItemResult.USERS: { 
        this.activeTab = ItemResult.USERS;
         break; 
      } 
      case ItemResult.ITEMS: { 
        this.activeTab = ItemResult.ITEMS;
         break; 
      } 
      default: { 
        this.activeTab = ItemResult.COURSES;
         break; 
      } 
    }

    // Si il y a une categorie, récupérer les formations en fonction de la categorie 
    if(categoryId && categoryId!=='0') {

      // if(this.categoryService.categories.find(cat => cat.id === categoryId)){
      //   this.itemService.getItemsByCategory(categoryId,
      //     (itemSnap:Course|EventItem) => {
  
      //       this.selectResult(itemSnap, eventQuery.query);
      //     },
      //     (error) => {

      //     }
      //   );
      // } else {
      //   this.itemService.getItemsBySubCategory(categoryId,
      //     (itemSnap:Course|EventItem) => {
            
      //       this.selectResult(itemSnap, eventQuery.query);
      //     },
      //     (error) => {
            
      //     }
      //   ); 
      // }
    }
    // Si il n'y a pas de categorie (Tout), ni de mots clés, récupérer toutes les formations 
    else {
      this.itemService.getItemsFromDB(
         (itemSnap:Course|EventItem) => {
          this.selectResult(itemSnap, eventQuery.query);
        }
      );
    }
  }

  // fonction permettant de répartir les items en (event, cours, user)
  private selectResult(result:Course|EventItem, query:string){
    if(result) {

      this.filterService.itemList.push(result);

      if(query) {

        if(!this.filterSingleItemWithQuery(result, this.query)) this.allocateItem(result);
      } else this.allocateItem(result);
    }
  }

  private allocateItem(res:Course|EventItem) {
    if(res) {

      // if items match with the filter 
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

  private filterSingleItemWithQuery(item:Course|EventItem, query:string): boolean {

    console.warn(item.searchContent,' includes :',query.toLocaleLowerCase(), 
                                          'res : ',item.searchContent.includes(query.toLocaleLowerCase()));

    const regex =  /[ !@§_#$%&:=\-+.,£€<>^¨°\‘\“\`\'\"*\[\](){}¡∞≠æ®†Úºîœß◊©≈‹«πµ¬ﬁ¶;~ƒ∂≤≥›÷…•¿±\\ø¢√∫ı\/?]/;

    //récupération de chaque mot de la recherche
    let splittedArray = query.toLocaleLowerCase().split(regex);

    let counts:number[] = [];

    for(let keyword of splittedArray) counts.push(item.searchContent.split(keyword).length - 1); 

    // si 
    return !counts.reduce((a, b) => a + b, 0);
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

  /* ---------------------------------------- SORT --------------------------------------------- */

  selectSortOption(event:ISortOption) {

    if(event) {
      this.searchService.sortOptionSelectedName = event.name;

      switch (event.id) {
        case this.sortOptions[0].id:
          this.sortByRelevance(Array.from(this.itemsList)).then(
            (data:Course[]) => {
              if(data){
                this.itemsList = data;
              }
            }
          );
          
          break;

        case this.sortOptions[1].id:
          
          break;

        case this.sortOptions[2].id:
          
          break;

        case this.sortOptions[3].id:
          
          break;

        default:
          
      }
    }
  }

  sortByRelevance(items:(Course | EventItem)[]) {

    return new Promise(
      (resolve, reject) => {
        if(items){
                


        } else reject([]); 
      }
    );
  }

  sortByPrice(courses:Course[]) {
    if(courses){
      
    }
  }

  sortByPriceDesc(courses:Course[]) {
    if(courses){
      
    }
  }

  sortByView(courses:Course[]) {
    if(courses){
      
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