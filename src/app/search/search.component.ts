import { User } from './../shared/model/user/user';
import { IUser } from 'src/app/shared/model/user/user';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SearchService } from '../shared/service/search/search.service';
import { UserService } from '../shared/service/user/user.service';
import { Subscription } from 'rxjs';
import { ItemResult, ISortOption, ISearchQuery } from '../shared/model/ISearchQuery';
import { Course } from '../shared/model/item/course';
import { EventItem } from '../shared/model/item/event-item';
import { Tag } from '../shared/model/tag/tag';
import { CategoryService } from '../shared/service/category/category.service';
import { ItemService } from '../shared/service/item/item.service';
import { RouterService } from '../shared/service/router/router.service';
import { FilterService } from '../shared/service/search/filter/filter.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  
  // variable pour la barre de navigation (Formation, Catégorie, Formateur)
  activeTab = ItemResult.USERS;
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
  usersSearchedList:Array<IUser> = [];
  usersList:Array<IUser> = [];

  constructor(private itemService:ItemService,
              private userService:UserService,
              private searchService:SearchService,
              private filterService:FilterService,
              private categoryService:CategoryService,
              private previousRouteService:RouterService,
              private router:Router,
              private route: ActivatedRoute) {  }

  ngOnInit() {

    // lancer la recherche 
    // console.error('SearchComponent ngOnInit', this.searchService.currentSearchQuery);

    this.getSearchQueryFromService();

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
      // console.info('poiuytrezsdfghjk***********:',this.searchService.currentSearchQuery);
      // console.info('URL:', this.previousRouteService.getLastPreviousUrl(), 'eeee', this.previousRouteService.getCurrentUrl());
        if(this.previousRouteService.getLastPreviousUrl().includes(RouteUrl.SEARCH) 
            && this.previousRouteService.getCurrentUrl() !== this.previousRouteService.getLastPreviousUrl()) {
          if(this.searchService.currentSearchQuery) this.searchService.searchSubject.next(this.searchService.currentSearchQuery);
        }
      }
    });

    if(!this.previousRouteService.getPreviousUrl().includes(RouteUrl.SEARCH)) {
      // console.info('poiuytrezsdfghjk%%%%%%%%%%%:',this.searchService.currentSearchQuery);
      if(this.searchService.currentSearchQuery) this.searchService.searchSubject.next(this.searchService.currentSearchQuery);
    }

    // getting search params from url
    // this.route.params.subscribe(params => {
    //   // PARAMS CHANGED .. TO SOMETHING REALLY COOL HERE ..
  
    //   if(this.course && this.course.id && params['id'] !== this.course.id) window.location.reload();
  
    // }); 
  } 

  getSearchQueryFromService(){

    // console.log('getSearchQueryFromService');
    
    this.searchSubscription = this.searchService.searchSubject
    .subscribe(
      (data:ISearchQuery) => {
        if(data) {
          // console.error('getSearchQueryFromService', data);

          this.searchUsers(data);
        }
      },
      (err: string) => console.error('Observer got an error: ' + err),
      () => {
        // console.log('Observer got a complete notification');
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

  // methode pour rechercher des utilisateurs dans la DB en fonction de la categorie choisie et des mots clés
  searchUsers(eventQuery:ISearchQuery) { 

    this.tagsList = [];
    this.itemsList = [];
    this.coursesList = [];
    this.eventsList = [];
    this.usersList = [];
    this.usersSearchedList = [];

    // console.error('searchCourses', eventQuery);

        // Getting the users form the 
    this.userService.getiUsersFromDB().then(
      (iUsers:IUser[]) => {

        if(iUsers!==null && iUsers!==undefined) {

          let promise =  new Promise<void>((resolve, reject) => {
            
            iUsers.forEach(
              (iUser, index, array) => {
  
                if(eventQuery.query) {
  
                  if(!this.filterWithQuery(iUser.searchContent, this.query)) this.usersSearchedList.push(iUser);
  
                } else this.usersSearchedList.push(iUser);

                if (index === array.length -1) resolve();
              }
            );
          });

          promise.then(
            () => {
              // console.error('usersSearchedList', this.usersSearchedList);
              this.searchCourses(eventQuery);
          });
        }
      }
    );
  }


  // methode pour rechercher des formations dans la DB en fonction de la categorie choisie et des mots clés
  searchCourses(eventQuery:ISearchQuery) {

    let categoryId:string = eventQuery.categoryId;
    this.query = eventQuery.query;

    // console.error('searchCourses',eventQuery);

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
        this.activeTab = ItemResult.USERS;
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

        if(!this.filterWithQuery(result.searchContent, this.query)) this.allocateItem(result);
      } else this.allocateItem(result);
    }
  }

  private allocateItem(res:Course|EventItem) {
    if(res) {

      // if items match with the filter 
      if(res.published) {
        if(this.filterService.filterItem(res)) {

          // attribuate each item to his list (courseList or EventList)
            if(res instanceof Course) this.coursesList.push(res);
            else if(res instanceof EventItem) this.eventsList.push(res);
    
            // console.error(res.iAuthors);
    
            // Creation of the user's list
            res.iAuthors.forEach(
              (user) => {
                // if isn't already in array
                this.usersList = Array.from(this.usersSearchedList);

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



  // formatter la requête (retirer les symboles)
  private filterWithQuery(searchContent:string, query:string): boolean {

    // console.warn('°°°°°°°°°°°°°°°°°°',searchContent, ' includes :', query.toLocaleLowerCase(), 
    //                                       'res : ',searchContent.includes(query.toLocaleLowerCase()));

    if(searchContent) {
      const regex =  /[ !@§_#$%&:=\-+.,£€<>^¨°\‘\“\`\'\"*\[\](){}¡∞≠æ®†Úºîœß◊©≈‹«πµ¬ﬁ¶;~ƒ∂≤≥›÷…•¿±\\ø¢√∫ı\/?]/;

      //récupération de chaque mot de la recherche
      let splittedArray = query.toLocaleLowerCase().split(regex);
  
      let counts:number[] = [];
  
      for(let keyword of splittedArray) counts.push(searchContent.split(keyword).length - 1); 
  
      // si 
      return !counts.reduce((a, b) => a + b, 0);
    }
    else return false
  }


  onAllocateItemList(){

    this.tagsList = [];
    this.itemsList = [];
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