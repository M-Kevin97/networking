import { Course } from 'src/app/shared/item/course';
import { Database } from 'src/app/core/database/database.enum';
import { EventItem } from 'src/app/shared/item/event-item';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ItemService } from 'src/app/shared/item/item.service';
import { ImageService } from 'src/app/shared/image/image.service';
import { ItemFormService } from '../../shared/services/item-form.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Router } from '@angular/router';
import { StepState } from '../../shared/state-step.enum';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { User } from 'src/app/shared/user/user';
import { DatePipe } from '@angular/common';
import * as firebase from 'firebase';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit, OnDestroy {
  
  event:EventItem;

  private stepFormSubscription: Subscription;

  constructor(private itemService:ItemService,
              private imageService:ImageService,
              private itemFormService:ItemFormService,
              private authService: AuthService,
              private router:Router,
              private datepipe: DatePipe) {}


  ngOnInit() {

    console.log('ngOnInit ItemFormComponent');

    this.getValueStepForm();
  }

  getValueStepForm(){
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

  createNewEvent() {

    const title = this.itemFormService.getStepFormWithStep(StepState.TITLE).value;
    const category = this.itemFormService.getStepFormWithStep(StepState.CATEGORY).value;
    const price = this.itemFormService.getStepFormWithStep(StepState.PRICE).value;
    const authors: User[] = [this.authService.authUser]; 
    const creationDate = this.datepipe.transform(Date.now().toString(), 'dd/MM/yyyy');
    const location = this.itemFormService.getStepFormWithStep(StepState.LOCATION).value;
    const imageLink = this.itemFormService.getStepFormWithStep(StepState.MEDIA).value;
    const dates = this.itemFormService.getStepFormWithStep(StepState.DATES).value;

    var newEvent = new EventItem(null,
                                  title,
                                  category,
                                  null,
                                  null,
                                  price,
                                  location,
                                  dates,
                                  authors,
                                  creationDate,
                                  false,
                                  imageLink,
                                  null); 

      if (this.itemFormService.getStepFormWithStep(StepState.MEDIA).value 
          && this.itemFormService.getStepFormWithStep(StepState.MEDIA).value !== Database.DEFAULT_IMG_EVENT) {
                          
      const fileRef = firebase.storage().ref('images').child('items');

      this.imageService.uploadFile(this.imageService.imageToUpload, fileRef).then(
        (url:string) => {

          if(url && url !==''){
            // faire condition pour identification Image
            console.log('Image Link :', url);
            newEvent.imageLink = url;

            this.sendEventToDB(newEvent); 
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else {
      newEvent.videoLink = null;
      this.sendEventToDB(newEvent);  
    }       
  }

  private sendEventToDB(newEvent:EventItem)
  {
    return this.itemService.createNewItemToDB(newEvent).then()
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
        this.goToDatesForm();
        break;
      }

      case StepState.DATES : 
      {
        this.goToLocationForm();
        break;
      }

      case StepState.LOCATION : 
      {
        this.goToCompleteForm();
        break;
      }

      case StepState.COMPLETE :
      {
        this.createNewEvent();
        break;
      }

      case StepState.COMPLETED :
        {
          this.router.navigate([RouteUrl.EVENT, this.itemService.lastItemCreated.id]);
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

    this.router.navigate([RouteUrl.NEW_EVENT + RouteUrl.NEW_TITLE]);
  }

  goToCategoryForm() {

    if(this.itemFormService.getStepFormWithStep(StepState.TITLE).status){
      this.router.navigate([RouteUrl.NEW_EVENT + RouteUrl.NEW_CATEGORY]);
    }
  }

  goToPriceForm() {

    if(this.itemFormService.getStepFormWithStep(StepState.TITLE).status && this.itemFormService.getStepFormWithStep(StepState.CATEGORY).status){
      this.router.navigate([RouteUrl.NEW_EVENT + RouteUrl.NEW_PRICE]);
    }
  }

  goToMediaForm() {
    
    if(this.itemFormService.getStepFormWithStep(StepState.TITLE).status && this.itemFormService.getStepFormWithStep(StepState.CATEGORY).status
                                                                        && this.itemFormService.getStepFormWithStep(StepState.PRICE).status){
      this.router.navigate([RouteUrl.NEW_EVENT + RouteUrl.NEW_MEDIA]);
    }
  }

  goToDatesForm() {
    
    if(this.itemFormService.getStepFormWithStep(StepState.TITLE).status && this.itemFormService.getStepFormWithStep(StepState.CATEGORY).status
                                                                        && this.itemFormService.getStepFormWithStep(StepState.PRICE).status
                                                                        && this.itemFormService.getStepFormWithStep(StepState.MEDIA).status){
      this.router.navigate([RouteUrl.NEW_EVENT + RouteUrl.NEW_DATES]);
    }
  }

  goToLocationForm() {
    
    if(this.itemFormService.getStepFormWithStep(StepState.TITLE).status && this.itemFormService.getStepFormWithStep(StepState.CATEGORY).status
                                                                        && this.itemFormService.getStepFormWithStep(StepState.PRICE).status
                                                                        && this.itemFormService.getStepFormWithStep(StepState.MEDIA).status
                                                                        && this.itemFormService.getStepFormWithStep(StepState.DATES).status){
      this.router.navigate([RouteUrl.NEW_EVENT + RouteUrl.NEW_LOCATION]);
    }
  }

  goToCompleteForm() {

    if(this.itemFormService.getStepFormWithStep(StepState.TITLE).status && this.itemFormService.getStepFormWithStep(StepState.CATEGORY).status
                                                                        && this.itemFormService.getStepFormWithStep(StepState.PRICE).status
                                                                        && this.itemFormService.getStepFormWithStep(StepState.MEDIA).status
                                                                        && this.itemFormService.getStepFormWithStep(StepState.DATES).status
                                                                        && this.itemFormService.getStepFormWithStep(StepState.LOCATION).status){
      this.router.navigate([RouteUrl.NEW_EVENT + RouteUrl.NEW_COMPLETED]);
    }
  }

  goBack(){
    switch(this.router.url)
    {
      case RouteUrl.NEW_EVENT+RouteUrl.NEW_CATEGORY : 
      {
        this.goToTitleForm();
        break;
      }

      case RouteUrl.NEW_EVENT+RouteUrl.NEW_PRICE : 
      {
        this.goToCategoryForm();
        break;
      }

      case RouteUrl.NEW_EVENT+RouteUrl.NEW_MEDIA : 
      {
        this.goToPriceForm();
        break;
      }

      case RouteUrl.NEW_EVENT+RouteUrl.NEW_DATES : 
      {
        this.goToMediaForm();
        break;
      }

      case RouteUrl.NEW_EVENT+RouteUrl.NEW_LOCATION : 
      {
        this.goToDatesForm();
        break;
      }

      case RouteUrl.NEW_EVENT+RouteUrl.NEW_COMPLETED : 
      {
        this.goToLocationForm();
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
    }
  }
}
