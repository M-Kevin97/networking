import { EditDescriptionItemComponent } from './components/edit-description-item/edit-description-item.component';
import { ButtonEditComponent } from './components/button-edit/button-edit.component';
import { SharedModule } from './../shared/shared.module';
import { HeadCourseEditFormComponent } from './components/head-course-edit-form/head-course-edit-form.component';
import { SingleEventComponent } from './pages/single-event/single-event.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleItemComponent } from './single-item.component';
import { SingleCourseComponent } from './pages/single-course/single-course.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    SingleItemComponent,
    SingleCourseComponent,
    SingleEventComponent,
    HeadCourseEditFormComponent,
    EditDescriptionItemComponent,
    ButtonEditComponent,
  ]
})
export class SingleItemModule { }
