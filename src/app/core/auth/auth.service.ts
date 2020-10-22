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
                              null,
                              null);
  }


  createAccount(user:User) {
    return new Promise (
      (resolve, reject) => {

        console.error('password', user.password);
        //firebase.auth().sendSignInLinkToEmail(user.mail, actionCodeSettings)
        firebase.auth().createUserWithEmailAndPassword(user.mail, user.password).then(
          () => {

            user.id = firebase.auth().currentUser.uid;
            this.userService.addNewUserToDB(user);
    
            resolve();

          }).catch(
          (error) => {
            reject(error.code);
          }
        );
      }
    );
  }

  sendEmailVerification(){

    return new Promise (
      (resolve, reject) => {

        let user = firebase.auth().currentUser;
        const email = user.email;

        var actionCodeSettings = {
          // URL you want to redirect back to. The domain (www.example.com) for this
          // URL must be whitelisted in the Firebase Console.
          url: 'https://netskills.herokuapp.com/verification',
          // This must be true.
          handleCodeInApp: true,
          // iOS: {
          //   bundleId: 'com.example.ios'
          // },
          // android: {
          //   packageName: 'com.example.android',
          //   installApp: true,
          //   minimumVersion: '12'
          // },
          //dynamicLinkDomain: 'example.page.link'
        };

        // user.sendEmailVerification().then(
        //   () => {
        //     window.alert("verification sent");
        //   }
        // ).catch(
        //   (error) => {
        //     console.error(error.message);
        //   }
        // );

        firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
        .then(function() {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          window.localStorage.setItem('netSkillsEmailForSignIn', email);
          console.log("verification sent");
          resolve();
        })
        .catch(function(error) {
          // Some error occurred, you can inspect the code: error.code
          console.error(error.message);
          reject(error);
        });
      }
    );
  }

  isEmailVerificationLink() {
    return new Promise (
      (resolve, reject) => {
        if (firebase.auth().isSignInWithEmailLink(window.location.href)) resolve(true);
        else resolve(false);
      }
    );
  }

  // emailVerification(){
  //   return new Promise (
  //     (resolve, reject) => {

  //       // Confirm the link is a sign-in with email link.
  //       if (firebase.auth().isSignInWithEmailLink(window.location.href)) {

  //         // Additional state parameters can also be passed via URL.
  //         // This can be used to continue the user's intended action before triggering
  //         // the sign-in operation.
  //         // Get the email if available. This should be available if the user completes
  //         // the flow on the same device where they started it.
  //         var email = window.localStorage.getItem('netSkillsEmailForSignIn');

  //         if (!email) {
  //           // User opened the link on a different device. To prevent session fixation
  //           // attacks, ask the user to provide the associated email again. 
  //           // For example:
  //           email = window.prompt('Please provide your email for confirmation');
  //         }
  //         // The client SDK will parse the code from the link for you.
  //         firebase.auth().signInWithEmailLink(email, window.location.href)
  //           .then(function(result) {
  //             // Clear email from storage.
  //             window.localStorage.removeItem('netSkillsEmailForSignIn');
  //             // You can access the new user via result.user
  //             // Additional user info profile not available via:
  //             // result.additionalUserInfo.profile == null

  //             // You can check if the user is new or existing:
  //             if(result.additionalUserInfo.isNewUser) resolve();

  //           }).catch(function(error) {
  //             // Some error occurred, you can inspect the code: error.code
  //             // Common errors could be invalid email and invalid or expired OTPs.
  //             reject(error);
  //           }
  //         );
  //       }
  //     }
  //   );
  // }


  emailVerification(email:string){
    return new Promise (
      (resolve, reject) => {

        // Confirm the link is a sign-in with email link.
        if (firebase.auth().isSignInWithEmailLink(window.location.href)) {

          // The client SDK will parse the code from the link for you.
          firebase.auth().signInWithEmailLink(email, window.location.href)
            .then(function(result:firebase.auth.UserCredential) {
              // Clear email from storage.
              window.localStorage.removeItem('netSkillsEmailForSignIn');
              // You can access the new user via result.user
              // Additional user info profile not available via:
              // result.additionalUserInfo.profile == null

              resolve(result);
              // You can check if the user is new or existing:
              // if(result.additionalUserInfo.isNewUser) resolve(result);
              // else reject();

            }).catch(function(error) {
              // Some error occurred, you can inspect the code: error.code
              // Common errors could be invalid email and invalid or expired OTPs.
              reject(error);
            }
          );
        }
      }
    );
  }

  signInUser(email:string, password:string){

    console.error('signInUser', password);

    return new Promise (
      (resolve, reject) => {
        
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          (userCredential) => {

            if(userCredential.user) {

              if(userCredential.user.emailVerified) resolve();
              else {
                this.sendEmailVerification();
                reject("auth/email-not-verified");
              }
            }
          }).catch( 
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
              console.warn('onAuthStateChanged :', user.uid, user.email, user.emailVerified);
              if(user.emailVerified){
                this.getCurrentUserDataWithId(user.uid).then(
                  (bool) => {
                    if(bool) {
                      this.isAuth = bool;
                      console.log(user.email + 'est connecté');
                      resolve(true);
                    }
                    else {
                      this.isAuth = false;
                      console.log(this.isAuth,' est déconnecté');
                      resolve(false);
                    }
                  }
                );
              } else {
                this.isAuth = false;
                console.log(this.isAuth,' est déconnecté');
                resolve(false);
              }
            } else {
              this.isAuth = false;
              console.log(this.isAuth,' est déconnecté');
              resolve(false);
            }
          }
        );
      }
    );
  }

  getCurrentUserDataWithId(id:string) {
    return this.userService.getSingleUserFromDBWithId(id).then(
      (user) => {
        if(!user) {
          this.signOutUser();
          return false;
        } else {
          console.log('Auth USer',user);
          this._authUser = User.userFromJson(user);
          this._authUser.id = id;
          console.log('Auth USer', this._authUser);
          return true;
        }
      }
    );
  }

  updatePasswordWith(newPassword:string){
    return new Promise(
      (resolve, reject) => { 
        if(!newPassword) reject();
        var user = firebase.auth().currentUser;

        user.updatePassword(newPassword).then(function() {
          // Update successful.
          resolve();
        }).catch(function(error) {
          // An error happened.
          reject(error);
        });
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
