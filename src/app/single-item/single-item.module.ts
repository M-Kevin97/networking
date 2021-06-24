import { EditSupportComponent } from './components/edit-support/edit-support.component';
import { EditPrerequisitesComponent } from './components/edit-prerequisites/edit-prerequisites.component';
import { EditTagsComponent } from './components/edit-tags/edit-tags.component';
import { EditMediaComponent } from './components/edit-media/edit-media.component';
import { EditGeneralComponent } from './components/edit-general/edit-general.component';
import { EditCourseComponent } from './components/edit-course/edit-course.component';
import { CompletionBoardComponent } from './components/completion-board/completion-board.component';
import { CourseContentComponent } from './components/course-content/course-content.component';
import { EditCourseContentComponent } from './components/edit-course-content/edit-course-content.component';
import { DescriptionSectionComponent } from './components/description-section/description-section.component';
import { CardImagePriceItemComponent } from './components/card-image-price-item/card-image-price-item.component';
import { EditDescriptionItemComponent } from './components/edit-description-item/edit-description-item.component';
import { ButtonEditComponent } from './components/button-edit/button-edit.component';
import { SharedModule } from './../shared/shared.module';
import { SingleEventComponent } from './pages/single-event/single-event.component';
import { NgModule } from '@angular/core';
import { SingleItemComponent } from './single-item.component';
import { SingleCourseComponent } from './pages/single-course/single-course.component';
import { CardAuthorComponent } from './components/card-author/card-author.component';
import { RouterModule } from '@angular/router';
import { EditHeadItemComponent } from './components/edit-head-item/edit-head-item.component';
import { EditHeadUserComponent } from './components/edit-head-user/edit-head-user.component';
import { SingleItemRoutes } from './single-item.routing';
import { GlobalRatingComponent } from './components/global-rating/global-rating.component';
import { CreateRatingComponent } from './components/createRating/createRating.component';
import { EditSkillsItemComponent } from './components/edit-skills-item/edit-skills-item.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { SingleUserComponent } from './pages/single-user/single-user.component';
import { CountdownModule } from 'ngx-countdown';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    SingleItemRoutes,
  ],
  declarations: [
    SingleItemComponent,
    SingleCourseComponent,
    SingleEventComponent,
    SingleUserComponent,
    EditHeadItemComponent,
    EditDescriptionItemComponent,
    EditSkillsItemComponent,
    EditHeadUserComponent,
    ButtonEditComponent,
    CardImagePriceItemComponent,
    CardAuthorComponent,
    UserHomeComponent,
    CreateRatingComponent,
    GlobalRatingComponent,
    DescriptionSectionComponent,
    EditCourseContentComponent,
    CourseContentComponent,
    CompletionBoardComponent,
    EditCourseComponent,
    EditGeneralComponent,
    EditMediaComponent,
    EditTagsComponent,
    EditPrerequisitesComponent,
    EditSupportComponent
  ]
})
export class SingleItemModule { }
