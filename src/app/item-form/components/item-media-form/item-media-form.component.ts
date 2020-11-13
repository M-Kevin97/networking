import { Params } from './../../../core/params/params.enum';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ItemFormService } from '../../shared/services/item-form.service';
import { StepState } from '../../shared/state-step.enum';
import { Database } from 'src/app/core/database/database.enum';
import { ImageService } from 'src/app/shared/service/image/image.service';


@Component({
  selector: 'app-item-media-form',
  templateUrl: './item-media-form.component.html',
  styleUrls: ['./item-media-form.component.css']
})
export class ItemMediaFormComponent implements OnInit, OnDestroy {

  public get itemFormService(): ItemFormService {
    return this._itemFormService;
  }

  mediaForm: FormGroup;
  file: File;
  urlImagePreview: string;
  uploadedImage: File;

  urlVideoPreview: string;
  uploadedVideo: File;

  private imagePreviewSubscription: Subscription;

  constructor(private formBuilder:FormBuilder,
              private _itemFormService: ItemFormService,
              private imageService: ImageService) { }

  ngOnInit() {

    this.mediaForm = this.formBuilder.group({
      image: ['',[Validators.required]]
    });

    // sinon si l'élément media a été créé le supprimé ?
    if(this.itemFormService.mapStepForms.has(StepState.MEDIA)){
      if(this.itemFormService.getStepFormWithStep(StepState.MEDIA).status){
        // this.onRestoreMediaForm(this.itemFormService.getStepFormWithStep(StepState.MEDIA).value);
      }
    }
    // si les éléménts précédents n'ont pas été créé, retourner au début
    if (this.itemFormService.mapStepForms.size === 0){
      this.itemFormService.onStartToTheBeginning();
    }

    if(this.itemFormService.isCourse()) this.urlImagePreview = Database.DEFAULT_IMG_COURSE;
    else if(this.itemFormService.isEvent()) this.urlImagePreview = Database.DEFAULT_IMG_EVENT;
    
    this.getImagePreviewFromService();
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

  hasUploadedImage() {
    return this.urlImagePreview && ((this.urlImagePreview !== Database.DEFAULT_IMG_COURSE) 
                                    && this.urlImagePreview !== Database.DEFAULT_IMG_EVENT);
  }

  onSetMedia(){

    this.itemFormService.setFormWithStepState(StepState.MEDIA, this.urlImagePreview);
  }

  onBack() {

    this.itemFormService.onBackWithoutSave();
  }

  onRestoreMediaForm(urlImage:string){

    this.mediaForm.patchValue({image: urlImage});
  }

  onPreviewImage(event) {

    if (event.target.files && event.target.files[0]) {
      this.imageService.getImagePreview(event.target.files[0]);
    }
    else{
      this.urlImagePreview = null;
    }
  }

  ngOnDestroy(){

    if (this.imagePreviewSubscription != null) {
      this.imagePreviewSubscription.unsubscribe();
    }
  }
}
