import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ItemFormService } from '../../shared/services/item-form.service';
import { StepState } from '../../shared/state-step.enum';

@Component({
  selector: 'app-item-complete-form',
  templateUrl: './item-complete-form.component.html',
  styleUrls: ['./item-complete-form.component.css']
})
export class ItemCompleteFormComponent implements OnInit {

  public get itemFormService(): ItemFormService {
    return this._itemFormService;
  }

  constructor(private _itemFormService: ItemFormService,
              private route:Router) { }

  ngOnInit() {

      // sinon si les éléménts précédents n'ont pas été créé, retourner au début
      if (this.itemFormService.mapStepForms.size === 0){
        this.itemFormService.onStartToTheBeginning();
      }
  }

  getTitleFormValue(){
    return this.itemFormService.getStepFormWithStep(StepState.TITLE).value;
  }

  getCategoryFormValue(){
    return (this.itemFormService.getStepFormWithStep(StepState.CATEGORIES).value).name;
  }

  getTagsFormValue(){
    return this.itemFormService.getStepFormWithStep(StepState.CATEGORIES).value;
  }

  getPriceFormValue(){
    return this.itemFormService.getStepFormWithStep(StepState.PRICE).value;
  }

  getImageFormValue(){
   return this.itemFormService.getStepFormWithStep(StepState.MEDIA).value;
  }

  onCreateItem(){

    this.itemFormService.setFormWithStepState(StepState.COMPLETE, null);
  }

  isEvent(){
    //return (this.itemFormService.getStepFormWithStep(StepState.COMPLETE).value instanceof EventItem);
    return this.itemFormService.isEventFormRoute(this.route.url)
  }

  isCourse(){
    //return (this.itemFormService.getStepFormWithStep(StepState.COMPLETE).value instanceof Course);
    return this.itemFormService.isCourseFormRoute(this.route.url)
  }

  goToItemPage(){
    this.itemFormService.setFormWithStepState(StepState.COMPLETED, null);
  }

  onTimerFinished(e:Event){
    if (e["action"] == "done"){
      this.itemFormService.setFormWithStepState(StepState.COMPLETED, null);
     }
   }

  onBack(){
    this.itemFormService.onBackWithoutSave();
  }

  isItemCreated(){
    if(this.itemFormService.getStepFormWithStep(StepState.COMPLETE)!==null 
        && this.itemFormService.getStepFormWithStep(StepState.COMPLETE)!==undefined){
          return this.itemFormService.getStepFormWithStep(StepState.COMPLETE).status;
        }
    else{
      return false;
    }
  }
}
