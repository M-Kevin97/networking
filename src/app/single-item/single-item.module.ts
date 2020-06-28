import { SingleEventComponent } from './pages/single-event/single-event.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleItemComponent } from './single-item.component';
import { SingleCourseComponent } from './pages/single-course/single-course.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SingleItemComponent,
    SingleCourseComponent,
    SingleEventComponent
  ]
})
export class SingleItemModule { }
