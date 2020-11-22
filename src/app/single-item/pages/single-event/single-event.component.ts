import { SearchService } from './../../../shared/service/search/search.service';
import { ChangeDetectorRef, Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/auth/auth.service';
import { EventItem } from 'src/app/shared/model/item/event-item';
import { ItemService } from 'src/app/shared/service/item/item.service';
import { SingleItemComponent } from '../../single-item.component';
import { DatePipe } from '@angular/common';
import { RouterService } from 'src/app/shared/service/router/router.service';
import { EDIT_PANE } from '../../components/edit-course/edit-item-pane';
import { EditCourseComponent } from '../../components/edit-course/edit-course.component';

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
                      datePipe:DatePipe,
                      cdRef:ChangeDetectorRef) {

    super(itemService,
          authService,
          router,
          searchService,
          routerService,
          modalService,
          datePipe,
          cdRef);

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

  openEditEventModal(pane:EDIT_PANE){

    if(this.authService.isAuth && this.isAuthor) {

      const modalRef = this.modalService.open(EditCourseComponent, { size: 'xl' });
      modalRef.componentInstance.item = this.event;
      modalRef.componentInstance.activePane = pane;

      modalRef.result.then((result) => {
        if (result) {

        }
      }).catch((error) => {
        console.log(error);
      });
    }
  }
}
