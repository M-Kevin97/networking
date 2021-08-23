import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { User } from 'src/app/shared/model/user/user';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;

  errorGeneral: boolean = false; 
  errorGeneralMessage: string = ''; 

  errorEmailMessage:string = ''; 
  errorEmail:boolean = false;

  errorConfirmEmailMessage:string = ''; 
  errorConfirmEmail:boolean =false;

  isVerificationEmailSent:boolean = false;

  hasSelected:boolean = false;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { 

    this.resetMailError();     
  }

  ngOnInit(): void {
    this.initForm();
  }

  goHome() {
    this.router.navigate([RouteUrl.HOME]);
  }

  initForm(){
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      // confirmEmail: ['', [Validators.required, Validators.email]],
    });
  }

  // Ne sert pas à grand chose
  // checkConfirmEmail() {
  //   const email:string = this.signUpForm.get(['email']).value;
  //   const confirmEmail:string = this.signUpForm.get(['confirmEmail']).value;

  //   if(email && confirmEmail) {

  //     if(email !== confirmEmail) {
  //       this.errorConfirmEmail = true;
  //       this.errorConfirmEmailMessage = "Les mots de passe ne sont pas identiques, veuillez réessayer.";
  //     } else {
  //       this.errorConfirmEmail = false;
  //       this.errorConfirmEmailMessage = "";
  //     }
  //   }
  // }

  shouldShowRequiredError(controlName) {

    return !this.signUpForm.get(controlName).valid && this.signUpForm.get(controlName).touched;
  }

  shouldShowSignUpError(controlName) {

    switch (controlName){

      case 'email': {
        return this.errorEmail;
      }
      case 'confirmEmail': {
        return this.errorConfirmEmail;
      }
      case 'general': {

        break;
      }
      default: { 
        //statements; 
        break; 
      } 
    }
  }

  private generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
        
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    retVal = '&'+retVal+'@';

    return retVal;
  }

  onSignUp(){

     // stop here if form is invalid
     /*if (this.signUpForm.invalid) {
      return;
    }*/
  
    const email:string = this.signUpForm.get('email').value;
    const password:string = this.generatePassword(); 

    this.authService.createAccountWithEmailAndPassword(email, password).then(
      () => {

        // this.authService.preSignUpUser = new User(null, null, null, null, null, null, null, null, null, null, null, null, null, null);

        // this.authService.preSignUpUser.mail = email;

        this.signUpForm.reset();
        this.authService.sendEmailVerification().then(
          ()=>{
            this.isVerificationEmailSent = true;
          }
        );
      },
      (error) => {

        this.checkErrorAuth(error);
      }
    );
  }

  onGoogleSignUpWithPopUp() {

    if(this.authService.isAuth) {
      this.authService.signOutUser().then(
        () => {
          this.googleSignUp();
        }
      );
    } else {
      this.googleSignUp();
    }
  }

  onFacebookSignUpWithPopUp() {

    if(this.authService.isAuth) {
      this.authService.signOutUser().then(
        () => {
          this.facebookSignUp();
        }
      );
    } else {
      this.facebookSignUp();
    }
  }

  private facebookSignUp() {

    this.authService.facebookSignIn(
      (result:firebase.auth.UserCredential) => {

        var verified_email = result.additionalUserInfo.profile['verified_email'];
        console.error(verified_email);
        
        if(!verified_email) {
          this.authService.sendEmailVerification().then(
            (val) => {

                this.isVerificationEmailSent = true;
            },
            (error) => {
              this.checkErrorAuth(error);
            }
          );
        } else {

          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential;
          // The signed-in user info.
          this.authService.preSignUpUser = result;

          this.router.navigate([RouteUrl.SIGNUP_WITH]);

        }
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.error(error);
        this.checkErrorAuth(error.code);
      }
    );
  }

  private googleSignUp() {
    this.authService.googleSignIn(
      (result:firebase.auth.UserCredential) => {
        var verified_email = result.additionalUserInfo.profile['verified_email'];
        
        if(!verified_email) {
          this.authService.sendEmailVerification().then(
            (val) => {

                this.isVerificationEmailSent = true;
            },
            (error) => {
              this.checkErrorAuth(error);
            }
          );
        } else {

          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential;
          // The signed-in user info.
          this.authService.preSignUpUser = result;

          this.router.navigate([RouteUrl.SIGNUP_WITH]);

        }
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.error(error);
        this.checkErrorAuth(error.code);
      }
    );
  }

  // onGoogleSignUpWithRedirect() {

  //   firebase.auth().signInWithRedirect(provider);

  //   var provider = new firebase.auth.GoogleAuthProvider();

  //   firebase.auth().signInWithPopup(provider).then(function(result) {
  //     // This gives you a Google Access Token. You can use it to access the Google API.
  //     var token = result.credential.accessToken;
  //     // The signed-in user info.
  //     var user = result.user;
  //     // ...
  //   }).catch(function(error) {
  //     // Handle Errors here.
  //     var errorCode = error.code;
  //     var errorMessage = error.message;
  //     // The email of the user's account used.
  //     var email = error.email;
  //     // The firebase.auth.AuthCredential type that was used.
  //     var credential = error.credential;
  //     // ...
  //   });
  // }


  goToSignIn() {
    this.router.navigate([RouteUrl.LOGIN]);
  }
  
  resetMailError() {
    this.errorEmail = false;
    this.errorEmailMessage = 'Vous en aurez besoin pour vous reconnecter ou pour réinitialiser votre mot de passe.';
  }

  private resetGeneralError() {
    this.errorGeneral = false;
    this.errorGeneralMessage = '';
  }

  private checkErrorAuth(errorCode:string) {

    console.warn('checkErrorAuth',errorCode);

    switch (errorCode){

      case 'auth/email-already-in-use':{
        console.warn('checkErrorAuth2',errorCode);
        this.errorEmailMessage = 'L\'adresse mail existe déjà';
        this.errorEmail = true;
        this.resetGeneralError();
        break;
      }
      case 'auth/invalid-email': {
        console.warn('checkErrorAuth3',errorCode);
        this.errorEmailMessage = 'L\'adresse mail n\'est pas valide';
        this.errorEmail = true;
        this.resetGeneralError();
        break;
      }
      case 'auth/operation-not-allowed': {
        console.warn('checkErrorAuth4',errorCode);
        this.errorGeneralMessage = 'Votre compte n\'est pas activé, veuillez confirmer votre inscription';
        this.errorGeneral = true;
        this.resetMailError();
        break;
      }
      default: { 
        this.resetGeneralError();
        this.resetMailError();
        break; 
      } 
    }
  }
}
