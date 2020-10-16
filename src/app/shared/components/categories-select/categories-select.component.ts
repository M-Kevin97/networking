import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../model/category/category';

export enum SelectType {
  CAT_ONLY = '0',
  CAT_AND_SUB = '1',
}

export enum SelectRadius {
  NONE = '0',
  LEFT = '1',
}

@Component({
  selector: 'app-categories-select',
  templateUrl: './categories-select.component.html',
  styleUrls: ['./categories-select.component.scss']
})
export class CategoriesSelectComponent implements OnInit {

  categorySelectForm: FormGroup;

  @Input() width:string;
  @Input() height:string; 
  @Input() categorySelectId: string;
  @Input() categoryValues:Category[];
  @Input() selectType:SelectType = SelectType.CAT_ONLY;
  @Input() selectRadius:SelectRadius = SelectRadius.NONE;

  @Output() idCategorySelected = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder) {
    this.categorySelectForm = this.formBuilder.group({
      categorySelect: ['',[Validators.required]],
    });
   }

  ngOnInit() { 
    console.warn('hhhhmihulgyku',this.categorySelectId);
  }

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

  // width de la barre de recherche
  getWidth() {
    switch (this.width) {
      case 'lg':
        return '12rem';
      case 'md':
        return '10.5rem';
      case 'sm':
        return '8.5rem';
    }
  }

  getRadius() {
    switch (this.selectRadius) {
      case SelectRadius.LEFT:
        return '3rem 0 0 3rem';
      case SelectRadius.NONE:
        return '';
    }
  }

  getSelectType() {
    return SelectType;
  }

  // Formateur sélectionnée par la catégorie
  selectCategory(event:string) {
    console.warn('ùmee',event);

    //Emettre la catégorie sélectionné
    this.idCategorySelected.emit(event);
  }
}

