import { NullVisitor } from '@angular/compiler/src/render3/r3_ast';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-password-box',
  templateUrl: './password-box.component.html',
  styleUrls: ['./password-box.component.scss']
})
export class PasswordBoxComponent implements OnInit {

  @Output() password:EventEmitter<string> = new EventEmitter();
  
  passwordForm: FormGroup;
  
  hidePassword:boolean = true;
  hideConfirmPassword:boolean = true;

  errorPasswordMessageEmpty:string = ''; 
  errorPasswordMessage:string[] = []; 
  errorPassword:boolean = false;

  errorConfirmPasswordMessage:string = ''; 
  errorConfirmPassword:boolean =false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z!@#$%&:=+£€*\[\]()_\-?]{8,50}/)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z!@#$%&:=+£€*\[\]()_\-?]{8,50}/)]]
    });
  }

  checkPassword() {
    const pwd:string = this.passwordForm.get(['password']).value;
    
    this.errorPasswordMessage.splice(0,this.errorPasswordMessage.length);
    this.errorPasswordMessageEmpty = '';
    this.errorPassword = false;

    if(!pwd.length) {
      this.errorPassword = true;
      this.errorPasswordMessageEmpty = 'Le mot de passe doit contenir au moins 8 caractères majuscules et minuscules, un chiffre ainsi que des symboles (tels que @ & ! ? $ #).';
    } else {
      this.errorPasswordMessageEmpty = '';
      if(!(pwd.length >= 8 && pwd.length <= 50)) {
        this.errorPassword = true;
        this.errorPasswordMessage.push('8 caractères');
      }
  
      if(!this.hasLowerCase(pwd)) {
        this.errorPassword = true;
        this.errorPasswordMessage.push('Une minuscule');
      }
  
      if(!this.hasUpperCase(pwd)) {
        this.errorPassword = true;
        this.errorPasswordMessage.push('Une majuscule');
      }

      if(!this.hasNumber(pwd)) {
        this.errorPassword = true;
        this.errorPasswordMessage.push('Un chiffre');
      }
  
      if(!this.hasSpecialCharacters(pwd)) {
        this.errorPassword = true;
        this.errorPasswordMessage.push('Un caractère spécial\n! @ # $ % & : = + £ € * []()_-?');
      }
    }

    return this.errorPassword;
  }

  checkConfirmPassword() {
    const pwd:string = this.passwordForm.get(['password']).value;
    const confPwd:string = this.passwordForm.get(['confirmPassword']).value;

    this.errorConfirmPassword = false;

    if(confPwd.length && pwd.length) {

      if(confPwd !== pwd) {

        this.password.next(null);
        this.errorConfirmPassword = true;
        this.errorConfirmPasswordMessage = "Les mots de passe ne sont pas identiques, veuillez réessayer.";
  
      } else {
        
        this.errorConfirmPassword = false;
        this.errorPassword = false;
        this.sendPassword();
      }
    }
    else {

      this.password.next(null);
      this.errorConfirmPassword = true;

      if(this.errorPassword) {

        this.errorConfirmPasswordMessage = "Veuillez saisir un mot de passe correct";
      }
      else if(pwd.length && !confPwd.length) {

        this.errorConfirmPasswordMessage = "Veuillez confirmer votre mot de passe.";
      }
      else if(!confPwd.length && !pwd.length) {

        this.errorConfirmPasswordMessage = "Veuillez saisir votre mot de passe.";
      }
    }

    return this.errorConfirmPassword;
  }

  sendPassword() {

    // alert('sendPassword');

    const md5 = new Md5();
    const pwd = (md5.appendStr(this.passwordForm.get('confirmPassword').value).end()).toString();
    
    if(!pwd) {
      this.errorConfirmPassword = false;
      this.errorConfirmPasswordMessage = "Veuillez confirmer le mot de passe.";
    }else {
      this.password.next(pwd);
    }
  }

  forbidOtherCharacters(char) {

    const regex =  /[0-9a-zA-Z!@#$%&:=+£€*\[\]()_\-?]/;

    return regex.test(char);
  }

  private hasLowerCase(str:string) {
    // let x;
    // for(x=0; x<str.length; x++)
    //     if(str.charAt(x) >= 'a' && str.charAt(x) <= 'z')
    //         return true;
    // return false;

    const regex =  /[a-z]/;

    return str.search(regex) > -1 ? true : false;
  }

  private hasUpperCase(str:string) {
    // let x;
    // for(x=0; x<str.length; x++)
    //     if(str.charAt(x) >= 'A' && str.charAt(x) <= 'Z')
    //         return true;
    // return false;

    const regex =  /[A-Z]/;

    return str.search(regex) > -1 ? true : false;
  }

  private hasSpecialCharacters(str:string) {

    const regex =  /[!@#$%&:=+£€*\[\]()_\-?]/;

    return str.search(regex) > -1 ? true : false;
  }

  private hasNumber(str:string) {

    const regex =  /[0-9]/;

    return str.search(regex) > -1 ? true : false;
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

  

}
