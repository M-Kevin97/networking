import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RouteUrl } from 'src/app/core/router/route-url.enum';

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
    
    const email = this.signInForm.get('email').value;
    const password = this.signInForm.get('password').value;
    
    this.authService.signInUser(email, password).then(
      () => {
        this.router.navigate([RouteUrl.FEED]);
      },
      (error) => {
        this.errorMessage = error;
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

}
