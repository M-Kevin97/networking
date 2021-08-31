import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { User } from 'src/app/shared/model/user/user';
import { UserLevel } from 'src/app/shared/model/UserLevel.enum';
import { Md5 } from 'ts-md5';


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

  password: string = null;

  isVerificationEmailSent:boolean = false;

  hasSelected:boolean = false;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { 

    this.resetMailError();     
  }

  ngOnInit(): void {
    this.initForm();
    if(this.authService.emailPreAuth) this.signUpForm.patchValue({email: this.authService.emailPreAuth});

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
  
     const email: string = this.signUpForm.get('email').value;
    //const password:string = this.generatePassword(); 

    this.authService.createAccountWithEmailAndPassword(email, this.password).then(
      (val:firebase.auth.UserCredential) => {

        // this.authService.preSignUpUser = new User(null, null, null, null, null, null, null, null, null, null, null, null, null, null);

        // this.authService.preSignUpUser.mail = email;

        // this.signUpForm.reset();

        const md5 = new Md5();
        const pwd = (md5.appendStr(this.password).end()).toString();

        let user:User = new User(val.user.uid, 
                                  null, 
                                  null,
                                  false,
                                  val.user.email,
                                  pwd,
                                  null,
                                  null,
                                  null,
                                  null,
                                  null,
                                  null,
                                  null,
                                  UserLevel.STANDARD,
                                  false,
                                  [],
                                  [],
                                  []);


        this.createUserAccountWith(user);

        // this.authService.sendEmailVerification().then(
        //   (user) => {

        //     this.isVerificationEmailSent = true;

        //   }
        // );

        // this.authService.sendEmailVerification().then(
        //   (user:firebase.User)=>{

        //     this.isVerificationEmailSent = true;
        //     this.createUserAccount(user);
        //   }
        // );
      },
      (error) => {

        this.checkErrorAuth(error);
      }
    );
  }


  createUserAccountWith(user:User) {
      
    this.authService.createAccountWith(user,
     
      (val:User) => {

        this.goToUserSettings();
        // console.error('finishVerification authService.createAccountWith : '+val);
        // alert('verification createAccountWith');

        // const verificationSuccessMessage = 'Bienvenue, \n Votre compte a bien été créé, vous pouvez maintenant vous connecter.'; 
        //this.successMessage.next(verificationSuccessMessage); 

        // this.authService.signOutUser().then(
        //   () => {
        //       const verificationSuccessMessage = 'Bienvenue, \n Votre compte a bien été créé, vous pouvez vous connecter.'; 
        //       this.successMessage.next(verificationSuccessMessage); 
        //     }
        // ).catch(
        //   (error) => {
        //     // console.error(error.message);
        //     this.errorMessage.next(error.message);
        //     //this.sendErrorMessage('');
        //   }
        // );
      }
    ).catch(
      (error) => {
        console.error(error);
        //this.errorMessage.next(error.message);
        //this.displayError(error.code);
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

  goToUserSettings() {

    this.router.navigate([RouteUrl.SETTINGS + RouteUrl.PROFILE_SETTINGS]);
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
        this.errorEmailMessage = 'L\'adresse mail existe déjà.';
        this.errorEmail = true;
        this.resetGeneralError();
        break;
      }
      case 'auth/invalid-email': {
        console.warn('checkErrorAuth3',errorCode);
        this.errorEmailMessage = 'L\'adresse mail n\'est pas valide.';
        this.errorEmail = true;
        this.resetGeneralError();
        break;
      }
      case 'auth/operation-not-allowed': {
        console.warn('checkErrorAuth4',errorCode);
        this.errorGeneralMessage = 'Votre compte n\'est pas activé, veuillez confirmer votre inscription en cliquant sur le lien d\'activation que vous avez reçu par mail.';
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


  goToGeneralTerms() {
    
    this.router.navigate([RouteUrl.TERMS+RouteUrl.GENERAL_TERMS]);
  }


  goToConfidentiality() {

    this.router.navigate([RouteUrl.TERMS+RouteUrl.CONFIDENTIALITY]);
  }


}
