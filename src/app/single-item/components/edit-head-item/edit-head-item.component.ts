import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ImageService } from 'src/app/shared/service/image/image.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as firebase from 'firebase';
import { Item } from 'src/app/shared/model/item/item';

export interface IHeadItem {
  title:string;
  catchPhrase:string;
  price:number;
  imageLink:string;
}

@Component({
  selector: 'app-edit-head-item',
  templateUrl: './edit-head-item.component.html',
  styleUrls: ['./edit-head-item.component.css']
})
export class EditHeadItemComponent implements OnInit {

  @Input() item:Item;
  headItemForm: FormGroup;
  file: File;
  urlImagePreview: string;
  uploadedImage: File;

  private imagePreviewSubscription: Subscription;

  constructor(private formBuilder:FormBuilder,
              private imageService: ImageService,
              private _NgbActiveModal: NgbActiveModal) { }

  get activeModal() {
    return this._NgbActiveModal;
  }

  ngOnInit() {

    console.log('ngOnInit head course');

    this.headItemForm = this.formBuilder.group({
      image: [''],
      title: ['',[Validators.required]],
      catchPhrase: ['',[Validators.required]],
      category: ['',[Validators.required]],
      price: ['',[Validators.required]],
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

    console.log('preFillEditForm',this.item);

    this.headItemForm.patchValue({title:this.item.title});
    this.headItemForm.patchValue({catchPhrase:this.item.catchPhrase});
    this.headItemForm.patchValue({price:this.item.price});
    this.urlImagePreview = this.item.imageLink;
  }

  onPreviewImage(event) {

    if (event.target.files && event.target.files[0]) {
      this.imageService.getImagePreview(event.target.files[0]);
    }
    else{
      this.urlImagePreview = this.item.imageLink;
    }
  }

  getHeadParams(){

    const iHeadItem:IHeadItem = {
      title: this.item.title,
      price: this.item.price,
      catchPhrase: this.item.catchPhrase,
      imageLink: this.item.imageLink,
    }

    return iHeadItem;
  }

  passBack(){

    if(this.item.imageLink !== this.urlImagePreview) {

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
        const iHeadItem:IHeadItem = {
          title: this.headItemForm.get('title').value,
          price: this.headItemForm.get('price').value,
          catchPhrase: this.headItemForm.get('catchPhrase').value,
          imageLink: this.urlImagePreview,
        }

        this.activeModal.close(iHeadItem);
        }
      );
    }
    else {
      const iHeadItem:IHeadItem = {
        title: this.headItemForm.get('title').value,
        price: this.headItemForm.get('price').value,
        catchPhrase: this.headItemForm.get('catchPhrase').value,
        imageLink: this.urlImagePreview,
      }

      this.activeModal.close(iHeadItem);
    }
  }

  ngOnDestroy(){

    if (this.imagePreviewSubscription != null) {
      this.imagePreviewSubscription.unsubscribe();
    }
  }
}

