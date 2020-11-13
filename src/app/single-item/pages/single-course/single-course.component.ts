import { EventItem } from 'src/app/shared/model/item/event-item';
import { SearchService } from './../../../shared/service/search/search.service';
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
import { EditHeadItemComponent } from '../../components/edit-head-item/edit-head-item.component';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Course } from 'src/app/shared/model/item/course';
import { ItemService } from 'src/app/shared/service/item/item.service';
import { RouterService } from 'src/app/shared/service/router/router.service';

@Component({
  selector: 'app-single-course',
  templateUrl: './single-course.component.html',
  styleUrls: ['./single-course.component.css']
})
export class SingleCourseComponent extends SingleItemComponent implements OnInit, AfterViewInit {

  course: Course = new Course(null,
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

  constructor(private route:ActivatedRoute,
                      itemService:ItemService,
                      authService:AuthService,
                      router:Router,
                      routerService:RouterService,
                      searchService:SearchService,
                      modalService: NgbModal,
                      datePipe:DatePipe) {

    super(itemService,
          authService,
          router,
          searchService,
          routerService,
          modalService,
          datePipe);


      super.item = this.course;
   }

  ngOnInit() {
    
    // getting course id from url
    this.route.params.subscribe(params => {
      // PARAMS CHANGED .. TO SOMETHING REALLY COOL HERE ..
 
      if(this.course && this.course.id && params['id'] !== this.course.id) window.location.reload();
 
    }); 

    const id = this.route.snapshot.params['id'];

    this.itemService.getSingleItemFromDBById(id,
      (course:Course) => {

        if(course) {
          course.iAuthors[0].iCourses.splice(course.iAuthors[0].iCourses.indexOf(id),1);
          super.item = this.course = course;
          this.hasItem = true;

          this.isItemAuthor();
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

  openCourseContentModal() {

    if(this.authService.isAuth && this.isAuthor) {

      const modalRef = this.modalService.open(EditCourseContentModalComponent,  { size: 'xl', centered: true });
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

    if(this.hasUserRateAlready()) return;

    if(this.isAuthor) return;

    if(this.authService.isAuth) {

      const modalRef = this.modalService.open(CreateRatingComponent);
      modalRef.componentInstance.course = this.course.getICourse();
      modalRef.componentInstance.user = this.authService.authUser.getIUser();

      modalRef.result.then((result:Rating) => {
        if (result) {
          if(!this.course.ratings || !this.course.ratings.length) {
            this.course.ratings=[];
            this.course.ratings.push(result);
          }
          else {
            let ind = this.course.ratings.findIndex((res) => res.id === result.id);
            ind > -1 ? this.course.ratings.push(result) : this.course.ratings[ind] = result;
          }
          this.refreshRatings(true);
        }
      }).catch((error) => {
        console.log(error);
      });

    } else this.router.navigate([RouteUrl.LOGIN]);
  }

  refreshRatings(event) {
    if(event) this.course.calculateGlobalRating();
  }

/**
*------------------------------- skills To Acquire
*/  

  openSkillsItemModal(){

    if(this.authService.isAuth && this.isAuthor) {

      const modalRef = this.modalService.open(EditSkillsItemComponent);
      modalRef.componentInstance.course = this.course;

      modalRef.result.then((result:string[]) => {
        if (result) {

          this.course.skillsToAcquire = result;
          this.displayItemUpdatedAlert();

        }
      }).catch((error) => {
        console.log(error);
      });
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

/**
*------------------------------- End skills To Acquire
*/ 

  hasUserRateAlready() {

    /**
     *  If the user is connected  
     *  If the course has ratings
     *  If the user connected has already rate the course return true
     */

    function hasRating(userId , rating, indice, array) {
      if(rating.user) return (rating.user.id === userId);
    }

    if(this.authService.isAuth && this.course && this.course.ratings){
      return  this.course.ratings.some(hasRating.bind(null, this.authService.authUser.id));
    }

    return false;
  }
}
