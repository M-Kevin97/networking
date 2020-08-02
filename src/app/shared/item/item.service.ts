import { RatingService } from './../rating/rating.service';
import { Rating } from './../rating/rating';
import { ICourse } from './course';
import { CategoryService } from 'src/app/shared/item/category/category.service';
import { UserService } from './../user/user.service';
import { Item } from './item';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject, concat } from 'rxjs';
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
  private _lastItemSaved: Item = null;

  public get lastItemSaved(): Item {
    return this._lastItemSaved;
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

  private saveNewCourseToDB(newCourse: Course) {

    var ref = firebase.database().ref(Database.COURSES);

    const id = ref.push().key;
    ref = firebase.database().ref(Database.COURSES).child(id);
    newCourse.id = id;

    this._lastItemSaved = newCourse;

    console.log('saveNewCourseToDB :',id, this._lastItemSaved.id);

    return ref.set({
      title: newCourse.title,
      description: newCourse.description,
      price: newCourse.price, 
      creationDate: newCourse.creationDate,
      imageLink: newCourse.imageLink,
      videoLink: newCourse.videoLink,
      published: newCourse.published,
      catchPhrase: newCourse.catchPhrase,
      skillsToAcquire: newCourse.skillsToAcquire,
    }).then(
      () => {
        CategoryService.saveCategoryWithReference(ref, newCourse.category).then(
          (bool) => {
            // si la category a été sauvegardée
            if(bool) {
              // si la les auteurs n'ont pas été sauvegardés
              if(!UserService.saveAuthorsWithReference(ref, newCourse.authors)) {
                return newCourse;
              }
            // si la category n'a pas été sauvegardée
            } else {
              return false;
            }
        });
        return newCourse;
      }
    ).catch(
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  private saveNewEventToDB(newEvent: EventItem) {

    console.log('saveNewEventToDB',newEvent);

    var ref = firebase.database().ref(Database.EVENTS);

    const id = ref.push().key;
    ref = firebase.database().ref(Database.EVENTS).child(id);
    newEvent.id = id;

    this._lastItemSaved = newEvent;

    console.log('saveNewEventToDB', newEvent);

    return ref.set({
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
    }).then(
      () => {
        CategoryService.saveCategoryWithReference(ref, newEvent.category).then(
          (bool) => {
            // si la category a été sauvegardée
            if(bool) {
              // si la les auteurs n'ont pas été sauvegardés
              if(!UserService.saveAuthorsWithReference(ref, newEvent.authors)) {
                return newEvent;
              }
            // si la category n'a pas été sauvegardée
            } else {
              return false;
            }
        });
        return newEvent;
      }
    ).catch(
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  private saveItemsToDB(){
    var ref = firebase.database().ref('/items');
    ref.set(this.items);
  } 

  createNewEvent(newEvent:EventItem){
    //this.items.push(newItem);
    return this.saveNewEventToDB(newEvent);
    //this.saveItemsToDB();
    //this.emitItems();
  }

  createNewCourse(newCourse:Course){
    //this.items.push(newItem);

    return this.saveNewCourseToDB(newCourse);

    //this.saveItemsToDB();
    //this.emitItems();
  }

  private updateItemPrimaryInfoInDB(item:Item, ref:firebase.database.Reference){ 

    ref.update({
      title: item.title,
      price: item.price, 
      imageLink: item.imageLink,
      videoLink: item.videoLink,
      catchPhrase:item.catchPhrase,
    }).then(
      () => {
        this.updateItemPrimaryInfoInAuthorsDB(item, ref);
    });
  }

  private updateItemPrimaryInfoInAuthorsDB(item:Item, ItemRef:firebase.database.Reference) {

    if(item.authors){

      var itemRef:string;

      if(ItemRef.toString().includes(Database.COURSES)) {
        itemRef = Database.COURSES;
      }
      else if(ItemRef.toString().includes(Database.EVENTS)) {
        itemRef = Database.EVENTS;
      }

      item.authors.forEach(function (value) {
        console.log('updateCoursePrimaryInfoInDB', value, item);
        if(value){
         
            var refAuthors = firebase.database()
            .ref(Database.USERS)
            .child(value.id)
            .child(itemRef).child(item.id);
          
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

  updateCoursePrimaryInfoInDB(course:Course){

    var ref = firebase.database().ref(Database.COURSES).child(course.id);
    this.updateItemPrimaryInfoInDB(course, ref);   
  }

  updateEventPrimaryInfoInDB(event:EventItem){

    var ref = firebase.database().ref(Database.EVENTS).child(event.id);
    this.updateItemPrimaryInfoInDB(event, ref);   
  }

  private updateItemDescriptionInDB(item:Item, ref:firebase.database.Reference) {

    ref.update({
      description: item.description
    });
  }

  updateCourseDescriptionInDB(course:Course){

    var ref = firebase.database().ref(Database.COURSES).child(course.id);
    this.updateItemDescriptionInDB(course, ref);
  }

  updateEventDescriptionInDB(event:EventItem){

    var ref = firebase.database().ref(Database.EVENTS).child(event.id);
    this.updateItemDescriptionInDB(event, ref);
  }

  updateSkillsToAcquireInDB(course:Course){

    var ref = firebase.database().ref(Database.COURSES).child(course.id);
    
    ref.update({
      skillsToAcquire: course.skillsToAcquire
    });
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

  getCoursesFromDB(){
    
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref(Database.COURSES).once('value').then(
          (data) => {
              resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  getCoursesOfAuthenticatedUser(){
    
  }

  getCoursesByName(title:string){
    return firebase.database().ref(Database.COURSES)
                              .orderByChild('title')
                              .equalTo(title)
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

  getCoursesByCategory(category:Category){

    return firebase.database().ref(Database.COURSES)
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

  getSingleCourseFromDBWithId(id:string){
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref(Database.COURSES).child(id).once('value').then(
          (data) => {
              resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  getSingleEventFromDBWithId(id:string){
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref(Database.EVENTS).child(id).once('value').then(
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
        CategoryService.saveCategoryWithReference(ref, new Category('rtre','nnr')).then(
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
        
        var refAuthors = ref.child(value.id).child(Database.COURSES).child(course.id);

        refAuthors.set({
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