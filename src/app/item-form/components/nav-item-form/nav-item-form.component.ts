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

  isTitleOk()
  {
    if(this.isTitleCreated()){
      return true;
    }
    else if(this.itemFormService.isTitleFormRoute(this.router.url)){
      return true;
    }
    return false;
  }


  isCategoryOk()
  {
    if(this.isCategoryCreated()){
      return true;
    }
    else if(this.itemFormService.isCategoryFormRoute(this.router.url)){
      return true;
    }
    return false;
  }

  isPriceOk()
  {
    if(this.isPriceCreated()){
      return true;
    }
    else if(this.itemFormService.isPriceFormRoute(this.router.url)){
      return true;
    }
    return false;
  }

  isMediaOk()
  {
    if(this.isMediaCreated()){
      return true;
    }
    else if(this.itemFormService.isMediaFormRoute(this.router.url)){
      return true;
    }
    return false;
  }

  isCompleteOk()
  {
    if(this.isCompleteCreated()){
      return true;
    }
    else if(this.itemFormService.isCompleteFormRoute(this.router.url)){
      return true;
    }
    return false;
  }

  isLocationOk()
  {
    if(this.isLocationCreated()){
      return true;
    }
    else if(this.itemFormService.isLocationFormRoute(this.router.url)){
      return true;
    }
    return false;
  }

  isDatesOk()
  {
    if(this.isDatesCreated()){
      return true;
    }
    else if(this.itemFormService.isDatesFormRoute(this.router.url)){
      return true;
    }
    return false;
  }

  isTitleCreated(){

    if(this.itemFormService.getStepFormWithStep(StepState.TITLE)){
      return true
    }
    return false;
  }

  isCategoryCreated(){

    if(this.itemFormService.getStepFormWithStep(StepState.CATEGORY)){
      return true
    }
    return false;
  }

  isPriceCreated(){

   if(this.itemFormService.getStepFormWithStep(StepState.PRICE)){
      return true
    }
    return false;
  }

  isMediaCreated(){

    if(this.itemFormService.getStepFormWithStep(StepState.MEDIA)){
      return true
    }
    return false;
  }

  isDatesCreated(){

    if(this.itemFormService.getStepFormWithStep(StepState.DATES)){
      return true
    }
    return false;
  }

  isLocationCreated(){

    if(this.itemFormService.getStepFormWithStep(StepState.LOCATION)){
      return true
    }
    return false;
  }

  isCompleteCreated(){

    if(this.itemFormService.getStepFormWithStep(StepState.COMPLETE)){
      return true
    }
    return false;
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
