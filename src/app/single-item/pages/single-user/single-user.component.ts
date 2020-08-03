import { AuthService } from 'src/app/core/auth/auth.service';
import { IHeadUser } from './../../components/edit-head-user/edit-head-user.component';
import { UserService } from './../../../shared/user/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/shared/user/user';
import { EditHeadUserComponent } from '../../components/edit-head-user/edit-head-user.component';
import { RouteUrl } from 'src/app/core/router/route-url.enum';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css']
})
export class SingleUserComponent implements OnInit, OnDestroy {

  user:User;
  hasUser:boolean = true;
  currentFragment:string;
  mySubscription: any;

  constructor(private activatedRoute:ActivatedRoute,
              private authService:AuthService,
              private userService:UserService,
              private router:Router,
              private modalService: NgbModal) { 

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
  }

  ngOnInit() {  
    this.user = new User(null,null,null,null,null,null,null,null,null,null,null);

    const id = this.activatedRoute.snapshot.params['id'];
    this.getCurrentFragment();

    this.userService.getSingleUserFromDBWithId(id).then(
      (user:User) => {
        if(user!==null && user!==undefined) {
          this.hasUser = true;
          this.user = User.userFromJson(user);
          this.user.id = id;
          console.log(this.user);
          console.log(this.user.courses);
          console.log(this.user.events);
        }
        else {
            this.hasUser = false;
        }
      }).catch(
      () => {
        this.hasUser = false;
      }
    );
  }

  getCurrentFragment() {
    this.activatedRoute.fragment.subscribe(fragment => {
      this.currentFragment = fragment //store somewhere

    });
  }

  checkHome() {
    return this.currentFragment === 'home' || this.router.url === RouteUrl.USER+'/'+this.user.id;
  }


  openHeadUserModal(){

    console.log('getCurrentFragment', this.currentFragment);

    const modalRef = this.modalService.open(EditHeadUserComponent, { scrollable: true });
    modalRef.componentInstance.user = this.user;

    modalRef.result.then((result:IHeadUser) => {
      if (result) {
        console.log(result);

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
      console.log(error);
    });
  }

  userIsAuth(){
    if(this.authService.isAuth){
      if(this.user.id === this.authService.authUser.id){
        return true;
      }
      else return false;
    }
    return false;
  }

  displayUserHome() {
    this.router.navigate([RouteUrl.USER, this.user.id], {fragment: 'home'}); 
  }

  displayUserCourses() {

    this.router.navigate([RouteUrl.USER, this.user.id], {fragment: 'courses'}); 
  }

  displayUserEvents() {

    this.router.navigate([RouteUrl.USER, this.user.id], {fragment: 'events'}); 
  }

  displayUserNetwork() {

    this.router.navigate([RouteUrl.USER, this.user.id], {fragment: 'network'}); 
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}
