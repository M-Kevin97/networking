import { Category } from './category';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';
import { Database } from 'src/app/core/database/database.enum';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: Category[] = [];

  categoriesSubject = new Subject<Category[]>();

  constructor() { }

  // Methode servant à emettre les categories du service
  emitCategories(){
    this.categoriesSubject.next(this.categories);
  }

  // Methode permettant d'enregistrer une liste de categories dans la DB, pour l'administrateur
  saveCategoriesToDB(){

    firebase.database().ref(Database.CATEGORIES).push();
  }

   // Methode permettant d'enregistrer une categorie dans la DB, pour l'administrateur
   saveCategoryToDB(newCategory:Category){

    const ref = firebase.database().ref(Database.CATEGORIES);
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

    return firebase.database().ref(Database.CATEGORIES).once('value').then( 
      (data) => {
        data.forEach((element) => {
          console.log(element.key, element.child('name').val());
          this.categories.push(new Category(element.key, element.child('name').val()));
        });

        
        this.emitCategories();
        console.log(data.val());

        return Array.from(this.categories);
      }
    );
  }

  getSingleCategoryFromDB(id:number){
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref(Database.CATEGORIES+id).once('value').then(
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
    firebase.database().ref(Database.CATEGORIES+id).set({
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


  /**
   * Cette method permet d'enregistrer une categorie dans la base de données,
   * avec la ref (le lieu de d'enregistrement) et la categorie (Category)
   */
  public static saveCategoryWithReference(ref:firebase.database.Reference, category:Category){

    return ref.child(Database.CATEGORY).child(category.id).set({
      name:category.name
    }).then(
      function() {
        return true;
    }).catch(function(error) {
      console.log(error);
        return false;
    });
  }
}