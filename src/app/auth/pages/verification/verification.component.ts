import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit, AfterViewInit, OnDestroy {


  isEmailVerified:boolean = false;
  email:string = '';
  emailVerificationMessage:string = '';
  emailVerificationErrorMessage:string = '';
  displayPassword:boolean = false;
  passwordMessage:string = '';

  constructor(private authService: AuthService,
              private router: Router,
              private modalService: NgbModal) {

    this.email = window.localStorage.getItem('netSkillsEmailForSignIn') 
                    ? window.localStorage.getItem('netSkillsEmailForSignIn') 
                    : '';

    console.log('email', this.email);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

    if(this.email) this.emailVerification(this.email);
  }

  emailVerification(event) {
    if(event) {
      console.log(event);
      this.authService.emailVerification(event).then(
        (val:firebase.auth.UserCredential) => {

          console.log('emailVerification', val.user.email);

          if(val) {
            this.displayPassword = true;
          }

        }
      ).catch(
        (error) => {
          console.error(error);
          this.displayErrorMessage(error.code);
        }
      );
    }
  }

  finishVerification(event) {
    console.warn('finishVerification', event);

    if(event) {
      this.authService.signOutUser().then(
        () => {
          console.warn('isEmailVerified', true);
            this.isEmailVerified = true;
            this.emailVerificationMessage = 'Bienvenue, \n Votre compte a bien été créé, vous pouvez vous connecter.';  
          }
      ).catch(
        (error) => {
          console.error(error.message);
        }
      );
    }
  }

  displayErrorMessage(errorCode:string) {
    switch(errorCode){
      case 'auth/invalid-action-code': {
        this.emailVerificationErrorMessage = "Le lien de vérification n'est pas valide, il est soit expiré ou a déjà été utilisé.";
        break;
      }
      case 'auth/invalid-action-code': {
        this.emailVerificationErrorMessage = "Le lien de vérification n'est pas valide, il est soit expiré ou a déjà été utilisé.";
        break;
      }
      default :{

        break;
      }
    }
  }

  onTimerFinished(e:Event){
    if (e["action"] == "done"){
      this.router.navigate([RouteUrl.LOGIN]);
    }
  }

  ngOnDestroy() {
    if(!this.isEmailVerified) this.authService.signOutUser();
  }
}
