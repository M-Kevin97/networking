import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemFormService } from '../../shared/services/item-form.service';
import { StepState } from '../../shared/state-step.enum';

@Component({
  selector: 'app-event-location-form',
  templateUrl: './event-location-form.component.html',
  styleUrls: ['./event-location-form.component.css']
})
export class EventLocationFormComponent implements OnInit {

  public get itemFormService(): ItemFormService {
    return this._itemFormService;
  }

  locationForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private _itemFormService: ItemFormService) {}


  ngOnInit() {

    this.locationForm = this.formBuilder.group({
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

  onSetLocation() {

    const location = this.locationForm.get('location').value;
    this.itemFormService.setFormWithStepState(StepState.LOCATION, location);
  }

  onRestoreDatesForm(value:string){

    this.locationForm.patchValue({location:value});
  }
}
