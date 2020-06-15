import { CategoryService } from './../services/category.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Category } from '../models/category';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  adminForm: FormGroup;

  constructor(private formBuilder:FormBuilder,
              private categoryService: CategoryService) { }

  ngOnInit() {
    this.adminForm = this.formBuilder.group({
      nameCategory: ['',[Validators.required]]
    });
  }

  onCreateCategory(){

    console.log('onCreateCategory');

    const nameCategory = this.adminForm.get('nameCategory').value;

    this.categoryService.saveCategoryToDB(new Category(null, nameCategory));

  }

}
