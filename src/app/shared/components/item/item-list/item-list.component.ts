import { User, IUser } from 'src/app/shared/model/user/user';
import { SearchService } from 'src/app/shared/service/search/search.service';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Course, ICourse } from 'src/app/shared/model/item/course';
import { EventItem, IEvent } from 'src/app/shared/model/item/event-item';
import { Item } from 'src/app/shared/model/item/item';
import { ItemService } from 'src/app/shared/service/item/item.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit, OnDestroy{

  @Input() items: Array<Course|EventItem|IEvent|ICourse>;
  itemsSubscription: Subscription;
  tit:string;

  constructor(protected router:Router, 
              protected itemService:ItemService,
              protected searchService:SearchService) {
    
    console.log(this.items);
  }

  ngOnInit() {

    console.log(this.items);
  }

  onConsultCourse(course: Course | ICourse){
    if(course){
      // rediriger vers la formation
      this.router.navigate([RouteUrl.COURSE, course.id]);
    }
  }

  onConsultEvent(event: EventItem | IEvent){
    if(event){
      // rediriger vers l'événement
      this.router.navigate([RouteUrl.EVENT, event.id]);
    }
  }
  
  onConsultCategory(catId: string){
    if(catId){
      // rediriger vers la formation
      this.searchService.search(catId, '', '','');
    }
  }

  isCourse(item:Course|EventItem|ICourse|IEvent) {
    return item.type === 'course';
  }

  isEvent(item:Course|EventItem|ICourse|IEvent) {
      return item.type === 'event';
  }

  getTheSartOfDescription(item:Course|EventItem|ICourse|IEvent) {
    
    return item.description ? item.description.substring(0,30) : '';
  }

  onDeleteItem(item: Item){
    this.itemService.removeItem(item);
  }

  ngOnDestroy(){
    if (this.itemsSubscription != null) {
      this.itemsSubscription.unsubscribe();
    }
  }
}
