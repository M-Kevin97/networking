import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/shared/model/user/user';

@Component({
  selector: 'app-user-select',
  templateUrl: './user-select.component.html',
  styleUrls: ['./user-select.component.scss']
})
export class UserSelectComponent implements OnInit {

  userSelectForm: FormGroup;

  @Input() height:string;
  @Input() userSelectId: string;
  @Input() userValues:User[];

  @Output() userSelected = new EventEmitter<User>();

  constructor(private formBuilder: FormBuilder) {
    this.userSelectForm = this.formBuilder.group({
      userSelect: ['',[Validators.required]],
    });
   }

  ngOnInit() { }

  // height de la barre de recherche
  getHeight() {
    switch (this.height) {
      case 'lg':
        return '3.2rem';
      case 'md':
          return '2.8rem';
      case 'sm':
        return '2rem';
    }
  }

  

  // Formateur sélectionnée par l'utilisateur
  selectInstructor(event:string) {
    console.warn('ùmee',event);
    //Emettre le formateur sélectionné
    const inst = this.userValues.find(inst => inst.id === event)
    this.userSelected.emit(inst);
  }
}
