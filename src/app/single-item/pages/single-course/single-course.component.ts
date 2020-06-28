import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from 'src/app/shared/item/item.service';
import { Course } from 'src/app/shared/item/course';

@Component({
  selector: 'app-single-course',
  templateUrl: './single-course.component.html',
  styleUrls: ['./single-course.component.css']
})
export class SingleCourseComponent implements OnInit {


  course:Course;

  constructor(private route:ActivatedRoute,
              private itemService:ItemService,
              private router:Router) { }

  ngOnInit() {
    this.course = new Course(null,null,null,null,null,null,null,null,null,null);

    const id = this.route.snapshot.params['id'];
    this.itemService.getSingleCourseFromDBWithId(id).then(
      (course:Course) => {
        this.course = Course.courseFromJson(course);
        this.course.id = id;
        console.log(this.course);
        console.log(course['authors']);
        console.log(this.course.authors);
      }
    );
  }

  onBack(){
    this.router.navigate(['/items']);
  }
}
