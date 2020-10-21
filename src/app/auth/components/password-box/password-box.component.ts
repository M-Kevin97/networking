import { AuthService } from 'src/app/core/auth/auth.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-box',
  templateUrl: './password-box.component.html',
  styleUrls: ['./password-box.component.scss']
})
export class PasswordBoxComponent implements OnInit {

  @Output() passwordUpdated = new EventEmitter();
  
  passwordForm: FormGroup;
  
  hidePassword:boolean = true;
  hideConfirmPassword:boolean = true;

  errorPasswordMessage:string = ''; 
  errorPassword:boolean = false;

  errorConfirmPasswordMessage:string = ''; 
  errorConfirmPassword:boolean =false;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required/*, Validators.pattern(/[0-9a-zA-Z]{8,}/)*/]],
      confirmPassword: ['', [Validators.required/*, Validators.pattern(/[0-9a-zA-Z]{8,}/)*/]]
    });
  }

  checkPassword() {
    const pwd:string = this.passwordForm.get(['password']).value;
    //var hasSpecialCharacters = /[ !@#$%^&*\[\]()_-?]/;
    //validSpecialCharacters.test(pwd)

    //var hasNumber = /\d/;
    // hasNumber.test("ABC"); // false
    // hasNumber.test("Easy as 123"); // true

    if((pwd.length < 8 && pwd.length > 30) 
                        // || !hasNumber.test(pwd)
                        // || !hasSpecialCharacters.test(pwd)
                        || !this.hasLowerCase(pwd) 
                        || !this.hasUpperCase(pwd)) this.errorPassword = true;
    else this.errorPassword = false;
  }

  checkConfirmPassword() {
    const pwd:string = this.passwordForm.get(['password']).value;
    const confPwd:string = this.passwordForm.get(['confirmPassword']).value;
    //let validSpecialCharacters = /[ !@#$%^&*\[\]()_-?]/;
    //validSpecialCharacters.test(pwd)

    if(pwd && !confPwd) {

        this.errorConfirmPassword = true;
        this.errorConfirmPasswordMessage = "Veuillez confirmer le mot de passe.";
    }
    else if(!(confPwd && pwd)) return;

    if(confPwd !== pwd) {

      this.errorConfirmPassword = true;
      this.errorConfirmPasswordMessage = "Les mots de passe ne sont pas identiques, veuillez réessayer.";

    } else {
      this.errorConfirmPassword = false;
      this.errorPassword = false;
    }
  }

  onUpdatePassword() {

    const pwd = this.passwordForm.get('confirmPassword').value;

    if(!pwd) {
      this.errorConfirmPassword = false;
      this.errorConfirmPasswordMessage = "Veuillez confirmer le mot de passe.";
    }

    this.authService.updatePasswordWith(pwd).then(
      () => {
        console.warn('updatePasswordWith');
        this.passwordUpdated.next(true);
      }
    ).catch(
      (error) => {
        this.checkPasswordError(error.code);
      }
    );
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

    return !this.passwordForm.get(controlName).valid && this.passwordForm.get(controlName).touched;
  }


  shouldShowSignUpError(controlName) {

    switch (controlName){

      case 'password': {
        return this.errorPassword;
      }
      case 'confirmPassword': {
        return this.errorConfirmPassword;
      }
      default: { 
        //statements; 
        break; 
      } 
    }
  }

  private resetPasswordError() {
    this.errorPassword = false;
    this.errorPasswordMessage = 'Le mot de passe doit contenir au moins 8 caractères majuscules et minuscules ainsi que des chiffres et des symboles (tels que @ & ! ? $ #).';
  }

  private checkPasswordError(errorCode:string) {

    console.warn('checkErrorAuth',errorCode);

    switch (errorCode){

      case 'auth/weak-password': {
        console.warn('checkErrorAuth1',errorCode);
        this.errorPasswordMessage = 'Veuillez choisir un mot de passe plus sûr. Essayer de mélanger des chiffres des lettres et des symboles (tels que @ & ! ? $ #)';
        this.errorPassword = true;
        this.passwordForm.reset();
        break;
      }
      default: { 
        this.resetPasswordError();
        break; 
      } 
    }
  }

}
