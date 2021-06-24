import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemFormService } from '../../shared/services/item-form.service';
import { StepState } from '../../shared/state-step.enum';

@Component({
  selector: 'app-item-price-form',
  templateUrl: './item-price-form.component.html',
  styleUrls: ['./item-price-form.component.scss'],
})
export class ItemPriceFormComponent implements OnInit {

  public get itemFormService(): ItemFormService {
    return this._itemFormService;
  }

  priceForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private _itemFormService: ItemFormService) {}

  ngOnInit() {

    this.priceForm = this.formBuilder.group({
      price: ['',Validators.required]
    });

    //if the item's type had been created
    if(this.itemFormService.isPriceOk())  this.onRestorePriceForm(this.itemFormService.item.price);
    // else if the earlier elements had not been created, retun to the start
    else if(!this.itemFormService.isTagsOk()) {
      this.itemFormService.onBackWithoutSave();
    }
    // else {
    //   this.itemFormService.onStartToTheBeginning();
    // }
  }

  getPricePlaceholder() {
    if(this.itemFormService.isCourse) return "Saisissez le titre de votre formation...";
    else if(this.itemFormService.isEvent) return "Saisissez le titre de votre évènement...";
  }

  onSetPrice() {

    const price = this.priceForm.get('price').value;
    var n:number = +price;
    if(n<0) {
      n = 0;
    }
    // this.itemFormService.setFormWithStepState(StepState.PRICE, n);
    this.itemFormService.item.price = n;

    this.itemFormService.nextForm();
  }

  onBack() {
    
    this.itemFormService.onBackWithoutSave()
  }

  onRestorePriceForm(value: number){

    this.priceForm.patchValue({price: value});
  }
}

