import { UserService } from 'src/app/shared/service/user/user.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StepState } from '../../shared/state-step.enum';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { DatePipe } from '@angular/common';
import { IUser, User } from 'src/app/shared/model/user/user';
import * as firebase from 'firebase';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Database } from 'src/app/core/database/database.enum';
import { ImageService } from 'src/app/shared/service/image/image.service';
import { ItemService } from 'src/app/shared/service/item/item.service';
import { ItemFormService } from '../../shared/services/item-form.service';
import { Course } from 'src/app/shared/model/item/course';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit, OnDestroy{

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
    //const category = this.itemFormService.getStepFormWithStep(StepState.CATEGORIES).value;
    const price = this.itemFormService.getStepFormWithStep(StepState.PRICE).value;
    const authors: IUser[] = [this.authService.authUser.getIUser()];
    const creationDate = this.datepipe.transform(Date.now().toString(), 'dd/MM/yyyy');
    const imageLink = this.itemFormService.getStepFormWithStep(StepState.MEDIA).value;
    const tags = this.itemFormService.getStepFormWithStep(StepState.CATEGORIES).value;

    console.log('tags', tags);

    var newCourse = new Course(null,
                              Database.COURSE.substr(1),
                              title,
                              null,
                              tags,
                              null,
                              null,
                              price,
                              authors,
                              creationDate,
                              false,
                              [],
                              null,
                              null,
                              null,
                              null,
                              null,
                              null,
                              null); 

    // if (this.itemFormService.getStepFormWithStep(StepState.MEDIA).value 
    //     && this.itemFormService.getStepFormWithStep(StepState.MEDIA).value !== Database.DEFAULT_IMG_COURSE) {
    if(this.imageService.imageToUpload) {

      const fileRef = firebase.storage().ref('images').child('items');

      this.imageService.uploadFile(this.imageService.imageToUpload, fileRef).then(
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
      // À modifier dans le futur, pour l'instant la video == null
      newCourse.videoLink = null;
      newCourse.imageLink = Database.DEFAULT_IMG_COURSE;
      this.sendCourseToDB(newCourse);  
    }       
  }

  private sendCourseToDB(newCourse:Course)
  {
    return this.itemService.addNewItemToDB(newCourse).then(
      (val) => {
        if(val && val instanceof(Course)){

          UserService.addItemInAuthorsDB(val,this.authService.authUser.id);
        }
        this.itemFormService.getStepFormWithStep(StepState.COMPLETE).value = this.itemService.lastItemCreated;
        this.itemFormService.getStepFormWithStep(StepState.COMPLETE).status = true;
        return true;
        
    }).catch(
      (error) => {
        console.log(error);
        return false;
      }
    ); 
  }

  // to know in which step the user is and go to the next
  sortStepForm(stepState:StepState){
    switch(stepState)
    {
      case StepState.TITLE : 
      {
        this.goToCategoriesForm();
        break;
      }

      case StepState.CATEGORIES : 
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
          this.router.navigate([RouteUrl.COURSE, this.itemService.lastItemCreated.id]);
          break;
        }

      case StepState.BACK :
      {
        this.goBack()
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

  goToCategoriesForm() {

    if(this.itemFormService.getStepFormWithStep(StepState.TITLE).status){
      this.router.navigate([RouteUrl.NEW_COURSE + RouteUrl.NEW_CATEGORY]);
    }
  }

  goToPriceForm() {

    if(this.itemFormService.getStepFormWithStep(StepState.TITLE).status && this.itemFormService.getStepFormWithStep(StepState.CATEGORIES).status){
      this.router.navigate([RouteUrl.NEW_COURSE + RouteUrl.NEW_PRICE]);
    }
  }

  goToMediaForm() {
    
    if(this.itemFormService.getStepFormWithStep(StepState.TITLE).status && this.itemFormService.getStepFormWithStep(StepState.CATEGORIES).status
                                                                        && this.itemFormService.getStepFormWithStep(StepState.PRICE).status){
      this.router.navigate([RouteUrl.NEW_COURSE + RouteUrl.NEW_MEDIA]);
    }
  }

  goToCompleteForm() {

    if(this.itemFormService.getStepFormWithStep(StepState.TITLE).status && this.itemFormService.getStepFormWithStep(StepState.CATEGORIES).status
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
        this.goToCategoriesForm();
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

    if (this.stepFormSubscription) {
      this.stepFormSubscription.unsubscribe();
      console.log('this.stepFormSubscription.unsubscribe();');
    }
  }
}
