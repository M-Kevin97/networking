import { ImageService } from '../../shared/image/image.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ItemFormService, StepState } from '../item-form.service';
import { Subscription } from 'rxjs';


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
  

  private imagePreviewSubscription: Subscription;

  constructor(private formBuilder:FormBuilder,
              private _itemFormService: ItemFormService,
              private imageService: ImageService) { }

  ngOnInit() {

    this.mediaForm = this.formBuilder.group({
      image: ['',[Validators.required]]
    });

    // sinon si l'élément Price a été créé
    if(this.itemFormService.mapStepForms.has(StepState.MEDIA)){
      if(this.itemFormService.getStepFormWithStep(StepState.MEDIA).status){
        this.onRestoreMediaForm(this.itemFormService.getStepFormWithStep(StepState.MEDIA).value);
      }
    }
    // sinon si les éléménts précédents n'ont pas été créé, retourner au début
    else if (this.itemFormService.mapStepForms.size === 0){
      this.itemFormService.onStartToTheBeginning();
    }

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

  onSetMedia(){
    
    const imageLink = this.urlImagePreview;
    this.itemFormService.setFormWithStepState(StepState.MEDIA, imageLink);
  }

  onSkipMedia(){
    
    this.itemFormService.setFormWithStepState(StepState.MEDIA, null);
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
