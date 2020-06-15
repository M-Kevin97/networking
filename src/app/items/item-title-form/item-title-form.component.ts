import { ItemFormService, StepForm, StepState } from './../item-form.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item-title-form',
  templateUrl: './item-title-form.component.html',
  styleUrls: ['./item-title-form.component.css']
})
export class ItemTitleFormComponent implements OnInit {

  titleForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private itemFormService: ItemFormService) {}

  ngOnInit() {
    this.titleForm = this.formBuilder.group({
      title: ['',[Validators.required]]
    });

    // sinon si l'élément Price a été créé
    if(this.itemFormService.mapStepForms.has(StepState.TITLE)){
    if(this.itemFormService.getStepFormWithStep(StepState.TITLE).status){
        this.onRestoreTitleForm(this.itemFormService.getStepFormWithStep(StepState.TITLE).value);
      }
    }
    // sinon si les éléménts précédents n'ont pas été créé, retourner au début
    else if (this.itemFormService.mapStepForms.size === 0){
      this.itemFormService.onStartToTheBeginning();
    }
    // sinon retourner à l'élément précédent
    else {
      this.itemFormService.onBackWithoutSave();
    }
  }

  onSetTitle() {

    const title = this.titleForm.get('title').value;
    this.itemFormService.setFormWithStepState(StepState.TITLE, title);
  }

  onRestoreTitleForm(value:string){

    this.titleForm.patchValue({title:value});
  }
}

