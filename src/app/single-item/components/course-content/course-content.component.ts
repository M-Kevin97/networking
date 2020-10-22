import { Component, Input, OnInit } from '@angular/core';
import { Module } from 'src/app/shared/model/item/module';


@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.scss']
})
export class CourseContentComponent implements OnInit {

  @Input() courseContent:Module[] = [];

  constructor() { }

  ngOnInit() {
  }

}
