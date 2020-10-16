import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ItemFormService } from '../../shared/services/item-form.service';
import { StepState } from '../../shared/state-step.enum';
import { CategoryService } from 'src/app/shared/service/category/category.service';
import { Category } from 'src/app/shared/model/category/category';


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
  subCategorySelected : Category;
  categoryForm: FormGroup;
  categoriesValues:Category[];

  private categorySubscription: Subscription;
  private idCategorySelected: string;
  private idSubCategorySelected: string;

  constructor(private formBuilder:FormBuilder,
              private _itemFormService: ItemFormService,
              private _categoryService: CategoryService) { 

                this.categoriesValues = [];
                this.idCategorySelected = '';
                this.idSubCategorySelected = '';

                console.log('constructor ItemCategoryFormComponent');
              }

  ngOnInit() {

    this.categoryForm = this.formBuilder.group({
      category: ['',[Validators.required]],
      subCategory: ['',[Validators.required]]
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

        this.categoriesValues = data;
      },
      (err: string) => console.error('Observer got an error: ' + err),
      () => {
        console.log('Observer got a complete notification');
      }
    );

    this.categoryService.getCategoriesFromDB();
  }

  onSetCategory(){

    const cat = this.categorySelected;
    cat.subCategories = [this.subCategorySelected];

    console.log('onSetCategory', cat);

    this.itemFormService.setFormWithStepState(StepState.CATEGORY, cat);
  }

  onBack(){
    this.itemFormService.onBackWithoutSave();
  }

  // En cas de retour sur la page du formulaire Category, Selectionner automatikement la catégorie sélecté
  onRestoreCategoryForm(category:Category){

    this.categoryService.getCategoriesFromDB();

    // Récupérer la catégorie déjà sélectionné
    this.categorySelected = category;
    this.subCategorySelected = category.subCategories[0];
  }

  // Catégorie sélectionnée par l'utilisateur
  onSelectCategory(id: string) {
    //getted id selected category from event
    //this.idCategorySelected = id;
    console.warn('onSelectCategory', this.categorySelected.name);
  }

  // Sous catégorie sélectionnée par l'utilisateur
  onSelectSubCategory(id: string) {
    //getted id selected category from event
    //this.idSubCategorySelected = id;
    console.warn('onSelectCategory', this.subCategorySelected.name);
  }

  ngOnDestroy(){
    if (this.categorySubscription != null) {
      this.categorySubscription.unsubscribe();
    }
  }
}