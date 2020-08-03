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
  @Input() query:string;

  results:Course[] = [];
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

    this.getCategoriesFromService().then(
      (val) => {
        this.fillFilterForm();
        this.onSearchWithFilter();
      }
    );;
  }

  getCategoriesFromService(){

    console.log('getCategoriesFromService ItemCategoryFormComponent');

    this.categorySubscription = this.categoryService.categoriesSubject
    .subscribe(
      (data:Category[]) => {

        this.mapCategories.set('0',new Category('0', 'Tout'));
         
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

    return this.categoryService.getCategoriesFromDB();
  }

  fillFilterForm() {
    if(this.categoryName) {
      console.log('fillFilterForm',this.categoryName);
      this.idCategorySelected = this.getKeyByCategoryName(this.categoryName);
    }
    if(this.query) {
      console.log('fillFilterForm',this.query);
      this.filterForm.patchValue({search:this.query});
    }
  }

  getKeyByCategoryName(val:string) {
    return [...this.mapCategories].find(([key, value]) => val === value.name)[0];
  }

  onSearchWithFilter(){

    //filterForm

   /* const category = this.mapCategories.get(this.idCategorySelected);
    console.log('onSearch Category :', category);
    this.itemService.getItemByCategory(category).then(
      (val) => {
        let v = Course.coursesFromJson(val);
        console.log(v);
        this.items.emit(v);
      }
    );*/

    
    this.query = this.filterForm.get('search').value;
    let cat = this.mapCategories.get(this.idCategorySelected);
    this.categoryName = cat.name;
    if(cat.id==='0') this.categoryName = null;

    if(this.categoryName) {
      
      this.itemService.getItemByCategory(this.mapCategories.get(this.idCategorySelected)).then(
        (val) => {
          console.error('///Dzzeezo,ez,e,d',val);
          let v = Course.coursesFromJson(val);
          console.error('///Dzo,ez,e,d',v);
          this.results = this.filterResults(v);

          this.items.emit(this.results);
        }
      );
    }
    else {
      this.itemService.getItemsFromDB().then(
        (val) => {
          console.error('///Dzzeezo,ez,e,d',val);
          let v = Course.coursesFromJson(val);
          console.error('///Dzo,ez,e,d',v);
          this.results = this.filterResults(v);

          this.items.emit(this.results);
        }
      );
    }
  }

  filterResults(results:Course[]) {

    if(results){
      
      console.error('rhexcjvkbhnj', this.categoryName, this.query);
      let y = 0;
      let temp = Array.from(results);
      results.forEach(
        (result) => {
          if(this.categoryName){
            if(!(result.category.name === this.categoryName))
            {
              temp.splice(results.indexOf(result)-y,1);
              y++;
            }
             
          }
        }
      );
      console.error('MIDDLE FILTER', temp);

      let resultsFiltered = Array.from(temp);
      console.error('MIDDLE FILTER', resultsFiltered);

      y = 0;
      temp.forEach(
        (result) => {
          console.error('zezeze', temp.indexOf(result));
          console.warn(result.searchContent,' includes :',this.query.toLocaleLowerCase(), 'res: ',result.searchContent.includes(this.query.toLocaleLowerCase()));
          if(this.query){
            if(!result.searchContent.includes(this.query.toLocaleLowerCase()))
            {
              console.log('splie : ',resultsFiltered.splice(temp.indexOf(result)-y,1));
              y++;
            }
          }
        }
      );

      console.error('END FILTER', resultsFiltered);

      return resultsFiltered;

    } else return [];
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

  getResultsLength() {
    if(this.results)
      return this.results.length;
  }

  ngOnDestroy(){
    if (this.categorySubscription != null) {
      this.categorySubscription.unsubscribe();
    }
  }
}
