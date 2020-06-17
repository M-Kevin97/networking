import { Component, OnInit } from '@angular/core';
import { Course } from '../../shared/course';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from 'src/app/shared/item/item.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  course:Course;

  constructor(private route:ActivatedRoute,
              private itemsService:ItemService,
              private router:Router) { }

  ngOnInit() {
    this.course = new Course(null,null,null,'',null,null,'',null,null,null);
    const id = this.route.snapshot.params['id'];
    this.itemsService.getSingleItemFromDB(+id).then(
      (course:Course) => {
        this.course = course;
      }
    );
  }

  onBack(){
    this.router.navigate(['/items']);
  }
}
