import { SearchService } from './../../../shared/service/search/search.service';
import { EditHeadItemComponent } from '../../components/edit-head-item/edit-head-item.component';
import { EditDescriptionItemComponent } from '../../components/edit-description-item/edit-description-item.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Course } from 'src/app/shared/model/item/course';
import { EventItem } from 'src/app/shared/model/item/event-item';
import { Item } from 'src/app/shared/model/item/item';
import { ItemService } from 'src/app/shared/service/item/item.service';
import { SingleItemComponent } from '../../single-item.component';
import { DatePipe } from '@angular/common';
import { RouterService } from 'src/app/shared/service/router/router.service';

@Component({
  selector: 'app-single-event',
  templateUrl: './single-event.component.html',
  styleUrls: ['./single-event.component.css']
})
export class SingleEventComponent extends SingleItemComponent implements OnInit {

  event:EventItem;

  constructor(private route:ActivatedRoute,
                      itemService:ItemService,
                      authService:AuthService,
                      searchService:SearchService,
                      routerService:RouterService,
                      router:Router,
                      modalService: NgbModal,
                      datePipe:DatePipe) {

    super(itemService,
          authService,
          router,
          searchService,
          routerService,
          modalService,
          datePipe);

         super.item = this.event;

  }

  ngOnInit() {
    
    // getting course id from url 
    const id = this.route.snapshot.params['id'];

    this.itemService.getSingleItemFromDBById(id,
      (event:EventItem) => {

        if(event) {

          this.hasItem = true;
          super.item = this.event = event;
          this.isItemAuthor();
          super.saveView();
        }
        else {
          this.hasItem = false;
        }
      }
    ).catch(
      (error) => {
        console.error(error);
        this.hasItem = false;
      }
    );
  }
}
