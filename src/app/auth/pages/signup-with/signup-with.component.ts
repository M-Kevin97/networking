import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Database } from 'src/app/core/database/database.enum';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { User } from 'src/app/shared/model/user/user';
import { UserLevel } from 'src/app/shared/model/UserLevel.enum';

@Component({
  selector: 'app-signup-with',
  templateUrl: './signup-with.component.html',
  styleUrls: ['./signup-with.component.scss']
})
export class SignupWithComponent implements OnInit {

  signUpForm: FormGroup;
  
  errorMessage: string = '';
  successMessage: string = ''; 

  hasSelected:boolean = false;

  roles:string[] = [];
  roleSelect:string;
  roleInit:string = "Activité";

  password:string = '';
  mail:string = '';
  lastname:string = '';
  firstname:string = '';
  ppLink:string = '';

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { 

    this.roles = ["Salarié", "Sans activité", "Étudiant", "Formateur", "Autre"];       
  }

  ngOnInit() {

    this.initForm();
  }

  initForm(){
    this.signUpForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
    });

    this.roleSelect = this.roleInit;

    this.mail = this.authService.preSignUpUser.additionalUserInfo.profile['email'];
    this.lastname = this.authService.preSignUpUser.additionalUserInfo.profile['family_name'];
    this.firstname = this.authService.preSignUpUser.additionalUserInfo.profile['given_name'];
    this.ppLink = this.authService.preSignUpUser.additionalUserInfo.profile['picture'];
  }

  createUser() {

    const id = this.authService.preSignUpUser.user.uid;
    const role = this.roleSelect === this.roleInit ? this.roles[this.roles.length-1]: this.roleSelect;

    let user:User = new User(id, 
                             this.firstname, 
                             this.lastname,
                             null,
                             this.mail,
                             this.password,
                             this.ppLink,
                             null,
                             null,
                             null,
                             null,
                             null,
                             role,
                             UserLevel.STANDARD,
                             false,
                             [],
                             []);

      user.setSearchContent();

      
    this.authService.createAccountWith(user,
      (val) => {
        this.authService.signOutUser().then(
          () => {
            this.successMessage = 'Bienvenue, \n Votre compte a bien été créé, vous pouvez vous connecter.'; 
            }
        ).catch(
          (error) => {
            console.error(error.message);
            //this.sendErrorMessage('');
          }
        );
      }
    ).catch(
      (error) => {
        console.error(error);
        this.displayError(error.code);
      }
    );
  }

  shouldShowRequiredError(controlName) {

    return !this.signUpForm.get(controlName).valid && this.signUpForm.get(controlName).touched;
  }

  onUpdatePassword() {

    let newPassword = this.password;

    if(newPassword) {

      this.authService.updatePasswordWith(newPassword, this.authService.preSignUpUser.user).then(
        () => {
          this.createUser();
        }
      ).catch(
        (error) => {
          console.error(error);
          this.displayError(error.code);
        }
      );
    } else this.displayError('');
  }

  private displayError(errorCode:string) {

    console.warn('displayError',errorCode);

    switch (errorCode){

      case 'auth/weak-password': {
        this.errorMessage = 'Veuillez choisir un mot de passe plus sûr. Essayer de mélanger des chiffres des lettres et des symboles (tels que @ & ! ? $ #)';
        break;
      }
      default: { 
        this.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères majuscules et minuscules, un chiffre ainsi que des symboles (tels que @ & ! ? $ #).';
        break; 
      } 
    }
  }

  onTimerFinished(e:Event){
    if (e["action"] == "done"){
      this.router.navigate([RouteUrl.LOGIN]);
    }
  }

  isRole(role:string) {

    console.log(role);
   return role === this.roles[0];
  }

  onChangeSelectRole(event) {

    console.log(event);
    this.roleSelect = event;
  }


  goToSignIn() {
    this.router.navigate([RouteUrl.LOGIN]);
  }

}
