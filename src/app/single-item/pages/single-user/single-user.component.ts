
import { ItemService } from 'src/app/shared/service/item/item.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { IHeadUser } from './../../components/edit-head-user/edit-head-user.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User, IUser } from 'src/app/shared/model/user/user';
import { EditHeadUserComponent } from '../../components/edit-head-user/edit-head-user.component';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { UserService } from 'src/app/shared/service/user/user.service';
import { IItem } from 'src/app/shared/model/item/item';

enum UserNav {
  HOME = "home",
  COURSES = "crs",
  EVENTS = "evts",
  NETWORK= "netwrk"
};

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.scss']
})
export class SingleUserComponent implements OnInit, OnDestroy {
  
  user:User = null;
  hasUser:boolean = false;
   // To know if user that consult the page belongs to the him/her
  isUser:boolean = false;
  isBooster:boolean = false;
  currentFragment:string;
  mySubscription: any;

  // variable pour la barre de navigation (Formation, Catégorie, Formateur)
  activeTab = UserNav.HOME;

  constructor(private activatedRoute: ActivatedRoute,
              private authService:    AuthService,
              private userService:    UserService,
              private itemService:    ItemService,
              private router:         Router,
              private modalService:   NgbModal) { 

    // // Code pour rafraichir la page sans ke l'url change
    // this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // };

    // this.mySubscription = this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     // Trick the Router into believing it's last link wasn't previously loaded
    //     this.router.navigated = false;
    //   }
    // });
  }

  ngOnInit() {  
    this.user = new User(null, 
                         null, 
                         null,
                         null,
                         null,
                         null,
                         null,
                         null,
                         null,
                         null,
                         null,
                         null,
                         null,
                         null,
                         null,
                         null,
                         null,
                         null);

    const id = this.activatedRoute.snapshot.params['id'];
    this.getCurrentFragment();

    // if(this.authService.isAuth) {

    //   console.log("Auth user", this.authService.authUser);

    //   this.user = this.authService.authUser;
    //   this.user ? this.hasUser = true :  this.hasUser = false;
    //   this.userIsAuth();
    // } else {
      this.userService.getSingleUserFromDBWithId(id).then(
        (user:User) => {
          if(user!==null && user!==undefined) {

            this.user = user;
            this.user.id = id;

            console.warn(user);

            this.itemService.getiItemsByIUser(user.getIUser()).then(
              (val:IUser) => {
                if(val) {
                  // console.warn(val.iCourses);
                  // console.warn(this.getItemsByPublishedStatus(val.iCourses, true));
                  // console.warn(this.getItemsByPublishedStatus(val.iCourses, false));

                  this.user.courses = val.iCourses;
                  this.user.events = val.iEvents;
                  this.hasUser = true;
                }
            
                this.userIsAuth();
              }
            );
          }
          else {
              this.hasUser = false;
          }
        }).catch(
        () => {
          this.hasUser = false;
        }
      );
    //}
  }

  /**
   * Status is if the courses is published (verified or not)
   */
  getItemsByPublishedStatus(items: IItem[], isPublished:  boolean) {
    return items.filter(
      (item) => {
          return item.published === isPublished;
      }
    );
  }

  getCurrentFragment() {
    this.activatedRoute.fragment.subscribe(fragment => {
      this.currentFragment = fragment //store somewhere

    });
  }

  displayPanel(activeTab){
    this.activeTab = activeTab;
  }

  getPanelName() {
    return UserNav;
  }

  checkHome() {
    return this.currentFragment === 'home' || this.router.url === RouteUrl.USER+'/'+this.user.id;
  }

  onNewCourse() {
    this.router.navigate([RouteUrl.NEW_ITEM]);
  }

  onNewEvent() {
    this.router.navigate([RouteUrl.NEW_ITEM]);
  }

  openHeadUserModal(){

    const modalRef = this.modalService.open(EditHeadUserComponent, { scrollable: true });
    modalRef.componentInstance.user = this.user;

    modalRef.result.then((result:IHeadUser) => {
      if (result) {

        this.user.ppLink = result.ppLink;
        this.user.firstname = result.firstname;
        this.user.lastname = result.lastname;
        this.user.bio = result.bio;
        this.user.mail = result.mail;
        this.user.tel = result.tel;
        this.user.title = result.title;
        
        if(!this.user.ppLink) this.user.ppLink = null;
        if(!this.user.firstname) this.user.firstname = null;
        if(!this.user.lastname) this.user.lastname = null;
        if(!this.user.title) this.user.title = null;
        if(!this.user.bio) this.user.bio = null;
        if(!this.user.mail) this.user.mail = null;
        if(!this.user.tel) this.user.tel = null;
        

        this.userService.updateInfoUser(this.user);

      }
    }).catch((error) => {
      console.error(error);
    });
  }

  userIsAuth(){
    if(this.authService.isAuth){

      if(this.user.id === this.authService.authUser.id) {

        this.isUser = true;
        if(this.user.isBooster)this.isBooster = true;
      } 
      else this.isUser = false;

    } else this.isUser = false;
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}
