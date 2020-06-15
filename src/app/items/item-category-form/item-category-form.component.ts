import { CategoryService } from './../../services/category.service';
import { Category } from './../../models/category';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepForm, StepState, ItemFormService } from '../item-form.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item-category-form',
  templateUrl: './item-category-form.component.html',
  styleUrls: ['./item-category-form.component.css']
})
export class ItemCategoryFormComponent implements OnInit, OnDestroy {

  public get itemFormService(): ItemFormService {
    return this._itemFormService;
  }
  
  public get categoryService(): CategoryService {
    return this._categoryService;
  }

  categorySelected : Category;
  categoryForm: FormGroup;
  categoriesValues:Category[];
  catRestored: Category;

  private categorySubscription: Subscription;
  private idCategorySelected: string;
  private mapCategories: Map<string, Category>;

  constructor(private formBuilder:FormBuilder,
              private _itemFormService: ItemFormService,
              private _categoryService: CategoryService) { 

                this.mapCategories = new Map<string, Category>();
                this.categoriesValues = [];
                this.idCategorySelected = null;

                console.log('constructor ItemCategoryFormComponent');
              }

  ngOnInit() {

    this.categoryForm = this.formBuilder.group({
      category: ['',[Validators.required]]
    });

    // sinon si l'élément Price a été créé
    if(this.itemFormService.mapStepForms.has(StepState.CATEGORY)){
      if(this.itemFormService.getStepFormWithStep(StepState.CATEGORY).status){
        this.getCategoriesFromService();
        this.onRestoreCategoryForm(this.itemFormService.getStepFormWithStep(StepState.CATEGORY).value);
      }
    }
    // sinon si les éléménts précédents n'ont pas été créé, retourner au début
    else if (this.itemFormService.mapStepForms.size === 0){
      this.itemFormService.onStartToTheBeginning();
    }

    this.getCategoriesFromService();
  }

  getCategoriesFromService(){

    console.log('getCategoriesFromService ItemCategoryFormComponent');

    this.categorySubscription = this.categoryService.categoriesSubject
    .subscribe(
      (data:Category[]) => {

        for(var _i = 0; _i < data.length; _i++) 
        {
          this.mapCategories.set(data[_i].id, data[_i]);
        }

        this.categoriesValues = Array.from(this.mapCategories.values());
      },
      (err: string) => console.error('Observer got an error: ' + err),
      () => {
        console.log('Observer got a complete notification');
      }
    );
  }

  onSetCategory(){

    const category = this.mapCategories.get(this.idCategorySelected);
    console.log('Categories map :', this.mapCategories);
    this.itemFormService.setFormWithStepState(StepState.CATEGORY, category);
  }

  onBack(){
    this.itemFormService.onBackWithoutSave();
  }

  // En cas de retour sur la page du formulaire Category, Selectionner automatikement la catégorie sélecté
  onRestoreCategoryForm(category:Category){

    this.categoryService.getCategoriesFromDB();

    // Récupérer la catégorie déjà sélectionné
    this.catRestored = category
  }

  // Catégorie sélectionnée par l'utilisateur
  selectCategory(id: string) {

    //getted id selected category from event
    this.idCategorySelected = id;
  }

  ngOnDestroy(){
    if (this.categorySubscription != null) {
      this.categorySubscription.unsubscribe();
    }
  }
}