import { ICourse } from './course';
import { CategoryService } from 'src/app/shared/item/category/category.service';
import { UserService } from './../user/user.service';
import { Item } from './item';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { Course } from 'src/app/shared/item/course';
import { EventItem, IEvent } from 'src/app/shared/item/event-item';
import { Database } from 'src/app/core/database/database.enum';
import { Category } from './category/category';


@Injectable({
  providedIn: 'root'
})
export class ItemService {

  items:Item[] = [];
  itemsSubject = new Subject<Item[]>();
  itemSubject = new Subject<Item>();

  // Cet attribut sert à récupérer l'id du dernier Item créé
  private _lastItemCreated: Item = null;
  

  public get lastItemCreated(): Item {
    return this._lastItemCreated;
  }

  constructor() {
    //this.getItemsFromDB();
   }

  emitItems(){
    this.itemsSubject.next(this.items);
  }

  emitItem(item:Item){
    this.itemSubject.next(item);
  }

  createNewItemToDB(newItem:Course | EventItem): Promise<Course | EventItem> {

    var ref = firebase.database().ref(Database.ITEMS);

    const id = ref.push().key;
    ref = ref.child(id);
    newItem.id = id;

    this._lastItemCreated = newItem;

    let searchContent:string = '';
    let savePromise;
  
    if(newItem.title)
      searchContent = searchContent.concat(newItem.title.replace(/[^\wèéòàùì]/gi, ''));
    if(newItem.getMainAuthor()) 
      searchContent = searchContent.concat('/', newItem.getMainAuthorName().replace(/[^\wèéòàùì]/gi, ''));
    if(newItem.description) 
      searchContent = searchContent.concat('/', newItem.description.replace(/[^\wèéòàùì]/gi, ''));
    if(newItem.catchPhrase) 
      searchContent = searchContent.concat('/', newItem.catchPhrase.replace(/[^\wèéòàùì]/gi, ''));
    if(newItem.category) 
      searchContent = searchContent.concat('/', newItem.category.name.replace(/[^\wèéòàùì]/gi, ''));

    newItem.searchContent = searchContent.toLocaleLowerCase();

    if(newItem instanceof Course) 
      savePromise = this.saveNewCourseToDB(ref, newItem);
    else if(newItem instanceof EventItem)
      savePromise = this.saveNewEventToDB(ref, newItem);

    return savePromise.then(
      () => {
        
        CategoryService.saveCategoryWithReference(ref, newItem.category).then(
          (bool) => {
            // si la category a été sauvegardée
            if(bool) {
              // si la les auteurs n'ont pas été sauvegardés
              if(!UserService.saveAuthorsWithReference(ref, newItem.authors)) {
                return newItem;
              }
              else return null;
              // si la category n'a pas été sauvegardée
              } else {
                return null;
              }
          });
          return newItem;
        }
      ).catch(
        (error) => {
          console.log(error);
          return null;
        }
      );
  }

  private saveNewCourseToDB(ref:firebase.database.Reference, newCourse: Course) {

    console.log('saveNewCourseToDB :',newCourse.id, newCourse);

    return ref.set({
      type:'course',
      searchContent: newCourse.searchContent,
      title: newCourse.title,
      description: newCourse.description,
      price: newCourse.price, 
      creationDate: newCourse.creationDate,
      imageLink: newCourse.imageLink,
      videoLink: newCourse.videoLink,
      published: newCourse.published,
      catchPhrase: newCourse.catchPhrase,
      skillsToAcquire: newCourse.skillsToAcquire,
    });
  }

  private saveNewEventToDB(ref:firebase.database.Reference, newEvent: EventItem) {

    console.log('saveNewEventToDB',newEvent);

    return ref.set({
      type:'event',
      searchContent: newEvent.searchContent,
      title: newEvent.title,
      description: newEvent.description,
      price: newEvent.price, 
      creationDate: newEvent.creationDate,
      imageLink: newEvent.imageLink,
      videoLink: newEvent.videoLink,
      published:newEvent.published,
      location:newEvent.location,
      dates:newEvent.dates,
      catchPhrase:newEvent.catchPhrase,
    });
  }

  private saveItemsToDB(){
    var ref = firebase.database().ref(Database.ITEMS);
    ref.set(this.items);
  } 

  updateItemPrimaryInfoInDB(item:Course | EventItem){ 

    var ref = firebase.database().ref(Database.ITEMS).child(item.id);

    if(item.title)
    item.searchContent = item.searchContent.concat(item.title.replace(/[^\wèéòàùì]/gi, ''));
    if(item.getMainAuthor()) 
    item.searchContent = item.searchContent.concat('/', item.getMainAuthorName().replace(/[^\wèéòàùì]/gi, ''));
    if(item.description) 
    item.searchContent = item.searchContent.concat('/', item.description.replace(/[^\wèéòàùì]/gi, ''));
    if(item.catchPhrase) 
    item.searchContent = item.searchContent.concat('/', item.catchPhrase.replace(/[^\wèéòàùì]/gi, ''));
    if(item.category) 
    item.searchContent = item.searchContent.concat('/', item.category.name.replace(/[^\wèéòàùì]/gi, ''));

    item.searchContent = item.searchContent.toLocaleLowerCase();

    ref.update({
      searchContent:item.searchContent,
      title: item.title,
      price: item.price, 
      imageLink: item.imageLink,
      videoLink: item.videoLink,
      catchPhrase:item.catchPhrase,
    }).then(
      () => {
        this.updateItemPrimaryInfoInAuthorsDB(item);
    });
  }

  private updateItemPrimaryInfoInAuthorsDB(item:Course | EventItem) {

    if(item.authors){

      item.authors.forEach(function (value) {
        console.log('updateCoursePrimaryInfoInDB', value, item);
        if(value){
         
            var refAuthors = firebase.database()
            .ref(Database.USERS)
            .child(value.id)
            .child(Database.ITEMS)
            .child(item.id);
          
          refAuthors.update({
              title: item.title, 
              price:item.price, 
              imageLink :item.imageLink,
              published:item.published,
          });
        } 
      });
    }
  }

  updateItemDescriptionInDB(item:Course | EventItem) {

    var ref = firebase.database().ref(Database.ITEMS).child(item.id);
    ref.update({
      description: item.description
    });
  }

  updateSkillsToAcquireInDB(course:Course){

    var ref = firebase.database().ref(Database.ITEMS).child(course.id);
    
    ref.update({
      skillsToAcquire: course.skillsToAcquire
    });
  }

  getItemsFromDB(){
    return firebase.database().ref(Database.ITEMS)
                              .orderByKey()
                              .once('value')
                              .then(
      (snapshot) => {

        console.error('lezmnez________',snapshot.val());

        if(snapshot){
          return (snapshot.val());
        }
      })
      .catch(
        (error) => {
          console.error(error);
        }
      );
  }

  getItemByCategory(category:Category){

    return firebase.database().ref(Database.ITEMS)
                              .orderByChild('category/'+category.id+'/name')
                              .equalTo(category.name)
                              .once('value')
                              .then(
      (snapshot) => {
        if(snapshot){
          return (snapshot.val());
        }
      })
      .catch(
        (error) => {
          console.error(error);
        }
      );
  }

  getItemsOfUserByUserId(id:string){
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref(Database.USERS).child(id).child(Database.ITEMS.substr(1)).once('value').then(
          (data) => {
              resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  getSingleItemFromDBById(id:string){
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref(Database.ITEMS).child(id).once('value').then(
          (data) => {
              resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
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

  public static saveIEventWithReference(ref:firebase.database.Reference, iEvent:IEvent){

    console.log('saveIEventWithReference', iEvent);

    return ref.set({
          title: iEvent.title, 
          imageLink: iEvent.imageLink,
          price:iEvent.price,
          published: iEvent.published,
          location:iEvent.location,
          dates:iEvent.dates,
      }).then(
      () => {
        console.log('saveIEventWithReference - category', iEvent.category, ref.toString());
        CategoryService.saveCategoryWithReference(ref, iEvent.category).then(
          (bool) => {
          // si la category n'a pas été sauvegardée retourner false
         if(!bool) {
            console.log('category pas enregistré');
            return false
        }
        // si la les auteurs n'ont pas été sauvegardés
        if(!UserService.saveAuthorsWithReference(ref, iEvent.authors)) {
            return false;
        }
      }).then(
      function() {
        return true;
    }).catch(function(error) {
      console.log(error);
        return false;
      });
      return true;
    });
  }

  public static saveIEventsWithReference(ref:firebase.database.Reference, iEvents:IEvent[]){
    var saved : boolean = true;

    iEvents.forEach(function (value) {

      if(saved){
        this.saveIEventWithReference(ref,value).then(
          function() {
            saved = true;
        }).catch(function(error) {
          console.log(error);
          saved = false;
        });
      }
    }); 

    return saved;
  }

  public static saveICourseWithReference(ref:firebase.database.Reference, iCourse:ICourse){

    return ref.child(iCourse.id).set({
        type:'course',
        title: iCourse.title, 
        price: iCourse.price,
        imageLink :iCourse.imageLink,
        published:iCourse.published,
    }).then(
      () => {
        CategoryService.saveCategoryWithReference(ref, iCourse.category).then(
          (bool) => {

         // si la category n'a pas été sauvegardée retourner false
         if(!bool) {
          return false
        }
        // si la les auteurs n'ont pas été sauvegardés
        if(!UserService.saveAuthorsWithReference(ref, iCourse.authors)) {
            return false;
        }

        return true;
      });
    });
  }

  public static saveICoursesWithReference(ref:firebase.database.Reference, iCourses:ICourse[]){
    var saved : boolean = true;

    iCourses.forEach(function (value) {

      if(saved){
        this.saveICourseWithReference(ref,value).then(
          function() {
            saved = true;
        }).catch(function(error) {
          console.log(error);
          saved = false;
        });
      }
    }); 
    
    return saved;
  }

  public saveCourseInAuthorsDB(course:Course, idAuthorAuth:string){

    if(course) {
      
      console.log('saveCourseInAuthorsDB', course.authors);

      var ref = firebase.database().ref(Database.USERS);

      course.authors.forEach(function (value) {
        console.log('saveCourseInAuthorsDB',value); 
        
        var refAuthors = ref.child(value.id).child(Database.ITEMS).child(course.id);

        refAuthors.set({
          type:'course',
          title: course.title, 
          price:course.price, 
          imageLink :course.imageLink,
          published:course.published,
      }).then(
        () => {
          CategoryService.saveCategoryWithReference(refAuthors, course.category).then(
            (bool) => {
  
              // si la category a été sauvegardée
              //return bool;
  
              // si la category a été sauvegardée
              if(bool) {
                if(UserService.saveAuthorsWithReferenceAndAuthID(refAuthors, course.authors, idAuthorAuth)) {
                    return true;
               }
                // si la les auteurs n'ont pas été sauvegardés
                else {
                  return false;
                }
              // si la category n'a pas été sauvegardée
             } else {
                return false;
              }
          });
        }
      );
      });
    }
  }

  public saveEventInAuthorsDB(event:EventItem, idAuthorAuth:string){

    if(event) {
      
      console.log('saveEventInAuthorsDB', event.authors);

      var ref = firebase.database().ref(Database.USERS);

      event.authors.forEach(function (value) {
        console.log('saveCourseInAuthorsDB',value); 
        
        var refAuthors = ref.child(value.id).child(Database.EVENTS).child(event.id);

        refAuthors.set({
          type:'event',
          title: event.title, 
          imageLink :event.imageLink,
          location: event.location,
          published:event.published,
          dates:event.dates,
      }).then(
        () => {
          CategoryService.saveCategoryWithReference(refAuthors, event.category).then(
            (bool) => {
  
              // si la category a été sauvegardée
              //return bool;
  
              // si la category a été sauvegardée
              if(bool) {
                if(UserService.saveAuthorsWithReferenceAndAuthID(refAuthors, event.authors, idAuthorAuth)) {
                    return true;
               }
                // si la les auteurs n'ont pas été sauvegardés
                else {
                  return false;
                }
              // si la category n'a pas été sauvegardée
             } else {
                return false;
              }
          });
        }
      ).then(
        function() {
          return true;
      }).catch(function(error) {
        console.log(error);
          return false;
        });
      });
    }
  }
}