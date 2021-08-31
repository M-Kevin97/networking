import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { SignupComponent } from './../../pages/signup/signup.component';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserService } from 'src/app/shared/service/user/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-auth',
  templateUrl: './pre-auth.component.html',
  styleUrls: ['./pre-auth.component.scss']
})
export class PreAuthComponent implements OnInit {

  preAuthForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router:      Router,
              private userService: UserService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(){

    this.preAuthForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // if mail in db login else signup
  onPreAuth(){

    const email = this.preAuthForm.get('email').value;
    this.authService.emailPreAuth = email;

    this.authService.login(email, 'test').catch(
      (error) => {

        switch(error.code) {
          case 'auth/user-not-found': {

            this.goToSignUp();
            break;
          }
          case 'auth/wrong-password': {

            this.goToLogIn();
            break;
          }
          default : {

          }
        }
      }
    );
  }

  goToLogIn() {
    
    this.router.navigate([RouteUrl.LOGIN]);
  }

  goToSignUp() {

    this.router.navigate([RouteUrl.SIGNUP]);
  }
}
