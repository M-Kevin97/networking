import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/shared/model/category/category';
import { DefautCategory, SearchQueryName } from 'src/app/shared/model/ISearchQuery';
import { CategoryService } from 'src/app/shared/service/category/category.service';
import { SearchService } from 'src/app/shared/service/search/search.service';
import { SelectRadius, SelectType } from '../categories-select/categories-select.component';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  searchForm: FormGroup;

  @Input() height:string;

  sortByName:string = '';
  item:string = '';
  query:string = '';
  categoryValues:Category[];

  idCategorySelected:string;

  mySubscription: Subscription;

  constructor(private categoryService:CategoryService,
              private searchService: SearchService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute) { 

    this.categoryValues = [];


    this.searchForm = this.formBuilder.group({
      category: [''],
      search: ['']
    });
  }

  ngOnInit() { 

    console.log('SearchBarComponent ngOnInit');

    // Récupération des catégories de la DB
    this.categoryService.getCategoriesFromDB().then(
      (data:Category[]) => {

        this.categoryValues = data ? Array.from(data) : [];
        this.categoryValues.splice(0, 0, new Category(DefautCategory.ID, DefautCategory.NAME, null));
        this.idCategorySelected = this.categoryValues[0].id;
      }
    ).then(
      () => {

        this.route.queryParams.subscribe(
          (params) => {
            if(params[SearchQueryName.CATEGORY] || params[SearchQueryName.QUERY] || params[SearchQueryName.ITEM] || params[SearchQueryName.SORT_OPTION]) 
            {
              let catId = params[SearchQueryName.CATEGORY] ? params[SearchQueryName.CATEGORY] : '';
              this.query = params[SearchQueryName.QUERY]? params[SearchQueryName.QUERY] : '';
              this.item = params[SearchQueryName.ITEM]? params[SearchQueryName.ITEM] : '';
              this.sortByName = params[SearchQueryName.SORT_OPTION]? params[SearchQueryName.SORT_OPTION] : '';

              console.error('route.queryParams', catId, this.query);

              this.fillSearchForm(catId);
              this.searchQuery();
            }
          }
        );
      }
    );
  }

  // height de la barre de recherche
  getHeight() {
    switch (this.height) {
      case 'lg':
        return '3.2rem';
      case 'md':
        return '2.8rem';
      case 'sm':
        return '4rem';
    }
  }

  // height de la barre de recherche
  getSelectType() {
    return SelectType;
  }

  // height de la barre de recherche
  getSelectRadius() {
    return SelectRadius;
  }

  // Catégorie sélectionnée par l'utilisateur
  onSelectCategoryById(event:string) {
    if(event) {
      console.error('eeee fillSearchForm',event);
      this.idCategorySelected = event;
    }
  }

  // remplir la barre de recherche
  private fillSearchForm(catId:string) {

    if(catId) {
      let cat:Category;
      if(cat = this.categoryValues.find(cat => cat.id === catId)) this.idCategorySelected = cat.id;
      else {
        this.categoryValues.forEach(
          cat => {
            if(cat.subCategories)
              if(cat = cat.subCategories.find(subCat => subCat.id === catId)) this.idCategorySelected = cat.id;
          }
        );
      }
    } else this.idCategorySelected = DefautCategory.ID;

    console.error('eeee fillSearchForm',catId, this.idCategorySelected);
    
    if(this.query) {
      this.searchForm.patchValue({search: this.query});
    }
  }

  searchQuery() {

    this.query = this.searchForm.get('search').value;
    this.searchService.search(this.idCategorySelected, this.query, this.sortByName, this.item);
  }


}
