import { EventItem } from 'src/app/shared/item/event-item';
import { EditSkillsItemComponent } from './../../components/edit-skills-item/edit-skills-item.component';
import { EditDescriptionItemComponent } from './../../components/edit-description-item/edit-description-item.component';
import { AuthService } from './../../../core/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from 'src/app/shared/item/item.service';
import { Course } from 'src/app/shared/item/course';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditHeadItemComponent, IHeadItem } from '../../components/edit-head-item/edit-head-item.component';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Database } from 'src/app/core/database/database.enum';
import { Item } from 'src/app/shared/item/item';

@Component({
  selector: 'app-single-course',
  templateUrl: './single-course.component.html',
  styleUrls: ['./single-course.component.css']
})
export class SingleCourseComponent implements OnInit {

  course:Course;
  mainAuthorItems:Item[];
  hasCourse:boolean = true;
  closeResult: string;
  moreSkillsShowed:boolean = false;

  constructor(private route:ActivatedRoute,
              private itemService:ItemService,
              private authService:AuthService,
              private router:Router,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.course = new Course(null,null,null,null,null,null,null,null,null,null,null,null,null);

    const id = this.route.snapshot.params['id'];
    this.itemService.getSingleCourseFromDBWithId(id).then(
      (course:Course) => {
        if(course!==null && course!==undefined) {
          this.hasCourse = true;
          this.course = Course.courseFromJson(course);
          this.course.id = id;
          console.log(this.course);
          console.log(course['authors']);
          console.log(this.course.authors);
        }
        else {
          this.hasCourse = false;
        }
      }
    ).then(
      () => {
        this.itemService.getItemsOfUserByUserId(this.getMainAuthor().id).then(
          (items) => {
            if(items!==null && items!==undefined) {
              console.log(items);
              var mainAuthorCourses:Item[] = Course.coursesFromJson(items['courses']);
              console.log(mainAuthorCourses);

              var mainAuthorEvents:Item[] = EventItem.eventsFromJson(items['events']);
              console.log(mainAuthorEvents);

              this.mainAuthorItems = mainAuthorCourses.concat(mainAuthorEvents);
              this.mainAuthorItems.sort((a, b) => a.creationDate < b.creationDate ? -1 : a.creationDate > b.creationDate ? 1 : 0)
            }
          }
        )
      }
    ).catch(
      () => {
        this.hasCourse = false;
      }
    );
  }

  isUserMyAuthor(){
    if(this.authService.isAuth){

      this.course.authors.forEach((author)=>{

        if(author.id === this.authService.authUser.id){
            return true;
        }
      });
    }
    return false;
  }

  openHeadItemModal(){

    const modalRef = this.modalService.open(EditHeadItemComponent, { scrollable: true });
    modalRef.componentInstance.item = this.course;

    modalRef.result.then((result:IHeadItem) => {
      if (result) {
        console.log(result);

        this.course.title = result.title;
        this.course.catchPhrase = result.catchPhrase;
        this.course.price = result.price;
        this.course.imageLink = result.imageLink;

        if(this.course.catchPhrase === undefined)
        {
          this.course.catchPhrase = null;
        }
        if(this.course.title === undefined)
        {
          this.course.title = null;
        }
        if(this.course.price === undefined)
        {
          this.course.price = null;
        }
        if(this.course.imageLink === undefined)
        {
          this.course.imageLink = null;
        }
        if(this.course.videoLink === undefined)
        {
          this.course.videoLink = null;
        }

        this.itemService.updateCoursePrimaryInfoInDB(this.course);

      }
    }).catch((error) => {
      console.log(error);
    });
  }

  openDescriptionItemModal(){

    const modalRef = this.modalService.open(EditDescriptionItemComponent);
    modalRef.componentInstance.description = this.course.description;

    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
        console.log(this.course);

        this.course.description = result;

        if(this.course.description === undefined)
        {
          this.course.description = null;
        }

        this.itemService.updateCourseDescriptionInDB(this.course);

      }
    }).catch((error) => {
      console.log(error);
    });
  }

  openSkillsItemModal(){

    const modalRef = this.modalService.open(EditSkillsItemComponent);
    modalRef.componentInstance.skills = this.course.skillsToAcquire;

    modalRef.result.then((result:string[]) => {
      if (result) {
        console.log(result);
        console.log(this.course);

        this.course.skillsToAcquire = result;

        if(this.course.skillsToAcquire === undefined)
        {
          this.course.skillsToAcquire = [];
        }

        this.itemService.updateSkillsToAcquireInDB(this.course);

      }
    }).catch((error) => {
      console.log(error);
    });
  }

  getMainAuthor() {
    if(this.course.authors)
    {
      return this.course.authors[0];
    }
  }

  getSkillsBeginning() {
    if(this.course.skillsToAcquire) {
      return this.course.skillsToAcquire.slice(0,this.getSlice());
    }
  }

  getSlice() {
    if(this.course.skillsToAcquire.length <= 4) 
    {
      return this.course.skillsToAcquire.length;
    }
    else {
      return 4;
    }
  }

  getSkillsEnding() {
    if(this.course.skillsToAcquire) {
      return this.course.skillsToAcquire.slice(this.getSlice());
    }
  }

  seeMoreSkills() {

    var btnList = document.getElementById("btnSeeMoreSkills");
  
    if (this.moreSkillsShowed === true) {
      this.moreSkillsShowed = false;
      btnList.innerHTML = "+ Voir plus";
    } else {
      this.moreSkillsShowed = true;
      btnList.innerHTML = "- Voir moins";
    }
  }

  checkSkillsLength() {

    if(this.course.skillsToAcquire && this.course.skillsToAcquire.length > 4)
    {
      return true;
    }
    else {
      return false;
    }
  }

  goToUserPage(){
    console.log('CardAuthorComponent', this.getMainAuthor().id);
    this.router.navigate([RouteUrl.USER, this.getMainAuthor().id]);
  }

  onBack(){
    this.router.navigate(['/items']);
  }
}
