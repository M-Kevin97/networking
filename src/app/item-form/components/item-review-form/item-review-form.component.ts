import { EventItem } from 'src/app/shared/model/item/event-item';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ItemFormService } from '../../shared/services/item-form.service';
import { StepState } from '../../shared/state-step.enum';

@Component({
  selector: 'app-item-review-form',
  templateUrl: './item-review-form.component.html',
  styleUrls: ['./item-review-form.component.scss']
})
export class ItemReviewFormComponent implements OnInit {

  public get itemFormService(): ItemFormService {
    return this._itemFormService;
  }

  constructor(private _itemFormService: ItemFormService) { }

  ngOnInit() {

    // sinon si les éléménts précédents n'ont pas été créé, retourner au début
    // if (this.itemFormService.mapStepForms.size === 0){
    //   this.itemFormService.onStartToTheBeginning();
    // } 
    if(!this.itemFormService.isReviewOk) this.itemFormService.onStartToTheBeginning();
  }

  // getTitleFormValue(){
  //   return this.itemFormService.getStepFormWithStep(StepState.TITLE).value;
  // }

  // getCategoryFormValue(){
  //   return (this.itemFormService.getStepFormWithStep(StepState.CATEGORIES).value).name;
  // }

  // getTagsFormValue(){
  //   return this.itemFormService.getStepFormWithStep(StepState.CATEGORIES).value;
  // }

  // getPriceFormValue(){
  //   return this.itemFormService.getStepFormWithStep(StepState.PRICE).value;
  // }

  // getImageFormValue(){
  //  return this.itemFormService.getStepFormWithStep(StepState.MEDIA).value;
  // }

  getEventDates() {

    if(this.itemFormService.item instanceof EventItem) return this.itemFormService.item.dates;
  }

  getEventLocation() {

    if(this.itemFormService.item instanceof EventItem) return this.itemFormService.item.location;
  }
  

  onCreateItem(){

    // this.itemFormService.setFormWithStepState(StepState.REVIEW, null);
    this.itemFormService.isItemReviewed = true;
    this.itemFormService.nextForm();
  }

  onBack(){

    this.itemFormService.onBackWithoutSave();
  }
}
