import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemFormService } from '../../shared/services/item-form.service';
import { StepState } from '../../shared/state-step.enum';

@Component({
  selector: 'app-item-price-form',
  templateUrl: './item-price-form.component.html',
  styleUrls: ['./item-price-form.component.css'],
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
    var n:number = +price;
    if(n<0) {
      n = 0;
    }
    this.itemFormService.setFormWithStepState(StepState.PRICE, n);
  }

  onBack() {
    
    this.itemFormService.onBackWithoutSave()
  }

  onRestoreTitleForm(value: string){

    this.priceForm.patchValue({price: value});
  }
}

