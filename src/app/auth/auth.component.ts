import { AuthService } from 'src/app/core/auth/auth.service';
import { RouteUrl } from './../core/router/route-url.enum';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { User } from '../shared/model/user/user';

enum UserManagementActions {
  RESET_PASSWORD = 'resetPassword',
  RECOVER_MAIL = 'recoverEmail',
  VERIFY_EMAIL = 'verifyEmail',
  SIGN_IN = 'signIn',
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, AfterViewInit, OnDestroy {

  // firebase authentification
  auth = firebase.auth();
  // The action to complete.
  mode:any;
  // The one-time code
  actionCode:any;
  // (Optional) The continue URL
  continueUrl:any;
  // (Optional) The language code
  lang:any;

  // Message sent by the operation (email verification / password reset)
  successMessage:string = '';
  errorMessage:string = '';

  // email variable to start the different operation
  isEmailVerified:boolean = false;
  email:string = '';
  idUser:string = '';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService) {

  }

  ngOnInit() {

    this.getUrlParameters();
  }

  getUrlParameters() {

    this.route.queryParams.subscribe(
      (params) => {

        // si pas de params afficher message d'erreur et rediriger vers acceuil
        if (!params){
          console.error('no params')
          //this.router.navigate([RouteUrl.HOME]);
        }

        // Get the action to complete.
        this.mode = params['mode'];
        // Get the one-time code from the query parameter.
        this.actionCode = params['oobCode'];
        // (Optional) Get the continue URL from the query parameter if available.
        this.continueUrl = params['continueUrl'] || '';
        // (Optional) Get the language code if available.
        this.lang = params['lang'] || 'fr';
      }
    );
  }

  ngAfterViewInit() {

    this.actionManager();
  }

  actionManager() {
    if((this.mode && this.actionCode) || this.continueUrl || this.lang) 
    {
      console.error('route.queryParams', this.mode, this.actionCode, this.continueUrl, this.lang);

      // Handle the user management action.
      switch (this.mode) {
        case UserManagementActions.RESET_PASSWORD: {
          // Display reset password handler and UI.
          this.handleResetPassword(this.auth, this.actionCode, this.continueUrl, this.lang);
          break;
        }
        case UserManagementActions.RECOVER_MAIL: {
          // Display email recovery handler and UI.
          this.handleRecoverEmail(this.auth, this.actionCode, this.lang);
          break;
        }
        case UserManagementActions.VERIFY_EMAIL || UserManagementActions.SIGN_IN: {
          // Display email verification handler and UI.
          this.handleVerifyEmail();
          break;
        }
        case UserManagementActions.SIGN_IN: {
          // Display email verification handler and UI.
          this.handleVerifyEmail();
          break;
        }
        default:
          // Error: invalid mode.
          console.warn('actionManager', this.mode);
          //this.router.navigate([RouteUrl.HOME]);
          break;
      }
    }
  }

  emailVerification(event) {

    if(event) {
      
      this.email = event;

      console.error('emailVerification', event);

      switch (this.mode) {
        case UserManagementActions.VERIFY_EMAIL: {

          this.authService.emailVerification(event).then(
            (val:firebase.auth.UserCredential) => {

              console.error('authService emailVerification', val);

              if(val) {
  
                this.idUser = val.user.uid;
                this.isEmailVerified = true;
                this.authService.preSignUpUser = val;

                console.warn(val);

              }
            }
          ).catch(
            (error) => {
              console.error(error);
              this.displayErrorMessage(error.code);
            }
          );

          break;
        }
        case UserManagementActions.SIGN_IN: {

          this.authService.emailVerification(event).then(
            (val:firebase.auth.UserCredential) => {

              console.error('authService emailVerification', val);

              if(val) {
  
                this.idUser = val.user.uid;
                this.isEmailVerified = true;
                this.authService.preSignUpUser = val;

                console.warn(val);

              }
            }
          ).catch(
            (error) => {
              console.error(error);
              this.displayErrorMessage(error.code);
            }
          );
          break;
        }
        case UserManagementActions.RESET_PASSWORD: {

          break;
        }
        case UserManagementActions.RECOVER_MAIL: {

          break;
        }
      }
    }
  }

  displayErrorMessage(errorCode:string) {

    switch(errorCode){
      case 'auth/invalid-action-code': {
        this.errorMessage = "Le lien de vérification n'est pas valide, il est soit expiré ou a déjà été utilisé.";
        break;
      }
      case 'auth/invalid-action-code': {
        this.errorMessage = "Le lien de vérification n'est pas valide, il est soit expiré ou a déjà été utilisé.";
        break;
      }
      default : {
        this.errorMessage = '';
        break;
      }
    }
  }

  onTimerFinished(e:Event){
    if (e["action"] === 'done'){
      this.router.navigate([RouteUrl.LOGIN]);
    }
  }

  private handleVerifyEmail() {

    this.authService.isEmailVerificationLink().then(
      (bool) => {
        if(bool) {
          // get email in local storage
          const email = window.localStorage.getItem('netSkillsEmailForSignIn') 
          ? window.localStorage.getItem('netSkillsEmailForSignIn') 
          : null;

          console.warn('handleVerifyEmail');

          // if has email verify link
          if(email) this.emailVerification(email);
        } else {
          console.error('email is not verified');
          //this.router.navigate([RouteUrl.HOME]);
        }
      }
    ).catch(
      (error) => {
        console.error(error.message);
        this.displayErrorMessage(error.code);
        //this.router.navigate([RouteUrl.HOME]);
      }
    );
    
    // // Localize the UI to the selected language as determined by the lang
    // // parameter.
    // // Try to apply the email verification code.
    // auth.applyActionCode(actionCode).then(function(resp) {
    //   // Email address has been verified.
  
    //   // TODO: Display a confirmation message to the user.
    //   // You could also provide the user with a link back to the app.
  
    //   // TODO: If a continue URL is available, display a button which on
    //   // click redirects the user back to the app via continueUrl with
    //   // additional state determined from that URL's parameters.
    // }).catch(function(error) {
    //   // Code is invalid or expired. Ask the user to verify their email address
    //   // again.
    // });
  }

  private handleResetPassword(auth, actionCode, continueUrl, lang) {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    var accountEmail;
    // Verify the password reset code is valid.
    auth.verifyPasswordResetCode(actionCode).then(
      (email) => {

        console.warn('handleResetPassword', email);
        this.email = email;
        this.isEmailVerified = true;
      
    }).catch(function(error) {
      // Invalid or expired action code. Ask user to try to reset the password
      // again.

      console.error(error.message);
      this.displayErrorMessage(error.code);
    });
  }


  private handleRecoverEmail(auth, actionCode, lang) {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    var restoredEmail = null;
    // Confirm the action code is valid.
    auth.checkActionCode(actionCode).then(function(info) {
      // Get the restored email address.
      this.email = info['data']['email'];
  
      // Revert to the old email.
      return auth.applyActionCode(actionCode);
    }).then(function() {
      // Account email reverted to restoredEmail
  
      // TODO: Display a confirmation message to the user.
  
      // You might also want to give the user the option to reset their password
      // in case the account was compromised:
      auth.sendPasswordResetEmail(this.email).then(function() {
        // Password reset confirmation sent. Ask user to check their email.
      }).catch(function(error) {
        // Error encountered while sending password reset code.
      });
    }).catch(function(error) {
      // Invalid code.
    });
  }

  ngOnDestroy() {
    if(this.email && !this.successMessage) this.authService.signOutUser();
  }
}
