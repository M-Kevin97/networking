import { EventItem } from 'src/app/shared/model/item/event-item';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { ItemFormService } from './shared/services/item-form.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StepState } from './shared/state-step.enum';
import { Course } from '../shared/model/item/course';
import * as firebase from 'firebase';
import { Database } from '../core/database/database.enum';
import { IUser } from '../shared/model/user/user';
import { UserService } from '../shared/service/user/user.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../core/auth/auth.service';
import { ImageService } from '../shared/service/media/image/image.service';
import { ItemService } from '../shared/service/item/item.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit, OnDestroy {

  private itemFormSubscription: Subscription;

  public get itemFormService(): ItemFormService {
    return this._itemFormService;
  }

  constructor(private itemService: ItemService,
              private imageService:ImageService,
              private _itemFormService: ItemFormService,
              private authService: AuthService,
              private router:Router,
              private datepipe: DatePipe){}

  ngOnInit() {

    this.getValueStepForm();
  }

  private getValueStepForm(){
    this.itemFormSubscription = this.itemFormService
                                    .getValueStepForm()
                                    .subscribe(
                                      (step: StepState) => {

                                        if(step === StepState.NEXT) this.nextForm();
                                        // if(step === StepState.STARTING) this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_TYPE]);
                                        if(step === StepState.STARTING) this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_TITLE]);
                                        if(step === StepState.BACK) this.goBack();
                                      },
                                      (error) => { 
                                        console.log(error); 
                                      },
                                      () => {
                                        console.log('complete suscribe');
                                      });
  }

  closeForm() {

    this.itemFormService.clearForm();
    this.itemService.lastItemCreated = null;
    this.router.navigate([RouteUrl.CREATE_ITEM]);
  }

  // to know in which step the user is and go to the next
  nextForm(){

    switch(this.router.url)
    {
      // case RouteUrl.NEW_ITEM+RouteUrl.NEW_TYPE : 
      // {
      //   this.goToTitleForm();
      //   break;
      // }

      case RouteUrl.NEW_ITEM+RouteUrl.NEW_TITLE : 
      {
        this.goToTagsForm();
        break;
      }

      case RouteUrl.NEW_ITEM+RouteUrl.NEW_TAGS : 
      {
        this.goToPriceForm();
        break;
      }

      case RouteUrl.NEW_ITEM+RouteUrl.NEW_PRICE : 
      {
        this.goToMediaForm();
        break;
      }

      case RouteUrl.NEW_ITEM+RouteUrl.NEW_MEDIA : 
      {
        if(this.itemFormService.isEvent) this.goToDatesForm();
        else if(this.itemFormService.isCourse) this.goToReviewForm();
        break;
      }

      case RouteUrl.NEW_ITEM+RouteUrl.NEW_DATES : 
      {
        if(this.itemFormService.isEvent) this.goToLocationForm();
       
        break;
      }

      case RouteUrl.NEW_ITEM+RouteUrl.NEW_LOCATION :
      {
        if(this.itemFormService.isEvent) this.goToReviewForm();
        break;
      }

      case RouteUrl.NEW_ITEM+RouteUrl.NEW_REVIEW :
      {
        this.createNewItem();
        break;
      }

      default : {

        break;
      }
    }
  }

  createNewItem() {
    
    alert('createNewItem');

    if(this.itemFormService.isTypeOk() && this.itemFormService.isCourse) this.createNewCourse();
    else if(this.itemFormService.isTypeOk() && this.itemFormService.isEvent) this.createNewEvent();
    else console.error('no item\'s type created');
  }

  // goToTypeForm(){

  //   this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_TYPE]);
  // }

  goToTitleForm(){

    this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_TITLE]);
  }

  goToTagsForm() {

    this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_TAGS]);
    
  }

  goToPriceForm() {

    this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_PRICE]);
    
  }

  goToMediaForm() {
    
    this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_MEDIA]);
    
  }

  goToDatesForm() {
    
      this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_DATES]);
    
  }

  goToLocationForm() {
    

    this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_LOCATION]);
    
  }

  goToReviewForm() {

    this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_REVIEW]);
  }


  /*
  * Go back to the previous form  
  */                                       
  goBack(){
    
    switch(this.router.url)
    {
      // case RouteUrl.NEW_ITEM+RouteUrl.NEW_TITLE : 
      // {
      //   this.goToTypeForm();
      //   break;
      // }

      case RouteUrl.NEW_ITEM+RouteUrl.NEW_TAGS : 
      {
        this.goToTitleForm();
        break;
      }

      case RouteUrl.NEW_ITEM+RouteUrl.NEW_PRICE : 
      {
        this.goToTagsForm();
        break;
      }

      case RouteUrl.NEW_ITEM+RouteUrl.NEW_MEDIA : 
      {
        this.goToPriceForm();
        break;
      }

      case RouteUrl.NEW_ITEM+RouteUrl.NEW_DATES : 
      {
        this.goToMediaForm();
        break;
      }

      case RouteUrl.NEW_ITEM+RouteUrl.NEW_LOCATION : 
      {
        if(this.itemFormService.isEvent) this.goToDatesForm();
        else if(this.itemFormService.isCourse) this.goToMediaForm();
        break;
      }

      case RouteUrl.NEW_ITEM+RouteUrl.NEW_REVIEW : 
      {
        if(this.itemFormService.isEvent) this.goToLocationForm();
        else if(this.itemFormService.isCourse) this.goToMediaForm();
        break;
      }

      default : {
        
        break;
      }
    }
  }

  // -------------------- Adding new course to DB --------------------
  private createNewCourse(){

    const type = this.itemFormService.item.type;
    const title = this.itemFormService.item.title;
    const tags = Array.from(this.itemFormService.item.tags);
    const price = this.itemFormService.item.price;
    const authors: IUser[] = [this.authService.authUser.getIUser()];
    const creationDate = this.datepipe.transform(Date.now().toString(), 'dd/MM/yyyy');
    const imageLink = this.itemFormService.item.imageLink;

    var newCourse = new Course(null,
                               type,
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
                               [],
                               [],
                               [],
                               null,
                               null,
                               null,
                               null,
                               null); 
    
    newCourse.imageLink = Database.DEFAULT_IMG_COURSE;
    newCourse.videoLink = null;
       
    if(this.imageService.imageToUpload) {
      this.saveImageItem().then(
        (url:string) => {

          if(url && url !==''){
            // faire condition pour identification Image
            newCourse.imageLink = url;
            this.sendCourseToDB(newCourse);  
          }
        }
      ).catch(
        
        (error) => {
          console.log(error);
        }
      );
    } else { 
      this.sendCourseToDB(newCourse);  
    }
  }

  private saveImageItem() {

    const fileRef = firebase.storage().ref('images').child('items');

    return this.imageService.uploadFile(this.imageService.imageToUpload, fileRef);
  }

  private sendCourseToDB(newCourse:Course) {
    
    return this.itemService.addNewItemToDB(newCourse)
    .catch(
      (error) => {
        console.log(error);
        return false;
      }
    ); 
  }

  // -------------------- Adding new course to DB --------------------
  createNewEvent() {

    const type = this.itemFormService.item.type;
    const title = this.itemFormService.item.title;
    const tags = Array.from(this.itemFormService.item.tags);
    const price = this.itemFormService.item.price;
    const authors: IUser[] = [this.authService.authUser.getIUser()];
    const creationDate = this.datepipe.transform(Date.now().toString(), 'dd/MM/yyyy');
    const imageLink = this.itemFormService.item.imageLink;

    let location = null;
    let dates = null;

    if(this.itemFormService.item instanceof EventItem) {
      location = this.itemFormService.item.location;
      dates = this.itemFormService.item.dates;
    }

    var newEvent = new EventItem(null,
                                 type,
                                 title,
                                 null,
                                 tags,
                                 null,
                                 null,
                                 price,
                                 location,
                                 dates,
                                 authors,
                                 creationDate,
                                 false,
                                 null,
                                 null,
                                 null,
                                 imageLink,
                                 null); 

    if(this.imageService.imageToUpload) {
      this.saveImageItem().then(
        (url:string) => {

          if(url && url !==''){
            // faire condition pour identification Image
            newEvent.imageLink = url;
            this.sendEventToDB(newEvent);  
          }
        }
      ).catch(
        
        (error) => {
          console.log(error);
        }
      );
    } else { 
      this.sendEventToDB(newEvent);  
    }     
  }

  private sendEventToDB(newEvent:EventItem)
  {
    return this.itemService.addNewItemToDB(newEvent).then(
      (val) => {
        if(val && val instanceof(EventItem)){

          return UserService.addItemInAuthorsDB(val, this.authService.authUser.id);
        }
      }
    ).catch(
      (error) => {
        console.log(error);
        return false;
      }
    ); 
  }


  // ----------------------- Display Item created message & go to item's page
  isItemCreated(){

    return (this.itemService.lastItemCreated && this.itemService.lastItemCreated.id !== ''
                                             && this.itemService.lastItemCreated.id !== null 
                                             && this.itemService.lastItemCreated.id !== undefined);
  }

  onTimerFinished(e:Event){
    if (e["action"] == "done"){

      if(this.itemService.lastItemCreated.type === 'course')
        this.router.navigate([RouteUrl.COURSE, this.itemService.lastItemCreated.id]);
      else if(this.itemService.lastItemCreated.type === 'event')
        this.router.navigate([RouteUrl.EVENT, this.itemService.lastItemCreated.id]);
    }
  }
  
  ngOnDestroy(){

    if (this.itemFormSubscription) {
      this.itemFormSubscription.unsubscribe();
    }
  }
}
