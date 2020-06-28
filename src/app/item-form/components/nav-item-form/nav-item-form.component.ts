import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemFormService } from '../../shared/services/item-form.service';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { StepState } from '../../shared/state-step.enum';

@Component({
  selector: 'app-nav-item-form',
  templateUrl: './nav-item-form.component.html',
  styleUrls: ['./nav-item-form.component.css']
})
export class NavItemFormComponent implements OnInit {

  constructor(private router:Router,
                private itemFormService:ItemFormService) { }

  ngOnInit() { }

  isEventForm() {

    return this.router.url.substr(0,RouteUrl.NEW_EVENT.length) === RouteUrl.NEW_EVENT;
  }

  isCourseForm() {
    return this.router.url.substr(0,RouteUrl.NEW_COURSE.length) === RouteUrl.NEW_COURSE;
  }

  isTitleFormRoute(){
  return this.router.url === RouteUrl.NEW_COURSE + RouteUrl.NEW_TITLE 
        || this.router.url === RouteUrl.NEW_EVENT + RouteUrl.NEW_TITLE;
  }

  isCategoryFormRoute(){
  return this.router.url === RouteUrl.NEW_COURSE + RouteUrl.NEW_CATEGORY
        || this.router.url === RouteUrl.NEW_EVENT + RouteUrl.NEW_CATEGORY;
  }

  isPriceFormRoute(){
  return this.router.url === RouteUrl.NEW_COURSE + RouteUrl.NEW_PRICE
        || this.router.url === RouteUrl.NEW_EVENT + RouteUrl.NEW_PRICE;
  }

  isMediaFormRoute(){
  return this.router.url === RouteUrl.NEW_COURSE + RouteUrl.NEW_MEDIA
        ||  this.router.url === RouteUrl.NEW_EVENT + RouteUrl.NEW_MEDIA;
  }

  isDatesFormRoute(){
    return this.router.url === RouteUrl.NEW_COURSE + RouteUrl.NEW_DATES
            ||  this.router.url === RouteUrl.NEW_EVENT + RouteUrl.NEW_DATES;
  }

  isLocationFormRoute(){
    return this.router.url === RouteUrl.NEW_COURSE + RouteUrl.NEW_LOCATION
            ||  this.router.url === RouteUrl.NEW_EVENT + RouteUrl.NEW_LOCATION;
    }

  isCompleteFormRoute(){
  return this.router.url === RouteUrl.NEW_COURSE + RouteUrl.NEW_COMPLETED
          ||  this.router.url === RouteUrl.NEW_EVENT + RouteUrl.NEW_COMPLETED;
  }

  isTitleCreated(){
    return this.itemFormService.getStepFormWithStep(StepState.TITLE).status;
  }

  isCategoryCreated(){
    return this.itemFormService.getStepFormWithStep(StepState.CATEGORY).status;
  }

  isPriceCreated(){
    return this.itemFormService.getStepFormWithStep(StepState.PRICE).status;
  }

  isMediaCreated(){
    return this.itemFormService.getStepFormWithStep(StepState.MEDIA).status;
  }

  isDatesCreated(){
    return this.itemFormService.getStepFormWithStep(StepState.DATES).status;
  }

  isLocationCreated(){
    return this.itemFormService.getStepFormWithStep(StepState.LOCATION).status;
  }

  isCompleteCreated(){
    return this.itemFormService.getStepFormWithStep(StepState.COMPLETE).status;
  }

  goToTitleForm(){
    if(this.isEventForm()) {
      this.router.navigate([RouteUrl.NEW_EVENT + RouteUrl.NEW_TITLE]);
    }
    else if(this.isCourseForm()) {
      this.router.navigate([RouteUrl.NEW_COURSE + RouteUrl.NEW_TITLE]);
    }
  }

  goToCategoryForm() {

    if(this.isTitleCreated()){
      if(this.isEventForm()) {
        this.router.navigate([RouteUrl.NEW_EVENT + RouteUrl.NEW_CATEGORY]);
      }
      else if(this.isCourseForm()) {
        this.router.navigate([RouteUrl.NEW_COURSE + RouteUrl.NEW_CATEGORY]);
      }
    }
  }

  goToPriceForm() {

    if(this.isTitleCreated() && this.isCategoryCreated()){
      if(this.isEventForm()) {
        this.router.navigate([RouteUrl.NEW_EVENT + RouteUrl.NEW_PRICE]);
      }
      else if(this.isCourseForm()) {
        this.router.navigate([RouteUrl.NEW_COURSE + RouteUrl.NEW_PRICE]);
      }
    }
  }

  goToMediaForm() {

    if(this.isTitleCreated() && this.isCategoryCreated() 
                             && this.isPriceCreated()){
      if(this.isEventForm()) {
        this.router.navigate([RouteUrl.NEW_EVENT + RouteUrl.NEW_MEDIA]);
      }
      else if(this.isCourseForm()) {
        this.router.navigate([RouteUrl.NEW_COURSE + RouteUrl.NEW_MEDIA]);
      }
    }
  }

  goToDatesForm() {

    if(this.isTitleCreated() && this.isCategoryCreated()
                            && this.isPriceCreated()
                            && this.isMediaCreated()){
      if(this.isEventForm()) {
        this.router.navigate([RouteUrl.NEW_EVENT + RouteUrl.NEW_DATES]);
      }
      else if(this.isCourseForm()) {
        this.router.navigate([RouteUrl.NEW_COURSE + RouteUrl.NEW_DATES]);
      }
    }
  }

  goToLocationForm() {

    if(this.isTitleCreated() && this.isCategoryCreated()
                            && this.isPriceCreated()
                            && this.isMediaCreated()
                            && this.isDatesCreated()){
      if(this.isEventForm()) {
        this.router.navigate([RouteUrl.NEW_EVENT + RouteUrl.NEW_LOCATION]);
      }
      else if(this.isCourseForm()) {
        this.router.navigate([RouteUrl.NEW_COURSE + RouteUrl.NEW_LOCATION]);
      }             
    }
  }

  goToCompleteForm() {
    if(this.isEventForm()) {
      if(this.isTitleCreated() && this.isCategoryCreated()
                               && this.isPriceCreated()
                               && this.isMediaCreated()
                               && this.isDatesCreated()
                               && this.isLocationCreated()){
        this.router.navigate([RouteUrl.NEW_EVENT + RouteUrl.NEW_COMPLETED]);
      }
    }
    else if(this.isCourseForm()) {
      if(this.isTitleCreated() && this.isCategoryCreated()
                               && this.isPriceCreated()
                               && this.isMediaCreated()){
        this.router.navigate([RouteUrl.NEW_COURSE + RouteUrl.NEW_COMPLETED]);
      }
    }  
  }
}
