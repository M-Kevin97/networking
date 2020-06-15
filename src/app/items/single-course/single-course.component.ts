import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService } from 'src/app/services/items.service';
import { Course } from 'src/app/models/course';

@Component({
  selector: 'app-single-course',
  templateUrl: './single-course.component.html',
  styleUrls: ['./single-course.component.css']
})
export class SingleCourseComponent implements OnInit {
  
  course:Course;

  constructor(private route:ActivatedRoute,
              private itemsService:ItemsService,
              private router:Router) { }

  ngOnInit() {
    this.course = new Course(null,null,null,'',null,null,'',null);
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
