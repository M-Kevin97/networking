import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Database } from '../core/database/database.enum';
import { RouteUrl } from '../core/router/route-url.enum';
import { ItemFormService } from '../item-form/shared/services/item-form.service';
import { Course } from '../shared/model/item/course';
import { EventItem } from '../shared/model/item/event-item';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  constructor(private router: Router,
              private itemFormService: ItemFormService) { }

  ngOnInit() {
  }

  onNewItem() {
    this.router.navigate([RouteUrl.NEW_ITEM]);
  }

  onSetType(type: string) {

    if(type === 'course') {
      
      this.itemFormService.item = new Course(null,
                                             Database.COURSE.substr(1),
                                             null,
                                             null,
                                             [],
                                             null,
                                             null,
                                             null,
                                             [],
                                             null,
                                             false,
                                             [],
                                             null,
                                             null,
                                             null,
                                             [],
                                             [],
                                             [],
                                             null,
                                             null,
                                             null,
                                             null,
                                             null); 

      this.itemFormService.isCourse = true;
      this.itemFormService.isEvent = false;
    } 
    else if(type === 'event') { 
        
      this.itemFormService.item = new EventItem(null,
                                                Database.EVENT.substr(1),
                                                null,
                                                null,
                                                [],
                                                null,
                                                null,
                                                null,
                                                null,
                                                null,
                                                [],
                                                null,
                                                false,
                                                null,
                                                null,
                                                null); 

      this.itemFormService.isEvent = true;
      this.itemFormService.isCourse = false;
    }

    //this.itemFormService.setFormWithStepState(StepState.TITLE, type);

    this.itemFormService.nextForm();

    this.onNewItem();
  }

  goToGForm() {
    // this.router.navigate([RouteUrl.NEW_ITEM]);
    window.location.href='https://forms.gle/XR4FmoyHuBqUcTJd9';
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  goToManager() {
    this.router.navigate([RouteUrl.MANAGER]);
  }

}
