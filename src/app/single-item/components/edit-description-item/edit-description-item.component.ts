import { EventItem } from 'src/app/shared/model/item/event-item';
import { ItemService } from 'src/app/shared/service/item/item.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Course } from 'src/app/shared/model/item/course';
import { Item } from 'src/app/shared/model/item/item';

@Component({
  selector: 'app-edit-description-item',
  templateUrl: './edit-description-item.component.html',
  styleUrls: ['./edit-description-item.component.css']
})
export class EditDescriptionItemComponent implements OnInit {

  @Input() item:Course|EventItem|Item;
  description: string = '';
  descriptionItemForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private itemService: ItemService,
              private _NgbActiveModal: NgbActiveModal) { }
  
  get activeModal() {
    return this._NgbActiveModal;
  }

  ngOnInit() {

    console.log('ngOnInit head course');

    this.descriptionItemForm = this.formBuilder.group({
      description: ['',[Validators.required]],
    });

    this.description = this.item.description;
    this.preFillEditForm();
  }

  preFillEditForm(){

    console.log('preFillEditForm', this.description);

    this.descriptionItemForm.patchValue({description: this.description});
  }
  
  passBack(){

    if(this.description && this.description.length) {

      if(this.description !== this.item.description) {

        let newItem = new Item(this.item.id,
                                null,
                                this.item.title || null,
                                null,
                                this.item.tags || [],
                                this.item.catchPhrase || null,
                                this.description || null,
                                this.item.price || null,
                                this.item.iAuthors || null,
                                null,
                                null,
                                null,
                                null,
                                this.item.consultationLink || null,
                                this.item.imageLink || null);
  
        this.itemService.updateItemDescriptionInDB(newItem, 
          ()=>{
            this.activeModal.close(this.description);
          },
          (error) => {
  
          }
        );
        
      } else this.activeModal.close(null);
    }
  }
}
