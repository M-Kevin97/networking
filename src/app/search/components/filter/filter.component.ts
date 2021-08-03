import { FilterService } from './../../../shared/service/search/filter/filter.service';
import { User } from 'src/app/shared/model/user/user';
import { ItemResult } from 'src/app/shared/model/ISearchQuery';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/shared/model/category/category';
import { Course } from 'src/app/shared/model/item/course';
import { EventItem } from 'src/app/shared/model/item/event-item';
import { CategoryService } from 'src/app/shared/service/category/category.service';
import { ItemService } from 'src/app/shared/service/item/item.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover/popover';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  @ViewChild('popContentRate') popContentRate:TemplateRef<any>;
  @ViewChild('popContentPrice') popContentPrice:TemplateRef<any>;
  
  @Output() items = new EventEmitter<boolean>();

  // L'input filterType permet de selectionner le type de filtre (Item / Course / Event)
  @Input() activeTab:ItemResult;
  @Input() itemList:Array<Course | EventItem> = [];

  resultsItem:Array<Course | EventItem> = [];
  resultsCourse:Array<Course | EventItem> = [];
  resultsEvent:Array<Course | EventItem> = [];

  filterForm: FormGroup;
  idCategorySelected: string;
  categorySelected : Category;
  categoriesValues:Category[];
  catRestored: Category;

  minPrice:string='0';
  maxPrice:string='7000';
  btnPriceName:string='Prix';
  
  ratingMin:string='0';
  btnRatingName:string='Avis';


  private categorySubscription: Subscription;
  private mapCategories: Map<string, Category>;

  constructor(private categoryService:CategoryService,
              private itemService:ItemService,
              private filterService:FilterService,
              private formBuilder:FormBuilder) { 

    this.filterForm = this.formBuilder.group({
      category: [''],
      search:['']
    });

    this.mapCategories = new Map<string, Category>();
    this.categoriesValues = [];
    this.idCategorySelected = null;
  }

  ngOnInit() { }


  // methode pour rechercher des formations et events dans la DB
  // onSearchWithFilter(){
    
  //   this.resultsItem = [];
  //   this.resultsCourse = [];
  //   this.resultsEvent = [];

  //   // Si il y a une categorie, récupérer les items (formations et événements) en fonction de la categorie
  //   if(this.categoryName) {
      
  //     this.itemService.getItemsByCategory(this.mapCategories.get(this.idCategorySelected)).then(
  //       (val) => {
  //         console.error('///Dzzeezo,ez,e,d',val);
  //         this.sortItemsFromDB(val);

  //         // Filtrer les résultats en fonction des paramètres du filtre
  //         this.filterResults();

  //         console.error('///_____ Courses',this.resultsCourse);
  //         console.error('///_____ Events',this.resultsEvent);
  //         console.error('///_____ Items',this.resultsItem);

  //         this.emitResults();
  //       }
  //     );
  //   }
  //   // Si il n'y a pas de categorie (Tout), ni de mots clés, récupérer tous les items (formations et événements)
  //   else {
  //     this.itemService.getItemsFromDB().then(
  //       (val) => {
  //         console.error('///_____ getItemsFromDB :',val);
  //         this.sortItemsFromDB(val);

  //         console.error('///_____ sortItemsFromDB',this.resultsItem);

  //         // Filtrer les résultats en fonction des paramètres du filtre
  //         this.filterResults();

  //         console.error('///_____ Courses',this.resultsCourse);
  //         console.error('///_____ Events',this.resultsEvent);
  //         console.error('///_____ Items',this.resultsItem);

  //         this.emitResults();

  //       }
  //     );
  //   }
  // }

  // methode pour choisir le format (Formation ou Evenement) de l'item dans la liste
  sortItemsFromDB(val:Object){

    if(!val) return null;

      this.resultsItem = Object.keys(val).map(
        function(itemsIdIndex){
        let itemJson = val[itemsIdIndex], item;
    
        console.log(val);
        console.error(itemJson);

        // Format de l'item en fonction du type
        if(itemJson['type']==='course') item = Course.courseFromJson(itemJson); 
        else if (itemJson['type']==='event') item = EventItem.eventFromJson(itemJson);

        item.id = itemsIdIndex;

        return item;
    });
  }
 

  // // methode pour filter les résultats en fonction de paramètres (Categorie, mots clés, prix, notes, etc...) 
  // filterResults() {

  //   if(this.resultsItem){

  //     console.error('rhexcjvkbhnj', this.categoryName, this.query, this.resultsItem);
  //     let y = 0, resultsFilteredQuery = Array.from(this.resultsItem);

  //     // Trie en fonction des mots clés
  //     this.resultsItem.forEach(
  //       (result) => {

  //         console.warn(result.searchContent,' includes :',this.query.toLocaleLowerCase(), 'res: ',result.searchContent.includes(this.query.toLocaleLowerCase()));

  //         if(this.query)
  //         {   
  //           //&& !result.searchContent.includes(this.query.toLocaleLowerCase()))

  //           //récupération de chaque mot de la recherche
  //           let splittedArray = this.query.toLocaleLowerCase().split(' ');
  //           let counts:number[] = [];

  //           for(let keyword of splittedArray) counts.push(result.searchContent.split(keyword).length - 1); 
      
  //           if(!counts.reduce((a, b) => a + b, 0)) {
  //             resultsFilteredQuery.splice(this.resultsItem.indexOf(result)-y,1);
  //             y++;
  //           }
  //         }
  //       }
  //     );
  //     console.error('MIDDLE FILTER', resultsFilteredQuery);

  //     // Trie en fonction de la categorie
  //     let resultsFilteredCategory = Array.from(resultsFilteredQuery);
  //     y = 0;
  //     console.error('MIDDLE FILTER', resultsFilteredCategory);

  //     resultsFilteredQuery.forEach(
  //       (result) => {
  //         console.error('zezeze', resultsFilteredQuery.indexOf(result));

  //         if(this.categoryName && !(result.category.name === this.categoryName))
  //         {
  //           console.log('splice : ',resultsFilteredCategory.splice(resultsFilteredQuery.indexOf(result)-y,1));
  //           y++;
  //         }
  //       }
  //     );

  //     console.error('END FILTER', resultsFilteredCategory);

  //      // Trie en fonction du prix
  //      let resultsFilteredPrice = Array.from(resultsFilteredCategory);
  //      y = 0;
  //      console.error('MIDDLE FILTER', resultsFilteredPrice);
 
  //      resultsFilteredCategory.forEach(
  //        (result) => {
  //          console.error('zezeze', resultsFilteredCategory.indexOf(result));
 
  //          if((this.minPrice || this.maxPrice) && !((result.price >= (+this.minPrice)) && (result.price <= (+this.maxPrice))))
  //          {
  //            console.log('splice : ',resultsFilteredPrice.splice(resultsFilteredCategory.indexOf(result)-y,1));
  //            y++;
  //          }else {

  //           if(result.type==='course') this.resultsCourse.push(result); 
  //           else if (result.type==='event') this.resultsEvent.push(result);
  //        }
  //        }
  //      );
 
  //      console.error('END FILTER', resultsFilteredPrice);
  //     this.resultsItem = Array.from(resultsFilteredPrice);

  //     // Trie en fonction des avis
  //     let resultsFilteredRating = Array.from(this.resultsCourse);
  //     y = 0;
  //     console.error('MIDDLE FILTER', resultsFilteredRating);
 
  //     resultsFilteredPrice.forEach(
  //        (result) => {
  //          console.error('zezeze', resultsFilteredPrice.indexOf(result));
 
  //          if(this.ratingMin && (result instanceof Course) && result.globalNote && !(result.globalNote >= (+this.ratingMin)))
  //          {
  //             console.log('splice : ',resultsFilteredRating.splice(this.resultsCourse.indexOf(result)-y,1));
  //             this.resultsItem.splice(this.resultsCourse.indexOf(result)-y,1);
  //             y++;
  //          }
  //        }
  //      );
 
  //     console.error('END FILTER', resultsFilteredRating);
 
  //     this.resultsCourse = Array.from(resultsFilteredRating);

  //   } else return [];
  // }

  filterItems() {
    if(this.activeTab && this.itemList) {

      let array = Array.from(this.itemList);
      let y = 0;

   

      var filtered = array.filter(function(value, index, arr){ 
        return (this.minPrice || this.maxPrice) && !((value.price >= (+this.minPrice)) 
        && (value.price <= (+this.maxPrice)))
      });

      console.warn("hrgezretry", filtered);

      array.forEach(
        (item) => {
          switch(this.activeTab) { 
            case ItemResult.ITEMS: { 
              //statements; 
              break; 
            } 
            case ItemResult.COURSES: { 
               //statements; 
               break; 
            } 
            case ItemResult.EVENTS: { 
               //statements; 
               break; 
            }
            case ItemResult.USERS: { 
              //statements; 
              break; 
            }  
            default: { 
               //statements; 
               break; 
            } 
          } 

          y++;
        }
      );
    }
  }

  // filter en fonction du prix
  filterByPrice(array:Array<Course|EventItem>){

    // Trie en fonction du prix
    let resultsFilteredPrice = Array.from(array), y =0;
    console.error('PRICE FILTER', resultsFilteredPrice);

    array.forEach(
      (item) => {
        console.error('zezeze', array.indexOf(item));

        if((this.minPrice || this.maxPrice) && !((item.price >= (+this.minPrice)) 
                                            && (item.price <= (+this.maxPrice)))) {

          this.resultsItem.splice(this.resultsCourse.indexOf(item)-y,1);
          y++;
                                  
        } else {
          if(item instanceof Course) this.resultsCourse.push(item); 
          else if (item instanceof EventItem) this.resultsEvent.push(item);
        }
      }
    );
  }

  // filter en fonction du prix
  filterItemByPrice(item:Course|EventItem){


  }

  // filter en fonction des avis
  filterByRating(array:Array<Course|EventItem>){

    // Trie en fonction des avis
    console.error('RATING FILTER');
  
    array.forEach(
      (item) => {
        console.error('zezeze', array.indexOf(item));

        if(this.ratingMin && (item instanceof Course) 
                          && item.globalNote 
                          && !(item.globalNote >= (+this.ratingMin))) {

          this.resultsCourse.push(item); 
        }
      }
    );
  }

  // filter en fonction de la localisation
  filterByDates(array:Array<Course|EventItem>){

    // Trie en fonction des avis
    console.error('DATE FILTER');
  
    array.forEach(
      (item) => {
        console.error('zezeze', array.indexOf(item));

        if(this.ratingMin && (item instanceof Course) 
                          && item.globalNote 
                          && !(item.globalNote >= (+this.ratingMin))) {

          if(item.type==='course') this.resultsCourse.push(item); 
          else if (item.type==='event') this.resultsEvent.push(item);
        }
      }
    );
  }

  // filter en fonction de la localisation
  filterByLocation(array:Array<Course|EventItem>){

    // Trie en fonction des avis
    console.error('RATING FILTER');
  
    array.forEach(
      (item) => {
        console.error('zezeze', array.indexOf(item));

        if(this.ratingMin && (item instanceof EventItem) 
                          && item.location) {
        }
      }
    );
  }

  onFilter()
  {
    this.items.emit(true);
  }

  filterResults() {

    if(this.resultsItem){

      console.error('rhexcjvkbhnj', this.resultsItem);
      let y = 0;

      // Trie en fonction du prix
      let resultsFilteredPrice = Array.from(this.resultsItem);
      y = 0;
      console.error('MIDDLE FILTER', resultsFilteredPrice);
 
      this.filterByPrice(resultsFilteredPrice);
 
       console.error('END FILTER', resultsFilteredPrice);
      this.resultsItem = Array.from(resultsFilteredPrice);

      // Trie en fonction des avis
      let resultsFilteredRating = Array.from(this.resultsCourse);
      y = 0;
      console.error('MIDDLE FILTER', resultsFilteredRating);
 
      resultsFilteredPrice.forEach(
         (result) => {
           console.error('zezeze', resultsFilteredPrice.indexOf(result));
 
           if(this.ratingMin && (result instanceof Course) && result.globalNote && !(result.globalNote >= (+this.ratingMin)))
           {
              console.log('splice : ',resultsFilteredRating.splice(this.resultsCourse.indexOf(result)-y,1));
              this.resultsItem.splice(this.resultsCourse.indexOf(result)-y,1);
              y++;
           }
         }
       );
 
      console.error('END FILTER', resultsFilteredRating);
 
      this.resultsCourse = Array.from(resultsFilteredRating);

    } else return [];
  }

  emitResults() {

    this.items.emit(true);
  }

  onSetMinPrice(event) {
    console.error(event);
    this.minPrice = event;
    this.filterService.minPrice = event;
  }

  onSetMaxPrice(event) {
    console.error(event);
    this.maxPrice = event;
    this.filterService.maxPrice = event;
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

  onSetPriceRange() {
    
      console.log('onSetPriceRange min:',+this.minPrice);
      console.log('onSetPriceRange max:',+this.maxPrice);

      // si les champs n'ont pas été rempli
      if(!this.minPrice) this.minPrice='0';
      if(!this.maxPrice) this.maxPrice='0';

      // Création du texte à afficher
      if(this.minPrice && this.maxPrice && this.minPrice < this.maxPrice)
        this.btnPriceName = this.minPrice +' - '+this.maxPrice+' €';

      else if(this.minPrice && !this.maxPrice)
        this.btnPriceName = this.minPrice +' € et plus';

      else if(!this.minPrice && this.maxPrice)
        this.btnPriceName = this.maxPrice +' € et moins';
      
      else if(!this.minPrice && !this.maxPrice)
        this.btnPriceName = 'Prix';

      this.items.emit(true);
  }

  onCancelPriceRange() {
    this.minPrice = '0';
    this.maxPrice = '0';
    this.btnPriceName = 'Prix';

    this.filterService.minPrice = this.minPrice;
    this.filterService.maxPrice = this.maxPrice;

    this.items.emit(true);
    
  }

  onSetRatingRange() {

    if(+this.ratingMin){
      this.btnRatingName = this.ratingMin +' et plus';
      console.log("Value rating is : ", this.ratingMin);
    } 
  }

  onCancelRatingRange() {
    this.ratingMin = '0';
    this.btnRatingName = 'Avis';
  }

  isCourseList() {
    if(this.activeTab)
      return this.activeTab === ItemResult.COURSES;
    else false;
  }

  isEventList() {
    if(this.activeTab)
      return this.activeTab === ItemResult.EVENTS;
    else false;
  }

  isUserList() {
    if(this.activeTab)
      return this.activeTab === ItemResult.USERS;
    else false;
  }

  ngOnDestroy(){
    if (this.categorySubscription != null) {
      this.categorySubscription.unsubscribe();
    }
  }
}
