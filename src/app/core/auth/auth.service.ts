import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { User } from 'src/app/shared/model/user/user';
import { UserService } from 'src/app/shared/service/user/user.service';


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
  public set isAuth(value: boolean) {
    this._isAuth = value;
  }


  constructor(private userService:UserService) { 
    
    this._authUser = new User(null,
                              null,
                              null,
                              null,
                              null,
                              null,
                              null,
                              null,
                              null,
                              null,
                              null,
                              null,
                              null);
  }

  signUpUser(user:User) {

    return new Promise (
      (resolve, reject) => {

        var actionCodeSettings = {
          // URL you want to redirect back to. The domain (www.example.com) for this
          // URL must be whitelisted in the Firebase Console.
          url: 'https://www.example.com/finishSignUp?cartId=1234',
          // This must be true.
          handleCodeInApp: true,
          iOS: {
            bundleId: 'com.example.ios'
          },
          android: {
            packageName: 'com.example.android',
            installApp: true,
            minimumVersion: '12'
          },
          dynamicLinkDomain: 'example.page.link'
        };

        //firebase.auth().sendSignInLinkToEmail(user.mail, actionCodeSettings)
        firebase.auth().createUserWithEmailAndPassword(user.mail, user.password).then(
          () => {

            user.id = firebase.auth().currentUser.uid;
            this.userService.addNewUserToDB(user);

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
              this.getCurrentUserDataWithId(user.uid).then(
                (bool) => {

                  this.isAuth = bool;
                  console.log(user.email + 'est connecté');
                  resolve(bool);
                }
              );
            } else {
              this.isAuth = false;
              console.log(this.isAuth,' est déconnecté');
              reject(false);
            }
          }
        );
      }
    );
  }

  getCurrentUserDataWithId(id:string) {
    return this.userService.getSingleUserFromDBWithId(id).then(
      (user) => {
        console.log('Auth USer',user);
        this._authUser = User.userFromJson(user);
        this._authUser.id = id;
        console.log('Auth USer', this._authUser);
        return true;
      }
    );
  }

  signOutUser(){
    return firebase.auth().signOut().then(
      () => {
        this.isAuth = false;
      }
    );
  }
}
