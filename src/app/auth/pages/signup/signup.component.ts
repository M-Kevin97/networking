import { RouteUrl } from './../../../core/router/route-url.enum';
import { UserLevel } from './../../../shared/model/UserLevel.enum';
import { Database } from 'src/app/core/database/database.enum';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
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

  roles:string[] = [];
  roleSelect:string;
  roleInit:string = "Activité";

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { 

    this.roles = ["Salarié", "Sans activité", "Étudiant", "Formateur", "Autre"];  
    this.resetMailError();     
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.signUpForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
    });

    this.roleSelect = this.roleInit;
  }

  isRole(role:string) {

    console.log(role);
   return role === this.roles[0];
  }

  onChangeSelectRole(event) {

    console.log(event);
    this.roleSelect = event;
  }

  checkConfirmEmail() {
    const email:string = this.signUpForm.get(['email']).value;
    const confirmEmail:string = this.signUpForm.get(['confirmEmail']).value;

    if(email && confirmEmail) {

      if(email !== confirmEmail) {
        this.errorConfirmEmail = true;
        this.errorConfirmEmailMessage = "Les mots de passe ne sont pas identiques, veuillez réessayer.";
      } else {
        this.errorConfirmEmail = false;
        this.errorConfirmEmailMessage = "";
      }
    }
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
  
    console.log(this.signUpForm.value);
    
    const firstname:string = this.signUpForm.get('firstname').value;
    const lastname:string = this.signUpForm.get('lastname').value;
    const email:string = this.signUpForm.get('confirmEmail').value;
    const ppLink:string = Database.DEFAULT_PP_USER;
    const role:string = this.roleSelect === this.roleInit ? this.roles[this.roles.length-1]: this.roleSelect;
    const password:string = this.generatePassword(); 

    console.warn(firstname, password);

    this.authService.createAccount(new User(null, firstname, 
                                                lastname, 
                                                email, 
                                                password,
                                                ppLink,
                                                null,
                                                null,
                                                null,
                                                role,
                                                UserLevel.STANDARD,
                                                false,
                                                [],
                                                []))
      .then(
      () => {
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
  
  private resetMailError() {
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
