import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'src/app/shared/item/item';

@Component({
  selector: 'app-edit-description-item',
  templateUrl: './edit-description-item.component.html',
  styleUrls: ['./edit-description-item.component.css']
})
export class EditDescriptionItemComponent implements OnInit {

  @Input() description:string;
  oldDescription: string;
  descriptionItemForm: FormGroup;

  constructor(private formBuilder:FormBuilder,
              private _NgbActiveModal: NgbActiveModal) { }
  
  get activeModal() {
    return this._NgbActiveModal;
  }

  ngOnInit() {

    console.log('ngOnInit head course');

    this.descriptionItemForm = this.formBuilder.group({
      description: ['',[Validators.required]],
    });

    this.preFillEditForm();
    this.oldDescription = this.description;
  }

  preFillEditForm(){

    console.log('preFillEditForm', this.description);

    this.descriptionItemForm.patchValue({description:this.description});
  }
  
  passBack(){

    this.activeModal.close(this.description);
  }
}
