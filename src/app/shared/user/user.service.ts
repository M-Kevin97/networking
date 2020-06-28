import { Database } from 'src/app/core/database/database.enum';
import { ItemService } from 'src/app/shared/item/item.service';
import { Subject } from 'rxjs/internal/Subject';
import { Injectable } from '@angular/core';
import { User, IUser } from './user';
import * as firebase from 'firebase';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User;

  users: User[] = [];
  usersSubject = new Subject<User[]>();

  constructor() { }

  emitUsers(){
    this.usersSubject.next(this.users);
  }

  private saveUserToDB(newUser:User){

    var ref = firebase.database().ref(Database.USERS);
    return ref.child(newUser.id).set({
        firstname: newUser.firstname, 
        lastname: newUser.lastname, 
        mail: newUser.mail, 
        password: newUser.password, 
        tel: newUser.tel, 
        job: newUser.job,
        description: newUser.description,
    }).then(
      () => {

        return true;

       /* if(newUser.courses !== null && newUser.courses.length > 0){

          if(ItemService.saveICoursesWithReference(ref,newUser.courses)){

            if(newUser.events !== null && newUser.events.length > 0) {

             return ItemService.saveIEventsWithReference(ref,newUser.courses)
            }
          }
          else {
            return false;
          }
        }*/
    }).catch((error)=>{
      console.log(error);
      return false;
    });
  }

  createNewUser(newUser:User){
    this.saveUserToDB(newUser);
  }

  getUsersFromDB(){
    firebase.database().ref(Database.USERS).on('value', 
      (data) => {
        this.users = data.val() ? data.val() : [];
        this.emitUsers();
        console.log(data.val());
      }
    );
  }

  getSingleUserFromDBWithMail(email:string){
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref(Database.USERS+'/'+email).once('value').then(
          (user) => {

              resolve(user.val());
              console.log(user.val());
          }, (error) => {

            reject(error);
          }
        );
      }
    );
  }

  getSingleUserFromDBWithId(id:string){ 

    console.log('user id :', id);

    return firebase.database().ref(Database.USERS+'/'+id).once('value').then(
      function(user) {
        console.log(user.val());
        return user.val();
      }
    );
  }

  public static saveAuthorsWithReference(ref:firebase.database.Reference, iAuthors:IUser[]){
    
    var saved : boolean = true;

    iAuthors.forEach(function (value) {
      if(saved){
        ref.child(Database.AUTHORS).child(value.id).set({
          firstname: value.firstname,
          lastname: value.lastname,
        }).then(
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


  public static saveAuthorsWithReferenceAndAuthID(ref:firebase.database.Reference, iAuthors:IUser[], idAuthorAuth:string){
    
    var saved : boolean = true;

    iAuthors.forEach(function (value) {
      if(saved && idAuthorAuth !== value.id){
        ref.child(Database.AUTHORS).child(value.id).set({
          firstname: value.firstname,
          lastname: value.lastname,
        }).then(
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

}
