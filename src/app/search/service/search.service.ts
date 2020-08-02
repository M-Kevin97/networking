import { Category } from './../../shared/item/category/category';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

searchSubject = new Subject<Category>();

category:Category;

constructor() { }

emitSearchCategory(){
  //this.categoriesSubject.next(this.categories);
}


}
