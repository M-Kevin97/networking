import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/auth/auth.service';
import { User } from '../shared/model/user/user';
import { UserLevel } from '../shared/model/UserLevel.enum';

@Component({
  selector: 'app-getstarted',
  templateUrl: './getstarted.component.html',
  styleUrls: ['./getstarted.component.scss']
})
export class GetstartedComponent implements OnInit {

  @Input() emailUser:string = '';
  @Input() idUser:string = '';

  // @Output() errorMessage:EventEmitter<string> = new EventEmitter();
  // @Output() successMessage:EventEmitter<string> = new EventEmitter();

  passwordUpdatingErrorMessage:string = '';
  passwordMessage:string = '';
  password:string = '';

  startedForm: FormGroup;

  hasSelected:boolean = false;

  // roles:string[] = [];
  // roleSelect:string;
  // roleInit:string = "Activité";

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService) { 

    // this.roles = ["Salarié", "Sans activité", "Étudiant", "Formateur", "Autre"];       
  }

  ngOnInit() {

    this.initForm();
  }

  initForm(){

    this.startedForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
    });

    // this.roleSelect = this.roleInit;
  }

  shouldShowRequiredError(controlName) {

    return !this.startedForm.get(controlName).valid && this.startedForm.get(controlName).touched;
  }

  // onStart() {

  //   // alert('finishVerification');

  //   const firstname = this.startedForm.get('firstname').value;
  //   const lastname = this.startedForm.get('lastname').value;
  //   // const role = this.roleSelect === this.roleInit ? this.roles[this.roles.length-1]: this.roleSelect;

  //   const idUser = this.authService.authUser.id;

  //   alert(idUser);

  //   let user:User = new User( idUser, 
  //                             firstname, 
  //                             lastname,
  //                             false,
  //                             this.emailUser,
  //                             this.password,
  //                             null,
  //                             null,
  //                             null,
  //                             null,
  //                             null,
  //                             null,
  //                             null,
  //                             UserLevel.STANDARD,
  //                             false,
  //                             [],
  //                             [],
  //                             []);

  //   user.setSearchContent();


      
  //   this.authService.createAccountWith(user,
  //     (val) => {

  //       console.error('finishVerification authService.createAccountWith : '+val);
  //       // alert('verification createAccountWith');

  //       const verificationSuccessMessage = 'Bienvenue, \n Votre compte a bien été créé, vous pouvez maintenant vous connecter.'; 
  //       //this.successMessage.next(verificationSuccessMessage); 

  //       // this.authService.signOutUser().then(
  //       //   () => {
  //       //       const verificationSuccessMessage = 'Bienvenue, \n Votre compte a bien été créé, vous pouvez vous connecter.'; 
  //       //       this.successMessage.next(verificationSuccessMessage); 
  //       //     }
  //       // ).catch(
  //       //   (error) => {
  //       //     // console.error(error.message);
  //       //     this.errorMessage.next(error.message);
  //       //     //this.sendErrorMessage('');
  //       //   }
  //       // );
  //     }
  //   ).catch(
  //     (error) => {
  //       console.error(error);
  //       //this.errorMessage.next(error.message);
  //       //this.displayError(error.code);
  //     }
  //   );
  // }

  // isRole(role:string) {

  //   console.log(role);
  //  return role === this.roles[0];
  // }

  // onChangeSelectRole(event) {

  //   console.log(event);
  //   this.roleSelect = event;
  // }

  onStart() {

    // if(this.password) {

    //   // alert(this.password);

    //   this.authService.updatePasswordWith(this.password,
    //     () => {
    //       // alert('password updated');
    //       this.finishVerification();
    //     }
    //   ).catch(
    //     (error) => {
    //       // alert(error.message);
    //       //this.checkPasswordError(error.code);
    //     }
    //   );
    // }

    // this.finishVerification()    

  }

  // private checkPasswordError(errorCode:string) {

  //   console.warn('checkErrorAuth',errorCode);

  //   switch (errorCode){

  //     case 'auth/weak-password': {
  //       this.passwordUpdatingErrorMessage = 'Veuillez choisir un mot de passe plus sûr. Essayer de mélanger des chiffres des lettres et des symboles (tels que @ & ! ? $ #)';
  //       break;
  //     }
  //     default: { 
  //       this.passwordUpdatingErrorMessage = 'Le mot de passe doit contenir au moins 8 caractères majuscules et minuscules, un chiffre ainsi que des symboles (tels que @ & ! ? $ #).';
  //       break; 
  //     } 
  //   }
  //   //this.errorMessage.next(this.passwordUpdatingErrorMessage);
  // }

}
