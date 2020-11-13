import { filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Database } from 'src/app/core/database/database.enum';
import { Course } from 'src/app/shared/model/item/course';
import { EventItem, IEvent } from 'src/app/shared/model/item/event-item';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  minPrice:string='0';
  maxPrice:string='7000';
  
  ratingMin:string='0';

  itemList:Array<Course | EventItem> = [];

  constructor() { }

  filterItemList() {
    if(this.itemList.length) {
      let array:Array<Course | EventItem> = [];

      this.itemList.forEach(
        (item) => {
          if(this.filterItem(item)) array.push(item);
        }
      );
    return array;
    }
    else return [];
  }

  filterItem(item:Course|EventItem) {

    let bool = true;

    switch(item.type) { 
      case Database.COURSE.substr(1): { 
        bool = this.filterItemByPrice(item) && ((item instanceof Course) ? this.filterItemByRating(item): true);
        break; 
      } 
      case  Database.EVENT.substr(1): { 
         //statements; 
         break; 
      } 
      default: { 
         //statements; 
         break; 
      } 
    }
    return bool;
  }

  // filter en fonction du prix
  filterItemByPrice(item:Course|EventItem){

    // Trie en fonction du prix

    if((+this.minPrice && !+this.maxPrice) && ((item.price >= (+this.minPrice)))) return true;

    else if((!+this.minPrice && +this.maxPrice) && (item.price <= (+this.maxPrice))) return true;
    
    else if(!+this.minPrice && !+this.maxPrice) return true;

    else if((+this.minPrice && +this.maxPrice) && ((item.price >= (+this.minPrice)) 
                                        && (item.price <= (+this.maxPrice)))) return true;
    else return false;                   
  }

  // filtrer en fonction des avis
  filterItemByRating(item:Course){

    // Trie en fonction des avis
    console.error('RATING FILTER');

    if(+this.ratingMin===0) return true;

    if(this.ratingMin && item.globalNote
                      && (item.globalNote >= (+this.ratingMin))) return true;
    else return false;
  }

  // filter en fonction de la localisation
  filterByDates(item:EventItem){

    // Trie en fonction des avis
    console.error('DATE FILTER');

    if(this.ratingMin && (item instanceof Course) 
                      && item.globalNote 
                      && !(item.globalNote >= (+this.ratingMin))) return true;
    else return false;

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


}
