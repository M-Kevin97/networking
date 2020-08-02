import { SingleItemComponent } from './../../single-item.component';
import { Component, OnInit } from '@angular/core';
import { EventItem } from 'src/app/shared/item/event-item';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from 'src/app/shared/item/item.service';
import { Item } from 'src/app/shared/item/item';
import { AuthService } from 'src/app/core/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Course } from 'src/app/shared/item/course';
import { EditHeadItemComponent, IHeadItem } from '../../components/edit-head-item/edit-head-item.component';
import { EditDescriptionItemComponent } from '../../components/edit-description-item/edit-description-item.component';
import { EditSkillsItemComponent } from '../../components/edit-skills-item/edit-skills-item.component';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { auth } from 'firebase';

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
              router:Router,
              modalService: NgbModal) {

    super(itemService,
          authService,
          router,
          modalService);

         super.item = this.event;

  }

  ngOnInit() {
    this.event = new EventItem(null,null,null,null,null,null,null,null,null,null,null,null,null);

    console.log(this.route.snapshot);

    const id = this.route.snapshot.params['id'];
    this.itemService.getSingleEventFromDBWithId(id).then(
      (event:EventItem) => {
        if(event!==null && event!==undefined) {
          this.hasItem = true;
          this.event = EventItem.eventFromJson(event);
          this.event.id = id;
          super.item = this.event;
          console.log(this.event);
          console.log(event['authors']);
          console.log(this.event.authors);
        }
        else {
          this.hasItem = false;
        }
      }
    ).then(
      () => {
        this.itemService.getItemsOfUserByUserId(this.getMainAuthor().id).then(
          (items) => {
            if(items!==null && items!==undefined) {
              console.log(items);
              var mainAuthorCourses:Item[] = Course.coursesFromJson(items['courses']);
              console.log(mainAuthorCourses);

              var mainAuthorEvents:Item[] = EventItem.eventsFromJson(items['events']);
              console.log(mainAuthorEvents);

              this.mainAuthorItems = mainAuthorCourses.concat(mainAuthorEvents);
              this.mainAuthorItems.sort((a, b) => a.creationDate < b.creationDate ? -1 : a.creationDate > b.creationDate ? 1 : 0)
            }
          }
        )
      }
    ).catch(
      () => {
        this.hasItem = false;
      }
    );
  }

  openHeadItemModal(){

    const modalRef = this.modalService.open(EditHeadItemComponent, { scrollable: true });
    modalRef.componentInstance.item = this.event;

    modalRef.result.then((result:IHeadItem) => {
      if (result) {
        console.log(result);

        this.event.title = result.title;
        this.event.catchPhrase = result.catchPhrase;
        this.event.price = result.price;
        this.event.imageLink = result.imageLink;

        if(this.event.catchPhrase === undefined)
        {
          this.event.catchPhrase = null;
        }
        if(this.event.title === undefined)
        {
          this.event.title = null;
        }
        if(this.event.price === undefined)
        {
          this.event.price = null;
        }
        if(this.event.imageLink === undefined)
        {
          this.event.imageLink = null;
        }
        if(this.event.videoLink === undefined)
        {
          this.event.videoLink = null;
        }

        this.itemService.updateEventPrimaryInfoInDB(this.event);

      }
    }).catch((error) => {
      console.log(error);
    });
  }

  openDescriptionItemModal(){

    const modalRef = this.modalService.open(EditDescriptionItemComponent);
    modalRef.componentInstance.description = this.event.description;

    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
        console.log(this.event);

        this.event.description = result;

        if(this.event.description === undefined)
        {
          this.event.description = null;
        }

        this.itemService.updateEventDescriptionInDB(this.event);

      }
    }).catch((error) => {
      console.log(error);
    });
  }
}

