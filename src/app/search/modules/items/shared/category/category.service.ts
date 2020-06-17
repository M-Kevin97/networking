import { Category } from './category';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: Category[] = [];

  categoriesSubject = new Subject<Category[]>();

  constructor() { 
    console.log('constructor CategoryService');
    this.getCategoriesFromDB();
  }

  // Methode servant à emettre les categories du service
  emitCategories(){
    this.categoriesSubject.next(this.categories);
  }

  // Methode permettant d'enregistrer une liste de categories dans la DB, pour l'administrateur
  saveCategoriesToDB(){

    firebase.database().ref('/categories').push();
  }

   // Methode permettant d'enregistrer une categorie dans la DB, pour l'administrateur
   saveCategoryToDB(newCategory:Category){

    const ref = firebase.database().ref('/categories');
    const categoryId = ref.push().key;

    ref.child(categoryId).set({
      name: newCategory.name
    });
  }

  // Methode permettant de créer une nouvelle catégorie -- pour l'administrateur
  createNewCategory(newCategory:Category){

    this.categories.push(newCategory);
    this.saveCategoriesToDB();
    this.emitCategories();
  }

  getCategoriesFromDB(){
    
    console.log('getCategoriesFromDB CategoryService');

    firebase.database().ref('/categories').on('value', 
      (data) => {
        data.forEach((element) => {
          console.log(element.key, element.child('name').val());
          this.categories.push(new Category(element.key, element.child('name').val()));
        });

        this.emitCategories();
        console.log(data.val());
      }
    );
  }

  getSingleCategoryFromDB(id:number){
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/categories'+id).once('value').then(
          (data) => {
              resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  setValueOfSingleCategoryFromDB(id:number, value:string){
    firebase.database().ref('/categories'+id).set({
      value: value,
    }, function(error) {
      if (error) {
        // The write failed...
      } else {
        // Data saved successfully!
      }
    });
  }

  removeCategory(category:Category){
    const itemIndexToRemove = this.categories.findIndex(
      (categoryEl) => {
        if(categoryEl === category) {
          return true;
        }
      }
    );

    this.categories.splice(itemIndexToRemove, 1);
    this.saveCategoriesToDB();
    this.emitCategories();
  }
}