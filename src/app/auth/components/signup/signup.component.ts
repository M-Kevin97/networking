import { Database } from 'src/app/core/database/database.enum';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { User } from 'src/app/shared/user/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;
  errorMessage: string;  

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.signUpForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required]/*, Validators.email*/],
      password: ['', [Validators.required/*, Validators.pattern(/[0-9a-zA-Z]{8,}/)*/]]
    });
  }

  onSignUp(){

     // stop here if form is invalid
     /*if (this.signUpForm.invalid) {
      return;
    }*/
  
    console.log(this.signUpForm.value);
    
    const firstname:string = this.signUpForm.get('firstname').value;
    const lastname:string = this.signUpForm.get('lastname').value;
    const email:string = this.signUpForm.get('email').value;
    const password:string = this.signUpForm.get('password').value;
    const ppLink:string = Database.DEFAULT_PP_USER;

    this.authService.signUpUser(new User(null, firstname, 
                                                lastname, 
                                                email, 
                                                password,
                                                ppLink,
                                                null,
                                                null,
                                                null,
                                                [],
                                                []))
      .then(
      () => {
        
        this.router.navigate(['/auth/signin']);
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }
}
