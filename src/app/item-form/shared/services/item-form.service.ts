import { Course } from './../../../shared/model/item/course';
import { EventItem } from './../../../shared/model/item/event-item';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { StepState } from '../state-step.enum';
import { Database } from 'src/app/core/database/database.enum';


export interface StepForm {
  step: string; 
  status: boolean;
  value: any;
}

@Injectable({
  providedIn: 'root'
})
export class ItemFormService {

  item: EventItem|Course;
  isItemReviewed: boolean = false;
  isCourse: boolean = false;
  isEvent: boolean = false;

  private _itemFormSubject = new Subject<StepState>();
  private _mapStepForms: Map<string, StepForm> = new Map<string, StepForm>();

  constructor() { }

  public get mapStepForms(): Map<string, StepForm> {
    return this._mapStepForms;
  }
  
  public set mapStepForms(value: Map<string, StepForm>) {
    this._mapStepForms = value;
  }

  public get itemFormSubject() {
    return this._itemFormSubject;
  }

  // add or update a value to a step (title, category, price, media)
  setFormWithStepState(stepState:StepState, value:any) {

    const stepForm : StepForm = {
      step : stepState,
      status :false,
      value : value
    };

    // this.addStepForm(stepState, stepForm);
  }

  // private addStepForm(stepState:StepState, stepForm: StepForm){

  //   if(this.mapStepForms.set(stepState, stepForm).has(stepState)){
  //     stepForm.status = true;
  //    this._stepFormSubject.next(stepState);
  //   }
  // }

  nextForm() {

    this.itemFormSubject.next(StepState.NEXT);
  }

  getStepFormWithStep(step:StepState) {

    return this.mapStepForms.get(step);
  }

  onBackWithoutSave() {

    this.itemFormSubject.next(StepState.BACK);
  }

  onStartToTheBeginning() {

    this.itemFormSubject.next(StepState.STARTING);
  }

  getValueStepForm(): Observable<StepState> {

    return this.itemFormSubject.asObservable();
  }

  isMediaFormSkip(bool: boolean) {

    return bool;
  }



  isTypeOk() {
    return (this.item && this.item.type != ''
                                      && this.item.type != null
                                      && this.item.type != undefined
                                      && (this.item.type === Database.COURSE.substr(1)
                                          || this.item.type === Database.EVENT.substr(1)));
  }

  isTitleOk() {
    return (this.item && this.item.title != ''
                      && this.item.title != null
                      && this.item.title != undefined);
  }


  isTagsOk()
  {
    return (this.item && this.item.tags
                      && this.item.tags.length > 0);
  }

  isPriceOk()
  {
    return (this.item && this.item.price != null
                      && this.item.price != undefined
                      && this.item.price > -1);
  }

  isMediaOk() {
    return (this.item && this.item.imageLink != null
                      && this.item.imageLink != undefined
                      && this.item.imageLink != '');
  }

  isDatesOk() {

    if(this.isEvent && this.item instanceof EventItem){

      return (this.item && this.item.dates
                        && this.item.dates != null
                        && this.item.dates != undefined);
    }
  }

  isLocationOk()
  {
    if(this.isEvent && this.item instanceof EventItem){

      return (this.item && this.item.location
                        && this.item.location != null
                        && this.item.location != undefined);
    }
  }

  isReviewOk()
  {
    if(this.isCourse) {

      return (this.isTypeOk() && this.isTitleOk()
                              && this.isTagsOk()
                              && this.isPriceOk()
                              && this.isMediaOk()
                              && this.isItemReviewed);

    } else if(this.isEvent) {

      return (this.isTypeOk() && this.isTitleOk()
                              && this.isTagsOk()
                              && this.isMediaOk()
                              && this.isPriceOk()
                              && this.isDatesOk()
                              && this.isLocationOk()
                              && this.isItemReviewed);
    }
  }

  checkKeyInput(event: KeyboardEvent){
    return (event.key !== 'Comma' 
                           && event.key !== ','
                           && event.key !== ';'
                           && event.key !== '='
                           && event.key !== '>'
                           && event.key !== '<'
                           && event.key !== '.'
                           && event.key !== ':'
                           && event.key !== '`'
                           && event.key !== '_'
                           && event.key !== '§'
                           && event.key !== '\''
                           )
  }

  clearForm() {
    // this.mapStepForms.clear();
    this.item = null;
    // this.itemFormSubject.complete();
  }
}