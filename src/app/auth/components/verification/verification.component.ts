import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { User } from 'src/app/shared/model/user/user';
import { UserLevel } from 'src/app/shared/model/UserLevel.enum';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  private finishVerification() {

    // alert('finishVerification');

    const a_user = this.authService.authUser;

    let user:User = new User(a_user.id, 
                              null, 
                              null,
                              false,
                              a_user.mail,
                              a_user.password,
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

        console.error('finishVerification authService.createAccountWith : '+val);
        // alert('verification createAccountWith');

        const verificationSuccessMessage = 'Bienvenue, \n Votre compte a bien été créé, vous pouvez maintenant vous connecter.'; 
       
       // this.successMessage.next(verificationSuccessMessage); 

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
}
