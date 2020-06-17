import { UsersService } from '../../shared/users/users.service';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { User } from 'src/app/shared/users/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // authUser est l'utilisateur identifé, connecté
  authUser: User;
  isAuth:boolean; 

  constructor(private userService:UsersService) { 
    
    this.authUser = new User(null
                             ,null
                             ,null
                             ,null
                             ,null
                             ,null
                             ,null
                             ,null
                             ,null);
  }

  signUpUser(user:User) {

    return new Promise (
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(user.mail, user.password).then(
          () => {

            user.id = firebase.auth().currentUser.uid;
            this.userService.createNewUser(user);

            resolve();
          }, 
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  signInUser(email:string, password:string){
    return new Promise (
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          () => {
            this.isAuth = true;

            const uid = firebase.auth().currentUser.uid;

            this.userService.getSingleUserFromDBWithId(uid).then(
              (user) => {
                console.log('Auth USer',user);
                this.authUser = User.fromJson(user);
                this.authUser.id = uid;
                console.log('Auth USer', this.authUser);
                resolve();
              }
            );
          }, 
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  authStateChanged(){
    firebase.auth().onAuthStateChanged(
      (user) => {
        if(user){
          this.isAuth = true;
          console.log(user.email + 'est connecté');
        } else {
          this.isAuth = false;
          console.log('est déconnecté');
        }
      }
    );
  }

  /*getCurrentUserData()
  {
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {
      this.authUser.firstname = user.displayName;
      this.authUser.firstnameemail = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                      // this value to authenticate with your backend server, if
                      // you have one. Use User.getToken() instead.
    }
  }*/

  /*
  addCurrentUserData()
  {
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {
      this.authUser.firstname = user.displayName;
      this.authUser.firstnameemail = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                      // this value to authenticate with your backend server, if
                      // you have one. Use User.getToken() instead.
    }
  }
  */

  signOutUser(){
    firebase.auth().signOut();
    this.isAuth = false;
  }
}
