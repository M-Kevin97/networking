import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { UserService } from 'src/app/shared/service/user/user.service';

@Component({
  selector: 'app-password-forgotten',
  templateUrl: './password-forgotten.component.html',
  styleUrls: ['./password-forgotten.component.scss']
})
export class PasswordForgottenComponent implements OnInit {

  isEmailExist:boolean = false;
  email:string = '';
  errorMessage:string = '';

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {

  }

  checkUserExistByEmail(email:string) {

    return UserService.getUserByMail(email,
      (user) => {
        console.log(user);
        if(user) return true;
        else return false;
      }
    ).catch(
      (error) => {
        console.error(error);
        return false;
      }
    );
  }

  sendPasswordResetEmail(event) {
    if(event) {
      console.log("reset password email to send ", event);
      this.checkUserExistByEmail(event).then(
        (bool) => {
          console.log("email exist check sent");
          if(bool) this.authService.sendMailPasswordReinitialisation(event).then(
            () => {
              console.log("reset password email sent");
              this.email = event;
            }
          ).catch(
            (error) => {
              console.error(error);
              switch(error.code) {
                case 'auth/too-many-requests': {
                  this.errorMessage = 'Nous avons bloqué toutes les demandes de cet appareil en raison d\'une activité inhabituelle. Réessayez plus tard.';
                }
                default : {
                  this.errorMessage = '';
                }
              }
            }
          );
        }
      )
    }
  }
}
