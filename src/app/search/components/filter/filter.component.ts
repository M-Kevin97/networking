import { ItemService } from 'src/app/shared/item/item.service';
import { CategoryService } from 'src/app/shared/item/category/category.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Category } from 'src/app/shared/item/category/category';
import { Subscription } from 'rxjs';
import { StepState } from 'src/app/item-form/shared/state-step.enum';
import { Item } from 'src/app/shared/item/item';
import { Course } from 'src/app/shared/item/course';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {

  @Output() items = new EventEmitter<Course[]>();
  @Input() categoryName:string;

  filterForm: FormGroup;
  idCategorySelected: string;
  categorySelected : Category;
  categoriesValues:Category[];
  catRestored: Category;

  private categorySubscription: Subscription;
  private mapCategories: Map<string, Category>;

  constructor(private categoryService:CategoryService,
              private itemService:ItemService,
              private formBuilder:FormBuilder) { 

    this.filterForm = this.formBuilder.group({
      category: [''],
      search:['']
    });

    this.mapCategories = new Map<string, Category>();
    this.categoriesValues = [];
    this.idCategorySelected = null;
  }

  ngOnInit() { 

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

    this.categoryService.getCategoriesFromDB().then(
      (val) => {
        this.fillFilterForm();
        this.onSearchWithFilter(this.filterForm);
      }
    );
  }

  fillFilterForm() {
    if(this.categoryName) {
      console.log('fillFilterForm',this.categoryName);
      this.idCategorySelected = this.getKeyByCategoryName(this.categoryName);
    }
  }

  getKeyByCategoryName(val:string) {
    return [...this.mapCategories].find(([key, value]) => val === value.name)[0];
  }

  onSearchWithFilter(filterForm){

    //filterForm

    const category = this.mapCategories.get(this.idCategorySelected);
    console.log('onSearch Category :', category);
    this.itemService.getCoursesByCategory(category).then(
      (val) => {
        let v = Course.coursesFromJson(val);
        console.log(v);
        this.items.emit(v);
      }
    );
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
