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
                              ,null
                              ,null
                              ,null);
  }

  checkAuthUser(){
    return 
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
            this.getCurrentUserDataWithId(uid);
            resolve();
          }, 
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  authStateChanged(){
    return new Promise(
      (resolve, reject) => {
        firebase.auth().onAuthStateChanged(
          (user) => {
            if(user){
              this.getCurrentUserDataWithId(user.uid);
              this._isAuth = true;
              
              console.log(user.email + 'est connecté');
              resolve(true);
            } else {
              this._isAuth = false;
              console.log('est déconnecté');
              reject();
            }
          }
        );
      }
    );
  }

  getCurrentUserDataWithId(id:string) {
    this.userService.getSingleUserFromDBWithId(id).then(
      (user) => {
        console.log('Auth USer',user);
        this._authUser = User.userFromJson(user);
        this._authUser.id = id;
        console.log('Auth USer', this._authUser);
      }
    );
  }

  signOutUser(){
    firebase.auth().signOut().then(
      () => {
        this._isAuth = false;
      }
    );
  }
}
