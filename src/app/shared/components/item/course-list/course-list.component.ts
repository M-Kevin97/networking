import { Database } from 'src/app/core/database/database.enum';
import { SearchService } from 'src/app/shared/service/search/search.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Course, ICourse } from 'src/app/shared/model/item/course';
import { ItemService } from 'src/app/shared/service/item/item.service';
import { ItemListComponent } from '../item-list/item-list.component';


@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent extends ItemListComponent  implements OnInit{

  @Input() course: Course|ICourse;

  constructor(router:Router, 
              itemService:ItemService,
              searchService:SearchService) {
                
    super(router, itemService, searchService);
  }

  ngOnInit() {

    console.log('CourseListComponent', this.course);
  }

  consultCourse(course: Course){
    if(course){
      // rediriger vers la formation
      this.router.navigate([Database.COURSE, course.id]);
    }
  }

  consultCategory(catId: string){
    if(catId){
      // rediriger vers la formation
      this.searchService.search(catId, '', '','');
    }
  }
}