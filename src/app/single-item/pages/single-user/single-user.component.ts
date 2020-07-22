import { IHeadUser } from './../../components/edit-head-user/edit-head-user.component';
import { UserService } from './../../../shared/user/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/shared/user/user';
import { Course } from 'src/app/shared/item/course';
import { EditHeadUserComponent } from '../../components/edit-head-user/edit-head-user.component';
import { RouteUrl } from 'src/app/core/router/route-url.enum';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css']
})
export class SingleUserComponent implements OnInit {

  user:User;
  hasUser:boolean = true;
  currentFragment:string;

  constructor(private activatedRoute:ActivatedRoute,
              private userService:UserService,
              private router:Router,
              private modalService: NgbModal) { }

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
        
        if(this.user.ppLink === undefined)
        {
          this.user.ppLink = null;
        }
        if(this.user.firstname === undefined)
        {
          this.user.firstname = null;
        }
        if(this.user.lastname === undefined)
        {
          this.user.lastname = null;
        }
        if(this.user.title === undefined)
        {
          this.user.title = null;
        }
        if(this.user.bio === undefined)
        {
          this.user.bio = null;
        }
        if(this.user.mail === undefined)
        {
          this.user.mail = null;
        }
        if(this.user.tel === undefined)
        {
          this.user.tel = null;
        }

        this.userService.updateInfoUser(this.user);

      }
    }).catch((error) => {
      console.log(error);
    });
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

}
