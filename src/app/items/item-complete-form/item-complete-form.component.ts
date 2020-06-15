import { ItemFormService, StepState, StepForm } from './../item-form.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsService } from 'src/app/services/items.service';
import { Router } from '@angular/router';
import { Item } from 'src/app/models/item';

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

       // sinon si l'élément Price a été créé
       if(this.itemFormService.mapStepForms.has(StepState.COMPLETE)){
        if(this.itemFormService.getStepFormWithStep(StepState.COMPLETE).status){
          this.onRestoreCompleteForm(this.itemFormService.getStepFormWithStep(StepState.COMPLETE).value);
        }
      }
      // sinon si les éléménts précédents n'ont pas été créé, retourner au début
      else if (this.itemFormService.mapStepForms.size === 0){
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

    this.itemFormService.setFormWithStepState(StepState.COMPLETE, true);
  }

  onBack(){
    this.itemFormService.onBackWithoutSave();
  }

  onRestoreCompleteForm(stepForm:StepForm){

  }

}
