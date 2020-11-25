import { TagService } from './../tag/tag.service';
import { EventItem, IEvent } from 'src/app/shared/model/item/event-item';
import { RatingService } from 'src/app/shared/service/rating/rating.service';
import { Rating } from 'src/app/shared/model/rating/rating';
import { Chapter } from 'src/app/shared/model/item/chapter';
import { Module } from './../../model/item/module';
import { IItem, Item } from 'src/app/shared/model/item/item';
import { Course } from 'src/app/shared/model/item/course';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { Database } from 'src/app/core/database/database.enum';
import { Category } from '../../model/category/category';
import { IUser, User } from 'src/app/shared/model/user/user';
import { CategoryService } from '../category/category.service';
import { UserService } from '../user/user.service';
import { View } from '../../model/item/view';
import { Tag } from '../../model/tag/tag';


@Injectable({
  providedIn: 'root'
})
export class
ItemService {

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
      prerequisites: newCourse.prerequisites,
      category: newCourse.category.id,
      consultationLink: newCourse.consultationLink,
      subCategory: newCourse.category.subCategories ? newCourse.category.subCategories[0].id : '',
    }).then(
      () => {
        let i = 0;

        newCourse.iAuthors.forEach(function (user) {

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
        console.error(error);
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

        // add tags in item DB
        TagService.addTagsWithReference(ref, newItem.tags).catch(
          (error) => {
            console.error(error);
            return null;
          }
        );

      }
    ).catch(
      (error) => {
        console.error(error);
        return null;
      }
    );
  }

  private addNewCourseToDB(ref:firebase.database.Reference, newCourse: Course) {

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
      prerequisites: newCourse.prerequisites,
      category: newCourse.category ? newCourse.category.id : '',
      subCategory: newCourse.category && newCourse.category.subCategories ? newCourse.category.subCategories[0].id : '',
      consultationLink: newCourse.consultationLink,
    });
  }

  private addNewEventToDB(ref:firebase.database.Reference, newEvent: EventItem) {

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
      consultationLink: newEvent.consultationLink,
    });
  }

  addItemIdInAuthorDB(item:Course|EventItem, idUser:string){

    if(item) {

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
        CategoryService.addCategoryWithReference(ref, iEvent.category).then(
          (bool) => {
          // si la category n'a pas été sauvegardée retourner false
         if(!bool) {
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
      console.error(error);
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
          console.error(error);
          saved = false;
        });
      }
    }); 

    return saved;
  }

  public static addICourseWithReference(ref:firebase.database.Reference, iCourse:IItem){

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

  addItemView(itemId:string, newView:View, cb) {

    let ref = this.itemsViewDB.child(itemId);
    let viewId = ref.push().key;

    ref.child(viewId).set({
      date:newView.date,
      user:newView.user.id,
      hour:newView.heure,

    }).then(cb);
  }

  // ----- Course Modules

  addCourseContent(newModules:Module[], courseId:string, cb, error) {

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
      );
    });

    Promise.all(promises).then((val:Module[]) => {
      return val; 
    }).then(cb)
    .catch(error);
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

  // ----- Modules & Chapters

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

  // ----- Tags
  addTags(itemId:string, newTags:Tag[], cb, error) {

    if(itemId && newTags && newTags.length){

      TagService.addTagsWithReference(this.itemsDB.child(itemId), newTags).then(cb).catch(error);
    }
  }

   // ----- Skills to acquire
   addSkills(itemId:string, newSkills:string[], cb, error) {

    let ref = this.itemsDB.child(itemId);

    ref.update({
      skillsToAcquire:  newSkills,
    }).then(cb)
    .catch(error);

  }


   // ----- Prerequisites
   addPrerequisites(itemId:string, newPrerequisites:string[], cb, error) {

    let ref = this.itemsDB.child(itemId);

    ref.update({
      prerequisites:  newPrerequisites,
    })
    .then(cb)
    .catch(error);
  }

  // ----------------------------- GET FROM DB ------------------------------

  getItemsFromDB(cb){

    this.itemsDB.on('child_added', (snapshot) => {

      this.getSingleItemFromJSONByIdWithTags(snapshot, cb);
    });
  }

  getSingleItemFromDBById(id:string, cb){

    return this.itemsDB.child(id).once('value').then(
      (data) => {
          //return this.getSingleItemFromJSONById(data, cb);
          return this.getSingleItemFromJSONByIdWithTags(data, cb);
      }
    );
  }


  private async getSingleItemFromJSONByIdWithTags(itemJson, cb){
  
    let item:Course|EventItem = null;

    if(itemJson.val()[Database.ITEM_TYPE.substr(1)] === Database.COURSE.substr(1)) 
      item = Course.courseFromJson(itemJson.val());
    else if(itemJson.val()[Database.ITEM_TYPE.substr(1)] === Database.EVENT.substr(1)) 
      item = EventItem.eventFromJson(itemJson.val());

    if(item) {

      item.id = itemJson.key;
  
      const usersJson:string = itemJson.val()[Database.USERS.substring(1)];
      const ratingsJson:string = itemJson.val()[Database.RATINGS.substring(1)];

      let requestUsers = Object.keys(usersJson).map((key) => {
        return new Promise((resolve) => {
          //asyncFunction(item, resolve);
          UserService.getiUserFromDBWithId(key).then(
            async (iUser:IUser)=> {
              iUser.id = key;

              if(iUser.itemId && iUser.itemId.length) {

                await this.getiItemsByIUser(iUser, true);
              }
              // if(userItemsJson) {

              //   this.joinItemsByJSON(userItemsJson, (valItems)=>{
              //     iUser.iCourses = valItems;
              //     console.error('userItemsJson', valItems);
              //     resolve(iUser);
  
              //   }, (error)=>{});
              // }

              resolve(iUser);
            }
          );
        });
      });


      Promise.all(requestUsers).then(
        (valUsers:IUser[]) => {
          item.iAuthors = valUsers;
          return item; 
        }
      ).then(
        (val:Course | EventItem) => {

          if(ratingsJson && val instanceof Course) {

            let course:Course = val;

            return RatingService.getRatingsFromJSON(ratingsJson, course.getICourse(), null).then(
              (valRatings:Rating[])=> {

                course.ratings = valRatings;
                course.globalNote = Rating.getGlobalNote(valRatings);

                return course;
              }
            );

          } else return val; 
        }
      ).catch(
        (error) => {
          console.error(error);
          return null;
        }
      ).then(cb);
    }
  }

  public async getiItemsByIUser(iUser:IUser, isPublished?:boolean) {

    console.warn('isPublished', isPublished);

    if(iUser && iUser.itemId && iUser.itemId.length) {

      let requestItems = Object.keys(iUser.itemId).map((i) => {
  
        return this.getiItemFromDBWithId(iUser.itemId[i]).then(
          (iItem: IItem) => {
            if(iItem) {
            
              iItem.iAuthors = [iUser];

              return iItem;
            }
          }
        );
      });
  
      return await Promise.all(requestItems).then(
        (val:IItem[]) => {

          if(val && val.length) {

            iUser.iCourses = val.filter(
              (item) => {
                
                if(isPublished !== null && isPublished !== undefined) {

                  return item.published === isPublished && item.type === Database.COURSE.substr(1);
                } else return item.type === Database.COURSE.substr(1);
              }
            );

            iUser.iEvents = val.filter(
              (item) => {
                if(isPublished !== null && isPublished !== undefined) {

                  return item.published === isPublished && item.type === Database.EVENT.substr(1);
                } else return item.type === Database.EVENT.substr(1);
              }
            );

            return iUser; 

          } else null;
        }
      );
    }
  }

  public static async getiItemsByIUser(iUser:IUser, itemType:string) {

    if(iUser && iUser.itemId && iUser.itemId.length) {

      let requestItems = Object.keys(iUser.itemId).map((i) => {
  
        return this.getiItemFromDBWithId(iUser.itemId[i]).then(
          (iItem: IItem) => {
            if(iItem) {
              iItem.iAuthors = [iUser];
              return iItem;
            }
          }
        );
      });
  
      return await Promise.all(requestItems).then(
        (val:IItem[]) => {
          if(val && val.length) {
            if(itemType && itemType.length) {
              return val.filter(item => item.type === itemType);
            } else val;
          } else null;
        }
      );
    }
  }

  private async getSingleItemFromJSONById(itemJson, cb, error){
  
    let item:Course|EventItem = null;

    if(itemJson.val()[Database.ITEM_TYPE.substr(1)] === Database.COURSE.substr(1)) 
      item = Course.courseFromJson(itemJson.val());
    else if(itemJson.val()[Database.ITEM_TYPE.substr(1)] === Database.EVENT.substr(1)) 
      item = EventItem.eventFromJson(itemJson.val());

    if(item) {

      item.id = itemJson.key;
  
      const usersJson:string = itemJson.val()[Database.USERS.substring(1)];
      const ratingsJson:string = itemJson.val()[Database.RATINGS.substring(1)];
      const subCatId:string = itemJson.val()[Database.SUB_CATEGORY.substring(1)];

      let requestUsers = Object.keys(usersJson).map((key) => {
        return new Promise((resolve) => {
          //asyncFunction(item, resolve);
          UserService.getiUserFromDBWithId(key).then(
            (iUserJson)=> {

              let iUser = User.iUserFromJson(iUserJson);
              iUser.id = key;

              const userItemsJson:string = iUserJson[Database.ITEMS.substring(1)];

              this.joinItemsByJSON(userItemsJson, (valItems)=>{
                iUser.iCourses = valItems;
                resolve(iUser);

              }, error);
            }
          );
        });
      });

      CategoryService.getSingleCategoryBySubCategoryId(subCatId).then(
        (valCategory: Category) => {
          item.category = valCategory;
          return item;
        }
      ).then(
        (val) => {

          return Promise.all(requestUsers).then((valUsers:IUser[]) => {
            val.iAuthors = valUsers;
            return val; 
          })
          .catch(error);
        }
      ).then(
        (val:Course | EventItem) => {

          if(ratingsJson && val instanceof Course) {

            let course:Course = val;

            return RatingService.getRatingsFromJSON(ratingsJson, course.getICourse(), null).then(
              (valRatings:Rating[])=> {

                course.ratings = valRatings;
                course.globalNote = Rating.getGlobalNote(valRatings);

                return course;
              }
            );

          } else return val; 
        }
      ).then(cb);
    }
  }

  getItemsByTag(tag:Tag, cb){

    this.itemsDB.orderByChild(Database.TAGS.substr(1))
                   .equalTo(tag.id)
                   .on('child_added', (snap) => { 

      if(snap) this.getSingleItemFromJSONByIdWithTags(snap, cb);
    });
  }

  // getItemsByCategory(categoryId:string, cb){

  //   this.itemsDB.orderByChild(Database.CATEGORY.substr(1))
  //                  .equalTo(categoryId)
  //                  .on('child_added', (snap) => { 

  //     if(snap) this.getSingleItemFromJSONById(snap, cb, error);
  //   });
  // }

  // getItemsBySubCategory(categoryId:string, cb, error){

  //   this.itemsDB.orderByChild(Database.SUB_CATEGORY.substring(1))
  //               .equalTo(categoryId)
  //               .on('child_added', (snap) => { 

  //     if(snap) this.getSingleItemFromJSONById(snap, cb, error);
  //   });
  // }

  // -------------------- GET Interface

  getiItemFromDBWithId(id:string){ 
    if(!id) return null;
    return new Promise(
      (resolve, reject) => {

        return firebase.database().ref(Database.ITEMS).child(id).once('value').then(
          async (item) => {

            // console.log('getiItemFromUser1',item.val());
            // resolve(Course.iCourseFromJson(item.val()));

            let iItem = await this.getiItemFromUser(item);

            resolve(iItem);
          }
        );

      }
    );
  }

  public static getiItemFromDBWithId(id:string){ 
    if(!id) return null;
    return new Promise(
      (resolve, reject) => {

        return firebase.database().ref(Database.ITEMS).child(id).once('value').then(
          async (item) => {

            // console.log('getiItemFromUser1',item.val());
            // resolve(Course.iCourseFromJson(item.val()));

            let iItem = await this.getiItemFromUser(item);

            resolve(iItem);
          }
        );

      }
    );
  }


  private joinItemsByJSON(json, cb, error) {

    if(json) {

      let requestItems = Object.keys(json).map((key) => {
  
        return new Promise((resolve) => {
          //asyncFunction(item, resolve);
          // resolve(this.getiItemFromDBWithId(key, 
          //   (iItem)=>{
          //     if(iItem) {
          //       console.error('getiItemFromDBWithId', iItem);
          //       resolve(iItem);
          //     }
          //   }, 
          // error));
          
        });

      });
  
      Promise.all(requestItems).then(
        (val)=>{
          return val;
        }).then(cb).catch(error);
    }
  }


  private async getiItemFromJSONByIdWithTags(itemJson, cb, error){
  
    let iItem: IItem = null;

    if(itemJson.val()[Database.ITEM_TYPE.substr(1)] === Database.COURSE.substr(1)) 
    iItem = Course.iCourseFromJson(itemJson.val());
    else if(itemJson.val()[Database.ITEM_TYPE.substr(1)] === Database.EVENT.substr(1)) 
    iItem = EventItem.iEventFromJson(itemJson.val());

    if(iItem) {

      iItem.id = itemJson.key;
  
      const usersJson:string = itemJson.val()[Database.USERS.substring(1)];
      const ratingsJson:string = itemJson.val()[Database.RATINGS.substring(1)];

      if(usersJson && usersJson.length) {

        let requestUsers = Object.keys(usersJson).map((key) => {
          return new Promise((resolve) => {
  
            UserService.getiUserFromDBWithId(key).then(
              (iUserJSON)=> {
                if(iUserJSON) {
                  let iUser = User.iUserFromJson(iUserJSON);
                  iUser.id = key;
    
                  const userItemsJson:string = iUserJSON[Database.ITEMS.substring(1)];
    
                  if(userItemsJson.length) {

                    this.joinItemsByJSON(userItemsJson, (valItems)=>{
                      iUser.iCourses = valItems;
                      resolve(iUser);
      
                    }, error);
                  }
                }
              }
            ).catch(error);
          });
        });
  
  
  
        return Promise.all(requestUsers).then(
          (valUsers:IUser[]) => {
            if(valUsers && valUsers.length) {
              iItem.iAuthors = valUsers;
              return iItem; 
            }
          }
        ).then(
          (val) => {
  
            if(ratingsJson && val.type === 'course') {
  
              return RatingService.getRatingsFromJSON(ratingsJson, iItem, null).then(
                (valRatings:Rating[])=> {
  
                  iItem.nbRatings = valRatings.length;
                  iItem.globalNote = Rating.getGlobalNote(valRatings);
  
                  return iItem;
                }
              );
  
            } else return val; 
          }
        ).catch(error).then(cb);
      }
    }
  }

  private getiItemFromUser(itemJson){
  
    if(itemJson) {

      let iItem: IItem = null;

      if(itemJson.val()[Database.ITEM_TYPE.substr(1)] === Database.COURSE.substr(1)) 
      iItem = Course.iCourseFromJson(itemJson.val());
      else if(itemJson.val()[Database.ITEM_TYPE.substr(1)] === Database.EVENT.substr(1)) 
      iItem = EventItem.iEventFromJson(itemJson.val());
  
      if(iItem) {
  
        iItem.id = itemJson.key;
  
        const ratingsJson:string = itemJson.val()[Database.RATINGS.substring(1)];
    
        if(ratingsJson && iItem.type === 'course') {
  
          return RatingService.getRatingsFromJSON(ratingsJson, iItem, null).then(
            (valRatings:Rating[])=> {
  
              iItem.nbRatings = valRatings.length;
              iItem.globalNote = Rating.getGlobalNote(valRatings);
  
              return iItem;
            }
          );
        } else return iItem;
      }
    }
  }


  private static getiItemFromUser(itemJson){
  
    if(itemJson) {

      let iItem: IItem = null;

      if(itemJson.val()[Database.ITEM_TYPE.substr(1)] === Database.COURSE.substr(1)) 
      iItem = Course.iCourseFromJson(itemJson.val());
      else if(itemJson.val()[Database.ITEM_TYPE.substr(1)] === Database.EVENT.substr(1)) 
      iItem = EventItem.iEventFromJson(itemJson.val());
  
      if(iItem) {
  
        iItem.id = itemJson.key;
  
        const ratingsJson:string = itemJson.val()[Database.RATINGS.substring(1)];
    
        if(ratingsJson && iItem.type === 'course') {
  
          return RatingService.getRatingsFromJSON(ratingsJson, iItem, null).then(
            (valRatings:Rating[])=> {
  
              iItem.nbRatings = valRatings.length;
              iItem.globalNote = Rating.getGlobalNote(valRatings);
  
              return iItem;
            }
          );
        } else return iItem;
      }
    }
  }


  // ----------------------------- UPDATE IN DB ------------------------------

  updateItemPrimaryInfoInDB(item:Item, cb, error){ 

    var ref = firebase.database().ref(Database.ITEMS).child(item.id);

    item.searchContent = this.setSearchContent(item);

    ref.update({
      searchContent:item.searchContent || null,
      title: item.title || null,
      price: item.price || null, 
      imageLink: item.imageLink || null,
      videoLink: item.videoLink || null,
      catchPhrase:item.catchPhrase || null,
      consultationLink:item.consultationLink || null,

    }).then(
      () => {
        return item;
      }
    ).then(cb)
     .catch(error);
  }

  private updateItemPrimaryInfoInAuthorsDB(item:Course | EventItem) {

    if(item.iAuthors){

      item.iAuthors.forEach(function (value) {
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

  updateItemDescriptionInDB(item:Item|Course|EventItem, cb, error) {

    if(item && item.description && item.description.length) {

      item.searchContent = this.setSearchContent(item);

      var ref = firebase.database().ref(Database.ITEMS).child(item.id);
      ref.update({
        description: item.description || null
      }).then(cb)
        .catch(error);

    }
  }

  updatePrerequisitesInDB(courseId:string, prerequisites:string[], cb, error){

    // var ref = firebase.database().ref(Database.ITEMS).child(courseId);
    
      this.removePrerequisites(courseId, 
        () => {
          this.addPrerequisites(courseId ,prerequisites,cb, error);
        },
      error);

    // ref.update({
    //   prerequisites: prerequisites || null
    // }).catch(error).then(cb);
  }

  updateSkillsToAcquireInDB(courseId:string, skills:string[], cb, error){

    // var ref = firebase.database().ref(Database.ITEMS).child(courseId);
    
    // ref.update({
    //   skillsToAcquire: skills || null
    // }).catch(error).then(cb);

    this.removeSkills(courseId, 
      () => {
        this.addSkills(courseId ,skills, cb, error);
      },
    error);
  }

  // -------- Modules à faire
  // if exist update else add

  // fonction de mise à jour temporaire
  updateCourseContent(newModules:Module[], courseId:string, cb, error) {
    this.removeModules(courseId,
      () =>{
        this.addCourseContent(newModules, courseId, cb, error);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  updateIsPublished(itemId, isPublished:  boolean, cb, error) {
    var ref = firebase.database().ref(Database.ITEMS).child(itemId);
    
    ref.update({
      published: isPublished || false
    }).catch(error).then(cb);
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

  // -------- Tag à faire
  // if exist update else add
  updateTags(newTags:Tag[], itemId:string, cb, error) {
    if(itemId && newTags && newTags.length) {
      this.removeTags(itemId,
        () =>{
          this.addTags(itemId, newTags, cb, error);
        }
      );
    }
  }

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
  removeModules(courseId:string, cb, error) {

    this.itemsDB.child(courseId)
                .child(Database.MODULES)
                .remove()
                .then(cb)
                .catch(error);
  }


  removeTags(itemId:string, cb) {

    TagService.removeTagsWithReference(this.itemsDB.child(itemId), cb);
  }


  removeSkills(courseId:string, cb, error) {

    this.itemsDB.child(courseId)
                .child('skillsToAcquire')
                .remove()
                .then(cb)
                .catch(error);
  }

  
  removePrerequisites(courseId:string, cb, error) {

    this.itemsDB.child(courseId)
                .child('prerequisites')
                .remove()
                .then(cb)
                .catch(error);
  }

  // --------------------------------- Other ----------------------------------------

  private setSearchContent(item:Course | EventItem|Item) {

    if(!item) return null

    let searchContent:string = '';

    if(item.title)
      searchContent = searchContent.concat(item.title);
    if(item.iAuthors && item.iAuthors.length)
      item.iAuthors.forEach(user => {
        searchContent = searchContent.concat('/', user.firstname+' '+user.lastname);
      }); 
    if(item.description) 
      searchContent = searchContent.concat('/', item.description);
    if(item.catchPhrase) 
      searchContent = searchContent.concat('/', item.catchPhrase);
    if(item.tags && item.tags.length){
      item.tags.forEach(tag => {
        searchContent = searchContent.concat('/', tag.name);
      });
    }

    return searchContent.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
  }

}