import { Subject } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-box',
  templateUrl: './email-box.component.html',
  styleUrls: ['./email-box.component.scss']
})
export class EmailBoxComponent implements OnInit {

  emailForm: FormGroup;

  @Output() email = new EventEmitter();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onConfirmEmail() {
    const email = this.emailForm.get('email').value;
    if(email) this.email.next(email);
  }

}
