import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemFormService } from 'src/app/item-form/shared/services/item-form.service';
import { StepState } from 'src/app/item-form/shared/state-step.enum';
import { IDatesEvent } from 'src/app/shared/model/item/event-item';

@Component({
  selector: 'app-event-date-form',
  templateUrl: './event-date-form.component.html',
  styleUrls: ['./event-date-form.component.css']
})
export class EventDateFormComponent implements OnInit {

  public get itemFormService(): ItemFormService {
    return this._itemFormService;
  }

  datesForm: FormGroup;
  endDateInf:boolean;

  constructor(private formBuilder: FormBuilder,
              private _itemFormService: ItemFormService) {}


  ngOnInit() {

    this.endDateInf = false;

    this.datesForm = this.formBuilder.group({
      startDate: ['',[Validators.required]],
      endDate: ['',[Validators.required]]
    });

      // sinon si l'élément a été créé
    if(this.itemFormService.mapStepForms.has(StepState.DATES)){
    if(this.itemFormService.getStepFormWithStep(StepState.DATES).status){
        this.onRestoreDatesForm(this.itemFormService.getStepFormWithStep(StepState.DATES).value);
      }
    }
    // sinon si les éléménts précédents n'ont pas été créé, retourner au début
    else if (this.itemFormService.mapStepForms.size === 0){
      this.itemFormService.onStartToTheBeginning();
    }
  }

  getTodayDate(){
    return new Date().toISOString().split("T")[0] + "T00:00";
  }

  getStartDate(){
    return this.datesForm.get('startDate').value;
  }

  checkDates() {
    if(!this.datesForm.get('endDate').value) { return false }
    return this.datesForm.get('endDate').value > this.datesForm.get('startDate').value;
  }

  onSetDates() {

      this.endDateInf = false;

      const dates: IDatesEvent = {
        startDate: this.datesForm.get('startDate').value,
        endDate: this.datesForm.get('endDate').value,
      };
  
      console.log(dates);
  
      this.itemFormService.setFormWithStepState(StepState.DATES, dates);
  }

  onRestoreDatesForm(value:IDatesEvent){

    this.datesForm.patchValue({startDate:value.startDate});
    this.datesForm.patchValue({endDate:value.endDate});
  }

  onBack()
  {
    this.itemFormService.onBackWithoutSave();
  }

}
