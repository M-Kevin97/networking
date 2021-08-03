import { IUser, User } from 'src/app/shared/model/user/user';
import { UserLevel } from './../../model/UserLevel.enum';
import { Database } from 'src/app/core/database/database.enum';
import { Subject } from 'rxjs/internal/Subject';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Course } from '../../model/item/course';
import { EventItem } from '../../model/item/event-item';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User;

  users: User[] = [];
  usersSubject = new Subject<User[]>();

  private usersDB = firebase.database().ref(Database.USERS);

  constructor() { }

  // ----------------------------- Emit ------------------------------

  emitUsers(){
    this.usersSubject.next(this.users);
  }

  // ----------------------------- ADD ------------------------------

  addNewUserToDB(newUser:User){

    if(!newUser.id) newUser.id = this.usersDB.push().key;

    return this.usersDB.child(newUser.id).set({
        data: newUser.data,
        firstname: newUser.firstname, 
        lastname: newUser.lastname,
        isBooster: newUser.isBooster, 
        mail: newUser.mail, 
        password: newUser.password, 
        tel: newUser.tel, 
        title: newUser.title,
        bio: newUser.bio,
        presentationLink: newUser.presentationLink,
        searchContent: newUser.searchContent,
        ppLink: newUser.ppLink,
        accessLevel: newUser.accessLevel,
        role: newUser.role
    }).then(
      () => {

        return true;

    }).catch((error)=>{
      console.error(error);
      return false;
    });
  }

  public static addAuthorsWithReference(ref:firebase.database.Reference, iAuthors:IUser[]){
    
    var saved : boolean = true;

    iAuthors.forEach(function (value) {
      if(saved){
        if(!value.title) value.title='';
        ref.child(Database.AUTHORS).child(value.id).set({
          firstname: value.firstname,
          lastname: value.lastname,
          isBooster: value.isBooster,
          title: value.title,
          ppLink: value.ppLink,
        }).then(
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

  public static addUsersIdByReference(ref:firebase.database.Reference, iAuthors:IUser[]){
    let i:number = 0;
    iAuthors.forEach(function (value) {
      if(value){
        ref.child(Database.USERS.substr(1)).set({
          [value.id]: i,
        }).catch(function(error) {
          console.error(error);
          return false;
        });
      }
      i++;
    }); 
    return true;
  }

  public static addUserIdByReference(ref:firebase.database.Reference, iAuthor:IUser, index:number){

    if(iAuthor){
      return ref.child(Database.USERS.substr(1)).set({
        [iAuthor.id]: index,
      }).catch(function(error) {
        console.error(error);
        return null;
      });
    }
  }

  public static addItemIdInAuthorDB(item:Course|EventItem, authorId:string) {

    if(item && authorId) {
      
      //console.log('saveCourseInAuthorsDB', item.iAuthors);

      let ref = firebase.database().ref(Database.USERS);
      let bool = false;
      
      let refAuthor = ref.child(authorId).child(Database.ITEMS);

      return refAuthor.once('value').then(
        (val) => {
          if(val) {
            return refAuthor.update({
              [item.id]: 0,
            }).then(
              () => {
                return true;
              }).catch(
              (error) => {
                return false;
              }
            );
          }
          else {
            return refAuthor.set({
              [item.id]: 0,
            }).then(
              () => {
                return true;
              }).catch(
              (error) => {
                return false;
              }
            );
          }
      });
    }
    return false;
  }

  public static addItemInAuthorsDB(item:Course|EventItem, authorId:string) {

    if(item && authorId) {
      
      //console.log('saveCourseInAuthorsDB', item.iAuthors);

      let ref = firebase.database().ref(Database.USERS);

      let bool = false;

      item.iAuthors.forEach(function (value) {
        //console.log('saveCourseInAuthorsDB',value); 
        
        var refAuthors = ref.child(value.id).child(Database.ITEMS).child(item.id);

        refAuthors.set({
          [item.id]: 0,
        }).then(
          () => {
            bool = true;
          },
          (error) => {
            return false;
          }
        );
      });

      return bool;
    }
    return false;
  }


  public static addAuthorsWithReferenceAndAuthID(ref:firebase.database.Reference, iAuthors:IUser[], idAuthorAuth:string){
    
    var saved : boolean = true;

    iAuthors.forEach(function (value) {
      if(saved && idAuthorAuth !== value.id){
        if(!value.title) value.title='';
        ref.child(Database.AUTHORS).child(value.id).set({
          firstname: value.firstname,
          lastname: value.lastname,
          title: value.title,
          isBooster: value.isBooster,
          ppLink: value.ppLink,
        }).then(
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

  // ----------------------------- UPDATE ------------------------------

  updateUserAccessLevel(userId:string, level:UserLevel) {
    if(userId && level) {
      this.usersDB.child(userId).set({
          accessLevel : level
        }
      );
    }
  }

  updateInfoUser(user:User) {

    this.usersDB.child(user.id).update({
      firstname: user.firstname,
      lastname: user.lastname,
      isBooster: user.isBooster,
      ppLink: user.ppLink,
      title: user.title,
      mail: user.mail,
      tel: user.tel,
      bio: user.bio,
      presentationLink: user.presentationLink,
      searchContent: user.searchContent,
    }).then(
      () => {
        firebase.auth().currentUser.updateEmail(user.mail);
        firebase.auth().signInWithEmailAndPassword(firebase.auth().currentUser.email, user.password)
                       .then(function(userCredential) {
        userCredential.user.updateEmail(user.mail);
         });
      }
    ).then(
      () => {
        if(user.courses){
          user.courses.forEach(function (value) {
            //console.log('updateUserCourses', value, user.courses);
            if(value){
          
              var refCourse = firebase.database().ref(Database.ITEMS)
                                                .child(value.id)
                                                .child(Database.AUTHORS)
                                                .child(user.id);
  
              refCourse.update({
                firstname: user.firstname,
                lastname: user.lastname,
                isBooster: user.isBooster,
                ppLink: user.ppLink,
                title: user.title,
              }).catch(
                (error) => {
                  console.error(error);
                  return false;
                });
              }
            });
        }
        }).then(
          () => {
            if(user.events){
              user.events.forEach(function (value) {
                //console.log('updateUserEvents', value, user.courses);
                if(value){
              
                  var refEvent = firebase.database().ref(Database.ITEMS)
                                                    .child(value.id)
                                                    .child(Database.AUTHORS)
                                                    .child(user.id);
         
      
                  refEvent.update({
                    firstname: user.firstname,
                    lastname: user.lastname,
                    isBooster: user.isBooster,
                    ppLink: user.ppLink,
                    title: user.title,
                  });
                }
              }
            );
          }  
        }).catch(
            (error) => {
              console.error(error);
              return false;
        }
      );
    }

    public static updateUserIdByReference(ref:firebase.database.Reference, iAuthor:IUser, index:number){

      if(iAuthor){
        return ref.child(Database.USERS.substr(1)).update({
          [iAuthor.id]: index,
        }).catch(function(error) {
          console.error(error);
          return null;
        });
      }
    }

  // ----------------------------- GET ------------------------------

  getUsersFromDB(){
    this.usersDB.once('value').then(
      (data) => {
        this.users = data.val() ? User.usersFromJson(data.val()) : [];
        this.emitUsers();
      }
    );
  }

  getiUsersFromDB() {
     
    return this.usersDB.once('value').then(
      (data) => {
        return data.val() ? User.iUsersFromJson(data.val()) : [];
      }
    );
  }


  public static getUserByMail(email:string, cb){
    return firebase.database().ref(Database.USERS)
                              .orderByChild('email')
                              .equalTo(email)
                              .once('value')
                              .then(cb);
  }


  getSingleUserFromDBWithId(id:string){ 

    return this.usersDB.child(id).once('value').then(
      (user) => {
        //console.log(user.val());
        return User.userFromJson(user.val());
      }
    );
  }


  public static getiUserFromDBWithId(id:string){ 
    if(!id) return null;
    return firebase.database().ref(Database.USERS).child(id).once('value').then(
      (iUserJSON) => {

        // console.warn('userItemsJson', iUserJSON.val());

        let iUser = User.iUserFromJson(iUserJSON.val());
        // console.warn('userItemsJson', iUser.itemId);
        return iUser;
      }
    );
  }
}
