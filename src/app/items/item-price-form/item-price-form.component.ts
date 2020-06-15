import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemsService } from 'src/app/services/items.service';
import { Router } from '@angular/router';
import { ItemFormService, StepState, StepForm } from '../item-form.service';

@Component({
  selector: 'app-item-price-form',
  templateUrl: './item-price-form.component.html',
  styleUrls: ['./item-price-form.component.css']
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
      price: ['',[Validators.required]]
    });

    // sinon si l'élément Price a été créé
    if(this.itemFormService.mapStepForms.has(StepState.PRICE)){
      if(this.itemFormService.getStepFormWithStep(StepState.PRICE).status){
        this.onRestoreTitleForm(this.itemFormService.getStepFormWithStep(StepState.PRICE).value);
      }
    }
    // sinon si les éléménts précédents n'ont pas été créé, retourner au début
    else if (this.itemFormService.mapStepForms.size === 0){
      this.itemFormService.onStartToTheBeginning();
    }
  }

  onSetPrice() {

    const price = this.priceForm.get('price').value;
    this.itemFormService.setFormWithStepState(StepState.PRICE, price);
  }

  onBack() {
    
    this.itemFormService.onBackWithoutSave()
  }

  onRestoreTitleForm(value: string){

    this.priceForm.patchValue({price: value});
  }
}

