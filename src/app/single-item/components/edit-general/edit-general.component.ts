import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, OnChanges, SimpleChanges, AfterContentInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Course } from 'src/app/shared/model/item/course';
import { EventItem } from 'src/app/shared/model/item/event-item';
import { Item } from 'src/app/shared/model/item/item';

@Component({
  selector: 'app-edit-general',
  templateUrl: './edit-general.component.html',
  styleUrls: ['./edit-general.component.scss']
})
export class EditGeneralComponent implements OnInit, OnChanges, AfterViewChecked {

  @Input() item:  Course | Item | EventItem;
  editGeneralForm: FormGroup;

  @ViewChild('titleItem') titleItem:ElementRef;
  @ViewChild('catchPhraseItem') catchPhraseItem:ElementRef;
  @ViewChild('priceItem') priceItem:ElementRef;
  @ViewChild('linkItem') linkItem:ElementRef;
  @ViewChild('descriptionItem') descriptionItem:ElementRef;
  
  isTitleFocus: boolean = false;
  isCatchPhraseFocus: boolean = false;
  isPriceFocus: boolean = false;
  isLinkFocus: boolean = false;
  isDescriptionFocus: boolean = false;

  oldTitleItem: string = '';
  oldCatchPhraseItem: string = '';
  oldPriceItem: string = '';
  oldLinkItem: string = '';
  oldDescriptionItem: string = '';

  constructor(private formBuilder: FormBuilder,
              private cdRef:ChangeDetectorRef) { }
  
  ngOnInit() {

    this.editGeneralForm = this.formBuilder.group({
      titleItem:  ['',[Validators.required]],
      catchPhraseItem:  ['',[Validators.required]],
      priceItem:  ['',[Validators.required]],
      descriptionItem:  ['',[Validators.required]],
      linkItem:  ['',[Validators.required]]
    });
  }

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
   
  }

  activateFieldFocus(fieldName:  string) {

    switch(fieldName) {
      case 'titleItem': {

        this.isTitleFocus = true; 
        this.oldTitleItem = this.item.title;
        this.titleItem.nativeElement.focus();
        break;
      }

      case 'descriptionItem': {

        this.isDescriptionFocus = true; 
        this.oldDescriptionItem = this.item.description;
        this.descriptionItem.nativeElement.focus();
        break;
      }

      case 'catchPhraseItem': {

        this.isCatchPhraseFocus = true; 
        this.oldCatchPhraseItem = this.item.catchPhrase;
        this.catchPhraseItem.nativeElement.focus();
        break;
      }

      case 'priceItem': {

        this.isPriceFocus = true; 
        this.oldPriceItem = this.item.price.toString();
        this.priceItem.nativeElement.focus();
        break;
      }

      case 'linkItem': {

        this.isLinkFocus = true; 
        this.oldLinkItem = this.item.consultationLink;
        this.linkItem.nativeElement.focus();
        break;
      }
    }
  }

  desactivateFieldFocus(fieldName:  string) {

    switch(fieldName) {
      case 'titleItem': {

        if(this.item.title && !this.item.title.length) 
          this.item.title = this.oldTitleItem;

        this.isTitleFocus = false; 
        break;
      }

      case 'descriptionItem': {

        if(this.item.description && !this.item.description.length) 
          this.item.description = this.oldDescriptionItem;

        this.isDescriptionFocus = false;
        break;
      }

      case 'catchPhraseItem': {

        if(this.item.catchPhrase && !this.item.catchPhrase.length) 
          this.item.catchPhrase = this.oldCatchPhraseItem;

        this.isCatchPhraseFocus = false;
        break;
      }

      case 'priceItem': {

        if(!this.item.price) 
          this.item.price = +this.oldTitleItem;

        this.isPriceFocus = false;
        break;
      }

      case 'linkItem': {

        if(this.item.consultationLink && !this.item.consultationLink.length) 
          this.item.consultationLink = this.oldLinkItem;

        this.isLinkFocus = false;
        break;
      }
    }
  }

  onDetectKeyDown(event) {

  }

  shouldShowRequiredError(controlName) {

    return !this.editGeneralForm.get(controlName).valid;
  }
}
