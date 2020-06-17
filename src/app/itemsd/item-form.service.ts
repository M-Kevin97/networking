import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


export interface StepForm {
  step: number; 
  status: boolean;
  value: any;
}

export enum StepState {
  TITLE = 0,
  CATEGORY = 1,
  PRICE = 2,
  MEDIA = 3,
  COMPLETE = 4,
  BACK = -1,
  STARTING = -10
}

@Injectable({
  providedIn: 'root'
})
export class ItemFormService {

  private _stepForm = new Subject<StepState>();
  private _mapStepForms: Map<number, StepForm> = new Map<number, StepForm>();


  constructor() { }

  public get mapStepForms(): Map<number, StepForm> {
    return this._mapStepForms;
  }
  public set mapStepForms(value: Map<number, StepForm>) {
    this._mapStepForms = value;
  }

  public get stepForm() {
    return this._stepForm;
  }

  public set stepForm(value) {
    this._stepForm = value;
  }

  addStepForm(stepState:StepState, stepForm: StepForm){

    this.mapStepForms.set(stepState, stepForm);

    console.log(this.mapStepForms)
  }

  getStepFormWithStep(step:StepState){

    return this.mapStepForms.get(step);
  }

  onSaveAndNext(stepState:StepState, stepForm:StepForm) {
    this.addStepForm(stepState, stepForm);
    this._stepForm.next(stepState);
  }

  onBackWithoutSave(){
    this._stepForm.next(StepState.BACK);
  }

  onStartToTheBeginning(){
    this._stepForm.next(StepState.STARTING);
  }

  getValueStepForm(): Observable<StepState> {
    return this._stepForm.asObservable();
  }

  isMediaFormSkip(bool: boolean){
    return bool;
  }

  setFormWithStepState(stepState:StepState, value:any) {

    console.log('setFormWithStepState -- ItemFormService', value);

    switch(stepState)
    {
      case StepState.TITLE : 
      {       
        const stepForm : StepForm = {
          step : StepState.TITLE,
          status :true,
          value : value
      };
  
        this.onSaveAndNext(StepState.TITLE, stepForm);
        break;
      }

      case StepState.CATEGORY : 
      {
        const stepForm : StepForm = {
          step : StepState.CATEGORY,
          status :true,
          value : value
        };
    
        this.onSaveAndNext(StepState.CATEGORY, stepForm);
        break;
      }

      case StepState.PRICE : 
      {
        const stepForm : StepForm = {
          step : StepState.PRICE,
          status :true,
          value : +value
        };
    
        this.onSaveAndNext(StepState.PRICE, stepForm);
        break;
      }

      case StepState.MEDIA : 
      {
        const stepForm : StepForm = {
          step : StepState.MEDIA,
          status :true,
          value : value
        };
    
        this.onSaveAndNext(StepState.MEDIA, stepForm);
        break;
      }

      case StepState.COMPLETE :
      {
        this._stepForm.next(StepState.COMPLETE);
        break;
      }

      default : {

        break;
      }
    }
  }
}
