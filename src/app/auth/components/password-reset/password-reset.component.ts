import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RouteUrl } from 'src/app/core/router/route-url.enum';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  @Input() actionCode:any;
  @Input() emailUser:string = '';
  @Output() errorMessage:EventEmitter<string> = new EventEmitter();
  @Output() successMessage:EventEmitter<string> = new EventEmitter();

  passwordUpdatingErrorMessage:string = '';
  passwordMessage:string = '';
  password:string = '';

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() { }

  onTimerFinished(e:Event){
    if (e["action"] == "done"){
      this.router.navigate([RouteUrl.LOGIN]);
    }
  }

  resetPassword() {

    if(this.password) {
      this.authService.confirmPasswordReset(this.actionCode, this.password).then(
        () => {
          const verificationSuccessMessage = 'Votre mot de passe a bien été réinitialisé, vous pouvez vous connecter dès maintenant.'; 
          this.successMessage.next(verificationSuccessMessage); 
        }
      ).catch(
        (error) => {
          this.checkError(error.code);
        }
      );
    }
  }

  private checkError(errorCode:string) {

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
