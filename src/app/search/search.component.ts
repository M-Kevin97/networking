import { Item } from 'src/app/shared/model/item/item';
import { FilterService } from './../shared/service/search/filter/filter.service';
import { IUser } from 'src/app/shared/model/user/user';
import { Course } from 'src/app/shared/model/item/course';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { RouterService } from './../shared/service/router/router.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { EventItem } from '../shared/model/item/event-item';
import { ItemService } from '../shared/service/item/item.service';
import { Subscription } from 'rxjs';
import { Category } from '../shared/model/category/category';
import { DefautCategory, ISearchQuery, ItemResult } from '../shared/model/ISearchQuery';
import { CategoryService } from '../shared/service/category/category.service';
import { SearchService } from '../shared/service/search/search.service';
import { Database } from '../core/database/database.enum';

export interface ISortOption {
  name:string,
  id:string,
};
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
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

  itemNavActive:boolean = true;
  courseNavActive:boolean = false;
  eventNavActive:boolean = false;
  userNavActive:boolean = false;

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


  displayPanel(activeTab){
    this.activeTab = activeTab;
  }

  private setCategoryNav(categoryId:string) {

    let catF:Category;

    if(categoryId) {
      if(categoryId === DefautCategory.ID) {
        this.categoryName = DefautCategory.NAME;
        catF = new Category(DefautCategory.ID, DefautCategory.NAME,[]);
      }
      else if(catF = this.categoryService.categories.find(cat => cat.id === categoryId)) this.categoryName = catF.name;
      else {
        function breakIfSubCategoryFound(cat:Category) {
          const isFound = cat.subCategories.find(subCat => subCat.id === categoryId);
          if(isFound) {
            catF = cat;
            this.categoryName = isFound.name;
          }
          return isFound;
        }
        this.categoryService.categories.some(breakIfSubCategoryFound, this);
      }
    } else {
      categoryId =  DefautCategory.ID;
      this.categoryName = DefautCategory.NAME;
    }

    // Récupérer les catégories à afficher
    this.categoriesToDisplay = this.getCategoriesToDisplay(catF);
  }

  // methode pour rechercher des formations dans la DB en fonction de la categorie choisie et des mots clés
  searchCourses(eventQuery:ISearchQuery){

    let categoryId:string = eventQuery.categoryId;
    this.query = eventQuery.query;
  
    this.setCategoryNav(categoryId);

    console.error('searchCourses',eventQuery, this.categoryName);

    this.itemsList = [];
    this.coursesList = [];
    this.eventsList = [];
    this.usersList = [];

    // choisir les résultats à afficher
    switch(eventQuery.item) { 
      case ItemResult.COURSES: { 
        this.displayPanel(ItemResult.COURSES);
         break; 
      } 
      case ItemResult.EVENTS: { 
        this.displayPanel(ItemResult.EVENTS);
         break; 
      } 
      case ItemResult.USERS: { 
        this.displayPanel(ItemResult.USERS);
         break; 
      } 
      case ItemResult.ITEMS: { 
        this.displayPanel(ItemResult.ITEMS);
         break; 
      } 
      default: { 
        this.displayPanel(ItemResult.COURSES);
         break; 
      } 
    } 

    // Si il y a une categorie, récupérer les formations en fonction de la categorie 
    if(categoryId && categoryId!=='0') {

      if(this.categoryService.categories.find(cat => cat.id === categoryId)){
        this.itemService.getItemsByCategory(categoryId,
          (itemSnap:Course|EventItem) => {
  
            this.selectResult(itemSnap, eventQuery.query);
          }
        );
      } else {
        this.itemService.getItemsBySubCategory(categoryId,
          (itemSnap:Course|EventItem) => {
            
            this.selectResult(itemSnap, eventQuery.query);
          }
        ); 
      }
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

      if(this.filterService.filterItem(res)) {

        if(res instanceof Course) 
        this.coursesList.push(res);
      else if(res instanceof EventItem) 
        this.eventsList.push(res);

        console.error(res.iAuthors);

        res.iAuthors.forEach(
        (user) => {
          if(!this.usersList.find(usr => usr.id === user.id)) 
            this.usersList.push(user);
        }
      );

      }
    }
  }

  private filterSingleItemWithQuery(item:Course|EventItem, query:string): boolean {
    console.warn(item.searchContent,' includes :',query.toLocaleLowerCase(), 
                                          'res : ',item.searchContent.includes(query.toLocaleLowerCase()));

    //récupération de chaque mot de la recherche
    let splittedArray = query.toLocaleLowerCase().split(' ');
    let counts:number[] = [];

    for(let keyword of splittedArray) counts.push(item.searchContent.split(keyword).length - 1); 

    // si 
    return !counts.reduce((a, b) => a + b, 0);
  }

  onSearchByCategory(categoryId: string) {

    if (categoryId) {
      this.searchService.search(categoryId, '','','');
    }
  }

  getCategoriesToDisplay(catSelected:Category){

    if(!catSelected) return[];
  
    if(catSelected.subCategories.length) {
      let c = Array.from(catSelected.subCategories);
      return(c);
    } else return(this.categoryService.categories);
    
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

  onSelectCourseList(courses:Course[]){

    this.eventNavActive = false;
    this.userNavActive = false;
    this.courseNavActive = true;
  }

  onSelectEventList(events:EventItem[]){

    this.courseNavActive = false;
    this.userNavActive = false;
    this.eventNavActive = true;
  }

  onSelectUserList(){

    this.courseNavActive = false;
    this.userNavActive = false;
    this.eventNavActive = true;

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

  getPanelName() {
    return ItemResult;
  }

  ngOnDestroy(){

    if(this.searchSubscription) {
      this.searchSubscription.unsubscribe();
      console.log('this.searchSubscription.unsubscribe();');
    }

    if(this.mySubscription) {
      this.mySubscription.unsubscribe();
    }

  }
}
