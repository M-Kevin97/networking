import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { IUser } from 'src/app/shared/model/user/user';
import { SearchService } from 'src/app/shared/service/search/search.service';
import { UserService } from 'src/app/shared/service/user/user.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {

  iBoosters: IUser[] = [];

  constructor(private userService: UserService,
              private searchService: SearchService,
              private router: Router) {}


  ngOnInit() {

    this.iBoosters = [];

    // Getting the users form the database
    this.userService.getiUsersFromDB().then(
      (iUsers:IUser[]) => {
        if(iUsers!==null && iUsers!==undefined) {

          iUsers.forEach((iUser) => {

            if(!this.iBoosters.find(iBooster => iBooster.id === iUser.id)) {

              if(iUser.isBooster) {
                console.warn(iUser);
                this.iBoosters.push(iUser);
              }
            }
          });
        }
      }
    );
  }

  onSearchByTag(TagName:string) {

    if (TagName) {
      this.searchService.search('', TagName,'','');
    }
  }

  goToSearchPage() {

    this.router.navigate([RouteUrl.SEARCH]);
  }

  goToLPManager() {

    this.router.navigate([RouteUrl.MANAGER]);
  }

  goToLink(url:string) {

    window.open(url, "_blank");
  }

  goToCreateItemPage() {

    this.router.navigate([RouteUrl.CREATE_ITEM]);
  }



  // // variable pour la barre de navigation (Formation, Catégorie, Formateur)
  // activeTab = ItemResult.COURSES;

  // categoryName:string = '';
  // query:string = '';
  // mySubscription: Subscription;
  // private searchSubscription: Subscription;

  // // ---------------- Sort Option Select ----------------
  // sortOptionSelected:ISortOption;
  // sortOptions:ISortOption[] =[];

  // // ---------------- Categories array ----------------
  // categoriesToDisplay:Category[] = [];
  // categoryValues:Category[] = [];
  // // ---------------- Tag array ----------------
  // tagsList:Tag[] = [];

  // itemsList:Array<Course|EventItem> = [];
  // coursesList:Array<Course|EventItem> = [];
  // eventsList:Array<Course|EventItem> = [];
  // usersList:Array<IUser> = [];
  

  // constructor(private itemService:ItemService,
  //             private searchService:SearchService,
  //             private filterService:FilterService,
  //             private previousRouteService:RouterService,
  //             private router:Router,
  //             private route: ActivatedRoute) {  }

  // ngOnInit() { 

  //   console.error('ngOnInit');
  //   this.searchCourses();
  // }


  // onSearchByTag(TagName:string) {

  //   if (TagName) {
  //     this.searchService.search('', TagName,'','');
  //   }
  // }

  // // methode pour rechercher des formations dans la DB
  // searchCourses() {


  //   this.tagsList = [];
  //   this.itemsList = [];
  //   this.coursesList = [];
  //   this.eventsList = [];
  //   this.usersList = [];

  //   this.itemService.getItemsFromDB(
  //       (itemSnap:Course|EventItem) => {

  //       this.allocateItem(itemSnap);
  //     }
  //   ); 
  // }

  // private allocateItem(res:Course|EventItem) {
  //   if(res) {

  //     // if items match with the filter 
  //     if(res.published) {
  //       if(this.filterService.filterItem(res)) {

  //         // attribuate each item to his list (courseList or EventList)
  //         if(res instanceof Course) this.coursesList.push(res);
  //         else if(res instanceof EventItem) this.eventsList.push(res);
  
  //         console.error(res.iAuthors);
  
  //         // Creation of the user's list
  //         res.iAuthors.forEach(
  //           (user) => {
  //             // if isn't already in array
  //             if(!this.usersList.find(usr => usr.id === user.id)) 
  //               this.usersList.push(user);
  //           }
  //         );
  
  //         // Creation of the user's list
  //         res.tags.forEach(
  //           (tag) => {
  //             // if isn't already in array and isn't the query
  //             if(!this.tagsList.find(t => t.name === tag.name) && tag.name !== this.query) 
  //               this.tagsList.push(tag);
  //           }
  //         );
  //       }
  //     }
  //   }
  // }

  // onAllocateItemList(){

  //   this.coursesList = [];
  //   this.eventsList = [];
  //   this.usersList = [];

  //   this.filterService.itemList.forEach(
  //     (item) => {
  //       this.allocateItem(item);
  //     }
  //   );
  // }

  // /**
  //  *    ----------- Destroy ----------- 
  //  */

  // ngOnDestroy(){

  //   if(this.searchSubscription) {
  //     this.searchSubscription.unsubscribe();
  //   }

  //   if(this.mySubscription) {
  //     this.mySubscription.unsubscribe();
  //   }

  // }
}
