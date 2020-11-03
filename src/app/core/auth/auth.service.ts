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
                              null);
  }


  createAccountWithEmailAndPassword(mail:string, password:string) {
    return new Promise (
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(mail, password).then(
          () => {
            resolve();
          }).catch(
          (error) => {
            reject(error.code);
          }
        );
      }
    );
  }

  // Create an account with Google and maybe Facebook
  createAccountWith(user:User) {
    return new Promise (
      (resolve, reject) => {
        if(user) {
          this.userService.addNewUserToDB(user).then(
            (bool) => {
              if(bool) resolve();
              else reject();
            }
          ).catch(
            (error) => {
              reject(error.code);
            }
          );
        }
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
          url: 'https://netskills.herokuapp.com/auth',
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
        else reject(false);
      }
    );
  }


  emailVerification(email:string){
    return new Promise (
      (resolve, reject) => {

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

  updatePasswordWith(newPassword:string, user?:firebase.User){
    return new Promise(
      (resolve, reject) => { 
        if(!newPassword && !newPassword.length) reject();
        
        if(!user) user = firebase.auth().currentUser;

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

  confirmPasswordReset(actionCode:any, newPassword:string) {

    return new Promise(
      (resolve, reject) => { 

        if(!newPassword) reject();

        var auth = firebase.auth();
    
        // Save the new password.
        auth.confirmPasswordReset(actionCode, newPassword).then(
          function() {

          // Password reset has been confirmed and new password updated.
          resolve();
    
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
          //url: 'https://netskills.herokuapp.com/auth',
          url: 'https://netskills.herokuapp.com/auth',
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
          console.log("verification sent");
          resolve();

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
      }
    );
  }

  /**
   * Authentification Handler (Reset Password / VerifyEmail / RecoverEmail)
   */
}
