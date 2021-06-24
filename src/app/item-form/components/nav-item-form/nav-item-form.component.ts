import { EventItem } from './../../../shared/model/item/event-item';
import { Database } from './../../../core/database/database.enum';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemFormService } from '../../shared/services/item-form.service';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { StepState } from '../../shared/state-step.enum';

@Component({
  selector: 'app-nav-item-form',
  templateUrl: './nav-item-form.component.html',
  styleUrls: ['./nav-item-form.component.scss']
})
export class NavItemFormComponent implements OnInit {

  public get itemFormService(): ItemFormService {
    return this._itemFormService;
  }

  constructor(private router:Router,
              private _itemFormService: ItemFormService) { }

  ngOnInit() { }

  isTypeNavOk() {
    return (this.itemFormService.item && this.itemFormService.item.type != ''
                                      && this.itemFormService.item.type != null
                                      && this.itemFormService.item.type != undefined
                                      && (this.itemFormService.item.type === Database.COURSE.substr(1)
                                          || this.itemFormService.item.type === Database.EVENT.substr(1))
                                      || this.router.url === RouteUrl.NEW_ITEM+RouteUrl.NEW_TYPE);
  }

  isTitleNavOk() {
    return (this.itemFormService.isTitleOk()
              || this.router.url === RouteUrl.NEW_ITEM+RouteUrl.NEW_TITLE);
  }


  isTagsNavOk()
  {
    return (this.itemFormService.isTagsOk()
              || this.router.url === RouteUrl.NEW_ITEM+RouteUrl.NEW_TAGS);
  }

  isPriceNavOk()
  {
    return (this.itemFormService.isPriceOk()
              || this.router.url === RouteUrl.NEW_ITEM+RouteUrl.NEW_PRICE);
  }

  isMediaNavOk() {
    return (this.itemFormService.isMediaOk()
              || this.router.url === RouteUrl.NEW_ITEM+RouteUrl.NEW_MEDIA);
  }

  isDatesNavOk() {

    if(this.itemFormService.isEvent && this.itemFormService.item instanceof EventItem){

      return (this.itemFormService.isDatesOk()
                || this.router.url === RouteUrl.NEW_ITEM+RouteUrl.NEW_DATES);
    }
  }

  isLocationNavOk()
  {
    if(this.itemFormService.isEvent && this.itemFormService.item instanceof EventItem){

      return (this.itemFormService.isLocationOk()
                || this.router.url === RouteUrl.NEW_ITEM+RouteUrl.NEW_LOCATION);
    }
  }

  isReviewNavOk()
  {
    return (this.itemFormService.isReviewOk()
      || this.router.url === RouteUrl.NEW_ITEM+RouteUrl.NEW_REVIEW);
  }

  goToTypeItemForm(){

    this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_TYPE]);
  }

  goToTitleForm(){

    if(this.isTypeNavOk()){

      this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_TITLE]);
    }
  }

  goToTagsForm() {

    if(this.isTypeNavOk() && this.isTitleNavOk()){

      this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_TAGS]);
    }
  }

  goToPriceForm() {

    if(this.isTypeNavOk() && this.isTitleNavOk() 
                          && this.isTagsNavOk()){

      this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_PRICE]);
    }
  }

  goToMediaForm() {

    if(this.isTypeNavOk() && this.isTitleNavOk() 
                          && this.isTagsNavOk()
                          && this.isPriceNavOk()){

      this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_MEDIA]);
    }
  }

  goToDatesForm() {

    if(this.isTypeNavOk() && this.isTitleNavOk() 
                          && this.isTagsNavOk()
                          && this.isPriceNavOk()
                          && this.isMediaNavOk()){

      this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_DATES]);
    }
  }

  goToLocationForm() {

    if(this.isTypeNavOk() && this.isTitleNavOk() 
                          && this.isTagsNavOk()
                          && this.isPriceNavOk()
                          && this.isMediaNavOk()
                          && this.isDatesNavOk()){

      this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_LOCATION]);     
    }       
  }

  goToReview() {

    if(this.itemFormService.isEvent) {

      if(this.isTypeNavOk() && this.isTitleNavOk() 
                            && this.isTagsNavOk()
                            && this.isPriceNavOk()
                            && this.isMediaNavOk()
                            && this.isDatesNavOk()
                            && this.isLocationNavOk()){

         this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_REVIEW]);
      }
    }
    else if(this.itemFormService.isCourse) {

     if(this.isTypeNavOk() && this.isTitleNavOk() 
                         && this.isTagsNavOk()
                         && this.isPriceNavOk()
                         && this.isMediaNavOk()){

         this.router.navigate([RouteUrl.NEW_ITEM + RouteUrl.NEW_REVIEW]);
      }
    }  
  }
}
