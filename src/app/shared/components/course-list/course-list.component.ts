import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { ItemListComponent } from './../item-list/item-list.component';
import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../../item/course';
import { Router } from '@angular/router';
import { ItemService } from '../../item/item.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent extends ItemListComponent  implements OnInit{

  @Input() courses: Course[];

  constructor(router:Router, 
              itemService:ItemService) {
                
    super(router, itemService);
  }

  ngOnInit() {

    console.log('CourseListComponent', this.courses);
  }

  onNewItem(){ }

  onViewItem(id: number){
    this.router.navigate([RouteUrl.COURSE, id]);
  }

}
