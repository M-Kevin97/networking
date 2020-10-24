import { Chapter } from 'src/app/shared/model/item/chapter';
import { Module } from './../../model/item/module';
import { Item } from 'src/app/shared/model/item/item';
import { Course, ICourse } from 'src/app/shared/model/item/course';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { Database } from 'src/app/core/database/database.enum';
import { Category } from '../../model/category/category';
import { EventItem, IEvent } from '../../model/item/event-item';
import { IUser, User } from '../../model/user/user';
import { CategoryService } from '../category/category.service';
import { UserService } from '../user/user.service';
import { View } from '../../model/item/click';


@Injectable({
  providedIn: 'root'
})
export class ItemService {

  items:Item[] = [];
  itemsSubject = new Subject<Item[]>();
  itemSubject = new Subject<Item>();

  // Cet attribut sert à récupérer l'id du dernier Item créé
  private _lastItemCreated: Item = null;

  private db = firebase.database().ref();
  private itemsDB = this.db.child(Database.ITEMS);
  private itemsViewDB = this.db.child(Database.ITEMS_VIEW);


  public get lastItemCreated(): Item {
    return this._lastItemCreated;
  }

  constructor() {
    //this.getItemsFromDB();
   }

  // ----------------------------- Emit ------------------------------
  emitItems(){
    this.itemsSubject.next(this.items);
  }

  emitItem(item:Item){
    this.itemSubject.next(item);
  }

  // ----------------------------- ADD IN DB ------------------------------

  addNewCourseInDBByAdmin(newCourse:Course): Promise<Course> {

    const id = this.itemsDB.push().key;
    let ref = this.itemsDB.child(id);
    newCourse.id = id;

    this._lastItemCreated = newCourse;

    newCourse.searchContent = this.setSearchContent(newCourse);

    return ref.set({
      type: Database.COURSE.substr(1),
      data: newCourse.data,
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
      category: newCourse.category.id,
      subCategory: newCourse.category.subCategories ? newCourse.category.subCategories[0].id : '',
    }).then(
      () => {
        let i = 0;

        newCourse.iAuthors.forEach(function (user) {

          console.error(' newCourse.iAuthors.forEach(', user.id);

          // si la les auteurs n'ont pas été sauvegardés
          let savepr:Promise<any>;
          if(!i) savepr = UserService.addUserIdByReference(ref, user, i);
          else savepr = UserService.updateUserIdByReference(ref, user, i);

          savepr.then
          (
            () => {
              if(!UserService.addItemIdInAuthorDB(newCourse, user.id)) {
                return newCourse;
              } else return null;
            }
          );
          i++;
        });
      }).catch(
      (error) => {
        console.log(error);
        return null;
      }
    );
  }

  addNewItemToDB(newItem:Course | EventItem): Promise<Course | EventItem> {

    const id = this.itemsDB.push().key;
    let ref = this.itemsDB.child(id);
    newItem.id = id;

    this._lastItemCreated = newItem;

    newItem.searchContent = this.setSearchContent(newItem);

    let savePromise = null;
    if(newItem instanceof Course) 
      savePromise = this.addNewCourseToDB(ref, newItem);
    else if(newItem instanceof EventItem)
      savePromise = this.addNewEventToDB(ref, newItem);
    else 
      return null;

    return savePromise.then(
      () => {
        let i = 0;
        newItem.iAuthors.forEach(function (user) {
          // si la les auteurs n'ont pas été sauvegardés
          UserService.addUserIdByReference(ref, user, i).then
          (
            () => {
              if(!UserService.addItemIdInAuthorDB(newItem, user.id)) {
                return newItem;
              } else return null;
            }
          );
          i++;
        });

      }).catch(
      (error) => {
        console.log(error);
        return null;
      }
    );
  }

  private addNewCourseToDB(ref:firebase.database.Reference, newCourse: Course) {

    console.log('saveNewCourseToDB :',newCourse.id, newCourse);

    return ref.set({
      type: Database.COURSE.substr(1),
      data: false,
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
      category: newCourse.category.id,
      subCategory: newCourse.category.subCategories ? newCourse.category.subCategories[0].id : '',
    });
  }

  private addNewEventToDB(ref:firebase.database.Reference, newEvent: EventItem) {

    console.log('saveNewEventToDB',newEvent);

    return ref.set({
      type: Database.EVENT.substr(1),
      data: false,
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

  addItemIdInAuthorDB(item:Course|EventItem, idUser:string){

    if(item) {
      
      console.log('addCourseInAuthorDB', item.iAuthors[0]);

      var ref = firebase.database().ref(Database.USERS).child(idUser)
                                                       .child(Database.ITEMS)
                                                       .child(item.id);
      let type = '';
      if(item instanceof Course) type = Database.COURSE.substr(1);
      else if(item instanceof EventItem) type = Database.EVENT.substr(1);

      return ref.set({
          type: type,
      }).then(
        () => {
         return true;
        },
        (error) => {
          return false;
        }
      );
    }
  }

  public static addIEventWithReference(ref:firebase.database.Reference, iEvent:IEvent){

    console.log('saveIEventWithReference', iEvent);

    return ref.set({
          type: Database.EVENT.substr(1),
          title: iEvent.title, 
          imageLink: iEvent.imageLink,
          price:iEvent.price,
          published: iEvent.published,
          location:iEvent.location,
          dates:iEvent.dates,
      }).then(
      () => {
        console.log('saveIEventWithReference - category', iEvent.category, ref.toString());
        CategoryService.addCategoryWithReference(ref, iEvent.category).then(
          (bool) => {
          // si la category n'a pas été sauvegardée retourner false
         if(!bool) {
            console.log('category pas enregistré');
            return false
        }
        // si la les auteurs n'ont pas été sauvegardés
        if(!UserService.addAuthorsWithReference(ref, iEvent.iAuthors)) {
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

  public static addIEventsWithReference(ref:firebase.database.Reference, iEvents:IEvent[]){
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

  public static addICourseWithReference(ref:firebase.database.Reference, iCourse:ICourse){

    return ref.child(iCourse.id).set({
        type:Database.COURSE.substr(1),
        title: iCourse.title, 
        price: iCourse.price,
        imageLink :iCourse.imageLink,
        published:iCourse.published,
    }).then(
      () => {
        CategoryService.addCategoryWithReference(ref, iCourse.category).then(
          (bool) => {

         // si la category n'a pas été sauvegardée retourner false
         if(!bool) {
          return false
        }
        // si la les auteurs n'ont pas été sauvegardés
        if(!UserService.addAuthorsWithReference(ref, iCourse.iAuthors)) {
            return false;
        }

        return true;
      });
    });
  }

  addItemClick(itemId:string, newView:View, cb) {

    let ref = this.itemsViewDB.child(itemId);
    let clickId = ref.push().key;

    ref.child(clickId).set({
      date:newView.date,
      user:newView.user.id,
      hour:newView.heure,

    }).then(cb);
  }

  // ----- Course Modules

  addCourseContent(newModules:Module[], courseId:string, cb) {

    var promises = [];

    newModules.forEach((module) => {

      promises.push(
        new Promise((resolve) => {
          //asyncFunction(item, resolve);
          let ref = this.itemsDB.child(courseId).child(Database.MODULES);

          this.addModuleWithReference(ref,module).then(
            (mod:Module) => {

              this.addChaptersWithReference(ref, mod,
                (chapters:Chapter[]) => {
                  mod.chapters = chapters;
                  resolve(mod);
                }
              );
            }
          );
        })
      )
    });

    Promise.all(promises).then((val:Module[]) => {
      return val; 
    }).then(cb)
    .catch(
      (error) => {
        console.error(error);
        return null;
      }
    );
  }

  private addModuleWithReference(ref:firebase.database.Reference, newModule:Module) {

    return new Promise(
      (resolve, reject) => {
        if(!ref || !newModule) reject();

        newModule.id = ref.push().key;
    
        ref.child(newModule.id).set({

          title: newModule.title,
          description: newModule.description
        }).then(
          () => {
            resolve(newModule);
          }
        );
      }
    );
  }

  // ----- Modules chapter

  private addChaptersWithReference(ref:firebase.database.Reference, newModule:Module, cb) {

    var promises = [];
    let refChapters = ref.child(newModule.id).child(Database.CHAPTERS);
    newModule.chapters.forEach((chapter) => {

      promises.push(
        new Promise((resolve) => {
          //asyncFunction(item, resolve);

          this.addChapterWithReference(refChapters, chapter).then(
            (valOne:Chapter) => {
             resolve(valOne);
            }
          );
        })
      )
    });

    Promise.all(promises).then((val:Chapter[]) => {
      return val; 
    }).then(cb)
    .catch(
      (error) => {
        console.error(error);
        return null;
      }
    );
  }

  private addChapterWithReference(ref:firebase.database.Reference, newChapter:Chapter) {

    return new Promise(
      (resolve, reject) => {
        if(!ref || !newChapter) reject();

        newChapter.id = ref.push().key;
    
        ref.child(newChapter.id).set({
          title: newChapter.title
        }).then(
          ()=>{
            resolve(newChapter);
          }
        );
      }
    );
  }

  // ----------------------------- GET FROM DB ------------------------------

  getItemsFromDB(cb){

    this.itemsDB.on('child_added', (snapshot) => {

      this.getSingleItemFromJSONById(snapshot, cb);
    });
  }

  getItemsByUserId(id:string){
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

  getSingleItemFromDBById(id:string, cb){

    return this.itemsDB.child(id).once('value').then(
      (data) => {
          return this.getSingleItemFromJSONById(data, cb);
      }
    );
  }

  private async getSingleItemFromJSONById(itemJson, cb){
  
    let item:Course|EventItem = null;

    if(itemJson.val()[Database.ITEM_TYPE.substr(1)] === Database.COURSE.substr(1)) 
      item = Course.courseFromJson(itemJson.val());
    else if(itemJson.val()[Database.ITEM_TYPE.substr(1)] === Database.EVENT.substr(1)) 
      item = EventItem.eventFromJson(itemJson.val());

      if(item) {

        item.id = itemJson.key;
    
        const usersJson:string = itemJson.val()[Database.USERS.substring(1)];
        const subCatId:string = itemJson.val()[Database.SUB_CATEGORY.substring(1)];

        let requests = Object.keys(usersJson).map((key) => {
        return new Promise((resolve) => {
          //asyncFunction(item, resolve);
          UserService.getSingleiUserFromDBWithId(key).then(
            (iUser)=> {
              iUser.id = key;
              resolve(iUser)
            }
          );
        });
    });

    CategoryService.getSingleCategoryBySubCategoryId(subCatId).then(
      (val: Category) => {
        item.category = val;
    
        Promise.all(requests).then((val:IUser[]) => {
          item.iAuthors = val;
          return item; 
        }).then(cb)
        .catch(
          (error) => {
            console.error(error);
            return null;
          }
        );
      });
    }

  }

  getItemsByCategory(categoryId:string, cb){

    this.itemsDB.orderByChild(Database.CATEGORY.substr(1, Database.CATEGORY.length))
                   .equalTo(categoryId)
                   .on('child_added', (snap) => { 

      if(snap) this.getSingleItemFromJSONById(snap, cb);
    });
  }

  getItemsBySubCategory(categoryId:string, cb){

    this.itemsDB.orderByChild(Database.SUB_CATEGORY.substring(1))
                .equalTo(categoryId)
                .on('child_added', (snap) => { 

      if(snap) this.getSingleItemFromJSONById(snap, cb);
    });
  }

  // ----------------------------- UPDATE IN DB ------------------------------

  updateItemPrimaryInfoInDB(item:Course | EventItem){ 

    var ref = firebase.database().ref(Database.ITEMS).child(item.id);
    var searchContent :string = '';

    if(item.title)
    searchContent = searchContent.concat(item.title.replace(/[^\wèéòàùì]/gi, ''));
    if(item.getMainiAuthor()) 
    searchContent = searchContent.concat('/', item.getMainiAuthorName().replace(/[^\wèéòàùì]/gi, ''));
    if(item.description) 
    searchContent = searchContent.concat('/', item.description.replace(/[^\wèéòàùì]/gi, ''));
    if(item.catchPhrase) 
    searchContent = searchContent.concat('/', item.catchPhrase.replace(/[^\wèéòàùì]/gi, ''));
    if(item.category) 
    searchContent = searchContent.concat('/', item.category.name.replace(/[^\wèéòàùì]/gi, ''));

    item.searchContent = searchContent.toLocaleLowerCase();

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

    if(item.iAuthors){

      item.iAuthors.forEach(function (value) {
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

  // -------- Modules à faire
  // if exist update else add

  // fonction de mise à jour temporaire
  updateCourseContent(newModules:Module[], courseId:string, cb) {
    this.removeModules(courseId,
      () =>{
        this.addCourseContent(newModules, courseId, cb);
      }
    );
  }

  // updateModulesToCourse(newModules:Module[], courseId:string, cb) {

  //   var promises = [];

  //   newModules.forEach((module) => {

  //     promises.push(
  //       new Promise((resolve) => {
  //         //asyncFunction(item, resolve);
  //         let ref = this.itemsDB.child(courseId).child(Database.MODULES);

  //         this.addModuleWithReference(ref,module).then(
  //           (valOne:Module) => {
  //             this.addChaptersWithReference(ref, valOne,
  //               (module) => {
  //                 resolve(module);
  //               }
  //             );
  //           }
  //         );

  //       })
  //     )
  //   });

  //   Promise.all(promises).then((val:Module[]) => {
  //     return val; 
  //   }).then(cb)
  //   .catch(
  //     (error) => {
  //       console.error(error);
  //       return null;
  //     }
  //   );
  // }

  // private updateModuleWithReference(ref:firebase.database.Reference, newModule:Module) {

  //   return new Promise(
  //     (resolve, reject) => {
  //       if(!ref || !newModule) reject();

  //       newModule.id = ref.push().key;
    
  //       ref.child(newModule.id).set({

  //         title: newModule.title,
  //         description: newModule.description
  //       }).then(
  //         () => {
  //           resolve(newModule);
  //         }
  //       );
  //     }
  //   );
  // }

  // // -------- Chapters à faire
  // if exist update else add

  // private addChaptersWithReference(ref:firebase.database.Reference, newModule:Module, cb) {

  //   var promises = [];
  //   let refChapters = ref.child(Database.CHAPTERS);
  //   newModule.chapters.forEach((chapter) => {

  //     promises.push(
  //       new Promise((resolve) => {
  //         //asyncFunction(item, resolve);

  //         this.addChapterWithReference(refChapters, chapter).then(
  //           (valOne:Chapter) => {
  //            resolve(valOne);
  //           }
  //         );
  //       })
  //     )
  //   });

  //   Promise.all(promises).then((val:Chapter[]) => {
  //     return val; 
  //   }).then(cb)
  //   .catch(
  //     (error) => {
  //       console.error(error);
  //       return null;
  //     }
  //   );
  // }

  // private addChapterWithReference(ref:firebase.database.Reference, newChapter:Chapter) {

  //   return new Promise(
  //     (resolve, reject) => {
  //       if(!ref || !newChapter) reject();

  //       newChapter.id = ref.push().key;
    
  //       ref.child(newChapter.id).set({
  //         title: newChapter.title
  //       }).then(
  //         ()=>{
  //           resolve(newChapter);
  //         }
  //       );
  //     }
  //   );
  // }

  // ----------------------------- REMOVE FROM DB ------------------------------

  // A VOIR
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
    this.emitItems();
  }

  // --- Modules
  removeModules(courseId:string, cb) {

      this.itemsDB.child(courseId)
                  .child(Database.MODULES)
                  .remove()
                  .then(cb);
  }


  // --------------------------------- Other ----------------------------------------

  private setSearchContent(item:Course | EventItem) {

    if(!item) return null

    let searchContent:string = '';

    if(item.title)
      searchContent = searchContent.concat(item.title.replace(/[^\wèéòàùì]/gi, ''));
    if(item.getMainiAuthor()) 
      searchContent = searchContent.concat('/', item.getMainiAuthorName().replace(/[^\wèéòàùì]/gi, ''));
    if(item.description) 
      searchContent = searchContent.concat('/', item.description.replace(/[^\wèéòàùì]/gi, ''));
    if(item.catchPhrase) 
      searchContent = searchContent.concat('/', item.catchPhrase.replace(/[^\wèéòàùì]/gi, ''));
    if(item.category) 
      searchContent = searchContent.concat('/', item.category.name.replace(/[^\wèéòàùì]/gi, ''));

    return searchContent.toLocaleLowerCase();
  }

}