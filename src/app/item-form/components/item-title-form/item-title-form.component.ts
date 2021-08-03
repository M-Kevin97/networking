import { ItemService } from 'src/app/shared/service/item/item.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemFormService } from '../../shared/services/item-form.service';
import { StepState } from '../../shared/state-step.enum';
import { Router } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';

@Component({
  selector: 'app-item-title-form',
  templateUrl: './item-title-form.component.html',
  styleUrls: ['./item-title-form.component.scss']
})
export class ItemTitleFormComponent implements OnInit {

  public get itemFormService(): ItemFormService {
    return this._itemFormService;
  }

  titleForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private itemService: ItemService,
              private _itemFormService: ItemFormService,
              private router: Router) {}

  ngOnInit() {
    this.titleForm = this.formBuilder.group({
      title: ['',[Validators.required]]
    });

    //if the item's type had been created
    if(this.itemFormService.isTitleOk())  this.onRestoreTitleForm(this.itemFormService.item.title);
    // else if the earlier elements had not been created, retun to the start
    else if(!this.itemFormService.isTypeOk()) {
      
      this.itemFormService.onBackWithoutSave();
      // this.itemFormService.onStartToTheBeginning();
    }
    // sinon retourner à l'élément précédent
    // else {
    //   this.itemFormService.onBackWithoutSave();
    // }
  }

  getTitlePlaceholder() {
    if(this.itemFormService.isCourse) return "Saisissez le titre de votre formation...";
    else if(this.itemFormService.isEvent) return "Saisissez le titre de votre évènement...";
  }

  onSetTitle() {

    const title = this.titleForm.get('title').value;
    //this.itemFormService.setFormWithStepState(StepState.TITLE, title);

    this.itemFormService.item.title = title;

    this.itemFormService.nextForm();
  }

  onBack() {
    
    this.itemFormService.onBackWithoutSave()
  }

  onCloseForm() {

    this.itemFormService.clearForm();
    this.itemService.lastItemCreated = null;
    this.router.navigate([RouteUrl.CREATE_ITEM]);
  }

  onRestoreTitleForm(value:string){

    this.titleForm.patchValue({title:value});
  }

  onCheckKeyInput($event: KeyboardEvent){
    return this.itemFormService.checkKeyInput($event);
  }
}

