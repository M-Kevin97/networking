import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Course } from 'src/app/shared/model/item/course';
import { EventItem } from 'src/app/shared/model/item/event-item';
import { Item } from 'src/app/shared/model/item/item';

@Component({
  selector: 'app-edit-support',
  templateUrl: './edit-support.component.html',
  styleUrls: ['./edit-support.component.scss']
})
export class EditSupportComponent implements OnInit {

  @Input() course:  Course;

  editSupportForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private _NgbActiveModal: NgbActiveModal) { }

  get activeModal() {
    return this._NgbActiveModal;
  }

  ngOnInit() {

    this.editSupportForm = this.formBuilder.group({
      imageItem: [''],
    });
  }

  goToGForm() {

    window.location.href='https://forms.gle/XR4FmoyHuBqUcTJd9';
  }


}
