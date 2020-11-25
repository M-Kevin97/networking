import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Course } from 'src/app/shared/model/item/course';
import { EventItem, IEvent } from 'src/app/shared/model/item/event-item';
import { IItem, Item } from 'src/app/shared/model/item/item';
import { Tag } from 'src/app/shared/model/tag/tag';
import { ItemService } from 'src/app/shared/service/item/item.service';
import { SearchService } from 'src/app/shared/service/search/search.service';

@Component({
  selector: 'app-item-card-list',
  templateUrl: './item-card-list.component.html',
  styleUrls: ['./item-card-list.component.scss']
})
export class ItemCardListComponent implements OnInit, OnChanges {


  @Input() isAuthor:   boolean = false;
  @Input() items:   Array<IItem>;

  constructor(protected router:Router, 
              protected itemService:ItemService,
              protected searchService:SearchService) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void { }


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
}
