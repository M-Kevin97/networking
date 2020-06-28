import { EventItem } from 'src/app/shared/item/event-item';
import { Course } from 'src/app/shared/item/course';
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

  constructor(private _itemFormService: ItemFormService) { }

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
    return (this.itemFormService.getStepFormWithStep(StepState.CATEGORY).value).name;
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
    return (this.itemFormService.getStepFormWithStep(StepState.COMPLETE).value instanceof EventItem);
  }

  isCourse(){
    return (this.itemFormService.getStepFormWithStep(StepState.COMPLETE).value instanceof Course);
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
