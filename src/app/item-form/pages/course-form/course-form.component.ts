import { ICourse } from './../../../shared/item/course';
import { Course } from 'src/app/shared/item/course';
import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/shared/item/item.service';
import { ItemFormService } from '../../shared/services/item-form.service';
import { ImageService } from 'src/app/shared/image/image.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StepState } from '../../shared/state-step.enum';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/shared/user/user';
import { Database } from 'src/app/core/database/database.enum';
import * as firebase from 'firebase';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {

  course:Course;

  private stepFormSubscription: Subscription;

  constructor(private itemService:ItemService,
              private imageService:ImageService,
              private itemFormService:ItemFormService,
              private authService: AuthService,
              private router:Router,
              private datepipe: DatePipe){}


  ngOnInit() {

    console.log('ngOnInit ItemFormComponent');

    this.getValueStepForm();
  }

  private getValueStepForm(){
    this.stepFormSubscription = this.itemFormService
                                    .getValueStepForm()
                                    .subscribe(
                                      (step) => {
                                              this.sortStepForm(step);
                                              console.log('next', step);
                                      },
                                      (error) => { 
                                        console.log(error); 
                                      },
                                      () => {
                                        console.log('complete suscribe');
                                        
                                      });
  }

  private createNewCourse(){

    const title = this.itemFormService.getStepFormWithStep(StepState.TITLE).value;
    const category = this.itemFormService.getStepFormWithStep(StepState.CATEGORY).value;
    const price = this.itemFormService.getStepFormWithStep(StepState.PRICE).value;
    const authors: User[] = [this.authService.authUser];
    const creationDate = this.datepipe.transform(Date.now().toString(), 'dd/MM/yyyy');

    var newCourse = new Course(null,
                              title,
                              category,
                              null,
                              null,
                              price,
                              authors,
                              creationDate,
                              false,
                              null,
                              null,
                              null); 

    if (this.itemFormService.getStepFormWithStep(StepState.MEDIA).value) {

      this.imageService.uploadFile(this.imageService.imageToUpload).then(
        (url:string) => {

          if(url && url !==''){
            // faire condition pour identification Image
            console.log('Image Link :', url);
            newCourse.imageLink = url;

            // À modifier dans le futur, pour l'instant la video == null
            newCourse.videoLink = null;

            this.sendCourseToDB(newCourse);  
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else {

      this.sendCourseToDB(newCourse);  
    }       
  }

  private sendCourseToDB(newCourse:Course)
  {
    return this.itemService.createNewCourse(newCourse).then(
      (val) => {
        if(val && val instanceof(Course)){

          this.itemService.saveCourseInAuthorsDB(val,this.authService.authUser.id);
        }
        this.itemFormService.getStepFormWithStep(StepState.COMPLETE).value = this.itemService.lastItemSaved;
        this.itemFormService.getStepFormWithStep(StepState.COMPLETE).status = true;
        return true;
        
    }).catch(
      (error) => {
        console.log(error);
        return false;
      }); 
  }

  sortStepForm(stepState:StepState){
    switch(stepState)
    {
      case StepState.TITLE : 
      {
        this.goToCategoryForm();
        break;
      }

      case StepState.CATEGORY : 
      {
        this.goToPriceForm();
        break;
      }

      case StepState.PRICE : 
      {
        this.goToMediaForm();
        break;
      }

      case StepState.MEDIA : 
      {
        this.goToCompleteForm();
        break;
      }

      case StepState.COMPLETE :
      {
        this.createNewCourse();
        break;
      }

      case StepState.COMPLETED :
        {
          this.router.navigate([RouteUrl.COURSE, this.itemService.lastItemSaved.id]);
          break;
        }

      case StepState.BACK :
      {
        this.goBack()
        break;
      }

      case StepState.STARTING :
        {
          this.goToTitleForm()
          break;
        }

      default : {

        break;
      }
    }
  }

  goToTitleForm(){

    this.router.navigate([RouteUrl.NEW_COURSE + RouteUrl.NEW_TITLE]);
  }

  goToCategoryForm() {

    if(this.itemFormService.getStepFormWithStep(StepState.TITLE).status){
      this.router.navigate([RouteUrl.NEW_COURSE + RouteUrl.NEW_CATEGORY]);
    }
  }

  goToPriceForm() {

    if(this.itemFormService.getStepFormWithStep(StepState.TITLE).status && this.itemFormService.getStepFormWithStep(StepState.CATEGORY).status){
      this.router.navigate([RouteUrl.NEW_COURSE + RouteUrl.NEW_PRICE]);
    }
  }

  goToMediaForm() {
    
    if(this.itemFormService.getStepFormWithStep(StepState.TITLE).status && this.itemFormService.getStepFormWithStep(StepState.CATEGORY).status
                                                                        && this.itemFormService.getStepFormWithStep(StepState.PRICE).status){
      this.router.navigate([RouteUrl.NEW_COURSE + RouteUrl.NEW_MEDIA]);
    }
  }

  goToCompleteForm() {

    if(this.itemFormService.getStepFormWithStep(StepState.TITLE).status && this.itemFormService.getStepFormWithStep(StepState.CATEGORY).status
                                                                        && this.itemFormService.getStepFormWithStep(StepState.PRICE).status
                                                                        && this.itemFormService.getStepFormWithStep(StepState.MEDIA).status){
      this.router.navigate([RouteUrl.NEW_COURSE + RouteUrl.NEW_COMPLETED]);
    }
  }

  goBack(){
    switch(this.router.url)
    {
      case RouteUrl.NEW_COURSE+RouteUrl.NEW_CATEGORY : 
      {
        this.goToTitleForm();
        break;
      }

      case RouteUrl.NEW_COURSE+RouteUrl.NEW_PRICE : 
      {
        this.goToCategoryForm();
        break;
      }

      case RouteUrl.NEW_COURSE+RouteUrl.NEW_MEDIA : 
      {
        this.goToPriceForm();
        break;
      }
      case RouteUrl.NEW_COURSE+RouteUrl.NEW_COMPLETED : 
      {
        this.goToMediaForm();
        break;
      }

      default : {
        
        break;
      }
    }
  }

  ngOnDestroy(){

    if (this.stepFormSubscription != null) {
      this.stepFormSubscription.unsubscribe();
    }
  }
}
