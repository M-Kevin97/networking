import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { User } from 'src/app/shared/model/user/user';
import { Md5 } from 'ts-md5';

enum AuthErrorCodeManagement {
  EMAIL_INVALID = 'auth/invalid-email',
  USER_DISABLED = 'auth/user-disabled',
  USER_NOT_FOUND = 'auth/user-not-found',
  WRONG_PASSWORD = 'auth/wrong-password'
}

@Component({
  selector: 'app-login-box',
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.scss']
})
export class LoginBoxComponent implements OnInit {
  
  signInForm: FormGroup;
  errorMessage: string; 
  
  hidePassword:boolean = true;

  errorPasswordMessage:string = ''; 
  errorPassword:boolean = false;

  errorEmailMessage:string = ''; 
  errorEmail:boolean = false;

  isVerificationEmailSent:boolean

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required/*, Validators.pattern(/[0-9a-zA-Z]{8,}/)*/]]
    });
  }

  goToSignUp() {
    this.router.navigate([RouteUrl.SIGNUP]);
  }

  onSignIn(){
    
    console.log(this.signInForm.value);

    const md5 = new Md5();
    const email = this.signInForm.get('email').value;
    const password =  md5.appendStr(this.signInForm.get('password').value).end();
    
    this.authService.signInUser(email, password.toString()).then(
      () => {
        this.router.navigate([RouteUrl.FEED]);
      },
      (error) => {
        this.displayError(error.code);
      }
    );
  }

  checkPassword() {
    const pwd:string = this.signInForm.get(['password']).value;
    //let validSpecialCharacters = /[ !@#$%^&*\[\]()_-?]/;
    //validSpecialCharacters.test(pwd)

    if((pwd.length < 8 && pwd.length > 30) 
                        || !this.hasLowerCase(pwd) 
                        || !this.hasUpperCase(pwd)) this.errorPassword = true;
    else this.errorPassword = false;
  }

  private hasLowerCase(str:string) {
    let x;
    for(x=0; x<str.length; x++)
        if(str.charAt(x) >= 'a' && str.charAt(x) <= 'z')
            return true;
    return false;
  }

  private hasUpperCase(str:string) {
    let x;
    for(x=0; x<str.length; x++)
        if(str.charAt(x) >= 'A' && str.charAt(x) <= 'Z')
            return true;
    return false;
  }

  shouldShowRequiredError(controlName) {

    return !this.signInForm.get(controlName).valid && this.signInForm.get(controlName).touched;
  }

  shouldShowSignInError(controlName) {

    switch (controlName){

      case 'email': {
        return this.errorEmail;
      }

      case 'password': {
        return this.errorPassword;
      }

      default: { 
        //statements; 
        break; 
      } 
    }
  }

  forbidOtherCharacters(char) {

    const regex =  /[0-9a-zA-Z!@#$%&:=+£€*\[\]()_\-?]/;

    return regex.test(char);
  }

  displayError(errorCode:string) {

    switch(errorCode) {

      case AuthErrorCodeManagement.EMAIL_INVALID: {
        this.errorMessage = "L'adresse email est invalide";
        break;
      }
      case AuthErrorCodeManagement.USER_DISABLED: {
        this.errorMessage = "Ce compte a été désactivé";
        break;
      }
      case AuthErrorCodeManagement.USER_NOT_FOUND: {
        this.errorMessage = "L'adresse email est inexistante";
        break;
      }
      case AuthErrorCodeManagement.WRONG_PASSWORD: {
        this.errorMessage = "Le mot de passe est invalide, veuillez réessayer";
        break;
      }
      default : {
        break;
      }
    }

  }

  getRoute() {
    return RouteUrl;
  }

}
