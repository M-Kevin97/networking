import { UserService } from '../../shared/user/user.service';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { User } from 'src/app/shared/user/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // authUser est l'utilisateur identifé lors de la connexion
  private _authUser: User;

  public get authUser(): User {
    return this._authUser;
  }

  private _isAuth: boolean; 

  public get isAuth(): boolean {
    return this._isAuth;
  }


  constructor(private userService:UserService) { 
    
    this._authUser = new User(null
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
            this._isAuth = true;

            const uid = firebase.auth().currentUser.uid;

            this.userService.getSingleUserFromDBWithId(uid).then(
              (user) => {
                console.log('Auth USer',user);
                this._authUser = User.fromJson(user);
                this._authUser.id = uid;
                console.log('Auth USer', this._authUser);
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
          this._isAuth = true;
          console.log(user.email + 'est connecté');
        } else {
          this._isAuth = false;
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
    firebase.auth().signOut().then(
      () => {
        this._isAuth = false;
      }
    );
  }
}
