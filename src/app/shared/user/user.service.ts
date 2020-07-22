import { Database } from 'src/app/core/database/database.enum';
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
        title: newUser.title,
        bio: newUser.bio,
        ppLink: newUser.ppLink,
    }).then(
      () => {

        return true;

    }).catch((error)=>{
      console.log(error);
      return false;
    });
  }

  createNewUser(newUser:User){
    this.saveUserToDB(newUser);
  }

  updateInfoUser(user:User) {
    var ref = firebase.database().ref(Database.USERS).child(user.id);
    
    ref.update({
      firstname: user.firstname,
      lastname: user.lastname,
      ppLink: user.ppLink,
      title: user.title,
      mail: user.mail,
      tel: user.tel,
      bio: user.bio,
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
            console.log('updateUserCourses', value, user.courses);
            if(value){
          
              var refCourse = firebase.database().ref(Database.COURSES)
                                                .child(value.id)
                                                .child(Database.AUTHORS)
                                                .child(user.id);
  
              refCourse.update({
                firstname: user.firstname,
                lastname: user.lastname,
                ppLink: user.ppLink,
                title: user.title,
              }).catch(
                (error) => {
                  console.log(error);
                  return false;
                });
              }
            });
        }
        }).then(
          () => {
            if(user.events){
              user.events.forEach(function (value) {
                console.log('updateUserEvents', value, user.courses);
                if(value){
              
                  var refEvent = firebase.database().ref(Database.EVENTS)
                                                    .child(value.id)
                                                    .child(Database.AUTHORS)
                                                    .child(user.id);
         
      
                  refEvent.update({
                    firstname: user.firstname,
                    lastname: user.lastname,
                    ppLink: user.ppLink,
                    title: user.title,
                  });
                }
              }
            );
          }  
        }).catch(
            (error) => {
              console.log(error);
              return false;
        }
      );
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
          title:value.title,
          ppLink:value.ppLink,
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
          title:value.title,
          ppLink:value.ppLink,
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
