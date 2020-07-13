import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ImageService } from 'src/app/shared/image/image.service';
import { Item } from 'src/app/shared/item/item';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-head-course-edit-form',
  templateUrl: './head-course-edit-form.component.html',
  styleUrls: ['./head-course-edit-form.component.css']
})
export class HeadCourseEditFormComponent implements OnInit {

  @Input() item:Item;
  editHeadItemForm: FormGroup;
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

    this.editHeadItemForm = this.formBuilder.group({
      image: [''],
      title: ['',[Validators.required]],
      catchPhrase: [''],
      category: ['',[Validators.required]],
      price: ['',[Validators.required]],
    });

    // this.getImagePreviewFromService();
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

    this.editHeadItemForm.patchValue({title:this.item.title});
    this.editHeadItemForm.patchValue({catchPhrase:this.item.catchPhrase});
    this.editHeadItemForm.patchValue({price:this.item.price});
    
  }
  
  onPreviewImage(event) {

    if (event.target.files && event.target.files[0]) {
      this.imageService.getImagePreview(event.target.files[0]);
    }
    else{
      this.urlImagePreview = null;
    }
  }

  passBack(){

    this.activeModal.close(this.item);
  }

  ngOnDestroy(){

    if (this.imagePreviewSubscription != null) {
      this.imagePreviewSubscription.unsubscribe();
    }
  }
}
