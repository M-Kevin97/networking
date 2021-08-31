import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { UserService } from './../../../shared/service/user/user.service';
import { AuthService } from './../../../core/auth/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/model/user/user';
import { ImageService } from 'src/app/shared/service/media/image/image.service';
import { Router } from '@angular/router';

export interface IHeadUser {
  firstname:string;
  lastname:string;
  title:string;
  ppLink:string;
  tel:string;
  bio:string;
  mail:string
}

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.scss']
})
export class ProfileSettingComponent implements OnInit {

  user:User;
  editProfileForm: FormGroup;
  file: File;
  urlImagePreview: string;
  uploadedImage: File;
  isTelOk:boolean;
  iNewUserParams:IHeadUser;

  isProfileUpdated: boolean = false;

  private imagePreviewSubscription: Subscription;

  constructor(private authService   : AuthService,
              private userService   : UserService,
              private formBuilder   : FormBuilder,
              private imageService  : ImageService,
              private router        : Router) { }


  ngOnInit() {

    this.user = this.authService.authUser;
 
    this.editProfileForm = this.formBuilder.group({
      image: [''],
      firstname: ['',[Validators.required]],
      lastname: ['',[Validators.required]],
      title:[''],
      bio: [''],
      // tel: [''],
      mail: ['',[Validators.required]],
    });

    this.getImagePreviewFromService();
    this.preFillEditForm();
  }

  getImagePreviewFromService(){

    this.imagePreviewSubscription = this.imageService.imageSubject
    .subscribe(
      (data:string) => {
  
        this.urlImagePreview = data;
      },
      (err: string) => console.error('Observer got an error: ' + err),
      () => {
        console.log('Observer got a complete notification');
      }
    );
  }

  preFillEditForm(){

    this.editProfileForm.patchValue({firstname:this.user.firstname});
    this.editProfileForm.patchValue({lastname:this.user.lastname});
    this.editProfileForm.patchValue({title:this.user.title});
    this.editProfileForm.patchValue({bio:this.user.bio});
    // this.editProfileForm.patchValue({tel:this.user.tel});
    this.editProfileForm.patchValue({mail:this.user.mail});
    this.urlImagePreview = this.user.ppLink;
  }

  onPreviewImage(event) {

    if (event.target.files && event.target.files[0]) {
      this.imageService.getImagePreview(event.target.files[0]);
    }
    else{
      this.urlImagePreview = this.user.ppLink;
    }
  }

  getHeadParams(){

    const iHeadUser:IHeadUser =  {
      firstname:this.user.firstname,
      lastname:this.user.lastname,
      title:this.user.title,
      ppLink:this.user.ppLink,
      tel:this.user.tel,
      bio:this.user.bio,
      mail:this.user.mail,
    }

    return iHeadUser;
  }

  updateProfile(){

    const ppLink : string = this.urlImagePreview;
    const firstname : string = this.editProfileForm.get('firstname').value;
    const lastname  : string = this.editProfileForm.get('lastname').value;
    const title  : string = this.editProfileForm.get('title').value;
    const bio : string = this.editProfileForm.get('bio').value;
    const mail  : string  = this.editProfileForm.get('mail').value;
    // const tel :  string = this.editProfileForm.get('tel').value;
    
    // vérifier le bon format du tel si tel a été saisi
    // if(tel) if(!this.checkPhoneForm(tel)) return;

    if(this.user.ppLink !== this.urlImagePreview) {

      const fileRef = firebase.storage().ref('images').child('items');
      this.imageService.uploadFile(this.imageService.imageToUpload,fileRef).then(
        (url:string) => {

          if(url && url !==''){
            // faire condition pour identification Image
            this.urlImagePreview = url;
          }
        }
      ).then(
        () => {

          // this.iNewUserParams.ppLink = this.urlImagePreview;
          // this.iNewUserParams.firstname = firstname;
          // this.iNewUserParams.lastname = lastname;
          // this.iNewUserParams.bio = bio;
          // this.iNewUserParams.mail = mail;
          // this.iNewUserParams.tel = tel;
          // this.iNewUserParams.title = title;

          this.user.ppLink = this.urlImagePreview;
          this.user.firstname = firstname;
          this.user.lastname = lastname;
          this.user.bio = bio;
          this.user.mail = mail;
          // this.user.tel = tel;
          this.user.title = title;

          this.user.setSearchContent();
      
          this.userService.updateUser(this.user).then(
            () => {

              this.isProfileUpdated = true;
            }
          );        
        }
      );
    }
    else {

      this.user.ppLink = this.urlImagePreview;
      this.user.firstname = firstname;
      this.user.lastname = lastname;
      this.user.bio = bio;
      this.user.mail = mail;
      // this.user.tel = tel;
      this.user.title = title;

      this.user.setSearchContent();

      this.userService.updateUser(this.user).then(
        () => {

          this.isProfileUpdated = true;
        }
      );
    }
  }

  goToUserProfile() {

    this.router.navigate([RouteUrl.USER, this.user.id]);
  }

  checkPhoneForm(tel:string) {

    if(tel.length===10 && tel && Number.isInteger(+tel)){
      this.isTelOk = true;
      return true;
    }
    else {
      this.isTelOk = false;
      return false;
      }
  }

  shouldShowRequiredError(controlName) {

    return !this.editProfileForm.get(controlName).valid;
  }

  // Timer for alert message
  onTimerFinished(e:Event){
    if (e["action"] == "done"){

      this.isProfileUpdated = false;
    }
  }

  ngOnDestroy(){

    if (this.imagePreviewSubscription != null) {
      this.imagePreviewSubscription.unsubscribe();
    }
  }
}

