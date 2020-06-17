import { Item } from './item';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { Course } from 'src/app/search/modules/items/courses/shared/course';
import { EventItem } from 'src/app/search/modules/items/events/shared/event-item';


@Injectable({
  providedIn: 'root'
})
export class ItemService {

  items:Item[] = [];
  itemsSubject = new Subject<Item[]>();

  constructor() {
    this.getItemsFromDB();
   }

  emitItems(){
    this.itemsSubject.next(this.items);
  }

  saveItemToDB(item: Item) {

    console.log('image Link :', item.imageLink);

    var ref;

    if(item instanceof Course){
      ref = firebase.database().ref('/items/courses');
      
    }
    else if(item instanceof EventItem){
      ref = firebase.database().ref('/items/events');
    }
    else {
      ref = firebase.database().ref('/items');
    }

    const id = ref.push().key;

    ref.child(id).set({
      title: item.title,
      description: item.description,
      price: item.price, 
      imageLink: item.imageLink,
      videoLink: item.videoLink
    }).then(
      () => {
        ref.child(id).child('categories').child(item.category.id).set({
          categoryName:item.category.name
        });
      }
    ).then(
      () => {
        ref.child(id).child('authors').child(item.idAuthor).set({
          firstnameAuthor: item.firstnameAuthor,
          lastnameAuthor: item.lastnameAuthor,
        });
      }
    );
  }

  saveItemsToDB(){
    var ref = firebase.database().ref('/items');
    ref.set(this.items);
  } 

  getItemsFromDB(){
    firebase.database().ref('/items').on('value', 
      (data) => {
        this.items = data.val() ? data.val() : [];
        this.emitItems();
        console.log(data.val());
      }
    );
  }

  getCoursesOfAuthenticatedUser(){
    
  }

  getSingleItemFromDB(id:number){
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/items'+id).once('value').then(
          (data) => {
              resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewItem(newItem:Item){
    //this.items.push(newItem);
    this.saveItemToDB(newItem);
    //this.saveItemsToDB();
    //this.emitItems();
  }

  removeItem(item:Item){
    if(item.imageLink){
      const storageRef =  firebase.storage().refFromURL(item.imageLink);
      storageRef.delete().then(
        () => {
          console.log('Photo supprimée');
        }
      ).catch(
        (error) => {
          console.log('fichier non trouvé : ', error);
        }
      );
    }

    const itemIndexToRemove = this.items.findIndex(
      (itemEl) => {
        if(itemEl === item) {
          return true;
        }
      }
    );
    this.items.splice(itemIndexToRemove, 1);
    this.saveItemsToDB();
    this.emitItems();
  }

}