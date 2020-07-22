import { UserHomeComponent } from './components/user-home/user-home.component';
import { SingleUserComponent } from './pages/single-user/single-user.component';
import { ItemCardComponent } from './../shared/components/item-card/item-card.component';
import { RatingComponent } from './../shared/rating/rating/rating.component';
import { EditSkillsItemComponent } from './components/edit-skills-item/edit-skills-item.component';
import { ItemsCarouselComponent } from './../shared/components/items-carousel/items-carousel.component';
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
import { ItemListComponent } from '../shared/components/item-list/item-list.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    SingleItemRoutes
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
    DescriptionSectionComponent,
    ItemsCarouselComponent,
    RatingComponent,
    ItemCardComponent,
    ItemsCarouselComponent,
    UserHomeComponent,
    ItemListComponent
  ]
})
export class SingleItemModule { }
