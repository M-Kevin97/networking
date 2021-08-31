import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/shared/model/user/user';
import { UserService } from 'src/app/shared/service/user/user.service';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  emailPreAuth:string = null;
  
  private isConnected = new Subject<Boolean>();

  // authUser est l'utilisateur identifié lors de la connexion
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

  private _preSignUpUser: firebase.auth.UserCredential;
  public get preSignUpUser(): firebase.auth.UserCredential {
    return this._preSignUpUser;
  }
  public set preSignUpUser(value: firebase.auth.UserCredential) {
    this._preSignUpUser = value;
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
                              null,
                              null,
                              null,
                              null);
  }

  getAuth(): Observable<Boolean> {
    return this.isConnected.asObservable();
  }

  createAccountWithEmailAndPassword(mail:string, password:string) {
    return new Promise (
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(mail, password).then(
          (val) => {
            // console.log('Success!', val);
            resolve(val);
          }).catch((error) => {
            reject(error.code);
          }
        );
      }
    );
  }

  // Create an account with Google and maybe Facebook
  createAccountWith(user:User, cb) {

    // alert('createAccountWith :' + user);

    if(user) {

      // alert('createAccountWith :' + user);
      return this.userService.addNewUserToDB(user).then(cb);
      //   (bool) => {
      //     return bool;
      //   }
      // ).catch(
      //   (error) => {
      //     return false;
      //   }
      // );
    }
  }

  sendEmailVerification(){

    return new Promise (
      (resolve, reject) => {

        let user = firebase.auth().currentUser;
        
        const email = user.email;

        var actionCodeSettings = {
          // URL you want to redirect back to. The domain (www.example.com) for this
          // URL must be whitelisted in the Firebase Console.

           url: 'https://localhost:4200/auth',
          // url: 'https://netskills.herokuapp.com/auth',
          // url: 'https://wyskill.com/auth',

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

        firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
        .then(function() {

          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          window.localStorage.setItem('wyskillEmailForSignIn', email);
          resolve(user);
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
        else reject(false);
      }
    );
  }


  emailVerification(email:string){
    return new Promise (
      (resolve, reject) => {

        console.error('authService emailVerification');

        // The client SDK will parse the code from the link for you.
        firebase.auth().signInWithEmailLink(email, window.location.href)
          .then(function(result:firebase.auth.UserCredential) {
            // Clear email from storage.
            window.localStorage.removeItem('wyskillEmailForSignIn');
            // You can access the new user via result.user
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null

            console.error('signInWithEmailLink');

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
    );
  }


  login(email:string, password:string){
        
    return firebase.auth().signInWithEmailAndPassword(email, password).then(
      (userCredential) => {

        console.warn(userCredential);

        if(userCredential.user) {

          if(userCredential.user.emailVerified){
            return userCredential.user;
          } 
          else {
            this.sendEmailVerification();
            return("auth/email-not-verified");
          }
        }
      }
    );
  }

  googleSignIn(cb) {

    // Sign in using a popup.
    var provider = new firebase.auth.GoogleAuthProvider();

    return firebase.auth().signInWithPopup(provider).then(cb);
  }

  facebookSignIn(cb) {

    // Sign in using a popup.
    var provider = new firebase.auth.FacebookAuthProvider();

    return firebase.auth().signInWithPopup(provider).then(cb);
  }

  authStateChanged(){

    return new Promise(
      (resolve, reject) => {
        firebase.auth().onAuthStateChanged(
          (user) => {

            if(user){

              this.getCurrentUserDataWithId(user.uid).then(
                (bool) => {

                  if(bool && user.emailVerified) {
    
                    this.isAuth = bool;
                    //this.isConnected.next(true);
                    resolve(true);
                  }
                  // si il vient de s'inscrire
                  else if (bool && !user.emailVerified) {

                    this.isAuth = bool;
                    //this.isConnected.next(true);
                    resolve(true);
                  }
                  else {
                    this.isAuth = false;
                    //this.isConnected.next(false);
                    resolve(false);
                  }
                }
              );
            } else {

              this.isAuth = false;
              //this.isConnected.next(false);
              resolve(false);
            }
          }
        );
      }
    );
  }

  getCurrentUserDataWithId(id:string) {

    return this.userService.getSingleUserFromDBWithId(id).then(
      (user:User) => {

        if(!user) {
          this.signOutUser();

          return false;
        } else {
          user.id = id;
          this._authUser = user;

          return true;
        }
      }
    );
  }

  updatePasswordWith(newPassword:string, cb, user?:firebase.User){

    if(!user) user = firebase.auth().currentUser;

    // alert('auth service, updatePasswordWith ' + newPassword + ' ' + user.email + '' + user.emailVerified);

    return user.updatePassword(newPassword).then(cb);
  }

  confirmPasswordReset(actionCode:any, newPassword:string) {

    return new Promise(
      (resolve, reject) => { 

        if(!newPassword) reject();

        var auth = firebase.auth();
    
        // Save the new password.
        auth.confirmPasswordReset(actionCode, newPassword).then(
          function() {

          // Password reset has been confirmed and new password updated.
          resolve(newPassword);
    
          // TODO: If a continue URL is available, display a button which on
          // click redirects the user back to the app via continueUrl with
          // additional state determined from that URL's parameters.
        }).catch(
          function(error) {
          // Error occurred during confirmation. The code might have expired or the
          // password is too weak.
          reject(error);
        });
      }
    );
  }

  sendMailPasswordReinitialisation(email:string) {
    return new Promise (
      (resolve, reject) => {

        var auth = firebase.auth();

        var actionCodeSettings = {
          // URL you want to redirect back to. The domain (www.example.com) for this
          // URL must be whitelisted in the Firebase Console.

          // url: 'https://netskills.herokuapp.com/auth',
           url: 'https://localhost:4200/auth',
          //  url: 'https://wyskill.com/auth',

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

        // localize the password reset email by updating the language code on the Auth instance before sending the email
        // firebase.auth().languageCode = 'de';
        
        // To apply the default browser preference instead of explicitly setting it.
        firebase.auth().useDeviceLanguage();
        
        auth.sendPasswordResetEmail(email, actionCodeSettings).then(function() {
          // Email sent.
          resolve(email);

        }).catch(function(error) {
          // An error happened.
          console.error(error.message);
          reject(error);
        });
      }
    );
  }

  signOutUser(){
    return firebase.auth().signOut().then(
      () => {
        this.isAuth = false;
        this._authUser = null;

        return true;
      }
    ).catch(
      (error) => {
        console.error(error);
        return false;
      }
    );
  }

  /**
   * Authentification Handler (Reset Password / VerifyEmail / RecoverEmail)
   */
}
