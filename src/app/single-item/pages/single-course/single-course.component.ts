import { EditDescriptionItemComponent } from './../../components/edit-description-item/edit-description-item.component';
import { HeadCourseEditFormComponent } from './../../components/head-course-edit-form/head-course-edit-form.component';
import { AuthService } from './../../../core/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from 'src/app/shared/item/item.service';
import { Course } from 'src/app/shared/item/course';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-single-course',
  templateUrl: './single-course.component.html',
  styleUrls: ['./single-course.component.css']
})
export class SingleCourseComponent implements OnInit {

  course:Course;
  hasCourse:boolean = true;
  closeResult: string;


  constructor(private route:ActivatedRoute,
              private itemService:ItemService,
              private authService:AuthService,
              private router:Router,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.course = new Course(null,null,null,null,null,null,null,null,null,null,null,null);

    const id = this.route.snapshot.params['id'];
    this.itemService.getSingleCourseFromDBWithId(id).then(
      (course:Course) => {
        if(course!==null && course!==undefined) {
          this.hasCourse = true;
          this.course = Course.courseFromJson(course);
          this.course.id = id;
          console.log(this.course);
          console.log(course['authors']);
          console.log(this.course.authors);
        }
        else {
          this.hasCourse = false;
        }
      }
    ).catch(
      () => {
        this.hasCourse = false;
      }
    );
  }

  isUserMyAuthor(){
    if(this.authService.isAuth){

      this.course.authors.forEach((author)=>{

        if(author.id === this.authService.authUser.id){
            return true;
        }
      });
    }
    return false;
  }

  openHeadItemModal(){

    const modalRef = this.modalService.open(HeadCourseEditFormComponent, { scrollable: true });
    modalRef.componentInstance.item = this.course;

    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
        console.log(this.course);
        //this.course = result;

        if(this.course.catchPhrase === undefined)
        {
          this.course.catchPhrase = null;
        }
        if(this.course.title === undefined)
        {
          this.course.title = null;
        }
        if(this.course.price === undefined)
        {
          this.course.price = null;
        }
        if(this.course.imageLink === undefined)
        {
          this.course.imageLink = null;
        }
        if(this.course.videoLink === undefined)
        {
          this.course.videoLink = null;
        }

        this.itemService.updateCoursePrimaryInfoInDB(this.course);

      }
    }).catch((error) => {
      console.log(error);
    });
  }

  openDescriptionItemModal(){

    const modalRef = this.modalService.open(EditDescriptionItemComponent);
    modalRef.componentInstance.item = this.course;

    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
        console.log(this.course);
        //this.course = result;

        if(this.course.description === undefined)
        {
          this.course.description = null;
        }
  
        this.itemService.updateCourseDescriptionInDB(this.course);

      }
    }).catch((error) => {
      console.log(error);
    });
  }

  onBack(){
    this.router.navigate(['/items']);
  }
}
