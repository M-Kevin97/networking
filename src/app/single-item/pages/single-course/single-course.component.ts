import { Module } from './../../../shared/model/item/module';
import { EditCourseContentModalComponent } from './../../components/edit-course-content-modal/edit-course-content-modal.component';
import { DatePipe } from '@angular/common';
import { Rating } from 'src/app/shared/model/rating/rating';
import { SingleItemComponent } from './../../single-item.component';
import { CreateRatingComponent } from './../../components/createRating/createRating.component';
import { EditSkillsItemComponent } from './../../components/edit-skills-item/edit-skills-item.component';
import { EditDescriptionItemComponent } from './../../components/edit-description-item/edit-description-item.component';
import { AuthService } from './../../../core/auth/auth.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditHeadItemComponent, IHeadItem } from '../../components/edit-head-item/edit-head-item.component';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Course } from 'src/app/shared/model/item/course';
import { ItemService } from 'src/app/shared/service/item/item.service';

@Component({
  selector: 'app-single-course',
  templateUrl: './single-course.component.html',
  styleUrls: ['./single-course.component.css']
})
export class SingleCourseComponent extends SingleItemComponent implements OnInit, AfterViewInit {

  course: Course = new Course(null,null,null,null,null,null,null,null,null,null,null,null,null,null, null);

  constructor(private route:ActivatedRoute,
               itemService:ItemService,
               authService:AuthService,
               router:Router,
               modalService: NgbModal,
               datePipe:DatePipe) {

      super(itemService,
            authService,
            router,
            modalService,
            datePipe);


      super.item = this.course;
   }

  ngOnInit() {
    
    // getting course id from url 
    const id = this.route.snapshot.params['id'];

    this.itemService.getSingleItemFromDBById(id,
      (course:Course) => {
        console.warn('ngOnInit COURSE', course);

        if(course) {
          console.warn(course);
          this.hasItem = true;
          super.item = this.course = course;
          super.saveView();
        }
        else {
          this.hasItem = false;
        }
      }
    ).catch(
      (error) => {
        console.error(error);
        this.hasItem = false;
      }
    );
  }

  openHeadItemModal(){

    if(this.authService.isAuth && this.isAuthor) {

      const modalRef = this.modalService.open(EditHeadItemComponent, { scrollable: true });
      modalRef.componentInstance.item = this.course;

      modalRef.result.then((result:IHeadItem) => {
        if (result) {

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

          this.itemService.updateItemPrimaryInfoInDB(this.course);

        }
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  openDescriptionItemModal(){

    if(this.authService.isAuth && this.isAuthor) {

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

          this.itemService.updateItemDescriptionInDB(this.course);

        }
      }).catch((error) => {
        console.log(error);
      });
    }
  }


  openSkillsItemModal(){

    if(this.authService.isAuth && this.isAuthor) {

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
  }

  openCourseContentModal() {

    if(this.authService.isAuth && this.isAuthor) {

      const modalRef = this.modalService.open(EditCourseContentModalComponent,  { size: 'lg' });
      modalRef.componentInstance.courseId = this.course.id;
      modalRef.componentInstance.courseContent = this.course.modules;

      modalRef.result.then((result:Module[]) => {

        if (result) {

        if(this.course.modules && this.course.modules.length) this.course.modules.splice(0, this.course.modules.length);
        this.course.modules = result;
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  openRatingCourseModal() {

    if(this.authService.isAuth && this.isAuthor && (!this.hasUserRateAlready())) {

      const modalRef = this.modalService.open(CreateRatingComponent);
      modalRef.componentInstance.course = this.course.getICourse();
      modalRef.componentInstance.user = this.authService.authUser.getIUser();
  
      modalRef.result.then((result:Rating) => {
        if (result) {
          console.log(result);
          if(!this.course.ratings) this.course.ratings=[];
          this.course.ratings.push(result);
  
        }
      }).catch((error) => {
        console.log(error);
      });

    } else this.router.navigate([RouteUrl.LOGIN]);
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

    if(this.getMainAuthor().data) this.router.navigate([RouteUrl.USER, this.getMainAuthor().id]);
  }

  hasUserRateAlready() {

    /**
     *  If the user is connected  
     *  If the course has ratings
     *  If the user connected has already rate the course return true
     */

    function hasRating(rating, indice, array) {
      return (rating.user.id === this.authService.authUser.id);
    }

    if(this.authService.isAuth && this.course && this.course.ratings && this.authService.authUser){
      return  this.course.ratings.some(hasRating);
    }

    return false;
  }
}
