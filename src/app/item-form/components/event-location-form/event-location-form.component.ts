import { EventItem } from './../../../shared/model/item/event-item';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ILocationEvent } from 'src/app/shared/model/item/event-item';
import { ItemFormService } from '../../shared/services/item-form.service';
import { StepState } from '../../shared/state-step.enum';

@Component({
  selector: 'app-event-location-form',
  templateUrl: './event-location-form.component.html',
  styleUrls: ['./event-location-form.component.scss']
})
export class EventLocationFormComponent implements OnInit {

  public get itemFormService(): ItemFormService {
    return this._itemFormService;
  }

  isLocationFormCollapsed = true;
  isLinkFormCollapsed = true;
  

  locationForm: FormGroup;
  linkForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private _itemFormService: ItemFormService) {}


  ngOnInit() {

    this.locationForm = this.formBuilder.group({

      location: ['',[Validators.required]],
      address: ['',[Validators.required]],
      zip: ['',[Validators.required]],
      city: ['',[Validators.required]],
      country: ['',[Validators.required]]
    });

    this.linkForm = this.formBuilder.group({

      location: ['',[Validators.required]]
    });

    //   // sinon si l'élément a été créé
    // if(this.itemFormService.mapStepForms.has(StepState.DATES)){
    //   if(this.itemFormService.getStepFormWithStep(StepState.DATES).status){
    //     this.onRestoreDatesForm(this.itemFormService.getStepFormWithStep(StepState.DATES).value);
    //   }
    // }
    // // sinon si les éléménts précédents n'ont pas été créé, retourner au début
    // else if (this.itemFormService.mapStepForms.size === 0){
    //   this.itemFormService.onStartToTheBeginning();
    // }
  }

  displayLinkForm() {

    this.isLinkFormCollapsed = !this.isLinkFormCollapsed ;
    // this.isLocationFormCollapsed = true;
  }


  displayLocationForm() {

    this.isLocationFormCollapsed = !this.isLocationFormCollapsed;
    // this.isLinkFormCollapsed = true;
  }

  isFormSelectedFilled():boolean {

    let bool = false;

    if(!this.isLocationFormCollapsed) {

      bool = !this.locationForm.invalid;
    } else if(!this.isLocationFormCollapsed) {

      bool = !this.linkForm.invalid;
    }

    return bool;
  }

  onSetLocation() {

    const location: ILocationEvent = {
      location: this.locationForm.get('location').value,
      address: this.locationForm.get('address').value,
      zip: this.locationForm.get('zip').value,
      city: this.locationForm.get('city').value,
      country: this.locationForm.get('country').value,
    };

    // this.itemFormService.setFormWithStepState(StepState.LOCATION, location);
    if(this.itemFormService.item instanceof EventItem) {
      
      this.itemFormService.item.location = location;
      this.itemFormService.nextForm();
    }
  }

  onRestoreDatesForm(value:ILocationEvent){

    this.locationForm.patchValue({location:value.location});
    this.locationForm.patchValue({address:value.address});
    this.locationForm.patchValue({zip:value.zip});
    this.locationForm.patchValue({city:value.city});
    this.locationForm.patchValue({country:value.country});
  }

  onBack(){
    this.itemFormService.onBackWithoutSave();
  }
}
