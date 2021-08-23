import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Database } from 'src/app/core/database/database.enum';
import { User } from 'src/app/shared/model/user/user';
import { UserLevel } from 'src/app/shared/model/UserLevel.enum';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {

  @Input() emailUser:string = '';
  @Input() idUser:string = '';

  @Output() errorMessage:EventEmitter<string> = new EventEmitter();
  @Output() successMessage:EventEmitter<string> = new EventEmitter();

  passwordUpdatingErrorMessage:string = '';
  passwordMessage:string = '';
  password:string = '';

  verificationForm: FormGroup;

  hasSelected:boolean = false;

  roles:string[] = [];
  roleSelect:string;
  roleInit:string = "Activité";

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService) { 

    this.roles = ["Salarié", "Sans activité", "Étudiant", "Formateur", "Autre"];       
  }

  ngOnInit() {

    this.initForm();
  }

  initForm(){

    this.verificationForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
    });

    this.roleSelect = this.roleInit;
  }

  shouldShowRequiredError(controlName) {

    return !this.verificationForm.get(controlName).valid && this.verificationForm.get(controlName).touched;
  }

  private finishVerification() {

    // alert('finishVerification');

    const firstname = this.verificationForm.get('firstname').value;
    const lastname = this.verificationForm.get('lastname').value;
    const role = this.roleSelect === this.roleInit ? this.roles[this.roles.length-1]: this.roleSelect;

    let user:User = new User(this.idUser, 
                              firstname, 
                              lastname,
                              false,
                              this.emailUser,
                              this.password,
                              Database.DEFAULT_PP_USER,
                              null,
                              null,
                              null,
                              null,
                              null,
                              role,
                              UserLevel.STANDARD,
                              false,
                              [],
                              [],
                              []);

    user.setSearchContent();


      
    this.authService.createAccountWith(user,
      (val) => {

        console.error('finishVerification authService.createAccountWith : '+val);
        // alert('verification createAccountWith');

        const verificationSuccessMessage = 'Bienvenue, \n Votre compte a bien été créé, vous pouvez vous connecter.'; 
        this.successMessage.next(verificationSuccessMessage); 

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
        this.errorMessage.next(error.message);
        //this.displayError(error.code);
      }
    );
  }

  isRole(role:string) {

    console.log(role);
   return role === this.roles[0];
  }

  onChangeSelectRole(event) {

    console.log(event);
    this.roleSelect = event;
  }

  onUpdatePassword() {

    if(this.password) {

      // alert(this.password);

      this.authService.updatePasswordWith(this.password,
        () => {
          // alert('password updated');
          this.finishVerification();
        }
      ).catch(
        (error) => {
          // alert(error.message);
          this.checkPasswordError(error.code);
        }
      );
    }
  }

  private checkPasswordError(errorCode:string) {

    console.warn('checkErrorAuth',errorCode);

    switch (errorCode){

      case 'auth/weak-password': {
        this.passwordUpdatingErrorMessage = 'Veuillez choisir un mot de passe plus sûr. Essayer de mélanger des chiffres des lettres et des symboles (tels que @ & ! ? $ #)';
        break;
      }
      default: { 
        this.passwordUpdatingErrorMessage = 'Le mot de passe doit contenir au moins 8 caractères majuscules et minuscules, un chiffre ainsi que des symboles (tels que @ & ! ? $ #).';
        break; 
      } 
    }
    this.errorMessage.next(this.passwordUpdatingErrorMessage);
  }
}
