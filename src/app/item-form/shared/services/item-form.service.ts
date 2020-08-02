import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { StepState } from '../state-step.enum';
import { RouteUrl } from 'src/app/core/router/route-url.enum';


export interface StepForm {
  step: string; 
  status: boolean;
  value: any;
}

@Injectable({
  providedIn: 'root'
})
export class ItemFormService {

  private _stepFormSubject = new Subject<StepState>();
  private _mapStepForms: Map<string, StepForm> = new Map<string, StepForm>();

  constructor(private router:Router) { }

  public get mapStepForms(): Map<string, StepForm> {
    return this._mapStepForms;
  }
  public set mapStepForms(value: Map<string, StepForm>) {
    this._mapStepForms = value;
  }

  public get stepFormSubject() {
    return this._stepFormSubject;
  }

  addStepForm(stepState:StepState, stepForm: StepForm){

    
    if(this.mapStepForms.set(stepState, stepForm).has(stepState)){
      stepForm.status = true;
     this._stepFormSubject.next(stepState);
     console.log('addStepForm',stepForm);
    }
  }

  setFormWithStepState(stepState:StepState, value:any) {

    console.log('setFormWithStepState -- ItemFormService', stepState, value);

    const stepForm : StepForm = {
      step : stepState,
      status :false,
      value : value
    };

    this.addStepForm(stepState, stepForm);
  }

  getStepFormWithStep(step:StepState){

    return this.mapStepForms.get(step);
  }

  onBackWithoutSave(){

    this._stepFormSubject.next(StepState.BACK);
  }

  onStartToTheBeginning(){

    this._stepFormSubject.next(StepState.STARTING);
  }

  getValueStepForm(): Observable<StepState> {

    return this._stepFormSubject.asObservable();
  }

  isMediaFormSkip(bool: boolean){

    return bool;
  }

  isCourseFormRoute(routeUrl:string){

    return routeUrl.startsWith(RouteUrl.NEW_COURSE);
  }

  isCourse(){

    return this.router.url.startsWith(RouteUrl.NEW_COURSE);
  }

  isEventFormRoute(routeUrl:string){

    return routeUrl.startsWith(RouteUrl.NEW_EVENT);
  }

  isEvent(){

    return this.router.url.startsWith(RouteUrl.NEW_EVENT);
  }


  isTitleFormRoute(routeUrl:string){

  return routeUrl === RouteUrl.NEW_COURSE + RouteUrl.NEW_TITLE 
        || routeUrl === RouteUrl.NEW_EVENT + RouteUrl.NEW_TITLE;

  }

  isCategoryFormRoute(routeUrl:string){
  return routeUrl === RouteUrl.NEW_COURSE + RouteUrl.NEW_CATEGORY
        || routeUrl === RouteUrl.NEW_EVENT + RouteUrl.NEW_CATEGORY;
  }

  isPriceFormRoute(routeUrl:string){
  return routeUrl === RouteUrl.NEW_COURSE + RouteUrl.NEW_PRICE
        || routeUrl === RouteUrl.NEW_EVENT + RouteUrl.NEW_PRICE;
  }

  isMediaFormRoute(routeUrl:string){
  return routeUrl === RouteUrl.NEW_COURSE + RouteUrl.NEW_MEDIA
        ||  routeUrl === RouteUrl.NEW_EVENT + RouteUrl.NEW_MEDIA;
  }

  isDatesFormRoute(routeUrl:string){
    return routeUrl === RouteUrl.NEW_COURSE + RouteUrl.NEW_DATES
            ||  routeUrl === RouteUrl.NEW_EVENT + RouteUrl.NEW_DATES;
  }

  isLocationFormRoute(routeUrl:string){
    return routeUrl === RouteUrl.NEW_COURSE + RouteUrl.NEW_LOCATION
            ||  routeUrl === RouteUrl.NEW_EVENT + RouteUrl.NEW_LOCATION;
    }

  isCompleteFormRoute(routeUrl:string){
  return routeUrl === RouteUrl.NEW_COURSE + RouteUrl.NEW_COMPLETED
          ||  routeUrl === RouteUrl.NEW_EVENT + RouteUrl.NEW_COMPLETED;
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
    this.mapStepForms.clear();
    this.stepFormSubject.complete()
  }
}