import { Course } from './../../../shared/model/item/course';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Database } from 'src/app/core/database/database.enum';
import { ItemFormService } from '../../shared/services/item-form.service';
import { StepState } from '../../shared/state-step.enum';
import { EventItem } from 'src/app/shared/model/item/event-item';

@Component({
  selector: 'app-item-type-form',
  templateUrl: './item-type-form.component.html',
  styleUrls: ['./item-type-form.component.scss']
})
export class ItemTypeFormComponent implements OnInit {

  typeForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private itemFormService: ItemFormService) {}

  ngOnInit() {

    this.typeForm = this.formBuilder.group({

      type: ['', Validators.required]
    });

    //if the item's type had been created
    if(this.itemFormService.isTypeOk())  this.onRestoreTypeForm(this.itemFormService.item.type);
  }

  onSetType() {

    const type = this.typeForm.get('type').value;

    if(type === 'course') {
      this.itemFormService.item = new Course(null,
                                             Database.COURSE.substr(1),
                                             null,
                                             null,
                                             [],
                                             null,
                                             null,
                                             null,
                                             [],
                                             null,
                                             false,
                                             [],
                                             null,
                                             null,
                                             null,
                                             [],
                                             [],
                                             [],
                                             null,
                                             null,
                                             null,
                                             null,
                                             null); 

      this.itemFormService.isCourse = true;
      this.itemFormService.isEvent = false;
    } 
    else if(type === 'event') { 
        
      this.itemFormService.item = new EventItem(null,
                                                Database.EVENT.substr(1),
                                                null,
                                                null,
                                                [],
                                                null,
                                                null,
                                                null,
                                                null,
                                                null,
                                                [],
                                                null,
                                                false,
                                                null,
                                                null,
                                                null); 

      this.itemFormService.isEvent = true;
      this.itemFormService.isCourse = false;
    }

    //this.itemFormService.setFormWithStepState(StepState.TITLE, type);

    this.itemFormService.nextForm();
  }

  onRestoreTypeForm(value:string){

    this.typeForm.patchValue({type:value});
  }
}