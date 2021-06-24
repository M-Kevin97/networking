import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Course } from 'src/app/shared/model/item/course';
import { EventItem } from 'src/app/shared/model/item/event-item';
import { Item } from 'src/app/shared/model/item/item';
import { ImageService } from 'src/app/shared/service/media/image/image.service';
import { ItemService } from 'src/app/shared/service/item/item.service';

@Component({
  selector: 'app-edit-media',
  templateUrl: './edit-media.component.html',
  styleUrls: ['./edit-media.component.scss']
})
export class EditMediaComponent implements OnInit, OnDestroy {

  @Input() item:  Course | Item | EventItem;
  editMediaForm: FormGroup;

  file: File;
  urlImagePreview: string;
  uploadedImage: File;

  @ViewChild('imageItem') imageItem:ElementRef;
  
  isImageFocus: boolean = false;
  
  private imagePreviewSubscription: Subscription;

  constructor(private formBuilder:FormBuilder,
              private imageService: ImageService,
              private _NgbActiveModal: NgbActiveModal) { }

  get activeModal() {
    return this._NgbActiveModal;
  }

  ngOnInit() {

    this.editMediaForm = this.formBuilder.group({
      imageItem: [''],
    });

    this.getImagePreviewFromService();

    console.error('getImagePreviewFromService');
    this.urlImagePreview = this.item.imageLink;
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

  onPreviewImage(event) {

    if (event.target.files && event.target.files[0]) {
      this.imageService.getImagePreview(event.target.files[0]);
    }
    else{
      this.urlImagePreview = this.item.imageLink;
    }
  }

  ngOnDestroy(){

    if (this.imagePreviewSubscription != null) {
      this.imagePreviewSubscription.unsubscribe();
    }
  }

}
