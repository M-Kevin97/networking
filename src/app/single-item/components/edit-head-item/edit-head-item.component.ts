import { Database } from 'src/app/core/database/database.enum';
import { Course } from 'src/app/shared/model/item/course';
import { ItemService } from 'src/app/shared/service/item/item.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ImageService } from 'src/app/shared/service/media/image/image.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as firebase from 'firebase';
import { Tag } from 'src/app/shared/model/tag/tag';
import { EventItem } from 'src/app/shared/model/item/event-item';
import { Item } from 'src/app/shared/model/item/item';


@Component({
  selector: 'app-edit-head-item',
  templateUrl: './edit-head-item.component.html',
  styleUrls: ['./edit-head-item.component.css']
})
export class EditHeadItemComponent implements OnInit {

  @Input() item:Course|EventItem|Item;
  headItemForm: FormGroup;
  file: File;
  urlImagePreview: string;
  uploadedImage: File;
  itemToUpdate:Course|EventItem|Item;

  private imagePreviewSubscription: Subscription;

  constructor(private formBuilder:FormBuilder,
              private imageService: ImageService,
              private itemService: ItemService,
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
      price: ['',[Validators.required]],
      consultationLink:['',[Validators.required]]
    });

    this.itemToUpdate = new Item(this.item.id,
                                 null,
                                 this.item.title || null,
                                 null,
                                 this.item.tags || [],
                                 this.item.catchPhrase || null,
                                 this.item.description || null,
                                 this.item.price || null,
                                 this.item.iAuthors || null,
                                 null,
                                 null,
                                 null,
                                 null,
                                 this.item.consultationLink || null,
                                 this.item.imageLink || null);


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

    this.headItemForm.patchValue({
                                  title:this.itemToUpdate.title,
                                  catchPhrase:this.itemToUpdate.catchPhrase,
                                  price:this.itemToUpdate.price,
                                  consultationLink:this.itemToUpdate.consultationLink,
                                });
    this.urlImagePreview = this.itemToUpdate.imageLink;
  }

  onPreviewImage(event) {

    if (event.target.files && event.target.files[0]) {
      this.imageService.getImagePreview(event.target.files[0]);
    }
    else{
      this.urlImagePreview = this.itemToUpdate.imageLink;
    }
  }

  passBack(){

    if(this.itemToUpdate.imageLink !== this.urlImagePreview) {

      const fileRef = firebase.storage().ref('images').child(Database.ITEMS);

      this.imageService.uploadFile(this.imageService.imageToUpload, fileRef).then(
        (url:string) => {

          if(url && url !==''){
            // faire condition pour identification Image
            console.log('Image Link :', url);
            this.urlImagePreview = url;
          }
        }
      ).then(
        () => {

          this.setParams();

          this.itemService.updateItemPrimaryInfoInDB(this.itemToUpdate, 
            () => {
  
              this.activeModal.close(this.itemToUpdate);
            },
            (error) => {
              this.activeModal.close(null);
            }
          );
        }
      ).catch(
        (error) => {
          console.error(error);
        }
      );
    } else {

      this.setParams();

      this.itemService.updateItemPrimaryInfoInDB(this.itemToUpdate, 
        () => {
          this.activeModal.close(this.itemToUpdate);
        },
        (error) => {
          this.activeModal.close(null);
        }
      );
    }
    
  }

  setParams() {

    this.itemToUpdate.title = this.headItemForm.get('title').value;
    this.itemToUpdate.price = +this.headItemForm.get('price').value;
    this.itemToUpdate.catchPhrase = this.headItemForm.get('catchPhrase').value;
    this.itemToUpdate.imageLink = this.urlImagePreview;
  }

  ngOnDestroy(){

    if (this.imagePreviewSubscription != null) {
      this.imagePreviewSubscription.unsubscribe();
    }
  }
}

