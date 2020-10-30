import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getTsBuildInfoEmitOutputFilePath } from 'typescript';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}