import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { User } from 'src/app/shared/model/user/user';
import { UserLevel } from 'src/app/shared/model/UserLevel.enum';


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
  mode: any;
  // The one-time code
  actionCode: any;
  // (Optional) The continue URL
  continueUrl:  any;
  // (Optional) The language code
  lang: any;

  // Message sent by the operation (email verification / password reset)
  successMessage: string = '';
  errorMessage: string = '';

  // email variable to start the different operation
  isEmailVerified:  boolean = false;
  email: string = null;

  gotLocalStorage:  boolean = true;

  idUser: string = '';

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
      const mode : string = this.mode;

      // Handle the user management action.
      switch (mode) {
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

        case UserManagementActions.VERIFY_EMAIL : {

          // Display email verification handler and UI.
          this.handleVerifyEmail();
          break;
        }

        default:
          // Error: invalid mode.
          // console.warn('actionManager', this.mode);
          //this.router.navigate([RouteUrl.HOME]);
          break;
      }
    }
  }


  // emailVerification(event) {

  //   if(event) {
      
  //     this.email = event;

  //     switch (this.mode) {

  //       case UserManagementActions.VERIFY_EMAIL : {

  //         this.authService.emailVerification(event).then(
  //           (val:firebase.auth.UserCredential) => {

  //             if(val) {
  
  //               this.idUser = val.user.uid;
  //               this.isEmailVerified = true;
  //               this.authService.preSignUpUser = val;
  //             }
  //           }
  //         ).catch(
  //           (error) => {
  //             console.error(error);
  //             this.displayErrorMessage(error.code);
  //           }
  //         );

  //         break;
  //       }

  //       case UserManagementActions.RESET_PASSWORD: {

  //         break;
  //       }
        
  //       case UserManagementActions.RECOVER_MAIL: {

  //         break;
  //       }
  //     }
  //   }
  // }


  createUserAccount() {

    // alert('finishVerification');

    // const firstname = this.startedForm.get('firstname').value;
    // const lastname = this.startedForm.get('lastname').value;
    // const role = this.roleSelect === this.roleInit ? this.roles[this.roles.length-1]: this.roleSelect;

    const aUser = this.authService.preSignUpUser.user;

    // alert(aUser.email);

    let user:User = new User( aUser.uid, 
                              null, 
                              null,
                              false,
                              aUser.email,
                              null,
                              null,
                              null,
                              null,
                              null,
                              null,
                              null,
                              null,
                              UserLevel.STANDARD,
                              false,
                              [],
                              [],
                              []);

    user.setSearchContent();


      
    this.authService.createAccountWith(user,
      (val) => {

        this.goToUserSettings();

        console.error('finishVerification authService.createAccountWith : '+val);
        // alert('verification createAccountWith');

        const verificationSuccessMessage = 'Bienvenue, \n Votre compte a bien été créé, vous pouvez maintenant vous connecter.'; 
        //this.successMessage.next(verificationSuccessMessage); 

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
        //this.errorMessage.next(error.message);
        //this.displayError(error.code);
      }
    );
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


  private handleVerifyEmail() {

    this.authService.checkIfEmailVerified().then(
      (bool) => {

        if(bool) this.goToUserSettings();
      }
    );

    // this.authService.isEmailVerificationLink().then(
    //   (bool) => {

    //     if(bool) {

    //       // get email in local storage
    //       let email : string = null;

    //       if(window.localStorage.getItem('wyskillEmailForSignIn')) {

    //         email = window.localStorage.getItem('wyskillEmailForSignIn');
    //         this.gotLocalStorage = true;
    //       } else  {

    //         email = null;
    //         this.gotLocalStorage = false;
    //       }

    //       // if has email verify link
    //       if(email) this.emailVerification(email);

    //     } else {
    //       // console.error('email is not verified');
    //       //this.router.navigate([RouteUrl.HOME]);
    //     }
    //   }
    // ).catch(
    //   (error) => {
    //     console.error(error.message);
    //     this.displayErrorMessage(error.code);
    //     //this.router.navigate([RouteUrl.HOME]);
    //   }
    // );
    
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

    // get email in local storage
    const email = window.localStorage.getItem('wyskillEmailForPasswordReset') 
    ? window.localStorage.getItem('wyskillEmailForPasswordReset') 
    : null;

    // Verify the password reset code is valid.
    auth.verifyPasswordResetCode(actionCode).then(
      (email) => {

        this.email = email;
        this.isEmailVerified = true;
        this.goToResetPassword();
      }
    ).catch(function(error) {

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


  onTimerFinished(e:Event){
    if (e["action"] === 'done'){
      this.router.navigate([RouteUrl.GET_STARTED]);
    }
  }


  goToUserSettings() {

    this.router.navigate([RouteUrl.SETTINGS + RouteUrl.PROFILE_SETTINGS]);
  }

  goToGetStarted() {

    this.router.navigate([RouteUrl.GET_STARTED]);
  }

  goToResetPassword() {
    
    this.router.navigate([RouteUrl.PASSWORD_FORGOTTEN]);
  }

  goToUserFeed() {
    
    this.router.navigate([RouteUrl.USER_HOME]);
  }


  ngOnDestroy() {
    if(this.email && !this.successMessage) this.authService.signOutUser();
  }
}
