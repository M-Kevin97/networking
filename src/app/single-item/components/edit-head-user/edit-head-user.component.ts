import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/shared/user/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ImageService } from 'src/app/shared/image/image.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as firebase from 'firebase';

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
  selector: 'app-edit-head-user',
  templateUrl: './edit-head-user.component.html',
  styleUrls: ['./edit-head-user.component.css']
})
export class EditHeadUserComponent implements OnInit {

  @Input() user:User;
  headUserForm: FormGroup;
  file: File;
  urlImagePreview: string;
  uploadedImage: File;
  istelOk:boolean;

  private imagePreviewSubscription: Subscription;

  constructor(private formBuilder:FormBuilder,
              private imageService: ImageService,
              private _NgbActiveModal: NgbActiveModal) { }

  get activeModal() {
    return this._NgbActiveModal;
  }

  ngOnInit() {

    console.log('ngOnInit head course');

    this.headUserForm = this.formBuilder.group({
      image: [''],
      firstname: ['',[Validators.required]],
      lastname: ['',[Validators.required]],
      title:['',[Validators.required]],
      bio: ['',[Validators.required]],
      tel: ['',[Validators.required]],
      mail: ['',[Validators.required]],
    });

    this.getImagePreviewFromService();
    this.preFillEditForm();
  }

  getImagePreviewFromService(){

    console.log('getImagePreviewFromService ItemMediaFormComponent');

    this.imagePreviewSubscription = this.imageService.imageSubject
    .subscribe(
      (data:string) => {
        console.log('imagePreviewSubscription :', data);
        this.urlImagePreview = data;
      },
      (err: string) => console.error('Observer got an error: ' + err),
      () => {
        console.log('Observer got a complete notification');
      }
    );
  }

  preFillEditForm(){

    console.log('preFillEditForm',this.user);

    this.headUserForm.patchValue({firstname:this.user.firstname});
    this.headUserForm.patchValue({lastname:this.user.lastname});
    this.headUserForm.patchValue({title:this.user.title});
    this.headUserForm.patchValue({bio:this.user.bio});
    this.headUserForm.patchValue({tel:this.user.tel});
    this.headUserForm.patchValue({mail:this.user.mail});
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

  passBack(){
    this.chekPhoneForm(this.headUserForm.get('tel').value);
    if (!this.istelOk) {
      return;
    }

    if(this.user.ppLink !== this.urlImagePreview) {

      const fileRef = firebase.storage().ref('images').child('items');
      this.imageService.uploadFile(this.imageService.imageToUpload,fileRef).then(
        (url:string) => {

          if(url && url !==''){
            // faire condition pour identification Image
            console.log('Image Link :', url);
            this.urlImagePreview = url;
          }
        }
      ).then(
        () => {
        const iHeadUser:IHeadUser = {
          firstname: this.headUserForm.get('firstname').value,
          lastname: this.headUserForm.get('lastname').value,
          title: this.headUserForm.get('title').value,
          tel: this.headUserForm.get('tel').value,
          bio: this.headUserForm.get('bio').value,
          mail: this.headUserForm.get('mail').value,
          ppLink:this.urlImagePreview,
        }

        this.activeModal.close(iHeadUser);
        }
      );
    }
    else {

      const iHeadUser:IHeadUser = {
        firstname: this.headUserForm.get('firstname').value,
        lastname: this.headUserForm.get('lastname').value,
        title: this.headUserForm.get('title').value,
        tel: this.headUserForm.get('tel').value,
        bio: this.headUserForm.get('bio').value,
        mail: this.headUserForm.get('mail').value,
        ppLink:this.user.ppLink,
      }

      this.activeModal.close(iHeadUser);
    }
  }

  chekPhoneForm(tel:string) {
    console.log(tel.length, Number.isInteger(+tel), tel)
    if(tel && tel.length===10 && Number.isInteger(+tel)){
      this.istelOk = true;
      console.log(tel.length, Number.isInteger(+tel), tel)
    }
    else {
      this.istelOk = false;
    }
  }

  ngOnDestroy(){

    if (this.imagePreviewSubscription != null) {
      this.imagePreviewSubscription.unsubscribe();
    }
  }
}

