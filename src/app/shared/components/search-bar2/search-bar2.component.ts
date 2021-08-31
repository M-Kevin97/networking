import { RouterService } from './../../service/router/router.service';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { TagService } from './../../service/tag/tag.service';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DefautCategory, SearchQueryName } from '../../model/ISearchQuery';
import { SearchService } from '../../service/search/search.service';
import { SelectType, SelectRadius } from '../categories-select/categories-select.component';
import { Tag } from '../../model/tag/tag';

@Component({
  selector: 'app-search-bar2',
  templateUrl: './search-bar2.component.html',
  styleUrls: ['./search-bar2.component.scss']
})
export class SearchBar2Component implements OnInit, AfterViewInit {

  searchForm: FormGroup;

  @Input() height:string = '';

  sortByName:string = '';
  item:string = '';
  query:string = '';

  tags:Tag[] = [];

  tagsDB:Tag[] = [];
  tagsSuggested:Tag[] = [];

  tagForm: FormGroup;
  errorTag:boolean;

  isInputFocus: boolean = false;
  isTagsSuggestedFocus: boolean = false;

  mySubscription: Subscription;

  constructor(private tagService: TagService,
              private searchService: SearchService,
              private routerService:  RouterService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute) { 


    this.searchForm = this.formBuilder.group({
      category: [''],
      search: ['']
    });
  }

  ngOnInit() { 

    this.tagService.getAllTagsFromDB(
      (tags) => {
        this.tagsDB = tags;

        // Récupération des catégories de la DB
        this.route.queryParams.subscribe(
          (params) => {
            if(params[SearchQueryName.CATEGORY] || params[SearchQueryName.QUERY] 
                                                || params[SearchQueryName.ITEM] 
                                                || params[SearchQueryName.SORT_OPTION]) {
                                                  
              this.query = params[SearchQueryName.QUERY]? params[SearchQueryName.QUERY] : '';
              this.item = params[SearchQueryName.ITEM]? params[SearchQueryName.ITEM] : '';
              this.sortByName = params[SearchQueryName.SORT_OPTION]? params[SearchQueryName.SORT_OPTION] : '';

              this.fillSearchForm();
              this.searchQuery();
            }
          }
        );
  
      }
    );
  }

  ngAfterViewInit(): void {
    
  }


  // height de la barre de recherche
  getHeight() {
    switch (this.height) {
      case 'lg':
        return '3.6rem';
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

  // remplir la barre de recherche
  private fillSearchForm() {
    
    if(this.query) {
      this.searchForm.patchValue({search: this.query});
    }
  }

  searchQuery() {

    if(this.searchForm.get('search').value) 
    {
      this.query = this.searchForm.get('search').value;

      this.searchService.search(DefautCategory.ID, this.query, this.sortByName, this.item);
  
      // close the tags suggested list
      this.isTagsSuggestedFocus = false;
    }
  }

  searchQueryWithSuggestion(suggestion) {

    this.query = suggestion;
    this.searchService.search(DefautCategory.ID, this.query, this.sortByName, this.item);

    // close the tags suggested list
    this.isTagsSuggestedFocus = false;
  }

  onSuggestTags() {

    const val:string = this.formatTagName(this.searchForm.get('search').value);

    this.tagService.getAllTagsFromDB(
      (tags) => {
        this.tagsDB = tags;
        this.tagsSuggested.splice(0, this.tagsSuggested.length);
 
        if(!val) this.tagsSuggested = Array.from(this.tagsDB);
        else if(val.length) {

          this.tagsSuggested = this.tagsDB.filter(c => this.formatTagName(c.name).startsWith(val));
                                         
          this.tagsSuggested = this.tagsSuggested.concat(this.tagsDB.filter(c => this.formatTagName(c.name)
                                                                                    .includes(val) 
                                            && !this.tagsSuggested.find((tagFind) => tagFind.id === c.id)));

          this.tagsSuggested = this.tagsSuggested.slice(0,20);
        } 
      }
    );
  }

  setTagsSuggestedFocus(bool:boolean) {
    
    this.isTagsSuggestedFocus = bool;
  }

  setTagsSuggestedWithInputFocus() {

    this.isInputFocus = true;
    this.isTagsSuggestedFocus = true;
    this.onSuggestTags();
  }

  setTagsSuggestedWithInputFocusOut() {

    this.isInputFocus = false;
    this.isTagsSuggestedFocus = false;
  }

  // check a formated tag is in DB in real time
  isTagsSuggestedList() {

    return (this.isTagsSuggestedFocus || this.isInputFocus);
  }

  // fonction pour formatter les tags (commence par majuscule, pas d'accent, en minuscule)
  formatTagName(tagName: string):string {

    if(tagName) {
      // ignore accent
      let str: string = tagName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        
      str = str.toLowerCase();

      return str;
    }
    return '';
  }

}

