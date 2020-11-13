import { User, IUser } from 'src/app/shared/model/user/user';
import { SearchService } from 'src/app/shared/service/search/search.service';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Course } from 'src/app/shared/model/item/course';
import { EventItem, IEvent } from 'src/app/shared/model/item/event-item';
import { IItem, Item } from 'src/app/shared/model/item/item';
import { ItemService } from 'src/app/shared/service/item/item.service';
import { Tag } from 'src/app/shared/model/tag/tag';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit, OnDestroy{

  @Input() items: Array<Course|EventItem|IItem>;
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

  consultCategory(catId: string){
    if(catId){
      // rediriger vers la formation
      this.searchService.search(catId, '', '','');
    }
  }

  onConsultTag(tag: Tag) {
    if(tag){
      // rediriger vers la formation
      this.searchService.search('', tag.name, '','');
    }
  }

  onConsultCourse(course: Course | IItem){
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

  isCourse(item:Course|EventItem|IItem) {
    return item.type === 'course';
  }

  isEvent(item:Course|EventItem|IItem) {
      return item.type === 'event';
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
