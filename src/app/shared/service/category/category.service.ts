import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';
import { Category } from '../../model/category/category';
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
  addCategoriesToDB(){

    firebase.database().ref(Database.CATEGORIES).push();
  }

  // Methode permettant d'enregistrer une categorie dans la DB, pour l'administrateur
  addCategoryToDB(newCategory:Category){

    const ref = firebase.database().ref(Database.CATEGORIES);
    const categoryId = ref.push().key;

    return ref.child(categoryId).set({
      name: newCategory.name
    }).then(
      ()=>{
        this.categories.push(newCategory);
        return newCategory;
      }
    );
  }

  // Methode permettant d'enregistrer une categorie dans la DB, pour l'administrateur
  addSubCategoryToDB(category:Category, newSubCategory:Category){



    const ref = firebase.database().ref(Database.CATEGORIES).child(category.id);

    const subCategoryId = ref.push().key;

    return ref.child(subCategoryId).set({
      name: newSubCategory.name
    }).then(
      ()=>{
        this.categories.find(cat => cat.id === category.id).subCategories.push(newSubCategory);
        return newSubCategory;
      });
  }

  // Methode permettant de créer une nouvelle catégorie -- pour l'administrateur
  createNewCategory(newCategory:Category){

    this.categories.push(newCategory);
    this.addCategoriesToDB();
    this.emitCategories();
  }

  getCategoriesFromDB(){
    
    console.log('getCategoriesFromDB CategoryService');

    return firebase.database().ref(Database.CATEGORIES).once('value').then( 
      (data) => {
        console.warn('getCategoriesFromDB CategoryService', data);
        let catArray = [];
        data.forEach((element) => {
          console.log(element.key, element.child('name').val());

          let subCatArray = [];
          element.forEach((subElement) => {
              if(subElement.hasChild('name')) {
                console.log(element.key, subElement.child('name').val());

                subCatArray.push(new Category(subElement.key, 
                                              subElement.child('name').val(), 
                                              []));
  
                console.warn('sub category subCatArray :', subCatArray);
              }
          });

          catArray.push(new Category(element.key, 
                                     element.child('name').val(), 
                                     subCatArray));
        });

        this.categories = Array.from(catArray);
        
        this.emitCategories();
        console.log(data.val());

        return Array.from(this.categories);
      }
    );
  }

  public static getSingleCategoryBySubCategoryId(subCategoryId:string){

    const db =  firebase.database();
    const categoryDB =  db.ref(Database.CATEGORIES);


    return new Promise((resolve, reject) => {
      categoryDB.orderByKey()
                .on('child_added',
          (snap) => {
            snap.forEach(elm => {
              if(elm.key === subCategoryId){
                categoryDB.off();  
                let cat: Category = new Category(snap.key, snap.val()['name'], []);
                cat.subCategories.push(new Category(elm.key, elm.val()['name'], []));
                resolve(cat);        
              } 
            });
            //reject(false); 
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
    this.addCategoriesToDB();
    this.emitCategories();
  }


  /**
   * Cette method permet d'enregistrer une categorie dans la base de données,
   * avec la ref (le lieu de d'enregistrement) et la categorie (Category)
   */
  public static addCategoryWithReference(ref:firebase.database.Reference, category:Category){

    return ref.child(Database.CATEGORY).child(category.id).set({
      name:category.name
    }).then(
      () => {
        return ref.child(Database.CATEGORY).child(category.id).child('sub_category')
                                                              .child(category.subCategories[0].id)
                                                              .set({
          name:category.subCategories[0].name
        }).then(
          () => {
            return true;
          }
        );
    }).catch(function(error) {
      console.log(error);
        return false;
    });
  }
}