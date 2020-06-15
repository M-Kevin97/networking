import { AuthService } from 'src/app/auth/services/auth.service';
import { Category } from './../../models/category';
import { ItemFormService, StepState, StepForm } from './../item-form.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Item } from 'src/app/models/item';
import { ItemsService } from 'src/app/services/items.service';
import { Subscription } from 'rxjs';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit, OnDestroy {
  
  isTitleCreated : boolean;
  isPriceCreated : boolean;
  isCategoryCreated : boolean;
  isMediaCreated : boolean;
  isCompleteCreated : boolean;

  item:Item;

  private stepFormSubscription: Subscription;
  private imageSubscription: Subscription;


  constructor(private itemsService:ItemsService,
              private itemFormService:ItemFormService,
              private imageService:ImageService,
              private authService: AuthService,
              private router:Router) {}


  ngOnInit() {

    console.log('ngOnInit ItemFormComponent');

    this.getValueStepForm();
  }

  getValueStepForm(){
    this.stepFormSubscription = this.itemFormService
                                    .getValueStepForm()
                                    .subscribe(
                                      (step) => {
                                              this.sortStepForm(step);
                                              console.log('next', step);
                                      },
                                      (error) => { 
                                        console.log(error); 
                                      },
                                      () => {
                                        console.log('complete suscribe');
                                        
                                      });
  }

  getUrlImageFromService(){
    this.imageSubscription = this.imageService
                                 .imageSubject
                                 .subscribe(
                                  (data) => {
                                    console.log('getUrlImageFromService', data);
                                  },
                                  (error) => { 
                                    console.log(error); 
                                  },
                                  () => {
                                    console.log('complete suscribe');
                                    
                                  });
  }

 /* getImagePreviewFromService(){

    console.log('getImagePreviewFromService ItemMediaFormComponent');

    this.imagePreviewSubscription = this.imageService.imageSubject
    .subscribe(
      (data:string) => {

        this.urlImagePreview = this.imageService.urlImagePreview;
      },
      (err: string) => console.error('Observer got an error: ' + err),
      () => {
        console.log('Observer got a complete notification');
      }
    );
  } */

  /*
  Fonction permettant de créer un item et de l'ajouter dans le DB
  */
  createItem() {

    const title = this.itemFormService.getStepFormWithStep(StepState.TITLE).value;
    const category = this.itemFormService.getStepFormWithStep(StepState.CATEGORY).value;
    const price = this.itemFormService.getStepFormWithStep(StepState.PRICE).value;

    const newItem = new Item(null,
                             title,
                             category,
                             null,
                             price,
                             this.authService.authUser.firstname,
                             this.authService.authUser.lastname,
                             null,
                             null); 

    if (this.itemFormService.getStepFormWithStep(StepState.MEDIA).value) {

      this.imageService.uploadFile(this.imageService.imageToUpload).then(
        (url:string) => {

          if(url && url !==''){
            // faire condition pour identification Image
            console.log('Image Link :', url);
            newItem.imageLink = url;

            this.itemsService.createNewItem(newItem);  
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else {

      this.itemsService.createNewItem(newItem);  
    }    
    
  }

  sortStepForm(stepState:StepState){
    switch(stepState)
    {
      case StepState.TITLE : 
      {
        this.isTitleCreated = this.itemFormService.getStepFormWithStep(StepState.TITLE).status;
        this.goToCategoryForm();
        break;
      }

      case StepState.CATEGORY : 
      {
        this.isCategoryCreated = this.itemFormService.getStepFormWithStep(StepState.CATEGORY).status;
        this.goToPriceForm();
        break;
      }

      case StepState.PRICE : 
      {
        this.isPriceCreated = this.itemFormService.getStepFormWithStep(StepState.PRICE).status;
        this.goToMediaForm();
        break;
      }

      case StepState.MEDIA : 
      {
        this.isMediaCreated = this.itemFormService.getStepFormWithStep(StepState.MEDIA).status;
        this.goToCompleteForm();
        break;
      }

      case StepState.COMPLETE :
      {
        this.isCompleteCreated;
        this.createItem();
        break;
      }

      case StepState.BACK :
      {
        this.goBack()
        break;
      }

      case StepState.STARTING :
        {
          this.goToTitleForm()
          break;
        }

      default : {

        break;
      }
    }
  }

  goToTitleForm(){

    this.router.navigate(['new/title']);
  }

  goToCategoryForm() {

    if(this.isTitleCreated){
      this.router.navigate(['new/category']);
    }
  }

  goToPriceForm() {

    if(this.isTitleCreated && this.isCategoryCreated){
      this.router.navigate(['new/price']);
    }
  }

  goToMediaForm() {
    
    if(this.isTitleCreated && this.isCategoryCreated && this.isPriceCreated){
      this.router.navigate(['new/media']);
    }
  }

  goToCompleteForm() {

    if(this.isTitleCreated && this.isCategoryCreated && this.isPriceCreated && this.isMediaCreated){
      this.router.navigate(['new/complete']);
    }
   
  }

  goBack(){
    switch(this.router.url)
    {
      case '/new/category' : 
      {
        this.goToTitleForm();
        break;
      }

      case '/new/price' : 
      {
        this.goToCategoryForm();
        break;
      }

      case '/new/media' : 
      {
        this.goToPriceForm();
        break;
      }
      case '/new/complete' : 
      {
        this.goToMediaForm();
        break;
      }

      default : {
        
        break;
      }
    }

  }

  isTitleFormRoute(){
    return this.router.url === '/new/title';
  }

  isCategoryFormRoute(){
    return this.router.url === '/new/category';
  }

  isPriceFormRoute(){
    return this.router.url === '/new/price';
  }

  isMediaFormRoute(){
    return this.router.url === '/new/media';
  }

  isCompleteFormRoute(){
    return this.router.url === '/new/complete';
  }

  ngOnDestroy(){

    if (this.stepFormSubscription != null) {
      this.stepFormSubscription.unsubscribe();
    }
  }

}
